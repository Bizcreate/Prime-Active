import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Only use the server-side MAPBOX_TOKEN environment variable
    const token = process.env.MAPBOX_TOKEN

    if (!token) {
      console.error("MAPBOX_TOKEN environment variable is not set")
      return NextResponse.json({ error: "Mapbox token not configured" }, { status: 500 })
    }

    // Return the token
    return NextResponse.json({ token })
  } catch (error) {
    console.error("Error in mapbox-token API route:", error)
    return NextResponse.json({ error: "Failed to retrieve Mapbox token" }, { status: 500 })
  }
}
