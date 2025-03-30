"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SlideItem {
  id: number
  image: string
  title: string
  link: string
  type: "brand" | "product"
}

interface AutoSliderProps {
  items: SlideItem[]
  interval?: number
  className?: string
  showControls?: boolean
  showIndicators?: boolean
}

export function AutoSlider({
  items,
  interval = 5000,
  className,
  showControls = true,
  showIndicators = true,
}: AutoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (!isHovering) {
      timerRef.current = setInterval(() => {
        nextSlide()
      }, interval)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [interval, isHovering])

  return (
    <div
      className={cn("relative overflow-hidden rounded-lg", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item) => (
          <div key={item.id} className="min-w-full relative">
            <Link href={item.link} className="block">
              <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover"
                  priority={currentIndex === items.indexOf(item)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 md:p-6">
                  <div className="mb-2">
                    <span className="inline-block rounded-full bg-blue-600 px-2 py-1 text-xs font-medium text-white">
                      {item.type === "brand" ? "Featured Brand" : "Top Selling"}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">{item.title}</h3>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {showControls && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 hover:bg-white text-gray-800"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous slide</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 hover:bg-white text-gray-800"
            onClick={nextSlide}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next slide</span>
          </Button>
        </>
      )}

      {showIndicators && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
              onClick={() => goToSlide(index)}
            >
              <span className="sr-only">Go to slide {index + 1}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 