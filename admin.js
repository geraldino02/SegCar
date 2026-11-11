/**
 * SegCar - Portal Administrativo Oficial (Backoffice)
 * Gerenciamento centralizado de clientes, frota de rastreadores, finanças e mapa global.
 */

// ─── 1. Proteção de Rota (Guard) ─────────────────────────────────────────────
(function checkAdminAuth() {
  const clientId = localStorage.getItem('segcar_client_id');
  const isAdmin = localStorage.getItem('segcar_is_admin') === 'true';

  if (!clientId) {
    window.location.href = 'login.html';
    return;
  }

  if (!isAdmin && window.location.pathname.includes('admin.html')) {
    alert('Acesso Restrito: Sua conta não possui privilégios de Administrador.');
    window.location.href = 'dashboard.html';
  }
})();

// ─── 2. Configurações Globais & Estado ────────────────────────────────────────
let currentTab = 'tab-overview';
let fleetMap = null;
let fleetMarkers = {};
let allClients = [];
let allDevices = [];
let allPayments = [];
let refreshTimer = null;

// Determina dinamicamente a URL correta da API
function getApiUrl(endpoint) {
  let stored = localStorage.getItem('segcar_api_url');
  let base = '';
  
  if (stored && stored.trim() !== '') {
    base = stored.trim().replace(/\/+$/, '');
  } else {
    // Detecta se estamos rodando sob /segcar/ no XAMPP ou servidor standalone
    const path = window.location.pathname;
    if (path.includes('/segcar/')) {
      base = window.location.origin + '/segcar/sketch_jul12a/api/public/index.php';
    } else {
      base = window.location.origin + '/sketch_jul12a/api/public/index.php';
    }
  }

  endpoint = endpoint.replace(/^\/+/, '');
  return `${base}/${endpoint}`;
}

// ─── 3. Inicialização ao Carregar a Página ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Preencher dados do admin na sidebar
  const adminName = localStorage.getItem('segcar_client_name') || 'Administrador SegCar';
  const nameEl = document.getElementById('admin-sidebar-name');
  const avatarEl = document.getElementById('admin-sidebar-avatar');
  if (nameEl) nameEl.textContent = adminName;
  if (avatarEl) {
    const initials = adminName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    avatarEl.textContent = initials || 'AD';
  }

  // Carregar dados iniciais
  loadOverviewMetrics();
  loadClients();
  loadDevices();
  loadPayments();

  // Atualização periódica dos dados e mapa a cada 10 segundos
  refreshTimer = setInterval(() => {
    if (currentTab === 'tab-overview') loadOverviewMetrics(false);
    if (currentTab === 'tab-map') updateFleetMapPositions();
    if (currentTab === 'tab-devices') loadDevices(false);
  }, 10000);
});

// ─── 4. Navegação por Abas ───────────────────────────────────────────────────
function switchTab(tabId) {
  currentTab = tabId;

  // Atualizar visual da navegação
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });

  // Alternar painéis
  document.querySelectorAll('.tab-content').forEach(pane => {
    pane.classList.remove('active');
  });

  const activePane = document.getElementById(tabId);
  if (activePane) activePane.classList.add('active');

  // Atualizar título da Topbar
  const titleEl = document.getElementById('topbar-title');
  const subEl = document.getElementById('topbar-sub');

  switch (tabId) {
    case 'tab-overview':
      if (titleEl) titleEl.textContent = 'Visão Geral & Indicadores';
      if (subEl) subEl.textContent = 'Resumo operacional, receita recorrente e status dos rastreadores';
      loadOverviewMetrics();
      break;
    case 'tab-clients':
      if (titleEl) titleEl.textContent = 'Gestão de Clientes & Contas';
      if (subEl) subEl.textContent = 'Cadastro, edição e controle de permissões de acesso';
      loadClients();
      break;
    case 'tab-devices':
      if (titleEl) titleEl.textContent = 'Rastreadores & Frota';
      if (subEl) subEl.textContent = 'Dispositivos GPS, chaves de API e status de conexão';
      loadDevices();
      break;
    case 'tab-payments':
      if (titleEl) titleEl.textContent = 'Financeiro & Faturamento';
      if (subEl) subEl.textContent = 'Acompanhamento de mensalidades, recebimentos e faturas';
      loadPayments();
      break;
    case 'tab-map':
      if (titleEl) titleEl.textContent = 'Mapa Global da Frota';
      if (subEl) subEl.textContent = 'Rastreamento simultâneo de todos os veículos cadastrados';
      setTimeout(initGlobalMap, 150);
      break;
  }

  // Fechar sidebar mobile se aberta
  const sidebar = document.getElementById('adminSidebar');
  if (sidebar) sidebar.classList.remove('open');
}

