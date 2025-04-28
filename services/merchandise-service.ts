// Merchandise Service
// This service handles merchandise data and operations

export interface MerchandiseProduct {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  bananaPoints: number
  rating: number
  reviews: number
  variants: {
    id: string
    name: string
    inStock: boolean
  }[]
  hasNFC: boolean
  featured?: boolean
  isLimited?: boolean
  isNew?: boolean
}

class MerchandiseService {
  private products: MerchandiseProduct[] = []

  constructor() {
    this.initializeProducts()
  }

  private initializeProducts() {
    this.products = [
      {
        id: "product1",
        name: "PMBC Classic T-Shirt",
        description: "Classic black t-shirt with Prime Mates Board Club logo. Made from 100% organic cotton.",
        price: 29.99,
        images: ["/pmbc-tshirt-black.png"],
        category: "apparel",
        bananaPoints: 200,
        rating: 4.8,
        reviews: 42,
        variants: [
          { id: "var1", name: "S", inStock: true },
          { id: "var2", name: "M", inStock: true },
          { id: "var3", name: "L", inStock: true },
          { id: "var4", name: "XL", inStock: true },
          { id: "var5", name: "XXL", inStock: false },
        ],
        hasNFC: true,
        featured: true,
      },
      {
        id: "product2",
        name: "PMBC Pink Snapback",
        description: "Iconic pink snapback cap with embroidered Prime Mates Board Club logo. As seen on #420.",
        price: 34.99,
        images: ["/pmbc-pink-cap.png"],
        category: "apparel",
        bananaPoints: 150,
        rating: 4.9,
        reviews: 27,
        variants: [{ id: "var6", name: "One Size", inStock: true }],
        hasNFC: true,
        isNew: true,
      },
      {
        id: "product3",
        name: "PMBC Premium Hoodie",
        description: "Premium black hoodie with Prime Mates Board Club logo. Perfect for post-session warmth.",
        price: 69.99,
        images: ["/pmbc-black-hoodie.png"],
        category: "apparel",
        bananaPoints: 300,
        rating: 4.7,
        reviews: 35,
        variants: [
          { id: "var7", name: "S", inStock: true },
          { id: "var8", name: "M", inStock: true },
          { id: "var9", name: "L", inStock: true },
          { id: "var10", name: "XL", inStock: true },
          { id: "var11", name: "XXL", inStock: false },
        ],
        hasNFC: true,
      },
      {
        id: "product4",
        name: "PMBC Varsity Jacket",
        description: "Limited edition varsity jacket with Prime Mates Board Club patches. A collector's item.",
        price: 129.99,
        images: ["/pmbc-varsity-jacket.png"],
        category: "apparel",
        bananaPoints: 500,
        rating: 4.9,
        reviews: 18,
        variants: [
          { id: "var12", name: "S", inStock: true },
          { id: "var13", name: "M", inStock: true },
          { id: "var14", name: "L", inStock: true },
          { id: "var15", name: "XL", inStock: true },
          { id: "var16", name: "XXL", inStock: false },
        ],
        hasNFC: true,
        isLimited: true,
      },
      {
        id: "product5",
        name: "PMBC Skateboard Deck",
        description: "Professional-grade skateboard deck featuring exclusive Prime Mates Board Club artwork.",
        price: 79.99,
        images: ["/pmbc-skateboard-deck.png"],
        category: "skate",
        bananaPoints: 350,
        rating: 4.8,
        reviews: 31,
        variants: [
          { id: "var17", name: '7.75"', inStock: true },
          { id: "var18", name: '8.0"', inStock: true },
          { id: "var19", name: '8.25"', inStock: true },
          { id: "var20", name: '8.5"', inStock: false },
        ],
        hasNFC: true,
        featured: true,
      },
      {
        id: "product6",
        name: "PMBC Bone Shaka T-Shirt",
        description: "Black t-shirt with Prime Mates bone shaka design. Est. 2022 edition.",
        price: 32.99,
        images: ["/prime-mates-boneshaka.webp"],
        category: "apparel",
        bananaPoints: 220,
        rating: 4.8,
        reviews: 31,
        variants: [
          { id: "var21", name: "S", inStock: true },
          { id: "var22", name: "M", inStock: true },
          { id: "var23", name: "L", inStock: true },
          { id: "var24", name: "XL", inStock: true },
          { id: "var25", name: "XXL", inStock: true },
        ],
        hasNFC: true,
      },
      {
        id: "product7",
        name: "PMBC Red/Black Snapback",
        description: "Stylish black and red snapback with embroidered PMBC logo. Perfect for sunny days at the park.",
        price: 27.99,
        images: ["/pmbc-red-black-cap.jpeg"],
        category: "apparel",
        bananaPoints: 180,
        rating: 4.7,
        reviews: 23,
        variants: [{ id: "var26", name: "One Size", inStock: true }],
        hasNFC: true,
      },
      {
        id: "product8",
        name: "Skatepark Desk Mat",
        description:
          "Large desk mat featuring a colorful skatepark scene. Perfect for your home office or gaming setup.",
        price: 34.99,
        images: ["/skatepark-desk-mat.png"],
        category: "accessories",
        bananaPoints: 250,
        rating: 4.9,
        reviews: 18,
        variants: [
          { id: "var27", name: "Standard (900x400mm)", inStock: true },
          { id: "var28", name: "XL (1200x600mm)", inStock: false },
        ],
        hasNFC: false,
      },
      {
        id: "product9",
        name: "Prime Grunge T-Shirt",
        description: "White t-shirt with graffiti-style monkey and skateboard design. Limited edition.",
        price: 34.99,
        images: ["/prime-grunge-tshirt.png"],
        category: "apparel",
        bananaPoints: 230,
        rating: 4.8,
        reviews: 29,
        variants: [
          { id: "var29", name: "S", inStock: true },
          { id: "var30", name: "M", inStock: true },
          { id: "var31", name: "L", inStock: true },
          { id: "var32", name: "XL", inStock: true },
          { id: "var33", name: "XXL", inStock: false },
        ],
        hasNFC: true,
        isLimited: true,
      },
      {
        id: "product10",
        name: "Banana Barrel Surf Wax",
        description: "Premium surf wax with banana scent. Provides excellent grip in all water temperatures.",
        price: 12.99,
        images: ["/banana-surf-wax.png"],
        category: "surf",
        bananaPoints: 100,
        rating: 4.9,
        reviews: 36,
        variants: [
          { id: "var34", name: "Cold Water", inStock: true },
          { id: "var35", name: "Cool Water", inStock: true },
          { id: "var36", name: "Warm Water", inStock: true },
          { id: "var37", name: "Tropical Water", inStock: true },
        ],
        hasNFC: false,
      },
      // New products
      {
        id: "product11",
        name: "PMBC Classic Jumper",
        description:
          "Black crewneck sweatshirt with Prime Mates logo on front and sleeve. Premium quality cotton blend.",
        price: 59.99,
        images: ["/pmbc-black-jumper.png"],
        category: "apparel",
        bananaPoints: 250,
        rating: 4.9,
        reviews: 24,
        variants: [
          { id: "var38", name: "S", inStock: true },
          { id: "var39", name: "M", inStock: true },
          { id: "var40", name: "L", inStock: true },
          { id: "var41", name: "XL", inStock: true },
          { id: "var42", name: "XXL", inStock: false },
        ],
        hasNFC: true,
        isNew: true,
      },
      {
        id: "product12",
        name: "PMBC Logo T-Shirt",
        description: "Simple black t-shirt with Prime Mates logo. A classic addition to any boarder's wardrobe.",
        price: 32.99,
        images: ["/pmbc-black-tshirt.png"],
        category: "apparel",
        bananaPoints: 180,
        rating: 4.8,
        reviews: 19,
        variants: [
          { id: "var43", name: "S", inStock: true },
          { id: "var44", name: "M", inStock: true },
          { id: "var45", name: "L", inStock: true },
          { id: "var46", name: "XL", inStock: true },
          { id: "var47", name: "XXL", inStock: true },
        ],
        hasNFC: true,
      },
      {
        id: "product13",
        name: "PMBC Classic Snapback",
        description: "Original black snapback hat with the full Prime Mates Board Club logo. One size fits most.",
        price: 29.99,
        images: ["/pmbc-classic-snapback.png"],
        category: "apparel",
        bananaPoints: 150,
        rating: 4.7,
        reviews: 32,
        variants: [{ id: "var48", name: "One Size", inStock: true }],
        hasNFC: true,
      },
      {
        id: "product14",
        name: "PMBC Banana Shaka Dad Hat",
        description: "Soft pink dad hat with embroidered banana shaka logo. Comfortable and perfect for sunny days.",
        price: 27.99,
        images: ["/pmbc-pink-dad-hat.png"],
        category: "apparel",
        bananaPoints: 140,
        rating: 4.9,
        reviews: 15,
        variants: [{ id: "var49", name: "One Size", inStock: true }],
        hasNFC: true,
        isNew: true,
      },
      {
        id: "product15",
        name: "Prime Threads Hoodie",
        description: "Black hoodie with iridescent 'Prime Threads' logo and banana emblems on the sleeves.",
        price: 69.99,
        images: ["/pmbc-prime-threads-hoodie.png"],
        category: "apparel",
        bananaPoints: 300,
        rating: 5.0,
        reviews: 12,
        variants: [
          { id: "var50", name: "S", inStock: true },
          { id: "var51", name: "M", inStock: true },
          { id: "var52", name: "L", inStock: true },
          { id: "var53", name: "XL", inStock: true },
          { id: "var54", name: "XXL", inStock: false },
        ],
        hasNFC: true,
        isLimited: true,
      },
      {
        id: "product16",
        name: "Don't Fade! Tee",
        description:
          "Vibrant green t-shirt featuring a smoking monkey design and 'Don't Fade!' slogan. Perfect for the session.",
        price: 34.99,
        images: ["/pmbc-green-dont-fade-tshirt.png"],
        category: "apparel",
        bananaPoints: 200,
        rating: 4.8,
        reviews: 22,
        variants: [
          { id: "var55", name: "S", inStock: true },
          { id: "var56", name: "M", inStock: true },
          { id: "var57", name: "L", inStock: true },
          { id: "var58", name: "XL", inStock: true },
          { id: "var59", name: "XXL", inStock: false },
        ],
        hasNFC: true,
        featured: true,
      },
      {
        id: "product17",
        name: "PMBC Pink Brim Snapback",
        description: "Black snapback with pink brim and bold PMBC logo. Makes a statement at the skatepark.",
        price: 32.99,
        images: ["/pmbc-black-pink-snapback.png"],
        category: "apparel",
        bananaPoints: 160,
        rating: 4.6,
        reviews: 18,
        variants: [{ id: "var60", name: "One Size", inStock: true }],
        hasNFC: true,
      },
      {
        id: "product18",
        name: "PMBC Two-Tone Snapback",
        description: "Black and gray snapback with distressed 'Prime Mates' logo. Street style approved.",
        price: 31.99,
        images: ["/pmbc-black-gray-snapback.png"],
        category: "apparel",
        bananaPoints: 155,
        rating: 4.7,
        reviews: 16,
        variants: [{ id: "var61", name: "One Size", inStock: true }],
        hasNFC: true,
      },
      {
        id: "product19",
        name: "PMBC All Black Snapback",
        description:
          "All black snapback with 'Prime Mates Board Club' embroidery. A sleek, minimal choice for any outfit.",
        price: 29.99,
        images: ["/pmbc-all-black-snapback.png"],
        category: "apparel",
        bananaPoints: 150,
        rating: 4.8,
        reviews: 21,
        variants: [{ id: "var62", name: "One Size", inStock: true }],
        hasNFC: true,
      },
    ]
  }

