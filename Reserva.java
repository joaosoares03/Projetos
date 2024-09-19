import java.util.LinkedList;

class Reserva {
    String horario;
    String nomeTutor;
    Pet pet;

    public Reserva(String horario, String nomeTutor, Pet pet) {
        this.horario = horario;
        this.nomeTutor = nomeTutor;
        this.pet = pet;
    }
}

class ListaReservas {
    private LinkedList<Reserva> reservas;

    public ListaReservas() {
        this.reservas = new LinkedList<>();
    }

    public void inserirReserva(String horario, String nomeTutor, String nomePet, int idadePet) {
        Pet pet = new Pet(nomePet, idadePet);
        Reserva novaReserva = new Reserva(horario, nomeTutor, pet);
        reservas.add(novaReserva);
    }

    public void pesquisarPorNomePet(String nomePet) {
        for (Reserva reserva : reservas) {
            if (reserva.pet.nome.equals(nomePet)) {
                System.out.println("Reserva encontrada: Horário: " + reserva.horario + ", Tutor: " + reserva.nomeTutor + ", Pet: " + reserva.pet.nome + ", Idade: " + reserva.pet.idade);
                return;
            }
        }
        System.out.println("Nenhuma reserva encontrada para o pet: " + nomePet);
    }
}
