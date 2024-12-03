import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { CategoryGrid } from '@/components/category-grid'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <div className={`min-h-screen flex flex-col font-sans`}>
      <Navbar />
      <Hero />
      <main className="flex-grow">
        <CategoryGrid />
      </main>
      <Footer />
    </div>
  )
}

