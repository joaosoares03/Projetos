import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'lucide-react-native';
import {
  useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTema } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import Popup from '../../components/Popup';
 
interface PopupState {
  visivel: boolean;
  tipo: 'sucesso' | 'erro' | 'aviso' | 'confirmacao' | 'info';
  titulo: string;
  mensagem: string;
  onConfirmar?: () => void;
}
 
export default function MenuFuncionario() {
  const router = useRouter();
  const { usuario } = useAuth();
  const { tema, alternarTema, cores } = useTema();
 
  const [popup, setPopup] = useState<PopupState>({
    visivel: false, tipo: 'info', titulo: '', mensagem: '',
  });
 
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold });
  if (!fontsLoaded) return null;
 
  const fecharPopup = () => setPopup(p => ({ ...p, visivel: false }));
 
  const confirmarLogout = () => {
    setPopup({
      visivel: true,
      tipo: 'confirmacao',
      titulo: 'Sair da conta',
      mensagem: 'Deseja realmente sair? Você precisará fazer login novamente.',
      onConfirmar: async () => {
        fecharPopup();
        await AsyncStorage.removeItem('@usuario_data');
        router.replace('/login');
      },
    });
  };
 
  return (
    <SafeAreaView style={[estilos.container, { backgroundColor: cores.fundo }]}>
      {/* Header */}
      <View style={[estilos.header, { backgroundColor: cores.fundoHeader, borderBottomColor: cores.borda }]}>
        <Image source={require('../../assets/images/logoedcarpng.png')} style={estilos.logo} resizeMode="contain" />
        <View>
          <Text style={[estilos.headerSub, { color: cores.textoSecundario }]}>Painel Funcionário</Text>
          <Text style={[estilos.headerNome, { color: cores.textoPrimario }]}>{usuario?.nome?.split(' ')[0]}</Text>
        </View>
        <View style={estilos.headerAcoes}>
          <TouchableOpacity style={[estilos.botaoIcone, { backgroundColor: cores.borda }]} onPress={alternarTema}>
            <Ionicons name={tema === 'escuro' ? 'sunny-outline' : 'moon-outline'} size={20} color={cores.textoPrimario} />
          </TouchableOpacity>
          <TouchableOpacity style={[estilos.botaoIcone, { backgroundColor: cores.borda }]} onPress={confirmarLogout}>
            <Ionicons name="log-out-outline" size={20} color={cores.textoPrimario} />
          </TouchableOpacity>
        </View>
      </View>
 
      <View style={estilos.conteudo}>
        <Text style={[estilos.titulo, { color: cores.textoPrimario }]}>Olá, {usuario?.nome?.split(' ')[0]}!</Text>
        <Text style={[estilos.subtitulo, { color: cores.textoSecundario }]}>Selecione uma opção abaixo</Text>
 
        <TouchableOpacity
          style={[estilos.card, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}
          onPress={() => router.push('/admin/AgendaDiaria')}
          activeOpacity={0.8}
        >
          <View style={[estilos.cardIcone, { backgroundColor: cores.fundoIconeAcao1 }]}>
            <Calendar color={cores.corIconeAcao1} size={28} />
          </View>
          <Text style={[estilos.cardLabel, { color: cores.textoPrimario }]}>Agenda do Dia</Text>
          <Ionicons name="chevron-forward" size={16} color={cores.textoSecundario} />
        </TouchableOpacity>
      </View>
 
      {/* Tab Bar */}
      <View style={[estilos.tabBar, { backgroundColor: cores.tabBar, borderTopColor: cores.borda }]}>
        <TouchableOpacity style={estilos.tabItem} onPress={() => {}}>
          <Ionicons name="home" size={22} color={cores.iconeAtivo} />
          <Text style={[estilos.tabLabel, { color: cores.iconeAtivo, fontFamily: 'Poppins_600SemiBold' }]}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.tabItem} onPress={() => router.push('/admin/AgendaDiaria')}>
          <Ionicons name="calendar-outline" size={22} color={cores.iconeInativo} />
          <Text style={[estilos.tabLabel, { color: cores.iconeInativo }]}>Agenda</Text>
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
                { label: 'Cancelar', onPress: fecharPopup,                    tipo: 'secundario' },
                { label: 'Sair',     onPress: popup.onConfirmar ?? fecharPopup, tipo: 'perigo' },
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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1 },
  logo: { width: 40, height: 40, marginRight: 10 },
  headerSub: { fontFamily: 'Poppins_400Regular', fontSize: 11 },
  headerNome: { fontFamily: 'Poppins_700Bold', fontSize: 16 },
  headerAcoes: { marginLeft: 'auto', flexDirection: 'row', gap: 8 },
  botaoIcone: { padding: 8, borderRadius: 8 },
  conteudo: { flex: 1, paddingHorizontal: 20, paddingTop: 28 },
  titulo: { fontFamily: 'Poppins_700Bold', fontSize: 22, marginBottom: 4 },
  subtitulo: { fontFamily: 'Poppins_400Regular', fontSize: 13, marginBottom: 24 },
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 16, borderWidth: 1, gap: 14 },
  cardIcone: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardLabel: { fontFamily: 'Poppins_600SemiBold', fontSize: 15, flex: 1 },
  tabBar: { flexDirection: 'row', borderTopWidth: 1, paddingBottom: 24, paddingTop: 10, paddingHorizontal: 10 },
  tabItem: { flex: 1, alignItems: 'center', gap: 3 },
  tabLabel: { fontFamily: 'Poppins_400Regular', fontSize: 10 },
});