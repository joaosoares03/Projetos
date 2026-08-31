package com.senac.demo.repositories;

import com.senac.demo.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    List<Agendamento> findByClienteIdOrderByDataAgendamentoDescHorarioDesc(Long clienteId);

    List<Agendamento> findByDataAgendamentoOrderByHorario(LocalDate dataAgendamento);

    List<Agendamento> findByStatusOrderByDataAgendamentoAscHorarioAsc(String status);

    List<Agendamento> findByClienteIdAndStatusOrderByDataAgendamentoDesc(Long clienteId, String status);

    Optional<Agendamento> findByDataAgendamentoAndHorario(LocalDate dataAgendamento, LocalTime horario);

    // CORRIGIDO: ignora cancelados para liberar o horário
    @Query("SELECT COUNT(a) > 0 FROM Agendamento a WHERE a.dataAgendamento = :data AND a.horario = :horario AND a.status != 'cancelado'")
    boolean existsByDataAgendamentoAndHorarioAtivo(LocalDate data, LocalTime horario);

    // Horários ocupados já ignoram cancelados
    @Query("SELECT a.horario FROM Agendamento a WHERE a.dataAgendamento = :data AND a.status != 'cancelado'")
    List<LocalTime> findHorariosOcupadosByData(LocalDate data);

    List<Agendamento> findAllByOrderByDataAgendamentoDescHorarioDesc();

    List<Agendamento> findByDataAgendamentoBetweenOrderByDataAgendamentoAscHorarioAsc(
            LocalDate dataInicio, LocalDate dataFim);
}