import java.util.Scanner;
import java.util.LinkedList;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        ListaLigadaPet listaLigada = new ListaLigadaPet();
        System.out.println("Cadastro de Pets na Lista Ligada:");

        while (true) {
            System.out.print("Digite o nome do Pet (ou 'sair' para terminar): ");
            String nomePet = scanner.nextLine();
            if (nomePet.equalsIgnoreCase("sair")) {
                break;
            }

            System.out.print("Digite a idade do Pet: ");
            int idadePet = scanner.nextInt();
            scanner.nextLine();

            listaLigada.inserir(nomePet, idadePet);
        }

        System.out.println("\nLista Ligada de Pets cadastrados:");
        listaLigada.percorrer();

        System.out.println("\nLista de Números Pares:");
        System.out.print("Digite uma lista de números inteiros separados por espaço: ");
        String inputNumeros = scanner.nextLine();
        String[] numerosStr = inputNumeros.split(" ");
        LinkedList<Integer> numeros = new LinkedList<>();
        for (String numStr : numerosStr) {
            numeros.add(Integer.parseInt(numStr));
        }

        System.out.println("Números pares:");
        for (int numero : numeros) {
            if (numero % 2 == 0) {
                System.out.println(numero);
            }
        }
        ListaReservas listaReservas = new ListaReservas();
        System.out.println("\nCadastro de Reservas de Banho e Tosa:");

        while (true) {
            System.out.print("Digite o nome do Pet para reserva (ou 'sair' para terminar): ");
            String nomePetReserva = scanner.nextLine();
            if (nomePetReserva.equalsIgnoreCase("sair")) {
                break;
            }

            System.out.print("Digite a idade do Pet: ");
            int idadePetReserva = scanner.nextInt();
            scanner.nextLine();

            System.out.print("Digite o nome do Tutor: ");
            String nomeTutor = scanner.nextLine();

            System.out.print("Digite o horário da reserva: ");
            String horario = scanner.nextLine();

            listaReservas.inserirReserva(horario, nomeTutor, nomePetReserva, idadePetReserva);
        }

        System.out.println("\nPesquisar reservas por nome do Pet:");
        System.out.print("Digite o nome do Pet para pesquisar: ");
        String nomePesquisa = scanner.nextLine();
        listaReservas.pesquisarPorNomePet(nomePesquisa);

        VetorPet vetorPets = new VetorPet();
        System.out.println("\nCadastro de Pets no Vetor:");

        while (true) {
            System.out.print("Digite o nome do Pet (ou 'sair' para terminar): ");
            String nomePetVetor = scanner.nextLine();
            if (nomePetVetor.equalsIgnoreCase("sair")) {
                break;
            }

            System.out.print("Digite a idade do Pet: ");
            int idadePetVetor = scanner.nextInt();
            scanner.nextLine();

            vetorPets.inserir(nomePetVetor, idadePetVetor);
        }

        System.out.println("\nVetor de Pets cadastrados:");
        vetorPets.percorrer();

        scanner.close();
    }
}
