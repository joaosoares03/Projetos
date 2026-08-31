import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { getMarcas, getModelosPorMarca } from '../app/carros';
import { useTema } from '../contexts/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

// Configurando o calendário para português
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan.', 'Fev.', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul.', 'Ago', 'Set.', 'Out.', 'Nov.', 'Dez.'],
  dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt-br';

type ModalCarroTipo = 'marca' | 'modelo' | null;

export default function Agendamento() {
  const { servico, servicoId, preco, duracao } = useLocalSearchParams<{
    servico: string;
    servicoId: string;
    preco: string;
    duracao: string;
  }>();

  const router = useRouter();
  const { getUsuarioId } = useAuth();
  const { tema, cores } = useTema();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [dataSelecionada, setDataSelecionada] = useState<string>('');
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);

  // Veículo
  const [marcaSelecionada, setMarcaSelecionada] = useState<string>('');
  const [modeloSelecionado, setModeloSelecionado] = useState<string>('');
  const [placa, setPlaca] = useState<string>('');
  const [modalCarroTipo, setModalCarroTipo] = useState<ModalCarroTipo>(null);

  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  // Modal de sucesso
  const [modalSucessoVisivel, setModalSucessoVisivel] = useState(false);

  const isDark = tema === 'escuro';

  const hoje = new Date();
  const offset = hoje.getTimezoneOffset();
  const hojeString = new Date(hoje.getTime() - offset * 60000).toISOString().split('T')[0];

  const marcas = getMarcas();
  const modelos = marcaSelecionada ? getModelosPorMarca(marcaSelecionada) : [];

  const modeloCompleto = marcaSelecionada && modeloSelecionado
    ? `${marcaSelecionada} ${modeloSelecionado}${placa.trim() ? ' - ' + placa.trim().toUpperCase() : ''}`
    : '';

  useEffect(() => {
    if (dataSelecionada) {
      carregarHorariosDisponiveis();
    }
  }, [dataSelecionada]);

  const carregarHorariosDisponiveis = async () => {
    try {
      setCarregandoHorarios(true);
      setHorarioSelecionado(null);
      const horarios = await api.getHorariosDisponiveis(dataSelecionada);
      setHorariosDisponiveis(horarios);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os horários disponíveis');
    } finally {
      setCarregandoHorarios(false);
    }
  };

  const handleDayPress = (day: { dateString: string }) => {
    if (day.dateString < hojeString) return;
    setDataSelecionada(day.dateString);
  };

  const confirmarAgendamento = async () => {
    if (!dataSelecionada || !horarioSelecionado) {
      Alert.alert('Atenção', 'Por favor, selecione uma data e horário.');
      return;
    }
    if (!marcaSelecionada || !modeloSelecionado) {
      Alert.alert('Atenção', 'Selecione a marca e o modelo do veículo.');
      return;
    }

    const clienteId = getUsuarioId();
    if (!clienteId) {
      Alert.alert('Erro', 'Sessão expirada. Faça login novamente.');
      router.replace('/login');
      return;
    }

    try {
      setConfirmando(true);
      await api.criarAgendamento({
        clienteId,
        servicoId: parseInt(servicoId),
        modeloCarro: modeloCompleto,
        dataAgendamento: dataSelecionada,
        horario: horarioSelecionado,
      });
      setModalSucessoVisivel(true);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao confirmar agendamento. Verifique sua conexão.');
    } finally {
      setConfirmando(false);
    }
  };

  const irParaMenu = () => {
    setModalSucessoVisivel(false);
    router.replace('/menu');
  };

  const veiculo = marcaSelecionada && modeloSelecionado;

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={[estilos.safeArea, { backgroundColor: cores.fundo }]}>
      {/* Header */}
      <View style={[estilos.header, { backgroundColor: cores.fundoHeader, borderBottomColor: cores.borda }]}>
        <TouchableOpacity style={[estilos.botaoVoltar, { backgroundColor: cores.fundoVoltar }]} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={cores.textoPrimario} />
        </TouchableOpacity>
        <Text style={[estilos.headerTitle, { color: cores.textoPrimario }]}>Novo Agendamento</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={estilos.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Card Resumo do Serviço */}
          <View style={[estilos.servicoCard, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}>
            <View style={[estilos.servicoIcone, { backgroundColor: cores.fundoIconeAcao1 }]}>
              <Ionicons name="car-sport" size={28} color={cores.corIconeAcao1} />
            </View>
            <View style={estilos.servicoInfo}>
              <Text style={[estilos.servicoNome, { color: cores.textoPrimario }]}>{servico}</Text>
              <View style={estilos.servicoTags}>
                <View style={[estilos.tag, { backgroundColor: isDark ? '#1E3A8A' : '#DBEAFE' }]}>
                  <Ionicons name="cash-outline" size={14} color={isDark ? '#93C5FD' : '#1D4ED8'} />
                  <Text style={[estilos.tagText, { color: isDark ? '#93C5FD' : '#1D4ED8' }]}>R$ {preco}</Text>
                </View>
                <View style={[estilos.tag, { backgroundColor: isDark ? '#14532D' : '#DCFCE7' }]}>
                  <Ionicons name="time-outline" size={14} color={isDark ? '#86EFAC' : '#15803D'} />
                  <Text style={[estilos.tagText, { color: isDark ? '#86EFAC' : '#15803D' }]}>{duracao} min</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Passo 1 – Data */}
          <View style={estilos.passoContainer}>
            <View style={[estilos.passoBolinha, { backgroundColor: cores.botaoPrimario }]}>
              <Text style={estilos.passoNumero}>1</Text>
            </View>
            <Text style={[estilos.passoTitulo, { color: cores.textoPrimario }]}>Escolha a data</Text>
          </View>

          <View style={[estilos.calendarioContainer, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={dataSelecionada ? { [dataSelecionada]: { selected: true, selectedColor: cores.botaoPrimario } } : {}}
              minDate={hojeString}
              theme={{
                calendarBackground: cores.fundoCard,
                textSectionTitleColor: cores.textoSecundario,
                selectedDayBackgroundColor: cores.botaoPrimario,
                selectedDayTextColor: '#ffffff',
                todayTextColor: cores.botaoPrimario,
                dayTextColor: cores.textoPrimario,
                textDisabledColor: cores.borda,
                dotColor: cores.botaoPrimario,
                monthTextColor: cores.textoPrimario,
                textMonthFontFamily: 'Poppins_600SemiBold',
                textDayFontFamily: 'Poppins_400Regular',
                textDayHeaderFontFamily: 'Poppins_500Medium',
                arrowColor: cores.botaoPrimario,
              }}
            />
          </View>

          {/* Passo 2 – Horário */}
          <View style={[estilos.passoContainer, { opacity: dataSelecionada ? 1 : 0.5 }]}>
            <View style={[estilos.passoBolinha, { backgroundColor: dataSelecionada ? cores.botaoPrimario : cores.borda }]}>
              <Text style={[estilos.passoNumero, { color: dataSelecionada ? '#FFF' : cores.textoSecundario }]}>2</Text>
            </View>
            <Text style={[estilos.passoTitulo, { color: cores.textoPrimario }]}>Selecione o horário</Text>
          </View>

          {dataSelecionada ? (
            carregandoHorarios ? (
              <View style={estilos.loadingContainer}>
                <ActivityIndicator size="small" color={cores.botaoPrimario} />
                <Text style={[estilos.loadingText, { color: cores.textoSecundario }]}>Buscando horários...</Text>
              </View>
            ) : (
              <View style={estilos.horariosContainer}>
                {horariosDisponiveis.length > 0 ? (
                  horariosDisponiveis.map((item) => {
                    const sel = horarioSelecionado === item;
                    return (
                      <TouchableOpacity
                        key={item}
                        style={[estilos.horarioChip, { backgroundColor: sel ? cores.botaoPrimario : cores.fundo, borderColor: sel ? cores.botaoPrimario : cores.borda }]}
                        onPress={() => setHorarioSelecionado(item)}
                        activeOpacity={0.7}
                      >
                        <Text style={[estilos.horarioTexto, { color: sel ? '#FFF' : cores.textoPrimario }]}>{item}</Text>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View style={estilos.loadingContainer}>
                    <Ionicons name="calendar-clear-outline" size={32} color={cores.textoTerceiro} />
                    <Text style={[estilos.emptyText, { color: cores.textoTerceiro }]}>Nenhum horário disponível para esta data.</Text>
                  </View>
                )}
              </View>
            )
          ) : (
            <Text style={[estilos.helperText, { color: cores.textoTerceiro }]}>Selecione uma data no calendário primeiro.</Text>
          )}

          {/* Passo 3 – Veículo */}
          <View style={[estilos.passoContainer, { opacity: horarioSelecionado ? 1 : 0.5 }]}>
            <View style={[estilos.passoBolinha, { backgroundColor: horarioSelecionado ? cores.botaoPrimario : cores.borda }]}>
              <Text style={[estilos.passoNumero, { color: horarioSelecionado ? '#FFF' : cores.textoSecundario }]}>3</Text>
            </View>
            <Text style={[estilos.passoTitulo, { color: cores.textoPrimario }]}>Detalhes do veículo</Text>
          </View>

          <View style={[{ opacity: horarioSelecionado ? 1 : 0.5 }]}>
            {/* Selecionar Marca */}
            <TouchableOpacity
              style={[estilos.seletorCarro, { backgroundColor: cores.fundoCard, borderColor: marcaSelecionada ? cores.botaoPrimario : cores.borda }]}
              onPress={() => horarioSelecionado && setModalCarroTipo('marca')}
              activeOpacity={0.7}
            >
              <Ionicons name="car-outline" size={20} color={marcaSelecionada ? cores.botaoPrimario : cores.textoSecundario} style={{ marginRight: 10 }} />
              <Text style={[estilos.seletorTexto, { color: marcaSelecionada ? cores.textoPrimario : cores.textoTerceiro }]}>
                {marcaSelecionada || 'Selecionar marca'}
              </Text>
              <Ionicons name="chevron-down" size={18} color={cores.textoSecundario} />
            </TouchableOpacity>

            {/* Selecionar Modelo */}
            <TouchableOpacity
              style={[estilos.seletorCarro, { backgroundColor: cores.fundoCard, borderColor: modeloSelecionado ? cores.botaoPrimario : cores.borda, marginTop: 10 }]}
              onPress={() => marcaSelecionada && setModalCarroTipo('modelo')}
              activeOpacity={0.7}
            >
              <Ionicons name="list-outline" size={20} color={modeloSelecionado ? cores.botaoPrimario : cores.textoSecundario} style={{ marginRight: 10 }} />
              <Text style={[estilos.seletorTexto, { color: modeloSelecionado ? cores.textoPrimario : cores.textoTerceiro }]}>
                {modeloSelecionado || (marcaSelecionada ? 'Selecionar modelo' : 'Selecione a marca primeiro')}
              </Text>
              <Ionicons name="chevron-down" size={18} color={cores.textoSecundario} />
            </TouchableOpacity>

            {/* Placa */}
            <View style={[estilos.inputContainer, { backgroundColor: cores.fundoCard, borderColor: cores.borda, marginTop: 10, marginBottom: 32 }]}>
              <Ionicons name="card-outline" size={20} color={cores.textoSecundario} style={{ marginRight: 10 }} />
              <TextInput
                style={[estilos.input, { color: cores.textoPrimario }]}
                placeholder="Placa (Ex: ABC1234)"
                placeholderTextColor={cores.textoTerceiro}
                value={placa}
                onChangeText={(t) => setPlaca(t.toUpperCase())}
                maxLength={8}
                autoCapitalize="characters"
                editable={!!horarioSelecionado}
              />
            </View>
          </View>

          {/* Botão Confirmar */}
          <TouchableOpacity
            style={[
              estilos.botaoConfirmar,
              { backgroundColor: cores.botaoPrimario },
              (!dataSelecionada || !horarioSelecionado || !veiculo || confirmando) && estilos.botaoDesabilitado,
            ]}
            onPress={confirmarAgendamento}
            disabled={!dataSelecionada || !horarioSelecionado || !veiculo || confirmando}
            activeOpacity={0.8}
          >
            {confirmando ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={estilos.textoBotaoConfirmar}>Confirmar Agendamento</Text>
                <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" style={{ marginLeft: 8 }} />
              </>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal Seletor de Marca / Modelo */}
      <Modal visible={modalCarroTipo !== null} transparent animationType="slide" onRequestClose={() => setModalCarroTipo(null)}>
        <View style={estilos.modalOverlay}>
          <View style={[estilos.modalContainer, { backgroundColor: cores.fundoCard }]}>
            <View style={[estilos.modalHeader, { borderBottomColor: cores.borda }]}>
              <Text style={[estilos.modalTitulo, { color: cores.textoPrimario }]}>
                {modalCarroTipo === 'marca' ? 'Selecionar Marca' : 'Selecionar Modelo'}
              </Text>
              <TouchableOpacity onPress={() => setModalCarroTipo(null)}>
                <Ionicons name="close" size={24} color={cores.textoPrimario} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={modalCarroTipo === 'marca' ? marcas : modelos}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const selecionado = modalCarroTipo === 'marca' ? marcaSelecionada === item : modeloSelecionado === item;
                return (
                  <TouchableOpacity
                    style={[estilos.modalItem, { borderBottomColor: cores.borda, backgroundColor: selecionado ? (isDark ? '#1E3A8A20' : '#DBEAFE') : 'transparent' }]}
                    onPress={() => {
                      if (modalCarroTipo === 'marca') {
                        setMarcaSelecionada(item);
                        setModeloSelecionado('');
                      } else {
                        setModeloSelecionado(item);
                      }
                      setModalCarroTipo(null);
                    }}
                  >
                    <Text style={[estilos.modalItemTexto, { color: selecionado ? cores.botaoPrimario : cores.textoPrimario, fontFamily: selecionado ? 'Poppins_600SemiBold' : 'Poppins_400Regular' }]}>
                      {item}
                    </Text>
                    {selecionado && <Ionicons name="checkmark" size={18} color={cores.botaoPrimario} />}
                  </TouchableOpacity>
                );
              }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Modal de Sucesso */}
      <Modal visible={modalSucessoVisivel} transparent animationType="fade" onRequestClose={irParaMenu}>
        <View style={estilos.modalOverlay}>
          <View style={[estilos.modalSucesso, { backgroundColor: cores.fundoCard }]}>
            <View style={estilos.iconeSucesso}>
              <Ionicons name="checkmark-circle" size={72} color="#16A34A" />
            </View>
            <Text style={[estilos.tituloSucesso, { color: cores.textoPrimario }]}>Agendamento Confirmado!</Text>
            <Text style={[estilos.textoSucesso, { color: cores.textoSecundario }]}>
              {servico}
            </Text>
            <Text style={[estilos.textoSucesso, { color: cores.textoSecundario, marginTop: 4 }]}>
              {dataSelecionada ? dataSelecionada.split('-').reverse().join('/') : ''} às {horarioSelecionado}
            </Text>
            {modeloCompleto ? (
              <Text style={[estilos.textoSucesso, { color: cores.textoSecundario, marginTop: 4 }]}>
                🚗 {modeloCompleto}
              </Text>
            ) : null}
            <TouchableOpacity style={[estilos.botaoSucesso, { backgroundColor: '#16A34A' }]} onPress={irParaMenu} activeOpacity={0.8}>
              <Text style={estilos.textoBotaoSucesso}>Ir para o Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1,
  },
  botaoVoltar: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: 'Poppins_700Bold', fontSize: 18 },
  scrollContent: { padding: 20, paddingBottom: 40 },

  servicoCard: {
    flexDirection: 'row', padding: 16, borderRadius: 16, borderWidth: 1,
    marginBottom: 28, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2,
  },
  servicoIcone: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  servicoInfo: { flex: 1 },
  servicoNome: { fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginBottom: 8 },
  servicoTags: { flexDirection: 'row', gap: 8 },
  tag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
  tagText: { fontFamily: 'Poppins_500Medium', fontSize: 12 },

  passoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  passoBolinha: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  passoNumero: { color: '#FFF', fontFamily: 'Poppins_700Bold', fontSize: 14, marginTop: 2 },
  passoTitulo: { fontFamily: 'Poppins_600SemiBold', fontSize: 16 },

  calendarioContainer: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 28 },

  horariosContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 28 },
  horarioChip: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, minWidth: 80, alignItems: 'center' },
  horarioTexto: { fontFamily: 'Poppins_500Medium', fontSize: 14 },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 10, marginBottom: 16 },
  loadingText: { fontFamily: 'Poppins_400Regular', fontSize: 14 },
  emptyText: { fontFamily: 'Poppins_400Regular', fontSize: 14, flex: 1 },
  helperText: { fontFamily: 'Poppins_400Regular', fontSize: 13, marginBottom: 28, marginLeft: 38 },

  seletorCarro: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1.5,
    borderRadius: 12, paddingHorizontal: 14, height: 56,
  },
  seletorTexto: { flex: 1, fontFamily: 'Poppins_400Regular', fontSize: 15 },

  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, height: 56,
  },
  input: { flex: 1, height: '100%', fontFamily: 'Poppins_400Regular', fontSize: 15 },

  botaoConfirmar: {
    flexDirection: 'row', height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#3B82F6', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4,
  },
  botaoDesabilitado: { opacity: 0.5, shadowOpacity: 0, elevation: 0 },
  textoBotaoConfirmar: { color: '#FFF', fontFamily: 'Poppins_600SemiBold', fontSize: 16 },

  // Modal seletor
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
  modalTitulo: { fontFamily: 'Poppins_700Bold', fontSize: 18 },
  modalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  modalItemTexto: { fontSize: 15 },

  // Modal sucesso
  modalSucesso: { borderRadius: 24, margin: 32, padding: 32, alignItems: 'center' },
  iconeSucesso: { marginBottom: 16 },
  tituloSucesso: { fontFamily: 'Poppins_700Bold', fontSize: 22, textAlign: 'center', marginBottom: 8 },
  textoSucesso: { fontFamily: 'Poppins_400Regular', fontSize: 15, textAlign: 'center' },
  botaoSucesso: { marginTop: 24, paddingVertical: 14, paddingHorizontal: 40, borderRadius: 14, width: '100%', alignItems: 'center' },
  textoBotaoSucesso: { color: '#FFF', fontFamily: 'Poppins_600SemiBold', fontSize: 16 },
});