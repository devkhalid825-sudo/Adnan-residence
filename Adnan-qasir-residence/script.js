gsap.registerPlugin(ScrollTrigger);

// ======================
// CONTACT DROPDOWN
// ======================
(function () {
    const contactBtn = document.getElementById('contact-btn');
    const dropdown = document.getElementById('contact-dropdown');
    if (!contactBtn || !dropdown) return;

    contactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== contactBtn && !contactBtn.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') dropdown.classList.remove('open');
    });
})();

// ======================
// IMAGE SLIDER + SIDEBAR CLICK
// ======================
(function () {
    const track = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');

    let currentIndex = 0;

    const floorStartIndex = [0, 4, 7, 10];

    function getFloorFromSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex <= 3) return 0;
        if (slideIndex >= 4 && slideIndex <= 6) return 1;
        if (slideIndex >= 7 && slideIndex <= 9) return 2;
        if (slideIndex === 10) return 3;
        return 0;
    }

    function updateFloorSidebar(slideIndex) {
        const activeFloorIndex = getFloorFromSlide(slideIndex);
        document.querySelectorAll('.floor-card').forEach(card => card.classList.remove('active-floor'));
        const activeCard = document.querySelector(`.floor-card[data-floor="${activeFloorIndex}"]`);
        if (activeCard) {
            activeCard.classList.add('active-floor');
        }
    }

    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateFloorSidebar(currentIndex);
        updateThumbs(currentIndex);
    }

    const thumbStrip = document.getElementById('thumb-strip');
    const bottomPanel = document.getElementById('bottom-panel');
    const thumbTrack = document.getElementById('thumb-track');
    const thumbItems = [];

    const bottomToggleBtn = document.getElementById('bottom-toggle-btn');
    if (bottomToggleBtn && bottomPanel) {
        bottomToggleBtn.addEventListener('click', () => {
            const isCollapsed = bottomPanel.classList.toggle('collapsed');
            bottomToggleBtn.classList.toggle('collapsed', isCollapsed);
        });
    }

    function buildThumbs() {
        if (!thumbTrack) return;
        slides.forEach((slide, i) => {
            const img = slide.querySelector('img');
            const item = document.createElement('div');
            item.className = 'thumb-item';
            item.dataset.index = i;
            if (img) {
                const tImg = document.createElement('img');
                tImg.src = img.src;
                tImg.alt = img.alt || '';
                item.appendChild(tImg);
            }
            item.addEventListener('click', () => goToSlide(i));
            thumbTrack.appendChild(item);
            thumbItems.push(item);
        });
    }

    function updateThumbs(index) {
        thumbItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    buildThumbs();

    // Drag-to-scroll for thumb strip
    if (thumbStrip) {
        let isDragging = false;
        let startX = 0;
        let scrollStart = 0;

        thumbStrip.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX;
            scrollStart = thumbStrip.scrollLeft;
            thumbTrack.classList.add('dragging');
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.pageX - startX;
            thumbStrip.scrollLeft = scrollStart - dx;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                thumbTrack.classList.remove('dragging');
            }
        });

        // Touch support
        thumbStrip.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX;
            scrollStart = thumbStrip.scrollLeft;
        }, { passive: true });

        thumbStrip.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const dx = e.touches[0].pageX - startX;
            thumbStrip.scrollLeft = scrollStart - dx;
        }, { passive: true });

        thumbStrip.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }

    // Mouse drag to slide main slider
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        let dragStartX = 0;
        let isSliderDragging = false;

        sliderContainer.addEventListener('mousedown', (e) => {
            if (e.target.closest('button, a, .sidebar, .thumb-strip, .sidebar-toggle-btn')) return;
            isSliderDragging = true;
            dragStartX = e.pageX;
            sliderContainer.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isSliderDragging) return;
        });

        document.addEventListener('mouseup', (e) => {
            if (!isSliderDragging) return;
            isSliderDragging = false;
            sliderContainer.style.cursor = '';
            const dx = e.pageX - dragStartX;
            if (Math.abs(dx) > 50) {
                if (dx < 0 && currentIndex < slides.length - 1) {
                    goToSlide(currentIndex + 1);
                } else if (dx > 0 && currentIndex > 0) {
                    goToSlide(currentIndex - 1);
                }
            }
        });

        sliderContainer.addEventListener('touchstart', (e) => {
            if (e.target.closest('button, a, .sidebar, .thumb-strip, .sidebar-toggle-btn')) return;
            dragStartX = e.touches[0].pageX;
        }, { passive: true });

        sliderContainer.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].pageX - dragStartX;
            if (Math.abs(dx) > 50) {
                if (dx < 0 && currentIndex < slides.length - 1) {
                    goToSlide(currentIndex + 1);
                } else if (dx > 0 && currentIndex > 0) {
                    goToSlide(currentIndex - 1);
                }
            }
        });
    }

    // Toggle button for left sidebar
    const leftSidebar = document.querySelector('.left-sidebar');
    const toggleBtn = document.getElementById('left-sidebar-toggle');
    if (toggleBtn && leftSidebar) {
        toggleBtn.addEventListener('click', () => {
            const collapsed = leftSidebar.classList.toggle('collapsed');
            toggleBtn.classList.toggle('active', !collapsed);
        });
    }

    document.querySelectorAll('.floor-card').forEach(card => {
        card.addEventListener('click', () => {
            const floorIdx = parseInt(card.dataset.floor);
            if (!isNaN(floorIdx)) {
                goToSlide(floorStartIndex[floorIdx]);
            }
        });
    });

    // Toggle button for right sidebar
    const rightSidebar = document.querySelector('.right-sidebar');
    const rightToggleBtn = document.getElementById('right-sidebar-toggle');
    if (rightToggleBtn && rightSidebar) {
        rightToggleBtn.addEventListener('click', () => {
            const collapsed = rightSidebar.classList.toggle('collapsed');
            rightToggleBtn.classList.toggle('active', !collapsed);
        });
    }

    updateSlider();
})();

// ======================
// SOCIALS CARDS - SCROLL FAN OUT
// ======================
(function () {
    const cards = document.querySelectorAll('.social-card');
    const section = document.getElementById('socials-section');
    if (!cards.length || !section) return;

    const cardData = [
        { targetRotate: -24, targetX: -620, targetY: 160, zIndex: 10 },
        { targetRotate: -16, targetX: -420, targetY: 80, zIndex: 20 },
        { targetRotate: -8, targetX: -215, targetY: 25, zIndex: 30 },
        { targetRotate: 0, targetX: 0, targetY: 0, zIndex: 40 },
        { targetRotate: 8, targetX: 215, targetY: 25, zIndex: 30 },
        { targetRotate: 16, targetX: 420, targetY: 80, zIndex: 20 },
        { targetRotate: 24, targetX: 620, targetY: 160, zIndex: 10 }
    ];

    function getTargets() {
        const w = window.innerWidth;
        let tX, tY, tR;

        if (w <= 639) {
            tX = [-110, -65, -30, 0, 30, 65, 110];
            tY = [45, 20, 5, 0, 5, 20, 45];
            tR = [-16, -11, -5, 0, 5, 11, 16];
        } else if (w <= 1023) {
            tX = [-200, -130, -65, 0, 65, 130, 200];
            tY = [60, 30, 10, 0, 10, 30, 60];
            tR = [-16, -11, -5, 0, 5, 11, 16];
        } else if (w <= 1439) {
            tX = [-380, -250, -125, 0, 125, 250, 380];
            tY = [100, 50, 15, 0, 15, 50, 100];
            tR = [-20, -14, -7, 0, 7, 14, 20];
        } else {
            tX = cardData.map(d => d.targetX);
            tY = cardData.map(d => d.targetY);
            tR = cardData.map(d => d.targetRotate);
        }

        cards.forEach((card, i) => {
            gsap.fromTo(card,
                { x: 0, y: 0, rotation: 0, opacity: i === 3 ? 1 : 0 },
                {
                    x: tX[i], y: tY[i], rotation: tR[i], opacity: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 35%',
                        end: 'top -25%',
                        scrub: 0.3
                    }
                }
            );
        });
    }

    cards.forEach((card, i) => {
        card.style.zIndex = cardData[i].zIndex;
    });

    getTargets();

    gsap.fromTo('#socials-heading',
        { opacity: 0, y: 60 },
        {
            opacity: 1, y: 0,
            scrollTrigger: {
                trigger: section,
                start: 'top 88%',
                end: 'top 55%',
                scrub: 0.5
            }
        }
    );

    let hoveredIdx = -1;
    const inners = document.querySelectorAll('.social-card-inner');

    cards.forEach((card, i) => {
        card.addEventListener('mouseenter', () => {
            if (hoveredIdx === i) return;
            hoveredIdx = i;

            inners.forEach((inner, j) => {
                if (j === i) {
                    gsap.to(cards[j], { zIndex: 50, duration: 0.35, overwrite: 'auto' });
                    gsap.to(inner, { scale: 1.12, x: 0, y: -50, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
                } else {
                    const dir = j < i ? -1 : 1;
                    const dist = Math.abs(j - i);
                    const nudge = dir * (20 + dist * 14);
                    gsap.to(cards[j], { zIndex: cardData[j].zIndex, duration: 0.35, overwrite: 'auto' });
                    gsap.to(inner, { scale: 0.94, x: nudge, y: 12, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
                }
            });
        });

        card.addEventListener('mouseleave', () => {
            if (hoveredIdx !== i) return;
            hoveredIdx = -1;

            inners.forEach((inner, j) => {
                gsap.to(cards[j], { zIndex: cardData[j].zIndex, duration: 0.45, overwrite: 'auto' });
                gsap.to(inner, { scale: 1, x: 0, y: 0, duration: 0.45, ease: 'power3.inOut', overwrite: 'auto' });
            });
        });
    });
})();
