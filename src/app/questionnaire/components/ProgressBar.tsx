const stepLabels = [
  "Family Basics",
  "Family Members",
  "Home & Lifestyle",
  "Values & Priorities",
  "Review",
];

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
}: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-10">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-warm-700">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-sm text-warm-400">
          {stepLabels[currentStep]}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-warm-200">
        <div
          className="h-full rounded-full bg-terra transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
