import React, { useState, useEffect } from 'react';
import { Menu, X, Zap, LogIn } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[#2D0B55]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-white">meusuper.app</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          <button onClick={() => scrollToSection('como-funciona')} className="text-white hover:text-[#FF7A00] transition-colors text-sm xl:text-base">
            Como Funciona
          </button>
          <button onClick={() => scrollToSection('casos-sucesso')} className="text-white hover:text-[#FF7A00] transition-colors text-sm xl:text-base">
            Casos de Sucesso
          </button>
          <button onClick={() => scrollToSection('calculadora')} className="text-white hover:text-[#FF7A00] transition-colors text-sm xl:text-base">
            Calculadora
          </button>
          
          {/* Login Button */}
          <button 
            onClick={handleLogin}
            className="text-white/80 hover:text-white transition-colors text-sm xl:text-base flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10"
          >
            <LogIn className="w-4 h-4" />
            <span>Entrar</span>
          </button>
          
          <button 
            onClick={() => scrollToSection('cta-final')}
            className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-4 xl:px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 text-sm xl:text-base"
          >
            Análise Gratuita
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#2D0B55]/95 backdrop-blur-md lg:hidden border-t border-white/10">
          <nav className="flex flex-col p-4 space-y-4">
              <button onClick={() => scrollToSection('como-funciona')} className="text-white hover:text-[#FF7A00] text-left transition-colors py-2">
                Como Funciona
              </button>
              <button onClick={() => scrollToSection('casos-sucesso')} className="text-white hover:text-[#FF7A00] text-left transition-colors py-2">
                Casos de Sucesso
              </button>
              <button onClick={() => scrollToSection('calculadora')} className="text-white hover:text-[#FF7A00] text-left transition-colors py-2">
                Calculadora
              </button>
              <button 
                onClick={handleLogin}
                className="text-white hover:text-[#FF7A00] text-left transition-colors py-2 flex items-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Entrar</span>
              </button>
              <button 
                onClick={() => scrollToSection('cta-final')}
                className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 text-left mt-2"
              >
                Análise Gratuita
              </button>
            </nav>
          </div>
        )}
    </header>
  );
};

export default Header;