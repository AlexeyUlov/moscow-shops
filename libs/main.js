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
                <button class="shop-info-btn shop-info-btn-secondary" onclick="window.open('${options.website}', '_blank')">
    <svg class="shop-info-btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 7.58172 7.58172 4 12 4C13.8565 4 15.637 4.7375 16.9497 6.05025L12 11V6.5C8.41015 6.5 5.5 9.41015 5.5 13C5.5 13.8284 6.17157 14.5 7 14.5C7.82843 14.5 8.5 13.8284 8.5 13C8.5 11.067 10.067 9.5 12 9.5H17.5858L16.2929 10.7929C15.9024 11.1834 15.9024 11.8166 16.2929 12.2071C16.6834 12.5976 17.3166 12.5976 17.7071 12.2071L20.7071 9.20711C21.0976 8.81658 21.0976 8.18342 20.7071 7.79289L17.7071 4.79289C17.3166 4.40237 16.6834 4.40237 16.2929 4.79289C15.9024 5.18342 15.9024 5.81658 16.2929 6.20711L17.5858 7.5H12C7.58172 7.5 4 11.067 4 15.5C4 19.9183 7.58172 23.5 12 23.5C16.4183 23.5 20 19.9183 20 15.5C20 14.6716 19.3284 14 18.5 14C17.6716 14 17 14.6716 17 15.5C17 18.2614 14.7614 20.5 12 20.5C9.23858 20.5 7 18.2614 7 15.5C7 12.7386 9.23858 10.5 12 10.5H18.5858L15.2929 13.7929C14.9024 14.1834 14.9024 14.8166 15.2929 15.2071C15.6834 15.5976 16.3166 15.5976 16.7071 15.2071L20.7071 11.2071C21.0976 10.8166 21.0976 10.1834 20.7071 9.79289L16.7071 5.79289C16.3166 5.40237 15.6834 5.40237 15.2929 5.79289C14.9024 6.18342 14.9024 6.81658 15.2929 7.20711L17.5858 9.5H12C8.41015 9.5 6 11.9101 6 15.5C6 19.0899 8.41015 21.5 12 21.5C15.5899 21.5 18 19.0899 18 15.5C18 14.6716 18.6716 14 19.5 14C20.3284 14 21 14.6716 21 15.5C21 20.1944 17.1944 24 12 24C6.80558 24 3 20.1944 3 15.5C3 10.8056 6.80558 7 12 7H18.5858L16.2929 9.29289C15.9024 9.68342 15.9024 10.3166 16.2929 10.7071C16.6834 11.0976 17.3166 11.0976 17.7071 10.7071L20.7071 7.70711C21.0976 7.31658 21.0976 6.68342 20.7071 6.29289L17.7071 3.29289C17.3166 2.90237 16.6834 2.90237 16.2929 3.29289C15.9024 3.68342 15.9024 4.31658 16.2929 4.70711L18.5858 7H12C7.58172 7 4 10.5817 4 15Z" fill="currentColor"/>
    </svg>
    Сайт магазина
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

    // Функция для показа с анимацией
    function showInfoModal() {
        infoModal.classList.remove('animate-out');
        infoModal.style.display = 'block';
        void infoModal.offsetWidth; // перезапуск анимации
        infoModal.classList.add('animate-in');
    }

    // Функция для скрытия с анимацией
    function hideInfoModal() {
        infoModal.classList.remove('animate-in');
        infoModal.classList.add('animate-out');
        setTimeout(() => {
            infoModal.style.display = 'none';
        }, 300); // должно совпадать с CSS анимацией
    }

    toggleInfoBtn.addEventListener('click', showInfoModal);
    closeInfoBtn.addEventListener('click', hideInfoModal);

    window.addEventListener('click', e => {
        if (e.target === infoModal) {
            hideInfoModal();
        }
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

            // Показываем "Почта скопирована"
            const originalText = tooltip.textContent;
            tooltip.textContent = 'Почта скопирована!';
            tooltip.classList.add('show');

            // Через 2 секунды возвращаем текст обратно
            setTimeout(() => {
                tooltip.classList.remove('show');
                tooltip.textContent = originalText;
            }, 2000);
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

    // === ЛОГИКА ОТОБРАЖЕНИЕ ОКРУГОВ ===
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
                        style: { color: 'blue', weight: 3, opacity: 0.8 }
                    }).addTo(map);
                    map.fitBounds(okrugBorderLayer.getBounds());
                })
                .catch(err => console.error(`Ошибка загрузки границы ${okrug}:`, err));
        });
    });

    // === ЛОГИКА ОЧИСТКИ ПОИСКА ===
    const clearBtn = document.getElementById('clearSearchBtn');
    clearBtn.addEventListener('click', () => {
        const searchInput = document.getElementById('shop-search');
        const searchResults = document.getElementById('search-results');
        searchInput.value = '';
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        searchInput.focus();
    });

    // === ЛОГИКА ОТОБРАЖЕНИЯ МАРКЕРОВ ПРИ ПОИСКЕ ===
    const filterSearchBtn = document.getElementById('filterSearchBtn');

    filterSearchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            // Показать все маркеры
            allMarkers.forEach(m => {
                m.marker.addTo(layersByCategory[m.marker.options.category] || map); // или просто map
                m.marker.setOpacity(1);
            });
            return;
        }

        allMarkers.forEach(m => {
            const match = m.titleLC.includes(query) ||
                m.title_newLC.includes(query) ||
                m.brandsLC.includes(query) ||
                m.addressLC.includes(query);

            if (match) {
                m.marker.addTo(layersByCategory[m.marker.options.category] || map);
                m.marker.setOpacity(1);
            } else {
                if (layersByCategory[m.marker.options.category]) {
                    layersByCategory[m.marker.options.category].removeLayer(m.marker);
                } else {
                    map.removeLayer(m.marker);
                }
            }
        });
    });

    // === ШКАЛА ===
    const scaleBar = document.getElementById('scaleBar');
    const scaleLabel = document.getElementById('scaleLabel');

    function getRoundNum(num) {
        const pow10 = Math.pow(10, Math.floor(Math.log10(num)));
        const d = num / pow10;

        if (d >= 10) return 10 * pow10;
        if (d >= 5) return 5 * pow10;
        if (d >= 3) return 3 * pow10;
        if (d >= 2) return 2 * pow10;
        return 1 * pow10;
    }

    function updateScale() {
        const centerLat = map.getCenter().lat;
        const zoom = map.getZoom();

        // Метры на один пиксель
        const metersPerPixel = 40075016.686 * Math.abs(Math.cos(centerLat * Math.PI / 180)) / Math.pow(2, zoom + 8);

        // Максимальная длина шкалы в пикселях (примерно 100)
        const maxBarWidth = 100;

        // Расстояние в метрах, соответствующее 100 пикселям
        let maxMeters = metersPerPixel * maxBarWidth;

        // Округляем до удобного значения (1, 2, 3, 5, 10, 20, ...)
        let roundedMeters = getRoundNum(maxMeters);

        // Подгоняем ширину полосы под округленное значение
        let barWidth = roundedMeters / metersPerPixel;

        // Форматируем подпись
        let label;
        if (roundedMeters < 1000) {
            label = roundedMeters + ' м';
        } else {
            label = (roundedMeters / 1000) + ' км';
        }

        scaleBar.style.width = barWidth + 'px';
        scaleLabel.textContent = label;
    }

    // Обновляем шкалу при зуме и перемещении карты
    map.on('zoom move', updateScale);

    // Инициализация
    updateScale();


});
