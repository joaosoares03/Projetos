import java.util.LinkedList;

public class ListaNumerosPares {

    public static void main(String[] args) {
        LinkedList<Integer> numeros = new LinkedList<>();
        for (int i = 1; i <= 10; i++) {
            numeros.add(i);
        }

        System.out.println("Números pares:");
        for (int numero : numeros) {
            if (numero % 2 == 0) {
                System.out.println(numero);
            }
        }
    }
}
