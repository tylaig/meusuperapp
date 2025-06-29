import React, { useState } from 'react';
import { 
  CreditCard, 
  Check, 
  Star, 
  Calendar, 
  DollarSign,
  Zap,
  Users,
  MessageSquare,
  BarChart3,
  Shield,
  Crown,
  Sparkles
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';

const SubscriptionPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit'>('pix');

  const currentSubscription = {
    planName: 'Plano Pro',
    status: 'active',
    price: 497,
    billingCycle: 'monthly',
    nextBilling: '2024-02-15',
    features: [
      'IA Avançada 24/7',
      'Integração Multicanal',
      'Analytics Completo',
      'Suporte Prioritário'
    ]
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      icon: Zap,
      color: 'from-blue-500 to-blue-600',
      monthlyPrice: 197,
      yearlyPrice: 1970,
      description: 'Perfeito para começar',
      features: [
        'IA Básica 24/7',
        '1 Canal (WhatsApp)',
        'Até 1.000 mensagens/mês',
        'Analytics básico',
        'Suporte por email'
      ],
      limits: {
        channels: 1,
        messages: 1000,
        users: 1
      }
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Crown,
      color: 'from-[#FF7A00] to-[#FF9500]',
      monthlyPrice: 497,
      yearlyPrice: 4970,
      description: 'Mais popular',
      popular: true,
      features: [
        'IA Avançada 24/7',
        'Todos os canais',
        'Até 10.000 mensagens/mês',
        'Analytics completo',
        'Integrações avançadas',
        'Suporte prioritário',
        'Treinamento personalizado'
      ],
      limits: {
        channels: 'unlimited',
        messages: 10000,
        users: 5
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: Sparkles,
      color: 'from-purple-500 to-purple-600',
      monthlyPrice: 997,
      yearlyPrice: 9970,
      description: 'Para grandes empresas',
      features: [
        'IA Premium 24/7',
        'Canais ilimitados',
        'Mensagens ilimitadas',
        'Analytics avançado',
        'Integrações customizadas',
        'Suporte dedicado',
        'Gerente de conta',
        'SLA garantido'
      ],
      limits: {
        channels: 'unlimited',
        messages: 'unlimited',
        users: 'unlimited'
      }
    }
  ];

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    // Here you would integrate with Mercado Pago
    console.log('Upgrading to plan:', planId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getDiscount = () => {
    return billingCycle === 'yearly' ? 20 : 0;
  };

  return (
    <DashboardLayout currentPage="subscription">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Assinatura</h1>
          <p className="text-gray-300">Gerencie seu plano e pagamentos</p>
        </div>

        {/* Current Subscription */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Plano Atual</h2>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              currentSubscription.status === 'active' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {currentSubscription.status === 'active' ? 'Ativo' : 'Inativo'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-white font-semibold mb-2">{currentSubscription.planName}</h3>
              <p className="text-2xl font-bold text-[#FF7A00] mb-1">
                {formatPrice(currentSubscription.price)}
                <span className="text-sm text-gray-400">/mês</span>
              </p>
            </div>

            <div>
              <h4 className="text-gray-300 text-sm mb-2">Próxima cobrança</h4>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[#FF7A00]" />
                <span className="text-white">15 de Fevereiro, 2024</span>
              </div>
            </div>

            <div>
              <h4 className="text-gray-300 text-sm mb-2">Recursos inclusos</h4>
              <div className="space-y-1">
                {currentSubscription.features.slice(0, 2).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-3 h-3 text-green-400" />
                    <span className="text-white text-sm">{feature}</span>
                  </div>
                ))}
                <span className="text-gray-400 text-sm">+{currentSubscription.features.length - 2} mais</span>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center">
          <div className="bg-white/10 rounded-lg p-1 flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-[#FF7A00] text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md transition-all duration-300 relative ${
                billingCycle === 'yearly'
                  ? 'bg-[#FF7A00] text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Anual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
            const monthlyPrice = billingCycle === 'yearly' ? price / 12 : price;
            
            return (
              <div
                key={plan.id}
                className={`relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border transition-all duration-300 transform hover:scale-105 ${
                  plan.popular ? 'border-[#FF7A00] shadow-2xl shadow-[#FF7A00]/20' : 'border-white/20 hover:border-[#FF7A00]/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-[#FF7A00] text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>Mais Popular</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-300 text-sm">{plan.description}</p>
                </div>

                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-white mb-1">
                    {formatPrice(monthlyPrice)}
                    <span className="text-sm text-gray-400">/mês</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <div className="text-sm text-gray-400">
                      {formatPrice(price)} cobrado anualmente
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleUpgrade(plan.id)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                    plan.id === 'pro'
                      ? 'bg-[#FF7A00] hover:bg-[#FF9500] text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                >
                  {plan.id === currentSubscription.planName.toLowerCase().replace('plano ', '') 
                    ? 'Plano Atual' 
                    : plan.id === 'starter' ? 'Fazer Downgrade' : 'Fazer Upgrade'
                  }
                </button>
              </div>
            );
          })}
        </div>

        {/* Payment Methods */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">Métodos de Pagamento</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div
              onClick={() => setPaymentMethod('pix')}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                paymentMethod === 'pix'
                  ? 'border-[#FF7A00] bg-[#FF7A00]/10'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">PIX</h4>
                  <p className="text-gray-300 text-sm">Pagamento instantâneo</p>
                  <p className="text-green-400 text-sm font-semibold">5% de desconto</p>
                </div>
              </div>
            </div>

            <div
              onClick={() => setPaymentMethod('credit')}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                paymentMethod === 'credit'
                  ? 'border-[#FF7A00] bg-[#FF7A00]/10'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Cartão de Crédito</h4>
                  <p className="text-gray-300 text-sm">Parcelamento disponível</p>
                  <p className="text-blue-400 text-sm font-semibold">Até 12x sem juros</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 text-gray-400 text-sm">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Pagamento seguro</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Mercado Pago</span>
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">Uso do Plano Atual</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Mensagens</span>
                <span className="text-white font-semibold">7,234 / 10,000</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-[#FF7A00] h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Usuários</span>
                <span className="text-white font-semibold">3 / 5</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Canais</span>
                <span className="text-white font-semibold">4 / Ilimitado</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPage;