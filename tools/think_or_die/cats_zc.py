# THINK OR DIE category content, part ZC (list 8, questions 41-70; compact lists, the AI judges the rest).
from cats_a import cat


def k(id, group, en, ru, crit, lines, inv="", type="KNOWLEDGE", **kw):
    cat(id, type, group, en, ru, crit, crit, lines, inv, **kw)


def L(s):
    return "\n".join(x.strip() for x in s.strip().split(";") if x.strip())


# ---------- 5. Space, physics, chemistry ----------
k("moons_not_earth_jupiter", "science", "Name a natural satellite of a planet other than Earth and Jupiter", "Назовите естественный спутник планеты, кроме Земли и Юпитера",
  "A real natural moon of Mars, Saturn, Uranus, Neptune or Pluto: Phobos, Deimos, Titan, Enceladus, Rhea, Iapetus, Dione, Tethys, Mimas, Hyperion, Phoebe, Miranda, Ariel, Umbriel, Titania, Oberon, Triton, Nereid, Proteus, Charon. Moons of Jupiter (Io, Europa, Ganymede, Callisto) and the Moon are wrong.",
  L("Phobos|Фобос; Deimos|Деймос; Titan|Титан; Enceladus|Энцелад; Rhea|Рея; Iapetus|Япет; Dione|Диона; Tethys|Тефия; Mimas|Мимас; Hyperion|Гиперион; Phoebe|Феба; Janus|Янус; Epimetheus|Эпиметей; "
    "Pan|Пан; Atlas|Атлас; Prometheus|Прометей; Pandora|Пандора; Helene|Елена; Miranda|Миранда; Ariel|Ариэль; Umbriel|Умбриэль; Titania|Титания; Oberon|Оберон; Puck|Пак; Cordelia|Корделия; "
    "Ophelia|Офелия; Triton|Тритон; Nereid|Нереида; Proteus|Протей; Larissa|Ларисса; Galatea|Галатея; Despina|Деспина; Thalassa|Таласса; Naiad|Наяда; Charon|Харон; Nix|Никта; Hydra|Гидра; "
    "Kerberos|Кербер; Styx|Стикс; Dysnomia|Дисномия; Hi'iaka|Хииака; Namaka|Намака; Calypso|Калипсо; Telesto|Телесто; Ymir|Имир; Paaliaq|Паалиак"),
  "Moon/Луна/Io/Ио/Europa/Европа/Ganymede/Ганимед/Callisto/Каллисто/Amalthea/Амальтея/Sun/Солнце/Mars/Марс")

k("alloy_elements", "science", "Name a chemical element used in common metal alloys", "Назовите химический элемент, который входит в состав распространённых металлических сплавов",
  "A chemical element that is part of common alloys (steel, bronze, brass, duralumin, solder, stainless steel, white gold...): iron, carbon, chromium, nickel, copper, tin, zinc, aluminium, magnesium, manganese, silicon, titanium, vanadium, molybdenum, tungsten, cobalt, lead, silver, gold, palladium, niobium.",
  L("Iron|Железо; Carbon|Углерод; Chromium|Хром; Nickel|Никель; Copper|Медь; Tin|Олово; Zinc|Цинк; Aluminium|Алюминий; Magnesium|Магний; Manganese|Марганец; Silicon|Кремний; Titanium|Титан; "
    "Vanadium|Ванадий; Molybdenum|Молибден; Tungsten|Вольфрам; Cobalt|Кобальт; Lead|Свинец; Silver|Серебро; Gold|Золото; Palladium|Палладий; Niobium|Ниобий; Platinum|Платина; Beryllium|Бериллий; "
    "Bismuth|Висмут; Antimony|Сурьма; Cadmium|Кадмий; Lithium|Литий; Zirconium|Цирконий; Boron|Бор; Phosphorus|Фосфор; Sulfur|Сера; Nitrogen|Азот; Tantalum|Тантал; Rhodium|Родий; Iridium|Иридий; "
    "Osmium|Осмий; Gallium|Галлий; Indium|Индий; Scandium|Скандий; Yttrium|Иттрий; Neodymium|Неодим; Samarium|Самарий; Rhenium|Рений; Hafnium|Гафний; Germanium|Германий; Calcium|Кальций; Cerium|Церий; Mercury|Ртуть"),
  "Oxygen/Кислород/Hydrogen/Водород/Helium/Гелий/Neon/Неон/Chlorine/Хлор/Argon/Аргон")

k("named_stars", "science", "Name a star that has its own name", "Назовите звезду, у которой есть собственное имя",
  "A real star with a proper name: Sun, Sirius, Polaris, Vega, Betelgeuse, Rigel, Aldebaran, Arcturus, Capella, Altair, Deneb, Antares, Spica, Procyon, Canopus, Alpha Centauri (Rigil Kentaurus), Proxima Centauri, Castor, Pollux, Regulus, Mira, Algol, Fomalhaut, Bellatrix, Alcyone.",
  L("Sun|Солнце; Sirius|Сириус; Polaris|Полярная звезда; Vega|Вега; Betelgeuse|Бетельгейзе; Rigel|Ригель; Aldebaran|Альдебаран; Arcturus|Арктур; Capella|Капелла; Altair|Альтаир; Deneb|Денеб; "
    "Antares|Антарес; Spica|Спика; Procyon|Процион; Canopus|Канопус; Alpha Centauri|Альфа Центавра; Proxima Centauri|Проксима Центавра; Castor|Кастор; Pollux|Поллукс; Regulus|Регул; Mira|Мира; "
    "Algol|Алголь; Fomalhaut|Фомальгаут; Bellatrix|Беллатрикс; Alcyone|Альциона; Achernar|Ахернар; Hadar|Хадар; Acrux|Акрукс; Mimosa|Мимоза; Shaula|Шаула; Alnilam|Альнилам; Alnitak|Альнитак; "
    "Mintaka|Минтака; Saiph|Саиф; Dubhe|Дубхе; Merak|Мерак; Alioth|Алиот; Mizar|Мицар; Alcor|Алькор; Alkaid|Бенетнаш|алькаид; Thuban|Тубан; Kochab|Кохаб; Schedar|Шедар; Mirach|Мирах; "
    "Alpheratz|Альферац; Hamal|Хамаль; Menkar|Менкар; Electra|Электра; Maia|Майя; Merope|Меропа; Atlas|Атлас; Pleione|Плейона; Albireo|Альбирео; Sadr|Садр; Eltanin|Этамин; Rasalhague|Рас Альхаге; "
    "Barnard's Star|Звезда Барнарда; Tau Ceti|Тау Кита; Epsilon Eridani|Эпсилон Эридана; Wolf 359|Вольф 359; Eta Carinae|Эта Киля; VY Canis Majoris|Большого Пса VY; UY Scuti|UY Щита; Tabby's Star|Звезда Табби"))

