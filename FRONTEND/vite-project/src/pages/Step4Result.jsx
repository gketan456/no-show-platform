import React from 'react';

const Step4Result = ({ prediction, onReset }) => {
    return (
        <div>
            <h2>Appointment Booked!</h2>
            <p>Your appointment has been confirmed.</p>
            <p>We will be in touch with you shortly.</p>
            <button onClick={onReset}>Book Another</button>
        </div>
    );
};

export default Step4Result;