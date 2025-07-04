import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Shield, Clock, Zap } from 'lucide-react';

const CTASection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    whatsApp: '',
    company: '',
    pain: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would integrate with your actual form handler
    console.log('Form submitted:', formData);
    
    setIsSubmitting(false);
    
    // Reset form and show success message
    setFormData({ name: '', whatsApp: '', company: '', pain: '' });
    alert('Sucesso! Entraremos em contato em até 2 horas.');
  };

  const painOptions = [
    "Perco leads fora do horário comercial",
    "Minha equipe está sobrecarregada",
    "Baixa conversão de leads em vendas",
    "Dificuldade em fazer follow-up",
    "CRM desorganizado e dados perdidos",
    "Concorrência está me ultrapassando",
    "Outro (explicarei na call)"
  ];

  return (
    <section id="cta-final" ref={sectionRef} className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-[#2D0B55] via-[#FF7A00]/10 to-[#2D0B55] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D0B55] to-[#1A0633]"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23FF7A00%22%20fill-opacity=%220.05%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
            Sua Análise Gratuita em
            <span className="block text-[#FF7A00]">2 Minutos</span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-6 sm:mb-8 px-4">
            Rápido, seguro, sem compromisso
          </p>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 px-4">
            <div className="flex items-center space-x-2 text-gray-300 text-sm sm:text-base">
              <Shield className="w-4 h-4 sm:w-5 md:w-6 sm:h-5 md:h-6 text-[#FF7A00] flex-shrink-0" />
              <span>Dados 100% Seguros</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300 text-sm sm:text-base">
              <Clock className="w-4 h-4 sm:w-5 md:w-6 sm:h-5 md:h-6 text-[#FF7A00] flex-shrink-0" />
              <span>Resposta em 2h</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300 text-sm sm:text-base">
              <Zap className="w-4 h-4 sm:w-5 md:w-6 sm:h-5 md:h-6 text-[#FF7A00] flex-shrink-0" />
              <span>Implementação Rápida</span>
            </div>
          </div>
        </div>

        <div className={`max-w-2xl mx-auto transition-all duration-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`} style={{ transitionDelay: '200ms' }}>
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border-2 border-[#FF7A00]/30 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2 sm:mb-3 text-base sm:text-lg">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-white text-base sm:text-lg focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 backdrop-blur-md placeholder-gray-400"
                    placeholder="Como podemos te chamar?"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2 sm:mb-3 text-base sm:text-lg">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="whatsApp"
                    value={formData.whatsApp}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-white text-base sm:text-lg focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 backdrop-blur-md placeholder-gray-400"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2 sm:mb-3 text-base sm:text-lg">
                  Sua Empresa *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-white text-base sm:text-lg focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 backdrop-blur-md placeholder-gray-400"
                  placeholder="Nome da sua empresa"
                />
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2 sm:mb-3 text-base sm:text-lg">
                  Sua Maior Dor Hoje *
                </label>
                <select
                  name="pain"
                  value={formData.pain}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-white text-base sm:text-lg focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 backdrop-blur-md"
                >
                  <option value="" className="bg-[#2D0B55] text-gray-300">Selecione sua principal dificuldade</option>
                  {painOptions.map((option, index) => (
                    <option key={index} value={option} className="bg-[#2D0B55] text-white">
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#FF7A00] to-[#FF9500] hover:from-[#FF9500] hover:to-[#FFB000] text-white px-6 sm:px-8 py-4 sm:py-6 rounded-xl font-bold text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white mr-3"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    Destravar Meu Crescimento
                    <ArrowRight className="ml-3 w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-gray-400 text-xs sm:text-sm mb-4">
                🔒 Seus dados estão protegidos pela LGPD. Não enviamos spam.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                  <div className="text-[#FF7A00] font-bold">STEP 1</div>
                  <div className="text-gray-300">Análise dos seus dados</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                  <div className="text-[#FF7A00] font-bold">STEP 2</div>
                  <div className="text-gray-300">Relatório personalizado</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                  <div className="text-[#FF7A00] font-bold">STEP 3</div>
                  <div className="text-gray-300">Implementação da IA</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 sm:mt-16">
          <div className="max-w-4xl mx-auto px-4">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6">
              ⚡ Últimas 24h: +47 empresas se cadastraram
            </h3>
            <p className="text-gray-300 text-base sm:text-lg">
              Não perca a oportunidade de estar entre as primeiras do seu setor a implementar IA de vendas 24/7.
              <br className="hidden sm:block" />
              <span className="text-[#FF7A00] font-semibold">Seus concorrentes não vão esperar.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;