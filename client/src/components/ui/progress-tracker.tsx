import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Users, Building2, Shield, FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  active: boolean;
}

interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
  userRole: 'exporter' | 'buyer' | 'logistics_provider' | 'financier' | 'agent';
  onStepComplete?: (step: number) => void;
  className?: string;
}

// Confetti component
const Confetti = ({ show }: { show: boolean }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; rotation: number }>>([]);

  useEffect(() => {
    if (show) {
      const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => setParticles([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded"
          style={{ 
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ 
            scale: 0, 
            rotate: particle.rotation,
            y: 0,
          }}
          animate={{ 
            scale: [0, 1, 0.8, 0],
            rotate: particle.rotation + 180,
            y: [0, -100, -200],
            x: [0, Math.random() * 100 - 50],
          }}
          transition={{ 
            duration: 3,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

export function ProgressTracker({ 
  currentStep, 
  totalSteps, 
  userRole, 
  onStepComplete,
  className 
}: ProgressTrackerProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const getSteps = (): Step[] => {
    const baseSteps = [
      {
        id: "role",
        title: "Choose Role",
        description: "Select account type",
        icon: <Users className="h-5 w-5" />,
        completed: currentStep > 1,
        active: currentStep === 1,
      },
      {
        id: "info",
        title: "Personal Info",
        description: "Basic information",
        icon: <FileText className="h-5 w-5" />,
        completed: currentStep > 2,
        active: currentStep === 2,
      },
    ];

    // All roles require verification, but type varies by role
    baseSteps.push({
      id: "verification",
      title: "Verification",
      description: userRole === 'buyer' ? "Identity verification" : "Business verification",
      icon: <Shield className="h-5 w-5" />,
      completed: currentStep > 3,
      active: currentStep === 3,
    });

    return baseSteps;
  };

  const steps = getSteps();
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  useEffect(() => {
    if (currentStep > 1 && !completedSteps.has(currentStep - 1)) {
      setCompletedSteps(prev => new Set([...Array.from(prev), currentStep - 1]));
      setShowConfetti(true);
      onStepComplete?.(currentStep - 1);
      
      setTimeout(() => setShowConfetti(false), 100);
    }
  }, [currentStep, completedSteps, onStepComplete]);

  return (
    <>
      <Confetti show={showConfetti} />
      <div className={cn("w-full max-w-4xl mx-auto p-6", className)}>
        {/* Main Progress Bar */}
        <div className="relative mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Account Setup Progress</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span>{currentStep} of {totalSteps} steps</span>
            </div>
          </div>
          
          <div className="relative">
            {/* Background progress bar */}
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>

            {/* Step indicators */}
            <div className="absolute top-0 left-0 w-full h-3 flex justify-between items-center">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className="relative z-10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                      step.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : step.active
                        ? "bg-blue-500 border-blue-500 text-white animate-pulse"
                        : "bg-white border-gray-300 text-gray-400"
                    )}
                  >
                    {step.completed ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Check className="h-3 w-3" />
                      </motion.div>
                    ) : (
                      <span className="text-xs font-semibold">{index + 1}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative p-4 rounded-lg border-2 transition-all duration-300",
                step.completed
                  ? "bg-green-50 border-green-200 shadow-lg"
                  : step.active
                  ? "bg-blue-50 border-blue-200 shadow-lg ring-2 ring-blue-200"
                  : "bg-gray-50 border-gray-200"
              )}
            >
              {/* Active step pulse effect */}
              {step.active && (
                <motion.div
                  className="absolute inset-0 rounded-lg bg-blue-100"
                  animate={{ opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={cn(
                      "p-2 rounded-lg transition-colors duration-300",
                      step.completed
                        ? "bg-green-100 text-green-600"
                        : step.active
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-400"
                    )}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <h3
                      className={cn(
                        "font-semibold transition-colors duration-300",
                        step.completed
                          ? "text-green-800"
                          : step.active
                          ? "text-blue-800"
                          : "text-gray-500"
                      )}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={cn(
                        "text-sm transition-colors duration-300",
                        step.completed
                          ? "text-green-600"
                          : step.active
                          ? "text-blue-600"
                          : "text-gray-400"
                      )}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Completion checkmark animation */}
                <AnimatePresence>
                  {step.completed && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="h-3 w-3 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Active step indicator */}
                {step.active && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-b-lg"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Overall Progress Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Setup Progress</h4>
                <p className="text-sm text-gray-600">
                  {currentStep === totalSteps 
                    ? "🎉 Registration complete! Welcome to DTFS!" 
                    : `${Math.round(progressPercentage)}% complete`
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-xs text-gray-500">Progress</div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}