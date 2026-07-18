const form = document.querySelector('#search-form');
const keywordInput = document.querySelector('#keyword');
const daysInput = document.querySelector('#days');
const results = document.querySelector('#results');
const grid = document.querySelector('#news-grid');
const status = document.querySelector('#status');
const title = document.querySelector('#result-title');
const count = document.querySelector('#result-count');
const apiBaseUrl = (window.NEWS_API_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[char]));

function relativeTime(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '近期';
  const hours = Math.max(0, Math.floor((Date.now() - date.getTime()) / 3_600_000));
  if (hours < 1) return '剛剛';
  if (hours < 24) return `${hours} 小時前`;
  return `${Math.floor(hours / 24)} 天前`;
}

function renderArticles(articles) {
  grid.innerHTML = articles.map((article) => `
    <article class="card">
      <div class="card-meta">
        <span class="card-source">${escapeHtml(article.source)}</span>
        <time datetime="${escapeHtml(article.publishedAt)}">${relativeTime(article.publishedAt)}</time>
      </div>
      <h3><a href="${escapeHtml(article.link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(article.title)}</a></h3>
      <a class="card-link" href="${escapeHtml(article.link)}" target="_blank" rel="noopener noreferrer">閱讀原文 <span>↗</span></a>
    </article>
  `).join('');
}

async function search(keyword) {
  results.hidden = false;
  grid.innerHTML = '';
  count.textContent = '';
  title.textContent = `「${keyword}」`;
  status.className = 'status loading';
  status.textContent = '正在整理最新消息';
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });

  try {
    const response = await fetch(`${apiBaseUrl}/api/news?q=${encodeURIComponent(keyword)}&days=${daysInput.value}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || '搜尋失敗');

    status.className = 'status';
    status.textContent = data.articles.length ? '' : '目前找不到相關新聞，試試其他關鍵字。';
    count.textContent = `共 ${data.count} 則消息`;
    renderArticles(data.articles);
  } catch (error) {
    status.className = 'status';
    status.textContent = error.message;
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const keyword = keywordInput.value.trim();
  if (keyword) search(keyword);
});

document.querySelectorAll('.suggestions button').forEach((button) => {
  button.addEventListener('click', () => {
    keywordInput.value = button.textContent;
    search(button.textContent);
  });
});
