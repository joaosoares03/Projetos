package com.mycompany.lojamusical.models;

/**
 *
 * @author PC - ANA CAROLINA
 */
public class RelatorioAnalitico {

    private String nomeProduto;
    private int qtdProduto;
    private double valorUnitario;

    public RelatorioAnalitico(String nomeProduto, int qtdProduto, double valorUnitario) {
        this.nomeProduto = nomeProduto;
        this.qtdProduto = qtdProduto;
        this.valorUnitario = valorUnitario;
    }

    public String getNomeProduto() {
        return nomeProduto;
    }

    public void setNomeProduto(String nomeProduto) {
        this.nomeProduto = nomeProduto;
    }

    public int getQtdProduto() {
        return qtdProduto;
    }

    public void setQtdProduto(int qtdProduto) {
        this.qtdProduto = qtdProduto;
    }

    public double getValorUnitario() {
        return valorUnitario;
    }

    public void setValorUnitario(double valorUnitario) {
        this.valorUnitario = valorUnitario;
    }

}
