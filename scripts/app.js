/**
 * یادگاری خاطرات ما - نسخه 1.0
 * تمام تعاملات و منطق صفحه
 */

// ============================================
// 1. مدیریت کارت‌های خاطرات (باز/بسته شدن)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.memory-card');
    
    cards.forEach(card => {
        const preview = card.querySelector('.card-preview');
        const full = card.querySelector('.card-full');
        let isOpen = false;
        
        card.addEventListener('click', function(e) {
            // اگر روی دکمه‌ی ستاره کلیک شده، کارت باز نشه
            if (e.target.classList.contains('star-btn')) return;
            
            isOpen = !isOpen;
            
            if (isOpen) {
                full.classList.remove('hidden');
                preview.style.display = 'none';
                card.style.transform = 'scale(1.03)';
            } else {
                full.classList.add('hidden');
                preview.style.display = 'block';
                card.style.transform = 'scale(1)';
            }
        });
    });
});

// ============================================
// 2. سیستم ستاره‌دار کردن (ذخیره در LocalStorage)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const starBtns = document.querySelectorAll('.star-btn');
    let starredMemories = JSON.parse(localStorage.getItem('starredMemories')) || [];
    
    // آپدیت وضعیت ستاره‌ها از localStorage
    function updateStarStates() {
        starBtns.forEach(btn => {
            const card = btn.closest('.memory-card');
            const id = card.dataset.id;
            
            if (starredMemories.includes(id)) {
                btn.textContent = '★';
                btn.classList.add('starred');
            } else {
                btn.textContent = '☆';
                btn.classList.remove('starred');
            }
        });
    }
    
    updateStarStates();
    
    starBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // جلوگیری از باز شدن کارت
            const card = this.closest('.memory-card');
            const id = card.dataset.id;
            
            const index = starredMemories.indexOf(id);
            
            if (index === -1) {
                // اضافه کردن به لیست
                starredMemories.push(id);
                this.textContent = '★';
                this.classList.add('starred');
            } else {
                // حذف از لیست
                starredMemories.splice(index, 1);
                this.textContent = '☆';
                this.classList.remove('starred');
            }
            
            // ذخیره در localStorage
            localStorage.setItem('starredMemories', JSON.stringify(starredMemories));
            
            // افکت جرقه (Easter Egg)
            createSparkles(e);
        });
    });
});

// ============================================
// 3. چرخش نقل‌قول‌ها (هر ۵ ثانیه)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const quotes = document.querySelectorAll('.quote-item');
    let currentQuote = 0;
    
    function showQuote(index) {
        quotes.forEach((q, i) => {
            q.classList.remove('active');
            if (i === index) {
                q.classList.add('active');
            }
        });
    }
    
    // نمایش اولین نقل‌قول
    showQuote(0);
    
    // چرخش خودکار
    setInterval(() => {
        currentQuote = (currentQuote + 1) % quotes.length;
        showQuote(currentQuote);
    }, 5000);
});

// ============================================
// 4. دکمه‌ی بازگشت به بالا
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// ============================================
// 5. تاریخ آخرین بازدید
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const lastVisitSpan = document.getElementById('lastVisit');
    const lastVisit = localStorage.getItem('lastVisit');
    const now = new Date();
    
    // فرمت تاریخ به فارسی
    const persianDate = now.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    if (lastVisit) {
        lastVisitSpan.textContent = lastVisit;
    } else {
        lastVisitSpan.textContent = 'اولین بازدید شما 🌸';
    }
    
    // ذخیره تاریخ امروز برای بازدید بعدی
    localStorage.setItem('lastVisit', persianDate);
});

// ============================================
// 6. تم روز/شب
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // بررسی تم ذخیره شده
    let currentTheme = localStorage.getItem('theme') || 'light';
    applyTheme(currentTheme);
    
    // دکمه‌ی تغییر تم (با کلیک روی کلید T)
    document.addEventListener('keydown', function(e) {
        // اگر کلید T فشار داده شد و در input نبودیم
        if (e.key === 't' || e.key === 'T') {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                toggleTheme();
            }
        }
    });
    
    // دکمه‌ی تغییر تم با دابل کلیک روی عنوان
    const title = document.querySelector('.main-title');
    if (title) {
        title.addEventListener('dblclick', function() {
            toggleTheme();
        });
    }
});

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

