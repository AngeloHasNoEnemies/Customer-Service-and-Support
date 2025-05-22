
const SUPABASE_URL = 'https://yzygiaffkaoytroaeodc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6eWdpYWZma2FveXRyb2Flb2RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1Mzg2NTksImV4cCI6MjA2MjExNDY1OX0.no9SbRY08jXaIgbjpnEvTzN4-JBX6WBEBzFtUpGhkgw';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const phone = document.querySelector('#phone').value;
    const issue = document.querySelector('#issue').value;
    const orderDetails = document.querySelector('#order-details').value;

    const { data, error } = await supabase
      .from('tickets')
      .insert([
        {
          name,
          email,
          phone,
          issue,
          order_details: orderDetails
        }
      ]);

    if (error) {
      alert('Error: ' + error.message);
      console.error(error);
    } else {
      alert('Ticket sent successfully! 🎫💫');
      form.reset();
    }
  });
});
