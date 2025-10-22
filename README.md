# 🎯 Task Manager - Full-Stack

<p align="center">
  Um gerenciador de tarefas completo e robusto construído com React, Node.js, e PostgreSQL. Demonstra funcionalidades avançadas como CRUD completo, autenticação JWT com sistema de cargos (Roles), painel de administração, testes automatizados, UI Otimista, e um ambiente totalmente containerizado com Docker.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Concluído-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/github/license/DaviDias0/task-manager-frontend?style=for-the-badge&color=blue" />
  </p>

---

## 📸 Demo da Aplicação

<div align="center">

![Demo da Aplicação](https://raw.githubusercontent.com/DaviDias0/task-manager-frontend/main/assets/demo.gif)
*Demonstração do fluxo principal: Login, criação, edição, ordenação e exclusão de tarefas.*

</div>

---

## 🔗 Links

- **Frontend (Vercel):** [**Acesse a aplicação aqui**](https://task-manager-frontend-git-main-sdavi01724-9026s-projects.vercel.app/)
- **Backend (Render):** `https://task-manager-api-jihw.onrender.com` (API pública)
- **Repositório do Backend:** [**DaviDias0/task-manager-api**](https://github.com/DaviDias0/task-manager-api)

---

## ✨ Principais Funcionalidades

O Task Manager oferece uma experiência completa de gerenciamento de tarefas com foco em performance e usabilidade:

- **Autenticação Segura:**
  - Registro de novos usuários.
  - Login com validação e geração de tokens JWT.
  - Rotas protegidas acessíveis apenas para usuários autenticados.
- **Gerenciamento de Tarefas (CRUD):**
  - **Criar:** Adicionar tarefas com título, descrição, prioridade (`BAIXA`, `MEDIA`, `ALTA`) e data de vencimento opcional.
  - **Ler:** Visualizar a lista de tarefas com estados de carregamento (skeletons) e animações de entrada/saída (`Framer Motion`).
  - **Atualizar:** Editar todos os campos de uma tarefa (título, descrição, status, prioridade, data) através de um modal.
  - **Deletar:** Excluir tarefas com confirmação (`window.confirm`).
- **Recursos Avançados da Lista de Tarefas:**
  - **Busca em Tempo Real:** Filtrar tarefas por título dinamicamente.
  - **Ordenação Dinâmica:** Ordenar tarefas por data de criação, data de vencimento ou prioridade (ascendente/descendente).
  - **UI Otimista:** Ações de edição e exclusão refletem instantaneamente na interface para uma experiência mais fluida, com reversão em caso de erro na API.
- **Gerenciamento de Usuário:**
  - **Página de Perfil:** Visualização dos dados do usuário logado (nome, email, data de cadastro).
  - **Sistema de Cargos (Roles):** Diferenciação entre usuários comuns (`USER`) e administradores (`ADMIN`).
- **Painel de Administração:**
  - Rota `/admin` protegida, acessível apenas por usuários `ADMIN`.
  - Visualização de todos os usuários cadastrados no sistema.
  - Exclusão de usuários (`USER`), com proteção contra exclusão de `ADMIN`.
  - Edição de cargos (`USER` <-> `ADMIN`) diretamente pela interface.
- **Interface e UX:**
  - Design responsivo com tema escuro.
  - Animações suaves (Framer Motion) para feedback visual.
  - Mensagens de feedback (Toasts) para ações do usuário (`react-toastify`).
  - Navegação fluida com barra lateral (`react-router-dom`).
- **Qualidade e Testes:**
  - Cobertura de testes automatizados (`Jest` + `React Testing Library`) para todo o fluxo de autenticação e funcionalidades CRUD da `TasksPage`.
  - Configuração de CI/CD com GitHub Actions para rodar testes automaticamente em Pull Requests (configurado em ambos repositórios).

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando tecnologias modernas e padrões da indústria para desenvolvimento full-stack.

| Categoria | Tecnologia |
| --- | --- |
| **Frontend** | ![React](https://img.shields.io/badge/React-000?style=for-the-badge&logo=react&logoColor=00FF00) ![TypeScript](https://img.shields.io/badge/TypeScript-000?style=for-the-badge&logo=typescript&logoColor=00FF00) ![Vite](https://img.shields.io/badge/Vite-000?style=for-the-badge&logo=vite&logoColor=00FF00) ![React Router](https://img.shields.io/badge/React_Router-000?style=for-the-badge&logo=reactrouter&logoColor=00FF00) ![Axios](https://img.shields.io/badge/Axios-000?style=for-the-badge&logo=axios&logoColor=00FF00) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-000?style=for-the-badge&logo=framer&logoColor=00FF00) ![React Toastify](https://img.shields.io/badge/React_Toastify-000?style=for-the-badge&logo=reacttoastify&logoColor=00FF00) |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-000?style=for-the-badge&logo=nodedotjs&logoColor=00FF00) ![Express.js](https://img.shields.io/badge/Express.js-000?style=for-the-badge&logo=express&logoColor=00FF00) ![JWT](https://img.shields.io/badge/JWT-000?style=for-the-badge&logo=jsonwebtokens&logoColor=00FF00) ![Bcrypt.js](https://img.shields.io/badge/Bcrypt-000?style=for-the-badge&logo=bcrypt&logoColor=00FF00) |
| **Banco de Dados** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-000?style=for-the-badge&logo=postgresql&logoColor=00FF00) ![Prisma](https://img.shields.io/badge/Prisma-000?style=for-the-badge&logo=prisma&logoColor=00FF00) |
| **Testes** | ![Jest](https://img.shields.io/badge/Jest-000?style=for-the-badge&logo=jest&logoColor=00FF00) ![React Testing Library](https://img.shields.io/badge/Testing_Library-000?style=for-the-badge&logo=testinglibrary&logoColor=00FF00) |
| **DevOps & Ferramentas** | ![Docker](https://img.shields.io/badge/Docker-000?style=for-the-badge&logo=docker&logoColor=00FF00) ![Git](https://img.shields.io/badge/Git-000?style=for-the-badge&logo=git&logoColor=00FF00) ![GitHub](https://img.shields.io/badge/GitHub-000?style=for-the-badge&logo=github&logoColor=00FF00) ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-000?style=for-the-badge&logo=githubactions&logoColor=00FF00) ![Vercel](https://img.shields.io/badge/Vercel-000?style=for-the-badge&logo=vercel&logoColor=00FF00) ![Render](https://img.shields.io/badge/Render-000?style=for-the-badge&logo=render&logoColor=00FF00) |

---

## 🚀 Rodando o Projeto Localmente

Para rodar este projeto na sua máquina, siga os passos abaixo. Você precisará ter o [Node.js](https://nodejs.org/en/) (v18 ou superior) e o [Docker](https://www.docker.com/products/docker-desktop/) instalados.

### Backend (API)
```bash
# 1. Clone o repositório do backend
git clone [https://github.com/DaviDias0/task-manager-api.git](https://github.com/DaviDias0/task-manager-api.git)

# 2. Navegue até a pasta do projeto
cd task-manager-api

# 3. Crie um arquivo .env (copiando do .env.example se existir)
#    Configure sua DATABASE_URL (ex: postgresql://user:password@db:5432/taskdb)
#    Configure um JWT_SECRET seguro (ex: uma string longa e aleatória)

# 4. Inicie os containers do Docker (isso inclui o banco de dados)
docker-compose up --build -d

# 5. Aplique as migrações do Prisma (necessário na primeira vez)
docker-compose exec api npx prisma migrate dev
```
O backend estará rodando em `http://localhost:3000`.

### Frontend
```bash
# 1. Clone o repositório do frontend (em outra pasta)
git clone [https://github.com/DaviDias0/task-manager-frontend.git](https://github.com/DaviDias0/task-manager-frontend.git)

# 2. Navegue até a pasta do projeto
cd task-manager-frontend

# 3. Instale as dependências
npm install

# 4. Crie um arquivo .env.local na raiz e defina a variável de ambiente da API
#    Conteúdo do .env.local:
#    VITE_API_URL=http://localhost:3000

# 5. Inicie a aplicação de desenvolvimento
npm run dev
```
A aplicação estará acessível em `http://localhost:5173` (ou a porta indicada pelo Vite).

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
