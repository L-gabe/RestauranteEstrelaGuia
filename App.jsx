import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";

// Tela de login simples
function Login({ onLogin }) {
  const [senha, setSenha] = useState("");

  const verificarLogin = () => {
    if (senha === "1234") {
      onLogin();
    } else {
      alert("Senha incorreta.");
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#2c3e50",
      color: "#fff"
    }}>
      <h1 style={{ marginBottom: 20 }}>Login do Sistema</h1>
      <input
        type="password"
        placeholder="Digite a senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px",
          borderRadius: "6px",
          border: "none",
          marginBottom: "10px"
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") verificarLogin();
        }}
      />
      <button
        onClick={verificarLogin}
        style={{
          padding: "10px 20px",
          backgroundColor: "#f1c40f",
          color: "#fff",
          fontWeight: "bold",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Entrar
      </button>
    </div>
  );
}

const produtosPorCategoria = {
  "Refeição": [
    { nome: "Camaroada P", preco: 80 },
    { nome: "Camaroada G", preco: 140 },
    { nome: "Camarão ao Alho P", preco: 50 },
    { nome: "Camarão ao Alho G", preco: 100 },
    { nome: "Pescada Cozida P", preco: 80 },
    { nome: "Pescada Cozida G", preco: 150 },
    { nome: "Pescada Frita P", preco: 70 },
    { nome: "Pescada Frita G", preco: 130 },
    { nome: "Carne de Sol P", preco: 60 },
    { nome: "Carne de Sol G", preco: 120 },
    { nome: "Mocotó P", preco: 30 },
    { nome: "Mocotó G", preco: 50 },
    { nome: "Galinha Caipira", preco: 170 },
  ],
    "Porção/Adicional": [
    { nome: "Arroz P", preco: 5 },
    { nome: "Arroz G", preco: 10 },
    { nome: "Feijão P", preco: 5 },
    { nome: "Feijão G", preco: 10 },
  ],
  "Tira Gosto": [
    { nome: "Batata Frita", preco: 25 },
    { nome: "Carne de Sol", preco: 50 },
    { nome: "Calabresa", preco: 30 },
    { nome: "Azeitona com queijo", preco: 30 },
    { nome: "Camarão ao Alho", preco: 40 },
  ],
  "Cervejas": [
    { nome: "SKOL", preco: 10 },
    { nome: "BRAHMA", preco: 10 },
    { nome: "HEINEKEN", preco: 15 },
    { nome: "STELLA", preco: 15 },
    { nome: "HEINEKEN LONG NK", preco: 10 },
    { nome: "STELLA LONG NK", preco: 10 },
    { nome: "BRAHMA LONG NK", preco: 5.5 },
    { nome: "ICE", preco: 10 },
  ],
  "Refrigerante": [
    { nome: "Refrigerante 2L", preco: 15 },
    { nome: "Refrigerante 1,5L", preco: 10 },
    { nome: "Refrigerante 1L(Pet)", preco: 10 },
    { nome: "Refrigerante 1L", preco: 8 },
    { nome: "Refrigerante Lata", preco: 5 },
    { nome: "Refrigerante 290ml", preco: 5 },
  ],
  "Sucos": [
    { nome: "Acerola Copo (300ml)", preco: 6 },
    { nome: "Bacuri Copo (300ml)", preco: 8 },
    { nome: "Goiaba Copo (300ml)", preco: 6 },
    { nome: "Acerola Jarra", preco: 20 },
    { nome: "Bacuri Jarra", preco: 20 },
    { nome: "Goiaba Jarra", preco: 20 },
  ],
  "Agua/Energético": [
    { nome: "Agua mineral P", preco: 3 },
    { nome: "Agua mineral G", preco: 5 },
    { nome: "Energético", preco: 10 },
  ],
  "Picolé": [
    { nome: "Picolé de 5", preco: 5 },
    { nome: "Picolé de 6", preco: 6 },
    { nome: "Picolé de 8", preco: 8 },
    { nome: "Picolé de 10", preco: 10 },
    { nome: "Picolé de 12", preco: 12 },
  ],
  "Piscina": [
    { nome: "Piscina 10", preco: 10 },
    { nome: "Piscina 5", preco: 5 },
  ],
};

