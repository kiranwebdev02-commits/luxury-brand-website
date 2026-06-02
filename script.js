/**
 * AURA ELITE - INTERACTIVE LUXURY CORE ENGINE
 * Implements premium frontend-only animations and interactions.
 */

document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------------------------------------
    // 1. PRELOADER & LOADING SCREEN
    // -------------------------------------------------------------
    const preloader = document.getElementById("preloader");
    if (preloader) {
        window.addEventListener("load", () => {
            setTimeout(() => {
                preloader.classList.add("fade-out");
            }, 800); // Elegant delay to let preloader settle
        });
        
        // Backup safety timeout (if loading takes too long)
        setTimeout(() => {
            if (!preloader.classList.contains("fade-out")) {
                preloader.classList.add("fade-out");
            }
        }, 3000);
    }

    // -------------------------------------------------------------
    // 2. DYNAMIC STICKY NAVBAR & ACTIVE SECTIONS
    // -------------------------------------------------------------
    const navbar = document.getElementById("main-navbar");
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    const sections = document.querySelectorAll("section, header");

    const handleNavbarScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    };

    const handleActiveNavHighlighting = () => {
        let currentSectionId = "";
        const scrollPosition = window.scrollY + 150; // offset for sticky nav

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    };

    window.addEventListener("scroll", () => {
        handleNavbarScroll();
        handleActiveNavHighlighting();
    });
    
    // Initial call to check positioning
    handleNavbarScroll();

    // Close mobile menu on clicking links (improved mobile UX)
    const navbarCollapse = document.getElementById("navbarContent");
    const customToggler = document.querySelector(".custom-toggler");
    
    if (navbarCollapse && customToggler) {
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                if (window.innerWidth < 992 && navbarCollapse.classList.contains("show")) {
                    customToggler.click(); // programmatically toggle Bootstrap menu
                }
            });
        });
    }

    // -------------------------------------------------------------
    // 3. CANVAS GOLD PARTICLES BACKGROUND
    // -------------------------------------------------------------
    const canvas = document.getElementById("particles-canvas");
    const ctx = canvas.getContext("2d");
    let particlesArray = [];
    let numberOfParticles = 75;

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particlesArray = [];
        initParticles();
    };

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5; // Tiny elegant dust
            
            // Core luxury color palette (Gold shades, Silver, white)
            const colors = [
                "rgba(212, 175, 55, ",  // Gold
                "rgba(243, 229, 171, ", // Pale Gold
                "rgba(229, 229, 229, ", // Silver
                "rgba(255, 255, 255, "  // White
            ];
            this.colorBase = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.5 + 0.1;
            
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * -0.5 - 0.1; // Gentle upwards float
            this.waveFrequency = Math.random() * 0.02;
            this.waveAmplitude = Math.random() * 0.3;
        }

        update() {
            this.x += this.speedX + Math.sin(this.y * this.waveFrequency) * this.waveAmplitude;
            this.y += this.speedY;
            
            // Slowly fade out near top
            if (this.y < 100) {
                this.alpha -= 0.01;
            }

            // Recycle particles once fully out of bounds
            if (this.y < 0 || this.x < 0 || this.x > canvas.width || this.alpha <= 0) {
                this.y = canvas.height + 10;
                this.x = Math.random() * canvas.width;
                this.size = Math.random() * 2 + 0.5;
                this.alpha = Math.random() * 0.5 + 0.1;
                this.speedY = Math.random() * -0.5 - 0.1;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `${this.colorBase}${this.alpha})`;
            ctx.shadowBlur = this.size * 2;
            ctx.shadowColor = "rgba(212, 175, 55, 0.4)";
            ctx.fill();
        }
    }

    const initParticles = () => {
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    };

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animateParticles();

    // -------------------------------------------------------------
    // 4. MOUSE MOVEMENT PARALLAX (HERO SECTION)
    // -------------------------------------------------------------
    const heroSection = document.getElementById("home");
    const parallaxBg = document.getElementById("hero-parallax-bg");
    
    if (heroSection && parallaxBg) {
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        const speed = 0.07; // Smooth damping coefficient

        window.addEventListener("mousemove", (e) => {
            // Get cursor offset from center of window (normalized between -1 and 1)
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            mouseX = (e.clientX - centerX) / centerX;
            mouseY = (e.clientY - centerY) / centerY;
        });

        const updateParallax = () => {
            // Ease coordinates (linear interpolation/damping)
            targetX += (mouseX - targetX) * speed;
            targetY += (mouseY - targetY) * speed;

            // Apply translation to background wrapper
            // Background moves opposite to cursor slightly for deep 3D sensation
            const moveX = targetX * -25; // max 25px offset
            const moveY = targetY * -25;
            parallaxBg.style.transform = `scale(1.1) translate3d(${moveX}px, ${moveY}px, 0)`;

            requestAnimationFrame(updateParallax);
        };
        
        updateParallax();
    }

    // -------------------------------------------------------------
    // 5. VIEWPORT-TRIGGERED STATS COUNTER
    // -------------------------------------------------------------
    const statsSection = document.getElementById("stats-section");
    const statNumbers = document.querySelectorAll(".stat-number");
    let hasCounted = false;

    const runCounters = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute("data-target"), 10);
            let count = 0;
            const duration = 2000; // 2 seconds counting speed
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out cubic (starts fast, slows down at end)
                const easeOutQuad = 1 - Math.pow(1 - progress, 3);
                
                count = Math.floor(easeOutQuad * target);
                
                // Formatting helper for numbers like 14200 -> 14,200+
                if (target >= 1000) {
                    stat.innerText = count.toLocaleString() + "+";
                } else if (target === 42) {
                    stat.innerText = count + "+";
                } else {
                    stat.innerText = count;
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    // Force complete end precision
                    stat.innerText = target >= 1000 ? target.toLocaleString() + "+" : target + "+";
                }
            };

            requestAnimationFrame(updateCount);
        });
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasCounted) {
                runCounters();
                hasCounted = true;
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // -------------------------------------------------------------
    // 6. SCROLL REVEAL (FADES & TRANSLATIONS)
    // -------------------------------------------------------------
    const revealElements = document.querySelectorAll(".scroll-reveal");

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                revealObserver.unobserve(entry.target); // Reveal only once
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // -------------------------------------------------------------
    // 7. BACK TO TOP BUTTON
    // -------------------------------------------------------------
    const backToTopBtn = document.getElementById("back-to-top-btn");

    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 600) {
                backToTopBtn.classList.add("visible");
            } else {
                backToTopBtn.classList.remove("visible");
            }
        });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // -------------------------------------------------------------
    // 8. LUXURY INTERACTIVE SPECS MODAL SYSTEM
    // -------------------------------------------------------------
    const modal = document.getElementById("productDetailsModal");
    const modalImage = document.getElementById("modal-product-img");
    const modalTitle = document.getElementById("modal-product-title");
    const modalPrice = document.getElementById("modal-product-price");
    const modalSpecsGrid = document.getElementById("modal-technical-specs");
    const modalBadge = document.getElementById("modal-product-badge");
    const inquireBtn = document.getElementById("modal-inquire-btn");
    
    const triggerButtons = document.querySelectorAll(".btn-details-trigger");

    triggerButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const title = btn.getAttribute("data-title");
            const price = btn.getAttribute("data-price");
            const img = btn.getAttribute("data-img");
            const type = btn.getAttribute("data-type");
            const specsData = JSON.parse(btn.getAttribute("data-specs"));

            // Set simple details
            modalTitle.innerText = title;
            modalPrice.innerText = price;
            modalImage.src = img;
            modalImage.alt = title;

            // Set badge based on type
            if (type === "watch") {
                modalBadge.innerText = "HAUTE HORLOGERIE INQUIRY";
                modalBadge.className = "badge bg-gold text-dark text-uppercase tracking-wider mb-2";
                inquireBtn.innerText = "Request Private Horological Allocation";
            } else {
                modalBadge.innerText = "HYPERCAR COMMISSIONING";
                modalBadge.className = "badge bg-gold text-dark text-uppercase tracking-wider mb-2";
                inquireBtn.innerText = "Inquire About Vehicle Configuration";
            }

            // Build specifications grid dynamically
            modalSpecsGrid.innerHTML = "";
            for (const [key, value] of Object.entries(specsData)) {
                const specBox = document.createElement("div");
                specBox.className = "spec-item-box";
                
                const keySpan = document.createElement("span");
                keySpan.innerText = key;
                
                const valueSpan = document.createElement("span");
                valueSpan.innerText = value;
                
                specBox.appendChild(keySpan);
                specBox.appendChild(valueSpan);
                modalSpecsGrid.appendChild(specBox);
            }

            // Launch Bootstrap Modal
            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();
        });
    });

    // Inquire Button click effect
    if (inquireBtn) {
        inquireBtn.addEventListener("click", () => {
            inquireBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Securing VIP Link...';
            inquireBtn.disabled = true;
            
            setTimeout(() => {
                inquireBtn.innerHTML = '<i class="bi bi-shield-lock-fill me-2"></i> Encrypted Access Dispatched';
                inquireBtn.className = "btn btn-success px-4 py-2.5 text-uppercase tracking-wide w-100";
                
                // Success notify
                const statusAlert = document.createElement("p");
                statusAlert.className = "text-center text-success small mt-3 mb-0";
                statusAlert.innerHTML = '<i class="bi bi-check-circle-fill"></i> Our Monacan desk will reach you via secure channel within 1 hour.';
                inquireBtn.parentNode.appendChild(statusAlert);
            }, 1800);
        });
    }

    // -------------------------------------------------------------
    // 9. ELEGANT NEWSLETTER SUBMIT EFFECT
    // -------------------------------------------------------------
    const newsletterForm = document.getElementById("luxury-newsletter-form");
    const statusText = document.getElementById("newsletter-status");

    if (newsletterForm && statusText) {
        newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const submitBtn = newsletterForm.querySelector("button");
            const emailInput = newsletterForm.querySelector("input");

            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = '<i class="bi bi-check2"></i>';
                emailInput.value = "";
                statusText.classList.remove("d-none");
                
                // Hide status message after 5 seconds
                setTimeout(() => {
                    statusText.classList.add("d-none");
                    submitBtn.innerHTML = "Subscribe";
                    submitBtn.disabled = false;
                }, 5000);
            }, 1500);
        });
    }

    // -------------------------------------------------------------
    // 10. PRODUCT HOVER EXTRA INTERACTIVE SOUND GLOW (MODULAR ENGINE)
    // -------------------------------------------------------------
    const watchCards = document.querySelectorAll(".luxury-card");
    watchCards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            // Subtle premium shadow hover animation check
            card.style.borderColor = "var(--gold)";
        });
        
        card.addEventListener("mouseleave", () => {
            card.style.borderColor = "var(--border-glass-white)";
        });
    });
});
