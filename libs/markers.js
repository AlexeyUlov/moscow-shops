const markersData = [
    // ушедшие
    {
        lat: 55.75725,
        lon: 37.6590192,
        title: 'Levis',
        popupHTML: '<img src="data/logos/jns_logo.png" width="100px">',
        iconIndex: 0,
        category: 'ушли',
        options: {
            title_new: 'Jns',
            address: 'Москва, ул. Земляной Вал, д. 33',
            brands: 'Levis, Nike, Adidas',
            contacts: '+7(495) 127-78-95, jnsonline.ru',
            website: 'https://jnsonline.ru'
        },
        okrug: 'ЦО'
    },
    {
        lat: 55.8110579,
        lon: 37.8009725,
        title: 'Zara',
        popupHTML: '<img src="data/logos/maag_logo.png" width="100px">',
        iconIndex: 0,
        category: 'ушли',
        options: {
            title_new: 'MAAG',
            address: 'Москва, Щелковское ш., д. 75',
            brands: 'Zara',
            contacts: '8 (800) 600-89-87, maag-fashion.com',
            website: 'https://maag-fashion.com'
        },
        okrug: 'ВО'
    },
    {
        lat: 55.7554841,
        lon: 37.6143306,
        title: 'Bershka',
        popupHTML: '<img src="data/logos/ecru_logo.png" width="100px">',
        iconIndex: 0,
        category: 'ушли',
        options: {
            title_new: 'Ecru',
            address: 'Москва, Манежная площадь, 1, стр. 2',
            brands: 'Bershka',
            contacts: '+7 (499) 957-88-38, ecrubrand.com',
            website: 'https://ecrubrand.com'
        },
        okrug: 'ЦО'
    },
    {
        lat: 55.7051843,
        lon: 37.6407266,
        title: 'Pull & Bear',
        popupHTML: '<img src="data/logos/dub_logo.png" width="100px">',
        iconIndex: 0,
        category: 'ушли',
        options: {
            title_new: 'DUB',
            address: 'Москва, Автозаводская ул., 18',
            brands: 'Pull & Bear',
            contacts: '+7 (499) 957-88-19, dubapparels.com',
            website: 'https://dubapparels.com'
        },
        okrug: 'ЦО'
    },

    {
        lat: 55.7051843,
        lon: 37.6407266,
        title: 'Zara',
        popupHTML: '<img src="data/logos/maag_logo.png" width="100px">',
        iconIndex: 0,
        category: 'ушли',
        options: {
            title_new: 'MAAG',
            address: 'Москва, ул. Земляной Вал, д. 33',
            brands: 'Zara',
            contacts: '8 (800) 600-89-87, maag-fashion.com',
            website: 'https://maag-fashion.com'
        },
        okrug: 'ЦО'
    },
    {
        lat: 55.7554841,
        lon: 37.6147306,
        title: 'Zara',
        popupHTML: '<img src="data/logos/maag_logo.png" width="100px">',
        iconIndex: 0,
        category: 'ушли',
        options: {
            title_new: 'MAAG',
            address: 'Москва, Манежная площадь, 1, стр. 2',
            brands: 'Zara',
            contacts: '8 (800) 600-89-87, maag-fashion.com',
            website: 'https://maag-fashion.com'
        },
        okrug: 'ЦО'
    },
    {
        lat: 55.7619798,
        lon: 37.6210821,
        title: 'Zara',
        popupHTML: '<img src="data/logos/maag_logo.png" width="100px">',
        iconIndex: 0,
        category: 'ушли',
        options: {
            title_new: 'MAAG',
            address: 'Москва, Неглинная ул., 10',
            brands: 'Zara',
            contacts: '8 (800) 600-89-87, maag-fashion.com',
            website: 'https://maag-fashion.com'
        },
        okrug: 'ЦО'
    },
    {
        lat: 55.7440113,
        lon: 37.5671697,
        title: 'Bershka',
        popupHTML: '<img src="data/logos/ecru_logo.png" width="100px">',
        iconIndex: 0,
        category: 'ушли',
        options: {
            title_new: 'Ecru',
            address: 'Москва, Площадь Киевского вокзала, 2',
            brands: 'Bershka',
            contacts: '+7 (499) 957-88-38, ecrubrand.com',
            website: 'https://ecrubrand.com'
        },
        okrug: 'ЦО'
    },
    {
        lat: 55.7051843,
        lon: 37.6407266,
        title: 'Bershka',
        popupHTML: '<img src="data/logos/ecru_logo.png" width="100px">',
        iconIndex: 0,
        category: 'ушли',
        options: {
            title_new: 'Ecru',
            address: 'Москва, Автозаводская ул., 18',
            brands: 'Bershka',
            contacts: '+7 (499) 957-88-38, ecrubrand.com',
            website: 'https://ecrubrand.com'
        },
        okrug: 'ЦО'
    },
    {
        lat: 55.7440113,
        lon: 37.5671697,
        title: 'Pull & Bear',
        popupHTML: '<img src="data/logos/dub_logo.png" width="100px">',
        iconIndex: 0,
        category: 'ушли',
        options: {
            title_new: 'DUB',
            address: 'Москва, Площадь Киевского вокзала, 2',
            brands: 'Pull & Bear',
            contacts: '+7 (499) 957-88-19, dubapparels.com',
            website: 'https://dubapparels.com'
        },
        okrug: 'ЦО'
    },
    {
        lat: 55.7903887,
        lon: 37.5318503,
        title: 'Pull & Bear',
        popupHTML: '<img src="data/logos/dub_logo.png" width="100px">',
        iconIndex: 0,
        category: 'ушли',
        options: {
            title_new: 'DUB',
            address: 'Москва, Ходынский бул., 4',
            brands: 'Pull & Bear',
            contacts: '+7 (499) 957-88-19, dubapparels.com',
            website: 'https://dubapparels.com'
        },
        okrug: 'ЗО'
    },
    {
        lat: 55.7903887,
        lon: 37.5318503,
        title: 'Levis',
        popupHTML: '<img src="data/logos/jns_logo.png" width="100px">',
        iconIndex: 0,
        category: 'ушли',
        options: {
            title_new: 'Jns',
            address: 'Москва, Ходынский бул., 4',
            brands: 'Levis, Nike, Adidas',
            contacts: '+7(495) 127-78-95, jnsonline.ru',
            website: 'https://jnsonline.ru'
        },
        okrug: 'ЗО'
    },
    {
        lat: 55.7440113,
        lon: 37.5671697,
        title: 'Levis',
        popupHTML: '<img src="data/logos/jns_logo.png" width="100px">',
        iconIndex: 0,
        category: 'ушли',
        options: {
            title_new: 'Jns',
            address: 'Москва, Площадь Киевского вокзала, 2',
            brands: 'Levis, Nike, Adidas',
            contacts: '+7(495) 127-78-95, jnsonline.ru',
            website: 'https://jnsonline.ru'
        },
        okrug: 'ЦО'
    },
    // реселлеры
    {
        lat: 55.759500,
        lon: 37.664635,
        title: 'Spin4Spin',
        popupHTML: '',
        iconIndex: 1,
        category: 'реселлеры',
        options: {
            address: 'Нижний Сусальный пер., 5, стр. 17, Москва, этаж цокольный',
            brands: 'Balenciaga, Rick Owens, Maison Margiela',
            contacts: '-',
            workingHours: 'Ежедневно, 12:00 - 21:00'
        },
        okrug: 'ЦО'
    },
    {
        lat: 55.756683,
        lon: 37.642499,
        title: 'Cab',
        popupHTML: '',
        iconIndex: 1,
        category: 'реселлеры',
        options: {
            address: 'Подкопаевский пер., 2/6с2, Москва',
            brands: 'Balenciaga, Rick Owens',
            contacts: '+7 (977) 197-90-21, https://t.me/CABstoree',
            workingHours: 'Ежедневно, 11:00 - 22:00'
        },
        okrug: 'ЦО'
    },
    {
        lat: 55.761976,
        lon: 37.612066,
        title: 'KM20',
        popupHTML: '',
        iconIndex: 1,
        category: 'реселлеры',
        options: {
            address: 'Столешников пер., 2, стр. 1, Москва',
            brands: 'Jean Paul Gaultier, Maison Margiela, Maison MIHARA YASUHIRO',
            contacts: '-',
            workingHours: 'Ежедневно, 11:00 - 23:00'
        },
        okrug: "ЦО"
    },
    {
        lat: 55.761976,
        lon: 37.612066,
        title: 'Wayoff',
        popupHTML: '',
        iconIndex: 1,
        category: 'реселлеры',
        options: {
            address: 'Тверская ул., 19, Москва',
            brands: 'Balenciaga, Burberry, Dior',
            contacts: '8 (800) 333-88-39, wayoff.ru, https://vk.com/wayoff',
            workingHours: 'Ежедневно, 10:00 - 22:00'
        },
        okrug: 'ЦО'
    },
    {
        lat: 55.784959,
        lon: 37.583303,
        title: 'Anothershop',
        popupHTML: '',
        iconIndex: 1,
        category: 'реселлеры',
        options: {
            address: '3-я ул. Ямского Поля, 2, корп. 25, Москва',
            brands: 'Maison Margiela, Balenciaga, Burberry',
            contacts: '+7 (499) 394-63-35, www.anothershop.net, https://t.me/anothershop, https://vk.com/anothershop',
            workingHours: 'Ежедневно, 13:00 - 21:00'
        },
        okrug: 'ЦО'
    },
    {
        lat: 55.835683,
        lon: 37.658259,
        title: 'Poizon Shop',
        popupHTML: '',
        iconIndex: 1,
        category: 'реселлеры',
        options: {
            address: 'просп. Мира, 188Б, корп. 3, Москва',
            brands: 'Nike, The North Face, New Balance',
            contacts: '-',
            workingHours: 'Ежедневно, 13:00 - 22:00'
        },
        okrug: 'ВО'
    },

    // бутики
    {
        lat: 55.760614,
        lon: 37.600657,
        title: 'SV77',
        popupHTML: '',
        iconIndex: 2,
        category: 'бутики',
        options: {
            address: 'Тверской бул., 14, стр. 3',
            brands: 'Balenciaga, Diesel, Maison Margiela',
            contacts: '-',
            workingHours: 'Ежедневно, 11:00 - 22:00'
        },
        okrug: 'ЦО'
    },

    // секонд-хенды
    {
        lat: 55.764198,
        lon: 37.635196,
        title: 'Second Friend Store',
        popupHTML: '',
        iconIndex: 3,
        category: 'секонд',
        options: {
            address: 'ул. Мясницкая 24/7, стр. 1, под. 12,второй этаж, код домофона 0000м. Чистые пруды, г. Москва',
            brands: 'Balenciaga, Fendi, Maison Margiela',
            contacts: '8 (800) 777-61-49, secondfriendstore.ru',
            workingHours: 'Ежедневно, 11:00 - 21:00',
            website: 'https://secondfriendstore.ru'
        },
        okrug: 'ЦО'
    }
];
