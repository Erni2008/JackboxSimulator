# THINK OR DIE category content, part ZD (list 8, questions 71-100; compact lists, the AI judges the rest).
from cats_a import cat


def k(id, group, en, ru, crit, lines, inv="", type="KNOWLEDGE", **kw):
    cat(id, type, group, en, ru, crit, crit, lines, inv, **kw)


def L(s):
    return "\n".join(x.strip() for x in s.strip().split(";") if x.strip())


# ---------- 8. Games, hobbies, sport ----------
k("board_game_pieces", "games", "Name a piece or component used in board games", "Назовите фигуру или элемент настольной игры",
  "A piece or component of a board game: dice, chip (token), card, pawn, king, queen, rook, knight, bishop, checker, board, timer (hourglass), money, house, hotel, figure (meeple), domino tile, cube, spinner, score pad, rulebook, die, counter, tile.",
  L("Dice|Кубик|игральная кость; Chip|Фишка; Card|Карта|карточка; Pawn|Пешка; King|Король; Queen|Ферзь|королева; Rook|Ладья; Knight|Конь; Bishop|Слон; Checker|Шашка; Board|Игровое поле|доска; "
    "Hourglass|Песочные часы; Money|Игровые деньги; House|Домик; Hotel|Отель; Meeple|Мипл; Domino tile|Костяшка домино; Cube|Кубик ресурсов; Spinner|Волчок|рулетка; Score pad|Блокнот для очков; "
    "Rulebook|Правила; Token|Жетон; Counter|Счётчик; Tile|Тайл|плитка; Figure|Фигурка; Miniature|Миниатюра; Coin|Монета; Ticket|Билет; Barrel|Бочонок|лото; Game card|Карточка лото; Letter tile|Фишка с буквой; "
    "Hand|Ширма; Screen|Ширма мастера; Timer|Таймер; Bell|Звонок; Train|Вагончик; Road|Дорога; Settlement|Поселение; City|Город; Robber|Разбойник; Resource card|Карта ресурса; Character card|Карта персонажа; "
    "Life token|Жетон жизни; Sand timer|Песочные часы маленькие; Marker|Маркер; Pencil|Карандаш; Hexagon|Гекс; Ship|Кораблик; Plane|Самолётик; Car|Машинка; Thimble|Напёрсток; Top hat|Цилиндр монополии; "
    "Dog|Собачка монополии; Go stone|Камень го; Mancala seeds|Камешки манкалы; Backgammon checker|Шашка нарды"))

k("miniature_model_hobbies", "games", "Name a hobby about making miniature models", "Назовите хобби, связанное с созданием миниатюрных моделей",
  "A hobby of building or painting miniatures: model kits (stand modelling), ship modelling, aircraft modelling, railway modelling, diorama making, miniature painting (Warhammer), dollhouse miniatures, bonsai (miniature tree), ship in a bottle, LEGO building, paper models, wargaming, car modelling, tank modelling, architecture models, terrain building, 3D printing miniatures.",
  L("Model kits|Стендовый моделизм|моделизм; Ship modelling|Судомоделизм; Aircraft modelling|Авиамоделизм; Railway modelling|Железнодорожный моделизм; Diorama|Диорама; Miniature painting|Покраска миниатюр; "
    "Warhammer|Вархаммер; Dollhouse|Кукольный домик|миниатюры для кукольного домика; Bonsai|Бонсай; Ship in a bottle|Корабль в бутылке; LEGO|Лего; Paper models|Бумажные модели|папермоделинг; Wargaming|Варгейминг; "
    "Car modelling|Автомоделизм; Tank modelling|Танковое моделирование; Architecture models|Архитектурный макет|макетирование; Terrain building|Террейн; 3D printing|3д печать миниатюр; Rocket modelling|Ракетомоделирование; "
    "RC models|Радиоуправляемые модели; Model railway|Макет железной дороги; Origami|Оригами; Tin soldiers|Оловянные солдатики; Figurine sculpting|Лепка фигурок; Polymer clay|Полимерная глина; "
    "Kirigami|Киригами; Matchstick models|Модели из спичек; Wooden models|Деревянные модели; Nanoblocks|Наноблоки; Gunpla|Ганпла; Miniature food|Миниатюрная еда; Terrarium|Флорариум; Fairy garden|Сад фей; "
    "Snow globes|Снежные шары; Microminiature|Микроминиатюра; Model kit painting|Покраска моделей; Scratch building|Скратчбилдинг; Dioramas WWII|Военные диорамы; Collecting die-cast|Коллекционирование моделей машин; "
    "Plastic models|Сборные модели; Zvezda kits|Модели Звезда; Tamiya kits|Модели Тамия; Doll making|Изготовление кукол; Sculpting|Скульптура маленькая"))

k("special_shoe_sports", "sports", "Name a sport where participants use special footwear", "Назовите вид спорта, в котором используют специальную обувь",
  "A sport needing special shoes: football (boots), running (spikes), figure skating (skates), hockey, ballet no (dance), climbing (climbing shoes), skiing (ski boots), cycling (clip shoes), bowling, golf, tennis, basketball, wrestling, boxing, track and field, speed skating, rollerblading, snowboarding, curling, mountaineering.",
  L("Football|Футбол|бутсы; Running|Бег|шиповки; Figure skating|Фигурное катание|коньки; Hockey|Хоккей; Climbing|Скалолазание|скальники; Skiing|Лыжи|горнолыжные ботинки; Cycling|Велоспорт|контактные туфли; "
    "Bowling|Боулинг; Golf|Гольф; Tennis|Теннис; Basketball|Баскетбол; Wrestling|Борьба|борцовки; Boxing|Бокс|боксёрки; Track and field|Лёгкая атлетика; Speed skating|Конькобежный спорт; Rollerblading|Роллер спорт|ролики; "
    "Snowboarding|Сноуборд; Curling|Кёрлинг; Mountaineering|Альпинизм; Ballet|Балет|пуанты; Dance sport|Спортивные танцы; Volleyball|Волейбол; Handball|Гандбол; Futsal|Футзал; Rugby|Регби; Baseball|Бейсбол; "
    "American football|Американский футбол; Cross-country skiing|Беговые лыжи; Biathlon|Биатлон; Ski jumping|Прыжки с трамплина; Bandy|Хоккей с мячом; Short track|Шорт трек; Weightlifting|Тяжёлая атлетика|штангетки; "
    "Fencing|Фехтование; Gymnastics|Гимнастика|чешки; Diving|Дайвинг|ласты; Swimming fins|Плавание в ластах; Equestrian|Конный спорт|сапоги для верховой езды; Motocross|Мотокросс; Karting|Картинг; "
    "Formula 1|Формула 1; Orienteering|Ориентирование; Trail running|Трейлраннинг; Squash|Сквош; Badminton|Бадминтон; Table tennis|Настольный теннис; Padel|Падел;  Skateboarding|Скейтбординг"))

k("business_sim_games", "games", "Name a video game where you run your own business", "Назовите видеоигру, в которой можно управлять своим бизнесом",
  "A real game about running a business: The Sims (business), RollerCoaster Tycoon, Theme Hospital, Theme Park, Game Dev Tycoon, Supermarket Simulator, Stardew Valley (farm), Planet Coaster, Two Point Hospital, Zoo Tycoon, Car Mechanic Simulator, Capitalism, Transport Tycoon, Cook Serve Delicious, Hay Day, Moonlighter, Recettear, Papa's games, GTA (businesses), Big Ambitions.",
  L("RollerCoaster Tycoon|Роллеркостер тайкун; Theme Hospital|Тема госпиталь; Theme Park|Тема парк; Game Dev Tycoon|Гейм дев тайкун; Supermarket Simulator|Симулятор супермаркета; Stardew Valley|Стардью валли; "
    "Planet Coaster|Планет костер; Two Point Hospital|Ту поинт госпиталь; Zoo Tycoon|Зу тайкун; Car Mechanic Simulator|Кар механик симулятор; Capitalism|Капитализм; Transport Tycoon|Транспорт тайкун; "
    "Cook, Serve, Delicious!|Кук серв делишес; Hay Day|Хэй дэй; Moonlighter|Мунлайтер; Recettear|Рекеттир; Papa's Pizzeria|Папас пиццерия; GTA V|Гта 5; Big Ambitions|Биг амбишнс; The Sims|Симс; "
    "Planet Zoo|Планет зу; Jurassic World Evolution|Мир юрского периода эволюция; Prison Architect|Призон архитект; Tropico|Тропико; Anno|Анно; Railroad Tycoon|Рейлроуд тайкун; Airline Tycoon|Эйрлайн тайкун; "
    "Mall Tycoon|Молл тайкун; Gas Station Simulator|Симулятор заправки; Internet Cafe Simulator|Симулятор интернет кафе; PC Building Simulator|Симулятор сборки пк; House Flipper|Хаус флиппер; "
    "Farming Simulator|Фарминг симулятор; Euro Truck Simulator|Евро трак|етс; Production Line|Продакшн лайн;  Software Inc|Софтвер инк; Mad Games Tycoon|Мэд геймс тайкун; "
    "Hotel Giant|Отель гигант; Restaurant Empire|Ресторан империя; Diner Dash|Дайнер дэш; Township|Тауншип; Farmville|Фармвилль; AdVenture Capitalist|Адвенчер капиталист; Idle Miner Tycoon|Айдл майнер; "
    "Pizza Tycoon|Пицца тайкун; Coffee Shop Tycoon|Кофешоп тайкун; Lemonade Stand|Лимонадный ларёк; Monopoly|Монополия; Cities: Skylines|Ситис скайлайнс;  Potion Craft|Поушн крафт"))

