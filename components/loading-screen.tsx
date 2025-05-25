import Image from "next/image"

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      <Image
        src="/prime-mates-logo.png"
        alt="Prime Mates Board Club"
        width={200}
        height={100}
        className="object-contain mb-8"
      />
      <div className="w-16 h-16 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
    </div>
  )
}
