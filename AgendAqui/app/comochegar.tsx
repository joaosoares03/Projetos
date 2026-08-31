import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Image, SafeAreaView, Alert } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useRouter } from 'expo-router';
import { MapPin, Phone, Clock, CreditCard } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTema } from '../contexts/ThemeContext';

export default function ComoChegar() {
  const router = useRouter();
  const { tema, alternarTema, cores } = useTema();

  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold });
  if (!fontsLoaded) return null;

  const abrirMapa = () => {
    const endereco = encodeURIComponent('R. Inácio Ferreira Pinto, 81 - Jardim Itatiaia, São Paulo - SP, 04843-310');
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${endereco}`);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      const confirmar = window.confirm('Deseja realmente sair?');
      if (confirmar) { localStorage.removeItem('@usuario_data'); router.replace('/login'); }
    } else {
      Alert.alert('Sair', 'Deseja realmente sair?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => { AsyncStorage.removeItem('@usuario_data'); router.replace('/login'); } },
      ]);
    }
  };

  return (
    <SafeAreaView style={[estilos.container, { backgroundColor: cores.fundo }]}>
      <View style={[estilos.header, { backgroundColor: cores.fundoHeader, borderBottomColor: cores.borda }]}>
        <TouchableOpacity onPress={() => router.push('/menu')} style={[estilos.botaoVoltar, { backgroundColor: cores.fundoVoltar }]}>
          <Ionicons name="arrow-back" size={20} color={cores.textoPrimario} />
        </TouchableOpacity>
        <Image source={require('../assets/images/logoedcarpng.png')} style={estilos.logo} resizeMode="contain" />
        <TouchableOpacity style={[estilos.botaoVoltar, { backgroundColor: cores.borda }]} onPress={alternarTema}>
          <Ionicons name={tema === 'escuro' ? 'sunny-outline' : 'moon-outline'} size={20} color={cores.textoPrimario} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={estilos.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[estilos.titulo, { color: cores.textoPrimario }]}>Como Chegar</Text>

        {[
          { icone: <MapPin color={cores.corIconeAcao1} size={20} />, label: 'Endereço', texto: 'R. Inácio Ferreira Pinto, 81 - Jardim Itatiaia, São Paulo - SP, 04843-310' },
          { icone: <Phone color={cores.corIconeAcao1} size={20} />, label: 'Telefone', texto: '(11) 95064-9969' },
          { icone: <Clock color={cores.corIconeAcao1} size={20} />, label: 'Horário de Funcionamento', texto: 'Segunda a Sábado, 8h às 18h' },
        ].map((item, i) => (
          <View key={i} style={[estilos.card, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}>
            <View style={[estilos.cardIcone, { backgroundColor: cores.fundoIconeAcao1 }]}>{item.icone}</View>
            <View style={estilos.cardConteudo}>
              <Text style={[estilos.cardLabel, { color: cores.textoTerceiro }]}>{item.label}</Text>
              <Text style={[estilos.cardTexto, { color: cores.textoPrimario }]}>{item.texto}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity style={[estilos.botaoMapa, { backgroundColor: cores.botaoPrimario }]} onPress={abrirMapa}>
          <Ionicons name="map-outline" size={18} color="#FFFFFF" />
          <Text style={estilos.botaoMapaTexto}>Ver no Google Maps</Text>
        </TouchableOpacity>

        <View style={[estilos.card, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}>
          <View style={[estilos.cardIcone, { backgroundColor: cores.fundoIconeAcao1 }]}>
            <CreditCard color={cores.corIconeAcao1} size={20} />
          </View>
          <View style={estilos.cardConteudo}>
            <Text style={[estilos.cardLabel, { color: cores.textoTerceiro }]}>Formas de Pagamento</Text>
            <Text style={[estilos.cardTexto, { color: cores.textoPrimario }]}>
              Pagamento no local, após a conclusão do serviço.{'\n'}Aceitamos dinheiro, Pix e cartões de débito e crédito.
            </Text>
          </View>
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={[estilos.tabBar, { backgroundColor: cores.tabBar, borderTopColor: cores.borda }]}>
        <TouchableOpacity style={estilos.tabItem} onPress={() => router.replace('/menu')}>
          <Ionicons name="home-outline" size={22} color={cores.iconeInativo} />
          <Text style={[estilos.tabLabel, { color: cores.iconeInativo }]}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.tabItem} onPress={() => router.push('/servicos')}>
          <Ionicons name="car-sport-outline" size={22} color={cores.iconeInativo} />
          <Text style={[estilos.tabLabel, { color: cores.iconeInativo }]}>Serviços</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.tabItem} onPress={() => {}}>
          <Ionicons name="location" size={22} color={cores.iconeAtivo} />
          <Text style={[estilos.tabLabel, { color: cores.iconeAtivo, fontFamily: 'Poppins_600SemiBold' }]}>Localização</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.tabItem} onPress={handleLogout} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="log-out-outline" size={22} color={cores.iconeInativo} />
          <Text style={[estilos.tabLabel, { color: cores.iconeInativo }]}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1 },
  botaoVoltar: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 40, height: 40 },
  scrollContent: { padding: 20 },
  titulo: { fontFamily: 'Poppins_700Bold', fontSize: 22, marginBottom: 20 },
  card: { flexDirection: 'row', borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1 },
  cardIcone: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 14, flexShrink: 0 },
  cardConteudo: { flex: 1 },
  cardLabel: { fontFamily: 'Poppins_600SemiBold', fontSize: 11, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardTexto: { fontFamily: 'Poppins_400Regular', fontSize: 14, lineHeight: 21 },
  botaoMapa: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15, borderRadius: 12, marginBottom: 10 },
  botaoMapaTexto: { fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: '#FFFFFF' },
  tabBar: { flexDirection: 'row', borderTopWidth: 1, paddingBottom: 24, paddingTop: 10, paddingHorizontal: 10 },
  tabItem: { flex: 1, alignItems: 'center', gap: 3 },
  tabLabel: { fontFamily: 'Poppins_400Regular', fontSize: 10 },
});