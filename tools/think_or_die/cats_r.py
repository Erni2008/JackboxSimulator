# THINK OR DIE category content, part R (list 5: questions 1-50, Russian first; duplicates of existing categories skipped).
from cats_a import cat
from cats_k import ru_rule, ru_word

# ---------- 1. Words and language ----------
ru_word("words_with_f_ru", "Name a Russian word containing the letter “Ф”", "Назовите слово, в котором есть буква «Ф»", dict(kind="CONTAINS", value="ф"))
ru_word("words_ending_tsiya_ru", "Name a Russian word ending in “-ция”", "Назовите слово, которое заканчивается на «ция»", dict(kind="ENDS_WITH", value="ция"))
ru_word("words_with_str_ru", "Name a Russian word containing “стр”", "Назовите слово, в котором есть сочетание «стр»", dict(kind="CONTAINS", value="стр"))
ru_word("words_without_a_ru", "Name a Russian word without the letter “А”", "Назовите слово, в котором нет буквы «А»", dict(kind="NOT_CONTAINS", value="а"))
ru_word("words_soft_sign_middle_ru", "Name a Russian word with a soft sign in the middle", "Назовите слово, в котором мягкий знак стоит в середине", dict(kind="MIDDLE_LETTER", value="ь"))
ru_word("words_three_consonants_ru", "Name a Russian word with three consonants in a row", "Назовите слово, в котором подряд идут три согласные буквы", dict(kind="CONSONANT_RUN", n=3))

ru_rule("nouns_six_letters_ru", "vocabulary", "Name a Russian noun with exactly six letters", "Назовите существительное, которое состоит ровно из шести букв",
    "Русское существительное (кто? что?) ровно из шести букв: машина, собака, ракета, окошко, работа, дорога, корова, музыка.",
    """Car|Машина
Dog|Собака
Rocket|Ракета
Work|Работа
Road|Дорога
Cow|Корова
Music|Музыка
Garden|Огород
Window|Окошко
Bucket|Ведёрко
Island|Остров
Wardrobe|Шкафчик
Palace|Дворец
Bridge|Мостик
Dragon|Дракон
Parrot|Попугай
Rabbit|Кролик
Spider|Паучок
Cucumber|Огурец
Carrot|Морковь
Cabbage|Капуста
Garlic|Чеснок
Apricot|Абрикос
Melon|Дынька
Doctor|Доктор
Singer|Певица
Winter|Зимушка
Rainbow|Радуга
Comet|Комета
Meadow|Поляна
Blanket|Одеяло
Teapot|Чайник
Stove|Плитка
Horse|Лошадь
Ball game|Футбол
Hockey|Хоккей
Tennis|Теннис
Boxing|Боксёр
Picture|Картина
Cinema|Кинозал
Jacket|Куртка
Scarf|Шарфик
Beads|Бусины
Coin|Монета
Wonder|Восторг
Bunny|Зайчик
Sun|Солнце
Cloud|Облако
Moon|Месяц
Spring water|Родник
Stairs|Ступень
Floor|Паркет
Door|Дверца
Key|Ключик""",
    "", dict(kind="LENGTH", n=6))

ru_rule("nouns_k_to_a_ru", "vocabulary", "Name a Russian noun that starts with “К” and ends with “А”", "Назовите существительное, которое начинается на «К» и заканчивается на «А»",
    "Русское существительное, которое начинается на «к» и оканчивается на «а»: кошка, корова, книга, кукла, каша, куртка, коза, капуста, конфета, карта.",
    """Cat|Кошка
Cow|Корова
Book|Книга
Doll|Кукла
Porridge|Каша
Jacket|Куртка
Goat|Коза
Cabbage|Капуста
Candy|Конфета
Map|Карта
Box|Коробка
Picture|Картина
Room|Комната
Team|Команда
Cart|Коляска
Crown|Корона
Ship|Каравелла
Basket|Корзина
Button|Кнопка
Skin|Кожа
Comet|Комета
Cash register|Касса
Crust|Корка
Bark|Кора
Cake|Коврижка
Pea|Крупа
Sausage|Колбаса
Potato|Картошка
Paint|Краска
Brush|Кисточка
Hen|Курица
Duck|Кряква
Cutlet|Котлета
Cup|Кружка
Mug|Кружечка
Rabbit|Крольчиха
Mare|Кобыла
Whale|Касатка
Tank|Канистра
Canal|Канава
Coat|Кофта
Cap|Кепка
Bag|Котомка
Hammock|Качалка
Roof|Крыша
Circle|Кайма
Hut|Конура
Company|Компания
Campaign|Кампания
Career|Карьера
Camera|Камера
Cassette|Кассета
Cabin|Кабина
Capsule|Капсула
Catapult|Катапульта
Catastrophe|Катастрофа
Clinic|Клиника
Column|Колонна
Culture|Культура
Poker|Кочерга
Pick|Кирка
Kasha|Кашка
Kalina|Калина
Cherry|Клубника
Lingonberry|Клюква
Sour cream|Кислятина
Claw|Клешня
Mane|Коса
Cockroach|Козявка
Ladybird|Коровка
Bench|Кушетка
Carriage|Карета
Coffin|Колода
Card|Карточка
Coupon|Квитанция
Apartment|Квартира
Square|Клетка
Sock|Колготка
Pocket watch|Кукушка
Corn|Кукуруза""",
    "", dict(kind="STARTS_ENDS", value="к|а"))

