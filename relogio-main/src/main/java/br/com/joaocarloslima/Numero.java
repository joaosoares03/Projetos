package br.com.joaocarloslima;

public class Numero {

        private int numero;
        private int limite;


        public Numero(int numero) {
            this.numero = numero;
            this.limite = 0;
        }

        public Numero(int numero, int limite) {
            this.numero = numero;
            this.limite = limite;
        }


        public void incrementar() {
            numero++;
            if (numero > limite) {
                numero = 0;
            }
        }


        public void decrementar() {
            numero--;
            if (numero < 0) {
                numero = limite;
            }
        }


        public String getValorFormatado() {
            return String.format("%02d", numero);
        }


        public int getValor() {
            return numero;
        }

        public int getLimite() {
            return limite;
        }

        public void setValor(int valor) {
            this.numero = valor;
        }

        public void setLimite(int limite) {
            this.limite = limite;
        }
    }

