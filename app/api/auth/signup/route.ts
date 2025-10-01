import { createServerSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json()

    const supabase = createServerSupabaseClient()

    // Check if username exists
    const { data: existingUser } = await supabase.from("users").select("username").eq("username", username).single()

    if (existingUser) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 })
    }

    // Create auth user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username },
    })

    if (error) {
      console.error("Auth error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Create user profile
    if (data.user) {
      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        username,
        email,
        full_name: "",
        wallet_address: null,
        banana_points: 0,
        shaka_tokens: 0,
        board_club_level: 1,
        has_prime_mate_nft: false,
      })

      if (profileError) {
        console.error("Profile error:", profileError)
        return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
