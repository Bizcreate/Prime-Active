import { ActivityBoostManager } from "@/components/activity-boost-manager"

export default function BoostsPage() {
  return (
    <div className="container max-w-lg py-8">
      <h1 className="text-2xl font-bold mb-6">Activity Boosts</h1>
      <ActivityBoostManager />
    </div>
  )
}
