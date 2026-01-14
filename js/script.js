// ===== P5R STYLE - 动态转场系统 =====

// 开场动画序列
function playIntroSequence() {
    const intro = document.getElementById('introSequence');
    const frames = intro.querySelectorAll('.intro-frame');

    // 检测是否为移动端
    const isMobile = window.innerWidth <= 768;

    // 移动端使用更快的动画
    const frameDelay = isMobile ? 400 : 1000;
    const lastFrameDelay = isMobile ? 600 : 1200;
    const fadeOutDelay = isMobile ? 200 : 500;

    let delay = 0;
    frames.forEach((frame, index) => {
        setTimeout(() => {
            frame.classList.add('active');
        }, delay);
        delay += (index === 2) ? lastFrameDelay : frameDelay;
    });

    setTimeout(() => {
        intro.classList.add('hidden');
        setTimeout(() => {
            intro.style.display = 'none';
        }, fadeOutDelay);
    }, delay + fadeOutDelay);
}

// 页面加载完成后播放开场动画
window.addEventListener('load', () => {
    // 立即激活首页，避免黑屏
    document.getElementById('section-home').classList.add('active');

    // 播放开场动画
    playIntroSequence();
});

// ===== P5R 风格转场系统 =====

// 可用的转场效果类型
const transitionTypes = ['vertical-slices', 'explosion', 'diagonal', 'stars', 'radial'];

// 转场系统
function pageTransition(targetSection) {
    const overlay = document.getElementById('transitionOverlay');
    const currentSection = document.querySelector('.page-section.active');
    const targetElement = document.querySelector(`#section-${targetSection}`);

    if (!targetElement) return;

    // 随机选择一种转场效果
    const randomType = transitionTypes[Math.floor(Math.random() * transitionTypes.length)];

    // 开始转场
    overlay.classList.add('active');
    overlay.classList.add(`transition-${randomType}`);

    // 转场文字效果
    const transitionText = overlay.querySelector('.transition-text');
    const textPhrases = ['PHANTOM', 'STEAL', 'AWAKENING', 'REBELLION', 'SHOWTIME'];
    transitionText.textContent = textPhrases[Math.floor(Math.random() * textPhrases.length)];
    transitionText.classList.add('active');

    // 计算目标位置
    const targetPosition = targetElement.offsetTop;

    // 根据不同的转场效果调整内容切换时机
    const switchTiming = {
        'vertical-slices': 400,
        'explosion': 300,
        'diagonal': 500,
        'stars': 450,
        'radial': 350
    };

    const totalTiming = {
        'vertical-slices': 1000,
        'explosion': 900,
        'diagonal': 1100,
        'stars': 1200,
        'radial': 950
    };

    // 转场中切换内容
    setTimeout(() => {
        if (currentSection) {
            currentSection.classList.remove('active');
        }
        targetElement.classList.add('active');

        // 同时滚动到目标位置
        window.scrollTo({
            top: targetPosition,
            behavior: 'instant'
        });
    }, switchTiming[randomType]);

    // 结束转场
    setTimeout(() => {
        overlay.classList.add('out');
        transitionText.classList.remove('active');

        setTimeout(() => {
            overlay.classList.remove('active', 'out');
            overlay.classList.remove(`transition-${randomType}`);
        }, 300);
    }, totalTiming[randomType]);
}

// 按钮点击处理
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const href = btn.getAttribute('data-href');
        if (href) {
            const section = href.replace('#', '');
            pageTransition(section);

            // 更新导航状态
            document.querySelectorAll('.nav-link').forEach(l => {
                l.classList.remove('active');
                if (l.getAttribute('data-section') === section) {
                    l.classList.add('active');
                }
            });
        }
    });
});

// 导航栏滚动效果
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// 滚动显示动画
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// 观察需要动画的元素
document.querySelectorAll('.timeline-item, .stat-card, .skill-panel, .info-item').forEach(el => {
    scrollObserver.observe(el);
});

