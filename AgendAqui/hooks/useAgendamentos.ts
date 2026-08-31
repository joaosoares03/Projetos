// hooks/useAgendamentos.ts
import { useState, useEffect } from 'react';
import { Agendamento, api } from '../services/api';
import { useAuth } from './useAuth';

export function useAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const { getUsuarioId, usuario, carregando: authCarregando } = useAuth();

  const carregarAgendamentos = async () => {
    try {
      setCarregando(true);
      setErro(null);
      
      const clienteId = getUsuarioId();
      
      // Se ainda está carregando a autenticação ou usuário não está logado, não faz nada
      if (authCarregando) {
        console.log('⏳ Aguardando autenticação...');
        return;
      }
      
      if (!clienteId) {
        console.log('⚠️ Usuário não logado, limpando agendamentos');
        setAgendamentos([]);
        return;
      }

      console.log('🔄 Carregando agendamentos do cliente:', clienteId);
      const dados = await api.getAgendamentosPorCliente(clienteId);
      console.log('✅ Agendamentos carregados:', dados.length);
      setAgendamentos(dados);
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro ao carregar agendamentos';
      setErro(mensagemErro);
      console.error('❌ Erro ao carregar agendamentos:', error);
    } finally {
      setCarregando(false);
    }
  };

  const cancelarAgendamento = async (id: number) => {
    console.log('🔥 Tentando cancelar agendamento ID:', id);
  
  try {
    // Tentativa 1: Usar a função de atualizar status
    console.log('🔄 Tentando atualizar status para "cancelado"...');
    const agendamentoAtualizado = await api.atualizarStatusAgendamento(id, 'cancelado');
    console.log('✅ Status atualizado com sucesso:', agendamentoAtualizado);
    
    // Atualizar lista local
    setAgendamentos(prev => prev.map(ag => 
      ag.id === id ? { ...ag, status: 'cancelado' } : ag
    ));
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao atualizar status:', error);
  }
  };

  useEffect(() => {
    carregarAgendamentos();
  }, [usuario, authCarregando]); // Recarrega quando o usuário ou estado de autenticação mudar

  return {
    agendamentos,
    carregando: carregando || authCarregando, // Considera carregando se auth ainda está carregando
    erro,
    recarregar: carregarAgendamentos,
    cancelarAgendamento
  };
}