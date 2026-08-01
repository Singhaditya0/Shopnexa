function showToast(message, type = "info") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.style.cssText = "position:fixed;bottom:20px;right:20px;z-index:999;display:flex;flex-direction:column;gap:8px;";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  const colors = { info: "var(--accent)", error: "var(--signal)", success: "var(--accent)" };
  toast.style.cssText = `
    background: var(--surface); border: 1px solid ${colors[type]};
    color: var(--text); padding: 12px 18px; border-radius: 10px;
    font-size: 13.5px; box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    animation: toast-in .25s ease; max-width: 320px;
  `;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity .3s";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// CSS animation inject karo
const style = document.createElement("style");
style.textContent = `@keyframes toast-in { from { transform: translateX(20px); opacity:0; } to { transform: translateX(0); opacity:1; } }`;
document.head.appendChild(style);