k("conductive_materials", "science", "Name a material that conducts electricity", "Назовите материал, который проводит электрический ток",
  "A material that conducts electric current: copper, silver, gold, aluminium, iron, steel, graphite, salt water, mercury, brass, bronze, tin, lead, zinc, nickel, platinum, tungsten, carbon fibre, graphene, human body, earth (soil), seawater, plasma, electrolyte, acid solution, nichrome, titanium.",
  L("Copper|Медь; Silver|Серебро; Gold|Золото; Aluminium|Алюминий; Iron|Железо; Steel|Сталь; Graphite|Графит; Salt water|Солёная вода; Mercury|Ртуть; Brass|Латунь; Bronze|Бронза; Tin|Олово; Lead|Свинец; "
    "Zinc|Цинк; Nickel|Никель; Platinum|Платина; Tungsten|Вольфрам; Carbon fibre|Углеволокно; Graphene|Графен; Human body|Тело человека; Soil|Земля|почва; Seawater|Морская вода; Plasma|Плазма; "
    "Electrolyte|Электролит; Acid|Кислота|раствор кислоты; Nichrome|Нихром; Titanium|Титан; Metal|Металл; Wire|Провод; Water|Вода; Tap water|Водопроводная вода;  Coal|Уголь; "
    "Silicon|Кремний; Germanium|Германий; Semiconductors|Полупроводники; Constantan|Константан; Chromium|Хром; Cobalt|Кобальт; Lithium|Литий; Sodium|Натрий; Potassium|Калий; Magnesium|Магний; "
    "Calcium|Кальций; Conductive ink|Токопроводящие чернила; Conductive paint|Токопроводящая краска; Wet wood|Мокрое дерево; Blood|Кровь; Sweat|Пот; Saline|Физраствор; Lemon juice|Лимонный сок; "
    "Potato|Картофель; Pickle|Солёный огурец; Fruit|Фрукты; Foil|Фольга; Coin|Монета; Nail|Гвоздь; Spoon|Ложка; Superconductor|Сверхпроводник"),
  "Rubber/Резина/Glass/Стекло/Plastic/Пластик/Wood/Дерево/Porcelain/Фарфор/Paper/Бумага/Air/Воздух")

k("element_symbol_c", "science", "Name a chemical element whose symbol starts with the Latin letter C", "Назовите химический элемент, обозначение которого начинается на латинскую букву C",
  "A chemical element whose symbol starts with C: carbon (C), calcium (Ca), cadmium (Cd), cerium (Ce), californium (Cf), chlorine (Cl), curium (Cm), copernicium (Cn), cobalt (Co), chromium (Cr), caesium (Cs), copper (Cu).",
  L("Carbon|Углерод|c; Calcium|Кальций|ca; Cadmium|Кадмий|cd; Cerium|Церий|ce; Californium|Калифорний|cf; Chlorine|Хлор|cl; Curium|Кюрий|cm; Copernicium|Коперниций|cn; Cobalt|Кобальт|co; "
    "Chromium|Хром|cr; Caesium|Цезий|cs; Copper|Медь|cu"),
  "Calcite/Кальцит/Krypton/Криптон/Potassium/Калий/Silicon/Кремний", exhaustive=True, allowUnknown=False)

k("space_telescopes_observatories", "science", "Name a famous space telescope or ground observatory", "Назовите известный космический телескоп или наземную обсерваторию",
  "A real telescope or astronomical observatory: Hubble, James Webb, Kepler, Spitzer, Chandra, TESS, Gaia, Spektr-RG, Herschel, Arecibo, FAST, Very Large Telescope, Keck, Mauna Kea, Palomar, ALMA, Pulkovo Observatory, BTA (Zelenchukskaya), Greenwich, Mount Wilson, Jodrell Bank, Event Horizon Telescope.",
  L("Hubble|Хаббл; James Webb|Джеймс Уэбб|уэбб; Kepler|Кеплер; Spitzer|Спитцер; Chandra|Чандра; TESS|Тесс; Gaia|Гайя; Spektr-RG|Спектр РГ; Herschel|Гершель; Arecibo|Аресибо; FAST|Фаст; "
    "Very Large Telescope|Очень большой телескоп|vlt; Keck|Кек; Mauna Kea|Мауна Кеа; Palomar|Паломар; ALMA|Алма; Pulkovo Observatory|Пулковская обсерватория; BTA|БТА|большой телескоп азимутальный; "
    "Greenwich|Гринвич; Mount Wilson|Маунт Вилсон; Jodrell Bank|Джодрелл Бэнк; Event Horizon Telescope|Телескоп горизонта событий; Euclid|Евклид; Planck|Планк; WMAP|Вмап; Fermi|Ферми; "
    "Radioastron|Радиоастрон; Spektr-R|Спектр Р; RATAN-600|Ратан 600; Special Astrophysical Observatory|САО РАН; Crimean Observatory|Крымская обсерватория; Terskol|Терскол; Gran Telescopio Canarias|Гран Канария; "
    "Subaru|Субару; Gemini|Джемини; Extremely Large Telescope|Чрезвычайно большой телескоп; Vera Rubin|Вера Рубин; LIGO|Лиго; IceCube|Айс кьюб; Yerkes|Йеркс; Lick|Лик; Lowell|Лоуэлл; Parkes|Паркс; "
    "Green Bank|Грин бэнк; Effelsberg|Эффельсберг; SOFIA|София; Uraniborg|Ураниборг; Ulugh Beg|Обсерватория Улугбека; Jantar Mantar|Джантар Мантар; Kitt Peak|Китт Пик; Cerro Tololo|Серро Тололо; La Silla|Ла Силья"))

