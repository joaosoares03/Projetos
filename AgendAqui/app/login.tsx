import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Popup from '../components/Popup';
import { useAuth } from '../hooks/useAuth';
 
SplashScreen.preventAutoHideAsync();
 
interface PopupState {
  visivel: boolean;
  tipo: 'sucesso' | 'erro' | 'aviso' | 'confirmacao' | 'info';
  titulo: string;
  mensagem: string;
}
 
export default function Login() {
  const router = useRouter();
  const { login, carregando } = useAuth();
 
  const [emailInput, setEmailInput] = useState('');
  const [senhaInput, setSenhaInput] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedSenha, setIsFocusedSenha] = useState(false);
 
  const [popup, setPopup] = useState<PopupState>({
    visivel: false, tipo: 'info', titulo: '', mensagem: '',
  });
 
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
 
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
 
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]).start();
    }
  }, [fontsLoaded]);
 
  if (!fontsLoaded) return null;
 
  const fecharPopup = () => setPopup(p => ({ ...p, visivel: false }));
 
  const mostrarPopup = (
    tipo: PopupState['tipo'],
    titulo: string,
    mensagem: string,
  ) => setPopup({ visivel: true, tipo, titulo, mensagem });
 
  const handleLogin = async () => {
    const email = emailInput.trim().toLowerCase();
    const senha = senhaInput.trim();
 
    if (!email || !senha) {
      mostrarPopup('aviso', 'Campos Incompletos', 'Por favor, preencha seu e-mail e senha.');
      return;
    }
 
    try {
      const usuario = await login(email, senha);
      switch (usuario.tipo) {
        case 'administrador':
          router.replace('/admin/MenuAdmin');
          break;
        case 'funcionario':
          router.replace('/admin/MenuFuncionario');
          break;
        case 'cliente':
          router.replace('/menu');
          break;
        default:
          mostrarPopup('erro', 'Erro', 'Tipo de usuário não reconhecido.');
      }
    } catch (error: any) {
      mostrarPopup('erro', 'Ops!', error.message || 'Falha ao fazer login. Verifique seus dados e tente novamente.');
    }
  };
 
  return (
    <LinearGradient
      colors={['#0B1F44', '#1E3A8A', '#0F172A']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={estilos.container}
      onLayout={onLayoutRootView}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={estilos.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[estilos.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={estilos.logoContainer}>
              <View style={estilos.logoBg}>
                <Image source={require('../assets/images/logoedcarpng.png')} style={estilos.logo} resizeMode="contain" />
              </View>
              <Text style={estilos.nomeApp}>AgendAqui</Text>
              <Text style={estilos.subtitulo}>Agende seus serviços com facilidade</Text>
            </View>
 
            <View style={estilos.formContainer}>
              <Text style={estilos.label}>E-mail</Text>
              <View style={[estilos.inputContainer, isFocusedEmail && estilos.inputContainerFocused]}>
                <Ionicons name="mail-outline" size={20} color={isFocusedEmail ? '#3B82F6' : '#94A3B8'} style={estilos.inputIcon} />
                <TextInput
                  style={estilos.input}
                  placeholder="Digite seu e-mail"
                  placeholderTextColor="#94A3B8"
                  value={emailInput}
                  onChangeText={setEmailInput}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onFocus={() => setIsFocusedEmail(true)}
                  onBlur={() => setIsFocusedEmail(false)}
                />
              </View>
 
              <Text style={estilos.label}>Senha</Text>
              <View style={[estilos.inputContainer, isFocusedSenha && estilos.inputContainerFocused]}>
                <Ionicons name="lock-closed-outline" size={20} color={isFocusedSenha ? '#3B82F6' : '#94A3B8'} style={estilos.inputIcon} />
                <TextInput
                  style={estilos.input}
                  placeholder="Sua senha secreta"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!mostrarSenha}
                  value={senhaInput}
                  onChangeText={setSenhaInput}
                  onFocus={() => setIsFocusedSenha(true)}
                  onBlur={() => setIsFocusedSenha(false)}
                />
                <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)} style={estilos.olhoIcon} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'} size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>
 
              <TouchableOpacity style={estilos.esqueceuSenha}>
                <Text style={estilos.esqueceuSenhaTexto}>Esqueceu a senha?</Text>
              </TouchableOpacity>
 
              <TouchableOpacity
                style={[estilos.botao, carregando && estilos.botaoDesabilitado]}
                onPress={handleLogin}
                disabled={carregando}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={carregando ? ['#64748B', '#475569'] : ['#3B82F6', '#1D4ED8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={estilos.botaoGradient}
                >
                  {carregando ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Text style={estilos.textoBotao}>Entrar</Text>
                      <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
 
              <View style={estilos.separadorContainer}>
                <View style={estilos.linhaSeparadora} />
                <Text style={estilos.textoSeparador}>ou</Text>
                <View style={estilos.linhaSeparadora} />
              </View>
 
              <TouchableOpacity style={estilos.botaoCadastro} onPress={() => router.push('/cadastro')} activeOpacity={0.7}>
                <Text style={estilos.textoBotaoCadastro}>
                  Não tem uma conta? <Text style={estilos.textoBotaoCadastroBold}>Cadastre-se</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
 
      <Popup
        visivel={popup.visivel}
        tipo={popup.tipo}
        titulo={popup.titulo}
        mensagem={popup.mensagem}
        botoes={[{ label: 'OK', onPress: fecharPopup }]}
        onFechar={fecharPopup}
      />
    </LinearGradient>
  );
}
 
const estilos = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20, minHeight: '100%' },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 24, padding: 32,
    width: '100%', maxWidth: 400,
    shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20, elevation: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logoBg: {
    width: 90, height: 90, backgroundColor: '#EEF2FF', borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    shadowColor: '#3B82F6', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4,
  },
  logo: { width: 60, height: 60 },
  nomeApp: { fontSize: 28, fontFamily: 'Poppins_700Bold', color: '#0F172A', letterSpacing: -0.5 },
  subtitulo: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: '#64748B', marginTop: 4 },
  formContainer: { width: '100%' },
  label: { fontSize: 14, fontFamily: 'Poppins_500Medium', color: '#334155', marginBottom: 8, marginLeft: 4 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC',
    borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 16, marginBottom: 20,
    paddingHorizontal: 16, height: 56,
  },
  inputContainerFocused: { borderColor: '#3B82F6', backgroundColor: '#FFFFFF' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, height: '100%', fontFamily: 'Poppins_400Regular', fontSize: 15, color: '#0F172A' },
  olhoIcon: { padding: 8 },
  esqueceuSenha: { alignSelf: 'flex-end', marginBottom: 24, marginTop: -8 },
  esqueceuSenhaTexto: { fontFamily: 'Poppins_500Medium', fontSize: 13, color: '#3B82F6' },
  botao: { width: '100%', borderRadius: 16, overflow: 'hidden', marginBottom: 24, shadowColor: '#3B82F6', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  botaoGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 56 },
  botaoDesabilitado: { opacity: 0.7, shadowOpacity: 0, elevation: 0 },
  textoBotao: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Poppins_600SemiBold' },
  separadorContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  linhaSeparadora: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  textoSeparador: { fontFamily: 'Poppins_400Regular', color: '#94A3B8', paddingHorizontal: 16, fontSize: 14 },
  botaoCadastro: { alignItems: 'center', padding: 12 },
  textoBotaoCadastro: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#64748B' },
  textoBotaoCadastroBold: { fontFamily: 'Poppins_600SemiBold', color: '#3B82F6' },
});