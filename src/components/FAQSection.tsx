import React, { useState, useRef, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQSection: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([0]);
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

  const faqs = [
    {
      question: "Como funciona a integração com meus canais atuais?",
      answer: "Nossa IA se conecta nativamente com WhatsApp Business, Instagram Direct, email, SMS e principais CRMs como RD Station, HubSpot e Pipedrive. A integração é feita em até 24h, sem interrupção no seu atendimento atual. Todos os dados históricos são preservados e migrados automaticamente."
    },
    {
      question: "A IA vai substituir minha equipe de vendas?",
      answer: "Não! Nossa IA potencializa sua equipe, não substitui. Ela cuida do atendimento inicial, qualificação de leads, respostas básicas e follow-ups automáticos. Sua equipe fica livre para focar em vendas complexas, relacionamento estratégico e fechamento de grandes negócios. O resultado é mais produtividade para todos."
    },
    {
      question: "Quanto tempo leva para ver resultados?",
      answer: "Os primeiros resultados aparecem em 48-72h após a ativação. Em 30 dias, você já vê o ROI completo do investimento. Nossos clientes relatam aumento médio de 67% nas conversões no primeiro mês e recuperação de até R$ 35.000 em vendas perdidas."
    },
    {
      question: "E se meus clientes perceberem que é uma IA?",
      answer: "Nossa tecnologia é tão avançada que 94% dos clientes não percebem que estão falando com IA nos primeiros contatos. Quando necessário, a conversa é transferida suavemente para um humano. A IA aprende com seu tom de voz, linguagem e características específicas do seu negócio."
    },
    {
      question: "Qual o investimento necessário?",
      answer: "O investimento varia conforme o tamanho do seu negócio e canais integrados. Oferecemos planos a partir de R$ 497/mês, com ROI garantido em até 30 dias. Na análise gratuita, calculamos exatamente quanto você está perdendo e qual será seu retorno. A maioria dos clientes recupera o investimento na primeira semana."
    },
    {
      question: "Vocês oferecem garantia?",
      answer: "Sim! Oferecemos 30 dias de garantia incondicional. Se você não tiver pelo menos 200% de ROI no primeiro mês, devolvemos 100% do investimento. Além disso, oferecemos suporte 24/7, treinamento completo da equipe e otimizações contínuas sem custo adicional."
    },
    {
      question: "Como é feita a personalização para meu negócio?",
      answer: "Cada IA é única! Analisamos seu histórico de conversas, produtos/serviços, objeções comuns, linguagem da marca e perfil do cliente ideal. Treinamos a IA com suas melhores práticas de vendas. O processo leva 3-5 dias e inclui testes extensivos antes do go-live."
    },
    {
      question: "E a segurança dos dados dos meus clientes?",
      answer: "Segurança é nossa prioridade máxima. Utilizamos criptografia militar (AES-256), servidores no Brasil conforme LGPD, backups automáticos e auditoria constante. Somos certificados ISO 27001 e todos os dados ficam 100% sob seu controle. Jamais compartilhamos ou vendemos informações."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-[#1A0633] to-[#2D0B55]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-2">
            Perguntas <span className="text-[#FF7A00]">Frequentes</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Tire todas suas dúvidas sobre como nossa IA vai revolucionar suas vendas
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`mb-3 sm:mb-4 transition-all duration-700 transform ${
                isVisible 
                  ? 'translate-x-0 opacity-100' 
                  : 'translate-x-20 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 hover:border-[#FF7A00]/50 transition-all duration-300 overflow-hidden shadow-lg">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 sm:px-8 py-4 sm:py-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-300 group"
                >
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white group-hover:text-[#FF7A00] transition-colors duration-300 pr-4 leading-tight">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-[#FF7A00] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {openItems.includes(index) ? (
                      <Minus className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                    ) : (
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                    )}
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-500 ${
                  openItems.includes(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 sm:px-8 pb-4 sm:pb-6">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FF7A00]/30 to-transparent mb-4 sm:mb-6"></div>
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <div className="bg-gradient-to-r from-[#FF7A00]/20 to-[#FF9500]/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto border border-[#FF7A00]/30">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              Ainda tem dúvidas?
            </h3>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
              Converse diretamente com nosso especialista e tire todas suas dúvidas em uma call gratuita de 15 minutos.
            </p>
            <button 
              onClick={() => document.getElementById('cta-final')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#FF7A00] hover:bg-[#FF9500] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105"
            >
              Falar com Especialista
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;