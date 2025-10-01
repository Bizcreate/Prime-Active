import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const activityData = await request.json()
    const IOTEX_RPC_URL = process.env.IOTEX_RPC_URL

    if (!IOTEX_RPC_URL) {
      return NextResponse.json({ error: "IoTeX RPC URL not configured" }, { status: 500 })
    }

    // Calculate reward based on activity
    const rewardAmount = calculateActivityReward(activityData)

    // Store reward in database
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data: reward, error } = await supabase
      .from("depin_rewards")
      .insert({
        user_id: activityData.userId,
        network_name: "iotex",
        reward_type: "activity_mining",
        amount: rewardAmount,
        token_symbol: "IOTX",
        activity_id: activityData.activityId,
        transaction_hash: `0x${Math.random().toString(16).substring(2, 42)}`, // Mock for now
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    // Update user's total tokens
    await supabase.rpc("increment_user_tokens", {
      user_id: activityData.userId,
      token_amount: rewardAmount,
    })

    return NextResponse.json({
      success: true,
      reward: {
        amount: rewardAmount,
        txHash: reward.transaction_hash,
        tokenSymbol: "IOTX",
      },
    })
  } catch (error) {
    console.error("IoTeX activity submission error:", error)
    return NextResponse.json({ error: "Failed to submit activity" }, { status: 500 })
  }
}

function calculateActivityReward(activity: any): number {
  const durationHours = activity.duration / 60 // Convert minutes to hours
  const distanceKm = activity.distance || 0

  // Base reward: 0.5 IOTX per hour + 0.1 IOTX per km
  const baseReward = durationHours * 0.5
  const distanceBonus = distanceKm * 0.1

  return Math.round((baseReward + distanceBonus) * 1000) / 1000 // Round to 3 decimals
}
