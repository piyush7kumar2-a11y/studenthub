"use client"

import * as React from "react"

export interface BrandList {
  image: string
  lightimg?: string
  name: string
}

export interface BrandSliderProps {
  brandList?: BrandList[]
}

export default function BrandSlider({ brandList = [] }: BrandSliderProps) {
  // If logos fail to load or are empty, provide fallback
  const brands = brandList.length > 0 ? brandList : [
    { name: "Acme Corp", image: "https://cdn.21st.dev/assets/localized/d824c259df6b2b2962fbef96e68a6877cab689b19246e3dc34ac9e7b144d32bd.svg" },
    { name: "GlobalTech", image: "https://cdn.21st.dev/assets/localized/266083df0c7d0633f145889af4700d18e62b8f2c068fd8ab73d5a94b87a5a5cb.svg" },
    { name: "NextWave", image: "https://cdn.21st.dev/assets/localized/91d1c562d12ba69aa7525d3782c6c6223b90e302073d59769dfce665ab9a83b7.svg" },
    { name: "Innovate", image: "https://cdn.21st.dev/assets/localized/f50b06ae2b7bf86d199b0ac986a47442f4a198d2f6dd81a9fe83c43022608498.svg" },
    { name: "Vanguard", image: "https://cdn.21st.dev/assets/localized/3ad67ddda671655df765a507c9bcc7b67e4138a1ffe903ace17cef99c5c972a3.svg" },
  ]

  return (
    <section className="py-12 border-y bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-8">
          Powering the world's most ambitious tech companies
        </p>
        
        {/* Brand Logos Row */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 opacity-75">
          {brands.map((brand, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center grayscale transition-all duration-200 hover:grayscale-0 hover:opacity-100 hover:scale-105"
            >
              {brand.image ? (
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="h-8 w-auto max-w-[120px] object-contain dark:invert"
                  onError={(e) => {
                    // Fallback to text badge if image fails to load
                    const target = e.currentTarget
                    target.style.display = 'none'
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = 'block'
                    }
                  }}
                />
              ) : null}
              <span className="hidden text-sm font-bold text-muted-foreground">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export { BrandSlider }
