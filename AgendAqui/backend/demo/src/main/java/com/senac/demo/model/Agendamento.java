package com.senac.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "agendamentos")
public class Agendamento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;
    
    @ManyToOne
    @JoinColumn(name = "servico_id", nullable = false)
    private Servico servico;
    
    @Column(name = "modelo_carro", length = 100, nullable = false)
    private String modeloCarro;
    
    @Column(name = "data_agendamento", nullable = false)
    private LocalDate dataAgendamento;
    
    @Column(name = "horario", nullable = false)
    private LocalTime horario;
    
    @Column(name = "status", length = 20)
    private String status = "agendado";
    
    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    // Construtores
    public Agendamento() {
        this.dataCriacao = LocalDateTime.now();
        this.status = "agendado";
    }
    
    public Agendamento(Cliente cliente, Servico servico, String modeloCarro, 
                      LocalDate dataAgendamento, LocalTime horario) {
        this.cliente = cliente;
        this.servico = servico;
        this.modeloCarro = modeloCarro;
        this.dataAgendamento = dataAgendamento;
        this.horario = horario;
        this.dataCriacao = LocalDateTime.now();
        this.status = "agendado";
    }
    
    public Agendamento(Cliente cliente, Servico servico, String modeloCarro, 
                      LocalDate dataAgendamento, LocalTime horario, String status) {
        this.cliente = cliente;
        this.servico = servico;
        this.modeloCarro = modeloCarro;
        this.dataAgendamento = dataAgendamento;
        this.horario = horario;
        this.status = status;
        this.dataCriacao = LocalDateTime.now();
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Servico getServico() {
        return servico;
    }

    public void setServico(Servico servico) {
        this.servico = servico;
    }

    public String getModeloCarro() {
        return modeloCarro;
    }

    public void setModeloCarro(String modeloCarro) {
        this.modeloCarro = modeloCarro;
    }

    public LocalDate getDataAgendamento() {
        return dataAgendamento;
    }

    public void setDataAgendamento(LocalDate dataAgendamento) {
        this.dataAgendamento = dataAgendamento;
    }

    public LocalTime getHorario() {
        return horario;
    }

    public void setHorario(LocalTime horario) {
        this.horario = horario;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    // toString para debug
    @Override
    public String toString() {
        return "Agendamento{" +
                "id=" + id +
                ", cliente=" + (cliente != null ? cliente.getId() : "null") +
                ", servico=" + (servico != null ? servico.getId() : "null") +
                ", modeloCarro='" + modeloCarro + '\'' +
                ", dataAgendamento=" + dataAgendamento +
                ", horario=" + horario +
                ", status='" + status + '\'' +
                ", dataCriacao=" + dataCriacao +
                '}';
    }
}