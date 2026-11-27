# THINK OR DIE category content, part ZA (list 7, questions 81-100; compact lists, the AI judges the rest).
from cats_a import cat


def k(id, group, en, ru, crit, lines, inv="", type="KNOWLEDGE", **kw):
    cat(id, type, group, en, ru, crit, crit, lines, inv, **kw)


def L(s):
    return "\n".join(x.strip() for x in s.strip().split(";"))


# ---------- 9. Transport, brands, technology ----------
k("snow_vehicles", "transport", "Name a vehicle that can travel on snow", "Назовите транспортное средство, которое может передвигаться по снегу",
  "A vehicle able to move on snow: snowmobile, sled, sledge, dog sled, reindeer sled, skis, snowcat, snow tractor, tank, all-terrain vehicle (Trekol), hovercraft, airboat, snowplow, tracked vehicle, Buran snowmobile, kicksled, troika, snowboard, tubing.",
  L("Snowmobile|Снегоход|буран; Sled|Санки|сани; Dog sled|Собачья упряжка|нарты; Reindeer sled|Оленья упряжка; Skis|Лыжи; Snowcat|Ратрак; Snow tractor|Снегоболотоход; Tank|Танк; "
    "Trekol|Трэкол|вездеход; All-terrain vehicle|Вездеход; Hovercraft|Судно на воздушной подушке; Airboat|Аэролодка; Snowplow|Снегоуборщик|снегоочиститель; Tracked vehicle|Гусеничный транспорт; "
    "Kicksled|Финские сани; Troika|Тройка; Snowboard|Сноуборд; Snow tube|Тюбинг|ватрушка; Bobsleigh|Бобслей; Toboggan|Тобогган; Skidoo|Ски ду; Quad bike|Квадроцикл; Tractor|Трактор; "
    "Bulldozer|Бульдозер; Jeep with chains|Джип с цепями; SUV|Внедорожник; Truck|Грузовик; Ural truck|Урал; Kamaz|Камаз; Shishiga|Шишига|газ 66; UAZ|Уазик|буханка; Niva|Нива; "
    "Sherp|Шерп; Vityaz|Витязь; Snow bike|Сноубайк; Fat bike|Фэтбайк; Ice yacht|Буер; Snow kite|Сноукайт; Horse sleigh|Сани с лошадью|розвальни; Ice skates|Коньки; Monoski|Моноски; "
    "Snowshoes|Снегоступы; Ratrak|Ратрак горнолыжный; Arctic truck|Арктический грузовик; Antarctic vehicle|Антарктический вездеход; Helicopter on skis|Вертолёт на лыжах; Plane on skis|Самолёт на лыжах"))

k("place_named_companies", "everyday", "Name a company named after a geographical place", "Назовите компанию, которая получила название от географического объекта",
  "A real company whose name comes from a place (river, city, mountain, region): Nokia (town), Amazon (river), Adobe (creek), Patagonia, Fuji (mountain), Volga (car), Baikal, Kamaz (Kama river), Toyota (town), Cisco (San Francisco), Evian (town), Borjomi, Bavaria.",
  L("Nokia|Нокиа; Amazon|Амазон; Adobe|Адоби; Patagonia|Патагония; Fujifilm|Фуджифильм|фудзи; Volga|Волга; Kamaz|Камаз; Toyota|Тойота; Cisco|Циско; Evian|Эвиан; Borjomi|Боржоми; "
    "Essentuki|Ессентуки; Baikal|Байкал; Narzan|Нарзан; Arkhyz|Архыз; Sayany|Саяны; Altai|Алтай; Siberia|Сибирь|s7 сибирь; Ural Airlines|Уральские авиалинии; Rossiya|Россия; "
    "  Moskvich|Москвич; Zhiguli|Жигули; Izhevsk|Ижмаш|иж; Ulyanovsk|УАЗ; Minsk|Минск мотоцикл; Belaz|Белаз; Gorky|ГАЗ|горьковский автозавод; "
    "      Hitachi|Хитачи;   Bavaria|Бавария; "
    "BMW|БМВ|баварские моторные заводы;   Tatra|Татра; Pilsner Urquell|Пльзень|пилснер; Budweiser|Будвайзер;  Champagne|Шампанское; "
    "Cognac|Коньяк; Parmalat|Пармалат; Parmigiano|Пармезан; Dijon|Дижон; Cheddar|Чеддер; Tabasco|Табаско; Fiji Water|Фиджи; Mont Blanc|Монблан; Matterhorn|Маттерхорн; "
    "Sahara|Сахара; Atlas|Атлас; Columbia|Коламбия; Hudson|Гудзон; Mississippi|Миссисипи; Rio|Рио; Brooklyn|Бруклин; Malibu|Малибу; Manhattan|Манхэттен;  "
    "Kazan|Казанский вертолётный завод; Tula|Тульский оружейный; Vologda|Вологодское масло; Yasnaya Polyana|Ясная поляна; Moskovskaya|Московская; Pyatigorsk|Пятигорск; Krasnodar|Краснодар; "
    "Nevsky|Невская косметика; Neva|Нева;  Sochi|Сочи; Lena|Лена; Yenisei|Енисей; Arctic|Арктика; Polar|Полар"))

