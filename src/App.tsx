import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StatsBar from './components/StatsBar'
import HowItWorks from './components/HowItWorks'
import GeneratorSection from './components/GeneratorSection'
import Roadmap from './components/Roadmap'
import Community from './components/Community'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState<string>('home')

  return (
    <div className="app">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main>
        <Hero />
        <StatsBar />
        <HowItWorks />
        <GeneratorSection />
        <Roadmap />
        <Community />
      </main>
      <Footer />
    </div>
  )
}

export default App
