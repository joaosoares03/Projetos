package com.senac.demo.repositories;

import com.senac.demo.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
    
    // Buscar funcionário por email
    Optional<Funcionario> findByEmail(String email);
    
    // Buscar funcionário por CPF
    Optional<Funcionario> findByCpf(String cpf);
    
    // Buscar funcionário por email e senha (para login)
    Optional<Funcionario> findByEmailAndSenha(String email, String senha);
    
    // Buscar funcionários ativos
    List<Funcionario> findByAtivoTrue();
    
    // Buscar funcionários inativos
    List<Funcionario> findByAtivoFalse();
    
    // Buscar funcionários por nome (contendo o texto)
    List<Funcionario> findByNomeContainingIgnoreCase(String nome);
    
    // Buscar funcionários ativos por nome
    List<Funcionario> findByNomeContainingIgnoreCaseAndAtivoTrue(String nome);
    
    // Verificar se email já existe
    boolean existsByEmail(String email);
    
    // Verificar se CPF já existe
    boolean existsByCpf(String cpf);
    
    // Buscar funcionário por email e que esteja ativo
    Optional<Funcionario> findByEmailAndAtivoTrue(String email);
    
    // Buscar funcionário por CPF e que esteja ativo
    Optional<Funcionario> findByCpfAndAtivoTrue(String cpf);
    
    // Buscar funcionário por email e senha que esteja ativo
    Optional<Funcionario> findByEmailAndSenhaAndAtivoTrue(String email, String senha);
}