k("english_word_car_models", "transport", "Name a car model whose name is an ordinary English word", "Назовите модель автомобиля, название которой обычное английское слово",
  "A real car model named with an ordinary English word: Ford Mustang, Ford Focus, Ford Explorer, Ford Ranger, Ford Escape, Honda Civic, Honda Accord, Nissan Leaf, Nissan Note, Kia Soul, Hyundai Accent, Jeep Wrangler, Jeep Compass, Dodge Charger, Dodge Viper, Chevrolet Spark, Chevrolet Impala, VW Beetle, VW Golf, Range Rover Discovery, Mazda Tribute.",
  L("Ford Mustang|Мустанг; Ford Focus|Фокус; Ford Explorer|Эксплорер; Ford Ranger|Рейнджер; Ford Escape|Эскейп; Ford Fusion|Фьюжн; Ford Fiesta|Фиеста; Honda Civic|Цивик; Honda Accord|Аккорд; "
    "Honda Pilot|Пайлот; Honda Passport|Паспорт; Honda Insight|Инсайт; Honda Jazz|Джаз; Nissan Leaf|Лиф; Nissan Note|Ноут; Nissan Patrol|Патрол; Nissan Rogue|Роуг;  "
    "Kia Soul|Соул;  Hyundai Accent|Акцент;  Jeep Wrangler|Вранглер; Jeep Compass|Компас;  Jeep Patriot|Патриот; "
    "Jeep Liberty|Либерти; Dodge Charger|Чарджер; Dodge Viper|Вайпер; Dodge Challenger|Челленджер; Dodge Journey|Джорни; Chevrolet Spark|Спарк; Chevrolet Impala|Импала; Chevrolet Cruze|Круз; "
    "Chevrolet Express|Экспресс;  Volkswagen Beetle|Битл|жук; Volkswagen Golf|Гольф; Volkswagen Polo|Поло;  Land Rover Discovery|Дискавери; "
    "Land Rover Defender|Дефендер;  Mazda Tribute|Трибьют; Toyota Highlander|Хайлендер; Toyota Tundra|Тундра; Toyota Sequoia|Секвойя; Toyota Crown|Краун; "
    "Toyota Century|Сенчури;   Subaru Forester|Форестер; Subaru Outback|Аутбэк; Subaru Legacy|Легаси;  "
    "Mitsubishi Outlander|Аутлендер; Mitsubishi Lancer|Лансер;   Mini Cooper|Купер; Mini Countryman|Кантримен; Rolls-Royce Ghost|Гоуст; "
    "Rolls-Royce Phantom|Фантом; Rolls-Royce Wraith|Рейт;  Bentley Continental|Континентал; Ford Bronco|Бронко; Ford Thunderbird|Тандерберд; "
    "Ford Edge|Эдж; Ford Galaxy|Гэлакси; Ford Transit|Транзит; Ford Maverick|Маверик; Chevrolet Blazer|Блейзер;  Pontiac Firebird|Файрберд; Plymouth Fury|Фьюри; "
    "AMC Gremlin|Гремлин;    Renault Duster|Дастер;   "
    "Hyundai Venue|Венью;  Kia Carnival|Карнивал; Kia Stinger|Стингер; Tesla Cybertruck|Кибертрак;  Lucid Air|Эйр; Honda Odyssey|Одиссей"))

k("built_in_mic_devices", "science", "Name an electronic device that can have a built-in microphone", "Назовите электронное устройство, в которое может быть встроен микрофон",
  "An electronic device that may contain a microphone: smartphone, laptop, headphones (headset), smart speaker, webcam, tablet, smartwatch, TV remote with voice, video camera, dictaphone, walkie-talkie, baby monitor, hearing aid, car infotainment, game controller (PS5), intercom, doorbell camera, Alexa/Alice speaker.",
  L("Smartphone|Смартфон|телефон; Laptop|Ноутбук; Headset|Гарнитура|наушники с микрофоном; Earbuds|Беспроводные наушники|airpods; Smart speaker|Умная колонка|яндекс станция/алиса; Webcam|Веб камера; "
    "Tablet|Планшет; Smartwatch|Умные часы; Voice remote|Пульт с голосовым поиском; Video camera|Видеокамера; Dictaphone|Диктофон; Walkie-talkie|Рация; Baby monitor|Радионяня|видеоняня; "
    "Hearing aid|Слуховой аппарат; Car stereo|Магнитола|мультимедиа в машине; Game controller|Геймпад; Intercom|Домофон; Video doorbell|Видеозвонок; Action camera|Экшн камера; Dashcam|Видеорегистратор; "
    "Security camera|Камера видеонаблюдения; Karaoke speaker|Караоке колонка; Toy|Говорящая игрушка; Robot vacuum|Робот пылесос; Smart TV|Смарт телевизор; Fitness tracker|Фитнес браслет; "
    "Translator device|Электронный переводчик; Drone|Дрон; Phone landline|Стационарный телефон; Car|Автомобиль; Smart glasses|Умные очки; VR headset|Vr шлем; Gaming headset|Игровая гарнитура; "
    "Bluetooth speaker|Блютуз колонка; Hearing protection|Активные наушники;   Computer monitor|Монитор с микрофоном; All-in-one PC|Моноблок; "
    "Kids smartwatch|Детские часы;  Voice recorder pen|Ручка диктофон; Smart home hub|Умный дом; Smart thermostat|Умный термостат; Smart fridge|Умный холодильник; "
    "  Bodycam|Нагрудная камера; Police radio|Полицейская рация; Spy bug|Жучок|подслушивающее устройство"))

