import express from 'express';
import { getAllAppointmentsWithPredictions, sendReminderEmail } from '../controllers/adminController.js';
import {requireAuth,requireRole} from '../middlewares/auth.js';

const router = express.Router();

router.get('/admin/appointments', requireAuth, requireRole('admin'), getAllAppointmentsWithPredictions);
router.post('/admin/send-reminder', requireAuth, requireRole('admin'), sendReminderEmail);

export default router;