# ---------- 2. World and geography ----------
cat("million_cities", "GEOGRAPHY", "geography", "Name a city with a population over one million", "Назовите город, население которого превышает один миллион человек",
    "A city whose own population is over 1,000,000: Moscow, Saint Petersburg, Novosibirsk, Yekaterinburg, Kazan, Tokyo, London, Paris, New York, Beijing, Istanbul.",
    "Город с населением больше миллиона: Москва, Санкт Петербург, Новосибирск, Екатеринбург, Казань, Нижний Новгород, Челябинск, Красноярск, Самара, Уфа, Ростов на Дону, Омск, Краснодар, Воронеж, Пермь, Волгоград, Токио, Лондон, Париж, Нью Йорк.",
    """Moscow|Москва|мск
Saint Petersburg|Санкт Петербург|питер/спб
Novosibirsk|Новосибирск|новосиб
Yekaterinburg|Екатеринбург|екб
Kazan|Казань
Nizhny Novgorod|Нижний Новгород|нижний
Chelyabinsk|Челябинск
Krasnoyarsk|Красноярск
Samara|Самара
Ufa|Уфа
Rostov-on-Don|Ростов на Дону|ростов
Omsk|Омск
Krasnodar|Краснодар
Voronezh|Воронеж
Perm|Пермь
Volgograd|Волгоград
Minsk|Минск
Kyiv|Киев
Kharkiv|Харьков
Almaty|Алматы
Astana|Астана
Tashkent|Ташкент
Baku|Баку
Tbilisi|Тбилиси
Yerevan|Ереван
Tokyo|Токио
London|Лондон
Paris|Париж
New York|Нью Йорк
Beijing|Пекин
Shanghai|Шанхай
Istanbul|Стамбул
Berlin|Берлин
Madrid|Мадрид
Barcelona|Барселона
Rome|Рим
Milan|Милан
Vienna|Вена
Warsaw|Варшава
Budapest|Будапешт
Bucharest|Бухарест
Prague|Прага
Munich|Мюнхен
Hamburg|Гамбург
Los Angeles|Лос Анджелес
Chicago|Чикаго
Houston|Хьюстон
Toronto|Торонто
Montreal|Монреаль
Mexico City|Мехико
São Paulo|Сан Паулу
Rio de Janeiro|Рио де Жанейро
Buenos Aires|Буэнос Айрес
Lima|Лима
Bogotá|Богота
Santiago|Сантьяго
Cairo|Каир
Lagos|Лагос
Kinshasa|Киншаса
Johannesburg|Йоханнесбург
Nairobi|Найроби
Delhi|Дели
Mumbai|Мумбаи
Kolkata|Калькутта
Bangalore|Бангалор
Karachi|Карачи
Dhaka|Дакка
Bangkok|Бангкок
Jakarta|Джакарта
Manila|Манила
Seoul|Сеул
Osaka|Осака
Hong Kong|Гонконг
Singapore|Сингапур
Ho Chi Minh City|Хошимин
Hanoi|Ханой
Tehran|Тегеран
Baghdad|Багдад
Riyadh|Эр Рияд
Dubai|Дубай
Sydney|Сидней
Melbourne|Мельбурн
Guangzhou|Гуанчжоу
Shenzhen|Шэньчжэнь
Chongqing|Чунцин
Wuhan|Ухань
Ankara|Анкара
Algiers|Алжир город
Casablanca|Касабланка
Kuala Lumpur|Куала Лумпур""",
    "Tula/Тула/Sochi/Сочи/Kaliningrad/Калининград/Vladivostok/Владивосток/Irkutsk/Иркутск/Tyumen/Тюмень/Murmansk/Мурманск/Venice/Венеция/Amsterdam/Амстердам")

ru_rule("countries_with_r_ru", "geography", "Name a country with the letter “Р” in its Russian name", "Назовите страну, в названии которой есть буква «Р»",
    "Страна, в русском названии которой есть буква «р»: Россия, Франция, Германия, Бразилия, Аргентина, Турция, Греция, Корея, Израиль, Ирландия.",
    """Russia|Россия
France|Франция
Germany|Германия
Brazil|Бразилия
Argentina|Аргентина
Turkey|Турция
Greece|Греция
Korea|Корея
Israel|Израиль
Ireland|Ирландия
Iran|Иран
Iraq|Ирак
Peru|Перу
Austria|Австрия
Australia|Австралия
Norway|Норвегия
Portugal|Португалия
Croatia|Хорватия
Serbia|Сербия
Belarus|Беларусь
Bulgaria|Болгария
Romania|Румыния
Georgia|Грузия
Armenia|Армения
Kyrgyzstan|Киргизия
Turkmenistan|Туркменистан
Morocco|Марокко
Algeria|Алжир
Eritrea|Эритрея
Nigeria|Нигерия
Uruguay|Уругвай
Paraguay|Парагвай
Ecuador|Эквадор
Costa Rica|Коста Рика
Puerto Rico|Пуэрто Рико
Dominican Republic|Доминиканская Республика
Cyprus|Кипр
Greenland|Гренландия
Ukraine|Украина
Bahrain|Бахрейн
Qatar|Катар
Sri Lanka|Шри Ланка
Burundi|Бурунди
Rwanda|Руанда
Mauritania|Мавритания
North Korea|Северная Корея
South Africa|Южно Африканская Республика
Hungary|Венгрия
Netherlands|Нидерланды
Great Britain|Великобритания
Nauru|Науру
Burkina Faso|Буркина Фасо
Grenada|Гренада
Suriname|Суринам
Andorra|Андорра
Luxembourg|Люксембург
Kiribati|Кирибати
Comoros|Коморы
Brunei|Бруней""",
    "", dict(kind="CONTAINS", value="р"), type="GEOGRAPHY")