k("trap_games", "games", "Name a video game with traps", "Назовите видеоигру, в которой есть ловушки",
  "A real video game featuring traps (spikes, pits, pressure plates, falling rocks...): Prince of Persia, Tomb Raider, Spelunky, Indiana Jones games, Super Meat Boy, Orcs Must Die!, Zelda, Dark Souls, Crash Bandicoot, Minecraft (TNT, pistons), Deathtrap Dungeon, Dungeon Keeper, Hitman, Assassin's Creed, Uncharted, Limbo, Inside, Saw game, Fall Guys, Mario.",
  L("Prince of Persia|Принц Персии; Tomb Raider|Томб райдер; Spelunky|Спеланки; Indiana Jones|Индиана Джонс игра; Super Meat Boy|Супер мит бой; Orcs Must Die!|Орки должны умереть; Zelda|Зельда; "
    "Dark Souls|Дарк соулс; Crash Bandicoot|Крэш; Minecraft|Майнкрафт; Dungeon Keeper|Хранитель подземелий; Hitman|Хитман; Assassin's Creed|Ассасин; Uncharted|Анчартед; Limbo|Лимбо; Inside|Инсайд; "
    "Saw|Пила игра; Fall Guys|Фолл гайз; Super Mario|Марио; Celeste|Селеста; Hollow Knight|Холлоу найт; Dead Cells|Дед селлс; The Binding of Isaac|Байндинг оф айзек; Enter the Gungeon|Энтер зе ганжен; "
    "Rayman|Рэйман; Little Nightmares|Маленькие кошмары; Trine|Трайн; Unravel|Анрэвел; Ori|Ори; Metal Gear Solid|Метал гир; Splinter Cell|Сплинтер селл; Thief|Вор; Dishonored|Дисхонорд; Deathtrap Dungeon|Дэстрэп данжен; "
    "Trap Adventure 2|Трэп эдвенчер; Cat Mario|Кошачий Марио; I Wanna Be the Guy|Ай ванна би зе гай; Sonic|Соник; Mega Man|Мегамен; Castlevania|Кастлвания; Diablo|Диабло; Path of Exile|Пое; "
    "Resident Evil|Резидент ивел; Silent Hill|Сайлент хилл; The Last of Us|Одни из нас; Far Cry|Фар край; Rust|Раст; Terraria|Террария; Don't Starve|Донт старв; Skyrim|Скайрим; Divinity|Дивинити; "
    "Baldur's Gate|Балдурс гейт; Darkest Dungeon|Даркест данжен; Dungeons|Данжонс; Hand of Fate|Хэнд оф фейт; Portal|Портал; Lara Croft GO|Лара Крофт гоу"))

k("fighting_game_characters", "games", "Name a playable character in fighting games", "Назовите персонажа, за которого можно играть в файтингах",
  "A playable character from fighting games: Ryu, Ken, Chun-Li, Guile, M. Bison, Akuma, Scorpion, Sub-Zero, Raiden, Liu Kang, Sonya Blade, Johnny Cage, Jin Kazama, Kazuya, Heihachi, Paul Phoenix, Nina Williams, King, Terry Bogard, Kyo Kusanagi, Mario (Smash), Link (Smash), Pikachu (Smash), Kirby, Sol Badguy, Goku.",
  L("Ryu|Рю; Ken|Кен; Chun-Li|Чун Ли; Guile|Гайл; M. Bison|Байсон; Akuma|Акума; Scorpion|Скорпион; Sub-Zero|Саб Зиро; Raiden|Райден; Liu Kang|Лю Кан; Sonya Blade|Соня Блейд; Johnny Cage|Джонни Кейдж; "
    "Jin Kazama|Джин Казама; Kazuya|Казуя; Heihachi|Хейхачи; Paul Phoenix|Пол Феникс; Nina Williams|Нина Уильямс; King|Кинг; Terry Bogard|Терри Богард; Kyo Kusanagi|Кё Кусанаги; Mario|Марио; Link|Линк; "
    "Pikachu|Пикачу; Kirby|Кирби; Sol Badguy|Сол Бэдгай; Goku|Гоку; Vegeta|Вегета; Cell|Селл; Kitana|Китана; Mileena|Милина; Jax|Джакс; Kano|Кано; Shao Kahn|Шао Кан; Goro|Горо; Kung Lao|Кун Лао; "
    "Noob Saibot|Нуб Сайбот; Reptile|Рептилия; Baraka|Барака; Blanka|Бланка; Dhalsim|Дхалсим; Zangief|Зангиев; E. Honda|Хонда; Cammy|Кэмми; Vega|Вега; Sagat|Сагат; Balrog|Балрог; Dan|Дэн; "
    "Hwoarang|Хваран; Eddy Gordo|Эдди Горде; Yoshimitsu|Ёшимицу; Lei Wulong|Лэй Вулонг; Xiaoyu|Сяою; Law|Лоу; Bryan Fury|Брайан Фьюри; Iori Yagami|Иори Ягами; Mai Shiranui|Май Ширануи; "
    "Ky Kiske|Кай Киске; Ryu Hayabusa|Рю Хаябуса; Kasumi|Касуми; Hitomi|Хитоми; Sophitia|Софития; Mitsurugi|Мицуруги; Nightmare|Найтмер; Fox McCloud|Фокс; Samus|Самус; Captain Falcon|Капитан Фэлкон; "
    "Batman|Бэтмен в Injustice; Superman|Супермен в Injustice; Joker|Джокер в Injustice; Spider-Man|Человек паук в Marvel vs Capcom; Wolverine|Росомаха; Freddy Krueger|Фредди Крюгер в Mortal Kombat; Terminator|Терминатор в Mortal Kombat"))

k("sport_ball_types", "sports", "Name a type of sports ball", "Назовите разновидность спортивного мяча",
  "A kind of ball used in sport: football (soccer ball), basketball, volleyball, tennis ball, golf ball, baseball, rugby ball, American football, handball, table tennis ball, billiard ball, bowling ball, cricket ball, water polo ball, medicine ball, fitball, futsal ball, beach ball, lacrosse ball, squash ball.",
  L("Football|Футбольный мяч; Basketball|Баскетбольный мяч; Volleyball|Волейбольный мяч; Tennis ball|Теннисный мяч; Golf ball|Мяч для гольфа; Baseball|Бейсбольный мяч; Rugby ball|Мяч для регби|дыня; "
    "American football|Мяч для американского футбола; Handball|Гандбольный мяч; Table tennis ball|Шарик для пинг понга; Billiard ball|Бильярдный шар; Bowling ball|Шар для боулинга; Cricket ball|Мяч для крикета; "
    "Water polo ball|Мяч для водного поло; Medicine ball|Медбол; Fitball|Фитбол; Futsal ball|Мяч для футзала; Beach ball|Пляжный мяч; Lacrosse ball|Мяч для лакросса; Squash ball|Мяч для сквоша; "
    "Padel ball|Мяч для падела; Pickleball|Мяч для пиклбола; Softball|Софтбольный мяч;  Dodgeball|Мяч для вышибал; Field hockey ball|Мяч для хоккея на траве; Bandy ball|Мяч для бенди; "
    "Petanque ball|Шар для петанка; Bocce ball|Шар для бочче; Croquet ball|Мяч для крокета; Polo ball|Мяч для поло; Gymnastic ball|Мяч для художественной гимнастики; Slam ball|Слэмбол;  "
    "Kickball|Мяч для кикбола; Goalball|Мяч для голбола; Sepak takraw ball|Мяч для сепак такро; Hurling sliotar|Мяч для хёрлинга; Futbol mini|Мини мяч; Juggling ball|Мяч для жонглирования"))

