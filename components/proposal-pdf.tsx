"use client"

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

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
const ProposalPDF = () => (
  <Document>
    {/* Page 1: Cover & Executive Summary */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>PMBC × WatchX</Text>
        <Text style={styles.subtitle}>Strategic Partnership Proposal</Text>
        <Text style={styles.subtitle}>Revolutionizing Action Sports Tracking</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Executive Summary</Text>
        <Text style={styles.paragraph}>
          This proposal outlines a strategic partnership opportunity between PMBC and WatchX to create the first
          specialized wearable technology platform for action sports enthusiasts.
        </Text>

        <View style={styles.highlight}>
          <Text>Partnership Opportunity: Strategic collaboration to dominate the action sports wearables market</Text>
        </View>

        <Text style={styles.paragraph}>
          <Text style={{ fontWeight: "bold" }}>Market Size:</Text> $2.8B action sports market with 45M+ active
          participants and 15% annual growth rate.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={{ fontWeight: "bold" }}>Value Proposition:</Text> Combine WatchX's advanced hardware with PMBC's
          specialized software for snowboarding, skateboarding, BMX, and other action sports.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={{ fontWeight: "bold" }}>Key Benefits:</Text> Market expansion, revenue growth, technological
          innovation, and first-mover advantage in action sports wearables.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Partnership Vision</Text>
        <Text style={styles.paragraph}>
          The partnership between PMBC and WatchX represents a unique opportunity to capture an underserved market
          segment while leveraging both companies' core strengths.
        </Text>

        <Text style={styles.bulletPoint}>
          • Untapped Market: Action sports enthusiasts lack specialized wearable solutions
        </Text>
        <Text style={styles.bulletPoint}>
          • Technology Synergy: WatchX hardware + PMBC software = Complete solution
        </Text>
        <Text style={styles.bulletPoint}>• Brand Expansion: Mutual market expansion and brand strengthening</Text>
        <Text style={styles.bulletPoint}>• Revenue Growth: New revenue streams through co-branded products</Text>
      </View>

      <Text style={styles.pageNumber} render={({ pageNumber }) => `Page ${pageNumber}`} />
    </Page>

    {/* Page 2: Market Opportunity & Benefits */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Market Opportunity</Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Metric</Text>
            <Text style={styles.tableHeader}>Value</Text>
            <Text style={styles.tableHeader}>Growth Potential</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Market Size</Text>
            <Text style={styles.tableCell}>$2.8B</Text>
            <Text style={styles.tableCell}>15% annually</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Active Participants</Text>
            <Text style={styles.tableCell}>45M+</Text>
            <Text style={styles.tableCell}>Growing demographic</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Tech Adoption</Text>
            <Text style={styles.tableCell}>85%</Text>
            <Text style={styles.tableCell}>High engagement</Text>
          </View>
        </View>

        <Text style={styles.paragraph}>
          The action sports market represents a significant untapped opportunity for wearable technology. Current
          solutions focus on traditional fitness tracking, leaving action sports enthusiasts without specialized tools
          for their unique needs.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Benefits for WatchX</Text>
        <Text style={styles.bulletPoint}>• Market Expansion: Access to action sports community and enthusiasts</Text>
        <Text style={styles.bulletPoint}>
          • Specialized Use Cases: Unique applications beyond traditional fitness tracking
        </Text>
        <Text style={styles.bulletPoint}>
          • Brand Association: Partnership with innovative action sports technology
        </Text>
        <Text style={styles.bulletPoint}>• Revenue Growth: New revenue streams through co-branded products</Text>
        <Text style={styles.bulletPoint}>• Technology Validation: Real-world testing in extreme conditions</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Benefits for PMBC</Text>
        <Text style={styles.bulletPoint}>
          • Hardware Integration: Access to advanced wearable technology and sensors
        </Text>
        <Text style={styles.bulletPoint}>
          • Enhanced User Experience: Seamless integration between watch and mobile app
        </Text>
        <Text style={styles.bulletPoint}>
          • Market Credibility: Partnership with established wearable technology leader
        </Text>
        <Text style={styles.bulletPoint}>
          • Competitive Advantage: First-mover advantage in action sports wearables
        </Text>
        <Text style={styles.bulletPoint}>• Accelerated Development: Faster time-to-market with proven hardware</Text>
      </View>

      <Text style={styles.pageNumber} render={({ pageNumber }) => `Page ${pageNumber}`} />
    </Page>

    {/* Page 3: Technical Integration & Custom Design */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technical Integration</Text>

        <Text style={styles.paragraph}>
          The integration between WatchX hardware and PMBC software will create a seamless user experience specifically
          designed for action sports tracking and analysis.
        </Text>

        <View style={styles.highlight}>
          <Text>Real-time Data Processing</Text>
        </View>
        <Text style={styles.bulletPoint}>• Live performance metrics during sessions</Text>
        <Text style={styles.bulletPoint}>• Instant feedback and coaching suggestions</Text>
        <Text style={styles.bulletPoint}>• Real-time safety monitoring and alerts</Text>
        <Text style={styles.bulletPoint}>• Live session sharing with friends and coaches</Text>

        <View style={styles.highlight}>
          <Text>Advanced Analytics</Text>
        </View>
        <Text style={styles.bulletPoint}>• Motion pattern recognition for trick detection</Text>
        <Text style={styles.bulletPoint}>• Performance trend analysis and progression tracking</Text>
        <Text style={styles.bulletPoint}>• Injury prevention insights based on movement patterns</Text>
        <Text style={styles.bulletPoint}>• Skill progression tracking and goal setting</Text>

        <View style={styles.highlight}>
          <Text>Social Features</Text>
        </View>
        <Text style={styles.bulletPoint}>• Session sharing and performance comparison</Text>
        <Text style={styles.bulletPoint}>• Community challenges and competitions</Text>
        <Text style={styles.bulletPoint}>• Leaderboards and achievement systems</Text>
        <Text style={styles.bulletPoint}>• Group session coordination and planning</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom PMBC × WatchX Edition</Text>

        <Text style={styles.paragraph}>
          A co-branded wearable device designed specifically for action sports, featuring enhanced durability and
          specialized sensors for extreme sports environments.
        </Text>

        <Text style={styles.bulletPoint}>
          • Rugged Construction: Enhanced durability with reinforced casing and impact resistance
        </Text>
        <Text style={styles.bulletPoint}>
          • Action Sports Sensors: Specialized sensors for jumps, rotations, speed, and G-forces
        </Text>
        <Text style={styles.bulletPoint}>
          • PMBC Branding: Custom watch faces, branded straps, and exclusive app integration
        </Text>
        <Text style={styles.bulletPoint}>• Extended Battery: Optimized for long action sports sessions</Text>
        <Text style={styles.bulletPoint}>• Weather Resistance: Enhanced protection for extreme weather conditions</Text>
      </View>

      <Text style={styles.pageNumber} render={({ pageNumber }) => `Page ${pageNumber}`} />
    </Page>

    {/* Page 4: Implementation & Next Steps */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Implementation Roadmap</Text>

        <View style={styles.highlight}>
          <Text>Phase 1: Technical Discussion (Month 1-2)</Text>
        </View>
        <Text style={styles.bulletPoint}>• Deep dive into integration possibilities and technical requirements</Text>
        <Text style={styles.bulletPoint}>• API specification and data exchange protocols</Text>
        <Text style={styles.bulletPoint}>• Hardware capability assessment for action sports use cases</Text>
        <Text style={styles.bulletPoint}>• Proof of concept development</Text>

        <View style={styles.highlight}>
          <Text>Phase 2: Partnership Agreement (Month 2-3)</Text>
        </View>
        <Text style={styles.bulletPoint}>• Formalize partnership terms and revenue sharing model</Text>
        <Text style={styles.bulletPoint}>• Establish collaboration framework and governance</Text>
        <Text style={styles.bulletPoint}>• Define intellectual property and licensing agreements</Text>
        <Text style={styles.bulletPoint}>• Set performance metrics and success criteria</Text>

        <View style={styles.highlight}>
          <Text>Phase 3: Product Development (Month 4-12)</Text>
        </View>
        <Text style={styles.bulletPoint}>• Begin development of integrated solution</Text>
        <Text style={styles.bulletPoint}>• Custom watch design and prototyping</Text>
        <Text style={styles.bulletPoint}>• Beta testing with action sports athletes</Text>
        <Text style={styles.bulletPoint}>• Market launch preparation and marketing strategy</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Revenue Model</Text>

        <Text style={styles.paragraph}>
          The partnership will generate revenue through multiple streams, ensuring mutual benefit and sustainable growth
          for both organizations.
        </Text>

        <Text style={styles.bulletPoint}>• Hardware Sales: Revenue sharing on custom PMBC × WatchX devices</Text>
        <Text style={styles.bulletPoint}>• Software Licensing: PMBC app integration licensing fees</Text>
        <Text style={styles.bulletPoint}>• Subscription Services: Premium features and analytics</Text>
        <Text style={styles.bulletPoint}>• Brand Partnerships: Sponsored content and athlete endorsements</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>

        <Text style={styles.paragraph}>
          <Text style={{ fontWeight: "bold" }}>PMBC Partnership Team</Text>
        </Text>
        <Text style={styles.bulletPoint}>• Email: partnerships@pmbc.com</Text>
        <Text style={styles.bulletPoint}>• Phone: +1 (555) 123-4567</Text>
        <Text style={styles.bulletPoint}>• Website: www.pmbc.com</Text>

        <Text style={styles.paragraph}>
          We look forward to discussing this exciting partnership opportunity and creating the future of action sports
          tracking together.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text>© 2024 PMBC. All rights reserved. This proposal is confidential and proprietary.</Text>
      </View>

      <Text style={styles.pageNumber} render={({ pageNumber }) => `Page ${pageNumber}`} />
    </Page>
  </Document>
)

export default ProposalPDF