  getAllProducts(): MerchandiseProduct[] {
    return this.products
  }

  getProductById(id: string): MerchandiseProduct | undefined {
    return this.products.find((product) => product.id === id)
  }

  getFeaturedProducts(): MerchandiseProduct[] {
    return this.products.filter((product) => product.featured)
  }

  getNewProducts(): MerchandiseProduct[] {
    return this.products.filter((product) => product.isNew)
  }

  getLimitedProducts(): MerchandiseProduct[] {
    return this.products.filter((product) => product.isLimited)
  }

  getProductsByCategory(category: string): MerchandiseProduct[] {
    return this.products.filter((product) => product.category === category)
  }

  searchProducts(query: string): MerchandiseProduct[] {
    const lowercaseQuery = query.toLowerCase()
    return this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery),
    )
  }

  addProduct(product: MerchandiseProduct): void {
    this.products.push(product)
  }

  updateProduct(updatedProduct: MerchandiseProduct): boolean {
    const index = this.products.findIndex((p) => p.id === updatedProduct.id)
    if (index !== -1) {
      this.products[index] = updatedProduct
      return true
    }
    return false
  }

  deleteProduct(id: string): boolean {
    const initialLength = this.products.length
    this.products = this.products.filter((p) => p.id !== id)
    return this.products.length < initialLength
  }
}

// Create a singleton instance
export const merchandiseService = new MerchandiseService()
