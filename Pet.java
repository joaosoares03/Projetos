class Pet {
    String nome;
    int idade;
    Pet proximo;

    public Pet(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
        this.proximo = null;
    }
}

class ListaLigadaPet {
    private Pet head;

    public ListaLigadaPet() {
        this.head = null;
    }

    public void inserir(String nome, int idade) {
        Pet novoPet = new Pet(nome, idade);
        if (head == null) {
            head = novoPet;
        } else {
            Pet atual = head;
            while (atual.proximo != null) {
                atual = atual.proximo;
            }
            atual.proximo = novoPet;
        }
    }

    public void percorrer() {
        Pet atual = head;
        while (atual != null) {
            System.out.println("Nome: " + atual.nome + ", Idade: " + atual.idade);
            atual = atual.proximo;
        }
    }
}
