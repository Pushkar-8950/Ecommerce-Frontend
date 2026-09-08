import React from 'react'
import Hero from '../components/home/Hero'
import Categories from '../components/home/Categories'
import FeaturedProducts from '../components/home/FeaturedProducts'
import ExploreRegions from '../components/home/ExploreRegions'
import Footer from '../components/home/Footer'

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
