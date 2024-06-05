package com.mycompany.lojamusical.models;

/**
 *
 * @author niuzi
 */
public class Cliente {

    private int idCliente;
    private String CPF;
    private String nomeCliente;
    private String emailCliente;
    private String fixoCliente;
    private String idadeCliente;
    private String ruaCliente;
    private String celCliente;
    private String cepCliente;
    private String bairroCliente;
    private String estadoCliente;
    private String cidadeCliente;
    private String numeroCliente;
    private String genero;
    
    //Construtores

    public Cliente(int idCliente, String CPF, String nomeCliente, String emailCliente) {
        this.idCliente = idCliente;
        this.CPF = CPF;
        this.nomeCliente = nomeCliente;
        this.emailCliente = emailCliente;
    }

    
    

    public Cliente(int idCliente, String CPF, String nomeCliente, String emailCliente, String fixoCliente,String idadeCliente, String ruaCliente, String celCliente, String cepCliente, String bairroCliente, String estadoCliente, String cidadeCliente, String numeroCliente, String genero) {
        this.idCliente = idCliente;
        this.CPF = CPF;
        this.nomeCliente = nomeCliente;
        this.emailCliente = emailCliente;
        this.fixoCliente = fixoCliente;
        this.idadeCliente = idadeCliente;
        this.ruaCliente = ruaCliente;
        this.celCliente = celCliente;
        this.cepCliente = cepCliente;
        this.bairroCliente = bairroCliente;
        this.estadoCliente = estadoCliente;
        this.cidadeCliente = cidadeCliente;
        this.numeroCliente = numeroCliente;
        this.genero = genero;
    }

    public Cliente(String CPF, String nomeCliente, String emailCliente, String fixoCliente, String idadeCliente, String ruaCliente, String celCliente, String cepCliente, String bairroCliente, String estadoCliente, String cidadeCliente, String numeroCliente, String genero) {
        this.CPF = CPF;
        this.nomeCliente = nomeCliente;
        this.emailCliente = emailCliente;
        this.fixoCliente = fixoCliente;
        this.idadeCliente = idadeCliente;
        this.ruaCliente = ruaCliente;
        this.celCliente = celCliente;
        this.cepCliente = cepCliente;
        this.bairroCliente = bairroCliente;
        this.estadoCliente = estadoCliente;
        this.cidadeCliente = cidadeCliente;
        this.numeroCliente = numeroCliente;
        this.genero = genero;
    }

    

    //getters e setters

    public int getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(int idCliente) {
        this.idCliente = idCliente;
    }

    public String getCPF() {
        return CPF;
    }

    public void setCPF(String CPF) {
        this.CPF = CPF;
    }

    public String getNomeCliente() {
        return nomeCliente;
    }

    public void setNomeCliente(String nomeCliente) {
        this.nomeCliente = nomeCliente;
    }

    public String getEmailCliente() {
        return emailCliente;
    }

    public void setEmailCliente(String emailCliente) {
        this.emailCliente = emailCliente;
    }

    public String getFixoCliente() {
        return fixoCliente;
    }

    public void setFixoCliente(String fixoCliente) {
        this.fixoCliente = fixoCliente;
    }

    public String getIdadeCliente() {
        return idadeCliente;
    }

    public void setIdadeCliente(String idadeCliente) {
        this.idadeCliente = idadeCliente;
    }

    public String getRuaCliente() {
        return ruaCliente;
    }

    public void setRuaCliente(String ruaCliente) {
        this.ruaCliente = ruaCliente;
    }

    public String getCelCliente() {
        return celCliente;
    }

    public void setCelCliente(String celCliente) {
        this.celCliente = celCliente;
    }

    public String getCepCliente() {
        return cepCliente;
    }

    public void setCepCliente(String cepCliente) {
        this.cepCliente = cepCliente;
    }

    public String getBairroCliente() {
        return bairroCliente;
    }

    public void setBairroCliente(String bairroCliente) {
        this.bairroCliente = bairroCliente;
    }

    public String getEstadoCliente() {
        return estadoCliente;
    }

    public void setEstadoCliente(String estadoCliente) {
        this.estadoCliente = estadoCliente;
    }

    public String getCidadeCliente() {
        return cidadeCliente;
    }

    public void setCidadeCliente(String cidadeCliente) {
        this.cidadeCliente = cidadeCliente;
    }

    public String getNumeroCliente() {
        return numeroCliente;
    }

    public void setNumeroCliente(String numeroCliente) {
        this.numeroCliente = numeroCliente;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }
    
    

}
