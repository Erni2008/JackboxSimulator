# THINK OR DIE category content, part Z (list 7, questions 51-100; compact lists, the AI judges the rest).
from cats_a import cat


def k(id, group, en, ru, crit, lines, inv="", type="KNOWLEDGE", **kw):
    cat(id, type, group, en, ru, crit, crit, lines, inv, **kw)


def L(s):
    return "\n".join(x.strip() for x in s.strip().split(";"))


# ---------- 6. History, culture, places ----------
k("airport_namesakes", "history", "Name a famous person an airport is named after", "Назовите известного человека, в честь которого назван аэропорт",
  "A real person after whom an airport is named: Pushkin (Sheremetyevo), Lomonosov (Arkhangelsk), Yuri Gagarin (Saratov), Lermontov (Mineralnye Vody), Peter the Great (Voronezh), John F. Kennedy, Charles de Gaulle, Leonardo da Vinci (Fiumicino), John Lennon (Liverpool), Ataturk, Indira Gandhi, Chopin (Warsaw), Mozart (Salzburg), Václav Havel.",
  L("Alexander Pushkin|Пушкин|шереметьево; Mikhail Lomonosov|Ломоносов; Yuri Gagarin|Гагарин; Mikhail Lermontov|Лермонтов; Peter the Great|Пётр Первый; John F. Kennedy|Джон Кеннеди|кеннеди; "
    "Charles de Gaulle|Шарль де Голль; Leonardo da Vinci|Леонардо да Винчи; John Lennon|Джон Леннон; Atatürk|Ататюрк; Indira Gandhi|Индира Ганди; Frédéric Chopin|Шопен; "
    "Wolfgang Amadeus Mozart|Моцарт; Václav Havel|Вацлав Гавел; Ronald Reagan|Рейган; George Bush|Буш; Marco Polo|Марко Поло; Galileo Galilei|Галилей; Pablo Picasso|Пикассо; "
    "Federico Fellini|Феллини; Lech Wałęsa|Лех Валенса; Nelson Mandela|Нельсон Мандела; Benito Juárez|Бенито Хуарес; Jorge Chávez|Хорхе Чавес; Jomo Kenyatta|Джомо Кеньятта; "
    "Queen Alia|Королева Алия; King Fahd|Король Фахд; Ben Gurion|Бен Гурион; Heydar Aliyev|Гейдар Алиев; Shota Rustaveli|Руставели;  Ivan Kozhedub|Кожедуб; "
    "Nikolai Gogol|Гоголь; Dostoevsky|Достоевский; Tchaikovsky|Чайковский; Rachmaninoff|Рахманинов; Tolstoy|Лев Толстой; Chekhov|Чехов; Mendeleev|Менделеев; Korolev|Королёв; "
    "Tsiolkovsky|Циолковский; Tupolev|Туполев; Kurchatov|Курчатов; Pokryshkin|Покрышкин; Bering|Беринг; Khabarov|Хабаров; Dezhnev|Дежнёв; Ermak|Ермак; Kalashnikov|Калашников; "
    "Shukshin|Шукшин; Tvardovsky|Твардовский; Yesenin|Есенин; Turgenev|Тургенев;   Vladimir Vysotsky|Высоцкий; Dmitry Hvorostovsky|Хворостовский; "
    "Ernst Krenkel|Кренкель; Valery Chkalov|Чкалов; Alexander Nevsky|Александр Невский; Ivan Susanin|Сусанин; Gavriil Derzhavin|Державин; Alexander Suvorov|Суворов; Mikhail Kutuzov|Кутузов; "
    "Nikolai Przhevalsky|Пржевальский; Jean Monnet|Жан Монне; Konrad Adenauer|Аденауэр; Willy Brandt|Вилли Брандт; Franz Josef Strauss|Франц Йозеф Штраус; Josep Tarradellas|Таррадельяс"))

k("monuments_of_people", "history", "Name a historic monument that depicts a person or a group of people", "Назовите исторический памятник, который изображает человека или группу людей",
  "A real monument or statue depicting a person or people: Bronze Horseman, Motherland Calls, Minin and Pozharsky, Statue of Liberty, Christ the Redeemer, David, Mount Rushmore, Lincoln Memorial, Worker and Kolkhoz Woman, Pushkin monument, Alyosha, Little Mermaid, Manneken Pis, Sphinx (part human), Moai.",
  L("Bronze Horseman|Медный всадник; Motherland Calls|Родина мать зовёт|родина мать; Minin and Pozharsky|Минин и Пожарский; Statue of Liberty|Статуя Свободы; Christ the Redeemer|Христос Искупитель; "
    "David|Давид; Mount Rushmore|Гора Рашмор; Lincoln Memorial|Мемориал Линкольна; Worker and Kolkhoz Woman|Рабочий и колхозница; Pushkin monument|Памятник Пушкину; Alyosha|Алёша; "
    "Little Mermaid|Русалочка Копенгаген; Manneken Pis|Писающий мальчик; Great Sphinx|Сфинкс; Moai|Моаи|статуи острова пасхи; Warrior-Liberator|Воин освободитель; "
    "Peter the Great Statue|Памятник Петру Первому; Millennium of Russia|Тысячелетие России; Yuri Dolgoruky monument|Памятник Юрию Долгорукому; Kutuzov monument|Памятник Кутузову; "
    "Lenin monument|Памятник Ленину; Gagarin monument|Памятник Гагарину; Mayakovsky monument|Памятник Маяковскому; Dzerzhinsky|Железный Феликс; Stalingrad defenders|Мамаев курган; "
    "Monument to the Unknown Soldier|Могила неизвестного солдата; Thinker|Мыслитель; Venus de Milo|Венера Милосская; Laocoön|Лаокоон; Nelson's Column|Колонна Нельсона; "
    "Leshan Buddha|Будда в Лэшане; Spring Temple Buddha|Будда храма Весны; Statue of Unity|Статуя Единства; Terracotta Army|Терракотовая армия; Abu Simbel|Абу Симбел; "
    "Colossi of Memnon|Колоссы Мемнона; Marcus Aurelius|Конная статуя Марка Аврелия; Joan of Arc|Жанна д'Арк; Charles Bridge statues|Статуи Карлова моста; Bremen Town Musicians|Бременские музыканты; "
    "Lady Justice|Фемида; The Kiss|Поцелуй Родена; Burghers of Calais|Граждане Кале; Columbus monument|Памятник Колумбу; Mother Armenia|Мать Армения; Kartlis Deda|Мать Грузия; "
    "Salavat Yulaev|Салават Юлаев; Monument to Bogdan Khmelnitsky|Богдан Хмельницкий; Catherine the Great|Памятник Екатерине; Nicholas I|Памятник Николаю Первому; "
    "  Iwo Jima Memorial|Мемориал Иводзимы; Einstein|Памятник Эйнштейну; Sherlock Holmes statue|Памятник Шерлоку Холмсу"))

