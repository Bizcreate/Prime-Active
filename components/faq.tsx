"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQ() {
  return (
    <div className="mx-auto max-w-3xl">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>How can I start mining without any investment?</AccordionTrigger>
          <AccordionContent>
            You can start mining immediately by downloading our software and using your existing computer's CPU or GPU.
            There's no need to purchase specialized mining equipment or tokens upfront. The software automatically
            adjusts to your hardware capabilities to optimize mining efficiency.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>What are the minimum hardware requirements?</AccordionTrigger>
          <AccordionContent>
            Our mining software works on most modern computers. For basic mining, we recommend at least a dual-core CPU,
            4GB of RAM, and a stable internet connection. For improved results, a dedicated GPU with at least 4GB of
            memory is recommended. The software automatically detects your hardware and optimizes accordingly.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>How do I transition from mining to staking?</AccordionTrigger>
          <AccordionContent>
            Once you've earned tokens through mining, you can easily transition to staking through our platform.
            Navigate to the staking section, specify the amount of tokens you wish to stake, and select your preferred
            staking period. Your tokens will begin generating staking rewards immediately.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>How are rewards calculated and distributed?</AccordionTrigger>
          <AccordionContent>
            Mining rewards are calculated based on your computational contribution to the network, measured in hashrate.
            Staking rewards are calculated based on the amount of tokens staked and the duration of staking. Both types
            of rewards are distributed daily to your wallet on the platform, and you can withdraw them at any time.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>Is my computer safe while mining?</AccordionTrigger>
          <AccordionContent>
            Yes, our mining software is designed with safety as a priority. It includes built-in temperature monitoring
            and automatic throttling to prevent overheating. You can also set custom limits on resource usage to ensure
            your computer remains responsive for other tasks. All code is open-source and regularly audited for
            security.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
          <AccordionTrigger>How does the node selection process work?</AccordionTrigger>
          <AccordionContent>
            Our node selection algorithm evaluates nodes based on reliability, performance, and security metrics. It
            automatically connects you to the most optimal node for your location and network conditions. This ensures
            efficient mining operations and fair reward distribution. The selection process is transparent and can be
            monitored through your dashboard.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-7">
          <AccordionTrigger>Can I mine on multiple devices simultaneously?</AccordionTrigger>
          <AccordionContent>
            Yes, you can mine on multiple devices using the same account. Our platform supports mining on desktops,
            laptops, and even some high-end mobile devices. Each device will contribute to your overall hashrate and
            increase your mining rewards proportionally. You can monitor all your mining devices from a single
            dashboard.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-8">
          <AccordionTrigger>How does the platform prevent malicious activities?</AccordionTrigger>
          <AccordionContent>
            We employ multiple security measures including proof-of-identity for node operators, real-time monitoring
            for suspicious activities, and consensus mechanisms that require multiple validations for transactions.
            Additionally, our staking mechanism creates economic incentives for honest participation, as malicious
            actors risk losing their staked tokens.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
