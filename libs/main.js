// Категории слоёв
const layersByCategory = {
    'ушли': L.layerGroup(),
    'реселлеры': L.layerGroup(),
    'бутики': L.layerGroup(),
    'секонд': L.layerGroup()
};

function createMarker(lat, lon, title, popup, icon, category) {
    const marker = L.marker([lat, lon], { title, icon }).bindPopup(popup);
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

// Добавляем маркеры
createMarker(55.75725, 37.6590192, 'Levis (Атриум)',
    '<b>Levis</b> → JNS<br><b>Адрес: </b>Москва, ул. Земляной Вал, д. 33<br><b>Представленные бренды: </b>Levis, Nike, Adidas<br><b>Контакты: </b>+7(495) 127-78-95, jnsonline.ru<br><img src="data/logos/jns_logo.png" width="100px">',
    parkIconArray[0], 'ушли');
createMarker(55.8110579, 37.8009725, 'Zara (Щелковский)',
    '<b>Zara</b> → MAAG<br><b>Адрес: </b>Москва, Щелковское ш., д. 75<br><b>Представленные бренды: </b>Zara<br><b>Контакты: </b>8 (800) 600-89-87, maag-fashion.com<br><img src="data/logos/maag_logo.png" width="100px">',
    parkIconArray[0], 'ушли');
createMarker(55.7554841, 37.6143306, 'Bershka (Охотный ряд)',
    '<b>Bershka</b> → Ecru<br><b>Адрес: </b>Москва, Манежная площадь, 1, стр. 2<br><b>Представленные бренды: </b>Bershka<br><b>Контакты: </b>+7 (499) 957-88-38, ecrubrand.com<br><img src="data/logos/ecru_logo.png" width="100px">',
    parkIconArray[0], 'ушли');
createMarker(55.7051843, 37.6407266, 'Pull & Bear (Ривьера)',
    '<b>Pull & Bear</b> → Dub<br><b>Адрес: </b>Москва, Автозаводская ул., 18<br><b>Представленные бренды: </b>Pull & Bear<br><b>Контакты: </b>+7 (499) 957-88-19, dubapparels.com<br><img src="data/logos/dub_logo.png" width="100px">',
    parkIconArray[0], 'ушли');
createMarker(55.7051843, 37.6407266, 'Zara (Атриум)',
    '<b>Zara</b> → MAAG<br><b>Адрес: </b>Москва, ул. Земляной Вал, д. 33<br><b>Представленные бренды: </b>Zara<br><b>Контакты: </b>8 (800) 600-89-87, maag-fashion.com<br><img src="data/logos/maag_logo.png" width="100px">',
    parkIconArray[0], 'ушли');
createMarker(55.7554841, 37.6147306, 'Zara (Охотный ряд)',
    '<b>Zara</b> → MAAG<br><b>Адрес: </b>Москва, Манежная площадь, 1, стр. 2<br><b>Представленные бренды: </b>Zara<br><b>Контакты: </b>8 (800) 600-89-87, maag-fashion.com<br><img src="data/logos/maag_logo.png" width="100px">',
    parkIconArray[0], 'ушли');
createMarker(55.7619798, 37.6210821, 'Zara (Неглинная 10)',
    '<b>Zara</b> → MAAG<br><b>Адрес: </b>Москва, Неглинная ул., 10<br><b>Представленные бренды: </b>Zara<br><b>Контакты: </b>8 (800) 600-89-87, maag-fashion.com<br><img src="data/logos/maag_logo.png" width="100px">',
    parkIconArray[0], 'ушли');
createMarker(55.7440113, 37.5671697, 'Bershka (Пл. Киевского вокзала)',
    '<b>Bershka</b> → Ecru<br><b>Адрес: </b>Москва, Площадь Киевского вокзала, 2<br><b>Представленные бренды: </b>Bershka<br><b>Контакты: </b>+7 (499) 957-88-38, ecrubrand.com<br><img src="data/logos/ecru_logo.png" width="100px">',
    parkIconArray[0], 'ушли');
createMarker(55.7051843, 37.6407266, 'Bershka (Ривьера)',
    '<b>Bershka</b> → Ecru<br><b>Адрес: </b>Москва, Автозаводская ул., 18<br><b>Представленные бренды: </b>Bershka<br><b>Контакты: </b>+7 (499) 957-88-38, ecrubrand.com<br><img src="data/logos/ecru_logo.png" width="100px">',
    parkIconArray[0], 'ушли');  
createMarker(55.7440113, 37.5671697, 'Pull & Bear (Площадь Киевского возкала)',
    '<b>Pull & Bear</b> → Dub<br><b>Адрес: </b>Москва, Площадь Киевского вокзала, 2<b>Представленные бренды: </b>Pull & Bear<br><b>Контакты: </b>+7 (499) 957-88-19, dubapparels.com<br><img src="data/logos/dub_logo.png" width="100px">',
    parkIconArray[0], 'ушли');
createMarker(55.7903887, 37.5318503, 'Pull & Bear (Авиапарк)',
    '<b>Pull & Bear</b> → Dub<br><b>Адрес: </b>Москва, Ходынский бул., 4<b>Представленные бренды: </b>Pull & Bear<br><b>Контакты: </b>+7 (499) 957-88-19, dubapparels.com<br><img src="data/logos/dub_logo.png" width="100px">',
    parkIconArray[0], 'ушли');
createMarker(55.7903887, 37.5318503, 'Levis (Авиапарк)',
    '<b>Levis</b> → JNS<br><b>Адрес: </b>Москва, Ходынский бул., 4<b>Представленные бренды: </b>Levis, Nike, Adidas<br><b>Контакты: </b>+7(495) 127-78-95, jnsonline.ru<br><img src="data/logos/jns_logo.png" width="100px">',
    parkIconArray[0], 'ушли');
createMarker(55.7440113, 37.5671697, 'Levis (Пл. Киевского вокзала)',
    '<b>Levis</b> → JNS<br><b>Адрес: </b>Москва, Площадь Киевского вокзала, 2<b>Представленные бренды: </b>Levis, Nike, Adidas<br><b>Контакты: </b>+7(495) 127-78-95, jnsonline.ru<br><img src="data/logos/jns_logo.png" width="100px">',
    parkIconArray[0], 'ушли');

// Реселлеры
createMarker(55.759500, 37.664635, 'Spin4Spin',
    '<b>Название:</b> Spin4Spin<br><b>Адрес: </b>Нижний Сусальный пер., 5, стр. 17, Москва, этаж цокольный<b>Представленные бренды: </b>Balenciaga, Rick Owens, Maison Margiela<br><b>Контакты: </b>+7(495) 127-78-95, jnsonline.ru<br><img src="data/logos/jns_logo.png" width="100px">',
    parkIconArray[1], 'ушли');

// Пример реселлера:
createMarker(55.75, 37.61, 'Реселлер XYZ',
    'Пример реселлера', parkIconArray[1], 'реселлеры');

// Пример бутика:
createMarker(55.74, 37.63, 'Бутик ABC',
    'Пример бутика', parkIconArray[2], 'бутики');

// Пример секонд хенда:
createMarker(55.76, 37.66, 'Секонд Хенд №1',
    'Пример секонд-хенда', parkIconArray[3], 'секонд');

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