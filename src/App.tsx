import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StatsBar from './components/StatsBar'
import HowItWorks from './components/HowItWorks'
import GeneratorSection from './components/GeneratorSection'
import Roadmap from './components/Roadmap'
import Community from './components/Community'
import Footer from './components/Footer'
import GoaAmbience from './components/GoaAmbience'
import ScrollReveal from './components/ScrollReveal'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState<string>('home')

  return (
    <div className="app">
      <GoaAmbience />
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main>
        <Hero />
        <ScrollReveal as="div">
          <StatsBar />
        </ScrollReveal>
        <ScrollReveal as="div" delay={1}>
          <HowItWorks />
        </ScrollReveal>
        <ScrollReveal as="div">
          <GeneratorSection />
        </ScrollReveal>
        <ScrollReveal as="div">
          <Roadmap />
        </ScrollReveal>
        <ScrollReveal as="div">
          <Community />
        </ScrollReveal>
      </main>
      <ScrollReveal as="div">
        <Footer />
      </ScrollReveal>
    </div>
  )
}

export default App
