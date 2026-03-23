import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/appointments", requireAuth, createAppointment);
router.get("/appointments", requireAuth, getAllAppointments);
router.get("/appointments/:id", requireAuth, getAppointmentById);
router.put("/appointments/:id", requireAuth, updateAppointment);
router.delete("/appointments/:id", requireAuth, deleteAppointment);

export default router;