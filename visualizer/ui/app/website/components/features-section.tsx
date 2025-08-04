"use client"

import { Zap, Shield, Code, GitBranch, Network, Database } from "lucide-react"

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "AI-Powered Generation",
    description: "Describe your infrastructure in natural language and watch as AI generates complete Pulumi code with best practices built-in.",
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Multi-Cloud Support",
    description: "Deploy to AWS, GCP, Azure, and more. Our AI understands the nuances of each cloud provider and generates optimized code.",
  },
  {
    icon: <GitBranch className="w-6 h-6" />,
    title: "Version Control Ready",
    description: "Generated code is clean, well-documented, and ready for Git. Collaborate with your team using familiar workflows.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Security First",
    description: "Built-in security best practices, compliance checks, and vulnerability scanning ensure your infrastructure is secure by default.",
  },
  {
    icon: <Network className="w-6 h-6" />,
    title: "Visual Diagrams",
    description: "Interactive infrastructure diagrams help you understand and modify your architecture with drag-and-drop simplicity.",
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "State Management",
    description: "Automatic state management and drift detection keep your infrastructure in sync with your desired configuration.",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Everything you need to build, deploy, and manage cloud infrastructure at scale
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 text-white">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-white/70 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 