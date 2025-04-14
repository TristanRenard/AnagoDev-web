import { useI18n } from "@/locales"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { AlertTriangle, Clock, ExternalLink, MessageSquare, MessagesSquare, PlusCircle, Send, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"

const api = {
  checkAuth: () => axios.get("/api/connection").then(res => res.data),
  getProducts: () => axios.get("/api/products").then(res => res.data),
  getConversations: () => axios.get("/api/chat").then(res => res.data),
  sendMessage: (data) => axios.post("/api/chat", data).then(res => res.data)
}
// eslint-disable-next-line max-lines-per-function
const ChatBot = () => {
  const queryClient = useQueryClient()
  const [chatIsOpen, setChatIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState("")
  const [conversationId, setConversationId] = useState(null)
  const [conversationTitle, setConversationTitle] = useState("")
  const [conversationStatus, setConversationStatus] = useState("active")
  const messagesContainerRef = useRef(null)
  const [showConversationsList, setShowConversationsList] = useState(false)
  const t = useI18n()
  const router = useRouter()
  // Queries
  const { data: authData } = useQuery({
    queryKey: ["auth"],
    queryFn: api.checkAuth,
    staleTime: 5 * 60 * 1000,
    retry: false
  })
  const isConnected = authData?.loggedIn || false
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: api.getProducts,
    enabled: isConnected,
    staleTime: 5 * 60 * 1000,
  })
  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: api.getConversations,
    enabled: isConnected,
    staleTime: 1 * 60 * 1000,
  })
  // Mutations
  const messageMutation = useMutation({
    mutationFn: api.sendMessage,
    onSuccess: (data) => {
      // Update conversations list
      queryClient.invalidateQueries({ queryKey: ["conversations"] })

      const { assistantResponse, conversation } = data
      // eslint-disable-next-line init-declarations
      let parsedResponse

      // Vérifier si assistantResponse est déjà un objet
      if (typeof assistantResponse === "object" && assistantResponse !== null) {
        parsedResponse = assistantResponse
      } else {
        try {
          parsedResponse = JSON.parse(assistantResponse)
        } catch (error) {
          console.error("Error parsing JSON response:", error)
          // Fallback to raw response
          parsedResponse = {
            event: "message",
            message: assistantResponse
          }
        }
      }

      // Update conversation info
      setConversationId(conversation.id)
      setConversationTitle(conversation.title)
      setConversationStatus(conversation.status)

      // Process the response based on event type
      if (parsedResponse.event === "do") {
        // Log action for "do" events
        console.log("Action:", parsedResponse.action)

        if (parsedResponse.productList && parsedResponse.productList.length > 0) {
          switch (parsedResponse.action) {
            case "add to cart":
              Promise.all(parsedResponse.productList.map(async (product) => {
                const res = await axios.post("/api/cart", {
                  productId: product.id,
                  action: "add",
                  quantity: product.quantity || 1
                })


                return res.data
              }
              )).then((results) => {
                console.log("Products added to cart:", results)
                queryClient.invalidateQueries({ queryKey: ["cart"] })
              }
              ).catch((error) => {
                console.error("Error adding products to cart:", error)
                // Optionally, you can show an error toast notification here
              })

              break

            case "remove from cart":
              Promise.all(parsedResponse.productList.map(async (product) => {
                const res = await axios.post("/api/cart", {
                  productId: product.id,
                  action: "remove",
                  quantity: product.quantity || 1
                })


                return res.data
              }
              )).then((results) => {
                console.log("Products removed from cart:", results)
                queryClient.invalidateQueries({ queryKey: ["cart"] })
              }
              ).catch((error) => {
                console.error("Error removing products from cart:", error)
                // Optionally, you can show an error toast notification here
              })

              break

            default:
              console.log("Unknown action:", parsedResponse.action)

              break
          }


          // If the action is "go to page" and there's a page specified, redirect could be handled here
          if (parsedResponse.action === "go to page" && parsedResponse.page) {
            console.log("Redirection to:", parsedResponse.page)
            // Window.location.href = parsedResponse.page
            router.push(parsedResponse.page)
          }
        } else {
          switch (parsedResponse.action) {
            case "go to page":
              console.log("Redirection to:", parsedResponse.page)
              router.push(parsedResponse.page)

              break
          }
        }

        // Enrich product list with full product data if needed
        let enrichedProductList = parsedResponse.productList

        if (parsedResponse.productList && products.length > 0) {
          enrichedProductList = parsedResponse.productList.map(item => {
            // Try to find the full product data by ID
            const fullProduct = products.find(p => p.id === item.id)

            if (fullProduct) {
              return { ...item, title: fullProduct.title }
            }


            return item
          })
        }

        // Add assistant response to chat
        setMessages(prev => [...prev, {
          role: "assistant",
          content: parsedResponse.message,
          event: parsedResponse.event,
          productList: enrichedProductList || parsedResponse.productList,
          action: parsedResponse.action,
          page: parsedResponse.page
        }])
      } else if (parsedResponse.event === "message") {
        // Gestion des événements de type "message"
        setMessages(prev => [...prev, {
          role: "assistant",
          content: parsedResponse.message
        }])
      } else if (parsedResponse.event === "suggest") {
        // Gestion des événements de type "suggest"
        // Enrich product list with full product data if needed
        let enrichedProductList = parsedResponse.productList

        if (parsedResponse.productList && products.length > 0) {
          enrichedProductList = parsedResponse.productList.map(item => {
            // Try to find the full product data by ID
            const fullProduct = products.find(p => p.id === item.id)

            if (fullProduct) {
              return { ...item, title: fullProduct.title }
            }

            return item
          })
        }

        setMessages(prev => [...prev, {
          role: "assistant",
          content: parsedResponse.message,
          event: parsedResponse.event,
          productList: enrichedProductList || parsedResponse.productList
        }])
      }
    },
    onError: (error) => {
      console.error("Error sending message:", error)
      // Optionally, you can show a toast notification here
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: t("Sorry, I couldn't process your request. Please try again later.")
        }
      ])
    }
  })

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  // Initialize chat with a welcome message for new conversations
  useEffect(() => {
    if (chatIsOpen && messages.length === 0 && !conversationId) {
      setMessages([
        {
          role: "assistant",
          content: t("Hello! How can I help you with our cybersecurity solutions today?")
        }
      ])
    }
  }, [chatIsOpen, messages.length, conversationId, t])

  const startNewConversation = () => {
    setConversationId(null)
    setConversationTitle("")
    setConversationStatus("active")
    setMessages([
      {
        role: "assistant",
        content: t("Hello! How can I help you with our cybersecurity solutions today?")
      }
    ])
    setShowConversationsList(false)
  }
  // eslint-disable-next-line require-await
  const loadConversation = async (conversation) => {
    try {
      setConversationId(conversation.id)
      setConversationTitle(conversation.title)
      setConversationStatus(conversation.status)

      // Format the messages from the conversation to match our expected format
      const formattedMessages = conversation.messages.map(msg => {
        if (msg.role === "assistant") {
          try {
            // Try to parse the assistant's message if it's JSON
            const parsedContent = typeof msg.content[0].text === "string"
              ? JSON.parse(msg.content[0].text)
              : msg.content[0].text

            return {
              role: "assistant",
              content: parsedContent.message,
              event: parsedContent.event,
              productList: parsedContent.productList,
              action: parsedContent.action,
              page: parsedContent.page
            }
          } catch (error) {
            // If parsing fails, just use the text content
            return {
              role: "assistant",
              content: msg.content[0].text
            }
          }
        } else {
          // User message
          return {
            role: "user",
            content: msg.content[0].text
          }
        }
      })

      setMessages(formattedMessages)
      setShowConversationsList(false)
    } catch (error) {
      console.error("Error loading conversation:", error)
    }
  }
  // eslint-disable-next-line require-await
  const sendMessage = async () => {
    if (!inputText.trim() || messageMutation.isPending) { return }

    // Add user message to the chat
    const userMessage = {
      role: "user",
      content: inputText
    }

    setMessages(prev => [...prev, userMessage])
    setInputText("")

    // Send message to the API using mutation
    messageMutation.mutate({
      id: conversationId,
      message: { text: inputText }
    })
  }
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }
  // Component to render product cards for suggestions
  const ProductSuggestions = ({ productList }) => {
    if (!productList || productList.length === 0) { return null }

    return (
      <div className="flex flex-col gap-2 mt-2">
        <p className="font-medium">{t("Suggested products:")}</p>
        <div className="grid grid-cols-1 gap-2">
          {productList.map((productItem, index) => {
            // Get full product data if available
            const fullProduct = products.find(p => p.id === productItem.id)
            const productTitle = fullProduct ? fullProduct.title : (productItem.title || `Product ${productItem.id}`)

            return (
              <Link
                href={`/product/${encodeURIComponent(productTitle)}`}
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-2 hover:bg-gray-50 transition-colors flex justify-between items-center"
              >
                <div>
                  <span className="font-medium">
                    {productTitle}
                  </span>
                  {productItem.quantity && (
                    <span className="ml-2 text-sm text-gray-600">× {productItem.quantity}</span>
                  )}
                </div>
                <ExternalLink className="h-4 w-4 text-gray-500" />
              </Link>
            )
          })}
        </div>
      </div>
    )
  }
  // Component to render conversation history
  const ConversationsList = () => {
    if (conversations.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          {t("No conversations yet")}
        </div>
      )
    }

    // Function to get status icon based on conversation status
    const getStatusIcon = (status) => {
      switch (status) {
        case "needs_human":
          return <AlertTriangle className="h-4 w-4 text-amber-500" />

        case "active":
          return <MessageSquare className="h-4 w-4 text-green-500" />

        default:
          return <Clock className="h-4 w-4 text-gray-500" />
      }
    }
    // Format date for display
    const formatDate = (dateString) => {
      const date = new Date(dateString)


      return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(date)
    }

    return (
      <div className="flex flex-col gap-2 p-4 max-h-[400px] overflow-y-auto">
        <button
          className="flex items-center gap-2 p-3 bg-[#420A8F] text-white rounded-lg hover:bg-[#240198] transition-colors"
          onClick={startNewConversation}
        >
          <PlusCircle className="h-5 w-5" />
          {t("New Conversation")}
        </button>

        <div className="pt-2">
          <h3 className="text-sm font-medium text-gray-500 mb-2">{t("Recent Conversations")}</h3>
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              className={`w-full text-left p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-start gap-2
                ${conversationId === conversation.id ? "bg-gray-100" : ""}`}
              onClick={() => loadConversation(conversation)}
            >
              {getStatusIcon(conversation.status)}
              <div className="flex-1 overflow-hidden">
                <div className="font-medium truncate">{conversation.title}</div>
                <div className="text-xs text-gray-500">{formatDate(conversation.created_at)}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }
  // Render message bubble based on role and event type
  const renderMessage = (message, index) => {
    // User message
    if (message.role === "user") {
      return (
        <div key={index} className="bg-[#420A8F] text-white p-2 rounded-lg w-fit max-w-[70%] self-end">
          <p>{message.content}</p>
        </div>
      )
    }

    // Assistant message
    return (
      <div key={index} className="flex flex-col self-start max-w-[80%]">
        <div className="bg-gray-200 p-2 rounded-lg w-fit">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>

        {/* Show product suggestions for "suggest" events */}
        {message.event === "suggest" && message.productList && (
          <ProductSuggestions productList={message.productList} />
        )}
      </div>
    )
  }
  const renderChatHeader = () => (
    <header className="w-full bg-gradient-to-r from-[#420A8F] to-[#240198] flex justify-between items-center">
      <div className="flex items-center p-4">
        <button
          className="p-2 text-white hover:bg-[#240198] rounded-lg transition-colors"
          onClick={() => setShowConversationsList(!showConversationsList)}
        >
          <MessageSquare className="h-5 w-5" />
        </button>
        <p className="text-white px-2 font-bold text-lg truncate max-w-[150px]">
          {conversationTitle || "Chat bot"}
        </p>
        {conversationStatus === "needs_human" && (
          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
            {t("Needs human")}
          </span>
        )}
      </div>
      <button className="flex p-4 gap-2" onClick={() => setChatIsOpen(false)}>
        <X className="h-8 w-8 bg-white p-2 rounded-full" />
      </button>
    </header>
  )

  return (
    <div className="bottom-4 left-4 z-50 fixed flex rounded-xl gap-2 border bg-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden">
      {!chatIsOpen ? (
        <button className="flex p-4 gap-2" onClick={() => setChatIsOpen(true)}>
          ChatBot <MessagesSquare className="h-6 w-6" />
        </button>
      ) : (
        <div className="flex w-80 flex-col">
          {renderChatHeader()}

          {showConversationsList ? (
            <ConversationsList />
          ) : (
            <section
              ref={messagesContainerRef}
              className="h-[400px] flex flex-col gap-2 p-4 overflow-y-auto"
            >
              <div className="flex flex-col gap-2">
                {messages.map((message, index) => renderMessage(message, index))}

                {messageMutation.isPending && (
                  <div className="bg-gray-200 p-2 rounded-lg w-fit max-w-[70%] self-start">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {!showConversationsList && (
            <footer className="w-full bg-gradient-to-r from-[#420A8F] to-[#240198] p-4 flex justify-between items-center">
              <input
                type="text"
                className="w-full p-2 rounded-lg"
                placeholder={t("Type your message here")}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={messageMutation.isPending}
              />
              <button
                className={`bg-white p-2 rounded-full ml-2 ${messageMutation.isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={sendMessage}
                disabled={messageMutation.isPending || !inputText.trim()}
              >
                <Send className="h-8 w-8 text-[#420A8F] p-2" />
              </button>
            </footer>
          )}
        </div>
      )}
    </div>
  )
}

export default ChatBot