import {
  Shirt,
  Gem,
  Home,
  Palette,
  Coffee,
  Gift,
  ChevronRight,
  TreePine,
  Hammer,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Categories.css";

const categories = [
  {
    name: "Textiles",
    icon: Shirt,
    slug: "textiles",
  },
  {
    name: "Jewellery",
    icon: Gem,
    slug: "jewellery",
  },
  {
    name: "Home Decor",
    icon: Home,
    slug: "home-decor",
  },
  {
    name: "Art & Paintings",
    icon: Palette,
    slug: "art",
  },
  {
    name: "Pottery",
    icon: Coffee,
    slug: "pottery",
  },
  {
    name: "Gifts",
    icon: Gift,
    slug: "gifts",
  },
  {
    name: "Woodcraft",
    icon: TreePine,
    slug: "woodcraft",
    },
    {
    name: "Metal Crafts",
    icon: Hammer,
    slug: "metal-crafts",
    },
    {
    name: "Handmade Bags",
    icon: ShoppingBag,
    slug: "handmade-bags",
    },
];

function Categories() {
  return (
    <section className="categories">
      <div className="categories-container">

        <div className="categories-list">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.slug}
                to={`/explore?category=${category.slug}`}
                className="category-card"
              >
                <div className="category-icon">
                  <Icon size={26} strokeWidth={1.7} />
                </div>

                <span>{category.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="category-container-explore-chevronIcon">
          <Link to='/explore' className="chevronRight-icon-to-explore">
            <ChevronRight />
          </Link>
        </div>

      </div>
    </section>
  );
}

export default Categories;