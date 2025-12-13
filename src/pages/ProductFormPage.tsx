import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Navbar from '../components/layout/Navbar';
import productService from '../services/productService';
import { useAuth } from '../contexts/AuthContext';

const ProductFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [fotos, setFotos] = useState<FileList | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<{[key:string]: string}>({});
  const [loading, setLoading] = useState(false);

  // Validação: apenas vendedores podem acessar
  if (!user || user.tipoUsuario !== 'VENDEDOR') {
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
              Apenas vendedores podem cadastrar produtos.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 sm:px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-pink-500/50 transition-all text-sm sm:text-base"
            >
              Voltar para Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const validate = (): boolean => {
    const newErrors: {[key:string]: string} = {};

    if (!nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (!preco || parseFloat(preco) <= 0) newErrors.preco = 'Preço deve ser maior que zero';
    if (!quantidade || parseInt(quantidade) <= 0) newErrors.quantidade = 'Quantidade deve ser maior que zero';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFotos(files);

    // Criar preview das imagens
    if (files) {
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const removePreview = (index: number) => {
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newPreviewUrls);

    // Atualizar FileList
    if (fotos) {
      const dt = new DataTransfer();
      Array.from(fotos).forEach((file, i) => {
        if (i !== index) dt.items.add(file);
      });
      setFotos(dt.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('descricao', descricao);
      formData.append('preco', preco);
      formData.append('quantidade', quantidade);
      
      if (fotos) {
        Array.from(fotos).forEach(file => formData.append('fotos', file));
      }

      const response = await productService.createProduct(formData);
      
      alert('Produto cadastrado com sucesso!');
      console.log('Produto criado:', response.data);
      
      // Resetar formulário
      setNome('');
      setDescricao('');
      setPreco('');
      setQuantidade('');
      setFotos(null);
      setPreviewUrls([]);
      
      // Resetar input de arquivo
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      navigate('/products');
    } catch (error: any) {
      console.error('Erro ao cadastrar produto:', error);
      const errMsg = error.response?.data?.error || 'Erro ao cadastrar produto. Tente novamente.';
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display">
                Cadastrar Produto
              </h1>
              <p className="text-sm sm:text-base text-gray-300 mt-1">
                Adicione um novo item ao seu catálogo
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate className="space-y-6">
            {/* Card de Informações Básicas */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border-2 border-gray-100 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Informações Básicas
                </h2>
              </div>

              <div className="space-y-4">
                <Input
                  label="Nome do Produto"
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder="Ex: Camisa Vintage Anos 80"
                  error={errors.nome}
                  required
                />

                <div>
                  <label htmlFor="descricao" className="block text-gray-900 font-semibold mb-2 text-sm sm:text-base">
                    Descrição <span className="text-pink-600">*</span>
                  </label>
                  <textarea
                    id="descricao"
                    value={descricao}
                    onChange={e => setDescricao(e.target.value)}
                    placeholder="Descreva o produto em detalhes: condição, tamanho, marca, características especiais..."
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition text-sm sm:text-base ${
                      errors.descricao ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows={5}
                    required
                  />
                  {errors.descricao && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.descricao}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Card de Preço e Estoque */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border-2 border-gray-100 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Preço e Estoque
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Preço (R$)"
                  id="preco"
                  type="number"
                  step="0.01"
                  min="0"
                  value={preco}
                  onChange={e => setPreco(e.target.value)}
                  placeholder="0,00"
                  error={errors.preco}
                  required
                />

                <Input
                  label="Quantidade em Estoque"
                  id="quantidade"
                  type="number"
                  min="1"
                  value={quantidade}
                  onChange={e => setQuantidade(e.target.value)}
                  placeholder="1"
                  error={errors.quantidade}
                  required
                />
              </div>
            </div>

            {/* Card de Fotos */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border-2 border-gray-100 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Foto do Produto
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Cadastre 1 imagem • Máx. 5MB
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-8 text-center hover:border-pink-400 hover:bg-pink-50/50 transition-all cursor-pointer group">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 group-hover:text-pink-500 mx-auto mb-3 sm:mb-4 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm sm:text-base text-gray-700 font-medium mb-1">
                      Clique para selecionar a foto
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      PNG, JPG ou WEBP
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* Preview das imagens */}
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 sm:h-40 object-cover rounded-lg border-2 border-gray-200 group-hover:border-pink-400 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => removePreview(index)}
                          className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/products')}
                disabled={loading}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 sm:py-3.5 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 sm:py-3.5 rounded-xl font-bold text-base sm:text-lg hover:shadow-xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Cadastrar Produto
                  </>
                )}
              </button>
            </div>
          </form>
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

export default ProductFormPage;
