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

    // Limpar mensagens de erro e sucesso após 5 segundos
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

            // Atualizar user no contexto
            window.location.reload(); // Recarrega para atualizar o AuthContext
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

        // Validações
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

            // Deslogar após 2 segundos
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
            <div className="min-h-screen bg-gradient-to-br from-breshop-beige via-breshop-pink/20 to-breshop-beige">
                <Navbar />
                <div className="flex items-center justify-center p-4 mt-20">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h2>
                        <p className="text-breshop-navy mb-4">
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
        <div className="min-h-screen bg-gradient-to-br from-breshop-beige via-breshop-pink/20 to-breshop-beige">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    {/* Cabeçalho */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-breshop-navy font-display mb-2">
                            Meu Perfil
                        </h1>
                        <p className="text-gray-600">
                            Gerencie suas informações pessoais
                        </p>
                    </div>

                    {/* Mensagem de sucesso */}
                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* Informações Básicas */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <h2 className="text-2xl font-bold text-breshop-navy mb-6">
                            Informações Básicas
                        </h2>

                        <div className="space-y-4">
                            {/* Email (não editável) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="p-3 bg-gray-100 rounded-lg text-gray-600">
                                    {user.email}
                                    <span className="text-xs text-gray-500 ml-2">(não editável)</span>
                                </div>
                            </div>

                            {/* Tipo de Usuário (não editável) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de Conta
                                </label>
                                <div className="p-3 bg-gray-100 rounded-lg">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${user.tipoUsuario === 'VENDEDOR'
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {user.tipoUsuario === 'VENDEDOR' ? '🏪 Vendedor' : '🛍️ Comprador'}
                                    </span>
                                </div>
                            </div>

                            {/* Nome (editável) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome
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
                                            <Button
                                                type="submit"
                                                variant="primary"
                                                disabled={loadingName}
                                            >
                                                {loadingName ? 'Salvando...' : 'Salvar'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={handleCancelNameEdit}
                                                disabled={loadingName}
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-breshop-navy font-medium">{user.nome}</span>
                                        <button
                                            onClick={() => setIsEditingName(true)}
                                            className="text-breshop-navy hover:text-breshop-gold transition"
                                        >
                                            ✏️ Editar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Segurança */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-breshop-navy mb-6">
                            Segurança
                        </h2>

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
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={loadingPassword}
                                    >
                                        {loadingPassword ? 'Atualizando...' : 'Atualizar Senha'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={handleCancelPasswordEdit}
                                        disabled={loadingPassword}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <div className="p-3 bg-gray-50 rounded-lg mb-4">
                                    <p className="text-gray-600 mb-2">Senha</p>
                                    <p className="text-gray-400">••••••••</p>
                                </div>
                                <Button
                                    onClick={() => setIsEditingPassword(true)}
                                    variant="secondary"
                                >
                                    🔒 Alterar Senha
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
