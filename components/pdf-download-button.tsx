"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface PDFDownloadButtonProps {
  className?: string
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
  children?: React.ReactNode
}

export function PDFDownloadButton({
  className,
  variant = "default",
  size = "default",
  children,
}: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generateAndDownloadPDF = async () => {
    setIsGenerating(true)

    try {
      // Dynamic import to ensure this only runs on the client
      const { Document, Page, Text, View, StyleSheet, pdf } = await import("@react-pdf/renderer")

      // Create styles for the PDF
      const styles = StyleSheet.create({
        page: {
          flexDirection: "column",
          backgroundColor: "#1e293b",
          padding: 30,
          color: "#ffffff",
        },
        header: {
          marginBottom: 20,
          textAlign: "center",
          borderBottom: "2px solid #7c3aed",
          paddingBottom: 15,
        },
        title: {
          fontSize: 32,
          fontWeight: "bold",
          marginBottom: 10,
          color: "#7c3aed",
        },
        subtitle: {
          fontSize: 16,
          color: "#cbd5e1",
          marginBottom: 5,
        },
        section: {
          marginBottom: 20,
        },
        sectionTitle: {
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 10,
          color: "#7c3aed",
          borderBottom: "1px solid #475569",
          paddingBottom: 5,
        },
        paragraph: {
          fontSize: 12,
          lineHeight: 1.5,
          marginBottom: 10,
          color: "#e2e8f0",
        },
        bulletPoint: {
          fontSize: 11,
          marginBottom: 5,
          marginLeft: 15,
          color: "#cbd5e1",
        },
        highlight: {
          backgroundColor: "#7c3aed",
          color: "#ffffff",
          padding: 5,
          borderRadius: 3,
          fontSize: 11,
          marginBottom: 10,
        },
        table: {
          display: "flex",
          flexDirection: "column",
          marginBottom: 15,
        },
        tableRow: {
          flexDirection: "row",
          borderBottom: "1px solid #475569",
          paddingVertical: 8,
        },
        tableCell: {
          flex: 1,
          fontSize: 11,
          color: "#e2e8f0",
        },
        tableHeader: {
          flex: 1,
          fontSize: 12,
          fontWeight: "bold",
          color: "#7c3aed",
        },
        footer: {
          position: "absolute",
          bottom: 30,
          left: 30,
          right: 30,
          textAlign: "center",
          fontSize: 10,
          color: "#64748b",
          borderTop: "1px solid #475569",
          paddingTop: 10,
        },
        pageNumber: {
          position: "absolute",
          bottom: 10,
          right: 30,
          fontSize: 10,
          color: "#64748b",
        },
      })

      // PDF Document Component
      const PrimeXWatchRoadmapPDF = () =>
        Document.createElement(
          Document,
          null,
          // Page 1: Cover & Executive Summary
          Document.createElement(
            Page,
            { size: "A4", style: styles.page },
            Document.createElement(
              View,
              { style: styles.header },
              Document.createElement(Text, { style: styles.title }, "PrimeX Watch Roadmap"),
              Document.createElement(Text, { style: styles.subtitle }, "Partnership Development Plan"),
              Document.createElement(Text, { style: styles.subtitle }, "Revolutionizing Action Sports Tracking"),
            ),

            Document.createElement(
              View,
              { style: styles.section },
              Document.createElement(Text, { style: styles.sectionTitle }, "Executive Summary"),
              Document.createElement(
                Text,
                { style: styles.paragraph },
                "This roadmap outlines the development plan for PrimeX Watch, a strategic partnership between Prime Mates Board Club (PMBC) and WatchX to create the first specialized wearable technology platform for action sports enthusiasts, integrating a Web3 move-to-earn concept.",
              ),

              Document.createElement(
                View,
                { style: styles.highlight },
                Document.createElement(
                  Text,
                  null,
                  "Partnership Opportunity: Strategic collaboration to dominate the action sports wearables market with Web3 integration",
                ),
              ),

              Document.createElement(
                Text,
                { style: styles.paragraph },
                "Market Size: $2.8B action sports market with 45M+ active participants and 15% annual growth rate.",
              ),

              Document.createElement(
                Text,
                { style: styles.paragraph },
                "Value Proposition: Combine WatchX's advanced hardware with PMBC's specialized software for snowboarding, skateboarding, surfing, BMX, and other action sports, enhanced by multi-chain integration (Bitcoin, Kaspa, IoTeX, Dogecoin, B² Network, TON).",
              ),

              Document.createElement(
                Text,
                { style: styles.paragraph },
                "Key Benefits: Market expansion, revenue growth, technological innovation, first-mover advantage in action sports wearables, and integration with the Prime Mates Board Club community.",
              ),
            ),

            Document.createElement(
              View,
              { style: styles.section },
              Document.createElement(Text, { style: styles.sectionTitle }, "Development Timeline"),
              Document.createElement(
                Text,
                { style: styles.paragraph },
                "The PrimeX Watch development follows an accelerated roadmap from June to October 2025, with Genesis Edition launch in September.",
              ),

              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• June 2025: Partnership finalization and technical specifications",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• July 2025: MVP development and API integration",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• August 2025: Closed beta with Prime Mates NFT holders",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• September 2025: Genesis Edition launch and public rollout",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• October 2025: Scaling, events, and community features",
              ),
            ),

            Document.createElement(Text, {
              style: styles.pageNumber,
              render: ({ pageNumber }) => `Page ${pageNumber}`,
            }),
          ),

          // Page 2: Community & Tokenomics
          Document.createElement(
            Page,
            { size: "A4", style: styles.page },
            Document.createElement(
              View,
              { style: styles.section },
              Document.createElement(Text, { style: styles.sectionTitle }, "Prime Mates Community Metrics"),

              Document.createElement(
                View,
                { style: styles.table },
                Document.createElement(
                  View,
                  { style: styles.tableRow },
                  Document.createElement(Text, { style: styles.tableHeader }, "Metric"),
                  Document.createElement(Text, { style: styles.tableHeader }, "Value"),
                  Document.createElement(Text, { style: styles.tableHeader }, "Engagement"),
                ),
                Document.createElement(
                  View,
                  { style: styles.tableRow },
                  Document.createElement(Text, { style: styles.tableCell }, "NFT Holders"),
                  Document.createElement(Text, { style: styles.tableCell }, "8,888"),
                  Document.createElement(Text, { style: styles.tableCell }, "87% retention"),
                ),
                Document.createElement(
                  View,
                  { style: styles.tableRow },
                  Document.createElement(Text, { style: styles.tableCell }, "Daily Active Users"),
                  Document.createElement(Text, { style: styles.tableCell }, "92%"),
                  Document.createElement(Text, { style: styles.tableCell }, "High engagement"),
                ),
                Document.createElement(
                  View,
                  { style: styles.tableRow },
                  Document.createElement(Text, { style: styles.tableCell }, "Discord Members"),
                  Document.createElement(Text, { style: styles.tableCell }, "45K"),
                  Document.createElement(Text, { style: styles.tableCell }, "Active community"),
                ),
                Document.createElement(
                  View,
                  { style: styles.tableRow },
                  Document.createElement(Text, { style: styles.tableCell }, "Trading Volume"),
                  Document.createElement(Text, { style: styles.tableCell }, "$2.3M"),
                  Document.createElement(Text, { style: styles.tableCell }, "Strong market"),
                ),
              ),
            ),

            Document.createElement(
              View,
              { style: styles.section },
              Document.createElement(Text, { style: styles.sectionTitle }, "Tokenomics Breakdown"),

              Document.createElement(
                View,
                { style: styles.highlight },
                Document.createElement(Text, null, "Daily Activity Rewards"),
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Kaspa (KAS): 0.5-2.0 KAS/day based on step thresholds",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• IoTeX (IOTX): 10-50 IOTX/km with distance tracking",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Dogecoin (DOGE): 0.1-1.0 DOGE/day with streak bonuses",
              ),

              Document.createElement(
                View,
                { style: styles.highlight },
                Document.createElement(Text, null, "Premium & Mining Rewards"),
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Bitcoin (BTC): 0.00001-0.0001 BTC via virtual mining",
              ),
              Document.createElement(Text, { style: styles.bulletPoint }, "• TON: 0.1-5.0 TON for premium challenges"),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Prime Token: 100-1000 PRIME for referrals and governance",
              ),
            ),

            Document.createElement(Text, {
              style: styles.pageNumber,
              render: ({ pageNumber }) => `Page ${pageNumber}`,
            }),
          ),

          // Page 3: Technical Architecture & Revenue Model
          Document.createElement(
            Page,
            { size: "A4", style: styles.page },
            Document.createElement(
              View,
              { style: styles.section },
              Document.createElement(Text, { style: styles.sectionTitle }, "Technical Architecture"),

              Document.createElement(
                Text,
                { style: styles.paragraph },
                "The PrimeX Watch integrates WatchX hardware with PMBC software through a multi-chain blockchain architecture, supporting offline functionality and real-time reward distribution.",
              ),

              Document.createElement(
                View,
                { style: styles.highlight },
                Document.createElement(Text, null, "Data Flow: Watch → App → Blockchain APIs"),
              ),

              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Sensor data collection from PrimeX Watch hardware",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Prime Active app processes and validates activity data",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Multi-chain APIs distribute rewards across 6 blockchains",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• NFT minting for session achievements and milestones",
              ),

              Document.createElement(
                View,
                { style: styles.highlight },
                Document.createElement(Text, null, "Offline Adventure Mode"),
              ),
              Document.createElement(Text, { style: styles.bulletPoint }, "• GPS tracking without internet connection"),
              Document.createElement(Text, { style: styles.bulletPoint }, "• Local data storage up to 30 days"),
              Document.createElement(Text, { style: styles.bulletPoint }, "• Background sync when connection restored"),
            ),

            Document.createElement(
              View,
              { style: styles.section },
              Document.createElement(Text, { style: styles.sectionTitle }, "Revenue Sharing Model"),

              Document.createElement(
                Text,
                { style: styles.paragraph },
                "Partnership revenue distribution ensures mutual benefit and sustainable growth for both WatchX and Prime Mates Board Club.",
              ),

              Document.createElement(
                View,
                { style: styles.table },
                Document.createElement(
                  View,
                  { style: styles.tableRow },
                  Document.createElement(Text, { style: styles.tableHeader }, "Revenue Stream"),
                  Document.createElement(Text, { style: styles.tableHeader }, "WatchX"),
                  Document.createElement(Text, { style: styles.tableHeader }, "Prime Mates"),
                ),
                Document.createElement(
                  View,
                  { style: styles.tableRow },
                  Document.createElement(Text, { style: styles.tableCell }, "Hardware Sales"),
                  Document.createElement(Text, { style: styles.tableCell }, "60%"),
                  Document.createElement(Text, { style: styles.tableCell }, "40%"),
                ),
                Document.createElement(
                  View,
                  { style: styles.tableRow },
                  Document.createElement(Text, { style: styles.tableCell }, "NFT Sales"),
                  Document.createElement(Text, { style: styles.tableCell }, "50%"),
                  Document.createElement(Text, { style: styles.tableCell }, "50%"),
                ),
                Document.createElement(
                  View,
                  { style: styles.tableRow },
                  Document.createElement(Text, { style: styles.tableCell }, "Subscriptions"),
                  Document.createElement(Text, { style: styles.tableCell }, "30%"),
                  Document.createElement(Text, { style: styles.tableCell }, "70%"),
                ),
                Document.createElement(
                  View,
                  { style: styles.tableRow },
                  Document.createElement(Text, { style: styles.tableCell }, "Sponsorships"),
                  Document.createElement(Text, { style: styles.tableCell }, "40%"),
                  Document.createElement(Text, { style: styles.tableCell }, "60%"),
                ),
              ),

              Document.createElement(
                Text,
                { style: styles.paragraph },
                "Genesis Edition Projections: 5,000 units at $299 = $1,495,000 total revenue. Year 1 ecosystem revenue projected at $1M+.",
              ),
            ),

            Document.createElement(Text, {
              style: styles.pageNumber,
              render: ({ pageNumber }) => `Page ${pageNumber}`,
            }),
          ),

          // Page 4: Roadmap & Next Steps
          Document.createElement(
            Page,
            { size: "A4", style: styles.page },
            Document.createElement(
              View,
              { style: styles.section },
              Document.createElement(Text, { style: styles.sectionTitle }, "Development Roadmap"),

              Document.createElement(
                View,
                { style: styles.highlight },
                Document.createElement(Text, null, "June 2025 - Partnership Finalization"),
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Confirm WatchX co-branded hardware & UI/UX design",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Define data points mapped to token rewards",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Finalize token reward tiers per activity level per chain",
              ),

              Document.createElement(
                View,
                { style: styles.highlight },
                Document.createElement(Text, null, "July 2025 - MVP Development"),
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Integrate WatchX wearable API into Prime Active app",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Implement reward distribution smart contracts",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Build NFT minting logic: sessions → digital collectibles",
              ),

              Document.createElement(
                View,
                { style: styles.highlight },
                Document.createElement(Text, null, "August 2025 - Closed Beta"),
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Release to Prime Mates NFT holders and key testers",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Onboard crypto wallets (TON, Kaspa, Doge, IoTeX)",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Launch referral challenge for early users",
              ),

              Document.createElement(
                View,
                { style: styles.highlight },
                Document.createElement(Text, null, "September 2025 - Public Launch"),
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Limited run of Genesis Edition PrimeX Watches",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Full app rollout with multi-chain reward engine",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Enable daily mining with in-app fitness activity",
              ),
            ),

            Document.createElement(
              View,
              { style: styles.section },
              Document.createElement(Text, { style: styles.sectionTitle }, "Next Steps"),

              Document.createElement(
                Text,
                { style: styles.paragraph },
                "To move forward with the PrimeX Watch partnership, we recommend the following immediate actions:",
              ),

              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Schedule technical discussion meeting with WatchX team",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Review hardware specifications and customization options",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Finalize partnership terms and revenue sharing agreement",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Begin proof of concept development and API integration",
              ),

              Document.createElement(
                Text,
                { style: styles.paragraph },
                "Contact: partnerships@primematesboardclub.com | +1 (555) 123-4567",
              ),
            ),

            Document.createElement(
              View,
              { style: styles.footer },
              Document.createElement(
                Text,
                null,
                "© 2024 Prime Mates Board Club. All rights reserved. This roadmap is confidential and proprietary.",
              ),
            ),

            Document.createElement(Text, {
              style: styles.pageNumber,
              render: ({ pageNumber }) => `Page ${pageNumber}`,
            }),
          ),
        )

      // Generate PDF blob
      const pdfBlob = await pdf(PrimeXWatchRoadmapPDF()).toBlob()

      // Create download link
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = "PrimeX-Watch-Roadmap.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      onClick={generateAndDownloadPDF}
      disabled={isGenerating}
      className={className}
      variant={variant}
      size={size}
    >
      <Download className="mr-2 h-4 w-4" />
      {isGenerating ? "Generating PDF..." : children || "Download Roadmap PDF"}
    </Button>
  )
}