k("historic_money", "history", "Name something that was used as money in the past", "Назовите то, что использовали как деньги в прошлом",
  "An object used as currency in the past: shells (cowrie), furs, salt, cattle, grain, gold, silver, coins, tea bricks, cocoa beans, beads, stone discs (Rai stones), tobacco, cigarettes, nails, copper bars, iron bars, amber, leather, pepper, spices, wampum, hryvnia ingots.",
  L("Shells|Ракушки|раковины каури; Furs|Меха|пушнина; Salt|Соль; Cattle|Скот|коровы; Grain|Зерно; Gold|Золото; Silver|Серебро; Coins|Монеты; Tea bricks|Плиточный чай; Cocoa beans|Какао бобы; "
    "Beads|Бусы|бусины; Rai stones|Каменные деньги|камни раи; Tobacco|Табак; Cigarettes|Сигареты; Nails|Гвозди; Copper bars|Медные слитки; Iron bars|Железные бруски; Amber|Янтарь; "
    "Leather|Кожа; Pepper|Перец; Spices|Пряности; Wampum|Вампум; Hryvnia ingots|Гривны слитки; Sable pelts|Соболиные шкурки; Squirrel pelts|Беличьи шкурки|куны; Kuna|Куна; "
    "Bronze knives|Бронзовые ножи; Spade money|Деньги лопатки; Paper money|Ассигнации; Pearls|Жемчуг; Gems|Драгоценные камни; Ivory|Слоновая кость; Feathers|Перья; Whale teeth|Зубы кита; "
    "Rice|Рис; Barley|Ячмень; Wine|Вино; Oil|Масло; Wheat|Пшеница; Horses|Лошади; Slaves|Рабы; Copper|Медь; Bronze|Бронза; Tally sticks|Бирки;  Vodka|Водка; "
    "Stamps|Марки; Tokens|Жетоны; Tin|Олово; Lead|Свинец; Drums|Барабаны; Cloth|Ткань|отрез ткани; Silk|Шёлк; Cotton|Хлопок; Coffee|Кофе; Sugar|Сахар; Tea|Чай; Bread|Хлеб"))

k("ancient_surviving_structures", "history", "Name an ancient structure that survives today", "Назовите древнее сооружение, которое сохранилось до наших дней",
  "A real ancient structure (antiquity or prehistory) still standing today: Pyramids of Giza, Great Sphinx, Stonehenge, Colosseum, Parthenon, Pantheon, Great Wall of China, Petra, Machu Picchu (15th c.), Teotihuacan, Hadrian's Wall, Roman aqueducts, Temple of Karnak, Abu Simbel, Derbent fortress, Chersonesus.",
  L("Pyramids of Giza|Пирамиды Гизы|пирамида хеопса; Great Sphinx|Сфинкс; Stonehenge|Стоунхендж; Colosseum|Колизей; Parthenon|Парфенон; Pantheon|Пантеон; Great Wall of China|Великая Китайская стена; "
    "Petra|Петра; Machu Picchu|Мачу Пикчу; Teotihuacan|Теотиуакан; Hadrian's Wall|Вал Адриана; Pont du Gard|Пон дю Гар|римский акведук; Temple of Karnak|Карнак; Abu Simbel|Абу Симбел; "
    "Derbent fortress|Дербент|нарын кала; Chersonesus|Херсонес; Acropolis|Акрополь; Temple of Hephaestus|Храм Гефеста; Valley of the Kings|Долина царей; Luxor Temple|Луксорский храм; "
    "Ziggurat of Ur|Зиккурат Ура; Persepolis|Персеполь; Baalbek|Баальбек; Palmyra|Пальмира; Ephesus|Эфес; Library of Celsus|Библиотека Цельса; Pompeii|Помпеи; Roman Forum|Римский форум; "
    "Arch of Titus|Арка Тита; Arch of Constantine|Арка Константина; Circus Maximus|Большой цирк; Baths of Caracalla|Термы Каракаллы; Segovia aqueduct|Акведук Сеговии; "
    "Theatre of Epidaurus|Театр Эпидавра; Delphi|Дельфы; Knossos|Кносский дворец; Mycenae|Микены; Göbekli Tepe|Гёбекли Тепе; Newgrange|Ньюгрейндж; Carnac stones|Менгиры Карнака; "
    "Dolmens of Caucasus|Дольмены; Arkaim|Аркаим; Mohenjo-daro|Мохенджо даро; Sanchi Stupa|Ступа в Санчи; Angkor Wat|Ангкор Ват; Borobudur|Боробудур; Chichen Itza|Чичен Ица; "
    "Tikal|Тикаль; Moai|Моаи; Great Zimbabwe|Великое Зимбабве; Aksum obelisks|Обелиски Аксума; Masada|Масада; Western Wall|Стена плача; Hagia Sophia|Айя София; Diocletian's Palace|Дворец Диоклетиана; "
    "Garni Temple|Храм Гарни; Jvari|Джвари; Mtskheta|Мцхета; Kerch Tsarsky Kurgan|Царский курган; Tanais|Танаис; Pyramid of Djoser|Пирамида Джосера; Bent Pyramid|Ломаная пирамида"))

k("costume_holidays", "everyday", "Name a holiday traditionally celebrated with costumes", "Назовите праздник, который традиционно сопровождается костюмами",
  "A holiday or festival where people wear costumes: Halloween, carnival (Rio, Venice), New Year (fancy dress, Ded Moroz), Christmas (Yuletide mummers), Maslenitsa, Purim, Day of the Dead, Ivan Kupala, Mardi Gras, Kolyadki, Notting Hill Carnival, Oktoberfest, Saint Patrick's Day, Holi, Chinese New Year (lion dance).",
  L("Halloween|Хэллоуин; Carnival|Карнавал; Rio Carnival|Карнавал в Рио; Venice Carnival|Венецианский карнавал; New Year|Новый год|новогодний утренник; Christmas|Рождество; Svyatki|Святки|колядки; "
    "Maslenitsa|Масленица; Purim|Пурим; Day of the Dead|День мёртвых; Ivan Kupala|Иван Купала; Mardi Gras|Марди Гра; Kolyada|Коляда; Notting Hill Carnival|Карнавал Ноттинг Хилл; "
    "Oktoberfest|Октоберфест; Saint Patrick's Day|День святого Патрика; Holi|Холи; Chinese New Year|Китайский Новый год; Fasching|Фашинг; Cologne Carnival|Кёльнский карнавал; "
    "Basel Fasnacht|Базельский карнавал; Krampusnacht|Ночь Крампуса; Samhain|Самайн; Walpurgis Night|Вальпургиева ночь; Masquerade|Маскарад; Bal masqué|Бал маскарад; "
    "  Nowruz|Навруз; Diwali|Дивали; Obon|Обон; Setsubun|Сэцубун; Inti Raymi|Инти Райми; Junkanoo|Джанкану; Mummers Parade|Парад ряженых; Bonfire Night|Ночь Гая Фокса; "
    "Cosplay festival|Косплей фестиваль; Comic-Con|Комик кон; April Fools' Day|День смеха;    "
    "  Easter|Пасха;   Knight festival|Рыцарский фестиваль; Medieval fair|Средневековая ярмарка; "
    "Viking festival|Фестиваль викингов; Up Helly Aa|Ап Хелли Аа; Ded Moroz party|Ёлка; Kids' party|Детский утренник; Matinee|Утренник"))

