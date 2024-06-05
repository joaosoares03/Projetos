package com.mycompany.lojamusical.dao;

import com.mycompany.lojamusical.models.Cliente;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author niuzi
 */
public class ClienteDAO {

    static String URL = "jdbc:mysql://localhost:3306/lojamusical";
    static String login = "root";
    static String senha = "joao0303";

    public static boolean salvar(Cliente obj) {
        Connection conexao = null;
        boolean retorno = false;

        try {

            //Carregar o drive do MySql
            Class.forName("com.mysql.cj.jdbc.Driver");
            //Fazendo conexão com o banco
            conexao = DriverManager.getConnection(URL, login, senha);

            //Preparando o SQL
            PreparedStatement instrucaoSQL = conexao.prepareStatement(
                    "INSERT INTO Cliente (CPF, nomeCliente, emailCliente, fixoCliente, idadeCliente,ruaCliente, celCliente, cepCliente, bairroCliente, estadoCliente, cidadeCliente,numeroCliente, genero) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);"
            );
            instrucaoSQL.setString(1, obj.getCPF());
            instrucaoSQL.setString(2, obj.getNomeCliente());
            instrucaoSQL.setString(3, obj.getEmailCliente());
            instrucaoSQL.setString(4, obj.getFixoCliente());
            instrucaoSQL.setString(5, obj.getIdadeCliente());
            instrucaoSQL.setString(6, obj.getRuaCliente());
            instrucaoSQL.setString(7, obj.getCelCliente());
            instrucaoSQL.setString(8, obj.getCepCliente());
            instrucaoSQL.setString(9, obj.getBairroCliente());
            instrucaoSQL.setString(10, obj.getEstadoCliente());
            instrucaoSQL.setString(11, obj.getCidadeCliente());
            instrucaoSQL.setString(12, obj.getNumeroCliente());
            instrucaoSQL.setString(13, obj.getGenero());

            //Executando o comando
            int linhasAfetadas = instrucaoSQL.executeUpdate();

            if (linhasAfetadas > 0) {
                retorno = true;
            }

        } catch (ClassNotFoundException e) {
            System.out.println("Driver não encontrado");
        } catch (SQLException e) {
            System.out.println("Erro ao conectar ao banco de dados: " + e.getMessage());

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

    public static ArrayList<Cliente> listar() {

        ArrayList<Cliente> listaRetorno = new ArrayList<>();
        Connection conexao = null;
        ResultSet rs = null;

        try {

            //Carregar o drive do MySql
            Class.forName("com.mysql.cj.jdbc.Driver");
            //Fazendo conexão com o banco
            conexao = DriverManager.getConnection(URL, login, senha);

            //Preparando o SQL
            PreparedStatement instrucaoSQL = conexao.prepareStatement(
                    "SELECT * FROM cliente;"
            );

            //Executar comando 
            rs = instrucaoSQL.executeQuery();

            if (rs != null) {

                while (rs.next()) {

                    int id = rs.getInt("idCliente");
                    String cpf = rs.getString("CPF");
                    String nome = rs.getString("nomeCliente");
                    String email = rs.getString("emailCliente");
                    String fixo = rs.getString("fixoCliente");
                    String idade = rs.getString("idadeCliente");
                    String rua = rs.getString("ruaCliente");
                    String cel = rs.getString("celCliente");
                    String cep = rs.getString("cepCliente");
                    String bairro = rs.getString("bairroCliente");
                    String estado = rs.getString("estadoCliente");
                    String cidade = rs.getString("cidadeCliente");
                    String numero = rs.getString("numeroCliente");
                    String genero = rs.getString("genero");

                    Cliente item = new Cliente(id, cpf, nome, email, fixo, idade, rua, cel, cep, bairro, estado, cidade, numero, genero);
                    listaRetorno.add(item);

                }
            }

        } catch (Exception e) {
            listaRetorno = null;
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
        return listaRetorno;
    }

    public static Cliente buscarPorCPF(String cpfBuscar) {
        Cliente retorno = null;
        Connection conexao = null;
        ResultSet rs = null;

        try {

            //Carregar o drive do MySql
            Class.forName("com.mysql.cj.jdbc.Driver");
            //Fazendo conexão com o banco
            conexao = DriverManager.getConnection(URL, login, senha);

            //Preparando o SQL
            PreparedStatement instrucaoSQL = conexao.prepareStatement(
                    "SELECT * FROM cliente WHERE CPF = ?"
            );
            instrucaoSQL.setString(1, cpfBuscar);

            rs = instrucaoSQL.executeQuery();

            if (rs != null) {
                while (rs.next()) {
                    int id = rs.getInt("idCliente");
                    String nome = rs.getString("nomeCliente");
                    String cpf = rs.getString("CPF");
                    String email = rs.getString("emailCliente");

                    retorno = new Cliente(id, cpf, nome, email);
                }

            }
        } catch (Exception e) {
            retorno = null;
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
            return retorno;
        }
    }

    public static ArrayList<Cliente> buscarPorNomeOuCpf(String nomeOuCpf) {
        ArrayList<Cliente> clientesEncontrados = new ArrayList<>();
        Connection conexao = null;
        ResultSet rs = null;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conexao = DriverManager.getConnection(URL, login, senha);

            String query = "SELECT * FROM Cliente WHERE nomeCliente LIKE ? OR CPF = ?";
            PreparedStatement ps = conexao.prepareStatement(query);
            ps.setString(1, "%" + nomeOuCpf + "%");
            ps.setString(2, nomeOuCpf);

            rs = ps.executeQuery();

            while (rs.next()) {
                int id = rs.getInt("idCliente");
                    String cpf = rs.getString("CPF");
                    String nome = rs.getString("nomeCliente");
                    String email = rs.getString("emailCliente");
                    String fixo = rs.getString("fixoCliente");
                    String idade = rs.getString("idadeCliente");
                    String rua = rs.getString("ruaCliente");
                    String cel = rs.getString("celCliente");
                    String cep = rs.getString("cepCliente");
                    String bairro = rs.getString("bairroCliente");
                    String estado = rs.getString("estadoCliente");
                    String cidade = rs.getString("cidadeCliente");
                    String numero = rs.getString("numeroCliente");
                    String genero = rs.getString("genero");

                Cliente cliente = new Cliente(id, cpf, nome, email, fixo, idade, rua, cel, cep, bairro, estado, cidade, numero, genero);
                clientesEncontrados.add(cliente);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (conexao != null) {
                try {
                    conexao.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        return clientesEncontrados;
    }

    public static boolean alterar(Cliente obj) {
        Connection conexao = null;
        boolean retorno = false;

        try {

            //Carregar o drive do MySql
            Class.forName("com.mysql.cj.jdbc.Driver");
            //Fazendo conexão com o banco
            conexao = DriverManager.getConnection(URL, login, senha);

            //Preparando o SQL
            PreparedStatement instrucaoSQL = conexao.prepareStatement(
                    "UPDATE cliente SET nomeCliente=?,emailCliente=?, fixoCliente=?, idadeCliente=?, ruaCliente=?, celCliente=?, cepCliente=?, bairroCliente=?, estadoCliente=?, cidadeCliente=?, numeroCliente=?, genero=? WHERE idCliente=?; "
            );
            instrucaoSQL.setString(1, obj.getNomeCliente());
            instrucaoSQL.setString(2, obj.getEmailCliente());
            instrucaoSQL.setString(3, obj.getFixoCliente());
            instrucaoSQL.setString(4, obj.getIdadeCliente());
            instrucaoSQL.setString(5, obj.getRuaCliente());
            instrucaoSQL.setString(6, obj.getCelCliente());
            instrucaoSQL.setString(7, obj.getCepCliente());
            instrucaoSQL.setString(8, obj.getBairroCliente());
            instrucaoSQL.setString(9, obj.getEstadoCliente());
            instrucaoSQL.setString(10, obj.getCidadeCliente());
            instrucaoSQL.setString(11, obj.getNumeroCliente());
            instrucaoSQL.setString(12, obj.getGenero());
            instrucaoSQL.setInt(13, obj.getIdCliente());

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
                    "DELETE from cliente WHERE idCliente = ?; "
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
