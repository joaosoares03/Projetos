/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.lojamusical.models;

/**
 *
 * @author PC - ANA CAROLINA
 */
public class ItemVenda {
    
    private int idItemVenda;
    private int idVenda;
    private int idProduto;
    private int qtdProduto;
    private float valorUnitario;
    
    //ALT + INSERT

    public ItemVenda(int idProduto, int qtdProduto, float valorUnitario) {
        this.idProduto = idProduto;
        this.qtdProduto = qtdProduto;
        this.valorUnitario = valorUnitario;
    }
    
    

    public ItemVenda(int idVenda, int idProduto, int qtdProduto, float valorUnitario) {
        this.idVenda = idVenda;
        this.idProduto = idProduto;
        this.qtdProduto = qtdProduto;
        this.valorUnitario = valorUnitario;
    }

    public int getIdItemVenda() {
        return idItemVenda;
    }

    public void setIdItemVenda(int idItemVenda) {
        this.idItemVenda = idItemVenda;
    }

    public int getIdVenda() {
        return idVenda;
    }

    public void setIdVenda(int idVenda) {
        this.idVenda = idVenda;
    }

    public int getIdProduto() {
        return idProduto;
    }

    public void setIdProduto(int idProduto) {
        this.idProduto = idProduto;
    }

    public int getQtdProduto() {
        return qtdProduto;
    }

    public void setQtdProduto(int qtdProduto) {
        this.qtdProduto = qtdProduto;
    }

    public float getValorUnitario() {
        return valorUnitario;
    }

    public void setValorUnitario(float valorUnitario) {
        this.valorUnitario = valorUnitario;
    }
    
    
}
