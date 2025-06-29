import React, { useState, useEffect, useRef } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
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

  const testimonials = [
    {
      name: "Maria Silva",
      company: "E-commerce Fashion",
      role: "CEO",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "Em 2 meses recuperamos R$ 35.000 em vendas perdidas. A IA trabalha 24h enquanto dormimos. Melhor investimento que já fizemos!",
      result: "R$ 35k recuperados",
      metric: "+127% em vendas",
      rating: 5
    },
    {
      name: "João Santos",
      company: "Mentoria Digital",
      role: "Mentor",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "Minha agenda de calls aumentou 250% com leads super qualificados. A IA fala exatamente como eu falaria com os clientes.",
      result: "+250% calls agendadas",
      metric: "R$ 89k em 60 dias",
      rating: 5
    },
    {
      name: "Ana Costa",
      company: "SaaS B2B",
      role: "Head de Vendas",
      avatar: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "Reduzimos o churn em 73% e aumentamos o upsell automático. Nossa equipe agora foca em estratégia, não em atendimento básico.",
      result: "-73% churn",
      metric: "+156% upsell",
      rating: 5
    },
    {
      name: "Pedro Oliveira",
      company: "Infoprodutos",
      role: "Empreendedor",
      avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "Meus cursos vendem sozinhos! A IA educa o lead, responde objeções e fecha vendas. ROI de 890% no primeiro semestre.",
      result: "ROI 890%",
      metric: "R$ 127k em 6 meses",
      rating: 5
    },
    {
      name: "Carla Mendes",
      company: "Produtos Físicos",
      role: "Fundadora",
      avatar: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "O catálogo inteligente revolucionou nossas vendas. Clientes encontram exatamente o que procuram, 24/7. Vendas cresceram 180%.",
      result: "+180% vendas",
      metric: "Atendimento 24/7",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentData = testimonials[currentTestimonial];

  return (
    <section id="casos-sucesso" ref={sectionRef} className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-[#2D0B55] to-[#1A0633]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-2">
            Quem Já Está <span className="text-[#FF7A00]">Faturando</span> 24/7
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            +1.000 empresas já transformaram suas vendas. Veja os resultados reais dos nossos clientes.
          </p>
        </div>

        <div className={`max-w-6xl mx-auto transition-all duration-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="relative">
            {/* Main testimonial card */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-white/20 shadow-2xl">
              <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-center">
                
                {/* Avatar and info */}
                <div className="text-center lg:text-left">
                  <div className="relative inline-block mb-4 sm:mb-6">
                    <img
                      src={currentData.avatar}
                      alt={currentData.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-[#FF7A00] shadow-2xl mx-auto lg:mx-0"
                    />
                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 bg-[#FF7A00] rounded-full flex items-center justify-center">
                      <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{currentData.name}</h3>
                  <p className="text-[#FF7A00] font-semibold mb-1 text-sm sm:text-base">{currentData.role}</p>
                  <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">{currentData.company}</p>
                  
                  <div className="flex justify-center lg:justify-start space-x-1 mb-4">
                    {[...Array(currentData.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF7A00] fill-current" />
                    ))}
                  </div>
                </div>

                {/* Testimonial content */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 w-8 h-8 sm:w-12 sm:h-12 text-[#FF7A00]/20" />
                    <blockquote className="text-lg sm:text-xl md:text-2xl text-white leading-relaxed mb-6 sm:mb-8 relative z-10 px-2">
                      "{currentData.content}"
                    </blockquote>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-gradient-to-r from-[#FF7A00]/20 to-[#FF9500]/20 rounded-xl p-3 sm:p-4 border border-[#FF7A00]/30">
                      <div className="text-[#FF7A00] text-xs sm:text-sm font-semibold mb-1">RESULTADO PRINCIPAL</div>
                      <div className="text-white text-lg sm:text-xl font-bold">{currentData.result}</div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl p-3 sm:p-4 border border-green-500/30">
                      <div className="text-green-300 text-xs sm:text-sm font-semibold mb-1">MÉTRICA ADICIONAL</div>
                      <div className="text-white text-lg sm:text-xl font-bold">{currentData.metric}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center mt-6 sm:mt-8 space-x-4">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-[#FF7A00] rounded-full flex items-center justify-center transition-all duration-300 border border-white/20 hover:border-[#FF7A00] group"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-white" />
              </button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial ? 'bg-[#FF7A00] w-6 sm:w-8' : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextTestimonial}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-[#FF7A00] rounded-full flex items-center justify-center transition-all duration-300 border border-white/20 hover:border-[#FF7A00] group"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto border border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#FF7A00] mb-2">1000+</div>
                <div className="text-gray-300 text-sm sm:text-base">Empresas Atendidas</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#FF7A00] mb-2">97%</div>
                <div className="text-gray-300 text-sm sm:text-base">Taxa de Satisfação</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#FF7A00] mb-2">R$ 12M</div>
                <div className="text-gray-300 text-sm sm:text-base">Vendas Recuperadas</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#FF7A00] mb-2">24/7</div>
                <div className="text-gray-300 text-sm sm:text-base">Suporte Ativo</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;