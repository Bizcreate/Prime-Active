import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Only use the server-side MAPBOX_TOKEN environment variable
    const token = process.env.MAPBOX_TOKEN

    if (!token) {
      console.warn("MAPBOX_TOKEN environment variable is not set")
      // Return a mock token for preview environments
      return NextResponse.json({
        token: "mock-token-for-preview",
        isPreview: true,
      })
    }

    // Return the token
    return NextResponse.json({ token })
  } catch (error) {
    console.error("Error in mapbox-token API route:", error)
    return NextResponse.json(
      {
        error: "Failed to retrieve Mapbox token",
        isPreview: true,
        token: "mock-token-for-preview",
      },
      { status: 200 },
    ) // Return 200 to prevent cascading errors
  }
}
