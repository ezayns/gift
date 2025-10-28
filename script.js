// Game state
let clickCount = 0;
const totalClicksNeeded = 20;
let isPlaying = false;

// Audio element
const audioPlayer = document.getElementById('audioPlayer');

// Lyrics data - Updated with better timestamps
const lyrics = [
    { time: 0, text: "🎵 Parts i like and dedicate to you. Hope you like" },
    { time: 10, text: "🎵 We can get into it or we can get intimate" },
    { time: 20, text: "🎵 The shower when you sinng in it? Better than beyonce" },
    { time: 30, text: "🎵 I like the sound of fiancee, you know its got a little ring to it 💕" },
    { time: 45, text: "🎵 God knows you're a wild child Beautiful child I NEED YOUR HELP" },
    { time: 60, text: "🎵 Looking like you come from the 90s by yourself" },
    { time: 75, text: "🎵 We have a date coming UP 17th or 18th..." },
    { time: 90, text: "💖 I LOVE YOU 💖" }
];

// Initialize the application
function init() {
    initializeLyricsList();
    setupEventListeners();
    preloadAudio();
}

// Preload audio for better performance
function preloadAudio() {
    audioPlayer.load();
}

// Initialize lyrics list
function initializeLyricsList() {
    const lyricsList = document.getElementById('lyricsList');
    lyrics.forEach(lyric => {
        const lyricElement = document.createElement('div');
        lyricElement.className = 'lyric-line';
        lyricElement.textContent = lyric.text;
        lyricsList.appendChild(lyricElement);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Bottle click handler
    document.getElementById('bottle').addEventListener('click', handleBottleClick);
    
    // Audio event listeners
    audioPlayer.addEventListener('play', function() {
        isPlaying = true;
        document.getElementById('musicIndicator').style.display = 'inline-block';
    });
    
    audioPlayer.addEventListener('pause', function() {
        isPlaying = false;
        document.getElementById('musicIndicator').style.display = 'none';
    });

    // Lyrics synchronization
    setInterval(updateLyrics, 100);
}

// Handle bottle clicks
function handleBottleClick() {
    if (clickCount < totalClicksNeeded) {
        clickCount++;
        updateClickCounter();
        
        // Move bottle up
        moveBottleUp();
        
        // Start music if not playing
        startMusic();
        
        // Check if completed
        checkCompletion();
    }
}

// Update click counter and progress
function updateClickCounter() {
    document.getElementById('clickCount').textContent = clickCount;
    document.getElementById('progressFill').style.width = `${(clickCount / totalClicksNeeded) * 100}%`;
}

// Move bottle upward
function moveBottleUp() {
    const bottle = document.getElementById('bottle');
    const currentBottom = parseInt(bottle.style.bottom);
    bottle.style.bottom = (currentBottom + 3) + 'px';
}

// Start music playback
function startMusic() {
    if (!isPlaying) {
        audioPlayer.play().catch(error => {
            console.log('Audio play failed:', error);
            // If autoplay is blocked, show instruction
            document.getElementById('currentLyric').textContent = "🎵 Click the bottle to start music!";
        });
    }
}

// Check if game is completed
function checkCompletion() {
    if (clickCount >= totalClicksNeeded) {
        setTimeout(() => {
            document.getElementById('mainContent').style.display = 'none';
            document.getElementById('messageContainer').style.display = 'flex';
        }, 800);
    }
}

// Update lyrics synchronization
function updateLyrics() {
    if (isPlaying && !audioPlayer.paused) {
        const currentTime = audioPlayer.currentTime;
        updateTimeMarker(currentTime);
        highlightCurrentLyric(currentTime);
    }
}

// Update time display
function updateTimeMarker(currentTime) {
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    document.getElementById('timeMarker').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Highlight current lyric
function highlightCurrentLyric(currentTime) {
    const currentLyricElement = document.getElementById('currentLyric');
    
    // Find current lyric
    let currentLyric = null;
    for (let i = lyrics.length - 1; i >= 0; i--) {
        if (currentTime >= lyrics[i].time) {
            currentLyric = lyrics[i];
            break;
        }
    }
    
    // Update current lyric display
    if (currentLyric) {
        currentLyricElement.textContent = currentLyric.text;
        
        // Highlight active lyric in list
        document.querySelectorAll('.lyric-line').forEach((element, index) => {
            if (lyrics[index].text === currentLyric.text) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });
    }
}

// Navigation functions
function showLyrics() {
    document.getElementById('messageContainer').style.display = 'none';
    document.getElementById('lyricsContainer').style.display = 'flex';
}

function backToMessage() {
    document.getElementById('lyricsContainer').style.display = 'none';
    document.getElementById('messageContainer').style.display = 'flex';
}

function handleReset() {
    resetGameState();
    resetUI();
    resetAudio();
}

// Reset game state
function resetGameState() {
    clickCount = 0;
    isPlaying = false;
}

// Reset UI elements
function resetUI() {
    document.getElementById('clickCount').textContent = '0';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('bottle').style.bottom = '120px';
    document.getElementById('currentLyric').textContent = '🎵 Click the bottle to start music...';
    
    document.getElementById('messageContainer').style.display = 'none';
    document.getElementById('lyricsContainer').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    
    // Reset lyric highlights
    document.querySelectorAll('.lyric-line').forEach(element => {
        element.classList.remove('active');
    });
}

// Reset audio
function resetAudio() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    document.getElementById('musicIndicator').style.display = 'none';
    document.getElementById('timeMarker').textContent = '0:00';
}

// Initialize the app when the script loads
document.addEventListener('DOMContentLoaded', init);
