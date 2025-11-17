
---

# 🧦 Sistema de Estoque “meia meia meia”

Um MVP educativo que percorre as etapas de um CRUD completo, com regras de negócio simples voltadas à gestão de estoque.  
O sistema foi desenvolvido para fins didáticos, simulando o cenário real de uma fábrica de meias criativas — a **“meia meia meia”** — que conta com **divulgadores móveis** responsáveis por retirar e devolver produtos em eventos e feiras.

---

## 🎯 Objetivo do projeto

> Criar uma aplicação completa, com frontend e backend integrados, que demonstre o ciclo completo de desenvolvimento de um sistema CRUD real, passando por:
> - modelagem e criação do banco de dados;
> - implementação das rotas e regras de negócio;
> - consumo das rotas via frontend React;
> - exibição dinâmica dos dados com validações e alertas.

O projeto cobre todas as entregas da prova prática **SAEP — Técnico em Desenvolvimento de Sistemas**, mas em um contexto divertido e mais próximo da realidade de uma pequena fábrica.

---

## 🧩 Estrutura geral do projeto

```

template-crud-meias/
├── backend-meias/          # API REST Node + Express + PostgreSQL
│   ├── server.js
│   ├── readme.md           # instruções específicas do backend
│   └── (scripts SQL e seeds)
│
├── frontend-meias/         # SPA React + Axios + Vite
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   ├── README.md           # instruções específicas do frontend
│   └── ...
│
└── README.md               # este arquivo

````

---

## 🛠️ Stack utilizada

**Backend**
- Node.js + Express  
- PostgreSQL (banco `saep_db`)  
- Rotas RESTful padronizadas  

**Frontend**
- React (Vite)
- Axios (requisições HTTP)
- CSS puro (organização simples e didática)

---

## ⚙️ Funcionalidades principais

- Autenticação de **divulgadores** com login simples  
- Cadastro, edição e exclusão de **produtos** (modelos de meias)
- Busca dinâmica (`/produtos?q=nome`)  
- Registro de **entradas e saídas** de produtos (movimentações)  
- Atualização automática de estoque  
- Alerta quando o estoque estiver **abaixo do mínimo configurado**
- Interface única (SPA) com seções alternáveis de login, cadastro e gestão

---

## 🧪 Fluxo geral de uso

1. **Login do divulgador** (usuário cadastrado)
2. **Tela principal:** acesso rápido às áreas de  
   - Cadastro de produtos  
   - Gestão de estoque  
3. **Cadastro de produtos:**  
   - Listagem automática  
   - Busca por nome  
   - Inserção, edição e exclusão  
   - Validação dos campos  
4. **Gestão de estoque:**  
   - Registro de movimentações de entrada e saída  
   - Atualização imediata do saldo  
   - Alerta de estoque baixo  
5. **Banco de dados:**  
   - Preenchido com 3 produtos iniciais (“arrastão”, “499,5”, “000”)  
   - Histórico de movimentações demonstrativo (Ana, Bruno e Carla)

---

## 📦 Instalação e execução do projeto completo

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/template-crud-meias.git
cd template-crud-meias

# Backend
cd backend-meias
npm install
node server.js

# Em outro terminal: frontend
cd ../frontend-meias
npm install
npm run dev
````

* O backend roda em **[http://localhost:3000](http://localhost:3000)**
* O frontend roda em **[http://localhost:5173](http://localhost:5173)**

---

## 🔗 Integração backend ↔ frontend

O frontend consome automaticamente o backend via Axios (`baseURL: http://localhost:3000`).
Ao efetuar o login, o usuário tem acesso às rotas protegidas e à gestão de estoque, cobrindo todas as entregas da avaliação.

---

## 🧠 Aprendizados e conceitos aplicados

* Estrutura mínima de um projeto **fullstack**
* Criação e consumo de **APIs REST**
* Comunicação entre frontend e backend via **Axios**
* Manipulação de estado com React Hooks (`useState`, `useEffect`, `useMemo`)
* Boas práticas de UX em CRUDs simples (alertas, validações, feedback)
* Integração entre **banco relacional** e aplicação web

---

## 🧾 Créditos e autoria

Desenvolvido com foco educacional por [**Rafael Lindemann Duarte**](https://github.com/rafaellindemann),
docente do **SENAI/SC — Desenvolvimento de Sistemas**.

O projeto é livre para fins de estudo, referência e adaptação em atividades práticas.

---

## 📄 Licença

Este repositório está sob a licença MIT.

---


