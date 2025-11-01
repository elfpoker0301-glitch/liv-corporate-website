// ニュースデータを読み込んで表示する
async function loadNews(limit = null) {
    try {
        const response = await fetch('/assets/data/news.json');
        const newsData = await response.json();
        
        // 日付順にソート（新しい順）
        newsData.sort((a, b) => {
            const dateA = new Date(a.date.year, a.date.month - 1, a.date.day);
            const dateB = new Date(b.date.year, b.date.month - 1, b.date.day);
            return dateB - dateA;
        });
        
        // limitが指定されている場合は件数を制限
        const displayNews = limit ? newsData.slice(0, limit) : newsData;
        
        return displayNews;
    } catch (error) {
        console.error('ニュースの読み込みに失敗しました:', error);
        return [];
    }
}

// ホームページのお知らせセクションにニュースを表示
async function displayHomeNews() {
    const newsContainer = document.querySelector('.intro-news-list');
    if (!newsContainer) return;
    
    const newsData = await loadNews(2); // ホームには最新2件のみ表示
    
    newsContainer.innerHTML = newsData.map(news => `
        <article class="intro-news-item">
            <div class="intro-news-date">
                <span class="date-day">${news.date.day}</span>
                <span class="date-month">${news.date.month}</span>
                <span class="date-year">${news.date.year}</span>
            </div>
            <div class="intro-news-content">
                <h3>${news.title}</h3>
                <p>${news.description}</p>
                ${news.link ? `<a href="${news.link}" target="_blank" rel="noopener noreferrer" class="news-link">${news.linkText}</a>` : ''}
            </div>
            <div class="intro-news-arrow">
                <i class="fas fa-arrow-right"></i>
            </div>
        </article>
    `).join('');
}

// ニュースページに全ニュースを表示
async function displayAllNews() {
    const newsContainer = document.querySelector('.news-list');
    if (!newsContainer) return;
    
    const newsData = await loadNews(); // 全件表示
    
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
    newsContainer.innerHTML = newsData.map(news => `
        <article class="news-item">
            <div class="news-date">
                <span class="date-day">${news.date.day}</span>
                <span class="date-month">${monthNames[parseInt(news.date.month) - 1]}</span>
                <span class="date-year">${news.date.year}</span>
            </div>
            <div class="news-content">
                <h3 class="news-title">${news.title}</h3>
                <p class="news-excerpt">${news.description}</p>
                ${news.link ? `
                    <a href="${news.link}" class="news-link" target="_blank" rel="noopener noreferrer">
                        <i class="fas fa-external-link-alt"></i> ${news.linkText}
                    </a>
                ` : ''}
            </div>
        </article>
    `).join('');
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', () => {
    // ホームページの場合
    if (document.querySelector('.intro-news-list')) {
        displayHomeNews();
    }
    
    // ニュースページの場合
    if (document.querySelector('.news-list')) {
        displayAllNews();
    }
});