k("eponym_people", "history", "Name a real person after whom an element, a place or a unit is named", "Назовите реального человека, в честь которого назван химический элемент, географический объект или единица измерения",
  "A real person whose name is given to a chemical element, a geographic feature or a unit of measurement: Mendeleev (mendelevium), Curie (curium), Einstein (einsteinium), Nobel (nobelium), Newton (newton), Volta (volt), Watt, Ampère, Ohm, Kelvin, Celsius, Hertz, Pascal, Joule, Tesla, Bering (Bering Strait), Columbus (Colombia), Amerigo Vespucci (America), Magellan, Hudson, Przhevalsky.",
  L("Dmitri Mendeleev|Менделеев; Marie Curie|Мария Кюри; Albert Einstein|Эйнштейн; Alfred Nobel|Нобель; Isaac Newton|Ньютон; Alessandro Volta|Вольта; James Watt|Уатт; André-Marie Ampère|Ампер; "
    "Georg Ohm|Ом; Lord Kelvin|Кельвин; Anders Celsius|Цельсий; Heinrich Hertz|Герц; Blaise Pascal|Паскаль; James Joule|Джоуль; Nikola Tesla|Тесла; Vitus Bering|Беринг; "
    "Christopher Columbus|Колумб; Amerigo Vespucci|Америго Веспуччи; Ferdinand Magellan|Магеллан; Henry Hudson|Гудзон; Nikolai Przhevalsky|Пржевальский; Fahrenheit|Фаренгейт; "
    "Michael Faraday|Фарадей; Charles-Augustin de Coulomb|Кулон; Wilhelm Röntgen|Рентген; Enrico Fermi|Ферми; Niels Bohr|Бор; Ernest Rutherford|Резерфорд; Copernicus|Коперник; "
    "Yuri Oganessian|Оганесян; Georgy Flerov|Флёров; Glenn Seaborg|Сиборг; Lise Meitner|Мейтнер; Gadolin|Гадолин; Samarsky|Самарский; Becquerel|Беккерель; Rolf Sievert|Зиверт; "
    "Wilhelm Weber|Вебер; Joseph Henry|Генри; Werner von Siemens|Сименс; Abel Tasman|Тасман; James Cook|Кук; Willem Barentsz|Баренц; Semyon Dezhnev|Дежнёв; Laptev brothers|Лаптевы; "
    "Khabarov|Хабаров|хабаровск; Yekaterina|Екатерина|екатеринбург; Peter the Great|Пётр|петербург; Vladimir Lenin|Ленин|ленинград; Stalin|Сталин|сталинград; Simón Bolívar|Боливар|боливия; "
    "George Washington|Вашингтон; Queen Victoria|Виктория|водопад виктория; Livingstone|Ливингстон; David Livingstone|Ливингстон город; Everest|Джордж Эверест|эверест; Humboldt|Гумбольдт; "
    "Tsiolkovsky|Циолковский; Gagarin|Гагарин|гагарин город; Korolev|Королёв город; Kurchatov|Курчатов|курчатовий; Ivan Kruzenshtern|Крузенштерн; Bellingshausen|Беллинсгаузен; "
    "Lazarev|Лазарев|лазаревское; Mikhail Lomonosov|Ломоносов|ломоносов город; Alexander Pushkin|Пушкин город; Leo Tolstoy|Толстой станция; Chkalov|Чкалов; Kirov|Киров; Kalinin|Калинин|калининград"))

# ---------- 7. Games ----------
k("destructible_buildings_games", "games", "Name a video game where you can destroy buildings", "Назовите видеоигру, в которой можно разрушать здания",
  "A real video game where buildings or structures can be destroyed: Minecraft, Battlefield, Red Faction, Teardown, Rampage, Rainbow Six Siege, Just Cause, Godzilla games, Worms, Angry Birds, The Finals, Besiege, Crackdown, Mercenaries, Fortnite, GTA (partly), Garry's Mod, Scrap Mechanic.",
  L("Minecraft|Майнкрафт; Battlefield|Батлфилд; Red Faction|Ред фракшн; Teardown|Тирдаун; Rampage|Рэмпейдж; Rainbow Six Siege|Радуга 6|rainbow six; Just Cause|Джаст коз; Worms|Вормс|червячки; "
    "Angry Birds|Энгри бёрдс; The Finals|Зе файналс; Besiege|Бизидж; Crackdown|Крэкдаун; Mercenaries|Наёмники; Fortnite|Фортнайт; GTA|Гта; Garry's Mod|Гаррис мод; Scrap Mechanic|Скрап механик; "
    "Terraria|Террария; Roblox|Роблокс; World of Tanks|Мир танков|ворлд оф танкс; Company of Heroes|Компани оф хироуз; Age of Empires|Эпоха империй; StarCraft|Старкрафт; Warcraft|Варкрафт; "
    "Command & Conquer|Командуй и властвуй; Stronghold|Стронгхолд; Total War|Тотал вар;  Prototype|Прототип; inFamous|Инфеймос; Saints Row|Сейнтс роу; "
    "Mount & Blade|Маунт энд блейд; Blast Corps|Бласт корпс; Instruments of Destruction|Инструменты разрушения; Demolition Inc|Демолишн инк; Destroy All Humans|Уничтожить всех людей; "
    "Kaiju games|Игры про кайдзю; Godzilla|Годзилла; King of the Monsters|Король монстров; Bad Company 2|Бэд компани 2;  Space Engineers|Космические инженеры; "
    "7 Days to Die|7 дней чтобы умереть; Rust|Раст; Valheim|Вальхейм; Clash of Clans|Клеш оф кланс; Boom Beach|Бум бич;  Arkanoid|Арканоид; Bomberman|Бомбермен"))

k("silent_game_characters", "games", "Name a video game character who does not speak", "Назовите игрового персонажа, который не разговаривает",
  "A video game protagonist or character who never speaks (silent protagonist): Gordon Freeman, Link, Doomguy, Chell, Steve (Minecraft), Isaac Clarke (Dead Space 1), Jak (first game), Crash Bandicoot, Kirby, Pac-Man, Samus (mostly), the Courier (Fallout NV), Dragonborn, Stalker Strelok, Pikachu.",
  L("Gordon Freeman|Гордон Фримен; Link|Линк; Doomguy|Думгай|думслеер; Chell|Челл; Steve|Стив из Майнкрафта; Isaac Clarke|Айзек Кларк; Jak|Джек; Crash Bandicoot|Крэш; Kirby|Кирби; "
    "Pac-Man|Пакман; Samus|Самус; Courier|Курьер; Dragonborn|Довакин|драконорождённый; Strelok|Стрелок|меченый; Marked One|Меченый; Pikachu|Пикачу;  Red|Ред из покемонов; "
    "Mario|Марио; Luigi|Луиджи; Frog|Лягушка; Ori|Ори; Hollow Knight|Полый рыцарь; The Knight|Рыцарь;  Journey traveler|Путник из Journey; Limbo boy|Мальчик из Limbo; "
    "Inside boy|Мальчик из Inside; Stray cat|Кот из Stray; Goat|Козёл из Goat Simulator;  Rayman|Рэйман;  Mega Man|Мегамен;  "
    "Tetris piece|Фигура из тетриса; Among Us crewmate|Член экипажа из Амонг ас; Fall Guys bean|Бобик из Фолл гайз; Little Big Planet Sackboy|Сэкбой; Slime|Слайм; Cuphead|Капхед; "
    "Mugman|Магмен; Commander Keen|Командор Кин;    Vault Dweller|Выходец из убежища; Chosen One|Избранный;  "
    "Hero of Gothic|Безымянный герой;      Dog|Пёс из Half Life; Headcrab|Хедкраб; Creeper|Крипер; "
    "Enderman|Эндермен; Companion Cube|Куб компаньон;  Atlas|Атлас из Портала; P-Body|Пи боди"))

k("army_control_games", "games", "Name a video game where you command an army", "Назовите видеоигру, в которой можно управлять армией",
  "A real video game where the player commands troops or an army: StarCraft, Warcraft, Age of Empires, Total War, Command & Conquer, Heroes of Might and Magic, Company of Heroes, Mount & Blade, Civilization, Stronghold, Red Alert, Rise of Nations, Warhammer 40K: Dawn of War, Pikmin, Overlord, Crusader Kings.",
  L("StarCraft|Старкрафт; Warcraft|Варкрафт; Age of Empires|Эпоха империй; Total War|Тотал вар; Command & Conquer|Командуй и властвуй; Heroes of Might and Magic|Герои меча и магии|герои; "
    "Company of Heroes|Компани оф хироуз; Mount & Blade|Маунт энд блейд; Civilization|Цивилизация; Stronghold|Стронгхолд; Red Alert|Ред алерт; Rise of Nations|Райз оф нейшнс; "
    "Dawn of War|Доун оф вар; Pikmin|Пикмин; Overlord|Оверлорд; Crusader Kings|Крусейдер кингс; Europa Universalis|Европа универсалис; Hearts of Iron|Хартс оф айрон; Age of Mythology|Эпоха мифологии; "
    "Cossacks|Казаки; Blitzkrieg|Блицкриг; Sudden Strike|Санден страйк; Men of War|В тылу врага; Panzer General|Панцер генерал; XCOM|Икском; Into the Breach|Инту зе брич; Northgard|Нортгард; "
    "They Are Billions|Зей ар биллионс; Supreme Commander|Суприм командер; Battle for Middle-earth|Битва за Средиземье; Kingdom Under Fire|Кингдом андер файр; Dynasty Warriors|Династи ворриорс; "
    "Bannerlord|Баннерлорд; Medieval II|Медивал 2; Rome: Total War|Рим Тотал вар; Shogun|Сёгун; Warhammer|Вархаммер; King's Bounty|Кингс баунти; Disciples|Дисциплес; Age of Wonders|Эпоха чудес; "
    "Endless Legend|Эндлесс леджент; Stellaris|Стелларис; Homeworld|Хоумворлд; Halo Wars|Хало варс; Clash of Clans|Клеш оф кланс; Clash Royale|Клеш рояль; Rise of Kingdoms|Райз оф кингдомс; "
    "Myth|Миф; Lords of the Realm|Лорды королевства; Knights of Honor|Рыцари чести; Spellforce|Спеллфорс; Kohan|Кохан; Grey Goo|Грей гу; Ashes of the Singularity|Эшес оф зе сингулярити; Tooth and Tail|Туз энд тейл"))

