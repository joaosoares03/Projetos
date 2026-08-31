package com.senac.demo.config;

import com.senac.demo.model.Servico;
import com.senac.demo.repositories.ServicoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.Arrays;

@Configuration
public class DataLoader {
    @Bean
    CommandLineRunner initDatabase(ServicoRepository servicoRepository) {
        return args -> {
            // Limpa a tabela e insere novos dados (apenas se estiver vazia)
            if (servicoRepository.count() == 0) {
                System.out.println("📦 Populando banco com dados iniciais...");
                
                servicoRepository.deleteAll();
                
                Servico s1 = new Servico("Advanced", 
                    "Lavagem completa com cera líquida, limpeza de plásticos e vidros, aspiração interna e limpeza de rodas", 
                    60, new BigDecimal("80.00"), true);
                
                Servico s2 = new Servico("Deluxe", 
                    "Lavagem premium com cera sólida, limpeza detalhada de interior, tratamento de plásticos, aspiração completa e limpeza de rodas com produto específico", 
                    90, new BigDecimal("120.00"), true);
                
                Servico s3 = new Servico("Ducha Standard", 
                    "Lavagem básica externa com shampoo automotivo, enxágue e secagem com panos de microfibra", 
                    30, new BigDecimal("40.00"), true);
                
                Servico s4 = new Servico("Economy", 
                    "Lavagem rápida externa com shampoo e secagem básica", 
                    20, new BigDecimal("25.00"), true);
                
                Servico s5 = new Servico("StarPremium", 
                    "Serviço completo premium com polimento, cera de carnaúba, limpeza interna detalhada, higienização de ar condicionado, tratamento de plásticos e pneus", 
                    120, new BigDecimal("180.00"), true);
                
                servicoRepository.saveAll(Arrays.asList(s1, s2, s3, s4, s5));
                System.out.println("✅ " + servicoRepository.count() + " serviços inseridos!");
            } else {
                System.out.println("ℹ️  Banco já contém " + servicoRepository.count() + " serviços");
            }
        };
    }
}
