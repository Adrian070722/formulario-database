// app.js: intercepta el submit del formulario, lo envía por fetch y redirige a nuevo.html
(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById("send");
    if (submitBtn) submitBtn.disabled = true;

    const formData = new FormData(form);
    const payload = {};
    formData.forEach((v, k) => (payload[k] = v));

    try {
      const res = await fetch("/submit", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(payload).toString(),
      });

      if (!res.ok) throw new Error("HTTP " + res.status);
      const json = await res.json();
      if (json && json.success) {
        // Redirigir al documento
        window.location.href = "/nuevo.html";
      } else {
        alert("No se pudo completar el envío. Intenta de nuevo.");
      }
    } catch (err) {
      console.error("Error en envío:", err);
      alert("Error al enviar el formulario. Revisa la consola.");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
})();
