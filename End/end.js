document.addEventListener("DOMContentLoaded", () => {
  const first = document.getElementById("first");
  const second = document.getElementById("second");
  const third = document.getElementById("third");
  const fourth = document.getElementById("fourth");

  // 1️⃣ 첫 번째 글리치
  triggerGlitch(first);
  setTimeout(() => first.classList.remove("active"), 800);

  // 2️⃣ 3초 후 second 등장 (페이드 + 확대 동시에)
  setTimeout(() => {
    first.style.display = "none";

    // 초기 상태 (투명 & 원본 크기)
    second.style.display = "block";
    second.style.opacity = "0";
    second.style.transform = "scale(1)";
    second.style.transition = "none"; // 초기엔 트랜지션 제거

    // ⚡ 브라우저가 레이아웃 계산하게 한 프레임 기다림
    requestAnimationFrame(() => {
      // 이제 트랜지션을 적용하고
      second.style.transition = "opacity 2s ease-in-out, transform 2s ease-in-out";

      // ⚡ 또 한 프레임 뒤 실제 변경 (이래야 transition 발동)
      requestAnimationFrame(() => {
        second.style.opacity = "1";
        second.style.transform = "scale(1.6)";
      });
    });

    // 2초 후 (확대 완료 시점) → third 전환
    setTimeout(() => {
      second.style.display = "none";
      third.style.display = "block";
      triggerGlitch(third);

      // 1초 뒤 fourth 등장
      setTimeout(() => {
        third.style.display = "none";
        fourth.style.display = "block";
      }, 2000);
    }, 2300);
  }, 5000);
});

// 글리치 재시작 함수
function triggerGlitch(el) {
  el.classList.remove("active");
  void el.offsetWidth; // 리플로우로 초기화
  el.classList.add("active");
}