// 技能条动画
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillFills = entry.target.querySelectorAll('.skill-fill');
            skillFills.forEach((fill, index) => {
                setTimeout(() => {
                    const width = fill.getAttribute('data-width');
                    fill.style.width = `${width}%`;
                }, index * 100);
            });
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const skillsSection = document.getElementById('section-skills');
if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// 统计数字动画
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statCards = entry.target.querySelectorAll('.stat-card');
            statCards.forEach((card, index) => {
                setTimeout(() => {
                    const valueEl = card.querySelector('.stat-value');
                    const finalValue = valueEl.textContent;
                    const numericValue = parseInt(finalValue);

                    if (!isNaN(numericValue)) {
                        animateValue(valueEl, 0, numericValue, 1500, finalValue);
                    }
                }, index * 200);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutSection = document.getElementById('section-about');
if (aboutSection) {
    statsObserver.observe(aboutSection);
}

function animateValue(element, start, end, duration, suffix) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = suffix;
            clearInterval(timer);
        } else {
            const displayValue = Math.floor(current);
            const displaySuffix = suffix.includes('+') ? '+' : suffix.includes('%') ? '%' : '';
            element.textContent = displayValue + displaySuffix;
        }
    }, 16);
}

// 时间轴动画
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.timeline-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('visible');
                }, index * 300);
            });
            timelineObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

const timelineContainer = document.querySelector('.timeline-container');
if (timelineContainer) {
    timelineObserver.observe(timelineContainer);
}

// 表单提交处理
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = this.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnArrow = submitBtn.querySelector('.btn-arrow');

        const originalText = btnText.textContent;
        btnText.textContent = '发送中...';
        btnArrow.style.display = 'none';
        submitBtn.disabled = true;

        setTimeout(() => {
            btnText.textContent = '发送成功！';
            submitBtn.style.background = '#10B981';

            // 添加成功动画
            submitBtn.style.animation = 'successPulse 0.5s ease';

            setTimeout(() => {
                btnText.textContent = originalText;
                btnArrow.style.display = 'inline';
                submitBtn.style.background = '';
                submitBtn.style.animation = '';
                submitBtn.disabled = false;
                this.reset();
            }, 2000);
        }, 1500);
    });
}

// 添加成功动画样式
const successStyle = document.createElement('style');
successStyle.textContent = `
    @keyframes successPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(successStyle);

// 视差效果
const parallaxElements = document.querySelectorAll('.visual-frame');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    parallaxElements.forEach(el => {
        const speed = 0.1;
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px) rotate(-5deg)`;
    });
});

