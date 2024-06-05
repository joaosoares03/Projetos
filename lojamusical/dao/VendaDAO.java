/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.lojamusical.dao;

import static com.mycompany.lojamusical.dao.ClienteDAO.URL;
import static com.mycompany.lojamusical.dao.ClienteDAO.login;
import static com.mycompany.lojamusical.dao.ClienteDAO.senha;
import com.mycompany.lojamusical.models.ItemVenda;
import com.mycompany.lojamusical.models.Venda;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author PC - ANA CAROLINA
 */
public class VendaDAO {

    static String URL = "jdbc:mysql://localhost:3306/lojamusical";
    static String login = "root";
    static String senha = "joao0303";

   public static boolean salvar(Venda obj) {
    Connection conexao = null;
    boolean retorno = false;

    try {
        Class.forName("com.mysql.cj.jdbc.Driver");
        conexao = DriverManager.getConnection(URL, login, senha);

        // Inicia uma transação
        conexao.setAutoCommit(false);

        // Inserir a venda na tabela Venda
        String sql = "INSERT INTO Venda (dataVenda, valorVenda, idCliente) VALUES(?,?,?)";
        PreparedStatement comandoSQL = conexao.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
        comandoSQL.setDate(1, new java.sql.Date(obj.getDataVenda().getTime()));
        comandoSQL.setFloat(2, obj.getValorVenda());
        comandoSQL.setInt(3, obj.getIdCliente());

        int linhasAfetadas = comandoSQL.executeUpdate();

        if (linhasAfetadas > 0) {
            ResultSet rs = comandoSQL.getGeneratedKeys();
            if (rs.next()) {
                int idVenda = rs.getInt(1);
                boolean sucesso = true;

                // Inserir cada item na tabela ItemVenda e atualizar o estoque
                for (ItemVenda item : obj.getListaItens()) {
                    // Inserir item na tabela ItemVenda
                    String sqlItem = "INSERT INTO ItemVenda (idVenda, idProduto, qtdProduto, valorUnitario) VALUES (?,?,?,?)";
                    PreparedStatement comandoSQLItem = conexao.prepareStatement(sqlItem);
                    comandoSQLItem.setInt(1, idVenda);
                    comandoSQLItem.setInt(2, item.getIdProduto());
                    comandoSQLItem.setInt(3, item.getQtdProduto());
                    comandoSQLItem.setFloat(4, item.getValorUnitario());

                    int linhasItem = comandoSQLItem.executeUpdate();
                    if (linhasItem <= 0) {
                        sucesso = false;
                        break;
                    }

                    // Atualizar o estoque do produto na tabela Produto
                    String sqlEstoque = "UPDATE Produto SET qtdProduto = qtdProduto - ? WHERE idProduto = ?";
                    PreparedStatement comandoSQLEstoque = conexao.prepareStatement(sqlEstoque);
                    comandoSQLEstoque.setInt(1, item.getQtdProduto());
                    comandoSQLEstoque.setInt(2, item.getIdProduto());

                    int linhasEstoque = comandoSQLEstoque.executeUpdate();
                    if (linhasEstoque <= 0) {
                        sucesso = false;
                        break;
                    }
                }

                if (sucesso) {
                    conexao.commit();
                    retorno = true;
                } else {
                    conexao.rollback();
                }
            }
        }
    } catch (Exception e) {
        try {
            if (conexao != null) {
                conexao.rollback();
            }
        } catch (SQLException ex) {
            Logger.getLogger(VendaDAO.class.getName()).log(Level.SEVERE, null, ex);
        }
        e.printStackTrace();
    } finally {
        if (conexao != null) {
            try {
                conexao.setAutoCommit(true);
                conexao.close();
            } catch (SQLException ex) {
                Logger.getLogger(VendaDAO.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    return retorno;
}


    public static boolean excluir(int idExcluir) {
        Connection conexao = null;
        boolean retorno = false;

        try {

            //Carregar o drive do MySql
            Class.forName("com.mysql.cj.jdbc.Driver");
            //Fazendo conexão com o banco
            conexao = DriverManager.getConnection(URL, login, senha);

            //Preparando o SQL
            PreparedStatement instrucaoSQL = conexao.prepareStatement(
                    "DELETE from venda WHERE idProduto = ?; "
            );

            instrucaoSQL.setInt(1, idExcluir);

            //Executando o comando
            int linhasAfetadas = instrucaoSQL.executeUpdate();

            if (linhasAfetadas > 0) {
                retorno = true;
            }

        } catch (ClassNotFoundException e) {
            System.out.println("Driver não encontrado");
        } catch (SQLException e) {
            System.out.println("Erro ao conectar ao banco de dados: " + e.getMessage());
            e.printStackTrace(); // Exibe o stack trace completo para depuração
        } finally {
            if (conexao != null) {
                try {
                    conexao.close();
                } catch (SQLException ex) {
                    Logger.getLogger(ClienteDAO.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }

        return retorno;

    }
}