k("level_editor_games", "games", "Name a video game where you can create your own levels", "Назовите видеоигру, в которой можно создавать собственные уровни",
  "A real game with a level editor or creative mode: Super Mario Maker, LittleBigPlanet, Minecraft, Roblox, Dreams, Geometry Dash, Trackmania, Portal 2, Halo Forge, Fortnite Creative, Garry's Mod, Doom (WADs), Warcraft III (World Editor), StarCraft, Heroes of Might and Magic (map editor), Far Cry 5 Arcade, Terraria, Levelhead.",
  L("Super Mario Maker|Супер Марио мейкер; LittleBigPlanet|Литтл биг плэнет; Minecraft|Майнкрафт; Roblox|Роблокс; Dreams|Дримс; Geometry Dash|Геометри дэш; Trackmania|Трекмания; Portal 2|Портал 2; "
    "Halo Forge|Хало форж; Fortnite Creative|Фортнайт креатив; Garry's Mod|Гаррис мод; Doom|Дум; Warcraft III|Варкрафт 3; StarCraft|Старкрафт; Heroes of Might and Magic|Герои меча и магии; Far Cry 5|Фар край 5; "
    "Terraria|Террария; Levelhead|Левелхед; Counter-Strike|Контра|кс; Half-Life|Халф лайф; Unreal Tournament|Анрил турнамент; Quake|Квейк; Age of Empires|Эпоха империй; Skyrim|Скайрим|creation kit; "
    "Fallout 4|Фоллаут 4; The Sims|Симс; Spore|Спор; Scrap Mechanic|Скрап механик; Besiege|Бизидж; Teardown|Тирдаун; Rec Room|Рек рум; Core|Кор; Mario Maker 2|Марио мейкер 2; Lode Runner|Лод раннер; "
    "Excitebike|Эксайтбайк; Worms|Вормс; Tony Hawk's Pro Skater|Тони Хоук; Unturned|Антёрнед; Starbound|Старбаунд;   Dota 2|Дота 2; "
    "Stronghold|Стронгхолд; Command & Conquer|Командуй и властвуй; Rhythm Doctor|Ритм доктор; Beat Saber|Бит сейбер; Osu!|Осу;  Lemmings|Лемминги; Line Rider|Лайн райдер; Happy Wheels|Хэппи вилс"))

k("couple_dances", "sports", "Name a dance performed in pairs", "Назовите танец, который исполняют в паре",
  "A dance normally performed by a couple: waltz, tango, salsa, bachata, kizomba, rumba, cha-cha-cha, samba, paso doble, jive, foxtrot, quickstep, polka, mazurka, swing, lindy hop, rock and roll, zouk, merengue, lambada, ballroom dancing, figure skating pairs, minuet, quadrille (couples), polonaise, west coast swing, hustle.",
  L("Waltz|Вальс; Tango|Танго; Salsa|Сальса; Bachata|Бачата; Kizomba|Кизомба; Rumba|Румба; Cha-cha-cha|Ча ча ча; Samba|Самба; Paso doble|Пасодобль; Jive|Джайв; Foxtrot|Фокстрот; Quickstep|Квикстеп; "
    "Polka|Полька; Mazurka|Мазурка; Swing|Свинг; Lindy hop|Линди хоп; Rock and roll|Рок н ролл; Zouk|Зук; Merengue|Меренге; Lambada|Ламбада; Ballroom|Бальный танец; Viennese waltz|Венский вальс; "
    "Argentine tango|Аргентинское танго; Minuet|Менуэт; Polonaise|Полонез; West Coast Swing|Вест кост свинг; Hustle|Хастл; Boogie-woogie|Буги вуги; Charleston|Чарльстон; Mambo|Мамбо; Bolero|Болеро; "
    "Forró|Форро; Semba|Семба; Tarraxinha|Тарашинья; Balboa|Бальбоа; Blues|Блюз; Slow dance|Медленный танец|медляк; Wedding dance|Свадебный танец; Quadrille|Кадриль; Square dance|Сквер дэнс; "
    "  Ice dance|Танцы на льду; Pair figure skating|Парное катание; Dirty dancing|Грязные танцы; Lezginka|Лезгинка; Kartuli|Картули; Krakowiak|Краковяк; Csárdás|Чардаш; Tarantella|Тарантелла; "
    "Fandango|Фанданго; Gavotte|Гавот; Pas de deux|Па де де; Ballet duet|Дуэт в балете; Acrobatic rock and roll|Акробатический рок н ролл; Bachata sensual|Бачата сенсуаль"))

k("paper_hobbies", "games", "Name a hobby that uses paper", "Назовите хобби, связанное с бумагой",
  "A hobby based on paper: origami, quilling, scrapbooking, papier-mâché, calligraphy, drawing, kirigami, paper models, decoupage, bookbinding, card making, paper cutting (vytynanka), collage, journaling, sketching, writing letters, stamp collecting, crosswords, colouring books, paper flowers, lettering.",
  L("Origami|Оригами; Quilling|Квиллинг; Scrapbooking|Скрапбукинг; Papier-mâché|Папье маше; Calligraphy|Каллиграфия; Drawing|Рисование; Kirigami|Киригами; Paper models|Бумажные модели|папермоделинг; "
    "Decoupage|Декупаж; Bookbinding|Переплётное дело; Card making|Изготовление открыток|кардмейкинг; Paper cutting|Вытынанка|вырезание из бумаги; Collage|Коллаж; Journaling|Ведение дневника|джорналинг; "
    "Sketching|Скетчинг; Letter writing|Написание писем; Stamp collecting|Филателия; Crosswords|Кроссворды; Colouring books|Раскраски; Paper flowers|Бумажные цветы; Lettering|Леттеринг; Paper airplanes|Бумажные самолётики; "
    "Iris folding|Айрис фолдинг; Paper weaving|Плетение из бумаги; Newspaper weaving|Плетение из газетных трубочек; Bullet journal|Буллет джорнал; Comic drawing|Рисование комиксов; Manga drawing|Рисование манги; "
    "Watercolor painting|Акварель; Silhouette cutting|Силуэтное вырезание; Pop-up books|Книжки раскладушки; Paper dolls|Бумажные куклы; Gift wrapping|Упаковка подарков; Kusudama|Кусудама; Modular origami|Модульное оригами; "
    "Sudoku|Судоку; Puzzle books|Сборники головоломок; Book collecting|Коллекционирование книг; Postcrossing|Посткроссинг; Writing poetry|Сочинение стихов; Fanzines|Фэнзины; Zine making|Создание зинов; "
    "Junk journal|Джанк журнал; Sketchbook|Скетчбук; Map drawing|Рисование карт; Paper lanterns|Бумажные фонарики; Paper snowflakes|Бумажные снежинки"))

# ---------- 9. Culture, history ----------
k("national_costume_countries", "geography", "Name a country with a traditional national costume that has its own name", "Назовите страну, у которой есть национальная одежда со своим названием",
  "A country with a named traditional garment: Japan (kimono), India (sari), Scotland/UK (kilt), Korea (hanbok), China (qipao/hanfu), Vietnam (ao dai), Russia (sarafan, kosovorotka), Ukraine (vyshyvanka), Georgia (chokha), Germany (dirndl, lederhosen), Mexico (poncho, sombrero), Peru, Ghana (kente), Saudi Arabia (thobe), Morocco (djellaba), Philippines (barong), Indonesia (kebaya), Norway (bunad).",
  L("Japan|Япония|кимоно; India|Индия|сари; Scotland|Шотландия|килт; South Korea|Корея|ханбок; China|Китай|ципао; Vietnam|Вьетнам|аозай; Russia|Россия|сарафан/косоворотка; Ukraine|Украина|вышиванка; "
    "Georgia|Грузия|чоха; Germany|Германия|дирндль/ледерхозе; Mexico|Мексика|пончо; Peru|Перу; Ghana|Гана|кенте; Saudi Arabia|Саудовская Аравия|тоб; Morocco|Марокко|джеллаба; Philippines|Филиппины|баронг; "
    "Indonesia|Индонезия|кебая; Norway|Норвегия|бунад; Austria|Австрия|дирндль; Kazakhstan|Казахстан|чапан; Uzbekistan|Узбекистан|халат|чапан; Kyrgyzstan|Киргизия|калпак; Mongolia|Монголия|дээл; "
    "Tajikistan|Таджикистан; Turkmenistan|Туркменистан; Azerbaijan|Азербайджан; Armenia|Армения|тараз; Belarus|Беларусь; Poland|Польша; Hungary|Венгрия; Romania|Румыния; Bulgaria|Болгария; Greece|Греция|фустанелла; "
    "Turkey|Турция|феска; Iran|Иран|чадор; Afghanistan|Афганистан|паранджа; Pakistan|Пакистан|шальвар камиз; Thailand|Таиланд|чут тай; Malaysia|Малайзия|баджу; Bhutan|Бутан|гхо; Nepal|Непал; "
    "Spain|Испания|платье фламенко; Portugal|Португалия; Netherlands|Нидерланды|клумпы; Sweden|Швеция; Finland|Финляндия; Ireland|Ирландия; Chile|Чили; Argentina|Аргентина|пончо гаучо; Guatemala|Гватемала|уипиль; "
    "Nigeria|Нигерия|агбада; Kenya|Кения|масаи шука; Ethiopia|Эфиопия; Egypt|Египет|галабея; Oman|Оман|дишдаша; UAE|ОАЭ|кандура; Israel|Израиль; Palestine|Палестина|куфия; Tibet|Тибет|чуба"))

