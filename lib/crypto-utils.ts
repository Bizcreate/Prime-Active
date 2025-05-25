/**
 * Utility functions for cryptographic operations
 * This replaces the dependency on ethers/lib/utils
 */

/**
 * Generate a random hex string of specified length
 * @param length The length of the hex string (bytes)
 * @returns A random hex string
 */
export function randomHexString(length = 32): string {
  const bytes = new Uint8Array(length)
  if (typeof window !== "undefined" && window.crypto) {
    // Browser environment
    window.crypto.getRandomValues(bytes)
  } else {
    // Node.js environment or fallback
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256)
    }
  }
  return (
    "0x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  )
}

/**
 * Generate a mock transaction hash
 * @returns A random transaction hash string
 */
export function generateMockTxHash(): string {
  return randomHexString(32)
}

/**
 * Generate a unique ID with optional prefix
 * @param prefix Optional prefix for the ID
 * @returns A unique ID string
 */
export function generateUniqueId(prefix = ""): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 10)
  return `${prefix}${timestamp}${randomStr}`
}
