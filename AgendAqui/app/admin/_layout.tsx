import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLayout() {
  const { usuario, carregando } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (carregando) return;

    if (!usuario) {
      router.replace('/login');
      return;
    }

    // Cliente não pode acessar rotas /admin
    if (usuario.tipo === 'cliente') {
      router.replace('/menu');
      return;
    }

    // Funcionário não pode acessar CadastroFuncionario nem ResumoFinanceiro nem MenuAdmin
    if (usuario.tipo === 'funcionario') {
      const rotaAtual = segments[segments.length - 1];
      if (['CadastroFuncionario', 'ResumoFinanceiro', 'MenuAdmin'].includes(rotaAtual)) {
        router.replace('/admin/MenuFuncionario');
      }
    }
  }, [usuario, carregando, segments]);

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0B1F44" />
      </View>
    );
  }

  // Se for cliente, não renderiza as telas do admin para evitar flashes
  if (usuario?.tipo === 'cliente') {
    return null; 
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
