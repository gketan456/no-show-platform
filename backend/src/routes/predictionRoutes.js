import express from 'express';
import { createPrediction, getPredictionByAppointmentId } from '../controllers/predictionController.js';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/predictions', requireAuth, createPrediction);
router.get('/predictions/:appointment_id', requireAuth, getPredictionByAppointmentId);

export default router;