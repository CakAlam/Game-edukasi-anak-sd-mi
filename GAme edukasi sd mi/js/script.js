const introScreen = document.getElementById('intro-screen');
const playButton = document.getElementById('play-button');
const gameContainer = document.querySelector('.game-container');
const nextScenarioBtn = document.getElementById('next-scenario-btn');
const backgroundMusic = document.getElementById('background-music');

const mapContainer = document.getElementById('map-container');
const scenarioCard = document.getElementById('scenario-card');
const pointDisplay = document.getElementById('point-display');
const iconInfoContainer = document.getElementById('icon-info-container');
const mapIcons = document.querySelectorAll('.map-icon');
const playerPawn = document.getElementById('player-pawn');
const miniatures = document.querySelectorAll('.miniature-item');
const allIcons = [...mapIcons, ...miniatures]; // Gabungkan semua ikon

let currentPoints = 0;
let currentScenarioIndex = 0; // Mulai dari skenario pertama
let playedScenarioIndices = [];
let isMovingPawn = false;

const scenarios = [
    {
        id: 1,
        text: "Kamu melihat temanmu yang berbeda agama kesulitan membawa buku banyak di dekat sekolah. Apa yang kamu lakukan?",
        options: [
            { text: "Membantunya membawa buku.", points: 10 },
            { text: "Mengabaikannya karena berbeda agama.", points: -5 },
            { text: "Menyuruh teman lain membantunya.", points: 5 }
        ],
        locationId: "sekolah"
    },
    {
        id: 2,
        text: "Ada acara keagamaan di dekat rumahmu (Masjid). Bagaimana sikapmu?",
        options: [
            { text: "Menghormati dan tidak membuat kegaduhan.", points: 10 },
            { text: "Mengganggu acara tersebut.", points: -10 },
            { text: "Melihat saja tanpa peduli.", points: 0 }
        ],
        locationId: "masjid" // Contoh, sesuaikan dengan ikon yang ingin muncul
    },
    {
        id: 3,
        text: "Di taman, kamu melihat dua kelompok anak berbeda latar belakang sedang bertengkar. Apa yang akan kamu lakukan?",
        options: [
            { text: "Mencoba melerai dan mengajak mereka bermain bersama.", points: 15 },
            { text: "Mendukung salah satu kelompok karena memiliki kesamaan.", points: -8 },
            { text: "Menjauhi mereka agar tidak terlibat masalah.", points: 2 }
        ],
        locationId: "taman"
    },
    {
        id: 4,
        text: "Kamu penasaran tentang kegiatan di salah satu rumah ibadah (Gereja). Apa yang sebaiknya kamu lakukan?",
        options: [
            { text: "Mencari informasi dari teman atau sumber yang terpercaya dengan sopan.", points: 12 },
            { text: "Mengintip dan membuat asumsi sendiri.", points: -7 },
            { text: "Mengabaikannya karena bukan agamaku.", points: 3 }
        ],
        locationId: "gereja" // Contoh ikon ibadah lainnya
    },
    {
        id: 5,
        text: "Saat bermain di sekolah (ikon sekolah), kamu melihat temanmu mengejek teman lain yang berbeda suku. Bagaimana reaksimu?",
        options: [
            { text: "Menegur teman yang mengejek dan menjelaskan pentingnya menghargai perbedaan.", points: 18 },
            { text:"Menegur teman yang mengejek dan menjelaskan pentingnya menghargai perbedaan.", points: 18 },
            { text: "Ikut mengejek agar terlihat keren.", points: -12 },
            { text: "Diam saja karena takut ikut dimarahi.", points: 5 }
        ],
        locationId: "sekolah"
    },
    {
        id: 6,
        text: "Kamu melihat tumpukan buku tentang keberagaman (miniatur buku). Apa yang ingin kamu lakukan?",
        options: [
            { text: "Membuka dan membacanya untuk menambah pengetahuan.", points: 15 },
            { text: "Mengabaikannya karena tidak menarik.", points: 2 },
            { text: "Merobeknya karena berbeda dengan keyakinanku.", points: -20 }
        ],
        locationId: "buku"
    },
    {
        id: 7,
        text: "Kamu diajak teman yang berbeda agama untuk ikut merayakan hari besarnya di taman (ikon taman). Sikapmu?",
        options: [
            { text: "Menerima undangan dengan senang hati dan menghormati acaranya.", points: 20 },
            { text: "Menolak karena berbeda agama.", points: -15 },
            { text: "Datang hanya karena ada makanan gratis.", points: 8 }
        ],
        locationId: "taman"
    },
    {
        id: 8,
        text: "Kamu menemukan bendera Merah Putih (miniatur bendera) tergeletak di tanah. Bagaimana sikapmu?",
        options: [
            { text: "Mengambilnya dengan hormat dan meletakkannya di tempat yang layak.", points: 18 },
            { text: "Menginjaknya tanpa sengaja.", points: -10 },
            { text: "Melewatinya begitu saja.", points: 5 }
        ],
        locationId: "bendera"
    },
    {
        id: 9,
        text: "Ada berbagai alat musik tradisional (miniatur alat musik). Kamu ingin...",
        options: [
            { text: "Mencoba memainkannya dan belajar tentang budaya lain.", points: 20 },
            { text: "Menganggapnya berisik.", points: -5 },
            { text: "Membiarkannya saja.", points: 7 }
        ],
        locationId: "alatmusik"
    }
];

