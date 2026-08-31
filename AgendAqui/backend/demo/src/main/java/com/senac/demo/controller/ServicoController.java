package com.senac.demo.controller;

import com.senac.demo.model.Servico;
import com.senac.demo.repositories.ServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ServicoController {
    @Autowired
    private ServicoRepository servicoRepository;

    @GetMapping("/servicos")
    public List<Servico> getAllServicos() {
        return servicoRepository.findByAtivoTrue();
    }

    @GetMapping("/servicos/{id}")
    public ResponseEntity<Servico> getServicoById(@PathVariable Long id) {
        Optional<Servico> servico = servicoRepository.findByIdAndAtivoTrue(id);
        if (servico.isPresent()) {
            return ResponseEntity.ok(servico.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
