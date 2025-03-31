"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Upload, X, Check, Info, Loader2, Sparkles } from "lucide-react"

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
import { analyzeProductImage, validateProductImage } from "@/services/gemini-services"


export default function SellPage() {
  const [images, setImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [listingType, setListingType] = useState("fixed")
  const [submitted, setSubmitted] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(false)

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
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles = Array.from(files)
    if (newFiles.length + images.length > 5) {
      alert("You can only upload up to 5 images")
      return
    }

    setIsValidating(true)
    setValidationError(null)

    try {
      // Validate each new image before adding it
      const validationPromises = newFiles.map(file => 
        validateProductImage(file, product.title, product.category)
      )

      const validationResults = await Promise.all(validationPromises)
      const invalidImages = validationResults.filter(result => !result.isGenuine)

      if (invalidImages.length > 0) {
        const issues = invalidImages.map(result => result.validationMessage).join("\n")
        setValidationError(
          `Some images were rejected:\n${issues}\n\nPlease upload appropriate product images only.`
        )
        return
      }

      // If all images are valid, add them to the state
      const newImages = newFiles.map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newImages])
      setImageFiles((prev) => [...prev, ...newFiles])
    } catch (error) {
      console.error("Error validating images:", error)
      setValidationError("Failed to validate images. Please try again.")
    } finally {
      setIsValidating(false)
    }
  }

  const getSignedURLs = async () => {
    const filenames = imageFiles.map((f) => {
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
      if (!imageFiles || imageFiles.length === 0) {
        console.error("No files selected for upload.");
        return;
      }
  
      const uploadPromises = imageFiles?.map(async (file, index) => {
        console.log(file);
        console.log(preSignedUrls[index].uploadUrl);
        
        
        if (!preSignedUrls[index]) {
          console.error(`No pre-signed URL for file: ${file.name}`);
          return;
        }
  
        const { uploadUrl } = preSignedUrls[index];
  
        try {
          const response = await axios.put(uploadUrl, file, {
            headers : {
              "Content-Type" : file.type,
            }
          })

          console.log("res" , response);
          
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)
    setIsValidating(true)

    try {
      // Validate all images before submission
      const validationPromises = imageFiles.map(file => 
        validateProductImage(file, product.title, product.category)
      )

      const validationResults = await Promise.all(validationPromises)
      const invalidImages = validationResults.filter(result => !result.isGenuine)

      if (invalidImages.length > 0) {
        setValidationError(
          "Some images appear to be invalid or don't match the product description. Please review and update your images."
        )
        return
      }

      // If validation passes, proceed with form submission
      const formData = new FormData()
      imageFiles.forEach((file) => {
        formData.append("images", file)
      })

      // Add other form fields
      Object.entries(product).forEach(([key, value]) => {
        formData.append(key, value.toString())
      })

      const response = await axios.post(`${BACKEND_URL}/api/product`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 201) {
        setSubmitted(true)
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setValidationError("Failed to submit listing. Please try again.")
    } finally {
      setIsValidating(false)
    }
  }

  const analyzeWithAI = async () => {
    if (imageFiles.length === 0) {
      setAnalysisError("Please upload at least one image to analyze")
      return
    }

    setIsAnalyzing(true)
    setAnalysisError(null)

    try {
      // Use the first image for analysis
      const analysis = await analyzeProductImage(imageFiles[0])

      // Update form fields with AI analysis
      setProduct(p => ({
        ...p,
        title: analysis.title || "",
        description: analysis.description || "",
        category: analysis.category || "",
        condition: analysis.condition || "",
        price: analysis.estimatedPrice || 0
      }))
    } catch (error) {
      console.error("Error analyzing image:", error)
      setAnalysisError("Failed to analyze image. Please try again or fill in details manually.")
    } finally {
      setIsAnalyzing(false)
    }
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
                    <div className="flex items-center justify-between">
                    <Label>Upload Images (max 5)</Label>
                      {images.length > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={analyzeWithAI}
                          disabled={isAnalyzing}
                          className="flex items-center gap-2"
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4" />
                              Analyze with AI
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    {analysisError && (
                      <Alert className="mb-4 bg-red-50 border-red-200">
                        <Info className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-600">{analysisError}</AlertDescription>
                      </Alert>
                    )}

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
                            onClick={() => handleImageRemove(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}

                      {images.length < 5 && (
                        <label className="flex flex-col items-center justify-center aspect-square rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted cursor-pointer hover:bg-muted/80 transition-colors">
                          <div className="flex flex-col items-center justify-center p-4 text-center">
                            {isValidating ? (
                              <>
                                <Loader2 className="h-8 w-8 mb-2 text-muted-foreground animate-spin" />
                                <span className="text-xs text-muted-foreground">Validating...</span>
                              </>
                            ) : (
                              <>
                            <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Upload Image</span>
                              </>
                            )}
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={isValidating}
                          />
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
          

            {validationError && (
              <Alert className="mb-8 bg-red-50 border-red-200">
                <Info className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-600">{validationError}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isValidating}
              >
                {isValidating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating and Submitting...
                  </>
                ) : (
                  "Submit Listing"
                )}
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

