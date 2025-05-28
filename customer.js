const SUPABASE_URL = 'https://iradphcrwwokdrnhxpnd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyYWRwaGNyd3dva2Rybmh4cG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTI5ODEsImV4cCI6MjA2MjI4ODk4MX0.X1okOgCMPHNh_vufxDnSlENTO99tMDjkSOXMeWawNrU'; 


const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)


document.getElementById('ticket-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
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