k("famous_battles", "history", "Name a famous historical battle", "Назовите известное историческое сражение",
  "A real famous battle: Battle of Borodino, Kulikovo, Battle on the Ice, Stalingrad, Kursk, Poltava, Waterloo, Austerlitz, Thermopylae, Marathon, Hastings, Gettysburg, Verdun, Somme, Midway, Normandy (D-Day), Cannae, Gaugamela, Agincourt, Trafalgar, Leningrad (siege), Moscow (battle), Berlin, Sedan, Lepanto, Grunwald, Chesma, Izmail, Sinop.",
  L("Battle of Borodino|Бородинская битва|бородино; Kulikovo|Куликовская битва; Battle on the Ice|Ледовое побоище; Stalingrad|Сталинградская битва; Kursk|Курская битва|курская дуга; Poltava|Полтавская битва; "
    "Waterloo|Ватерлоо; Austerlitz|Аустерлиц; Thermopylae|Фермопилы; Marathon|Марафонская битва; Hastings|Битва при Гастингсе; Gettysburg|Геттисберг; Verdun|Верден; Somme|Сомма; Midway|Мидуэй; "
    "D-Day|Высадка в Нормандии; Cannae|Канны; Gaugamela|Гавгамелы; Agincourt|Азенкур; Trafalgar|Трафальгар; Siege of Leningrad|Блокада Ленинграда; Battle of Moscow|Битва за Москву; Battle of Berlin|Битва за Берлин; "
    "Sedan|Седан; Lepanto|Лепанто; Grunwald|Грюнвальд; Chesma|Чесменское сражение; Izmail|Штурм Измаила; Sinop|Синопское сражение; Neva|Невская битва; Kalka|Битва на Калке; Ugra|Стояние на Угре; "
    "Molodi|Битва при Молодях; Kazan siege|Взятие Казани; Gangut|Гангут; Narva|Нарва; Rymnik|Рымник; Alps crossing|Переход через Альпы; Sevastopol|Оборона Севастополя; Tsushima|Цусима; Port Arthur|Порт Артур; "
    "Brusilov breakthrough|Брусиловский прорыв; Brest Fortress|Брестская крепость; Prokhorovka|Прохоровка; Dnieper|Битва за Днепр; Bagration|Операция Багратион; Pearl Harbor|Пёрл Харбор; Iwo Jima|Иводзима; "
    "Okinawa|Окинава; El Alamein|Эль Аламейн; Dunkirk|Дюнкерк; Battle of Britain|Битва за Британию; Bulge|Арденнская операция; Salamis|Саламин; Issus|Исс; Zama|Зама; Alesia|Алезия; Teutoburg|Тевтобургский лес; "
    "Tours|Пуатье; Crécy|Креси; Orléans|Осада Орлеана; Bosworth|Босворт; Yorktown|Йорктаун; Saratoga|Саратога; Leipzig|Битва народов|лейпциг; Jena|Йена; Marne|Марна; Gallipoli|Галлиполи"))

k("scientific_discovery_figures", "history", "Name a historical figure known for scientific discoveries", "Назовите историческую личность, известную научными открытиями",
  "A real scientist known for discoveries: Newton, Einstein, Darwin, Mendeleev, Lomonosov, Curie, Galileo, Copernicus, Kepler, Pasteur, Faraday, Tesla, Edison (inventor), Pavlov, Archimedes, Pythagoras, Hawking, Bohr, Rutherford, Mendel, Fleming, Lobachevsky, Popov, Korolev, Landau, Sakharov, Tsiolkovsky.",
  L("Isaac Newton|Ньютон; Albert Einstein|Эйнштейн; Charles Darwin|Дарвин; Dmitri Mendeleev|Менделеев; Mikhail Lomonosov|Ломоносов; Marie Curie|Мария Кюри; Galileo|Галилей; Copernicus|Коперник; "
    "Johannes Kepler|Кеплер; Louis Pasteur|Пастер; Michael Faraday|Фарадей; Nikola Tesla|Тесла; Thomas Edison|Эдисон; Ivan Pavlov|Павлов; Archimedes|Архимед; Pythagoras|Пифагор; Stephen Hawking|Хокинг; "
    "Niels Bohr|Нильс Бор; Ernest Rutherford|Резерфорд; Gregor Mendel|Мендель; Alexander Fleming|Флеминг; Nikolai Lobachevsky|Лобачевский; Alexander Popov|Попов; Sergei Korolev|Королёв; Lev Landau|Ландау; "
    "Andrei Sakharov|Сахаров; Konstantin Tsiolkovsky|Циолковский; Igor Kurchatov|Курчатов; Pyotr Kapitsa|Капица; Nikolai Vavilov|Вавилов; Ilya Mechnikov|Мечников; Sofia Kovalevskaya|Ковалевская; "
    "Grigori Perelman|Перельман; Andrey Kolmogorov|Колмогоров; Pafnuty Chebyshev|Чебышёв; Aristotle|Аристотель; Euclid|Евклид; Hippocrates|Гиппократ; Ptolemy|Птолемей; Leonardo da Vinci|Леонардо да Винчи; "
    "Robert Hooke|Гук; Antonie van Leeuwenhoek|Левенгук; Robert Boyle|Бойль; Lavoisier|Лавуазье; Dalton|Дальтон; Avogadro|Авогадро; Gauss|Гаусс; Euler|Эйлер; Maxwell|Максвелл; Max Planck|Планк; "
    "Heisenberg|Гейзенберг; Schrödinger|Шрёдингер; Dirac|Дирак; Fermi|Ферми; Oppenheimer|Оппенгеймер; Feynman|Фейнман; Watson and Crick|Уотсон и Крик; Rosalind Franklin|Розалинд Франклин; Edwin Hubble|Хаббл; "
    "Alfred Wegener|Вегенер; Wilhelm Röntgen|Рентген; Henri Becquerel|Беккерель; Volta|Вольта; Ampère|Ампер; Ohm|Ом; Hertz|Герц; Mendeleev Dmitri|Дмитрий Менделеев; Vernadsky|Вернадский; Timiryazev|Тимирязев"))

k("wedding_items", "everyday", "Name an object traditionally used at weddings", "Назовите предмет, который традиционно используют на свадьбе",
  "An object traditionally part of a wedding: wedding rings, bouquet, veil, wedding dress, wedding cake, champagne, rice (thrown), rose petals, karavai (loaf), towel (rushnik), garter, candles, crowns (church wedding), arch, invitations, boutonniere, limousine, ribbons, doves, glasses (smashed), wedding album, toastmaster's microphone, lock on a bridge.",
  L("Wedding rings|Обручальные кольца|кольца; Bouquet|Букет невесты|букет; Veil|Фата; Wedding dress|Свадебное платье; Wedding cake|Свадебный торт; Champagne|Шампанское; Rice|Рис; Rose petals|Лепестки роз; "
    "Karavai|Каравай; Rushnik|Рушник; Garter|Подвязка; Candles|Свечи; Crowns|Венцы; Arch|Свадебная арка; Invitations|Приглашения; Boutonniere|Бутоньерка; Limousine|Лимузин; Ribbons|Ленты; Doves|Голуби; "
    "Glasses|Бокалы; Wedding album|Свадебный альбом; Microphone|Микрофон тамады; Lock|Замок на мосту; Suit|Костюм жениха; Tuxedo|Смокинг; Tie|Галстук; Shoes|Туфли невесты; Gloves|Перчатки невесты; "
    "Ring pillow|Подушечка для колец; Marriage certificate|Свидетельство о браке; Registry book|Книга регистрации; Pen|Ручка; Balloons|Шары; Flowers|Цветы; Confetti|Конфетти; Sparklers|Бенгальские огни; "
    "Fireworks|Салют; Cake knife|Нож для торта;  Car decorations|Украшения машины; Doll on the car|Кукла на капоте; Sash|Лента свидетеля; Witness ribbon|Лента свидетелей; Bread and salt|Хлеб соль; "
    "Coins|Монеты; Candy|Конфеты; Horseshoe|Подкова; Something blue|Что то синее; Hourglass ceremony|Песочная церемония; Unity candle|Семейный очаг; Chuppah|Хупа; Sake cups|Чашки саке; Henna|Хна"))