// 鼠标移动效果 - Hero 卡片 3D 效果
const heroCard = document.querySelector('.avatar-card');
if (heroCard) {
    heroCard.addEventListener('mousemove', (e) => {
        const rect = heroCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;

        heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    heroCard.addEventListener('mouseleave', () => {
        heroCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
}

// 技能面板 3D 效果
document.querySelectorAll('.skill-panel').forEach(panel => {
    panel.addEventListener('mousemove', (e) => {
        const rect = panel.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / 25;
        const y = (e.clientY - rect.top - rect.height / 2) / 25;

        panel.style.transform = `translateY(-5px) perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });

    panel.addEventListener('mouseleave', () => {
        panel.style.transform = '';
    });
});

// 统计卡片 3D 效果
document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / 20;
        const y = (e.clientY - rect.top - rect.height / 2) / 20;

        card.style.transform = `translateY(-5px) scale(1.02) perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// 联系信息项滑入效果
document.querySelectorAll('.info-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateX(10px) scale(1.02)';
    });

    item.addEventListener('mouseleave', () => {
        item.style.transform = '';
    });
});

// 按钮涟漪效果
document.querySelectorAll('.action-btn, .submit-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
        `;

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// 添加涟漪动画
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// 时间轴标记旋转动画
document.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        const marker = item.querySelector('.item-marker');
        marker.style.transform = 'rotate(225deg) scale(1.2)';
    });

    item.addEventListener('mouseleave', () => {
        const marker = item.querySelector('.item-marker');
        marker.style.transform = 'rotate(45deg)';
    });
});

// 页面可见性检测（性能优化）
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.classList.add('page-hidden');
    } else {
        document.body.classList.remove('page-hidden');
    }
});

// 添加故障效果到标题
const heroTitle = document.querySelector('.title-name');
if (heroTitle) {
    setInterval(() => {
        if (Math.random() > 0.95) {
            heroTitle.style.animation = 'none';
            heroTitle.offsetHeight; // 触发重排
            heroTitle.style.animation = 'glitch 0.3s';
            setTimeout(() => {
                heroTitle.style.animation = '';
            }, 300);
        }
    }, 2000);
}

// 键盘导航
document.addEventListener('keydown', (e) => {
    const currentSection = document.querySelector('.page-section.active');
    const sections = ['home', 'about', 'experience', 'skills', 'contact'];
    let currentIndex = sections.findIndex(s => s === currentSection?.id.replace('section-', ''));

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = Math.min(currentIndex + 1, sections.length - 1);
        pageTransition(sections[nextIndex]);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = Math.max(currentIndex - 1, 0);
        pageTransition(sections[prevIndex]);
    } else if (e.key === ' ') {
        // 空格键触发随机转场效果（同页面）
        e.preventDefault();
        const currentId = currentSection?.id.replace('section-', '') || 'home';
        pageTransition(currentId);
    }
});

// 添加滚动提示消失
const scrollPrompt = document.querySelector('.scroll-prompt');
if (scrollPrompt) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            scrollPrompt.style.opacity = '0';
        } else {
            scrollPrompt.style.opacity = '1';
        }
    });
}

// 控制台彩蛋
console.log('%c██████╗░██╗░░░██╗███╗░░██╗░█████╗░░█████╗░░██████╗', 'color: #E63946; font-size: 12px; font-family: monospace;');
console.log('%c██╔══██╗██║░░░██║████╗░██║██╔══██╗██╔══██╗██╔════╝', 'color: #E63946; font-size: 12px; font-family: monospace;');
console.log('%c██████╔╝██║░░░██║██╔██╗██║██║░░╚═╝██║░░██║╚█████╗░', 'color: #E63946; font-size: 12px; font-family: monospace;');
console.log('%c██╔══██╗██║░░░██║██║╚██║██║██║░░██╗██║░░██║░╚═══██╗', 'color: #E63946; font-size: 12px; font-family: monospace;');
console.log('%c██║░░██║╚██████╔╝██║░╚████║╚█████╔╝██████╔╝██████╔╝', 'color: #E63946; font-size: 12px; font-family: monospace;');
console.log('%c╚═╝░░╚═╝░╚═════╝░╚═╝░░╚═══╝░╚════╝░╚═════╝░╚═════╝░', 'color: #E63946; font-size: 12px; font-family: monospace;');
console.log('%c\nTAKE YOUR HEART', 'color: #E63946; font-size: 20px; font-weight: bold; font-family: Bebas Neue;');
console.log('%c使用方向键或点击导航切换页面', 'color: #666; font-size: 12px;');
console.log('%c按空格键触发随机转场效果', 'color: #FF1744; font-size: 12px;');

// ===== 额外的 P5R 风格动态效果 =====

// 随机闪光效果
function randomFlash() {
    const flash = document.createElement('div');
    flash.className = 'random-flash';
    flash.style.cssText = `
        position: fixed;
        top: ${Math.random() * 100}vh;
        left: ${Math.random() * 100}vw;
        width: ${50 + Math.random() * 100}px;
        height: 2px;
        background: linear-gradient(90deg, transparent, #FF1744, transparent);
        transform: rotate(${Math.random() * 360}deg);
        animation: flashLine 0.3s ease-out forwards;
        pointer-events: none;
        z-index: 9999;
    `;

    const flashStyle = document.createElement('style');
    flashStyle.textContent = `
        @keyframes flashLine {
            0% { opacity: 0; transform: scaleX(0) rotate(${flash.style.transform}; }
            50% { opacity: 1; }
            100% { opacity: 0; transform: scaleX(2) rotate(${flash.style.transform}; }
        }
    `;
    document.head.appendChild(flashStyle);
    document.body.appendChild(flash);
    setTimeout(() => {
        flash.remove();
        flashStyle.remove();
    }, 300);
}

// 偶尔触发随机闪光
setInterval(() => {
    if (Math.random() > 0.7 && !document.hidden) {
        randomFlash();
    }
}, 3000);

// ===== P5R 交互特效系统 =====

// 点击爆破特效
function createP5RBurstEffect(element) {
    const rect = element.getBoundingClientRect();
    const burst = document.createElement('div');
    burst.className = 'p5r-burst';
    burst.style.left = `${rect.left + rect.width / 2 - 50}px`;
    burst.style.top = `${rect.top + rect.height / 2 - 50}px`;
    document.body.appendChild(burst);

    setTimeout(() => burst.remove(), 500);
}

// 红色闪屏效果
function createP5RFlashEffect() {
    const flash = document.createElement('div');
    flash.className = 'p5r-flash-overlay';
    document.body.appendChild(flash);

    setTimeout(() => flash.classList.add('active'), 10);
    setTimeout(() => {
        flash.classList.remove('active');
        setTimeout(() => flash.remove(), 100);
    }, 100);
}

// 为所有 P5R 交互元素添加点击爆破效果
document.addEventListener('DOMContentLoaded', () => {
    const interactiveElements = document.querySelectorAll('.p5r-interactive, .action-btn, .submit-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('click', function(e) {
            createP5RBurstEffect(this);
        });
    });
});

// 保存原始 pageTransition 函数并添加 P5R 效果
const originalPageTransitionBase = pageTransition;
pageTransition = function(targetSection) {
    // 屏幕震动效果
    document.body.style.animation = 'screenShake 0.1s ease-in-out';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 100);

    // 添加震动动画样式
    if (!document.getElementById('shakeStyle')) {
        const shakeStyle = document.createElement('style');
        shakeStyle.id = 'shakeStyle';
        shakeStyle.textContent = `
            @keyframes screenShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-2px); }
                75% { transform: translateX(2px); }
            }
        `;
        document.head.appendChild(shakeStyle);
    }

    // 红色闪屏效果
    createP5RFlashEffect();

    // 调用原始转场函数
    originalPageTransitionBase(targetSection);
};

// 导航更新效果
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const section = this.getAttribute('data-section');

        // 更新导航状态
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        pageTransition(section);

        // 移动端：关闭菜单
        const hamburger = document.querySelector('.nav-hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
        }
    });
});

// 汉堡菜单切换
const hamburger = document.querySelector('.nav-hamburger');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        document.querySelector('.nav-menu').classList.toggle('open');
    });
}

// 控制台彩蛋
console.log('%c██████╗░██╗░░░██╗███╗░░██╗░█████╗░░█████╗░░██████╗', 'color: #D92B2B; font-size: 12px; font-family: monospace;');
console.log('%c██╔══██╗██║░░░██║████╗░██║██╔══██╗██╔══██╗██╔════╝', 'color: #D92B2B; font-size: 12px; font-family: monospace;');
console.log('%c██████╔╝██║░░░██║██╔██╗██║██║░░╚═╝██║░░██║╚█████╗░', 'color: #D92B2B; font-size: 12px; font-family: monospace;');
console.log('%c██╔══██╗██║░░░██║██║╚██║██║██║░░██╗██║░░██║░╚═══██╗', 'color: #D92B2B; font-size: 12px; font-family: monospace;');
console.log('%c██║░░██║╚██████╔╝██║░╚████║╚█████╔╝██████╔╝██████╔╝', 'color: #D92B2B; font-size: 12px; font-family: monospace;');
console.log('%c╚═╝░░╚═╝░╚═════╝░╚═╝░░╚═══╝░╚════╝░╚═════╝░╚═════╝░', 'color: #D92B2B; font-size: 12px; font-family: monospace;');
console.log('%c\\nTAKE YOUR HEART', 'color: #D92B2B; font-size: 20px; font-weight: bold; font-family: Bebas Neue;');
console.log('%c欢迎来到怪盗档案 | 使用方向键或点击导航切换页面', 'color: #F2C94C; font-size: 12px;');
