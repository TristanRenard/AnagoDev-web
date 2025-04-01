/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import useNavBar from "@/hooks/useNavBar"
import { useI18n } from "@/locales"
import axios from "axios"
import clsx from "clsx"
import { Menu, ShoppingBasket, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const NavBar = () => {
  const t = useI18n()
  const [userId, setUserId] = useState(null)
  const { isNavBarOpen, toggleNavBar } = useNavBar()
  const [connected, setConnected] = useState(false)
  const isLogged = async () => {
    const res = await axios("/api/connection")
    const { loggedIn } = res.data

    setConnected(loggedIn)
  }
  const getUserId = async () => {
    const res = await axios("/api/me")
    setUserId(res.data.user.id)
  }

  useEffect(() => {
    isLogged()
  }, [])

  useEffect(() => {
    if (connected) {
      getUserId()
    }
  }, [connected])

  return (
    <>
      <nav className="hidden md:flex text-white font-black text-xl justify-between bg-gradient-to-r from-[#420A8F] to-[#240198] p-4">
        <Link href="/">
          <Image
            className="h-12 w-auto hidden lg:block "
            src="/logo.png"
            alt="logo"
            height={358}
            width={1080}
          />
          <Image
            className="h-12 w-12 aspect-square lg:hidden block object-scale-down"
            src="/logo-r.png"
            alt="logo"
            height={358}
            width={1080}
          />
        </Link>
        <ul className="flex gap-8 md:gap-16">
          <li className="flex flex-col justify-center items-center">
            <Link href="#">{t("Our services")}</Link>
          </li>
          <li className="flex flex-col justify-center items-center">
            <Link href="#">{t("Case studies")}</Link>
          </li>
          <li className="flex flex-col justify-center items-center">
            <Link href="#">{t("Blog")}</Link>
          </li>
          <li className="flex flex-col justify-center items-center">
            <Link href="#">{t("About us")}</Link>
          </li>
        </ul>
        {!connected ? (
          <ul className="flex gap-4 md:gap-8">
            <li className="flex flex-col justify-center items-center">
              <Link href="/auth/login">{t("Login")}</Link>
            </li>
            <li className="flex flex-col justify-center items-center">
              <Link href="/auth/register">{t("Inscription")}</Link>
            </li>
          </ul>
        ) : (
          <ul className="flex gap-8">
            <li className="flex flex-col justify-center items-center">
              <Link href={`/account/${userId}`}>{t("My account")}</Link>
            </li>
            <li className="flex flex-col justify-center items-center">
              <Link href="/cart">
                <ShoppingBasket size={24} />
              </Link>
            </li>
            <li className="flex flex-col justify-center items-center">
              <Link href="/auth/logout">{t("Logout")}</Link>
            </li>
          </ul>
        )}
      </nav>
      <nav className="md:hidden flex text-white font-black text-xl flex-col bg-gradient-to-r from-[#420A8F] to-[#240198] p-4">
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
            {isNavBarOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        <ul
          className={clsx(
            "flex flex-col justify-around fixed top-0 left-0 gap-4 px-8 bg-gradient-to-r from-[#420A8F] to-[#240198] w-screen h-screen z-50 md:hidden",
            isNavBarOpen ? "flex" : "hidden",
          )}
        >
          <li>
            <button
              onClick={() => {
                if (isNavBarOpen) {
                  toggleNavBar()
                }
              }}
              className="flex flex-col justify-center items-center p-4 fixed right-2 top-3"
            >
              <X size={32} />
            </button>
          </li>
          <li className="flex flex-col justify-center items-center p-4">
            <Link
              onClick={() => {
                if (isNavBarOpen) {
                  toggleNavBar()
                }
              }}
              href="#"
            >
              {t("Our services")}
            </Link>
          </li>
          <li className="flex flex-col justify-center items-center">
            <Link
              onClick={() => {
                if (isNavBarOpen) {
                  toggleNavBar()
                }
              }}
              href="#"
            >
              {t("Case studies")}
            </Link>
          </li>
          <li className="flex flex-col justify-center items-center">
            <Link
              onClick={() => {
                if (isNavBarOpen) {
                  toggleNavBar()
                }
              }}
              href="#"
            >
              {t("Blog")}
            </Link>
          </li>
          <li className="flex flex-col justify-center items-center">
            <Link
              onClick={() => {
                if (isNavBarOpen) {
                  toggleNavBar()
                }
              }}
              href="#"
            >
              {t("About us")}
            </Link>
          </li>
          {!connected ? (
            <ul className="flex gap-4 md:gap-8 justify-around mb-24">
              <li className="flex flex-col justify-center items-center">
                <Link
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
            </ul>
          ) : (
            <ul className="flex gap-8 justify-around mb-24">
              <li className="flex flex-col justify-center items-center">
                <Link
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
                  <ShoppingBasket size={24} />
                </Link>
              </li>
              <li className="flex flex-col justify-center items-center">
                <Link
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
            </ul>
          )}
        </ul>
      </nav>
    </>
  )
}

export default NavBar
