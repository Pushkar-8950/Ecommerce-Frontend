import { Router, Response } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';
import Cart from '../models/Cart';
import { protect, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// Protect all order routes
router.use(protect);

/**
 * Helper to format order for frontend
 */
const formatOrder = (order: any) => {
  return {
    id: order._id.toString(),
    _id: order._id.toString(),
    orderNumber: `ORD-${order._id.toString().slice(-6).toUpperCase()}`,
    createdAt: order.createdAt,
    date: new Date(order.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    status: order.status,
    totalAmount: order.totalAmount,
    total: order.totalAmount,
    paymentMethod: order.paymentMethod || 'Cash on Delivery',
    shippingAddress: order.shippingAddress,
    items: order.items.map((item: any) => ({
      productId: item.productId?.toString(),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image || '',
    })),
  };
};

/**
 * @desc    Place a new order (from cart or body)
 * @route   POST /api/orders
 * @access  Private
 */
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { shippingAddress, paymentMethod, items: bodyItems, totalAmount: bodyTotal } = req.body;

    let orderItems: any[] = [];
    let calculatedTotal = 0;

    // If items provided in body, use them
    if (Array.isArray(bodyItems) && bodyItems.length > 0) {
      orderItems = bodyItems.map((i: any) => {
        const itemPrice = Number(i.price) || 0;
        const itemQty = Number(i.quantity) || 1;
        calculatedTotal += itemPrice * itemQty;
        return {
          productId: mongoose.Types.ObjectId.isValid(i.productId || i.id)
            ? new mongoose.Types.ObjectId(i.productId || i.id)
            : undefined,
          name: i.name || 'Artisan Craft',
          price: itemPrice,
          quantity: itemQty,
          image: i.image || '',
        };
      });
    } else {
      // Otherwise, pull items from user's current Cart
      const cart = await Cart.findOne({ userId }).populate('items.product');

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Your cart is empty. Add products before checking out.',
        });
      }

      orderItems = cart.items.map((item: any) => {
        const prod = item.product || {};
        const itemPrice = prod.price || item.price || 0;
        calculatedTotal += itemPrice * item.quantity;

        return {
          productId: prod._id,
          name: prod.name || 'Artisan Product',
          price: itemPrice,
          quantity: item.quantity,
          image: prod.image || '',
        };
      });
    }

    const finalAmount = bodyTotal ? Number(bodyTotal) : calculatedTotal;

    // Create the order in MongoDB
    const order = await Order.create({
      userId,
      items: orderItems,
      totalAmount: finalAmount,
      status: 'Pending',
      shippingAddress: shippingAddress || {
        street: '123 Artisan Heritage Marg',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302001',
      },
      paymentMethod: paymentMethod || 'Cash on Delivery',
    });

    // Clear the user's cart in database
    await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: formatOrder(order),
    });
  } catch (error: any) {
    console.error('Error placing order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error placing order.',
      error: error.message,
    });
  }
});

/**
 * @desc    Get order history for logged-in user
 * @route   GET /api/orders
 * @access  Private
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders.map(formatOrder),
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving orders.',
      error: error.message,
    });
  }
});

/**
 * @desc    Get specific order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format.',
      });
    }

    const order = await Order.findOne({ _id: id, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    res.status(200).json({
      success: true,
      order: formatOrder(order),
    });
  } catch (error: any) {
    console.error('Error retrieving order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving order.',
      error: error.message,
    });
  }
});

export default router;
