import { Profession, ProfessionTerms } from "@/types/svm";

export const professionTerms: Record<Profession, ProfessionTerms> = {
  medical: {
    positive: "Disease Detected",
    negative: "Healthy",
    truePositive: "Correctly Diagnosed Sick",
    trueNegative: "Correctly Diagnosed Healthy",
    falsePositive: "False Alarm (Healthy flagged as Sick)",
    falseNegative: "Missed Diagnosis (Sick flagged as Healthy)",
    accuracy: "Overall Diagnostic Accuracy",
    precision: "Positive Diagnosis Reliability",
    recall: "Disease Detection Rate",
  },
  finance: {
    positive: "High Risk",
    negative: "Low Risk",
    truePositive: "Correctly Flagged as High Risk",
    trueNegative: "Correctly Flagged as Low Risk",
    falsePositive: "Safe Client Flagged as Risky",
    falseNegative: "Risky Client Missed",
    accuracy: "Overall Risk Assessment Accuracy",
    precision: "High-Risk Prediction Reliability",
    recall: "Risk Detection Rate",
  },
  marketing: {
    positive: "Will Convert",
    negative: "Won't Convert",
    truePositive: "Correctly Predicted Conversion",
    trueNegative: "Correctly Predicted No Conversion",
    falsePositive: "Expected Conversion but Didn't",
    falseNegative: "Missed Potential Customer",
    accuracy: "Overall Campaign Accuracy",
    precision: "Conversion Prediction Reliability",
    recall: "Customer Capture Rate",
  },
  engineering: {
    positive: "Defective",
    negative: "Functional",
    truePositive: "Correctly Identified Defect",
    trueNegative: "Correctly Identified Functional",
    falsePositive: "False Defect Alert",
    falseNegative: "Missed Defect",
    accuracy: "Overall Quality Control Accuracy",
    precision: "Defect Detection Reliability",
    recall: "Defect Detection Rate",
  },
};

export const professionDescriptions: Record<Profession, string> = {
  medical: "Diagnose diseases and predict patient outcomes",
  finance: "Assess credit risk and detect fraudulent transactions",
  marketing: "Predict customer conversion and campaign success",
  engineering: "Detect defects and ensure quality control",
};

export const professionIcons: Record<Profession, string> = {
  medical: "🏥",
  finance: "💰",
  marketing: "📊",
  engineering: "⚙️",
};