// ============================================
// 7. دکمه‌ی موسیقی (آیکون تغییر می‌کند)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const musicBtn = document.querySelector('.music-toggle');
    let isPlaying = false;
    
    musicBtn.addEventListener('click', function() {
        isPlaying = !isPlaying;
        
        if (isPlaying) {
            this.textContent = '🔊';
            this.style.borderColor = 'var(--accent-teal)';
            // در نسخه‌های واقعی می‌تونید موسیقی رو پلی کنید
            // audioElement.play();
        } else {
            this.textContent = '🎵';
            this.style.borderColor = 'var(--border-color)';
            // audioElement.pause();
        }
    });
});

// ============================================
// 8. Easter Egg: افکت جرقه (Sparkle)
// ============================================
function createSparkles(e) {
    // دریافت موقعیت کلیک
    const x = e.clientX || e.pageX;
    const y = e.clientY || e.pageY;
    
    // ایجاد ۱۰ جرقه
    for (let i = 0; i < 10; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        // موقعیت تصادفی حول نقطه‌ی کلیک
        const offsetX = (Math.random() - 0.5) * 100;
        const offsetY = (Math.random() - 0.5) * 100;
        const size = Math.random() * 6 + 4;
        
        sparkle.style.left = (x + offsetX) + 'px';
        sparkle.style.top = (y + offsetY) + 'px';
        sparkle.style.width = size + 'px';
        sparkle.style.height = size + 'px';
        
        // رنگ‌های متفاوت
        const colors = ['#f7b731', '#ff6b6b', '#6B9BB0', '#B76E79', '#ffd93d'];
        sparkle.style.background = `radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]}, transparent)`;
        
        document.body.appendChild(sparkle);
        
        // حذف بعد از ۱ ثانیه
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
}

// ============================================
// 9. مشاهده‌ی کارت‌های ستاره‌دار (در کنسول)
// ============================================
console.log('🌟 یادگاری خاطرات ما - نسخه 1.0');
console.log('📌 برای مشاهده‌ی خاطرات ستاره‌دار، تایپ کنید: showStarred()');

// تابع کمکی برای نمایش خاطرات ستاره‌دار در کنسول
window.showStarred = function() {
    const starred = JSON.parse(localStorage.getItem('starredMemories')) || [];
    const cards = document.querySelectorAll('.memory-card');
    const results = [];
    
    cards.forEach(card => {
        const id = card.dataset.id;
        if (starred.includes(id)) {
            const title = card.querySelector('h3')?.textContent || 'بدون عنوان';
            results.push(`📌 ${title} (ID: ${id})`);
        }
    });
    
    if (results.length === 0) {
        console.log('💫 هنوز هیچ خاطره‌ای ستاره‌دار نشده.');
    } else {
        console.log('🌟 خاطرات ستاره‌دار:');
        results.forEach(r => console.log(r));
    }
};

// ============================================
// 10. نمایش پیام خوش‌آمدگویی در کنسول
// ============================================
console.log('🌸 برای رومیصا، از کسی که همیشه یادت می‌کنه');
console.log('💝 ساخته شده با احترام و خاطرات خوب - زمستان ۱۴۰۳');

// ============================================
// 11. جلوگیری از کلیک راست (اختیاری)
// ============================================
// اگر می‌خواهید از کلیک راست جلوگیری کنید، کامنت زیر رو بردارید:
/*
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    alert('🌹 این صفحه با عشق ساخته شده!');
});
*/

// ============================================
// 12. انیمیشن اسکرول نرم (اختیاری)
// ============================================
// تمام لینک‌های داخلی (مثل #section) رو نرم اسکرول می‌کنه
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

console.log('✅ همه‌چیز آماده‌ست! نوش جان ❤️');
