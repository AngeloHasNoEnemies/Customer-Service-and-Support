// Supabase configuration
const SUPABASE_URL = 'https://iradphcrwwokdrnhxpnd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyYWRwaGNyd3dva2Rybmh4cG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTI5ODEsImV4cCI6MjA2MjI4ODk4MX0.X1okOgCMPHNh_vufxDnSlENTO99tMDjkSOXMeWawNrU'; 


// ✅ Fix: use `window.supabase` from the loaded script
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// Helper to capitalize status
function mapStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

// Load and render dashboard metrics and tickets
async function loadDashboard() {
  const { data: tickets, error } = await client
    .from('support_tickets')
    .select('*')
    .order('ticket_id', { ascending: false });

  if (error) {
    console.error('Error fetching support_tickets:', error);
    alert('Failed to load tickets data.');
    return;
  }

  // ✅ Metrics
  document.querySelector('.metric-box:nth-child(1) span').textContent = tickets.length;

  const pendingReturns = tickets.filter(
    t => t.issue === 'return_request' && t.status?.toLowerCase() === 'pending'
  ).length;
  document.querySelector('.metric-box:nth-child(2) span').textContent = pendingReturns;

  const now = new Date();
  const slaAlerts = tickets.filter(t => {
    if (!t.status) return false;
    const lowerStatus = t.status.toLowerCase();
    if (lowerStatus === 'open' || lowerStatus === 'pending') {
      const createdAt = new Date(t.created_at);
      const diffHours = (now - createdAt) / (1000 * 60 * 60);
      return diffHours > 48;
    }
    return false;
  }).length;
  document.querySelector('.metric-box:nth-child(3) span').textContent = slaAlerts;

  // CSAT is hardcoded for now
  document.querySelector('.metric-box:nth-child(4) span').textContent = '89%';

  // ✅ Tickets Table
  const tbody = document.querySelector('.tickets-table tbody');
  tbody.innerHTML = '';

  tickets.forEach(ticket => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${ticket.ticket_id || 'N/A'}</td>
      <td>${ticket.customer_id || 'Unknown'}</td>
      <td>${ticket.issue || 'N/A'}</td>
      <td>${ticket.priority || 'N/A' }</td>
      <td>${ticket.status || 'N/A'}</td>
      <td>${ticket.created_at || 'N/A'}</td>
      <td>${ticket.assigned_to || 'Unassigned'}</td>
      <td><a href="view_tickets.html?ticket_id=${ticket.ticket_id}">View</a></td>
    `;
    tbody.appendChild(tr);
  });
}

// When DOM is ready, load dashboard
document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
});

 function handleLogout() {
        sessionStorage.clear();
        window.location.href = 'admin_login.html';
      }
