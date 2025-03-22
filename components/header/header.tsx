"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, ShoppingBag, Package, LayoutDashboard } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { logout } from "@/store/auth-slice"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleLogout = () => {
    dispatch(logout())
    router.push("/")
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.name) return "U"
    return user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/assets/Store Logo.png"
              alt="Thrift Store Logo"
              width={250}
              height={150}
              className="rounded"
              priority
            />
          </Link>
        </div>
        <nav
          className={`${isMobileMenuOpen
              ? "absolute top-full left-0 right-0 bg-white border-b shadow-lg md:shadow-none md:border-none md:bg-transparent md:relative md:top-0"
              : "hidden"
            } md:flex items-center gap-6`}
        >
          <div className="flex flex-col md:flex-row items-center gap-6 p-4 md:p-0">
            <Link
              href="/"
              className="text-sm font-medium hover:text-blue-600 transition-colors w-full md:w-auto text-center"
            >
              Home
            </Link>
            <Link
              href="/browse"
              className="text-sm font-medium hover:text-blue-600 transition-colors w-full md:w-auto text-center"
            >
              Browse
            </Link>
            <Link
              href="/sell"
              className="text-sm font-medium hover:text-blue-600 transition-colors w-full md:w-auto text-center"
            >
              Sell
            </Link>
            <Link
              href="/bids"
              className="text-sm font-medium hover:text-blue-600 transition-colors w-full md:w-auto text-center"
            >
              Bids
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-blue-600 transition-colors w-full md:w-auto text-center"
            >
              About
            </Link>

            {/* Mobile auth buttons or user menu */}
            <div className="flex flex-col md:hidden w-full gap-2 mt-4">
              {isAuthenticated ? (
                <div className="flex flex-col gap-2 w-full">
                  <Link href="/dashboard" className="w-full">
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/my-orders" className="w-full">
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      My Orders
                    </Button>
                  </Link>
                  <Link href="/my-products" className="w-full">
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      My Products
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full flex items-center gap-2 text-red-500"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.dispatchEvent(new CustomEvent("open-login"))}
                  >
                    Log In
                  </Button>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.dispatchEvent(new CustomEvent("open-signup"))}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </nav>
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <div className="hidden md:block">
              <h3 className="text-lg font-semibold text-gray-700">{user?.username || user?.email || "User"}</h3>
            </div>
          )}
          {/* Desktop auth buttons or user menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <h3 className="text-2xl font-bold">{user?.username || user?.email || "User"}!</h3>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-orders" className="cursor-pointer flex items-center">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    <span>My Orders</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-products" className="cursor-pointer flex items-center">
                    <Package className="mr-2 h-4 w-4" />
                    <span>My Products</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="outline"
                className="hidden md:flex"
                onClick={() => window.dispatchEvent(new CustomEvent("open-login"))}
              >
                Log In
              </Button>
              <Button
                className="hidden md:flex bg-blue-600 hover:bg-blue-700"
                onClick={() => window.dispatchEvent(new CustomEvent("open-signup"))}
              >
                Sign Up
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header