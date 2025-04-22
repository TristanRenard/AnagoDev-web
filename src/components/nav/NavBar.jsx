/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import IconProfil from "@/components/nav/ProfilIcon"
import useNavBar from "@/hooks/useNavBar"
import { useI18n } from "@/locales"
import axios from "axios"
import clsx from "clsx"
import { Menu, Search, ShoppingBasket, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

import SearchBar from "./SearchBar"

const NavBar = () => {
  const t = useI18n()
  const [userId, setUserId] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const { isNavBarOpen, toggleNavBar } = useNavBar()
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false)
  const [connected, setConnected] = useState(false)
  const isLogged = async () => {
    const res = await axios("/api/connection")
    const { loggedIn } = res.data

    setConnected(loggedIn)
  }
  const getUserId = async () => {
    const res = await axios("/api/me")
    setUserId(res.data.user.id)
    setIsAdmin(res.data.user.role === "admin" || res.data.user.role === "superAdmin")
  }
  const handleKeyDown = (event) => {
    if (event.key === "k" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      setIsSearchBarOpen(true)
    }

    if (event.key === "Escape" && isSearchBarOpen) {
      setIsSearchBarOpen(false)
    }
  }

  useEffect(() => {
    isLogged()
    window.addEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (connected) {
      getUserId()
    }
  }, [connected])

  return (
    <>
      <nav className="hidden md:flex font-black text-xl p-4">
        <Link href="/">
          <Image
            className="h-12 w-auto mr-16 hover:cursor-pointer"
            src="/cyna_icone_purple.png"
            alt="logo"
            height={358}
            width={1080}
          />
        </Link>
        <ul className="flex">
          <li className="flex flex-col justify-center items-center mr-16">
            <Link href="/products">{t("Products")}</Link>
          </li>
          <li className="flex flex-col justify-center items-center mr-16">
            <Link href="/contact">{t("Contact")}</Link>
          </li>
          <li className="flex flex-col justify-center items-center mr-16">
            <button className="hover:cursor-pointer">
              <Search
                onClick={() => setIsSearchBarOpen(!isSearchBarOpen)}
                className="h-6 w-6"
              />
            </button>
            <SearchBar
              open={isSearchBarOpen}
              onOpenChange={setIsSearchBarOpen}
              connected={connected}
            />
          </li>
          {!connected ? (
            <>
              <li className="flex flex-col justify-center items-center mr-16">
                <Link href="/auth/login">{t("Login")}</Link>
              </li>
              <li className="flex flex-col justify-center items-center mr-16">
                <Link href="/auth/register">{t("Register")}</Link>
              </li>
            </>
          ) : (
            <>
              <li className="flex flex-col justify-center items-center mr-16">
                <Link href="/cart">
                  <ShoppingBasket className="h-8 w-8" />
                </Link>
              </li>
              <li className="flex flex-col justify-center items-center mr-16">
                <IconProfil isAdmin={isAdmin} />
              </li>
            </>
          )}
        </ul>
      </nav>
      <nav className="md:hidden flex font-black text-xl flex-col p-4">
        <div className="flex justify-between">
          <Link
            onClick={() => {
              if (isNavBarOpen) {
                toggleNavBar()
              }
            }}
            href="/"
          >
            <Image
              className="h-12 w-auto block "
              src="/logo-r.png"
              alt="logo"
              height={358}
              width={1080}
            />
          </Link>
          <button
            onClick={() => {
              toggleNavBar()
            }}
            className="flex flex-col justify-center items-center"
          >
            {isNavBarOpen ? <X /> : <Menu />}
          </button>
        </div>

        <ul
          className={clsx(
            "flex flex-col justify-around fixed top-0 left-0 gap-4 px-8 py-44 w-screen h-screen z-50 bg-white md:hidden",
            isNavBarOpen ? "flex" : "hidden",
          )}
        >
          <li className="w-full flex justify-center">
            <button className="hover:cursor-pointer">
              <Search
                onClick={() => setIsSearchBarOpen(!isSearchBarOpen)}
                className="h-8 w-8"
              />
            </button>
            <SearchBar
              open={isSearchBarOpen}
              onOpenChange={setIsSearchBarOpen}
              connected={connected}
            />
          </li>
          <li className="flex flex-col justify-center items-center p-4">
            <Link href="/products">{t("Products")}</Link>
          </li>
          <li className="flex flex-col justify-center items-center">
            <Link href="/contact">{t("Contact")}</Link>
          </li>
          {!connected ? (
            <>
              <li className="flex flex-col justify-center items-center">
                <Link
                  data-umami-event="Login"
                  data-umami-event-type="click"
                  data-umami-event-name="Login"
                  data-umami-event-value="Login"
                  onClick={() => {
                    if (isNavBarOpen) {
                      toggleNavBar()
                    }
                  }}
                  href="/auth/login"
                >
                  {t("Login")}
                </Link>
              </li>
              <li className="flex flex-col justify-center items-center">
                <Link
                  data-umami-event="Register"
                  data-umami-event-type="click"
                  data-umami-event-name="Register"
                  data-umami-event-value="Register"
                  onClick={() => {
                    if (isNavBarOpen) {
                      toggleNavBar()
                    }
                  }}
                  href="/auth/register"
                >
                  {t("Inscription")}
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="flex flex-col justify-center items-center">
                <Link
                  data-umami-event="Cart"
                  data-umami-event-type="click"
                  data-umami-event-name="Cart"
                  data-umami-event-value="Cart"
                  onClick={() => {
                    if (isNavBarOpen) {
                      toggleNavBar()
                    }
                  }}
                  href={`/account/${userId}`}
                >
                  {t("My account")}
                </Link>
              </li>
              <li className="flex flex-col justify-center items-center">
                <Link
                  onClick={() => {
                    if (isNavBarOpen) {
                      toggleNavBar()
                    }
                  }}
                  href="/cart"
                >
                  <ShoppingBasket />
                </Link>
              </li>
              <li className="flex flex-col justify-center items-center">
                <Link
                  data-umami-event="Logout"
                  data-umami-event-type="click"
                  data-umami-event-name="Logout"
                  data-umami-event-value="Logout"
                  onClick={() => {
                    if (isNavBarOpen) {
                      toggleNavBar()
                    }
                  }}
                  href="/auth/logout"
                >
                  {t("Logout")}
                </Link>
              </li>
            </>
          )}
          <li>
            <button
              onClick={() => {
                if (isNavBarOpen) {
                  toggleNavBar()
                }
              }}
              className="flex flex-col justify-center items-center p-4 fixed right-2 top-3"
            >
              <X />
            </button>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default NavBar
