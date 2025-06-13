document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map', {
        attributionControl: false,
        zoomControl: true,
    }).setView([55.751244, 37.618423], 11);

    L.tileLayer('https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '',
        maxZoom: 19,
    }).addTo(map);

    fetch('map.geojson')
        .then(res => res.json())
        .then(data => {
            L.geoJSON(data, {
                style: { color: 'red', weight: 3, opacity: 0.8 },
            })
                .addTo(map)
                .bindPopup('МКАД');
        })
        .catch(err => console.error('Ошибка загрузки GeoJSON:', err));

    // Категории слоёв
    const layersByCategory = {
        ушли: L.layerGroup(),
        реселлеры: L.layerGroup(),
        бутики: L.layerGroup(),
        секонд: L.layerGroup(),
    };

    // Иконка-конструктор
    const ParkIcon = L.Icon.extend({
        options: {
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, 0],
        },
    });

    const parkIconArray = [
        new ParkIcon({ iconUrl: './data/markers/blue.png' }),
        new ParkIcon({ iconUrl: './data/markers/green.png' }),
        new ParkIcon({ iconUrl: './data/markers/orange.png' }),
        new ParkIcon({ iconUrl: './data/markers/red.png' }),
    ];

    const allMarkers = [];

    // Создаём маркер, добавляем его в нужный слой и хранилище
    function createMarker(lat, lon, title, popupHTML, icon, category, options = {}) {
        const title_new = options.title_new || title;
        // Сформируем полный HTML с адресом, брендами и контактами
        const fullPopupHTML = `
        <b>Адрес:</b> ${options.address || 'нет данных'}<br>
        <b>Бренды:</b> ${options.brands || 'нет данных'}<br>
        <b>Контакты:</b> ${options.contacts || 'нет данных'}<br>
        <div>${popupHTML}</div>
    `;

        const marker = L.marker([lat, lon], { title, icon });
        marker.on('click', () => {
            showShopInfo(title, fullPopupHTML);
        });
        layersByCategory[category].addLayer(marker);

        allMarkers.push({
            title,
            title_new, // Добавляем новый атрибут с тем же значением
            titleLC: title.toLowerCase(),
            title_newLC: title_new.toLowerCase(), // Добавляем lowercase версию нового атрибута
            lat,
            lon,
            popupHTML: fullPopupHTML,
            marker,
            address: options.address || '',
            addressLC: (options.address || '').toLowerCase(),
            brands: options.brands || '',
            brandsLC: (options.brands || '').toLowerCase(),
            contacts: options.contacts || '',
            contactsLC: (options.contacts || '').toLowerCase(),
        });
    }

    // Добавляем все категории на карту
    Object.values(layersByCategory).forEach(group => group.addTo(map));

    // Функция показа панели с информацией о магазине
    const panel = document.getElementById('shop-info-panel');
    const body = document.getElementById('shop-info-body');
    const closeBtn = document.getElementById('close-info');

    function showShopInfo(title, html) {
        panel.classList.add('show');
        body.innerHTML = `
      <div class="p-2">
        <h5 class="mb-2">${title}</h5>
        <div>${html}</div>
      </div>`;
        document.getElementById('close-info-btn').addEventListener('click', () => {
            panel.classList.remove('show');
        });
    }

    // Закрытие панели при клике по кнопке
    closeBtn.addEventListener('click', () => panel.classList.remove('show'));

    // Обновление видимости слоёв по выбранным категориям
    function updateFilteredShops(selectedCategories) {
        Object.entries(layersByCategory).forEach(([cat, group]) => {
            if (selectedCategories.includes(cat)) {
                map.addLayer(group);
            } else {
                map.removeLayer(group);
            }
        });
    }

    // Поиск по магазинам
    const searchInput = document.getElementById('shop-search');
    const searchResults = document.getElementById('search-results');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        searchResults.innerHTML = '';

        if (!query) {
            searchResults.style.display = 'none';
            return;
        }

        const matches = allMarkers.filter(m =>
            m.titleLC.includes(query) ||
            m.title_newLC.includes(query) || // Добавляем поиск по новому атрибуту
            m.addressLC.includes(query) ||
            m.brandsLC.includes(query)
        );

        matches.forEach(m => {
        const li = document.createElement('li');
        li.className = 'list-group-item list-group-item-action';
        li.textContent = m.title_new || m.title; // Показываем новое название, если есть
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
    const checkboxes = document.querySelectorAll('.filter-check');

    function updateFilters() {
        const selected = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        updateFilteredShops(selected);
    }

    checkboxes.forEach(cb => cb.addEventListener('change', updateFilters));
    updateFilters();

    // ---- Добавляем маркеры из markersData ----
    if (typeof markersData !== 'undefined' && Array.isArray(markersData)) {
        markersData.forEach(data => {
            createMarker(
                data.lat,
                data.lon,
                data.title,
                data.popupHTML,
                parkIconArray[data.iconIndex],
                data.category,
                data.options
            );
        });
    } else {
        console.error('markersData не найден или не массив');
    }

    // === Логика для кнопки информации и модального окна ===
    const infoModal = document.getElementById('infoModal');
    const toggleInfoBtn = document.getElementById('toggleInfoModal');
    const closeInfoBtn = document.getElementById('closeInfoModal');

    toggleInfoBtn.addEventListener('click', () => {
        infoModal.style.display = 'block';
    });

    closeInfoBtn.addEventListener('click', () => {
        infoModal.style.display = 'none';
    });

    // Чтобы закрывать модалку по клику вне окна (по желанию)
    window.addEventListener('click', (e) => {
        if (e.target === infoModal) {
            infoModal.style.display = 'none';
        }
    });

    document.getElementById('emailButton').addEventListener('click', () => {
        window.location.href = 'mailto:alexey.ulov@mail.ru';
    });

    document.getElementById('vkButton').addEventListener('click', () => {
        window.open('https://vk.com/petergriffinfunnymoments', '_blank');
    });

    document.getElementById('telegramButton').addEventListener('click', () => {
        window.open('https://t.me/petergriffinfunnymoments', '_blank');
    });
});