k("reputation_system_games", "games", "Name a video game with a reputation system", "Назовите видеоигру, в которой есть система репутации",
  "A real video game with a reputation, karma, honor or faction standing system: Fallout: New Vegas, Fallout 3 (karma), Red Dead Redemption (honor), Mass Effect (Paragon/Renegade), Infamous (karma), Fable, The Elder Scrolls (factions), World of Warcraft (reputation), Sea of Thieves, Mount & Blade, Kingdom Come, Stalker, Dishonored (chaos).",
  L("Fallout: New Vegas|Фоллаут Нью Вегас; Fallout 3|Фоллаут 3; Red Dead Redemption|Ред дед редемпшн; Mass Effect|Масс эффект; inFamous|Инфеймос; Fable|Фейбл; Skyrim|Скайрим; "
    "World of Warcraft|Варкрафт|вов; Sea of Thieves|Си оф сивз; Mount & Blade|Маунт энд блейд; Kingdom Come|Кингдом кам; Stalker|Сталкер; Dishonored|Дисхонорд; Oblivion|Обливион; "
    "Morrowind|Морровинд; Star Wars KOTOR|Котор; Knights of the Old Republic|Рыцари старой республики; Undertale|Андертейл; Frostpunk|Фростпанк; Papers, Please|Пейперс плиз; "
    "The Witcher|Ведьмак; Cyberpunk 2077|Киберпанк; Assassin's Creed|Ассасин; Watch Dogs|Вотч догс; Elite Dangerous|Элит дейнджерос; EVE Online|Ева онлайн; Starfield|Старфилд; "
    "Fallout 4|Фоллаут 4; Outer Worlds|Аутер ворлдс; Pillars of Eternity|Пилларс; Divinity|Дивинити; Baldur's Gate 3|Балдурс гейт; Pathfinder|Пасфайндер; Stardew Valley|Стардью валли; "
    "Animal Crossing|Энимал кроссинг; Pokemon|Покемоны; Crusader Kings|Крусейдер кингс; Dragon Age|Драгон эйдж; Star Citizen|Стар ситизен; Mafia|Мафия; Saints Row|Сейнтс роу; "
    "Sleeping Dogs|Слипинг догс; Hitman|Хитман; Tom Clancy's Ghost Recon|Гост рекон; Black & White|Блэк энд вайт; Kenshi|Кенши; Rimworld|Римворлд; Space Rangers|Космические рейнджеры; "
    "Elex|Элекс; Gothic|Готика; Risen|Райзен; Two Worlds|Два мира; Ultima|Ультима; Star Wars Galaxies|Старворс гэлэксиз; Destiny|Дестини; Genshin Impact|Геншин; Black Desert|Блэк дезерт"))

k("weather_gameplay_games", "games", "Name a video game where weather affects gameplay", "Назовите видеоигру, в которой погода влияет на игровой процесс",
  "A real video game where weather changes gameplay: Zelda: Breath of the Wild (rain, lightning, cold), Red Dead Redemption 2, Death Stranding (timefall), Frostpunk, The Long Dark, Don't Starve, Stardew Valley, Farming Simulator, Forza Horizon, Stalker (emissions), Valheim, Pokémon (weather moves), Kingdom Come, DayZ, Snowrunner, Rain World.",
  L("Zelda: Breath of the Wild|Зельда Бреф оф зе вайлд; Red Dead Redemption 2|Ред дед 2; Death Stranding|Дэс стрэндинг; Frostpunk|Фростпанк; The Long Dark|Лонг дарк; Don't Starve|Донт старв; "
    "Stardew Valley|Стардью валли; Farming Simulator|Фарминг симулятор; Forza Horizon|Форза хорайзон; Stalker|Сталкер; Valheim|Вальхейм; Pokémon|Покемоны; Kingdom Come|Кингдом кам; DayZ|Дейзи; "
    "SnowRunner|Сноураннер; Rain World|Рейн ворлд; Tears of the Kingdom|Слёзы королевства; Battlefield|Батлфилд; Microsoft Flight Simulator|Флайт симулятор; F1|Формула 1 игра; Gran Turismo|Гран туризмо; "
    "Assetto Corsa|Ассетто корса; Dirt Rally|Дёрт ралли; Euro Truck Simulator|Евро трак симулятор|етс; American Truck Simulator|Американ трак симулятор; Arma|Арма; Squad|Сквод; "
    "Sea of Thieves|Си оф сивз; Subnautica|Сабнатика; Raft|Рафт; The Forest|Зе форест; Sons of the Forest|Санс оф зе форест; Project Zomboid|Проджект зомбоид; 7 Days to Die|7 дней чтобы умереть; "
    "Rust|Раст; Green Hell|Грин хелл; Banished|Банишд; Farm Together|Фарм тугезер; Animal Crossing|Энимал кроссинг; Harvest Moon|Харвест мун; Sim City|Симсити; Cities: Skylines|Ситис скайлайнс; "
    "Northgard|Нортгард; Frostpunk 2|Фростпанк 2; Dwarf Fortress|Дварф фортресс; Rimworld|Римворлд; Oxygen Not Included|Оксиджен нот инклудед; Tropico|Тропико; Monster Hunter Wilds|Монстр хантер вайлдс; "
    "Ghost of Tsushima|Призрак Цусимы; Metal Gear Solid V|Метал гир солид 5; Hitman|Хитман; Splinter Cell|Сплинтер селл; Sniper Elite|Снайпер элит; Ghost Recon|Гост рекон; Far Cry|Фар край; "
    "Zelda|Зельда; Pokemon Sword|Покемон Меч; Hunt: Showdown|Хант шоудаун; The Hunter|Зе хантер; Fishing Planet|Фишинг плэнет; Russian Fishing|Русская рыбалка"))

