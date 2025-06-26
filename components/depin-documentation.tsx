"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, ExternalLink } from "lucide-react"

export function DePINDocumentation() {
  return (
    <div className="space-y-6">
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Important Information</AlertTitle>
        <AlertDescription>
          Currently operating in testnet mode. Earned tokens are for testing purposes only and have no real-world value.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="earning">Earning</TabsTrigger>
          <TabsTrigger value="withdraw">Withdrawing</TabsTrigger>
          <TabsTrigger value="networks">Networks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>What are DePIN Networks?</CardTitle>
              <CardDescription>Decentralized Physical Infrastructure Networks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                DePIN (Decentralized Physical Infrastructure Networks) are blockchain projects that reward users for
                contributing real-world data or resources. In Prime Active, you can earn tokens by sharing your activity
                data with these networks.
              </p>

              <p>
                Each network has its own token and specific requirements for earning rewards. By enabling these networks
                in your settings, you allow your activity data to be shared with them, earning you tokens in return.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ol className="list-decimal pl-5 space-y-2">
                <li>Go to Settings &gt; DePIN Networks</li>
                <li>Enable the networks you want to participate in</li>
                <li>Start tracking activities to earn tokens</li>
                <li>View your earned tokens in the Wallet section</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>How to Earn Tokens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Each network rewards different aspects of your activities. Here's how you can maximize your earnings:
              </p>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="iotex">
                  <AccordionTrigger>IoTeX (IOTX)</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>IoTeX rewards you for providing activity data that helps build IoT infrastructure.</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Longer activities earn more tokens</li>
                      <li>Activities with more data points are rewarded higher</li>
                      <li>Rewards are calculated based on distance and duration</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="helium">
                  <AccordionTrigger>Helium Mobile (MOBILE)</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>Helium Mobile rewards you for mapping cellular coverage areas.</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Visiting new areas earns more tokens</li>
                      <li>Higher quality data (good GPS accuracy) increases rewards</li>
                      <li>Rewards are based on unique coverage points</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="foam">
                  <AccordionTrigger>FOAM Protocol (FOAM)</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>FOAM rewards you for verifying locations and points of interest.</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Staying in one place for a while helps verify that location</li>
                      <li>Visiting known points of interest earns rewards</li>
                      <li>Higher confidence verifications earn more tokens</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawing Your Tokens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Currently, we're operating in testnet mode, so tokens cannot be withdrawn to external wallets. When
                mainnet support is added, you'll be able to withdraw your tokens following these steps:
              </p>

              <ol className="list-decimal pl-5 space-y-2">
                <li>Connect an external wallet (MetaMask, Trust Wallet, etc.)</li>
                <li>Go to the Wallet section and select "Withdraw Tokens"</li>
                <li>Choose the network and amount you want to withdraw</li>
                <li>Confirm the transaction (may require gas fees)</li>
              </ol>

              <div className="bg-zinc-800 p-4 rounded-md mt-4">
                <p className="text-sm text-zinc-400">
                  <strong>Note:</strong> Each network has its own withdrawal requirements and minimum amounts. Gas fees
                  for withdrawals are paid in the native token of each network.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="networks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supported Networks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="p-4 border border-zinc-800 rounded-md">
                  <h3 className="font-medium mb-2">IoTeX (IOTX)</h3>
                  <p className="text-sm text-zinc-400 mb-2">
                    Open-source blockchain designed for the Internet of Things with a focus on privacy and scalability.
                  </p>
                  <a
                    href="https://iotex.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary flex items-center gap-1"
                  >
                    Learn more <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="p-4 border border-zinc-800 rounded-md">
                  <h3 className="font-medium mb-2">Helium Mobile (MOBILE)</h3>
                  <p className="text-sm text-zinc-400 mb-2">
                    Decentralized wireless network that allows users to earn by providing and validating coverage.
                  </p>
                  <a
                    href="https://helium.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary flex items-center gap-1"
                  >
                    Learn more <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="p-4 border border-zinc-800 rounded-md">
                  <h3 className="font-medium mb-2">FOAM Protocol (FOAM)</h3>
                  <p className="text-sm text-zinc-400 mb-2">
                    Open protocol for proof of location on Ethereum, creating a decentralized alternative to GPS.
                  </p>
                  <a
                    href="https://foam.space"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary flex items-center gap-1"
                  >
                    Learn more <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
