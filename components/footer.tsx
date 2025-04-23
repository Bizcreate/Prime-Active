import Link from "next/link"
import { Github, Twitter, DiscIcon as Discord, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">CryptoMine</h3>
            <p className="text-sm text-zinc-400">
              A revolutionary platform for mining and staking cryptocurrency without initial investment.
            </p>
            <div className="mt-4 flex gap-4">
              <Link href="#" className="text-zinc-500 hover:text-primary">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-primary">
                <Discord className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Resources</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="#" className="hover:text-primary">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Whitepaper
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  GitHub Repository
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Community Forum
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Company</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="#" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Press
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Legal</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="#" className="hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Compliance
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-800 pt-8 text-center text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} CryptoMine. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