cat("seaside_cities", "GEOGRAPHY", "geography", "Name a city on the sea coast", "Назовите город, расположенный на берегу моря",
    "A city on a sea or ocean coast: Sochi, Vladivostok, Saint Petersburg (Gulf of Finland), Sevastopol, Novorossiysk, Murmansk, Kaliningrad region Baltiysk, Barcelona, Nice, Venice, Odessa, Istanbul, Rio de Janeiro.",
    "Город на берегу моря или океана: Сочи, Владивосток, Санкт Петербург, Севастополь, Новороссийск, Мурманск, Анапа, Геленджик, Ялта, Махачкала, Барселона, Ницца, Венеция, Одесса, Стамбул, Рио де Жанейро, Сидней.",
    """Sochi|Сочи
Vladivostok|Владивосток
Saint Petersburg|Санкт Петербург|питер
Sevastopol|Севастополь
Novorossiysk|Новороссийск
Murmansk|Мурманск
Anapa|Анапа
Gelendzhik|Геленджик
Yalta|Ялта
Makhachkala|Махачкала
Kerch|Керчь
Feodosia|Феодосия
Evpatoria|Евпатория
Tuapse|Туапсе
Taganrog|Таганрог
Arkhangelsk|Архангельск
Magadan|Магадан
Nakhodka|Находка
Petropavlovsk-Kamchatsky|Петропавловск Камчатский
Baltiysk|Балтийск
Svetlogorsk|Светлогорск
Zelenogradsk|Зеленоградск
Derbent|Дербент
Barcelona|Барселона
Nice|Ницца
Venice|Венеция
Odessa|Одесса
Istanbul|Стамбул
Rio de Janeiro|Рио де Жанейро
Sydney|Сидней
Marseille|Марсель
Naples|Неаполь
Genoa|Генуя
Lisbon|Лиссабон
Valencia|Валенсия
Malaga|Малага
Athens|Афины
Thessaloniki|Салоники
Dubrovnik|Дубровник
Split|Сплит
Batumi|Батуми
Sukhumi|Сухум
Antalya|Анталья
Alanya|Аланья
Izmir|Измир
Alexandria|Александрия
Hurghada|Хургада
Sharm el-Sheikh|Шарм эль Шейх
Dubai|Дубай
Abu Dhabi|Абу Даби
Mumbai|Мумбаи
Singapore|Сингапур
Hong Kong|Гонконг
Shanghai|Шанхай
Tokyo|Токио
Busan|Пусан
Miami|Майами
Los Angeles|Лос Анджелес
San Francisco|Сан Франциско
New York|Нью Йорк
Boston|Бостон
Cape Town|Кейптаун
Tel Aviv|Тель Авив
Haifa|Хайфа
Beirut|Бейрут
Helsinki|Хельсинки
Tallinn|Таллин
Riga|Рига
Copenhagen|Копенгаген
Stockholm|Стокгольм
Oslo|Осло
Gdansk|Гданьск
Amsterdam|Амстердам
Havana|Гавана
Cancún|Канкун
Acapulco|Акапулько
Honolulu|Гонолулу
Phuket|Пхукет
Pattaya|Паттайя
Nha Trang|Нячанг
Bali Denpasar|Денпасар
Monaco|Монако
Cannes|Канны
Palermo|Палермо
Valletta|Валлетта
Limassol|Лимасол
Varna|Варна
Burgas|Бургас
Constanța|Констанца""",
    "Moscow/Москва/Kazan/Казань/Paris/Париж/Berlin/Берлин/Madrid/Мадрид/Budapest/Будапешт/Irkutsk/Иркутск")

cat("former_capitals", "GEOGRAPHY", "history", "Name a city that used to be a capital", "Назовите город, который раньше был столицей государства",
    "A city that was the capital of a country or state in the past but is not now: Saint Petersburg, Kyiv for Kievan Rus counts, Vladimir, Novgorod, Kraków, Kyoto, Rio de Janeiro, Istanbul, Philadelphia, Bonn, Almaty, Calcutta, Turin.",
    "Город, который был столицей государства в прошлом: Санкт Петербург, Владимир, Новгород, Краков, Киото, Рио де Жанейро, Стамбул, Филадельфия, Бонн, Алматы, Калькутта, Турин, Самарканд, Сарай, Нара, Толедо.",
    """Saint Petersburg|Санкт Петербург|петербург/питер/ленинград
Vladimir|Владимир
Veliky Novgorod|Великий Новгород|новгород
Kraków|Краков
Kyoto|Киото
Rio de Janeiro|Рио де Жанейро
Istanbul|Стамбул|константинополь
Philadelphia|Филадельфия
Bonn|Бонн
Almaty|Алматы|алма ата
Kolkata|Калькутта
Turin|Турин
Florence|Флоренция
Samarkand|Самарканд
Sarai|Сарай Бату
Nara|Нара
Toledo|Толедо
Kaunas|Каунас
Karakorum|Каракорум
Babylon|Вавилон
Memphis|Мемфис
Thebes|Фивы
Persepolis|Персеполь
Nanjing|Нанкин
Xi'an|Сиань
Kamakura|Камакура
Ayutthaya|Аютия
Hue|Хюэ
Mandalay|Мандалай
Yangon|Янгон
Lagos|Лагос
Dar es Salaam|Дар эс Салам
Abidjan|Абиджан
Karachi|Карачи
Bursa|Бурса
Edirne|Эдирне
Aachen|Ахен
Trier|Трир
Ravenna|Равенна
Granada|Гранада
Córdoba|Кордова
Coimbra|Коимбра
Turku|Турку
Uppsala|Уппсала
Roskilde|Роскилле
Gniezno|Гнезно
Veliko Tarnovo|Велико Тырново
Mtskheta|Мцхета
Kutaisi|Кутаиси
Bakhchisaray|Бахчисарай
Kazan|Казань ханство
Astrakhan|Астрахань
Tver|Тверь
Pereslavl|Переяславль
Rostov Veliky|Ростов Великий
Suzdal|Суздаль
Kharkiv|Харьков
Calcutta|Калькутта британская
Quezon City|Кесон Сити
Belize City|Белиз Сити
Zomba|Зомба
Kyiv|Киев древнерусский
Polotsk|Полоцк
Grodno|Гродно
Vilnius Trakai|Тракай
Kuybyshev|Куйбышев""",
    "Moscow/Москва/London/Лондон/Paris/Париж/Tokyo/Токио/Berlin/Берлин")

