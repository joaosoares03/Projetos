package com.senac.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "funcionarios")
public class Funcionario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "cpf", length = 11, nullable = false, unique = true)
    private String cpf;
    
    @Column(name = "data_cadastro", nullable = false)
    private LocalDateTime dataCadastro;
    
    @Column(name = "email", length = 100, nullable = false, unique = true)
    private String email;
    
    @Column(name = "nome", length = 100, nullable = false)
    private String nome;
    
    @Column(name = "senha", length = 100, nullable = false)
    private String senha;
    
    @Column(name = "telefone", length = 20, nullable = false)
    private String telefone;
    
    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;

    // Construtores
    public Funcionario() {
        this.dataCadastro = LocalDateTime.now();
        this.ativo = true;
    }
    
    public Funcionario(String cpf, String email, String nome, String senha, String telefone) {
        this.cpf = cpf;
        this.email = email;
        this.nome = nome;
        this.senha = senha;
        this.telefone = telefone;
        this.dataCadastro = LocalDateTime.now();
        this.ativo = true;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    @Override
    public String toString() {
        return "Funcionario{" +
                "id=" + id +
                ", cpf='" + cpf + '\'' +
                ", dataCadastro=" + dataCadastro +
                ", email='" + email + '\'' +
                ", nome='" + nome + '\'' +
                ", senha='" + senha + '\'' +
                ", telefone='" + telefone + '\'' +
                ", ativo=" + ativo +
                '}';
    }
}