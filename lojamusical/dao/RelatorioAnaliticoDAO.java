/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.lojamusical.dao;

import com.mycompany.lojamusical.models.RelatorioAnalitico;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

/**
 *
 * @author PC - ANA CAROLINA
 */
public class RelatorioAnaliticoDAO {

    static String URL = "jdbc:mysql://localhost:3306/lojamusical";
    static String login = "root";
    static String senha = "joao0303";

    public static ArrayList<RelatorioAnalitico> listarPorVenda(int idVenda) {
        Connection conexao = null;
        ResultSet rs = null;
        ArrayList<RelatorioAnalitico> listaRetorno = new ArrayList<>();

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conexao = DriverManager.getConnection(URL, login, senha);

            String sql = "SELECT ItemVenda.idProduto, Produto.nomeProduto, ItemVenda.valorUnitario, ItemVenda.qtdProduto FROM ItemVenda "
                    + "     INNER JOIN Produto ON ItemVenda.idProduto = Produto.idProduto "
                    + "     WHERE idVenda = ?";
            PreparedStatement comandoSQL = conexao.prepareStatement(sql);
            comandoSQL.setInt(1, idVenda);

            rs = comandoSQL.executeQuery();

            if (rs != null) {

                while (rs.next()) {

                    RelatorioAnalitico item = null;

                    
                    String nomeProduto = rs.getString("nomeProduto");
                    float valorUnitario = rs.getFloat("valorUnitario");
                    int qtdProduto = rs.getInt("qtdProduto");

                    item = new RelatorioAnalitico(nomeProduto, qtdProduto, valorUnitario);

                    listaRetorno.add(item);
                }
            }

        } catch (Exception e) {
            listaRetorno = null;
        }
        return listaRetorno;
    }
}
