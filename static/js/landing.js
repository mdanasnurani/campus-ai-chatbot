/**
 * Campus AI - Ultra-Clean & Aesthetic Landing Page JS v11.0
 * Includes: Blue/White/Black 3D Neural Constellation Canvas, Interactive Live Playground Terminal,
 * 3D Mouse Tilt, Specular Glare, Scroll Reveal Observer, and Parallax Background Orbs.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ================= 1. 3D Neural Constellation Canvas Background (Blue/Cyan/White) =================
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const particleCount = Math.min(65, Math.floor((width * height) / 18000));
        let mouseX = width / 2;
        let mouseY = height / 2;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 1.0,
                vy: (Math.random() - 0.5) * 1.0,
                radius: Math.random() * 2.2 + 1,
                color: Math.random() > 0.4 ? '#3B82F6' : '#38BDF8'
            });
        }

        function drawNeuralCanvas() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                // Draw node
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = p.color;
                ctx.fill();
                ctx.shadowBlur = 0;

                // Connect nodes
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 135) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(59, 130, 246, ${0.28 * (1 - dist / 135)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }

                // Connect to mouse
                const mdx = p.x - mouseX;
                const mdy = p.y - mouseY;
                const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mDist < 160) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.strokeStyle = `rgba(56, 189, 248, ${0.45 * (1 - mDist / 160)})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            }

            requestAnimationFrame(drawNeuralCanvas);
        }

        drawNeuralCanvas();
    }

    // ================= 2. Interactive AI Live Playground Terminal =================
    const chips = document.querySelectorAll('.chip-btn');
    const liveQuery = document.getElementById('live-user-query');
    const liveReply = document.getElementById('live-bot-reply');

    const promptsData = {
        admissions: {
            query: "Check B.Tech Fee & Admissions",
            reply: `<strong>⚡ Campus FAQ Engine (Resolved in 84ms)</strong><br><br>The B.Tech annual tuition fee is divided into two convenient semester installments. Admissions for the upcoming academic session are currently open! You can apply online via the student portal with your Class 12th / JEE entrance score card.<br><br><em>Need personal counseling? Visit Administration Block Room 102 between 9:00 AM – 4:30 PM.</em>`
        },
        python: {
            query: "Explain Python Polymorphism with Code",
            reply: `<strong>🚀 Real Educational AI Active (Python Code Tutor)</strong><br><br>Polymorphism allows different classes to share the same method name but execute unique behavior:<br><br><code style="color:#38BDF8; background:rgba(0,0,0,0.5); padding:6px 10px; border-radius:8px; display:block;">class College:<br>&nbsp;&nbsp;&nbsp;&nbsp;def get_role(self): return "Student"<br>class Faculty(College):<br>&nbsp;&nbsp;&nbsp;&nbsp;def get_role(self): return "Professor"<br># Both use .get_role() cleanly!</code>`
        },
        calculus: {
            query: "Step-by-Step Calculus Derivative",
            reply: `<strong>🚀 Real Educational AI Active (Step-by-Step Mathematics)</strong><br><br>Let's solve the derivative of <strong>f(x) = 4x³ - 5x + 12</strong> step-by-step:<br><br>• <strong>Step 1 (Power Rule):</strong> d/dx (4x³) = 4 · 3x² = <strong>12x²</strong><br>• <strong>Step 2 (Linear Term):</strong> d/dx (-5x) = <strong>-5</strong><br>• <strong>Step 3 (Constant Term):</strong> d/dx (12) = <strong>0</strong><br><br>✨ <strong>Final Answer: f'(x) = 12x² - 5</strong>`
        },
        hostel: {
            query: "Campus Hostel Curfew & Library Rules",
            reply: `<strong>⚡ Campus FAQ Engine (Resolved in 62ms)</strong><br><br>• <strong>Hostel Curfew:</strong> Gate closing time is strictly <strong>10:00 PM</strong> on weekdays and 10:30 PM on weekends.<br>• <strong>Library Timings:</strong> The Central Digital Library is open <strong>24/7</strong> for students preparing for semester exams.<br><br><em>Remember to carry your RFID College ID Card for entry at the electronic turnstile!</em>`
        }
    };

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const key = chip.getAttribute('data-prompt');
            const data = promptsData[key];

            if (data && liveQuery && liveReply) {
                liveQuery.textContent = data.query;
                liveReply.style.opacity = '0.3';
                setTimeout(() => {
                    liveReply.innerHTML = data.reply;
                    liveReply.style.opacity = '1';
                }, 180);
            }
        });
    });

    // ================= 3. 3D Interactive Mouse Tilt & Specular Glare =================
    const tiltCards = document.querySelectorAll('.tilt-card, .process-card, .mockup-panel, .cta-banner');

    tiltCards.forEach(card => {
        let glare = card.querySelector('.card-glare');
        if (!glare && card.classList.contains('tilt-card')) {
            glare = document.createElement('div');
            glare.className = 'card-glare';
            card.appendChild(glare);
        }

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8.5;
            const rotateY = ((x - centerX) / centerX) * 8.5;

            card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

            if (glare) {
                const glareX = (x / rect.width) * 100;
                const glareY = (y / rect.height) * 100;
                glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.22) 0%, rgba(56, 189, 248, 0.12) 35%, transparent 70%)`;
                glare.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            if (glare) {
                glare.style.opacity = '0';
            }
        });
    });

    // ================= 4. Scroll Reveal IntersectionObserver =================
    const revealElements = document.querySelectorAll('.reveal-card, .section-header');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, idx) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, (idx % 3) * 120);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    // ================= 5. Animated Number Counters on Scroll =================
    const statCounters = document.querySelectorAll('.stat-num');

    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetEl = entry.target;
                    const targetValStr = targetEl.getAttribute('data-target') || '120%';
                    const isPercentage = targetValStr.includes('%');
                    const targetNumber = parseInt(targetValStr.replace(/\D/g, ''), 10) || 120;

                    let startNumber = 0;
                    const duration = 1800;
                    const timer = setInterval(() => {
                        startNumber += Math.ceil(targetNumber / 30);
                        if (startNumber >= targetNumber) {
                            startNumber = targetNumber;
                            clearInterval(timer);
                        }
                        targetEl.textContent = startNumber + (isPercentage ? '%' : '+');
                    }, 35);

                    observer.unobserve(targetEl);
                }
            });
        }, { threshold: 0.5 });

        statCounters.forEach(stat => counterObserver.observe(stat));
    }

    // ================= 6. Parallax Background Orbs on Mouse Move =================
    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');
    const orb3 = document.querySelector('.orb-3');

    window.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.035;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.035;

        if (orb1) orb1.style.transform = `translate3d(${moveX * 1.6}px, ${moveY * 1.6}px, 0)`;
        if (orb2) orb2.style.transform = `translate3d(${-moveX * 1.3}px, ${-moveY * 1.3}px, 0)`;
        if (orb3) orb3.style.transform = `translate3d(${moveX * 0.9}px, ${-moveY * 0.9}px, 0)`;
    });

    // ================= 7. FAQ Accordion Logic =================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (questionBtn && answer) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = null;
                    }
                });

                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + "px";
                }
            });
        }
    });

    if (faqItems.length > 0) {
        const firstItem = faqItems[0];
        const firstAnswer = firstItem.querySelector('.faq-answer');
        if (firstAnswer) {
            firstItem.classList.add('active');
            firstAnswer.style.maxHeight = firstAnswer.scrollHeight + "px";
        }
    }

    // ================= 8. Smooth Scroll for Navigation Anchor Links =================
    const navAnchorLinks = document.querySelectorAll('a[href^="#"]');
    navAnchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});
