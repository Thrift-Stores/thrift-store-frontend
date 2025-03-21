"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"
import Link from "next/link"

export default function Dashboard() {
  const router = useRouter()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Link href='/'>← Home</Link>

      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}!</h2>
        <p className="">You are now logged in to your account.</p>

        <div className="mt-4">
          <h3 className="font-medium mb-2">Your Account Details:</h3>
          <ul className="space-y-2">
            <li>
              <strong>Name:</strong> {user?.name}
            </li>
            <li>
              <strong>Email:</strong> {user?.email}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

