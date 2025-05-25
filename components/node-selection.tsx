"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Cpu, Server, Check, AlertTriangle } from "lucide-react"

export function NodeSelection() {
  const [nodes, setNodes] = useState<
    Array<{
      id: number
      type: "pow" | "pos"
      status: "active" | "inactive" | "selected"
      reliability: number
      performance: number
    }>
  >([])

  const [selectedNode, setSelectedNode] = useState<number | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)

  // Generate random nodes on mount
  useEffect(() => {
    const newNodes = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      type: Math.random() > 0.5 ? "pow" : ("pos" as "pow" | "pos"),
      status: "inactive" as "active" | "inactive" | "selected",
      reliability: 70 + Math.floor(Math.random() * 30),
      performance: 70 + Math.floor(Math.random() * 30),
    }))

    // Set some nodes as active
    newNodes.forEach((node, i) => {
      if (i % 3 === 0) {
        node.status = "active"
      }
    })

    setNodes(newNodes)
  }, [])

  const startNodeSelection = () => {
    if (isSelecting) return

    setIsSelecting(true)
    setSelectedNode(null)

    // Reset all nodes to inactive except active ones
    setNodes(
      nodes.map((node) => ({
        ...node,
        status: node.status === "selected" ? "active" : node.status,
      })),
    )

    // Simulate node selection algorithm
    const interval = setInterval(() => {
      setNodes((prev) => {
        const activeNodes = prev.filter((n) => n.status === "active")
        const randomIndex = Math.floor(Math.random() * activeNodes.length)
        const selectedNodeId = activeNodes[randomIndex]?.id

        return prev.map((node) => ({
          ...node,
          status: node.id === selectedNodeId ? "selected" : node.status,
        }))
      })
    }, 100)

    // Stop after 2 seconds and select the best node
    setTimeout(() => {
      clearInterval(interval)

      // Find the best node based on reliability and performance
      const activeNodes = nodes.filter((n) => n.status === "active")
      const bestNode = activeNodes.reduce((best, current) => {
        const bestScore = best.reliability * 0.6 + best.performance * 0.4
        const currentScore = current.reliability * 0.6 + current.performance * 0.4
        return currentScore > bestScore ? current : best
      }, activeNodes[0])

      if (bestNode) {
        setSelectedNode(bestNode.id)
        setNodes((prev) =>
          prev.map((node) => ({
            ...node,
            status: node.id === bestNode.id ? "selected" : node.status === "selected" ? "active" : node.status,
          })),
        )
      }

      setIsSelecting(false)
    }, 2000)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 rounded-xl border border-zinc-800 bg-black p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Node Network Status</h3>
          <button
            onClick={startNodeSelection}
            disabled={isSelecting}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
          >
            {isSelecting ? "Selecting..." : "Select Optimal Node"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              className={`rounded-lg border p-3 ${
                node.status === "selected"
                  ? "border-primary bg-primary/10"
                  : node.status === "active"
                    ? "border-green-600/30 bg-green-900/10"
                    : "border-zinc-800 bg-zinc-900/50"
              }`}
              animate={{
                scale: node.status === "selected" ? [1, 1.05, 1] : 1,
                transition: { duration: 0.5 },
              }}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {node.type === "pow" ? (
                    <Cpu className="h-4 w-4 text-zinc-400" />
                  ) : (
                    <Server className="h-4 w-4 text-zinc-400" />
                  )}
                  <span className="text-xs font-medium text-zinc-400">Node {node.id + 1}</span>
                </div>
                {node.status === "selected" ? (
                  <span className="flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                    <Check className="h-3 w-3" /> Selected
                  </span>
                ) : node.status === "active" ? (
                  <span className="flex items-center gap-1 rounded-full bg-green-900/20 px-2 py-0.5 text-xs font-medium text-green-500">
                    <Check className="h-3 w-3" /> Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-400">
                    <AlertTriangle className="h-3 w-3" /> Inactive
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Reliability</span>
                    <span className="text-xs font-medium text-zinc-300">{node.reliability}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${node.reliability}%` }} />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Performance</span>
                    <span className="text-xs font-medium text-zinc-300">{node.performance}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div className="h-full rounded-full bg-green-500" style={{ width: `${node.performance}%` }} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-zinc-500">
        Our algorithm continuously monitors the network and selects the most reliable and efficient nodes to ensure
        optimal performance and fair rewards for all participants.
      </div>
    </div>
  )
}