k("cooking_games", "games", "Name a video game where you can cook food", "Назовите видеоигру, в которой можно готовить еду",
  "A real video game where the player cooks: Overcooked, Cooking Mama, Cook, Serve, Delicious!, Stardew Valley, Zelda: Breath of the Wild, Monster Hunter, Minecraft, Terraria, The Sims, Don't Starve, Animal Crossing, Skyrim, Cooking Simulator, Papa's Pizzeria, Diner Dash, PlateUp!, Valheim, Genshin Impact.",
  L("Overcooked|Оверкукд; Cooking Mama|Кукинг мама; Cook, Serve, Delicious!|Кук серв делишес; Stardew Valley|Стардью валли; Zelda: Breath of the Wild|Зельда; Monster Hunter|Монстр хантер; "
    "Minecraft|Майнкрафт; Terraria|Террария; The Sims|Симс; Don't Starve|Донт старв; Animal Crossing|Энимал кроссинг; Skyrim|Скайрим; Cooking Simulator|Кукинг симулятор; "
    "Papa's Pizzeria|Папас пиццерия; Diner Dash|Дайнер дэш; PlateUp!|Плейт ап; Valheim|Вальхейм; Genshin Impact|Геншин; Fallout 4|Фоллаут 4; Red Dead Redemption 2|Ред дед 2; "
    "Final Fantasy XV|Файнал фэнтези 15; Persona 5|Персона 5; Yakuza|Якудза; Kingdom Come|Кингдом кам; Subnautica|Сабнатика; The Forest|Зе форест; Raft|Рафт; Green Hell|Грин хелл; "
    "Project Zomboid|Проджект зомбоид; 7 Days to Die|7 дней чтобы умереть; Rust|Раст; ARK|Арк; Palworld|Палворлд; Disney Dreamlight Valley|Дисней дримлайт валли; Spiritfarer|Спиритфарер; "
    "Venba|Венба; Cooking Fever|Кукинг фивер; Chef Life|Шеф лайф; Kitchen Chaos|Китчен хаос; Good Pizza, Great Pizza|Гуд пицца грейт пицца; Battle Chef Brigade|Батл шеф бригейд; "
    "Ratatouille game|Рататуй игра; Hell's Kitchen game|Адская кухня игра; Cake Mania|Кейк мания; Burger Shop|Бургер шоп; Food Truck Simulator|Фудтрак симулятор; Restaurant Empire|Ресторан империя; "
    "Recettear|Рекеттир; Rune Factory|Руна фэктори; Harvest Moon|Харвест мун; My Time at Portia|Май тайм эт портия; Coral Island|Корал айленд; Dave the Diver|Дейв дайвер;  "
    "Wobbly Life|Воббли лайф;  Sims 4 Cooking|Симс 4 кухня; Cooking Dash|Кукинг дэш; Hay Day|Хэй дэй; Township|Тауншип"))

k("procedural_games", "games", "Name a video game with procedurally generated levels", "Назовите видеоигру с процедурно генерируемыми уровнями",
  "A real video game whose levels or worlds are procedurally generated: Minecraft, Terraria, No Man's Sky, Spelunky, The Binding of Isaac, Hades (rooms), Dead Cells, Diablo, Rogue Legacy, Enter the Gungeon, Don't Starve, Valheim, Deep Rock Galactic, Risk of Rain, Slay the Spire, FTL, Lethal Company, Hades II, Noita.",
  L("Minecraft|Майнкрафт; Terraria|Террария; No Man's Sky|Ноу мэнс скай; Spelunky|Спеланки; The Binding of Isaac|Байндинг оф айзек; Hades|Хейдс; Dead Cells|Дед селлс; Diablo|Диабло; "
    "Rogue Legacy|Рог легаси; Enter the Gungeon|Энтер зе ганжен; Don't Starve|Донт старв; Valheim|Вальхейм; Deep Rock Galactic|Дип рок галактик; Risk of Rain|Риск оф рейн; Slay the Spire|Слэй зе спайр; "
    "FTL|ФТЛ; Lethal Company|Летал компани; Hades II|Хейдс 2; Noita|Нойта; Rogue|Рог; NetHack|Нетхак; Dwarf Fortress|Дварф фортресс; Rimworld|Римворлд; Starbound|Старбаунд; "
    "Path of Exile|Путь изгнания; Torchlight|Торчлайт; Borderlands|Бордерлендс; Darkest Dungeon|Даркест данжен; Into the Breach|Инту зе брич; Returnal|Ретурнал; Vampire Survivors|Вампир сурвайворс; "
    "Brotato|Бротато; Balatro|Балатро;  Loop Hero|Луп херо; Soul Knight|Соул найт; Nuclear Throne|Нуклеар трон; Cult of the Lamb|Культ ягнёнка; Moonlighter|Мунлайтер; "
    "Darkwood|Дарквуд; 7 Days to Die|7 дней чтобы умереть; Space Engineers|Космические инженеры; Elite Dangerous|Элит дейнджерос; Spore|Спор; Civilization|Цивилизация; Stellaris|Стелларис; "
    "Factorio|Факторио;   Phasmophobia|Фазмофобия; Repo|Репо; Content Warning|Контент ворнинг; Diablo IV|Диабло 4;  "
    "Caves of Qud|Кейвс оф куд; Tales of Maj'Eyal|Тейлс оф маджеял; Crypt of the NecroDancer|Крипт оф некроденсер; Monster Train|Монстр трейн; Hades game|Аид игра; Wizard of Legend|Визард оф легенд"))

k("big_game_franchises", "games", "Name a game franchise with more than five standalone games", "Назовите игровую франшизу, в которой больше пяти самостоятельных игр",
  "A real video game franchise with more than five standalone games: Super Mario, Zelda, Pokémon, Final Fantasy, Call of Duty, Assassin's Creed, Grand Theft Auto, Need for Speed, FIFA (EA Sports FC), Resident Evil, Sonic, Tomb Raider, Mortal Kombat, Street Fighter, The Sims (4 main + spin-offs), Far Cry, Battlefield, Metal Gear, Halo, Total War.",
  L("Super Mario|Супер Марио|марио; The Legend of Zelda|Зельда; Pokémon|Покемон; Final Fantasy|Файнал фэнтези; Call of Duty|Колда|call of duty; Assassin's Creed|Ассасинс крид; "
    "Grand Theft Auto|Гта; Need for Speed|Нфс|need for speed; FIFA|Фифа; Resident Evil|Резидент ивел; Sonic|Соник; Tomb Raider|Томб райдер; Mortal Kombat|Мортал комбат; Street Fighter|Стрит файтер; "
    "The Sims|Симс; Far Cry|Фар край; Battlefield|Батлфилд; Metal Gear|Метал гир; Halo|Хало; Total War|Тотал вар; Tekken|Теккен; Dragon Quest|Драгон квест; Kingdom Hearts|Кингдом хартс; "
    "Mega Man|Мегамен; Castlevania|Кастлвания; Metroid|Метроид; Kirby|Кирби; Donkey Kong|Донки конг; Mario Kart|Марио карт; Crash Bandicoot|Крэш бандикут; Spyro|Спайро; Ratchet & Clank|Рэтчет и Кланк; "
    "Tom Clancy's|Том Клэнси; Splinter Cell|Сплинтер селл; Ghost Recon|Гост рекон; Hitman|Хитман; Fallout|Фоллаут; The Elder Scrolls|Древние свитки|тес; Civilization|Цивилизация; "
    "Heroes of Might and Magic|Герои меча и магии; Age of Empires|Эпоха империй; Warcraft|Варкрафт; Diablo|Диабло; Silent Hill|Сайлент хилл; Devil May Cry|Дьявол может плакать; "
    "Yakuza|Якудза; Persona|Персона; Fire Emblem|Файр эмблем; Prince of Persia|Принц Персии; Rayman|Рэйман; Just Dance|Джаст дэнс; Guitar Hero|Гитар херо; Madden|Мэдден; NBA 2K|Нба 2к; "
    "Gran Turismo|Гран туризмо; Forza|Форза; Dirt|Дёрт; Mafia|Мафия; Saints Row|Сейнтс роу; Lego games|Лего игры; Star Wars games|Звёздные войны игры; Batman Arkham|Бэтмен Аркхем; "
    "Harry Potter games|Гарри Поттер игры; Stalker|Сталкер; Metro|Метро; Doom|Дум; Quake|Квейк; Wolfenstein|Вольфенштейн; Half-Life|Халф лайф; Counter-Strike|Контра; Worms|Вормс; "
    "Lemmings|Лемминги; Tetris|Тетрис; Pac-Man|Пакман; Space Rangers|Космические рейнджеры; Dark Souls|Дарк соулс; Monster Hunter|Монстр хантер; Dynasty Warriors|Династи ворриорс; Kingdom Rush|Кингдом раш"),
  "Minecraft/Майнкрафт/Elden Ring/Элден ринг/Among Us/Амонг ас/Portal/Портал")

