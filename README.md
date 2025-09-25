# Case Selective Monks

## Como executar

### Backend

1. Abra o terminal do Windows, acesse a pasta `backend`.
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

- `admin@agencia.com`, senha: `admin123` (admin)
- `gestor@agencia.com`, senha: `gestor123` (user)

## Funcionalidades

- Login por email e senha
- Filtro por data
- Ordenação por qualquer coluna (clique no cabeçalho)
- Apenas admin vê a coluna `cost_micros`