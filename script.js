// ========================================
// 导航菜单功能
// ========================================

// 平滑滚动
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // 关闭移动菜单（如果打开）
            navMenu.classList.remove('active');
            
            // 滚动到目标
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 移动端菜单切换
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
}

// 点击页面其他地方关闭菜单
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container') && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    }
});

// ========================================
// 视频播放控制
// ========================================

const videos = document.querySelectorAll('video');

// 视频懒加载
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const video = entry.target;
            video.preload = 'metadata';
        }
    });
}, {
    rootMargin: '100px'
});

videos.forEach(video => {
    videoObserver.observe(video);
    
    // 自动暂停其他视频
    video.addEventListener('play', function() {
        videos.forEach(v => {
            if (v !== video && !v.paused) {
                v.pause();
            }
        });
        
        // 隐藏播放按钮
        const overlay = this.parentElement.querySelector('.video-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
        }
    });
    
    // 视频暂停时显示播放按钮
    video.addEventListener('pause', function() {
        const overlay = this.parentElement.querySelector('.video-overlay');
        if (overlay && !this.ended) {
            overlay.style.opacity = '1';
        }
    });
    
    // 视频结束时显示播放按钮
    video.addEventListener('ended', function() {
        const overlay = this.parentElement.querySelector('.video-overlay');
        if (overlay) {
            overlay.style.opacity = '1';
        }
    });
});

// 自定义播放按钮点击事件
document.querySelectorAll('.play-button').forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        const video = this.closest('.video-wrapper').querySelector('video');
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });
});

// ========================================
// 导航高亮
// ========================================

const sections = document.querySelectorAll('.category-section');
const navLinks = document.querySelectorAll('.nav-link');

const highlightNav = () => {
    let currentSection = '';
    const scrollPosition = window.pageYOffset + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
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

// 滚动事件优化（使用节流）
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = window.requestAnimationFrame(() => {
        highlightNav();
    });
});

// 初始化高亮
highlightNav();

// ========================================
// 视频overlay交互
// ========================================

document.querySelectorAll('.video-wrapper').forEach(wrapper => {
    const video = wrapper.querySelector('video');
    const overlay = wrapper.querySelector('.video-overlay');
    
    if (video && overlay) {
        // 点击video区域播放
        wrapper.addEventListener('click', function(e) {
            if (e.target !== overlay && !e.target.closest('.play-button')) {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        });
    }
});

// ========================================
// 页面加载动画
// ========================================

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ========================================
// 视频错误处理
// ========================================

videos.forEach(video => {
    video.addEventListener('error', function(e) {
        console.error('视频加载错误:', this.src);
        
        // 在控制台显示详细错误
        if (this.error) {
            console.error('错误代码:', this.error.code);
            console.error('错误信息:', this.error.message);
        }
        
        // 可选：显示错误提示给用户
        const wrapper = this.closest('.video-wrapper');
        if (wrapper && !wrapper.querySelector('.error-message')) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #ff4444;
                text-align: center;
                padding: 1rem;
                background: rgba(0,0,0,0.8);
                border-radius: 8px;
                z-index: 10;
            `;
            errorDiv.innerHTML = `
                <p>⚠️ 视频加载失败</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.7;">请检查网络连接或稍后重试</p>
            `;
            wrapper.appendChild(errorDiv);
        }
    });
});

// ========================================
// 性能优化：视频预览图
// ========================================

// 为没有poster的视频生成预览图
videos.forEach(video => {
    if (!video.hasAttribute('poster')) {
        video.addEventListener('loadeddata', function() {
            // 视频加载后自动暂停在第一帧
            this.currentTime = 0.1;
        }, { once: true });
    }
});

// ========================================
// 键盘快捷键支持
// ========================================

document.addEventListener('keydown', (e) => {
    // 空格键播放/暂停当前视口中的视频
    if (e.code === 'Space' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        
        // 找到当前视口中的视频
        videos.forEach(video => {
            const rect = video.getBoundingClientRect();
            const isInViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;
            
            if (isInViewport) {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        });
    }
});

// ========================================
// 调试信息（开发时使用）
// ========================================

console.log('🎨 数字艺术作品集网站已加载');
console.log('📹 视频总数:', videos.length);
console.log('📱 设备类型:', window.innerWidth <= 768 ? '移动端' : '桌面端');

// 检查所有视频文件是否可访问
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    videos.forEach((video, index) => {
        const src = video.querySelector('source')?.src;
        if (src) {
            console.log(`视频 ${index + 1}:`, src);
        }
    });
}