k("gravity_games", "games", "Name a video game where you can change gravity", "Назовите видеоигру, в которой можно менять гравитацию",
  "A real video game with gravity manipulation: Gravity Rush, VVVVVV, Super Mario Galaxy, but momentum), Prey (2006), Control, Half-Life 2 (gravity gun), Dead Space (zero-G), Gravity Circuit, Antichamber, Gravitar, Echo, Outer Wilds, Psychonauts, Inside, The Bridge, Fez (rotation).",
  L("Gravity Rush|Гравити раш; VVVVVV|Вввввв; Super Mario Galaxy|Супер Марио Гэлакси; Prey|Прей; Control|Контрол; Half-Life 2|Халф лайф 2|гравипушка; Dead Space|Дед спейс; "
    "Gravity Circuit|Гравити серкит; Antichamber|Античамбер; Gravitar|Гравитар; Outer Wilds|Аутер вайлдс; Psychonauts|Психонавты; The Bridge|Зе бридж; Fez|Фез; Portal 2|Портал 2; "
    "Starfield|Старфилд; Lone Echo|Лон эхо; Boundary|Баундари; Kerbal Space Program|Кербал спейс програм; Astroneer|Астронир; Space Engineers|Космические инженеры; Gravity Ghost|Гравити гоуст; "
    "Shift|Шифт; Super Mario Galaxy 2|Супер Марио Гэлакси 2; Ratchet & Clank|Рэтчет и Кланк; Metroid Prime|Метроид прайм; Mass Effect|Масс эффект;   "
    "Superliminal|Суперлиминал; Manifold Garden|Манифолд гарден;  And Yet It Moves|Энд ет ит мувс; Gravity Duck|Гравити дак; Gravity Guy|Гравити гай;  "
    "  Bioshock Infinite|Биошок инфинит;      "
    "Gravity Bone|Гравити боун; Dead Space 2|Дед спейс 2; Dead Space 3|Дед спейс 3;  Garry's Mod|Гаррис мод;  Astro Bot|Астро бот"))

k("death_mechanic_games", "games", "Name a video game where character death is part of the core mechanic", "Назовите видеоигру, в которой смерть персонажа часть основной механики",
  "A real game where dying is built into the main gameplay loop (roguelikes, souls-likes, death-loop games): Dark Souls, Hades, Returnal, Deathloop, The Binding of Isaac, Spelunky, Dead Cells, Rogue Legacy, Celeste (respawn), Super Meat Boy, Sekiro (resurrection), Elden Ring, Bloodborne, Death Stranding (Beaches), Outer Wilds (time loop), Darkest Dungeon.",
  L("Dark Souls|Дарк соулс; Hades|Хейдс; Returnal|Ретурнал; Deathloop|Детлуп; The Binding of Isaac|Байндинг оф айзек; Spelunky|Спеланки; Dead Cells|Дед селлс; Rogue Legacy|Рог легаси; "
    "Celeste|Селеста; Super Meat Boy|Супер мит бой; Sekiro|Секиро; Elden Ring|Элден ринг; Bloodborne|Бладборн; Death Stranding|Дэс стрэндинг; Outer Wilds|Аутер вайлдс; Darkest Dungeon|Даркест данжен; "
    "Slay the Spire|Слэй зе спайр; Enter the Gungeon|Энтер зе ганжен; Risk of Rain|Риск оф рейн; FTL|ФТЛ; Noita|Нойта; Hollow Knight|Холлоу найт; Hotline Miami|Хотлайн майами; "
    "Cuphead|Капхед; I Wanna Be the Guy|Ай ванна би зе гай; Getting Over It|Геттинг овер ит; Prey: Mooncrash|Прей Мункраш; 12 Minutes|12 минут; Loop Hero|Луп херо; Vampire Survivors|Вампир сурвайворс; "
    "Cult of the Lamb|Культ ягнёнка; Hades II|Хейдс 2; Nioh|Нио; Lies of P|Лайс оф пи; Demon's Souls|Демонс соулс; Lords of the Fallen|Лордс оф зе фоллен; Remnant|Ремнант; Salt and Sanctuary|Солт энд санктуари; "
    "Blasphemous|Бласфемоус; Shadow of Mordor|Тени Мордора; Middle-earth: Shadow of War|Средиземье Тени войны; Minecraft Hardcore|Хардкор Майнкрафт; Don't Starve|Донт старв; DayZ|Дейзи; "
    "Escape from Tarkov|Тарков; Hunt: Showdown|Хант шоудаун; Rust|Раст; XCOM|Икском; Fire Emblem|Файр эмблем; Darkwood|Дарквуд; Limbo|Лимбо; Inside|Инсайд; Little Nightmares|Маленькие кошмары; "
    "Braid|Брейд; Prince of Persia: Sands of Time|Принц Персии Пески времени;  Undertale|Андертейл; Doki Doki Literature Club|Доки доки"))

# ---------- 8. Professions ----------
k("night_shift_professions", "professions", "Name a profession whose workers regularly work at night", "Назовите профессию, представители которой регулярно работают ночью",
  "A profession with regular night work: night guard, watchman, nurse, doctor on duty, firefighter, police officer, taxi driver, baker, DJ, bartender, pilot, air traffic controller, train driver, astronomer, security guard, emergency doctor (ambulance), radio host, hotel receptionist, truck driver, cleaner, croupier.",
  L("Night guard|Охранник|ночной охранник; Watchman|Сторож; Nurse|Медсестра; Doctor on duty|Дежурный врач; Firefighter|Пожарный; Police officer|Полицейский; Taxi driver|Таксист; Baker|Пекарь; "
    "DJ|Диджей; Bartender|Бармен; Pilot|Пилот; Air traffic controller|Авиадиспетчер|диспетчер; Train driver|Машинист; Astronomer|Астроном; Ambulance doctor|Врач скорой помощи|фельдшер; "
    "Radio host|Радиоведущий; Receptionist|Администратор гостиницы|портье; Truck driver|Дальнобойщик; Cleaner|Уборщица; Croupier|Крупье; Paramedic|Фельдшер скорой; Security guard|Секьюрити; "
    "Stripper|Стриптизёрша; Waiter|Официант; Cook|Повар ночного ресторана; Dispatcher|Диспетчер такси; Call center operator|Оператор колл центра; Rescue worker|Спасатель; Military|Военный; "
    "Soldier on guard|Часовой; Sailor|Моряк; Lighthouse keeper|Смотритель маяка; Miner|Шахтёр; Factory worker|Рабочий ночной смены; Steelworker|Металлург; Power plant operator|Оператор электростанции; "
    "Programmer|Программист; Streamer|Стример; Journalist|Журналист; News editor|Редактор новостей; Printer|Печатник; Courier|Курьер; Delivery driver|Доставщик; Gas station attendant|Заправщик; "
    "Pharmacist|Фармацевт круглосуточной аптеки; Midwife|Акушерка; Anesthesiologist|Анестезиолог; Surgeon|Хирург; Vet on duty|Дежурный ветеринар;  "
    "Musician|Музыкант; Club promoter|Промоутер клуба; Bouncer|Вышибала|фейсконтроль; Casino dealer|Дилер в казино; Road worker|Дорожный рабочий; Metro repairman|Ремонтник метро; Snow plow driver|Водитель снегоуборщика"))

