"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Heart, Share2, MessageCircle, AlertTriangle, Check, Phone, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Product {
  id: string
  title: string
  price: number
  description: string
  condition: string
  category: string
  owner: {
    username: string
    email: string
    phone: string
  }
  location: string
  postedDate: string
  views: number
  isAuction: boolean
  currentBid: number
  bidCount: number
  endTime: string
  images: string[]
  contactMethod: "phone" | "email" | "both"
  meetingLocation: string
}

interface ProductClientProps {
  product: Product
}

export default function ProductClient({ product }: ProductClientProps) {
  const [liked, setLiked] = useState(false)
  const [bidAmount, setBidAmount] = useState("")
  const [bidSubmitted, setBidSubmitted] = useState(false)
  const [messageText, setMessageText] = useState("")
  const [messageSent, setMessageSent] = useState(false)
  const [showContactDetails, setShowContactDetails] = useState(false)

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setBidSubmitted(true)
    setBidAmount("")
  }

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessageSent(true)
    setMessageText("")
  }

  const handleBuyClick = () => {
    setShowContactDetails(true)
  }

  return (
    <div className="flex min-h-screen flex-col">

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link
              href="/browse"
              className="flex items-center text-muted-foreground hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Browse
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <Carousel className="w-full">
                <CarouselContent>
                  {product.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-square overflow-hidden rounded-lg">
                        <Image
                          src={image}
                          alt={`${product.title} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>

              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <Image src={image} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between">
                  <h1 className="text-2xl font-bold md:text-3xl">{product.title}</h1>
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={liked ? "text-red-500" : ""}
                            onClick={() => setLiked(!liked)}
                          >
                            <Heart className="h-5 w-5" fill={liked ? "currentColor" : "none"} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{liked ? "Remove from favorites" : "Add to favorites"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Share2 className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Share this listing</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {product.condition}
                  </Badge>
                  {product.isAuction && <Badge className="bg-blue-500 hover:bg-blue-600 text-xs">Auction</Badge>}
                </div>

                <div className="mt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-blue-600">₹{product.price.toLocaleString()}</span>
                    {product.isAuction && (
                      <span className="text-sm text-muted-foreground">
                        Current bid • {product.bidCount} bids
                      </span>
                    )}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div>
                    <h2 className="font-semibold mb-2">Description</h2>
                    <p className="text-muted-foreground">{product.description}</p>
                  </div>

                  <div>
                    <h2 className="font-semibold mb-2">Location</h2>
                    <p className="text-muted-foreground">{product.location}</p>
                  </div>

                  <div>
                    <h2 className="font-semibold mb-2">Seller Information</h2>
                    <div className="space-y-1">
                      <p className="font-medium">{product?.owner?.username}</p>
                      
                      <p className="text-sm text-muted-foreground">
                        {/* Rating: {product.seller.rating} • Member since {product.seller.joinedDate} */}
                      </p>
                      {/* <p className="text-sm text-muted-foreground">Response rate: {product.seller.responseRate}</p> */}
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {product.isAuction ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Place Bid</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Place a Bid</DialogTitle>
                        <DialogDescription>
                          Current bid is ₹{product.currentBid.toLocaleString()}. Your bid must be higher.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleBidSubmit}>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Input
                              type="number"
                              placeholder="Enter your bid amount"
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Submit Bid</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Dialog open={showContactDetails} onOpenChange={setShowContactDetails}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleBuyClick}>
                        Buy Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Seller Contact Details</DialogTitle>
                        <DialogDescription>
                          Contact the seller to arrange the purchase and meeting.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <h3 className="font-semibold">Seller Information</h3>
                          <h3 className="font-semibold">Contact Methods</h3>
                          <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span className="text-sm">{product.phone}</span>
                            </div>
                  <h3 className="font-semibold">Seller Name </h3>
                          <p className="text-sm text-muted-foreground">{product.owner.username}</p>
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold"></h3>
                          {(product.contactMethod === "phone" || product.contactMethod === "both") && product.owner.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span className="text-sm">{product.owner.phone}</span>
                            </div>
                          )}
                          {(product.contactMethod === "email" || product.contactMethod === "both") && product.owner.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                             
                              <span className="text-sm">{product.owner.email}</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold">Meeting Location</h3>
                          <p className="text-sm text-muted-foreground">{product.meetingLocation}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                <div className="mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Message Seller
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Message the Seller</DialogTitle>
                        <DialogDescription>
                          Send a message to {product.owner.username} about this item.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleMessageSubmit}>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Textarea
                              placeholder="Type your message here"
                              value={messageText}
                              onChange={(e) => setMessageText(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Send Message</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  )
} 