import React, { useState, useEffect } from 'react';
import { Calculator as CalcIcon, DollarSign, TrendingDown } from 'lucide-react';

const Calculator: React.FC = () => {
  const [leads, setLeads] = useState<string>('100');
  const [ticket, setTicket] = useState<string>('500');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const calculateLosses = () => {
    const monthlyLeads = parseInt(leads) || 0;
    const avgTicket = parseInt(ticket) || 0;
    
    // 67% dos leads chegam fora do horário (estatística do briefing)
    const leadsForaHorario = monthlyLeads * 0.67;
    // 90% desses são perdidos sem atendimento automatizado
    const leadsPerdidos = leadsForaHorario * 0.9;
    // 15% de conversão média
    const vendasPerdidas = leadsPerdidos * 0.15;
    
    const perdaMensal = vendasPerdidas * avgTicket;
    const perdaAnual = perdaMensal * 12;
    
    return {
      perdaMensal: Math.round(perdaMensal),
      perdaAnual: Math.round(perdaAnual),
      leadsPerdidos: Math.round(leadsPerdidos),
      vendasPerdidas: Math.round(vendasPerdidas)
    };
  };

  const results = calculateLosses();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const scrollToCTA = () => {
    document.getElementById('cta-final')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="calculadora" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-[#1A0633] to-[#2D0B55]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-2">
            💸 Calculadora de <span className="text-red-400">Perdas</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Descubra quanto dinheiro você está perdendo por não ter atendimento 24/7
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border-2 border-[#FF7A00]/30 shadow-2xl transition-all duration-700 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Input Section */}
              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-center space-x-3 mb-6 sm:mb-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-xl flex items-center justify-center">
                    <CalcIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Seus Dados</h3>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-white font-semibold mb-2 sm:mb-3 text-base sm:text-lg">
                      Quantos leads você recebe por mês?
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={leads}
                        onChange={(e) => setLeads(e.target.value)}
                        className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-white text-lg sm:text-xl font-semibold focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 backdrop-blur-md"
                        placeholder="Ex: 100"
                      />
                      <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base">
                        leads/mês
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2 sm:mb-3 text-base sm:text-lg">
                      Qual seu ticket médio?
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
                      <input
                        type="number"
                        value={ticket}
                        onChange={(e) => setTicket(e.target.value)}
                        className="w-full bg-white/10 border-2 border-white/20 rounded-xl pl-12 sm:pl-14 pr-12 sm:pr-16 py-3 sm:py-4 text-white text-lg sm:text-xl font-semibold focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 backdrop-blur-md"
                        placeholder="Ex: 500"
                      />
                      <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base">
                        R$
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-3 mb-6 sm:mb-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Suas Perdas</h3>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-red-500/30">
                    <div className="text-red-300 text-xs sm:text-sm font-semibold mb-2">PERDA MENSAL</div>
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      {formatCurrency(results.perdaMensal)}
                    </div>
                    <div className="text-red-200 text-xs sm:text-sm">
                      {results.leadsPerdidos} leads perdidos → {results.vendasPerdidas} vendas perdidas
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-600/20 to-red-700/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-red-600/30">
                    <div className="text-red-300 text-xs sm:text-sm font-semibold mb-2">PERDA ANUAL</div>
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                      {formatCurrency(results.perdaAnual)}
                    </div>
                    <div className="text-red-200 text-xs sm:text-sm">
                      É isso que você perde por não ter IA 24/7
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#FF7A00]/20 to-[#FF9500]/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#FF7A00]/30">
                  <div className="text-[#FF7A00] text-xs sm:text-sm font-semibold mb-2">COM NOSSA IA</div>
                  <div className="text-xl sm:text-2xl font-bold text-white mb-2">
                    +{formatCurrency(results.perdaMensal * 0.8)}/mês
                  </div>
                  <div className="text-gray-200 text-xs sm:text-sm">
                    Recuperamos 80% dessas vendas perdidas
                  </div>
                </div>

                <button 
                  onClick={scrollToCTA}
                  className="w-full bg-gradient-to-r from-[#FF7A00] to-[#FF9500] hover:from-[#FF9500] hover:to-[#FFB000] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Parar de Perder Dinheiro
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base px-4">
            * Cálculos baseados em dados reais de mais de 1.000 empresas que utilizam nossa plataforma. 
            Resultados podem variar conforme o setor e implementação.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Calculator;