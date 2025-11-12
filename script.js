// 平滑滚动到指定区域
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 视频懒加载优化
const videos = document.querySelectorAll('video');
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const video = entry.target;
            // 视频进入视口时预加载
            video.preload = 'metadata';
        }
    });
}, {
    rootMargin: '50px'
});

videos.forEach(video => {
    videoObserver.observe(video);
    
    // 暂停其他视频当一个视频开始播放
    video.addEventListener('play', function() {
        videos.forEach(v => {
            if (v !== video && !v.paused) {
                v.pause();
            }
        });
    });
});

// 导航栏高亮当前区域
const sections = document.querySelectorAll('.category-section');
const navLinks = document.querySelectorAll('.nav-link');

const highlightNav = () => {
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
};

// 监听滚动事件
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(highlightNav, 50);
});

// 添加活动链接样式
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--secondary-color);
    }
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// 页面加载完成后的动画
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// 响应式菜单（针对移动端）
const createMobileMenu = () => {
    if (window.innerWidth <= 768) {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && !document.querySelector('.menu-toggle')) {
            const menuToggle = document.createElement('button');
            menuToggle.className = 'menu-toggle';
            menuToggle.innerHTML = '☰';
            menuToggle.style.cssText = `
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                display: none;
            `;
            
            const navContainer = document.querySelector('.nav-container');
            navContainer.insertBefore(menuToggle, navMenu);
            
            menuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
            
            // 点击导航链接后关闭菜单
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                });
            });
        }
    }
};

// 窗口大小改变时检查
window.addEventListener('resize', createMobileMenu);
createMobileMenu();

console.log('作品集网站已加载完成');
