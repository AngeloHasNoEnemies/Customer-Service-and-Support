const SUPABASE_URL = 'https://yzygiaffkaoytroaeodc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6eWdpYWZma2FveXRyb2Flb2RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1Mzg2NTksImV4cCI6MjA2MjExNDY1OX0.no9SbRY08jXaIgbjpnEvTzN4-JBX6WBEBzFtUpGhkgw'

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function mapPriority(priority) {
  const map = {1: 'High', 2: 'Medium', 3: 'Low'}
  return map[priority] || 'Medium'
}

function mapStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

async function loadDashboard() {
  let { data: tickets, error } = await supabase
    .from('main')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tickets:', error)
    alert('Failed to load tickets data.')
    return
  }
  document.querySelector('.metric-box:nth-child(1) span').textContent = tickets.length
  const pendingReturns = tickets.filter(t => t.issue === 'return_request' && t.status === 'pending').length
  document.querySelector('.metric-box:nth-child(2) span').textContent = pendingReturns
  const now = new Date()
  const slaAlerts = tickets.filter(t => {
    if (!t.status) return false
    if (t.status.toLowerCase() === 'open' || t.status.toLowerCase() === 'pending') {
      const createdAt = new Date(t.created_at)
      const diffHours = (now - createdAt) / (1000 * 60 * 60)
      return diffHours > 48
    }
    return false
  }).length
  document.querySelector('.metric-box:nth-child(3) span').textContent = slaAlerts
  document.querySelector('.metric-box:nth-child(4) span').textContent = '89%'
  const tbody = document.querySelector('.tickets-table tbody')
  tbody.innerHTML = ''

  tickets.forEach(ticket => {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td>${ticket.main_id || 'N/A'}</td>
      <td>${ticket.name || 'Unknown'}</td>
      <td>${ticket.issue || 'N/A'}</td>
      <td>${mapPriority(ticket.priority || 2)}</td>
      <td>${mapStatus(ticket.status || 'Open')}</td>
      <td>${ticket.assigned_to || 'Unassigned'}</td>
      <td><a href="#" class="view-link">View</a></td>
    `
    tbody.appendChild(tr)
  })
}

document.addEventListener('DOMContentLoaded', () => {
  loadDashboard()
})
