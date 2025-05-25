// Define the EVM DePIN networks
export const EVMDePINNetworks = [
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
    chainId: 4689,
  },
  {
    id: "helium",
    name: "Helium Mobile",
    description: "Helium is a decentralized wireless network for IoT devices.",
    tokenSymbol: "MOBILE",
    tokenName: "Helium Mobile",
    logoUrl: "/helium-mobile-logo.png",
    website: "https://helium.com",
    category: "connectivity",
    status: "coming_soon",
    chainId: 1,
  },
  {
    id: "foam",
    name: "FOAM Protocol",
    description: "FOAM is a decentralized protocol for proof of location.",
    tokenSymbol: "FOAM",
    tokenName: "FOAM",
    logoUrl: "/foam-protocol-logo.png",
    website: "https://foam.space",
    category: "location",
    status: "active",
    chainId: 1,
  },
  {
    id: "fitmint",
    name: "Fitmint",
    description: "Fitmint is a move-to-earn platform that rewards physical activity.",
    tokenSymbol: "FITT",
    tokenName: "Fitmint",
    logoUrl: "/fitmint-logo.png",
    website: "https://fitmint.io",
    category: "fitness",
    status: "active",
    chainId: 137,
  },
]

// Export the networks by category
export const evmDePINNetworksByCategory = {
  compute: EVMDePINNetworks.filter((network) => network.category === "compute"),
  connectivity: EVMDePINNetworks.filter((network) => network.category === "connectivity"),
  location: EVMDePINNetworks.filter((network) => network.category === "location"),
  fitness: EVMDePINNetworks.filter((network) => network.category === "fitness"),
}

// Export the networks by status
export const evmDePINNetworksByStatus = {
  active: EVMDePINNetworks.filter((network) => network.status === "active"),
  coming_soon: EVMDePINNetworks.filter((network) => network.status === "coming_soon"),
}

// Export the networks by chain ID
export const evmDePINNetworksByChainId = EVMDePINNetworks.reduce(
  (acc, network) => {
    if (!acc[network.chainId]) {
      acc[network.chainId] = []
    }
    acc[network.chainId].push(network)
    return acc
  },
  {} as Record<number, typeof EVMDePINNetworks>,
)

// Export the networks by ID
export const evmDePINNetworksById = EVMDePINNetworks.reduce(
  (acc, network) => {
    acc[network.id] = network
    return acc
  },
  {} as Record<string, (typeof EVMDePINNetworks)[0]>,
)

// Export the default networks
export const evmDePINNetworks = EVMDePINNetworks
