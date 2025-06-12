// Категории слоёв
const layersByCategory = {
    'ушли': L.layerGroup(),
    'реселлеры': L.layerGroup(),
    'бутики': L.layerGroup(),
    'секонд': L.layerGroup()
};

// Иконки
const parkIconClass = L.Icon.extend({
    options: {
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, 0],
    }
});

const parkIconArray = [
    new parkIconClass({ iconUrl: './data/icons/blue.png' }),
    new parkIconClass({ iconUrl: './data/icons/green.png' }),
    new parkIconClass({ iconUrl: './data/icons/orange.png' }),
    new parkIconClass({ iconUrl: './data/icons/red.png' })
];

// Хранилище всех маркеров для поиска
const allMarkers = [];

// Универсальный маркер
function createMarker(lat, lon, title, popupHTML, icon, category) {
    const marker = L.marker([lat, lon], { title, icon });

    marker.on('click', () => {
        const panel = document.getElementById('shop-info-panel');
        const body = document.getElementById('shop-info-body');
        panel.classList.add('show');
        body.innerHTML = `<h3>${title}</h3>${popupHTML}`;
    });

    layersByCategory[category].addLayer(marker);
    allMarkers.push({ title, lat, lon, popupHTML, marker });
}

// Показываем всё по умолчанию
for (const group of Object.values(layersByCategory)) {
    group.addTo(map);
}

// Функция фильтрации
function updateFilteredShops(selectedCategories) {
    for (const [cat, group] of Object.entries(layersByCategory)) {
        if (selectedCategories.includes(cat)) {
            map.addLayer(group);
        } else {
            map.removeLayer(group);
        }
    }
}

// Поиск по названию магазина
const searchInput = document.getElementById('shop-search');
const searchResults = document.getElementById('search-results');

searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = '';

    if (!query) {
        searchResults.style.display = 'none';
        return;
    }

    const matches = allMarkers.filter(m => m.title.toLowerCase().includes(query));

    matches.forEach(m => {
        const li = document.createElement('li');
        li.textContent = m.title;
        li.addEventListener('click', () => {
            map.setView([m.lat, m.lon], 15);
            m.marker.fire('click');
            searchResults.style.display = 'none';
            searchInput.value = '';
        });
        searchResults.appendChild(li);
    });

    searchResults.style.display = matches.length ? 'block' : 'none';
});

// Инициализация фильтров
document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.filter-check');

    function updateFilters() {
        const selected = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        updateFilteredShops(selected);
    }

    checkboxes.forEach(cb => cb.addEventListener('change', updateFilters));
    updateFilters();
});
