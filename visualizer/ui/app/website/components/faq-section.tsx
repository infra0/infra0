"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "What cloud providers does Infra0 support?",
    answer: "Infra0 supports all major cloud providers including AWS, Google Cloud Platform, Microsoft Azure, DigitalOcean, and over 20+ other providers. Our AI understands the nuances of each platform and generates optimized configurations for your chosen provider."
  },
  {
    question: "How does AI-generated infrastructure code ensure security?",
    answer: "Our AI is trained on security best practices and automatically applies industry-standard security configurations. This includes proper IAM roles, encrypted storage, secure networking, and compliance with frameworks like SOC 2, GDPR, and HIPAA."
  },
  {
    question: "Can I modify the generated code?",
    answer: "Absolutely! All generated code is clean, well-documented, and fully editable. You can modify it using standard tools, version control it with Git, and integrate it into your existing CI/CD pipelines. The code is yours to customize as needed."
  },
  {
    question: "What's the difference between the CLI and web interface?",
    answer: "The CLI is perfect for developers who prefer working in the terminal and want to integrate Infra0 into their existing workflows. The web interface provides a visual approach with interactive diagrams and is great for collaboration and visualization."
  },
  {
    question: "How does pricing work?",
    answer: "We offer a free tier that includes basic infrastructure generation and up to 3 projects. Our Pro plan provides unlimited projects, advanced AI features, team collaboration, and priority support. Enterprise plans include custom integrations and dedicated support."
  },
  {
    question: "Can I import existing infrastructure?",
    answer: "Yes! You can import existing Terraform, CloudFormation, or Pulumi code. Our AI will analyze your current infrastructure, provide optimization suggestions, and help you migrate to more efficient patterns while maintaining compatibility."
  }
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-white/70">Everything you need to know about Infra0</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                <ChevronDown 
                  className={`w-5 h-5 text-white/60 transform transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 