k("international_awards", "everyday", "Name a famous international award", "Назовите известную международную премию",
  "A real international prize or award: Nobel Prize, Oscar (Academy Award), Grammy, Golden Globe, Emmy, Palme d'Or, Golden Lion, Golden Bear, BAFTA, Pulitzer Prize, Fields Medal, Ballon d'Or, Booker Prize, Turing Award, Abel Prize, Pritzker Prize, Laureus, MTV Music Awards, Tony Award, Kalinga Prize, World Food Prize, Templeton Prize.",
  L("Nobel Prize|Нобелевская премия|нобелевка; Oscar|Оскар; Grammy|Грэмми; Golden Globe|Золотой глобус; Emmy|Эмми; Palme d'Or|Золотая пальмовая ветвь; Golden Lion|Золотой лев; Golden Bear|Золотой медведь; "
    "BAFTA|Бафта; Pulitzer Prize|Пулитцеровская премия; Fields Medal|Филдсовская премия; Ballon d'Or|Золотой мяч; Booker Prize|Букеровская премия; Turing Award|Премия Тьюринга; Abel Prize|Абелевская премия; "
    "Pritzker Prize|Притцкеровская премия; Laureus|Лауреус; MTV Awards|MTV; Tony Award|Тони; Kalinga Prize|Калинга; Templeton Prize|Темплтоновская премия; Hugo Award|Хьюго; Nebula Award|Небьюла; "
    "César|Сезар; Goya|Гойя; Saturn Award|Сатурн; Annie Award|Энни; The Game Awards|Гейм эвордс; Webby|Вебби; Michelin star|Звезда Мишлен; Wolf Prize|Премия Вольфа; Kyoto Prize|Киотская премия; "
    "Lasker Award|Ласкеровская премия; Breakthrough Prize|Премия прорыв; Crafoord Prize|Крафордская премия; Shaw Prize|Премия Шао; Right Livelihood|Альтернативная нобелевская премия; Sakharov Prize|Премия Сахарова; "
    "Prix Goncourt|Гонкуровская премия; Cervantes Prize|Премия Сервантеса; Hans Christian Andersen Award|Премия Андерсена; Astrid Lindgren Award|Премия Астрид Линдгрен;  "
    "World Press Photo|Ворлд пресс фото; Brit Awards|Брит эвордс; Billboard Music Awards|Биллборд; Golden Raspberry|Золотая малина; Nika|Ника; Golden Eagle|Золотой орёл; Kinotavr|Кинотавр"))

k("flying_mythical_creatures", "fantasy", "Name a mythical creature that can fly", "Назовите мифическое существо, которое умеет летать",
  "A flying creature from myth and folklore: dragon, phoenix, Pegasus, griffin, harpy, sphinx (winged), Zmei Gorynych, Firebird, Sirin, Alkonost, Gamayun, angel, demon, fairy, valkyrie, wyvern, roc, thunderbird, Garuda, hippogriff, Baba Yaga (in a mortar), vampire (as a bat), Cupid, Icarus no (human), Simurgh.",
  L("Dragon|Дракон; Phoenix|Феникс; Pegasus|Пегас; Griffin|Грифон; Harpy|Гарпия; Sphinx|Сфинкс крылатый; Zmei Gorynych|Змей Горыныч; Firebird|Жар птица; Sirin|Сирин; Alkonost|Алконост; Gamayun|Гамаюн; "
    "Angel|Ангел; Demon|Демон; Fairy|Фея; Valkyrie|Валькирия; Wyvern|Виверна; Roc|Рух; Thunderbird|Громовая птица; Garuda|Гаруда; Hippogriff|Гиппогриф; Baba Yaga|Баба Яга; Vampire|Вампир; Cupid|Купидон|амур; "
    "Simurgh|Симург;  Manticore|Мантикора; Gargoyle|Горгулья; Banshee|Банши; Witch|Ведьма на метле; Pixie|Пикси; Sylph|Сильфида; Peri|Пери; Tengu|Тэнгу; Qilin|Цилинь; Fenghuang|Фэнхуан; "
    "Lung dragon|Китайский дракон; Quetzalcoatl|Кетцалькоатль; Amphiptere|Амфиптер; Cockatrice|Кокатрикс; Basilisk|Василиск; Stymphalian birds|Стимфалийские птицы; Erinyes|Эринии; Nike|Ника; Eros|Эрос; Hermes|Гермес; "
    "Icarus|Икар; Daedalus|Дедал;  Thestral|Фестрал; Hippogryph|Клювокрыл; Nazgul fell beast|Крылатый змей назгулов; Smaug|Смауг; Djinn|Джинн; Ifrit|Ифрит; Succubus|Суккуб; Incubus|Инкуб; "
    "Seraph|Серафим; Cherub|Херувим; Archangel|Архангел; Lucifer|Люцифер; Mothman|Человек мотылёк; Jersey Devil|Дьявол из Джерси"))

k("long_journey_literary_characters", "fantasy", "Name a literary character who sets off on a long journey", "Назовите литературного персонажа, который отправляется в долгое путешествие",
  "A book character who undertakes a long journey: Odysseus, Frodo, Bilbo, Gulliver, Robinson Crusoe no (castaway, but voyage), Phileas Fogg, Don Quixote, Dorothy (Ellie), Nils, Captain Nemo, Aeneas, Sinbad, Huckleberry Finn, Pinocchio, Chichikov, Dante, Candide, Captain Grant's children, Little Prince, Dunno (to the Moon), Gerda.",
  L("Odysseus|Одиссей; Frodo|Фродо; Bilbo|Бильбо; Gulliver|Гулливер; Robinson Crusoe|Робинзон Крузо; Phileas Fogg|Филеас Фогг; Don Quixote|Дон Кихот; Ellie|Элли|дороти; Nils|Нильс; Captain Nemo|Капитан Немо; "
    "Aeneas|Эней; Sinbad|Синдбад; Huckleberry Finn|Гекльберри Финн; Pinocchio|Пиноккио; Chichikov|Чичиков; Dante|Данте; Candide|Кандид; Robert Grant|Роберт Грант|дети капитана гранта; Little Prince|Маленький принц; "
    "Dunno|Незнайка; Gerda|Герда; Jason|Ясон; Gilgamesh|Гильгамеш;  Afanasy Nikitin|Афанасий Никитин; Sam Gamgee|Сэм; Aragorn|Арагорн; Gandalf|Гэндальф; Thorin|Торин; "
    "Harry Potter|Гарри Поттер в Дарах смерти; Lucy Pevensie|Люси Пэвенси; Bastian|Бастиан; Atreyu|Атрейю; Pip|Пип; Ishmael|Измаил; Captain Ahab|Капитан Ахав; Lemuel|Лемюэль; Baron Munchausen|Барон Мюнхгаузен; "
    "Passepartout|Паспарту; Professor Lidenbrock|Профессор Лиденброк; Axel|Аксель; Captain Hatteras|Капитан Гаттерас; Paganel|Паганель;  Huck|Гек; Jim|Джим; Ivan Tsarevich|Иван Царевич; "
    "Ivan the Fool|Иван дурак; Pechorin|Печорин; Radishchev|Путешествие из Петербурга в Москву; Ostap Bender|Остап Бендер; Kisa Vorobyaninov|Киса Воробьянинов; Vasilisa|Василиса; Sadko|Садко; "
    "Peer Gynt|Пер Гюнт; Wilhelm Meister|Вильгельм Мейстер; Tom Thumb|Мальчик с пальчик; Wonderful Adventures|Нильс с дикими гусями; Bremen musicians|Бременские музыканты; Captain Vrungel|Капитан Врунгель; "
    "Dorothy|Дороти; Alice|Алиса в Зазеркалье; Wendy|Венди; Max|Макс из Там где живут чудовища; Hiccup|Иккинг; Arthur Dent|Артур Дент; Ford Prefect|Форд Префект"))

