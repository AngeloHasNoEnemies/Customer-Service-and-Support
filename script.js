document.addEventListener('DOMContentLoaded', () => {
  const supabaseUrl = 'https://yzygiaffkaoytroaeodc.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6eWdpYWZma2FveXRyb2Flb2RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1Mzg2NTksImV4cCI6MjA2MjExNDY1OX0.no9SbRY08jXaIgbjpnEvTzN4-JBX6WBEBzFtUpGhkgw';
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  const form = document.getElementById('ticket-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const issue = document.getElementById('issue').value;
    const order_details = document.getElementById('order-details').value;

    const { data, error } = await supabase
      .from('main')
      .insert([{ name, email, phone, issue, order_details }]);

    if (error) {
      console.error('Insert failed:', error.message);
      alert('Error submitting ticket. Check console.');
    } else {
      alert('Ticket submitted successfully!');
      form.reset();
    }
  });
});
