import React from 'react';
import { Zap, Phone, Mail, MapPin, Linkedin, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-[#1A0633] to-[#0D0320] py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
          
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6 justify-center md:justify-start">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white">meusuper.app</span>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4 sm:mb-6 max-w-md text-center md:text-left mx-auto md:mx-0 text-sm sm:text-base">
              Quem Já Confia no Nosso Ecossistema: +100 empresas satisfeitas com resultados reais.
            </p>
            
            {/* Founder */}
            <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md border border-white/10 mx-auto md:mx-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <img
                  src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop"
                  alt="Samuel Vicente Ferreira"
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-[#FF7A00]"
                />
                <div>
                  <h4 className="text-white font-bold text-sm sm:text-base">Samuel Vicente Ferreira</h4>
                  <p className="text-[#FF7A00] text-xs sm:text-sm font-semibold">CEO & Founder</p>
                  <p className="text-gray-400 text-xs">Especialista em Automação e IA para Vendas</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Links */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-base sm:text-lg mb-4 sm:mb-6">Navegação</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <button 
                  onClick={() => scrollToSection('como-funciona')}
                  className="text-gray-300 hover:text-[#FF7A00] transition-colors duration-300 text-sm sm:text-base"
                >
                  Como Funciona
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('casos-sucesso')}
                  className="text-gray-300 hover:text-[#FF7A00] transition-colors duration-300 text-sm sm:text-base"
                >
                  Casos de Sucesso
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('calculadora')}
                  className="text-gray-300 hover:text-[#FF7A00] transition-colors duration-300 text-sm sm:text-base"
                >
                  Calculadora de Perdas
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('cta-final')}
                  className="text-gray-300 hover:text-[#FF7A00] transition-colors duration-300 text-sm sm:text-base"
                >
                  Análise Gratuita
                </button>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-base sm:text-lg mb-4 sm:mb-6">Contato</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-center space-x-3 justify-center md:justify-start">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF7A00] flex-shrink-0" />
                <span className="text-gray-300 text-sm sm:text-base">(31) 998710945</span>
              </li>
              <li className="flex items-center space-x-3 justify-center md:justify-start">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF7A00] flex-shrink-0" />
                <span className="text-gray-300 text-sm sm:text-base">contato@meusuper.app</span>
              </li>
              <li className="flex items-center space-x-3 justify-center md:justify-start">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF7A00] flex-shrink-0" />
                <span className="text-gray-300 text-sm sm:text-base">São Paulo, SP</span>
              </li>
            </ul>
            
            {/* Social Media */}
            <div className="mt-4 sm:mt-6">
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Siga-nos</h4>
              <div className="flex space-x-3 justify-center md:justify-start">
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-[#FF7A00] rounded-lg flex items-center justify-center transition-colors duration-300 group">
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-white" />
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-[#FF7A00] rounded-lg flex items-center justify-center transition-colors duration-300 group">
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-white" />
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-[#FF7A00] rounded-lg flex items-center justify-center transition-colors duration-300 group">
                  <Youtube className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Trust Seals */}
        <div className="border-t border-white/10 pt-6 sm:pt-8">
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
            <div className="bg-white/5 rounded-lg px-4 sm:px-6 py-2 sm:py-3 border border-white/10">
              <span className="text-gray-300 text-xs sm:text-sm">🔒 LGPD Compliant</span>
            </div>
            <div className="bg-white/5 rounded-lg px-4 sm:px-6 py-2 sm:py-3 border border-white/10">
              <span className="text-gray-300 text-xs sm:text-sm">🛡️ ISO 27001</span>
            </div>
            <div className="bg-white/5 rounded-lg px-4 sm:px-6 py-2 sm:py-3 border border-white/10">
              <span className="text-gray-300 text-xs sm:text-sm">⭐ 97% Satisfação</span>
            </div>
            <div className="bg-white/5 rounded-lg px-4 sm:px-6 py-2 sm:py-3 border border-white/10">
              <span className="text-gray-300 text-xs sm:text-sm">🚀 100 Clientes Ativos</span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-4">
              © 2024 meusuper.app - Todos os direitos reservados. 
              <span className="mx-2">|</span>
              <a href="#" className="hover:text-[#FF7A00] transition-colors duration-300">Política de Privacidade</a>
              <span className="mx-2">|</span>
              <a href="#" className="hover:text-[#FF7A00] transition-colors duration-300">Termos de Uso</a>
            </p>
            <p className="text-gray-500 text-xs">
              CNPJ: 61.455.363/0001-06 • Desenvolvido com ❤️ por Samuel Vicente Ferreira para revolucionar suas vendas 24/7
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;