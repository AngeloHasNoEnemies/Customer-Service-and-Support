const SUPABASE_URL = 'https://yzygiaffkaoytroaeodc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6eWdpYWZma2FveXRyb2Flb2RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1Mzg2NTksImV4cCI6MjA2MjExNDY1OX0.no9SbRY08jXaIgbjpnEvTzN4-JBX6WBEBzFtUpGhkgw'

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)


document.getElementById('ticket-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const issue = document.getElementById('issue').value;
  const description = document.getElementById('order_details').value.trim();

  try {
    // 1. Find the customer by email
    const { data: customerData, error: customerError } = await db
      .from('customers')
      .select('customer_id')
      .eq('email', email)
      .single();

    if (customerError || !customerData) {
      alert("Customer not found. Please sign up first.");
      return;
    }

    const customer_id = customerData.customer_id;

      // 🔍 DEBUG LOG — inspect what you’ll insert
    console.log({ email, customerData, customer_id });

    // 2. Insert into support_tickets
    const { error: ticketError } = await db
      .from('support_tickets')
      .insert([{
        customer_id,
        issue,
        priority: 'Medium',
        status: 'Open',
        created_at: new Date().toISOString(),
        assigned_to: null,
        escalated_to: null,
        description
      }]);

      // 3. Also insert into 'main' table
    const { error: mainError } = await db
      .from('main')
      .insert([{
        name,
        email,
        phone,
        issue,
        order_details: description
      }]);

    if (mainError) {
      console.error("Failed to insert into main table:", mainError.message);
    }

    if (ticketError) {
      alert("Failed to submit ticket: " + ticketError.message);
    } else {
      alert("Ticket submitted successfully!");
      document.getElementById('ticket-form').reset();
    }

  } catch (err) {
    console.error("Unexpected error:", err);
    alert("Something went wrong.");
  }
});

document.getElementById("name").value = sessionStorage.getItem("customerName") || '';
document.getElementById("email").value = sessionStorage.getItem("customerEmail") || '';
document.getElementById("phone").value = sessionStorage.getItem("customerPhone") || '';

function handleLogout() {
  // Example: Clear session storage or token
  sessionStorage.clear(); // or localStorage.clear(); if you used that
  alert("You have been logged out.");
  window.location.href = "customer_login.html";
}
