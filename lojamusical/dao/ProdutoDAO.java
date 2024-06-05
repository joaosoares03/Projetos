package com.mycompany.lojamusical.dao;

import static com.mycompany.lojamusical.dao.ClienteDAO.URL;
import static com.mycompany.lojamusical.dao.ClienteDAO.login;
import static com.mycompany.lojamusical.dao.ClienteDAO.senha;
import com.mycompany.lojamusical.models.Cliente;
import com.mycompany.lojamusical.models.Produto;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JOptionPane;

/**
 *
 * @author niuzi
 */
public class ProdutoDAO {

    static String URL = "jdbc:mysql://localhost:3306/lojamusical";
    static String login = "root";
    static String senha = "joao0303";

    private static final ArrayList<Produto> produto = new ArrayList<>();

    public static boolean codigoExiste(int cod) throws SQLException {
        Connection conexao = null;
        boolean codigoExiste = false;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conexao = DriverManager.getConnection(URL, login, senha);

            PreparedStatement instrucaoSQL = conexao.prepareStatement(
                    "SELECT COUNT(*) FROM Produto WHERE codProduto = ?"
            );
            instrucaoSQL.setInt(1, cod);

            ResultSet rs = instrucaoSQL.executeQuery();

            if (rs.next()) {
                codigoExiste = rs.getInt(1) > 0;
            }

        } catch (ClassNotFoundException e) {
            System.out.println("Driver não encontrado");
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null, "Erro ao acessar o banco de dados: " + e.getMessage(), "Erro", JOptionPane.ERROR_MESSAGE);
        } finally {
            if (conexao != null) {
                try {
                    conexao.close();
                } catch (SQLException ex) {
                    Logger.getLogger(ProdutoDAO.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }

        return codigoExiste;
    }

    public static boolean salvar(Produto obj) throws SQLException {
        Connection conexao = null;
        boolean retorno = false;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conexao = DriverManager.getConnection(URL, login, senha);

            PreparedStatement instrucaoSQL = conexao.prepareStatement(
                    "INSERT INTO Produto (codProduto, nomeProduto, marcaProduto, qtdProduto, valorProduto) VALUES (?, ?, ?, ?, ?);"
            );
            instrucaoSQL.setInt(1, obj.getCodProduto());
            instrucaoSQL.setString(2, obj.getNomeProduto());
            instrucaoSQL.setString(3, obj.getMarcaProduto());
            instrucaoSQL.setDouble(4, obj.getQtdProduto());
            instrucaoSQL.setFloat(5, obj.getValorProtudo());

            int linhasAfetadas = instrucaoSQL.executeUpdate();

            if (linhasAfetadas > 0) {
                retorno = true;
            }

        } catch (ClassNotFoundException e) {
            System.out.println("Driver não encontrado");
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null, "Erro ao acessar o banco de dados: " + e.getMessage(), "Erro", JOptionPane.ERROR_MESSAGE);
        } catch (NumberFormatException e) {
            // Tratamento da exceção NumberFormatException
            JOptionPane.showMessageDialog(null, "Código do produto deve ser um número inteiro.", "Erro de Formato", JOptionPane.ERROR_MESSAGE);

        } finally {
            if (conexao != null) {
                try {
                    conexao.close();
                } catch (SQLException ex) {
                    Logger.getLogger(ProdutoDAO.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }

        return retorno;

    }

    public static ArrayList<Produto> listar() {

        ArrayList<Produto> listaProduto = new ArrayList<>();
        Connection conexao = null;
        ResultSet rs = null;

        try {

            //Carregar o drive do MySql
            Class.forName("com.mysql.cj.jdbc.Driver");
            //Fazendo conexão com o banco
            conexao = DriverManager.getConnection(URL, login, senha);

            //Preparando o SQL
            PreparedStatement instrucaoSQL = conexao.prepareStatement(
                    "SELECT * FROM produto;"
            );

            //Executar comando 
            rs = instrucaoSQL.executeQuery();

            if (rs != null) {

                while (rs.next()) {

                    int id = rs.getInt("idProduto");
                    int codProduto = rs.getInt("codProduto");
                    String nome = rs.getString("nomeProduto");
                    String marca = rs.getString("marcaProduto");
                    int qtdProduto = rs.getInt("qtdProduto");
                    float valor = rs.getFloat("valorProduto");

                    Produto item = new Produto(id, codProduto, nome, marca, qtdProduto, valor);
                    listaProduto.add(item);

                }
            }

        } catch (Exception e) {
            listaProduto = null;
        } finally {

            if (conexao != null) {
                try {
                    conexao.close();
                } catch (SQLException ex) {
                    Logger.getLogger(ClienteDAO.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (rs != null) {
                try {
                    rs.close();
                } catch (SQLException ex) {
                    Logger.getLogger(ClienteDAO.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

        }
        return listaProduto;
    }

    public static boolean alterar(Produto obj) {
        Connection conexao = null;
        boolean retorno = false;

        try {

            //Carregar o drive do MySql
            Class.forName("com.mysql.cj.jdbc.Driver");
            //Fazendo conexão com o banco
            conexao = DriverManager.getConnection(URL, login, senha);

            //Preparando o SQL
            PreparedStatement instrucaoSQL = conexao.prepareStatement(
                    "UPDATE produto SET codProduto=?,nomeProduto=?, marcaProduto=?, qtdProduto=?, valorProduto=? WHERE idProduto=?; "
            );
            instrucaoSQL.setInt(1, obj.getCodProduto());
            instrucaoSQL.setString(2, obj.getNomeProduto());
            instrucaoSQL.setString(3, obj.getMarcaProduto());
            instrucaoSQL.setDouble(4, obj.getQtdProduto());
            instrucaoSQL.setFloat(5, obj.getValorProtudo());
            instrucaoSQL.setInt(6, obj.getIdProduto());

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
                    "DELETE from produto WHERE idProduto = ?; "
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

    public static Produto buscarPorNome(String nomeBuscar) {
    Produto retorno = null;
    Connection conexao = null;
    ResultSet rs = null;

    try {
        // Carregar o driver do MySql
        Class.forName("com.mysql.cj.jdbc.Driver");
        // Fazendo conexão com o banco
        conexao = DriverManager.getConnection(URL, login, senha);

        // Preparando o SQL
        PreparedStatement instrucaoSQL = conexao.prepareStatement(
                "SELECT * FROM produto WHERE nomeProduto = ?"
        );
        instrucaoSQL.setString(1, nomeBuscar);

        rs = instrucaoSQL.executeQuery();

        if (rs != null) {
            while (rs.next()) {
                int id = rs.getInt("idProduto");
                String nome = rs.getString("nomeProduto");
                // Adicione aqui a leitura de outros atributos
                // Você precisa recuperar todos os atributos do produto aqui
                // e então criar o objeto Produto com todos os atributos.
                // Exemplo:
                int codProduto = rs.getInt("codProduto");
                String marca = rs.getString("marcaProduto");
                int qtdProduto = rs.getInt("qtdProduto");
                float valor = rs.getFloat("valorProduto");

                retorno = new Produto(id, codProduto, nome, marca, qtdProduto, valor);
            }
        }
    } catch (Exception e) {
        e.printStackTrace();
        retorno = null;
    } finally {
        // ...
    }

    return retorno;
}


}
