import { NextResponse } from 'next/server'

export const revalidate = 1800 // cache 30 minutes

const TROY_OZ_TO_GRAM = 31.1035

export async function GET() {
  try {
    const res = await fetch('https://api.metals.live/v1/spot/gold', {
      next: { revalidate: 1800 },
    })

    if (!res.ok) throw new Error('API error')

    const data = await res.json()
    // Response: [{ "gold": 3400.50 }]  — price in USD per troy ounce
    const pricePerTroyOz: number = Array.isArray(data) ? data[0]?.gold : data?.gold

    if (!pricePerTroyOz) throw new Error('No price data')

    const pricePerGram24KT = pricePerTroyOz / TROY_OZ_TO_GRAM
    const pricePerGram22KT = pricePerGram24KT * (22 / 24)
    const pricePerGram18KT = pricePerGram24KT * (18 / 24)

    return NextResponse.json({
      pricePerGram22KT: Math.round(pricePerGram22KT * 100) / 100,
      pricePerGram24KT: Math.round(pricePerGram24KT * 100) / 100,
      pricePerGram18KT: Math.round(pricePerGram18KT * 100) / 100,
      updatedAt: new Date().toISOString(),
    })
  } catch {
    // Fallback to approximate rate if API fails
    return NextResponse.json({
      pricePerGram22KT: 91.50,
      pricePerGram24KT: 99.82,
      pricePerGram18KT: 74.87,
      updatedAt: new Date().toISOString(),
      isFallback: true,
    })
  }
}
