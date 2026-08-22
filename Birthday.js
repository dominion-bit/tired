(function() {
    const stage = document.querySelector('.stage');
    const NUM_ITEMS = 70;
    const palette = ['#e2617f', '#d9a441', '#f6ead9', '#ff8fa3', '#c97ea0'];

    function svgHeart(color) {
        return `<svg width="100%" height="100%" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21s-7.5-4.6-10-9.2C0.3 8.4 2 4.5 5.8 4c2-.3 3.7.7 6.2 3.3C14.5 4.7 16.2 3.7 18.2 4c3.8.5 5.5 4.4 3.8 7.8C19.5 16.4 12 21 12 21z"
        fill="${color}" opacity="0.92"/>
    </svg>`;
    }

    function svgFlower(color, petals) {
        const petalShape = [];
        for (let i = 0; i < petals; i++) {
            const angle = (360 / petals) * i;
            petalShape.push(`<ellipse cx="24" cy="10" rx="6" ry="10" fill="${color}" opacity="0.92" transform="rotate(${angle} 24 24)"/>`);
        }
        return `<svg width="100%" height="100%" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        ${petalShape.join('')}
        <circle cx="24" cy="24" r="6" fill="#d9a441" opacity="0.92"/>
    </svg>`;
    }

    for (let i = 0; i < NUM_ITEMS; i++) { 
        const wrap = document.createElement('div');
        wrap.className = 'bloom';

        const isHeart = Math.random() < 0.5;
        const color = palette[Math.floor(Math.random() * palette.length)];
        const size = isHeart ? (12 + Math.random() * 16) : (16 + Math.random() * 24);

        wrap.style.width = size + 'px';
        wrap.style.height = size + 'px';
        wrap.style.left = Math.random() * 100 + 'vw';

        const riseDuration = 10 + Math.random() * 10;
        const riseDelay = Math.random() * 16;
        const maxOpacity = 0.45 + Math.random() * 0.5;
        const swayDuration = 2 + Math.random() * 3;

        wrap.style.setProperty('--maxop', maxOpacity);
        wrap.style.animation =
            `rise ${riseDuration}s linear ${riseDelay}s infinite, ` +
            `sway ${swayDuration}s ease-in-out ${riseDelay}s infinite`;

        const inner = document.createElement('div');
        inner.className = 'pulse';
        inner.style.width = '100%';
        inner.style.height = '100%';
        inner.style.animationDuration = (0.9 + Math.random() * 0.6) + 's';
        inner.style.animationDelay = (Math.random() * 1.5) + 's';
        inner.innerHTML = isHeart ? svgHeart(color) : svgFlower(color, 5);

        if (isHeart) {
            inner.style.filter = `drop-shadow(0 0 ${3 + Math.random() * 4}px ${color})`;
        }

        wrap.appendChild(inner);
        stage.appendChild(wrap);
    }

    // ============ ENVELOPE INTERACTION ============

    const envelope = document.getElementById('envelope');
    const hint = document.getElementById('hint');
    const hintText = document.getElementById('hintText');
    const envelopeImage = document.getElementById('envelopeImage');
    const envelopePlaceholder = document.getElementById('envelopePlaceholder');
    const cardOverlay = document.getElementById('cardOverlay');
    const cardImage = document.getElementById('cardImage');
    const cardPlaceholder = document.getElementById('cardPlaceholder');
    const closeBtn = document.getElementById('closeBtn');

    const CLICKS_NEEDED = 5;

    // one encouragement message per click, in order (last click opens the card)
    const ENCOURAGEMENTS = [
        'click me 💌',
        'keep going 💗',
        'almost there ✨',
        'so close 🎀',
        'one more time! 💫'
    ];

    let clickCount = 0;
    let isOpen = false;

    // if card.png doesn't exist yet, show the placeholder instead
    cardImage.addEventListener('error', () => {
        cardImage.style.display = 'none';
        cardPlaceholder.style.display = 'block';
    });

    // if envelope.png doesn't exist yet, show the placeholder instead
    envelopeImage.addEventListener('error', () => {
        envelopeImage.style.display = 'none';
        envelopePlaceholder.style.display = 'flex';
    });

    function shakeEnvelope(){
        envelope.classList.remove('shake');
        void envelope.offsetWidth;
        envelope.classList.add('shake');
    }

    function launchConfetti(count = 90){
        const colors = ['#e2617f', '#d9a441', '#f6ead9', '#ff8fa3', '#c97ea0', '#7c9473'];
        const originX = window.innerWidth / 2;

        for (let i = 0; i < count; i++){
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';

            const color = colors[Math.floor(Math.random() * colors.length)];
            const startX = originX + (Math.random() * 200 - 100);
            const drift = (Math.random() * 500 - 250) + 'px';
            const spin = (Math.random() * 720 - 360) + 'deg';
            const duration = 2 + Math.random() * 1.5;
            const delay = Math.random() * 0.3;

            piece.style.left = startX + 'px';
            piece.style.background = color;
            piece.style.setProperty('--drift', drift);
            piece.style.setProperty('--spin', spin);
            piece.style.animationDuration = duration + 's';
            piece.style.animationDelay = delay + 's';
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';

            document.body.appendChild(piece);

            setTimeout(() => piece.remove(), (duration + delay) * 1000 + 200);
        }
    }

    function openEnvelope(){
        isOpen = true;
        envelope.classList.add('open');
        hint.classList.add('hidden');
        launchConfetti();

        setTimeout(() => {
            cardOverlay.classList.add('visible');
        }, 700);
    }

    envelope.addEventListener('click', () => {
        if (isOpen) return;

        clickCount++;
        shakeEnvelope();

        if (clickCount >= CLICKS_NEEDED){
            openEnvelope();
            return;
        }

        // if someone changes CLICKS_NEEDED without updating the list)
        const message = ENCOURAGEMENTS[clickCount] || ENCOURAGEMENTS[ENCOURAGEMENTS.length - 1];
        hintText.textContent = message;

        // little pulse on the hint text so the change feels alive
        hintText.classList.remove('pulse-hint');
        void hintText.offsetWidth;
        hintText.classList.add('pulse-hint');
    });

    function resetEnvelope(){
        clickCount = 0;
        isOpen = false;
        envelope.classList.remove('open');
        hint.classList.remove('hidden');
        hintText.textContent = ENCOURAGEMENTS[0];
    }

    function closeCard(){
        cardOverlay.classList.remove('visible');
        resetEnvelope();
    }

    closeBtn.addEventListener('click', closeCard);
    cardOverlay.addEventListener('click', (e) => {
        if (e.target === cardOverlay) closeCard();
    });

    // ============ ONE-TIME VIEW + AUTO-EXPIRE ============
    // The page is only viewable for a limited window (and only once per
    // browser). After that it auto-refreshes into a "no longer available"
    // state.
    (function setupExpiry(){
        const REFRESH_MS = 60* 1000; // 1 minute 30 seconds
        const STORAGE_KEY = 'birthdayPageViewed';

        const contentEl = document.getElementById('content');
        const countdownEl = document.getElementById('countdown');

        function showExpired(){
            if (contentEl) {
                contentEl.innerHTML =
                    '<div class="expired-message">' +
                    '<h1>This card is no longer available</h1>' +
                    '<p>You\'ve already opened it 💌</p>' +
                    '</div>';
            }
        }

        if (localStorage.getItem(STORAGE_KEY)) {
            showExpired();
            return;
        }

        localStorage.setItem(STORAGE_KEY, 'true');

        let remaining = Math.floor(REFRESH_MS / 1000);

        function tick(){
            remaining--;
            if (countdownEl) {
                const mins = Math.floor(remaining / 60);
                const secs = remaining % 60;
                countdownEl.textContent =
                    remaining > 0
                        ? `${mins}:${secs < 10 ? '0' : ''}${secs}`
                        : '';
            }
            if (remaining <= 0) {
                clearInterval(intervalId);
                showExpired();
            }
        }

        const intervalId = setInterval(tick, 1000);

        setTimeout(function(){
            clearInterval(intervalId);
            showExpired();
        }, REFRESH_MS);
    })();
})();
