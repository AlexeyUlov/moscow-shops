// Категории слоёв
const layersByCategory = {
    'ушли': L.layerGroup(),
    'реселлеры': L.layerGroup(),
    'бутики': L.layerGroup(),
    'секонд': L.layerGroup()
};

function createMarker(lat, lon, title, popupHTML, icon, category) {
    const marker = L.marker([lat, lon], { title, icon });

    marker.on('click', () => {
        const panel = document.getElementById('shop-info-panel');
        const body = document.getElementById('shop-info-body');
        panel.classList.add('show');
        body.innerHTML = `<h3>${title}</h3>${popupHTML}`;
    });

    layersByCategory[category].addLayer(marker);
}


// Иконки
var parkIconClass = L.Icon.extend({
    options: {
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, 0],
    }
});

var parkIconArray = [
    new parkIconClass({iconUrl:'./data/icons/blue.png'}),
    new parkIconClass({iconUrl:'./data/icons/green.png'}),
    new parkIconClass({iconUrl:'./data/icons/orange.png'}),
    new parkIconClass({iconUrl:'./data/icons/red.png'}),
]



// Отображаем всё по умолчанию
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
