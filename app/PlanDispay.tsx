'use client';

import { useRef } from 'react';

interface PlanDisplayProps {
  plan: string;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan }) => {
  const planRef = useRef<HTMLDivElement>(null);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(plan);
      speechSynthesis.speak(utterance);
    }
  };

  const handleDownloadPDF = () => {
    // Stub: Integrate html2canvas and jsPDF for PDF export
    console.log('Download PDF clicked');
  };

  const handleGenerateImage = () => {
    // Stub: Integrate AI image generation here
    console.log('Generate image clicked');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-2">Your Personalized Plan</h2>
      <div id="planContent" ref={planRef} className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
        <pre className="whitespace-pre-wrap">{plan}</pre>
      </div>
      <div className="mt-4 flex space-x-2">
        <button onClick={handleSpeak} className="btn-secondary">Read Aloud</button>
        <button onClick={handleDownloadPDF} className="btn-secondary">Download PDF</button>
        <button onClick={handleGenerateImage} className="btn-secondary">Generate Image</button>
      </div>
    </div>
  );
};

export default PlanDisplay;
