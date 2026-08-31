package com.senac.demo.repositories;

import com.senac.demo.model.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Long> {
    
    // Buscar administrador por email
    Optional<Administrador> findByEmail(String email);
    
    // Buscar administrador por CPF
    Optional<Administrador> findByCpf(String cpf);
    
    // Buscar administrador por email e senha (para login)
    Optional<Administrador> findByEmailAndSenha(String email, String senha);
    
    // Buscar administradores ativos
    List<Administrador> findByAtivoTrue();
    
    // Buscar administradores por nome (contendo o texto)
    List<Administrador> findByNomeContainingIgnoreCase(String nome);
    
    // Verificar se email já existe
    boolean existsByEmail(String email);
    
    // Verificar se CPF já existe
    boolean existsByCpf(String cpf);
    
    // Buscar administrador por email e que esteja ativo
    Optional<Administrador> findByEmailAndAtivoTrue(String email);
}