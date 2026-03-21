import express from "express";
import { createPatient,getAllPatients,getPatientById,deletePatient,updatePatient } from "../controllers/patientController.js";

const router = express.Router();

router.post("/patients",createPatient);
router.get("/patients",getAllPatients);
router.get("/patients/:id",getPatientById);
router.put("/patients/:id",updatePatient);
router.delete("/patients/:id",deletePatient);

export default router;