cat("flag_green", "GEOGRAPHY", "geography", "Name a country whose flag has green", "Назовите страну, на флаге которой есть зелёный цвет",
    "A country whose national flag contains green: Italy, Brazil, Mexico, Ireland, Nigeria, Saudi Arabia, Pakistan, India, Belarus, Bulgaria, Hungary, Portugal, Iran, Kenya, South Africa, Lithuania.",
    "Страна, на флаге которой есть зелёный цвет: Италия, Бразилия, Мексика, Ирландия, Нигерия, Саудовская Аравия, Пакистан, Индия, Беларусь, Болгария, Венгрия, Португалия, Иран, Кения, ЮАР, Литва, Азербайджан, Таджикистан, Узбекистан, Туркменистан.",
    """Italy|Италия
Brazil|Бразилия
Mexico|Мексика
Ireland|Ирландия
Nigeria|Нигерия
Saudi Arabia|Саудовская Аравия
Pakistan|Пакистан
India|Индия
Belarus|Беларусь|белоруссия
Bulgaria|Болгария
Hungary|Венгрия
Portugal|Португалия
Iran|Иран
Kenya|Кения
South Africa|ЮАР|южная африка
Lithuania|Литва
Azerbaijan|Азербайджан
Tajikistan|Таджикистан
Uzbekistan|Узбекистан
Turkmenistan|Туркменистан
Bangladesh|Бангладеш
Algeria|Алжир
Libya|Ливия
Sudan|Судан
South Sudan|Южный Судан
Ethiopia|Эфиопия
Ghana|Гана
Cameroon|Камерун
Senegal|Сенегал
Mali|Мали
Guinea|Гвинея
Ivory Coast|Кот д'Ивуар
Burkina Faso|Буркина Фасо
Togo|Того
Benin|Бенин
Zambia|Замбия
Zimbabwe|Зимбабве
Mozambique|Мозамбик
Tanzania|Танзания
Malawi|Малави
Rwanda|Руанда
Burundi|Бурунди
Gabon|Габон
Congo|Республика Конго
Equatorial Guinea|Экваториальная Гвинея
Sierra Leone|Сьерра Леоне
Mauritania|Мавритания
Madagascar|Мадагаскар
Comoros|Коморы
Mauritius|Маврикий
Seychelles|Сейшелы
Afghanistan|Афганистан
Jordan|Иордания
Palestine|Палестина
United Arab Emirates|ОАЭ
Kuwait|Кувейт
Oman|Оман
Syria|Сирия
Maldives|Мальдивы
Sri Lanka|Шри Ланка
Myanmar|Мьянма
Turkmenistan flag|Туркмения
Jamaica|Ямайка
Dominica|Доминика
Grenada|Гренада
Guyana|Гайана
Suriname|Суринам
Bolivia|Боливия
Solomon Islands|Соломоновы Острова
Vanuatu|Вануату
Eritrea|Эритрея
Djibouti|Джибути
Niger|Нигер
Central African Republic|ЦАР
Lesotho|Лесото
São Tomé and Príncipe|Сан Томе и Принсипи
Guinea-Bissau|Гвинея Бисау
Saint Kitts and Nevis|Сент Китс и Невис
Saint Vincent|Сент Винсент и Гренадины
Lebanon|Ливан""",
    "Russia/Россия/France/Франция/Germany/Германия/USA/США/Japan/Япония/China/Китай/Spain/Испания/United Kingdom/Великобритания/Ukraine/Украина/Poland/Польша")

cat("metro_cities", "GEOGRAPHY", "geography", "Name a city with a metro", "Назовите город, в котором есть метро",
    "A city with a working metro (subway, underground, rapid transit): Moscow, Saint Petersburg, Novosibirsk, Yekaterinburg, Kazan, Nizhny Novgorod, Samara, London, Paris, New York, Tokyo, Minsk, Kyiv, Baku, Tbilisi, Tashkent, Almaty.",
    "Город, в котором есть метро: Москва, Санкт Петербург, Новосибирск, Екатеринбург, Казань, Нижний Новгород, Самара, Лондон, Париж, Нью Йорк, Токио, Минск, Киев, Харьков, Баку, Тбилиси, Ташкент, Алматы, Ереван.",
    """Moscow|Москва
Saint Petersburg|Санкт Петербург|питер
Novosibirsk|Новосибирск
Yekaterinburg|Екатеринбург
Kazan|Казань
Nizhny Novgorod|Нижний Новгород
Samara|Самара
London|Лондон
Paris|Париж
New York|Нью Йорк
Tokyo|Токио
Minsk|Минск
Kyiv|Киев
Kharkiv|Харьков
Dnipro|Днепр
Baku|Баку
Tbilisi|Тбилиси
Tashkent|Ташкент
Almaty|Алматы
Yerevan|Ереван
Berlin|Берлин
Munich|Мюнхен
Hamburg|Гамбург
Vienna|Вена
Prague|Прага
Budapest|Будапешт
Warsaw|Варшава
Bucharest|Бухарест
Sofia|София
Madrid|Мадрид
Barcelona|Барселона
Lisbon|Лиссабон
Rome|Рим
Milan|Милан
Naples|Неаполь
Athens|Афины
Istanbul|Стамбул
Amsterdam|Амстердам
Brussels|Брюссель
Stockholm|Стокгольм
Oslo|Осло
Copenhagen|Копенгаген
Helsinki|Хельсинки
Lyon|Лион
Marseille|Марсель
Glasgow|Глазго
Beijing|Пекин
Shanghai|Шанхай
Guangzhou|Гуанчжоу
Shenzhen|Шэньчжэнь
Hong Kong|Гонконг
Seoul|Сеул
Busan|Пусан
Pyongyang|Пхеньян
Osaka|Осака
Singapore|Сингапур
Bangkok|Бангкок
Kuala Lumpur|Куала Лумпур
Delhi|Дели
Mumbai|Мумбаи
Kolkata|Калькутта
Tehran|Тегеран
Dubai|Дубай
Doha|Доха
Riyadh|Эр Рияд
Cairo|Каир
Algiers|Алжир
Santiago|Сантьяго
Buenos Aires|Буэнос Айрес
São Paulo|Сан Паулу
Rio de Janeiro|Рио де Жанейро
Mexico City|Мехико
Caracas|Каракас
Lima|Лима
Medellín|Медельин
Chicago|Чикаго
Washington|Вашингтон
Boston|Бостон
San Francisco|Сан Франциско
Los Angeles|Лос Анджелес
Montreal|Монреаль
Toronto|Торонто
Sydney|Сидней
Taipei|Тайбэй
Manila|Манила
Jakarta|Джакарта
Ho Chi Minh City|Хошимин""",
    "Sochi/Сочи/Voronezh/Воронеж/Krasnodar/Краснодар/Vladivostok/Владивосток/Venice/Венеция/Kaliningrad/Калининград")