k("vehicle_carriers", "transport", "Name a vehicle that can carry other vehicles", "Назовите транспортное средство, которое может перевозить другие транспортные средства",
  "A vehicle able to transport other vehicles: car carrier truck, tow truck, ferry, aircraft carrier, cargo plane (An-124), container ship, Ro-Ro ship, landing ship, freight train (auto-rack), trailer, Space Shuttle carrier aircraft, barge, flatbed truck, helicopter (sling), Mriya, Starship (satellites).",
  L("Car carrier|Автовоз; Tow truck|Эвакуатор; Ferry|Паром; Aircraft carrier|Авианосец; Cargo plane|Грузовой самолёт; An-124 Ruslan|Руслан|ан 124; An-225 Mriya|Мрия; Container ship|Контейнеровоз; "
    "Ro-Ro ship|Ролкер; Landing ship|Десантный корабль; Freight train|Товарный поезд; Auto-rack wagon|Вагон автовоз; Trailer|Прицеп; Shuttle carrier aircraft|Самолёт носитель шаттла; Barge|Баржа; "
    "Flatbed truck|Платформа|грузовик платформа; Helicopter|Вертолёт; Mi-26|Ми 26; Rocket|Ракета;  Truck|Фура|тягач; Lowboy trailer|Трал; Heavy haul truck|Тягач тяжеловоз; "
    "Il-76|Ил 76; C-5 Galaxy|Гэлакси; Beluga|Белуга; Dreamlifter|Дримлифтер; Car train|Автопоезд; Eurotunnel shuttle|Евротоннель шаттл; Motorail|Поезд с автомобилями; Ship|Корабль; "
    "  Amphibious assault ship|Универсальный десантный корабль; Mistral|Мистраль; Tank transporter|Танковоз; Crane ship|Плавучий кран; Heavy lift ship|Судно тяжеловоз; "
    "Dock ship|Док; Floating dock|Плавучий док; Space Shuttle|Шаттл|спейс шаттл; Starship|Старшип; Falcon 9|Фалькон 9; Soyuz rocket|Союз ракета; Camper with bike rack|Автодом с велосипедами; "
    "Car with roof rack|Машина с багажником; Bicycle trailer|Велоприцеп; Horse trailer|Коневоз; Boat trailer|Прицеп для лодки;   Hovercraft|Судно на воздушной подушке Зубр"))

k("music_equipment_companies", "music", "Name a company that makes music equipment", "Назовите компанию, которая выпускает музыкальное оборудование",
  "A real company making musical instruments or audio equipment: Yamaha, Fender, Gibson, Roland, Korg, Casio, Marshall, Steinway, Ibanez, Shure, Behringer, Pioneer DJ, Boss, Native Instruments, Moog, Sennheiser, Audio-Technica, Focusrite, Pearl, Zildjian, Akai, Elektron, Novation, Kawai, PRS, Martin, Taylor.",
  L("Yamaha|Ямаха; Fender|Фендер; Gibson|Гибсон; Roland|Роланд; Korg|Корг; Casio|Касио; Marshall|Маршалл; Steinway|Стейнвей; Ibanez|Ибанез; Shure|Шур; Behringer|Берингер; "
    "Pioneer DJ|Пионер; Boss|Босс; Native Instruments|Нейтив инструментс; Moog|Муг; Sennheiser|Сеннхайзер; Audio-Technica|Аудио техника; Focusrite|Фокусрайт; Pearl|Перл; Zildjian|Зилджян; "
    "Akai|Акай; Elektron|Электрон; Novation|Новейшн; Kawai|Каваи; PRS|Пол Рид Смит; Martin|Мартин; Taylor|Тейлор; Epiphone|Эпифон; Squier|Скваер; Gretsch|Гретч; Rickenbacker|Рикенбакер; "
    "ESP|ЕСП; Jackson|Джексон; Schecter|Шектер; Cort|Корт; Vox|Вокс; Orange|Орандж; Mesa Boogie|Меса буги; Peavey|Пиви; Ampeg|Ампег; Line 6|Лайн 6; Electro-Harmonix|Электро хармоникс; "
    "TC Electronic|Ти си электроник; DigiTech|Диджитек; Neumann|Нойманн; AKG|АКГ; Rode|Роде; Beyerdynamic|Бейердинамик; KRK|КРК; Genelec|Генелек; JBL|ДжиБиЭль; Bose|Боуз; "
    "Steinberg|Стейнберг; Ableton|Эйблтон; Arturia|Артурия; Nord|Норд; Kurzweil|Курцвейл; Bechstein|Бехштейн; Bösendorfer|Бёзендорфер; Petrof|Петроф; Tama|Тама; DW|Ди дабл ю; "
    "Ludwig|Людвиг; Sabian|Сабиан; Paiste|Пайсте; Meinl|Майнл; Hohner|Хонер; Selmer|Селмер; Buffet Crampon|Буффе Крампон; Hercules|Геркулес; Gewa|Гева; Denon DJ|Денон; Numark|Нумарк; "
    "Rane|Рейн; Technics|Техникс; Teenage Engineering|Тинейдж инжиниринг; Universal Audio|Юниверсал аудио; Presonus|Пресонус; M-Audio|Эм аудио; Alesis|Алесис;  Kremona|Кремона"))

k("voice_controlled_devices", "science", "Name a device that can be controlled by voice", "Назовите устройство, которым можно управлять голосом",
  "A device that accepts voice commands: smart speaker (Alexa, Alisa, Google Home), smartphone (Siri, Google Assistant), smart TV, car infotainment, smart home system, robot vacuum, smart lights, smartwatch, TV remote, navigator, smart thermostat, laptop (Cortana), smart fridge, game console (Kinect), wheelchair, drone, prosthesis.",
  L("Smart speaker|Умная колонка|яндекс станция; Alexa|Алекса; Alisa|Алиса; Google Home|Гугл хоум; Siri|Сири|айфон; Smartphone|Смартфон; Smart TV|Смарт тв|умный телевизор; "
    "Car infotainment|Мультимедиа автомобиля; Smart home|Умный дом; Robot vacuum|Робот пылесос; Smart lights|Умные лампочки; Smartwatch|Умные часы; TV remote|Пульт; Navigator|Навигатор; "
    "Smart thermostat|Термостат; Laptop|Ноутбук; Smart fridge|Умный холодильник; Kinect|Кинект; Wheelchair|Инвалидная коляска; Drone|Дрон; Prosthesis|Протез; Smart lock|Умный замок; "
    "Smart socket|Умная розетка; Air conditioner|Кондиционер; Washing machine|Стиральная машина; Multicooker|Мультиварка; Kettle|Умный чайник; Curtains|Умные шторы; Garage door|Ворота гаража; "
    "Computer|Компьютер; Tablet|Планшет; Headphones|Наушники; Earbuds|Эирподсы; Smart glasses|Умные очки; Toy robot|Робот игрушка; Humanoid robot|Робот; Dictation software|Голосовой ввод; "
    "Elevator|Лифт; Phone landline|Телефон; Hearing aid|Слуховой аппарат; Translator|Переводчик; Smart mirror|Умное зеркало; Camera|Фотоаппарат; Doorbell|Звонок; Intercom|Домофон; "
    "Coffee machine|Кофемашина; Oven|Духовка; Microwave|Микроволновка; Printer|Принтер; Gaming console|Приставка; Tesla|Тесла; Sber Box|Сбер бокс|салют; Marusya|Маруся"))

