interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepName = (currentStep: number) => {
  switch (currentStep) {
    case 0:
      return "Select Bus";
    case 1:
      return "Bus Data";
    case 2:
      return "Line Data";
    case 3:
      return "LSTM";
    case 4:
      return "RF";
    case 5:
      return "Suspected Nodes";
    case 6:
      return "PMU Location";
    case 7:
      return "Available PMU Voltage";
    case 8:
      return "Result";
    default:
      return "Unknown Step";
  }
};

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center space-x-2 mb-8">
      {Array(totalSteps)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`
            w-fit h-fit rounded-xl p-2 flex flex-wrap items-center justify-center transition-all duration-300 font-bold
            ${
              index < currentStep
                ? "bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/20"
                : index === currentStep
                ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20 animate-pulse-slow"
                : "bg-gray-800/50 text-gray-400 border border-gray-700"
            }
          `}
            >
              <span>{StepName(index)}</span>
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`
              w-16 h-1 mx-2 rounded-full transition-all duration-300
              ${
                index < currentStep
                  ? "bg-gradient-to-r from-green-500 to-green-600"
                  : "bg-gray-800/50"
              }
            `}
              />
            )}
          </div>
        ))}
    </div>
  );
}
