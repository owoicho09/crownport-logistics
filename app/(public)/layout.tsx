import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import ScrollToTop from '@/components/public/ScrollToTop'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
