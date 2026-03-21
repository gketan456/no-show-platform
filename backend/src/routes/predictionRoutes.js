import express from 'express';
import { createPrediction, getPredictionByAppointmentId } from '../controllers/predictionController.js';

const router = express.Router();

router.post('/predictions', createPrediction);
router.get('/predictions/:appointment_id', getPredictionByAppointmentId);

export default router;