import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import Link from "next/link"
import { useI18n } from "@/locales"
import axios from "axios"
import { useEffect, useState } from "react"

const SearchBar = ({ open, onOpenChange, connected }) => {
  const t = useI18n()
  const [products, setProducts] = useState([])

  useEffect(() => {
    ;(async () => {
      const { data } = await axios("/api/products")

      setProducts(data)
    })()
  }, [])

  console.log(products)

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading={t("Products")}>
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.title}`}>
              <CommandItem>{product.title}</CommandItem>
            </Link>
          ))}
        </CommandGroup>
        <CommandSeparator />
        {connected && (
          <CommandGroup heading={t("Menu")}>
            <Link href="/account">
              <CommandItem>{t("Profile")}</CommandItem>
            </Link>
            <Link href="/cart">
              <CommandItem>{t("Cart")}</CommandItem>
            </Link>
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}

export default SearchBar
