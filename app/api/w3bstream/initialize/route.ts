import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()
    const W3BSTREAM_API_KEY = process.env.W3BSTREAM_API_KEY

    if (!W3BSTREAM_API_KEY) {
      return NextResponse.json({ error: "W3bStream API key not configured" }, { status: 500 })
    }

    // Initialize W3bStream project for user
    const response = await fetch("https://devnet-api.w3bstream.com/api/v1/project/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${W3BSTREAM_API_KEY}`,
      },
      body: JSON.stringify({
        userId,
        projectId: "prime_active_w3bs",
        version: "1.0.3",
      }),
    })

    if (!response.ok) {
      throw new Error(`W3bStream API error: ${response.statusText}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("W3bStream initialization error:", error)
    return NextResponse.json({ error: "Failed to initialize W3bStream" }, { status: 500 })
  }
}
