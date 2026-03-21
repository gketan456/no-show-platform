import {
  createAppointmentService,
  getAllAppointmentsService,
  getAppointmentByIdService,
  updateAppointmentService,
  deleteAppointmentsService,
} from "../services/appointmentService.js";

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const createAppointment = async (req, res, next) => {
  try {
    const { patient_id, scheduled_day, appointment_day, status } = req.body;

    if (!patient_id || !scheduled_day || !appointment_day) {
      return handleResponse(
        res,
        400,
        "patient_id, scheduled_day and appointment_day are required"
      );
    }

    const appointment = await createAppointmentService(
      patient_id,
      scheduled_day,
      appointment_day,
      status
    );

    return handleResponse(res, 201, "appointment created successfully", appointment);
  } catch (err) {
    next(err);
  }
};

export const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await getAllAppointmentsService();
    return handleResponse(
      res,
      200,
      "appointments retrieved successfully",
      appointments
    );
  } catch (err) {
    next(err);
  }
};

export const getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await getAppointmentByIdService(id);

    if (!appointment) {
      return handleResponse(res, 404, "appointment not found");
    }

    return handleResponse(
      res,
      200,
      "appointment retrieved successfully",
      appointment
    );
  } catch (err) {
    next(err);
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { patient_id, scheduled_day, appointment_day, status } = req.body;

    const updatedAppointment = await updateAppointmentService(
      id,
      patient_id,
      scheduled_day,
      appointment_day,
      status
    );

    if (!updatedAppointment) {
      return handleResponse(res, 404, "appointment not found");
    }

    return handleResponse(
      res,
      200,
      "appointment updated successfully",
      updatedAppointment
    );
  } catch (err) {
    next(err);
  }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedAppointment = await deleteAppointmentsService(id);

    if (!deletedAppointment) {
      return handleResponse(res, 404, "appointment not found");
    }

    return handleResponse(
      res,
      200,
      "appointment deleted successfully",
      deletedAppointment
    );
  } catch (err) {
    next(err);
  }
};