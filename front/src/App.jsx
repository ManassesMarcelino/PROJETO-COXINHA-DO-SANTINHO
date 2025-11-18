import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

const API = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 8000,
});

const notEmpty = (v) => String(v ?? "").trim().length > 0;
const toInt = (v, def = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
};
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function App() {
  const [view, setView] = useState("login");
  const [user, setUser] = useState(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");

  // Login
  const doLogin = async (e) => {
    e?.preventDefault();
    if (!notEmpty(loginEmail) || !notEmpty(loginSenha)) {
      alert("Informe email e senha.");
      return;
    }
    if (!emailRegex.test(loginEmail)) {
      alert("Email inválido.");
      return;
    }
    try {
      const { data } = await API.post("/auth/login", {
        email: loginEmail,
        senha: loginSenha,
      });
      setUser(data);
      setView("home");
      setLoginEmail("");
      setLoginSenha("");
    } catch (err) {
      alert(err?.response?.data?.error || "Falha no login");
    }
  };

  const logout = () => {
    setUser(null);
    setView("login");
  };

  // Produtos
  const [produtos, setProdutos] = useState([]);
  const [loadingProdutos, setLoadingProdutos] = useState(false);
  const [q, setQ] = useState("");

  const emptyProduto = { id: null, nome: "", quantidade: 0, estoque_minimo: 0 };
  const [produtoForm, setProdutoForm] = useState(emptyProduto);
  const [editandoId, setEditandoId] = useState(null);

  const carregarProdutos = async (term = q) => {
    setLoadingProdutos(true);
    try {
      const url = notEmpty(term) ? `/produtos?q=${encodeURIComponent(term)}` : "/produtos";
      const { data } = await API.get(url);
      setProdutos(Array.isArray(data) ? data : []);
    } catch {
      alert("Erro ao carregar produtos");
    } finally {
      setLoadingProdutos(false);
    }
  };

  useEffect(() => {
    if (view === "produtos" || view === "estoque") carregarProdutos();
  }, [view]);

  const produtosOrdenados = useMemo(() => {
    return [...produtos].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }));
  }, [produtos]);

  const limparProdutoForm = () => {
    setProdutoForm(emptyProduto);
    setEditandoId(null);
  };

  const validarProdutoForm = () => {
    const { nome, quantidade, estoque_minimo } = produtoForm;
    if (!String(nome).trim()) return "O nome é obrigatório.";
    if (quantidade === "" || quantidade === null || isNaN(Number(quantidade)) || Number(quantidade) < 0)
      return "Quantidade inválida (não pode ser vazia ou negativa).";
    if (estoque_minimo === "" || estoque_minimo === null || isNaN(Number(estoque_minimo)) || Number(estoque_minimo) < 0)
      return "Estoque mínimo inválido (não pode ser vazio ou negativo).";
    return null;
  };

  const criarProduto = async () => {
    const msg = validarProdutoForm();
    if (msg) return alert(msg);
    try {
      await API.post("/produtos", {
        nome: produtoForm.nome.trim(),
        quantidade: Number(produtoForm.quantidade),
        estoque_minimo: Number(produtoForm.estoque_minimo),
      });
      await carregarProdutos();
      limparProdutoForm();
    } catch (e) {
      alert(e?.response?.data?.error || "Erro ao criar produto");
    }
  };

  const iniciarEdicao = (p) => {
    setEditandoId(p.id);
    setProdutoForm({
      id: p.id,
      nome: p.nome,
      quantidade: p.quantidade,
      estoque_minimo: p.estoque_minimo,
    });
  };

  const salvarProduto = async () => {
    const msg = validarProdutoForm();
    if (msg) return alert(msg);
    try {
      await API.put(`/produtos/${editandoId}`, {
        nome: produtoForm.nome.trim(),
        quantidade: Number(produtoForm.quantidade),
        estoque_minimo: Number(produtoForm.estoque_minimo),
      });
      await carregarProdutos();
      limparProdutoForm();
    } catch (e) {
      alert(e?.response?.data?.error || "Erro ao salvar produto");
    }
  };

  const excluirProduto = async (id) => {
    if (!window.confirm("Excluir este produto?")) return;
    try {
      await API.delete(`/produtos/${id}`);
      await carregarProdutos();
    } catch (e) {
      alert(e?.response?.data?.error || "Erro ao excluir produto");
    }
  };

  const buscar = async (e) => {
    e?.preventDefault();
    if (!notEmpty(q) || q.trim().length < 2) {
      alert("Digite ao menos 2 caracteres.");
      return;
    }
    await carregarProdutos(q);
  };

  // Movimentação
  const [movProdutoId, setMovProdutoId] = useState("");
  const [movTipo, setMovTipo] = useState("entrada");
  const [movQuantidade, setMovQuantidade] = useState("");
  const [movData, setMovData] = useState("");
  const [movObs, setMovObs] = useState("");

  const enviarMovimentacao = async () => {
    if (!user) return alert("Faça login.");
    if (!movProdutoId) return alert("Selecione um produto.");
    if (!["entrada", "saida"].includes(movTipo)) return alert("Tipo inválido.");
    const qtd = toInt(movQuantidade);
    if (!(qtd > 0)) return alert("Informe uma quantidade maior que 0.");
    if (!movData || String(movData).trim() === "") return alert("A data da movimentação é obrigatória.");
    try {
      const payload = {
        produto_id: Number(movProdutoId),
        usuario_id: user.id,
        tipo: movTipo,
        quantidade: qtd,
        data_movimentacao: new Date(movData).toISOString(),
        observacao: notEmpty(movObs) ? movObs.trim() : null,
      };
      const { data } = await API.post("/movimentacoes", payload);
      alert("Movimentação registrada com sucesso.");
      if (data?.produto?.abaixo_do_minimo) {
        alert("⚠️ Estoque abaixo do mínimo para este produto!");
      }
      await carregarProdutos();
      setMovQuantidade("");
      setMovObs("");
    } catch (e) {
      alert(e?.response?.data?.error || "Erro ao registrar movimentação");
    }
  };

  // -------------------
  return (
    <div className="app-container">
      <h1>Meia Meia Meia — Gestão de Estoque</h1>

      {view === "login" && (
        <section className="form">
          <h2>Login</h2>
          <div className="input-container">
            <label>Email</label>
            <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Digite seu email" />
          </div>
          <div className="input-container">
            <label>Senha</label>
            <input type="password" value={loginSenha} onChange={(e) => setLoginSenha(e.target.value)} placeholder="Digite sua senha" />
          </div>
          <button onClick={doLogin}>Entrar</button>
        </section>
      )}

      {view === "home" && (
        <section className="form">
          <h2>Olá, {user?.nome}</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => setView("produtos")}>Cadastro de Produto</button>
            <button onClick={() => setView("estoque")}>Gestão de Estoque</button>
            <button onClick={logout}>Sair</button>
          </div>
        </section>
      )}

      {view === "produtos" && (
        <section className="form">
          <h2>Cadastro de Produto</h2>

          <form onSubmit={buscar} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome" />
            <button type="submit">Buscar</button>
            <button type="button" onClick={() => { setQ(""); carregarProdutos(""); }}>Limpar</button>
          </form>

          <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
            <div className="input-container">
              <label>Nome</label>
              <input type="text" value={produtoForm.nome} onChange={(e) => setProdutoForm((s) => ({ ...s, nome: e.target.value }))} />
            </div>
            <div className="input-container">
              <label>Quantidade</label>
              <input type="number" min={0} value={produtoForm.quantidade} onChange={(e) => setProdutoForm((s) => ({ ...s, quantidade: e.target.value }))} />
            </div>
            <div className="input-container">
              <label>Estoque mínimo</label>
              <input type="number" min={0} value={produtoForm.estoque_minimo} onChange={(e) => setProdutoForm((s) => ({ ...s, estoque_minimo: e.target.value }))} />
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {editandoId ? (
                <>
                  <button onClick={salvarProduto}>Salvar</button>
                  <button onClick={limparProdutoForm}>Cancelar</button>
                </>
              ) : (
                <button onClick={criarProduto}>Cadastrar</button>
              )}
              <button onClick={() => setView("home")}>Voltar</button>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            {loadingProdutos && <p>Carregando...</p>}
            {!loadingProdutos && (
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Qtd</th>
                    <th>Mín</th>
                    <th>Alerta</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtosOrdenados.map(p => (
                    <tr key={p.id}>
                      <td>{p.nome}</td>
                      <td style={{ textAlign: "center" }}>{p.quantidade}</td>
                      <td style={{ textAlign: "center" }}>{p.estoque_minimo}</td>
                      <td style={{ textAlign: "center" }}>{p.quantidade < p.estoque_minimo ? "⚠️" : "—"}</td>
                      <td style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <button onClick={() => iniciarEdicao(p)}>Editar</button>
                        <button onClick={() => excluirProduto(p.id)}>Excluir</button>
                      </td>
                    </tr>
                  ))}
                  {produtosOrdenados.length === 0 && <tr><td colSpan={5}>Nenhum produto.</td></tr>}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}

      {view === "estoque" && (
        <section className="form">
          <h2>Gestão de Estoque</h2>

          <div>
            <h3>Produtos (ordem alfabética)</h3>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {produtosOrdenados.map(p => (
                <li key={p.id}>
                  <span>{p.nome}</span>
                  <span>Qtd: <b>{p.quantidade}</b></span>
                  <span>Mín: <b>{p.estoque_minimo}</b></span>
                  {p.quantidade < p.estoque_minimo && <span className="estoque-baixo">⚠️ Baixo</span>}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: 20 }}>
            <h3>Registrar movimentação</h3>

            <div className="input-container">
              <label>Produto</label>
              <select value={movProdutoId} onChange={(e) => setMovProdutoId(e.target.value)}>
                <option value="">Selecione...</option>
                {produtosOrdenados.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>

            <div className="input-container" style={{ display: "flex", gap: 16 }}>
              <label>
                <input type="radio" name="tipo" value="entrada" checked={movTipo === "entrada"} onChange={(e) => setMovTipo(e.target.value)} />
                Entrada
              </label>
              <label>
                <input type="radio" name="tipo" value="saida" checked={movTipo === "saida"} onChange={(e) => setMovTipo(e.target.value)} />
                Saída
              </label>
            </div>

            <div className="input-container">
              <label>Quantidade</label>
              <input type="number" min={1} value={movQuantidade} onChange={(e) => setMovQuantidade(e.target.value)} />
            </div>

            <div className="input-container">
              <label>Data</label>
              <input type="date" value={movData} onChange={(e) => setMovData(e.target.value)} />
            </div>

            <div className="input-container">
              <label>Observação</label>
              <input type="text" value={movObs} onChange={(e) => setMovObs(e.target.value)} />
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
              <button onClick={enviarMovimentacao}>Registrar</button>
              <button onClick={() => setView("home")}>Voltar</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
