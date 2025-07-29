import Header from '@/components/landing/Header'
import Footer from '@/components/landing/Footer'
import SectionHero from '@/components/landing/SectionHero'
import SectionWhyWebApp from '@/components/landing/SectionWhyWebApp'
import SectionProjectFlow from '@/components/landing/SectionProjectFlow'
import SectionPacket from '@/components/landing/SectionPacket'
import SectionQnA from '@/components/landing/SectionQnA'
import SectionTestimoni from '@/components/landing/SectionTestimoni'
import SectionOrder from '@/components/landing/SectionOrder'
import SectionCTA from '@/components/landing/SectionCTA'

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <SectionHero />
        <SectionWhyWebApp />
        <SectionProjectFlow />
        <SectionPacket />
        <SectionQnA />
        <SectionTestimoni />
        <SectionOrder />
        <SectionCTA />
      </main>
      <Footer />
    </>
  )
}
