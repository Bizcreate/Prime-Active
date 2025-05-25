"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Software Developer",
    image: "/diverse-group-city.png",
    content:
      "I've been mining on my gaming PC during off-hours and have earned enough tokens to start staking. The transition was seamless, and now I'm earning passive income without keeping my computer running 24/7.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "College Student",
    image: "/contemplative-artist.png",
    content:
      "As a student with limited funds, this platform has been perfect for me. I mine using my laptop when I'm not using it for schoolwork, and I've already earned a significant amount of tokens without any investment.",
    rating: 5,
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    role: "IT Professional",
    image: "/contemplative-man.png",
    content:
      "The dual mining and staking approach is brilliant. I started with mining and gradually transitioned to staking as my token balance grew. Now I have a diversified approach with both methods running simultaneously.",
    rating: 4,
  },
  {
    id: 4,
    name: "Emily Parker",
    role: "Graphic Designer",
    image: "/fashion-designer-at-work.png",
    content:
      "I was skeptical at first, but the no-investment approach convinced me to try it. The software runs smoothly in the background while I work, and I barely notice it. The rewards have been surprisingly good!",
    rating: 5,
  },
]

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="relative rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 md:p-8">
        <div className="absolute right-8 top-8 flex">
          {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-primary text-primary" />
          ))}
        </div>

        <div className="flex flex-col items-center md:flex-row md:items-start md:gap-6">
          <div className="mb-4 h-20 w-20 overflow-hidden rounded-full md:mb-0 md:h-24 md:w-24">
            <Image
              src={testimonials[activeIndex].image || "/placeholder.svg"}
              alt={testimonials[activeIndex].name}
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1">
            <blockquote className="mb-4 text-lg italic text-zinc-300">"{testimonials[activeIndex].content}"</blockquote>

            <div className="text-center md:text-left">
              <div className="font-medium text-white">{testimonials[activeIndex].name}</div>
              <div className="text-sm text-zinc-500">{testimonials[activeIndex].role}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2 md:justify-end">
          <button
            onClick={prevTestimonial}
            className="rounded-full border border-zinc-700 p-2 text-zinc-400 transition-colors hover:border-primary hover:text-primary"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextTestimonial}
            className="rounded-full border border-zinc-700 p-2 text-zinc-400 transition-colors hover:border-primary hover:text-primary"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