ru_rule("rivers_six_letters_max_ru", "geography", "Name a river whose Russian name has at most six letters", "Назовите реку, название которой состоит не более чем из шести букв",
    "Река, русское название которой не длиннее шести букв: Волга, Ока, Нил, Дон, Обь, Лена, Кама, Амур, Нева, Енисей, Днепр, Урал, Сена, Темза, Рейн, Дунай, Ганг.",
    """Volga|Волга
Oka|Ока
Nile|Нил
Don|Дон
Ob|Обь
Lena|Лена
Kama|Кама
Amur|Амур
Neva|Нева
Yenisei|Енисей
Dnieper|Днепр
Ural|Урал
Seine|Сена
Thames|Темза
Rhine|Рейн
Danube|Дунай
Ganges|Ганг
Indus|Инд
Tigris|Тигр
Euphrates|Евфрат
Congo|Конго
Niger|Нигер
Kura|Кура
Terek|Терек
Kuban|Кубань
Irtysh|Иртыш
Ishim|Ишим
Tobol|Тобол
Vyatka|Вятка
Moskva|Москва
Desna|Десна
Sozh|Сож
Pripyat|Припять
Bug|Буг
Dniester|Днестр
Prut|Прут
Vistula|Висла
Oder|Одер
Elbe|Эльба
Loire|Луара
Rhône|Рона
Po|По
Tiber|Тибр
Ebro|Эбро
Tagus|Тахо
Douro|Дуэро
Mekong|Меконг
Yangtze|Янцзы
Yana|Яна
Kolyma|Колыма
Aldan|Алдан
Vilyuy|Вилюй
Angara|Ангара
Selenga|Селенга
Shilka|Шилка
Argun|Аргунь
Ussuri|Уссури
Zeya|Зея
Bureya|Бурея
Katun|Катунь
Biya|Бия
Tom|Томь
Chulym|Чулым
Pechora|Печора
Mezen|Мезень
Onega|Онега
Svir|Свирь
Volkhov|Волхов
Luga|Луга
Narva|Нарва
Daugava|Даугава
Neman|Неман
Sura|Сура
Moksha|Мокша
Tsna|Цна
Khoper|Хопёр
Belaya|Белая
Ufa|Уфа
Iset|Исеть
Miass|Миасс
Tura|Тура
Naryn|Нарын
Ili|Или
Chu|Чу
Talas|Талас
Jordan|Иордан
Paraná|Парана
Yukon|Юкон
Hudson|Гудзон
Ohio|Огайо
Volta|Вольта""",
    "", dict(kind="MAX_LENGTH", n=6), type="GEOGRAPHY")

