"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Upload, X, Check, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { BACKEND_URL } from "@/config/config"
import axios from "axios"
import { useRouter } from "next/navigation"


export default function SellPage() {
  const [images, setImages] = useState<string[]>([])
  const [listingType, setListingType] = useState("fixed")
  const [files, setFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const [product, setProduct] = useState({
    title : "",
    description : "",
    category : "",
    price : 0,
    condition : "",
    saletype : "fixed price",
    contactMethod : "",
    phone : "",
    meetingLocation : "",
    email : "",
    images : [""],
  });
  const router = useRouter();

  const handleImageRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const maxSize = 5 * 1024 * 1024; // 5MB

      for (const file of selectedFiles) {
        if (file.size > maxSize) {
          toast.error(`File size must not exceed 5MB.`);
          return;
        }
      }

      const newImages = Array.from(selectedFiles).map((file) =>
        URL.createObjectURL(file)
      );
      setImages([...images, ...newImages]);
      setFiles((f) => [...f, ...selectedFiles]);
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  };

  const getSignedURLs = async () => {
    const filenames = files.map((f) => {
      return {
        name: f.name,
        type: f.type
      };
    });
    
    console.log(`filenames`, filenames);
    
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/product/pre-signed-urls`,
        { filenames },
        {
          withCredentials: true,
        }
      );

      return res.data?.signedUrls;
      
    } catch (error) {
      console.log(error);
    }
  };

  const uploadFiles = async (preSignedUrls: { uploadUrl: string; publicUrl: string }[]) => {
    try {
      if (!files || files.length === 0) {
        console.error("No files selected for upload.");
        return;
      }
  
      const uploadPromises = files?.map(async (file, index) => {
        console.log(file);
        console.log(preSignedUrls[index].uploadUrl);
        
        
        if (!preSignedUrls[index]) {
          console.error(`No pre-signed URL for file: ${file.name}`);
          return;
        }
  
        const { uploadUrl } = preSignedUrls[index];
  
        try {
          // const response = await fetch(uploadUrl, {
          //   method: "PUT",
          //   body: file,
          //   headers: {
          //     "Content-Type": file.type,
          //     "x-goog-acl": "public-read", 
          //   },
          // });
          const response = await axios.put(uploadUrl, file, {
            headers : {
              "Content-Type" : file.type,
            }
          })

          console.log("res" , response);
          
  
          // if (!response.ok) {
          //   throw new Error(`Failed to upload ${file.name}: ${response.statusText}`);
          // }
  
          console.log(`Uploaded ${file.name} successfully`);
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
        }
      });
  
      await Promise.all(uploadPromises);
      console.log("All uploads completed.");
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };
  

  const getImageUrls = (preSignedUrls: { uploadUrl: string, publicUrl : string }[]) => {
    return preSignedUrls.map(({publicUrl}) => {
      return publicUrl;
    });
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally send the data to your backend
    console.log("Submitted data:", product)
    // Reset form or redirect

    let toastId = toast.loading("Uploading Images...");

    try {
      const urls = await getSignedURLs();
      console.log(urls);
      
     try {
      await uploadFiles(urls);
     } catch (error) {
      console.log(error);
      return;
      
     }
      toast.dismiss(toastId);
      toast.success("Upload Successful!", {
        description: "Your files have been uploaded successfully.",
      });

      toastId = toast.loading("Saving Product...");

      product.images = getImageUrls(urls);

      const res = await axios.post(`${BACKEND_URL}/api/product`, product, {
        withCredentials: true,
      });
      console.log(res);
      

      if (res?.data?.success) {
        toast.success(res?.data?.message);
        router.push("/browse");
      }
    } catch (error) {
      // handleAxiosError(error);
      console.log(error);
    } finally {
      toast.dismiss(toastId);
    }
    // setTimeout(() => {
    //   window.scrollTo({ top: 0, behavior: "smooth" })
    // }, 500)
  }

  return (
    <div className="flex min-h-screen flex-col">

     
      <main className="flex-1 py-10">
        <div className="container mx-auto max-w-4xl">

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Sell Your Item</h1>
            <p className="text-muted-foreground">Fill out the form below to list your item for sale or auction.</p>
          </div>

          {submitted && (
            <Alert className="mb-8 bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                Your listing has been submitted successfully! We'll review it shortly.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="e.g., Calculus Textbook 3rd Edition" name="title" value={product.title}
                    onChange={(e)=>setProduct(p=> ({...p , [e.target.name] : e.target.value}))} required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your item's condition, features, and any other relevant details..."
                      className="min-h-[120px]"
                      name="description" value={product.description}
                    onChange={(e)=>setProduct(p=> ({...p , [e.target.name] : e.target.value}))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="grid gap-2 bg-white">

                      <Label htmlFor="category">Category</Label>
                      <Select required value={product.category} onValueChange={(value) => setProduct(p => ({ ...p, category: value }))}>
                        <SelectTrigger id="category" >
                          <SelectValue placeholder="Select category"/>
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="books">Books & Notes</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="cycles">Cycles</SelectItem>
                          <SelectItem value="hostel">Hostel Essentials</SelectItem>
                          <SelectItem value="projects">Project Kits</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="condition">Condition</Label>
                      <Select required value={product.condition} onValueChange={(value) => setProduct(p => ({ ...p, condition: value }))}>
                        <SelectTrigger id="condition">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="like new">Like New</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Listing Details</h2>
                <div className="space-y-6">
                  {/* <div className="space-y-4">
                    <Label>Listing Type</Label>
                    <RadioGroup defaultValue="fixed" value={listingType} onValueChange={setListingType}>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fixed" id="fixed" />
                          <Label htmlFor="fixed" className="font-normal">
                            Fixed Price
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="auction" id="auction" />
                          <Label htmlFor="auction" className="font-normal">
                            Auction
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="offers" id="offers" />
                          <Label htmlFor="offers" className="font-normal">
                            Open to Offers
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div> */}

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="price">Price (₹)</Label>
                        {listingType === "auction" && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>This will be the starting bid for your auction</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <Input id="price" type="number" min="0" step="1" placeholder="e.g., 500" value={product.price} onChange={(e)=>setProduct(p=>({...p , price : Number( e.target.value)}))} required />
                    </div>

                    {listingType === "auction" && (
                      <div className="grid gap-2">
                        <Label htmlFor="duration">Auction Duration</Label>
                        <Select required>
                          <SelectTrigger id="duration">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 day</SelectItem>
                            <SelectItem value="3">3 days</SelectItem>
                            <SelectItem value="5">5 days</SelectItem>
                            <SelectItem value="7">7 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Photos</h2>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Upload Images (max 5)</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {images.map((src, index) => (
                        <div key={index} className="relative aspect-square rounded-md overflow-hidden border bg-muted">
                          <Image
                            src={src || "/placeholder.svg"}
                            alt={`Product image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 rounded-full"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}

                      {images.length < 5 && (
                        <label className="flex flex-col items-center justify-center aspect-square rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted cursor-pointer hover:bg-muted/80 transition-colors">
                          <div className="flex flex-col items-center justify-center p-4 text-center">
                            <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Upload Image</span>
                          </div>
                          <Input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} multiple/>
                        </label>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Add up to 5 images of your item. The first image will be the cover image.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="contact-method">Preferred Contact Method</Label>
                        <Select required value={product.contactMethod} onValueChange={(value) => setProduct(p => ({ ...p, contactMethod: value }))}>
                          <SelectTrigger id="contact-method">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="both">Both</SelectItem>
                            <SelectItem value="phone">Phone Call</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {product.contactMethod === "phone" && (
                        <div className="grid gap-2">
                          <Label>Phone</Label>
                          <Input value={product.phone} onChange={(e)=>setProduct((p)=>({...p, phone : e.target.value}))} />
                        </div>
                      )}
                      {product.contactMethod === "email" && (
                        <div className="grid gap-2">
                          <Label>Email</Label>
                          <Input value={product.email} onChange={(e)=>setProduct((p)=>({...p, email : e.target.value}))} />
                        </div>
                      )}
                      {product.contactMethod === "both" && (
                        <>
                          {(
                            <div className="grid gap-2">
                              <Label>Phone</Label>
                              <Input value={product.phone} onChange={(e)=>setProduct((p)=>({...p, phone : e.target.value}))} />
                            </div>
                          )}
                          {(
                            <div className="grid gap-2">
                              <Label>Email</Label>
                              <Input value={product.email} onChange={(e)=>setProduct((p)=>({...p, email : e.target.value}))} />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="meeting-location">Preferred Meeting Location</Label>
                      <Select required value={product.meetingLocation} onValueChange={(value) => setProduct(p => ({ ...p, meetingLocation: value }))}>
                        <SelectTrigger id="meeting-location">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="library">University Library</SelectItem>
                          <SelectItem value="cafeteria">Main Cafeteria</SelectItem>
                          <SelectItem value="student-center">Student Center</SelectItem>
                          <SelectItem value="hostel">Hostel Common Area</SelectItem>
                          <SelectItem value="other">Other (Specify in Description)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
          

            <div className="flex flex-col space-y-4">
              <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700">
                Submit Listing
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                By submitting this listing, you agree to our{" "}
                <Link href="/terms" className="underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

