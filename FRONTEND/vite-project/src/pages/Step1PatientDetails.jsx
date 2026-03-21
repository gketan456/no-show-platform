import React, { useState } from 'react';

const Step1PatientDetails = ({ fullName, setFullName, email, setEmail, phone, setPhone, onNext }) => {

    const [message, setMessage] = useState("");

    const handleNext = () => {
        if (!fullName || !email || !phone) {
            setMessage("Please fill all fields");
            return;
        }
        setMessage("");
        onNext();
    };

    return (
        <div>
            <h2>Step 1 — Your Details</h2>
            <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            {message && <p>{message}</p>}
            <button onClick={handleNext}>Next</button>
        </div>
    );
};

export default Step1PatientDetails;