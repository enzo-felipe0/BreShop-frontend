import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';

const ProfilePage: React.FC = () => {
    const { user, logout } = useAuth();
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    // Estados para edição de nome
    const [nome, setNome] = useState('');
    const [nomeError, setNomeError] = useState('');

    // Estados para edição de senha
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
    const [senhaError, setSenhaError] = useState('');

    // Estados de loading
    const [loadingName, setLoadingName] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    // Estados de sucesso
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (user) {
            setNome(user.nome);
        }
    }, [user]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleUpdateName = async (e: React.FormEvent) => {
        e.preventDefault();
        setNomeError('');
        setSuccessMessage('');

        if (!nome || nome.trim().length < 3) {
            setNomeError('Nome deve ter pelo menos 3 caracteres');
            return;
        }

        if (nome === user?.nome) {
            setNomeError('O nome não foi alterado');
            return;
        }

        setLoadingName(true);

        try {
            await userService.updateProfile({ nome: nome.trim() });
            setSuccessMessage('Nome atualizado com sucesso!');
            setIsEditingName(false);

            const storedUser = localStorage.getItem('@breshop:user');
            if (storedUser) {
                try {
                    const currentUser = JSON.parse(storedUser);
                    const updatedUser = {
                        ...currentUser,
                        nome: nome.trim()
                    };
                    localStorage.setItem('@breshop:user', JSON.stringify(updatedUser));
                    
                    window.dispatchEvent(new CustomEvent('userUpdated', { 
                        detail: updatedUser 
                    }));
                } catch (parseError) {
                    console.error('Erro ao parsear localStorage:', parseError);
                }
            }

            setNome(nome.trim());
            window.location.reload();
        } catch (error: any) {
            setNomeError(error.response?.data?.error || 'Erro ao atualizar nome');
        } finally {
            setLoadingName(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setSenhaError('');
        setSuccessMessage('');

        if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
            setSenhaError('Preencha todos os campos de senha');
            return;
        }

        if (novaSenha.length < 6) {
            setSenhaError('Nova senha deve ter pelo menos 6 caracteres');
            return;
        }

        if (novaSenha !== confirmarNovaSenha) {
            setSenhaError('As senhas não coincidem');
            return;
        }

        if (senhaAtual === novaSenha) {
            setSenhaError('A nova senha deve ser diferente da atual');
            return;
        }

        setLoadingPassword(true);

        try {
            await userService.updateProfile({
                senhaAtual,
                novaSenha
            });

            setSuccessMessage('Senha atualizada com sucesso! Você será desconectado.');
            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarNovaSenha('');
            setIsEditingPassword(false);

            setTimeout(() => {
                logout();
                window.location.href = '/login';
            }, 2000);

        } catch (error: any) {
            setSenhaError(error.response?.data?.error || 'Erro ao atualizar senha');
        } finally {
            setLoadingPassword(false);
        }
    };

    const handleCancelNameEdit = () => {
        setNome(user?.nome || '');
        setNomeError('');
        setIsEditingName(false);
    };

    const handleCancelPasswordEdit = () => {
        setSenhaAtual('');
        setNovaSenha('');
        setConfirmarNovaSenha('');
        setSenhaError('');
        setIsEditingPassword(false);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <div className="flex items-center justify-center flex-grow p-4">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 sm:p-12 rounded-2xl shadow-xl text-center max-w-md w-full mx-4 border-2 border-gray-200">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
                        <p className="text-gray-600 mb-6 text-base sm:text-lg">
                            Você precisa estar autenticado para acessar esta página.
                        </p>
                        <Link to="/login">
                            <Button variant="primary">Fazer Login</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            {/* Header com Avatar */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 sm:py-16">
                <div className="container mx-auto px-4 sm:px-6 md:px-8">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                        {/* Avatar */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg">
                            {user.nome.charAt(0).toUpperCase()}
                        </div>
                        
                        <div className="text-center sm:text-left">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display mb-2">
                                {user.nome}
                            </h1>
                            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {user.email}
                                </span>
                                <span className="hidden sm:inline text-gray-500">•</span>
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                    user.tipoUsuario === 'VENDEDOR'
                                        ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                                        : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                                }`}>
                                    {user.tipoUsuario === 'VENDEDOR' ? '🏪 Vendedor' : '🛍️ Comprador'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
                <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
                    {/* Mensagem de sucesso */}
                    {successMessage && (
                        <div className="p-4 bg-green-50 border-2 border-green-500 text-green-800 rounded-xl flex items-start gap-3 shadow-sm animate-fadeIn">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm sm:text-base font-medium">{successMessage}</span>
                        </div>
                    )}

                    {/* Informações Básicas */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border-2 border-gray-100 p-4 sm:p-6">
                        <div className="flex items-center gap-3 mb-4 sm:mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                Informações Básicas
                            </h2>
                        </div>

                        <div className="space-y-4 sm:space-y-5">
                            {/* Email (não editável) */}
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg text-gray-700 flex items-center justify-between border border-gray-200">
                                    <span className="text-sm sm:text-base">{user.email}</span>
                                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-md font-medium">
                                        Não editável
                                    </span>
                                </div>
                            </div>

                            {/* Nome (editável) */}
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    Nome Completo
                                </label>
                                {isEditingName ? (
                                    <form onSubmit={handleUpdateName} className="space-y-3">
                                        <Input
                                            id="nome"
                                            label=""
                                            type="text"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            placeholder="Seu nome completo"
                                            error={nomeError}
                                            disabled={loadingName}
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                disabled={loadingName}
                                                className="flex-1 sm:flex-none bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                            >
                                                {loadingName ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Salvando...
                                                    </span>
                                                ) : 'Salvar'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleCancelNameEdit}
                                                disabled={loadingName}
                                                className="flex-1 sm:flex-none bg-white border-2 border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 group hover:border-pink-300 transition-all">
                                        <span className="text-gray-900 font-medium text-sm sm:text-base">{user.nome}</span>
                                        <button
                                            onClick={() => setIsEditingName(true)}
                                            className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold transition text-sm"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                            Editar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Segurança */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border-2 border-gray-100 p-4 sm:p-6">
                        <div className="flex items-center gap-3 mb-4 sm:mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                Segurança
                            </h2>
                        </div>

                        {isEditingPassword ? (
                            <form onSubmit={handleUpdatePassword} className="space-y-4">
                                <Input
                                    id="senhaAtual"
                                    type="password"
                                    label="Senha Atual"
                                    value={senhaAtual}
                                    onChange={(e) => setSenhaAtual(e.target.value)}
                                    placeholder="Digite sua senha atual"
                                    disabled={loadingPassword}
                                />
                                <Input
                                    id="novaSenha"
                                    type="password"
                                    label="Nova Senha"
                                    value={novaSenha}
                                    onChange={(e) => setNovaSenha(e.target.value)}
                                    placeholder="Digite a nova senha (mín. 6 caracteres)"
                                    disabled={loadingPassword}
                                />
                                <Input
                                    id="confirmarNovaSenha"
                                    type="password"
                                    label="Confirmar Nova Senha"
                                    value={confirmarNovaSenha}
                                    onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                                    placeholder="Digite a nova senha novamente"
                                    error={senhaError}
                                    disabled={loadingPassword}
                                />
                                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                    <button
                                        type="submit"
                                        disabled={loadingPassword}
                                        className="flex-1 sm:flex-none bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                    >
                                        {loadingPassword ? 'Atualizando...' : 'Atualizar Senha'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancelPasswordEdit}
                                        disabled={loadingPassword}
                                        className="flex-1 sm:flex-none bg-white border-2 border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <div className="p-4 bg-gray-50 rounded-lg mb-4 border border-gray-200">
                                    <p className="text-xs sm:text-sm text-gray-600 mb-2 font-medium">Senha</p>
                                    <p className="text-gray-400 text-lg">••••••••</p>
                                </div>
                                <button
                                    onClick={() => setIsEditingPassword(true)}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all text-sm sm:text-base"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                    Alterar Senha
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 border-t border-gray-800 py-8 sm:py-12 mt-auto">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <p className="text-gray-400 text-sm sm:text-base">
                            &copy; {new Date().getFullYear()} BreShop. Consumo consciente, futuro sustentável.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ProfilePage;