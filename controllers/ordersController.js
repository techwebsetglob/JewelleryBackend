import { db } from '../firebase/admin.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

const ordersCollection = db.collection('orders');

export const createOrder = async (req, res, next) => {
  try {
    const orderData = {
      ...req.body,
      userId: req.user.uid,
      userEmail: req.user.email,
      status: 'pending',
      createdAt: new Date()
    };
    
    const docRef = await ordersCollection.add(orderData);
    
    return sendSuccess(res, 'Order placed successfully', { id: docRef.id, ...orderData }, 201);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const snapshot = await ordersCollection
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get();
    
    const orders = [];
    snapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    return sendSuccess(res, 'User orders fetched successfully', orders);
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const snapshot = await ordersCollection.orderBy('createdAt', 'desc').get();
    
    const orders = [];
    snapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    return sendSuccess(res, 'All orders fetched successfully', orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const docRef = ordersCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return sendError(res, 'Order not found', null, 404);
    }

    await docRef.update({ 
      status, 
      updatedAt: new Date() 
    });
    
    const updatedDoc = await docRef.get();
    
    return sendSuccess(res, 'Order status updated successfully', { id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    next(error);
  }
};