k("ship_professions", "professions", "Name a profession you can find aboard a ship", "Назовите профессию, которую можно встретить на борту морского судна",
  "A job aboard a sea vessel: captain, sailor, boatswain, navigator, cook (ship's cook), mechanic, engineer, radio operator, ship's doctor, steward, first mate, helmsman, deckhand, cabin boy, purser, electrician, chief engineer, lookout, waiter on a cruise ship, entertainer, diver.",
  L("Captain|Капитан; Sailor|Матрос|моряк; Boatswain|Боцман; Navigator|Штурман; Ship's cook|Кок; Mechanic|Моторист|механик; Engineer|Инженер; Radio operator|Радист; Ship's doctor|Судовой врач; "
    "Steward|Стюард; First mate|Старпом|старший помощник; Helmsman|Рулевой; Deckhand|Палубный матрос; Cabin boy|Юнга; Purser|Казначей; Electrician|Электрик; Chief engineer|Стармех|старший механик; "
    "Lookout|Вперёдсмотрящий; Waiter|Официант; Entertainer|Аниматор; Diver|Водолаз; Pilot|Лоцман; Signalman|Сигнальщик; Gunner|Артиллерист; Marine|Морской пехотинец; Admiral|Адмирал; "
    "Midshipman|Мичман; Officer|Офицер; Second mate|Второй помощник; Third mate|Третий помощник; Fisherman|Рыбак; Whaler|Китобой; Stoker|Кочегар; Carpenter|Плотник; Sailmaker|Парусный мастер; "
    "Chaplain|Священник; Nurse|Медсестра; Bartender|Бармен; Hotel manager|Директор круиза; Housekeeper|Горничная; Musician|Музыкант; Hairdresser|Парикмахер; Security|Охрана; Oceanographer|Океанолог; "
    "Biologist|Морской биолог; Crane operator|Крановщик; Welder|Сварщик; Cleaner|Уборщик; Pirate|Пират; Quartermaster|Квартирмейстер; Coxswain|Старшина шлюпки; Ship's surgeon|Судовой хирург; Cartographer|Картограф"))

k("color_sensitive_professions", "professions", "Name a profession that requires telling shades of colour apart", "Назовите профессию, в которой нужно различать оттенки цветов",
  "A profession that needs good colour discrimination: artist, designer, makeup artist, hairdresser (colourist), painter, printer, photographer, florist, textile dyer, interior designer, pilot, electrician (wire colours), dentist (tooth shade), jeweller, gemologist, fashion designer, art restorer, decorator, chemist, video colorist.",
  L("Artist|Художник; Designer|Дизайнер; Makeup artist|Визажист; Colourist|Колорист|парикмахер колорист; Painter|Маляр; Printer|Печатник; Photographer|Фотограф; Florist|Флорист; "
    "Textile dyer|Красильщик; Interior designer|Дизайнер интерьера; Pilot|Пилот; Electrician|Электрик; Dentist|Стоматолог; Jeweller|Ювелир; Gemologist|Геммолог; Fashion designer|Модельер; "
    "Restorer|Реставратор; Decorator|Декоратор; Chemist|Химик; Video colorist|Цветокорректор; Illustrator|Иллюстратор; Animator|Аниматор; Web designer|Веб дизайнер; Tattoo artist|Тату мастер; "
    "Nail artist|Мастер маникюра; Hairdresser|Парикмахер; Stylist|Стилист; Art director|Арт директор; Cinematographer|Оператор; Camera operator|Кинооператор; Graphic designer|Графический дизайнер; "
    "Landscape designer|Ландшафтный дизайнер; Pastry chef|Кондитер;  Doctor|Врач; Dermatologist|Дерматолог; Laboratory assistant|Лаборант; Train driver|Машинист; "
    "Sailor|Моряк; Air traffic controller|Авиадиспетчер;  Car painter|Автомаляр;  Tiler|Плиточник; Carpet maker|Ковровщица; Weaver|Ткачиха; "
    "Seamstress|Швея; Paint mixer|Колеровщик; Quality inspector|Контролёр качества; Geologist|Геолог; Mineralogist|Минералог; Iconographer|Иконописец; Stained glass artist|Витражист; Potter|Гончар"))

k("precious_metal_professions", "professions", "Name a profession that works with precious metals", "Назовите профессию, связанную с драгоценными металлами",
  "A profession that works with gold, silver or platinum: jeweller, goldsmith, silversmith, engraver, assayer, gemologist, minter (coin maker), metallurgist, refiner, watchmaker, gold miner, prospector, appraiser, pawnbroker, dentist (gold crowns), electronics engineer, numismatist, filigree master, enameller, banker (bullion).",
  L("Jeweller|Ювелир; Goldsmith|Золотых дел мастер; Silversmith|Серебряных дел мастер; Engraver|Гравёр; Assayer|Пробирщик|пробирер; Gemologist|Геммолог; Minter|Монетчик|чеканщик; "
    "Metallurgist|Металлург; Refiner|Аффинажник; Watchmaker|Часовщик; Gold miner|Золотодобытчик|старатель; Prospector|Старатель; Appraiser|Оценщик; Pawnbroker|Ломбардщик; Dentist|Стоматолог; "
    "Dental technician|Зубной техник; Electronics engineer|Инженер электроник; Numismatist|Нумизмат; Filigree master|Филигранщик; Enameller|Эмальер; Banker|Банкир; Caster|Литейщик; "
    "Chaser|Чеканщик; Polisher|Полировщик; Setter|Закрепщик камней; Jewelry designer|Дизайнер украшений; Antique dealer|Антиквар; Restorer|Реставратор; Bullion trader|Трейдер драгметаллов; "
    "  Gilder|Позолотчик;  Silver plater|Гальваник; Chemist|Химик; Geologist|Геолог; Miner|Шахтёр; Platinum worker|Платинщик; "
    "Coin designer|Медальер; Medalist|Медальер монет; Sculptor|Скульптор; Artisan|Ремесленник; Fabergé master|Мастер Фаберже; Watch repairer|Ремонтник часов"))

k("public_performer_professions", "professions", "Name a profession whose members often perform in public", "Назовите профессию, представители которой часто выступают перед публикой",
  "A profession that regularly performs before an audience: actor, singer, musician, dancer, comedian, stand-up comic, magician, circus artist, clown, TV host, lecturer, teacher, politician, priest, athlete, DJ, conductor, speaker, presenter, blogger (live), juggler, acrobat, opera singer, ballerina.",
  L("Actor|Актёр; Singer|Певец|певица; Musician|Музыкант; Dancer|Танцор; Comedian|Комик; Stand-up comedian|Стендап комик; Magician|Фокусник|иллюзионист; Circus artist|Артист цирка; "
    "Clown|Клоун; TV host|Телеведущий; Lecturer|Лектор; Teacher|Учитель; Politician|Политик; Priest|Священник; Athlete|Спортсмен; DJ|Диджей; Conductor|Дирижёр; Speaker|Спикер; "
    "Presenter|Ведущий; Blogger|Блогер; Juggler|Жонглёр; Acrobat|Акробат; Opera singer|Оперный певец; Ballerina|Балерина; Rapper|Рэпер; Animator|Аниматор; Toastmaster|Тамада; "
    "Announcer|Диктор; Commentator|Комментатор;  Professor|Профессор; Preacher|Проповедник; Guide|Экскурсовод|гид; Auctioneer|Аукционист; Lawyer|Адвокат;  "
    "Model|Модель; Mime|Мим; Puppeteer|Кукольник; Ventriloquist|Чревовещатель; Hypnotist|Гипнотизёр; Street performer|Уличный артист; Busker|Уличный музыкант; Choir singer|Хорист; "
    "Pianist|Пианист; Violinist|Скрипач; Figure skater|Фигурист; Gymnast|Гимнаст; Wrestler|Рестлер; Tamer|Дрессировщик; Stuntman|Каскадёр; Poet|Поэт; Reader|Чтец; Motivational speaker|Мотивационный спикер"))

