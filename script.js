// ✅ 초기 접속 필터링 및 30분 타이머 (접근 제한 기능)
document.addEventListener("DOMContentLoaded", () => {
  const rawRef = document.referrer || "";
  const ref = rawRef.toLowerCase();
  const ua = navigator.userAgent;

  const isDirect = ref === "";
  const badReferrers = ["kakao", "naver", "instagram", "facebook", "t.co", "twitter"];
  const isSuspiciousSource = isDirect || badReferrers.some(b => ref.includes(b));
  const isNotMobile = !/Mobi|Android/i.test(ua);

  if (isSuspiciousSource || isNotMobile) {
    window.location.href = "no-access.html";
  }

  let timeout;
  function resetTimer() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      window.location.href = "no-access.html";
    }, 30 * 60 * 1000); // 30분 무반응시 접근 제한
  }
  window.onload = resetTimer;
  document.onmousemove = resetTimer;
  document.onkeypress = resetTimer;
  document.onscroll = resetTimer;
  document.onclick = resetTimer;
});

// ✅ JSON 파일에서 문구 데이터 로드
let quotes = {
  classicQuotes: [],
  liteQuotes: []
};

fetch('data/quotes.json')
  .then(response => response.json())
  .then(data => {
    quotes.classicQuotes = data.classicQuotes;
    quotes.liteQuotes = data.liteQuotes;
  })
  .catch(error => {
    console.error("❌ JSON 불러오기 실패:", error);
  });

// ✅ 랜덤 중복 없는 문구 뽑기 (셔플 방식, 모드별 따로 관리)
let shuffledClassic = [];
let indexClassic = 0;
let shuffledLite = [];
let indexLite = 0;

// ✅ 셔플 함수 (리스트 무작위 섞기)
function shuffleArray(array) {
  let copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ✅ 모드별 셔플된 문구 하나씩 뽑기
function getUniqueQuote(list, mode) {
  if (mode === 'classic') {
    if (shuffledClassic.length === 0 || indexClassic >= shuffledClassic.length) {
      shuffledClassic = shuffleArray(list);
      indexClassic = 0;
    }
    const quote = shuffledClassic[indexClassic];
    indexClassic++;
    return quote;
  } 
  if (mode === 'lite') {
    if (shuffledLite.length === 0 || indexLite >= shuffledLite.length) {
      shuffledLite = shuffleArray(list);
      indexLite = 0;
    }
    const quote = shuffledLite[indexLite];
    indexLite++;
    return quote;
  }
}

//  타이핑 효과 (한 글자씩 출력)
function typeWriterEffect(element, text, i = 0, buttonId = null) {
  if (i === 0 && buttonId) {
    document.getElementById(buttonId).disabled = true;
  }
  if (i < text.length) {
    element.textContent += text.charAt(i);
    setTimeout(() => typeWriterEffect(element, text, i + 1, buttonId), 60);
  } else {
    if (buttonId) {
      document.getElementById(buttonId).disabled = false;
    }
  }
}

//  클래식 모드 진입시 실행
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
    const quote = getUniqueQuote(quotes.classicQuotes, 'classic');
    typeWriterEffect(quoteArea, quote);
  }, 1000);
}

//  클래식 모드에서 또 다른 문구 뽑기
function showAnotherClassicQuote() {
  const quoteArea = document.getElementById("quote-area-classic");
  const quote = getUniqueQuote(quotes.classicQuotes, 'classic');
  quoteArea.innerText = "";
  typeWriterEffect(quoteArea, quote, 0, "classic-more-btn");
}

//  라이트 모드 진입시 실행
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
    const quote = getUniqueQuote(quotes.liteQuotes, 'lite');
    typeWriterEffect(quoteArea, quote);
  }, 1000);
}

// 라이트 모드에서 또 다른 문구 뽑기
function showAnotherLiteQuote() {
  const quoteArea = document.getElementById("quote-area-lite");
  const quote = getUniqueQuote(quotes.liteQuotes, 'lite');
  quoteArea.textContent = "";
  typeWriterEffect(quoteArea, quote, 0, "lite-more-btn");
}

// ✅ 메인 화면으로 돌아가기
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

// ✅ 사운드 재생 토글 (목탁 사운드)
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

// ✅ 고양이 이스터에그: 닌자캣 클릭 → 라이트 모드 이동
const ninjaCat = document.getElementById('ninja-cat');
ninjaCat.addEventListener('click', () => {
  enterLiteMode();
});

// ✅ 닌자캣 이동 애니메이션
function teleportNinjaCat() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const randomX = Math.random() * (screenWidth - 100);
  const randomY = Math.random() * (screenHeight - 100);
  ninjaCat.style.left = `${randomX}px`;
  ninjaCat.style.top = `${randomY}px`;
  ninjaCat.style.opacity = 1;
  setTimeout(() => {
    ninjaCat.style.opacity = 0;
  }, 3000);
}

setInterval(teleportNinjaCat, 5000);