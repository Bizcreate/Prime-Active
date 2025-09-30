export const config = {
  app: {
    name: "Prime Active",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  apis: {
    iotex: {
      rpcUrl: process.env.IOTEX_RPC_URL,
      privateKey: process.env.IOTEX_PRIVATE_KEY,
    },
    myst: {
      apiKey: process.env.MYST_API_KEY,
    },
  },
  features: {
    enableDePIN: process.env.NODE_ENV === "production",
    enableAnalytics: process.env.NODE_ENV === "production",
    enableErrorReporting: process.env.NODE_ENV === "production",
  },
}

// Validate required environment variables
export const validateConfig = () => {
  const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }
}