k("room_temp_liquids", "science", "Name a substance that is liquid at room temperature", "Назовите вещество, которое при комнатной температуре жидкое",
  "A substance liquid at about 20-25°C: water, mercury, alcohol (ethanol), oil, petrol, milk, vinegar, acetone, glycerin, kerosene, juice, bromine, honey (viscous), blood, olive oil, diesel, gasoline, sulfuric acid, liquid soap, ammonia solution, nitroglycerin, gallium no (melts at 30).",
  L("Water|Вода; Mercury|Ртуть; Ethanol|Спирт|этанол; Oil|Масло|растительное масло; Petrol|Бензин; Milk|Молоко; Vinegar|Уксус; Acetone|Ацетон; Glycerin|Глицерин; Kerosene|Керосин; Juice|Сок; "
    "Bromine|Бром; Honey|Мёд; Blood|Кровь; Olive oil|Оливковое масло; Diesel|Дизель|солярка; Sulfuric acid|Серная кислота; Liquid soap|Жидкое мыло; Ammonia solution|Нашатырь; Nitroglycerin|Нитроглицерин; "
    "Crude oil|Нефть; Tea|Чай; Coffee|Кофе; Wine|Вино; Beer|Пиво; Vodka|Водка; Kefir|Кефир; Soy sauce|Соевый соус; Ink|Чернила; Paint|Краска; Varnish|Лак; Shampoo|Шампунь; Perfume|Духи; "
    "Hydrogen peroxide|Перекись водорода; Hydrochloric acid|Соляная кислота; Nitric acid|Азотная кислота; Methanol|Метанол; Benzene|Бензол; Toluene|Толуол; Turpentine|Скипидар; Antifreeze|Антифриз; "
    "Motor oil|Моторное масло; Brake fluid|Тормозная жидкость; Saliva|Слюна; Sweat|Пот; Tears|Слёзы; Urine|Моча; Lemonade|Лимонад; Cola|Кола; Syrup|Сироп"),
  "Ice/Лёд/Iron/Железо/Salt/Соль/Sugar/Сахар/Oxygen/Кислород/Butter/Масло сливочное/Chocolate/Шоколад/Gallium/Галлий")

k("em_radiation_types", "science", "Name a type of electromagnetic radiation", "Назовите разновидность электромагнитного излучения",
  "A real type of electromagnetic radiation: radio waves, microwaves, infrared, visible light, ultraviolet, X-rays, gamma rays, terahertz radiation, long waves, short waves, VHF, UHF, cosmic microwave background, laser light, sunlight, thermal radiation.",
  L("Radio waves|Радиоволны; Microwaves|Микроволны|свч; Infrared|Инфракрасное излучение|ик; Visible light|Видимый свет|свет; Ultraviolet|Ультрафиолет|уф; X-rays|Рентгеновское излучение|рентген; "
    "Gamma rays|Гамма излучение; Terahertz|Терагерцовое излучение; Long waves|Длинные волны; Short waves|Короткие волны; VHF|Укв; UHF|Дециметровые волны; Cosmic microwave background|Реликтовое излучение; "
    "Laser light|Лазерное излучение; Sunlight|Солнечный свет; Thermal radiation|Тепловое излучение; Medium waves|Средние волны; Millimeter waves|Миллиметровые волны; Red light|Красный свет; "
    "Blue light|Синий свет; Near infrared|Ближний инфракрасный; Far infrared|Дальний инфракрасный; UVA|Ультрафиолет А; UVB|Ультрафиолет Б; UVC|Ультрафиолет С; Hard X-rays|Жёсткий рентген; "
    "Soft X-rays|Мягкий рентген; Synchrotron radiation|Синхротронное излучение; Cherenkov radiation|Черенковское излучение; Bremsstrahlung|Тормозное излучение; 5G|5G; Wi-Fi|Вайфай; Bluetooth|Блютуз; "
    "Radar|Радарное излучение; Starlight|Свет звёзд; Moonlight|Лунный свет; Black body radiation|Излучение чёрного тела"),
  "Alpha radiation/Альфа излучение/Beta radiation/Бета излучение/Sound/Звук/Ultrasound/Ультразвук/Neutron radiation/Нейтронное излучение")

k("space_missions", "science", "Name a famous space mission", "Назовите известную космическую миссию",
  "A real space mission: Vostok 1 (Gagarin), Apollo 11, Apollo 13, Sputnik 1, Luna 2, Luna 9, Lunokhod, Venera, Voyager 1, Voyager 2, Pioneer 10, Mars Pathfinder, Curiosity, Perseverance, New Horizons, Cassini, Rosetta, Juno, Artemis I, Soyuz-Apollo, Mir, ISS, Hubble servicing, Chandrayaan-3, Chang'e, Hayabusa.",
  L("Vostok 1|Восток 1|полёт гагарина; Apollo 11|Аполлон 11; Apollo 13|Аполлон 13; Sputnik 1|Спутник 1|первый спутник; Luna 2|Луна 2; Luna 9|Луна 9; Lunokhod|Луноход; Venera|Венера|венера 7; "
    "Voyager 1|Вояджер 1; Voyager 2|Вояджер 2; Pioneer 10|Пионер 10; Mars Pathfinder|Марс Пасфайндер; Curiosity|Кьюриосити; Perseverance|Персеверанс; New Horizons|Новые горизонты; Cassini|Кассини; "
    "Rosetta|Розетта; Juno|Юнона; Artemis I|Артемида 1; Soyuz-Apollo|Союз Аполлон; Mir|Мир; ISS|МКС; Chandrayaan-3|Чандраян 3; Chang'e|Чанъэ; Hayabusa|Хаябуса; Vostok 6|Восток 6|терешкова; "
    "Voskhod 2|Восход 2|выход в открытый космос; Sputnik 2|Спутник 2|лайка; Korabl-Sputnik 2|Белка и Стрелка; Salyut 7|Салют 7; Buran|Буран; Phobos-Grunt|Фобос грунт; Luna 25|Луна 25; Mars 3|Марс 3; "
    "Vega|Вега; Spektr-RG|Спектр РГ; Gemini|Джемини; Mercury|Меркурий; Skylab|Скайлэб; Space Shuttle|Спейс шаттл; Challenger|Челленджер; Columbia|Колумбия; Viking|Викинг; Spirit|Спирит; Opportunity|Оппортьюнити; "
    "Ingenuity|Индженьюити; InSight|Инсайт; Galileo|Галилео; Magellan|Магеллан; Messenger|Мессенджер; Dawn|Рассвет; OSIRIS-REx|Осирис рекс; Parker Solar Probe|Паркер; DART|Дарт; Crew Dragon|Крю дрэгон; "
    "Inspiration4|Инспирейшн 4; Tianwen-1|Тяньвэнь 1; Shenzhou 5|Шэньчжоу 5; Giotto|Джотто; Ulysses|Улисс; Huygens|Гюйгенс; Lunar Prospector|Лунар проспектор; Kepler|Кеплер; Polaris Dawn|Поларис дон"))