k("letter_logo_brands", "everyday", "Name a brand whose main logo is the letters of its name", "Назовите бренд, основной логотип которого буквы его названия",
  "A brand whose logo is mainly its name or initials written in letters (wordmark/lettermark): Coca-Cola, Google, IBM, Sony, Samsung, FedEx, CNN, HP, LG, Visa, Zara, Disney, eBay, Netflix, Yandex, Ozon, Avito, Kodak, Gucci (GG), Chanel (CC), Louis Vuitton (LV), Dior, HBO, NASA, BBC, Canon, Nikon, Lego.",
  L("Coca-Cola|Кока кола; Google|Гугл; IBM|Ай би эм; Sony|Сони; Samsung|Самсунг; FedEx|Федекс; CNN|Си эн эн; HP|Эйч пи; LG|Эл джи; Visa|Виза; Zara|Зара; Disney|Дисней; eBay|Ибэй; "
    "Netflix|Нетфликс; Yandex|Яндекс; Ozon|Озон; Avito|Авито; Kodak|Кодак; Gucci|Гуччи; Chanel|Шанель; Louis Vuitton|Луи Виттон; Dior|Диор; HBO|Эйч би о; NASA|НАСА; BBC|Би би си; "
    "Canon|Кэнон; Nikon|Никон; Lego|Лего; Kellogg's|Келлогс; Ford|Форд; Dell|Делл; Intel|Интел; Facebook|Фейсбук; Amazon|Амазон; Microsoft|Майкрософт; Panasonic|Панасоник; "
    "Philips|Филипс; Siemens|Сименс; Bosch|Бош; Toshiba|Тошиба; Fanta|Фанта;  Sprite|Спрайт; Lay's|Лейс; M&M's|Эм энд эмс; KFC|КФС; H&M|Эйч энд эм; MTV|Эм ти ви; "
    "VK|ВК; MTS|МТС;   RZD|РЖД;   Wildberries|Вайлдберриз; Kaspersky|Касперский; Mail.ru|Мэйл ру;  "
    "Volkswagen|Фольксваген|vw; BMW|БМВ; Fendi|Фенди; Yves Saint Laurent|Ив Сен Лоран|ysl; DKNY|Ди кей эн уай; Supreme|Суприм; Calvin Klein|Кельвин Кляйн|ck; Hermès|Эрмес; Prada|Прада; "
    "Armani|Армани;  Uber|Убер;   YouTube|Ютуб;  Instagram|Инстаграм"),
  "Apple/Эпл/Nike/Найк/Shell/Шелл/Mercedes/Мерседес/Starbucks/Старбакс/Twitter/Твиттер/Telegram/Телеграм/Puma/Пума")

k("wind_powered_vehicles", "transport", "Name a vehicle that can be moved by the wind", "Назовите транспортное средство, которое может двигаться за счёт ветра",
  "A vehicle propelled by wind: sailboat, yacht, sailing ship, windsurf board, kitesurf board, ice yacht (iceboat), land yacht, hot air balloon (drifts), glider (air currents), paraglider, hang glider, kite buggy, felucca, junk, catamaran, clipper, frigate (sailing), caravel, galleon, snowkite.",
  L("Sailboat|Парусник|парусная лодка; Yacht|Яхта; Sailing ship|Парусное судно; Windsurf board|Виндсёрф; Kitesurf board|Кайтборд; Ice yacht|Буер; Land yacht|Сухопутная яхта; "
    "Hot air balloon|Воздушный шар; Glider|Планер; Paraglider|Параплан; Hang glider|Дельтаплан; Kite buggy|Кайт багги; Felucca|Фелука; Junk|Джонка; Catamaran|Катамаран; Clipper|Клипер; "
    "Frigate|Фрегат; Caravel|Каравелла; Galleon|Галеон; Snowkite|Сноукайт; Brig|Бриг; Schooner|Шхуна; Barque|Барк; Dhow|Дау; Longship|Драккар; Koch|Коч; Lodya|Ладья; Trimaran|Тримаран; "
    "Dinghy|Швертбот; Optimist|Оптимист; Windmill car|Ветромобиль; Rotor ship|Роторное судно; Kite ship|Судно с кайтом; Wingfoil|Вингфойл; Parasail|Парасейл; Sailplane|Планер парусный; "
    "Zeppelin drift|Дирижабль; Weather balloon|Метеозонд;  Raft with sail|Плот с парусом; Kon-Tiki|Кон тики; Sail cart|Парусная тележка; Paper boat|Бумажный кораблик; "
    "Solar sail|Солнечный парус; Pirate ship|Пиратский корабль; Scarlet Sails ship|Алые паруса; Cog|Когг; Carrack|Каракка; Sloop|Шлюп; Cutter|Тендер; Ketch|Кеч; Proa|Проа; Outrigger|Аутригер"))

