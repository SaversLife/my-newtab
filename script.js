// Загрузка ярлыков из localStorage
function loadShortcuts() {
    const shortcuts = JSON.parse(localStorage.getItem('shortcuts')) || [
        { title: 'YouTube', url: 'https://www.youtube.com/' },
        { title: 'Яндекс музыка', url: 'https://music.yandex.ru/home' },
        { title: 'SoundCloud', url: 'https://soundcloud.com/discover' },
        { title: 'Яндекс Маркет', url: 'https://market.yandex.ru/' },
        { title: 'DNS', url: 'https://www.dns-shop.ru/' },
        { title: 'OZON', url: 'https://www.ozon.ru/' },
        { title: 'Wildberries', url: 'https://www.wildberries.ru/' },
        { title: 'Translate', url: 'https://translate.google.com/' },
        { title: 'RuTracker', url: 'https://rutracker.org/forum/index.php' },
        { title: 'Перевод по фото', url: 'https://translate.yandex.ru/ocr' }
    ];
    const container = document.getElementById('container');
    container.innerHTML = '';

    shortcuts.forEach((shortcut, index) => {
        addTile(shortcut.title, shortcut.url, index);
    });

    const addButton = document.getElementById('addShortcut');
    addButton.onclick = showAddForm;
    container.appendChild(addButton);
}

// Сохранение в localStorage
function saveShortcuts(shortcuts) {
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
}

// Добавление плитки
function addTile(title, url, index) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.onclick = () => window.open(url, '_blank');

    const icon = document.createElement('div');
    icon.className = 'tile-icon';
    const img = document.createElement('img');
    img.src = getFaviconUrl(url); // Простая функция для favicon
    img.onerror = () => img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiNGMEY4RkYiLz4KPHRleHQgeD0iMjQiIHk9IjI5IiBmb250LXNpemU9IjE0IiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5GP0w8L3RleHQ+Cjwvc3ZnPg=='; // Fallback SVG
    icon.appendChild(img);

    const titleDiv = document.createElement('div');
    titleDiv.className = 'tile-title';
    titleDiv.textContent = title;

    tile.appendChild(icon);
    tile.appendChild(titleDiv);

    tile.oncontextmenu = (e) => {
        e.preventDefault();
        if (confirm('Удалить этот ярлык?')) {
            removeTile(index);
        }
    };

    document.getElementById('container').insertBefore(tile, document.getElementById('addShortcut'));
}

// Простая функция для favicon (использует стандартный подход)
function getFaviconUrl(url) {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=48`; // Альтернатива favicon сервису
    } catch {
        return 'data:image/svg+xml;base64,...'; // Fallback
    }
}

// Удаление плитки
function removeTile(index) {
    const shortcuts = JSON.parse(localStorage.getItem('shortcuts')) || [];
    shortcuts.splice(index, 1);
    saveShortcuts(shortcuts);
    loadShortcuts();
}

// Показ модалки
function showAddForm() {
    const dialog = document.getElementById('dialog');
    dialog.showModal();
}

// Обработчики для модалки
document.querySelector('.cancel-button').onclick = () => document.getElementById('dialog').close();
document.querySelector('.action-button').onclick = () => {
    const title = document.getElementById('dialogInputName').value.trim();
    const url = document.getElementById('dialogInputUrl').value.trim();
    if (title && url) {
        let fullUrl = url.startsWith('http') ? url : 'https://' + url;
        const shortcuts = JSON.parse(localStorage.getItem('shortcuts')) || [];
        shortcuts.push({ title, url: fullUrl });
        saveShortcuts(shortcuts);
        loadShortcuts();
        document.getElementById('dialog').close();
        document.getElementById('dialogInputName').value = '';
        document.getElementById('dialogInputUrl').value = '';
    } else {
        alert('Заполните название и URL!');
    }
};

// Обработчик поиска (простой redirect)
document.getElementById('searchbox').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query) {
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
    }
});

// Загрузка при старте
window.addEventListener('load', loadShortcuts);
