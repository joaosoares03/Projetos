import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList, Modal, StyleSheet, Text, TouchableOpacity,
  View, ActivityIndicator, RefreshControl, Image, SafeAreaView,
} from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useServicos } from '../hooks/useServicos';
import { useAuth } from '../hooks/useAuth';
import { useTema } from '../contexts/ThemeContext';
import Popup from '../components/Popup';
 
interface Servico {
  id: number; nome: string; preco: number;
  duracaoMin: number; descricao?: string;
  ativo: boolean; itensInclusos?: string[];
}
 
interface PopupState {
  visivel: boolean;
  tipo: 'sucesso' | 'erro' | 'aviso' | 'confirmacao' | 'info';
  titulo: string;
  mensagem: string;
  onConfirmar?: () => void;
}
 
export default function Servicos() {
  const router = useRouter();
  const { servicos, carregando, erro, recarregar } = useServicos();
  const { logout } = useAuth();
  const { tema, alternarTema, cores } = useTema();
  const [modalVisivel, setModalVisivel] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);
 
  const [popup, setPopup] = useState<PopupState>({
    visivel: false, tipo: 'info', titulo: '', mensagem: '',
  });
 
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold });
 
  useEffect(() => {
    if (erro) mostrarPopup('erro', 'Erro ao carregar', erro);
  }, [erro]);
 
  if (!fontsLoaded) return null;
 
  const fecharPopup = () => setPopup(p => ({ ...p, visivel: false }));
 
  const mostrarPopup = (
    tipo: PopupState['tipo'],
    titulo: string,
    mensagem: string,
    onConfirmar?: () => void,
  ) => setPopup({ visivel: true, tipo, titulo, mensagem, onConfirmar });
 
  const abrirModal = (servico: Servico) => { setServicoSelecionado(servico); setModalVisivel(true); };
  const fecharModal = () => { setModalVisivel(false); setServicoSelecionado(null); };
 
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
 
  const iconeServico = (nome: string) => {
    const n = nome.toLowerCase();
    if (n.includes('premium') || n.includes('star')) return 'star-outline';
    if (n.includes('deluxe')) return 'diamond-outline';
    if (n.includes('advanced')) return 'flash-outline';
    if (n.includes('economy')) return 'leaf-outline';
    return 'car-outline';
  };
 
  if (carregando && servicos.length === 0) {
    return (
      <View style={[estilos.centralizado, { flex: 1, backgroundColor: cores.fundo }]}>
        <ActivityIndicator size="large" color={cores.botaoPrimario} />
      </View>
    );
  }
 
  return (
    <SafeAreaView style={[estilos.container, { backgroundColor: cores.fundo }]}>
      <View style={[estilos.header, { backgroundColor: cores.fundoHeader, borderBottomColor: cores.borda }]}>
        <TouchableOpacity onPress={() => router.replace('/menu')} style={[estilos.botaoVoltar, { backgroundColor: cores.fundoVoltar }]}>
          <Ionicons name="arrow-back" size={20} color={cores.textoPrimario} />
        </TouchableOpacity>
        <Image source={require('../assets/images/logoedcarpng.png')} style={estilos.logo} resizeMode="contain" />
        <TouchableOpacity style={[estilos.botaoVoltar, { backgroundColor: cores.borda }]} onPress={alternarTema}>
          <Ionicons name={tema === 'escuro' ? 'sunny-outline' : 'moon-outline'} size={20} color={cores.textoPrimario} />
        </TouchableOpacity>
      </View>
 
      <Text style={[estilos.titulo, { color: cores.textoPrimario }]}>Nossos Serviços</Text>
      <Text style={[estilos.subtitulo, { color: cores.textoTerceiro }]}>Escolha o pacote ideal para seu carro</Text>
 
      <FlatList
        data={servicos.filter(s => s.ativo)}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={estilos.lista}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={carregando} onRefresh={recarregar} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[estilos.card, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}
            onPress={() => abrirModal(item)}
            activeOpacity={0.85}
          >
            <View style={[estilos.cardIconeContainer, { backgroundColor: cores.fundoIconeAcao1 }]}>
              <Ionicons name={iconeServico(item.nome) as any} size={22} color={cores.corIconeAcao1} />
            </View>
            <View style={estilos.cardInfo}>
              <Text style={[estilos.cardNome, { color: cores.textoPrimario }]}>{item.nome}</Text>
              {item.descricao ? <Text style={[estilos.cardDescricao, { color: cores.textoTerceiro }]} numberOfLines={2}>{item.descricao}</Text> : null}
              <View style={estilos.cardRodape}>
                <View style={estilos.cardDuracao}>
                  <Ionicons name="time-outline" size={12} color={cores.textoSecundario} />
                  <Text style={[estilos.cardDuracaoTexto, { color: cores.textoSecundario }]}>{item.duracaoMin} min</Text>
                </View>
              </View>
            </View>
            <View style={estilos.cardPrecoContainer}>
              <Text style={[estilos.cardPrecoLabel, { color: cores.textoTerceiro }]}>R$</Text>
              <Text style={[estilos.cardPreco, { color: cores.precoTexto }]}>{item.preco.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={estilos.centralizado}>
            <Ionicons name="car-outline" size={48} color={cores.textoTerceiro} />
            <Text style={[estilos.textoVazio, { color: cores.textoTerceiro }]}>Nenhum serviço disponível</Text>
          </View>
        }
      />
 
      {/* Tab Bar */}
      <View style={[estilos.tabBar, { backgroundColor: cores.tabBar, borderTopColor: cores.borda }]}>
        <TouchableOpacity style={estilos.tabItem} onPress={() => router.replace('/menu')}>
          <Ionicons name="home-outline" size={22} color={cores.iconeInativo} />
          <Text style={[estilos.tabLabel, { color: cores.iconeInativo }]}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.tabItem} onPress={() => {}}>
          <Ionicons name="car-sport" size={22} color={cores.iconeAtivo} />
          <Text style={[estilos.tabLabel, { color: cores.iconeAtivo, fontFamily: 'Poppins_600SemiBold' }]}>Serviços</Text>
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
 
      {/* Modal detalhe serviço */}
      <Modal visible={modalVisivel} transparent animationType="slide" onRequestClose={fecharModal}>
        <View style={estilos.modalFundo}>
          {servicoSelecionado && (
            <View style={[estilos.modalContainer, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}>
              <View style={[estilos.modalAlca, { backgroundColor: cores.borda }]} />
              <Text style={[estilos.modalNome, { color: cores.textoPrimario }]}>{servicoSelecionado.nome}</Text>
              {servicoSelecionado.descricao ? (
                <Text style={[estilos.modalDescricao, { color: cores.textoSecundario }]}>{servicoSelecionado.descricao}</Text>
              ) : null}
              <View style={[estilos.modalInfoFila, { backgroundColor: cores.fundoModalInfo, borderColor: cores.borda }]}>
                <View style={estilos.modalInfoItem}>
                  <Ionicons name="time-outline" size={18} color={cores.textoSecundario} />
                  <Text style={[estilos.modalInfoLabel, { color: cores.textoTerceiro }]}>Duração</Text>
                  <Text style={[estilos.modalInfoValor, { color: cores.textoPrimario }]}>{servicoSelecionado.duracaoMin} min</Text>
                </View>
                <View style={[estilos.modalDivisor, { backgroundColor: cores.borda }]} />
                <View style={estilos.modalInfoItem}>
                  <Ionicons name="cash-outline" size={18} color={cores.textoSecundario} />
                  <Text style={[estilos.modalInfoLabel, { color: cores.textoTerceiro }]}>Valor</Text>
                  <Text style={[estilos.modalInfoValor, { color: cores.textoPrimario }]}>R$ {servicoSelecionado.preco.toFixed(2)}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[estilos.modalBotaoAgendar, { backgroundColor: cores.botaoPrimario }]}
                onPress={() => {
                  router.push({
                    pathname: '/agendamento',
                    params: {
                      servico: servicoSelecionado.nome,
                      servicoId: servicoSelecionado.id.toString(),
                      preco: servicoSelecionado.preco.toString(),
                      duracao: servicoSelecionado.duracaoMin.toString(),
                    },
                  });
                  fecharModal();
                }}
              >
                <Text style={estilos.modalBotaoAgendarTexto}>Agendar este serviço</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[estilos.modalBotaoFechar, { backgroundColor: cores.botaoFechar, borderColor: cores.borda }]} onPress={fecharModal}>
                <Text style={[estilos.modalBotaoFecharTexto, { color: cores.botaoFecharTexto }]}>Fechar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
 
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
  centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1 },
  botaoVoltar: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 40, height: 40 },
  titulo: { fontFamily: 'Poppins_700Bold', fontSize: 22, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 2 },
  subtitulo: { fontFamily: 'Poppins_400Regular', fontSize: 13, paddingHorizontal: 20, marginBottom: 16 },
  lista: { paddingHorizontal: 20, paddingBottom: 16 },
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1 },
  cardIconeContainer: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  cardInfo: { flex: 1 },
  cardNome: { fontFamily: 'Poppins_600SemiBold', fontSize: 15, marginBottom: 2 },
  cardDescricao: { fontFamily: 'Poppins_400Regular', fontSize: 12, lineHeight: 17, marginBottom: 4 },
  cardRodape: { flexDirection: 'row' },
  cardDuracao: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  cardDuracaoTexto: { fontFamily: 'Poppins_400Regular', fontSize: 12 },
  cardPrecoContainer: { alignItems: 'flex-end' },
  cardPrecoLabel: { fontFamily: 'Poppins_400Regular', fontSize: 11 },
  cardPreco: { fontFamily: 'Poppins_700Bold', fontSize: 17 },
  textoVazio: { fontFamily: 'Poppins_400Regular', fontSize: 15, marginTop: 12 },
  tabBar: { flexDirection: 'row', borderTopWidth: 1, paddingBottom: 24, paddingTop: 10, paddingHorizontal: 10 },
  tabItem: { flex: 1, alignItems: 'center', gap: 3 },
  tabLabel: { fontFamily: 'Poppins_400Regular', fontSize: 10 },
  modalFundo: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContainer: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, borderTopWidth: 1 },
  modalAlca: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalNome: { fontFamily: 'Poppins_700Bold', fontSize: 20, marginBottom: 10 },
  modalDescricao: { fontFamily: 'Poppins_400Regular', fontSize: 14, lineHeight: 21, marginBottom: 20 },
  modalInfoFila: { flexDirection: 'row', borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1 },
  modalInfoItem: { flex: 1, alignItems: 'center', gap: 4 },
  modalDivisor: { width: 1, marginVertical: 4 },
  modalInfoLabel: { fontFamily: 'Poppins_400Regular', fontSize: 11 },
  modalInfoValor: { fontFamily: 'Poppins_700Bold', fontSize: 15 },
  modalBotaoAgendar: { paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  modalBotaoAgendarTexto: { fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: '#FFFFFF' },
  modalBotaoFechar: { paddingVertical: 13, borderRadius: 12, alignItems: 'center', borderWidth: 1 },
  modalBotaoFecharTexto: { fontFamily: 'Poppins_600SemiBold', fontSize: 14 },
});