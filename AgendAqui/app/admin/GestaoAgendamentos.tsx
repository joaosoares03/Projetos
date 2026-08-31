import {
    Poppins_400Regular, Poppins_500Medium,
    Poppins_600SemiBold, Poppins_700Bold,
    useFonts,
} from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator, FlatList,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import Popup from '../../components/Popup.tsx';
import { useTema } from '../../contexts/ThemeContext';
import { Agendamento, api } from '../../services/api';

type FiltroTempo  = 'todos' | 'hoje' | 'semana' | 'mes' | 'ano' | 'passados' | 'futuros';
type FiltroStatus = 'todos' | 'agendado' | 'confirmado' | 'concluido' | 'cancelado';

const statusConfig: Record<string, { label: string; cor: string; bg: string }> = {
  agendado:   { label: 'Agendado',   cor: '#1E40AF', bg: '#DBEAFE' },
  confirmado: { label: 'Confirmado', cor: '#166534', bg: '#DCFCE7' },
  concluido:  { label: 'Concluído',  cor: '#6B21A8', bg: '#F3E8FF' },
  cancelado:  { label: 'Cancelado',  cor: '#991B1B', bg: '#FEE2E2' },
};

interface PopupState {
  visivel: boolean;
  tipo: 'sucesso' | 'erro' | 'aviso' | 'confirmacao' | 'info';
  titulo: string;
  mensagem: string;
  onConfirmar?: () => void;
}

