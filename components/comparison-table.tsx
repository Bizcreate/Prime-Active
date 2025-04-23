import { Check, X } from "lucide-react"

export function ComparisonTable() {
  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-zinc-800">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-800/50">
              <th className="p-4 text-left text-sm font-medium text-zinc-400">Feature</th>
              <th className="p-4 text-center text-sm font-medium text-zinc-400">Proof of Work (Mining)</th>
              <th className="p-4 text-center text-sm font-medium text-zinc-400">Proof of Stake</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            <tr className="bg-black">
              <td className="p-4 text-sm text-zinc-300">Initial Investment</td>
              <td className="p-4 text-center text-sm text-zinc-300">None (just your computer)</td>
              <td className="p-4 text-center text-sm text-zinc-300">Tokens earned from mining</td>
            </tr>
            <tr className="bg-zinc-900/50">
              <td className="p-4 text-sm text-zinc-300">Hardware Requirements</td>
              <td className="p-4 text-center text-sm text-zinc-300">CPU/GPU for processing</td>
              <td className="p-4 text-center text-sm text-zinc-300">Minimal (any device)</td>
            </tr>
            <tr className="bg-black">
              <td className="p-4 text-sm text-zinc-300">Energy Consumption</td>
              <td className="p-4 text-center text-sm text-zinc-300">Moderate to High</td>
              <td className="p-4 text-center text-sm text-zinc-300">Very Low</td>
            </tr>
            <tr className="bg-zinc-900/50">
              <td className="p-4 text-sm text-zinc-300">Reward Potential</td>
              <td className="p-4 text-center text-sm text-zinc-300">Variable (hardware dependent)</td>
              <td className="p-4 text-center text-sm text-zinc-300">Proportional to stake amount</td>
            </tr>
            <tr className="bg-black">
              <td className="p-4 text-sm text-zinc-300">Passive Income</td>
              <td className="p-4 text-center text-sm text-zinc-300">
                <span className="inline-flex items-center justify-center rounded-full bg-amber-900/20 p-1 text-amber-500">
                  <X className="h-4 w-4" />
                </span>
              </td>
              <td className="p-4 text-center text-sm text-zinc-300">
                <span className="inline-flex items-center justify-center rounded-full bg-green-900/20 p-1 text-green-500">
                  <Check className="h-4 w-4" />
                </span>
              </td>
            </tr>
            <tr className="bg-zinc-900/50">
              <td className="p-4 text-sm text-zinc-300">Computer Usage</td>
              <td className="p-4 text-center text-sm text-zinc-300">Active during mining</td>
              <td className="p-4 text-center text-sm text-zinc-300">Can be turned off</td>
            </tr>
            <tr className="bg-black">
              <td className="p-4 text-sm text-zinc-300">Entry Barrier</td>
              <td className="p-4 text-center text-sm text-zinc-300">Very Low</td>
              <td className="p-4 text-center text-sm text-zinc-300">Low (after earning tokens)</td>
            </tr>
            <tr className="bg-zinc-900/50">
              <td className="p-4 text-sm text-zinc-300">Network Security Role</td>
              <td className="p-4 text-center text-sm text-zinc-300">Transaction validation</td>
              <td className="p-4 text-center text-sm text-zinc-300">Block production & validation</td>
            </tr>
            <tr className="bg-black">
              <td className="p-4 text-sm text-zinc-300">Governance Rights</td>
              <td className="p-4 text-center text-sm text-zinc-300">Limited</td>
              <td className="p-4 text-center text-sm text-zinc-300">Proportional to stake</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
