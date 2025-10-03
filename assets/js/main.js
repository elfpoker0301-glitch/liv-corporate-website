// ===== DOM要素の取得 =====
const navbar = document.getElementById('header');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.querySelector('.contact-form');

// ===== ナビゲーション関連 =====
// ハンバーガーメニューの切り替え
function toggleMobileMenu() {
    navMenu.classList.toggle('show');
    navToggle.classList.toggle('active');
    document.body.classList.toggle('menu-open');
}

// モバイルメニューを閉じる
function closeMobileMenu() {
    navMenu.classList.remove('show');
    navToggle.classList.remove('active');
    document.body.classList.remove('menu-open');
}

// ===== スクロール関連機能 =====
// スクロール時のヘッダー背景変更
function updateHeaderOnScroll() {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
}

// スムーススクロール機能
function smoothScrollTo(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80; // ヘッダーの高さを考慮
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// アクティブなナビゲーションリンクの更新
function updateActiveNavLink() {
    const scrollY = window.scrollY + 100;
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            // すべてのナビリンクからactiveクラスを削除
            navLinks.forEach(link => link.classList.remove('active'));
            
            // 対応するナビリンクにactiveクラスを追加
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// ===== アニメーション関連 =====
// 要素が画面に表示された時のフェードイン効果
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 観察する要素を選択
    const elementsToObserve = document.querySelectorAll(
        '.service-card, .team-card, .news-card, .value-item, .stat-item'
    );
    
    elementsToObserve.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
}

// 数字のカウントアップアニメーション
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                // data-target属性があればそれを使用、なければtextContentから取得
                const targetValue = counter.getAttribute('data-target') || counter.textContent;
                const target = parseInt(targetValue);
                
                if (isNaN(target)) return;
                
                let current = 0;
                const duration = 2000; // 2秒
                const increment = target / (duration / 16); // 60fps
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target + '+';
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// ===== フォーム処理 =====
// お問い合わせフォームの処理
function handleContactForm(event) {
    event.preventDefault();
    
    // フォームデータを取得
    const formData = new FormData(contactForm);
    const formObject = {};
    
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // バリデーション
    if (!validateForm(formObject)) {
        return;
    }
    
    // 送信ボタンを無効化
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = '送信中...';
    
    // 実際の送信処理をシミュレート（実際にはサーバーサイドの処理が必要）
    setTimeout(() => {
        showNotification('お問い合わせを受け付けました。ありがとうございます。', 'success');
        contactForm.reset();
        
        // ボタンを元に戻す
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }, 2000);
}

// フォームバリデーション
function validateForm(data) {
    const errors = [];
    
    // 必須項目のチェック
    if (!data.name || data.name.trim() === '') {
        errors.push('お名前は必須項目です。');
    }
    
    if (!data.email || data.email.trim() === '') {
        errors.push('メールアドレスは必須項目です。');
    } else if (!isValidEmail(data.email)) {
        errors.push('有効なメールアドレスを入力してください。');
    }
    
    if (!data.message || data.message.trim() === '') {
        errors.push('お問い合わせ内容は必須項目です。');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error');
        return false;
    }
    
    return true;
}

// メールアドレスの形式チェック
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== 通知機能 =====
function showNotification(message, type = 'info') {
    // 既存の通知を削除
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 通知要素を作成
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message.replace(/\n/g, '<br>')}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // 通知のスタイル
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: all 0.3s ease;
        ${type === 'success' ? 'background: #10b981; color: white;' : ''}
        ${type === 'error' ? 'background: #ef4444; color: white;' : ''}
        ${type === 'info' ? 'background: #3b82f6; color: white;' : ''}
    `;
    
    // 通知をページに追加
    document.body.appendChild(notification);
    
    // アニメーション
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // 閉じるボタンの処理
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: inherit;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: 1rem;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    `;
    
    closeButton.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // 5秒後に自動削除
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

function removeNotification(notification) {
    if (notification && notification.parentNode) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// ===== ユーティリティ関数 =====
// スロットル関数（パフォーマンス最適化）
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// デバウンス関数（パフォーマンス最適化）
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ページの先頭に戻るボタン
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.className = 'scroll-to-top';
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #006428 0%, #004d20 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(button);
    
    // スクロール位置に応じてボタンの表示/非表示
    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    }, 100));
}

