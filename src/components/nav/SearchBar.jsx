import Link from "@/components/CustomLink"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { useI18n } from "@/locales"
import axios from "axios"
import { useEffect, useState } from "react"

const SearchBar = ({ open, onOpenChange, connected }) => {
  const t = useI18n()
  const [products, setProducts] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    ; (async () => {
      const { data } = await axios("/api/products")

      setProducts(data)
    })()
  }, [])

  // Reset selected index when dialog opens/closes
  useEffect(() => {
    if (open) {
      setSelectedIndex(0)
      setInputValue("")
    }
  }, [open])

  // Calculate total items for keyboard navigation
  const menuItems = connected ? [...products, null, "profile", "cart"] : products
  const totalItems = menuItems.length
  const handleKeyDown = (e) => {
    // Handle arrow navigation
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prevIndex) => (prevIndex + 1) % totalItems)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems)
    } else if (e.key === "Enter") {
      e.preventDefault()

      // Handle Enter key - navigate to the selected item
      if (selectedIndex < products.length) {
        window.location.href = `/product/${products[selectedIndex].title}`
      } else if (connected && selectedIndex === products.length + 1) {
        window.location.href = "/account"
      } else if (connected && selectedIndex === products.length + 2) {
        window.location.href = "/cart"
      }
    } else if (e.key === "Escape") {
      onOpenChange(false)
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Type a command or search..."
        value={inputValue}
        onValueChange={setInputValue}
        onKeyDown={handleKeyDown}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading={t("Products")}>
          {products.map((product, index) => (
            <Link key={product.id} href={`/product/${product.title}`}>
              <CommandItem
                onSelect={() => {
                  onOpenChange(false)
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={index === selectedIndex ? "bg-accent text-accent-foreground" : ""}
              >
                {product.title}
              </CommandItem>
            </Link>
          ))}
        </CommandGroup>
        <CommandSeparator />
        {connected && (
          <CommandGroup heading={t("Menu")}>
            <Link href="/profile">
              <CommandItem
                onSelect={() => {
                  onOpenChange(false)
                }}
                onMouseEnter={() => setSelectedIndex(products.length + 1)}
                className={products.length + 1 === selectedIndex ? "bg-accent text-accent-foreground" : ""}
              >
                {t("Profile")}
              </CommandItem>
            </Link>
            <Link href="/cart">
              <CommandItem
                onSelect={() => {
                  onOpenChange(false)
                }}
                onMouseEnter={() => setSelectedIndex(products.length + 2)}
                className={products.length + 2 === selectedIndex ? "bg-accent text-accent-foreground" : ""}
              >
                {t("Cart")}
              </CommandItem>
            </Link>
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}

export default SearchBar