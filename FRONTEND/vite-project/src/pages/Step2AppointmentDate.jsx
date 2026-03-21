import React, { useState } from 'react';

const Step2AppointmentDate = ({ appointmentDay, setAppointmentDay, onBack, onNext }) => {

    const [message, setMessage] = useState("");

    const handleNext = () => {
        if (!appointmentDay) {
            setMessage("Please select an appointment date");
            return;
        }
        setMessage("");
        onNext();
    };

    return (
        <div>
            <h2>Step 2 — Pick Appointment Date</h2>
            <input
                type="datetime-local"
                value={appointmentDay}
                onChange={(e) => setAppointmentDay(e.target.value)}
            />
            {message && <p>{message}</p>}
            <button onClick={onBack}>Back</button>
            <button onClick={handleNext}>Book This Date</button>
        </div>
    );
};

export default Step2AppointmentDate;