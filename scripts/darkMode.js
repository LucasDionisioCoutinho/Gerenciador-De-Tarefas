document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggleTheme");

    // Verifica se o usuário já escolheu um tema antes
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    // Quando o usuário clicar no botão, muda o tema
    toggleButton.onclick = function () {
        document.body.classList.toggle("dark-mode");

        // Salva a escolha do usuário no localStorage
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }
    };
});