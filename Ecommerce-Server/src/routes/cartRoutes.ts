import { Router, Response } from 'express';
import mongoose from 'mongoose';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { protect, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// Apply auth middleware to all cart endpoints
router.use(protect);

/**
 * Helper to calculate cart totals and format items
 */
const formatCartResponse = (cart: any) => {
  let totalAmount = 0;
  let totalCount = 0;

  const items = cart.items.map((item: any) => {
    const prod = item.product || {};
    const itemPrice = prod.price !== undefined ? prod.price : item.price || 0;
    const itemTotal = itemPrice * item.quantity;
    totalAmount += itemTotal;
    totalCount += item.quantity;

    return {
      itemId: item._id.toString(),
      productId: prod._id ? prod._id.toString() : item.product?.toString(),
      name: prod.name || 'Artisan Product',
      price: itemPrice,
      image: prod.image || '',
      category: prod.category || '',
      artisan: prod.artisan || '',
      quantity: item.quantity,
      subtotal: itemTotal,
    };
  });

  return {
    cartId: cart._id.toString(),
    items,
    totalItems: totalCount,
    totalAmount,
  };
};

/**
 * @desc    Get user's shopping cart
 * @route   GET /api/cart
 * @access  Private
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    let cart = await Cart.findOne({ userId }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    const formatted = formatCartResponse(cart);

    res.status(200).json({
      success: true,
      cart: formatted,
    });
  } catch (error: any) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving cart.',
      error: error.message,
    });
  }
});

/**
 * @desc    Add product to cart (or increment quantity)
 * @route   POST /api/cart
 * @access  Private
 */
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required.',
      });
    }

    // Verify product exists in database
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
        message: 'Product not found in catalog.',
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemQuantity = Math.max(1, Number(quantity));

    // Check if product already exists in user's cart
    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productDoc!._id.toString()
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += itemQuantity;
    } else {
      cart.items.push({
        product: productDoc._id as any,
        quantity: itemQuantity,
        price: productDoc.price,
      });
    }

    await cart.save();
    cart = await Cart.findById(cart._id).populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully.',
      cart: formatCartResponse(cart),
    });
  } catch (error: any) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding item to cart.',
      error: error.message,
    });
  }
});

/**
 * @desc    Update quantity of an item in cart
 * @route   PUT /api/cart/:itemId
 * @access  Private
 */
router.put('/:itemId', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found.',
      });
    }

    const targetIndex = cart.items.findIndex(
      (item) =>
        item._id?.toString() === itemId || item.product.toString() === itemId
    );

    if (targetIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart.',
      });
    }

    const newQty = Number(quantity);
    if (newQty <= 0) {
      // Remove item if quantity set to 0 or negative
      cart.items.splice(targetIndex, 1);
    } else {
      cart.items[targetIndex].quantity = newQty;
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully.',
      cart: formatCartResponse(updatedCart),
    });
  } catch (error: any) {
    console.error('Error updating cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating cart.',
      error: error.message,
    });
  }
});

/**
 * @desc    Remove an item completely from cart
 * @route   DELETE /api/cart/:itemId
 * @access  Private
 */
router.delete('/:itemId', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found.',
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        item._id?.toString() !== itemId && item.product.toString() !== itemId
    );

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart.',
      cart: formatCartResponse(updatedCart),
    });
  } catch (error: any) {
    console.error('Error removing cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing item from cart.',
      error: error.message,
    });
  }
});

export default router;
