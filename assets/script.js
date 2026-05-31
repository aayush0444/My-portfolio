document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Prevent double-init (can happen with some reload flows)
    if (window.__AKR_PORTFOLIO_INIT__) return;
    window.__AKR_PORTFOLIO_INIT__ = true;

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // =============================================
    // 1. DUAL CURSOR — dot + inertia ring
    // =============================================
    const oldCursor = document.getElementById('cursor');
    if (oldCursor) oldCursor.style.display = 'none';

    let dot = document.getElementById('cursor-dot');
    let ring = document.getElementById('cursor-ring');

    if (!dot) {
        dot = document.createElement('div');
        dot.id = 'cursor-dot';
        document.body.appendChild(dot);
    }

    if (!ring) {
        ring = document.createElement('div');
        ring.id = 'cursor-ring';
        document.body.appendChild(ring);
    }

    let mx = -200, my = -200;
    let rx = -200, ry = -200;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
    });

    gsap.ticker.add(() => {
        if (dot && ring) {
            gsap.to(dot, { duration: 0.15, x: mx, y: my });
            
            rx += (mx - rx) * 0.10;
            ry += (my - ry) * 0.10;
            gsap.to(ring, { duration: 0.35, x: rx - 19, y: ry - 19 });
        }
    });

    const HOVER_TARGETS = 'a, button, .project-item, .skill-cell, .card, .stack-tag, .cta-primary, .connect-link, .heading-card';
    document.querySelectorAll(HOVER_TARGETS).forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(dot, { duration: 0.2, width: '10px', height: '10px' });
            gsap.to(ring, { duration: 0.3, width: '64px', height: '64px', borderColor: 'rgba(204,255,0,0.9)', background: 'rgba(204,255,0,0.04)' });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(dot, { duration: 0.2, width: '6px', height: '6px' });
            gsap.to(ring, { duration: 0.3, width: '38px', height: '38px', borderColor: 'rgba(204,255,0,0.45)', background: 'transparent' });
        });
    });

    // =============================================
    // 2. TYPING ANIMATION
    // =============================================
    const typer = document.querySelector('#typing-intro');
    if (typer) {
        const TEXT = 'AAYUSH KUMAR.';
        typer.textContent = '';
        let i = 0;

        const blink = document.createElement('span');
        blink.style.cssText = 'color:#CCFF00; animation: _blink 1s step-end infinite;';
        blink.textContent = '|';
        typer.after(blink);

        const blinkStyle = document.createElement('style');
        blinkStyle.textContent = '@keyframes _blink { 0%,100%{opacity:1} 50%{opacity:0} }';
        document.head.appendChild(blinkStyle);

        setTimeout(function type() {
            if (i < TEXT.length) {
                typer.textContent += TEXT[i++];
                setTimeout(type, 85);
            } else {
                setTimeout(() => blink.remove(), 1200);
            }
        }, 400);
    }

    // =============================================
    // 3. PARALLAX — hero bg with GSAP
    // =============================================
    gsap.to("#parallax-bg", {
        scrollTrigger: {
            scrub: 1
        },
        y: (i, target) => -ScrollTrigger.maxScroll(window) * 0.1,
        ease: "none"
    });

    // =============================================
    // 4. NAV — frosted on scroll
    // =============================================
    const nav = document.getElementById('nav');
    if (nav) {
        ScrollTrigger.create({
            start: 'top top-=60',
            end: 99999,
            onUpdate: self => {
                gsap.to(nav, {
                    duration: 0.5,
                    backgroundColor: self.isActive ? 'rgba(0,0,0,0.85)' : 'transparent',
                    borderColor: self.isActive ? '#333333' : 'transparent',
                    backdropFilter: self.isActive ? 'blur(14px)' : 'none',
                    ease: 'power1.inOut'
                });
            }
        });
    }

    // =============================================
    // 5. CINEMATIC SECTION TITLE REVEAL
    // =============================================
    document.querySelectorAll('.section-title').forEach(title => {
        const wrap = document.createElement('div');
        wrap.style.overflow = 'hidden';
        wrap.style.display = 'block';
        title.parentNode.insertBefore(wrap, title);
        wrap.appendChild(title);

        gsap.fromTo(
            title,
            { yPercent: 110 },
            {
                yPercent: 0,
                duration: 0.85,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: wrap,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                    once: true,
                },
                onComplete: () => gsap.set(title, { clearProps: 'transform' }),
            }
        );
    });

    // =============================================
    // 6. SIDEWAYS & UP REVEALS (reliable)
    //    Uses ScrollTrigger.batch + explicit set/to
    //    to avoid gsap.from() invalidation bugs.
    // =============================================
    function batchReveal(selector, fromVars, staggerEach = 0, start = 'top 85%') {
        const elements = gsap.utils.toArray(selector);
        if (!elements.length) return;

        const setVars = { opacity: 0 };
        if (Object.prototype.hasOwnProperty.call(fromVars, 'x')) setVars.x = fromVars.x;
        if (Object.prototype.hasOwnProperty.call(fromVars, 'y')) setVars.y = fromVars.y;
        gsap.set(elements, setVars);

        const toVars = {
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
            stagger: staggerEach,
            clearProps: 'opacity,transform',
        };
        if (setVars.x != null) toVars.x = 0;
        if (setVars.y != null) toVars.y = 0;

        ScrollTrigger.batch(elements, {
            start,
            once: true,
            onEnter: (batch) => gsap.to(batch, toVars),
        });
    }

    batchReveal('.section-label', { x: -24 });
    batchReveal('.stat-item', { y: 45 }, 0.1);
    batchReveal('.skill-cell', { y: 45 }, 0.07);
    batchReveal('.card', { y: 45 }, 0.1);
    batchReveal('.project-item', { x: -50 }, 0.08); // Sideways pop-up
    batchReveal('.about-text, .about-stack, .connect-body, #connect-links, .section-divider', { y: 30 });


    // =============================================
    // 7. PROJECT ITEMS — left accent line reveal
    // =============================================
    document.querySelectorAll('.project-item').forEach(item => {
        const line = document.createElement('span');
        line.style.cssText = `
            position: absolute; left: 0; top: 0; width: 2px; height: 0;
            background: #CCFF00; pointer-events: none;
        `;
        item.appendChild(line);

        item.addEventListener('mouseenter', () => { gsap.to(line, { duration: 0.45, height: '100%', ease: 'power3.out' }); });
        item.addEventListener('mouseleave', () => { gsap.to(line, { duration: 0.45, height: '0%', ease: 'power3.out' }); });
    });

    // =============================================
    // 8. SKILL CELLS — bottom-up fill on hover
    // =============================================
    document.querySelectorAll('.skill-cell').forEach(cell => {
        const fill = document.createElement('span');
        fill.style.cssText = `
            position: absolute; inset: 0; background: #0a0a0a;
            transform: translateY(100%); pointer-events: none; z-index: 0;
        `;
        cell.appendChild(fill);

        Array.from(cell.children).forEach(child => {
            if (child !== fill) child.style.position = 'relative';
            if (child !== fill) child.style.zIndex = '1';
        });

        cell.addEventListener('mouseenter', () => { gsap.to(fill, { duration: 0.5, yPercent: 0, ease: 'power3.out' }); });
        cell.addEventListener('mouseleave', () => { gsap.to(fill, { duration: 0.5, yPercent: 100, ease: 'power3.out' }); });
    });

    // =============================================
    // 9. STAT COUNT-UP (no plugins required)
    // =============================================
    gsap.utils.toArray('.stat-number').forEach(el => {
        const raw = el.textContent.trim();
        const numeric = parseFloat(raw.replace(/[^0-9.]/g, ''));
        if (isNaN(numeric) || numeric === 0) return;

        const prefix = raw.match(/^[^\d]*/)?.[0] || '';
        const suffix = raw.match(/[^\d.]+$/)?.[0] || '';

        // Keep the suffix/prefix while counting up (e.g. ₹5K, 230+)
        el.textContent = `${prefix}0${suffix}`;
        const counter = { value: 0 };

        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to(counter, {
                    value: numeric,
                    duration: 1.4,
                    ease: 'power3.out',
                    onUpdate: () => {
                        el.textContent = `${prefix}${Math.round(counter.value)}${suffix}`;
                    },
                    onComplete: () => {
                        el.textContent = `${prefix}${Math.round(numeric)}${suffix}`;
                    }
                });
            }
        });
    });

    // =============================================
    // 10. NAV ACTIVE LINK
    // =============================================
    const navLinks = document.querySelectorAll('.nav-link');
    gsap.utils.toArray('section[id]').forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onToggle: self => {
                if (self.isActive) {
                    navLinks.forEach(l => l.style.color = '');
                    const match = document.querySelector(`.nav-link[href="#${section.id}"]`);
                    if (match) match.style.color = '#CCFF00';
                }
            }
        });
    });

    // =============================================
    // 11. SMOOTH SCROLL (native, no extra plugins)
    // =============================================
    navLinks.forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const targetId = a.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // =============================================
    // 12. HERO SCROLL INDICATOR
    // =============================================
    const heroSection = document.getElementById('home-context');
    if (heroSection) {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: absolute; bottom: 2.5rem; right: 8%; z-index: 2;
            display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
        `;
        indicator.innerHTML = `
            <span style="font-family:'Space Grotesk',sans-serif; font-size:0.6rem;
                letter-spacing:0.2em; color:#666; text-transform:uppercase;
                writing-mode:vertical-rl;">Scroll</span>
            <div style="width:1px; height:48px; background:#1a1a1a; position:relative; overflow:hidden;">
                <span id="scroll-line" style="position:absolute; top:-100%; left:0; width:100%; height:100%;
                    background:#CCFF00;"></span>
            </div>
        `;
        heroSection.appendChild(indicator);

        gsap.from(indicator, { opacity: 0, delay: 1.8, duration: 1 });
        gsap.to("#scroll-line", { y: '200%', duration: 2, repeat: -1, ease: 'power1.inOut' });

        ScrollTrigger.create({
            trigger: heroSection,
            start: 'bottom bottom',
            onEnter: () => gsap.to(indicator, { opacity: 0, duration: 0.5 }),
            onLeaveBack: () => gsap.to(indicator, { opacity: 1, duration: 0.5 })
        });
    }

    // Refresh ScrollTrigger after all assets load (fonts/images can shift layout)
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
        // Some font loads/layout shifts can happen right after load
        requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    // If returning from bfcache, refresh triggers
    window.addEventListener('pageshow', (e) => {
        if (e.persisted) ScrollTrigger.refresh();
    });
});