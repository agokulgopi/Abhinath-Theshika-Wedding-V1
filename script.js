document.addEventListener('DOMContentLoaded', () => {
    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.fade-in');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        revealElements.forEach(el => {
            const revealTop = el.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('visible');
            }
        });
    };

    // Initial check
    revealOnScroll();

    // Throttle scroll event for better performance
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                revealOnScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    // Home memory carousel interactions
    const memoryCurrentImage = document.getElementById('memoryCurrentImage');
    const memoryPrevBtn = document.getElementById('memoryPrevBtn');
    const memoryNextBtn = document.getElementById('memoryNextBtn');
    const memoryImages = [
        { src: 'Images/Couple%20pic%205.jpeg', alt: 'Proposal memory' },
        { src: 'Images/Couple%20pic%201.jpeg', alt: 'Memory 1' },
        { src: 'Images/Couple%20pic%202.jpeg', alt: 'Memory 2' },
        { src: 'Images/Couple%20pic%203.jpeg', alt: 'Memory 3' },
        { src: 'Images/Couple%20pic%204.jpeg', alt: 'Memory 4' }
    ];
    const memoryModal = document.getElementById('memoryModal');
    const memoryModalImage = document.getElementById('memoryModalImage');
    const memoryModalClose = document.getElementById('memoryModalClose');

    if (memoryCurrentImage && memoryPrevBtn && memoryNextBtn) {
        let memoryIndex = 0;
        const updateMemory = () => {
            memoryCurrentImage.src = memoryImages[memoryIndex].src;
            memoryCurrentImage.alt = memoryImages[memoryIndex].alt;
        };
        memoryPrevBtn.addEventListener('click', () => {
            memoryIndex = (memoryIndex - 1 + memoryImages.length) % memoryImages.length;
            updateMemory();
        });

        memoryNextBtn.addEventListener('click', () => {
            memoryIndex = (memoryIndex + 1) % memoryImages.length;
            updateMemory();
        });
    }

    if (memoryModal && memoryModalImage && memoryModalClose && memoryCurrentImage) {
        memoryCurrentImage.addEventListener('click', () => {
            memoryModalImage.src = memoryCurrentImage.src;
            memoryModalImage.alt = memoryCurrentImage.alt;
            memoryModal.classList.add('show');
            memoryModal.setAttribute('aria-hidden', 'false');
        });

        const closeMemoryModal = () => {
            memoryModal.classList.remove('show');
            memoryModal.setAttribute('aria-hidden', 'true');
            memoryModalImage.src = '';
        };

        memoryModalClose.addEventListener('click', closeMemoryModal);
        memoryModal.addEventListener('click', (e) => {
            if (e.target === memoryModal) closeMemoryModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && memoryModal.classList.contains('show')) closeMemoryModal();
        });
    }

    // Countdown timer
    const daysEl = document.getElementById('countDays');
    const hoursEl = document.getElementById('countHours');
    const minsEl = document.getElementById('countMins');
    const secsEl = document.getElementById('countSecs');

    if (daysEl && hoursEl && minsEl && secsEl) {
        const weddingDate = new Date('2026-12-06T10:00:00+05:30').getTime();
        const pad = (n) => String(n).padStart(2, '0');

        const updateCountdown = () => {
            const now = Date.now();
            const diff = weddingDate - now;

            if (diff <= 0) {
                daysEl.textContent = '00';
                hoursEl.textContent = '00';
                minsEl.textContent = '00';
                secsEl.textContent = '00';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const mins = Math.floor((diff / (1000 * 60)) % 60);
            const secs = Math.floor((diff / 1000) % 60);

            daysEl.textContent = pad(days);
            hoursEl.textContent = pad(hours);
            minsEl.textContent = pad(mins);
            secsEl.textContent = pad(secs);
        };

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
});
