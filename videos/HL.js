document.addEventListener("DOMContentLoaded", () => {
    const chats = {
        1: ["first", "second", "third", "fourth"],
        2: ["fifth", "sixth", "seventh", "eighth"],
        3: ["ninth", "tenth", "eleventh"],
        4: ["twelfth", "thirteenth", "fourteenth"],
        5: ["fifteenth", "sixteenth", "seventeenth"],
        6: ["eighteenth"]
    };

    const chatBar = document.getElementById("chatbar");
    const imgs = {
        on1: document.getElementById("on1"),
        off1: document.getElementById("off1"),
        on2: document.getElementById("on2"),
        off2: document.getElementById("off2"),
        on3: document.getElementById("on3"),
        off3: document.getElementById("off3"),
        check1: document.getElementById("check1"),
        check2: document.getElementById("check2"),
        check3: document.getElementById("check3"),
        last: document.getElementById("last")
    };

    let currentChatGroup = 1;
    let chatIndex = 0;
    let typing = false;
    let skipTyping = false;

    // 🧭 단계별 클릭 좌표 설정 (px)
    const clickAreas = {
        1: { x1: 502, y1: 262, x2: 710, y2: 610 },
        2: { x1: 483, y1: 241, x2: 723, y2: 611 },
        3: { x1: 721, y1: 274, x2: 891, y2: 609 }
    };

    // 📍 클릭 박스 (시각화)
    const clickBox = document.createElement("div");
    clickBox.style.position = "absolute";
    // 🔻 시각화 제거 (테두리X, 완전 투명)
    clickBox.style.border = "none";
    clickBox.style.background = "transparent";
    clickBox.style.pointerEvents = "none";
    clickBox.style.zIndex = "10";
    clickBox.style.display = "none";
    document.body.appendChild(clickBox);


    // 🕹️ 타이핑 효과
    async function typeWriter(element) {
        typing = true;
        skipTyping = false;

        element.style.display = "block";
        element.style.whiteSpace = "pre-line";

        const text = element.innerHTML.replace(/<br\s*\/?>/gi, "\n");
        element.textContent = "";

        for (let i = 0; i < text.length; i++) {
            if (skipTyping) {
                element.textContent = text;
                break;
            }
            element.textContent += text[i];
            await wait(35);
        }

        typing = false;
    }

    // 💬 다음 대사
    async function nextChat() {
        const group = chats[currentChatGroup];
        if (typing) {
            skipTyping = true;
            return;
        }

        if (chatIndex < group.length) {
            if (chatIndex > 0)
                document.getElementById(group[chatIndex - 1]).style.display = "none";
            const next = document.getElementById(group[chatIndex]);
            await typeWriter(next);
            chatIndex++;
        } else {
            chatBar.style.display = "none";
            group.forEach(id => (document.getElementById(id).style.display = "none"));
            handleStageEnd(currentChatGroup);
        }
    }

    // 🔁 단계별 처리
    async function handleStageEnd(stage) {
        switch (stage) {
            case 1:
                await clickableStage(1, imgs.check1, imgs.off1, imgs.on2);
                currentChatGroup = 2;
                startChatStage(2);
                break;
            case 2:
                await clickableStage(2, imgs.check2, imgs.off2, imgs.on3);
                currentChatGroup = 3;
                startChatStage(3);
                break;
            case 3:
                await clickableStage(3, imgs.check3, imgs.off3, null);
                currentChatGroup = 4;
                startChatStage(4);
                break;
            case 4:
                // 🔥 마지막 단계: off3는 아직 남겨둔 채로 last 등장 연출 시작
                imgs.last.style.display = "block";
                imgs.last.style.opacity = "0";
                imgs.last.style.transition = "opacity 0.4s ease-in-out";

                // 🎬 극적인 깜빡임 (서서히 밝아지고, 잠시 꺼지고, 강하게 켜짐)
                for (let i = 0; i < 4; i++) {
                    imgs.last.style.opacity = "1";
                    await wait(200);
                    imgs.last.style.opacity = "0";
                    await wait(150);
                }

                // 마지막은 서서히 완전히 나타나기
                imgs.last.style.transition = "opacity 1s ease-in-out";
                imgs.last.style.opacity = "1";

                // 🌑 깜빡임 종료 후 off3 제거 (조금 늦게 사라지게)
                await wait(400);
                imgs.off3.style.display = "none";

                // 다음 단계로 진행
                await wait(1800);
                currentChatGroup = 5;
                startChatStage(5);
                break;

            case 5:
                chatBar.style.display = "none";
                chats[5].forEach(id => (document.getElementById(id).style.display = "none"));
                lastZoomEffect();
                break;
            default:
                break;
        }
    }

    // 📸 이미지 클릭 스테이지
    async function clickableStage(stageNum, checkImg, offImg, nextOnImg) {
        const area = clickAreas[stageNum];
        updateClickBox(area);

        return new Promise(resolve => {
            let stageCompleted = false;

            document.addEventListener("click", globalClickHandler);

            async function globalClickHandler(e) {
                const rect = document.querySelector(".videos-cnt").getBoundingClientRect();
                const x = Math.round(e.clientX - rect.left);
                const y = Math.round(e.clientY - rect.top);
                console.log('clicked coords:', x, y);

                const inArea = x >= area.x1 && x <= area.x2 && y >= area.y1 && y <= area.y2;

                if (inArea && !stageCompleted) {
                    stageCompleted = true;
                    console.log('clicked!');
                    document.removeEventListener("click", globalClickHandler);
                    clickBox.style.display = "none";

                    checkImg.style.display = "block";
                    await wait(1000);
                    offImg.style.display = "block";
                    checkImg.style.display = "none";

                    Object.values(imgs).forEach(img => {
                        if (img !== offImg && img !== nextOnImg && img.tagName === "IMG")
                            img.style.display = "none";
                    });

                    if (nextOnImg) {
                        await wait(1000);
                        offImg.style.display = "none";
                        nextOnImg.style.display = "block";
                        await wait(2000);
                    }

                    resolve();
                }
            }
        });
    }

    // 🔲 빨간 박스 위치 갱신
    function updateClickBox(area) {
        clickBox.style.display = "block";
        clickBox.style.left = area.x1 + "px";
        clickBox.style.top = area.y1 + "px";
        clickBox.style.width = area.x2 - area.x1 + "px";
        clickBox.style.height = area.y2 - area.y1 + "px";
    }

    // 💥 마지막 확대 효과
    async function lastZoomEffect() {
        const img = imgs.last;
        img.style.transition = "transform 1.5s ease-out";
        img.style.transform = "scale(1.8)";
        await wait(1500);

        // ✅ 확대 종료 후 index.html로 이동
        window.location.href = "../End/end.html";
    }


    function wait(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    async function startChatStage(num) {
        chatIndex = 0;
        currentChatGroup = num;
        chatBar.style.display = "block";
        await nextChat();
    }

    // 🚀 초기 진입
    (async function init() {
        Object.values(imgs).forEach(img => (img.style.display = "none"));
        imgs.on1.style.display = "block";
        await wait(2000);
        startChatStage(1);
    })();

    chatBar.addEventListener("click", nextChat);
});