const categoriasOrdenadas = [
  "Refeição",
  "Porção/Adicional",
  "Tira Gosto",
  "Cervejas",
  "Refrigerante",
  "Sucos",
  "Agua/Energético",
  "Picolé",
  "Piscina",
];

function App() {
  const [logado, setLogado] = useState(false);
  const [mesas, setMesas] = useState(() => JSON.parse(localStorage.getItem("mesas")) || []);
  const [comandas, setComandas] = useState(() => JSON.parse(localStorage.getItem("comandas")) || {});
  const [dataSelecionada, setDataSelecionada] = useState(() => localStorage.getItem("dataSelecionada") || new Date().toISOString().slice(0, 10));
  const [mesaSelecionada, setMesaSelecionada] = useState(null);
  const [mostrarFinalizadas, setMostrarFinalizadas] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => { localStorage.setItem("mesas", JSON.stringify(mesas)); }, [mesas]);
  useEffect(() => { localStorage.setItem("comandas", JSON.stringify(comandas)); }, [comandas]);
  useEffect(() => { localStorage.setItem("dataSelecionada", dataSelecionada); }, [dataSelecionada]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!logado) return <Login onLogin={() => setLogado(true)} />;

  const comandasDoDia = comandas[dataSelecionada] || {};

  // Adiciona nova mesa
  const adicionarMesa = () => {
    const nome = prompt("Nome da nova mesa:");
    if (nome && nome.trim()) {
      const novaMesa = { id: Date.now().toString(), nome: nome.trim() };
      setMesas(prev => [...prev, novaMesa]);
    }
  };

  // Editar nome da mesa
  const editarNomeMesa = (id) => {
    const novoNome = prompt("Novo nome da mesa:");
    if (novoNome && novoNome.trim()) {
      setMesas(prev => prev.map(m => (m.id === id ? { ...m, nome: novoNome.trim() } : m)));
    }
  };

  // Excluir mesa e a respectiva comanda
  const excluirMesa = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir essa mesa? Isso também removerá a comanda associada.")) return;

    setMesas(prev => prev.filter(m => m.id !== id));

    const novasComandasDoDia = { ...comandasDoDia };
    if (novasComandasDoDia[id]) {
      delete novasComandasDoDia[id];
      setComandas(prev => ({
        ...prev,
        [dataSelecionada]: novasComandasDoDia,
      }));
    }

    if (mesaSelecionada === id) setMesaSelecionada(null);
  };

  // Adicionar item na comanda da mesa selecionada
const adicionarItem = (item) => {
  if (!mesaSelecionada) {
    alert("Selecione uma mesa antes de adicionar itens.");
    return;
  }
  const mesaId = mesaSelecionada;
  const com = comandasDoDia[mesaId];

  // 🚫 Verifica se a comanda está finalizada
  if (com && com.status === "Finalizada") {
    alert("Não é possível adicionar itens em uma comanda finalizada.");
    return;
  }

  let comanda = (com && typeof com === "object" && !Array.isArray(com)) ? { ...com } : { status: "Aberta", itens: [] };
  if (!Array.isArray(comanda.itens)) comanda.itens = [];

  const idx = comanda.itens.findIndex(i => i.nome === item.nome);
  if (idx >= 0) comanda.itens[idx].quantidade += 1;
  else comanda.itens.push({ ...item, quantidade: 1 });

  setComandas(prev => ({
    ...prev,
    [dataSelecionada]: {
      ...comandasDoDia,
      [mesaId]: comanda,
    }
  }));
};
  
  // Remover item da comanda
  const removerItem = (mesaId, nomeItem) => {
    const com = comandasDoDia[mesaId];
    if (!com || Array.isArray(com)) return;

    const comanda = { ...com };
    if (!Array.isArray(comanda.itens)) return;

    const itensFiltrados = comanda.itens.filter(i => i.nome !== nomeItem);
    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: { ...comanda, itens: itensFiltrados },
      },
    }));
  };

  // Alternar status da comanda
  const toggleStatus = (mesaId) => {
    const com = comandasDoDia[mesaId];
    if (!com || Array.isArray(com)) return;

    const comanda = { ...com };
    const novoStatus = comanda.status === "Finalizada" ? "Aberta" : "Finalizada";

    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: { ...comanda, status: novoStatus },
      }
    }));
  };

  // Limpar itens da comanda
  const limparComanda = (mesaId) => {
    const com = comandasDoDia[mesaId];
    if (!com || Array.isArray(com)) return;

    const comanda = { ...com, itens: [], status: "Aberta" };
    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: comanda,
      }
    }));
  };

  // Excluir comanda
  const excluirComanda = (mesaId) => {
    if (!window.confirm("Excluir essa comanda?")) return;

    const novasComandasDoDia = { ...comandasDoDia };
    delete novasComandasDoDia[mesaId];
    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: novasComandasDoDia,
    }));

    if (mesaSelecionada === mesaId) setMesaSelecionada(null);
  };

  // Calcula total do dia
  const totalVendaDia = () => {
    let total = 0;
    Object.values(comandasDoDia).forEach(com => {
      if (com && !Array.isArray(com) && com.itens) {
        com.itens.forEach(item => total += item.preco * item.quantidade);
      }
    });
    return total.toFixed(2);
  };

  // Limpar historico do dia
  const limparHistoricoDoDia = () => {
    if (window.confirm("Tem certeza que deseja limpar todo o histórico do dia? Isso apagará todas as comandas!")) {
      setComandas(prev => {
        const novasComandas = { ...prev };
        delete novasComandas[dataSelecionada];
        return novasComandas;
      });
      setMesaSelecionada(null);
    }
  };

