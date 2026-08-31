package com.senac.demo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "servicos")
public class Servico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nome", length = 100, nullable = false)
    private String nome;
    
    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;
    
    @Column(name = "duracao_min", nullable = false)
    private Integer duracaoMin;
    
    @Column(name = "preco", precision = 10, scale = 2, nullable = false)
    private BigDecimal preco;
    
    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;

    // Construtores
    public Servico() {}
    
    public Servico(String nome, String descricao, Integer duracaoMin, BigDecimal preco, Boolean ativo) {
        this.nome = nome;
        this.descricao = descricao;
        this.duracaoMin = duracaoMin;
        this.preco = preco;
        this.ativo = ativo;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    
    public Integer getDuracaoMin() { return duracaoMin; }
    public void setDuracaoMin(Integer duracaoMin) { this.duracaoMin = duracaoMin; }
    
    public BigDecimal getPreco() { return preco; }
    public void setPreco(BigDecimal preco) { this.preco = preco; }
    
    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}
