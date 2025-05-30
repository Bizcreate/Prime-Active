import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()
    const IOTEX_RPC_URL = process.env.IOTEX_RPC_URL
    const IOTEX_PRIVATE_KEY = process.env.IOTEX_PRIVATE_KEY

    if (!IOTEX_RPC_URL || !IOTEX_PRIVATE_KEY) {
      return NextResponse.json({ error: "IoTeX credentials not configured" }, { status: 500 })
    }

    // Initialize IoTeX connection
    const response = await fetch(IOTEX_RPC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "iotex_getChainMeta",
        params: [],
        id: 1,
      }),
    })

    if (!response.ok) {
      throw new Error(`IoTeX RPC error: ${response.statusText}`)
    }

    const chainData = await response.json()

    // Store mining activation in database
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Insert DePIN node record
    const { error: dbError } = await supabase.from("depin_nodes").insert({
      user_id: userId,
      network_name: "iotex",
      node_id: `iotex_${userId}_${Date.now()}`,
      node_type: "activity_miner",
      status: "active",
      configuration: {
        rpc_url: IOTEX_RPC_URL,
        chain_id: chainData.result?.chainID || 4689,
        activated_at: new Date().toISOString(),
      },
    })

    if (dbError) {
      console.error("Database error:", dbError)
    }

    return NextResponse.json({
      success: true,
      message: "IoTeX mining activated",
      chainId: chainData.result?.chainID,
      blockHeight: chainData.result?.height,
    })
  } catch (error) {
    console.error("IoTeX mining activation error:", error)
    return NextResponse.json({ error: "Failed to activate IoTeX mining" }, { status: 500 })
  }
}
