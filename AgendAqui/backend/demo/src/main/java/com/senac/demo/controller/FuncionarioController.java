package com.senac.demo.controller;

import com.senac.demo.model.Funcionario;
import com.senac.demo.repositories.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/funcionarios")
@CrossOrigin(origins = "*")
public class FuncionarioController {
    
    @Autowired
    private FuncionarioRepository funcionarioRepository;

    // GET - Listar todos os funcionários ativos
    @GetMapping
    public List<Funcionario> getAllFuncionarios() {
        return funcionarioRepository.findByAtivoTrue();
    }

    // GET - Buscar funcionário por ID
    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> getFuncionarioById(@PathVariable Long id) {
        Optional<Funcionario> funcionario = funcionarioRepository.findById(id);
        if (funcionario.isPresent() && funcionario.get().getAtivo()) {
            return ResponseEntity.ok(funcionario.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // GET - Buscar funcionários por nome
    @GetMapping("/buscar")
    public List<Funcionario> getFuncionariosByNome(@RequestParam String nome) {
        return funcionarioRepository.findByNomeContainingIgnoreCase(nome);
    }

    // GET - Buscar funcionário por email
    @GetMapping("/email/{email}")
    public ResponseEntity<Funcionario> getFuncionarioByEmail(@PathVariable String email) {
        Optional<Funcionario> funcionario = funcionarioRepository.findByEmailAndAtivoTrue(email);
        if (funcionario.isPresent()) {
            return ResponseEntity.ok(funcionario.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // GET - Buscar funcionário por CPF
    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Funcionario> getFuncionarioByCpf(@PathVariable String cpf) {
        Optional<Funcionario> funcionario = funcionarioRepository.findByCpf(cpf);
        if (funcionario.isPresent() && funcionario.get().getAtivo()) {
            return ResponseEntity.ok(funcionario.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // POST - Login do funcionário
    @PostMapping("/login")
    public ResponseEntity<Funcionario> loginFuncionario(@RequestBody LoginRequest loginRequest) {
        Optional<Funcionario> funcionario = funcionarioRepository.findByEmailAndSenha(
            loginRequest.getEmail(), 
            loginRequest.getSenha()
        );
        
        if (funcionario.isPresent() && funcionario.get().getAtivo()) {
            return ResponseEntity.ok(funcionario.get());
        } else {
            return ResponseEntity.status(401).build(); // Unauthorized
        }
    }

    // POST - Verificar se email já existe
    @PostMapping("/verificar-email")
    public ResponseEntity<Boolean> verificarEmail(@RequestBody VerificarEmailRequest request) {
        boolean existe = funcionarioRepository.existsByEmail(request.getEmail());
        return ResponseEntity.ok(existe);
    }

    // POST - Verificar se CPF já existe
    @PostMapping("/verificar-cpf")
    public ResponseEntity<Boolean> verificarCpf(@RequestBody VerificarCpfRequest request) {
        boolean existe = funcionarioRepository.existsByCpf(request.getCpf());
        return ResponseEntity.ok(existe);
    }

    // POST - Criar novo funcionário
    @PostMapping
    public ResponseEntity<?> createFuncionario(@RequestBody Funcionario funcionario) {
        try {
            // Verificar se email já existe
            if (funcionarioRepository.existsByEmail(funcionario.getEmail())) {
                return ResponseEntity.badRequest().body("Email já cadastrado");
            }
            
            // Verificar se CPF já existe
            if (funcionarioRepository.existsByCpf(funcionario.getCpf())) {
                return ResponseEntity.badRequest().body("CPF já cadastrado");
            }
            
            // Garantir que o funcionário seja criado como ativo
            funcionario.setAtivo(true);
            
            // Salvar o funcionário
            Funcionario funcionarioSalvo = funcionarioRepository.save(funcionario);
            return ResponseEntity.ok(funcionarioSalvo);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao cadastrar funcionário: " + e.getMessage());
        }
    }

    // PUT - Atualizar funcionário
    @PutMapping("/{id}")
    public ResponseEntity<?> updateFuncionario(@PathVariable Long id, @RequestBody Funcionario funcionarioAtualizado) {
        try {
            Optional<Funcionario> funcionarioExistente = funcionarioRepository.findById(id);
            if (funcionarioExistente.isPresent()) {
                Funcionario funcionario = funcionarioExistente.get();
                
                // Verificar se o email já existe em outro funcionário
                if (!funcionario.getEmail().equals(funcionarioAtualizado.getEmail()) && 
                    funcionarioRepository.existsByEmail(funcionarioAtualizado.getEmail())) {
                    return ResponseEntity.badRequest().body("Email já cadastrado em outro funcionário");
                }
                
                // Verificar se o CPF já existe em outro funcionário
                if (!funcionario.getCpf().equals(funcionarioAtualizado.getCpf()) && 
                    funcionarioRepository.existsByCpf(funcionarioAtualizado.getCpf())) {
                    return ResponseEntity.badRequest().body("CPF já cadastrado em outro funcionário");
                }
                
                // Atualizar os campos
                funcionario.setNome(funcionarioAtualizado.getNome());
                funcionario.setEmail(funcionarioAtualizado.getEmail());
                funcionario.setCpf(funcionarioAtualizado.getCpf());
                funcionario.setTelefone(funcionarioAtualizado.getTelefone());
                funcionario.setSenha(funcionarioAtualizado.getSenha());
                funcionario.setAtivo(funcionarioAtualizado.getAtivo());
                
                Funcionario funcionarioAtualizadoSalvo = funcionarioRepository.save(funcionario);
                return ResponseEntity.ok(funcionarioAtualizadoSalvo);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar funcionário: " + e.getMessage());
        }
    }

    // PUT - Reativar funcionário
    @PutMapping("/{id}/reativar")
    public ResponseEntity<?> reativarFuncionario(@PathVariable Long id) {
        try {
            Optional<Funcionario> funcionario = funcionarioRepository.findById(id);
            if (funcionario.isPresent()) {
                Funcionario funcionarioExistente = funcionario.get();
                funcionarioExistente.setAtivo(true);
                funcionarioRepository.save(funcionarioExistente);
                return ResponseEntity.ok().body("Funcionário reativado com sucesso");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao reativar funcionário: " + e.getMessage());
        }
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