k("historic_dynasties", "history", "Name a famous historical dynasty", "Назовите известную историческую династию",
  "A real ruling dynasty: Romanov, Rurikid, Habsburg, Bourbon, Tudor, Stuart, Windsor, Plantagenet, Valois, Capetian, Medici, Ming, Qing, Han, Tang, Ptolemaic, Ottoman (Osman), Mughal, Julio-Claudian, Hohenzollern, Bonaparte, Jagiellonian, Carolingian, Merovingian, Godunov, Abbasid, Umayyad, Yuan, Song, Joseon.",
  L("Romanov|Романовы; Rurikid|Рюриковичи; Habsburg|Габсбурги; Bourbon|Бурбоны; Tudor|Тюдоры; Stuart|Стюарты; Windsor|Виндзоры; Plantagenet|Плантагенеты; Valois|Валуа; Capetian|Капетинги; "
    "Medici|Медичи; Ming|Мин; Qing|Цин; Han|Хань; Tang|Тан; Ptolemaic|Птолемеи; Ottoman|Османы; Mughal|Великие Моголы; Julio-Claudian|Юлии Клавдии; Hohenzollern|Гогенцоллерны; Bonaparte|Бонапарты; "
    "Jagiellonian|Ягеллоны; Carolingian|Каролинги; Merovingian|Меровинги; Godunov|Годуновы; Abbasid|Аббасиды; Umayyad|Омейяды; Yuan|Юань; Song|Сун; Joseon|Чосон; Genghisid|Чингизиды; Timurid|Тимуриды; "
    "Safavid|Сефевиды; Pahlavi|Пехлеви; Saud|Саудиты; Hashemite|Хашимиты; Bagrationi|Багратиони; Arsacid|Аршакиды; Achaemenid|Ахемениды; Sasanian|Сасаниды; Seleucid|Селевкиды; Flavian|Флавии; "
    "Severan|Северы; Constantinian|Константиновская; Macedonian|Македонская династия; Komnenos|Комнины; Palaiologos|Палеологи; Wittelsbach|Виттельсбахи; Orange-Nassau|Оранская династия; Savoy|Савойская; "
    "Borgia|Борджиа; Sforza|Сфорца; Este|Эсте; Gediminid|Гедиминовичи; Piast|Пясты; Árpád|Арпады; Přemyslid|Пржемысловичи; Nemanjić|Неманичи; Oldenburg|Ольденбурги; Vasa|Ваза; Bernadotte|Бернадоты; "
    "Tokugawa|Токугава; Yamato|Ямато; Chakri|Чакри; Shang|Шан; Zhou|Чжоу; Qin|Цинь; Kim|Династия Ким"))

k("asian_traditional_instruments", "music", "Name a traditional musical instrument of Asian origin", "Назовите традиционный музыкальный инструмент азиатского происхождения",
  "A traditional instrument originating in Asia: sitar, tabla, koto, shamisen, shakuhachi, erhu, pipa, guzheng, dombra, komuz, dutar, tar, duduk, zurna, gamelan, sarangi, veena, bansuri, taiko, gayageum, morin khuur, saz, oud, santur, kamancha, tanbur, khomus, sheng, dizi, yangqin, rubab, kemenche.",
  L("Sitar|Ситар; Tabla|Табла; Koto|Кото; Shamisen|Сямисэн; Shakuhachi|Сякухати; Erhu|Эрху; Pipa|Пипа; Guzheng|Гучжэн; Dombra|Домбра; Komuz|Комуз; Dutar|Дутар; Tar|Тар; Duduk|Дудук; Zurna|Зурна; "
    "Gamelan|Гамелан; Sarangi|Саранги; Veena|Вина; Bansuri|Бансури; Taiko|Тайко; Gayageum|Каягым; Morin khuur|Морин хуур; Saz|Саз; Oud|Уд; Santur|Сантур; Kamancha|Кеманча; Tanbur|Танбур; Khomus|Хомус|варган; "
    "Sheng|Шэн; Dizi|Дицзы; Yangqin|Янцинь; Rubab|Рубаб; Kemenche|Кеменче; Kobyz|Кобыз;  Shimshal|Шимшал; Daf|Даф; Doira|Дойра; Darbuka|Дарбука; Tambura|Тампура; Harmonium|Фисгармония; "
    "Mridangam|Мридангам; Sarod|Сарод; Shehnai|Шехнай; Santoor|Сантур индийский; Angklung|Ангклунг; Kulintang|Кулинтанг; Biwa|Бива; Hichiriki|Хитирики; Shō|Сё; Hulusi|Хулуси; Xiao|Сяо; Suona|Сона; "
    "Haegeum|Хэгым; Janggu|Чангу; Kayagum|Каягым корейский; Topshur|Топшур; Igil|Игил; Chanzy|Чанза; Chang|Чанг; Ney|Най; Qanun|Канун; Balaban|Балабан; Panduri|Пандури; Chonguri|Чонгури"))

k("famous_sculptors", "history", "Name a famous sculptor", "Назовите известного скульптора",
  "A real, well known sculptor: Michelangelo, Rodin, Donatello, Bernini, Canova, Phidias, Praxiteles, Myron, Falconet, Mukhina, Tsereteli, Vuchetich, Klodt, Shubin, Kozlovsky, Antokolsky, Konenkov, Erzya, Giacometti, Henry Moore, Brâncuși, Louise Bourgeois, Jeff Koons, Anish Kapoor, Ernst Neizvestny, Shemyakin, Bartholdi.",
  L("Michelangelo|Микеланджело; Auguste Rodin|Роден; Donatello|Донателло; Bernini|Бернини; Antonio Canova|Канова; Phidias|Фидий; Praxiteles|Пракситель; Myron|Мирон; Étienne Falconet|Фальконе; Vera Mukhina|Мухина; "
    "Zurab Tsereteli|Церетели; Yevgeny Vuchetich|Вучетич; Peter Klodt|Клодт; Fedot Shubin|Шубин; Mikhail Kozlovsky|Козловский; Mark Antokolsky|Антокольский; Sergey Konenkov|Конёнков; Stepan Erzya|Эрьзя; "
    "Alberto Giacometti|Джакометти; Henry Moore|Генри Мур; Constantin Brâncuși|Бранкузи; Louise Bourgeois|Луиза Буржуа; Jeff Koons|Джефф Кунс; Anish Kapoor|Аниш Капур; Ernst Neizvestny|Неизвестный; "
    "Mikhail Shemyakin|Шемякин; Frédéric Bartholdi|Бартольди; Ivan Martos|Мартос; Alexander Opekushin|Опекушин; Paolo Troubetzkoy|Трубецкой; Matvey Manizer|Манизер; Nikolai Tomsky|Томский; Lev Kerbel|Кербель; "
    "Alexander Burganov|Бурганов; Salavat Shcherbakov|Щербаков; Mikhail Anikushin|Аникушин; Lysippos|Лисипп; Polykleitos|Поликлет; Skopas|Скопас; Ghiberti|Гиберти; Verrocchio|Верроккьо; Cellini|Челлини; "
    "Giambologna|Джамболонья; Thorvaldsen|Торвальдсен; Houdon|Гудон; Camille Claudel|Камилла Клодель; Aristide Maillol|Майоль; Edgar Degas|Дега; Picasso|Пикассо; Salvador Dalí|Дали; Damien Hirst|Херст; "
    "Ron Mueck|Рон Мьюек; Gutzon Borglum|Борглум; Ai Weiwei|Ай Вэйвэй; Antony Gormley|Энтони Гормли; Jean Arp|Арп; Naum Gabo|Габо; Archipenko|Архипенко; Ossip Zadkine|Цадкин; Marc Quinn|Марк Куинн"))

# ---------- 10. Unusual thinking ----------
k("winged_non_birds", "everyday", "Name something that can have wings but is not a bird or an insect", "Назовите то, у чего могут быть крылья, но это не птица и не насекомое",
  "Something with wings that is not a bird or insect: airplane, glider, bat, angel, dragon, Pegasus, windmill (sails), building wing (wing of a palace), hospital wing, flying fish (fins), maple seed, car (wing/spoiler), nose (ala), sanitary pad with wings, stage wings (theatre), fairy, pterodactyl, drone, door (wing), army flank.",
  L("Airplane|Самолёт; Glider|Планер; Bat|Летучая мышь; Angel|Ангел; Dragon|Дракон; Pegasus|Пегас; Windmill|Мельница; Building wing|Крыло здания|флигель; Hospital wing|Крыло больницы; Flying fish|Летучая рыба; "
    "Maple seed|Крылатка клёна|семя клёна; Car|Машина|крыло автомобиля; Nose|Нос|крылья носа; Sanitary pad|Прокладка с крылышками; Stage|Сцена|кулисы; Fairy|Фея; Pterodactyl|Птеродактиль; Drone|Дрон; "
    "Door|Двустворчатая дверь|створка; Army flank|Фланг|крыло армии; Football winger|Крыло в футболе|вингер; Political wing|Крыло партии; Hang glider|Дельтаплан; Paraglider|Параплан; Rocket|Ракета; "
    "Space shuttle|Шаттл;  Griffin|Грифон; Phoenix|Феникс; Sphinx|Сфинкс; Cupid|Купидон; Demon|Демон; Gargoyle|Горгулья; Valkyrie|Валькирия; Harpy|Гарпия; Wyvern|Виверна; "
    "Flying lemur|Шерстокрыл;  Manta ray|Манта; Stingray|Скат; Ash seed|Семя ясеня; Elm seed|Семя вяза; Sycamore|Платан; Pea flower|Цветок гороха|паруса; Wing nut|Барашковая гайка; "
    "Wing chair|Кресло с ушами; Wing mirror|Боковое зеркало; Chicken wings|Куриные крылышки; Spoiler|Спойлер; Medal with wings|Значок лётчика; Logo|Логотип с крыльями; Statue of Nike|Ника Самофракийская; "
    "Wing tip|Законцовка крыла; Hockey winger|Крайний нападающий; Ornithopter|Орнитоптер; Wingsuit|Вингсьют;  Seraph|Серафим; Pegasus constellation|Созвездие Пегас"))

