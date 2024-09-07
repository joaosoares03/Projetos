package br.com.joaocarloslima;

public class Timer {
        private Numero hora;
        private Numero minutos;
        private Numero segundos;
        private boolean ligado;
        private boolean regressivo;

        private static final int MAX_MINUTOS_TOTAL = 1440;


        public Timer(int minutosTotais) {
            setTempo(minutosTotais);
            this.segundos = new Numero(0, 59);
            this.ligado = false;
            this.regressivo = false;
        }


        public void setTempo(int minutosTotais) {
            if (minutosTotais >= MAX_MINUTOS_TOTAL) {
                minutosTotais = minutosTotais % MAX_MINUTOS_TOTAL;
            }

            int horas = minutosTotais / 60;
            int minutos = minutosTotais % 60;

            this.hora = new Numero(horas, 23);
            this.minutos = new Numero(minutos, 59);
        }


        public void start() {
            this.ligado = true;
        }


        public void stop() {
            this.ligado = false;
        }


        public void tick() {
            if (!ligado) {
                return;
            }

            if (regressivo) {
                decrementarTempo();
            } else {
                incrementarTempo();
            }
        }


        private void incrementarTempo() {
            segundos.incrementar();
            if (segundos.getValor() == 0) {
                minutos.incrementar();
                if (minutos.getValor() == 0) {
                    hora.incrementar();
                    if (hora.getValor() == 0) {
                        resetTimer();
                    }
                }
            }
        }


        private void decrementarTempo() {
            segundos.decrementar();
            if (segundos.getValor() == 59) {
                minutos.decrementar();
                if (minutos.getValor() == 59) {
                    hora.decrementar();
                    if (hora.getValor() == 23 && minutos.getValor() == 59) {
                        resetTimer();
                    }
                }
            }
        }

        private void resetTimer() {
            setTempo(MAX_MINUTOS_TOTAL);
        }


        public Numero getHora() {
            return hora;
        }

        public Numero getMinutos() {
            return minutos;
        }

        public Numero getSegundos() {
            return segundos;
        }

        public boolean isLigado() {
            return ligado;
        }

        public void setLigado(boolean ligado) {
            this.ligado = ligado;
        }

        public boolean isRegressivo() {
            return regressivo;
        }

        public void setRegressivo(boolean regressivo) {
            this.regressivo = regressivo;
        }
    }
