"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import Image from "next/image"
import {
  Package,
  ShoppingCart,
  Heart,
  MessageCircle,
  Settings,
  LogOut,
  Plus,
  ChevronRight,
  BarChart3,
  Clock,
  DollarSign,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Footer from "@/components/footer/footer"
import Header from "@/components/header/header"
import { logout } from "@/store/auth-slice"

export default function Dashboard() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const handleLogout = () => {
    dispatch(logout())
    router.push("/")
  }

  // Mock data for the dashboard
  const mockListings = [
    {
      id: 1,
      title: "Calculus Textbook 3rd Edition",
      price: 450,
      image: "/placeholder.svg?height=80&width=80",
      status: "active",
      views: 24,
      category: "Books",
      date: "2 days ago",
    },
    {
      id: 2,
      title: "HP Laptop i5 8GB RAM",
      price: 22000,
      image: "/placeholder.svg?height=80&width=80",
      status: "pending",
      views: 0,
      category: "Electronics",
      date: "Just now",
    },
    {
      id: 3,
      title: "Study Desk Lamp",
      price: 750,
      image: "/placeholder.svg?height=80&width=80",
      status: "sold",
      views: 38,
      category: "Hostel",
      date: "1 week ago",
    },
  ]

  const mockBids = [
    {
      id: 1,
      title: "Mountain Bike",
      image: "/placeholder.svg?height=80&width=80",
      yourBid: 3200,
      currentBid: 3500,
      status: "outbid",
      endsIn: "6 hours",
    },
    {
      id: 2,
      title: "Scientific Calculator",
      image: "/placeholder.svg?height=80&width=80",
      yourBid: 800,
      currentBid: 800,
      status: "winning",
      endsIn: "2 days",
    },
  ]

  const mockFavorites = [
    {
      id: 1,
      title: "Dell Laptop i3",
      price: 18000,
      image: "/placeholder.svg?height=80&width=80",
      seller: "Ankit S.",
      date: "5 days ago",
    },
    {
      id: 2,
      title: "Physics Reference Books (Set of 3)",
      price: 1200,
      image: "/placeholder.svg?height=80&width=80",
      seller: "Priya M.",
      date: "1 day ago",
    },
  ]

  const mockMessages = [
    {
      id: 1,
      sender: "Rahul M.",
      message: "Is the laptop still available?",
      time: "2 hours ago",
      read: false,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      sender: "Ananya K.",
      message: "Can you meet tomorrow at the library?",
      time: "Yesterday",
      read: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const stats = [
    {
      title: "Active Listings",
      value: "2",
      icon: <Package className="h-5 w-5 text-blue-600" />,
      change: "+1 this week",
    },
    {
      title: "Items Sold",
      value: "5",
      icon: <ShoppingCart className="h-5 w-5 text-green-600" />,
      change: "+2 this month",
    },
    {
      title: "Active Bids",
      value: "3",
      icon: <BarChart3 className="h-5 w-5 text-orange-600" />,
      change: "1 winning",
    },
    {
      title: "Total Earnings",
      value: "₹4,250",
      icon: <DollarSign className="h-5 w-5 text-purple-600" />,
      change: "+₹750 this month",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      

      <div className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-64 flex-shrink-0">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
              <nav className="flex flex-col space-y-1">
                <Button
                  variant={activeTab === "overview" ? "default" : "ghost"}
                  className={`justify-start ${activeTab === "overview" ? "bg-blue-600 text-white" : ""}`}
                  onClick={() => setActiveTab("overview")}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Overview
                </Button>
                <Button
                  variant={activeTab === "listings" ? "default" : "ghost"}
                  className={`justify-start ${activeTab === "listings" ? "bg-blue-600 text-white" : ""}`}
                  onClick={() => setActiveTab("listings")}
                >
                  <Package className="mr-2 h-4 w-4" />
                  My Listings
                </Button>
                <Button
                  variant={activeTab === "bids" ? "default" : "ghost"}
                  className={`justify-start ${activeTab === "bids" ? "bg-blue-600 text-white" : ""}`}
                  onClick={() => setActiveTab("bids")}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  My Bids
                </Button>
                <Button
                  variant={activeTab === "favorites" ? "default" : "ghost"}
                  className={`justify-start ${activeTab === "favorites" ? "bg-blue-600 text-white" : ""}`}
                  onClick={() => setActiveTab("favorites")}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Favorites
                </Button>
                <Button
                  variant={activeTab === "messages" ? "default" : "ghost"}
                  className={`justify-start ${activeTab === "messages" ? "bg-blue-600 text-white" : ""}`}
                  onClick={() => setActiveTab("messages")}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Messages
                  <Badge className="ml-auto bg-red-500">2</Badge>
                </Button>
                <Button
                  variant={activeTab === "settings" ? "default" : "ghost"}
                  className={`justify-start ${activeTab === "settings" ? "bg-blue-600 text-white" : ""}`}
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </nav>
              <div className="pt-4 mt-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Welcome, {user?.username || user?.email || "User"}!</h1>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/sell")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Sell an Item
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                            {stat.icon}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>Recent Listings</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600"
                          onClick={() => setActiveTab("listings")}
                        >
                          View All
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockListings.slice(0, 2).map((listing) => (
                          <div key={listing.id} className="flex items-center gap-4">
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                              <Image
                                src={listing.image || "/placeholder.svg"}
                                alt={listing.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{listing.title}</h4>
                              <p className="text-sm text-muted-foreground">₹{listing.price}</p>
                              <div className="flex items-center mt-1">
                                <Badge
                                  className={`text-xs ${
                                    listing.status === "active"
                                      ? "bg-green-500"
                                      : listing.status === "pending"
                                        ? "bg-yellow-500"
                                        : "bg-blue-500"
                                  }`}
                                >
                                  {listing.status === "active"
                                    ? "Active"
                                    : listing.status === "pending"
                                      ? "Pending"
                                      : "Sold"}
                                </Badge>
                                <span className="text-xs text-muted-foreground ml-2">{listing.views} views</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>Active Bids</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600"
                          onClick={() => setActiveTab("bids")}
                        >
                          View All
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockBids.map((bid) => (
                          <div key={bid.id} className="flex items-center gap-4">
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                              <Image
                                src={bid.image || "/placeholder.svg"}
                                alt={bid.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{bid.title}</h4>
                              <div className="flex items-center gap-2">
                                <p className="text-sm">
                                  Your bid: <span className="font-medium">₹{bid.yourBid}</span>
                                </p>
                                <span className="text-xs text-muted-foreground">•</span>
                                <p className="text-sm">
                                  Current: <span className="font-medium">₹{bid.currentBid}</span>
                                </p>
                              </div>
                              <div className="flex items-center mt-1">
                                <Badge
                                  className={`text-xs ${bid.status === "winning" ? "bg-green-500" : "bg-red-500"}`}
                                >
                                  {bid.status === "winning" ? "Winning" : "Outbid"}
                                </Badge>
                                <span className="text-xs text-muted-foreground ml-2">Ends in {bid.endsIn}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>Recent Messages</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600"
                        onClick={() => setActiveTab("messages")}
                      >
                        View All
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockMessages.map((message) => (
                        <div key={message.id} className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={message.avatar} alt={message.sender} />
                            <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{message.sender}</h4>
                              <span className="text-xs text-muted-foreground">{message.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{message.message}</p>
                          </div>
                          {!message.read && <div className="h-2 w-2 rounded-full bg-blue-600"></div>}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Listings Tab */}
            {activeTab === "listings" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">My Listings</h1>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/sell")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Listing
                  </Button>
                </div>

                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="sold">Sold</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          {mockListings.map((listing) => (
                            <div
                              key={listing.id}
                              className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0"
                            >
                              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                                <Image
                                  src={listing.image || "/placeholder.svg"}
                                  alt={listing.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium">{listing.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {listing.category}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <span className="text-xs text-muted-foreground">{listing.date}</span>
                                </div>
                                <div className="flex items-center mt-2">
                                  <p className="font-semibold text-blue-600">₹{listing.price}</p>
                                  <span className="mx-2 text-muted-foreground">•</span>
                                  <Badge
                                    className={`text-xs ${
                                      listing.status === "active"
                                        ? "bg-green-500"
                                        : listing.status === "pending"
                                          ? "bg-yellow-500"
                                          : "bg-blue-500"
                                    }`}
                                  >
                                    {listing.status === "active"
                                      ? "Active"
                                      : listing.status === "pending"
                                        ? "Pending"
                                        : "Sold"}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground ml-2">{listing.views} views</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="active" className="mt-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          {mockListings
                            .filter((l) => l.status === "active")
                            .map((listing) => (
                              <div
                                key={listing.id}
                                className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0"
                              >
                                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                                  <Image
                                    src={listing.image || "/placeholder.svg"}
                                    alt={listing.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium">{listing.title}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {listing.category}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <span className="text-xs text-muted-foreground">{listing.date}</span>
                                  </div>
                                  <div className="flex items-center mt-2">
                                    <p className="font-semibold text-blue-600">₹{listing.price}</p>
                                    <span className="mx-2 text-muted-foreground">•</span>
                                    <Badge className="text-xs bg-green-500">Active</Badge>
                                    <span className="text-xs text-muted-foreground ml-2">{listing.views} views</span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Similar structure for other tabs */}
                </Tabs>
              </div>
            )}

            {/* Bids Tab */}
            {activeTab === "bids" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">My Bids</h1>

                <Tabs defaultValue="active">
                  <TabsList>
                    <TabsTrigger value="active">Active Bids</TabsTrigger>
                    <TabsTrigger value="won">Won</TabsTrigger>
                    <TabsTrigger value="lost">Lost</TabsTrigger>
                  </TabsList>

                  <TabsContent value="active" className="mt-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          {mockBids.map((bid) => (
                            <div key={bid.id} className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
                              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                                <Image
                                  src={bid.image || "/placeholder.svg"}
                                  alt={bid.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium">{bid.title}</h4>
                                <div className="flex items-center gap-4 mt-2">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Your Bid</p>
                                    <p className="font-semibold">₹{bid.yourBid}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Current Bid</p>
                                    <p className="font-semibold">₹{bid.currentBid}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Ends In</p>
                                    <p className="font-semibold">{bid.endsIn}</p>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <Badge className={`${bid.status === "winning" ? "bg-green-500" : "bg-red-500"}`}>
                                  {bid.status === "winning" ? "Winning" : "Outbid"}
                                </Badge>
                              </div>
                              <Button
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => router.push(`/product/${bid.id}`)}
                              >
                                Place New Bid
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Similar structure for other tabs */}
                </Tabs>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === "favorites" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Favorites</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockFavorites.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="relative h-48">
                        <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500"
                        >
                          <Heart className="h-5 w-5" fill="currentColor" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{item.title}</h3>
                          <span className="font-bold text-blue-600">₹{item.price}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Seller: {item.seller}</span>
                          <span className="text-xs text-muted-foreground">{item.date}</span>
                        </div>
                        <Button
                          className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                          onClick={() => router.push(`/product/${item.id}`)}
                        >
                          View Product
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === "messages" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Messages</h1>

                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {mockMessages.map((message) => (
                        <div key={message.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={message.avatar} alt={message.sender} />
                            <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{message.sender}</h4>
                              <span className="text-xs text-muted-foreground">{message.time}</span>
                            </div>
                            <p className="text-sm mt-1">{message.message}</p>
                          </div>
                          <div className="flex items-center">
                            {!message.read && <div className="h-2 w-2 rounded-full bg-blue-600 mr-2"></div>}
                            <Button variant="outline" size="sm">
                              Reply
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Account Settings</h1>

                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="/placeholder.svg?height=80&width=80" alt={user?.name || "User"} />
                        <AvatarFallback className="text-xl">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md"
                          defaultValue={user?.name || user?.email || ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <input type="email" className="w-full p-2 border rounded-md" defaultValue={user?.email || ""} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <input type="tel" className="w-full p-2 border rounded-md" defaultValue="+91 98765 43210" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">College/University</label>
                        <input type="text" className="w-full p-2 border rounded-md" defaultValue="Delhi University" />
                      </div>
                    </div>

                    <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current Password</label>
                      <input type="password" className="w-full p-2 border rounded-md" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">New Password</label>
                      <input type="password" className="w-full p-2 border rounded-md" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirm New Password</label>
                      <input type="password" className="w-full p-2 border rounded-md" />
                    </div>

                    <Button className="bg-blue-600 hover:bg-blue-700">Update Password</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive emails about your account activity</p>
                      </div>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">SMS Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive text messages for important updates</p>
                      </div>
                      <input type="checkbox" className="toggle" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">New Listing Alerts</h4>
                        <p className="text-sm text-muted-foreground">
                          Get notified when new items match your interests
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>

                    <Button className="bg-blue-600 hover:bg-blue-700">Save Preferences</Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>

      
    </div>
  )
}