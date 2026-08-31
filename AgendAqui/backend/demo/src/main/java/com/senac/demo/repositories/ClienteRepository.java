package com.senac.demo.repositories;

import com.senac.demo.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;  
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    
    // Buscar cliente por email
    Optional<Cliente> findByEmail(String email);
    
    // Buscar cliente por CPF
    Optional<Cliente> findByCpf(String cpf);
    
    // Buscar cliente por email e senha (para login)
    Optional<Cliente> findByEmailAndSenha(String email, String senha);
    
    // Buscar clientes por nome (contendo o texto)
    List<Cliente> findByNomeContainingIgnoreCase(String nome);
    
    // Buscar cliente por telefone
    Optional<Cliente> findByTelefone(String telefone);
    
    // Buscar clientes ordenados por data de cadastro (mais recentes primeiro)
    List<Cliente> findAllByOrderByDataCadastroDesc();
    
    // Buscar clientes por parte do email
    @Query("SELECT c FROM Cliente c WHERE LOWER(c.email) LIKE LOWER(CONCAT('%', :email, '%'))")
    List<Cliente> findByEmailContaining(String email);
    
    // Verificar se email já existe (para validação)
    boolean existsByEmail(String email);
    
    // Verificar se CPF já existe (para validação)
    boolean existsByCpf(String cpf);

    // Buscar cliente por email e senha (apenas ativos - para login)
    Optional<Cliente> findByEmailAndSenhaAndAtivoTrue(String email, String senha);

    // Verificar se email já existe (apenas ativos)
    boolean existsByEmailAndAtivoTrue(String email);

    // Verificar se CPF já existe (apenas ativos)
    boolean existsByCpfAndAtivoTrue(String cpf);
}