import axios from "axios";
import ProductClient from "./ProductClient"
import { BACKEND_URL } from "@/config/config";

// This is a server component
async function getProduct(id: string) {
  // Simulate a delay to mimic API call
  try {
    const res = await axios.get(`${BACKEND_URL}/api/product/${id}`)

    return res.data;
  } catch (error) {
    return null;
  }
}

interface PageProps {
  params: Promise<{id: string}>
}

export default async function ProductPage({ params }: PageProps) {
  // Ensure params.id is treated as a Promise
  const id = (await params).id;

  const product = await getProduct(id);
  console.log(product);
  
  
  return <ProductClient product={product} />
}