# ---------- 6. Transport ----------
k("passenger_rail_types", "transport", "Name a type of passenger rail transport", "Назовите разновидность пассажирского железнодорожного транспорта",
  "A kind of passenger railway transport: train, high-speed train, commuter train (elektrichka), metro, tram, monorail, light rail, sleeper train, express, intercity, funicular, cable tram, airport express, regional train, maglev, tourist train, narrow-gauge railway, MCD, Lastochka, Sapsan.",
  L("Train|Поезд; High-speed train|Скоростной поезд|сапсан; Commuter train|Электричка; Metro|Метро; Tram|Трамвай; Monorail|Монорельс; Light rail|Скоростной трамвай; Sleeper train|Поезд дальнего следования; "
    "Express|Экспресс; Intercity|Интерсити; Funicular|Фуникулёр; Cable tram|Канатный трамвай; Airport express|Аэроэкспресс; Regional train|Региональный поезд; Maglev|Маглев; Tourist train|Туристический поезд|ретропоезд; "
    "Narrow-gauge railway|Узкоколейка; MCD|МЦД|диаметр; Lastochka|Ласточка; Sapsan|Сапсан; Allegro|Аллегро; Strizh|Стриж; MCC|МЦК; Double-decker train|Двухэтажный поезд; Rail bus|Рельсовый автобус; "
    "Diesel train|Дизель поезд; Steam train|Паровоз; Children's railway|Детская железная дорога; Shinkansen|Синкансэн; TGV|ТЖВ; Eurostar|Евростар; ICE|Ай си и; Night train|Ночной поезд; "
    "Rack railway|Зубчатая дорога; Underground|Подземка; Light metro|Лёгкое метро; S-Bahn|Эс бан; Tram-train|Трамвай поезд; Ivolga|Иволга; Orient Express|Восточный экспресс; Trans-Siberian|Транссиб; "
    "Red Arrow|Красная стрела; People mover|Пипл мувер;  Cog railway|Горная железная дорога; Dining car|Вагон ресторан; Compartment car|Купейный вагон; Platzkart|Плацкарт"))

k("amphibious_vehicles", "transport", "Name a vehicle that can move both on land and on water", "Назовите транспорт, который может ездить и по суше, и по воде",
  "A vehicle able to travel on land and water: amphibious car, hovercraft, amphibious bus (duck tour), BTR (armoured personnel carrier), BMP, PT-76 tank, DUKW, Sherp, Trekol, amphibious ATV (Argo), seaplane (land and water), airboat, Gibbs Aquada, Volkswagen Schwimmwagen, Amphicar, amphibious excavator.",
  L("Amphibious car|Автомобиль амфибия|амфибия; Hovercraft|Судно на воздушной подушке; Amphibious bus|Автобус амфибия; BTR|БТР; BMP|БМП; PT-76|ПТ 76|плавающий танк; DUKW|Дак; Sherp|Шерп; "
    "Trekol|Трэкол; Argo ATV|Арго; Seaplane|Гидросамолёт; Airboat|Аэролодка; Gibbs Aquada|Аквада; Schwimmwagen|Швимваген; Amphicar|Амфикар; Amphibious excavator|Экскаватор амфибия;  "
    "  Swamp buggy|Болотоход; Marsh vehicle|Болотоход вездеход; Vityaz|Витязь; Petrovich|Петрович; Burlak|Бурлак; Arktika|Арктика; Amphibious tank|Плавающий танк; "
    "LVTP|Амфибийная машина пехоты; LARC|Ларк; Hovercraft Zubr|Зубр; Ekranoplan|Экраноплан; Floatplane|Поплавковый самолёт; Be-200|Бе 200; Amphibious truck|Грузовик амфибия; Quack Tour|Дак тур; "
    "Duck boat|Утка; WaterCar|Вотеркар; Sealegs|Силегс; Hovercraft toy|Ховеркрафт; Amphibious ATV 8x8|Вездеход 8x8; Tracked amphibian|Гусеничная амфибия; GAZ-46|ГАЗ 46; Plavayushchiy UAZ|Плавающий уаз"))

k("truck_types", "transport", "Name a type of truck", "Назовите разновидность грузового автомобиля",
  "A kind of truck or lorry: dump truck, tanker, refrigerated truck, tow truck, car carrier, garbage truck, concrete mixer, flatbed, box truck, semi-trailer truck, fire truck, crane truck, timber truck, cement truck, livestock truck, pickup, van, Gazelle, KamAZ, MAZ, articulated lorry, mining dump truck (BelAZ).",
  L("Dump truck|Самосвал; Tanker|Бензовоз|цистерна; Refrigerated truck|Рефрижератор|рефка; Tow truck|Эвакуатор; Car carrier|Автовоз; Garbage truck|Мусоровоз; Concrete mixer|Бетономешалка|миксер; "
    "Flatbed|Бортовой грузовик|платформа; Box truck|Фургон; Semi-trailer truck|Фура|тягач; Fire truck|Пожарная машина; Crane truck|Автокран; Timber truck|Лесовоз; Cement truck|Цементовоз; "
    "Livestock truck|Скотовоз; Pickup|Пикап; Van|Грузовой фургон; Gazelle|Газель; KamAZ|Камаз; MAZ|МАЗ; Articulated lorry|Седельный тягач; BelAZ|Белаз|карьерный самосвал; Ural|Урал; ZIL|ЗИЛ; "
    "GAZ-66|Шишига; Tractor unit|Тягач; Water truck|Водовоз; Milk truck|Молоковоз; Grain truck|Зерновоз; Container truck|Контейнеровоз; Armored truck|Инкассаторская машина; Mail truck|Почтовая машина; "
    "Street sweeper|Подметальная машина; Snowplow truck|Снегоуборочная машина; Vacuum truck|Ассенизатор|илосос; Bucket truck|Автовышка; Tipper|Опрокидыватель; Curtainsider|Тентованная фура; Lowboy|Трал; "
    "Heavy hauler|Тяжеловоз; Mobile crane|Мобильный кран; Monster truck|Монстр трак; Military truck|Военный грузовик; Ice cream truck|Фургон мороженого; Food truck|Фудтрак; Moving truck|Грузовик для переезда; Isotherm|Изотерм"))

