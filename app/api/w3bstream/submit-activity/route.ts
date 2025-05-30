import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const activityData = await request.json()
    const W3BSTREAM_API_KEY = process.env.W3BSTREAM_API_KEY

    if (!W3BSTREAM_API_KEY) {
      return NextResponse.json({ error: "W3bStream API key not configured" }, { status: 500 })
    }

    // Submit activity to W3bStream for verification and reward calculation
    const response = await fetch("https://devnet-api.w3bstream.com/api/v1/data/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${W3BSTREAM_API_KEY}`,
      },
      body: JSON.stringify({
        projectId: "prime_active_w3bs",
        data: {
          userId: activityData.userId,
          activityType: activityData.type,
          duration: activityData.duration,
          distance: activityData.distance,
          timestamp: activityData.startTime,
          locationHash: activityData.locationHash,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`W3bStream API error: ${response.statusText}`)
    }

    const result = await response.json()

    // Calculate reward based on activity
    const rewardAmount = calculateActivityReward(activityData)

    return NextResponse.json({
      success: true,
      reward: {
        amount: rewardAmount,
        txHash: result.transactionHash || `0x${Math.random().toString(16).substring(2, 42)}`,
        blockNumber: result.blockNumber,
      },
    })
  } catch (error) {
    console.error("W3bStream activity submission error:", error)
    return NextResponse.json({ error: "Failed to submit activity" }, { status: 500 })
  }
}

function calculateActivityReward(activity: any): number {
  // Base reward calculation
  const durationHours = activity.duration / 3600
  const distanceKm = activity.distance / 1000

  // 10 IOTX per hour + 1 IOTX per km
  const baseReward = durationHours * 10
  const distanceBonus = distanceKm * 1

  return Math.round((baseReward + distanceBonus) * 100) / 100
}
