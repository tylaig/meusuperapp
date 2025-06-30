import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DemoAlertProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  actionText?: string;
}

const DemoAlert: React.FC<DemoAlertProps> = ({ isOpen, onClose, title, message, actionText = "Entendi" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-gray-300 mb-6 leading-relaxed">{message}</p>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 py-3 rounded-lg transition-colors duration-300"
          >
            {actionText}
          </button>
          <button
            onClick={() => window.open('https://meusuper.app/contato', '_blank')}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors duration-300"
          >
            Saber Mais
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoAlert;