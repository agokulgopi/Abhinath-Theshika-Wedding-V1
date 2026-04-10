document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis for Smooth Scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // 2. GSAP ScrollTrigger Setup
    gsap.registerPlugin(ScrollTrigger);

    // Sync Lenis with GSAP
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Hero Cinematic (Removed per user request)

    // 4. Reveal Animations for Other Sections
    gsap.utils.toArray('.fade-in').forEach(section => {
        gsap.fromTo(section, 
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // 5. Home Memory Carousel logic (Restored)
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
        });

        const closeMemoryModal = () => {
            memoryModal.classList.remove('show');
        };

        memoryModalClose.addEventListener('click', closeMemoryModal);
        memoryModal.addEventListener('click', (e) => {
            if (e.target === memoryModal) closeMemoryModal();
        });
    }

    // 6. Countdown Timer (Restored)
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