k("school_and_prison_things", "everyday", "Name something found both in a school and in a prison", "Назовите предмет, который можно встретить и в школе, и в тюрьме",
  "Something found both in schools and prisons: bell, schedule (timetable), canteen (dining hall), uniform, guard (security), desks, chairs, library, gym, yard, corridors, cameras, roll call, toilet, lockers, metal detector, notice board, rules, fence, gate, books, notebooks, director (warden).",
  L("Bell|Звонок; Schedule|Расписание|распорядок; Canteen|Столовая; Uniform|Форма; Guard|Охранник|охрана; Desks|Парты|столы; Chairs|Стулья; Library|Библиотека; Gym|Спортзал; Yard|Двор; Corridors|Коридоры; "
    "Cameras|Камеры видеонаблюдения; Roll call|Перекличка; Toilet|Туалет; Lockers|Шкафчики; Metal detector|Металлоискатель|рамка; Notice board|Доска объявлений; Rules|Правила; Fence|Забор; Gate|Ворота; "
    "Books|Книги; Notebooks|Тетради; Director|Директор|начальник; Classes|Уроки|занятия; Teacher|Учитель; Workshop|Мастерская; Medical room|Медпункт; Doctor|Врач; Nurse|Медсестра; Psychologist|Психолог; "
    "Punishment|Наказание; Detention|Карцер|оставление после уроков; Bars|Решётки; Windows|Окна; Doors|Двери; Keys|Ключи;  Wake-up|Подъём; Cells|Камеры; Classroom|Кабинет; "
    "Chalkboard|Доска; Pens|Ручки; Tables|Столы;  Shower|Душ; Laundry|Прачечная; Kitchen|Кухня; Cook|Повар; Trays|Подносы; Mail|Почта;  "
    "Exam|Экзамен; Certificate|Аттестат; Diploma|Диплом; Sports ground|Спортплощадка; Assembly hall|Актовый зал; Computer room|Компьютерный класс; Clock|Часы; Flag|Флаг; Portrait|Портрет; Fire alarm|Пожарная сигнализация"))

k("color_mark_makers", "everyday", "Name something that leaves a coloured mark on paper", "Назовите то, что может оставить цветной след на бумаге",
  "Something that leaves a colour mark on paper: felt-tip pen, marker, crayon, coloured pencil, pen, paint, watercolor, gouache, ink, pastel, chalk, highlighter, lipstick, coffee, tea, wine, beet juice, berries, grass, blood, printer toner, stamp, charcoal (black), gel pen, nail polish, food colouring.",
  L("Felt-tip pen|Фломастер; Marker|Маркер; Crayon|Мелок|восковой мелок; Coloured pencil|Цветной карандаш; Pen|Ручка; Paint|Краска; Watercolor|Акварель; Gouache|Гуашь; Ink|Чернила|тушь; Pastel|Пастель; "
    "Chalk|Мел; Highlighter|Текстовыделитель; Lipstick|Помада; Coffee|Кофе; Tea|Чай; Wine|Вино; Beet juice|Свекольный сок|свёкла; Berries|Ягоды|черника; Grass|Трава; Blood|Кровь; Toner|Тонер; Stamp|Печать|штамп; "
    "Charcoal|Уголь; Gel pen|Гелевая ручка; Nail polish|Лак для ногтей; Food colouring|Пищевой краситель; Pencil|Простой карандаш; Ballpoint pen|Шариковая ручка; Fountain pen|Перьевая ручка; Printer|Принтер; "
    "Spray paint|Баллончик; Oil paint|Масляная краска; Acrylic|Акрил; Brush|Кисточка; Finger paint|Пальчиковая краска; Eye shadow|Тени для век; Mascara|Тушь для ресниц; Blush|Румяна; Eyeliner|Подводка; "
    "Ketchup|Кетчуп; Mustard|Горчица; Turmeric|Куркума; Cherry juice|Вишнёвый сок; Pomegranate|Гранат; Mulberry|Шелковица; Iodine|Йод; Brilliant green|Зелёнка; Potassium permanganate|Марганцовка; Rust|Ржавчина; "
    "Carbon paper|Копирка; Stamp pad|Штемпельная подушка; Sharpie|Шарпи; Glitter pen|Ручка с блёстками; Wax|Воск цветной; Clay|Глина; Henna|Хна; Shoe polish|Крем для обуви; Soot|Сажа"))

k("swells_in_water", "everyday", "Name something that grows in size when it touches water", "Назовите то, что увеличивается в размерах при контакте с водой",
  "Something that swells or expands in water: sponge, rice, beans, peas, buckwheat, oatmeal, chia seeds, gelatin, raisins, dried mushrooms, wood, paper, hydrogel balls (orbeez), diaper, tampon, seaweed (kombu), dried fruit, pasta, soy chunks, sago, tapioca pearls, magic towel (compressed), grow toys, bread, cotton wool, peat tablet.",
  L("Sponge|Губка; Rice|Рис; Beans|Фасоль; Peas|Горох; Buckwheat|Гречка; Oatmeal|Овсянка; Chia seeds|Семена чиа|чиа; Gelatin|Желатин; Raisins|Изюм; Dried mushrooms|Сушёные грибы; Wood|Дерево|древесина; "
    "Paper|Бумага; Orbeez|Орбиз|гидрогелевые шарики; Diaper|Подгузник; Tampon|Тампон; Kombu|Комбу|водоросли; Dried fruit|Сухофрукты; Pasta|Макароны; Soy chunks|Соевое мясо; Sago|Саго; Tapioca pearls|Тапиока; "
    "Compressed towel|Сжатое полотенце; Grow toys|Растущие игрушки; Bread|Хлеб; Cotton wool|Вата; Peat tablet|Торфяная таблетка; Wheat|Пшеница; Barley|Перловка; Lentils|Чечевица; Chickpeas|Нут; Couscous|Кус кус; "
    "Bulgur|Булгур; Semolina|Манка; Noodles|Лапша; Agar|Агар; Psyllium|Псиллиум; Flax seeds|Семена льна; Tea leaves|Чайные листья; Dried apricots|Курага; Prunes|Чернослив; Sea cucumber|Трепанг; "
    "Wooden door|Деревянная дверь|разбухшая дверь; Cardboard|Картон; Clay|Глина; Hair|Волосы; Skin|Кожа на пальцах; Seeds|Семена; Bean sprouts|Пророщенные бобы;  Sodium polyacrylate|Полиакрилат натрия; "
    "Cat litter|Наполнитель для кошачьего туалета; Hydrogel|Гидрогель;   Mushrooms|Грибы; Wakame|Вакамэ; Rice paper|Рисовая бумага; Konjac|Конняку"))