// ===== イベントリスナーの設定 =====
function setupEventListeners() {
    // ハンバーガーメニューのクリック
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // ナビゲーションリンクのクリック
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            
            // ハッシュリンクの場合のみスムーススクロール
            if (href && href.startsWith('#')) {
                event.preventDefault();
                const targetId = href.substring(1);
                smoothScrollTo(targetId);
            }
            
            // モバイルメニューを閉じる
            closeMobileMenu();
        });
    });
    
    // スクロールイベント
    window.addEventListener('scroll', throttle(() => {
        updateHeaderOnScroll();
        updateActiveNavLink();
    }, 10));
    
    // リサイズイベント
    window.addEventListener('resize', debounce(() => {
        // モバイルメニューが開いている場合は閉じる
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    }, 250));
    
    // お問い合わせフォームの送信
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // 外部リンクの処理
    document.addEventListener('click', (event) => {
        const target = event.target.closest('a[href^="http"]');
        if (target) {
            target.setAttribute('target', '_blank');
            target.setAttribute('rel', 'noopener noreferrer');
        }
    });
    
    // キーボードナビゲーション
    document.addEventListener('keydown', (event) => {
        // Escキーでモバイルメニューを閉じる
        if (event.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

// ===== パフォーマンス最適化 =====
// 画像の遅延読み込み（将来の画像追加に備えて）
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ===== 初期化 =====
// DOMが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', () => {
    // デバッグ用：URLパラメータでセッションストレージをクリア
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('clear') === 'true') {
        sessionStorage.removeItem('liv_visited');
        console.log('Session storage cleared for testing');
    }
    
    // スプラッシュスクリーンの初期化（最優先）
    initSplashScreen();
    
    // イベントリスナーの設定
    setupEventListeners();
    
    // アニメーション関連の初期化
    observeElements();
    animateCounters();
    
    // その他の機能の初期化
    createScrollToTopButton();
    setupLazyLoading();
    
    // 初期状態の設定
    updateHeaderOnScroll();
    updateActiveNavLink();
    
    console.log('株式会社LIV Webサイトが正常に初期化されました。');
});

// ===== スプラッシュスクリーン制御 =====
function initSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.querySelector('body');
    
    // URLパラメータで強制表示をチェック（テスト用）
    const urlParams = new URLSearchParams(window.location.search);
    const forceShow = urlParams.get('splash') === 'true';
    
    // セッションストレージをチェック（同一セッション内での再訪問を判定）
    const hasVisited = sessionStorage.getItem('liv_visited');
    
    if ((!hasVisited || forceShow) && splashScreen) {
        // 初回訪問時またはforceShow時にスプラッシュスクリーンを表示
        splashScreen.style.display = 'flex';
        mainContent.style.overflow = 'hidden';
        
        // ロゴアニメーション完了後にフェードアウト
        setTimeout(() => {
            hideSplashScreen();
        }, 3000); // 3秒間表示（ロゴアニメーション重視）
        
        // セッションストレージに訪問済みフラグを設定（強制表示の場合は設定しない）
        if (!forceShow) {
            sessionStorage.setItem('liv_visited', 'true');
        }
        
        // クリックでスキップ機能
        splashScreen.addEventListener('click', () => {
            hideSplashScreen();
        });
        
    } else {
        // 再訪問時はスプラッシュスクリーンを非表示
        if (splashScreen) {
            splashScreen.style.display = 'none';
        }
        mainContent.style.overflow = 'auto';
    }
}

function hideSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.querySelector('body');
    
    if (splashScreen && splashScreen.style.display !== 'none') {
        // フェードアウトアニメーション追加
        splashScreen.style.animation = 'splashFadeOut 0.8s ease-out forwards';
        
        setTimeout(() => {
            splashScreen.style.display = 'none';
            mainContent.style.overflow = 'auto';
            
            // メインコンテンツにフェードインエフェクトを追加
            document.body.style.animation = 'contentFadeIn 0.6s ease-out forwards';
        }, 800);
    }
}

// スプラッシュスクリーン用のダイナミックCSS追加
function addSplashScreenStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes splashFadeOut {
            0% {
                opacity: 1;
                transform: scale(1);
            }
            100% {
                opacity: 0;
                transform: scale(1.05);
            }
        }
        
        @keyframes contentFadeIn {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }
        
        /* スプラッシュスクリーンのクリック可能エリア表示 */
        #splash-screen:hover {
            cursor: pointer;
        }
        
        #splash-screen:hover::after {
            content: "クリックでスキップ";
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.9rem;
            animation: fadeInOut 2s infinite;
        }
        
        @keyframes fadeInOut {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// スプラッシュスクリーン用CSS をページ読み込み時に追加
document.addEventListener('DOMContentLoaded', addSplashScreenStyles);

// ===== ページ離脱時の確認 =====
// フォームに入力がある場合の離脱確認（開発用）
let formHasUnsavedChanges = false;

if (contactForm) {
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            formHasUnsavedChanges = true;
        });
    });
    
    contactForm.addEventListener('submit', () => {
        formHasUnsavedChanges = false;
    });
    
    // 本番環境では削除推奨
    // window.addEventListener('beforeunload', (event) => {
    //     if (formHasUnsavedChanges) {
    //         event.preventDefault();
    //         event.returnValue = '';
    //     }
    // });
}

// ===== エラーハンドリング =====
window.addEventListener('error', (event) => {
    console.error('JavaScript エラー:', event.error);
    // 本番環境では適切なエラー報告システムに送信
});

// ===== サービスワーカー（PWA対応の準備） =====
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/sw.js')
//             .then((registration) => {
//                 console.log('SW registered: ', registration);
//             })
//             .catch((registrationError) => {
//                 console.log('SW registration failed: ', registrationError);
//             });
//     });
// }