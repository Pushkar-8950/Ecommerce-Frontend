import { Heart, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./FeaturedProducts.css";

const products = [
  {
    id: 1,
    name: "Handwoven Cotton Dupatta",
    artisan: "Meera Handlooms",
    category: "Textiles",
    price: "₹899",
    rating: "4.8",
    reviews: 124,
    image: "https://imgs.search.brave.com/RLJz-__w64XF1cvpUrkypEAUcC89YyJoefJYPIyieD8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ib25n/b25pa2V0YW4uaW4v/Y2RuL3Nob3AvZmls/ZXMvdW50aXRsZWQt/NzNfZ3JhbmRlLnBu/Zz92PTE3MDU0Mjkx/MTI",
  },
  {
    id: 2,
    name: "Blue Pottery Vase",
    artisan: "Jaipur Crafts",
    category: "Pottery",
    price: "₹1,249",
    rating: "4.7",
    reviews: 86,
    image: "https://imgs.search.brave.com/ZU6hDQxA-fUfJLQCi6nGqWCcX3wLyB9C9YSM14jNf64/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YXJhdmFsaWkuY29t/L2Nkbi9zaG9wL2Zp/bGVzLzFfMDAwMl9z/ZXB0ZW1iZXI3YXJh/dmFsaWl2YXNlc18w/MDU0X0RTQ180MzI1/LmpwZz92PTE3NDM0/MjA3NzImd2lkdGg9/OTUw",
  },
  {
    id: 3,
    name: "Handcrafted Wooden Elephant",
    artisan: "Rajasthan Artisans",
    category: "Woodcraft",
    price: "₹749",
    rating: "4.9",
    reviews: 213,
    image: "https://imgs.search.brave.com/PnszVAurqdYgu6XSeIt-dA8U23ab4PLL_VEdq4kF1W8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/d29vZGVuY2Fydmlu/Z3MuaW4vY2RuL3No/b3AvZmlsZXMvV0M1/MzQxLndlYnA_dj0x/NzgyMzg3NjcxJndp/ZHRoPTEwODA",
  },
  {
    id: 4,
    name: "Traditional Brass Diya Set",
    artisan: "Kashi Metalworks",
    category: "Metal Crafts",
    price: "₹599",
    rating: "4.6",
    reviews: 71,
    image: "https://imgs.search.brave.com/zuvPkgD_hZBuhPrqadaQx48OiIofYj2vI_BJ11_uSJ0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/c2F0dmlrc3RvcmUu/aW4vY2RuL3Nob3Av/cHJvZHVjdHMvN19J/bmNoX1RyYWRpdGlv/bmFsX0JyYXNzX0tl/cmFsYV9EaXlhXzQ4/MHguanBnP3Y9MTc0/Njc3MTE1Mw",
  },
  {
    id: 5,
    name: "Hand-painted Terracotta Pot",
    artisan: "Bengal Terracotta Arts",
    category: "Pottery",
    price: "₹699",
    rating: "4.7",
    reviews: 98,
    image: "https://imgs.search.brave.com/-kq0y3m0oFB9HC0GccMEzrfjMcFtqgESnlOe3az1m_8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLmV0/c3lzdGF0aWMuY29t/LzE1MzExNjA0L3Iv/aWwvZWE5OTk1LzY2/NjM2MjYyMDgvaWxf/MzAweDMwMC42NjYz/NjI2MjA4X2FrMXUu/anBn",
  },
  {
    id: 6,
    name: "Embroidered Silk Cushion Cover",
    artisan: "Kashmir Craft House",
    category: "Textiles",
    price: "₹1,099",
    rating: "4.8",
    reviews: 76,
    image: "https://imgs.search.brave.com/hqfERa4sdm1Byv8KuFd8pL8G-vsneXreM4z6bvyc19s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFpc0FUVW9wK0wu/anBn",
  },
  {
    id: 7,
    name: "Handcrafted Cane Basket",
    artisan: "Assam Cane Crafts",
    category: "Bamboo & Cane",
    price: "₹849",
    rating: "4.6",
    reviews: 64,
    image: "https://imgs.search.brave.com/84ddyplTF419S1zFtAjdH4kFeNt4vA4gwPyk__8eEFw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/ZXRoaWNhb25saW5l/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMS8xMC9DYW5l/LWJhc2tldC13aXRo/LWZpeGVkLWhhbmRs/ZS5qcGVn",
  },
  {
    id: 8,
    name: "Traditional Dhokra Craft Figurine",
    artisan: "Bastar Metal Crafts",
    category: "Metal Crafts",
    price: "₹1,499",
    rating: "4.9",
    reviews: 112,
    image: "https://imgs.search.brave.com/cBXe-3B3ljfICefpxj3ssTTDnN5Zr3BmHR3RAi5VJTU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9hcnRs/aW5lY3JlYXRpb24u/aW4vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjUvMDEvMTZ4OV9B/X2hhbmRjcmFmdGVk/X0Rob2tyYV9hcnRf/YnJhc3Nfcy1lMTcz/NzQ2NTMyMTM5NS5w/bmc",
  },
];

function FeaturedProducts() {
  return (
    <section className="featured-products">
      <div className="featured-products-container">

        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>

              <div className="product-image-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />

                <button
                  className="product-wishlist"
                  aria-label={`Add ${product.name} to wishlist`}
                >
                  <Heart size={18} />
                </button>
              </div>

              <div className="product-info">

                <span className="product-category">
                  {product.category}
                </span>

                <Link
                  to={`/product/${product.id}`}
                  className="product-name"
                >
                  {product.name}
                </Link>

                <span className="product-artisan">
                  by {product.artisan}
                </span>

                <div className="product-rating">
                  <span className="rating-box">
                    {product.rating}
                    <Star size={12} fill="currentColor" />
                  </span>

                  <span className="review-count">
                    ({product.reviews})
                  </span>
                </div>

                <div className="product-bottom">
                  <span className="product-price">
                    {product.price}
                  </span>

                  <button className="add-cart-btn">
                    Add to cart
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default FeaturedProducts;