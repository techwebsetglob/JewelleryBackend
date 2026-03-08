import { db } from '../firebase/admin.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

const newsletterCollection = db.collection('newsletter');

export const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check for duplicates
    const existingSubscriber = await newsletterCollection.where('email', '==', email).limit(1).get();
    
    if (!existingSubscriber.empty) {
      return sendError(res, 'Email is already subscribed', null, 409);
    }

    const subscriberData = {
      email,
      subscribedAt: new Date()
    };
    
    const docRef = await newsletterCollection.add(subscriberData);
    
    return sendSuccess(res, 'Successfully subscribed to newsletter', { id: docRef.id, ...subscriberData }, 201);
  } catch (error) {
    next(error);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    const snapshot = await newsletterCollection.where('email', '==', email).limit(1).get();
    
    if (snapshot.empty) {
      return sendError(res, 'Subscriber not found', null, 404);
    }

    // Delete the document
    const docId = snapshot.docs[0].id;
    await newsletterCollection.doc(docId).delete();

    return sendSuccess(res, 'Successfully unsubscribed from newsletter');
  } catch (error) {
    next(error);
  }
};

export const getAllSubscribers = async (req, res, next) => {
  try {
    const snapshot = await newsletterCollection.orderBy('subscribedAt', 'desc').get();
    
    const subscribers = [];
    snapshot.forEach(doc => {
      subscribers.push({ id: doc.id, ...doc.data() });
    });

    return sendSuccess(res, 'Subscribers fetched successfully', subscribers);
  } catch (error) {
    next(error);
  }
};
