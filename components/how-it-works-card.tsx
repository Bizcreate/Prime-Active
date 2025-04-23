interface HowItWorksCardProps {
  step: string
  title: string
  description: string
}

export function HowItWorksCard({ step, title, description }: HowItWorksCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-primary/50 hover:bg-zinc-900">
      <div className="mb-4 text-4xl font-bold text-primary">{step}</div>
      <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </div>
  )
}
