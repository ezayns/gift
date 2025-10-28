// Game state
let clickCount = 0;
const totalClicksNeeded = 20;
let isPlaying = false;

// Audio element
const audioPlayer = document.getElementById('audioPlayer');

// Lyrics data
const lyrics = [
    { time: 1.45, text: "🎵 We can get into it or we can get intimate" },
    { time: 1.50, text: "🎵 The shower when you sinng in it? Better than beyonce" },
    { time: 1.53, text: "🎵 I like the sound of fiancee, you know its got a little ring to it 💕" },
    { time: 2.04, text: "🎵 God knows you're a wild child Beautiful child I NEED YOUR HELP" },
    { time: 2.06, text: "🎵 Looking like you come from the 90s by yourself" },
    { time: 0, text: "🎵 Parts i like and dedicate to you. Hope you like " },
    { time: 0, text: "🎵 We have a date coming UP 17th or 18th... " },
    { time: 0, text: "💖 I LOVE YOU 💖" }
];

// Initialize the application
function init() {
    initializeLyricsList();
    setupEventListeners();
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
    
    // Start music immediately when page loads
    window.addEventListener('load', function() {
        // Music will start when you add the song file
    });

    // Lyrics synchronization
    setInterval(updateLyrics, 100);
}

// Handle bottle clicks
function handleBottleClick() {
    if (clickCount < totalClicksNeeded) {
        clickCount++;
        document.getElementById('clickCount').textContent = clickCount;
        document.getElementById('progressFill').style.width = `${(clickCount / totalClicksNeeded) * 100}%`;
        
        // Move bottle up
        const currentBottom = parseInt(this.style.bottom);
        this.style.bottom = (currentBottom + 3) + 'px';
        
        // Start music if not playing
        if (!isPlaying && audioPlayer.src) {
            audioPlayer.play();
            isPlaying = true;
            document.getElementById('musicIndicator').style.display = 'inline-block';
        }
        
        // Check if completed
        if (clickCount >= totalClicksNeeded) {
            setTimeout(() => {
                document.getElementById('mainContent').style.display = 'none';
                document.getElementById('messageContainer').style.display = 'flex';
            }, 800);
        }
    }
}

// Update lyrics synchronization
function updateLyrics() {
    if (isPlaying) {
        const currentTime = audioPlayer.currentTime;
        const currentLyricElement = document.getElementById('currentLyric');
        const timeMarker = document.getElementById('timeMarker');
        
        // Update time marker
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60);
        timeMarker.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
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
    clickCount = 0;
    document.getElementById('clickCount').textContent = '0';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('bottle').style.bottom = '120px';
    
    document.getElementById('messageContainer').style.display = 'none';
    document.getElementById('lyricsContainer').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    
    // Reset music
    if (audioPlayer.src) {
        audioPlayer.currentTime = 0;
        if (!isPlaying) {
            audioPlayer.play();
            isPlaying = true;
        }
    }
}

// Initialize the app when the script loads
init();