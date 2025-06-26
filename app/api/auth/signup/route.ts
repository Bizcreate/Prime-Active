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

    // Check if email already exists in auth.users
    const { data: existingAuthUser } = await supabaseAdmin.auth.admin.listUsers()
    const emailExists = existingAuthUser.users.some((user) => user.email === email)

    if (emailExists) {
      return NextResponse.json(
        {
          error: "An account with this email already exists. Please try logging in instead.",
          code: "EMAIL_EXISTS",
        },
        { status: 409 },
      )
    }

    // Check if username exists in profiles
    const { data: existingProfile } = await supabaseAdmin
      .from("users")
      .select("username")
      .eq("username", username)
      .single()

    if (existingProfile) {
      return NextResponse.json(
        {
          error: "This username is already taken. Please choose a different one.",
          code: "USERNAME_EXISTS",
        },
        { status: 409 },
      )
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

      // Handle specific Supabase auth errors
      if (error.message.includes("already been registered")) {
        return NextResponse.json(
          {
            error: "An account with this email already exists. Please try logging in instead.",
            code: "EMAIL_EXISTS",
          },
          { status: 409 },
        )
      }

      return NextResponse.json(
        {
          error: error.message || "Failed to create account",
          code: "AUTH_ERROR",
        },
        { status: 400 },
      )
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (profileError) {
        console.error("Profile error:", profileError)
        // Try to clean up the auth user if profile creation fails
        await supabaseAdmin.auth.admin.deleteUser(data.user.id)
        return NextResponse.json(
          {
            error: "Failed to create user profile. Please try again.",
            code: "PROFILE_ERROR",
          },
          { status: 500 },
        )
      }
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      message: "Account created successfully!",
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again.",
        code: "SERVER_ERROR",
      },
      { status: 500 },
    )
  }
}
