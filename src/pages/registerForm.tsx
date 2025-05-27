import { useState } from "react";

import { VerificationStep } from "../components/VerificationStep.tsx";
import { motion } from "framer-motion";
import  WavesBackground from "./WavesBackground.tsx";
import RegistrationForm from './Register.tsx';



export default function RegisterForm() {
  const [currentStep, setCurrentStep] = useState<"registration" | "verification">("registration");
  const [email, setEmail] = useState("");

  const handleSubmitRegistration = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setCurrentStep("verification");
  };

  const handleBackToRegistration = () => {
    setCurrentStep("registration");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-white to-blue-50">
      <WavesBackground />
      
      <motion.div 
        className="w-full max-w-md z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {currentStep === "registration" ? (
          <RegistrationForm onSubmit={handleSubmitRegistration} />
        ) : (
          <VerificationStep email={email} onBack={handleBackToRegistration} />
        )}
      </motion.div>
    </div>
  );
}

