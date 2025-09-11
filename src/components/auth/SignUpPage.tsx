import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Zap, ArrowRight, Chrome, Facebook, Building, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    workspaceName: '',
    industry: '',
    companySize: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'account' | 'workspace'>('account');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Você deve aceitar os termos de uso');
      return;
    }

    setStep('workspace');
  };

  const handleWorkspaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            workspace_name: formData.workspaceName,
            industry: formData.industry,
            company_size: formData.companySize,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Show success message
        alert('✅ Conta criada com sucesso! Verifique seu email para confirmar a conta.');
        
        // Redirect to login
        window.location.href = '/login';
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider === 'google' ? 'google' : 'facebook',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || `Erro no cadastro com ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  const industries = [
    'E-commerce',
    'SaaS/Tecnologia',
    'Educação/Cursos',
    'Saúde/Clínicas',
    'Imobiliário',
    'Consultoria',
    'Agência/Marketing',
    'Varejo',
    'Serviços',
    'Outro'
  ];

  const companySizes = [
    'Apenas eu',
    '2-10 funcionários',
    '11-50 funcionários',
    '51-200 funcionários',
    '201-1000 funcionários',
    '1000+ funcionários'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D0B55] via-[#3D1565] to-[#2D0B55] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">meusuper.app</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {step === 'account' ? 'Criar sua conta' : 'Configure seu workspace'}
            </h2>
            <p className="text-gray-300">
              {step === 'account' 
                ? 'Comece sua jornada com IA de vendas' 
                : 'Personalize seu espaço de trabalho'
              }
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'account' ? 'bg-[#FF7A00] text-white' : 'bg-green-500 text-white'
              }`}>
                {step === 'workspace' ? '✓' : '1'}
              </div>
              <div className={`w-16 h-1 ${step === 'workspace' ? 'bg-[#FF7A00]' : 'bg-white/20'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'workspace' ? 'bg-[#FF7A00] text-white' : 'bg-white/20 text-gray-400'
              }`}>
                2
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Account Creation Form */}
          {step === 'account' && (
            <>
              <form onSubmit={handleAccountSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-3">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/10 border-2 border-white/20 rounded-xl pl-12 pr-4 py-4 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 backdrop-blur-md placeholder-gray-400"
                      placeholder="Seu nome completo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/10 border-2 border-white/20 rounded-xl pl-12 pr-4 py-4 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 backdrop-blur-md placeholder-gray-400"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/10 border-2 border-white/20 rounded-xl pl-12 pr-12 py-4 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 backdrop-blur-md placeholder-gray-400"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3">Confirmar Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/10 border-2 border-white/20 rounded-xl pl-12 pr-12 py-4 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 backdrop-blur-md placeholder-gray-400"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#FF7A00] bg-white/10 border-white/20 rounded focus:ring-[#FF7A00] focus:ring-2 mt-1"
                  />
                  <label className="text-gray-300 text-sm">
                    Eu aceito os{' '}
                    <a href="#" className="text-[#FF7A00] hover:text-[#FF9500] transition-colors">
                      Termos de Uso
                    </a>{' '}
                    e{' '}
                    <a href="#" className="text-[#FF7A00] hover:text-[#FF9500] transition-colors">
                      Política de Privacidade
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#FF7A00] to-[#FF9500] hover:from-[#FF9500] hover:to-[#FFB000] text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  Continuar
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </form>

              {/* Divider */}
              <div className="my-8 flex items-center">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <span className="px-4 text-gray-400 text-sm">ou cadastre-se com</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>

              {/* Social SignUp */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleSocialSignUp('google')}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 transition-all duration-300 disabled:opacity-50"
                >
                  <Chrome className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold">Google</span>
                </button>
                <button
                  onClick={() => handleSocialSignUp('facebook')}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 transition-all duration-300 disabled:opacity-50"
                >
                  <Facebook className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold">Facebook</span>
                </button>
              </div>
            </>
          )}

          {/* Workspace Setup Form */}
          {step === 'workspace' && (
            <form onSubmit={handleWorkspaceSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-3">Nome do Workspace</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="workspaceName"
                    value={formData.workspaceName}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/10 border-2 border-white/20 rounded-xl pl-12 pr-4 py-4 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 backdrop-blur-md placeholder-gray-400"
                    placeholder="Nome da sua empresa"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">Setor</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 py-4 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                >
                  <option value="" className="bg-[#2D0B55]">Selecione seu setor</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry} className="bg-[#2D0B55]">
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">Tamanho da Empresa</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/10 border-2 border-white/20 rounded-xl pl-12 pr-4 py-4 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300"
                  >
                    <option value="" className="bg-[#2D0B55]">Selecione o tamanho</option>
                    {companySizes.map((size) => (
                      <option key={size} value={size} className="bg-[#2D0B55]">
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep('account')}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-[#FF7A00] to-[#FF9500] hover:from-[#FF9500] hover:to-[#FFB000] text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <>
                      Criar Conta
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Já tem uma conta?{' '}
              <a href="/login" className="text-[#FF7A00] hover:text-[#FF9500] font-semibold transition-colors duration-300">
                Fazer login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;