import { db } from '../firebase/admin.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

const productsCollection = db.collection('products');

export const getAllProducts = async (req, res, next) => {
  try {
    const { category, limit, sort } = req.query;
    let query = productsCollection;

    if (category) {
      query = query.where('category', '==', category);
    }

    if (sort === 'price_asc') {
      query = query.orderBy('price', 'asc');
    } else if (sort === 'price_desc') {
      query = query.orderBy('price', 'desc');
    } else {
      // Default sort by creation, requires an index if combined with where() on high traffic apps
      query = query.orderBy('createdAt', 'desc');
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const snapshot = await query.get();
    
    const products = [];
    snapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });

    return sendSuccess(res, 'Products fetched successfully', products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await productsCollection.doc(id).get();

    if (!doc.exists) {
      return sendError(res, 'Product not found', null, 404);
    }

    return sendSuccess(res, 'Product fetched successfully', { id: doc.id, ...doc.data() });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const productData = {
      ...req.body,
      createdAt: new Date()
    };
    
    const docRef = await productsCollection.add(productData);
    
    return sendSuccess(res, 'Product created successfully', { id: docRef.id, ...productData }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    const docRef = productsCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return sendError(res, 'Product not found', null, 404);
    }

    await docRef.update(updateData);
    
    // Fetch the updated document to return it
    const updatedDoc = await docRef.get();
    
    return sendSuccess(res, 'Product updated successfully', { id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const docRef = productsCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return sendError(res, 'Product not found', null, 404);
    }

    await docRef.delete();
    
    return sendSuccess(res, 'Product deleted successfully', { id });
  } catch (error) {
    next(error);
  }
};