k("cockpit_items", "transport", "Name something usually found in an airplane cockpit", "Назовите то, что обычно есть в кабине пилота",
  "An item found in an aircraft cockpit: control yoke (steering column), joystick (sidestick), throttle levers, altimeter, airspeed indicator, attitude indicator (artificial horizon), compass, radio, headset, autopilot panel, pilot seats, displays, pedals, checklist, flight computer, transponder, oxygen masks, window, switches, lights, fuel gauge.",
  L("Control yoke|Штурвал; Sidestick|Боковая ручка|джойстик; Throttle|Рычаг газа|рычаги тяги; Altimeter|Высотомер|альтиметр; Airspeed indicator|Указатель скорости; Attitude indicator|Авиагоризонт; "
    "Compass|Компас; Radio|Радиостанция|рация; Headset|Гарнитура|наушники; Autopilot|Автопилот; Pilot seat|Кресло пилота; Displays|Дисплеи|экраны; Pedals|Педали; Checklist|Чек лист; Flight computer|Бортовой компьютер; "
    "Transponder|Транспондер; Oxygen mask|Кислородная маска; Window|Окно|лобовое стекло; Switches|Тумблеры|переключатели; Lights|Лампы|подсветка; Fuel gauge|Указатель топлива; Pilot|Пилот|лётчик; Co-pilot|Второй пилот; "
    "Captain|Командир; Navigator|Штурман; Map|Карта; Tablet|Планшет; Clock|Часы; GPS|Gps|навигатор; Radar|Радар; Weather radar|Метеорадар; Microphone|Микрофон; Intercom|Переговорное устройство; "
    "Flaps lever|Рычаг закрылков; Landing gear lever|Рычаг шасси; Trim wheel|Триммер; Overhead panel|Верхняя панель; Circuit breakers|Автоматы защиты; Fire extinguisher|Огнетушитель; Flashlight|Фонарик; "
    "Seatbelt|Ремень; Sunshade|Солнцезащитный щиток; Coffee cup|Чашка кофе;  Joystick handle|Ручка управления; Variometer|Вариометр; Tachometer|Тахометр; Artificial horizon|Искусственный горизонт"))

k("famous_aircraft_models", "transport", "Name a famous aircraft model", "Назовите известную модель самолёта",
  "A real, well known aircraft model: Boeing 747, Boeing 737, Airbus A320, Airbus A380, Concorde, Tu-144, Tu-154, Il-96, An-225 Mriya, An-124 Ruslan, Superjet 100, MC-21, Su-27, Su-57, MiG-29, MiG-31, F-16, F-35, F-22, Spitfire, Wright Flyer, An-2, Il-2, B-52, SR-71, Boeing 787 Dreamliner.",
  L("Boeing 747|Боинг 747; Boeing 737|Боинг 737; Airbus A320|Аэробус А320; Airbus A380|Аэробус А380; Concorde|Конкорд; Tu-144|Ту 144; Tu-154|Ту 154; Il-96|Ил 96; An-225 Mriya|Мрия|ан 225; "
    "An-124 Ruslan|Руслан|ан 124; Superjet 100|Суперджет; MC-21|МС 21; Su-27|Су 27; Su-57|Су 57; MiG-29|Миг 29; MiG-31|Миг 31; F-16|Ф 16; F-35|Ф 35; F-22 Raptor|Ф 22 Раптор; Spitfire|Спитфайр; "
    "Wright Flyer|Флайер братьев Райт; An-2|Ан 2|кукурузник; Il-2|Ил 2; B-52|Б 52; SR-71|Чёрный дрозд|sr 71; Boeing 787|Дримлайнер|боинг 787; Boeing 777|Боинг 777; Airbus A350|Аэробус А350; "
    "Tu-160|Ту 160|белый лебедь; Tu-95|Ту 95; Tu-134|Ту 134; Il-76|Ил 76; Il-62|Ил 62; Il-86|Ил 86; Yak-42|Як 42; Yak-40|Як 40; Yak-3|Як 3; La-5|Ла 5; Po-2|По 2; Su-25|Су 25|грач; Su-34|Су 34; "
    "Su-35|Су 35; MiG-15|Миг 15; MiG-21|Миг 21; MiG-25|Миг 25; Be-200|Бе 200; Ilya Muromets|Илья Муромец; Maxim Gorky|Максим Горький; Douglas DC-3|Дуглас; Lockheed C-130|Геркулес; Cessna 172|Цессна; "
    "Piper Cub|Пайпер; Messerschmitt|Мессершмитт; P-51 Mustang|Мустанг; B-2 Spirit|Б 2 стелс; Harrier|Харриер; Eurofighter|Еврофайтер; Rafale|Рафаль; Gripen|Грипен; Mitsubishi Zero|Зеро; "
    "Embraer|Эмбраер; Bombardier|Бомбардье; Airbus A330|Аэробус А330; Airbus Beluga|Белуга; Boeing 707|Боинг 707; Comet|Комета; Lockheed Constellation|Констеллейшн; Antonov An-26|Ан 26"))

