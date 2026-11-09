// Готовая защитная механика. Не изменяйте эту функцию.
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function selectAttempts(filter) {
  const attempts = window.reportData.attempts;
  if (filter === "passed") {
    return attempts.filter((attempts) => attempts.passed === true);
  }

  if (filter === "failed") {
    return attempts.filter((attempts) => attempts.passed === false);
  }

  return attempts;
}

function renderAttempts(attempts) {
  let markup = "";

  attempts.forEach((attempts) => {
    markup += `<li class="result-item"><span class="result-name">${escapeHtml(attempts.name)}</span> — ${attempts.score} из ${attempts.questionCount} (${attempts.percentage}%)</li>`;
  });

  document.querySelector("#result-list").innerHTML = markup;
  document.querySelector("#result-count").textContent =
    `Показано: ${attempts.length} из ${window.reportData.attempts.length}`;
}

function startFilter() {
  const form = document.querySelector("#filter-form");
  const select = document.querySelector("#filter");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const attempts = selectAttempts(select.value);
    renderAttempts(attempts);
  });
}

startFilter();
