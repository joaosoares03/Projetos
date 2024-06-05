package com.mycompany.lojamusical.views;

import com.mycompany.lojamusical.dao.ProdutoDAO;
import com.mycompany.lojamusical.models.Produto;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JOptionPane;
import javax.swing.table.DefaultTableModel;

/**
 * Classe que adiciona e faz o controle dos produtos
 * 
 * @author João Victor, Guilherme e Gabriel
 */
public class TelaProduto extends javax.swing.JFrame {

    Produto objAlterar = null;

    public TelaProduto() {
        initComponents();
        ManipulaInterface("Navegar");

    }

    public void ManipulaInterface(String modo) {
        switch (modo) {

            case "Navegar" -> {
                btnNovo.setEnabled(true);
                btnSalvar.setEnabled(false);
                btnExcluir.setEnabled(false);
                btnAtualizar.setEnabled(true);
                btnEditar.setEnabled(true);
                txtNomeProduto.setEnabled(false);
                txtMarca.setEnabled(false);
                txtCodigoProduto.setEnabled(false);
                txtQuantidade.setEnabled(false);
                txtValor.setEnabled(false);

            }
            case "Novo" -> {
                btnNovo.setEnabled(false);
                btnSalvar.setEnabled(true);
                btnExcluir.setEnabled(false);
                btnAtualizar.setEnabled(true);
                btnEditar.setEnabled(true);
                txtNomeProduto.setEnabled(true);
                txtMarca.setEnabled(true);
                txtCodigoProduto.setEnabled(true);
                txtQuantidade.setEnabled(true);
                txtValor.setEnabled(true);

            }

            case "Editar" -> {
                btnNovo.setEnabled(true);
                btnSalvar.setEnabled(true);
                btnExcluir.setEnabled(true);
                btnEditar.setEnabled(false);
                btnAtualizar.setEnabled(true);
                txtNomeProduto.setEnabled(true);
                txtMarca.setEnabled(true);
                txtCodigoProduto.setEnabled(true);
                txtQuantidade.setEnabled(true);
                txtValor.setEnabled(true);

            }

            case "Excluir" -> {
                btnNovo.setEnabled(true);
                btnSalvar.setEnabled(false);
                btnExcluir.setEnabled(true);
                btnEditar.setEnabled(true);
                btnAtualizar.setEnabled(true);
                txtNomeProduto.setEnabled(false);
                txtMarca.setEnabled(false);
                txtCodigoProduto.setEnabled(false);
                txtQuantidade.setEnabled(false);
                txtValor.setEnabled(false);

            }
            case "Selecao" -> {
                btnNovo.setEnabled(true);
                btnSalvar.setEnabled(false);
                btnExcluir.setEnabled(true);
                btnEditar.setEnabled(true);
                btnAtualizar.setEnabled(true);
                txtNomeProduto.setEnabled(false);
                txtMarca.setEnabled(false);
                txtCodigoProduto.setEnabled(false);
                txtQuantidade.setEnabled(false);
                txtValor.setEnabled(false);

            }
            default ->
                JOptionPane.showMessageDialog(null, "Modo inválido");
        }

    }

    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jLabel8 = new javax.swing.JLabel();
        jScrollPane1 = new javax.swing.JScrollPane();
        tblProdutos = new javax.swing.JTable();
        jPanel3 = new javax.swing.JPanel();
        jPanel6 = new javax.swing.JPanel();
        txtNomeProduto = new javax.swing.JTextField();
        txtCodigoProduto = new javax.swing.JTextField();
        txtValor = new javax.swing.JTextField();
        txtMarca = new javax.swing.JTextField();
        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        jLabel3 = new javax.swing.JLabel();
        jLabel9 = new javax.swing.JLabel();
        jLabel4 = new javax.swing.JLabel();
        lblIDProduto = new javax.swing.JLabel();
        jPanel7 = new javax.swing.JPanel();
        txtQuantidade = new javax.swing.JTextField();
        jLabel14 = new javax.swing.JLabel();
        jPanel5 = new javax.swing.JPanel();
        jPanel4 = new javax.swing.JPanel();
        btnSalvar = new javax.swing.JButton();
        btnNovo = new javax.swing.JButton();
        btnExcluir = new javax.swing.JButton();
        btnEditar = new javax.swing.JButton();
        jPanel1 = new javax.swing.JPanel();
        jPesquisar = new javax.swing.JButton();
        btnAtualizar = new javax.swing.JButton();
        txtPesquisa = new javax.swing.JTextField();
        jPanel8 = new javax.swing.JPanel();
        jLabel5 = new javax.swing.JLabel();

