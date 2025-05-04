import type { DePINNetwork } from "./depin-types"

// Define EVM-based DePIN networks
export const evmDePINNetworks: DePINNetwork[] = [
  {
    id: "iotex",
    name: "IoTeX",
    description: "IoTeX is a blockchain platform for the Internet of Things (IoT).",
    tokenSymbol: "IOTX",
    tokenName: "IoTeX",
    logoUrl: "/iotex-logo.png",
    website: "https://iotex.io",
    category: "compute",
    status: "active",
  },
  {
    id: "helium-mobile",
    name: "Helium Mobile",
    description: "Helium Mobile is a decentralized wireless network for mobile devices.",
    tokenSymbol: "MOBILE",
    tokenName: "Helium Mobile Token",
    logoUrl: "/helium-mobile-logo.png",
    website: "https://helium.com",
    category: "other",
    status: "active",
  },
]

// Add the EVMDePINNetworks named export
// This should be added near the top of the file, after the imports but before other code

export const EVMDePINNetworks = evmDePINNetworks

// Get a network by ID
export function getEVMNetworkById(id: string): DePINNetwork | undefined {
  return evmDePINNetworks.find((network) => network.id === id)
}

// Get all active networks
export function getActiveEVMNetworks(): DePINNetwork[] {
  return evmDePINNetworks.filter((network) => network.status === "active")
}
