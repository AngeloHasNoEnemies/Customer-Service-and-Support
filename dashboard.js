// Supabase configuration
const SUPABASE_URL = 'https://yzygiaffkaoytroaeodc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6eWdpYWZma2FveXRyb2Flb2RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1Mzg2NTksImV4cCI6MjA2MjExNDY1OX0.no9SbRY08jXaIgbjpnEvTzN4-JBX6WBEBzFtUpGhkgw';

// ✅ Fix: use `window.supabase` from the loaded script
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to map priority
function mapPriority(priority) {
  const map = { 1: 'High', 2: 'Medium', 3: 'Low' };
  return map[priority] || 'Medium';
}

// Helper to capitalize status
function mapStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

// Load and render dashboard metrics and tickets
async function loadDashboard() {
  const { data: main, error } = await client
    .from('main')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching main:', error);
    alert('Failed to load tickets data.');
    return;
  }

  // ✅ Metrics
  document.querySelector('.metric-box:nth-child(1) span').textContent = main.length;

  const pendingReturns = main.filter(
    t => t.issue === 'return_request' && t.status?.toLowerCase() === 'pending'
  ).length;
  document.querySelector('.metric-box:nth-child(2) span').textContent = pendingReturns;

  const now = new Date();
  const slaAlerts = main.filter(t => {
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

  main.forEach(ticket => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${ticket.main_id || 'N/A'}</td>
      <td>${ticket.name || 'Unknown'}</td>
      <td>${ticket.issue || 'N/A'}</td>
      <td>${mapPriority(ticket.priority || 2)}</td>
      <td>${mapStatus(ticket.status || 'Open')}</td>
      <td>${ticket.created_at || 'N/A'}</td>
      <td>${ticket.assigned_to || 'Unassigned'}</td>
      <td><a href="view_tickets.html">View</a></td>
    `;
    tbody.appendChild(tr);
  });
}

// When DOM is ready, load dashboard
document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
});
