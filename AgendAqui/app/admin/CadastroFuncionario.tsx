import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, ScrollView, SafeAreaView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api, CadastroFuncionarioRequest } from '../../services/api';
import { useTema } from '../../contexts/ThemeContext';
import {
  useFonts, Poppins_400Regular, Poppins_500Medium,
  Poppins_600SemiBold, Poppins_700Bold,
} from '@expo-google-fonts/poppins';

export default function CadastroFuncionario() {
  const router = useRouter();
  const { tema, cores } = useTema();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold,
  });

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [cpfValido, setCpfValido] = useState<boolean | null>(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [focusStates, setFocusStates] = useState<Record<string, boolean>>({});

  const handleFocus = (field: string) => setFocusStates(prev => ({ ...prev, [field]: true }));
  const handleBlur  = (field: string) => setFocusStates(prev => ({ ...prev, [field]: false }));

  const formatarCpf = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 11) {
      let f = numbers;
      if (numbers.length > 3) f = numbers.substring(0, 3) + '.' + numbers.substring(3);
      if (numbers.length > 6) f = f.substring(0, 7) + '.' + f.substring(7);
      if (numbers.length > 9) f = f.substring(0, 11) + '-' + f.substring(11, 13);
      return f;
    }
    return numbers.substring(0, 14);
  };

  const formatarTelefone = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 11) {
      let f = numbers;
      if (numbers.length > 2) f = '(' + numbers.substring(0, 2) + ') ' + numbers.substring(2);
      if (numbers.length > 7) f = f.substring(0, 10) + '-' + f.substring(10);
      return f;
    }
    return numbers.substring(0, 15);
  };

  const validarCPF = (cpf: string): boolean => {
    const nums = cpf.replace(/\D/g, '');
    if (nums.length !== 11) return false;
    if (/^(\d)\1+$/.test(nums)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(nums[i]) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(nums[9])) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(nums[i]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(nums[10]);
  };

  const handleCpfChange = (text: string) => {
    const formatado = formatarCpf(text);
    setCpf(formatado);
    const nums = formatado.replace(/\D/g, '');
    if (nums.length === 11) setCpfValido(validarCPF(formatado));
    else setCpfValido(null);
  };

  const validarCampos = (): boolean => {
    if (!nome || !cpf || !telefone || !email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return false;
    }
    if (!validarCPF(cpf)) {
      Alert.alert('CPF inválido', 'Digite um CPF válido.');
      return false;
    }
    if (senha.length < 6) {
      Alert.alert('Senha fraca', 'A senha deve ter pelo menos 6 caracteres.');
      return false;
    }
    return true;
  };

  const fazerCadastro = async () => {
    if (!validarCampos()) return;

    try {
      setCarregando(true);

      const emailExiste = await api.verificarEmailFuncionario(email);
      if (emailExiste) {
        Alert.alert('Erro', 'Este email já pertence a outro funcionário.');
        return;
      }

      const cpfLimpo = cpf.replace(/\D/g, '');
      const cpfExiste = await api.verificarCpfFuncionario(cpfLimpo);
      if (cpfExiste) {
        Alert.alert('Erro', 'Este CPF já está cadastrado.');
        return;
      }

      const dados: CadastroFuncionarioRequest = {
        nome: nome.trim(),
        cpf: cpfLimpo,
        telefone: telefone.replace(/\D/g, ''),
        email: email.trim().toLowerCase(),
        senha: senha.trim(),
      };

      await api.cadastrarFuncionario(dados);

      if (typeof window !== 'undefined') {
        window.alert(`✅ Funcionário cadastrado com sucesso!\n\nNome: ${nome.trim()}\nEmail: ${email.trim().toLowerCase()}`);
        router.replace('/admin/MenuAdmin');
      } else {
        Alert.alert(
          '✅ Cadastro Realizado!',
          `O funcionário ${nome.trim()} foi cadastrado com sucesso no sistema.\n\nEmail de acesso: ${email.trim().toLowerCase()}`,
          [{ text: 'OK', onPress: () => router.replace('/admin/MenuAdmin') }],
          { cancelable: false }
        );
      }
    } catch (error: any) {
      Alert.alert('Erro no Cadastro', error.message || 'Falha ao realizar cadastro.');
    } finally {
      setCarregando(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={[estilos.container, { backgroundColor: cores.fundo }]}>
      <View style={[estilos.header, { backgroundColor: cores.fundoHeader, borderBottomColor: cores.borda }]}>
        <TouchableOpacity
          style={[estilos.botaoVoltar, { backgroundColor: cores.fundoVoltar }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color={cores.textoPrimario} />
        </TouchableOpacity>
        <Text style={[estilos.headerTitle, { color: cores.textoPrimario }]}>Novo Funcionário</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={estilos.scroll} showsVerticalScrollIndicator={false}>

          <View style={[estilos.cardInfo, { backgroundColor: cores.fundoIconeAcao1, borderColor: cores.corIconeAcao1 + '30' }]}>
            <Ionicons name="shield-checkmark" size={24} color={cores.corIconeAcao1} />
            <Text style={[estilos.cardInfoText, { color: cores.corIconeAcao1 }]}>
              Apenas administradores podem cadastrar novos funcionários no sistema.
            </Text>
          </View>

          <View style={[estilos.formCard, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}>

            <Text style={[estilos.label, { color: cores.textoPrimario }]}>Nome Completo</Text>
            <View style={[estilos.inputContainer, {
              backgroundColor: cores.fundo,
              borderColor: focusStates['nome'] ? cores.botaoPrimario : cores.borda,
            }]}>
              <Ionicons name="person-outline" size={20}
                color={focusStates['nome'] ? cores.botaoPrimario : cores.textoSecundario}
                style={estilos.icon} />
              <TextInput
                style={[estilos.input, { color: cores.textoPrimario }]}
                placeholder="Ex: João da Silva"
                placeholderTextColor={cores.textoTerceiro}
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
                onFocus={() => handleFocus('nome')}
                onBlur={() => handleBlur('nome')}
              />
            </View>

            <Text style={[estilos.label, { color: cores.textoPrimario }]}>CPF</Text>
            <View style={[estilos.inputContainer, {
              backgroundColor: cores.fundo,
              borderColor: cpfValido === false ? '#EF4444' : cpfValido === true ? '#10B981' : focusStates['cpf'] ? cores.botaoPrimario : cores.borda,
            }]}>
              <Ionicons name="card-outline" size={20}
                color={cpfValido === false ? '#EF4444' : cpfValido === true ? '#10B981' : focusStates['cpf'] ? cores.botaoPrimario : cores.textoSecundario}
                style={estilos.icon} />
              <TextInput
                style={[estilos.input, { color: cores.textoPrimario }]}
                placeholder="000.000.000-00"
                placeholderTextColor={cores.textoTerceiro}
                keyboardType="numeric"
                maxLength={14}
                value={cpf}
                onChangeText={handleCpfChange}
                onFocus={() => handleFocus('cpf')}
                onBlur={() => handleBlur('cpf')}
              />
              {cpfValido !== null && (
                <Ionicons
                  name={cpfValido ? 'checkmark-circle' : 'close-circle'}
                  size={20}
                  color={cpfValido ? '#10B981' : '#EF4444'}
                />
              )}
            </View>

            <Text style={[estilos.label, { color: cores.textoPrimario }]}>Telefone / WhatsApp</Text>
            <View style={[estilos.inputContainer, {
              backgroundColor: cores.fundo,
              borderColor: focusStates['telefone'] ? cores.botaoPrimario : cores.borda,
            }]}>
              <Ionicons name="call-outline" size={20}
                color={focusStates['telefone'] ? cores.botaoPrimario : cores.textoSecundario}
                style={estilos.icon} />
              <TextInput
                style={[estilos.input, { color: cores.textoPrimario }]}
                placeholder="(00) 00000-0000"
                placeholderTextColor={cores.textoTerceiro}
                keyboardType="phone-pad"
                maxLength={15}
                value={telefone}
                onChangeText={text => setTelefone(formatarTelefone(text))}
                onFocus={() => handleFocus('telefone')}
                onBlur={() => handleBlur('telefone')}
              />
            </View>

            <Text style={[estilos.label, { color: cores.textoPrimario }]}>E-mail de Acesso</Text>
            <View style={[estilos.inputContainer, {
              backgroundColor: cores.fundo,
              borderColor: focusStates['email'] ? cores.botaoPrimario : cores.borda,
            }]}>
              <Ionicons name="mail-outline" size={20}
                color={focusStates['email'] ? cores.botaoPrimario : cores.textoSecundario}
                style={estilos.icon} />
              <TextInput
                style={[estilos.input, { color: cores.textoPrimario }]}
                placeholder="funcionario@email.com"
                placeholderTextColor={cores.textoTerceiro}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
              />
            </View>

            <Text style={[estilos.label, { color: cores.textoPrimario }]}>Senha Provisória</Text>
            <View style={[estilos.inputContainer, {
              backgroundColor: cores.fundo,
              borderColor: focusStates['senha'] ? cores.botaoPrimario : cores.borda,
              marginBottom: 0,
            }]}>
              <Ionicons name="lock-closed-outline" size={20}
                color={focusStates['senha'] ? cores.botaoPrimario : cores.textoSecundario}
                style={estilos.icon} />
              <TextInput
                style={[estilos.input, { color: cores.textoPrimario }]}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={cores.textoTerceiro}
                secureTextEntry={!mostrarSenha}
                value={senha}
                onChangeText={setSenha}
                onFocus={() => handleFocus('senha')}
                onBlur={() => handleBlur('senha')}
              />
              <TouchableOpacity
                onPress={() => setMostrarSenha(!mostrarSenha)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={cores.textoSecundario}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[estilos.botao, { backgroundColor: cores.botaoPrimario }, carregando && { opacity: 0.7 }]}
            onPress={fazerCadastro}
            disabled={carregando}
            activeOpacity={0.8}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={estilos.textoBotao}>Cadastrar Funcionário</Text>
                <Ionicons name="person-add" size={18} color="#FFF" style={{ marginLeft: 8 }} />
              </>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1,
  },
  botaoVoltar: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: 'Poppins_700Bold', fontSize: 18 },
  scroll: { padding: 20, paddingBottom: 40 },
  cardInfo: {
    flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12,
    borderWidth: 1, marginBottom: 20, gap: 12,
  },
  cardInfoText: { fontFamily: 'Poppins_500Medium', fontSize: 13, flex: 1 },
  formCard: { padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 24 },
  label: { fontFamily: 'Poppins_600SemiBold', fontSize: 13, marginBottom: 6, marginLeft: 4 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12,
    paddingHorizontal: 14, height: 52, marginBottom: 20,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, height: '100%', fontFamily: 'Poppins_400Regular', fontSize: 14 },
  botao: {
    flexDirection: 'row', height: 56, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8, elevation: 4,
  },
  textoBotao: { color: '#FFF', fontFamily: 'Poppins_600SemiBold', fontSize: 16 },
});