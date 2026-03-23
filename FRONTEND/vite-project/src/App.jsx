import React, { useState } from 'react';
import Step1PatientDetails from './pages/Step1PatientDetails';
import Step2AppointmentDate from './pages/Step2AppointmentDate';
import Step3MedicalDetails from './pages/Step3MedicalDetails';
import Step4Result from './pages/Step4Result';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import api from './services/api';

function App() {

    const [currentUser, setCurrentUser] = useState(null);
    const [step, setStep] = useState(1);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [appointmentDay, setAppointmentDay] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("M");
    const [neighbourhood, setNeighbourhood] = useState("");
    const [hypertension, setHypertension] = useState(false);
    const [diabetes, setDiabetes] = useState(false);
    const [scholarship, setScholarship] = useState(false);
    const [alcoholism, setAlcoholism] = useState(false);
    const [handicap, setHandicap] = useState(0);
    const [prediction, setPrediction] = useState(null);

    const handleLogin = (user) => {
        setCurrentUser(user);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setCurrentUser(null);
        setStep(1);
    };

    const handleFinalSubmit = async () => {
        try {
            const patientResponse = await api.post("/patients", {
                full_name: fullName,
                email: email,
                phone: phone,
                age: Number(age),
                gender: gender,
                neighbourhood: neighbourhood,
                hypertension: hypertension,
                diabetes: diabetes,
                scholarship: scholarship,
                alcoholism: alcoholism,
                handicap: Number(handicap)
            });

            const patientId = patientResponse.data.data.id;

            const appointmentResponse = await api.post("/appointments", {
                patient_id: patientId,
                scheduled_day: new Date().toISOString(),
                appointment_day: appointmentDay
            });

            const appointmentId = appointmentResponse.data.data.id;

            const predictionResponse = await api.post("/predictions", {
                appointment_id: appointmentId,
                Gender: gender,
                Age: Number(age),
                Neighbourhood: neighbourhood,
                ScheduledDay: new Date().toISOString(),
                AppointmentDay: appointmentDay,
                Scholarship: scholarship ? 1 : 0,
                Hipertension: hypertension ? 1 : 0,
                Diabetes: diabetes ? 1 : 0,
                Alcoholism: alcoholism ? 1 : 0,
                Handcap: Number(handicap),
                patientName: fullName,
                patientPhone: phone,
                patientEmail: email
            });

            setPrediction(predictionResponse.data.data);
            setStep(4);

        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        }
    };

    // not logged in → show auth page
    if (!currentUser) {
        return (
            <div>
                <h1>No Show Prediction System</h1>
                <AuthPage onLogin={handleLogin} />
            </div>
        );
    }

    // admin logged in → show admin dashboard
    if (currentUser.role === "admin") {
        return (
            <AdminDashboard onLogout={handleLogout} />
        );
    }

    // patient logged in → show booking flow
    return (
        <div>
            <h1>No Show Prediction System</h1>
            <p>Welcome, {currentUser.name}</p>
            <button onClick={handleLogout}>Logout</button>

            {step === 1 && (
                <Step1PatientDetails
                    fullName={fullName} setFullName={setFullName}
                    email={email} setEmail={setEmail}
                    phone={phone} setPhone={setPhone}
                    onNext={() => setStep(2)}
                />
            )}

            {step === 2 && (
                <Step2AppointmentDate
                    appointmentDay={appointmentDay}
                    setAppointmentDay={setAppointmentDay}
                    onBack={() => setStep(1)}
                    onNext={() => setStep(3)}
                />
            )}

            {step === 3 && (
                <Step3MedicalDetails
                    age={age} setAge={setAge}
                    gender={gender} setGender={setGender}
                    neighbourhood={neighbourhood} setNeighbourhood={setNeighbourhood}
                    hypertension={hypertension} setHypertension={setHypertension}
                    diabetes={diabetes} setDiabetes={setDiabetes}
                    scholarship={scholarship} setScholarship={setScholarship}
                    alcoholism={alcoholism} setAlcoholism={setAlcoholism}
                    handicap={handicap} setHandicap={setHandicap}
                    onBack={() => setStep(2)}
                    onSubmit={handleFinalSubmit}
                />
            )}

            {step === 4 && (
                <Step4Result
                    prediction={prediction}
                    onReset={() => setStep(1)}
                />
            )}
        </div>
    );
}

export default App;