k("laser_devices", "science", "Name a device whose main function uses a laser", "Назовите устройство, которое использует лазер для основной функции",
  "A device that relies on a laser for its main job: laser printer, laser pointer, barcode scanner, CD/DVD/Blu-ray player, laser cutter, laser engraver, laser level, rangefinder, LiDAR, laser tag gun, laser hair removal, eye surgery laser (LASIK), laser show projector, optical mouse (laser), fiber optic transmitter, laser sight, laser speed gun.",
  L("Laser printer|Лазерный принтер; Laser pointer|Лазерная указка; Barcode scanner|Сканер штрих кодов; CD player|Сд плеер|проигрыватель дисков; DVD player|Двд плеер; Blu-ray player|Блю рэй плеер; "
    "Laser cutter|Лазерный резак|лазерная резка; Laser engraver|Лазерный гравёр; Laser level|Лазерный уровень; Rangefinder|Лазерный дальномер|дальномер; LiDAR|Лидар; Laser tag gun|Бластер для лазертага|лазертаг; "
    "Laser hair removal|Лазерная эпиляция; LASIK|Лазерная коррекция зрения; Laser show projector|Лазерный проектор; Laser mouse|Лазерная мышь; Fiber optic transmitter|Оптоволоконный передатчик; "
    "Laser sight|Лазерный прицел|лцу; Speed gun|Лазерный радар|лидар скорости; 3D scanner|3д сканер; Laser welder|Лазерная сварка; Laser tattoo removal|Удаление тату лазером; Laser scalpel|Лазерный скальпель; "
    "Laser therapy device|Лазерная терапия; Holography|Голограф; Laser thermometer|Пирометр; Laser keyboard|Лазерная клавиатура; Laser harp|Лазерная арфа; Laser cannon|Лазерная пушка; "
    "Laser weapon|Лазерное оружие; LIDAR on car|Лидар беспилотника; Robot vacuum|Робот пылесос с лидаром; Face ID|Фейс айди; Laser projector|Лазерный проектор кино; Laser levelling|Нивелир лазерный; "
    "Laser marking machine|Лазерная маркировка; Laser distance meter|Лазерная рулетка; Laser alarm|Лазерная сигнализация; Laser fence|Лазерная растяжка;  "
    "  Gravitational wave detector|Лиго;  Laser rangefinder camera|Автофокус лазерный; Supermarket scanner|Сканер на кассе"))

# ---------- 10. Unusual associations ----------
k("restaurant_and_ship", "everyday", "Name something found both in a restaurant and aboard a ship", "Назовите то, что можно найти и в ресторане, и на борту корабля",
  "Something that exists both in a restaurant and on a ship: kitchen (galley), cook, menu, tables, chairs, plates, cutlery, waiter, steward, bar, glasses, napkins, refrigerator, stove, toilet, tablecloth, fish, wine, captain no (but captain's table), anchor decor.",
  L("Kitchen|Кухня|камбуз; Cook|Повар|кок; Menu|Меню; Tables|Столы; Chairs|Стулья; Plates|Тарелки; Cutlery|Столовые приборы; Waiter|Официант; Steward|Стюард; Bar|Бар; Glasses|Бокалы|стаканы; "
    "Napkins|Салфетки; Refrigerator|Холодильник; Stove|Плита; Toilet|Туалет; Tablecloth|Скатерть; Fish|Рыба; Wine|Вино; Bartender|Бармен; Food|Еда; Dishes|Посуда; Pots|Кастрюли; "
    "Knives|Ножи; Salt|Соль; Pepper|Перец; Bread|Хлеб; Water|Вода; Ice|Лёд; Coffee|Кофе; Tea|Чай; Cups|Чашки; Trays|Подносы; Lamps|Лампы; Windows|Окна; Portholes|Иллюминаторы; "
    "Music|Музыка; Musicians|Музыканты; Dance floor|Танцпол; Guests|Гости|посетители; Passengers|Пассажиры; Manager|Администратор; Cash register|Касса; Fire extinguisher|Огнетушитель; "
    "Life buoy decor|Спасательный круг; Anchor|Якорь; Ship's wheel decor|Штурвал на стене; Aquarium|Аквариум; Lobster|Лобстер; Seafood|Морепродукты; Champagne|Шампанское; Candles|Свечи; "
    "Dishwasher|Посудомойщик; Cleaner|Уборщик; Uniform|Форма; Bell|Колокольчик; Rope|Канат; Captain's table|Капитанский стол; Buffet|Шведский стол; Wardrobe|Гардероб; Menu board|Доска меню"))

k("heirlooms", "everyday", "Name something traditionally passed down as an inheritance", "Назовите предмет, который традиционно передают по наследству",
  "An object traditionally handed down through generations: wedding ring, jewellery, watch, pocket watch, icon, family photos, photo album, furniture, piano, sword, medals, orders, house, land, coins, silverware, china set, recipe book, Bible, letters, diary, samovar, embroidered towel, quilt, painting, violin, crown.",
  L("Wedding ring|Обручальное кольцо|кольцо; Jewellery|Украшения|драгоценности; Watch|Часы; Pocket watch|Карманные часы; Icon|Икона; Family photos|Семейные фотографии; Photo album|Фотоальбом; "
    "Furniture|Мебель|бабушкин комод; Piano|Пианино|фортепиано; Sword|Меч|шашка; Medals|Медали; Orders|Ордена; House|Дом; Land|Земля|участок; Coins|Монеты|коллекция монет; Silverware|Столовое серебро; "
    "China set|Сервиз; Recipe book|Книга рецептов|рецепты; Bible|Библия; Letters|Письма; Diary|Дневник; Samovar|Самовар; Embroidered towel|Рушник; Quilt|Лоскутное одеяло; Painting|Картина; "
    "Violin|Скрипка; Crown|Корона; Throne|Трон; Title|Титул; Family tree|Родословная|генеалогическое древо; Brooch|Брошь; Earrings|Серьги; Necklace|Ожерелье|колье; Cufflinks|Запонки; "
    "Signet ring|Перстень; Cross|Нательный крестик; Books|Книги|библиотека; Clock|Часы с боем; Mirror|Зеркало; Chest|Сундук; Dowry|Приданое; Wedding dress|Свадебное платье; Shawl|Шаль|оренбургский платок; "
    "Carpet|Ковёр; Sewing machine|Швейная машинка; Tools|Инструменты; Car|Машина; Apartment|Квартира; Dacha|Дача; Business|Бизнес; Money|Деньги; Gold|Золото; Stamps|Марки|коллекция марок; "
    "Weapon|Ружьё|оружие; Dagger|Кинжал; Military uniform|Мундир; Rosary|Чётки; Hand-written cookbook|Бабушкина тетрадь с рецептами; Lace|Кружево; Tablecloth|Скатерть; Embroidery|Вышивка"))

