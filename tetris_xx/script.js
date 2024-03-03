// Music
const musicPlaylist = [
    new Audio('./music/TMNT_5_Alleycat_Blues.mp3'),
    new Audio('./music/TMNT_6_Back_in_the_Sewers.mp3'),
    new Audio('./music/TMNT_7_Sewer_Surfing.mp3'),
    new Audio('./music/TMNT_4_Turtle_Swing.mp3'),
    new Audio('./music/TMNT_16_Boss_Battle.mp3'),  // Need to make play this song only on boss level
];

let currentMusicIndex = 0;
let soundEffectsVolume = 1;

// function playMusic(){
//     const randomIndex = Math.floor(Math.random() * musicPlaylist.length);
//     musicPlaylist[randomIndex].volume = 0.3;
//     musicPlaylist[randomIndex].play();
// }

// Stop music
function pauseMusic() {
    if (currentMusicIndex < musicPlaylist.length) {
        musicPlaylist[currentMusicIndex].pause();
    }
}

// Play next music
function playNextMusic() {
    if (currentMusicIndex < musicPlaylist.length) {
        musicPlaylist[currentMusicIndex].volume = 0.3;
        musicPlaylist[currentMusicIndex].play();
    }
}


function onMusicEnded() {
    currentMusicIndex++;
    if (currentMusicIndex < musicPlaylist.length && !musicPlaylist[currentMusicIndex].paused) {
        playNextMusic(); 
    }
}

musicPlaylist.forEach(audio => {
    audio.addEventListener('ended', onMusicEnded);
});

function getCurrentMusicVolume() {
    return musicPlaylist[currentMusicIndex].volume;
}


document.addEventListener("DOMContentLoaded", function() {
    const initialVolume = getCurrentMusicVolume();
    document.getElementById('music-volume-slider').value = initialVolume;
});

 



 function toggleMusic(){
    const musicToggleButton = document.getElementById('music-toggle-button');
    const musicIcon = document.getElementById('music-icon');
    const musicVolumeSlider = document.getElementById('music-volume-slider');
    
    if(musicPlaylist[0].paused){
        // Turn on music
        musicPlaylist.forEach(audio => {
            playNextMusic(); 
        });
        musicIcon.src = './icons/music_on.svg';
        musicVolumeSlider.value = getCurrentMusicVolume();
    } else {
        // Turn off
        musicPlaylist.forEach(audio => {
            pauseMusic();    
        });
        musicIcon.src = './icons/music_off.svg';
        musicVolumeSlider.value = 0;
    }
}


function changeMusicVolume(volume){
    musicPlaylist.forEach(audio =>{
        audio.volume = volume;
    });
}




function toggleSoundEffects(){
    const soundEffectsToggleButton = document.getElementById('sound-effects-toggle-button');
    const soundEffectsVolumeSlider = document.getElementById('sound-effects-volume-slider');
    const soundIcon = document.getElementById('sound-icon');
   
   
    if (soundEffectsVolume > 0) {
        soundEffectsVolume = 0; 
        soundIcon.src = './icons/sound_off.png'; 
    } else {
        soundEffectsVolume = 1; 
        soundIcon.src = './icons/sound_on.png'; 
    }

    if (soundEffectsVolumeSlider.value == 0) {
        soundEffectsVolumeSlider.value = 1; 
    } else {
        soundEffectsVolumeSlider.value = 0; 
    }

    changeSoundEffectsVolume(soundEffectsVolumeSlider.value); 
}

function changeSoundEffectsVolume(volume){
    soundEffectsVolumeSlider.value = volume;
}

document.getElementById('music-toggle-button').onmouseenter = function() {
    document.getElementById('music-volume-slider').classList.add('visible');
};
document.getElementById('music-toggle-button').onmouseleave = function() {
    document.getElementById('music-volume-slider').classList.remove('visible');
};

document.getElementById('sound-effects-toggle-button').onmouseenter = function() {
    document.getElementById('sound-effects-volume-slider').classList.add('visible');
};
document.getElementById('sound-effects-toggle-button').onmouseleave = function() {
    document.getElementById('sound-effects-volume-slider').classList.remove('visible');
};


// Function for playing sound by clicking button
function playClickSound() {
    if (soundEffectsVolume > 0){
         const clickSound = document.getElementById('click-sound');
    clickSound.play();
    }
   
}

// Function for playing sound by hovering on button
function playHoverSound() {
    if (soundEffectsVolume > 0){
       const hoverSound = document.getElementById('hover-sound');
    hoverSound.play(); 
    }
    
}



// Page array
const pages = document.querySelectorAll('.page');
let currentPageIndex = 0; 


function showPage(index) {
    pages.forEach((page, i) => {
        if (i === index) {
            page.style.display = 'block';
            applyStyles(page);
        } else {
            page.style.display = 'none';
        }
    });
}


function applyStyles(page) {
    const pageId = page.id;
    const body = document.body;

    switch (pageId) {
        case 'page-1':
            page.classList.add('page-1-styles');
            body.style.backgroundImage = "url('./images/orini.png')"
            body.style.backgroundSize = 'contain';
            body.style.fontFamily = 'TurtlesFont'
            // playMusic();
            tetrisON();
            break;
        case 'page-2':
            page.classList.add('page-2-styles');
            break;
        case 'page-3':
            page.classList.add('page-3-styles');
            body.style.fontFamily = 'TurtlesFont'
            body.style.backgroundImage = "url('./images/orini.png')"
            body.style.backgroundSize = 'contain';
            break;
        case 'page-4':
            page.classList.add('page-4-styles');
            break;
        default:
            break;
    }
}



//Скрипт гри тетрис
function tetrisON(){
    console.log('Scripts')
    const script = document.createElement('script');
    script.src = 'all_scripts/game.js';
    document.body.appendChild(script);
}



// Show current page
showPage(currentPageIndex);

// Function to move on previous page
function prevPage() {
    if (currentPageIndex > 0) {
        currentPageIndex--;
        showPage(currentPageIndex);
    }
}

// Function to move on next page
function nextPage() {
    if (currentPageIndex < pages.length - 1) {
        currentPageIndex++;
        showPage(currentPageIndex);
    }
}









