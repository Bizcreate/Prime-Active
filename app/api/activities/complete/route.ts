import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { activityId, userId, type, startTime, endTime, distance, steps, calories, locations, deviceInfo } = data

    // Validate required fields
    if (!activityId || !userId || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate duration in seconds
    const durationSeconds = Math.round((endTime - startTime) / 1000)

    // In a real implementation, you would:
    // 1. Store the completed activity in your database
    // 2. Process any achievements or rewards
    // 3. Update user statistics
    // 4. Generate activity summary

    console.log("Activity completed:", {
      activityId,
      userId,
      type,
      duration: `${durationSeconds} seconds`,
      distance: `${distance.toFixed(2)} km`,
      steps,
      calories: `${Math.round(calories)} cal`,
      locationPoints: locations?.length || 0,
    })

    // For now, we'll just return success with some mock achievements
    return NextResponse.json({
      success: true,
      message: "Activity completed successfully",
      summary: {
        duration: durationSeconds,
        distance,
        steps,
        calories: Math.round(calories),
      },
      achievements: [
        {
          id: "first_activity",
          name: "First Steps",
          description: "Complete your first activity",
          unlocked: true,
        },
        {
          id: `${type}_lover`,
          name: `${type.charAt(0).toUpperCase() + type.slice(1)} Enthusiast`,
          description: `Complete a ${type} activity`,
          unlocked: true,
        },
      ],
    })
  } catch (error) {
    console.error("Error completing activity:", error)
    return NextResponse.json({ error: "Failed to complete activity" }, { status: 500 })
  }
}