export default function GestaoAgendamentos() {
  const router = useRouter();
  const { tema, alternarTema, cores } = useTema();
  const { width: screenWidth } = useWindowDimensions();
  const isWide = screenWidth > 700;

  const [todos, setTodos] = useState<Agendamento[]>([]);
  const [filtrados, setFiltrados] = useState<Agendamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizandoId, setAtualizandoId] = useState<number | null>(null);
  const [busca, setBusca] = useState('');
  const [filtroTempo, setFiltroTempo] = useState<FiltroTempo>('todos');
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('todos');
  const [modalAgendamento, setModalAgendamento] = useState<Agendamento | null>(null);
  const [popup, setPopup] = useState<PopupState>({
    visivel: false, tipo: 'info', titulo: '', mensagem: '',
  });

  const [fontsLoaded] = useFonts({
    Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold,
  });

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const fecharPopup = () => setPopup(p => ({ ...p, visivel: false }));

  const mostrarPopup = (
    tipo: PopupState['tipo'],
    titulo: string,
    mensagem: string,
    onConfirmar?: () => void,
  ) => setPopup({ visivel: true, tipo, titulo, mensagem, onConfirmar });

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      const dados = await api.getAllAgendamentos();
      dados.sort((a, b) =>
        new Date(b.dataAgendamento + 'T' + b.horario).getTime() -
        new Date(a.dataAgendamento + 'T' + a.horario).getTime()
      );
      setTodos(dados);
    } catch {
      mostrarPopup('erro', 'Erro ao carregar', 'Não foi possível carregar os agendamentos. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, []);

  useEffect(() => {
    let resultado = [...todos];
    const agora = new Date();
    agora.setHours(0, 0, 0, 0);

    if (filtroTempo !== 'todos') {
      resultado = resultado.filter(ag => {
        const dataAg = new Date(ag.dataAgendamento + 'T12:00:00');
        dataAg.setHours(0, 0, 0, 0);
        if (filtroTempo === 'hoje')     return dataAg.getTime() === agora.getTime();
        if (filtroTempo === 'passados') return dataAg.getTime() < agora.getTime();
        if (filtroTempo === 'futuros')  return dataAg.getTime() > agora.getTime();
        if (filtroTempo === 'semana') {
          const inicio = new Date(agora);
          inicio.setDate(agora.getDate() - agora.getDay());
          const fim = new Date(inicio);
          fim.setDate(inicio.getDate() + 6);
          return dataAg >= inicio && dataAg <= fim;
        }
        if (filtroTempo === 'mes') {
          return dataAg.getMonth() === agora.getMonth() &&
                 dataAg.getFullYear() === agora.getFullYear();
        }
        if (filtroTempo === 'ano') {
          return dataAg.getFullYear() === agora.getFullYear();
        }
        return true;
      });
    }

    if (filtroStatus !== 'todos') {
      resultado = resultado.filter(ag => ag.status?.toLowerCase() === filtroStatus);
    }

    if (busca.trim()) {
      const termo = busca.toLowerCase();
      resultado = resultado.filter(ag =>
        ag.cliente?.nome?.toLowerCase().includes(termo) ||
        ag.servico?.nome?.toLowerCase().includes(termo) ||
        ag.modeloCarro?.toLowerCase().includes(termo)
      );
    }

    setFiltrados(resultado);
  }, [todos, filtroTempo, filtroStatus, busca]);

  const confirmarAtualizarStatus = (ag: Agendamento, novoStatus: string) => {
    const labels: Record<string, string> = {
      confirmado: 'confirmar',
      concluido:  'marcar como concluído',
      cancelado:  'cancelar',
    };
    mostrarPopup(
      'confirmacao',
      'Confirmar ação',
      `Deseja realmente ${labels[novoStatus] ?? 'alterar'} o agendamento de ${ag.cliente?.nome}?`,
      () => executarAtualizarStatus(ag, novoStatus),
    );
  };

  const executarAtualizarStatus = async (ag: Agendamento, novoStatus: string) => {
    fecharPopup();
    setModalAgendamento(null);
    try {
      setAtualizandoId(ag.id);
      await api.atualizarStatusAgendamento(ag.id, novoStatus);
      await carregar();

      const labels: Record<string, string> = {
        confirmado: 'Agendamento confirmado!',
        concluido:  'Serviço concluído!',
        cancelado:  'Agendamento cancelado',
      };
      mostrarPopup(
        novoStatus === 'cancelado' ? 'aviso' : 'sucesso',
        labels[novoStatus] ?? 'Status atualizado',
        `O status do agendamento #${ag.id} foi atualizado com sucesso.`,
      );
    } catch {
      mostrarPopup('erro', 'Erro ao atualizar', 'Não foi possível atualizar o status. Tente novamente.');
    } finally {
      setAtualizandoId(null);
    }
  };

  const handleLogout = () => {
    mostrarPopup(
      'confirmacao',
      'Sair do sistema',
      'Deseja realmente sair? Você precisará fazer login novamente.',
      () => {
        fecharPopup();
        if (typeof window !== 'undefined') {
          localStorage.removeItem('@usuario_data');
        } else {
          AsyncStorage.removeItem('@usuario_data');
        }
        router.replace('/login');
      },
    );
  };

  const formatarData = (d: string) =>
    new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const formatarDiaSemana = (d: string) =>
    new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short' });

  const isPast = (d: string) => {
    const dataAg = new Date(d + 'T12:00:00');
    dataAg.setHours(0, 0, 0, 0);
    return dataAg.getTime() < hoje.getTime();
  };

  if (!fontsLoaded) return null;

  const FiltroChip = ({ label, ativo, onPress }: { label: string; ativo: boolean; onPress: () => void }) => (
    <TouchableOpacity
      style={[
        estilos.chip,
        { borderColor: ativo ? cores.botaoPrimario : cores.borda, marginRight: 8 },
        ativo && { backgroundColor: cores.botaoPrimario },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[estilos.chipText, { color: ativo ? '#FFF' : cores.textoSecundario }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

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
        <View style={{ flex: 1 }}>
          <Text style={[estilos.titulo, { color: cores.textoPrimario }]}>Gestão de Agendamentos</Text>
          <Text style={[estilos.subtitulo, { color: cores.textoSecundario }]}>
            {filtrados.length} resultado{filtrados.length !== 1 ? 's' : ''} encontrado{filtrados.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity style={[estilos.botaoAtualizar, { backgroundColor: cores.borda }]} onPress={carregar}>
          <Ionicons name="refresh" size={18} color={cores.textoPrimario} />
        </TouchableOpacity>
      </View>

      {/* Busca */}
      <View style={[estilos.buscaContainer, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}>
        <Ionicons name="search-outline" size={18} color={cores.textoSecundario} />
        <TextInput
          style={[estilos.buscaInput, { color: cores.textoPrimario }]}
          placeholder="Buscar por cliente, serviço ou veículo..."
          placeholderTextColor={cores.textoTerceiro}
          value={busca}
          onChangeText={setBusca}
        />
        {busca.length > 0 && (
          <TouchableOpacity onPress={() => setBusca('')}>
            <Ionicons name="close-circle" size={18} color={cores.textoSecundario} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros de tempo */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 44, flexShrink: 0 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 6, flexDirection: 'row', alignItems: 'center' }}
      >
        {([
          { key: 'todos',    label: 'Todos'       },
          { key: 'hoje',     label: 'Hoje'        },
          { key: 'semana',   label: 'Esta semana' },
          { key: 'mes',      label: 'Este mês'    },
          { key: 'ano',      label: 'Este ano'    },
          { key: 'futuros',  label: 'Futuros'     },
          { key: 'passados', label: 'Passados'    },
        ] as { key: FiltroTempo; label: string }[]).map(f => (
          <FiltroChip key={f.key} label={f.label} ativo={filtroTempo === f.key} onPress={() => setFiltroTempo(f.key)} />
        ))}
      </ScrollView>

      {/* Filtros de status */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 44, flexShrink: 0, marginBottom: 6 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 6, flexDirection: 'row', alignItems: 'center' }}
      >
        {([
          { key: 'todos',      label: 'Todos status' },
          { key: 'agendado',   label: 'Agendado'     },
          { key: 'confirmado', label: 'Confirmado'   },
          { key: 'concluido',  label: 'Concluído'    },
          { key: 'cancelado',  label: 'Cancelado'    },
        ] as { key: FiltroStatus; label: string }[]).map(f => (
          <FiltroChip key={f.key} label={f.label} ativo={filtroStatus === f.key} onPress={() => setFiltroStatus(f.key)} />
        ))}
      </ScrollView>

      {/* Lista */}
      {carregando ? (
        <View style={estilos.centralizado}>
          <ActivityIndicator size="large" color={cores.botaoPrimario} />
          <Text style={[estilos.textoCarregando, { color: cores.textoSecundario }]}>Carregando agendamentos...</Text>
        </View>
      ) : filtrados.length === 0 ? (
        <View style={estilos.centralizado}>
          <Ionicons name="calendar-outline" size={64} color={cores.textoTerceiro} />
          <Text style={[estilos.textoVazio, { color: cores.textoTerceiro }]}>Nenhum agendamento encontrado</Text>
          <TouchableOpacity onPress={() => { setFiltroTempo('todos'); setFiltroStatus('todos'); setBusca(''); }}>
            <Text style={[estilos.limparFiltros, { color: cores.botaoPrimario }]}>Limpar filtros</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtrados}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={[
            estilos.lista,
            isWide && { paddingHorizontal: 32 },
          ]}
          showsVerticalScrollIndicator={false}
          numColumns={isWide ? 2 : 1}
          key={isWide ? 'wide' : 'narrow'}
          columnWrapperStyle={isWide ? { gap: 12 } : undefined}
          renderItem={({ item }) => {
            const cfg = statusConfig[item.status?.toLowerCase()] ?? { label: item.status, cor: '#555', bg: '#F1F5F9' };
            const passado = isPast(item.dataAgendamento);
            return (
              <TouchableOpacity
                style={[
                  estilos.card,
                  { backgroundColor: cores.fundoCard, borderColor: cores.borda },
                  passado && { opacity: 0.75 },
                  isWide && { flex: 1 },
                ]}
                onPress={() => setModalAgendamento(item)}
                activeOpacity={0.85}
              >
                <View style={estilos.cardTopo}>
                  <View style={estilos.cardDataContainer}>
                    <Text style={[estilos.cardDiaSemana, { color: cores.textoSecundario }]}>
                      {formatarDiaSemana(item.dataAgendamento)}
                    </Text>
                    <Text style={[estilos.cardData, { color: passado ? cores.textoTerceiro : cores.textoPrimario }]}>
                      {formatarData(item.dataAgendamento)} · {item.horario}
                    </Text>
                  </View>
                  <View style={estilos.cardTopoDireita}>
                    {passado && (
                      <View style={[estilos.tagPassado, { backgroundColor: cores.borda }]}>
                        <Text style={[estilos.tagPassadoTexto, { color: cores.textoTerceiro }]}>Passado</Text>
                      </View>
                    )}
                    <View style={[estilos.badge, { backgroundColor: cfg.bg }]}>
                      <Text style={[estilos.badgeTexto, { color: cfg.cor }]}>{cfg.label}</Text>
                    </View>
                  </View>
                </View>

                <Text style={[estilos.cardServico, { color: cores.textoPrimario }]}>{item.servico?.nome}</Text>

                <View style={estilos.cardDetalhes}>
                  <View style={estilos.detalheItem}>
                    <Ionicons name="person-outline" size={13} color={cores.textoSecundario} />
                    <Text style={[estilos.detalheTexto, { color: cores.textoSecundario }]}>{item.cliente?.nome}</Text>
                  </View>
                  <View style={estilos.detalheItem}>
                    <Ionicons name="car-outline" size={13} color={cores.textoSecundario} />
                    <Text style={[estilos.detalheTexto, { color: cores.textoSecundario }]}>{item.modeloCarro}</Text>
                  </View>
                  <View style={estilos.detalheItem}>
                    <Ionicons name="cash-outline" size={13} color={cores.textoSecundario} />
                    <Text style={[estilos.detalheTexto, { color: cores.textoSecundario }]}>
                      R$ {item.servico?.preco?.toFixed(2)}
                    </Text>
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
        <TouchableOpacity style={estilos.tabItem} onPress={() => router.replace('/admin/MenuAdmin')}>
          <Ionicons name="home-outline" size={22} color={cores.iconeInativo} />
          <Text style={[estilos.tabLabel, { color: cores.iconeInativo }]}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.tabItem} onPress={() => router.push('/admin/AgendaDiaria')}>
          <Ionicons name="calendar-outline" size={22} color={cores.iconeInativo} />
          <Text style={[estilos.tabLabel, { color: cores.iconeInativo }]}>Agenda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.tabItem} onPress={() => {}}>
          <Ionicons name="list" size={22} color={cores.iconeAtivo} />
          <Text style={[estilos.tabLabel, { color: cores.iconeAtivo, fontFamily: 'Poppins_600SemiBold' }]}>Gestão</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.tabItem} onPress={handleLogout} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="log-out-outline" size={22} color={cores.iconeInativo} />
          <Text style={[estilos.tabLabel, { color: cores.iconeInativo }]}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de detalhe */}
      <Modal
        visible={!!modalAgendamento}
        transparent
        animationType="slide"
        onRequestClose={() => setModalAgendamento(null)}
      >
        <View style={estilos.modalFundo}>
          {modalAgendamento && (() => {
            const cfg = statusConfig[modalAgendamento.status?.toLowerCase()] ?? { label: modalAgendamento.status, cor: '#555', bg: '#F1F5F9' };
            return (
              <View style={[
                estilos.modalContainer,
                { backgroundColor: cores.fundoCard, borderColor: cores.borda },
                isWide && { maxWidth: 540, alignSelf: 'center', borderRadius: 20, marginHorizontal: 'auto' },
              ]}>
                <View style={[estilos.modalAlca, { backgroundColor: cores.borda }]} />

                <View style={estilos.modalHeaderRow}>
                  <Text style={[estilos.modalTitulo, { color: cores.textoPrimario }]}>
                    Agendamento #{modalAgendamento.id}
                  </Text>
                  <View style={[estilos.badge, { backgroundColor: cfg.bg }]}>
                    <Text style={[estilos.badgeTexto, { color: cfg.cor }]}>{cfg.label}</Text>
                  </View>
                </View>

                <View style={[estilos.modalInfoBox, { backgroundColor: cores.fundo, borderColor: cores.borda }]}>
                  {[
                    { icone: 'storefront-outline', valor: modalAgendamento.servico?.nome },
                    { icone: 'person-outline',     valor: modalAgendamento.cliente?.nome },
                    { icone: 'call-outline',        valor: modalAgendamento.cliente?.telefone || 'Não informado' },
                    { icone: 'calendar-outline',    valor: formatarData(modalAgendamento.dataAgendamento) },
                    { icone: 'time-outline',        valor: modalAgendamento.horario },
                    { icone: 'car-outline',         valor: modalAgendamento.modeloCarro },
                    { icone: 'cash-outline',        valor: `R$ ${modalAgendamento.servico?.preco?.toFixed(2)}` },
                  ].map((linha, i) => (
                    <View
                      key={i}
                      style={[
                        estilos.modalLinha,
                        i > 0 && { borderTopWidth: 1, borderTopColor: cores.borda },
                      ]}
                    >
                      <Ionicons name={linha.icone as any} size={16} color={cores.textoSecundario} />
                      <Text style={[estilos.modalLinhaTexto, { color: cores.textoPrimario }]}>{linha.valor}</Text>
                    </View>
                  ))}
                </View>

                <Text style={[estilos.modalSecaoTitulo, { color: cores.textoSecundario }]}>Alterar status</Text>

                <View style={estilos.modalAcoesFila}>
                  {[
                    { label: 'Confirmar', status: 'confirmado', cor: cores.botaoPrimario },
                    { label: 'Concluir',  status: 'concluido',  cor: '#16A34A'           },
                    { label: 'Cancelar',  status: 'cancelado',  cor: '#DC2626'           },
                  ].map((acao, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[
                        estilos.modalBotaoAcao,
                        { backgroundColor: acao.cor },
                        (atualizandoId === modalAgendamento.id ||
                          modalAgendamento.status?.toLowerCase() === acao.status) && { opacity: 0.45 },
                      ]}
                      onPress={() => confirmarAtualizarStatus(modalAgendamento, acao.status)}
                      disabled={
                        atualizandoId === modalAgendamento.id ||
                        modalAgendamento.status?.toLowerCase() === acao.status
                      }
                      activeOpacity={0.8}
                    >
                      {atualizandoId === modalAgendamento.id ? (
                        <ActivityIndicator color="#FFF" size="small" />
                      ) : (
                        <Text style={estilos.modalBotaoTexto}>{acao.label}</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={[estilos.modalBotaoFechar, { backgroundColor: cores.borda }]}
                  onPress={() => setModalAgendamento(null)}
                >
                  <Text style={[estilos.modalBotaoFecharTexto, { color: cores.textoPrimario }]}>Fechar</Text>
                </TouchableOpacity>
              </View>
            );
          })()}
        </View>
      </Modal>

      {/* Popup global */}
      <Popup
        visivel={popup.visivel}
        tipo={popup.tipo}
        titulo={popup.titulo}
        mensagem={popup.mensagem}
        botoes={
          popup.tipo === 'confirmacao'
            ? [
                { label: 'Cancelar',  onPress: fecharPopup,           tipo: 'secundario' },
                { label: 'Confirmar', onPress: popup.onConfirmar ?? fecharPopup, tipo: 'primario'   },
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
  centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1,
  },
  botaoIcone: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 40, height: 40 },
  cabecalho: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
  },
  titulo: { fontFamily: 'Poppins_700Bold', fontSize: 20 },
  subtitulo: { fontFamily: 'Poppins_400Regular', fontSize: 12, marginTop: 2 },
  botaoAtualizar: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  buscaContainer: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 8,
    borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, height: 46, gap: 8,
  },
  buscaInput: { flex: 1, fontFamily: 'Poppins_400Regular', fontSize: 14, height: '100%' },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  chipText: { fontFamily: 'Poppins_500Medium', fontSize: 12 },
  lista: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  card: { borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1 },
  cardTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  cardDataContainer: { flex: 1 },
  cardDiaSemana: { fontFamily: 'Poppins_400Regular', fontSize: 11, textTransform: 'capitalize', marginBottom: 1 },
  cardData: { fontFamily: 'Poppins_600SemiBold', fontSize: 13 },
  cardTopoDireita: { flexDirection: 'row', alignItems: 'center', flexShrink: 0 },
  tagPassado: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginRight: 6 },
  tagPassadoTexto: { fontFamily: 'Poppins_400Regular', fontSize: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  badgeTexto: { fontFamily: 'Poppins_600SemiBold', fontSize: 11 },
  cardServico: { fontFamily: 'Poppins_700Bold', fontSize: 15, marginBottom: 8 },
  cardDetalhes: { gap: 4, marginBottom: 10 },
  detalheItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detalheTexto: { fontFamily: 'Poppins_400Regular', fontSize: 12 },
  cardRodape: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',
    borderTopWidth: 1, paddingTop: 8, gap: 4,
  },
  cardRodapeTexto: { fontFamily: 'Poppins_400Regular', fontSize: 11 },
  textoCarregando: { fontFamily: 'Poppins_400Regular', fontSize: 14 },
  textoVazio: { fontFamily: 'Poppins_400Regular', fontSize: 15 },
  limparFiltros: { fontFamily: 'Poppins_600SemiBold', fontSize: 14, marginTop: 4 },
  tabBar: {
    flexDirection: 'row', borderTopWidth: 1,
    paddingBottom: 24, paddingTop: 10, paddingHorizontal: 10,
  },
  tabItem: { flex: 1, alignItems: 'center', gap: 3 },
  tabLabel: { fontFamily: 'Poppins_400Regular', fontSize: 10 },
  modalFundo: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.55)' },
  modalContainer: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 36, borderTopWidth: 1, width: '100%',
  },
  modalAlca: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitulo: { fontFamily: 'Poppins_700Bold', fontSize: 18 },
  modalInfoBox: { borderRadius: 12, borderWidth: 1, marginBottom: 20, overflow: 'hidden' },
  modalLinha: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 14 },
  modalLinhaTexto: { fontFamily: 'Poppins_400Regular', fontSize: 14, flex: 1 },
  modalSecaoTitulo: {
    fontFamily: 'Poppins_600SemiBold', fontSize: 12,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10,
  },
  modalAcoesFila: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  modalBotaoAcao: { flex: 1, paddingVertical: 13, borderRadius: 12, alignItems: 'center' },
  modalBotaoTexto: { fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: '#FFF' },
  modalBotaoFechar: { paddingVertical: 13, borderRadius: 12, alignItems: 'center' },
  modalBotaoFecharTexto: { fontFamily: 'Poppins_600SemiBold', fontSize: 14 },
});