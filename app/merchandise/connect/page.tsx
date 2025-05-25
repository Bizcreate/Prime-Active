"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function MerchandiseConnectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/merch")
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <p>Redirecting to Merch page...</p>
    </div>
  )
}
