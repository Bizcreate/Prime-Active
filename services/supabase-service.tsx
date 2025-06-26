import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface ActivityData {
  id?: string
  user_id: string
  title: string
  activity_type: string
  start_time: string
  end_time?: string
  duration_minutes?: number
  distance_km?: number
  steps?: number
  calories_burned?: number
  banana_points_earned?: number
  shaka_tokens_earned?: number
  activity_data?: any
  location_data?: any
  verification_method?: string
  is_verified?: boolean
  photos?: string[]
}

export async function saveActivityToSupabase(activityData: ActivityData) {
  try {
    const { data, error } = await supabase.from("activities").insert([activityData]).select().single()

    if (error) {
      console.error("Supabase error:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error("Error saving activity:", error)
    throw error
  }
}

export async function updateActivityInSupabase(id: string, updates: Partial<ActivityData>) {
  try {
    const { data, error } = await supabase.from("activities").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Supabase error:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error("Error updating activity:", error)
    throw error
  }
}

export async function getUserActivities(userId: string) {
  try {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("Error fetching activities:", error)
    throw error
  }
}

export async function saveDepinReward(rewardData: {
  user_id: string
  network_name: string
  reward_type: string
  amount: number
  token_symbol: string
  activity_id?: string
  transaction_hash?: string
}) {
  try {
    const { data, error } = await supabase.from("depin_rewards").insert([rewardData]).select().single()

    if (error) {
      console.error("Supabase error:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error("Error saving DePIN reward:", error)
    throw error
  }
}

export async function getUserTokens(userId: string) {
  try {
    const { data, error } = await supabase.from("users").select("banana_points, shaka_tokens").eq("id", userId).single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found"
      console.error("Supabase error:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    return data || { banana_points: 0, shaka_tokens: 0 }
  } catch (error) {
    console.error("Error fetching user tokens:", error)
    return { banana_points: 0, shaka_tokens: 0 }
  }
}

export default {
  saveActivityToSupabase,
  updateActivityInSupabase,
  getUserActivities,
  saveDepinReward,
  getUserTokens,
}
