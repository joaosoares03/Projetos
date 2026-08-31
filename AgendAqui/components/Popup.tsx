import React, { useEffect, useRef } from 'react';
import {
  Modal, View, Text, TouchableOpacity,
  StyleSheet, Animated, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../contexts/ThemeContext';

type TipoPopup = 'sucesso' | 'erro' | 'aviso' | 'confirmacao' | 'info';

interface BotaoPopup {
  label: string;
  onPress: () => void;
  tipo?: 'primario' | 'secundario' | 'perigo';
}

interface PopupProps {
  visivel: boolean;
  tipo?: TipoPopup;
  titulo: string;
  mensagem?: string;
  botoes: BotaoPopup[];
  onFechar?: () => void;
}

const iconeConfig: Record<TipoPopup, { icone: string; cor: string; fundo: string }> = {
  sucesso:      { icone: 'checkmark-circle', cor: '#10B981', fundo: 'rgba(16,185,129,0.15)'  },
  erro:         { icone: 'close-circle',     cor: '#EF4444', fundo: 'rgba(239,68,68,0.15)'   },
  aviso:        { icone: 'warning',          cor: '#F59E0B', fundo: 'rgba(245,158,11,0.15)'  },
  confirmacao:  { icone: 'help-circle',      cor: '#6366F1', fundo: 'rgba(99,102,241,0.15)'  },
  info:         { icone: 'information-circle', cor: '#06B6D4', fundo: 'rgba(6,182,212,0.15)' },
};

export default function Popup({ visivel, tipo = 'info', titulo, mensagem, botoes, onFechar }: PopupProps) {
  const { cores, tema } = useTema();
  const scaleAnim   = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const isDark = tema === 'escuro';
  const cfg    = iconeConfig[tipo];

  useEffect(() => {
    if (visivel) {
      Animated.parallel([
        Animated.spring(scaleAnim,   { toValue: 1,    friction: 7, tension: 60, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1,    duration: 200,             useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim,   { toValue: 0.85, duration: 150, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0,    duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [visivel]);

  const corBotao = (tipoBotao?: string) => {
    if (tipoBotao === 'perigo')    return '#EF4444';
    if (tipoBotao === 'secundario') return isDark ? '#334155' : '#E2E8F0';
    return cfg.cor;
  };

  const corTextoBotao = (tipoBotao?: string) => {
    if (tipoBotao === 'secundario') return cores.textoSecundario;
    return '#FFFFFF';
  };

  return (
    <Modal visible={visivel} transparent animationType="none" onRequestClose={onFechar}>
      <Animated.View style={[estilos.fundo, { opacity: opacityAnim }]}>
        <Animated.View
          style={[
            estilos.container,
            {
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderColor:     isDark ? '#334155' : '#E2E8F0',
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Ícone */}
          <View style={[estilos.iconeContainer, { backgroundColor: cfg.fundo }]}>
            <Ionicons name={cfg.icone as any} size={44} color={cfg.cor} />
          </View>

          {/* Título */}
          <Text style={[estilos.titulo, { color: cores.textoPrimario }]}>{titulo}</Text>

          {/* Mensagem */}
          {mensagem ? (
            <Text style={[estilos.mensagem, { color: cores.textoSecundario }]}>{mensagem}</Text>
          ) : null}

          {/* Linha divisória */}
          <View style={[estilos.divisor, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]} />

          {/* Botões */}
          <View style={[estilos.botoesContainer, botoes.length === 1 && estilos.botoesColuna]}>
            {botoes.map((botao, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  estilos.botao,
                  botoes.length > 1 && { flex: 1 },
                  { backgroundColor: corBotao(botao.tipo) },
                  botao.tipo === 'secundario' && { borderWidth: 1, borderColor: isDark ? '#475569' : '#CBD5E1' },
                ]}
                onPress={botao.onPress}
                activeOpacity={0.8}
              >
                <Text style={[estilos.botaoTexto, { color: corTextoBotao(botao.tipo) }]}>
                  {botao.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 12,
  },
  iconeContainer: {
    width: 80, height: 80, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  mensagem: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 4,
  },
  divisor: { width: '100%', height: 1, marginVertical: 20 },
  botoesContainer: { flexDirection: 'row', gap: 10, width: '100%' },
  botoesColuna: { flexDirection: 'column' },
  botao: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoTexto: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
  },
});