import React, { useRef, useEffect, useState } from 'react';
import { Search, Settings, Zap, TrendingUp } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
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

  const steps = [
    {
      icon: Search,
      number: '01',
      title: 'Diagnóstico Completo e Gratuito',
      description: 'Identificamos seus gargalos e oportunidades.',
      duration: 'até 48h'
    },
    {
      icon: Settings,
      number: "02",
      title: "Estratégia Personalizada",
      description: "Desenhamos um plano personalizado para sua empresa.",
      duration: "3-5 dias"
    },
    {
      icon: Zap,
      number: "03",
      title: "Integração Completa e Inteligente",
      description: "Conectamos todos os seus canais e sistemas.",
      duration: "5-8 dias"
    },
    {
      icon: TrendingUp,
      number: "04",
      title: "Otimização Contínua",
      description: "Relatórios semanais e suporte ilimitado segunda a segunda.",
      duration: "Sempre ativo"
    }
  ];

  const scrollToCases = () => {
    document.getElementById('casos-sucesso')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="como-funciona" ref={sectionRef} className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-[#2D0B55] via-[#3D1565] to-[#2D0B55]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-2">
            ✨ Transforme Seu Negócio em 4 Passos Simples
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            01 | Diagnóstico, 02 | Estratégia, 03 | Integração, 04 | Otimização
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Mobile-first vertical layout */}
          <div className="space-y-6 sm:space-y-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative transition-all duration-700 transform ${
                  isVisible 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-[#FF7A00]/50 transition-all duration-300 transform hover:scale-105 shadow-2xl group">
                  
                  {/* Mobile layout: vertical stack */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                    
                    {/* Step number and icon */}
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-3 sm:mb-4">
                        <step.icon className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-full flex items-center justify-center border-2 border-[#2D0B55] shadow-lg">
                        <span className="text-white font-bold text-sm sm:text-base">{step.number}</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 text-center sm:text-left">
                      <div className="text-[#FF7A00] font-bold text-sm sm:text-base mb-2 sm:mb-3">{step.duration}</div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">{step.title}</h3>
                      <p className="text-gray-300 leading-relaxed text-base sm:text-lg">{step.description}</p>
                    </div>
                  </div>
                  
                  {/* Connector line for mobile - positioned after each step except the last */}
                  {index < steps.length - 1 && (
                    <div className="flex justify-center mt-6 sm:mt-8 sm:hidden">
                      <div className="w-1 h-8 bg-gradient-to-b from-[#FF7A00] to-[#FF7A00]/30 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop timeline line - hidden on mobile */}
          <div className="hidden sm:block absolute left-1/2 transform -translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#FF7A00] via-[#FF9500] to-[#FF7A00] opacity-30"></div>
        </div>

        <div className="text-center mt-12 sm:mt-16">
          <button 
            onClick={scrollToCases}
            className="bg-gradient-to-r from-[#FF7A00] to-[#FF9500] hover:from-[#FF9500] hover:to-[#FFB000] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Ver Casos de Sucesso
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;