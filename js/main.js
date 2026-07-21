// ===== 导航栏滚动效果 & 移动端菜单 =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// 滚动时添加导航栏样式
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    updateActiveLink();
});

// 移动端菜单切换
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// 点击菜单项后关闭菜单
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// 更新当前激活的导航链接
function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== 滚动动画 =====
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // 技能条动画
            if (entry.target.classList.contains('skill-item')) {
                const progress = entry.target.querySelector('.skill-progress');
                if (progress) {
                    const width = progress.getAttribute('data-width');
                    progress.style.width = width + '%';
                }
            }

            // 数字动画
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(num => {
                animateNumber(num);
            });
        }
    });
}, observerOptions);

// 观察需要动画的元素
document.querySelectorAll('.hobby-card, .timeline-item, .contact-item, .about-skills, .about-text').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// 观察技能条
document.querySelectorAll('.skill-item').forEach(el => {
    observer.observe(el);
});

// ===== 数字递增动画 =====
function animateNumber(el) {
    const target = parseInt(el.getAttribute('data-target'));
    if (!target) return;

    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current);
        }
    }, 16);
}

// ===== 页面加载动画 =====
window.addEventListener('load', () => {
    document.querySelector('.hero-content').classList.add('fade-in', 'visible');
});
