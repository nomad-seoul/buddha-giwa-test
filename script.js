
let previousQuote = "";
let recentQuotes = []; // 🔥 추가: 최근 본 문구 기억
let quotes = {
  classicQuotes: [],
  liteQuotes: []
};

// ✅ JSON 불러오기
fetch('data/quotes.json')
  .then(response => response.json())
  .then(data => {
    quotes.classicQuotes = data.classicQuotes;
    quotes.liteQuotes = data.liteQuotes;
  })
  .catch(error => {
    console.error("❌ JSON 불러오기 실패:", error);
  });

  // 문구랜덤뽑기
  function getUniqueQuote(list) {
    let quote = "";
    let attempts = 0;
  
    do {
      const i = Math.floor(Math.random() * list.length);
      quote = list[i];
      attempts++;
    } while (recentQuotes.includes(quote) && attempts < 10);
  
    recentQuotes.push(quote);
    if (recentQuotes.length > 5) {
      recentQuotes.shift();
    }
  
    return quote;
}



// ✅ 타이핑 효과
function typeWriterEffect(element, text, i = 0, buttonId = null) {
  if (i === 0 && buttonId) {
    document.getElementById(buttonId).disabled = true;
  }

  if (i < text.length) {
    element.textContent += text.charAt(i);
    setTimeout(() => typeWriterEffect(element, text, i + 1, buttonId), 50);
  } else {
    if (buttonId) {
      document.getElementById(buttonId).disabled = false;
    }
  }
}


// ✅ 진심 위로 모드 전환
function enterClassicMode() {
  const mainScreen = document.getElementById("main-screen");
  if (mainScreen) mainScreen.style.display = "none";

  const bg = document.getElementById("main-bg");
  if (bg) {
    bg.style.opacity = 0;
    setTimeout(() => {
      bg.src = "images/classic-bg.png";
      bg.style.opacity = 1;
    }, 300);
  }

  setTimeout(() => {
    const screen = document.getElementById("classic-screen");
    if (!screen) return;
    screen.style.display = "flex";

    const buddha = document.querySelector(".classic-buddha");
    if (buddha) {
      buddha.style.opacity = 0;
      buddha.style.animation = "zoomFade 2s ease-out forwards, float 3s ease-in-out infinite";
      buddha.style.animationDelay = "0.5s, 2.5s";
    }

    const quoteArea = document.getElementById("quote-area-classic");
    quoteArea.innerText = "";
    const quote = getUniqueQuote(quotes.classicQuotes);
    typeWriterEffect(quoteArea, quote);
  }, 1000);
}

function showAnotherClassicQuote() {
  const quoteArea = document.getElementById("quote-area-classic");
  const quote = getUniqueQuote(quotes.classicQuotes);
  quoteArea.innerText = "";
  typeWriterEffect(quoteArea, quote, 0, "classic-more-btn");
}


function enterLiteMode() {
  const mainScreen = document.getElementById("main-screen");
  if (mainScreen) mainScreen.style.display = "none";

  const bg = document.getElementById("main-bg");
  if (bg) {
    bg.style.opacity = 0;
    setTimeout(() => {
      bg.src = "images/pixel-temple-laugh.png";
      bg.style.opacity = 1;
    }, 300);
  }

  setTimeout(() => {
    const screen = document.getElementById("lite-screen");
    if (!screen) return;
    screen.style.display = "flex";

    const buddha = screen.querySelector(".classic-buddha");
    if (buddha) {
      buddha.style.opacity = 0;
      buddha.style.animation = "zoomFade 2s ease-out forwards, float 3s ease-in-out infinite";
      buddha.style.animationDelay = "0.5s, 2.5s";
    }

    const quoteArea = document.getElementById("quote-area-lite");
    quoteArea.textContent = "";
    const quote = getUniqueQuote(quotes.liteQuotes);
    typeWriterEffect(quoteArea, quote);
  }, 1000);
}

function showAnotherLiteQuote() {
  const quoteArea = document.getElementById("quote-area-lite");
  const quote = getUniqueQuote(quotes.liteQuotes);
  quoteArea.textContent = "";
  typeWriterEffect(quoteArea, quote, 0, "lite-more-btn");
}


// ✅ 돌아가기 버튼 기능 (공통)
function backToMain() {
  const classic = document.getElementById("classic-screen");
  const lite = document.getElementById("lite-screen");
  const main = document.getElementById("main-screen");
  const bg = document.getElementById("main-bg");

  if (classic) classic.style.display = "none";
  if (lite) lite.style.display = "none";
  if (main) main.style.display = "flex";

  if (bg) {
    bg.style.opacity = 0;
    setTimeout(() => {
      bg.src = "images/pixel-temple-bg.png";
      bg.style.opacity = 1;
    }, 300);
  }

  const quoteArea = document.getElementById("quote-area");
  if (quoteArea) quoteArea.innerText = "";
}

let audioPlaying = false;
let audio = new Audio('sounds/temple-sound.mp3');

function playSound() {
  const soundBtn = document.getElementById('sound-btn');

  if (!audioPlaying) {
    audio.play();
    audio.loop = true;
    soundBtn.src = 'images/moktak-off.png';
    audioPlaying = true;
  } else {
    audio.pause();
    audio.currentTime = 0;
    soundBtn.src = 'images/moktak.png';
    audioPlaying = false;
  }
}
// 고양이 순간이동
const ninjaCat = document.getElementById('ninja-cat');
ninjaCat.addEventListener('click', () => {
  enterLiteMode(); // 이 함수가 웃음 위로로 가는 거 맞지?
});
function teleportNinjaCat() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const randomX = Math.random() * (screenWidth - 100); // 여백 고려
  const randomY = Math.random() * (screenHeight - 100);

  ninjaCat.style.left = `${randomX}px`;
  ninjaCat.style.top = `${randomY}px`;
  ninjaCat.style.opacity = 1;

  // 사라지는 시간 수정  숫자 수정하면됨.
  setTimeout(() => {
    ninjaCat.style.opacity = 0;
  }, 3000);
}

// 순간이동시간 설정 숫자 수정하면됨
setInterval(teleportNinjaCat, 5000);
