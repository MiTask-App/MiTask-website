import Navbar from "@/component/Navbar"
import Hero from "@/component/Hero"
import About from "@/component/About"
import Features from "@/component/Features"
import Testimoni from"@/component/Testimoni"
import Footer from "@/component/Footter"

export default function Home() {
  return (
    <main>
      <Navbar />
      <About />
      <Hero />
      <Features />
      <Testimoni />
      <Footer />
    </main>
  )
}