function updatePoints() {
    pointDisplay.textContent = `Poin: ${currentPoints}`;
}

function displayScenario() {
    if (currentScenarioIndex < scenarios.length) {
        const currentScenario = scenarios[currentScenarioIndex];
        scenarioCard.textContent = currentScenario.text;

        const existingButtons = scenarioCard.querySelectorAll('.option-btn');
        existingButtons.forEach(button => button.remove());

        currentScenario.options.forEach((option, index) => {
            const optionButton = document.createElement('button');
            optionButton.classList.add('option-btn');
            optionButton.textContent = option.text;
            optionButton.addEventListener('click', () => handleOptionClick(option.points));
            scenarioCard.appendChild(optionButton);
        });
        nextScenarioBtn.classList.add('hidden'); // Sembunyikan tombol next karena alur berbeda
    } else {
        scenarioCard.textContent = "Jelajah selesai! Kamu telah mempelajari semua nilai moderasi.";
        nextScenarioBtn.classList.add('hidden');
    }
}

function handleOptionClick(points) {
    if (isMovingPawn) return; // Jangan lakukan apa pun jika pion sedang bergerak

    currentPoints += points;
    updatePoints();
    playedScenarioIndices.push(currentScenarioIndex);
    scenarioCard.innerHTML = "";

    const feedbackElement = document.createElement('div');
    feedbackElement.classList.add('feedback-message');
    if (points > 0) {
        feedbackElement.textContent = "Jawabanmu bagus! + " + points + " poin!";
        feedbackElement.style.backgroundColor = '#a5d6a7';
        feedbackElement.style.color = '#1b5e20';
    } else if (points < 0) {
        feedbackElement.textContent = "Hati-hati! - " + Math.abs(points) + " poin.";
        feedbackElement.style.backgroundColor = '#ffcdd2';
        feedbackElement.style.color = '#c62828';
    } else {
        feedbackElement.textContent = "Oke, mari kita lanjut.";
        feedbackElement.style.backgroundColor = '#ffe0b2';
        feedbackElement.style.color = '#e65100';
    }
    feedbackElement.style.padding = '10px';
    feedbackElement.style.borderRadius = '4px';
    feedbackElement.style.marginTop = '10px';
    scenarioCard.appendChild(feedbackElement);

    setTimeout(() => {
        feedbackElement.remove();
        if (playedScenarioIndices.length < scenarios.length) {
            currentScenarioIndex++;
            displayScenario();
            showNextIcon();
        } else {
            scenarioCard.textContent = "Jelajah selesai! Kamu telah mempelajari semua nilai moderasi.";
        }
    }, 1500);
}

function showNextIcon() {
    if (currentScenarioIndex < scenarios.length) {
        const nextScenario = scenarios[currentScenarioIndex];
        const targetIcon = document.querySelector(`.${nextScenario.locationId}-icon`);
        if (targetIcon) {
            targetIcon.classList.remove('hidden-icon');
            movePawnToIcon(targetIcon);
        }
    }
}

function movePawnToIcon(targetIcon) {
    if (!targetIcon) return;
    isMovingPawn = true;

    const iconRect = targetIcon.getBoundingClientRect();
    const mapRect = mapContainer.getBoundingClientRect();
    const pawnCenterX = playerPawn.getBoundingClientRect().left + playerPawn.offsetWidth / 2 - mapRect.left;
    const pawnCenterY = playerPawn.getBoundingClientRect().top + playerPawn.offsetHeight / 2 - mapRect.top;
    const targetX = iconRect.left + iconRect.width / 2 - mapRect.left - playerPawn.offsetWidth / 2;
    const targetY = iconRect.top + iconRect.height / 2 - mapRect.top - playerPawn.offsetHeight / 2;

    playerPawn.style.left = `${targetX}px`;
    playerPawn.style.top = `${targetY}px`;

    setTimeout(() => {
        isMovingPawn = false;
        // Skenario berikutnya akan ditampilkan setelah ikon muncul dan pion bergerak
    }, 1000); // Durasi transisi CSS
}

function initGame() {
    allIcons.forEach(icon => icon.classList.add('hidden-icon'));
    playerPawn.style.top = '20px'; // Posisi awal pion
    playerPawn.style.left = '20px'; // Posisi awal pion
    currentScenarioIndex = 0;
    playedScenarioIndices = [];
    updatePoints();
    displayScenario(); // Tampilkan skenario pertama
    showNextIcon(); // Munculkan ikon pertama
}

playButton.addEventListener('click', () => {
    introScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    backgroundMusic.play();
    initGame();
});

// Inisialisasi poin saat halaman dimuat (sebelum klik "Mulai")
updatePoints();