k("microscope_professions", "professions", "Name a profession that uses a microscope", "Назовите профессию, в которой используют микроскоп",
  "A profession whose work involves using a microscope: biologist, microbiologist, lab technician, pathologist, doctor, forensic expert, chemist, geologist, gemologist, watchmaker, jeweller, dentist (dental microscope), microsurgeon, virologist, botanist, entomologist, materials scientist, electronics engineer, histologist, cytologist.",
  L("Biologist|Биолог; Microbiologist|Микробиолог; Lab technician|Лаборант; Pathologist|Патологоанатом; Doctor|Врач; Forensic expert|Криминалист|судмедэксперт; Chemist|Химик; Geologist|Геолог; "
    "Gemologist|Геммолог; Watchmaker|Часовщик; Jeweller|Ювелир; Dentist|Стоматолог; Microsurgeon|Микрохирург; Virologist|Вирусолог; Botanist|Ботаник; Entomologist|Энтомолог; "
    "Materials scientist|Материаловед; Electronics engineer|Электронщик; Histologist|Гистолог; Cytologist|Цитолог; Geneticist|Генетик; Immunologist|Иммунолог; Bacteriologist|Бактериолог; "
    "Parasitologist|Паразитолог; Hematologist|Гематолог; Ophthalmologist|Офтальмолог; Neurosurgeon|Нейрохирург; Embryologist|Эмбриолог; Mineralogist|Минералог; Paleontologist|Палеонтолог; "
    "Archaeologist|Археолог; Restorer|Реставратор; Scientist|Учёный; Researcher|Исследователь;  Veterinarian|Ветеринар;  Physicist|Физик; "
    "Nanotechnologist|Нанотехнолог; Chip engineer|Инженер микроэлектроники; Quality inspector|Контролёр ОТК; Metallurgist|Металлург; Ecologist|Эколог; Oceanographer|Океанолог; Hydrobiologist|Гидробиолог; "
    "Laboratory doctor|Врач лаборант; Dermatologist|Дерматолог; Andrologist|Андролог; Engraver|Гравёр; Micro-miniaturist|Микроминиатюрист"))

k("vehicle_design_professions", "professions", "Name a profession related to designing vehicles", "Назовите профессию, связанную с проектированием транспорта",
  "A profession involved in designing vehicles: automotive engineer, car designer, aircraft designer, aeronautical engineer, shipbuilder (naval architect), rocket engineer, aerodynamicist, industrial designer, mechanical engineer, CAD designer, test engineer, railway engineer, motorcycle designer, chief designer.",
  L("Automotive engineer|Автомобильный инженер; Car designer|Автодизайнер|дизайнер автомобилей; Aircraft designer|Авиаконструктор; Aeronautical engineer|Авиаинженер; Naval architect|Кораблестроитель|корабел; "
    "Rocket engineer|Ракетостроитель; Aerodynamicist|Аэродинамик; Industrial designer|Промышленный дизайнер; Mechanical engineer|Инженер механик; CAD designer|Конструктор|инженер конструктор; "
    "Test engineer|Инженер испытатель; Railway engineer|Инженер путей сообщения; Motorcycle designer|Дизайнер мотоциклов; Chief designer|Главный конструктор; Engineer|Инженер; Draftsman|Чертёжник; "
    "Body designer|Дизайнер кузова; Interior designer|Дизайнер салона; Powertrain engineer|Моторист двигателестроитель; Engine designer|Двигателист; Spacecraft designer|Конструктор космических кораблей; "
    "Shipwright|Судостроитель; Yacht designer|Яхтенный дизайнер; Bicycle designer|Дизайнер велосипедов; Electrical engineer|Электроинженер; Software engineer|Программист автопилота; "
    "Electronics engineer|Электронщик; Materials engineer|Материаловед; Safety engineer|Инженер по безопасности; Crash test engineer|Инженер краш тестов; Modeler|Макетчик|пластилинщик; "
    "Clay modeler|Скульптор моделей; Wind tunnel engineer|Инженер аэротрубы; F1 engineer|Инженер Формулы 1; Race engineer|Гоночный инженер; Tuner|Тюнер; Drone designer|Конструктор дронов; "
    "Tank designer|Конструктор танков; Tractor designer|Конструктор тракторов; Bus designer|Конструктор автобусов; Locomotive designer|Конструктор локомотивов; Inventor|Изобретатель"))

k("zoo_professions", "professions", "Name a profession you can find in a zoo", "Назовите профессию, которую можно встретить в зоопарке",
  "A job at a zoo: zookeeper, veterinarian, zoologist, animal trainer, tour guide, cashier, cleaner, security guard, director, nutritionist, biologist, ornithologist, herpetologist, aquarist, groomer, photographer, educator, gardener, curator, researcher, ticket seller, ice cream seller.",
  L("Zookeeper|Смотритель|смотритель зоопарка; Veterinarian|Ветеринар; Zoologist|Зоолог; Animal trainer|Дрессировщик; Tour guide|Экскурсовод; Cashier|Кассир; Cleaner|Уборщик; Security guard|Охранник; "
    "Director|Директор; Nutritionist|Диетолог животных; Biologist|Биолог; Ornithologist|Орнитолог; Herpetologist|Герпетолог; Aquarist|Аквариумист; Groomer|Грумер; Photographer|Фотограф; "
    "Educator|Педагог; Gardener|Садовник; Curator|Куратор; Researcher|Исследователь; Ticket seller|Билетёр; Ice cream seller|Продавец мороженого; Animal technician|Зоотехник; Vet nurse|Ветеринарная медсестра; "
    "Primatologist|Приматолог; Entomologist|Энтомолог; Ichthyologist|Ихтиолог; Mammalogist|Териолог; Breeder|Селекционер; Feeder|Кормач; Cook|Повар для животных; Driver|Водитель; Electrician|Электрик; "
    "Plumber|Сантехник; Builder|Строитель вольеров; Designer|Дизайнер вольеров; Volunteer|Волонтёр; Marketing manager|Маркетолог; Accountant|Бухгалтер; Animator|Аниматор; Souvenir seller|Продавец сувениров; "
    "Waiter|Официант кафе; Dolphin trainer|Тренер дельфинов; Bird keeper|Птичник; Elephant keeper|Смотритель слонов|махаут; Reptile keeper|Террариумист; Lion tamer|Укротитель; Ranger|Рейнджер; Scientist|Учёный"))

k("restorer_professions", "professions", "Name a profession that restores old objects", "Назовите профессию, которая занимается восстановлением старинных предметов",
  "A profession that restores old or antique objects: restorer, art restorer, furniture restorer, conservator, bookbinder, watchmaker, antique dealer, icon restorer, jeweller, upholsterer, luthier (violin maker), stained glass restorer, architect-restorer, car restorer, numismatist, archivist, carpenter, potter.",
  L("Restorer|Реставратор; Art restorer|Реставратор картин; Furniture restorer|Реставратор мебели; Conservator|Консерватор|хранитель; Bookbinder|Переплётчик; Watchmaker|Часовщик; Antique dealer|Антиквар; "
    "Icon restorer|Реставратор икон; Jeweller|Ювелир; Upholsterer|Обивщик мебели; Luthier|Скрипичный мастер; Stained glass restorer|Реставратор витражей; Architect-restorer|Архитектор реставратор; "
    "Car restorer|Реставратор автомобилей; Numismatist|Нумизмат; Archivist|Архивист; Carpenter|Плотник|столяр; Potter|Гончар; Cabinetmaker|Краснодеревщик; Gilder|Позолотчик; Sculptor|Скульптор; "
    "Mason|Каменщик; Blacksmith|Кузнец; Tailor|Портной; Seamstress|Швея; Weaver|Ткач; Leather worker|Кожевник; Shoemaker|Сапожник; Clock repairer|Мастер по ремонту часов; Piano tuner|Настройщик пианино; "
    "Organ builder|Органный мастер; Glassblower|Стеклодув; Engraver|Гравёр; Paper conservator|Реставратор бумаги; Textile conservator|Реставратор тканей; Photo restorer|Реставратор фотографий; "
    "Film restorer|Реставратор киноплёнки; Archaeologist|Археолог; Museum worker|Музейный работник; Toy restorer|Реставратор игрушек; Doll repairer|Мастер по куклам; Fabergé expert|Эксперт Фаберже; "
    "Mosaic restorer|Реставратор мозаики; Fresco restorer|Реставратор фресок; Bell maker|Колокольный мастер; Handyman|Мастер на все руки; Repairman|Ремонтник; Coachbuilder|Каретный мастер"))
