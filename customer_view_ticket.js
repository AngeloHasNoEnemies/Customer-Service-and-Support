
  const SUPABASE_URL = 'https://iradphcrwwokdrnhxpnd.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyYWRwaGNyd3dva2Rybmh4cG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTI5ODEsImV4cCI6MjA2MjI4ODk4MX0.X1okOgCMPHNh_vufxDnSlENTO99tMDjkSOXMeWawNrU'; 

  const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  let ticket; // Global ticket variable

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const ticketId = parseInt(urlParams.get("ticket_id"));

  if (!ticketId) {
    alert("Ticket ID not found.");
    return;
  }

  const { data, error } = await db
    .from("support_tickets")
    .select("*")
    .eq("ticket_id", ticketId)
    .single();

  if (error || !data) {
    alert("Failed to load ticket.");
    console.error(error);
    return;
  }

  ticket = data; // make ticket available globally

  document.getElementById("ticketNumber").textContent = `Ticket #${ticket.ticket_id}`;
  document.getElementById("statusBadge").textContent = ticket.status;
  document.getElementById("statusBadge").className = `status-badge ${ticket.status.toLowerCase().replace(/\s+/g, '-')}`;


  document.getElementById("assignedAgent").textContent = ticket.assigned_agent || "Unassigned";
  document.getElementById("date").textContent = new Date(ticket.created_at).toLocaleDateString();

  
  document.getElementById("date").textContent = new Date(ticket.created_at).toLocaleDateString();

  if (ticket.assigned_to) {
    const { data: agent, error: agentError } = await db
      .from("agents")
      .select("name")
      .eq("agent_id", ticket.assigned_to)
      .single();

    if (!agentError && agent) {
      document.getElementById("assignedAgent").textContent = agent.name;
    } else {
      document.getElementById("assignedAgent").textContent = "Unknown Agent";
    }
    } else {
      document.getElementById("assignedAgent").textContent = "Unassigned";
  }

  document.getElementById("date").textContent = new Date(ticket.created_at).toLocaleDateString();


  const { data: customer, error: custError } = await db
    .from("customers")
    .select("name, email, phone")
    .eq("customer_id", ticket.customer_id)
    .single();

  if (!custError && customer) {
    document.getElementById("customerDetails").innerHTML = `
      <h3>Customer Details</h3>
      <p><strong>Name:</strong> ${customer.name}</p>
      <p><strong>Email:</strong> ${customer.email}</p>
      <p><strong>Phone:</strong> ${customer.phone}</p>
    `;
  }

  document.getElementById("issueDetails").innerHTML = `
    <h3>Issue</h3>
    <p><strong>Type:</strong> ${ticket.issue}</p>
    <p><strong>Description:</strong> ${ticket.description}</p>
  `;

  const toggle = document.getElementById("chat-toggle");
  const chatbox = document.getElementById("chatbox");
  const close = document.getElementById("close-chat");

  toggle.addEventListener("click", () => {
    chatbox.classList.toggle("hidden");
  });

  close.addEventListener("click", () => {
    chatbox.classList.add("hidden");
  });


});


function sendMessage() {
  const input = document.getElementById("chat-input");
  const msg = input.value.trim();
  const chat = document.getElementById("chat-messages");

  if (msg !== "") {
    const div = document.createElement("div");
    div.className = "message user";
    div.textContent = msg;
    chat.appendChild(div);
    input.value = "";
    chat.scrollTop = chat.scrollHeight;
  }
}

  function handleLogout() {
    sessionStorage.clear();
    window.location.href = 'customer_login.html';
  }