cat("unesco_sites", "KNOWLEDGE", "geography", "Name a UNESCO World Heritage site", "Назовите объект Всемирного наследия ЮНЕСКО",
    "A place actually inscribed on the UNESCO World Heritage List: Kremlin and Red Square, historic centre of Saint Petersburg, Lake Baikal, Kizhi, Kamchatka volcanoes, Great Wall of China, Pyramids of Giza, Taj Mahal, Colosseum (Rome historic centre), Machu Picchu, Stonehenge, Acropolis.",
    "Объект из списка Всемирного наследия ЮНЕСКО: Кремль и Красная площадь, исторический центр Санкт Петербурга, Байкал, Кижи, вулканы Камчатки, Великая Китайская стена, пирамиды Гизы, Тадж Махал, Колизей, Мачу Пикчу, Стоунхендж, Акрополь, Соловки, Казанский кремль.",
    """Moscow Kremlin and Red Square|Кремль и Красная площадь|московский кремль/красная площадь/кремль
Historic Centre of Saint Petersburg|Исторический центр Санкт Петербурга|петербург
Lake Baikal|Байкал|озеро байкал
Kizhi|Кижи|кижи погост
Volcanoes of Kamchatka|Вулканы Камчатки
Great Wall of China|Великая Китайская стена
Pyramids of Giza|Пирамиды Гизы|египетские пирамиды/пирамиды
Taj Mahal|Тадж Махал
Colosseum|Колизей
Machu Picchu|Мачу Пикчу
Stonehenge|Стоунхендж
Acropolis|Акрополь
Solovetsky Islands|Соловки|соловецкие острова
Kazan Kremlin|Казанский кремль
Novgorod monuments|Великий Новгород памятники
Golden Mountains of Altai|Золотые горы Алтая
Western Caucasus|Западный Кавказ
Curonian Spit|Куршская коса
Virgin Komi Forests|Девственные леса Коми
Wrangel Island|Остров Врангеля
Putorana Plateau|Плато Путорана
Lena Pillars|Ленские столбы
Derbent|Дербент
Bolgar|Болгар
Sviyazhsk|Свияжск
Ferapontov Monastery|Ферапонтов монастырь
Trinity Lavra|Троице Сергиева лавра
Kolomenskoye|Церковь Вознесения в Коломенском
Novodevichy Convent|Новодевичий монастырь
Yaroslavl|Исторический центр Ярославля
White Monuments of Vladimir and Suzdal|Белокаменные памятники Владимира и Суздаля
Struve Geodetic Arc|Дуга Струве
Uvs Nuur|Убсунурская котловина
Petroglyphs of Lake Onega|Петроглифы Онежского озера
Pskov school churches|Псковские храмы
Sikhote-Alin|Сихотэ Алинь
Statue of Liberty|Статуя Свободы
Grand Canyon|Гранд Каньон
Yellowstone|Йеллоустон
Eiffel Tower banks of the Seine|Берега Сены
Versailles|Версаль
Mont-Saint-Michel|Мон Сен Мишель
Venice|Венеция
Pompeii|Помпеи
Vatican City|Ватикан
Sagrada Família|Саграда Фамилия|работы гауди
Alhambra|Альгамбра
Petra|Петра
Angkor|Ангкор|ангкор ват
Chichen Itza|Чичен Ица
Easter Island|Остров Пасхи|рапа нуи
Great Barrier Reef|Большой Барьерный риф
Galápagos Islands|Галапагосы
Sydney Opera House|Сиднейский оперный театр
Forbidden City|Запретный город
Terracotta Army|Терракотовая армия
Mount Fuji|Фудзи
Himeji Castle|Химэдзи
Hagia Sophia|Святая София|айя софия
Cappadocia|Каппадокия
Prague historic centre|Исторический центр Праги
Vienna historic centre|Исторический центр Вены
Old Town of Dubrovnik|Дубровник
Cologne Cathedral|Кёльнский собор
Kilimanjaro|Килиманджаро
Serengeti|Серенгети
Victoria Falls|Водопад Виктория
Iguazu Falls|Игуасу
Rio de Janeiro landscapes|Рио де Жанейро
Bukhara|Бухара
Samarkand|Самарканд
Khiva|Хива
Mtskheta|Мцхета
Geghard|Гегард
Echmiadzin|Эчмиадзин
Old City of Baku|Ичери шехер
Kyiv Pechersk Lavra|Киево Печерская лавра
Mir Castle|Мирский замок
Nesvizh|Несвижский замок
Białowieża Forest|Беловежская пуща
Auschwitz|Освенцим
Wieliczka Salt Mine|Величка
Old Town of Tallinn|Старый Таллин
Riga historic centre|Старая Рига
Persepolis|Персеполь
Borobudur|Боробудур
Ha Long Bay|Бухта Халонг
Bagan|Баган
Lalibela|Лалибэла
Abu Simbel|Абу Симбел
Valley of the Kings|Долина царей
Göreme|Гёреме
Ephesus|Эфес
Delphi|Дельфы
Meteora|Метеоры
Olympia|Олимпия
Plitvice Lakes|Плитвицкие озёра
Jungfrau|Юнгфрау
Dolomites|Доломиты
Pisa Cathedral Square|Пизанская башня
Florence historic centre|Флоренция
Amsterdam canals|Каналы Амстердама
Kew Gardens|Кью гарденс
Tower of London|Тауэр
Westminster|Вестминстер
Palace of Westminster|Вестминстерский дворец|биг бен
Teotihuacan|Теотиуакан
Monticello|Монтичелло
Independence Hall|Индепенденс холл""",
    "Eiffel Tower/Эйфелева башня/Disneyland/Диснейленд/Moscow City/Москва Сити/Burj Khalifa/Бурдж Халифа/Times Square/Таймс сквер/Ostankino Tower/Останкинская башня")

ru_rule("cities_with_m_ru", "geography", "Name a city with the letter “М” in its Russian name", "Назовите город, название которого содержит букву «М»",
    "Город, в русском названии которого есть буква «м»: Москва, Мурманск, Минск, Омск, Томск, Пермь, Самара, Мадрид, Милан, Рим, Амстердам, Стамбул, Мюнхен, Майами.",
    """Moscow|Москва
Murmansk|Мурманск
Minsk|Минск
Omsk|Омск
Tomsk|Томск
Perm|Пермь
Samara|Самара
Madrid|Мадрид
Milan|Милан
Rome|Рим
Amsterdam|Амстердам
Istanbul|Стамбул
Munich|Мюнхен
Miami|Майами
Magadan|Магадан
Makhachkala|Махачкала
Magnitogorsk|Магнитогорск
Mytishchi|Мытищи
Smolensk|Смоленск
Tambov|Тамбов
Tyumen|Тюмень
Murom|Муром
Simferopol|Симферополь
Kemerovo|Кемерово
Mumbai|Мумбаи
Melbourne|Мельбурн
Manchester|Манчестер
Marseille|Марсель
Monaco|Монако
Montreal|Монреаль
Mecca|Мекка
Medina|Медина
Mexico City|Мехико
Manila|Манила
Mogilev|Могилёв
Malaga|Малага
Mariupol|Мариуполь
Melitopol|Мелитополь
Miass|Миасс
Michurinsk|Мичуринск
Mozhaisk|Можайск
Maykop|Майкоп
Hamburg|Гамбург
Bremen|Бремен
Rotterdam|Роттердам
Birmingham|Бирмингем
Lima|Лима
Damascus|Дамаск
Muscat|Маскат
Islamabad|Исламабад
Gyumri|Гюмри
Sumgait|Сумгаит
Shymkent|Шымкент
Almaty|Алматы
Termez|Термез
Namangan|Наманган
Samarkand|Самарканд
Batumi|Батуми
Kolomna|Коломна
Kostroma|Кострома
Klimovsk|Климовск
Domodedovo|Домодедово
Mirny|Мирный
Ramenskoye|Раменское
Kamensk|Каменск
Kamchatsky|Петропавловск Камчатский
Komsomolsk|Комсомольск на Амуре
Novomoskovsk|Новомосковск
Memphis|Мемфис
Mombasa|Момбаса
Marrakesh|Марракеш
Mogadishu|Могадишо
Maputo|Мапуту
Montevideo|Монтевидео
Medellín|Медельин
Mendoza|Мендоса
Manaus|Манаус
Macau|Макао
Mandalay|Мандалай
Malmö|Мальмё
Mainz|Майнц
Metz|Мец
Mantua|Мантуя
Messina|Мессина
Modena|Модена""",
    "", dict(kind="CONTAINS", value="м"), type="GEOGRAPHY")

