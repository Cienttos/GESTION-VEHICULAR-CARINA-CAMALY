document.addEventListener("DOMContentLoaded", () => {
    const backgroundAnimation = document.getElementById("background-animation");
    const totalLights = 6; // Número total de luces

    for (let i = 0; i < totalLights; i++) {
        const light = document.createElement("div");
        light.classList.add("light");

        // Tamaño grande para todas las luces
        const size = Math.random() * 100 + 150; // Tamaños entre 150px y 250px
        light.style.width = `${size}px`;
        light.style.height = `${size}px`;

        // Posiciones iniciales aleatorias
        const startX = Math.random() * 100; // Entre 0 y 100vw
        const startY = Math.random() * 100; // Entre 0 y 100vh
        light.style.setProperty("--start-x", `${startX}vw`);
        light.style.setProperty("--start-y", `${startY}vh`);

        // Trayectorias aleatorias
        const mid1X = Math.random() * 100;
        const mid1Y = Math.random() * 100;
        const mid2X = Math.random() * 100;
        const mid2Y = Math.random() * 100;
        const mid3X = Math.random() * 100;
        const mid3Y = Math.random() * 100;

        light.style.setProperty("--mid1-x", `${mid1X}vw`);
        light.style.setProperty("--mid1-y", `${mid1Y}vh`);
        light.style.setProperty("--mid2-x", `${mid2X}vw`);
        light.style.setProperty("--mid2-y", `${mid2Y}vh`);
        light.style.setProperty("--mid3-x", `${mid3X}vw`);
        light.style.setProperty("--mid3-y", `${mid3Y}vh`);

        // Duración de la animación aleatoria
        const duration = Math.random() * 10 + 20; // Entre 20s y 30s
        light.style.animationDuration = `${duration}s`;

        backgroundAnimation.appendChild(light);
    }
});