import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Zap, ArrowRight, Chrome, Facebook } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [error, setError] = useState('');

  const { login, forgotPassword, socialLogin } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password, formData.rememberMe);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await forgotPassword(forgotEmail);
      alert('Email de recuperação enviado!');
      setShowForgotPassword(false);
      setForgotEmail('');
    } catch (err) {
      setError('Erro ao enviar email de recuperação');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    setError('');

    try {
      await socialLogin(provider);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Erro no login com ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2D0B55] via-[#3D1565] to-[#2D0B55] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Recuperar Senha</h2>
              <p className="text-gray-300">Digite seu email para receber as instruções</p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-3">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    className="w-full bg-white/10 border-2 border-white/20 rounded-xl pl-12 pr-4 py-4 text-white focus:border-[#FF7A00] focus:outline-none transition-colors duration-300 backdrop-blur-md placeholder-gray-400"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#FF7A00] to-[#FF9500] hover:from-[#FF9500] hover:to-[#FFB000] text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <>
                    Enviar Instruções
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full text-gray-300 hover:text-white transition-colors duration-300 py-2"
              >
                Voltar ao Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

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
            <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo de volta!</h2>
            <p className="text-gray-300">Acesse sua conta para continuar</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#FF7A00] bg-white/10 border-white/20 rounded focus:ring-[#FF7A00] focus:ring-2"
                />
                <span className="text-gray-300 text-sm">Lembrar de mim</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-[#FF7A00] hover:text-[#FF9500] text-sm font-semibold transition-colors duration-300"
              >
                Esqueci minha senha
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#FF7A00] to-[#FF9500] hover:from-[#FF9500] hover:to-[#FFB000] text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <span className="px-4 text-gray-400 text-sm">ou continue com</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 transition-all duration-300 disabled:opacity-50"
            >
              <Chrome className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">Google</span>
            </button>
            <button
              onClick={() => handleSocialLogin('facebook')}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 transition-all duration-300 disabled:opacity-50"
            >
              <Facebook className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">Facebook</span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Não tem uma conta?{' '}
              <button className="text-[#FF7A00] hover:text-[#FF9500] font-semibold transition-colors duration-300">
                Criar conta
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;