function handleSignup(event) {
      event.preventDefault();

      alert("Sign up successful!");

      setTimeout(() => {
        window.location.href = "customer_login.html";
      }, 500);
    }