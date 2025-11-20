import React from 'react';
import { AnalysisStatus } from '../types';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

interface StatusIndicatorProps {
  status: AnalysisStatus;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const steps = [
    { id: AnalysisStatus.GENERATING_PART_1, label: "Step 1-3: Roots & Logic" },
    { id: AnalysisStatus.GENERATING_PART_2, label: "Step 4-6: Models & Abstraction" },
    { id: AnalysisStatus.GENERATING_PART_3, label: "Step 7-9: History & Pedagogy" },
  ];

  const isProcessing = status !== AnalysisStatus.IDLE && status !== AnalysisStatus.COMPLETED && status !== AnalysisStatus.ERROR;
  
  const getStepState = (stepId: AnalysisStatus) => {
      if (status === AnalysisStatus.COMPLETED) return 'completed';
      if (status === AnalysisStatus.ERROR) return 'pending'; 
      
      const order = [
          AnalysisStatus.GENERATING_PART_1,
          AnalysisStatus.GENERATING_PART_2,
          AnalysisStatus.GENERATING_PART_3
      ];
      
      const currentIndex = order.indexOf(status as AnalysisStatus);
      const stepIndex = order.indexOf(stepId);
      
      if (stepIndex < currentIndex) return 'completed';
      if (stepIndex === currentIndex) return 'active';
      return 'pending';
  };

  return (
    <div className="flex flex-col gap-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Generation Progress</h3>
      {steps.map((step) => {
        const stepState = getStepState(step.id);
        return (
          <div key={step.id} className="flex items-center gap-3">
             {stepState === 'active' && <Loader2 className="w-5 h-5 text-accent animate-spin" />}
             {stepState === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
             {stepState === 'pending' && <Circle className="w-5 h-5 text-gray-300" />}
             
             <span className={`text-sm font-medium ${
                 stepState === 'active' ? 'text-accent' : 
                 stepState === 'completed' ? 'text-gray-700' : 'text-gray-400'
             }`}>
                 {step.label}
             </span>
          </div>
        );
      })}
    </div>
  );
};

export default StatusIndicator;