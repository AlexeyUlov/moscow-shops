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
    const fullPopupHTML = `
        <b>Адрес:</b> ${options.address || 'нет данных'}<br>
        <b>Бренды:</b> ${options.brands || 'нет данных'}<br>
        <b>Контакты:</b> ${options.contacts || 'нет данных'}<br>
        <div>${popupHTML}</div>
    `;

    const marker = L.marker([lat, lon], { title, icon });
    
marker.on('click', function(e) {
    // Открываем сайдбар
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) {
        console.error('Элемент с ID "sidebar" не найден!');
        return;
    }
    
    // Добавляем классы для отображения
    sidebar.classList.add('show');
    sidebar.style.transform = 'translateX(0)';
    
    // Обновляем информацию в сайдбаре
    document.getElementById('shopInfoTitle').textContent = title_new || title;
    document.getElementById('shopInfoContent').innerHTML = fullPopupHTML;
    
    // Прокручиваем к информации
    setTimeout(() => {
        document.getElementById('sidebarShopInfo').scrollIntoView({
            behavior: 'smooth',
            block: 'end'
        });
    }, 100);
    
    // Центрируем карту
    map.setView(e.latlng, map.getZoom());
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
    // Обновляем панель в сайдбаре
    document.getElementById('shopInfoTitle').textContent = title;
    document.getElementById('shopInfoContent').innerHTML = html;
    
    // Показываем сайдбар, если он скрыт
    document.getElementById('sidebar').classList.add('show');
    
    // Также оставляем возможность показать панель на карте (по желанию)
    panel.classList.add('show');
    body.innerHTML = `
      <div class="p-2">
        <h5 class="mb-2">${title}</h5>
        <div>${html}</div>
      </div>`;
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
    function initSelectAllButton() {
        const selectAllBtn = document.getElementById('selectAllFilters');
        const checkboxes = document.querySelectorAll('.filter-check');

        if (!selectAllBtn || !checkboxes.length) {
            console.error('Элементы фильтра не найдены!');
            return;
        }

        // Обновляет текст кнопки в зависимости от состояния чекбоксов
        function updateButtonText() {
            const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
            selectAllBtn.textContent = allChecked ? 'Снять все' : 'Выбрать все';
        }

        // Обработчик для кнопки
        selectAllBtn.addEventListener('click', () => {
            const isAnyUnchecked = Array.from(checkboxes).some(checkbox => !checkbox.checked);
            checkboxes.forEach(checkbox => {
                checkbox.checked = isAnyUnchecked;
            });
            updateButtonText();
            updateFilters(); // Ваша существующая функция для обновления карты
        });

        // Обработчик для чекбоксов (если меняют вручную)
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                updateButtonText();
            });
        });

        // Инициализация текста кнопки при загрузке
        updateButtonText();
    }

    // Инициализируем кнопку
    initSelectAllButton();

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
    showShopInfo(m.title_new || m.title, m.popupHTML);
    searchResults.style.display = 'none';
    searchInput.value = '';
    document.getElementById('sidebarShopInfo').scrollIntoView({ behavior: 'smooth' });
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

    // Управление боковой панелью
// Управление боковой панелью
// Управление боковой панелью
// Управление боковой панелью
const sidebar = document.getElementById('sidebar');
const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

function openSidebar() {
    sidebar.classList.add('show');
    sidebar.style.transform = 'translateX(0)';
}

function closeSidebar() {
    sidebar.classList.remove('show');
    sidebar.style.transform = 'translateX(-100%)';
}

// Обработчики событий
sidebarToggleBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (sidebar.classList.contains('show')) {
        closeSidebar();
    } else {
        openSidebar();
    }
});

sidebarCloseBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    closeSidebar();
});

// Закрытие при клике вне панели
document.addEventListener('click', function(e) {
    if (!sidebar.contains(e.target) && 
        e.target !== sidebarToggleBtn && 
        !e.target.closest('.leaflet-marker-icon')) {
        closeSidebar();
    }
});

// Предотвращаем закрытие при клике внутри панели
sidebar.addEventListener('click', function(e) {
    e.stopPropagation();
});

// Фильтрация по категориям
const categoryButtons = document.querySelectorAll('.sidebar-category');
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const category = button.dataset.category;
        // Здесь должна быть логика фильтрации магазинов
    });
});

    document.getElementById('emailButton').addEventListener('click', async () => {
    const email = 'alexey.ulov@mail.ru';
    const tooltip = document.getElementById('emailTooltip');
    
    try {
        // Копируем email в буфер обмена
        await navigator.clipboard.writeText(email);
        
        // Показываем уведомление
        tooltip.classList.add('show');
        
        // Скрываем уведомление через 2 секунды
        setTimeout(() => {
            tooltip.classList.remove('show');
        }, 2000);
        
    } catch (err) {
        // Если не удалось скопировать, открываем почтовый клиент
        console.error('Ошибка копирования: ', err);
        window.location.href = `mailto:${email}`;
    }
});

    document.getElementById('vkButton').addEventListener('click', () => {
        window.open('https://vk.com/petergriffinfunnymoments', '_blank');
    });

    document.getElementById('telegramButton').addEventListener('click', () => {
        window.open('https://t.me/petergriffinfunnymoments', '_blank');
    });
});
