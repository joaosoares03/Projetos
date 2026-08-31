import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
  ActivityIndicator, ScrollView, Image, SafeAreaView,
} from 'react-native';
import {
  useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAgendamentos } from '../hooks/useAgendamentos';
import { useAuth } from '../hooks/useAuth';
import { useTema } from '../contexts/ThemeContext';
import Popup from '../components/Popup';
 
interface PopupState {
  visivel: boolean;
  tipo: 'sucesso' | 'erro' | 'aviso' | 'confirmacao' | 'info';
  titulo: string;
  mensagem: string;
  onConfirmar?: () => void;
}
 
export default function Menu() {
  const router = useRouter();
  const { agendamentos, carregando, erro, cancelarAgendamento } = useAgendamentos();
  const { usuario, carregando: authCarregando } = useAuth();
  const { tema, alternarTema, cores } = useTema();
  const [cancelandoIds, setCancelandoIds] = useState<number[]>([]);
 
  const [popup, setPopup] = useState<PopupState>({
    visivel: false, tipo: 'info', titulo: '', mensagem: '',
  });
 
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold });
  if (!fontsLoaded) return null;
 
  const fecharPopup = () => setPopup(p => ({ ...p, visivel: false }));
 
  const mostrarPopup = (
    tipo: PopupState['tipo'],
    titulo: string,
    mensagem: string,
    onConfirmar?: () => void,
  ) => setPopup({ visivel: true, tipo, titulo, mensagem, onConfirmar });
 
  const handleCancelarAgendamento = (agendamentoId: number) => {
    mostrarPopup(
      'confirmacao',
      'Cancelar Agendamento',
      'Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.',
      async () => {
        fecharPopup();
        setCancelandoIds(prev => [...prev, agendamentoId]);
        try {
          await cancelarAgendamento(agendamentoId);
          mostrarPopup('sucesso', 'Agendamento Cancelado', 'Seu agendamento foi cancelado com sucesso.');
        } catch {
          mostrarPopup('erro', 'Erro', 'Não foi possível cancelar o agendamento. Tente novamente.');
        } finally {
          setCancelandoIds(prev => prev.filter(id => id !== agendamentoId));
        }
      },
    );
  };
 
  const formatarData = (dataString: string) => {
    const data = new Date(dataString + 'T12:00:00');
    return data.toLocaleDateString('pt-BR');
  };
 
  const confirmarLogout = () => {
    mostrarPopup(
      'confirmacao',
      'Sair da conta',
      'Deseja realmente sair? Você precisará fazer login novamente.',
      async () => {
        fecharPopup();
        await AsyncStorage.removeItem('@usuario_data');
        router.replace('/login');
      },
    );
  };
 
  const statusConfig: Record<string, { label: string; cor: string; bg: string }> = {
    agendado:  { label: 'Agendado',  cor: '#166534', bg: '#DCFCE7' },
    concluido: { label: 'Concluído', cor: '#1E40AF', bg: '#DBEAFE' },
    cancelado: { label: 'Cancelado', cor: '#991B1B', bg: '#FEE2E2' },
  };
 
  if (authCarregando) {
    return (
      <View style={[estilos.centralizado, { flex: 1, backgroundColor: cores.fundo }]}>
        <ActivityIndicator size="large" color={cores.botaoPrimario} />
      </View>
    );
  }
 
  if (!usuario) {
    return (
      <View style={[estilos.centralizado, { flex: 1, backgroundColor: cores.fundo }]}>
        <Text style={{ color: cores.textoPrimario, fontFamily: 'Poppins_400Regular' }}>Usuário não logado</Text>
        <TouchableOpacity style={[estilos.botaoPrimario, { backgroundColor: cores.botaoPrimario, marginTop: 16 }]} onPress={() => router.replace('/login')}>
          <Text style={estilos.textoBotaoPrimario}>Fazer Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
 
  return (
    <SafeAreaView style={[estilos.fundo, { backgroundColor: cores.fundo }]}>
      {/* Header */}
      <View style={[estilos.header, { backgroundColor: cores.fundoHeader, borderBottomColor: cores.borda }]}>
        <Image source={require('../assets/images/logoedcarpng.png')} style={estilos.logo} resizeMode="contain" />
        <View>
          <Text style={[estilos.headerSaudacao, { color: cores.textoSecundario }]}>Olá,</Text>
          <Text style={[estilos.headerNome, { color: cores.textoPrimario }]}>{usuario.nome.split(' ')[0]}</Text>
        </View>
        <View style={estilos.headerAcoes}>
          <TouchableOpacity style={[estilos.botaoIconeHeader, { backgroundColor: cores.borda }]} onPress={alternarTema}>
            <Ionicons name={tema === 'escuro' ? 'sunny-outline' : 'moon-outline'} size={20} color={cores.textoPrimario} />
          </TouchableOpacity>
          <TouchableOpacity style={[estilos.botaoIconeHeader, { backgroundColor: cores.borda }]} onPress={confirmarLogout}>
            <Ionicons name="log-out-outline" size={20} color={cores.textoPrimario} />
          </TouchableOpacity>
        </View>
      </View>
 
      <ScrollView contentContainerStyle={estilos.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[estilos.secaoTitulo, { color: cores.textoPrimario }]}>Ações Rápidas</Text>
        <View style={estilos.acoesFila}>
          <TouchableOpacity
            style={[estilos.acaoCard, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}
            onPress={() => router.push('/servicos')}
          >
            <View style={[estilos.acaoIcone, { backgroundColor: cores.fundoIconeAcao1 }]}>
              <Ionicons name="car-sport-outline" size={24} color={cores.corIconeAcao1} />
            </View>
            <Text style={[estilos.acaoLabel, { color: cores.textoPrimario }]}>Agendar</Text>
          </TouchableOpacity>
 
          <TouchableOpacity
            style={[estilos.acaoCard, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}
            onPress={() => router.push('/comochegar')}
          >
            <View style={[estilos.acaoIcone, { backgroundColor: cores.fundoIconeAcao2 }]}>
              <Ionicons name="location-outline" size={24} color={cores.corIconeAcao2} />
            </View>
            <Text style={[estilos.acaoLabel, { color: cores.textoPrimario }]}>Como Chegar</Text>
          </TouchableOpacity>
        </View>
 
        <Text style={[estilos.secaoTitulo, { color: cores.textoPrimario }]}>Meus Agendamentos</Text>
 
        {carregando ? (
          <ActivityIndicator size="large" color={cores.botaoPrimario} style={{ marginTop: 30 }} />
        ) : erro ? (
          <Text style={{ color: '#FCA5A5', textAlign: 'center', fontFamily: 'Poppins_400Regular' }}>Erro ao carregar agendamentos</Text>
        ) : agendamentos.length === 0 ? (
          <View style={estilos.vazioContainer}>
            <Ionicons name="calendar-outline" size={48} color={cores.textoTerceiro} />
            <Text style={[estilos.textoVazio, { color: cores.textoTerceiro }]}>Nenhum agendamento ainda</Text>
            <TouchableOpacity style={[estilos.botaoPrimario, { backgroundColor: cores.botaoPrimario }]} onPress={() => router.push('/servicos')}>
              <Text style={estilos.textoBotaoPrimario}>Agendar agora</Text>
            </TouchableOpacity>
          </View>
        ) : (
          agendamentos.map(item => {
            const cfg = statusConfig[item.status] ?? { label: item.status, cor: '#555', bg: '#F1F5F9' };
            return (
              <View key={item.id.toString()} style={[estilos.card, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}>
                <View style={estilos.cardHeader}>
                  <Text style={[estilos.cardServico, { color: cores.textoPrimario }]}>{item.servico.nome}</Text>
                  <View style={[estilos.badge, { backgroundColor: cfg.bg }]}>
                    <Text style={[estilos.badgeTexto, { color: cfg.cor }]}>{cfg.label}</Text>
                  </View>
                </View>
                <View style={estilos.cardDetalhesFila}>
                  <View style={estilos.cardDetalheItem}>
                    <Ionicons name="calendar-outline" size={14} color={cores.textoSecundario} />
                    <Text style={[estilos.cardDetalhesTexto, { color: cores.textoSecundario }]}>{formatarData(item.dataAgendamento)}</Text>
                  </View>
                  <View style={estilos.cardDetalheItem}>
                    <Ionicons name="time-outline" size={14} color={cores.textoSecundario} />
                    <Text style={[estilos.cardDetalhesTexto, { color: cores.textoSecundario }]}>{item.horario}</Text>
                  </View>
                  <View style={estilos.cardDetalheItem}>
                    <Ionicons name="car-outline" size={14} color={cores.textoSecundario} />
                    <Text style={[estilos.cardDetalhesTexto, { color: cores.textoSecundario }]}>{item.modeloCarro}</Text>
                  </View>
                </View>
                {item.status === 'agendado' && (
                  <TouchableOpacity
                    style={[estilos.botaoCancelar, { backgroundColor: cores.botaoPerigo, borderColor: cores.botaoPericoBorda }]}
                    onPress={() => handleCancelarAgendamento(item.id)}
                    disabled={cancelandoIds.includes(item.id)}
                    activeOpacity={0.7}
                  >
                    {cancelandoIds.includes(item.id) ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <ActivityIndicator size="small" color={cores.botaoPerigoTexto} />
                        <Text style={[estilos.botaoCancelarTexto, { color: cores.botaoPerigoTexto }]}>Cancelando...</Text>
                      </View>
                    ) : (
                      <Text style={[estilos.botaoCancelarTexto, { color: cores.botaoPerigoTexto }]}>Cancelar agendamento</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
 
      {/* Tab Bar */}
      <View style={[estilos.tabBar, { backgroundColor: cores.tabBar, borderTopColor: cores.borda }]}>
        <TouchableOpacity style={estilos.tabItem} onPress={() => {}}>
          <Ionicons name="home" size={22} color={cores.iconeAtivo} />
          <Text style={[estilos.tabLabel, { color: cores.iconeAtivo, fontFamily: 'Poppins_600SemiBold' }]}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.tabItem} onPress={() => router.push('/servicos')}>
          <Ionicons name="car-sport-outline" size={22} color={cores.iconeInativo} />
          <Text style={[estilos.tabLabel, { color: cores.iconeInativo }]}>Serviços</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.tabItem} onPress={() => router.push('/comochegar')}>
          <Ionicons name="location-outline" size={22} color={cores.iconeInativo} />
          <Text style={[estilos.tabLabel, { color: cores.iconeInativo }]}>Localização</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.tabItem} onPress={confirmarLogout} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="log-out-outline" size={22} color={cores.iconeInativo} />
          <Text style={[estilos.tabLabel, { color: cores.iconeInativo }]}>Sair</Text>
        </TouchableOpacity>
      </View>
 
      <Popup
        visivel={popup.visivel}
        tipo={popup.tipo}
        titulo={popup.titulo}
        mensagem={popup.mensagem}
        botoes={
          popup.tipo === 'confirmacao'
            ? [
                { label: 'Cancelar',  onPress: fecharPopup,                    tipo: 'secundario' },
                { label: 'Confirmar', onPress: popup.onConfirmar ?? fecharPopup, tipo: popup.titulo.includes('cancelar') || popup.titulo.includes('Cancelar') ? 'perigo' : 'primario' },
              ]
            : [{ label: 'OK', onPress: fecharPopup }]
        }
        onFechar={fecharPopup}
      />
    </SafeAreaView>
  );
}
 
const estilos = StyleSheet.create({
  fundo: { flex: 1 },
  centralizado: { justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1 },
  logo: { width: 40, height: 40, marginRight: 10 },
  headerSaudacao: { fontFamily: 'Poppins_400Regular', fontSize: 12 },
  headerNome: { fontFamily: 'Poppins_700Bold', fontSize: 16 },
  headerAcoes: { marginLeft: 'auto', flexDirection: 'row', gap: 8 },
  botaoIconeHeader: { padding: 8, borderRadius: 8 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24 },
  secaoTitulo: { fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginBottom: 12 },
  acoesFila: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  acaoCard: { flex: 1, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1 },
  acaoIcone: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  acaoLabel: { fontFamily: 'Poppins_600SemiBold', fontSize: 13 },
  card: { borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  cardServico: { fontFamily: 'Poppins_600SemiBold', fontSize: 15, flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  badgeTexto: { fontFamily: 'Poppins_600SemiBold', fontSize: 11 },
  cardDetalhesFila: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cardDetalheItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardDetalhesTexto: { fontFamily: 'Poppins_400Regular', fontSize: 13 },
  botaoCancelar: { marginTop: 14, borderWidth: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  botaoCancelarTexto: { fontFamily: 'Poppins_600SemiBold', fontSize: 13 },
  vazioContainer: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  textoVazio: { fontFamily: 'Poppins_400Regular', fontSize: 15 },
  botaoPrimario: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, marginTop: 4 },
  textoBotaoPrimario: { fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: '#FFFFFF' },
  tabBar: { flexDirection: 'row', borderTopWidth: 1, paddingBottom: 24, paddingTop: 10, paddingHorizontal: 10 },
  tabItem: { flex: 1, alignItems: 'center', gap: 3 },
  tabLabel: { fontFamily: 'Poppins_400Regular', fontSize: 10 },
});