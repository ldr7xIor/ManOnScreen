const chats1 = ["first", "second", "third", "fourth", "fifth", "sixth"];
const chats2 = ["seventh", "eighth", "ninth"];
const chats3 = ["tenth", "eleventh", "twelfth"];
let currentChatIndex = 0;
let currentPhase = 1;

const pcOff = document.getElementById("pc-off");
const pcOn = document.getElementById("pc-on");
const chatBar = document.getElementById("chatBar");
const letter = document.getElementById("letter");

function typeText(elementId, callback) {
    const el = document.getElementById(elementId);
    const fullText = el.innerHTML;
    el.innerHTML = "";
    el.style.display = "block";
    let idx = 0;
    const interval = setInterval(() => {
        el.innerHTML = fullText.slice(0, idx + 1);
        idx++;
        if (idx === fullText.length) {
            clearInterval(interval);
            if (callback) callback();
        }
    }, 40);
}

function showLetter() {
    document.querySelectorAll(".chat").forEach(c => c.style.display = "none");
    chatBar.style.display = "none";
    letter.style.display = "block";
    setTimeout(() => letter.style.opacity = 1, 50);
}

function nextPhase() {
    if (currentPhase === 1) {
        currentPhase = 2;
        letter.style.display = "none";
        letter.style.opacity = 0;
        chatBar.style.display = "block";
        currentChatIndex = 0;
        typeText(chats2[currentChatIndex]);
    } else if (currentPhase === 2) {
        currentPhase = 3;
        letter.style.display = "none";
        letter.style.opacity = 0;
        chatBar.style.display = "block";
        currentChatIndex = 0;
        typeText(chats3[currentChatIndex]);
    } else if (currentPhase === 3) {
        // 마지막 단계 → PC 전환
        document.querySelectorAll(".chat").forEach(c => c.style.display = "none");
        chatBar.style.display = "none";
        pcOff.style.display = "none";
        pcOn.style.display = "block";
        pcOn.style.opacity = 0;
        setTimeout(() => (pcOn.style.opacity = 1), 50); // 페이드인
        setTimeout(() => (window.location.href = "../monitor/monitor.html"), 2000);
    }
}

chatBar.addEventListener("click", () => {
    if (currentPhase === 1) {
        if (currentChatIndex < chats1.length - 1) {
            document.getElementById(chats1[currentChatIndex]).style.display = "none";
            currentChatIndex++;
            typeText(chats1[currentChatIndex]);
        } else {
            showLetter();
        }
    } else if (currentPhase === 2) {
        if (currentChatIndex < chats2.length - 1) {
            document.getElementById(chats2[currentChatIndex]).style.display = "none";
            currentChatIndex++;
            typeText(chats2[currentChatIndex]);
        } else {
            showLetter();
        }
    } else if (currentPhase === 3) {
        if (currentChatIndex < chats3.length - 1) {
            document.getElementById(chats3[currentChatIndex]).style.display = "none";
            currentChatIndex++;
            typeText(chats3[currentChatIndex]);
        } else {
            // twelfth → 약간의 텀 후 thirteenth 표시
            setTimeout(() => {
                document.getElementById(chats3[currentChatIndex]).style.display = "none";
                document.getElementById("thirteenth").style.display = "block";
                setTimeout(() => {
                    document.querySelectorAll(".chat").forEach(c => c.style.display = "none");
                    chatBar.style.display = "none";
                    pcOff.style.display = "none";
                    pcOn.style.display = "block";
                    pcOn.style.opacity = 0;
                    setTimeout(() => (pcOn.style.opacity = 1), 50); // 페이드인
                    setTimeout(() => window.location.href = "../monitor/monitor.html", 2000);
                }, 1500);
            }, 800);
        }
    }
});

letter.addEventListener("click", nextPhase);

// startScene 수정 — pc(off)는 계속 보이게 유지
function startScene() {
    chatBar.style.display = "block";
    typeText(chats1[currentChatIndex]);
}

// 2초 자동시작 + 클릭 시작 둘 다 가능
pcOff.addEventListener("click", startScene);
setTimeout(() => {
    // 클릭보다 자동시작이 먼저 실행되지 않도록 안전장치
    if (currentChatIndex === 0 && currentPhase === 1) startScene();
}, 2000);
