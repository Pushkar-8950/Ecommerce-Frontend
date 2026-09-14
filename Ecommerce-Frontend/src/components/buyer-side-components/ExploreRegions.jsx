import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./ExploreRegions.css";

const regions = [
  {
    name: "Rajasthan",
    craft: "Blue Pottery & Block Printing",
    slug: "rajasthan",
    image: "https://imgs.search.brave.com/mKstIChMq2bULdM81efeo5NpbsVFX63EhmJC-AQuBig/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9yb3lh/bHN0dWZmcy5jb20v/Y2RuL3Nob3AvZmls/ZXMvcmFqYXN0aGFu/aS1tZXRhbGlyb24t/c2FmYS1tZW4tc2V0/LW9mLTMtd2l0aC1l/YXJpbmctbXVsdGkt/Y29sb3ItNDV4M3g4/LWluY2hlcy05MDM4/MDg1LnBuZz92PTE3/ODU5NDE2NTAmd2lk/dGg9MTIwMA",
  },
  {
    name: "Kashmir",
    craft: "Pashmina & Papier-mâché",
    slug: "kashmir",
    image: "https://imgs.search.brave.com/7J5xH5N4E8CIGnYVtKhAp1PvycIJiKXm-G6li87cWFI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9rYXNo/bWlyaWNhLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNi8w/Mi9HZW1pbmlfR2Vu/ZXJhdGVkX0ltYWdl/XzFhOWdmbjFhOWdm/bjFhOWdfMy53ZWJw",
  },
  {
    name: "Gujarat",
    craft: "Bandhani & Embroidery",
    slug: "gujarat",
    image: "https://imgs.search.brave.com/13usLXj_3mjMHksIMJqS51Ima7Cdw6wgA8LLMY8Xx6g/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODFQeGlrT1p6cUwu/anBn",
  },
  {
    name: "West Bengal",
    craft: "Kantha & Terracotta",
    slug: "west-bengal",
    image: "https://imgs.search.brave.com/e0FOEujsKlJPhLhVh9RDsEs-HrW4EwPvcl9gBmELK-E/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90cmF2/ZWx3aXRoYWJvbmcu/Y29tL3dwLWNvbnRl/bnQvdXBsb2Fkcy9l/bGVtZW50b3IvdGh1/bWJzL2ltZy1vNGs3/bWFtOXJtaGQ5NXpy/bmtmamZyNTlhcGhk/NDhrZ3JvN3Z6cGo0/ajAuanBn",
  },
  {
    name: "Odisha",
    craft: "Pattachitra & Handloom",
    slug: "odisha",
    image: "https://imgs.search.brave.com/o4aU-pemoXqnzsWJbafXjrJARX1ZKoz4WYsW6_Q3z6Q/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NDFNUkwyUmJlYUwu/anBn",
  },
  {
    name: "Uttar Pradesh",
    craft: "Chikankari & Brassware",
    slug: "uttar-pradesh",
    image: "https://imgs.search.brave.com/LlRBPXtIQOWWpqlQNPPjrhJYzrmZoMpEWz5PEd34Cus/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/c2hvcGlmeS5jb20v/cy9maWxlcy8xLzEx/OTQvMTQ5OC9maWxl/cy9iMTZfNDgweDQ4/MC5wbmc_dj0xNzI5/NDk1Mzcw",
  },
];

function ExploreRegions() {
  return (
    <section className="explore-regions">
      <div className="explore-regions-container">

        <div className="regions-heading">
          <div>
            <span>Explore India</span>
            <h2>Discover Crafts by Region</h2>
            <p>
              Every region has a story. Explore India's diverse
              craftsmanship and the artisans behind it.
            </p>
          </div>

          <Link to="/explore" className="regions-view-all">
            Explore all
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="regions-grid">
          {regions.map((region) => (
            <Link
              key={region.slug}
              to={`/explore?region=${region.slug}`}
              className="region-card"
            >
              <img
                src={region.image}
                alt={region.name}
              />

              <div className="region-overlay">
                <span>{region.craft}</span>
                <h3>{region.name}</h3>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

export default ExploreRegions;