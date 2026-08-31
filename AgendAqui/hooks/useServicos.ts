import { useState, useEffect } from 'react';
import { Servico, api } from '../services/api';

export function useServicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarServicos = async () => {
    try {
      setCarregando(true);
      setErro(null);
      console.log('🔄 Carregando serviços da API...');
      const dados = await api.getServicos();
      console.log('✅ Serviços carregados:', dados.length);
      setServicos(dados);
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro ao carregar serviços';
      setErro(mensagemErro);
      console.error('❌ Erro detalhado:', error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarServicos();
  }, []);

  return {
    servicos,
    carregando,
    erro,
    recarregar: carregarServicos
  };
}