import React from 'react';
import { Eye, Info } from 'lucide-react';

const DemoModeIndicator: React.FC = () => {
  return (
    <div className="fixed top-4 right-4 z-40 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-lg px-4 py-2 border border-yellow-500/30">
      <div className="flex items-center space-x-2">
        <Eye className="w-4 h-4 text-yellow-400" />
        <span className="text-yellow-300 text-sm font-semibold">Modo Demonstração</span>
        <div className="group relative">
          <Info className="w-4 h-4 text-yellow-400 cursor-help" />
          <div className="absolute bottom-full right-0 mb-2 w-64 bg-black/90 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Você está no modo demonstração. Algumas funcionalidades avançadas estão limitadas.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoModeIndicator;