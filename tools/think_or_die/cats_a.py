# THINK OR DIE category content, part A (animals, objects, food, words, geography, body).
# Line format: "English|Русский|alias/alias".  Merged into categories.json by build_categories.py.
C = []
def cat(id, type, group, en, ru, cen, cru, answers, invalid="", **kw):
    C.append(dict(id=id, type=type, group=group, en=en, ru=ru, criteriaEn=cen, criteriaRu=cru,
                  answers=answers, invalid=invalid, **kw))

# ---------- 1. Animals ----------
cat("egg_laying_not_bird", "KNOWLEDGE", "animals",
    "Name an animal that lays eggs but is not a bird", "Назовите животное, которое откладывает яйца, но не является птицей",
    "Any non-bird animal species that reproduces by laying eggs: reptiles, amphibians, most fish, insects, spiders, monotremes, molluscs and so on. Birds and live-bearing mammals are wrong.",
    "Любое животное, кроме птиц, которое откладывает яйца: рептилии, амфибии, большинство рыб, насекомые, пауки, утконос, ехидна, моллюски.",
    """Platypus|Утконос
Echidna|Ехидна
Crocodile|Крокодил
Alligator|Аллигатор
Turtle|Черепаха|tortoise/sea turtle/морская черепаха
Snake|Змея|python/питон/cobra/кобра/viper/гадюка
Lizard|Ящерица|gecko/геккон/iguana/игуана
Chameleon|Хамелеон
Komodo dragon|Комодский варан|monitor lizard/варан
Frog|Лягушка
Toad|Жаба
Salamander|Саламандра
Newt|Тритон
Salmon|Лосось|сёмга
Fish|Рыба
Shark|Акула
Octopus|Осьминог
Squid|Кальмар
Snail|Улитка
Spider|Паук
Scorpion|Скорпион
Ant|Муравей
Bee|Пчела
Butterfly|Бабочка
Mosquito|Комар
Fly|Муха
Ladybug|Божья коровка|ladybird
Beetle|Жук
Cockroach|Таракан
Grasshopper|Кузнечик
Dinosaur|Динозавр
Starfish|Морская звезда
Jellyfish|Медуза
Crab|Краб
Lobster|Омар|лобстер
Shrimp|Креветка
Sea urchin|Морской ёж
Tick|Клещ
Worm|Червь|earthworm/дождевой червь""",
    "Chicken/Курица/Penguin/Пингвин/Ostrich/Страус/Duck/Утка/Eagle/Орёл/Dog/Собака/Cat/Кошка/Cow/Корова/Dolphin/Дельфин/Whale/Кит/Bat/Летучая мышь/Human/Человек")

cat("horned_animals", "KNOWLEDGE", "animals",
    "Name an animal with horns", "Назовите животное с рогами",
    "An animal species whose males or females naturally grow horns or antlers (bovids, deer, rhinos, giraffe ossicones, horned lizards, horned beetles). Hornless animals are wrong.",
    "Животное, у которого от природы есть рога: коровы, козы, олени, носороги, жирафы, рогатые жуки и ящерицы.",
    """Cow|Корова|bull/бык/ox/вол
Goat|Коза|козёл
Sheep|Овца|ram/баран
Deer|Олень|reindeer/северный олень/stag
Moose|Лось|elk
Rhinoceros|Носорог|rhino
Buffalo|Буйвол
Bison|Бизон|зубр
Yak|Як
Antelope|Антилопа
Gazelle|Газель
Giraffe|Жираф
Ibex|Горный козёл|козерог
Mountain goat|Снежная коза
Wildebeest|Гну
Impala|Импала
Oryx|Орикс
Kudu|Куду
Chamois|Серна
Saiga|Сайгак
Musk ox|Овцебык
Zebu|Зебу
Rhinoceros beetle|Жук носорог
Stag beetle|Жук олень
Horned lizard|Рогатая ящерица
Narwhal|Нарвал
Triceratops|Трицератопс
Okapi|Окапи
Markhor|Мархур
Water buffalo|Водяной буйвол
Pronghorn|Вилорог
Mouflon|Муфлон
Argali|Архар
Bighorn sheep|Толсторог""",
    "Horse/Лошадь/Elephant/Слон/Unicorn/Единорог/Pig/Свинья/Dog/Собака/Cat/Кошка/Bear/Медведь/Lion/Лев/Camel/Верблюд/Hippo/Бегемот/Walrus/Морж")

cat("more_than_four_legs", "KNOWLEDGE", "animals",
    "Name an animal with more than four legs", "Назовите животное, у которого больше четырёх ног",
    "An animal that has more than four legs or walking limbs: insects (six), arachnids (eight), crustaceans, centipedes, millipedes, octopuses and squid (arms count). Four legs or fewer is wrong.",
    "Животное, у которого больше четырёх ног или конечностей: насекомые, пауки, ракообразные, многоножки, осьминоги и кальмары (щупальца считаются).",
    """Spider|Паук|tarantula/тарантул
Ant|Муравей
Bee|Пчела|wasp/оса/bumblebee/шмель
Fly|Муха
Mosquito|Комар
Butterfly|Бабочка
Beetle|Жук
Ladybug|Божья коровка|ladybird
Cockroach|Таракан
Grasshopper|Кузнечик|cricket/сверчок
Dragonfly|Стрекоза
Scorpion|Скорпион
Tick|Клещ
Crab|Краб
Lobster|Омар|лобстер
Crayfish|Рак|речной рак
Shrimp|Креветка
Centipede|Сороконожка|многоножка
Millipede|Кивсяк|двупарноногая многоножка
Octopus|Осьминог
Squid|Кальмар
Starfish|Морская звезда
Praying mantis|Богомол|mantis
Flea|Блоха
Louse|Вошь
Termite|Термит
Caterpillar|Гусеница
Woodlouse|Мокрица
Moth|Моль|мотылёк
Cuttlefish|Каракатица
Horseshoe crab|Мечехвост
Stick insect|Палочник""",
    "Dog/Собака/Cat/Кошка/Horse/Лошадь/Snake/Змея/Snail/Улитка/Worm/Червь/Lizard/Ящерица/Frog/Лягушка/Bird/Птица/Human/Человек/Elephant/Слон/Fish/Рыба")

cat("ocean_animals", "KNOWLEDGE", "animals",
    "Name an animal that lives in the ocean", "Назовите животное, обитающее в океане",
    "An animal species that lives in the sea or ocean (marine fish, mammals, reptiles, invertebrates, seabirds that live at sea count only if mainly marine like penguins). Strictly freshwater or land animals are wrong.",
    "Животное, которое живёт в море или океане: морские рыбы, киты, тюлени, черепахи, медузы, кораллы, моллюски. Пресноводные и сухопутные звери не подходят.",
    """Shark|Акула|white shark/белая акула
Whale|Кит|blue whale/синий кит/humpback/горбатый кит
Dolphin|Дельфин
Orca|Косатка|killer whale
Octopus|Осьминог
Squid|Кальмар
Jellyfish|Медуза
Starfish|Морская звезда
Sea turtle|Морская черепаха
Seal|Тюлень
Sea lion|Морской лев
Walrus|Морж
Crab|Краб
Lobster|Омар|лобстер
Shrimp|Креветка
Tuna|Тунец
Cod|Треска
Herring|Сельдь|селёдка
Sardine|Сардина
Swordfish|Рыба меч
Stingray|Скат|manta ray/манта
Seahorse|Морской конёк
Sea urchin|Морской ёж
Coral|Коралл
Clam|Моллюск|mussel/мидия/oyster/устрица
Narwhal|Нарвал
Beluga|Белуха
Clownfish|Рыба клоун
Moray eel|Мурена
Barracuda|Барракуда
Sea otter|Калан|морская выдра
Manatee|Ламантин
Dugong|Дюгонь
Penguin|Пингвин
Pufferfish|Рыба фугу|фугу/иглобрюх
Anglerfish|Удильщик
Mackerel|Скумбрия
Flounder|Камбала
Halibut|Палтус
Cuttlefish|Каракатица
Plankton|Планктон|krill/криль
Sperm whale|Кашалот""",
    "Carp/Карп/Pike/Щука/Catfish/Сом/Frog/Лягушка/Crocodile/Крокодил/Hippo/Бегемот/Beaver/Бобр/Duck/Утка/Dog/Собака/Cat/Кошка/Goldfish/Золотая рыбка/Trout/Форель/Perch/Окунь")

cat("nocturnal_animals", "KNOWLEDGE", "animals",
    "Name a mostly nocturnal animal", "Назовите животное, ведущее преимущественно ночной образ жизни",
    "An animal species that is active mainly at night (owls, bats, hedgehogs, moths, many cats and rodents, raccoons and so on). Animals clearly active by day are wrong.",
    "Животное, которое активно в основном ночью: совы, летучие мыши, ёжики, мотыльки, еноты, многие кошачьи и грызуны.",
    """Owl|Сова|филин/сыч
Bat|Летучая мышь|нетопырь
Hedgehog|Ёж|ёжик
Raccoon|Енот
Fox|Лиса
Badger|Барсук
Moth|Мотылёк|ночная бабочка
Firefly|Светлячок
Mouse|Мышь
Rat|Крыса
Hamster|Хомяк
Opossum|Опоссум
Skunk|Скунс
Aardvark|Трубкозуб
Armadillo|Броненосец
Lemur|Лемур|aye aye/руконожка
Loris|Лори|slow loris/толстый лори
Tarsier|Долгопят
Kiwi|Киви
Leopard|Леопард
Jaguar|Ягуар
Hyena|Гиена
Wolf|Волк
Lynx|Рысь
Porcupine|Дикобраз
Possum|Поссум
Wombat|Вомбат
Cockroach|Таракан
Gecko|Геккон
Scorpion|Скорпион
Sugar glider|Сахарный летяга|летяга
Nightjar|Козодой
Cat|Кошка
Mosquito|Комар
Vampire bat|Вампир|летучая мышь вампир""",
    "Eagle/Орёл/Butterfly/Бабочка/Bee/Пчела/Chicken/Курица/Squirrel/Белка/Horse/Лошадь/Cow/Корова/Dog/Собака/Human/Человек/Sparrow/Воробей/Giraffe/Жираф")

# ---------- 2. Object properties ----------
cat("inflatable_things", "SEMANTIC", "everyday",
    "Name something you can inflate with air", "Назовите предмет, который можно надуть воздухом",
    "An object that is normally filled with air or gas by pumping or blowing (balloons, balls, tyres, air mattresses, inflatable boats and toys). Things that cannot hold air are wrong.",
    "Предмет, который надувают воздухом: шарик, мяч, шина, надувной матрас, лодка, круг, игрушка.",
    """Balloon|Воздушный шарик|шарик/шар
Ball|Мяч|football/футбольный мяч/basketball/баскетбольный мяч
Tyre|Шина|tire/колесо/покрышка
Air mattress|Надувной матрас|матрас
Inflatable boat|Надувная лодка|лодка/raft/плот
Swim ring|Надувной круг|круг/rubber ring
Armbands|Нарукавники|water wings
Bouncy castle|Батут|надувной замок/батут замок
Beach ball|Пляжный мяч
Inflatable pool|Надувной бассейн|бассейн
Air pillow|Надувная подушка|подушка
Life jacket|Спасательный жилет
Airbag|Подушка безопасности
Hot air balloon|Воздушный шар|аэростат
Blimp|Дирижабль
Bicycle tube|Велокамера|камера/inner tube
Inflatable toy|Надувная игрушка|игрушка
Bagpipes|Волынка
Sofa|Надувной диван|диван
Tent|Надувная палатка|палатка
SUP board|Сап доска|sup|paddle board
Inflatable slide|Надувная горка|горка
Blood pressure cuff|Манжета тонометра|манжета
Condom|Презерватив
Lungs|Лёгкие
Football bladder|Камера мяча
Kayak|Надувная байдарка|байдарка
Raft|Рафт
Inflatable doll|Надувная кукла|кукла
Pool float|Надувной матрас для плавания|float""",
    "Brick/Кирпич/Rock/Камень/Table/Стол/Book/Книга/Phone/Телефон/Spoon/Ложка/Knife/Нож/Chair/Стул/Car/Машина/Pencil/Карандаш/Shoe/Ботинок")

cat("things_with_wheels", "SEMANTIC", "everyday",
    "Name something that usually has wheels", "Назовите предмет, который обычно имеет колёса",
    "An object or vehicle that normally moves on wheels or castors (cars, bikes, carts, office chairs, suitcases, skateboards and so on).",
    "Предмет или транспорт, который обычно стоит на колёсах: машина, велосипед, тележка, чемодан, офисное кресло, скейтборд.",
    """Car|Машина|автомобиль/авто
Bicycle|Велосипед|bike/велик
Motorcycle|Мотоцикл|мотик
Bus|Автобус
Truck|Грузовик|lorry/фура
Train|Поезд
Tram|Трамвай
Trolleybus|Троллейбус
Skateboard|Скейтборд|скейт
Roller skates|Ролики|rollerblades/роликовые коньки
Scooter|Самокат|kick scooter
Shopping cart|Тележка|trolley/магазинная тележка
Wheelbarrow|Тачка
Stroller|Коляска|pram/детская коляска
Wheelchair|Инвалидная коляска
Suitcase|Чемодан
Office chair|Офисное кресло|кресло
Tractor|Трактор
Airplane|Самолёт|plane
Cart|Телега|повозка/wagon
Carriage|Карета
Tricycle|Трёхколёсный велосипед
Toy car|Игрушечная машинка|машинка
Hospital bed|Больничная кровать
Lawn mower|Газонокосилка
Cannon|Пушка
Hoverboard|Гироскутер
Segway|Сегвей
Gurney|Каталка
Excavator|Экскаватор
Taxi|Такси
Ambulance|Скорая помощь|скорая
Fire truck|Пожарная машина
Monowheel|Моноколесо
Electric scooter|Электросамокат""",
    "Boat/Лодка/Ship/Корабль/Sled/Санки/Ski/Лыжи/Horse/Лошадь/Table/Стол/Book/Книга/Phone/Телефон/Tree/Дерево/Shoe/Ботинок/Helicopter/Вертолёт")

cat("rollable_things", "SEMANTIC", "everyday",
    "Name something you can roll up", "Назовите предмет, который можно свернуть в рулон",
    "A flat flexible object that can be rolled into a roll or tube (paper, carpets, towels, mats, maps, posters, fabric, tape, dough).",
    "Плоский гибкий предмет, который можно свернуть в рулон или трубку: бумага, ковёр, полотенце, коврик, карта, плакат, ткань.",
    """Carpet|Ковёр|rug/коврик
Yoga mat|Коврик для йоги|mat/туристический коврик/каремат
Towel|Полотенце
Toilet paper|Туалетная бумага
Paper towel|Бумажные полотенца
Poster|Плакат|постер
Map|Карта
Wallpaper|Обои
Fabric|Ткань|cloth/материя
Blanket|Одеяло|плед
Sleeping bag|Спальный мешок|спальник
Scroll|Свиток
Foil|Фольга
Cling film|Пищевая плёнка|плёнка
Tape|Скотч|лента/duct tape/изолента
Dough|Тесто
Linoleum|Линолеум
Turf|Рулонный газон|газон
Banknote|Купюра
Newspaper|Газета
Magazine|Журнал
Sushi mat|Коврик для суши
Bandage|Бинт
Ribbon|Лента
Carpet runner|Ковровая дорожка|дорожка
Baking paper|Пергамент|бумага для выпечки
Canvas|Холст
Measuring tape|Рулетка
Sleeve|Рукав
Pancake|Блин
Lavash|Лаваш
Film|Плёнка фотоплёнка|фотоплёнка
Diploma|Диплом
Paper|Бумага
Projection screen|Экран для проектора""",
    "Brick/Кирпич/Glass/Стекло/Table/Стол/Phone/Телефон/Plate/Тарелка/Rock/Камень/Bottle/Бутылка/Chair/Стул/Spoon/Ложка/Mirror/Зеркало/Egg/Яйцо")

cat("glass_objects", "SEMANTIC", "everyday",
    "Name an object usually made of glass", "Назовите предмет, который обычно изготовлен из стекла",
    "An object that is normally made mainly of glass (windows, mirrors, bottles, jars, glasses, light bulbs, lenses, vases, aquariums).",
    "Предмет, который обычно делают в основном из стекла: окно, зеркало, бутылка, банка, стакан, лампочка, линза, ваза, аквариум.",
    """Window|Окно|оконное стекло
Mirror|Зеркало
Bottle|Бутылка
Jar|Банка
Drinking glass|Стакан|glass
Wine glass|Бокал|фужер
Light bulb|Лампочка|лампа накаливания
Lens|Линза
Glasses|Очки|spectacles
Vase|Ваза
Aquarium|Аквариум
Test tube|Пробирка
Flask|Колба
Hourglass|Песочные часы
Windshield|Лобовое стекло
Christmas ornament|Ёлочная игрушка|ёлочный шар
Stained glass|Витраж
Magnifying glass|Лупа|увеличительное стекло
Shot glass|Рюмка
Decanter|Графин
Teapot|Стеклянный чайник
Microscope slide|Предметное стекло
Telescope lens|Объектив
Marble|Стеклянный шарик
Snow globe|Снежный шар
Thermometer|Градусник|термометр
Chandelier|Люстра
Glass door|Стеклянная дверь
Showcase|Витрина
Beer mug|Пивная кружка
Perfume bottle|Флакон духов|флакон
Lamp shade|Плафон
Monocle|Монокль
Bead|Бусина|бусы""",
    "Book/Книга/Brick/Кирпич/Shoe/Ботинок/Spoon/Ложка/Paper/Бумага/Chair/Стул/Towel/Полотенце/Coin/Монета/Pillow/Подушка/Sand/Песок/Knife/Нож")

cat("opened_with_key", "SEMANTIC", "everyday",
    "Name something you can open with a key", "Назовите предмет, который можно открыть ключом",
    "Something that normally has a lock opened with a key (doors, locks, safes, cars, cabinets, mailboxes, suitcases, diaries, handcuffs, cans with a key).",
    "То, что обычно запирается на замок и открывается ключом: дверь, замок, сейф, машина, шкаф, почтовый ящик, чемодан, наручники.",
    """Door|Дверь
Padlock|Навесной замок|замок/lock
Safe|Сейф
Car|Машина|автомобиль
Locker|Шкафчик
Cabinet|Шкаф
Drawer|Ящик стола|ящик
Mailbox|Почтовый ящик
Suitcase|Чемодан
Diary|Дневник с замком|дневник
Handcuffs|Наручники
Chest|Сундук
Gate|Ворота|калитка
Garage|Гараж
Apartment|Квартира
House|Дом
Room|Комната
Jewelry box|Шкатулка
Bike lock|Велозамок
Cash register|Касса
Briefcase|Портфель|кейс/дипломат
Tin can|Консервная банка|банка
Prison cell|Камера|тюремная камера
Wardrobe|Гардероб
Hotel room|Номер в отеле|номер
Desk|Письменный стол
Trunk|Багажник
Office|Кабинет
Shed|Сарай
Glove box|Бардачок
Cupboard|Буфет
Wine cabinet|Бар
Wind up toy|Заводная игрушка
Clock|Часы с заводным ключом""",
    "Book/Книга/Banana/Банан/Bottle/Бутылка/Window/Окно/Egg/Яйцо/Laptop/Ноутбук/Envelope/Конверт/Bag/Пакет/Mouth/Рот/Pen/Ручка/Shoe/Ботинок")