k("tracked_vehicles", "transport", "Name a vehicle that usually has caterpillar tracks", "Назовите транспортное средство, у которого обычно есть гусеницы",
  "A vehicle that usually runs on tracks: tank, bulldozer, excavator, snowcat (ratrak), snowmobile (track), crawler tractor, BMP, MT-LB, Sherp no (wheels), all-terrain tracked vehicle, combine harvester (rice), paver, crawler crane, snow tractor, tracked dumper, pipelayer.",
  L("Tank|Танк; Bulldozer|Бульдозер; Excavator|Экскаватор; Snowcat|Ратрак; Snowmobile|Снегоход; Crawler tractor|Гусеничный трактор; BMP|БМП; MT-LB|МТ ЛБ|мотолыга; Tracked all-terrain vehicle|Гусеничный вездеход; "
    "Rice combine|Рисоуборочный комбайн; Paver|Асфальтоукладчик; Crawler crane|Гусеничный кран; Snow tractor|Снегоболотоход гусеничный; Tracked dumper|Гусеничный самосвал; Pipelayer|Трубоукладчик; "
    "Self-propelled gun|САУ|самоходка; Artillery tractor|Артиллерийский тягач; Armored personnel carrier|Гусеничный БТР; T-34|Т 34; T-90|Т 90; Armata|Армата; Abrams|Абрамс; Leopard|Леопард; Tiger|Тигр танк; "
    "  DT-75|ДТ 75; T-150|Т 150 гусеничный; Vityaz|Витязь; Hagglunds|Хагглундс; Mini excavator|Мини экскаватор; Drilling rig|Буровая на гусеницах; Mine clearing vehicle|Разминирующая машина; "
    "Trencher|Траншеекопатель; Forest harvester|Лесозаготовительная машина; Mulcher|Мульчер;  Robot|Гусеничный робот; Bomb disposal robot|Робот сапёр; Wheelchair stair climber|Гусеничная коляска; "
    "Track loader|Гусеничный погрузчик; Skid steer|Гусеничный мини погрузчик;   Combine harvester|Комбайн гусеничный; Swamp tractor|Болотоход; Ice breaker vehicle|Ледовый вездеход"))

k("tire_manufacturers", "transport", "Name a famous tyre manufacturer", "Назовите известного производителя шин",
  "A real tyre maker or tyre brand: Michelin, Bridgestone, Goodyear, Continental, Pirelli, Nokian (Ikon), Hankook, Yokohama, Dunlop, Cordiant, Toyo, Kumho, Nexen, Firestone, BFGoodrich, Cooper, Matador, Gislaved, Amtel, Viatti, Kama, Belshina, Triangle, Sava, Falken, Maxxis, General Tire.",
  L("Michelin|Мишлен; Bridgestone|Бриджстоун; Goodyear|Гудиер; Continental|Континенталь; Pirelli|Пирелли; Nokian|Нокиан|икон; Ikon|Икон; Hankook|Ханкук; Yokohama|Йокогама; Dunlop|Данлоп; "
    "Cordiant|Кордиант; Toyo|Тойо; Kumho|Кумхо; Nexen|Нексен; Firestone|Файрстоун; BFGoodrich|Бэ эф гудрич; Cooper|Купер; Matador|Матадор; Gislaved|Гиславед; Amtel|Амтел; Viatti|Виатти; Kama|Кама; "
    "Belshina|Белшина; Triangle|Трайэнгл; Sava|Сава; Falken|Фалкен; Maxxis|Максис; General Tire|Дженерал тайр; Tunga|Тунга; Formula|Формула; Barum|Барум; Vredestein|Вредештайн; Uniroyal|Униройал; "
    "Kleber|Клебер; Nitto|Нитто; Sailun|Сайлун; Linglong|Линглонг; Goodride|Гудрайд; Westlake|Вестлейк; Marshal|Маршал; Lassa|Ласса; Petlas|Петлас; Kenda|Кенда; Mitas|Митас; Schwalbe|Швальбе; "
    "Vittoria|Витториа; Avon|Эйвон; Toyo Open Country|Тойо опен кантри; Kama Euro|Кама евро; Nizhnekamskshina|Нижнекамскшина; Voltyre|Волтайр; Omskshina|Омскшина; Tigar|Тигар; Debica|Дебица; Fulda|Фульда"))

# ---------- 7. Food ----------
k("served_with_broth", "food", "Name a dish traditionally served with broth", "Назовите блюдо, которое традиционно подают с бульоном",
  "A dish traditionally served in or with broth: pelmeni, khinkali (broth inside), pirozhki with broth, ramen, pho, wonton soup, matzo ball soup, tortellini in brodo, noodles, dumplings, chicken soup, meatballs, egg (in broth), croutons, kulebyaka with consommé, laksa, udon.",
  L("Pelmeni|Пельмени|пельмени в бульоне; Khinkali|Хинкали; Pirozhki|Пирожки|пирожки с бульоном; Ramen|Рамен; Pho|Фо; Wonton soup|Вонтоны; Matzo ball soup|Клёцки из мацы; Tortellini in brodo|Тортеллини в бульоне; "
    "Noodles|Лапша; Dumplings|Клёцки; Chicken soup|Куриный суп; Meatballs|Фрикадельки; Egg|Яйцо|яйцо в бульоне; Croutons|Сухарики|гренки; Kulebyaka|Кулебяка; Laksa|Лакса; Udon|Удон; Soba|Соба; "
    "Rasstegai|Расстегаи; Vareniki|Вареники; Lagman|Лагман; Shurpa|Шурпа; Gnocchi|Ньокки; Profiteroles|Профитроли; Kreplach|Креплах; Mantou|Маньтоу; Ravioli|Равиоли; Kundyumy|Кундюмы; Chuchvara|Чучвара; "
    "Dushbara|Душбара; Boiled beef|Отварная говядина; Boiled chicken|Отварная курица; Toast|Тост; Bread|Хлеб; Pie|Пирог; Kartofelnye kletski|Картофельные клёцки; Hot pot|Хого; Shabu-shabu|Сябу сябу; "
    "Fondue chinoise|Китайское фондю; Pot-au-feu|Пот о фё; Bollito misto|Боллито мисто;  Galushki|Галушки; Halushky|Галушки украинские; Dim sum|Димсамы; Gyoza|Гёдза; Mandu|Манду"))

