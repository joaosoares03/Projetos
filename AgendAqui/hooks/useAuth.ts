// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cliente, LoginRequest, Administrador, Funcionario, UsuarioLogado, TipoUsuario, api } from '../services/api';

const USUARIO_STORAGE_KEY = '@usuario_data';

export function useAuth() {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarUsuarioStorage();
  }, []);

  const carregarUsuarioStorage = async () => {
    try {
      const usuarioData = await AsyncStorage.getItem(USUARIO_STORAGE_KEY);
      if (usuarioData) {
        setUsuario(JSON.parse(usuarioData));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setCarregando(false);
    }
  };

  const login = async (email: string, senha: string): Promise<UsuarioLogado> => {
    try {
      setCarregando(true);
      const loginRequest: LoginRequest = { email, senha };

      let usuarioLogado: UsuarioLogado | null = null;
      let erroFinal: string | null = null;

      try {
        console.log('🔐 Tentando login como administrador...');
        const admin = await api.loginAdministrador(loginRequest);
        usuarioLogado = {
          id: admin.id,
          nome: admin.nome,
          email: admin.email,
          tipo: 'administrador' as TipoUsuario,
          telefone: admin.telefone
        };
        console.log('✅ Login como administrador bem-sucedido');
      } catch (adminError) {
        console.log('ℹ️ Não é administrador, tentando como funcionário...');

        try {
          console.log('🔐 Tentando login como funcionário...');
          const funcionario = await api.loginFuncionario(loginRequest);
          usuarioLogado = {
            id: funcionario.id,
            nome: funcionario.nome,
            email: funcionario.email,
            tipo: 'funcionario' as TipoUsuario,
            telefone: funcionario.telefone
          };
          console.log('✅ Login como funcionário bem-sucedido');
        } catch (funcionarioError) {
          console.log('ℹ️ Não é funcionário, tentando como cliente...');

          try {
            console.log('🔐 Tentando login como cliente...');
            const cliente = await api.loginCliente(loginRequest);
            usuarioLogado = {
              id: cliente.id,
              nome: cliente.nome,
              email: cliente.email,
              tipo: 'cliente' as TipoUsuario,
              telefone: cliente.telefone
            };
            console.log('✅ Login como cliente bem-sucedido');
          } catch (clienteError) {
            erroFinal = 'Email ou senha inválidos';
            console.error('❌ Falha no login para todos os tipos de usuário');
          }
        }
      }

      if (!usuarioLogado) {
        throw new Error(erroFinal || 'Email ou senha inválidos');
      }

      setUsuario(usuarioLogado);
      await AsyncStorage.setItem(USUARIO_STORAGE_KEY, JSON.stringify(usuarioLogado));

      return usuarioLogado;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  const logout = async (): Promise<void> => {
  console.log('🚪 Executando logout...');
  await AsyncStorage.removeItem(USUARIO_STORAGE_KEY);
  setUsuario(null);
  console.log('✅ Logout concluído');
};

  const getUsuarioId = (): number | null => {
    return usuario?.id || null;
  };

  const isAdministrador = (): boolean => usuario?.tipo === 'administrador';
  const isFuncionario = (): boolean => usuario?.tipo === 'funcionario';
  const isCliente = (): boolean => usuario?.tipo === 'cliente';

  return {
    usuario,
    carregando,
    login,
    logout,
    getUsuarioId,
    isAdministrador,
    isFuncionario,
    isCliente,
    estaLogado: !!usuario,
  };
}