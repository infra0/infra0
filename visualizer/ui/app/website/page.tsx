"use client"

import Navigation from "./components/navigation"
import HeroSection from "./components/hero-section"
import CapabilitiesSection from "./components/capabilities-section"
import FeaturesSection from "./components/features-section"
import CommunitySection from "./components/community-section"
import FAQSection from "./components/faq-section"
import Footer from "./components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      <HeroSection />
      <CapabilitiesSection />
      <FeaturesSection />
      <CommunitySection />
      <FAQSection />
      <Footer />
    </div>
  )
}