// ← Aqui, coloque a função exportarParaExcel

 const exportarParaExcel = () => {
    const dadosExportacao = [];
    Object.entries(comandasDoDia).forEach(([mesaId, com]) => {
      if (com && !Array.isArray(com)) {
        com.itens.forEach(item => {
          dadosExportacao.push({
            Data: dataSelecionada,
            Mesa: mesas.find(m => m.id === mesaId)?.nome || mesaId,
            Item: item.nome,
            Quantidade: item.quantidade,
            "Preço Unitário": item.preco.toFixed(2),
            "Total Item": (item.preco * item.quantidade).toFixed(2),
            Status: com.status || "Aberta",
          });
        });
      }
    });
    if (!dadosExportacao.length) return alert("Nenhuma comanda para exportar.");
    const ws = XLSX.utils.json_to_sheet(dadosExportacao);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Comandas");
    XLSX.writeFile(wb, `comandas_${dataSelecionada}.xlsx`);
  };

  // Imprimir comanda individual
 const imprimirComanda = (mesaId) => {
  const com = comandasDoDia[mesaId];
  if (!com || Array.isArray(com)) return alert("Comanda vazia ou inexistente.");

  let itens = "";
  com.itens.forEach(item => {
    itens += `<div style="margin-bottom: 4px;">
      ${item.quantidade}x ${item.nome}<br>
      R$ ${(item.preco * item.quantidade).toFixed(2)}
    </div>`;
  });

  const total = com.itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0).toFixed(2);

  const html = `
    <html>
    <head>
      <title>Comanda Mesa ${mesas.find(m => m.id === mesaId)?.nome || mesaId}</title>
      <style>
        * { font-family: monospace; }
        body {
          width: 58mm;
          padding: 4px;
          margin: 0;
        }
        h1 {
          font-size: 18px;
          text-align: center;
          margin: 4px 0;
        }
        .item {
          font-size: 14px;
          margin-bottom: 4px;
        }
        .total {
          font-size: 16px;
          font-weight: bold;
          text-align: right;
          border-top: 1px dashed #000;
          margin-top: 8px;
          padding-top: 4px;
        }
      </style>
    </head>
    <body>
      <h1>Comanda Mesa ${mesas.find(m => m.id === mesaId)?.nome || mesaId}</h1>
      ${itens}
      <div class="total">TOTAL: R$ ${total}</div>
    </body>
    </html>
  `;

  const printWindow = window.open("", "", "width=600,height=600");
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};

  // Imprimir todas as comandas do dia
