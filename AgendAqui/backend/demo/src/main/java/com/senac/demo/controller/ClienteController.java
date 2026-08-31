package com.senac.demo.controller;

import com.senac.demo.model.Cliente;
import com.senac.demo.repositories.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {
    
    @Autowired
    private ClienteRepository clienteRepository;

    // GET - Listar todos os clientes
    @GetMapping
    public List<Cliente> getAllClientes() {
        return clienteRepository.findAllByOrderByDataCadastroDesc();
    }

    // GET - Buscar cliente por ID
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> getClienteById(@PathVariable Long id) {
        Optional<Cliente> cliente = clienteRepository.findById(id);
        if (cliente.isPresent()) {
            return ResponseEntity.ok(cliente.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // GET - Buscar clientes por nome
    @GetMapping("/buscar")
    public List<Cliente> getClientesByNome(@RequestParam String nome) {
        return clienteRepository.findByNomeContainingIgnoreCase(nome);
    }

    // GET - Buscar cliente por email
    @GetMapping("/email/{email}")
    public ResponseEntity<Cliente> getClienteByEmail(@PathVariable String email) {
        Optional<Cliente> cliente = clienteRepository.findByEmail(email);
        if (cliente.isPresent()) {
            return ResponseEntity.ok(cliente.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // GET - Buscar cliente por CPF
    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Cliente> getClienteByCpf(@PathVariable String cpf) {
        Optional<Cliente> cliente = clienteRepository.findByCpf(cpf);
        if (cliente.isPresent()) {
            return ResponseEntity.ok(cliente.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // POST - Login do cliente (verificar email e senha)
    @PostMapping("/login")
    public ResponseEntity<Cliente> loginCliente(@RequestBody LoginRequest loginRequest) {
        Optional<Cliente> cliente = clienteRepository.findByEmailAndSenhaAndAtivoTrue(
            loginRequest.getEmail(), 
            loginRequest.getSenha()
        );
        
        if (cliente.isPresent()) {
            return ResponseEntity.ok(cliente.get());
        } else {
            return ResponseEntity.status(401).build(); // Unauthorized
        }
    }

    // POST - Verificar se email já existe
    @PostMapping("/verificar-email")
    public ResponseEntity<Boolean> verificarEmail(@RequestBody VerificarEmailRequest request) {
        boolean existe = clienteRepository.existsByEmailAndAtivoTrue(request.getEmail());
        return ResponseEntity.ok(existe);
    }

    // POST - Verificar se CPF já existe
    @PostMapping("/verificar-cpf")
    public ResponseEntity<Boolean> verificarCpf(@RequestBody VerificarCpfRequest request) {
        boolean existe = clienteRepository.existsByCpfAndAtivoTrue(request.getCpf());
        return ResponseEntity.ok(existe);
    }

    // POST - Criar novo cliente
    @PostMapping
    public ResponseEntity<?> createCliente(@RequestBody Cliente cliente) {
        // Verificar se email já existe (em clientes ativos)
        if (clienteRepository.existsByEmailAndAtivoTrue(cliente.getEmail())) {
            return ResponseEntity.badRequest().body("Email já cadastrado");
        }
        
        // Verificar se CPF já existe (em clientes ativos)
        if (cliente.getCpf() != null && !cliente.getCpf().isEmpty() && 
            clienteRepository.existsByCpfAndAtivoTrue(cliente.getCpf())) {
            return ResponseEntity.badRequest().body("CPF já cadastrado");
        }
        
        // Garantir que o cliente seja criado como ativo
        cliente.setAtivo(true);
        
        // A data de cadastro será definida automaticamente no construtor
        Cliente clienteSalvo = clienteRepository.save(cliente);
        return ResponseEntity.ok(clienteSalvo);
    }

    // Classe auxiliar para login
    public static class LoginRequest {
        private String email;
        private String senha;
        
        // Getters e Setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getSenha() { return senha; }
        public void setSenha(String senha) { this.senha = senha; }
    }

    // Classe auxiliar para verificar email
    public static class VerificarEmailRequest {
        private String email;
        
        // Getters e Setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    // Classe auxiliar para verificar CPF
    public static class VerificarCpfRequest {
        private String cpf;
        
        // Getters e Setters
        public String getCpf() { return cpf; }
        public void setCpf(String cpf) { this.cpf = cpf; }
    }
}