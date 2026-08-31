package com.senac.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "clientes")
public class Cliente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nome", length = 100, nullable = false)
    private String nome;
    
    @Column(name = "telefone", length = 20)
    private String telefone;
    
    @Column(name = "email", length = 100, nullable = false)
    private String email;
    
    @Column(name = "data_cadastro")
    private LocalDateTime dataCadastro;
    
    @Column(name = "cpf", length = 11)
    private String cpf;
    
    @Column(name = "senha", length = 20, nullable = false)
    private String senha;

    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;

    // Construtores
    public Cliente() {
        this.dataCadastro = LocalDateTime.now();
        this.ativo = true;
    }
    
    public Cliente(String nome, String telefone, String email, String cpf, String senha) {
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.cpf = cpf;
        this.senha = senha;
        this.dataCadastro = LocalDateTime.now();
        this.ativo = true;
    }
    
    public Cliente(String nome, String telefone, String email, String cpf, String senha, LocalDateTime dataCadastro) {
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.cpf = cpf;
        this.senha = senha;
        this.dataCadastro = dataCadastro;
        this.ativo = true;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    // toString para debug
    @Override
    public String toString() {
        return "Cliente{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", telefone='" + telefone + '\'' +
                ", email='" + email + '\'' +
                ", dataCadastro=" + dataCadastro +
                ", cpf='" + cpf + '\'' +
                ", senha='" + senha + '\'' +
                ", ativo=" + ativo +
                '}';
    }
}