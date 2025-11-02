// 実績データを読み込んで表示する
let currentCategory = 'all';

async function loadWorks() {
    try {
        const response = await fetch('/assets/data/works.json');
        const worksData = await response.json();
        
        // 日付順にソート（新しい順）
        worksData.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        return worksData;
    } catch (error) {
        console.error('実績データの読み込みに失敗しました:', error);
        return [];
    }
}

// カテゴリーアイコンを取得
function getCategoryIcon(category) {
    const icons = {
        'website': 'fa-globe',
        'app': 'fa-mobile-alt',
        'business': 'fa-store'
    };
    return icons[category] || 'fa-briefcase';
}

// カテゴリー名を日本語に変換
function getCategoryName(category) {
    const names = {
        'website': 'Webサイト',
        'app': 'アプリ開発',
        'business': '事業運営'
    };
    return names[category] || category;
}

// 日付をフォーマット
function formatDate(dateStr) {
    const [year, month] = dateStr.split('-');
    return `${year}年${month}月`;
}

// 実績カードを表示
async function displayWorks(category = 'all') {
    const worksGrid = document.getElementById('works-grid');
    if (!worksGrid) return;
    
    const worksData = await loadWorks();
    
    // カテゴリーでフィルター
    const filteredWorks = category === 'all' 
        ? worksData 
        : worksData.filter(work => work.category === category);
    
    if (filteredWorks.length === 0) {
        worksGrid.innerHTML = '<p class="no-works">該当する実績がありません</p>';
        return;
    }
    
    worksGrid.innerHTML = filteredWorks.map(work => `
        <article class="work-card" data-category="${work.category}">
            <div class="work-card-header">
                <div class="work-icon">
                    <i class="fas ${getCategoryIcon(work.category)}"></i>
                </div>
                <span class="work-category">${getCategoryName(work.category)}</span>
            </div>
            <div class="work-card-body">
                <h3 class="work-title">${work.title}</h3>
                <p class="work-client">
                    <i class="fas fa-building"></i> ${work.client}
                </p>
                <p class="work-date">
                    <i class="fas fa-calendar"></i> ${formatDate(work.date)}
                </p>
                <p class="work-description">${work.description}</p>
                <div class="work-technologies">
                    ${work.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
            ${work.link ? `
                <div class="work-card-footer">
                    <a href="${work.link}" class="work-link" target="_blank" rel="noopener noreferrer">
                        <i class="fas fa-external-link-alt"></i> サイトを見る
                    </a>
                </div>
            ` : ''}
        </article>
    `).join('');
}

// フィルターボタンのイベントリスナー
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // アクティブ状態を更新
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // カテゴリーで絞り込み
            const category = button.getAttribute('data-category');
            currentCategory = category;
            displayWorks(category);
        });
    });
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('works-grid')) {
        displayWorks();
        initializeFilters();
    }
});
