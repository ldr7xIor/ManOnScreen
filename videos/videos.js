document.addEventListener("DOMContentLoaded", () => {
  const monitor = document.querySelector('img[src="../img/monitor.png"]');
  const frame = document.querySelector('img[src="../img/videoFrame.png"]');
  const onImg = document.getElementById("on");
  const offImg = document.getElementById("off");
  const chatBar = document.querySelector('img[src="../img/chatbar.png"]');
  const chats = document.querySelectorAll(".chat");
  const check = document.getElementById("check");

  // ✅ HTML에서 지정한 값만 사용 (기본값 없음)
  const clickableArea = window.customClickableArea;
  if (!clickableArea) {
    console.error("[videos.js] customClickableArea가 설정되지 않았습니다.");
    return; // 값 없으면 실행 중단
  }

  let currentChatIndex = 0;
  let typing = false;
  let clickHandlerAttached = false;

  // 초기 상태
  chats.forEach(c => {
    c.style.display = "none";
    // ✅ 줄바꿈 표시 가능하게
    c.style.whiteSpace = "pre-line";
  });
  chatBar.style.display = "none";
  check.style.display = "none";
  offImg.style.display = "none";
  onImg.style.display = "none";

  // 1️⃣ 3초 동안 monitor, frame, on만 보이기
  onImg.style.display = "block";
  setTimeout(() => {
    chatBar.style.display = "block";
    showChat(0);
  }, 3000); // 3초로 맞춤

  // 2️⃣ chatBar 클릭으로 다음 대사
  chatBar.addEventListener("click", () => {
    if (typing) return;

    if (currentChatIndex < 2) {
      showChat(currentChatIndex + 1);
    } else if (currentChatIndex === 2) {
      chatBar.style.display = "none";
      chats.forEach(c => c.style.display = "none");
      enableClickAction();
    } else if (currentChatIndex === 3) {
      showChat(4);
    } else if (currentChatIndex === 4) {
      window.location.href = "../monitor/monitor.html";
    }
  });

  // 채팅 표시
  function showChat(index) {
    chats.forEach(c => c.style.display = "none");
    const chat = chats[index];
    if (!chat) return;

    chat.style.display = "block";
    currentChatIndex = index;
    typing = true;

    // ✅ <br> → 줄바꿈으로 변환
    const text = chat.innerHTML.replace(/<br\s*\/?>/gi, "\n");
    typeText(chat, text, () => { typing = false; });
  }

  // ✅ 줄바꿈 지원하는 타이핑 효과
  function typeText(element, text, callback) {
    element.textContent = "";
    let i = 0;
    const interval = setInterval(() => {
      element.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        if (callback) callback();
      }
    }, 50);
  }

  // 3️⃣ 특정 픽셀 범위 클릭 시 check 표시 + 1초 후 on→off
  function enableClickAction() {
    if (clickHandlerAttached) return;
    clickHandlerAttached = true;

    function handler(e) {
      const rect = onImg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      console.log("clicked:", x, y, "area:", clickableArea);

      const inArea =
        x >= clickableArea.x1 && x <= clickableArea.x2 &&
        y >= clickableArea.y1 && y <= clickableArea.y2;

      if (inArea) {
        // ✅ 성공 시 리스너 제거
        onImg.removeEventListener("click", handler);
        check.style.display = "block";
        setTimeout(() => {
          onImg.style.display = "none";
          offImg.style.display = "block";
          showChat(3);
          chatBar.style.display = "block";
        }, 1000);
      } else {
        // ❌ 실패 시 재시도 가능
        console.warn("정확한 영역을 다시 클릭하세요.");
      }
    }

    // ✅ once 제거, 성공 시 수동 제거
    onImg.addEventListener("click", handler);
  }
});
