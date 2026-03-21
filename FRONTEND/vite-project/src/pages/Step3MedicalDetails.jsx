import React from 'react';

const Step3MedicalDetails = ({
    age, setAge,
    gender, setGender,
    neighbourhood, setNeighbourhood,
    hypertension, setHypertension,
    diabetes, setDiabetes,
    scholarship, setScholarship,
    alcoholism, setAlcoholism,
    handicap, setHandicap,
    onBack, onSubmit
}) => {

    return (
        <div>
            <h2>Step 3 — Medical Details</h2>

            <label>Age</label>
            <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
            />

            <label>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="M">Male</option>
                <option value="F">Female</option>
            </select>

            <label>Neighbourhood</label>
            <input
                type="text"
                value={neighbourhood}
                onChange={(e) => setNeighbourhood(e.target.value)}
            />

            <label>Hypertension</label>
            <select value={hypertension} onChange={(e) => setHypertension(e.target.value === "true")}>
                <option value="false">No</option>
                <option value="true">Yes</option>
            </select>

            <label>Diabetes</label>
            <select value={diabetes} onChange={(e) => setDiabetes(e.target.value === "true")}>
                <option value="false">No</option>
                <option value="true">Yes</option>
            </select>

            <label>Scholarship</label>
            <select value={scholarship} onChange={(e) => setScholarship(e.target.value === "true")}>
                <option value="false">No</option>
                <option value="true">Yes</option>
            </select>

            <label>Alcoholism</label>
            <select value={alcoholism} onChange={(e) => setAlcoholism(e.target.value === "true")}>
                <option value="false">No</option>
                <option value="true">Yes</option>
            </select>

            <label>Handicap (0 to 4)</label>
            <input
                type="number"
                min="0"
                max="4"
                value={handicap}
                onChange={(e) => setHandicap(e.target.value)}
            />

            <button onClick={onBack}>Back</button>
            <button onClick={onSubmit}>Confirm Appointment</button>
        </div>
    );
};

export default Step3MedicalDetails;