k("grated_foods", "food", "Name a food usually grated before adding to a dish", "Назовите продукт, который обычно натирают на тёрке перед добавлением в блюдо",
  "A food commonly grated: cheese, carrot, beetroot, potato, cucumber, apple, garlic, ginger, lemon zest, orange zest, nutmeg, horseradish, chocolate, parmesan, radish, zucchini, onion, egg, butter (frozen), coconut, wasabi.",
  L("Cheese|Сыр; Carrot|Морковь|морковка; Beetroot|Свёкла; Potato|Картофель|картошка; Cucumber|Огурец; Apple|Яблоко; Garlic|Чеснок; Ginger|Имбирь; Lemon zest|Цедра лимона|цедра; Orange zest|Апельсиновая цедра; "
    "Nutmeg|Мускатный орех; Horseradish|Хрен; Chocolate|Шоколад; Parmesan|Пармезан; Radish|Редька|редис; Zucchini|Кабачок; Onion|Лук; Egg|Яйцо; Butter|Сливочное масло; Coconut|Кокос; Wasabi|Васаби; "
    "Daikon|Дайкон; Pumpkin|Тыква; Celery root|Сельдерей корень; Turnip|Репа; Pear|Груша; Quince|Айва; Tomato|Помидор; Mozzarella|Моцарелла; Processed cheese|Плавленый сыр;  "
    "Halva|Халва; Nuts|Орехи; Cinnamon stick|Корица; Truffle|Трюфель; Lime zest|Цедра лайма; Grapefruit zest|Цедра грейпфрута; Turmeric root|Куркума корень; Jerusalem artichoke|Топинамбур; Kohlrabi|Кольраби; "
    "Fish|Мороженая рыба;  Frozen fruit|Замороженные фрукты;  Sweet potato|Батат; Parsnip|Пастернак; Cucumber for tzatziki|Огурец для дзадзики"))

k("sauce_types", "food", "Name a type of sauce", "Назовите разновидность соуса",
  "A real sauce: ketchup, mayonnaise, mustard, soy sauce, tartar, béchamel, hollandaise, pesto, barbecue, sweet and chili, tkemali, adjika, satsebeli, tzatziki, guacamole, salsa, teriyaki, Worcestershire, sriracha, garlic sauce, cheese sauce, sour cream sauce, horseradish sauce, aioli, bolognese, carbonara, gravy, Caesar dressing, ranch, tahini.",
  L("Ketchup|Кетчуп; Mayonnaise|Майонез; Mustard|Горчица; Soy sauce|Соевый соус; Tartar|Тартар; Béchamel|Бешамель; Hollandaise|Голландский соус; Pesto|Песто; Barbecue|Барбекю; Sweet chili|Сладкий чили; "
    "Tkemali|Ткемали; Adjika|Аджика; Satsebeli|Сацебели; Tzatziki|Дзадзики|цацики; Guacamole|Гуакамоле; Salsa|Сальса; Teriyaki|Терияки; Worcestershire|Вустерский соус; Sriracha|Шрирача; Garlic sauce|Чесночный соус; "
    "Cheese sauce|Сырный соус; Sour cream sauce|Сметанный соус; Horseradish sauce|Хреновина|хрен; Aioli|Айоли; Bolognese|Болоньезе; Carbonara|Карбонара; Gravy|Подлива|подливка; Caesar dressing|Соус цезарь; "
    "Ranch|Ранч; Tahini|Тахини;  Narsharab|Наршараб; Pomegranate sauce|Гранатовый соус; Chimichurri|Чимичурри; Tabasco|Табаско; Sweet and sour|Кисло сладкий; Oyster sauce|Устричный соус; "
    "Hoisin|Хойсин; Fish sauce|Рыбный соус; Ponzu|Понзу; Unagi|Унаги; Spicy mayo|Спайси; Curry sauce|Соус карри; Mushroom sauce|Грибной соус; Cranberry sauce|Клюквенный соус; Mint sauce|Мятный соус; "
    "Tomato sauce|Томатный соус; Marinara|Маринара; Arrabbiata|Арраббьята; Alfredo|Альфредо; Demi-glace|Демиглас; Velouté|Велюте; Espagnole|Эспаньоль; Béarnaise|Беарнский; Remoulade|Ремулад; "
    "Thousand Island|Тысяча островов; Blue cheese dressing|Блю чиз; Honey mustard|Медово горчичный; Sweet onion|Сладкий луковый; Wasabi mayo|Васаби майонез; Shawarma sauce|Соус для шаурмы; Big Mac sauce|Соус биг мак"))

k("minced_meat_dishes", "food", "Name a dish traditionally made from minced meat", "Назовите блюдо, которое традиционно готовят из фарша",
  "A dish made from minced meat: cutlets (kotlety), meatballs, pelmeni, burger patty, lyulya kebab, meatloaf, stuffed peppers, golubtsy (cabbage rolls), lasagna, bolognese, navy pasta (makarony po-flotski), chebureki, belyashi, manti, khinkali, shepherd's pie, moussaka, kofta, chevapchichi, zrazy, tefteli, samsa, kebab.",
  L("Cutlets|Котлеты; Meatballs|Фрикадельки|тефтели; Pelmeni|Пельмени; Burger|Бургер|котлета для бургера; Lyulya kebab|Люля кебаб; Meatloaf|Мясной рулет|запеканка; Stuffed peppers|Фаршированные перцы; "
    "Golubtsy|Голубцы; Lasagna|Лазанья; Bolognese|Болоньезе; Navy pasta|Макароны по флотски; Chebureki|Чебуреки; Belyashi|Беляши; Manti|Манты; Khinkali|Хинкали; Shepherd's pie|Пастуший пирог; Moussaka|Мусака; "
    "Kofta|Кофта; Chevapchichi|Чевапчичи; Zrazy|Зразы; Tefteli|Тефтели; Samsa|Самса; Kebab|Кебаб; Pozharsky cutlets|Пожарские котлеты;  Hedgehogs|Ёжики; "
    "Dolma|Долма; Stuffed zucchini|Фаршированные кабачки; Stuffed tomatoes|Фаршированные помидоры; Pirozhki|Пирожки с мясом; Pie|Пирог с фаршем; Pasties|Пирожки; Kulebyaka|Кулебяка; Tacos|Тако; "
    "Chili con carne|Чили кон карне;  Sausages|Колбаски; Kupaty|Купаты; Nuggets|Наггетсы; Gyoza|Гёдза; Wontons|Вонтоны; Dumplings|Пельмени сибирские; Vareniki with meat|Вареники с мясом; "
    "Pasta with mince|Паста с фаршем; Mince soup|Суп с фрикадельками; Potato casserole|Картофельная запеканка с фаршем; Pastitsio|Пастицио; Cannelloni|Каннеллони; Empanadas|Эмпанадас; Kibbeh|Киббе; "
    "Keema|Кима; Bitochki|Биточки; Shnitsel|Шницель рубленый;  Hamburger|Гамбургер; Cheeseburger|Чизбургер; Lula|Люля; Kotleta|Котлетка"))

