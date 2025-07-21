'use client'
import { State } from "@/app/actions/AI";
import { useState } from "react";

interface StepsProps {
    state: State;
}

export default function Steps({ state }: StepsProps) {
    const { stepGuide } = state;
    const { steps } = stepGuide;
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    // Don't render if we're not in step-by-step mode or if there are no steps
    if (state.stage !== "step-by-step" || steps.length === 0) {
        return null;
    }

    const currentStep = steps[currentStepIndex];
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === steps.length - 1;

    // Function to remove numbers and common prefixes from step text
    const cleanStepText = (text: string) => {
        // Remove common patterns like "1.", "Step 1:", "1)", etc.
        return text.replace(/^(?:Step\s*)?\d+[\.\):]\s*/, '').trim();
    };

    const goToPreviousStep = () => {
        if (!isFirstStep) {
            setCurrentStepIndex(currentStepIndex - 1);
        }
    };

    const goToNextStep = () => {
        if (!isLastStep) {
            setCurrentStepIndex(currentStepIndex + 1);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 h-full overflow-y-auto">

            {/* Step Progress Indicator */}
            <div className="flex flex-col items-center mb-4">
                <span className="text-xl font-semibold text-gray-600 text-center mb-2">
                    Step {currentStepIndex + 1} of {steps.length}
                </span>
                <div className="flex space-x-1">
                    {steps.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                                index === currentStepIndex 
                                    ? 'bg-blue-500' 
                                    : index < currentStepIndex 
                                        ? 'bg-green-500' 
                                        : 'bg-gray-300'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Current Step */}
            <div className="p-4 rounded-lg bg-gray-50 mb-4">
                {/* Step Content */}
                <div className="flex-1">
                    <p className="text-lg leading-relaxed text-gray-700 text-center">
                        {cleanStepText(currentStep)}
                    </p>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={goToPreviousStep}
                    disabled={isFirstStep}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isFirstStep
                            ? 'bg-blue-100 text-blue-400 cursor-not-allowed opacity-80'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    Previous
                </button>
                
                <button
                    onClick={goToNextStep}
                    disabled={isLastStep}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isLastStep
                            ? 'bg-blue-100 text-blue-400 cursor-not-allowed opacity-80'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}