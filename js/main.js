// ===== 导航栏 =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveLink();
});

navToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
navLinks.forEach(link => link.addEventListener('click', () => navMenu.classList.remove('active')));

function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop, height = section.offsetHeight, id = section.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
            });
        }
    });
}

// ===== 胶片拉片交互 =====
const filmTrack = document.getElementById('filmstripTrack');
const filmItems = document.querySelectorAll('.film-item');
const filmTextTitle = document.getElementById('filmTextTitle');
const filmTextDesc = document.getElementById('filmTextDesc');

// 悬停显示文字
filmItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        const text = item.getAttribute('data-text');
        const desc = item.getAttribute('data-desc');
        filmTextTitle.style.opacity = '0';
        filmTextDesc.style.opacity = '0';
        setTimeout(() => {
            filmTextTitle.textContent = text;
            filmTextDesc.textContent = desc;
            filmTextTitle.style.opacity = '1';
            filmTextDesc.style.opacity = '1';
        }, 150);
    });
});

// 拖拽滚动
let isDown = false, startX, scrollLeft;
filmTrack.addEventListener('mousedown', e => {
    isDown = true;
    filmTrack.style.cursor = 'grabbing';
    startX = e.pageX - filmTrack.offsetLeft;
    scrollLeft = filmTrack.scrollLeft;
});
filmTrack.addEventListener('mouseleave', () => { isDown = false; filmTrack.style.cursor = 'grab'; });
filmTrack.addEventListener('mouseup', () => { isDown = false; filmTrack.style.cursor = 'grab'; });
filmTrack.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - filmTrack.offsetLeft;
    const walk = (x - startX) * 1.5;
    filmTrack.scrollLeft = scrollLeft - walk;
});

// 触摸支持
let touchStartX;
filmTrack.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; scrollLeft = filmTrack.scrollLeft; });
filmTrack.addEventListener('touchmove', e => {
    const walk = (touchStartX - e.touches[0].clientX) * 1.2;
    filmTrack.scrollLeft = scrollLeft + walk;
});

// ===== 滚动动画 =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.hobby-card, .timeline-item, .contact-item, .about-intro, .personal-info, .work-entry').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===== 页面加载 =====
window.addEventListener('load', () => {
    document.querySelector('.hero-content').classList.add('fade-in', 'visible');
});
