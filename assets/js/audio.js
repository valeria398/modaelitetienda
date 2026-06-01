function iniciarAudio() {

    const btn = document.getElementById('music-toggle-btn');
    if (!btn) return;

    let audio = null;
    let playing = false;

    // Crear el elemento de audio dinámicamente
    function crearAudio() {
        if (audio) return audio;
        
        audio = document.createElement('audio');
        audio.id = 'background-music';
        audio.loop = true;
        
        const source = document.createElement('source');
        source.src = 'assets/audio/Zara.mp3';
        source.type = 'audio/mpeg';
        
        audio.appendChild(source);
        document.body.appendChild(audio);
        
        return audio;
    }

    // Iniciar automáticamente al cargar la página
    function iniciarReproduccion() {
        if (!audio) {
            crearAudio();
        }
        
        audio.play().then(() => {
            playing = true;
            btn.textContent = '⏸ Pausa';
        }).catch(() => {
            // Si la reproducción automática es bloqueada, el usuario puede iniciarla con el botón
        });
    }

    // El botón pausa/reanuda
    btn.addEventListener('click', (e) => {
        e.stopPropagation();

        // Crear audio si no existe
        if (!audio) {
            crearAudio();
        }

        if (playing) {
            audio.pause();
            playing = false;
            btn.textContent = '▶ Reanudar';
            return;
        }

        audio.play().then(() => {
            playing = true;
            btn.textContent = '⏸ Pausa';
        }).catch(() => {
            // No hacer nada si la reproducción es bloqueada.
        });
    });

    // Intentar reproducir automáticamente al cargar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciarReproduccion);
    } else {
        iniciarReproduccion();
    }
}