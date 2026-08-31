package com.senac.demo.controller;

import com.senac.demo.model.Administrador;
import com.senac.demo.repositories.AdministradorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/administradores")
@CrossOrigin(origins = "*")
public class AdministradorController {
    
    @Autowired
    private AdministradorRepository administradorRepository;

    // GET - Listar todos os administradores ativos
    @GetMapping
    public List<Administrador> getAllAdministradores() {
        return administradorRepository.findByAtivoTrue();
    }

    // GET - Buscar administrador por ID
    @GetMapping("/{id}")
    public ResponseEntity<Administrador> getAdministradorById(@PathVariable Long id) {
        Optional<Administrador> administrador = administradorRepository.findById(id);
        if (administrador.isPresent() && administrador.get().getAtivo()) {
            return ResponseEntity.ok(administrador.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // GET - Buscar administradores por nome
    @GetMapping("/buscar")
    public List<Administrador> getAdministradoresByNome(@RequestParam String nome) {
        return administradorRepository.findByNomeContainingIgnoreCase(nome);
    }

    // GET - Buscar administrador por email
    @GetMapping("/email/{email}")
    public ResponseEntity<Administrador> getAdministradorByEmail(@PathVariable String email) {
        Optional<Administrador> administrador = administradorRepository.findByEmailAndAtivoTrue(email);
        if (administrador.isPresent()) {
            return ResponseEntity.ok(administrador.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // GET - Buscar administrador por CPF
    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Administrador> getAdministradorByCpf(@PathVariable String cpf) {
        Optional<Administrador> administrador = administradorRepository.findByCpf(cpf);
        if (administrador.isPresent() && administrador.get().getAtivo()) {
            return ResponseEntity.ok(administrador.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // POST - Login do administrador
    @PostMapping("/login")
    public ResponseEntity<Administrador> loginAdministrador(@RequestBody LoginRequest loginRequest) {
        Optional<Administrador> administrador = administradorRepository.findByEmailAndSenha(
            loginRequest.getEmail(), 
            loginRequest.getSenha()
        );
        
        if (administrador.isPresent() && administrador.get().getAtivo()) {
            return ResponseEntity.ok(administrador.get());
        } else {
            return ResponseEntity.status(401).build(); // Unauthorized
        }
    }

    // POST - Verificar se email já existe
    @PostMapping("/verificar-email")
    public ResponseEntity<Boolean> verificarEmail(@RequestBody VerificarEmailRequest request) {
        boolean existe = administradorRepository.existsByEmail(request.getEmail());
        return ResponseEntity.ok(existe);
    }

    // POST - Verificar se CPF já existe
    @PostMapping("/verificar-cpf")
    public ResponseEntity<Boolean> verificarCpf(@RequestBody VerificarCpfRequest request) {
        boolean existe = administradorRepository.existsByCpf(request.getCpf());
        return ResponseEntity.ok(existe);
    }

    // Classes auxiliares para requests
    public static class LoginRequest {
        private String email;
        private String senha;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getSenha() { return senha; }
        public void setSenha(String senha) { this.senha = senha; }
    }

    public static class VerificarEmailRequest {
        private String email;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class VerificarCpfRequest {
        private String cpf;
        public String getCpf() { return cpf; }
        public void setCpf(String cpf) { this.cpf = cpf; }
    }
}