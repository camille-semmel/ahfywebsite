function submitRequest(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;
  const mailtoLink = `mailto:support@ahfy.app?subject=Partial Data Deletion Request&body=User Email: ${encodeURIComponent(
    email
  )}%0D%0A%0D%0ARequest:%0D%0A${encodeURIComponent(message)}`;
  window.location.href = mailtoLink;
}
