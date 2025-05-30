
  const SUPABASE_URL = 'https://iradphcrwwokdrnhxpnd.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyYWRwaGNyd3dva2Rybmh4cG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTI5ODEsImV4cCI6MjA2MjI4ODk4MX0.X1okOgCMPHNh_vufxDnSlENTO99tMDjkSOXMeWawNrU'; 

  const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const urlParams = new URLSearchParams(window.location.search);
const ticketId = parseInt(urlParams.get("ticket_id"));

document.addEventListener("DOMContentLoaded", async () => {
  if (!ticketId) {
    alert("Ticket ID not found.");
    return;
  }

  document.getElementById("assignedAgent").textContent = ticket.assigned_agent || "Unassigned";
  document.getElementById("date").textContent = new Date(ticket.created_at).toLocaleDateString();

  document.getElementById("issueDetails").innerHTML = `
    <h3>Issue</h3>
    <p><strong>Type:</strong> ${ticket.issue}</p>
    <p><strong>Description:</strong> ${ticket.description}</p>
  `;

  const { data: ticket, error } = await db
  .from("support_tickets")
  .select(`ticket_id, issue, description, status, created_at, assigned_agent, customer:customer_id(name, email)`)
  .eq("ticket_id", ticketId)
  .single();

 

  if (error || !ticket) {
    alert("Failed to load ticket.");
    console.error(error);
    return;
  }

  // Populate ticket UI
  document.getElementById("ticketNumber").textContent = `Ticket #${ticket.ticket_id}`;
  document.getElementById("statusBadge").textContent = ticket.status;
  document.getElementById("statusBadge").className = `status-badge ${ticket.status.toLowerCase().replace(/\s+/g, '-')}`;

  document.getElementById("customerDetails").innerHTML = `
    <h3>Customer Details</h3>
    <p><strong>Name:</strong> ${ticket.customer.name}</p>
    <p><strong>Email:</strong> ${ticket.customer.email}</p>
  `;

  document.getElementById("issueDetails").innerHTML = `
    <h3>Issue</h3>
    <p>${ticket.issue}</p>
  `;

  document.getElementById("assignedAgent").textContent = ticket.assigned_agent || "Unassigned";
  document.getElementById("date").textContent = new Date(ticket.created_at).toLocaleString();





});


function handleLogout() {
        sessionStorage.clear();
        window.location.href = 'customer_login.html';
      }
