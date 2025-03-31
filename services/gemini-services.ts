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
  isGenuine: boolean
  validationMessage: string
}

export interface ImageValidation {
  isGenuine: boolean
  validationMessage: string
  suggestedCategory?: string
  suggestedTitle?: string
  issues?: string[]
}

export async function validateProductImage(imageFile: File, title: string, category: string): Promise<ImageValidation> {
  try {
    const imageData = await fileToGenerativePart(imageFile)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      Analyze this product image and validate if it's appropriate for a second-hand marketplace listing.
      
      Check for the following issues:
      1. Is this a genuine product image (not a stock photo or fake)?
      2. Does the image contain inappropriate content (people, personal photos, or non-product images)?
      3. Is the image clear and show the actual product?
      4. Are there any signs of manipulation or editing?
      5. Does the image match the title and category?
      6. Is the image quality good enough for a marketplace listing?
      7. Is the product clearly visible and well-lit?
      8. Are there any safety concerns or inappropriate items in the image?

      Provide your analysis in JSON format with these fields:
      {
        "isGenuine": boolean,
        "validationMessage": "string explaining the validation result",
        "suggestedCategory": "suggested category if different from provided",
        "suggestedTitle": "suggested title if different from provided",
        "issues": ["list of specific issues found in the image"]
      }

      Return ONLY valid JSON with these fields and no other text.
    `

    const result = await model.generateContent([prompt, imageData])
    const response = await result.response
    const text = response.text()

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : text
      const parsedResponse = JSON.parse(jsonString) as ImageValidation
      return parsedResponse
    } catch (parseError) {
      console.error("Failed to parse Gemini validation response:", parseError)
      throw new Error("Failed to parse AI validation response")
    }
  } catch (error) {
    console.error("Error validating image with Gemini:", error)
    throw error
  }
}

export async function analyzeProductImage(imageFile: File): Promise<ProductAnalysis> {
  try {
    const imageData = await fileToGenerativePart(imageFile)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      Analyze this product image for a second-hand marketplace listing.
      
      First, validate if this is an appropriate product image:
      1. Check if it's a genuine product image (not a stock photo, fake, or inappropriate content)
      2. Verify it's not a personal photo or contains people
      3. Ensure the product is clearly visible and well-lit
      4. Check for any safety concerns or inappropriate items

      If the image is valid, provide the following details in JSON format:
      1. title: A concise title for the product
      2. description: A detailed description including features, specifications, and any visible wear or damage
      3. category: One of the following categories: "books", "electronics", "cycles", "hostel", "projects", "other"
      4. condition: One of the following: "like_new", "good", "fair", "poor"
      5. estimatedPrice: Estimated value in Indian Rupees (₹) as a number
      6. isGenuine: boolean indicating if the image appears to be genuine
      7. validationMessage: string explaining the validation result
      
      If the image is invalid or inappropriate, return:
      {
        "isGenuine": false,
        "validationMessage": "Detailed explanation of why the image is invalid",
        "title": "",
        "description": "",
        "category": "",
        "condition": "",
        "estimatedPrice": 0
      }

      Return ONLY valid JSON with these fields and no other text.
    `

    const result = await model.generateContent([prompt, imageData])
    const response = await result.response
    const text = response.text()

    try {
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