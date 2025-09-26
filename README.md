# Case Selective Monks

## Como executar

### Backend

1. Abra o terminal do Windows ou linux, acesse a pasta `backend`.
2. Instale as dependências:
   ```
   pip install -r requirements.txt
   ```
3. Execute o backend:
   ```
   uvicorn main:app --reload
   ```

### Frontend

1. Abra a pasta `frontend`.
2. Clique duas vezes em `index.html` para abrir no navegador (ou use a extensão Live Server do VSCode).

### Usuários

- `user1@test.com`, senha: `oeiruhn56146` (admin)
- `user2@test.com`, senha: `908ijofff` (user)

## Resumo das Funcionalidades e Ferramentas Utilizadas

### Funcionalidades

- **Login Seguro:** Acesso por email e senha, com autenticação baseada em usuários pré-cadastrados no arquivo CSV.
- **Visualização de Métricas:** Exibição das métricas de performance em formato de tabela, facilitando a análise dos dados.
- **Filtro por Data:** Permite filtrar os dados apresentados na tabela por intervalo de datas selecionado pelo usuário.
- **Ordenação Dinâmica:** Possibilidade de ordenar os dados por qualquer coluna da tabela, apenas clicando no cabeçalho.
- **Controle de Permissões:** A coluna "cost_micros" só é exibida para usuários com papel "admin", ficando oculta para os demais usuários.
- **Sem Cadastro de Usuários:** Utiliza apenas os usuários já existentes no arquivo CSV fornecido.
- **Frontend Simples:** Interface web sem uso obrigatório de frameworks, com foco apenas na funcionalidade.

### Ferramentas Utilizadas

- **Backend:** [FastAPI](https://fastapi.tiangolo.com/) (Python) — API responsável pela autenticação, leitura dos arquivos CSV e exposição dos dados para o frontend.
- **Leitura de Arquivos:** [Pandas](https://pandas.pydata.org/) — Utilizado para leitura e manipulação dos arquivos de métricas e usuários em formato CSV.
- **Servidor de Desenvolvimento:** [Uvicorn](https://www.uvicorn.org/) — Para rodar a aplicação FastAPI localmente.
- **Frontend:** HTML, CSS e JavaScript puros, sem frameworks, garantindo fácil execução e entendimento do projeto.
- **CORS:** Middleware configurado para permitir a comunicação entre backend e frontend durante o desenvolvimento.

### Observação

- O projeto foi desenvolvido para ser facilmente executado tanto em **Windows** quanto em **Linux**.
