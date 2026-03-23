import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = ({ onLogout }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get("/admin/appointments");
            setAppointments(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleSendReminder = async (appointment) => {
        try {
            await api.post("/admin/send-reminder", {
                patientEmail: appointment.email,
                patientName: appointment.full_name,
                appointmentDay: appointment.appointment_day,
                no_show_probability: appointment.no_show_probability
            });
            setMessage(`Reminder sent to ${appointment.full_name}`);
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error(error);
            setMessage("Failed to send reminder");
        }
    };

    const getRiskLevel = (probability) => {
        if (!probability) return { label: "No prediction", color: "#888" };
        if (probability >= 0.7) return { label: "High", color: "#A32D2D" };
        if (probability >= 0.5) return { label: "Medium", color: "#854F0B" };
        return { label: "Low", color: "#3B6D11" };
    };

    const getRiskBackground = (probability) => {
        if (!probability) return "#F1EFE8";
        if (probability >= 0.7) return "#FCEBEB";
        if (probability >= 0.5) return "#FAEEDA";
        return "#EAF3DE";
    };

    const totalHigh = appointments.filter(a => a.no_show_probability >= 0.7).length;
    const totalMedium = appointments.filter(a => a.no_show_probability >= 0.5 && a.no_show_probability < 0.7).length;
    const totalLow = appointments.filter(a => a.no_show_probability < 0.5 && a.no_show_probability !== null).length;

    if (loading) return <p>Loading...</p>;

    return (
        <div style={{ padding: "20px" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2>Admin Dashboard</h2>
                <button onClick={onLogout}>Logout</button>
            </div>

            {message && <p style={{ color: "green" }}>{message}</p>}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
                <div style={{ background: "#f5f5f5", padding: "14px", borderRadius: "8px" }}>
                    <div style={{ fontSize: "12px", color: "#888" }}>Total appointments</div>
                    <div style={{ fontSize: "24px", fontWeight: "500" }}>{appointments.length}</div>
                </div>
                <div style={{ background: "#FCEBEB", padding: "14px", borderRadius: "8px" }}>
                    <div style={{ fontSize: "12px", color: "#A32D2D" }}>High risk</div>
                    <div style={{ fontSize: "24px", fontWeight: "500", color: "#A32D2D" }}>{totalHigh}</div>
                </div>
                <div style={{ background: "#FAEEDA", padding: "14px", borderRadius: "8px" }}>
                    <div style={{ fontSize: "12px", color: "#854F0B" }}>Medium risk</div>
                    <div style={{ fontSize: "24px", fontWeight: "500", color: "#854F0B" }}>{totalMedium}</div>
                </div>
                <div style={{ background: "#EAF3DE", padding: "14px", borderRadius: "8px" }}>
                    <div style={{ fontSize: "12px", color: "#3B6D11" }}>Low risk</div>
                    <div style={{ fontSize: "24px", fontWeight: "500", color: "#3B6D11" }}>{totalLow}</div>
                </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ background: "#f5f5f5" }}>
                        <th style={{ padding: "10px", textAlign: "left", fontSize: "13px" }}>Patient</th>
                        <th style={{ padding: "10px", textAlign: "left", fontSize: "13px" }}>Appointment date</th>
                        <th style={{ padding: "10px", textAlign: "left", fontSize: "13px" }}>Risk score</th>
                        <th style={{ padding: "10px", textAlign: "left", fontSize: "13px" }}>Risk level</th>
                        <th style={{ padding: "10px", textAlign: "left", fontSize: "13px" }}>Action needed</th>
                        <th style={{ padding: "10px", textAlign: "left", fontSize: "13px" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => {
                        const risk = getRiskLevel(appointment.no_show_probability);
                        return (
                            <tr key={appointment.appointment_id} style={{ borderBottom: "0.5px solid #eee" }}>
                                <td style={{ padding: "10px" }}>
                                    <div style={{ fontWeight: "500" }}>{appointment.full_name}</div>
                                    <div style={{ fontSize: "12px", color: "#888" }}>{appointment.email}</div>
                                </td>
                                <td style={{ padding: "10px", fontSize: "13px", color: "#888" }}>
                                    {new Date(appointment.appointment_day).toLocaleDateString()}
                                </td>
                                <td style={{ padding: "10px", fontWeight: "500", color: risk.color }}>
                                    {appointment.no_show_probability
                                        ? `${(appointment.no_show_probability * 100).toFixed(0)}%`
                                        : "N/A"}
                                </td>
                                <td style={{ padding: "10px" }}>
                                    <span style={{
                                        background: getRiskBackground(appointment.no_show_probability),
                                        color: risk.color,
                                        padding: "2px 8px",
                                        borderRadius: "10px",
                                        fontSize: "12px",
                                        fontWeight: "500"
                                    }}>
                                        {risk.label}
                                    </span>
                                </td>
                                <td style={{ padding: "10px", fontSize: "12px", color: "#888" }}>
                                    {appointment.recommended_action || "N/A"}
                                </td>
                                <td style={{ padding: "10px" }}>
                                    <div style={{ display: "flex", gap: "6px" }}>
                                        <button
                                            onClick={() => handleSendReminder(appointment)}
                                            style={{ fontSize: "12px", padding: "4px 10px" }}>
                                            Send email
                                        </button>
                                        <button
                                            onClick={() => setSelectedAppointment(appointment)}
                                            style={{ fontSize: "12px", padding: "4px 10px" }}>
                                            Details
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {selectedAppointment && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.5)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                    <div style={{
                        background: "white", padding: "24px",
                        borderRadius: "12px", width: "480px", maxHeight: "80vh",
                        overflowY: "auto"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                            <h3>Patient details</h3>
                            <button onClick={() => setSelectedAppointment(null)}>Close</button>
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                            <h4>Patient</h4>
                            <p>Name: {selectedAppointment.full_name}</p>
                            <p>Email: {selectedAppointment.email}</p>
                            <p>Phone: {selectedAppointment.phone}</p>
                            <p>Age: {selectedAppointment.age}</p>
                            <p>Gender: {selectedAppointment.gender}</p>
                            <p>Neighbourhood: {selectedAppointment.neighbourhood}</p>
                            <p>Hypertension: {selectedAppointment.hypertension ? "Yes" : "No"}</p>
                            <p>Diabetes: {selectedAppointment.diabetes ? "Yes" : "No"}</p>
                            <p>Scholarship: {selectedAppointment.scholarship ? "Yes" : "No"}</p>
                            <p>Alcoholism: {selectedAppointment.alcoholism ? "Yes" : "No"}</p>
                            <p>Handicap: {selectedAppointment.handicap}</p>
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                            <h4>Appointment</h4>
                            <p>Date: {new Date(selectedAppointment.appointment_day).toLocaleDateString()}</p>
                            <p>Status: {selectedAppointment.status}</p>
                        </div>

                        <div>
                            <h4>Prediction</h4>
                            <p>Probability: {selectedAppointment.no_show_probability
                                ? `${(selectedAppointment.no_show_probability * 100).toFixed(0)}%`
                                : "N/A"}</p>
                            <p>Risk: {selectedAppointment.risk_flag ? "HIGH" : "LOW"}</p>
                            <p>Action: {selectedAppointment.recommended_action || "N/A"}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;