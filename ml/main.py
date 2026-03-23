from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import json
import numpy as np
from dateutil import parser

app = FastAPI()

model = joblib.load("artifacts/no_show_logreg.joblib")
feature_cols = json.load(open("artifacts/feature_cols.json"))
neigh_map = json.load(open("artifacts/neighbourhood_freq_map.json"))

class PredictRequest(BaseModel):
    Gender: str
    Age: int
    Neighbourhood: str
    ScheduledDay: str
    AppointmentDay: str
    Scholarship: int
    Hipertension: int
    Diabetes: int
    Alcoholism: int
    Handcap: int

def build_features(data: PredictRequest):
    Gender = 0 if data.Gender == "F" else 1
    scheduled = parser.isoparse(data.ScheduledDay)
    appointment = parser.isoparse(data.AppointmentDay)
    lead_time_days = (appointment.date() - scheduled.date()).days
    day_of_week = appointment.date().weekday()
    weekend = 1 if day_of_week >=5 else 0 

    age = data.Age
    age_group_YoungAdult = 1 if 13<= age <=25 else 0
    age_group_Adult = 1 if 26<= age <=45 else 0
    age_group_MiddleAged = 1 if 46<= age <=65 else 0
    age_group_Senior = 1 if age > 65 else 0

    handcap_bin = 1 if data.Handcap > 0 else 0
    neighbourhood_freq = float(neigh_map.get(data.Neighbourhood.strip(), 0.0))

    features = {
        "Gender" : Gender,
        "Scholarship" : data.Scholarship,
        "Hipertension" : data.Hipertension,
        "Diabetes" : data.Diabetes,
        "Alcoholism" : data.Alcoholism,
        "Handcap" : handcap_bin,
        "SMS_received" : 0,
        "lead_time_days" : lead_time_days,
        "appointment_dayofweek" :day_of_week,
        "appointment_weekend" : weekend,
        "neighbourhood_freq" : neighbourhood_freq,
        "age_group_YoungAdult" : age_group_YoungAdult,
        "age_group_Adult" : age_group_Adult,
        "age_group_MiddleAged" : age_group_MiddleAged,
        "age_group_Senior" : age_group_Senior,
        }
    
    row = [features[col] for col in feature_cols]
    return np.array([row],dtype = float)

@app.post("/predict")
def predict(data: PredictRequest):
    X = build_features(data)
    probability = float(model.predict_proba(X)[:, 1][0])
    
    risk_flag = probability >= 0.7
    
    if probability >= 0.7:
        action = "CALL_CENTER_OUTREACH"
    elif probability >= 0.5:
        action = "EXTRA_SMS_REMINDER"
    else:
        action = "STANDARD_REMINDER"
    
    return {
        "no_show_probability": probability,
        "risk_flag": risk_flag,
        "recommended_action": action,
        "model_version": "v1.0.0"
    }
