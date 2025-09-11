import React, { useRef, useEffect, useState } from 'react';
import { Moon, AlertTriangle, Database } from 'lucide-react';

const ProblemsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const problems = [
    {
      icon: Moon,
      title: '67% dos leads chegam fora do horário comercial e são ignorados',
      subtitle: '',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: AlertTriangle,
      title: 'Cada minuto sem resposta reduz sua conversão em 400%',
      subtitle: '',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Database,
      title: 'CRM fragmentado elimina 43% das suas oportunidades',
      subtitle: '',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-[#1A0633] to-[#2D0B55]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
            🛑 Não Deixe Mais Dinheiro na Mesa
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Enquanto você descansa, sua concorrência fecha negócios.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
          {problems.map((problem, index) => (
            <div
              key={index}
              className={`relative transition-all duration-700 transform ${
                isVisible 
                  ? 'translate-x-0 opacity-100' 
                  : index % 2 === 0 ? '-translate-x-20 opacity-0' : 'translate-x-20 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className={`flex flex-col sm:flex-row lg:flex-row items-center gap-6 sm:gap-8 ${
                index % 2 === 1 ? 'sm:flex-row-reverse lg:flex-row-reverse' : ''
              }`}>
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br ${problem.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl animate-pulse-slow`}>
                    <problem.icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                  </div>
                </div>
                
                <div className={`flex-1 text-center ${index % 2 === 1 ? 'sm:text-right lg:text-right' : 'sm:text-left lg:text-left'} px-2 sm:px-0`}>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                    {problem.title}
                  </h3>
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                    {problem.subtitle}
                  </p>
                </div>
              </div>
              
              {/* Connector line */}
              {index < problems.length - 1 && (
                <div className="flex justify-center mt-8 sm:mt-12">
                  <div className="w-1 h-12 sm:h-16 bg-gradient-to-b from-[#FF7A00] to-transparent rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12 sm:mt-16">
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto border border-red-500/30">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
            💸 Perda média anual: R$ 89.000
          </h3>
            <p className="text-gray-300 text-base sm:text-lg">
              É isso que uma empresa perde anualmente por não ter atendimento 24/7 automatizado.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;