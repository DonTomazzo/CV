document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


// --- Enklare Beatmaker Audio Player Funktionalitet ---

const audioIconButtons = document.querySelectorAll('.audio-icon-btn');
let currentlyPlayingAudio = null; // Håller koll på vilken ljudfil som spelas

audioIconButtons.forEach(button => {
    button.addEventListener('click', () => {
        const audioId = button.dataset.audioId; // Hämta ID från data-audio-id
        const audio = document.getElementById(audioId);
        const icon = button.querySelector('i'); // Hämta play/pause-ikonen

        if (!audio) {
            console.error(`Audio element with ID '${audioId}' not found.`);
            return;
        }

        if (audio === currentlyPlayingAudio && !audio.paused) {
            // Samma låt spelas och är inte pausad -> Pausa den
            audio.pause();
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
            currentlyPlayingAudio = null; // Ingen låt spelas längre
        } else {
            // En annan låt spelas, eller ingen alls -> Hantera uppspelning

            // 1. Pausa den nuvarande låten (om någon spelas) och återställ dess ikon
            if (currentlyPlayingAudio && !currentlyPlayingAudio.paused) {
                currentlyPlayingAudio.pause();
                // Hitta knappen för den tidigare spelande låten
                const prevButton = document.querySelector(`[data-audio-id="${currentlyPlayingAudio.id}"]`);
                if (prevButton) {
                    prevButton.querySelector('i').classList.remove('fa-pause');
                    prevButton.querySelector('i').classList.add('fa-play');
                }
            }

            // 2. Spela upp den nya låten
            audio.play()
                .then(() => {
                    icon.classList.remove('fa-play');
                    icon.classList.add('fa-pause');
                    currentlyPlayingAudio = audio; // Uppdatera vilken låt som spelas
                })
                .catch(error => {
                    console.error("Kunde inte spela upp ljudet:", error);
                    // Om det blir problem med uppspelning (t.ex. autoplay-blockering),
                    // säkerställ att ikonen visar play
                    icon.classList.remove('fa-pause');
                    icon.classList.add('fa-play');
                });
        }

        // Eventlyssnare för när ljudet tar slut (för att ändra tillbaka ikonen)
        audio.onended = () => {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
            if (audio === currentlyPlayingAudio) {
                currentlyPlayingAudio = null;
            }
        };

        // Om ljudet pausats utan att nå slutet (t.ex. användaren klickar på samma knapp igen)
        audio.onpause = () => {
            if (audio !== currentlyPlayingAudio) { // Kontrollera att det inte är den nuvarande låten som pausats av en ny uppspelning
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        };
    });
});