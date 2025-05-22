// customer.js

const SUPABASE_URL = 'https://yzygiaffkaoytroaeodc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6eWdpYWZma2FveXRyb2Flb2RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1Mzg2NTksImV4cCI6MjA2MjExNDY1OX0.no9SbRY08jXaIgbjpnEvTzN4-JBX6WBEBzFtUpGhkgw'

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ticket-form')

  if (!form) return

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const name = form.name.value.trim()
    const email = form.email.value.trim()
    const phone = form.phone.value.trim()
    const issue = form.issue.value
    const order_details = form.order_details.value.trim()

    const { data, error } = await db
      .from('main')
      .insert([{ name, email, phone, issue, order_details }])

    if (error) {
      alert('Error submitting ticket: ' + error.message)
    } else {
      alert('Ticket submitted successfully! Thank you 🥳')
      form.reset()
    }
  })
})
