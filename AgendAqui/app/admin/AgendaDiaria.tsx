import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl, SafeAreaView, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { api } from '../../services/api';
import {
  useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTema } from '../../contexts/ThemeContext';
import Popup from '../../components/Popup';
 
interface AgendamentoBackend {
  id: number;
  servico: { nome: string };
  cliente: { nome: string };
  modeloCarro: string;
  dataAgendamento: string;
  horario: string;
  status: string;
}
 
interface PopupState {
  visivel: boolean;
  tipo: 'sucesso' | 'erro' | 'aviso' | 'confirmacao' | 'info';
  titulo: string;
  mensagem: string;
  onConfirmar?: () => void;
}
 
export default function AgendaDiaria() {
  const router = useRouter();
  const { tema, alternarTema, cores } = useTema();
  const [agendamentos, setAgendamentos] = useState<AgendamentoBackend[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [dataAtual, setDataAtual] = useState('');
 
  const [popup, setPopup] = useState<PopupState>({
    visivel: false, tipo: 'info', titulo: '', mensagem: '',
  });
 
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold });
 
  const fecharPopup = () => setPopup(p => ({ ...p, visivel: false }));
 
  const mostrarPopup = (
    tipo: PopupState['tipo'],
    titulo: string,
    mensagem: string,
    onConfirmar?: () => void,
  ) => setPopup({ visivel: true, tipo, titulo, mensagem, onConfirmar });
 
  const obterDataAtual = () => {
    const hoje = new Date();
    const offset = hoje.getTimezoneOffset();
    return new Date(hoje.getTime() - offset * 60000).toISOString().split('T')[0];
  };
 
  useEffect(() => { setDataAtual(obterDataAtual()); }, []);
 
  const carregarAgendamentos = useCallback(async () => {
    try {
      setCarregando(true);
      const data = dataAtual || obterDataAtual();
      const dados = await api.getAgendamentosPorData(data);
      setAgendamentos(dados);
    } catch {
      mostrarPopup('erro', 'Erro ao carregar', 'Não foi possível carregar os agendamentos do dia. Verifique sua conexão e tente novamente.');
    } finally {
      setCarregando(false);
    }
  }, [dataAtual]);
 
  useEffect(() => { if (dataAtual) carregarAgendamentos(); }, [dataAtual]);
 
  const confirmarLogout = () => {
    mostrarPopup(
      'confirmacao',
      'Sair da conta',
      'Deseja realmente sair?',
      async () => {
        fecharPopup();
        await AsyncStorage.removeItem('@usuario_data');
        router.replace('/login');
      },
    );
  };
 
  const statusConfig: Record<string, { label: string; cor: string; bg: string }> = {
    agendado:   { label: 'Agendado',   cor: '#166534', bg: '#DCFCE7' },
    confirmado: { label: 'Confirmado', cor: '#1E40AF', bg: '#DBEAFE' },
    concluido:  { label: 'Concluído',  cor: '#6B21A8', bg: '#F3E8FF' },
    cancelado:  { label: 'Cancelado',  cor: '#991B1B', bg: '#FEE2E2' },
  };
 
  const formatarDataTitulo = (d: string) => {
    const data = new Date(d + 'T12:00:00');
    return data.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  };
 
  if (!fontsLoaded) return null;
 
  return (
    <SafeAreaView style={[estilos.container, { backgroundColor: cores.fundo }]}>
      {/* Header */}
      <View style={[estilos.header, { backgroundColor: cores.fundoHeader, borderBottomColor: cores.borda }]}>
        <TouchableOpacity style={[estilos.botaoIcone, { backgroundColor: cores.borda }]} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={cores.textoPrimario} />
        </TouchableOpacity>
        <Image source={require('../../assets/images/logoedcarpng.png')} style={estilos.logo} resizeMode="contain" />
        <TouchableOpacity style={[estilos.botaoIcone, { backgroundColor: cores.borda }]} onPress={alternarTema}>
          <Ionicons name={tema === 'escuro' ? 'sunny-outline' : 'moon-outline'} size={20} color={cores.textoPrimario} />
        </TouchableOpacity>
      </View>
 
      {/* Título */}
      <View style={estilos.cabecalho}>
        <Text style={[estilos.titulo, { color: cores.textoPrimario }]}>Agenda do Dia</Text>
        <Text style={[estilos.subtitulo, { color: cores.textoSecundario }]}>
          {dataAtual ? formatarDataTitulo(dataAtual) : 'Carregando...'}
        </Text>
      </View>
 
      {carregando ? (
        <View style={estilos.centralizado}>
          <ActivityIndicator size="large" color={cores.botaoPrimario} />
          <Text style={[estilos.textoCarregando, { color: cores.textoSecundario }]}>Carregando...</Text>
        </View>
      ) : agendamentos.length === 0 ? (
        <View style={estilos.centralizado}>
          <Ionicons name="calendar-outline" size={64} color={cores.textoTerceiro} />
          <Text style={[estilos.textoVazio, { color: cores.textoTerceiro }]}>Nenhum agendamento para hoje</Text>
          <TouchableOpacity
            style={[estilos.botaoRecarregar, { borderColor: cores.botaoPrimario }]}
            onPress={carregarAgendamentos}
          >
            <Ionicons name="refresh-outline" size={16} color={cores.botaoPrimario} />
            <Text style={[estilos.botaoRecarregarTexto, { color: cores.botaoPrimario }]}>Recarregar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={estilos.lista}
          refreshControl={<RefreshControl refreshing={carregando} onRefresh={carregarAgendamentos} />}
          renderItem={({ item }) => {
            const cfg = statusConfig[item.status.toLowerCase()] ?? { label: item.status, cor: '#555', bg: '#F1F5F9' };
            return (
              <TouchableOpacity
                style={[estilos.card, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}
                onPress={() => router.push({
                  pathname: '/admin/GestaoAgendamentos',
                  params: {
                    agendamentoId: item.id.toString(),
                    servico: item.servico.nome,
                    data: item.dataAgendamento,
                    horario: item.horario,
                    cliente: item.cliente.nome,
                    modeloCarro: item.modeloCarro,
                    status: item.status,
                  },
                })}
                activeOpacity={0.85}
              >
                <View style={estilos.cardTopo}>
                  <Text style={[estilos.cardServico, { color: cores.textoPrimario }]}>{item.servico.nome}</Text>
                  <View style={[estilos.badge, { backgroundColor: cfg.bg }]}>
                    <Text style={[estilos.badgeTexto, { color: cfg.cor }]}>{cfg.label}</Text>
                  </View>
                </View>
                <View style={estilos.cardDetalhes}>
                  <View style={estilos.detalheItem}>
                    <Ionicons name="person-outline" size={13} color={cores.textoSecundario} />
                    <Text style={[estilos.detalheTexto, { color: cores.textoSecundario }]}>{item.cliente.nome}</Text>
                  </View>
                  <View style={estilos.detalheItem}>
                    <Ionicons name="time-outline" size={13} color={cores.textoSecundario} />
                    <Text style={[estilos.detalheTexto, { color: cores.textoSecundario }]}>{item.horario}</Text>
                  </View>
                  <View style={estilos.detalheItem}>
                    <Ionicons name="car-outline" size={13} color={cores.textoSecundario} />
                    <Text style={[estilos.detalheTexto, { color: cores.textoSecundario }]}>{item.modeloCarro}</Text>
                  </View>
                </View>
                <View style={[estilos.cardRodape, { borderTopColor: cores.borda }]}>
                  <Text style={[estilos.cardRodapeTexto, { color: cores.textoTerceiro }]}>Toque para gerenciar</Text>
                  <Ionicons name="chevron-forward" size={14} color={cores.textoTerceiro} />
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
 
      {/* Tab Bar */}
      <View style={[estilos.tabBar, { backgroundColor: cores.tabBar, borderTopColor: cores.borda }]}>
        <TouchableOpacity style={estilos.tabItem} onPress={() => router.back()}>
          <Ionicons name="home-outline" size={22} color={cores.iconeInativo} />
          <Text style={[estilos.tabLabel, { color: cores.iconeInativo }]}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.tabItem} onPress={() => {}}>
          <Ionicons name="calendar" size={22} color={cores.iconeAtivo} />
          <Text style={[estilos.tabLabel, { color: cores.iconeAtivo, fontFamily: 'Poppins_600SemiBold' }]}>Agenda</Text>
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
                { label: 'Confirmar', onPress: popup.onConfirmar ?? fecharPopup, tipo: 'primario' },
              ]
            : [{ label: 'OK', onPress: fecharPopup }]
        }
        onFechar={fecharPopup}
      />
    </SafeAreaView>
  );
}
 
const estilos = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1 },
  botaoIcone: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 40, height: 40 },
  cabecalho: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  titulo: { fontFamily: 'Poppins_700Bold', fontSize: 22, marginBottom: 2 },
  subtitulo: { fontFamily: 'Poppins_400Regular', fontSize: 13, textTransform: 'capitalize' },
  centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  textoCarregando: { fontFamily: 'Poppins_400Regular', fontSize: 14 },
  textoVazio: { fontFamily: 'Poppins_400Regular', fontSize: 15 },
  botaoRecarregar: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, marginTop: 8 },
  botaoRecarregarTexto: { fontFamily: 'Poppins_600SemiBold', fontSize: 13 },
  lista: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  card: { borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1 },
  cardTopo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  cardServico: { fontFamily: 'Poppins_600SemiBold', fontSize: 15, flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  badgeTexto: { fontFamily: 'Poppins_600SemiBold', fontSize: 11 },
  cardDetalhes: { gap: 6, marginBottom: 12 },
  detalheItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detalheTexto: { fontFamily: 'Poppins_400Regular', fontSize: 13 },
  cardRodape: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', borderTopWidth: 1, paddingTop: 10, gap: 4 },
  cardRodapeTexto: { fontFamily: 'Poppins_400Regular', fontSize: 12 },
  tabBar: { flexDirection: 'row', borderTopWidth: 1, paddingBottom: 24, paddingTop: 10, paddingHorizontal: 10 },
  tabItem: { flex: 1, alignItems: 'center', gap: 3 },
  tabLabel: { fontFamily: 'Poppins_400Regular', fontSize: 10 },
});