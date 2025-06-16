document.addEventListener('DOMContentLoaded', () => {
    // === ИНИЦИАЛИЗАЦИЯ КАРТЫ ===
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
            }).addTo(map).bindPopup('МКАД');
        })
        .catch(err => console.error('Ошибка загрузки GeoJSON:', err));

    // === КАТЕГОРИИ СЛОЁВ ===
    const layersByCategory = {
        ушли: L.layerGroup(),
        реселлеры: L.layerGroup(),
        бутики: L.layerGroup(),
        секонд: L.layerGroup(),
    };

    Object.values(layersByCategory).forEach(group => group.addTo(map));

    // === ИКОНКИ ===
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

    // === СОЗДАНИЕ МАРКЕРОВ ===
    function createMarker(lat, lon, title, popupHTML, icon, category, options = {}) {
        const title_new = options.title_new || title;
        const fullPopupHTML = `
            <b>Адрес:</b> ${options.address || 'нет данных'}<br>
            <b>Бренды:</b> ${options.brands || 'нет данных'}<br>
            <b>Контакты:</b> ${options.contacts || 'нет данных'}<br>
            <div>${popupHTML}</div>
        `;
        const marker = L.marker([lat, lon], { title, icon });

        marker.on('click', e => {
            openSidebar();
            document.getElementById('shopInfoTitle').textContent = title_new;
            document.getElementById('shopInfoContent').innerHTML = fullPopupHTML;
            setTimeout(() => {
                document.getElementById('sidebarShopInfo').scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 100);
            map.setView(e.latlng, map.getZoom());
        });

        layersByCategory[category].addLayer(marker);
        allMarkers.push({
            title,
            title_new,
            titleLC: title.toLowerCase(),
            title_newLC: title_new.toLowerCase(),
            lat, lon,
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

    // === ФИЛЬТРЫ ===
    const checkboxes = document.querySelectorAll('.filter-check');

    function updateFilteredShops(selectedCategories) {
        Object.entries(layersByCategory).forEach(([cat, group]) => {
            if (selectedCategories.includes(cat)) {
                map.addLayer(group);
            } else {
                map.removeLayer(group);
            }
        });
    }

    function updateFilters() {
        const selected = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        updateFilteredShops(selected);
    }

    checkboxes.forEach(cb => cb.addEventListener('change', updateFilters));
    updateFilters();

    function initSelectAllButton() {
        const selectAllBtn = document.getElementById('selectAllFilters');
        if (!selectAllBtn || !checkboxes.length) return;

        function updateButtonText() {
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            selectAllBtn.textContent = allChecked ? 'Снять все' : 'Выбрать все';
        }

        selectAllBtn.addEventListener('click', () => {
            const isAnyUnchecked = Array.from(checkboxes).some(cb => !cb.checked);
            checkboxes.forEach(cb => cb.checked = isAnyUnchecked);
            updateButtonText();
            updateFilters();
        });

        checkboxes.forEach(cb => cb.addEventListener('change', updateButtonText));
        updateButtonText();
    }
    initSelectAllButton();

    // === ПОИСК ===
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
            m.title_newLC.includes(query) ||
            m.addressLC.includes(query) ||
            m.brandsLC.includes(query)
        );

        matches.forEach(m => {
            const li = document.createElement('li');
            li.className = 'list-group-item list-group-item-action';
            li.textContent = m.title_new || m.title;
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

    // === ИНФОРМАЦИЯ / МОДАЛКА ===
    const infoModal = document.getElementById('infoModal');
    const toggleInfoBtn = document.getElementById('toggleInfoModal');
    const closeInfoBtn = document.getElementById('closeInfoModal');

    toggleInfoBtn.addEventListener('click', () => infoModal.style.display = 'block');
    closeInfoBtn.addEventListener('click', () => infoModal.style.display = 'none');

    window.addEventListener('click', e => {
        if (e.target === infoModal) infoModal.style.display = 'none';
    });

    // === САЙДБАР ===
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

    sidebarToggleBtn.addEventListener('click', e => {
        e.stopPropagation();
        if (sidebar.classList.contains('show')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    sidebarCloseBtn.addEventListener('click', e => {
        e.stopPropagation();
        closeSidebar();
    });

    document.addEventListener('click', e => {
        if (!sidebar.contains(e.target) &&
            e.target !== sidebarToggleBtn &&
            !e.target.closest('.leaflet-marker-icon')) {
            closeSidebar();
        }
    });

    sidebar.addEventListener('click', e => e.stopPropagation());

    // === КНОПКИ КОНТАКТОВ ===
    document.getElementById('emailButton').addEventListener('click', async () => {
        const email = 'alexey.ulov@mail.ru';
        const tooltip = document.getElementById('emailTooltip');

        try {
            await navigator.clipboard.writeText(email);
            tooltip.classList.add('show');
            setTimeout(() => tooltip.classList.remove('show'), 2000);
        } catch (err) {
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

    // === ПАНЕЛЬ ФИЛЬТРОВ ===
    const toggleFilterBtn = document.getElementById('toggleFilterPanel');
    const filterPanel = document.getElementById('filterPanel');
    const closeFilterBtn = document.getElementById('closeFilterPanel');

    toggleFilterBtn.addEventListener('click', () => {
        filterPanel.style.display = (filterPanel.style.display === 'none' || !filterPanel.style.display) ? 'block' : 'none';
    });

    closeFilterBtn.addEventListener('click', () => {
        filterPanel.style.display = 'none';
    });

});