k("paper_and_digital", "everyday", "Name something that can exist both on paper and in electronic form", "Назовите то, что может существовать и в бумажном, и в электронном виде",
  "Something available both as paper and digital: book, ticket, passport (e-passport), money (banknotes / e-money), newspaper, magazine, letter, map, receipt, contract, diary, photo, calendar, notebook, document, signature, invoice, boarding pass, menu, comic, encyclopedia, dictionary, certificate, diploma, medical record, card, postcard, form.",
  L("Book|Книга|электронная книга; Ticket|Билет; Passport|Паспорт; Money|Деньги; Newspaper|Газета; Magazine|Журнал; Letter|Письмо; Map|Карта; Receipt|Чек; Contract|Договор; Diary|Дневник|электронный дневник; "
    "Photo|Фотография; Calendar|Календарь; Notebook|Блокнот; Document|Документ; Signature|Подпись; Invoice|Счёт; Boarding pass|Посадочный талон; Menu|Меню; Comic|Комикс; Encyclopedia|Энциклопедия; "
    "Dictionary|Словарь; Certificate|Сертификат|справка; Diploma|Диплом; Medical record|Медицинская карта; Postcard|Открытка; Form|Анкета|бланк; Textbook|Учебник; Homework|Домашнее задание; "
    "Test|Тест|контрольная; Exam|Экзамен; Report card|Дневник с оценками|табель; Gift card|Подарочный сертификат; Coupon|Купон; Voucher|Ваучер; Business card|Визитка; Invitation|Приглашение; "
    "Album|Альбом; Note|Записка|заметка; To-do list|Список дел; Shopping list|Список покупок; Recipe|Рецепт; Prescription|Рецепт врача; Insurance policy|Полис; Driver's license|Права; "
    "Student card|Студенческий; Library card|Читательский билет; Bank statement|Выписка; Bill|Квитанция; Fine|Штраф; Will|Завещание; Constitution|Конституция; Law|Закон; Order|Приказ; "
    "Resume|Резюме; Questionnaire|Опросник; Ballot|Бюллетень; Score sheet|Ноты; Sheet music|Ноты; Drawing|Рисунок; Blueprint|Чертёж; Poster|Плакат|постер; Flyer|Листовка; Brochure|Буклет"))

k("memory_keeping_items", "everyday", "Name an object made specially to keep memories", "Назовите предмет, который специально создают для хранения воспоминаний",
  "An object created to preserve memories: photo album, diary, scrapbook, memory box, time capsule, souvenir, photo frame, video recording, keepsake locket, travel journal, guest book, yearbook, wedding album, baby book, memorial plaque, monument, postcard collection, digital photo frame, cloud backup, fridge magnets.",
  L("Photo album|Фотоальбом; Diary|Дневник; Scrapbook|Скрапбук; Memory box|Шкатулка с памятными вещами|коробка воспоминаний; Time capsule|Капсула времени; Souvenir|Сувенир; Photo frame|Фоторамка; "
    "Video recording|Видеозапись; Locket|Медальон; Travel journal|Дневник путешествий; Guest book|Гостевая книга; Yearbook|Выпускной альбом; Wedding album|Свадебный альбом; Baby book|Альбом малыша; "
    "Memorial plaque|Мемориальная доска; Monument|Памятник; Postcards|Открытки; Digital photo frame|Цифровая фоторамка; Cloud storage|Облако|облачное хранилище; Fridge magnet|Магнит на холодильник; "
    "Photograph|Фотография; Polaroid|Полароид; Letter|Письмо; Diary of memories|Альбом воспоминаний; Family tree|Родословная; Memoirs|Мемуары; Autobiography|Автобиография; Blog|Блог; "
    "Vlog|Влог; Instagram|Инстаграм; Hard drive|Жёсткий диск; Flash drive|Флешка; Video cassette|Видеокассета; Film|Фотоплёнка; Negatives|Негативы; Ticket stubs|Корешки билетов; "
    "Medal|Медаль; Trophy|Кубок; Certificate|Грамота; Diploma|Диплом; Graduation ribbon|Лента выпускника; Wedding dress|Свадебное платье; Lock of hair|Локон волос; First tooth box|Шкатулка для молочных зубов; "
    "Handprint cast|Слепок ручки; Engraved ring|Кольцо с гравировкой; Memorial tattoo|Тату на память; Message board|Доска пожеланий; Calendar|Календарь; Planner|Ежедневник; Museum|Музей; Archive|Архив"))

