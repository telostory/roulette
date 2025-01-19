document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const itemList = document.getElementById('itemList');
    const slotItems = document.getElementById('slotItems');
    const resultModal = document.getElementById('result-modal');
    const selectedItem = resultModal.querySelector('.selected-item');
    const closeModalBtn = resultModal.querySelector('.close-modal');
    
    let isSpinning = false;

    function fireConfetti() {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 }
        };

        function fire(particleRatio, opts) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        }

        fire(0.25, {
            spread: 26,
            startVelocity: 55,
        });

        fire(0.2, {
            spread: 60,
        });

        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });

        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });

        fire(0.1, {
            spread: 120,
            startVelocity: 45,
        });
    }

    function createFloatingEmojis() {
        const emojis = ['🎈', '🎊', '✨', '🎯', '🎨', '🎭', '🎪', '🎁', '🎀'];
        const container = resultModal.querySelector('.celebration-emojis');
        container.innerHTML = '';

        for (let i = 0; i < 15; i++) {
            const emoji = document.createElement('div');
            emoji.className = 'celebration-emoji';
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.left = `${Math.random() * 100}%`;
            emoji.style.top = `${Math.random() * 100}%`;
            container.appendChild(emoji);

            gsap.to(emoji, {
                y: -100,
                x: Math.random() * 100 - 50,
                rotation: Math.random() * 360,
                opacity: 0,
                duration: 2,
                ease: "power1.out",
                repeat: -1
            });
        }
    }

    function showResult(item) {
        resultModal.classList.remove('hidden');
        selectedItem.textContent = item;

        // GSAP 애니메이션
        gsap.to('.result-container', {
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
            onComplete: () => {
                fireConfetti();
                createFloatingEmojis();
            }
        });
    }

    closeModalBtn.addEventListener('click', () => {
        gsap.to('.result-container', {
            scale: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                resultModal.classList.add('hidden');
            }
        });
    });

    startButton.addEventListener('click', () => {
        if (isSpinning) return;
        
        const items = itemList.value.split('\n').filter(item => item.trim() !== '');
        
        if (items.length < 2) {
            alert('최소 2개 이상의 항목을 입력해주세요!');
            return;
        }

        isSpinning = true;
        startButton.disabled = true;
        startButton.classList.add('opacity-50', 'cursor-not-allowed');
        
        // 슬롯 효과 시작
        document.querySelector('.slot-machine').classList.add('spinning');
        
        // 슬롯 아이템 생성 및 애니메이션
        slotItems.innerHTML = '';
        const repeatedItems = [...items, ...items, ...items];
        
        repeatedItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'slot-item';
            div.textContent = item;
            slotItems.appendChild(div);
        });

        slotItems.style.transform = 'translateY(0)';
        
        requestAnimationFrame(() => {
            const itemHeight = 80;
            const totalItems = items.length;
            const randomIndex = Math.floor(Math.random() * items.length);
            const scrollDistance = (totalItems + randomIndex) * itemHeight;
            
            slotItems.style.transform = `translateY(-${scrollDistance}px)`;
            
            setTimeout(() => {
                isSpinning = false;
                startButton.disabled = false;
                startButton.classList.remove('opacity-50', 'cursor-not-allowed');
                document.querySelector('.slot-machine').classList.remove('spinning');
                showResult(items[randomIndex]);
            }, 3000);
        });
    });

    // 모바일에서 더블탭 줌 방지
    document.addEventListener('dblclick', (e) => {
        e.preventDefault();
    }, { passive: false });
});