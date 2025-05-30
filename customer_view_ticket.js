
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
    .select(` *, customers:customer_id ( name, email, phone ),
                 agents:assigned_to ( name )
            `)
    .eq("ticket_id", ticketId)
    .single();

  if (error || !data) {
    alert("Failed to load ticket.");
    console.error(error);
    return;
  }

  ticket = data;

  document.getElementById("ticketNumber").textContent = `Ticket #${ticket.ticket_id}`;
  document.getElementById("statusBadge").textContent = ticket.status;
  document.getElementById("statusBadge").className = `status-badge ${ticket.status.toLowerCase().replace(/\s+/g, '-')}`;


  document.getElementById("assignedAgent").textContent =
    ticket.agents?.name || "Unassigned";

  // Date
  document.getElementById("date").textContent = new Date(ticket.created_at).toLocaleDateString();

 
  document.getElementById("customerDetails").innerHTML = `
    <h3>Customer Details</h3>
    <p><strong>Name:</strong> ${ticket.customers?.name || "N/A"}</p>
    <p><strong>Email:</strong> ${ticket.customers?.email || "N/A"}</p>
    <p><strong>Phone:</strong> ${ticket.customers?.phone || "N/A"}</p>
  `;


  document.getElementById("issueDetails").innerHTML = `
    <h3>Issue</h3>
    <p><strong>Type:</strong> ${ticket.issue}</p>
    <p><strong>Description:</strong> ${ticket.description}</p>
  `;

  // Chatbox toggle (same as before)
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