k("serial_number_things", "everyday", "Name something that can have its own serial number", "Назовите то, у чего может быть собственный серийный номер",
  "Something marked with a unique serial number: banknote, smartphone, laptop, car (VIN), engine, gun, watch, camera, TV, refrigerator, passport, bicycle frame, lottery ticket, game console, ticket, software license, phone SIM, bond, share certificate, medal, Oscar statuette, guitar, airplane, tank, diploma, battery.",
  L("Banknote|Купюра|банкнота; Smartphone|Смартфон|телефон; Laptop|Ноутбук; Car|Машина|вин номер; Engine|Двигатель; Gun|Оружие|пистолет; Watch|Часы; Camera|Фотоаппарат; TV|Телевизор; "
    "Refrigerator|Холодильник; Passport|Паспорт; Bicycle frame|Велосипед; Lottery ticket|Лотерейный билет; Game console|Приставка; Ticket|Билет; Software license|Лицензия программы|ключ; SIM card|Сим карта; "
    "Bond|Облигация; Share certificate|Акция; Medal|Медаль; Oscar statuette|Статуэтка Оскар; Guitar|Гитара; Airplane|Самолёт; Tank|Танк; Diploma|Диплом; Battery|Аккумулятор; Computer|Компьютер; "
    "Monitor|Монитор; Printer|Принтер; Washing machine|Стиральная машина; Microwave|Микроволновка; Headphones|Наушники; Tablet|Планшет; Router|Роутер; Graphics card|Видеокарта; Hard drive|Жёсткий диск; "
    "Processor|Процессор; Motorcycle|Мотоцикл; Ship|Корабль; Train car|Вагон; Rifle|Винтовка; Ammunition box|Ящик патронов; Order|Орден; Coin|Монета коллекционная; Gold bar|Золотой слиток; "
    "Document|Документ; Driver's license|Права; Insurance policy|Полис; Check|Чек; Receipt|Кассовый чек; Bank card|Банковская карта; Gift card|Подарочная карта; Collectible card|Коллекционная карточка; "
    "Limited edition sneaker|Лимитированные кроссовки; Art print|Принт картины; Book limited edition|Нумерованное издание; Wine bottle|Бутылка вина нумерованная; Electricity meter|Счётчик; Gas meter|Газовый счётчик; Water meter|Счётчик воды"))

k("lab_and_kitchen_items", "everyday", "Name an item found both in a laboratory and in a kitchen", "Назовите предмет, который можно встретить и в лаборатории, и на кухне",
  "An object used both in a lab and in a kitchen: scales, measuring cup, thermometer, timer, gloves, apron, glass jars, funnel, sieve (strainer), pipette (dropper), mortar and pestle, refrigerator, freezer, microwave, burner (stove), tongs, beaker/glass, spoon, knife, cutting board, kettle, blender, centrifuge (salad spinner), pressure cooker (autoclave).",
  L("Scales|Весы; Measuring cup|Мерный стакан; Thermometer|Термометр|градусник; Timer|Таймер; Gloves|Перчатки;  Glass jars|Стеклянные банки; Funnel|Воронка; Sieve|Сито|дуршлаг; "
    "Pipette|Пипетка; Mortar and pestle|Ступка; Refrigerator|Холодильник; Freezer|Морозилка; Microwave|Микроволновка; Burner|Горелка|плита; Tongs|Щипцы; Beaker|Стакан|колба; Spoon|Ложка; "
    "Knife|Нож; Cutting board|Доска; Kettle|Чайник; Blender|Блендер; Salad spinner|Центрифуга; Pressure cooker|Скороварка|автоклав; Mixer|Миксер; Whisk|Венчик; Spatula|Шпатель|лопатка; "
    "Bowl|Миска; Pot|Кастрюля; Water bath|Водяная баня; Distiller|Дистиллятор|самогонный аппарат; Filter|Фильтр; Paper towels|Бумажные полотенца; Dish soap|Моющее средство; Sink|Раковина; "
    "Fume hood|Вытяжка; Oven|Духовка|сушильный шкаф; Tray|Поднос|лоток; Containers|Контейнеры; Labels|Этикетки; Marker|Маркер; Notebook|Журнал записей; Goggles|Защитные очки; Fire extinguisher|Огнетушитель; "
    "  Salt|Соль; Sugar|Сахар; Vinegar|Уксус; Baking soda|Сода; Citric acid|Лимонная кислота; Alcohol|Спирт; Water|Вода; Ice|Лёд; Tweezers|Пинцет; Syringe|Шприц кондитерский; "
    "Magnetic stirrer|Магнитная мешалка; Hot plate|Электроплитка; Vacuum sealer|Вакууматор; Dehydrator|Сушилка; Grinder|Мельница|кофемолка"))

k("jewelry_membership_symbols", "everyday", "Name something that is both jewellery and a symbol of belonging to a group", "Назовите то, что одновременно украшение и символ принадлежности к группе",
  "An adornment that also shows membership: wedding ring, class ring, signet ring, badge, pin, brooch with emblem, cross pendant, Star of David, crescent pendant, friendship bracelet, fraternity pin, medal, order, military insignia, tattoo, Masonic ring, Olympic pin, school badge, Pioneer badge, Komsomol badge.",
  L("Wedding ring|Обручальное кольцо; Class ring|Выпускное кольцо; Signet ring|Перстень с печаткой; Badge|Значок; Pin|Пин|брошка значок; Emblem brooch|Брошь с эмблемой; Cross pendant|Нательный крест|крестик; "
    "Star of David|Звезда Давида; Crescent pendant|Полумесяц на цепочке; Friendship bracelet|Браслет дружбы|фенечка; Fraternity pin|Значок братства; Medal|Медаль; Order|Орден; "
    "Military insignia|Погоны|знаки различия; Tattoo|Татуировка; Masonic ring|Масонское кольцо; Olympic pin|Олимпийский значок; School badge|Школьный значок; Pioneer badge|Пионерский значок; "
    "Komsomol badge|Комсомольский значок; Pioneer tie|Пионерский галстук; Champion ring|Чемпионский перстень; Super Bowl ring|Перстень Супербоула; Team bracelet|Командный браслет; "
    "Couple rings|Парные кольца; Engagement ring|Помолвочное кольцо; Rosary|Чётки; Amulet|Оберег; Talisman|Талисман; Clan tartan brooch|Клановая брошь; Bindi|Бинди; Kara bracelet|Кара; "
    "Red thread|Красная нить; Hamsa|Хамса; Evil eye|Глаз от сглаза|назар; Ankh|Анх; Pentagram|Пентаграмма; Peace sign|Пацифик; Rainbow pin|Радужный значок; Ribbon|Георгиевская лента|лента; "
    "Lapel pin|Значок на лацкане; Deputy badge|Депутатский значок; Graduation pin|Значок выпускника; University ring|Университетское кольцо;  Club pin|Клубный значок; "
    "Cufflinks with emblem|Запонки с эмблемой; Tie clip|Зажим для галстука с гербом; Crown|Корона; Tiara|Тиара; Laurel wreath|Лавровый венок; Feather headdress|Головной убор из перьев; Earring|Серьга у моряков"))

