**Como iniciar o projeto**

- Instale o pacote de extensões do Java no VS Code (Extension Pack for Java - Microsoft);

- Abra um novo terminal;

- Configure o EXPO pelo terminal (Frontend):

// 1° Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
// 2° npm install
// 3° npx expo start

- No arquivo api.ts (services\api.ts), altere a const API_BASE_URL para o IP da sua máquina (http://IP_MAQUINA:8080/api);

- Abra a classe DemoApplication.java (Diretório: backend\demo\src\main\java\com\senac\demo\DemoApplication.java);

- Execute a classe, ou com o botão direito, clique em "Run Java" (Backend);

--------------------------------------------------------------------------------------------

**Como acessar o H2 Console**

- Com o Backend executando no terminal, acesse o site http://localhost:8080/h2-console ;

- Em "JDBC URL", cole na caixa o seguinte caminho: jdbc:h2:file:./data/agendaqui ;

- Por último, Clique em Connect;console