function toggleMobileSidebar() {
  const sidebar = document.getElementById('adminSidebar');
  if (sidebar) sidebar.classList.toggle('open');
}

// ─── 5. Métricas e Visão Geral (Overview) ─────────────────────────────────────
function loadOverviewMetrics(showToasts = true) {
  fetch(getApiUrl('/api/admin/metrics'))
    .then(res => res.json())
    .then(data => {
      if (data && data.status === 'ok' && data.metrics) {
        const m = data.metrics;
        
        const elClients = document.getElementById('kpi-clients');
        const elDevices = document.getElementById('kpi-devices');
        const elOnline = document.getElementById('kpi-online');
        const elMrr = document.getElementById('kpi-mrr');
        const elTrips = document.getElementById('kpi-trips');
        const elRevenue = document.getElementById('kpi-revenue');

        if (elClients) elClients.textContent = m.total_clients || 0;
        if (elDevices) elDevices.textContent = m.total_devices || 0;
        if (elOnline) elOnline.textContent = m.online_devices || 0;
        if (elTrips) elTrips.textContent = m.total_trips || 0;
        
        if (elMrr) {
          elMrr.textContent = (m.mrr || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
        if (elRevenue) {
          elRevenue.textContent = (m.total_revenue || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }

        // Atualizar badges da sidebar
        const badgeClients = document.getElementById('badge-clients-count');
        const badgeDevices = document.getElementById('badge-devices-count');
        if (badgeClients) badgeClients.textContent = m.total_clients || 0;
        if (badgeDevices) badgeDevices.textContent = m.total_devices || 0;

        // Renderizar feed de atividade recente
        renderRecentActivity(data.recent_activity || []);
      }
    })
    .catch(err => {
      console.error('Erro ao carregar métricas:', err);
      if (showToasts) showToast('Não foi possível atualizar as métricas.', 'error');
    });
}

function renderRecentActivity(activities) {
  const tbody = document.getElementById('activity-table-body');
  if (!tbody) return;

  if (activities.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:1.5rem;">Nenhum sinal GPS registrado recentemente.</td></tr>';
    return;
  }

  tbody.innerHTML = activities.map(act => {
    const timeFormatted = act.received_at ? new Date(act.received_at.replace(' ', 'T')).toLocaleTimeString('pt-BR') : '--:--';
    const speed = parseFloat(act.velocidade_kmh || 0).toFixed(1);
    const isMoving = speed > 2;

    return `
      <tr>
        <td>
          <div style="font-weight:700; color:#fff;">${act.vehicle_model || 'Veículo'}</div>
          <div style="font-size:0.75rem; color:var(--accent-cyan); font-family:'JetBrains Mono', monospace;">${act.plate || 'n/d'}</div>
        </td>
        <td>
          <span style="color:#fff;">${act.client_name || 'Desconhecido'}</span>
        </td>
        <td>
          <span class="badge-status ${isMoving ? 'online' : 'client'}">
            ${isMoving ? 'Em Trânsito' : 'Estacionado'}
          </span>
        </td>
        <td class="mono-cell" style="font-weight:700; color:${isMoving ? '#34d399' : '#94a3b8'};">
          ${speed} km/h
        </td>
        <td class="mono-cell" style="color:var(--text-muted);">
          ${timeFormatted}
        </td>
      </tr>
    `;
  }).join('');
}

// ─── 6. Gestão de Clientes ───────────────────────────────────────────────────
function loadClients() {
  const tbody = document.getElementById('clients-table-body');
  if (tbody) tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:2rem;">Carregando clientes...</td></tr>';

  fetch(getApiUrl('/api/clients'))
    .then(res => res.json())
    .then(data => {
      if (data && data.status === 'ok' && data.clients) {
        allClients = data.clients;
        renderClientsTable(allClients);
      }
    })
    .catch(err => {
      console.error('Erro ao listar clientes:', err);
      if (tbody) tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--accent-rose); padding:2rem;">Erro ao conectar à API.</td></tr>';
    });
}

function renderClientsTable(clients) {
  const tbody = document.getElementById('clients-table-body');
  if (!tbody) return;

  if (clients.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:2rem;">Nenhum cliente cadastrado com os filtros atuais.</td></tr>';
    return;
  }

  tbody.innerHTML = clients.map(c => {
    const initials = (c.name || 'C').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const isAdmin = c.role === 'admin' || c.is_admin === 1;
    const device = (c.devices && c.devices.length > 0) ? c.devices[0] : null;

    const devicePlate = device ? device.plate : '<span style="color:var(--text-subtle);">Sem veículo</span>';
    const deviceModel = device ? device.vehicle_model : '-';
    const deviceId = device ? device.device_id : '';

    return `
      <tr>
        <td>
          <div class="client-meta-cell">
            <div class="avatar-initials">${initials}</div>
            <div>
              <div class="client-name-bold">${c.name}</div>
              <div class="client-contact-sub">${c.email || 'Sem e-mail'}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="badge-status ${isAdmin ? 'admin' : 'client'}">
            ${isAdmin ? 'Administrador' : 'Cliente'}
          </span>
        </td>
        <td class="mono-cell">${c.cpf || 'Não informado'}</td>
        <td>
          <div style="font-weight:600; color:#fff;">${deviceModel}</div>
          <div class="mono-cell" style="font-size:0.75rem; color:var(--text-muted);">${devicePlate}</div>
        </td>
        <td style="color:var(--text-muted); font-size:0.82rem;">
          ${c.phone || 'n/d'}
        </td>
        <td>
          <div class="action-btn-group">
            ${deviceId ? `
              <button class="btn-table-action track" onclick="trackVehicleInDashboard('${deviceId}', '${escapeQuotes(deviceModel)}', '${escapeQuotes(device ? device.plate : '')}', '${escapeQuotes(c.name)}')" title="Abrir no Painel de Telemetria">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                Monitorar
              </button>
            ` : ''}
            ${c.id > 2 ? `
              <button class="btn-table-action danger" onclick="deleteClient(${c.id}, '${escapeQuotes(c.name)}')" title="Excluir cadastro">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            ` : '<span style="font-size:0.75rem; color:var(--text-subtle); padding:0.4rem;">Sistema</span>'}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterClients() {
  const query = document.getElementById('client-search-input').value.toLowerCase().trim();
  if (!query) {
    renderClientsTable(allClients);
    return;
  }

  const filtered = allClients.filter(c => {
    const nameMatch = (c.name || '').toLowerCase().includes(query);
    const emailMatch = (c.email || '').toLowerCase().includes(query);
    const cpfMatch = (c.cpf || '').toLowerCase().includes(query);
    const plateMatch = c.devices && c.devices.some(d => (d.plate || '').toLowerCase().includes(query));
    return nameMatch || emailMatch || cpfMatch || plateMatch;
  });

  renderClientsTable(filtered);
}

function deleteClient(id, name) {
  if (!confirm(`Tem certeza que deseja excluir o cliente "${name}" e todo seu histórico de rastreamento?`)) {
    return;
  }

  fetch(getApiUrl(`/api/clients?client_id=${id}`), { method: 'DELETE' })
    .then(res => res.json())
    .then(data => {
      if (data && data.status === 'ok') {
        showToast('Cliente excluído com sucesso!', 'success');
        loadClients();
        loadOverviewMetrics(false);
      } else {
        showToast(data.message || 'Erro ao excluir cliente.', 'error');
      }
    })
    .catch(err => {
      showToast('Erro de rede: ' + err.message, 'error');
    });
}

// ─── 7. Gestão de Rastreadores & Frota ────────────────────────────────────────
function loadDevices(showLoading = true) {
  const tbody = document.getElementById('devices-table-body');
  if (showLoading && tbody) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:2rem;">Carregando dispositivos...</td></tr>';
  }

  fetch(getApiUrl('/api/admin/devices'))
    .then(res => res.json())
    .then(data => {
      if (data && data.status === 'ok' && data.devices) {
        allDevices = data.devices;
        renderDevicesTable(allDevices);
        if (currentTab === 'tab-map') updateFleetMapPositions();
      }
    })
    .catch(err => {
      console.error('Erro ao listar dispositivos:', err);
      if (tbody && showLoading) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--accent-rose); padding:2rem;">Erro ao carregar dispositivos.</td></tr>';
      }
    });
}

function renderDevicesTable(devices) {
  const tbody = document.getElementById('devices-table-body');
  if (!tbody) return;

  if (devices.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:2rem;">Nenhum dispositivo GPS cadastrado.</td></tr>';
    return;
  }

  tbody.innerHTML = devices.map(d => {
    const isOnline = d.is_online === true;
    const speed = parseFloat(d.velocidade_kmh || 0).toFixed(1);
    const lastPing = d.last_ping ? new Date(d.last_ping.replace(' ', 'T')).toLocaleString('pt-BR') : 'Nunca comunicou';

    return `
      <tr>
        <td class="mono-cell" style="font-weight:700; color:var(--accent-cyan);">
          ${d.device_id}
        </td>
        <td>
          <div style="font-weight:600; color:#fff;">${d.vehicle_model || 'Veículo'}</div>
          <div class="mono-cell" style="font-size:0.78rem; color:var(--text-muted);">${d.plate || 'SEM-PLACA'}</div>
        </td>
        <td>
          <span style="color:#fff;">${d.client_name || 'Sem cliente vinculado'}</span>
        </td>
        <td>
          <span class="badge-status ${isOnline ? 'online' : 'offline'}">
            ${isOnline ? '● Online (15m)' : '○ Sem sinal'}
          </span>
        </td>
        <td class="mono-cell">
          ${isOnline ? `<span style="color:#34d399; font-weight:700;">${speed} km/h</span>` : '<span style="color:var(--text-subtle);">0.0 km/h</span>'}
        </td>
        <td style="font-size:0.8rem; color:var(--text-muted);">
          ${lastPing}
        </td>
        <td>
          <div class="action-btn-group">
            <button class="btn-table-action track" onclick="trackVehicleInDashboard('${d.device_id}', '${escapeQuotes(d.vehicle_model || '')}', '${escapeQuotes(d.plate || '')}', '${escapeQuotes(d.client_name || '')}')" title="Acompanhar no Dashboard">
              Monitorar
            </button>
            <button class="btn-table-action" onclick="focusDeviceOnMap('${d.device_id}')" title="Ver no Mapa Global">
              Ver Mapa
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ─── 8. Financeiro & Faturas ─────────────────────────────────────────────────
function loadPayments() {
  const tbody = document.getElementById('payments-table-body');
  if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:2rem;">Carregando pagamentos...</td></tr>';

  fetch(getApiUrl('/api/admin/payments'))
    .then(res => res.json())
    .then(data => {
      if (data && data.status === 'ok' && data.payments) {
        allPayments = data.payments;
        renderPaymentsTable(allPayments);
      }
    })
    .catch(err => {
      console.error('Erro ao carregar pagamentos:', err);
      if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--accent-rose); padding:2rem;">Erro ao carregar faturas.</td></tr>';
    });
}

function renderPaymentsTable(payments) {
  const tbody = document.getElementById('payments-table-body');
  if (!tbody) return;

  if (payments.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:2rem;">Nenhuma fatura registrada.</td></tr>';
    return;
  }

  tbody.innerHTML = payments.map(p => {
    const isPaid = p.status === 'paid';
    const amountFormatted = parseFloat(p.amount || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const dueDate = p.due_date ? new Date(p.due_date + 'T00:00:00').toLocaleDateString('pt-BR') : '--/--/----';
    const paidAt = p.paid_at ? new Date(p.paid_at.replace(' ', 'T')).toLocaleString('pt-BR') : '-';

    return `
      <tr>
        <td class="mono-cell" style="font-size:0.8rem; color:var(--text-muted);">
          #FAT-${String(p.id).padStart(4, '0')}
        </td>
        <td>
          <div style="font-weight:700; color:#fff;">${p.client_name}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${p.plan_name || 'Plano SegCar'}</div>
        </td>
        <td class="mono-cell" style="font-weight:700; color:#fff;">
          ${amountFormatted}
        </td>
        <td class="mono-cell" style="color:var(--accent-cyan); text-transform:uppercase;">
          ${p.payment_method || 'PIX'}
        </td>
        <td>
          <span class="badge-status ${isPaid ? 'paid' : 'pending'}">
            ${isPaid ? 'Pago' : 'Pendente'}
          </span>
        </td>
        <td style="font-size:0.8rem; color:var(--text-muted);">
          Vence: ${dueDate}<br>
          <small style="color:${isPaid ? 'var(--accent-emerald)' : 'var(--text-subtle)'};">
            ${isPaid ? `Baixa: ${paidAt}` : 'Aguardando compensação'}
          </small>
        </td>
        <td>
          <div class="action-btn-group">
            ${!isPaid ? `
              <button class="btn-table-action" style="background:rgba(16,185,129,0.15); color:#34d399; border-color:rgba(16,185,129,0.3);" onclick="changePaymentStatus(${p.id}, 'paid')" title="Confirmar recebimento manual">
                Dar Baixa
              </button>
            ` : `
              <button class="btn-table-action" onclick="changePaymentStatus(${p.id}, 'pending')" title="Reverter para pendente">
                Reabrir
              </button>
            `}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function changePaymentStatus(paymentId, status) {
  fetch(getApiUrl('/api/admin/payments/status'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payment_id: paymentId, status: status })
  })
    .then(res => res.json())
    .then(data => {
      if (data && data.status === 'ok') {
        showToast('Status da fatura atualizado com sucesso!', 'success');
        loadPayments();
        loadOverviewMetrics(false);
      } else {
        showToast(data.message || 'Erro ao atualizar fatura.', 'error');
      }
    })
    .catch(err => {
      showToast('Erro de rede: ' + err.message, 'error');
    });
}

// ─── 9. Mapa Global da Frota (Leaflet) ────────────────────────────────────────
function initGlobalMap() {
  if (fleetMap) {
    fleetMap.invalidateSize();
    updateFleetMapPositions();
    return;
  }

  const mapContainer = document.getElementById('fleet-map');
  if (!mapContainer) return;

  // Centro inicial padrão em Rio Claro - SP
  fleetMap = L.map('fleet-map', { zoomControl: true }).setView([-22.398, -47.558], 13);

  // Camada de mapa escuro OpenStreetMap
  const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(fleetMap);

  const tilePane = fleetMap.getPane('tilePane');
  if (tilePane) tilePane.classList.add('dark-tiles');

  updateFleetMapPositions();
}

function updateFleetMapPositions() {
  if (!fleetMap || allDevices.length === 0) return;

  const fleetSidebar = document.getElementById('fleet-items-scroll');
  const bounds = [];
  let sidebarHtml = '';

  allDevices.forEach(d => {
    if (!d.latitude || !d.longitude) return;

    const lat = parseFloat(d.latitude);
    const lng = parseFloat(d.longitude);
    const isOnline = d.is_online === true;
    const speed = parseFloat(d.velocidade_kmh || 0);
    const isMoving = isOnline && speed > 2;

    bounds.push([lat, lng]);

    // Cor do marcador baseada no status: Verde (em movimento), Azul (estacionado), Cinza (offline)
    const markerColor = isMoving ? '#10b981' : (isOnline ? '#3b82f6' : '#64748b');

    // Ícone SVG personalizado
    const customIcon = L.divIcon({
      className: 'custom-fleet-marker',
      html: `
        <div style="background:${markerColor}; width:32px; height:32px; border-radius:50%; border:2px solid #fff; display:flex; align-items:center; justify-content:center; box-shadow:0 0 12px ${markerColor};">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const popupContent = `
      <div style="color:#0f172a; font-family:'Plus Jakarta Sans', sans-serif; min-width:180px;">
        <h4 style="margin:0 0 4px; font-size:0.95rem; font-weight:700;">${d.vehicle_model || 'Veículo'}</h4>
        <div style="font-family:'JetBrains Mono', monospace; font-size:0.8rem; font-weight:700; color:#0284c7; margin-bottom:6px;">${d.plate || 'SEM-PLACA'}</div>
        <div style="font-size:0.8rem; color:#475569; margin-bottom:4px;"><strong>Cliente:</strong> ${d.client_name || 'n/d'}</div>
        <div style="font-size:0.8rem; color:#475569; margin-bottom:4px;"><strong>Velocidade:</strong> ${speed.toFixed(1)} km/h</div>
        <div style="font-size:0.8rem; color:#475569; margin-bottom:8px;"><strong>Status:</strong> ${isMoving ? 'Em trânsito' : (isOnline ? 'Parado' : 'Sem sinal')}</div>
        <button onclick="trackVehicleInDashboard('${d.device_id}', '${escapeQuotes(d.vehicle_model || '')}', '${escapeQuotes(d.plate || '')}', '${escapeQuotes(d.client_name || '')}')" style="width:100%; background:#0284c7; color:#fff; border:none; border-radius:4px; padding:6px; font-weight:600; cursor:pointer; font-size:0.8rem;">
          Abrir no Dashboard
        </button>
      </div>
    `;

    if (fleetMarkers[d.device_id]) {
      fleetMarkers[d.device_id].setLatLng([lat, lng]);
      fleetMarkers[d.device_id].setIcon(customIcon);
      fleetMarkers[d.device_id].getPopup().setContent(popupContent);
    } else {
      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(fleetMap);
      marker.bindPopup(popupContent);
      fleetMarkers[d.device_id] = marker;
    }

    // Adicionar item na lista lateral do mapa
    sidebarHtml += `
      <div class="fleet-item-card" onclick="flyToDevice('${d.device_id}', ${lat}, ${lng})">
        <div class="fleet-item-top">
          <span class="fleet-item-model">${d.vehicle_model || 'Veículo'}</span>
          <span class="badge-status ${isOnline ? 'online' : 'offline'}" style="font-size:0.68rem; padding:0.2rem 0.5rem;">
            ${isMoving ? 'Movimento' : (isOnline ? 'Parado' : 'Offline')}
          </span>
        </div>
        <div class="fleet-item-meta">
          <span class="mono-cell" style="color:var(--accent-cyan); font-weight:600;">${d.plate || 'SEM-PLACA'}</span>
          <span>${isOnline ? `${speed.toFixed(0)} km/h` : 'Sem sinal'}</span>
        </div>
        <div style="font-size:0.72rem; color:var(--text-subtle); margin-top:0.3rem;">
          ${d.client_name || 'Sem cliente'}
        </div>
      </div>
    `;
  });

  if (fleetSidebar) fleetSidebar.innerHTML = sidebarHtml || '<div style="color:var(--text-muted); font-size:0.8rem; text-align:center; padding:1rem;">Nenhum veículo posicionado.</div>';

  if (bounds.length > 0 && fleetMap.getZoom() === 13) {
    fleetMap.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  }
}

function flyToDevice(deviceId, lat, lng) {
  if (!fleetMap) return;
  fleetMap.flyTo([lat, lng], 16, { duration: 1 });
  if (fleetMarkers[deviceId]) {
    setTimeout(() => fleetMarkers[deviceId].openPopup(), 1050);
  }
}

function focusDeviceOnMap(deviceId) {
  if (typeof switchView === 'function') {
    switchView('view-admin-map');
  } else {
    switchTab('tab-map');
  }
  const dev = allDevices.find(d => d.device_id === deviceId);
  if (dev && dev.latitude && dev.longitude) {
    setTimeout(() => flyToDevice(deviceId, parseFloat(dev.latitude), parseFloat(dev.longitude)), 300);
  }
}

// ─── 10. Modais de Cadastro ──────────────────────────────────────────────────
function openNewClientModal() {
  const modal = document.getElementById('new-client-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.getElementById('new-client-form').reset();
  }
}

function closeNewClientModal() {
  const modal = document.getElementById('new-client-modal');
  if (modal) modal.style.display = 'none';
}

function handleNewClientSubmit(e) {
  e.preventDefault();

  const payload = {
    name: document.getElementById('modal-client-name').value.trim(),
    email: document.getElementById('modal-client-email').value.trim(),
    cpf: document.getElementById('modal-client-cpf').value.trim(),
    phone: document.getElementById('modal-client-phone').value.trim(),
    birth_date: document.getElementById('modal-client-birth').value,
    password: document.getElementById('modal-client-pass').value,
    role: document.getElementById('modal-client-role').value
  };

  fetch(getApiUrl('/api/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      if (data && data.status === 'ok') {
        showToast('Novo usuário cadastrado com sucesso!', 'success');
        closeNewClientModal();
        loadClients();
        loadOverviewMetrics(false);
      } else {
        showToast(data.message || 'Erro ao cadastrar cliente.', 'error');
      }
    })
    .catch(err => {
      showToast('Erro de rede: ' + err.message, 'error');
    });
}

function openNewDeviceModal() {
  const modal = document.getElementById('new-device-modal');
  if (!modal) return;

  // Preencher seletor de clientes
  const select = document.getElementById('modal-device-client');
  if (select) {
    select.innerHTML = allClients.map(c => `<option value="${c.id}">${c.name} (${c.email || c.cpf || 'ID ' + c.id})</option>`).join('');
  }

  modal.style.display = 'flex';
  document.getElementById('new-device-form').reset();
  // Chave API gerada aleatória por padrão
  document.getElementById('modal-device-apikey').value = 'segcar-key-' + Math.random().toString(36).substring(2, 10);
}

function closeNewDeviceModal() {
  const modal = document.getElementById('new-device-modal');
  if (modal) modal.style.display = 'none';
}

function handleNewDeviceSubmit(e) {
  e.preventDefault();

  const payload = {
    device_id: document.getElementById('modal-device-id').value.trim(),
    client_id: parseInt(document.getElementById('modal-device-client').value, 10),
    vehicle_model: document.getElementById('modal-device-model').value.trim(),
    plate: document.getElementById('modal-device-plate').value.trim().toUpperCase(),
    api_key: document.getElementById('modal-device-apikey').value.trim(),
    active: 1
  };

  fetch(getApiUrl('/api/admin/devices'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      if (data && data.status === 'ok') {
        showToast('Dispositivo/veículo cadastrado com sucesso!', 'success');
        closeNewDeviceModal();
        loadDevices();
        loadClients();
        loadOverviewMetrics(false);
      } else {
        showToast(data.message || 'Erro ao salvar dispositivo.', 'error');
      }
    })
    .catch(err => {
      showToast('Erro de rede: ' + err.message, 'error');
    });
}

// ─── 11. Ações Rápidas & Helpers ─────────────────────────────────────────────
function trackVehicleInDashboard(deviceId, vehicleModel, plate, clientName) {
  localStorage.setItem('segcar_device', deviceId);
  localStorage.setItem('segcar_vehicle_model', vehicleModel || 'Veículo');
  localStorage.setItem('segcar_vehicle_plate', plate || 'n/d');
  localStorage.setItem('segcar_client_name', clientName || 'Cliente');

  showToast(`Alternando monitoramento para: ${vehicleModel} (${plate})...`, 'info');

  if (window.location.pathname.includes('dashboard.html')) {
    if (typeof config !== 'undefined') config.deviceId = deviceId;
    if (typeof clientInfo !== 'undefined') {
      clientInfo.name = clientName;
      clientInfo.vehicleModel = vehicleModel;
      clientInfo.plate = plate;
    }
    if (typeof updateClientBadgeUI === 'function') updateClientBadgeUI();
    if (typeof switchView === 'function') switchView('view-live');
    if (typeof fetchNow === 'function') fetchNow();
  } else {
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 600);
  }
}

function handleLogout() {
  localStorage.removeItem('segcar_client_id');
  localStorage.removeItem('segcar_client_name');
  localStorage.removeItem('segcar_vehicle_model');
  localStorage.removeItem('segcar_vehicle_plate');
  localStorage.removeItem('segcar_client_phone');
  localStorage.removeItem('segcar_device');
  localStorage.removeItem('segcar_apikey');
  localStorage.removeItem('segcar_is_admin');
  window.location.href = 'login.html';
}

function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeQuotes(str) {
  if (!str) return '';
  return String(str).replace(/'/g, "\\'");
}
