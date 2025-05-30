import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// Create admin client for user creation
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json()

    // Validate input
    if (!email || !password || !username) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Check if username exists
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("username")
      .eq("username", username)
      .single()

    if (existingUser) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 })
    }

    // Create auth user using admin client
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
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
      const { error: profileError } = await supabaseAdmin.from("users").insert({
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
        // Try to clean up the auth user if profile creation fails
        await supabaseAdmin.auth.admin.deleteUser(data.user.id)
        return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, user: data.user })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
