"use client";

import Image from "next/image"
import { Search, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/config/config";
import { useRouter } from "next/navigation";
interface Product {
  _id : string;
  title: string;
  description: string;
  category: "books" | "electronics" | "cycles" | "hostel essentials" | "projects" | "other";
  condition: "like new" | "good" | "fair" | "poor";
  saletype: "fixed price" | "auction" | "open to offers";
  price?: number;
  images?: string[];
  contactMethod: "phone" | "email" | "both";
  phone?: string;
  email?: string;
  owner: {
    username : string;
    email : string;
  }
  meetingLocation: string;
  createdAt: Date;
}

export default function BrowsePage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const router = useRouter();

  useEffect(()=> {
      const getProducts = async()=>{
        try {
          const res = await axios.get(`${BACKEND_URL}/api/product?page=${page}&limit=8`);

          if(res?.data?.success){
            setProducts(res?.data?.data);
            setTotalPages(res?.data?.totalPages);
          }
        } catch (error) {
          console.log(error);
          
        }
      };
      getProducts();
  },[page]);

  console.log(products);
  
  return (
    <div className="flex min-h-screen flex-col">

      <main className="flex-1">
        <div className="container mx-auto py-8 px-6">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search products..." className="pl-10" />
            </div>
            <Select defaultValue="featured">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg">
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="ending">Ending Soon</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="md:hidden">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="hidden md:block">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="books" />
                      <Label htmlFor="books">Books & Notes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="electronics" />
                      <Label htmlFor="electronics">Electronics</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="cycles" />
                      <Label htmlFor="cycles">Cycles</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="hostel" />
                      <Label htmlFor="hostel">Hostel Essentials</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="projects" />
                      <Label htmlFor="projects">Project Kits</Label>
                    </div>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="price">
                    <AccordionTrigger>Price Range</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="price-1" />
                          <Label htmlFor="price-1">Under ₹500</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="price-2" />
                          <Label htmlFor="price-2">₹500 - ₹1,000</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="price-3" />
                          <Label htmlFor="price-3">₹1,000 - ₹5,000</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="price-4" />
                          <Label htmlFor="price-4">₹5,000 - ₹10,000</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="price-5" />
                          <Label htmlFor="price-5">Above ₹10,000</Label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="condition">
                    <AccordionTrigger>Condition</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="condition-1" />
                          <Label htmlFor="condition-1">Like New</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="condition-2" />
                          <Label htmlFor="condition-2">Good</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="condition-3" />
                          <Label htmlFor="condition-3">Fair</Label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="listing-type">
                    <AccordionTrigger>Listing Type</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="type-1" />
                          <Label htmlFor="type-1">Fixed Price</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="type-2" />
                          <Label htmlFor="type-2">Auction</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="type-3" />
                          <Label htmlFor="type-3">Open to Offers</Label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Browse Products</h2>
                <div className="text-sm text-muted-foreground">Showing {page} of {totalPages} results</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <Card key={product._id} className="p-4 shadow-lg rounded-lg">
                  {product.images?.length ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      width={200}
                      height={200}
                      className="w-full h-40 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <CardContent className="p-2">
                    <h3 className="font-semibold text-lg">{product.title}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="outline">{product.category}</Badge>
                      <span className="font-semibold text-primary">₹{product.price || "N/A"}</span>
                    </div>
                    <Button variant="default" className="w-full mt-3" onClick={()=>router.push(`/product/${product._id}`)}>View Details</Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center col-span-full text-gray-500">No products found.</p>
            )}
          </div>

          <div className="flex justify-center mt-8">
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="icon"
          disabled={page === 1}
          onClick={() => setPage(p=>p-1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index + 1}
            variant="outline"
            size="sm"
            className={`${
              page === index + 1 ? "bg-blue-600 text-white hover:bg-blue-700" : ""
            }`}
            onClick={() => setPage(index+1)}
          >
            {index + 1}
          </Button>
        ))}

        {/* Next Button */}
        <Button
          variant="outline"
          size="icon"
          disabled={page === totalPages}
          onClick={() => setPage((p)=>p+1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Button>
      </div>
    </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}
