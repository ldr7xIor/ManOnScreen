// =========================
// 📁 monitor.js
// =========================

const chats = [
  "first", "second", "third", "fourth", "fifth", "sixth",
  "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth",
  "thirteenth", "fourteenth"
];

const chatBar = document.getElementById("chatBar");
const noneEditFile = document.querySelector(".noneFile");
const fileBar = document.querySelector(".fileBar");
const files = document.querySelectorAll(".file");

let currentChat = 0;
let currentVideo = 0;
let waitingForClick = false;

const videoData = [
  { range: [150,210,285,355], url: "../videos/loveR106.html" },
  { range: [337,210,473,355], url: "../videos/family36.html" },
  { range: [552,210,661,355], url: "../videos/hot126.html" },
  { range: [709,210,847,355], url: "../videos/funSat.html" },
  { range: [127,390,316,528], url: "../videos/braun.html" },
  { range: [337,390,473,528], url: "../videos/family66.html" },
  { range: [552,390,661,528], url: "../videos/loveR116.html" },
  { range: [709,390,847,528], url: "../videos/hotHL.html" },
];

// =========================
// 💬 텍스트 출력 (타이핑)
// =========================
function typeText(elementId, text, callback) {
  const el = document.getElementById(elementId);
  el.innerHTML = "";
  el.style.display = "block";
  chatBar.style.display = "block";

  let i = 0;
  const interval = setInterval(() => {
    el.innerHTML = text.substring(0, i + 1);
    i++;
    if (i >= text.length) {
      clearInterval(interval);

      // "(영상 클릭해보자)" 문구면 3초 뒤 chat과 bar 같이 숨김
      if (/\(.*영상.*클릭해보자.*\)/.test(text)) {
        setTimeout(() => {
          chatBar.style.display = "none";
          el.style.display = "none";
        }, 3000);
      }

      if (callback) callback();
    }
  }, 40);
}

// =========================
// 💬 다음 대사 출력
// =========================
function showNextChat() {
  document.querySelectorAll(".chat").forEach(c => (c.style.display = "none"));
  const chatId = chats[currentChat];
  const chatEl = document.getElementById(chatId);
  if (!chatEl) return;
  typeText(chatId, chatEl.innerHTML.replace(/<br>/g, "\n"));
}

// =========================
// 📜 chatBar 클릭으로 대사 진행
// =========================
chatBar.addEventListener("click", () => {
  chatBar.style.display = "none";
  if (waitingForClick) return;

  const prevChat = document.getElementById(chats[currentChat]);
  if (prevChat) prevChat.style.display = "none";

  currentChat++;

  // (미편집 파일 클릭 안내)
  if (currentChat === 2) {
    enableFileClick();
    return;
  }

  // (영상 클릭해보자) 대사 출력 구간
  if (currentChat === 5 + currentVideo && currentVideo <= 7) {
    showNextChat();
    waitingForClick = true;
    return;
  }

  if (currentChat < chats.length) {
    showNextChat();
  }
});

// =========================
// 🖱️ 파일 클릭
// =========================
function enableFileClick() {
  noneEditFile.addEventListener("click", handleFileClick);
}

function handleFileClick(e) {
  const rect = noneEditFile.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (x >= 450 && x <= 560 && y >= 290 && y <= 435) {
    noneEditFile.removeEventListener("click", handleFileClick);
    noneEditFile.style.display = "none";
    fileBar.style.display = "block";
    files.forEach(f => f.style.display = "block");

    setTimeout(() => {
      currentChat = 2;
      chatBar.style.display = "block";
      showNextChat();
    }, 3000);
  }
}

// =========================
// 🎬 영상 클릭 처리 (다른 영상 클릭시 '무서워...' 방지 포함)
// =========================
function enableVideoClick() {
  const container = document.querySelector(".monitor-cnt");
  container.addEventListener("click", (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const index = videoData.findIndex(v => {
      const [x1, y1, x2, y2] = v.range;
      return x >= x1 && x <= x2 && y >= y1 && y <= y2;
    });

    if (index === -1 || !waitingForClick) return;

    if (index === currentVideo) {
      sessionStorage.setItem("videoIndex", currentVideo);
      window.location.href = videoData[index].url;
    } else {
      // 잘못 클릭 시 힌트만 다시 보여줌 (무서워 방지)
      document.querySelectorAll(".chat").forEach(c => (c.style.display = "none"));
      if (currentVideo < 8) {
        const hintChatId = chats[5 + currentVideo];
        typeText(hintChatId, document.getElementById(hintChatId).innerHTML.replace(/<br>/g, "\n"));
      }
    }
  });
}

// =========================
// 💡 chatBar 사라지면 chat도 같이 숨기기
// =========================
const observer = new MutationObserver(() => {
  if (chatBar.style.display === "none") {
    document.querySelectorAll(".chat").forEach(c => (c.style.display = "none"));
  }
});
observer.observe(chatBar, { attributes: true, attributeFilter: ["style"] });

// =========================
// 🚀 초기화 (마지막 대사 출력 수정 완료)
// =========================
window.onload = () => {
  document.querySelectorAll(".chat").forEach(c => (c.style.display = "none"));
  noneEditFile.style.display = "none";
  fileBar.style.display = "none";
  files.forEach(f => (f.style.display = "none"));
  chatBar.style.display = "none";

  const prevIndex = sessionStorage.getItem("videoIndex");
  if (prevIndex !== null) {
    currentVideo = parseInt(prevIndex) + 1;
    if (currentVideo > 8) currentVideo = 8;
    sessionStorage.removeItem("videoIndex");
  }

  // ✅ 모든 영상 본 뒤 (8개 완료 시)
  if (currentVideo >= 8) {
    fileBar.style.display = "block";
    files.forEach(f => (f.style.display = "block"));
    chatBar.style.display = "block";
    waitingForClick = false; // 클릭 잠금 해제
    currentChat = 12;        // "무서워..." 먼저
    showNextChat();
    return;
  }

  if (currentVideo === 0) {
    noneEditFile.style.display = "block";
    chatBar.style.display = "block";
    currentChat = 0;
    showNextChat();
  } else {
    fileBar.style.display = "block";
    files.forEach(f => (f.style.display = "block"));
    chatBar.style.display = "block";
    currentChat = 5 + currentVideo;
    showNextChat();
    waitingForClick = true;
  }

  enableFileClick();
  enableVideoClick();
};