const imprimirTodasComandas = () => {
  let html = `
    <html>
    <head>
      <title>Comandas do Dia ${dataSelecionada}</title>
      <style>
        * { font-family: monospace; }
        body {
          width: 58mm;
          padding: 4px;
          margin: 0;
        }
        h2 {
          font-size: 16px;
          text-align: center;
          margin: 6px 0;
          border-bottom: 1px dashed #000;
        }
        .item {
          font-size: 14px;
          margin-bottom: 4px;
        }
        .total {
          font-size: 14px;
          font-weight: bold;
          text-align: right;
          margin-top: 4px;
        }
        .total-dia {
          text-align: right;
          font-size: 16px;
          font-weight: bold;
          border-top: 2px dashed #000;
          margin-top: 8px;
          padding-top: 6px;
        }
        hr {
          border: none;
          border-top: 1px dashed #000;
          margin: 6px 0;
        }
      </style>
    </head>
    <body>
      <h2>COMANDAS - ${dataSelecionada}</h2>
  `;

  Object.entries(comandasDoDia).forEach(([mesaId, com]) => {
    if (com && !Array.isArray(com)) {
      html += `<div><strong>Mesa: ${mesas.find(m => m.id === mesaId)?.nome || mesaId}</strong><br>`;
      com.itens.forEach(item => {
        html += `<div class="item">${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2)}</div>`;
      });
      const total = com.itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0).toFixed(2);
      html += `<div class="total">Total: R$ ${total}</div><hr></div>`;
    }
  });

  html += `<div class="total-dia">TOTAL DO DIA: R$ ${totalVendaDia()}</div>`;
  html += `</body></html>`;

  const printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};
  // Filtrar comandas abertas ou finalizadas para exibir
  const mesasFiltradas = mesas.filter(mesa => {
    const com = comandasDoDia[mesa.id];
    if (!com) return true;
    if (!mostrarFinalizadas && com.status === "Finalizada") return false;
    return true;
  });

  // Estilos responsivos
  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: 1400,
      margin: "0 auto",
      padding: 16,
      backgroundColor: "#f39c12",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      textAlign: "center",
      marginBottom: 16,
      borderBottom: "2px solid #333",
      paddingBottom: 12,
    },
    dataInput: {
      marginTop: 8,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 12,
      flexWrap: "wrap",
    },
    inputData: {
      fontSize: 16,
      padding: "6px 10px",
      borderRadius: 4,
      border: "1px solid #ccc",
      minWidth: 150,
    },
    btnAddMesa: {
      padding: "6px 12px",
      fontSize: 16,
      backgroundColor: "#2c3e50",
      color: "#fff",
      border: "none",
      borderRadius: 4,
      cursor: "pointer",
      transition: "background-color 0.3s",
      whiteSpace: "nowrap",
    },
    main: {
      display: "flex",
      flex: 1,
      gap: 20,
      flexDirection: isMobile ? "column" : "row",
    },
    sidebar: {
      width: isMobile ? "100%" : 180,
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      height: isMobile ? "auto" : "calc(100vh - 160px)",
      overflowY: "auto",
      marginBottom: isMobile ? 20 : 0,
    },
    listaMesas: {
      marginTop: 8,
      display: "flex",
      flexDirection: "column",
      gap: 8,
    },
    mesaItem: {
      padding: "8px 12px",
      backgroundColor: "#e0e0e0",
      borderRadius: 6,
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      transition: "background-color 0.2s",
      userSelect: "none",
      fontSize: 16,
    },
    mesaSelecionada: {
      backgroundColor: "#2ecc71",
      color: "#fff",
      fontWeight: "600",
    },
    btnExcluirMesa: {
      backgroundColor: "transparent",
      border: "none",
      fontSize: 18,
      color: "#e74c3c",
      cursor: "pointer",
      marginLeft: 8,
      lineHeight: 1,
    },
    comandaSection: {
      flex: 2,
      backgroundColor: "#f5f5f5",
      borderRadius: 8,
      padding: 20,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      maxHeight: isMobile ? "auto" : "calc(100vh - 160px)",
      overflowY: "auto",
      marginBottom: isMobile ? 20 : 0,
    },
    comandaBotoes: {
      display: "flex",
      gap: 12,
      marginBottom: 12,
      flexWrap: "wrap",
    },
    btnStatus: {
      color: "#fff",
      border: "none",
      borderRadius: 6,
      padding: "8px 16px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: 14,
      whiteSpace: "nowrap",
    },
    btnLimpar: {
      backgroundColor: "#2980b9",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      padding: "8px 16px",
      cursor: "pointer",
      fontSize: 14,
      whiteSpace: "nowrap",
    },
    btnExcluir: {
      backgroundColor: "#e74c3c",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      padding: "8px 16px",
      cursor: "pointer",
      fontSize: 14,
      whiteSpace: "nowrap",
    },
    listaItens: {
      flex: 1,
      overflowY: "auto",
      marginBottom: 12,
    },
    itemLista: {
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 10px",
      borderBottom: "1px solid #ddd",
      fontSize: 16,
      cursor: "pointer",
      alignItems: "center",
    },
    itemQuantidade: {
      marginRight: 8,
      fontWeight: "600",
    },
    cardapioSection: {
      flex: 3,
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 20,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      overflowY: "auto",
      maxHeight: isMobile ? "auto" : "calc(100vh - 160px)",
    },
    categoriaCardapio: {
      marginBottom: 20,
    },
    tituloCategoria: {
      fontWeight: "700",
      fontSize: 18,
      marginBottom: 8,
      borderBottom: "2px solid #2c3e50",
      paddingBottom: 6,
    },
    listaProdutos: {
      display: "flex",
      flexWrap: "wrap",
      gap: 12,
    },
    produtoItem: {
      backgroundColor: "#2c3e50",
      color: "#fff",
      padding: "10px 12px",
      borderRadius: 6,
      cursor: "pointer",
      userSelect: "none",
      fontWeight: "600",
      fontSize: 14,
      whiteSpace: "nowrap",
      transition: "background-color 0.2s",
    },
    produtoItemHover: {
      backgroundColor: "#f1c40f",
      color: "#fff",
      padding: "10px 12px",
      borderRadius: 6,
      cursor: "pointer",
      userSelect: "none",
      fontWeight: "600",
      fontSize: 14,
      whiteSpace: "nowrap",
      transition: "background-color 0.2s",
    },
    rodape: {
      textAlign: "center",
      marginTop: 20,
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
    },
    filtroToggle: {
      marginBottom: 12,
      display: "flex",
      justifyContent: "center",
      gap: 12,
    },
    btnToggleFinalizadas: {
      backgroundColor: mostrarFinalizadas ? "#2c3e50" : "#27ae60",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      padding: "8px 20px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    btnImprimir: {
      backgroundColor: "#7f8c8d",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      padding: "8px 16px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: 14,
      whiteSpace: "nowrap",
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={exportarParaExcel} style={styles.btnExport}>
          Exportar Excel
        </button>
        <h1>Estrela Guia ⭐</h1>
        <div style={styles.dataInput}>
          <label htmlFor="data">Selecione a Data: </label>
          <input
            id="data"
            type="date"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
            style={styles.inputData}
          />
          <button onClick={adicionarMesa} style={styles.btnAddMesa}>Adicionar Mesa</button>
          <button onClick={imprimirTodasComandas} 
            style={{ backgroundColor: "#7f8c8d", color: "#fff", border: "none",
      borderRadius: 6,
      padding: "8px 16px",
      cursor: "pointer",
      fontSize: 14,
      whiteSpace: "nowrap" }}>Imprimir Todas</button>
           <button onClick={limparHistoricoDoDia}
             style={{ backgroundColor: "#e74c3c", color: "#fff", border: "none",
      borderRadius: 6,
      padding: "8px 16px",
      cursor: "pointer",
      fontSize: 14,
      whiteSpace: "nowrap", }}>
          Limpar Histórico do Dia
        </button>
        </div>
        <div style={styles.filtroToggle}>
          <button
            style={styles.btnToggleFinalizadas}
            onClick={() => setMostrarFinalizadas(!mostrarFinalizadas)}
            title="Mostrar/Ocultar comandas finalizadas"
          >
            {mostrarFinalizadas ? "Ocultar Finalizadas" : "Mostrar Finalizadas"}
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <aside style={styles.sidebar}>
          <div style={styles.listaMesas}>
            {mesasFiltradas.length === 0 && <p>Nenhuma mesa para mostrar.</p>}
            {mesasFiltradas.map((mesa) => {
              const isSelecionada = mesaSelecionada === mesa.id;
              return (
                <div
                  key={mesa.id}
                  style={{ ...styles.mesaItem, ...(isSelecionada ? styles.mesaSelecionada : {}) }}
                  onClick={() => setMesaSelecionada(mesa.id)}
                >
                  <span>{mesa.nome}</span>
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        editarNomeMesa(mesa.id);
                      }}
                      title="Editar nome"
                      style={{ ...styles.btnExcluirMesa, color: "#2980b9" }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        excluirMesa(mesa.id);
                      }}
                      title="Excluir mesa"
                      style={styles.btnExcluirMesa}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 20, fontWeight: "bold", textAlign: "center" }}>
            Total do Dia: R$ {totalVendaDia()}
          </div>
        </aside>

        <section style={styles.comandaSection}>
          {!mesaSelecionada && <p>Selecione uma mesa para visualizar ou editar a comanda.</p>}
          {mesaSelecionada && (
            <>
<h2>
  Comanda Mesa: {mesas.find(m => m.id === mesaSelecionada)?.nome || mesaSelecionada}{" "}
  <button
    onClick={() => toggleStatus(mesaSelecionada)}
    style={{
      ...styles.btnStatus,
      backgroundColor:
        (comandasDoDia[mesaSelecionada]?.status || "Aberta") === "Finalizada"
          ? "#27ae60" // Verde para Finalizada
          : "#f1c40f", // Amarelo para Aberta
      marginLeft: 12,
    }}
    title="Alternar status Aberta/Finalizada"
  >
    {comandasDoDia[mesaSelecionada]?.status || "Aberta"}
  </button>
</h2>
              <div style={styles.comandaBotoes}>
                <button
                  onClick={() => limparComanda(mesaSelecionada)}
                  style={styles.btnLimpar}
                  title="Limpar comanda"
                >
                  Limpar Comanda
                </button>
                <button
                  onClick={() => excluirComanda(mesaSelecionada)}
                  style={styles.btnExcluir}
                  title="Excluir comanda"
                >
                  Excluir Comanda
                </button>
                <button
                  onClick={() => imprimirComanda(mesaSelecionada)}
                  style={styles.btnImprimir}
                  title="Imprimir comanda"
                >
                  Imprimir Comanda
                </button>
              </div>
              <div style={styles.listaItens}>
                {(comandasDoDia[mesaSelecionada]?.itens?.length || 0) === 0 && <p>Comanda vazia.</p>}
                {(comandasDoDia[mesaSelecionada]?.itens || []).map((item, idx) => (
                  <div
                    key={`${item.nome}-${idx}`}
                    style={styles.itemLista}
                    onClick={() => removerItem(mesaSelecionada, item.nome)}
                    title="Clique para remover este item"
                  >
                    <span style={styles.itemQuantidade}>{item.quantidade}x</span>
                    <span>{item.nome}</span>
                    <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {(comandasDoDia[mesaSelecionada]?.itens?.length > 0) && (
  <div style={{ textAlign: "right", fontWeight: "bold", fontSize: 18, marginTop: 10 }}>
    Total da Comanda: R${" "}
    {comandasDoDia[mesaSelecionada].itens
      .reduce((acc, item) => acc + item.preco * item.quantidade, 0)
      .toFixed(2)}
  </div>
)}

            </>
          )}
        </section>

        <section style={styles.cardapioSection}>
{categoriasOrdenadas.map((categoria) => (
  <div key={categoria} style={styles.categoriaCardapio}>
    <h3 style={styles.tituloCategoria}>{categoria}</h3>
    <div style={styles.listaProdutos}>
      {produtosPorCategoria[categoria].map((produto) => (
        <div
          key={produto.nome}
          style={styles.produtoItem}
          onClick={(e) => {
            adicionarItem(produto);

            // Efeito de clique (flash)
            const el = e.currentTarget;
            const original = el.style.backgroundColor;
            el.style.backgroundColor = "#5d6d7e"; // Cor temporária no clique
            setTimeout(() => {
              el.style.backgroundColor = original;
            }, 300);
          }}
          title={`Adicionar ${produto.nome} - R$${produto.preco.toFixed(2)}`}
        >
          {produto.nome} - R$ {produto.preco.toFixed(2)}
        </div>
      ))}
    </div>
  </div>
          ))}
        </section>
      </main>

      <footer style={styles.rodape}>
        Sistema de Comandas &copy; 2025 - Desenvolvido @Luangabe
      </footer>
    </div>
  );
}

export default App;


