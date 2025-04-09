import AddCategorySheet from "@/components/backoffice/addCategorySheet"
import BackofficeLayout from "@/components/layouts/BackofficeLayout"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useI18n, useScopedI18n } from "@/locales"
import authProps from "@/serverSideProps/authProps"
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import clsx from "clsx"
import { GripVertical } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const SortableTableRow = ({ category, t, categoriesT, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: category.id,
    data: { index, category }
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
    position: "relative",
    backgroundColor: isDragging ? "#f0f0f0" : undefined,
  }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={clsx(!isDragging && index % 2 && "bg-gray-50 hover:bg-white")}
    >
      <TableCell className="w-10">
        <div className="flex items-center">
          <div
            {...attributes}
            {...listeners}
            className="mr-2 text-gray-400 cursor-grab touch-manipulation"
          >
            <GripVertical className="w-4 h-4" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        {categoriesT(category.id)}
      </TableCell>
      <TableCell>
        {categoriesT(category.title)}
      </TableCell>
      <TableCell>
        <HoverCard>
          <HoverCardTrigger className="text-ellipsis flex flex-col whitespace-nowrap max-w-xs overflow-hidden">
            {categoriesT(category.description)}
          </HoverCardTrigger>
          <HoverCardContent className="w-96">
            <h5 className="font-bold mb-2">
              {t("Description")}
            </h5>
            <p className="text-sm mb-2">
              {categoriesT(category.description)}
            </p>
          </HoverCardContent>
        </HoverCard>
      </TableCell>
      <TableCell>
        {category.order}
      </TableCell>
      <TableCell>
        {/* Actions */}
      </TableCell>
    </TableRow>
  )
}
const Categories = () => {
  const t = useI18n()
  const { toast } = useToast()
  const categoriesT = useScopedI18n("categories")
  const queryClient = useQueryClient()
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => axios(`/api/categories`),
    refetchInterval: 1000 * 20
  })
  const [orderedCategories, setOrderedCategories] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [renderKey, setRenderKey] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const prevOrderedRef = useRef([])
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )


  useEffect(() => {
    if (categories && categories.data) {
      if (orderedCategories.length === 0 || !hasChanges) {
        const sortedCategories = [...categories.data].sort((a, b) => b.order - a.order)
        setOrderedCategories(sortedCategories)
        prevOrderedRef.current = sortedCategories.map(cat => cat.id)
      }
    }
  }, [categories, hasChanges])


  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }
  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) { return }

    if (active.id !== over.id) {
      const oldIndex = orderedCategories.findIndex(cat => cat.id === active.id)
      const newIndex = orderedCategories.findIndex(cat => cat.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrderedCategories = [...orderedCategories]
        const [movedItem] = newOrderedCategories.splice(oldIndex, 1)


        newOrderedCategories.splice(newIndex, 0, movedItem)


        const currentIds = orderedCategories.map(cat => cat.id)
        const newIds = newOrderedCategories.map(cat => cat.id)
        const hasRealChange = currentIds.some((id, idx) => id !== newIds[idx])

        if (hasRealChange) {
          setOrderedCategories(newOrderedCategories)
          setHasChanges(true)
          setRenderKey(prev => prev + 1)
        }
      }
    }
  }
  const handleSubmitNewOrder = () => {
    if (isSubmitting) { return }


    setIsSubmitting(true)


    const newOrderIds = orderedCategories.map(cat => cat.id)
    const currentOrder = JSON.stringify(newOrderIds)
    const previousOrder = JSON.stringify(prevOrderedRef.current)

    if (currentOrder === previousOrder) {
      setIsSubmitting(false)
      setHasChanges(false)


      return
    }


    console.log("Nouvel ordre des catégories:", newOrderIds)


    axios.put("/api/categories?action=reorder", { categoryIds: newOrderIds })
      .then(() => {
        toast({
          title: t("Success"),
          description: t("Categories order has been updated"),
          variant: "default",
        })


        prevOrderedRef.current = [...newOrderIds]

        setHasChanges(false)
        queryClient.invalidateQueries(["categories"])
      })
      .catch(error => {
        console.error("Error saving new order:", error)
        toast({
          title: t("Error"),
          description: t("Failed to update categories order"),
          variant: "destructive",
        })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }


  useEffect(() => {
    if (hasChanges && !isSubmitting) {
      handleSubmitNewOrder()
    }
  }, [hasChanges])


  const activeCategory = activeId ? orderedCategories.find(cat => cat.id === activeId) : null

  return (
    <BackofficeLayout>
      <div className="flex-1 flex flex-col h-full relative">
        <div className="flex flex-col items-start gap-5 m-4 py-8 px-4">
          <h1 className="text-3xl font-black">{t("Categories")}</h1>
          <div className="text-lg font-bold flex gap-4 w-full justify-between">
            <AddCategorySheet categories={categories?.data} queryClient={queryClient} />
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <svg
              className="animate-spin h-8 w-8 text-purple-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="ml-3 text-gray-600">{t("Loading files...")}</span>
          </div>
        )}

        {orderedCategories && orderedCategories.length > 0 ? (
          <div className="flex-1 p-8">
            <div className="w-full h-full p-4 border rounded-md">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <Table key={renderKey}>
                  <TableHeader>
                    <TableRow className="h-fit">
                      <TableHead></TableHead>
                      <TableHead className="font-bold capitalize">
                        {t("id")}
                      </TableHead>
                      <TableHead className="font-bold capitalize text-ellipsis whitespace-nowrap">
                        {t("title")}
                      </TableHead>
                      <TableHead className="font-bold capitalize text-ellipsis whitespace-nowrap">
                        {t("description")}
                      </TableHead>
                      <TableHead className="font-bold capitalize text-ellipsis whitespace-nowrap">
                        {t("order")}
                      </TableHead>
                      <TableHead className="font-bold capitalize text-ellipsis whitespace-nowrap">
                        {t("actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="w-full overflow-y-scroll">
                    <SortableContext
                      items={orderedCategories.map(cat => cat.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {orderedCategories.map((category, index) => (
                        <SortableTableRow
                          key={`category-${category.id}-${renderKey}`}
                          category={category}
                          t={t}
                          categoriesT={categoriesT}
                          index={index}
                        />
                      ))}
                    </SortableContext>
                  </TableBody>
                </Table>

                <DragOverlay>
                  {activeId && activeCategory ? (
                    <TableRow className="bg-white shadow-lg border-2 border-purple-400">
                      <TableCell className="w-10">
                        <div className="flex items-center">
                          <GripVertical className="w-4 h-4 mr-2 text-gray-400" />
                        </div>
                      </TableCell>
                      <TableCell>
                        {categoriesT(activeCategory.id)}
                      </TableCell>
                      <TableCell>
                        {categoriesT(activeCategory.title)}
                      </TableCell>
                      <TableCell>
                        <div className="text-ellipsis whitespace-nowrap max-w-xs overflow-hidden">
                          {categoriesT(activeCategory.description)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {activeCategory.order}
                      </TableCell>
                      <TableCell>
                        {/* Actions */}
                      </TableCell>
                    </TableRow>
                  ) : null}
                </DragOverlay>
              </DndContext>

              {isSubmitting && (
                <div className="mt-4 text-sm text-gray-500 flex items-center">
                  <svg
                    className="animate-spin h-4 w-4 mr-2 text-purple-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t("Saving new order...")}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-xl font-bold">{t("No categories found")}</h2>
            <p className="text-gray-500">{t("Please add a categories")}</p>
          </div>
        )}
      </div>
    </BackofficeLayout>
  )
}

export default Categories

export const getServerSideProps = async (context) => {
  const { user } = await authProps(context)

  if (!user || !user.isAdmin) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user,
    },
  }
}