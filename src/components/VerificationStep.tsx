import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeftIcon, CheckCircleIcon } from "lucide-react";

interface VerificationStepProps {
  email: string;
  onBack: () => void;
}

export function VerificationStep({ email, onBack }: VerificationStepProps) {
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  
  // Handle input change for verification code
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }
    
    if (value && !isNaN(Number(value))) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    } else if (value === "") {
      const newCode = [...verificationCode];
      newCode[index] = "";
      setVerificationCode(newCode);
    }
  };
  
  // Handle key down for backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };
  
  // Handle verification submission
  const handleVerify = () => {
    const code = verificationCode.join("");
    if (code.length === 6) {
      setIsVerifying(true);
      
      // Simulate verification
      setTimeout(() => {
        setIsVerifying(false);
        setIsVerified(true);
      }, 1500);
    }
  };
  
  // Countdown timer for resend code
  useEffect(() => {
    if (timeLeft > 0 && !isVerified) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isVerified]);
  
  // Handle resend code
  const handleResendCode = () => {
    setTimeLeft(60);
    // Simulate resending code
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            {isVerified ? "Verification Complete" : "Verify Your Email"}
          </CardTitle>
          <CardDescription className="text-center text-zinc-500">
            {isVerified 
              ? "Your account has been successfully verified" 
              : `We've sent a verification code to ${email}`}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isVerified ? (
            <div className="flex flex-col items-center justify-center py-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <CheckCircleIcon className="h-20 w-20 text-green-500 mb-4" />
              </motion.div>
              <p className="text-center text-zinc-700">
                Thank you for verifying your account. You can now access all features.
              </p>
              <Button 
                className="mt-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
              >
                Continue to Dashboard
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-center space-x-2 my-6">
                {verificationCode.map((digit, index) => (
                  <Input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="w-12 h-12 text-center text-lg font-semibold"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              
              <Button 
                onClick={handleVerify}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                disabled={verificationCode.join("").length !== 6 || isVerifying}
              >
                {isVerifying ? "Verifying..." : "Verify Code"}
              </Button>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-zinc-500">
                  Didn't receive a code?{" "}
                  {timeLeft > 0 ? (
                    <span>Resend in {timeLeft}s</span>
                  ) : (
                    <button
                      onClick={handleResendCode}
                      className="text-blue-600 hover:underline"
                    >
                      Resend Code
                    </button>
                  )}
                </p>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          {!isVerified && (
            <Button 
              variant="ghost" 
              className="text-zinc-500 hover:text-zinc-700 flex items-center gap-1"
              onClick={onBack}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Registration
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}