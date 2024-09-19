import java.util.ArrayList;

class VetorPet {
    private ArrayList<Pet> pets;

    public VetorPet() {
        this.pets = new ArrayList<>();
    }

    public void inserir(String nome, int idade) {
        Pet pet = new Pet(nome, idade);
        pets.add(pet);
    }

    public void percorrer() {
        for (Pet pet : pets) {
            System.out.println("Nome: " + pet.nome + ", Idade: " + pet.idade);
        }
    }
}
