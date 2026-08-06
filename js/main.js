// ===== 页面切换系统 =====
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // Show target
    const target = document.getElementById('page-' + pageId);
    if (target) target.classList.add('active');
    // Update nav
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const activeLink = document.querySelector('.nav-link[data-page="' + pageId + '"]');
    if (activeLink) activeLink.classList.add('active');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
    // Close mobile menu
    document.getElementById('navMenu').classList.remove('active');
    // Re-observe fade-in elements in the new page
    document.querySelectorAll('#page-' + pageId + ' .fade-in').forEach(el => {
        el.classList.remove('visible');
        observer.observe(el);
    });
    // Trigger map render if navigating to life page
    if (pageId === 'life') {
        loadWorldMap();
    }
}

// ===== 导航栏 =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

navToggle.addEventListener('click', () => navMenu.classList.toggle('active'));

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

// ===== 教育板块 Tab 切换 =====
document.querySelectorAll('.edu-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.edu-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.edu-tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// ===== 页面加载 =====
window.addEventListener('load', () => {
    document.querySelector('.hero-content').classList.add('fade-in', 'visible');
});

// ===== 90的世界地图 =====
// 城市/目的地 → 国家映射（基于地图数据中的国家名称）
const cityToCountry = {
    edinburgh: 'United Kingdom',
    london: 'United Kingdom',
    copenhagen: 'Denmark',
    brussels: 'Belgium',
    vienna: 'Austria',
    barcelona: 'Spain',
    tenerife: 'Spain',
    paris: 'France',
    hongkong: 'China',
    shenzhen: 'China',
    xiamen: 'China',
    hangzhou: 'China',
    shanghai: 'China',
    beijing: 'China',
    shaoxing: 'China',
    jiaxing: 'China',
    // 新增目的地
    dubai: 'United Arab Emirates',
    bali: 'Indonesia',
    phuket: 'Thailand',
    krabi: 'Thailand',
    bangkok: 'Thailand',
    bermuda: 'Bermuda',
    saipan: 'United States',
    langkawi: 'Malaysia',
    santorini: 'Greece',
    maldives: 'Maldives',
    mauritius: 'Mauritius',
    seychelles: 'Seychelles',
    // 美国城市
    newyork: 'United States',
    sanfrancisco: 'United States',
    chicago: 'United States',
    orlando: 'United States',
    // 新增确认城市
    bath: 'United Kingdom',
    rome: 'Italy',
    milan: 'Italy',
    florence: 'Italy',
    venice: 'Italy',
    okinawa: 'Japan',
    jeju: 'Korea',
    kualalumpur: 'Malaysia',
    malacca: 'Malaysia',
    athens: 'Greece',
    amsterdam: 'Netherlands',
    abudhabi: 'United Arab Emirates',
    // 新增确认城市
    casablanca: 'Morocco',
    belgrade: 'Serbia',
    kotor: 'Montenegro',
    panamacity: 'Panama'
};

const cityData = {
    edinburgh: { name: '爱丁堡', country: 'Edinburgh, UK', lat: 55.95, lon: -3.19, dates: [], photos: [] },
    london: { name: '伦敦', country: 'London, UK', lat: 51.51, lon: -0.13, dates: [], photos: [] },
    copenhagen: { name: '哥本哈根', country: 'Copenhagen, Denmark', lat: 55.68, lon: 12.57, dates: [], photos: [] },
    brussels: { name: '布鲁塞尔', country: 'Brussels, Belgium', lat: 50.85, lon: 4.35, dates: [], photos: [] },
    vienna: { name: '维也纳', country: 'Vienna, Austria', lat: 48.21, lon: 16.37, dates: [], photos: [] },
    barcelona: { name: '巴塞罗那', country: 'Barcelona, Spain', lat: 41.39, lon: 2.17, dates: [], photos: [] },
    tenerife: { name: '特内里费', country: 'Tenerife, Spain', lat: 28.47, lon: -16.26, dates: [], photos: [] },
    paris: { name: '巴黎', country: 'Paris, France', lat: 48.86, lon: 2.35, dates: [], photos: [] },
    hongkong: { name: '香港', country: 'Hong Kong, China', lat: 22.32, lon: 114.17, dates: [], photos: [] },
    shenzhen: { name: '深圳', country: 'Shenzhen, China', lat: 22.54, lon: 114.06, dates: [], photos: [] },
    xiamen: { name: '厦门', country: 'Xiamen, China', lat: 24.48, lon: 118.09, dates: [], photos: [] },
    hangzhou: { name: '杭州', country: 'Hangzhou, China', lat: 30.27, lon: 120.15, dates: [], photos: [] },
    shanghai: { name: '上海', country: 'Shanghai, China', lat: 31.23, lon: 121.47, dates: [], photos: [] },
    beijing: { name: '北京', country: 'Beijing, China', lat: 39.90, lon: 116.41, dates: [], photos: [] },
    shaoxing: { name: '绍兴', country: 'Shaoxing, China', lat: 30.00, lon: 120.58, dates: [], photos: [] },
    jiaxing: { name: '嘉兴', country: 'Jiaxing, China', lat: 30.75, lon: 120.75, dates: [], photos: [] },
    // 新增目的地
    dubai: { name: '迪拜', country: 'Dubai, UAE', lat: 25.20, lon: 55.27, dates: [], photos: [] },
    bali: { name: '巴厘岛', country: 'Bali, Indonesia', lat: -8.34, lon: 115.09, dates: [], photos: [] },
    phuket: { name: '普吉岛', country: 'Phuket, Thailand', lat: 7.88, lon: 98.39, dates: [], photos: [] },
    krabi: { name: '甲米', country: 'Krabi, Thailand', lat: 8.09, lon: 98.91, dates: [], photos: [] },
    bangkok: { name: '曼谷', country: 'Bangkok, Thailand', lat: 13.76, lon: 100.50, dates: [], photos: [] },
    bermuda: { name: '百慕大', country: 'Bermuda', lat: 32.31, lon: -64.75, dates: [], photos: [] },
    saipan: { name: '塞班岛', country: 'Saipan, USA', lat: 15.18, lon: 145.75, dates: [], photos: [] },
    langkawi: { name: '兰卡威', country: 'Langkawi, Malaysia', lat: 6.35, lon: 99.80, dates: [], photos: [] },
    santorini: { name: '圣托里尼', country: 'Santorini, Greece', lat: 36.39, lon: 25.46, dates: [], photos: [] },
    maldives: { name: '马尔代夫', country: 'Maldives', lat: 3.20, lon: 73.22, dates: [], photos: [] },
    mauritius: { name: '毛里求斯', country: 'Mauritius', lat: -20.16, lon: 57.50, dates: [], photos: [] },
    seychelles: { name: '塞舌尔', country: 'Seychelles', lat: -4.68, lon: 55.49, dates: [], photos: [] },
    // 美国城市
    newyork: { name: '纽约', country: 'New York, USA', lat: 40.71, lon: -74.01, dates: [], photos: [] },
    sanfrancisco: { name: '旧金山', country: 'San Francisco, USA', lat: 37.77, lon: -122.42, dates: [], photos: [] },
    chicago: { name: '芝加哥', country: 'Chicago, USA', lat: 41.88, lon: -87.63, dates: [], photos: [] },
    orlando: { name: '奥兰多', country: 'Orlando, USA', lat: 28.54, lon: -81.38, dates: [], photos: [] },
    // 新增确认城市
    bath: { name: '巴斯', country: 'Bath, UK', lat: 51.38, lon: -2.36, dates: [], photos: [] },
    rome: { name: '罗马', country: 'Rome, Italy', lat: 41.90, lon: 12.50, dates: [], photos: [] },
    milan: { name: '米兰', country: 'Milan, Italy', lat: 45.46, lon: 9.19, dates: [], photos: [] },
    florence: { name: '佛罗伦萨', country: 'Florence, Italy', lat: 43.77, lon: 11.25, dates: [], photos: [] },
    venice: { name: '威尼斯', country: 'Venice, Italy', lat: 45.44, lon: 12.32, dates: [], photos: [] },
    okinawa: { name: '冲绳', country: 'Okinawa, Japan', lat: 26.34, lon: 127.80, dates: [], photos: [] },
    jeju: { name: '济州岛', country: 'Jeju, Korea', lat: 33.49, lon: 126.53, dates: [], photos: [] },
    kualalumpur: { name: '吉隆坡', country: 'Kuala Lumpur, Malaysia', lat: 3.14, lon: 101.69, dates: [], photos: [] },
    malacca: { name: '马六甲', country: 'Malacca, Malaysia', lat: 2.19, lon: 102.25, dates: [], photos: [] },
    athens: { name: '雅典', country: 'Athens, Greece', lat: 37.98, lon: 23.73, dates: [], photos: [] },
    amsterdam: { name: '阿姆斯特丹', country: 'Amsterdam, Netherlands', lat: 52.37, lon: 4.90, dates: [], photos: [] },
    abudhabi: { name: '阿布扎比', country: 'Abu Dhabi, UAE', lat: 24.45, lon: 54.38, dates: [], photos: [] },
    // 新增确认城市
    casablanca: { name: '卡萨布兰卡', country: 'Casablanca, Morocco', lat: 33.57, lon: -7.59, dates: [], photos: [] },
    belgrade: { name: '贝尔格莱德', country: 'Belgrade, Serbia', lat: 44.79, lon: 20.46, dates: [], photos: [] },
    kotor: { name: '科托尔', country: 'Kotor, Montenegro', lat: 42.42, lon: 18.77, dates: [], photos: [] },
    panamacity: { name: '巴拿马城', country: 'Panama City, Panama', lat: 8.98, lon: -79.52, dates: [], photos: [] }
};

// 经纬度转SVG坐标 (equirectangular projection, 1000x500 viewBox)
function lonLatToXY(lon, lat) {
    const x = (lon + 180) / 360 * 1000;
    const y = (90 - lat) / 180 * 500;
    return { x, y };
}

// GeoJSON坐标转SVG路径
function geojsonToSVGPath(coordinates) {
    if (!coordinates || coordinates.length === 0) return '';
    
    function ringToPath(ring) {
        return ring.map((coord, i) => {
            const { x, y } = lonLatToXY(coord[0], coord[1]);
            return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' ') + ' Z';
    }
    
    // Polygon
    if (Array.isArray(coordinates[0]) && !Array.isArray(coordinates[0][0])) {
        return ringToPath(coordinates);
    }
    
    // MultiPolygon or Polygon with holes
    return coordinates.map(ring => ringToPath(ring)).join(' ');
}

// 加载并渲染世界地图
let countryPaths = {}; // 存储国家路径引用

async function loadWorldMap() {
    try {
        const response = await fetch('data/world.json');
        const geojson = await response.json();
        
        const continentsGroup = document.getElementById('continentsGroup');
        
        geojson.features.forEach(feature => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const countryName = feature.properties.name;
            
            if (feature.geometry.type === 'Polygon') {
                path.setAttribute('d', geojsonToSVGPath(feature.geometry.coordinates));
            } else if (feature.geometry.type === 'MultiPolygon') {
                const d = feature.geometry.coordinates.map(polygon => 
                    geojsonToSVGPath(polygon)
                ).join(' ');
                path.setAttribute('d', d);
            }
            
            path.setAttribute('fill', '#131a3e');
            path.setAttribute('stroke', '#1e2a5a');
            path.setAttribute('stroke-width', '0.5');
            path.setAttribute('data-country', countryName);
            path.style.transition = 'fill 0.5s ease, filter 0.5s ease';
            
            // 存储国家路径引用
            if (!countryPaths[countryName]) {
                countryPaths[countryName] = [];
            }
            countryPaths[countryName].push(path);
            
            continentsGroup.appendChild(path);
        });
        
        // 地图加载完成后渲染城市
        renderCities();
    } catch (error) {
        console.error('Failed to load world map:', error);
        renderFallbackMap();
    }
}

// 备用地图（如果GeoJSON加载失败）
function renderFallbackMap() {
    const continentsGroup = document.getElementById('continentsGroup');
    const fallbackPaths = [
        'M78,95 L95,78 L125,62 L165,52 L205,48 L245,55 L275,68 L295,85 L305,105 L300,130 L285,155 L265,175 L240,190 L215,195 L195,188 L175,195 L155,200 L135,195 L115,180 L95,155 L82,125 Z',
        'M210,235 L235,225 L258,235 L272,260 L278,295 L275,335 L265,370 L248,395 L228,400 L210,385 L198,355 L190,315 L188,275 L195,250 Z',
        'M445,68 L468,58 L492,62 L508,72 L518,88 L512,108 L498,118 L478,122 L458,118 L442,108 L435,92 Z',
        'M438,155 L468,145 L505,148 L542,162 L562,185 L568,215 L565,255 L558,295 L545,332 L525,365 L502,382 L478,378 L455,358 L438,325 L428,285 L422,245 L425,205 L430,175 Z',
        'M568,72 L615,58 L668,50 L725,52 L782,62 L828,78 L862,98 L878,125 L875,155 L858,178 L832,192 L805,195 L778,190 L752,195 L725,200 L698,195 L672,185 L645,172 L618,155 L592,135 L572,115 L562,95 Z',
        'M772,305 L818,295 L862,305 L888,325 L892,355 L878,382 L848,395 L812,392 L782,375 L768,348 Z'
    ];
    
    fallbackPaths.forEach(d => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill', '#131a3e');
        path.setAttribute('stroke', '#1e2a5a');
        path.setAttribute('stroke-width', '0.5');
        continentsGroup.appendChild(path);
    });
    
    renderCities();
}

// 渲染城市标记（国家默认亮起 + 悬停显示城市浮窗）
function renderCities() {
    const litCountries = new Set();
    
    // 收集所有需要点亮的国家
    Object.values(cityToCountry).forEach(countryName => {
        litCountries.add(countryName);
    });
    
    // 默认点亮所有国家
    litCountries.forEach(countryName => {
        const paths = document.querySelectorAll(`path[data-country="${countryName}"]`);
        paths.forEach(path => {
            path.setAttribute('fill', '#f59e0b');
            path.setAttribute('filter', 'url(#glow)');
            path.style.cursor = 'pointer';
            
            // 悬停显示城市信息浮窗
            path.addEventListener('mouseenter', (e) => showCityTooltip(countryName, e));
            path.addEventListener('mouseleave', hideCityTooltip);
        });
    });
}

// 显示城市信息浮窗
function showCityTooltip(countryName, event) {
    // 找到该国家的所有城市
    const cities = Object.entries(cityData)
        .filter(([key, city]) => cityToCountry[key] === countryName)
        .map(([key, city]) => ({
            name: city.name,
            dates: city.dates.length > 0 ? city.dates.join(', ') : '待补充'
        }));
    
    if (cities.length === 0) return;
    
    // 创建或更新浮窗
    let tooltip = document.getElementById('countryTooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'countryTooltip';
        tooltip.className = 'country-tooltip';
        document.body.appendChild(tooltip);
    }
    
    // 填充内容
    tooltip.innerHTML = `
        <div class="tooltip-country-name">${countryName}</div>
        <div class="tooltip-cities">
            ${cities.map(city => `
                <div class="tooltip-city-item">
                    <span class="tooltip-city-name">${city.name}</span>
                    <span class="tooltip-city-date">${city.dates}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    // 定位浮窗
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = (rect.left + rect.width / 2) + 'px';
    tooltip.style.top = (rect.top - 10) + 'px';
    tooltip.style.transform = 'translate(-50%, -100%)';
    tooltip.classList.add('active');
}

// 隐藏城市信息浮窗
function hideCityTooltip() {
    const tooltip = document.getElementById('countryTooltip');
    if (tooltip) {
        tooltip.classList.remove('active');
    }
}

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

// 加载世界地图
loadWorldMap();
