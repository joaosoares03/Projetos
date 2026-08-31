-- Serviços
INSERT INTO servicos (id, nome, descricao, duracao_min, preco, ativo)
SELECT 1, 'DUCHA STANDARD', 'Lavagem básica', 30, 34.99, true
    WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE id = 1);

INSERT INTO servicos (id, nome, descricao, duracao_min, preco, ativo)
SELECT 2, 'ECONOMY', 'Lavagem completa', 60, 39.99, true
    WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE id = 2);

INSERT INTO servicos (id, nome, descricao, duracao_min, preco, ativo)
SELECT 3, 'ADVANCED', 'Cera de cerâmica', 60, 49.99, true
    WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE id = 3);

INSERT INTO servicos (id, nome, descricao, duracao_min, preco, ativo)
SELECT 4, 'DELUXE', 'Revitalização', 60, 69.99, true
    WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE id = 4);

INSERT INTO servicos (id, nome, descricao, duracao_min, preco, ativo)
SELECT 5, 'STAR', 'Brilho intenso', 60, 99.99, true
    WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE id = 5);

INSERT INTO servicos (id, nome, descricao, duracao_min, preco, ativo)
SELECT 6, 'PREMIUM', 'TOP Premium', 60, 190.00, true
    WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE id = 6);

-- Clientes de teste
INSERT INTO clientes (nome, telefone, email, cpf, senha, data_cadastro, ativo)
SELECT 'Daniel Pereira', '11912345678', 'daniel123@gmail.com', '30983833052', 'edcarros123', CURRENT_TIMESTAMP(), true
    WHERE NOT EXISTS (SELECT 1 FROM clientes WHERE email = 'daniel123@gmail.com');

INSERT INTO clientes (nome, telefone, email, cpf, senha, data_cadastro, ativo)
SELECT 'Eduardo Margem', '11923456789', 'eduardo123@gmail.com', '94323859066', 'edcarros456', CURRENT_TIMESTAMP(), true
    WHERE NOT EXISTS (SELECT 1 FROM clientes WHERE email = 'eduardo123@gmail.com');

-- Funcionário padrão  →  joaosilva@agendaqui.com / joao123
INSERT INTO funcionarios (cpf, data_cadastro, email, nome, senha, telefone, ativo)
SELECT '80903426048', CURRENT_TIMESTAMP(), 'joaosilva@agendaqui.com', 'João Silva', 'joao123', '11934567890', true
    WHERE NOT EXISTS (SELECT 1 FROM funcionarios WHERE email = 'joaosilva@agendaqui.com');

-- Administrador padrão  →  joseadmin@agendaqui.com / jose123
INSERT INTO administradores (cpf, data_cadastro, email, nome, senha, telefone, ativo)
SELECT '48719912021', CURRENT_TIMESTAMP(), 'joseadmin@agendaqui.com', 'José dos Santos', 'jose123', '11945678901', true
    WHERE NOT EXISTS (SELECT 1 FROM administradores WHERE email = 'joseadmin@agendaqui.com');