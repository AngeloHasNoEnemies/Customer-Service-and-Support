const SUPABASE_URL = 'https://yzygiaffkaoytroaeodc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6eWdpYWZma2FveXRyb2Flb2RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1Mzg2NTksImV4cCI6MjA2MjExNDY1OX0.no9SbRY08jXaIgbjpnEvTzN4-JBX6WBEBzFtUpGhkgw'

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function fetchTickets() {
  const { data, error } = await db.from('main').select('*')

  if (error) {
    console.error('Error fetching tickets:', error.message)
    return
  }

  console.log('Fetched tickets:', data)


  const tableBody = document.querySelector('.ca-table tbody')
  tableBody.innerHTML = '' 

  const issueCounts = {}

  data.forEach(ticket => {
    if (!issueCounts[ticket.issue]) {
      issueCounts[ticket.issue] = { count: 0, totalTime: 0 }
    }
    issueCounts[ticket.issue].count += 1
    issueCounts[ticket.issue].totalTime += Math.random() * 4 + 1 //fake data
  })

  for (const issue in issueCounts) {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td>${issue.replaceAll('_', ' ')}</td>
      <td>${issueCounts[issue].count}</td>
      <td>${(issueCounts[issue].totalTime / issueCounts[issue].count).toFixed(1)} hrs</td>
    `
    tableBody.appendChild(tr)
  }
}

fetchTickets()
