
// Variáveis globais
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

// Função de login
async function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const Data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('role', data.role);
            window.location.href = 'dashboard.html';
        } else {
            document.getElementById('error-message').innerText = data.detail || 'Erro no login';
        }
    } catch (error) {
        document.getElementById('error-message').innerText = 'Erro de conexão';
        console.error(error);
    }
}

// Função do Dashboard
async function fetchMetrics() {
    const filterDate = document.getElementById('filter-date').value;
    let url = 'http://localhost:8000/metrics';
    if (filterDate) url += `?date=${filterDate}`;

    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        const Data = await response.json();
        populateTable(Data);
    } catch (error) {
        console.error('Erro ao buscar métricas:', error);
    }
}

function populateTable(data) {
    const tbody = document.querySelector('#metricsTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.account}</td>
            <td>${row.impressions}</td>
            <td>${row.cliks}</td>
            ${role === 'admin' ? `<td>${row.cost_micros}</td>` : '<td>--</td>'}
        `;
        tbody.appendChild(tr);
    });
}

// Ordenação da tabela
function sortTable(column) {
    const tbody = document.querySelector('#metricsTable tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    const index = Array.from(document.querySelectorAll('#metricsTable th')).findIndex(th => th.dataset.column === column);
    if (index === -1) return;

    rows.sort((a, b) => {
        const cellA = a.children[index].innerText;
        const cellB = b.children[index].innerText;

        return !isNaN(cellA) && !isNaN(cellB) ? cellA - cellB : cellA.localeCompare(cellB);
    });

    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}

// Eventos
const loginForm = document.getElementById('loginForm');
if (loginForm) loginForm.addEventListener('submit', loginUser);

const filterDateInput = document.getElementById('filter-date');
if (filterDateInput) filterDateInput.addEventListener('change', fetchMetrics);

const tableHeaders = document.querySelectorAll('#metricsTable th');
tableHeaders.forEach(th => {
    th.addEventListener('click', () => {
        const column = th.dataset.column;
        sortTable(column);
    });
});

// Carregar métricas ao carregar a página do dashboard
window.onload = () => {
    if (document.getElementById('metricsTable')) fetchMetrics();
};