const Function_URL =
  "https://dkmthdkrrdcctzxcpxsz.supabase.co/functions/v1/delete-account";
const params = new URLSearchParams(window.location.search);
const defaultEmail = params.get("email");
if (defaultEmail) {
  document.getElementById("email").value = defaultEmail;
}

document
  .getElementById("delete-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("status");
    const userId = params.get("user_id");

    if (!userId) {
      status.textContent =
        "Missing account information. Please open this page from inside the app.";
      status.style.color = "#d14343";
      return;
    }

    status.textContent = "Processing your request…";
    status.style.color = "#666";

    try {
      const response = await fetch(Function_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          email: document.getElementById("email").value,
          reason: document.getElementById("reason").value,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      status.textContent =
        "Account deletion submitted. Check your email for confirmation.";
      status.style.color = "#006400";
    } catch (error) {
      status.textContent = `Unable to delete account: ${error.message}`;
      status.style.color = "#d14343";
    }
  });
