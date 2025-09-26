let userRole = "user";
let lastSortBy = "";
let lastSortOrder = "asc";

// Login do usuário
document.getElementById("loginForm").onsubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://localhost:8000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const data = await response.json();
    if (data.success) {
      userRole = data.role;
      document.getElementById("loginForm").style.display = "none";
      document.getElementById("metricsSection").style.display = "block";
      loadMetrics();
    } else {
      alert("Login inválido");
      return;
    }
  } else {
    const err = await response.json();
    alert(err.detail || "Erro no login");
    return;
  }
};

document.getElementById("filterBtn").onclick = () => {
  loadMetrics();
};

// Filtra por data
async function loadMetrics(sortBy = "", sortOrder = "asc") {
  lastSortBy = sortBy || "";
  lastSortOrder = sortOrder || "asc";
  const startDate = document.getElementById("startDate").value || "";
  const endDate = document.getElementById("endDate").value || "";
  const response = await fetch("http://localhost:8000/metrics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      start_date: startDate,
      end_date: endDate,
      sort_by: sortBy,
      sort_order: sortOrder,
      role: userRole,
    }),
  });
  if (response.ok) {
    const data = await response.json();
    renderTable(data);
  } else {
    const err = await response.json();
    alert(err.detail || "Erro ao carregar métricas");
    return;
  }
}

// Renderiza a tabela com formatação básica
function formatNumber(num) {
  return Number(num).toLocaleString("pt-BR");
}
function formatMoney(num) {
  return Number(num).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
function formatCostMicros(micros) {
  return formatMoney(micros / 1_000_000);
}
function formatDate(str) {
  const d = new Date(str);
  if (isNaN(d)) return str;
  return d.toLocaleDateString("pt-BR");
}

function renderTable(data) {
  if (!data || data.length === 0) {
    document.getElementById("tableContainer").innerHTML =
      "<p>Nenhum dado disponível para o período selecionado.</p>";
    return;
  }

  const cols = Object.keys(data[0]);
  let html = "<table><thead><tr>";
  cols.forEach((col) => {
    html += `<th onclick="sortTable('${col}')">${col}</th>`;
  });

  html += "</tr></thead><tbody>";
  data.forEach((row) => {
    html += "<tr>";
    cols.forEach((col) => {
      let value = row[col];
      if (col === "date") value = formatDate(value);
      if (col === "impressions" || col === "clicks")
        value = formatNumber(value);
      if (col === "cost_micros") value = formatCostMicros(value);
      html += `<td>${value}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody></table>";
  document.getElementById("tableContainer").innerHTML = html;
}

window.sortTable = function (col) {
  let order = lastSortOrder === "asc" ? "desc" : "asc";
  loadMetrics(col, order);
};
