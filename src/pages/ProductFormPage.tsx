import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
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
      <div className="min-h-screen bg-gradient-to-br from-breshop-beige via-breshop-pink/20 to-breshop-beige">
        <Navbar />
        <div className="flex items-center justify-center p-4 mt-20">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h2>
            <p className="text-breshop-navy mb-4">
              Apenas vendedores podem cadastrar produtos.
            </p>
            <Button onClick={() => navigate('/')} variant="primary">
              Voltar para Home
            </Button>
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
    <div className="min-h-screen bg-gradient-to-br from-breshop-beige via-breshop-pink/20 to-breshop-beige">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-breshop-navy font-display">
            Cadastrar Produto
          </h1>
          
          <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
            <Input
              label="Nome do Produto"
              id="nome"
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Ex: Camisa Vintage"
              error={errors.nome}
              required
            />

            <div className="mb-4">
              <label htmlFor="descricao" className="block text-breshop-navy font-medium mb-2">
                Descrição <span className="text-breshop-coral">*</span>
              </label>
              <textarea
                id="descricao"
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                placeholder="Descreva o produto em detalhes..."
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-breshop-gold focus:border-breshop-gold transition ${
                  errors.descricao ? 'border-red-500' : 'border-breshop-gold/30'
                }`}
                rows={4}
                required
              />
              {errors.descricao && <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>}
            </div>

            <Input
              label="Preço (R$)"
              id="preco"
              type="number"
              step="0.01"
              min="0"
              value={preco}
              onChange={e => setPreco(e.target.value)}
              placeholder="0.00"
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

            <div className="mb-6">
              <label className="block text-breshop-navy font-medium mb-2">
                Fotos do Produto
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border-2 border-breshop-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-breshop-gold file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-breshop-navy file:text-white hover:file:bg-breshop-gold file:cursor-pointer"
              />
              <p className="text-sm text-gray-500 mt-1">
                Selecione até 5 imagens do produto (máx. 5MB cada)
              </p>

              {/* Preview das imagens */}
              {previewUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-breshop-gold/30"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => navigate('/products')}
                fullWidth
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                disabled={loading}
              >
                {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductFormPage;
