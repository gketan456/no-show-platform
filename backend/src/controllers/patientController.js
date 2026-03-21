import { createPatientService,getAllPatientsService,getPatientByIdService,deletePatientService,updatePatientService } from "../services/patientService.js";

const handleResponse = (res,status,message,data = null)=>{
    res.status(status).json({
        status,
        message,
        data
    })
}

export const createPatient = async(req,res,next)=>{
    try{
        const {full_name,email,phone} = req.body;
        if(!full_name){
            return handleResponse(res,400,"full_name is required");
        }
        const patient = await createPatientService(full_name,email,phone);
        handleResponse(res,201,"patient created successfully",patient);
    }
    catch(err){
        next(err)
    }
}

export const getAllPatients = async(req,res,next)=>{
    try{
        const patients = await getAllPatientsService();
        handleResponse(res,200,"patients retrieved successfully", patients);
    }
    catch(err){
        next(err);
    }   
}


export const getPatientById = async(req,res,next)=>{
    try{
        const {id} = req.params;
        const patient = await getPatientByIdService(id);
        if(!patient){
            return handleResponse(res,404, "patient not found");

        }
        handleResponse(res,200,"patient retrieved successfully", patient);

    }
    catch(err){
        next(err);
    }   
}

export const updatePatient = async(req,res,next)=>{
    try{
        const {id} = req.params;
        const {full_name,email,phone} = req.body;
        const updatedPatient = await updatePatientService(id,full_name,email,phone);
        if(!updatedPatient){
            return handleResponse(res,404,"patient not found");
        }
        handleResponse(res,200,"patient updated successfully", updatedPatient);
   }
    catch(err){
        next(err);
    }
    
}

export const deletePatient = async(req,res,next)=>{
    try{
        const {id} = req.params;
        const deletedPatient = await deletePatientService(id);
        if(!deletedPatient){
            return handleResponse(res,404,"patient not found");
        }
        handleResponse(res,200,"patient deleted successfully", deletedPatient);
    }
    catch(err){
        next(err);
    }       
}
