// Theme toggle (light / dark, persisted)
(function initTheme() {
    const root = document.documentElement;
    const saved = localStorage.getItem('theme');
    if (saved) root.setAttribute('data-theme', saved);

    document.addEventListener('DOMContentLoaded', () => {
        const toggle = document.querySelector('.theme-toggle');
        if (!toggle) return;
        const setIcon = () => {
            toggle.textContent = root.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
        };
        setIcon();
        toggle.addEventListener('click', () => {
            const isDark = root.getAttribute('data-theme') === 'dark';
            root.setAttribute('data-theme', isDark ? 'light' : 'dark');
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
            setIcon();
        });
    });
})();

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => navLinks.classList.remove('open'));
        });
    }

    // Highlight active nav link
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach((link) => {
        if (link.getAttribute('href') === current) {
            link.classList.add('active');
        }
    });

    // Reveal feature cards on scroll
    const revealTargets = document.querySelectorAll('.feature-card');
    if (revealTargets.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealTargets.forEach((el, i) => {
            el.style.transitionDelay = `${i * 100}ms`;
            observer.observe(el);
        });
    }

    // Copy email to clipboard
    document.querySelectorAll('.copy-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const value = btn.getAttribute('data-copy');
            try {
                await navigator.clipboard.writeText(value);
                const original = btn.textContent;
                btn.textContent = 'Copié !';
                setTimeout(() => { btn.textContent = original; }, 1500);
            } catch (err) {
                btn.textContent = 'Erreur';
            }
        });
    });

    // Contact form validation + simulated submit
    const form = document.getElementById('contact-form');
    if (form) {
        const status = document.getElementById('form-status');
        const submitBtn = form.querySelector('button[type="submit"]');

        const validators = {
            name: (v) => v.trim().length >= 2,
            email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
            message: (v) => v.trim().length >= 10,
        };

        const validateField = (field) => {
            const group = field.closest('.form-group');
            const isValid = validators[field.name](field.value);
            group.classList.toggle('invalid', !isValid);
            return isValid;
        };

        form.querySelectorAll('input, textarea').forEach((field) => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                if (field.closest('.form-group').classList.contains('invalid')) {
                    validateField(field);
                }
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const fields = [...form.querySelectorAll('input, textarea')];
            const allValid = fields.map(validateField).every(Boolean);
            if (!allValid) {
                status.classList.remove('visible');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Envoi...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Envoyer le message';
                status.classList.add('visible');
                form.reset();
            }, 900);
        });
    }
});