# ---------- 3. Cinema and TV ----------
cat("animal_title_films", "KNOWLEDGE", "movies_tv", "Name a film with an animal in its title", "Назовите фильм, в названии которого упоминается животное",
    "A real film whose title names an animal: The Lion King, Jaws no, Kung Fu Panda, Madagascar no, The Wolf of Wall Street, Black Swan, The Silence of the Lambs, Hachi no, Ice Age no, Puss in Boots, Ratatouille no, King Kong, Beethoven no.",
    "Реальный фильм, в названии которого есть животное: Король Лев, Кунг фу Панда, Волк с Уолл стрит, Чёрный лебедь, Молчание ягнят, Кот в сапогах, Кинг Конг, Собачье сердце, Ёжик в тумане, Собака Баскервилей.",
    """The Lion King|Король Лев
Kung Fu Panda|Кунг фу Панда
The Wolf of Wall Street|Волк с Уолл стрит
Black Swan|Чёрный лебедь
The Silence of the Lambs|Молчание ягнят
Puss in Boots|Кот в сапогах
King Kong|Кинг Конг
Heart of a Dog|Собачье сердце
Hedgehog in the Fog|Ёжик в тумане
The Hound of the Baskervilles|Собака Баскервилей
Fantastic Mr. Fox|Бесподобный мистер Фокс
Snakes on a Plane|Змеи в самолёте
The Birds|Птицы
Godzilla vs. Kong|Годзилла против Конга
Planet of the Apes|Планета обезьян
Rise of the Planet of the Apes|Восстание планеты обезьян
The Elephant Man|Человек слон
Raging Bull|Бешеный бык
Reservoir Dogs|Бешеные псы
Isle of Dogs|Остров собак
The Fly|Муха
Spider-Man|Человек паук
Batman|Бэтмен
Ant-Man|Человек муравей
Catwoman|Женщина кошка
Black Panther|Чёрная пантера
Wolverine|Росомаха
The Wolfman|Человек волк
Teen Wolf|Волчонок
Dances with Wolves|Танцы с волками
White Fang|Белый клык
Free Willy|Освободите Вилли
Babe|Бэйб
Mouse Hunt|Мышиная охота
Chicken Run|Побег из курятника
Bee Movie|Би муви
Turtles|Черепашки ниндзя
Cats & Dogs|Кошки против собак
Cats|Кошки
A Dog's Purpose|Собачья жизнь
Water for Elephants|Воды слонам
War Horse|Боевой конь
The Horse Whisperer|Заклинатель лошадей
The Black Stallion|Чёрный скакун
101 Dalmatians|101 далматинец
Anaconda|Анаконда
Piranha|Пиранья
Crocodile Dundee|Крокодил Данди
Alligator|Аллигатор
Arachnophobia|Арахнофобия
Eight Legged Freaks|Атака пауков
The Bear|Медведь
Brother Bear|Братец медвежонок
Paddington Bear|Медвежонок Паддингтон
Jojo Rabbit|Кролик Джоджо
Who Framed Roger Rabbit|Кто подставил кролика Роджера
Peter Rabbit|Кролик Питер
One Flew Over the Cuckoo's Nest|Пролетая над гнездом кукушки
The Pelican Brief|Дело о пеликанах
To Kill a Mockingbird|Убить пересмешника
The Maltese Falcon|Мальтийский сокол
Where Eagles Dare|Куда залетают орлы
The Eagle Has Landed|Орёл приземлился
Eddie the Eagle|Эдди Орёл
The Crow|Ворон
Raven|Ворон По
Birdman|Бёрдмэн
Ladyhawke|Леди Ястреб
Black Hawk Down|Падение Чёрного ястреба
Dog Day Afternoon|Собачий полдень
Hachi: A Dog's Tale|Хатико самый верный друг
Wolf Children|Волчьи дети
White Bim Black Ear|Белый Бим Чёрное ухо
Chuck the pony|Мой маленький пони
Mimino|Мимино
Gold Fish|Золотая рыбка
Pike|По щучьему велению
Little Humpbacked Horse|Конёк Горбунок
The Frog Princess|Царевна лягушка
Grey Wolf|Иван Царевич и Серый Волк
Masha and the Bear|Маша и Медведь
Three Little Pigs|Три поросёнка
Kitten Woof|Котёнок по имени Гав
The Ugly Duckling|Гадкий утёнок
The Fox and the Hound|Лис и пёс""",
    "Madagascar/Мадагаскар/Ice Age/Ледниковый период/Ratatouille/Рататуй/Shrek/Шрек/Jurassic Park/Парк юрского периода/Finding Nemo/В поисках Немо/Jaws/Челюсти/Bambi/Бэмби/Dumbo/Дамбо")

