package com.senac.demo.controller;

import com.senac.demo.model.Agendamento;
import com.senac.demo.repositories.AgendamentoRepository;
import com.senac.demo.repositories.ClienteRepository;
import com.senac.demo.repositories.ServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/agendamentos")
@CrossOrigin(origins = "*")
public class AgendamentoController {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ServicoRepository servicoRepository;

    @GetMapping
    public List<Agendamento> getAllAgendamentos() {
        return agendamentoRepository.findAllByOrderByDataAgendamentoDescHorarioDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Agendamento> getAgendamentoById(@PathVariable Long id) {
        Optional<Agendamento> agendamento = agendamentoRepository.findById(id);
        if (agendamento.isPresent()) {
            return ResponseEntity.ok(agendamento.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/cliente/{clienteId}")
    public List<Agendamento> getAgendamentosByCliente(@PathVariable Long clienteId) {
        return agendamentoRepository.findByClienteIdOrderByDataAgendamentoDescHorarioDesc(clienteId);
    }

    @GetMapping("/data/{data}")
    public List<Agendamento> getAgendamentosByData(@PathVariable String data) {
        LocalDate dataAgendamento = LocalDate.parse(data);
        return agendamentoRepository.findByDataAgendamentoOrderByHorario(dataAgendamento);
    }

    // CORRIGIDO: filtra horários passados quando a data for hoje
    @GetMapping("/horarios-disponiveis/{data}")
    public ResponseEntity<List<LocalTime>> getHorariosDisponiveis(@PathVariable String data) {
        LocalDate dataAgendamento = LocalDate.parse(data);

        List<LocalTime> horariosOcupados = agendamentoRepository.findHorariosOcupadosByData(dataAgendamento);

        List<LocalTime> todosHorarios = List.of(
                LocalTime.of(8, 0), LocalTime.of(9, 0), LocalTime.of(10, 0),
                LocalTime.of(11, 0), LocalTime.of(12, 0), LocalTime.of(13, 0),
                LocalTime.of(14, 0), LocalTime.of(15, 0), LocalTime.of(16, 0),
                LocalTime.of(17, 0)
        );

        // Se for hoje, só mostra horários com pelo menos 30 min de antecedência
        LocalTime horarioMinimo = dataAgendamento.equals(LocalDate.now())
                ? LocalTime.now().plusMinutes(30)
                : LocalTime.MIN;

        List<LocalTime> horariosDisponiveis = todosHorarios.stream()
                .filter(horario -> !horariosOcupados.contains(horario))
                .filter(horario -> horario.isAfter(horarioMinimo))
                .toList();

        return ResponseEntity.ok(horariosDisponiveis);
    }

    // CORRIGIDO: usa query que ignora cancelados
    @GetMapping("/verificar-disponibilidade")
    public ResponseEntity<Boolean> verificarDisponibilidade(
            @RequestParam String data,
            @RequestParam String horario) {

        LocalDate dataAgendamento = LocalDate.parse(data);
        LocalTime horarioAgendamento = LocalTime.parse(horario);

        boolean disponivel = !agendamentoRepository.existsByDataAgendamentoAndHorarioAtivo(
                dataAgendamento, horarioAgendamento);

        return ResponseEntity.ok(disponivel);
    }

    // CORRIGIDO: bloqueia datas/horários retroativos e usa query que ignora cancelados
    @PostMapping
    public ResponseEntity<?> createAgendamento(@RequestBody AgendamentoRequest request) {
        if (!clienteRepository.existsById(request.getClienteId())) {
            return ResponseEntity.badRequest().body("Cliente não encontrado");
        }

        if (!servicoRepository.existsById(request.getServicoId())) {
            return ResponseEntity.badRequest().body("Serviço não encontrado");
        }

        if (request.getDataAgendamento().isBefore(LocalDate.now())) {
            return ResponseEntity.badRequest().body("Não é possível agendar para datas passadas");
        }

        if (request.getDataAgendamento().equals(LocalDate.now()) &&
                !request.getHorario().isAfter(LocalTime.now().plusMinutes(30))) {
            return ResponseEntity.badRequest().body("Horário indisponível para agendamento");
        }

        if (agendamentoRepository.existsByDataAgendamentoAndHorarioAtivo(
                request.getDataAgendamento(), request.getHorario())) {
            return ResponseEntity.badRequest().body("Horário já ocupado");
        }

        Agendamento agendamento = new Agendamento();
        agendamento.setCliente(clienteRepository.findById(request.getClienteId()).get());
        agendamento.setServico(servicoRepository.findById(request.getServicoId()).get());
        agendamento.setModeloCarro(request.getModeloCarro());
        agendamento.setDataAgendamento(request.getDataAgendamento());
        agendamento.setHorario(request.getHorario());
        agendamento.setStatus("agendado");

        Agendamento agendamentoSalvo = agendamentoRepository.save(agendamento);
        return ResponseEntity.ok(agendamentoSalvo);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Agendamento> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest request) {

        Optional<Agendamento> agendamentoOpt = agendamentoRepository.findById(id);
        if (agendamentoOpt.isPresent()) {
            Agendamento agendamento = agendamentoOpt.get();
            agendamento.setStatus(request.getStatus());
            Agendamento agendamentoAtualizado = agendamentoRepository.save(agendamento);
            return ResponseEntity.ok(agendamentoAtualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelAgendamento(@PathVariable Long id) {
        Optional<Agendamento> agendamentoOpt = agendamentoRepository.findById(id);
        if (agendamentoOpt.isPresent()) {
            Agendamento agendamento = agendamentoOpt.get();
            agendamento.setStatus("cancelado");
            agendamentoRepository.save(agendamento);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public static class AgendamentoRequest {
        private Long clienteId;
        private Long servicoId;
        private String modeloCarro;
        private LocalDate dataAgendamento;
        private LocalTime horario;

        public Long getClienteId() { return clienteId; }
        public void setClienteId(Long clienteId) { this.clienteId = clienteId; }

        public Long getServicoId() { return servicoId; }
        public void setServicoId(Long servicoId) { this.servicoId = servicoId; }

        public String getModeloCarro() { return modeloCarro; }
        public void setModeloCarro(String modeloCarro) { this.modeloCarro = modeloCarro; }

        public LocalDate getDataAgendamento() { return dataAgendamento; }
        public void setDataAgendamento(LocalDate dataAgendamento) { this.dataAgendamento = dataAgendamento; }

        public LocalTime getHorario() { return horario; }
        public void setHorario(LocalTime horario) { this.horario = horario; }
    }

    public static class UpdateStatusRequest {
        private String status;

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}