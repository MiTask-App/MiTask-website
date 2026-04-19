import Navbar from "@/component/Navbar"
import Hero from "@/component/Hero"
import About from "@/component/About"
import Features from "@/component/Features"
import Testimoni from "@/component/Testimoni"
import Footer from "@/component/Footter"

export default function Home() {
  return (
    <main className="pt-20">
      <Navbar />

      <section id="about">
        <About />
      </section>

      <Hero />

      <section id="features">
        <Features />
      </section>

      <section id="testimoni">
        <Testimoni />
      </section>

      <Footer />
    </main>
  )
}