        jLabel8.setFont(new java.awt.Font("Tahoma", 0, 48)); // NOI18N
        jLabel8.setForeground(new java.awt.Color(0, 204, 255));
        jLabel8.setText("Cadastro de Produtos");

        tblProdutos.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "ID", "Código do produto", "Nome", "Marca", "Valor", "Quantidade"
            }
        ) {
            Class[] types = new Class [] {
                java.lang.Object.class, java.lang.String.class, java.lang.String.class, java.lang.String.class, java.lang.String.class, java.lang.Object.class
            };

            public Class getColumnClass(int columnIndex) {
                return types [columnIndex];
            }
        });
        tblProdutos.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                tblProdutosMouseClicked(evt);
            }
            public void mouseReleased(java.awt.event.MouseEvent evt) {
                tblProdutosMouseReleased(evt);
            }
        });
        tblProdutos.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyReleased(java.awt.event.KeyEvent evt) {
                tblProdutosKeyReleased(evt);
            }
        });
        jScrollPane1.setViewportView(tblProdutos);

        jPanel3.setBorder(javax.swing.BorderFactory.createEtchedBorder());

        jPanel6.setBorder(javax.swing.BorderFactory.createEmptyBorder(1, 1, 1, 1));

        txtNomeProduto.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                txtNomeProdutoActionPerformed(evt);
            }
        });

        txtCodigoProduto.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                txtCodigoProdutoActionPerformed(evt);
            }
        });

        txtValor.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                txtValorActionPerformed(evt);
            }
        });

        jLabel1.setText("NOME DO PRODUTO");

        jLabel2.setText("CÓDIGO DO PRODUTO");

        jLabel3.setText("VALOR:");

        jLabel9.setText("MARCA");

        jLabel4.setText("ID:");

        javax.swing.GroupLayout jPanel6Layout = new javax.swing.GroupLayout(jPanel6);
        jPanel6.setLayout(jPanel6Layout);
        jPanel6Layout.setHorizontalGroup(
            jPanel6Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel6Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel6Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel2)
                    .addComponent(jLabel1, javax.swing.GroupLayout.Alignment.TRAILING)
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel6Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                        .addComponent(jLabel3)
                        .addComponent(jLabel9)))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGroup(jPanel6Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(txtMarca, javax.swing.GroupLayout.DEFAULT_SIZE, 235, Short.MAX_VALUE)
                    .addComponent(txtCodigoProduto, javax.swing.GroupLayout.Alignment.TRAILING)
                    .addComponent(txtValor, javax.swing.GroupLayout.Alignment.TRAILING)
                    .addComponent(txtNomeProduto, javax.swing.GroupLayout.Alignment.TRAILING))
                .addContainerGap())
            .addGroup(jPanel6Layout.createSequentialGroup()
                .addGap(102, 102, 102)
                .addComponent(jLabel4)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(lblIDProduto, javax.swing.GroupLayout.PREFERRED_SIZE, 120, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(128, Short.MAX_VALUE))
        );
        jPanel6Layout.setVerticalGroup(
            jPanel6Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel6Layout.createSequentialGroup()
                .addContainerGap(10, Short.MAX_VALUE)
                .addGroup(jPanel6Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(jLabel4, javax.swing.GroupLayout.DEFAULT_SIZE, 22, Short.MAX_VALUE)
                    .addComponent(lblIDProduto, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel6Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(txtNomeProduto, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel1))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel6Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(txtCodigoProduto, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel2))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel6Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(txtValor, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel3))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel6Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(txtMarca, javax.swing.GroupLayout.PREFERRED_SIZE, 28, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel9))
                .addGap(28, 28, 28))
        );

        jPanel7.setBorder(javax.swing.BorderFactory.createEmptyBorder(1, 1, 1, 1));

        txtQuantidade.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                txtQuantidadeActionPerformed(evt);
            }
        });

        jLabel14.setText("Quantidade");

        javax.swing.GroupLayout jPanel7Layout = new javax.swing.GroupLayout(jPanel7);
        jPanel7.setLayout(jPanel7Layout);
        jPanel7Layout.setHorizontalGroup(
            jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel7Layout.createSequentialGroup()
                .addGap(32, 32, 32)
                .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel14, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(txtQuantidade, javax.swing.GroupLayout.PREFERRED_SIZE, 84, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(73, Short.MAX_VALUE))
        );
        jPanel7Layout.setVerticalGroup(
            jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel7Layout.createSequentialGroup()
                .addComponent(jLabel14, javax.swing.GroupLayout.PREFERRED_SIZE, 20, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(txtQuantidade, javax.swing.GroupLayout.PREFERRED_SIZE, 32, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        javax.swing.GroupLayout jPanel3Layout = new javax.swing.GroupLayout(jPanel3);
        jPanel3.setLayout(jPanel3Layout);
        jPanel3Layout.setHorizontalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel3Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jPanel6, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel7, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addContainerGap())
        );
        jPanel3Layout.setVerticalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel3Layout.createSequentialGroup()
                .addGap(0, 0, Short.MAX_VALUE)
                .addComponent(jPanel6, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addGap(16, 16, 16)
                .addComponent(jPanel7, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGap(15, 15, 15))
        );

        jPanel5.setBorder(javax.swing.BorderFactory.createEmptyBorder(1, 1, 1, 1));

        jPanel4.setBorder(javax.swing.BorderFactory.createEmptyBorder(1, 1, 1, 1));

        btnSalvar.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagens/arrow-down.png"))); // NOI18N
        btnSalvar.setText("Salvar");
        btnSalvar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnSalvarActionPerformed(evt);
            }
        });

        btnNovo.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagens/user-add-outline.png"))); // NOI18N
        btnNovo.setText("Novo");
        btnNovo.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnNovoActionPerformed(evt);
            }
        });

        btnExcluir.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagens/times.png"))); // NOI18N
        btnExcluir.setText("Excluir");
        btnExcluir.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnExcluirActionPerformed(evt);
            }
        });

        btnEditar.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagens/th-list.png"))); // NOI18N
        btnEditar.setText("Editar");
        btnEditar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnEditarActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel4Layout = new javax.swing.GroupLayout(jPanel4);
        jPanel4.setLayout(jPanel4Layout);
        jPanel4Layout.setHorizontalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel4Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(btnEditar, javax.swing.GroupLayout.PREFERRED_SIZE, 108, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(btnNovo, javax.swing.GroupLayout.PREFERRED_SIZE, 126, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(btnSalvar, javax.swing.GroupLayout.PREFERRED_SIZE, 135, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(btnExcluir, javax.swing.GroupLayout.PREFERRED_SIZE, 147, javax.swing.GroupLayout.PREFERRED_SIZE))
        );

        jPanel4Layout.linkSize(javax.swing.SwingConstants.HORIZONTAL, new java.awt.Component[] {btnEditar, btnExcluir, btnNovo, btnSalvar});

        jPanel4Layout.setVerticalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel4Layout.createSequentialGroup()
                .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(btnSalvar, javax.swing.GroupLayout.PREFERRED_SIZE, 50, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(btnNovo, javax.swing.GroupLayout.PREFERRED_SIZE, 50, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(btnExcluir, javax.swing.GroupLayout.PREFERRED_SIZE, 50, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(btnEditar, javax.swing.GroupLayout.PREFERRED_SIZE, 48, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(0, 0, Short.MAX_VALUE))
        );

        jPanel1.setBorder(javax.swing.BorderFactory.createEmptyBorder(1, 1, 1, 1));

        jPesquisar.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagens/zoom.png"))); // NOI18N
        jPesquisar.setText("Pesquisar");
        jPesquisar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jPesquisarActionPerformed(evt);
            }
        });

        btnAtualizar.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagens/th-list-outline.png"))); // NOI18N
        btnAtualizar.setText("Recarregar Tabela");
        btnAtualizar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnAtualizarActionPerformed(evt);
            }
        });

        txtPesquisa.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                txtPesquisaActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(txtPesquisa, javax.swing.GroupLayout.PREFERRED_SIZE, 580, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jPesquisar, javax.swing.GroupLayout.PREFERRED_SIZE, 118, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(btnAtualizar, javax.swing.GroupLayout.PREFERRED_SIZE, 124, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap())
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jPesquisar)
                    .addComponent(btnAtualizar)
                    .addComponent(txtPesquisa, javax.swing.GroupLayout.PREFERRED_SIZE, 31, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap())
        );

        javax.swing.GroupLayout jPanel5Layout = new javax.swing.GroupLayout(jPanel5);
        jPanel5.setLayout(jPanel5Layout);
        jPanel5Layout.setHorizontalGroup(
            jPanel5Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
            .addComponent(jPanel4, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );
        jPanel5Layout.setVerticalGroup(
            jPanel5Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel5Layout.createSequentialGroup()
                .addComponent(jPanel4, javax.swing.GroupLayout.PREFERRED_SIZE, 51, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        jPanel8.setBorder(javax.swing.BorderFactory.createEtchedBorder());

        jLabel5.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagens/1291777_price_price tag_pricing_product_icon.png"))); // NOI18N

        javax.swing.GroupLayout jPanel8Layout = new javax.swing.GroupLayout(jPanel8);
        jPanel8.setLayout(jPanel8Layout);
        jPanel8Layout.setHorizontalGroup(
            jPanel8Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel8Layout.createSequentialGroup()
                .addGap(14, 14, 14)
                .addComponent(jLabel5, javax.swing.GroupLayout.PREFERRED_SIZE, 149, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(15, Short.MAX_VALUE))
        );
        jPanel8Layout.setVerticalGroup(
            jPanel8Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jLabel5, javax.swing.GroupLayout.DEFAULT_SIZE, 168, Short.MAX_VALUE)
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jScrollPane1)
                    .addComponent(jPanel5, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addGroup(layout.createSequentialGroup()
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel8, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .addGroup(layout.createSequentialGroup()
                                .addComponent(jPanel3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(142, 142, 142)))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jPanel8, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(119, 119, 119)))
                .addContainerGap())
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(layout.createSequentialGroup()
                        .addComponent(jLabel8)
                        .addGap(5, 5, 5)
                        .addComponent(jPanel3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                        .addContainerGap()
                        .addComponent(jPanel8, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(32, 32, 32)))
                .addComponent(jPanel5, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 281, Short.MAX_VALUE)
                .addContainerGap())
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void tblProdutosMouseReleased(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tblProdutosMouseReleased

    }//GEN-LAST:event_tblProdutosMouseReleased

    private void tblProdutosMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tblProdutosMouseClicked

        int row = tblProdutos.getSelectedRow();
        if (row != -1) {
            // Obtém os dados da linha selecionada
            String id = tblProdutos.getValueAt(row, 0).toString();
            String cod = tblProdutos.getValueAt(row, 1).toString();
            String nome = tblProdutos.getValueAt(row, 2).toString();
            String marca = tblProdutos.getValueAt(row, 3).toString();
            String valor = tblProdutos.getValueAt(row, 4).toString();
            String qtd = tblProdutos.getValueAt(row, 5).toString();

            // Preenche os campos de texto com os dados obtidos
            lblIDProduto.setText(id);
            txtNomeProduto.setText(nome);
            txtCodigoProduto.setText(cod);
            txtValor.setText(valor);
            txtMarca.setText(marca);
            txtQuantidade.setText(qtd);

        }
        ManipulaInterface("Selecao");
    }//GEN-LAST:event_tblProdutosMouseClicked

    private void tblProdutosKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_tblProdutosKeyReleased

    }//GEN-LAST:event_tblProdutosKeyReleased

    private void txtQuantidadeActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_txtQuantidadeActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_txtQuantidadeActionPerformed

    private void txtCodigoProdutoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_txtCodigoProdutoActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_txtCodigoProdutoActionPerformed

    private void btnAtualizarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnAtualizarActionPerformed

        atualizarTabela();
    }//GEN-LAST:event_btnAtualizarActionPerformed

    private void btnSalvarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnSalvarActionPerformed

        // Verifica se algum campo está vazio
        boolean camposVazios = txtNomeProduto.getText().isEmpty() || txtMarca.getText().isEmpty()
                || txtCodigoProduto.getText().isEmpty() || txtQuantidade.getText().isEmpty()
                || txtValor.getText().isEmpty();

        if (camposVazios) {
            JOptionPane.showMessageDialog(rootPane, "Todos os campos devem ser preenchidos.");
            return;
        }

        try {
            int cod = Integer.parseInt(txtCodigoProduto.getText());

            // Verifica se o código do produto já existe (somente para inclusão)
            if (objAlterar == null && ProdutoDAO.codigoExiste(cod)) {
                JOptionPane.showMessageDialog(rootPane, "Código do produto já existe.");
                return;
            }

            if (objAlterar != null) {
                // Modo de alteração

                // Resgate dos dados alterados
                String nome = txtNomeProduto.getText();
                String marca = txtMarca.getText();
                int qtdProduto = Integer.parseInt(txtQuantidade.getText());
                float valor = Float.parseFloat(txtValor.getText());

                objAlterar.setNomeProduto(nome);
                objAlterar.setMarcaProduto(marca);
                objAlterar.setQtdProduto(qtdProduto);
                objAlterar.setCodProduto(cod);
                objAlterar.setValorProtudo(valor);

                // Chamando a DAO para alterar
                boolean retornoAlteracao = ProdutoDAO.alterar(objAlterar);

                if (retornoAlteracao) {
                    JOptionPane.showMessageDialog(rootPane, "Sucesso ao alterar!");

                    // Limpando campos da tela de cadastro
                    objAlterar = null;

                    lblIDProduto.setText("");
                    txtNomeProduto.setText("");
                    txtMarca.setText("");
                    txtQuantidade.setText("");
                    txtValor.setText("");
                    txtCodigoProduto.setText("");
                } else {
                    JOptionPane.showMessageDialog(rootPane, "Falha ao alterar!");
                }
            } else {
                // Modo de inclusão
                // Passando os dados da interface para um objeto

                String nome = txtNomeProduto.getText();
                String marca = txtMarca.getText();
                int qtdProduto = Integer.parseInt(txtQuantidade.getText());
                float valor = Float.parseFloat(txtValor.getText());

                Produto objCadastro = new Produto(cod, nome, marca, qtdProduto, valor);

                // Passando o objeto para o banco de dados
                boolean retornoBanco = ProdutoDAO.salvar(objCadastro);

                if (retornoBanco) {
                    JOptionPane.showMessageDialog(rootPane, "Produto cadastrado com sucesso!");

                    lblIDProduto.setText("");
                    txtNomeProduto.setText("");
                    txtMarca.setText("");
                    txtQuantidade.setText("");
                    txtValor.setText("");
                    txtCodigoProduto.setText("");
                } else {
                    JOptionPane.showMessageDialog(rootPane, "Falha ao Cadastrar!");
                }
            }
        } catch (NumberFormatException e) {
            JOptionPane.showMessageDialog(rootPane, "Código, Quantidade e Valor devem ser numéricos.");
        } catch (SQLException ex) {
            Logger.getLogger(TelaProduto.class.getName()).log(Level.SEVERE, null, ex);
        }


    }//GEN-LAST:event_btnSalvarActionPerformed

    private void btnNovoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnNovoActionPerformed

        lblIDProduto.setText("");
        txtNomeProduto.setText("");
        txtCodigoProduto.setText("");
        txtValor.setText("");
        txtMarca.setText("");
        txtQuantidade.setText("");

        btnSalvar.setEnabled(true);
        btnExcluir.setEnabled(true);
        btnAtualizar.setEnabled(true);

        ManipulaInterface("Novo");
    }//GEN-LAST:event_btnNovoActionPerformed

    private void btnExcluirActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnExcluirActionPerformed

        int linhaSelecionada = tblProdutos.getSelectedRow();

        if (linhaSelecionada >= 0) {
            //Chamando DAO para excluir
            DefaultTableModel modeloProdutos = (DefaultTableModel) tblProdutos.getModel();
            int idExcluir = Integer.parseInt(modeloProdutos.getValueAt(linhaSelecionada, 0).toString());

            boolean retorno = ProdutoDAO.excluir(idExcluir);

            if (retorno) {
                JOptionPane.showMessageDialog(rootPane, "Produto excluido com sucesso!");

                atualizarTabela();
            } else {
                JOptionPane.showMessageDialog(rootPane, "Falaha na exclusão!");
            }
        }
        ManipulaInterface("Excluir");

    }//GEN-LAST:event_btnExcluirActionPerformed

    public void atualizarTabela() {

        ArrayList<Produto> lista = ProdutoDAO.listar();
        DefaultTableModel modeloTabela = (DefaultTableModel) tblProdutos.getModel();

        modeloTabela.setRowCount(0);

        for (Produto item : lista) {

            modeloTabela.addRow(new String[]{
                String.valueOf(item.getIdProduto()),
                String.valueOf(item.getCodProduto()),
                item.getNomeProduto(),
                item.getMarcaProduto(),
                String.valueOf(item.getValorProtudo()),
                String.valueOf(item.getQtdProduto())
            });

        }
    }

    private void jPesquisarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jPesquisarActionPerformed

        String nome = txtPesquisa.getText();

        DefaultTableModel model = (DefaultTableModel) tblProdutos.getModel();

        Produto objRetorno = ProdutoDAO.buscarPorNome(nome);        
        if (objRetorno != null) {
            // Limpa a tabela antes de adicionar os resultados da pesquisa
            model.setRowCount(0);

            // Adiciona os valores do objeto Produto à tabela
            model.addRow(new Object[]{objRetorno.getIdProduto(), objRetorno.getCodProduto(), objRetorno.getNomeProduto(), objRetorno.getMarcaProduto(),objRetorno.getValorProtudo(), objRetorno.getQtdProduto() });
        } else {
            JOptionPane.showMessageDialog(null, "Nenhum produto encontrado com esse nome.");
        }


    }//GEN-LAST:event_jPesquisarActionPerformed

    private void txtNomeProdutoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_txtNomeProdutoActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_txtNomeProdutoActionPerformed

    private void txtValorActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_txtValorActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_txtValorActionPerformed

    private void btnEditarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnEditarActionPerformed

        DefaultTableModel modeloProdutos = (DefaultTableModel) tblProdutos.getModel();

        int linhaSelecionada = tblProdutos.getSelectedRow();

        if (linhaSelecionada >= 0) {

            int id = Integer.parseInt(tblProdutos.getValueAt(linhaSelecionada, 0).toString());
            int codProduto = Integer.parseInt(tblProdutos.getValueAt(linhaSelecionada, 1).toString());
            String nomeProduto = modeloProdutos.getValueAt(linhaSelecionada, 2).toString();
            String marcaProduto = modeloProdutos.getValueAt(linhaSelecionada, 3).toString();
            float valorProduto = Float.parseFloat(tblProdutos.getValueAt(linhaSelecionada, 4).toString());
            int qtdProduto = Integer.parseInt(tblProdutos.getValueAt(linhaSelecionada, 5).toString());

            objAlterar = new Produto(id, codProduto, nomeProduto, marcaProduto, qtdProduto, valorProduto);

            lblIDProduto.setText(String.valueOf(objAlterar.getIdProduto()));
            txtCodigoProduto.setText(String.valueOf(objAlterar.getCodProduto()));
            txtNomeProduto.setText(objAlterar.getNomeProduto());
            txtMarca.setText(objAlterar.getMarcaProduto());
            txtQuantidade.setText(String.valueOf(objAlterar.getQtdProduto()));
            txtValor.setText(String.valueOf(objAlterar.getValorProtudo()));

            ManipulaInterface("Editar");

        } else {
            JOptionPane.showMessageDialog(rootPane, "Selecione uma linha da tabela!");
        }

    }//GEN-LAST:event_btnEditarActionPerformed

    private void txtPesquisaActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_txtPesquisaActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_txtPesquisaActionPerformed

    /**
     * @param args the command line arguments
     */
    public static void main(String args[]) {
        /* Set the Nimbus look and feel */
        //<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /* If Nimbus (introduced in Java SE 6) is not available, stay with the default look and feel.
         * For details see http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html 
         */
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(TelaProduto.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(TelaProduto.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(TelaProduto.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(TelaProduto.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>
        //</editor-fold>
        //</editor-fold>
        //</editor-fold>
        //</editor-fold>
        //</editor-fold>
        //</editor-fold>
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new TelaProduto().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton btnAtualizar;
    private javax.swing.JButton btnEditar;
    private javax.swing.JButton btnExcluir;
    private javax.swing.JButton btnNovo;
    private javax.swing.JButton btnSalvar;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel14;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JLabel jLabel9;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JPanel jPanel4;
    private javax.swing.JPanel jPanel5;
    private javax.swing.JPanel jPanel6;
    private javax.swing.JPanel jPanel7;
    private javax.swing.JPanel jPanel8;
    private javax.swing.JButton jPesquisar;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JLabel lblIDProduto;
    private javax.swing.JTable tblProdutos;
    private javax.swing.JTextField txtCodigoProduto;
    private javax.swing.JTextField txtMarca;
    private javax.swing.JTextField txtNomeProduto;
    private javax.swing.JTextField txtPesquisa;
    private javax.swing.JTextField txtQuantidade;
    private javax.swing.JTextField txtValor;
    // End of variables declaration//GEN-END:variables

}
