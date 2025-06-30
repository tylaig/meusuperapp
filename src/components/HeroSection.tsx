import React, { useEffect, useRef } from 'react';
import { ArrowRight, Star } from 'lucide-react';

const HeroSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      opacity: number;
    }> = [];

    // Reduce particles on mobile
    const particleCount = window.innerWidth < 768 ? 20 : 50;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 122, 0, ${particle.opacity})`;
        ctx.fill();
        
        // Connect nearby particles (reduce connections on mobile)
        const maxDistance = window.innerWidth < 768 ? 80 : 100;
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `rgba(255, 122, 0, ${0.1 * (1 - distance / maxDistance)})`;
              ctx.stroke();
            }
          }
        });
      });
      
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const scrollToCalculator = () => {
    document.getElementById('calculadora')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCTA = () => {
    document.getElementById('cta-final')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#2D0B55] via-[#3D1565] to-[#2D0B55] overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ mixBlendMode: 'screen' }}
      />
      
      <div className="relative z-10 container mx-auto px-4 pt-20 sm:pt-24 pb-8 sm:pb-12 min-h-screen flex items-center">
        <div className="w-full">
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-12 items-center max-w-7xl mx-auto">
            {/* Left Column - Content (7 columns) */}
            <div className="lg:col-span-7 space-y-5 xl:space-y-6">
              <div className="flex items-center">
                <div className="flex items-center space-x-2 bg-[#FF7A00]/20 px-4 py-2 rounded-full">
                  <Star className="w-4 h-4 text-[#FF7A00] fill-current" />
                  <span className="text-[#FF7A00] text-sm font-semibold">Nota 4.9/5</span>
                </div>
              </div>
              
              <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white leading-tight">
                Suas Vendas
                <span className="text-[#FF7A00] block">Não Dormem</span>
              </h1>
              
              <p className="text-lg xl:text-xl text-gray-200 leading-relaxed pr-4">
                Agentes para WhatsApp, Instagram, Email e SMS — 
                <span className="text-[#FF7A00] font-semibold"> sem codar e com serviço totalmente personalizado para o seu negócio.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button 
                  onClick={scrollToCTA}
                  className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-6 xl:px-7 py-3 xl:py-4 rounded-full font-bold text-base xl:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group"
                >
                  <span>Quero Minha Análise Gratuita</span>
                  <ArrowRight className="ml-2 w-4 h-4 xl:w-5 xl:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={scrollToCalculator}
                  className="text-white hover:text-[#FF7A00] px-6 xl:px-7 py-3 xl:py-4 rounded-full font-semibold text-base xl:text-lg transition-all duration-300 border-2 border-white/20 hover:border-[#FF7A00] backdrop-blur-sm"
                >
                  Calcular Minhas Perdas
                </button>
              </div>
            </div>
            
            {/* Right Column - Dashboard (5 columns) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative animate-float">
                <div className="w-72 h-80 xl:w-80 xl:h-88 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl xl:rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden">
                  <div className="p-5 xl:p-6">
                    <div className="flex items-center space-x-2 mb-5">
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                      <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                    </div>
                    
                    <div className="space-y-4 xl:space-y-5">
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/70 text-xs xl:text-sm">Vendas Hoje</span>
                          <span className="text-[#FF7A00] text-xs xl:text-sm font-bold">+127%</span>
                        </div>
                        <div className="text-white text-xl xl:text-2xl font-bold">R$ 47.823</div>
                      </div>
                      
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/70 text-xs xl:text-sm">Leads Ativos</span>
                          <span className="text-green-400 text-xs xl:text-sm font-bold">↗ 89</span>
                        </div>
                        <div className="text-white text-xl xl:text-2xl font-bold">1.247</div>
                      </div>
                      
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/70 text-xs xl:text-sm">Conversões IA</span>
                          <span className="text-[#FF7A00] text-xs xl:text-sm font-bold">97%</span>
                        </div>
                        <div className="text-white text-lg xl:text-xl font-bold">24h Ativo</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-3 -right-3 w-12 h-12 xl:w-14 xl:h-14 bg-[#FF7A00] rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white font-bold text-sm xl:text-base">AI</span>
                </div>
                
                <div className="absolute -bottom-3 -left-3 w-10 h-10 xl:w-12 xl:h-12 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-white font-bold text-xs xl:text-sm">24/7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden text-center space-y-8">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-2 bg-[#FF7A00]/20 px-4 py-2 rounded-full">
                <Star className="w-4 h-4 text-[#FF7A00] fill-current" />
                <span className="text-[#FF7A00] text-sm font-semibold">Nota 4.9/5</span>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight px-2">
              Suas Vendas
              <span className="text-[#FF7A00] block">Não Dormem</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 leading-relaxed px-4">
              Agentes para WhatsApp, Instagram, Email e SMS — 
              <span className="text-[#FF7A00] font-semibold"> sem codar e com serviço totalmente personalizado para o seu negócio.</span>
            </p>

            {/* Mobile Dashboard */}
            <div className="flex justify-center mb-8">
              <div className="relative animate-float">
                <div className="w-64 h-80 sm:w-72 sm:h-88 md:w-80 md:h-96 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl sm:rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                    </div>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/70 text-xs sm:text-sm">Vendas Hoje</span>
                          <span className="text-[#FF7A00] text-xs sm:text-sm font-bold">+127%</span>
                        </div>
                        <div className="text-white text-xl sm:text-2xl font-bold">R$ 47.823</div>
                      </div>
                      
                      <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/70 text-xs sm:text-sm">Leads Ativos</span>
                          <span className="text-green-400 text-xs sm:text-sm font-bold">↗ 89</span>
                        </div>
                        <div className="text-white text-xl sm:text-2xl font-bold">1.247</div>
                      </div>
                      
                      <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/70 text-xs sm:text-sm">Conversões IA</span>
                          <span className="text-[#FF7A00] text-xs sm:text-sm font-bold">97%</span>
                        </div>
                        <div className="text-white text-lg sm:text-xl font-bold">24h Ativo</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-16 sm:h-16 bg-[#FF7A00] rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white font-bold text-sm sm:text-lg">AI</span>
                </div>
                
                <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-white font-bold text-xs sm:text-sm">24/7</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <button 
                onClick={scrollToCTA}
                className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group w-full sm:w-auto"
              >
                <span>Quero Minha Análise Gratuita</span>
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={scrollToCalculator}
                className="text-white hover:text-[#FF7A00] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 border-2 border-white/20 hover:border-[#FF7A00] backdrop-blur-sm w-full sm:w-auto"
              >
                Calcular Minhas Perdas
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator - hidden on mobile */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;