cat("marvel_actors", "KNOWLEDGE", "movies_tv", "Name an actor who appeared in Marvel films", "Назовите актёра, который снимался в фильмах Marvel",
    "A real actor or actress who played a role in a Marvel film (MCU, X-Men, Spider-Man, Venom, Deadpool, Fantastic Four, Blade): Robert Downey Jr., Chris Evans, Chris Hemsworth, Scarlett Johansson, Tom Holland, Hugh Jackman, Ryan Reynolds, Benedict Cumberbatch.",
    "Реальный актёр или актриса, сыгравшие в фильмах Marvel: Роберт Дауни младший, Крис Эванс, Крис Хемсворт, Скарлетт Йоханссон, Том Холланд, Хью Джекман, Райан Рейнольдс, Бенедикт Камбербэтч, Марк Руффало, Том Хиддлстон, Зендея, Тоби Магуайр.",
    """Robert Downey Jr.|Роберт Дауни младший|дауни/роберт дауни
Chris Evans|Крис Эванс
Chris Hemsworth|Крис Хемсворт|хемсворт
Scarlett Johansson|Скарлетт Йоханссон|йоханссон
Tom Holland|Том Холланд
Hugh Jackman|Хью Джекман|джекман
Ryan Reynolds|Райан Рейнольдс|рейнольдс
Benedict Cumberbatch|Бенедикт Камбербэтч|камбербэтч
Mark Ruffalo|Марк Руффало
Tom Hiddleston|Том Хиддлстон
Zendaya|Зендея
Tobey Maguire|Тоби Магуайр
Andrew Garfield|Эндрю Гарфилд
Chris Pratt|Крис Пратт
Zoe Saldaña|Зои Салдана
Dave Bautista|Дэйв Батиста
Vin Diesel|Вин Дизель
Bradley Cooper|Брэдли Купер
Paul Rudd|Пол Радд
Jeremy Renner|Джереми Реннер
Samuel L. Jackson|Сэмюэл Л Джексон|сэмюэл джексон
Elizabeth Olsen|Элизабет Олсен
Paul Bettany|Пол Беттани
Sebastian Stan|Себастиан Стэн
Anthony Mackie|Энтони Маки
Don Cheadle|Дон Чидл
Gwyneth Paltrow|Гвинет Пэлтроу
Natalie Portman|Натали Портман
Anthony Hopkins|Энтони Хопкинс
Idris Elba|Идрис Эльба
Chadwick Boseman|Чедвик Боузман
Letitia Wright|Летиция Райт
Lupita Nyong'o|Лупита Нионго
Michael B. Jordan|Майкл Б Джордан
Brie Larson|Бри Ларсон
Josh Brolin|Джош Бролин
Tom Hardy|Том Харди
Jared Leto|Джаред Лето
Willem Dafoe|Уиллем Дефо
Alfred Molina|Альфред Молина
Jamie Foxx|Джейми Фокс
J. K. Simmons|Джей Кей Симмонс
Patrick Stewart|Патрик Стюарт
Ian McKellen|Иэн Маккеллен
James McAvoy|Джеймс Макэвой
Michael Fassbender|Майкл Фассбендер
Jennifer Lawrence|Дженнифер Лоуренс
Halle Berry|Холли Берри
Famke Janssen|Фамке Янссен
Sophie Turner|Софи Тёрнер
Nicholas Hoult|Николас Холт
Evan Peters|Эван Питерс
Wesley Snipes|Уэсли Снайпс
Nicolas Cage|Николас Кейдж
Ben Affleck|Бен Аффлек
Jennifer Garner|Дженнифер Гарнер
Jessica Alba|Джессика Альба
Ioan Gruffudd|Иоан Гриффит
Miles Teller|Майлз Теллер
Pedro Pascal|Педро Паскаль
Vanessa Kirby|Ванесса Кирби
Florence Pugh|Флоренс Пью
Simu Liu|Симу Лиу
Awkwafina|Аквафина
Tessa Thompson|Тесса Томпсон
Taika Waititi|Тайка Вайтити
Cate Blanchett|Кейт Бланшетт
Karen Gillan|Карен Гиллан
Pom Klementieff|Пом Клементьефф
Michael Keaton|Майкл Китон
Jon Favreau|Джон Фавро
Benicio del Toro|Бенисио дель Торо
Kurt Russell|Курт Рассел
Sylvester Stallone|Сильвестр Сталлоне
Mads Mikkelsen|Мадс Миккельсен
Tilda Swinton|Тильда Суинтон
Rachel McAdams|Рэйчел Макадамс
Chiwetel Ejiofor|Чиветел Эджиофор
Oscar Isaac|Оскар Айзек
Ethan Hawke|Итан Хоук
Hailee Steinfeld|Хейли Стайнфелд
Iman Vellani|Иман Веллани
Jonathan Majors|Джонатан Мэйджорс
Harrison Ford|Харрисон Форд
Morena Baccarin|Морена Баккарин
Dakota Johnson|Дакота Джонсон
Aaron Taylor-Johnson|Аарон Тейлор Джонсон
Woody Harrelson|Вуди Харрельсон
Michelle Williams|Мишель Уильямс
Stan Lee|Стэн Ли""",
    "Christian Bale/Кристиан Бейл/Henry Cavill/Генри Кавилл/Gal Gadot/Галь Гадот/Margot Robbie/Марго Робби/Leonardo DiCaprio/Леонардо Ди Каприо/Johnny Depp/Джонни Депп")
