import React, { useRef, useEffect, useState } from 'react';
import { TrendingUp, Clock, Users, Zap } from 'lucide-react';

const StatsSection: React.FC = () => {
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

  const stats = [
    {
      icon: TrendingUp,
      value: '+R$ 80k',
      label: 'Recuperados/mês',
      description: 'Em vendas perdidas'
    },
    {
      icon: Clock,
      value: '12k',
      label: 'Horas economizadas/ano',
      description: 'Atendimento automatizado'
    },
    {
      icon: Users,
      value: '97%',
      label: 'Satisfação com IA',
      description: 'Clientes aprovam'
    },
    {
      icon: Zap,
      value: '< 2s',
      label: 'Tempo de resposta',
      description: 'Atendimento instantâneo'
    }
  ];

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-[#2D0B55] to-[#1A0633]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-2">
            Resultados que Falam por Si
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
            Mais de 1.000 empresas já transformaram suas vendas com nossa IA
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`relative group transition-all duration-700 transform ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-[#FF7A00]/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-2xl hover:shadow-[#FF7A00]/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto sm:mx-0">
                    <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-[#FF7A00] transition-colors duration-300 text-center sm:text-left">
                    {stat.value}
                  </div>
                  
                  <div className="text-base sm:text-lg font-semibold text-gray-200 mb-2 text-center sm:text-left">
                    {stat.label}
                  </div>
                  
                  <div className="text-sm text-gray-400 text-center sm:text-left">
                    {stat.description}
                  </div>
                </div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#FF7A00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;