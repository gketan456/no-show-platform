import express from "express";
import { createPatient,getAllPatients,getPatientById,deletePatient,updatePatient } from "../controllers/patientController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/patients",requireAuth,createPatient);
router.get("/patients",requireAuth,getAllPatients);
router.get("/patients/:id",requireAuth,getPatientById);
router.put("/patients/:id",requireAuth,updatePatient);
router.delete("/patients/:id",requireAuth,deletePatient);

export default router;