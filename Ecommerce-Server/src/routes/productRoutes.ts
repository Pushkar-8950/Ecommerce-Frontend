import { Router, Request, Response } from 'express';

const router = Router();

// Default catalog items
const initialProducts = [
  {
    id: '1',
    name: 'Handwoven Cotton Dupatta',
    artisan: 'Meera Handlooms',
    category: 'Textiles',
    region: 'Haryana',
    price: 899,
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    description: 'Exquisitely handwoven cotton dupatta crafted with organic dyes.',
  },
  {
    id: '2',
    name: 'Blue Pottery Vase',
    artisan: 'Jaipur Crafts',
    category: 'Pottery',
    region: 'Rajasthan',
    price: 1249,
    rating: 4.7,
    reviews: 86,
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    description: 'Traditional Jaipur blue pottery vase with floral quartz motifs.',
  },
  {
    id: '3',
    name: 'Handcrafted Wooden Elephant',
    artisan: 'Rajasthan Artisans',
    category: 'Woodcraft',
    region: 'Rajasthan',
    price: 749,
    rating: 4.9,
    reviews: 213,
    image: 'https://images.unsplash.com/photo-1582582494705-f8ce0b0c24f0?auto=format&fit=crop&w=600&q=80',
    description: 'Intricately hand-carved wooden elephant finished in polished lacquer.',
  },
  {
    id: '4',
    name: 'Traditional Brass Diya Set',
    artisan: 'Kashi Metalworks',
    category: 'Metal Crafts',
    region: 'Uttar Pradesh',
    price: 599,
    rating: 4.6,
    reviews: 71,
    image: 'https://images.unsplash.com/photo-1605007493699-af65834f8a00?auto=format&fit=crop&w=600&q=80',
    description: 'Pure bell-metal brass diya set handcrafted by Varanasi metal smiths.',
  },
  {
    id: '5',
    name: 'Handmade Silk Cushion Cover',
    artisan: 'Banaras Weaves',
    category: 'Home Decor',
    region: 'Uttar Pradesh',
    price: 699,
    rating: 4.8,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
    description: 'Pure Banarasi raw silk cushion cover with brocade zari border.',
  },
  {
    id: '6',
    name: 'Traditional Silver Earrings',
    artisan: 'Desert Jewellery',
    category: 'Jewellery',
    region: 'Rajasthan',
    price: 1499,
    rating: 4.7,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    description: 'Oxidized 92.5 sterling silver ethnic earrings with tribal engravings.',
  },
];

/**
 * @desc    Get all products with category, region, and sort filtering
 * @route   GET /api/products
 * @access  Public
 */
router.get('/', (req: Request, res: Response) => {
  const { category, region, sort } = req.query;

  let filtered = [...initialProducts];

  // 1. Filter by category (comma-separated or single)
  if (category && typeof category === 'string') {
    const categoryList = category.split(',').map((c) => c.trim().toLowerCase());
    filtered = filtered.filter((p) =>
      categoryList.includes(p.category.toLowerCase())
    );
  }

  // 2. Filter by region (comma-separated or single)
  if (region && typeof region === 'string') {
    const regionList = region.split(',').map((r) => r.trim().toLowerCase());
    filtered = filtered.filter((p) =>
      regionList.includes(p.region.toLowerCase())
    );
  }

  // 3. Sort products
  if (sort === 'low-high') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'high-low') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  res.status(200).json({
    success: true,
    count: filtered.length,
    products: filtered,
  });
});

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
router.get('/:id', (req: Request, res: Response) => {
  const product = initialProducts.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found.',
    });
  }
  return res.status(200).json({
    success: true,
    product,
  });
});
/**
 * @desc    Create a new product (Artisan)
 * @route   POST /api/products
 * @access  Public
 */
router.post('/', (req: Request, res: Response) => {
  const { name, price, category, region, description, image } = req.body;

  if (!name || !price) {
    return res.status(400).json({
      success: false,
      message: 'Name and price are required.',
    });
  }

  const newProduct = {
    id: String(Date.now()),
    name,
    price: Number(price),
    category: category || 'Pottery',
    region: region || 'Rajasthan',
    description: description || '',
    image: image || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    artisan: 'Master Artisan',
    rating: 5.0,
    reviews: 1,
  };

  initialProducts.unshift(newProduct);

  return res.status(201).json({
    success: true,
    message: 'Product created successfully',
    product: newProduct,
  });
});

export default router;
