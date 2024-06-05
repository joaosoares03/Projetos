package com.mycompany.lojamusical.models;

/**
 *
 * @author niuzi
 */
public class Produto {
    
    private int idProduto;
    private int codProduto;
    private String nomeProduto;
    private String marcaProduto;
    private int qtdProduto;
    private float valorProtudo;
    
    
    //Construtores

    public Produto(int idProduto, String nomeProduto) {
        this.idProduto = idProduto;
        this.nomeProduto = nomeProduto;
    }

    

    

    public Produto(int codProduto, String nomeProduto, String marcaProduto, int qtdProduto, float valorProtudo) {
        this.codProduto = codProduto;
        this.nomeProduto = nomeProduto;
        this.marcaProduto = marcaProduto;
        this.qtdProduto = qtdProduto;
        this.valorProtudo = valorProtudo;
    }

    public Produto(int idProduto, int codProduto, String nomeProduto, String marcaProduto, int qtdProduto, float valorProtudo) {
        this.idProduto = idProduto;
        this.codProduto = codProduto;
        this.nomeProduto = nomeProduto;
        this.marcaProduto = marcaProduto;
        this.qtdProduto = qtdProduto;
        this.valorProtudo = valorProtudo;
    }

    
    
    //Getters e Setters

    public int getIdProduto() {
        return idProduto;
    }

    public void setIdProduto(int idProduto) {
        this.idProduto = idProduto;
    }

    public int getCodProduto() {
        return codProduto;
    }

    public void setCodProduto(int codProduto) {
        this.codProduto = codProduto;
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

    public float getValorProtudo() {
        return valorProtudo;
    }

    public void setValorProtudo(float valorProtudo) {
        this.valorProtudo = valorProtudo;
    }

    public String getMarcaProduto() {
        return marcaProduto;
    }

    public void setMarcaProduto(String marcaProduto) {
        this.marcaProduto = marcaProduto;
    }

    @Override
    public String toString() {
        return this.nomeProduto;
    }
    
    
    
}
