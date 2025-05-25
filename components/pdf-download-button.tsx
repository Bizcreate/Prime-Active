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
      const ProposalPDF = () =>
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
              Document.createElement(Text, { style: styles.title }, "PrimeX Watch Partnership Proposal"),
              Document.createElement(Text, { style: styles.subtitle }, "Strategic Partnership Proposal"),
              Document.createElement(Text, { style: styles.subtitle }, "Revolutionizing Action Sports Tracking"),
            ),

            Document.createElement(
              View,
              { style: styles.section },
              Document.createElement(Text, { style: styles.sectionTitle }, "Executive Summary"),
              Document.createElement(
                Text,
                { style: styles.paragraph },
                "This proposal outlines a strategic partnership opportunity between Prime Mates Board Club (PMBC) and WatchX to create the first specialized wearable technology platform for action sports enthusiasts, integrating a Web3 move-to-earn concept.",
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
              Document.createElement(Text, { style: styles.sectionTitle }, "Partnership Vision"),
              Document.createElement(
                Text,
                { style: styles.paragraph },
                "The partnership between PMBC and WatchX represents a unique opportunity to capture an underserved market segment while leveraging both companies' core strengths, integrating Web3 elements for enhanced user engagement and rewards.",
              ),

              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Untapped Market: Action sports enthusiasts lack specialized wearable solutions with Web3 integration",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Technology Synergy: WatchX hardware + PMBC software + Blockchain APIs = Complete solution",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Brand Expansion: Mutual market expansion and brand strengthening within the Web3 community",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Revenue Growth: New revenue streams through co-branded products and NFT minting",
              ),
            ),

            Document.createElement(Text, {
              style: styles.pageNumber,
              render: ({ pageNumber }) => `Page ${pageNumber}`,
            }),
          ),

          // Page 2: Market Opportunity & Benefits
          Document.createElement(
            Page,
            { size: "A4", style: styles.page },
            Document.createElement(
              View,
              { style: styles.section },
              Document.createElement(Text, { style: styles.sectionTitle }, "Market Opportunity"),

              Document.createElement(
                View,
                { style: styles.table },
                Document.createElement(
                  View,
                  { style: styles.tableRow },
                  Document.createElement(Text, { style: styles.tableHeader }, "Metric"),
                  Document.createElement(Text, { style: styles.tableHeader }, "Value"),
                  Document.createElement(Text, { style: styles.tableHeader }, "Growth Potential"),
                ),
                Document.createElement(
                  View,
                  { style: styles.tableRow },
                  Document.createElement(Text, { style: styles.tableCell }, "Market Size"),
                  Document.createElement(Text, { style: styles.tableCell }, "$2.8B"),
                  Document.createElement(Text, { style: styles.tableCell }, "15% annually"),
                ),
                Document.createElement(
                  View,
                  { style: styles.tableRow },
                  Document.createElement(Text, { style: styles.tableCell }, "Active Participants"),
                  Document.createElement(Text, { style: styles.tableCell }, "45M+"),
                  Document.createElement(Text, { style: styles.tableCell }, "Growing demographic"),
                ),
                Document.createElement(
                  View,
                  { style: styles.tableRow },
                  Document.createElement(Text, { style: styles.tableCell }, "Tech Adoption"),
                  Document.createElement(Text, { style: styles.tableCell }, "85%"),
                  Document.createElement(Text, { style: styles.tableCell }, "High engagement"),
                ),
              ),

              Document.createElement(
                Text,
                { style: styles.paragraph },
                "The action sports market represents a significant untapped opportunity for wearable technology. Current solutions focus on traditional fitness tracking, leaving action sports enthusiasts without specialized tools for their unique needs.",
              ),
            ),

            Document.createElement(
              View,
              { style: styles.section },
              Document.createElement(Text, { style: styles.sectionTitle }, "Benefits for WatchX"),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Market Expansion: Access to action sports community and enthusiasts",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Specialized Use Cases: Unique applications beyond traditional fitness tracking",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Brand Association: Partnership with innovative action sports technology and PMBC",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Revenue Growth: New revenue streams through co-branded products and NFT sales",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Technology Validation: Real-world testing in extreme conditions",
              ),
            ),

            Document.createElement(
              View,
              { style: styles.section },
              Document.createElement(Text, { style: styles.sectionTitle }, "Benefits for PMBC"),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Hardware Integration: Access to advanced wearable technology and sensors",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Enhanced User Experience: Seamless integration between watch and mobile app",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Market Credibility: Partnership with established wearable technology leader",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Competitive Advantage: First-mover advantage in action sports wearables with Web3 integration",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Accelerated Development: Faster time-to-market with proven hardware",
              ),
            ),

            Document.createElement(Text, {
              style: styles.pageNumber,
              render: ({ pageNumber }) => `Page ${pageNumber}`,
            }),
          ),

          // Page 3: Technical Integration & Custom Design
          Document.createElement(
            Page,
            { size: "A4", style: styles.page },
            Document.createElement(
              View,
              { style: styles.section },
              Document.createElement(Text, { style: styles.sectionTitle }, "Technical Integration"),

              Document.createElement(
                Text,
                { style: styles.paragraph },
                "The integration between WatchX hardware and PMBC software will create a seamless user experience specifically designed for action sports tracking and analysis, enhanced by blockchain APIs and NFT minting capabilities.",
              ),

              Document.createElement(
                View,
                { style: styles.highlight },
                Document.createElement(Text, null, "Real-time Data Processing"),
              ),
              Document.createElement(Text, { style: styles.bulletPoint }, "• Live performance metrics during sessions"),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Instant feedback and coaching suggestions",
              ),
              Document.createElement(Text, { style: styles.bulletPoint }, "• Real-time safety monitoring and alerts"),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Live session sharing with friends and coaches",
              ),

              Document.createElement(
                View,
                { style: styles.highlight },
                Document.createElement(Text, null, "Advanced Analytics"),
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Motion pattern recognition for trick detection",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Performance trend analysis and progression tracking",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Injury prevention insights based on movement patterns",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Skill progression tracking and goal setting",
              ),

              Document.createElement(
                View,
                { style: styles.highlight },
                Document.createElement(Text, null, "Web3 Integration"),
              ),
              Document.createElement(Text, { style: styles.bulletPoint }, "• Blockchain APIs for move-to-earn rewards"),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• NFT minting for achievements and milestones",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Multi-chain support for various crypto communities",
              ),
              Document.createElement(Text, { style: styles.bulletPoint }, "• Integration with PMBC's Web3 ecosystem"),
            ),

            Document.createElement(
              View,
              { style: styles.section },
              Document.createElement(Text, { style: styles.sectionTitle }, "Custom PMBC × WatchX Edition"),

              Document.createElement(
                Text,
                { style: styles.paragraph },
                "A co-branded wearable device designed specifically for action sports, featuring enhanced durability and specialized sensors for extreme sports environments.",
              ),

              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Rugged Construction: Enhanced durability with reinforced casing and impact resistance",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Action Sports Sensors: Specialized sensors for jumps, rotations, speed, and G-forces",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• PMBC Branding: Custom watch faces, branded straps, and exclusive app integration",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Extended Battery: Optimized for long action sports sessions",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Weather Resistance: Enhanced protection for extreme weather conditions",
              ),
            ),

            Document.createElement(Text, {
              style: styles.pageNumber,
              render: ({ pageNumber }) => `Page ${pageNumber}`,
            }),
          ),

          // Page 4: Implementation & Next Steps
          Document.createElement(
            Page,
            { size: "A4", style: styles.page },
            Document.createElement(
              View,
              { style: styles.section },
              Document.createElement(Text, { style: styles.sectionTitle }, "Implementation Roadmap"),

              Document.createElement(
                View,
                { style: styles.highlight },
                Document.createElement(Text, null, "Phase 1: Technical Discussion (June - July 2025)"),
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Deep dive into integration possibilities and technical requirements",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• API specification and data exchange protocols",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Hardware capability assessment for action sports use cases",
              ),
              Document.createElement(Text, { style: styles.bulletPoint }, "• Proof of concept development"),

              Document.createElement(
                View,
                { style: styles.highlight },
                Document.createElement(Text, null, "Phase 2: Partnership Agreement (July - August 2025)"),
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Formalize partnership terms and revenue sharing model",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Establish collaboration framework and governance",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Define intellectual property and licensing agreements",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Set performance metrics and success criteria",
              ),

              Document.createElement(
                View,
                { style: styles.highlight },
                Document.createElement(Text, null, "Phase 3: Product Development (August - October 2025)"),
              ),
              Document.createElement(Text, { style: styles.bulletPoint }, "• Begin development of integrated solution"),
              Document.createElement(Text, { style: styles.bulletPoint }, "• Custom watch design and prototyping"),
              Document.createElement(Text, { style: styles.bulletPoint }, "• Beta testing with action sports athletes"),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Market launch preparation and marketing strategy",
              ),
            ),

            Document.createElement(
              View,
              { style: styles.section },
              Document.createElement(Text, { style: styles.sectionTitle }, "Revenue Model"),

              Document.createElement(
                Text,
                { style: styles.paragraph },
                "The partnership will generate revenue through multiple streams, ensuring mutual benefit and sustainable growth for both organizations.",
              ),

              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Hardware Sales: Revenue sharing on custom PMBC × WatchX devices",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Software Licensing: PMBC app integration licensing fees",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Subscription Services: Premium features and analytics",
              ),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Brand Partnerships: Sponsored content and athlete endorsements",
              ),
              Document.createElement(Text, { style: styles.bulletPoint }, "• NFT Sales: Revenue from minted NFTs"),
            ),

            Document.createElement(
              View,
              { style: styles.section },
              Document.createElement(Text, { style: styles.sectionTitle }, "Contact Information"),

              Document.createElement(Text, { style: styles.paragraph }, "Prime Mates Board Club Partnership Team"),
              Document.createElement(
                Text,
                { style: styles.bulletPoint },
                "• Email: partnerships@primematesboardclub.com",
              ),
              Document.createElement(Text, { style: styles.bulletPoint }, "• Phone: +1 (555) 123-4567"),
              Document.createElement(Text, { style: styles.bulletPoint }, "• Website: www.primematesboardclub.com"),

              Document.createElement(
                Text,
                { style: styles.paragraph },
                "We look forward to discussing this exciting partnership opportunity and creating the future of action sports tracking together.",
              ),
            ),

            Document.createElement(
              View,
              { style: styles.footer },
              Document.createElement(
                Text,
                null,
                "© 2024 Prime Mates Board Club. All rights reserved. This proposal is confidential and proprietary.",
              ),
            ),

            Document.createElement(Text, {
              style: styles.pageNumber,
              render: ({ pageNumber }) => `Page ${pageNumber}`,
            }),
          ),
        )

      // Generate PDF blob
      const pdfBlob = await pdf(ProposalPDF()).toBlob()

      // Create download link
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = "PrimeX-Watch-Partnership-Proposal.pdf"
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
      {isGenerating ? "Generating PDF..." : children || "Download Full Proposal"}
    </Button>
  )
}
