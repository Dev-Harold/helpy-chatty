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
            
            {/* Issue Summary */}
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <h1 className="font-semibold text-blue-800 mb-2 text-lg">Issue Summary</h1>
                <div className="text-xs text-blue-700 space-y-1">
                    <p><strong>Device:</strong> {state.issue.device}</p>
                    <p><strong>Version:</strong> {state.issue.version}</p>
                    <p><strong>Description:</strong> {state.issue.description}</p>
                </div>
            </div>

            {/* Step Progress Indicator */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">
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
            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 mb-4">
                {/* Step Content */}
                <div className="flex-1">
                    <p className="text-sm leading-relaxed text-gray-700">
                        {cleanStepText(currentStep)}
                    </p>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4">
                <button
                    onClick={goToPreviousStep}
                    disabled={isFirstStep}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isFirstStep
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}