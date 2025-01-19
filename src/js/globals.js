document.addEventListener("DOMContentLoaded", () => {
    const backgroundAnimation = document.getElementById("background-animation");
    const totalLights = 6; // Número total de luces
    const fragment = document.createDocumentFragment();
    const lights = [];

    // Crear las luces
    for (let i = 0; i < totalLights; i++) {
        const light = document.createElement("div");
        light.classList.add("light");

        // Tamaño aleatorio para las luces
        const size = Math.random() * 100 + 150; // Entre 150px y 250px
        light.style.width = `${size}px`;
        light.style.height = `${size}px`;

        // Posiciones iniciales aleatorias
        const startX = Math.random() * 100; // Entre 0 y 100vw
        const startY = Math.random() * 100; // Entre 0 y 100vh
        light.style.left = `${startX}vw`;
        light.style.top = `${startY}vh`;

        // Trayectorias aleatorias
        const midX = Math.random() * 100;
        const midY = Math.random() * 100;
        const endX = Math.random() * 100;
        const endY = Math.random() * 100;

        // Almacenar la luz y sus datos
        lights.push({
            element: light,
            size,
            startX,
            startY,
            midX,
            midY,
            endX,
            endY,
            startTime: performance.now(),
            duration: Math.random() * 10 + 20 // Entre 20s y 30s
        });

        // Agregar la luz al fragmento de documento
        fragment.appendChild(light);
    }

    // Agregar todas las luces al DOM de una sola vez
    backgroundAnimation.appendChild(fragment);

    // Función de actualización de la animación
    function updateLights() {
        const currentTime = performance.now();

        lights.forEach(light => {
            const elapsedTime = (currentTime - light.startTime) / 1000; // Tiempo en segundos
            const progress = Math.min(elapsedTime / light.duration, 1);

            // Movimiento en 3 fases: inicio, medio, final
            let x = light.startX;
            let y = light.startY;

            if (progress > 0 && progress < 0.33) {
                x = light.startX + (light.midX - light.startX) * (progress / 0.33);
                y = light.startY + (light.midY - light.startY) * (progress / 0.33);
            } else if (progress >= 0.33 && progress < 0.66) {
                const midProgress = (progress - 0.33) / 0.33;
                x = light.midX + (light.endX - light.midX) * midProgress;
                y = light.midY + (light.endY - light.midY) * midProgress;
            } else if (progress >= 0.66) {
                const endProgress = (progress - 0.66) / 0.34;
                x = light.endX + (light.startX - light.endX) * endProgress;
                y = light.endY + (light.startY - light.endY) * endProgress;
            }

            // Actualizar la posición de la luz
            light.element.style.left = `${x}vw`;
            light.element.style.top = `${y}vh`;

            // Si la animación ha terminado, reiniciar el tiempo
            if (progress >= 1) {
                light.startTime = performance.now();
                light.midX = Math.random() * 100;
                light.midY = Math.random() * 100;
                light.endX = Math.random() * 100;
                light.endY = Math.random() * 100;
            }
        });

        // Solicitar la siguiente actualización
        requestAnimationFrame(updateLights);
    }

    // Iniciar la animación
    updateLights();
});
