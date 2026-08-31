import { Ionicons } from '@expo/vector-icons';
import {
  useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { useRouter } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator, Animated, ScrollView, StyleSheet,
  Text, TouchableOpacity, View, RefreshControl, useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { useTema } from '../../contexts/ThemeContext';
import { Agendamento, api } from '../../services/api';

type FiltroPeriodo = 'dia' | 'semana' | 'mes' | 'ano' | 'tudo';

interface DadosResumo {
  totalServicosConcluidos: number;
  totalAgendamentos: number;
  receitaTotal: number;
  ticketMedio: number;
  servicosPorMes: Array<{ mes: string; total: number; receita: number }>;
  servicoMaisPopular: string;
  servicoMaisPopularCount: number;
  taxaConclusao: number;
}

function AnimatedNumber({ value, prefix = '', suffix = '', style }: {
  value: number; prefix?: string; suffix?: string; style?: any;
}) {
  const animValue = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    animValue.setValue(0);
    Animated.timing(animValue, { toValue: value, duration: 1200, useNativeDriver: false }).start();
    const listener = animValue.addListener(({ value: v }) => {
      if (prefix === 'R$ ')    setDisplay(v.toFixed(2));
      else if (suffix === '%') setDisplay(v.toFixed(1));
      else                     setDisplay(Math.floor(v).toString());
    });
    return () => animValue.removeListener(listener);
  }, [value]);

  return <Text style={style}>{prefix}{display}{suffix}</Text>;
}

function AnimatedBar({ height, delay, color }: { height: number; delay: number; color: string }) {
  const animHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(animHeight, { toValue: height, friction: 6, tension: 40, useNativeDriver: false }),
    ]).start();
  }, [height]);

  return (
    <Animated.View style={{
      width: 28, borderRadius: 8, backgroundColor: color, height: animHeight, minHeight: 4,
    }} />
  );
}