k("light_and_heat_sources", "everyday", "Name something that gives both light and heat", "Назовите предмет, который может быть одновременно источником света и тепла",
  "An object that provides both light and warmth: campfire, fireplace, candle, torch, oil lamp, kerosene lamp, incandescent bulb, stove (wood stove with window), sun, heat lamp, infrared heater (glow), lava, gas burner, bonfire, brazier, match, lighter, halogen lamp, electric fireplace, sauna stove.",
  L("Campfire|Костёр; Fireplace|Камин; Candle|Свеча; Torch|Факел; Oil lamp|Масляная лампа|лампада; Kerosene lamp|Керосиновая лампа; Incandescent bulb|Лампа накаливания|лампочка; Wood stove|Печь|буржуйка; "
    "Sun|Солнце; Heat lamp|Инфракрасная лампа|греющая лампа; Infrared heater|Инфракрасный обогреватель; Lava|Лава; Gas burner|Газовая горелка|конфорка; Bonfire|Большой костёр; Brazier|Жаровня|мангал; "
    "Match|Спичка; Lighter|Зажигалка; Halogen lamp|Галогенная лампа; Electric fireplace|Электрокамин; Sauna stove|Печь в бане|каменка; Russian stove|Русская печь; Fire pit|Очаг; Hearth|Очаг|костровище; "
    "Volcano|Вулкан; Star|Звезда; Lightning|Молния; Fire|Огонь; Gas lamp|Газовый фонарь; Spirit lamp|Спиртовка; Primus|Примус; Blowtorch|Паяльная лампа; Welding arc|Сварка; Flare|Фальшфейер; "
    "Firework|Фейерверк; Sparkler|Бенгальский огонь; Tealight|Чайная свечка; Lantern|Фонарь со свечой; Toaster|Тостер; Electric heater spiral|Спираль обогревателя; Oven|Духовка; Hot plate|Электроплитка; "
    "Incubator lamp|Лампа для инкубатора; Terrarium lamp|Лампа для террариума; Tanning lamp|Лампа для загара; Hookah coal|Уголь для кальяна; Embers|Угли; Charcoal|Тлеющий уголь; Burning house|Пожар; "
    "Rocket engine|Двигатель ракеты; Car headlight|Фара старая; Stage spotlight|Прожектор; Chandelier|Люстра с лампами накаливания; Heat gun|Строительный фен"))

k("multi_level_non_buildings", "everyday", "Name something that can have several floors or levels but is not a building", "Назовите то, у чего может быть несколько этажей или ярусов, но это не здание",
  "Something with several floors, decks or tiers that is not a building: cake, bus (double-decker), ship (decks), train (double-decker car), cruise liner, bunk bed, wardrobe/shelf, sandwich (club), parking garage no (building), airplane (A380), cat tree, cage, jewellery box, toolbox, garden (terraced), bookcase, rocket (stages), tray, lunch box (bento), forest (layers), wedding cake.",
  L("Cake|Торт|многоярусный торт; Double-decker bus|Двухэтажный автобус; Ship|Корабль|палубы; Double-decker train|Двухэтажный поезд; Cruise liner|Круизный лайнер; Bunk bed|Двухъярусная кровать; Shelf|Стеллаж|полки; "
    "Club sandwich|Клаб сэндвич; Airbus A380|Аэробус А380; Cat tree|Домик для кошки; Cage|Клетка; Jewellery box|Шкатулка; Toolbox|Ящик для инструментов; Terraced garden|Террасы; Bookcase|Книжный шкаф; "
    "Rocket|Ракета|ступени; Tray|Многоярусный поднос; Bento|Бэнто; Forest|Лес|ярусы леса; Wedding cake|Свадебный торт; Fountain|Многоярусный фонтан; Chandelier|Многоярусная люстра;  "
    "Theatre balcony|Ярусы театра; Stadium stands|Трибуны; Amphitheatre|Амфитеатр; Mine|Шахта|горизонты шахты; Cave|Пещера; Ant hill|Муравейник; Beehive|Улей; Termite mound|Термитник;  "
    "Doll house|Кукольный дом; Car carrier|Автовоз; Parking robot|Механическая парковка;   Hamburger|Бургер; Lasagna|Лазанья; Napoleon|Наполеон; Pancake stack|Стопка блинов; "
    "  Wardrobe|Шкаф; Chest of drawers|Комод; Fridge|Холодильник|полки; Oven|Духовка с уровнями; Steamer|Пароварка; Dish rack|Сушилка для посуды; Fruit stand|Фруктовница; Cake stand|Этажерка; "
    "Shoe rack|Обувница; Sandwich board|Этажерка для бумаг; Pyramid of cups|Пирамида из бокалов; Card house|Карточный домик; Lego tower|Башня из лего; Video game|Уровни игры; Hell in Dante|Круги ада; Rice terraces|Рисовые террасы"))

k("hospital_and_gym_items", "everyday", "Name something found both in a hospital and in a gym", "Назовите предмет, который можно встретить и в больнице, и в спортзале",
  "Something found both in hospitals and gyms: scales, treadmill (rehab), exercise bike, mats, towel, first aid kit, mirror, defibrillator, shower, lockers, heart rate monitor, blood pressure monitor, dumbbells (rehab), resistance bands, massage table, elastic bandage, ice pack, water cooler, stretcher, trainer (physiotherapist).",
  L("Scales|Весы; Treadmill|Беговая дорожка; Exercise bike|Велотренажёр; Mats|Коврики|маты; Towel|Полотенце; First aid kit|Аптечка; Mirror|Зеркало; Defibrillator|Дефибриллятор; Shower|Душ; Lockers|Шкафчики; "
    "Heart rate monitor|Пульсометр; Blood pressure monitor|Тонометр; Dumbbells|Гантели; Resistance bands|Резинки|эспандер; Massage table|Массажный стол; Elastic bandage|Эластичный бинт; Ice pack|Лёд|холодный компресс; "
    "Water cooler|Кулер; Stretcher|Носилки; Physiotherapist|Физиотерапевт|инструктор лфк; Doctor|Врач;  Fitball|Фитбол; Wall bars|Шведская стенка; Parallel bars|Брусья; Stepper|Степпер; "
    "Rowing machine|Гребной тренажёр; Elliptical|Эллипсоид; Kettlebell|Гиря; Height meter|Ростомер; Body fat analyzer|Анализатор состава тела; Spirometer|Спирометр; Stopwatch|Секундомер; Timer|Таймер; "
    "Clock|Часы; Bench|Скамья; Sauna|Сауна; Pool|Бассейн; Reception|Ресепшн; Cleaner|Уборщица; Hand sanitizer|Антисептик; Wet wipes|Салфетки; Gloves|Перчатки; Kinesio tape|Тейп; Orthosis|Ортез|бандаж; "
    "Crutches|Костыли; Foam roller|Ролик для мфр; Medicine ball|Медбол; Balance board|Балансировочная доска; Pulse oximeter|Пульсоксиметр; Thermometer|Градусник; Locker room|Раздевалка; Ventilation|Вентиляция; Music|Музыка"))

k("color_changing_things", "everyday", "Name something that can change colour without paint", "Назовите то, что может менять цвет без краски",
  "Something that changes colour naturally or by itself: chameleon, octopus, cuttlefish, leaves in autumn, sky, sea, mood ring, traffic light, hair (greying), skin (tan), fruit ripening (tomato, banana), litmus paper, thermochromic mug, mood lamp, LED, eyes (some), photochromic glasses, metal heating (glowing), hydrangea (soil), arctic fox (fur), hare (fur), flamingo (diet), bruise, cheeks (blushing).",
  L("Chameleon|Хамелеон; Octopus|Осьминог; Cuttlefish|Каракатица; Autumn leaves|Листья осенью|листва; Sky|Небо; Sea|Море; Mood ring|Кольцо настроения; Traffic light|Светофор; Hair|Волосы|седина; Skin|Кожа|загар; "
    "Tomato|Помидор; Banana|Банан; Litmus paper|Лакмусовая бумажка; Thermochromic mug|Термочашка|хамелеон кружка; Mood lamp|Ночник; LED|Светодиод|rgb лента; Eyes|Глаза; Photochromic glasses|Фотохромные очки|хамелеоны; "
    "Hot metal|Раскалённый металл; Hydrangea|Гортензия; Arctic fox|Песец; Hare|Заяц; Flamingo|Фламинго; Bruise|Синяк; Cheeks|Щёки|румянец; Apple|Яблоко; Strawberry|Клубника; Cherry|Вишня; Pepper|Перец; "
    "Moon|Луна; Sun|Солнце на закате; Cloud|Облако; Water|Вода; Ice|Лёд; Fire|Огонь; Lobster|Лобстер при варке; Shrimp|Креветка при варке; Meat|Мясо при жарке; Bread|Хлеб|тост; Silver|Серебро темнеет; "
    "Copper|Медь|патина; Iron|Железо|ржавчина; Paper|Бумага желтеет; Photo|Фотография выцветает; Fabric|Ткань выгорает; Grass|Трава; Tree|Дерево; Frog|Лягушка; Squid|Кальмар; Anole|Анолис; Flatfish|Камбала; "
    "Seahorse|Морской конёк; Thermometer strip|Термополоска; Pregnancy test|Тест на беременность; Indicator|Индикатор; Phenolphthalein|Фенолфталеин; Smart glass|Умное стекло; E-ink|Электронные чернила; Screen|Экран; "
    "Aurora|Северное сияние; Rainbow|Радуга; Soap bubble|Мыльный пузырь; Opal|Опал; Alexandrite|Александрит; Labradorite|Лабрадорит; Pearl|Перламутр"))
