import { useState } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  Star,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Explore.css";

const products = [
  {
    id: 1,
    name: "Handwoven Cotton Dupatta",
    artisan: "Meera Handlooms",
    category: "Textiles",
    region: "Haryana",
    price: 899,
    rating: 4.8,
    reviews: 124,
    image: "/src/assets/products/dupatta.jpg",
  },
  {
    id: 2,
    name: "Blue Pottery Vase",
    artisan: "Jaipur Crafts",
    category: "Pottery",
    region: "Rajasthan",
    price: 1249,
    rating: 4.7,
    reviews: 86,
    image: "/src/assets/products/vase.jpg",
  },
  {
    id: 3,
    name: "Handcrafted Wooden Elephant",
    artisan: "Rajasthan Artisans",
    category: "Woodcraft",
    region: "Rajasthan",
    price: 749,
    rating: 4.9,
    reviews: 213,
    image: "/src/assets/products/elephant.jpg",
  },
  {
    id: 4,
    name: "Traditional Brass Diya Set",
    artisan: "Kashi Metalworks",
    category: "Metal Crafts",
    region: "Uttar Pradesh",
    price: 599,
    rating: 4.6,
    reviews: 71,
    image: "/src/assets/products/diya.jpg",
  },
  {
    id: 5,
    name: "Handmade Silk Cushion Cover",
    artisan: "Banaras Weaves",
    category: "Home Decor",
    region: "Uttar Pradesh",
    price: 699,
    rating: 4.8,
    reviews: 95,
    image: "/src/assets/products/cushion.jpg",
  },
  {
    id: 6,
    name: "Traditional Silver Earrings",
    artisan: "Desert Jewellery",
    category: "Jewellery",
    region: "Rajasthan",
    price: 1499,
    rating: 4.7,
    reviews: 142,
    image: "/src/assets/products/earrings.jpg",
  },
];

const categories = [
  "Textiles",
  "Jewellery",
  "Home Decor",
  "Art & Paintings",
  "Pottery",
  "Gifts",
  "Woodcraft",
  "Metal Crafts",
  "Handmade Bags",
];

const regions = [
  "Rajasthan",
  "Haryana",
  "Uttar Pradesh",
  "Gujarat",
  "West Bengal",
];

function Explore() {

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [sortBy, setSortBy] = useState("");

  // Toggle buttons for selecting categories and regions
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const toggleRegion = (region) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((item) => item !== region)
        : [...prev, region]
    );
  };

  // Filter products based on selected categories and regions
  let filteredProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    const regionMatch =
      selectedRegions.length === 0 ||
      selectedRegions.includes(product.region);

    return categoryMatch && regionMatch;
  });

  // Sort products based on selected sorting option
  if (sortBy === "low-high") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => a.price - b.price
    );
  }

  if (sortBy === "high-low") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.price - a.price
    );
  }

  if (sortBy === "rating") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.rating - a.rating
    );
  }

  return (
    <main className="explore-page">

      {/* Heading */}

      <div className="explore-header">
        <div>
          <h1>Explore Crafts</h1>

          <p>
            Discover authentic handcrafted products
            from artisans across India.
          </p>
        </div>
      </div>


      {/* Content */}

      <div className="explore-container">

        {/* Sidebar */}

        <aside className="filter-sidebar">

          <div className="filter-title">
            <SlidersHorizontal size={18} />
            <h3>Filters</h3>
          </div>


          {/* Categories */}

          <div className="filter-section">

            <h4>Categories</h4>

            {categories.map((category) => (
              <label
                key={category}
                className="filter-option"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() =>
                    toggleCategory(category)
                  }
                />

                <span>{category}</span>

              </label>
            ))}

          </div>


          {/* Region */}

          <div className="filter-section">

            <h4>Region</h4>

            {regions.map((region) => (
              <label
                key={region}
                className="filter-option"
              >
                <input
                  type="checkbox"
                  checked={selectedRegions.includes(region)}
                  onChange={() =>
                    toggleRegion(region)
                  }
                />

                <span>{region}</span>

              </label>
            ))}

          </div>

        </aside>


        {/* Products */}

        <section className="explore-products">

          <div className="explore-products-top">

            <p>
              Showing{" "}
              <strong>
                {filteredProducts.length}
              </strong>{" "}
              products
            </p>

            <div className="sort-container">

              <span>Sort by:</span>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
              >
                <option value="">
                  Recommended
                </option>

                <option value="low-high">
                  Price: Low to High
                </option>

                <option value="high-low">
                  Price: High to Low
                </option>

                <option value="rating">
                  Top Rated
                </option>

              </select>

            </div>

          </div>


          {/* Product Grid */}

          <div className="explore-products-grid">

            {filteredProducts.map((product) => (

              <div
                className="explore-product-card"
                key={product.id}
              >

                <div className="explore-product-image">

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <button className="explore-wishlist">
                    <Heart size={18} />
                  </button>

                </div>


                <div className="explore-product-info">

                  <span className="explore-category">
                    {product.category}
                  </span>

                  <Link
                    to={`/product/${product.id}`}
                    className="explore-product-name"
                  >
                    {product.name}
                  </Link>

                  <span className="explore-artisan">
                    by {product.artisan}
                  </span>


                  <div className="explore-rating">

                    <span className="explore-rating-box">

                      {product.rating}

                      <Star
                        size={11}
                        fill="currentColor"
                      />

                    </span>

                    <span>
                      ({product.reviews})
                    </span>

                  </div>


                  <strong className="explore-price">
                    ₹{product.price.toLocaleString()}
                  </strong>

                </div>

              </div>

            ))}

          </div>


          {/* Empty State */}

          {filteredProducts.length === 0 && (

            <div className="no-products">

              <h3>
                No products found
              </h3>

              <p>
                Try changing your filters.
              </p>

            </div>

          )}

        </section>

      </div>

    </main>
  );
}

export default Explore;