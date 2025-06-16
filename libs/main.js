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
    function createMarker(lat, lon, title, popupHTML, icon, category, options = {}, okrug) {
    const title_new = options.title_new || title;
    const fullPopupHTML = `
        <div class="shop-info-content">
            <div class="shop-info-details">
                <div class="shop-info-label">Адрес:</div>
                <div class="shop-info-value">${options.address || 'нет данных'}</div>
                
                <div class="shop-info-label">Округ:</div>
                <div class="shop-info-value">${okrug || 'нет данных'}</div>
                
                <div class="shop-info-label">Контакты:</div>
                <div class="shop-info-value">${options.contacts || 'нет данных'}</div>
                
                <div class="shop-info-label">Бренды:</div>
                <div class="shop-info-value">
                    <div class="shop-info-brands">
                        ${(options.brands || 'нет данных').split(',').map(brand => 
                            `<span class="brand-tag">${brand.trim()}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
            
            ${options.description ? `
            <div class="shop-info-description">
                ${options.description}
            </div>
            ` : ''}
            
            <div class="shop-info-actions">
                <button class="shop-info-btn shop-info-btn-primary" onclick="navigator.clipboard.writeText('${options.address || ''}')">
                    <svg class="shop-info-btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 4V16C8 17.1046 8.89543 18 10 18H18C19.1046 18 20 17.1046 20 16V7.2426C20 6.44772 19.6839 5.68514 19.1213 5.12256L16.8774 2.87868C16.3149 2.31607 15.5523 2 14.7574 2H10C8.89543 2 8 2.89543 8 4Z" fill="currentColor"/>
                        <path d="M4 8H6C6 6.89543 6.89543 6 8 6H15V20C15 21.1046 14.1046 22 13 22H6C4.89543 22 4 21.1046 4 20V10C4 8.89543 4.89543 8 6 8Z" fill="currentColor"/>
                    </svg>
                    Копировать адрес
                </button>
                ${options.contacts ? `
                <button class="shop-info-btn shop-info-btn-secondary" onclick="window.open('tel:${options.contacts.replace(/[^0-9+]/g, '')}', '_blank')">
                    <svg class="shop-info-btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 5C3 14.0604 9.93959 21 19 21C19.5523 21 20 20.5523 20 20V16.5C20 15.9477 19.5523 15.5 19 15.5C17.8796 15.5 16.8836 15.2539 16 14.9496C15.7053 14.8486 15.3795 14.902 15.1364 15.0894L12.799 16.799C10.024 15.5 8.5 13.976 7.20104 11.201L8.91061 8.86364C9.09802 8.62054 9.15142 8.29466 9.05041 8C8.74614 7.11644 8.5 6.12037 8.5 5C8.5 4.44772 8.05228 4 7.5 4H4C3.44772 4 3 4.44772 3 5Z" fill="currentColor"/>
                    </svg>
                    Позвонить
                </button>
                ` : ''}
            </div>
        </div>
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
            okrug // <=== Добавляем округ
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
                data.options,
                data.okrug
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


    let okrugBorderLayer = null;

    document.querySelectorAll('.okrug-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const okrug = btn.dataset.okrug;

            // Скрываем маркеры вне округа
            allMarkers.forEach(m => {
                if (m.okrug === okrug) {
                    map.addLayer(m.marker);
                } else {
                    map.removeLayer(m.marker);
                }
            });

            // Убираем старую границу
            if (okrugBorderLayer) {
                map.removeLayer(okrugBorderLayer);
            }

            // Загружаем границу округа
            fetch(`./data/borders/${okrug}.geojson`)
                .then(res => res.json())
                .then(data => {
                    okrugBorderLayer = L.geoJSON(data, {
                        style: { color: 'blue', weight: 2, opacity: 0.6 }
                    }).addTo(map);
                    map.fitBounds(okrugBorderLayer.getBounds());
                })
                .catch(err => console.error(`Ошибка загрузки границы ${okrug}:`, err));
        });
    });
});
