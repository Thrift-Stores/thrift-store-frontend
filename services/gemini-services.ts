"use client"

import { GoogleGenerativeAI } from "@google/generative-ai"

// This should be stored in environment variables in a production app
// For demo purposes, we'll use it directly here
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(API_KEY)

export interface ProductAnalysis {
  title: string
  description: string
  category: string
  condition: string
  estimatedPrice: number
}

export async function analyzeProductImage(imageFile: File): Promise<ProductAnalysis> {
  try {
    // Convert the image to the format required by Gemini
    const imageData = await fileToGenerativePart(imageFile)

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Create the prompt
    const prompt = `
      Analyze this product image for a second-hand marketplace listing.
      Provide the following details in JSON format:
      1. title: A concise title for the product
      2. description: A detailed description including features, specifications, and any visible wear or damage
      3. category: One of the following categories: "books", "electronics", "cycles", "hostel", "projects", "other"
      4. condition: One of the following: "like_new", "good", "fair", "poor"
      5. estimatedPrice: Estimated value in Indian Rupees (₹) as a number
      
      Return ONLY valid JSON with these fields and no other text.
    `

    // Generate content
    const result = await model.generateContent([prompt, imageData])
    const response = await result.response
    const text = response.text()

    // Parse the JSON response
    try {
      // Extract JSON from the response (in case there's any extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : text

      const parsedResponse = JSON.parse(jsonString) as ProductAnalysis
      return parsedResponse
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError)
      throw new Error("Failed to parse AI response")
    }
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error)
    throw error
  }
}

// Helper function to convert a file to the format required by Gemini
async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.readAsDataURL(file)
  })

  const base64EncodedData = await base64EncodedDataPromise
  const base64Data = base64EncodedData.split(",")[1]

  return {
    inlineData: {
      data: base64Data,
      mimeType: file.type,
    },
  }
} 