k("obsolete_items", "everyday", "Name something that used to be common but is now obsolete", "Назовите предмет, который раньше был распространён, а сейчас устарел",
  "An object once common but now outdated: pager, floppy disk, cassette, VHS tape, VCR, typewriter, rotary phone, telephone booth, fax, CRT TV, film camera, Walkman, Discman, slide projector, telegraph, abacus, gramophone, kerosene lamp, iron (coal iron), quill pen, inkwell, payphone, dial-up modem, mini-disc, encyclopedia volumes, punch cards.",
  L("Pager|Пейджер; Floppy disk|Дискета; Cassette|Кассета|аудиокассета; VHS tape|Видеокассета; VCR|Видеомагнитофон; Typewriter|Пишущая машинка; Rotary phone|Дисковый телефон; Phone booth|Телефонная будка; "
    "Fax|Факс; CRT TV|Ламповый телевизор|кинескопный телевизор; Film camera|Плёночный фотоаппарат; Walkman|Плеер кассетный|вокмен; Discman|Дискмен|сд плеер; Slide projector|Диапроектор|диафильмы; "
    "Telegraph|Телеграф; Abacus|Счёты; Gramophone|Граммофон|патефон; Kerosene lamp|Керосиновая лампа|керосинка; Coal iron|Угольный утюг; Quill pen|Гусиное перо; Inkwell|Чернильница; Payphone|Таксофон; "
    "Dial-up modem|Диалап модем; MiniDisc|Минидиск; Encyclopedia volumes|Бумажная энциклопедия; Punch cards|Перфокарты; Telegram|Телеграмма;  "
    "Tape recorder|Магнитофон; Reel-to-reel|Катушечный магнитофон; Radio set|Радиола; Camcorder|Видеокамера кассетная;  Overhead projector|Кодоскоп; Film strip|Диафильм; "
    "Slide rule|Логарифмическая линейка; Arithmometer|Арифмометр; Telex|Телекс; Teletype|Телетайп; Spinning wheel|Прялка; Washboard|Стиральная доска; Mangle|Валёк|рубель;  "
    "Primus stove|Примус; Kerogas|Керогаз; Icebox|Ледник;   PDA|КПК|карманный компьютер; Nokia 3310|Нокиа 3310; Flip phone|Раскладушка; "
    "Tamagotchi|Тамагочи; Game Boy|Геймбой; Dendy|Денди; Sega|Сега; CD|Компакт диск; DVD|Двд;  Answering machine|Автоответчик; Phone book|Телефонный справочник;  "
    "Encyclopedia Britannica|Британника; Video rental|Видеопрокат; Photo lab|Фотоателье; Carbon paper|Копирка; Stencil duplicator|Ротатор; Gas lamp|Газовый фонарь; Horse carriage|Карета; Steam locomotive|Паровоз"),
  "Smartphone/Смартфон/Laptop/Ноутбук/Electric car/Электромобиль/Drone/Дрон/Smartwatch/Умные часы")

k("named_non_living_things", "everyday", "Name something that can have its own name but is not a person, animal or place", "Назовите то, у чего может быть собственное имя, но это не человек, не животное и не географический объект",
  "A thing that can carry a proper name and is not a person, animal or geographic feature: ship (Titanic), hurricane (Katrina), car (pet name), rocket, spacecraft (Vostok), train (Sapsan), plane (Mriya), bell (Tsar Bell), cannon (Tsar Cannon), diamond (Kohinoor), sword (Excalibur), robot, AI assistant (Alice, Siri), doll, teddy bear, guitar (Lucille), company, band, storm, star (Sirius), planet, comet (Halley).",
  L("Ship|Корабль|титаник; Hurricane|Ураган|катрина; Car|Машина с именем; Rocket|Ракета; Spacecraft|Космический корабль|восток; Train|Поезд|сапсан/ласточка; Plane|Самолёт|мрия; Bell|Колокол|царь колокол; "
    "Cannon|Пушка|царь пушка; Diamond|Алмаз|кохинур; Sword|Меч|экскалибур; Robot|Робот; AI assistant|Голосовой помощник|алиса/сири; Doll|Кукла|барби; Teddy bear|Плюшевый мишка; Guitar|Гитара; "
    "Company|Компания; Band|Группа; Storm|Шторм; Star|Звезда|сириус; Planet|Планета; Comet|Комета|галлея; Asteroid|Астероид; Galaxy|Галактика|андромеда; Constellation|Созвездие; "
    "Satellite|Спутник; Space station|Космическая станция|мир/мкс; Submarine|Подводная лодка|курск; Tank|Танк; Locomotive|Паровоз; Yacht|Яхта; Boat|Лодка; Building|Здание|эмпайр стейт; "
    "Bridge|Мост; Tower|Башня; Statue|Статуя; Monument|Памятник; Painting|Картина|мона лиза; Book|Книга; Song|Песня; Film|Фильм; Computer|Компьютер|хал 9000; Supercomputer|Суперкомпьютер; "
    "Toy|Игрушка; Puppet|Кукла марионетка; Stuffed toy|Мягкая игрушка; Gun|Ружьё; Weapon|Оружие; Brand|Бренд; Restaurant|Ресторан; Hotel|Отель; Stadium|Стадион; Theatre|Театр; "
    "Typhoon|Тайфун;   Tree|Дерево|генерал шерман; Organ|Орган; Clock|Часы|биг бен; Crown|Корона|шапка мономаха; Jewel|Драгоценность; Egg|Яйцо фаберже; "
    "Snowman|Снеговик; Scarecrow|Пугало; Ghost|Призрак; Character|Персонаж; Mascot|Талисман|олимпийский мишка; Operation|Военная операция; Project|Проект; Program|Программа; Law|Закон; Wine|Вино"))
