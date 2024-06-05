CREATE DATABASE lojamusical;

use lojamusical;

CREATE TABLE Produto(
	idProduto  INT NOT NULL auto_increment,
    codProduto INT NOT NULL ,
    nomeProduto VARCHAR(30) NOT NULL,
    marcaProduto varchar(30) not null,
    qtdProduto INT NOT NULL,
    valorProduto FLOAT NOT NULL,
    PRIMARY KEY (idProduto)
);

CREATE TABLE Cliente(
	idCliente INT NOT NULL auto_increment,
	CPF varchar(30) NOT NULL , 
	nomeCliente VARCHAR(30) NOT NULL,
	emailCliente VARCHAR(50) NOT NULL,
    fixoCliente varchar(30) not null,
    idadeCliente int not null,
    ruaCliente varchar(30) not null,
    celCliente varchar(30) not null,
    cepCliente varchar(30) not null,
    bairroCliente varchar(30) not null,
    estadoCliente varchar(30) not null,
    cidadeCliente varchar(30) not null,
    numeroCliente int not null,
    genero ENUM('Masculino', 'Feminino') not null,
    PRIMARY KEY (idCliente)
);

SELECT * FROM Cliente;

CREATE TABLE Venda(
idVenda int NOT NULL AUTO_INCREMENT,
dataVenda DATE NOT NULL,
valorVenda FLOAT NOT NULL,
idCliente INT NOT NULL,
PRIMARY KEY (idVenda)
);

CREATE TABLE ItemVenda(
idItemVenda int NOT NULL AUTO_INCREMENT,
idVenda INT NOT NULL,
idProduto INT NOT NULL,
qtdProduto INT NOT NULL,
valorUnitario FLOAT NOT NULL,

PRIMARY KEY(idItemVenda),
foreign key(idVenda) references Venda(idVenda),
foreign key(idProduto) references Produto(idProduto)
);

SELECT * FROM Cliente;
SELECT * FROM Venda;
SELECT * FROM ItemVenda;