export default function ResumoFinanceiro() {
  const router = useRouter();
  const { usuario, getUsuarioId } = useAuth();
  const { tema, cores } = useTema();
  const { width: screenWidth } = useWindowDimensions(); // ← reativo ao resize

  const [dados, setDados] = useState<DadosResumo | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [filtroPeriodo, setFiltroPeriodo] = useState<FiltroPeriodo>('mes');

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold });

  // Calcula largura dos cards de stat de forma reativa
  const padding     = 32; // 16 de cada lado
  const gap         = 10;
  const isWide      = screenWidth > 600;
  const numCols     = isWide ? 4 : 2;
  const statCardW   = (screenWidth - padding - gap * (numCols - 1)) / numCols;

  const getMonthNumber = (monthName: string): number => {
    const months: Record<string, number> = {
      'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3,
      'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7,
      'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11,
    };
    return months[monthName.toLowerCase()] ?? 0;
  };

  const animateIn = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  };

  const filtrarPorPeriodo = (agendamentos: Agendamento[], periodo: FiltroPeriodo): Agendamento[] => {
    const agora = new Date();
    agora.setHours(23, 59, 59, 999);
    return agendamentos.filter(ag => {
      const dataAg = new Date(ag.dataAgendamento + 'T12:00:00');
      if (periodo === 'dia') {
        const inicio = new Date(); inicio.setHours(0, 0, 0, 0);
        return dataAg >= inicio && dataAg <= agora;
      }
      if (periodo === 'semana') {
        const inicio = new Date();
        inicio.setDate(agora.getDate() - 6);
        inicio.setHours(0, 0, 0, 0);
        return dataAg >= inicio && dataAg <= agora;
      }
      if (periodo === 'mes') {
        return dataAg.getMonth() === agora.getMonth() &&
               dataAg.getFullYear() === agora.getFullYear();
      }
      if (periodo === 'ano') {
        return dataAg.getFullYear() === agora.getFullYear();
      }
      return true;
    });
  };

  const calcularResumo = async (periodo?: FiltroPeriodo) => {
    const periodoAtivo = periodo ?? filtroPeriodo;
    try {
      setCarregando(true);
      setErro(null);

      let agendamentos: Agendamento[] = [];
      if (usuario?.tipo === 'cliente') {
        const clienteId = getUsuarioId();
        if (clienteId) agendamentos = await api.getAgendamentosPorCliente(clienteId);
      } else {
        agendamentos = await api.getAllAgendamentos();
      }

      const agendamentosFiltrados  = filtrarPorPeriodo(agendamentos, periodoAtivo);
      const agendamentosConcluidos = agendamentosFiltrados.filter(ag =>
        ['concluido', 'finalizado', 'concluído'].includes(ag.status?.toLowerCase())
      );

      const totalServicosConcluidos = agendamentosConcluidos.length;
      const totalAgendamentos       = agendamentosFiltrados.length;
      const receitaTotal            = agendamentosConcluidos.reduce((t, ag) => t + (ag.servico?.preco || 0), 0);
      const ticketMedio             = totalServicosConcluidos > 0 ? receitaTotal / totalServicosConcluidos : 0;
      const taxaConclusao           = totalAgendamentos > 0 ? (totalServicosConcluidos / totalAgendamentos) * 100 : 0;

      const todosConcluidos = agendamentos.filter(ag =>
        ['concluido', 'finalizado', 'concluído'].includes(ag.status?.toLowerCase())
      );

      const servicosPorMesMap = new Map<string, { mes: string; total: number; receita: number }>();
      todosConcluidos.forEach(ag => {
        try {
          const data    = new Date(ag.dataAgendamento + 'T12:00:00');
          const mesAno  = `${data.getMonth() + 1}/${data.getFullYear()}`;
          const mesNome = data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
          if (!servicosPorMesMap.has(mesAno)) {
            servicosPorMesMap.set(mesAno, {
              mes: mesNome.charAt(0).toUpperCase() + mesNome.slice(1),
              total: 0, receita: 0,
            });
          }
          const m = servicosPorMesMap.get(mesAno)!;
          m.total   += 1;
          m.receita += ag.servico?.preco || 0;
        } catch {}
      });

      const servicosPorMes = Array.from(servicosPorMesMap.values()).sort((a, b) => {
        const [mesA, anoA] = a.mes.split(' de ');
        const [mesB, anoB] = b.mes.split(' de ');
        return new Date(parseInt(anoB), getMonthNumber(mesB)).getTime() -
               new Date(parseInt(anoA), getMonthNumber(mesA)).getTime();
      });

      const servicoCount = new Map<string, number>();
      agendamentosConcluidos.forEach(ag => {
        const nome = ag.servico?.nome || 'Serviço';
        servicoCount.set(nome, (servicoCount.get(nome) || 0) + 1);
      });

      let servicoMaisPopular = 'Nenhum';
      let maxCount = 0;
      servicoCount.forEach((count, nome) => {
        if (count > maxCount) { maxCount = count; servicoMaisPopular = nome; }
      });

      setDados({
        totalServicosConcluidos, totalAgendamentos, receitaTotal,
        ticketMedio, servicosPorMes: servicosPorMes.slice(0, 6),
        servicoMaisPopular, servicoMaisPopularCount: maxCount, taxaConclusao,
      });

      animateIn();
    } catch (error) {
      console.error('Erro ao carregar resumo financeiro:', error);
      setErro('Erro ao carregar dados financeiros. Tente novamente.');
      setDados({
        totalServicosConcluidos: 0, totalAgendamentos: 0, receitaTotal: 0,
        ticketMedio: 0, servicosPorMes: [], servicoMaisPopular: 'Nenhum',
        servicoMaisPopularCount: 0, taxaConclusao: 0,
      });
    } finally {
      setCarregando(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); calcularResumo(filtroPeriodo); };

  useEffect(() => { calcularResumo(filtroPeriodo); }, [usuario, filtroPeriodo]);

  if (!fontsLoaded) return null;

  const isDark = tema === 'escuro';

  const colors = {
    bg:         cores.fundo,
    cardBg:     cores.fundoCard,
    border:     cores.borda,
    text:       cores.textoPrimario,
    textSec:    cores.textoSecundario,
    accent:     isDark ? '#818CF8' : '#6366F1',
    accentSoft: isDark ? 'rgba(129,140,248,0.15)' : 'rgba(99,102,241,0.1)',
    green:      isDark ? '#34D399' : '#10B981',
    greenSoft:  isDark ? 'rgba(52,211,153,0.15)' : 'rgba(16,185,129,0.1)',
    amber:      isDark ? '#FBBF24' : '#F59E0B',
    amberSoft:  isDark ? 'rgba(251,191,36,0.15)' : 'rgba(245,158,11,0.1)',
    rose:       isDark ? '#FB7185' : '#F43F5E',
    roseSoft:   isDark ? 'rgba(251,113,133,0.15)' : 'rgba(244,63,94,0.1)',
    cyan:       isDark ? '#22D3EE' : '#06B6D4',
    cyanSoft:   isDark ? 'rgba(34,211,238,0.15)' : 'rgba(6,182,212,0.1)',
    chartBar:   isDark ? '#818CF8' : '#6366F1',
    progressBg: isDark ? '#334155' : '#E2E8F0',
  };

  const labelPeriodo: Record<FiltroPeriodo, string> = {
    dia: 'Hoje', semana: 'Esta semana', mes: 'Este mês', ano: 'Este ano', tudo: 'Todo período',
  };

  if (carregando && !refreshing) {
    return (
      <View style={[estilos.loadingContainer, { backgroundColor: colors.bg }]}>
        <View style={[estilos.loadingCard, { backgroundColor: colors.cardBg }]}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[estilos.loadingText, { color: colors.textSec, fontFamily: 'Poppins_400Regular' }]}>
            Carregando resumo financeiro...
          </Text>
        </View>
      </View>
    );
  }

  if (erro && !dados) {
    return (
      <View style={[estilos.loadingContainer, { backgroundColor: colors.bg }]}>
        <View style={[estilos.errorCard, { backgroundColor: colors.cardBg }]}>
          <View style={[estilos.errorIconCircle, { backgroundColor: colors.roseSoft }]}>
            <Ionicons name="alert-circle" size={40} color={colors.rose} />
          </View>
          <Text style={[estilos.errorTitle, { color: colors.text, fontFamily: 'Poppins_700Bold' }]}>
            Ops! Algo deu errado
          </Text>
          <Text style={[estilos.errorMsg, { color: colors.textSec, fontFamily: 'Poppins_400Regular' }]}>
            {erro}
          </Text>
          <TouchableOpacity
            style={[estilos.retryButton, { backgroundColor: colors.accent }]}
            onPress={() => calcularResumo()}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={18} color="#FFF" />
            <Text style={[estilos.retryText, { fontFamily: 'Poppins_600SemiBold' }]}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const maxReceita = dados?.servicosPorMes
    ? Math.max(...dados.servicosPorMes.map(m => m.receita), 1)
    : 1;

  const statsData = [
    {
      icone: 'calendar'         as const, cor: colors.cyan,  fundo: colors.cyanSoft,
      valor: dados?.totalAgendamentos || 0,
      label: 'Agendamentos',    tipo: 'numero',
    },
    {
      icone: 'checkmark-circle' as const, cor: colors.green, fundo: colors.greenSoft,
      valor: dados?.totalServicosConcluidos || 0,
      label: 'Concluídos',      tipo: 'numero',
    },
    {
      icone: 'pie-chart'        as const, cor: colors.amber, fundo: colors.amberSoft,
      valor: dados?.taxaConclusao || 0,
      label: 'Tx. Conclusão',   tipo: 'porcentagem',
    },
    {
      icone: 'pricetag'         as const, cor: colors.rose,  fundo: colors.roseSoft,
      valor: dados?.ticketMedio || 0,
      label: 'Ticket Médio',    tipo: 'moeda',
    },
  ];

  return (
    <View style={[estilos.container, { backgroundColor: colors.bg }]}>

      {/* Header */}
      <View style={[estilos.header, { backgroundColor: cores.fundoHeader, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[estilos.backButton, { backgroundColor: cores.fundoVoltar }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={estilos.headerCenter}>
          <Text style={[estilos.headerTitle, { color: colors.text, fontFamily: 'Poppins_700Bold' }]}>
            Resumo Financeiro
          </Text>
          <Text style={[estilos.headerSub, { color: colors.textSec, fontFamily: 'Poppins_400Regular' }]}>
            {labelPeriodo[filtroPeriodo]}
          </Text>
        </View>
        <TouchableOpacity
          style={[estilos.refreshBtn, { backgroundColor: colors.accentSoft }]}
          onPress={() => calcularResumo()}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={20} color={colors.accent} />
        </TouchableOpacity>
      </View>

      {/* Chips de período */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 52, flexShrink: 0 }}
        contentContainerStyle={{
          paddingHorizontal: 16, paddingVertical: 8,
          flexDirection: 'row', alignItems: 'center',
        }}
      >
        {([
          { key: 'dia',    label: 'Hoje'   },
          { key: 'semana', label: 'Semana' },
          { key: 'mes',    label: 'Mês'    },
          { key: 'ano',    label: 'Ano'    },
          { key: 'tudo',   label: 'Tudo'   },
        ] as { key: FiltroPeriodo; label: string }[]).map(f => (
          <TouchableOpacity
            key={f.key}
            style={{
              paddingHorizontal: 18, paddingVertical: 8,
              borderRadius: 20, borderWidth: 1, marginRight: 8,
              borderColor:     filtroPeriodo === f.key ? cores.botaoPrimario : cores.borda,
              backgroundColor: filtroPeriodo === f.key ? cores.botaoPrimario : 'transparent',
            }}
            onPress={() => setFiltroPeriodo(f.key)}
            activeOpacity={0.7}
          >
            <Text style={{
              fontFamily: 'Poppins_600SemiBold', fontSize: 13,
              color: filtroPeriodo === f.key ? '#FFF' : cores.textoSecundario,
            }}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[estilos.scrollContent, { paddingHorizontal: 16 }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Hero Card */}
          <LinearGradient
            colors={isDark ? ['#312E81', '#1E1B4B'] : ['#6366F1', '#4F46E5']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={estilos.heroCard}
          >
            <View style={estilos.heroTop}>
              <View style={estilos.heroIconBg}>
                <Ionicons name="wallet" size={24} color="#FFF" />
              </View>
              <View style={estilos.heroBadge}>
                <Ionicons name="trending-up" size={14} color="#34D399" />
                <Text style={[estilos.heroBadgeText, { fontFamily: 'Poppins_600SemiBold' }]}>
                  {labelPeriodo[filtroPeriodo]}
                </Text>
              </View>
            </View>
            <Text style={[estilos.heroLabel, { fontFamily: 'Poppins_400Regular' }]}>Receita Total</Text>
            <AnimatedNumber
              value={dados?.receitaTotal || 0}
              prefix="R$ "
              style={[estilos.heroValue, { fontFamily: 'Poppins_700Bold' }]}
            />
            <View style={estilos.heroFooter}>
              <View style={estilos.heroFooterItem}>
                <Text style={[estilos.heroFooterLabel, { fontFamily: 'Poppins_400Regular' }]}>Ticket Médio</Text>
                <Text style={[estilos.heroFooterValue, { fontFamily: 'Poppins_600SemiBold' }]}>
                  R$ {(dados?.ticketMedio || 0).toFixed(2)}
                </Text>
              </View>
              <View style={estilos.heroFooterDivider} />
              <View style={estilos.heroFooterItem}>
                <Text style={[estilos.heroFooterLabel, { fontFamily: 'Poppins_400Regular' }]}>Serviços</Text>
                <Text style={[estilos.heroFooterValue, { fontFamily: 'Poppins_600SemiBold' }]}>
                  {dados?.totalServicosConcluidos || 0}
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* Stats Grid — largura calculada de forma reativa */}
          <View style={[estilos.statsGrid, { gap: 10 }]}>
            {statsData.map((stat, i) => (
              <View
                key={i}
                style={[
                  estilos.statCard,
                  {
                    backgroundColor: colors.cardBg,
                    borderColor: colors.border,
                    width: statCardW,
                  },
                ]}
              >
                <View style={[estilos.statIcon, { backgroundColor: stat.fundo }]}>
                  <Ionicons name={stat.icone} size={20} color={stat.cor} />
                </View>
                {stat.tipo === 'porcentagem' ? (
                  <AnimatedNumber
                    value={stat.valor}
                    suffix="%"
                    style={[estilos.statValue, { color: colors.text, fontFamily: 'Poppins_700Bold' }]}
                  />
                ) : stat.tipo === 'moeda' ? (
                  <Text style={[estilos.statValue, { color: colors.text, fontFamily: 'Poppins_700Bold', fontSize: 20 }]}>
                    R$ {stat.valor.toFixed(0)}
                  </Text>
                ) : (
                  <AnimatedNumber
                    value={stat.valor}
                    style={[estilos.statValue, { color: colors.text, fontFamily: 'Poppins_700Bold' }]}
                  />
                )}
                <Text style={[estilos.statLabel, { color: colors.textSec, fontFamily: 'Poppins_400Regular' }]}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Serviço Mais Popular */}
          <View style={[estilos.popularCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={estilos.popularHeader}>
              <View style={[estilos.popularIconBg, { backgroundColor: colors.amberSoft }]}>
                <Ionicons name="trophy" size={22} color={colors.amber} />
              </View>
              <View style={estilos.popularInfo}>
                <Text style={[estilos.popularTitle, { color: colors.textSec, fontFamily: 'Poppins_400Regular' }]}>
                  Serviço Mais Popular
                </Text>
                <Text style={[estilos.popularName, { color: colors.text, fontFamily: 'Poppins_700Bold' }]}>
                  {dados?.servicoMaisPopular || 'Nenhum'}
                </Text>
              </View>
            </View>
            {(dados?.servicoMaisPopularCount || 0) > 0 && (
              <View style={[estilos.popularBadge, { backgroundColor: colors.greenSoft }]}>
                <Ionicons name="star" size={14} color={colors.green} />
                <Text style={[estilos.popularBadgeText, { color: colors.green, fontFamily: 'Poppins_600SemiBold' }]}>
                  {dados?.servicoMaisPopularCount} realizações
                </Text>
              </View>
            )}
          </View>

          {/* Gráfico mensal */}
          <View style={[estilos.chartCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={estilos.chartHeader}>
              <View>
                <Text style={[estilos.chartTitle, { color: colors.text, fontFamily: 'Poppins_700Bold' }]}>
                  Receita por Mês
                </Text>
                <Text style={[estilos.chartSubtitle, { color: colors.textSec, fontFamily: 'Poppins_400Regular' }]}>
                  Histórico completo
                </Text>
              </View>
              <View style={[estilos.chartIconBg, { backgroundColor: colors.accentSoft }]}>
                <Ionicons name="bar-chart" size={20} color={colors.accent} />
              </View>
            </View>

            {dados?.servicosPorMes && dados.servicosPorMes.length > 0 ? (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={[estilos.chartArea, { minWidth: dados.servicosPorMes.length * 60 }]}>
                    {dados.servicosPorMes.map((mes, index) => {
                      const barHeight = (mes.receita / maxReceita) * 120;
                      const mesLabel  = mes.mes.split(' de ')[0].substring(0, 3);
                      return (
                        <View key={index} style={estilos.chartBarWrapper}>
                          <Text style={[estilos.chartBarValue, { color: colors.textSec, fontFamily: 'Poppins_600SemiBold' }]}>
                            {mes.total}
                          </Text>
                          <View style={[estilos.chartBarBg, { backgroundColor: colors.progressBg }]}>
                            <AnimatedBar height={Math.max(barHeight, 8)} delay={index * 100} color={colors.chartBar} />
                          </View>
                          <Text style={[estilos.chartBarLabel, { color: colors.textSec, fontFamily: 'Poppins_400Regular' }]}>
                            {mesLabel}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>

                <View style={[estilos.divider, { backgroundColor: colors.border }]} />

                {dados.servicosPorMes.map((mes, index) => (
                  <View
                    key={index}
                    style={[
                      estilos.monthItem,
                      index < dados.servicosPorMes.length - 1 && {
                        borderBottomWidth: 1, borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    <View style={estilos.monthLeft}>
                      <View style={[estilos.monthDot, { backgroundColor: colors.chartBar }]} />
                      <View style={{ flex: 1 }}>
                        <Text style={[estilos.monthName, { color: colors.text, fontFamily: 'Poppins_600SemiBold' }]}>
                          {mes.mes}
                        </Text>
                        <Text style={[estilos.monthCount, { color: colors.textSec, fontFamily: 'Poppins_400Regular' }]}>
                          {mes.total} {mes.total === 1 ? 'serviço' : 'serviços'}
                        </Text>
                      </View>
                    </View>
                    <Text style={[estilos.monthRevenue, { color: colors.green, fontFamily: 'Poppins_700Bold' }]}>
                      R$ {mes.receita.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </>
            ) : (
              <View style={estilos.emptyState}>
                <View style={[estilos.emptyIcon, { backgroundColor: colors.accentSoft }]}>
                  <Ionicons name="analytics-outline" size={32} color={colors.accent} />
                </View>
                <Text style={[estilos.emptyTitle, { color: colors.text, fontFamily: 'Poppins_600SemiBold' }]}>
                  Sem dados ainda
                </Text>
                <Text style={[estilos.emptyText, { color: colors.textSec, fontFamily: 'Poppins_400Regular' }]}>
                  Nenhum serviço concluído no período selecionado
                </Text>
              </View>
            )}
          </View>

          {/* Info Banner */}
          <View style={[estilos.infoBanner, { backgroundColor: colors.accentSoft, borderColor: colors.accent + '30' }]}>
            <Ionicons name="information-circle" size={20} color={colors.accent} />
            <Text style={[estilos.infoText, { color: colors.accent, fontFamily: 'Poppins_400Regular' }]}>
              {usuario?.tipo === 'cliente'
                ? 'Mostrando apenas seus serviços'
                : 'Dados consolidados de todos os clientes'}
            </Text>
          </View>

          {/* Botão atualizar */}
          <TouchableOpacity
            style={[estilos.updateButton, { backgroundColor: cores.botaoPrimario }]}
            onPress={() => calcularResumo()}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={20} color="#FFF" />
            <Text style={[estilos.updateButtonText, { fontFamily: 'Poppins_600SemiBold' }]}>
              Atualizar Dados
            </Text>
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingCard: { padding: 40, borderRadius: 20, alignItems: 'center', gap: 16, width: '100%', maxWidth: 320 },
  loadingText: { fontSize: 14, textAlign: 'center' },
  errorCard: { padding: 32, borderRadius: 20, alignItems: 'center', gap: 12, width: '100%', maxWidth: 340 },
  errorIconCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  errorTitle: { fontSize: 18 },
  errorMsg: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  retryButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, marginTop: 8 },
  retryText: { color: '#FFF', fontSize: 15 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 52, paddingBottom: 14,
    borderBottomWidth: 1, gap: 12,
  },
  backButton: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 18 },
  headerSub: { fontSize: 12, marginTop: -2 },
  refreshBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingTop: 16, paddingBottom: 40 },
  heroCard: { borderRadius: 20, padding: 24, marginBottom: 16 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  heroIconBg: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 4,
  },
  heroBadgeText: { color: '#34D399', fontSize: 11 },
  heroLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 4 },
  heroValue: { color: '#FFF', fontSize: 36, marginBottom: 20 },
  heroFooter: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14, padding: 14,
  },
  heroFooterItem: { flex: 1, alignItems: 'center' },
  heroFooterDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  heroFooterLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 2 },
  heroFooterValue: { color: '#FFF', fontSize: 16 },
  // Grid usa flexWrap + gap, e cada card tem width calculada dinamicamente via useWindowDimensions
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  statCard: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 6, marginBottom: 10 },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  statValue: { fontSize: 22 },
  statLabel: { fontSize: 12 },
  popularCard: { borderRadius: 16, padding: 18, borderWidth: 1, marginBottom: 16 },
  popularHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  popularIconBg: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  popularInfo: { flex: 1 },
  popularTitle: { fontSize: 12, marginBottom: 2 },
  popularName: { fontSize: 17 },
  popularBadge: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 12,
  },
  popularBadgeText: { fontSize: 12 },
  chartCard: { borderRadius: 16, padding: 18, borderWidth: 1, marginBottom: 16 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  chartTitle: { fontSize: 16, marginBottom: 2 },
  chartSubtitle: { fontSize: 12 },
  chartIconBg: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  chartArea: { flexDirection: 'row', alignItems: 'flex-end', height: 160, paddingBottom: 4, paddingHorizontal: 8 },
  chartBarWrapper: { alignItems: 'center', gap: 6, marginHorizontal: 6, width: 40 },
  chartBarBg: { width: 28, height: 120, borderRadius: 8, justifyContent: 'flex-end', overflow: 'hidden' },
  chartBarValue: { fontSize: 11 },
  chartBarLabel: { fontSize: 11, textTransform: 'capitalize' },
  divider: { height: 1, marginVertical: 16 },
  monthItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  monthLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, marginRight: 12 },
  monthDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  monthName: { fontSize: 14 },
  monthCount: { fontSize: 12, marginTop: 1 },
  monthRevenue: { fontSize: 15, flexShrink: 0 },
  emptyState: { alignItems: 'center', paddingVertical: 32, gap: 8 },
  emptyIcon: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emptyTitle: { fontSize: 16 },
  emptyText: { fontSize: 13, textAlign: 'center' },
  infoBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 16,
  },
  infoText: { fontSize: 13, flex: 1 },
  updateButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, padding: 16, borderRadius: 14, marginBottom: 20,
  },
  updateButtonText: { color: '#FFF', fontSize: 15 },
});