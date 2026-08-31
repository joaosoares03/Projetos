package com.senac.demo.repositories;

import com.senac.demo.model.Servico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServicoRepository extends JpaRepository<Servico, Long> {
    List<Servico> findByAtivoTrue();
    
    Optional<Servico> findByIdAndAtivoTrue(Long id);
}
