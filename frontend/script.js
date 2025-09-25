
let userRole = "user";

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
        userRole = data.role;
        document.getElementById("loginForm").style.display = "none";
        document.getElementById("metricsSection").style.display = "block";
        loadMetrics(data.role === "admin" ? "value" : null);
    } else {
        alert("Login inválido");
    }
};

document.getElementById("filterBtn").onclick = () => {
    loadMetrics();
};

// Filtra por data e ordena por coluna
async function loadMetrics(sortBy = null, sortOrder = "asc") {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const response = await fetch("http://localhost:8000/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start_date: startDate, end_date: endDate, sort_by: sortBy, sort_order: sortOrder, role: userRole }),
    });
    const data = await response.json();
    renderTable(data);
}

function renderTable(data) {
    if (data.length === 0) {
        document.getElementById("tableContainer").innerHTML = "<p>Nenhum dado disponível para o período selecionado.</p>";
    }

    const cols = Object.keys(data[0]);
    let html = "<table><thead><tr>";
    cols.forEach(col => {
        html += `<th onclick="sortTable('${col}')">${col}</th>`;
    });

    html += "</tr></thead><tbody>";
    data.forEach(row => {
        html += "<tr>";
        cols.forEach(col => {
            html += `<td>${row[col]}</td>`;
        });
        html += "</tr>";
    });

    html += "</tbody></table>";
    document.getElementById("tableContainer").innerHTML = html;
}

window.sortTable = function(col) {
    loadMetrics(col, "asc");
};