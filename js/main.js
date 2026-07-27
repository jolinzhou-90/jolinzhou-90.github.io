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

// ===== 90的世界地图 =====
const cityData = {
    edinburgh: {
        name: '爱丁堡', country: 'Edinburgh, UK',
        x: 422, y: 88,
        dates: ['2023.09 - 至今'],
        photos: []
    },
    london: {
        name: '伦敦', country: 'London, UK',
        x: 435, y: 100,
        dates: [],
        photos: []
    },
    copenhagen: {
        name: '哥本哈根', country: 'Copenhagen, Denmark',
        x: 490, y: 82,
        dates: [],
        photos: []
    },
    brussels: {
        name: '布鲁塞尔', country: 'Brussels, Belgium',
        x: 455, y: 98,
        dates: [],
        photos: []
    },
    vienna: {
        name: '维也纳', country: 'Vienna, Austria',
        x: 505, y: 105,
        dates: [],
        photos: []
    },
    barcelona: {
        name: '巴塞罗那', country: 'Barcelona, Spain',
        x: 438, y: 130,
        dates: [],
        photos: []
    },
    tenerife: {
        name: '特内里费', country: 'Tenerife, Spain',
        x: 395, y: 175,
        dates: [],
        photos: []
    },
    paris: {
        name: '巴黎', country: 'Paris, France',
        x: 448, y: 102,
        dates: [],
        photos: []
    },
    hongkong: {
        name: '香港', country: 'Hong Kong, China',
        x: 812, y: 195,
        dates: [],
        photos: []
    },
    shenzhen: {
        name: '深圳', country: 'Shenzhen, China',
        x: 800, y: 200,
        dates: [],
        photos: []
    },
    xiamen: {
        name: '厦门', country: 'Xiamen, China',
        x: 815, y: 210,
        dates: [],
        photos: []
    },
    hangzhou: {
        name: '杭州', country: 'Hangzhou, China',
        x: 822, y: 188,
        dates: [],
        photos: []
    },
    shanghai: {
        name: '上海', country: 'Shanghai, China',
        x: 830, y: 180,
        dates: [],
        photos: []
    },
    beijing: {
        name: '北京', country: 'Beijing, China',
        x: 810, y: 148,
        dates: [],
        photos: []
    },
    shaoxing: {
        name: '绍兴', country: 'Shaoxing, China',
        x: 820, y: 190,
        dates: [],
        photos: []
    },
    jiaxing: {
        name: '嘉兴', country: 'Jiaxing, China',
        x: 825, y: 185,
        dates: [],
        photos: []
    }
};

// 渲染城市标记
const markersGroup = document.getElementById('cityMarkers');
Object.entries(cityData).forEach(([key, city]) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('city-marker');
    g.setAttribute('data-city', key);
    g.setAttribute('transform', `translate(${city.x}, ${city.y})`);

    // 发光圈
    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    glow.classList.add('city-marker-glow');
    glow.setAttribute('r', '10');
    glow.setAttribute('cx', '0');
    glow.setAttribute('cy', '0');
    glow.style.transformOrigin = '0 0';

    // 实心点
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.classList.add('city-marker-dot');
    dot.setAttribute('r', '3.5');
    dot.setAttribute('cx', '0');
    dot.setAttribute('cy', '0');

    g.appendChild(glow);
    g.appendChild(dot);
    markersGroup.appendChild(g);

    // 点击事件
    g.addEventListener('click', () => openCityDetail(key));
});

// 打开城市详情面板
function openCityDetail(cityKey) {
    const city = cityData[cityKey];
    if (!city) return;

    document.getElementById('cityDetailName').textContent = city.name;
    document.getElementById('cityDetailCountry').textContent = city.country;

    // 日期
    const datesContainer = document.getElementById('cityDetailDates');
    datesContainer.innerHTML = '';
    if (city.dates.length > 0) {
        city.dates.forEach(date => {
            const div = document.createElement('div');
            div.className = 'city-detail-date-item';
            div.innerHTML = `<i class="fas fa-calendar-alt"></i><span>${date}</span>`;
            datesContainer.appendChild(div);
        });
    } else {
        datesContainer.innerHTML = '<div class="city-detail-date-item"><i class="fas fa-clock"></i><span style="color:rgba(255,255,255,0.3)">待补充旅行时间</span></div>';
    }

    // 照片
    const photosContainer = document.getElementById('cityDetailPhotos');
    photosContainer.innerHTML = '';
    if (city.photos.length > 0) {
        city.photos.forEach(src => {
            const img = document.createElement('img');
            img.className = 'city-detail-photo';
            img.src = src;
            photosContainer.appendChild(img);
        });
    } else {
        photosContainer.innerHTML = '<p style="color:rgba(255,255,255,0.25);font-size:0.85rem;grid-column:1/-1;text-align:center;padding:20px 0;">待添加旅行照片</p>';
    }

    document.getElementById('cityDetailPanel').classList.add('active');
}

// 关闭城市详情面板
document.getElementById('cityDetailClose').addEventListener('click', () => {
    document.getElementById('cityDetailPanel').classList.remove('active');
});

// 点击地图空白处关闭面板
document.querySelector('.worldmap-svg').addEventListener('click', (e) => {
    if (!e.target.closest('.city-marker')) {
        document.getElementById('cityDetailPanel').classList.remove('active');
    }
});
