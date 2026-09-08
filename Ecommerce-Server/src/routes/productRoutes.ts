import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';

const router = Router();

const initialSeedProducts = [
  {
    name: 'Handwoven Cotton Dupatta',
    artisan: 'Meera Handlooms',
    category: 'Textiles',
    region: 'Haryana',
    price: 899,
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    description: 'Exquisitely handwoven cotton dupatta crafted with organic dyes.',
    stock: 15,
  },
  {
    name: 'Blue Pottery Vase',
    artisan: 'Jaipur Crafts',
    category: 'Pottery',
    region: 'Rajasthan',
    price: 1249,
    rating: 4.7,
    reviews: 86,
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    description: 'Traditional Jaipur blue pottery vase with floral quartz motifs.',
    stock: 8,
  },
  {
    name: 'Handcrafted Wooden Elephant',
    artisan: 'Rajasthan Artisans',
    category: 'Woodcraft',
    region: 'Rajasthan',
    price: 749,
    rating: 4.9,
    reviews: 213,
    image: 'https://images.unsplash.com/photo-1582582494705-f8ce0b0c24f0?auto=format&fit=crop&w=600&q=80',
    description: 'Intricately hand-carved wooden elephant finished in polished lacquer.',
    stock: 20,
  },
  {
    name: 'Traditional Brass Diya Set',
    artisan: 'Kashi Metalworks',
    category: 'Metal Crafts',
    region: 'Uttar Pradesh',
    price: 599,
    rating: 4.6,
    reviews: 71,
    image: 'https://images.unsplash.com/photo-1605007493699-af65834f8a00?auto=format&fit=crop&w=600&q=80',
    description: 'Pure bell-metal brass diya set handcrafted by Varanasi metal smiths.',
    stock: 25,
  },
  {
    name: 'Handmade Silk Cushion Cover',
    artisan: 'Banaras Weaves',
    category: 'Home Decor',
    region: 'Uttar Pradesh',
    price: 699,
    rating: 4.8,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
    description: 'Pure Banarasi raw silk cushion cover with brocade zari border.',
    stock: 12,
  },
  {
    name: 'Traditional Silver Earrings',
    artisan: 'Desert Jewellery',
    category: 'Jewellery',
    region: 'Rajasthan',
    price: 1499,
    rating: 4.7,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    description: 'Oxidized 92.5 sterling silver ethnic earrings with tribal engravings.',
    stock: 10,
  },
];

/**
 * Seed initial catalog into MongoDB if empty
 */
const ensureSeedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(initialSeedProducts);
      console.log('✅ Seeded initial products into MongoDB.');
    }
  } catch (error) {
    console.warn('Product auto-seed check skipped:', error);
  }
};

/**
 * @desc    Get all products from MongoDB with filter & sort support
 * @route   GET /api/products
 * @access  Public
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    await ensureSeedProducts();

    const { category, region, sort } = req.query;
    const filterQuery: any = {};

    // Filter by Category
    if (category && typeof category === 'string') {
      const categories = category.split(',').map((c) => c.trim());
      filterQuery.category = {
        $in: categories.map((c) => new RegExp(`^${c}$`, 'i')),
      };
    }

    // Filter by Region
    if (region && typeof region === 'string') {
      const regions = region.split(',').map((r) => r.trim());
      filterQuery.region = {
        $in: regions.map((r) => new RegExp(`^${r}$`, 'i')),
      };
    }

    // Sorting
    let sortOptions: any = { createdAt: -1 };
    if (sort === 'low-high') {
      sortOptions = { price: 1 };
    } else if (sort === 'high-low') {
      sortOptions = { price: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1 };
    }

    const docs = await Product.find(filterQuery).sort(sortOptions);

    // Format products with string id for frontend
    const products = docs.map((doc) => ({
      id: doc._id.toString(),
      _id: doc._id.toString(),
      name: doc.name,
      price: doc.price,
      category: doc.category,
      region: doc.region,
      description: doc.description,
      image: doc.image,
      artisan: doc.artisan,
      rating: doc.rating,
      reviews: doc.reviews,
      stock: doc.stock,
      createdAt: doc.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error: any) {
    console.error('Error fetching products from MongoDB:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products from database.',
      error: error.message,
    });
  }
});

/**
 * @desc    Get single product by ID from MongoDB
 * @route   GET /api/products/:id
 * @access  Public
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    let product = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }

    if (!product) {
      // Fallback lookup if passed non-objectId identifier
      product = await Product.findOne({ name: new RegExp(id, 'i') });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const formattedProduct = {
      id: product._id.toString(),
      _id: product._id.toString(),
      name: product.name,
      price: product.price,
      category: product.category,
      region: product.region,
      description: product.description,
      image: product.image,
      artisan: product.artisan,
      rating: product.rating,
      reviews: product.reviews,
      stock: product.stock,
      createdAt: product.createdAt,
    };

    return res.status(200).json({
      success: true,
      product: formattedProduct,
    });
  } catch (error: any) {
    console.error('Error fetching product detail:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving product detail.',
      error: error.message,
    });
  }
});

/**
 * @desc    Create/List a new product in MongoDB
 * @route   POST /api/products
 * @access  Public (or Artisan)
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, price, category, region, description, image, artisan, stock } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product name and price are required.',
      });
    }

    const newProduct = await Product.create({
      name: name.trim(),
      price: Number(price),
      category: category || 'Pottery',
      region: region || 'Rajasthan',
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
      artisan: artisan || 'Master Artisan',
      stock: stock ? Number(stock) : 10,
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully in MongoDB.',
      product: {
        id: newProduct._id.toString(),
        _id: newProduct._id.toString(),
        name: newProduct.name,
        price: newProduct.price,
        category: newProduct.category,
        region: newProduct.region,
        description: newProduct.description,
        image: newProduct.image,
        artisan: newProduct.artisan,
        rating: newProduct.rating,
        reviews: newProduct.reviews,
        stock: newProduct.stock,
      },
    });
  } catch (error: any) {
    console.error('Error creating product in MongoDB:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create product in database.',
      error: error.message,
    });
  }
});

export default router;
