import { db } from '../firebase/admin.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

const consultationsCollection = db.collection('consultations');

export const createConsultation = async (req, res, next) => {
  try {
    const consultationData = {
      ...req.body,
      status: 'pending',
      createdAt: new Date()
    };
    
    // We already do this from the frontend in your current setup, 
    // but building this API endpoint ensures a secure backend alternative.
    const docRef = await consultationsCollection.add(consultationData);
    
    return sendSuccess(res, 'Consultation request submitted successfully', { id: docRef.id, ...consultationData }, 201);
  } catch (error) {
    next(error);
  }
};

export const getAllConsultations = async (req, res, next) => {
  try {
    const snapshot = await consultationsCollection.orderBy('createdAt', 'desc').get();
    
    const consultations = [];
    snapshot.forEach(doc => {
      consultations.push({ id: doc.id, ...doc.data() });
    });

    return sendSuccess(res, 'Consultation requests fetched successfully', consultations);
  } catch (error) {
    next(error);
  }
};

export const updateConsultationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'contacted', 'closed'];
    if (!validStatuses.includes(status)) {
      return sendError(res, 'Invalid status update', null, 400);
    }

    const docRef = consultationsCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return sendError(res, 'Consultation request not found', null, 404);
    }

    await docRef.update({ 
      status, 
      updatedAt: new Date() 
    });
    
    const updatedDoc = await docRef.get();
    
    return sendSuccess(res, 'Consultation status updated successfully', { id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    next(error);
  }
};
