import React, { createContext, useContext, useState, useEffect } from 'react';

type Tema = 'claro' | 'escuro';

interface TemaContexto {
  tema: Tema;
  alternarTema: () => void;
  cores: typeof temaEscuro;
}

const temaClaro = {
  fundo:          '#F8FAFC',
  fundoCard:      '#FFFFFF',
  fundoHeader:    '#FFFFFF',
  borda:          '#E2E8F0',
  textoPrimario:  '#0F172A',
  textoSecundario:'#64748B',
  textoTerceiro:  '#94A3B8',
  iconeAtivo:     '#0B1F44',
  iconeInativo:   '#94A3B8',
  botaoPrimario:  '#0B1F44',
  botaoPerigo:    '#450A0A',
  botaoPerigoTexto:'#FCA5A5',
  botaoPericoBorda:'#7F1D1D',
  fundoIconeAcao1:'#EEF2FF',
  fundoIconeAcao2:'#F0FDF4',
  corIconeAcao1:  '#0B1F44',
  corIconeAcao2:  '#166534',
  tabBar:         '#FFFFFF',
  precoTexto:     '#0B1F44',
  fundoModalInfo: '#F8FAFC',
  botaoFechar:    '#F1F5F9',
  botaoFecharTexto:'#64748B',
  fundoVoltar:    '#F1F5F9',
};

const temaEscuro = {
  fundo:          '#0F172A',
  fundoCard:      '#1E293B',
  fundoHeader:    '#1E293B',
  borda:          '#334155',
  textoPrimario:  '#F1F5F9',
  textoSecundario:'#94A3B8',
  textoTerceiro:  '#475569',
  iconeAtivo:     '#93C5FD',
  iconeInativo:   '#475569',
  botaoPrimario:  '#3B82F6',
  botaoPerigo:    '#450A0A',
  botaoPerigoTexto:'#FCA5A5',
  botaoPericoBorda:'#7F1D1D',
  fundoIconeAcao1:'#1D3461',
  fundoIconeAcao2:'#14532D',
  corIconeAcao1:  '#93C5FD',
  corIconeAcao2:  '#86EFAC',
  tabBar:         '#1E293B',
  precoTexto:     '#93C5FD',
  fundoModalInfo: '#0F172A',
  botaoFechar:    '#0F172A',
  botaoFecharTexto:'#64748B',
  fundoVoltar:    '#334155',
};

const TemaContexto = createContext<TemaContexto>({
  tema: 'escuro',
  alternarTema: () => {},
  cores: temaEscuro,
});

export function TemaProvider({ children }: { children: React.ReactNode }) {
  const [tema, setTema] = useState<Tema>('escuro');

  const alternarTema = () => {
    setTema(t => (t === 'escuro' ? 'claro' : 'escuro'));
  };

  const cores = tema === 'escuro' ? temaEscuro : temaClaro;

  return (
    <TemaContexto.Provider value={{ tema, alternarTema, cores }}>
      {children}
    </TemaContexto.Provider>
  );
}

export function useTema() {
  return useContext(TemaContexto);
}