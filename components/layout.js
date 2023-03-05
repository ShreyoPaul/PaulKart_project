import Navbar from './navbar'
import Footer from './footer'

export default function Layout({ children }) {
    // console.log(children)
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}