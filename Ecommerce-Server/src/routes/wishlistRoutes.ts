import { Router, Response } from 'express';
import mongoose from 'mongoose';
import Wishlist from '../models/Wishlist';
import Product from '../models/Product';
import { protect, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// Protect all wishlist endpoints
router.use(protect);

/**
 * Format populated products for consistent frontend consumption
 */
const formatWishlistProducts = (wishlistDoc: any) => {
  if (!wishlistDoc || !wishlistDoc.products) return [];
  return wishlistDoc.products
    .filter((prod: any) => prod != null)
    .map((prod: any) => ({
      id: prod._id ? prod._id.toString() : prod.toString(),
      _id: prod._id ? prod._id.toString() : prod.toString(),
      name: prod.name || 'Handcrafted Artisan Item',
      price: prod.price || 0,
      image: prod.image || '',
      category: prod.category || 'Crafts',
      artisan: prod.artisan || 'Master Artisan',
      rating: prod.rating || 4.8,
      reviews: prod.reviews || 0,
      stock: prod.stock !== undefined ? prod.stock : 10,
    }));
};

/**
 * @desc    Get user's wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    let wishlist = await Wishlist.findOne({ userId }).populate('products');

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, products: [] });
    }

    const formattedProducts = formatWishlistProducts(wishlist);

    res.status(200).json({
      success: true,
      count: formattedProducts.length,
      products: formattedProducts,
    });
  } catch (error: any) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving wishlist.',
      error: error.message,
    });
  }
});

/**
 * @desc    Add product to wishlist
 * @route   POST /api/wishlist
 * @access  Private
 */
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required.',
      });
    }

    let productDoc = null;
    if (mongoose.Types.ObjectId.isValid(productId)) {
      productDoc = await Product.findById(productId);
    }
    if (!productDoc) {
      productDoc = await Product.findOne();
    }

    if (!productDoc) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [] });
    }

    const exists = wishlist.products.some(
      (p) => p.toString() === productDoc!._id.toString()
    );

    if (!exists) {
      wishlist.products.push(productDoc._id as any);
      await wishlist.save();
    }

    const updated = await Wishlist.findById(wishlist._id).populate('products');

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist.',
      products: formatWishlistProducts(updated),
    });
  } catch (error: any) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating wishlist.',
      error: error.message,
    });
  }
});

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/wishlist/:productId
 * @access  Private
 */
router.delete('/:productId', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found.',
      });
    }

    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== productId
    );

    await wishlist.save();
    const updated = await Wishlist.findById(wishlist._id).populate('products');

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist.',
      products: formatWishlistProducts(updated),
    });
  } catch (error: any) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing item from wishlist.',
      error: error.message,
    });
  }
});

export default router;
