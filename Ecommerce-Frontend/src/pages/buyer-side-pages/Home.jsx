import Hero from '../../components/buyer-side-components/Hero'
import Categories from '../../components/buyer-side-components/Categories'
import FeaturedProducts from '../../components/buyer-side-components/FeaturedProducts'
import ExploreRegions from '../../components/buyer-side-components/ExploreRegions'
import Footer from '../../components/buyer-side-components/Footer'

const Home = () => {
  return (
    <div>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <ExploreRegions />
      <Footer />
    </div>
  )
}

export default Home