k("dried_fruits", "food", "Name a fruit you can find dried", "Назовите фрукт, который можно встретить в сушёном виде",
  "A fruit (or berry) commonly sold dried: apricot (kuraga), plum (prunes), grape (raisins), date, fig, apple, pear, banana chips, mango, pineapple, cranberry, cherry, papaya, coconut, persimmon, goji, blueberry, kiwi, strawberry, melon, barberry, rosehip, jujube.",
  L("Apricot|Курага|сушёный абрикос; Plum|Чернослив; Grape|Изюм; Date|Финики; Fig|Инжир; Apple|Сушёные яблоки|яблоки; Pear|Груша; Banana|Банановые чипсы|банан; Mango|Манго; Pineapple|Ананас; "
    "Cranberry|Клюква; Cherry|Вишня; Papaya|Папайя; Coconut|Кокос; Persimmon|Хурма; Goji|Годжи; Blueberry|Черника; Kiwi|Киви; Strawberry|Клубника; Melon|Дыня; Barberry|Барбарис; Rosehip|Шиповник; "
    "Jujube|Унаби; Whole apricot|Урюк; Kaisa|Кайса; Sultana|Султанина; Currant|Смородина; Lingonberry|Брусника; Cherry plum|Алыча; Peach|Персик; Nectarine|Нектарин; Orange|Апельсин|апельсиновые чипсы; "
    "Lemon|Лимон; Lime|Лайм; Mulberry|Шелковица; Physalis|Физалис; Sea buckthorn|Облепиха; Raspberry|Малина; Blackberry|Ежевика; Cornelian cherry|Кизил; Quince|Айва; Feijoa|Фейхоа; Guava|Гуава; "
    "Dragon fruit|Питахайя; Jackfruit|Джекфрут; Rambutan|Рамбутан; Tamarind|Тамаринд; Pomegranate|Гранат; Elderberry|Бузина; Hawthorn|Боярышник; Aronia|Черноплодная рябина; Rowan|Рябина"))

k("sushi_ingredients", "food", "Name an ingredient used to make sushi", "Назовите продукт, который используют для приготовления суши",
  "An ingredient used in sushi or rolls: rice, nori, salmon, tuna, eel, cucumber, avocado, cream cheese (Philadelphia), rice vinegar, wasabi, soy sauce, pickled ginger, tobiko (flying fish roe), masago, crab sticks, shrimp, sesame, tamago, sea bass, scallop, octopus, squid, mackerel, mango, spicy mayo, unagi sauce, tempura flakes.",
  L("Rice|Рис; Nori|Нори|водоросли; Salmon|Лосось|сёмга; Tuna|Тунец; Eel|Угорь; Cucumber|Огурец; Avocado|Авокадо; Cream cheese|Сливочный сыр|филадельфия; Rice vinegar|Рисовый уксус; Wasabi|Васаби; "
    "Soy sauce|Соевый соус; Pickled ginger|Маринованный имбирь|имбирь; Tobiko|Тобико|икра летучей рыбы; Masago|Масаго; Crab sticks|Крабовые палочки; Shrimp|Креветки; Sesame|Кунжут; Tamago|Тамаго|омлет; "
    "Sea bass|Сибас; Scallop|Гребешок; Octopus|Осьминог; Squid|Кальмар; Mackerel|Скумбрия; Mango|Манго; Spicy mayo|Спайси соус; Unagi sauce|Соус унаги; Tempura flakes|Темпура; Yellowtail|Желтохвост|хамачи; "
    "Red caviar|Красная икра; Sugar|Сахар; Salt|Соль; Kombu|Комбу; Shiitake|Шиитаке; Kanpyo|Канпё; Daikon|Дайкон; Bell pepper|Болгарский перец; Carrot|Морковь; Green onion|Зелёный лук; Lettuce|Салат; "
    "Tofu|Тофу; Sea urchin|Морской ёж|уни; Crab|Краб; Snow crab|Снежный краб; Trout|Форель; Butterfish|Масляная рыба; Chicken|Курица; Bacon|Бекон; Cheese|Сыр; Mayonnaise|Майонез; Sriracha|Шрирача; "
    "Furikake|Фурикакэ; Mirin|Мирин; Rice paper|Рисовая бумага; Soy paper|Соевая бумага; Sesame oil|Кунжутное масло; Panko|Панко"))

k("melted_butter_dishes", "food", "Name a dish traditionally served with melted butter", "Назовите блюдо, которое традиционно подают с растопленным сливочным маслом",
  "A dish traditionally served with melted butter: pelmeni, vareniki, blini (pancakes), buckwheat kasha, potatoes (boiled new potatoes), lobster, corn on the cob, syrniki, oladyi, popcorn, asparagus, steamed vegetables, crab legs, gnocchi, kasha, mashed potatoes, ravioli, pasta, toast, artichoke, fish (sole meunière).",
  L("Pelmeni|Пельмени; Vareniki|Вареники; Blini|Блины|блинчики; Buckwheat|Гречка|гречневая каша; Boiled potatoes|Варёная картошка|молодая картошка; Lobster|Лобстер; Corn on the cob|Кукуруза; Syrniki|Сырники; "
    "Oladyi|Оладьи; Popcorn|Попкорн; Asparagus|Спаржа; Steamed vegetables|Овощи на пару; Crab legs|Крабовые ноги; Gnocchi|Ньокки; Porridge|Каша; Mashed potatoes|Пюре; Ravioli|Равиоли; Pasta|Макароны; "
    "Toast|Тост; Artichoke|Артишок; Sole meunière|Рыба меньер; Pancakes|Панкейки; Waffles|Вафли; Lazy vareniki|Ленивые вареники; Galushki|Галушки; Manti|Манты; Millet porridge|Пшённая каша; "
    "Semolina|Манная каша; Rice|Рис; Fried eggs|Яичница; Corn bread|Кукурузный хлеб; Baked potato|Печёная картошка; Draniki|Драники; Kugel|Кугель; Spaetzle|Шпецле; Pierogi|Вареники польские; "
    "Shrimp|Креветки; Mussels|Мидии;  Steak|Стейк с маслом; Fish|Рыба; Broccoli|Брокколи; Green beans|Стручковая фасоль; Peas|Горошек; Carrots|Морковь отварная; Bread|Хлеб; "
    "Cornmeal|Мамалыга; Polenta|Полента; Grits|Гритс; Bliny with caviar|Блины с икрой; Kasha with butter|Каша с маслом; Khachapuri|Хачапури"))
