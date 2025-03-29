"use client"
import type { JSX } from "react"
import { useState, useEffect } from "react"

import Link from "next/link"
import Image from "next/image"
import { Search, ArrowRight, BookOpen, Laptop, Bike, Home, PenToolIcon as Tool, Menu, X } from "lucide-react"
import axios from "axios"
import { BACKEND_URL } from "@/config/config"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Product {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  images?: string[];
  createdAt: Date;
}

export default function HomePage() {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [endingProducts, setEndingProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch recent products
        const recentRes = await axios.get(`${BACKEND_URL}/api/product?sort=createdAt&order=desc&limit=4`);
        if (recentRes?.data?.success) {
          setRecentProducts(recentRes.data.data);
        }

        // Fetch trending products (most viewed)
        const trendingRes = await axios.get(`${BACKEND_URL}/api/product?sort=views&order=desc&limit=4`);
        if (trendingRes?.data?.success) {
          setTrendingProducts(trendingRes.data.data);
        }

        // Fetch ending soon products (auctions ending soon)
        const endingRes = await axios.get(`${BACKEND_URL}/api/product?sort=endTime&order=asc&limit=4`);
        if (endingRes?.data?.success) {
          setEndingProducts(endingRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return new Date(date).toLocaleDateString();
  };

  const renderProductCard = (product: Product) => (
    <Card key={product._id} className="overflow-hidden group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105">
      <div className="relative">
        <Image
          src={product.images?.[0] || "/placeholder.png"}
          alt={`${product.title} image`}
          width={300}
          height={200}
          className="w-full h-48 object-cover group-hover:opacity-95 transition-opacity"
        />
        <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600">Sale</Badge>
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">{product.title}</h3>
          <span className="font-bold text-blue-600 text-lg">₹{product.price}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {product.description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="text-xs font-medium">
            {product.category}
          </Badge>
          <span className="text-xs text-muted-foreground">Posted {formatDate(product.createdAt)}</span>
        </div>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
          onClick={() => (window.location.href = `/product/${product._id}`)}
        >
          View Product
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen flex-col">
  
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-20 md:py-32 overflow-hidden">
          <div className="container px-4 mx-auto relative z-10 flex flex-col items-center text-center">
            <div className="animate-fade-in-up">
              <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                Buy, Sell, and Save on Campus
              </h1>
              <p className="mt-4 max-w-xl text-lg text-blue-100 mx-auto">
                Your one-stop marketplace for affordable second-hand college essentials
              </p>
            </div>
            <div className="mt-8 w-full max-w-md flex items-center gap-2 bg-white rounded-full p-1.5 shadow-lg animate-fade-in">
              <Search className="ml-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for books, laptops, cycles..."
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700">
                Search
              </Button>
            </div>
            <div className="mt-6 flex gap-4 animate-fade-in">
              <Button
                variant="outline"
                className="bg-white/20 text-white border-white/40 hover:bg-white/30 backdrop-blur-sm"
                onClick={() => (window.location.href = "/browse")}
              >
                Browse Products
              </Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => (window.location.href = "/sell")}
              >
                Start Selling
              </Button>
            </div>
          </div>
          <div className="absolute inset-0 bg-[url('https://blogger.googleusercontent.com/img/a/AVvXsEjy9Qk6mpHKofvezAlnzrTog7UNDDraIPplir9ieYv1ziwqTzLXg-7V0vxkoBeJLOSYjHB2MsgS0pETzka4STg18koK2S8ufmWUlZ0vR_N0YsORO7vaUdVXffuDGUw2A4MQrdjqWZmg11XICAnzFB9lAnU4Byoy9JZCBKH4YtnkEwn7JcAu9qin8Vb7=s16000?height=600&width=120')] bg-cover bg-center opacity-10"></div>

          {/* Animated shapes */}
          <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-blue-400/20 animate-float"></div>
          <div className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-orange-400/20 animate-float-delay"></div>
          <div className="absolute top-3/4 left-1/3 w-16 h-16 rounded-full bg-white/10 animate-float-delay-long"></div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent animate-pulse">
                Browse by Category
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full shadow-lg shadow-blue-500/50"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <Link
                href="/category/books"
                className="group flex flex-col items-center p-6 rounded-xl border bg-white hover:bg-blue-50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors mb-4 shadow-inner">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Books</span>
              </Link>
              <Link
                href="/category/electronics"
                className="group flex flex-col items-center p-6 rounded-xl border bg-white hover:bg-blue-50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors mb-4 shadow-inner">
                  <Laptop className="h-8 w-8 text-blue-600" />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Electronics</span>
              </Link>
              <Link
                href="/category/cycles"
                className="group flex flex-col items-center p-6 rounded-xl border bg-white hover:bg-blue-50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors mb-4 shadow-inner">
                  <Bike className="h-8 w-8 text-blue-600" />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Cycles</span>
              </Link>
              <Link
                href="/category/hostel"
                className="group flex flex-col items-center p-6 rounded-xl border bg-white hover:bg-blue-50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors mb-4 shadow-inner">
                  <Home className="h-8 w-8 text-blue-600" />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Hostel</span>
              </Link>
              <Link
                href="/category/projects"
                className="group flex flex-col items-center p-6 rounded-xl border bg-white hover:bg-blue-50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors mb-4 shadow-inner">
                  <Tool className="h-8 w-8 text-blue-600" />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Project Kits</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent animate-pulse">
                Featured Products
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full shadow-lg shadow-blue-500/50 mb-8"></div>
              <div className="flex justify-center items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                <Link href="/browse" className="flex items-center gap-2 text-lg font-medium">
                  View all products <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <Tabs defaultValue="recent" className="w-full">
              <TabsList className="flex justify-center mb-8">
                <TabsTrigger value="recent" className="px-6 py-2 text-sm font-medium">Recently Added</TabsTrigger>
                <TabsTrigger value="trending" className="px-6 py-2 text-sm font-medium">Trending</TabsTrigger>
                <TabsTrigger value="ending" className="px-6 py-2 text-sm font-medium">Ending Soon</TabsTrigger>
              </TabsList>
              <TabsContent value="recent" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {recentProducts.map((product) => (
                    <Card key={product._id} className="overflow-hidden group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105">
                      <div className="relative">
                        <Image
                          src={product.images?.[0] || "/placeholder.png"}
                          alt={`${product.title} image`}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover group-hover:opacity-95 transition-opacity"
                        />
                        <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600">Sale</Badge>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">{product.title}</h3>
                          <span className="font-bold text-blue-600 text-lg">₹{product.price}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="outline" className="text-xs font-medium">
                            {product.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Posted {formatDate(product.createdAt)}</span>
                        </div>
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                          onClick={() => (window.location.href = `/product/${product._id}`)}
                        >
                          View Product
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="trending" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {trendingProducts.map(renderProductCard)}
                </div>
              </TabsContent>
              <TabsContent value="ending" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {endingProducts.map(renderProductCard)}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent animate-pulse">
                How It Works
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full shadow-lg shadow-blue-500/50"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group flex flex-col items-center text-center p-8 rounded-xl bg-white hover:bg-blue-50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 border">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 mb-6 group-hover:bg-blue-200 transition-colors shadow-inner">
                  <span className="text-3xl font-bold text-blue-600 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-blue-600 transition-colors">List Your Item</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Take photos, set a price, and create a listing in minutes. Our simple process makes it easy to get started.
                </p>
              </div>
              <div className="group flex flex-col items-center text-center p-8 rounded-xl bg-white hover:bg-blue-50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 border">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 mb-6 group-hover:bg-blue-200 transition-colors shadow-inner">
                  <span className="text-3xl font-bold text-blue-600 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-blue-600 transition-colors">Connect with Buyers</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Receive offers and messages from interested students. Negotiate prices and arrange meetups safely.
                </p>
              </div>
              <div className="group flex flex-col items-center text-center p-8 rounded-xl bg-white hover:bg-blue-50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 border">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 mb-6 group-hover:bg-blue-200 transition-colors shadow-inner">
                  <span className="text-3xl font-bold text-blue-600 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-blue-600 transition-colors">Make the Exchange</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Meet on campus and complete your transaction safely. Join our community of happy buyers and sellers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              {/* Left side content */}
              <div className="max-w-xl md:w-1/2">
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl mb-4">Ready to Sell Your Items?</h2>
                <p className="text-orange-100 mb-6">
                  Turn your unused items into cash and help fellow students save money. List your first item in minutes!
                </p>
                <Button
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-gray-100"
                  onClick={() => window.location.href = '/sell'}
                >
                  Start Selling Now
                </Button>
              </div>

              {/* Right side image */}
              <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center md:justify-end">
                <img
                  src="https://www.rd.com/wp-content/uploads/2022/07/RD-sell-used-online-Square-FT-GettyImages-1384947546-183430228.jpg"
                  alt="Student selling items"
                  className="rounded-lg shadow-lg w-full max-w-md"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl mb-8 text-center">What Students Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Priya S.",
                  course: "Computer Science, 3rd Year",
                  quote: "Found my programming textbooks for half the bookstore price. Saved so much money!",
                },
                {
                  name: "Rahul M.",
                  course: "Mechanical Engineering, 2nd Year",
                  quote: "Sold my old cycle in just 2 days. The process was super easy and convenient.",
                },
                {
                  name: "Ananya K.",
                  course: "Economics, 4th Year",
                  quote: "Great platform to find affordable hostel essentials. Highly recommend!",
                },
              ].map((testimonial, index) => (
                <Card key={index} className="p-6">
                  <div className="flex flex-col h-full">
                    <div className="text-yellow-400 flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="mr-1"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <blockquote className="flex-1 text-muted-foreground italic mb-4">"{testimonial.quote}"</blockquote>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.course}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

