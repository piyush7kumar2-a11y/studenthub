"use client"

import * as React from "react"
import { ArrowRight, Star, Sparkles, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface AvatarList {
  image: string
}

export interface HeroSectionProps {
  avatarList?: AvatarList[]
}

export default function HeroSection({ avatarList = [] }: HeroSectionProps) {
  // Reliable high-quality fallback Unsplash avatar images if needed
  const displayAvatars = avatarList.length > 0 ? avatarList : [
    { image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" },
    { image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" },
    { image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" },
    { image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces" },
  ]

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Background Decorative Blur */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-accent opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Announcement Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs sm:text-sm font-medium text-primary mb-6 transition-colors hover:bg-primary/10">
          <Sparkles className="h-4 w-4" />
          <span>Award-winning digital agency of the year</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.1]">
          We craft digital experiences that{" "}
          <span className="bg-gradient-to-r from-primary via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            elevate brands
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          From high-converting web applications to end-to-end design systems, we build transformative software that drives measurable business outcomes.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="gap-2 px-8 h-12 text-base font-semibold shadow-lg shadow-primary/25">
            Book a Strategy Call <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="gap-2 px-6 h-12 text-base font-medium">
            <Play className="h-4 w-4 fill-current" /> Watch Showreel
          </Button>
        </div>

        {/* Social Proof & Avatar Overlap */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex -space-x-2.5 overflow-hidden">
            {displayAvatars.map((avatar, idx) => (
              <img
                key={idx}
                src={avatar.image}
                alt={`Client avatar ${idx + 1}`}
                className="inline-block h-10 w-10 rounded-full border-2 border-background object-cover shadow-sm"
                loading="lazy"
              />
            ))}
          </div>
          <div className="flex flex-col sm:items-start items-center">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-1 font-bold text-foreground text-sm">5.0</span>
            </div>
            <p className="text-xs sm:text-sm font-medium">Trusted by 250+ enterprise leaders worldwide</p>
          </div>
        </div>
      </div>
    </section>
  )
}
