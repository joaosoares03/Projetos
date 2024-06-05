/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.lojamusical.models;

import java.util.Date;

/**
 *
 * @author PC - ANA CAROLINA
 */
public class RelatorioSintetico {
    private int idVenda;
    private Date dataVenda;
    private int idCilente;
    private String nomeCliente;
    private float valorVenda;

    public RelatorioSintetico(int idVenda, Date dataVenda, int idCilente, String nomeCliente, float valorVenda) {
        this.idVenda = idVenda;
        this.dataVenda = dataVenda;
        this.idCilente = idCilente;
        this.nomeCliente = nomeCliente;
        this.valorVenda = valorVenda;
        
        
    }

    public int getIdVenda() {
        return idVenda;
    }

    public void setIdVenda(int idVenda) {
        this.idVenda = idVenda;
    }

    public Date getDataVenda() {
        return dataVenda;
    }

    public void setDataVenda(Date dataVenda) {
        this.dataVenda = dataVenda;
    }

    public int getIdCilente() {
        return idCilente;
    }

    public void setIdCilente(int idCilente) {
        this.idCilente = idCilente;
    }

    public String getNomeCliente() {
        return nomeCliente;
    }

    public void setNomeCliente(String nomeCliente) {
        this.nomeCliente = nomeCliente;
    }

    public float getValorVenda() {
        return valorVenda;
    }

    public void setValorVenda(float valorVenda) {
        this.valorVenda = valorVenda;
    }
    
    
}
