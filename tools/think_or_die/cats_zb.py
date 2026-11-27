# THINK OR DIE category content, part ZB (list 8, questions 1-40; duplicates of existing categories skipped).
from cats_a import cat
from cats_k import ru_rule, ru_word


def k(id, group, en, ru, crit, lines, inv="", type="KNOWLEDGE", **kw):
    cat(id, type, group, en, ru, crit, crit, lines, inv, **kw)


def L(s):
    return "\n".join(x.strip() for x in s.strip().split(";") if x.strip())


# ---------- 1. Words ----------
ru_word("words_starting_pere_ru", "Name a Russian word starting with “пере”", "Назовите слово, которое начинается на «ПЕРЕ»", dict(kind="STARTS_WITH", value="пере"))
ru_word("words_yu_and_k_ru", "Name a Russian word with both letters “Ю” and “К”", "Назовите слово, в котором есть и буква «Ю», и буква «К»", dict(kind="CONTAINS_ALL", value="ю|к"))
ru_word("words_three_o_ru", "Name a Russian word with the letter “О” at least three times", "Назовите слово, в котором буква «О» встречается не менее трёх раз", dict(kind="MIN_COUNT_LETTER", value="о", n=3))
ru_word("words_with_tel_ru", "Name a Russian word containing “тель”", "Назовите слово, в котором есть сочетание «ТЕЛЬ»", dict(kind="CONTAINS", value="тель"))

ru_rule("nouns_ending_nik_ru", "vocabulary", "Name a Russian noun ending in “-ник”", "Назовите существительное, которое заканчивается на «ник»",
  "Русское существительное, оканчивающееся на «ник»: чайник, праздник, дневник, учебник, понедельник, холодильник, садовник, лесник, пряник, ошейник, подсолнечник.",
  L("Kettle|Чайник; Holiday|Праздник; Diary|Дневник; Textbook|Учебник; Monday|Понедельник; Fridge|Холодильник; Gardener|Садовник; Forester|Лесник; Gingerbread|Пряник; Collar|Ошейник; "
    "Sunflower|Подсолнечник; Bathhouse|Банник;    Pupil|Ученик; Worker|Работник; Officer|Сотрудник; Assistant|Помощник; Companion|Спутник; "
    "Satellite|Спутник космический; Sinner|Грешник; Saint|Праведник;  Hermit|Отшельник; Rascal|Озорник; Mischief|Проказник; Merry fellow|Шутник; Hunter|Охотник; "
    "  Dog kennel|Собачник;   Picnic|Пикник; Apron|Передник;   Jug|Кувшинник; "
    "Hazel|Орешник; Rosehip|Шиповник; Raspberry bush|Малинник; Birch forest|Березник; Spruce forest|Ельник;   Washbasin|Умывальник; Alarm clock|Будильник; "
    "Pan|Сотейник; Coffee pot|Кофейник; Milk jug|Молочник;  Ladle|Половник; Shoemaker|Сапожник; Carpenter|Плотник;  Mechanic|Механик; "
    "Technician|Техник;  Plumber|Сантехник; Artist|Художник; Partner|Напарник; Accomplice|Сообщник; Rival|Соперник; Hostage|Заложник; Martyr|Мученик; Wizard|Волшебник; "
    "         "
    "Mobile phone|Мобильник;  Toilet|Нужник;   Cedar|Кедровник; Ant hill|Муравейник;  Chicken coop|Курятник; "
    "Barn|Сенник; Calendar|Численник; Prayer book|Молитвенник;  Handbook|Справочник; Phrasebook|Разговорник;   Tutor|Наставник"),
  "", dict(kind="ENDS_WITH", value="ник"))

k("words_starting_with_number_ru", "vocabulary", "Name a word that starts with the name of a number", "Назовите слово, которое начинается с названия числа",
  "A Russian word that begins with a number word: одиночество (один), двор (два no), трёхколёсный (три), сторож (сто), семья (семь), сорока (сорок), пятница (пять), десятка, тысячелетие, миллионер, сороконожка, стоимость, восьмиклассник, девятиэтажка, полтинник.",
  L("Loneliness|Одиночество; Tricycle|Трёхколёсный; Watchman|Сторож; Family|Семья; Magpie|Сорока; Friday|Пятница; Ten|Десятка; Millennium|Тысячелетие; Millionaire|Миллионер; Centipede|Сороконожка; "
    "Cost|Стоимость; Eighth-grader|Восьмиклассник; Nine-storey|Девятиэтажка; Fifty|Полтинник; Single|Одинокий; Lonely|Одиночка; Once|Однажды; Same|Одинаковый; Unanimous|Единогласный; "
    "Unit|Единица; Unity|Единство; Two-faced|Двуличный; Double|Двойной; Twin|Двойня; Duel|Двубой; Doubt|Двоякий; Double-decker|Двухэтажный; Triangle|Треугольник; Third|Треть; "
    "Tram trailer|Трёшка; Seven-league|Семимильный;  Seed|Семечко; Five-star|Пятизвёздочный; Fifth|Пятёрка; Spot|Пятно; Heel|Пятка; Hundred percent|Стопроцентный; "
    "Table|Столик; Capital|Столица; Century|Столетие; Pillar|Столб; Forty|Сороковка; Shirt|Сорочка; Eight|Восьмёрка; Octopus|Восьминог; Ninety|Девяностые; Ten-year|Десятилетие;  "
    "Thousand|Тысячник; Million|Миллионник; Billion|Миллиардер; Quarter|Четвертак; Thursday|Четверг; Quadruped|Четвероногий; Four-wheel|Четырёхколёсный; Six|Шестёрка; Gear|Шестерёнка; "
    "Pole|Шест; Shestakov|Шестиклассник; Seventh|Семиклассник; Twelve|Двенадцатый; Hundredth|Сотка; Weaving|Сотканный; Honeycomb|Соты; Cellular|Сотовый; Centurion|Сотник; Ninefold|Девятый вал"))

ru_rule("nouns_sh_to_a_ru", "vocabulary", "Name a Russian noun that starts with “Ш” and ends with “А”", "Назовите существительное, которое начинается на «Ш» и заканчивается на «А»",
  "Русское существительное, которое начинается на «ш» и оканчивается на «а»: школа, шапка, шуба, шина, шишка, шайба, шахта, шляпа, шпага, штора, шашка, шоколадка, шутка.",
  L("School|Школа; Hat|Шапка; Fur coat|Шуба; Tire|Шина; Cone|Шишка; Puck|Шайба; Mine|Шахта; Hat brim|Шляпа; Rapier|Шпага; Curtain|Штора; Checker|Шашка; Chocolate bar|Шоколадка; Joke|Шутка; "
    "Scale|Шкала; Box|Шкатулка;  Sticker|Шпаргалка;   Shawarma|Шаурма;  Stake|Шпала; Jester|Шутиха; Stitch|Шпилька; "
    "Hairpin|Шпилька для волос; Spy|Шпионка; Lace|Шнуровка; Chain|Шерстинка; Glove|Шерстянка;      "
    "Driver|Шофёрша; Dancer|Шансоньетка; Hat2|Шляпка;  Scale2|Шкура; Skin|Шкура зверя;  Stick|Шпаклёвка; Putty|Шпатлёвка;  "
    "Spur|Шпора; Wolf|Шавка; Pup|Шавочка; Dirt|Шелуха; Husk|Шелуха семечек; Silk|Шелковица; Mulberry|Шелковица дерево; Head|Шевелюра; Hair|Шевелюра пышная;  Saber|Шашка казачья; "
    "Shin|Шина медицинская; Mouse|Шиншилла; Chinchilla|Шиншилла зверёк;  Sausage|Шпикачка; Lard|Шпикачки; Shower|Шторка;    "
    "Hut|Шалашка; Princess|Шахиня; Queen|Шахиня персидская; Pumpkin|Шарлотка; Apple pie|Шарлотка яблочная; Charlotte|Шарлотка пирог;  Shift|Шкурка; Sandpaper|Шкурка наждачная"),
  "", dict(kind="STARTS_ENDS", value="ш|а"))

k("french_loanwords_ru", "vocabulary", "Name a Russian word borrowed from French", "Назовите слово, которое русский язык заимствовал из французского",
  "A Russian word of French origin: пальто, пляж, шофёр, вуаль, бульон, меню, кафе, ресторан, балет, костюм, пюре, омлет, макияж, багаж, гараж, жюри, кино, абажур, бюро, буфет, этаж, шарм, режиссёр, афиша, тротуар, суфле, крем, десерт, батон.",
  L("Coat|Пальто; Beach|Пляж; Driver|Шофёр; Veil|Вуаль; Broth|Бульон; Menu|Меню; Cafe|Кафе; Restaurant|Ресторан; Ballet|Балет; Suit|Костюм; Puree|Пюре; Omelette|Омлет; Makeup|Макияж; "
    "Luggage|Багаж; Garage|Гараж; Jury|Жюри; Cinema|Кино; Lampshade|Абажур; Bureau|Бюро; Buffet|Буфет; Floor|Этаж; Charm|Шарм; Director|Режиссёр; Poster|Афиша; Pavement|Тротуар; Souffle|Суфле; "
    "Cream|Крем; Dessert|Десерт; Loaf|Батон; Bouquet|Букет; Perfume|Парфюм; Mirage|Мираж; Massage|Массаж; Reportage|Репортаж; Balcony|Балкон;  Salon|Салон; Boutique|Бутик; "
    "Blouse|Блузка; Jacket|Жакет; Waistcoat|Жилет; Corset|Корсет; Beret|Берет; Plaid|Плед; Curtain|Портьера; Shutters|Жалюзи; Chandelier|Люстра;  Toilet|Туалет; Bidet|Биде; "
    "Mayonnaise|Майонез; Croissant|Круассан; Baguette|Багет; Eclair|Эклер; Meringue|Безе; Marmalade|Мармелад; Champagne|Шампанское; Cognac|Коньяк; Entrecote|Антрекот; Fillet|Филе; Ragout|Рагу; "
    "Vinaigrette|Винегрет;  Debut|Дебют; Premiere|Премьера; Repertoire|Репертуар; Ensemble|Ансамбль; Etude|Этюд; Portrait|Портрет; Landscape|Пейзаж; Pastel|Пастель; "
    "Sabotage|Саботаж; Espionage|Шпионаж; Bourgeois|Буржуа; Bonjour|Бонжур; Merci|Мерси; Rendezvous|Рандеву; Deja vu|Дежавю;  Avant-garde|Авангард; Elite|Элита; "
    "Lieutenant|Лейтенант; Sergeant|Сержант; Brigade|Бригада; Battalion|Батальон; Garrison|Гарнизон; Parachute|Парашют; Pilot|Пилот; Chef|Шеф; Chauffeur|Шофёр; Crêpe|Креп"))

k("color_and_object_words", "vocabulary", "Name a word that is both a colour and an object", "Назовите слово, которое означает и цвет, и какой то предмет",
  "A word that names both a colour and a thing: оранжевый? no — апельсин no; personal examples: лимонный no; the word itself must be both: персик (colour and fruit), бирюза, изумруд, сирень, малина, вишня, лаванда, шоколад, коралл, слива, бордо (wine), фуксия, оливка, янтарь, горчица, мята, лосось, кофе, морская волна, золото, серебро, бронза, индиго, лайм.",
  L("Peach|Персик; Turquoise|Бирюза; Emerald|Изумруд; Lilac|Сирень; Raspberry|Малина|малиновый; Cherry|Вишня|вишнёвый; Lavender|Лаванда; Chocolate|Шоколад|шоколадный; Coral|Коралл|коралловый; "
    "Plum|Слива; Bordeaux|Бордо; Fuchsia|Фуксия; Olive|Оливка|оливковый; Amber|Янтарь|янтарный; Mustard|Горчица|горчичный; Mint|Мята|мятный; Salmon|Лосось|лососевый; Coffee|Кофе|кофейный; "
    "Gold|Золото|золотой; Silver|Серебро|серебряный; Bronze|Бронза|бронзовый; Indigo|Индиго; Lime|Лайм; Lemon|Лимон|лимонный; Orange|Апельсин|оранжевый; Ruby|Рубин|рубиновый; Sapphire|Сапфир; "
    "Cream|Крем|кремовый; Sand|Песок|песочный; Ash|Пепел|пепельный; Ivory|Слоновая кость; Pearl|Жемчуг|жемчужный; Copper|Медь|медный; Wine|Вино|винный; Brick|Кирпич|кирпичный; Cornflower|Василёк|васильковый; "
    "Sky|Небо|небесный; Sea wave|Морская волна; Steel|Сталь|стальной; Graphite|Графит|графитовый; Coal|Уголь|угольный; Snow|Снег|белоснежный; Milk|Молоко|молочный; Honey|Мёд|медовый; "
    "Caramel|Карамель|карамельный; Champagne|Шампанское; Wheat|Пшеница|пшеничный; Straw|Солома|соломенный; Grass|Трава|травяной; Pistachio|Фисташка|фисташковый; Apricot|Абрикос|абрикосовый; "
    "Pumpkin|Тыква|тыквенный; Tomato|Томат|томатный; Carrot|Морковь|морковный; Beetroot|Свёкла|свекольный; Violet|Фиалка|фиолетовый; Rose|Роза|розовый; Cherry blossom|Сакура; Moss|Мох|моховой; "
    "Pine|Хвоя|хвойный; Tobacco|Табак|табачный; Rust|Ржавчина|ржавый; Blood|Кровь|кровавый; Fire|Огонь|огненный;  Denim|Джинса|джинсовый; Khaki|Хаки"))

# ---------- 2. Fashion ----------
k("hooded_clothing", "everyday", "Name a piece of clothing that can have a hood", "Назовите предмет одежды, у которого может быть капюшон",
  "A garment that may have a hood: hoodie, jacket, parka, down jacket, raincoat, anorak, sweatshirt, coat, cloak, poncho, fur coat, windbreaker, bathrobe, cardigan, fleece, ski jacket, overalls, kids' snowsuit, sports jacket, monk robe, burnous, alaska (puffer).",
  L("Hoodie|Худи|толстовка; Jacket|Куртка; Parka|Парка; Down jacket|Пуховик; Raincoat|Дождевик|плащ; Anorak|Анорак; Sweatshirt|Свитшот; Coat|Пальто; Cloak|Плащ накидка; Poncho|Пончо; "
    "Fur coat|Шуба; Windbreaker|Ветровка; Bathrobe|Халат; Cardigan|Кардиган; Fleece|Флиска; Ski jacket|Горнолыжная куртка; Overalls|Комбинезон; Snowsuit|Зимний комбинезон; Tracksuit|Спортивный костюм; "
    "Monk robe|Ряса; Burnous|Бурнус; Alaska|Аляска;    Sweater|Свитер; Pullover|Пуловер; Vest|Жилет; Fur vest|Меховой жилет; Trench coat|Тренч; "
    "Duffel coat|Дафлкот; Mantle|Мантия; Cape|Пелерина;  Burqa|Паранджа; Shuba|Дублёнка; Sheepskin coat|Дублёнка овчинная; Padded jacket|Телогрейка; Fishing suit|Костюм рыбака; "
    "Camouflage|Камуфляж; Hazmat suit|Костюм химзащиты; Wetsuit|Гидрокостюм; Pajamas|Пижама; Onesie|Кигуруми|комбинезон пижама; Towel poncho|Пляжное пончо; Baby towel|Детское полотенце с капюшоном; "
    "Romper|Слип с капюшоном; Dressing gown|Банный халат; Sauna robe|Халат для бани; Raincape|Плащ палатка; Cycling jacket|Велокуртка; Softshell|Софтшелл; Hardshell|Мембранная куртка; Djellaba|Джеллаба"))

k("laceless_shoes", "everyday", "Name a type of footwear without laces", "Назовите вид обуви без шнурков",
  "Footwear that has no laces: slippers, flip-flops, sandals, loafers, moccasins, slip-ons, boots with zip, felt boots (valenki), rubber boots, ballet flats, Crocs, mules, clogs, high heels (pumps), espadrilles, ugg boots, Chelsea boots, cowboy boots, slides.",
  L("Slippers|Тапочки|тапки; Flip-flops|Шлёпанцы|вьетнамки; Sandals|Сандалии; Loafers|Лоферы; Moccasins|Мокасины; Slip-ons|Слипоны; Zip boots|Сапоги на молнии|сапоги; Valenki|Валенки; "
    "Rubber boots|Резиновые сапоги; Ballet flats|Балетки; Crocs|Кроксы; Mules|Мюли; Clogs|Сабо|клоги; Pumps|Туфли лодочки|туфли; Espadrilles|Эспадрильи; Ugg boots|Угги; Chelsea boots|Челси; "
    "Cowboy boots|Казаки|ковбойские сапоги; Slides|Слайды; Galoshes|Калоши; Bast shoes|Лапти; Ugg slippers|Домашние угги; Wedges|Танкетки; Stilettos|Шпильки; Platform shoes|Туфли на платформе; "
    "Jackboots|Кирзачи|кирзовые сапоги; Felt boots|Бурки; Dutch clogs|Деревянные башмаки; Geta|Гэта; Zori|Дзори; Chopines|Чопины; Wellies|Веллингтоны; Waders|Заброды|болотные сапоги; "
    "Ski boots|Горнолыжные ботинки;  Velcro sneakers|Кроссовки на липучке; Velcro shoes|Ботинки на липучках; Pointe shoes|Пуанты; Swimming shoes|Аквашузы|коралловые тапочки; "
    "Hospital slippers|Медицинские сабо; Birkenstock|Биркенштоки; Mary Janes|Мэри Джейн; Thigh-high boots|Ботфорты; Ankle boots|Ботильоны; Pantoufles|Пантолеты;  Moon boots|Луноходы|дутики"))

k("wrist_accessories", "everyday", "Name an accessory usually worn on the wrist", "Назовите аксессуар, который обычно носят на запястье",
  "An accessory worn on the wrist: watch, smartwatch, bracelet, fitness tracker, friendship bracelet, bangle, wristband, charm bracelet, cuff, rosary bracelet, rubber bracelet, red thread, hair tie, sweatband, medical ID bracelet, hospital band, festival wristband.",
  L("Watch|Часы|наручные часы; Smartwatch|Умные часы|смарт часы; Bracelet|Браслет; Fitness tracker|Фитнес браслет; Friendship bracelet|Фенечка; Bangle|Браслет обруч; Wristband|Напульсник; "
    "Charm bracelet|Браслет с шармами|пандора; Cuff|Браслет манжета; Rosary bracelet|Чётки на руку; Rubber bracelet|Силиконовый браслет; Red thread|Красная нитка; Hair tie|Резинка для волос; "
    "Sweatband|Повязка от пота; Medical ID bracelet|Медицинский браслет; Hospital band|Браслет из роддома; Festival wristband|Браслет фестиваля; Apple Watch|Эпл вотч; Mi Band|Ми бэнд; "
    "Leather strap|Кожаный ремешок; Beaded bracelet|Браслет из бусин; Gold bracelet|Золотой браслет; Silver bracelet|Серебряный браслет; Tennis bracelet|Теннисный браслет; Chain bracelet|Цепочка на руку; "
    "Paracord bracelet|Браслет из паракорда; Magnetic bracelet|Магнитный браслет; Mosquito bracelet|Браслет от комаров; Kids GPS watch|Детские часы с gps; Stopwatch|Секундомер; Compass watch|Часы с компасом; "
    "    Wrist brace|Ортез на запястье|бандаж; Wrist wrap|Кистевой бинт; Bracelet amulet|Браслет оберег; Pandora|Пандора; "
    "Cartier Love|Картье лав; Shamballa|Шамбала; Balance bracelet|Браслет баланса; Pedometer|Шагомер браслет; Wrist cuff|Наруч; Bracer|Наручи"))

k("winter_clothing_materials", "everyday", "Name a material used for winter clothing", "Назовите материал, который используют для зимней одежды",
  "A material used in winter clothes: wool, down, fur, sheepskin, fleece, cashmere, felt, synthetic insulation (Thinsulate, holofiber, sintepon), leather, membrane fabric (Gore-Tex), nylon, polyester, quilted lining, alpaca, merino, angora, mohair, camel hair, flannel, corduroy, tweed.",
  L("Wool|Шерсть; Down|Пух|гусиный пух; Fur|Мех; Sheepskin|Овчина|дублёнка; Fleece|Флис; Cashmere|Кашемир; Felt|Войлок|фетр; Thinsulate|Тинсулейт; Holofiber|Холлофайбер; Sintepon|Синтепон; "
    "Leather|Кожа; Gore-Tex|Гортекс|мембрана; Nylon|Нейлон; Polyester|Полиэстер; Alpaca|Альпака; Merino|Меринос; Angora|Ангора; Mohair|Мохер; Camel hair|Верблюжья шерсть; Flannel|Фланель; "
    "Corduroy|Вельвет; Tweed|Твид; Drape|Драп; Boiled wool|Варёная шерсть; Mink|Норка; Fox fur|Лисий мех; Sable|Соболь; Rabbit fur|Кролик; Mouton|Мутон; Astrakhan|Каракуль; Beaver|Бобёр; "
    "Arctic fox|Песец; Raccoon|Енот; Faux fur|Искусственный мех|эко мех; Faux leather|Экокожа; Suede|Замша; Nubuck|Нубук; Wadding|Вата|ватин; Batting|Ватин; Isosoft|Изософт; PrimaLoft|Прималофт; "
    "Polartec|Полартек; Softshell|Софтшелл; Neoprene|Неопрен; Thermal fabric|Термоткань; Silk|Шёлк для термобелья; Cotton|Хлопок;  Yak wool|Шерсть яка; Goat down|Козий пух; "
    "Orenburg down|Оренбургский пух; Vicuña|Викунья; Quilted fabric|Стёганая ткань; Bologna|Болонья; Oxford fabric|Оксфорд; Taslan|Таслан; Dewspo|Дюспо"))

k("famous_hairstyles", "everyday", "Name a well known hairstyle", "Назовите известную причёску",
  "A recognisable type of hairstyle or haircut: bob, pixie, braid, ponytail, bun, mohawk, buzz cut, dreadlocks, afro, mullet, undercut, crew cut, pompadour, quiff, cornrows, French braid, fishtail braid, bangs (fringe), cascade, kare (bob), boxing cut, Canadian, top knot, space buns.",
  L("Bob|Боб|каре; Pixie|Пикси; Braid|Коса; Ponytail|Хвост|хвостик; Bun|Пучок|гулька; Mohawk|Ирокез; Buzz cut|Под машинку|ёжик; Dreadlocks|Дреды; Afro|Афро; Mullet|Маллет; Undercut|Андеркат; "
    "Crew cut|Полубокс; Pompadour|Помпадур; Quiff|Кок; Cornrows|Афрокосички; French braid|Французская коса|колосок; Fishtail braid|Рыбий хвост; Bangs|Чёлка; Cascade|Каскад; Boxing cut|Бокс; "
    "Canadian|Канадка; Top knot|Самурайский пучок; Space buns|Рожки|два пучка; Pigtails|Два хвостика; Plaits|Косички; Box braids|Брейды; Perm|Химия|химическая завивка; Curls|Кудри|локоны; "
    "Waves|Волны; Beehive|Бабетта; Bouffant|Начёс; Shag|Шэгги; Wolf cut|Волчья стрижка; Asymmetry|Асимметрия; Garçon|Гарсон; Sessun|Сессон; Aurora|Аврора; Italian|Итальянка; Hat cut|Шапочка; "
    "Ladder|Лесенка; Bald|Налысо|лысина; Side part|Пробор; Slicked back|Зачёс назад; Spikes|Иголки; Emo fringe|Эмо чёлка; Bowl cut|Под горшок; Flat top|Площадка; Fade|Фейд; Taper|Тейпер; "
    "Comb over|Зачёс набок; Man bun|Мужской пучок; Chignon|Шиньон; Updo|Высокая причёска; Wedding hairstyle|Свадебная причёска; Hollywood waves|Голливудская волна; Crown braid|Корона из косы; "
    "Waterfall braid|Водопад; Dutch braid|Голландская коса; Spikelet|Колосок; Rat tail|Крысиный хвостик; Forelock|Чуб|оселедец"))

k("formal_wear", "everyday", "Name a piece of clothing traditionally worn at formal events", "Назовите предмет одежды, который традиционно носят на официальных мероприятиях",
  "A garment traditionally worn at formal or official events: suit, tuxedo, tailcoat, evening dress, ball gown, tie, bow tie, shirt, jacket (blazer), waistcoat, cocktail dress, little black dress, gloves (opera gloves), patent shoes, top hat, military dress uniform, sari, kimono, cummerbund.",
  L("Suit|Костюм|деловой костюм; Tuxedo|Смокинг; Tailcoat|Фрак; Evening dress|Вечернее платье; Ball gown|Бальное платье; Tie|Галстук; Bow tie|Бабочка; Dress shirt|Рубашка; Blazer|Пиджак|жакет; "
    "Waistcoat|Жилет; Cocktail dress|Коктейльное платье; Little black dress|Маленькое чёрное платье; Opera gloves|Длинные перчатки; Patent shoes|Лакированные туфли; Top hat|Цилиндр; Dress uniform|Парадная форма|мундир; "
    "Sari|Сари; Kimono|Кимоно; Cummerbund|Камербанд; Frock coat|Сюртук; Morning coat|Визитка; Dinner jacket|Смокинговый пиджак; Pencil skirt|Юбка карандаш; Blouse|Блузка; Pantsuit|Брючный костюм; "
    "Dress|Платье; Gown|Платье в пол; Wedding dress|Свадебное платье; Veil|Фата; Stole|Палантин; Shawl|Шаль; Cape|Накидка; Fur stole|Боа|горжетка; Pocket square|Платок в карман; Trousers|Брюки; "
    "Oxford shoes|Оксфорды; Derby shoes|Дерби; Heels|Туфли на каблуке; Stockings|Чулки; Tights|Колготки; Coat|Пальто; Overcoat|Классическое пальто; Bowler hat|Котелок; Fedora|Федора; "
    "Robe|Мантия; Judge's robe|Судейская мантия; Academic gown|Академическая мантия; Cassock|Ряса; Hanbok|Ханбок; Qipao|Ципао; Kilt|Килт; Kaftan|Кафтан; Sarafan|Сарафан парадный; Kokoshnik|Кокошник"))

k("jewelry_types", "everyday", "Name a type of jewellery", "Назовите разновидность ювелирного украшения",
  "A kind of jewellery: ring, earrings, necklace, bracelet, pendant, chain, brooch, tiara, crown, cufflinks, anklet, piercing, nose ring, cuff, locket, choker, signet ring, engagement ring, wedding band, studs, hoops, charm, beads, diadem, bangle, body chain, hairpin.",
  L("Ring|Кольцо|колечко; Earrings|Серьги|серёжки; Necklace|Ожерелье|колье; Bracelet|Браслет; Pendant|Кулон|подвеска; Chain|Цепочка; Brooch|Брошь|брошка; Tiara|Тиара; Crown|Корона; Cufflinks|Запонки; "
    "Anklet|Браслет на ногу; Piercing|Пирсинг; Nose ring|Кольцо в нос; Cuff|Каффа; Locket|Медальон; Choker|Чокер; Signet ring|Перстень|печатка; Engagement ring|Помолвочное кольцо; "
    "Wedding band|Обручальное кольцо; Studs|Пусеты|гвоздики; Hoops|Серьги кольца; Charm|Шарм; Beads|Бусы; Diadem|Диадема; Bangle|Браслет обруч; Body chain|Цепочка на тело; Hairpin|Заколка; "
    "Tie clip|Зажим для галстука; Watch|Часы; Amulet|Амулет; Cross|Крестик; Icon pendant|Ладанка; Coin pendant|Монисто; Torque|Гривна; Armlet|Браслет на плечо; Toe ring|Кольцо на палец ноги; "
    "Belly ring|Пирсинг в пупке; Ear climber|Клаймбер; Chandelier earrings|Серьги люстры; Drop earrings|Серьги подвески; Pearl necklace|Жемчужное ожерелье; Rosary|Чётки; Kokoshnik|Кокошник; "
    "Hair comb|Гребень; Headband|Ободок; Bindi|Бинди; Mangalsutra|Мангалсутра; Nath|Нат; Maang tikka|Тикка; Cameo|Камея; Collar|Воротник ожерелье; Lavaliere|Лавальер; Sautoir|Сотуар"))

k("metal_fastener_clothing", "everyday", "Name a piece of clothing that can have a metal fastener", "Назовите предмет одежды, у которого может быть металлическая застёжка",
  "A garment that may have a metal zip, buttons, snaps, buckle or hooks: jeans, jacket, leather jacket, coat, belt, bra, dress (zip), skirt, trousers, overalls, boots, denim jacket, raincoat, vest, cardigan with snaps, corset, shorts, hoodie with zip, swimsuit.",
  L("Jeans|Джинсы; Jacket|Куртка; Leather jacket|Кожанка|косуха; Coat|Пальто; Belt|Ремень|пряжка; Bra|Бюстгальтер|лифчик; Dress|Платье; Skirt|Юбка; Trousers|Брюки|штаны; Overalls|Комбинезон; "
    "Boots|Сапоги|ботинки; Denim jacket|Джинсовка; Raincoat|Плащ; Vest|Жилет; Cardigan|Кардиган; Corset|Корсет; Shorts|Шорты; Zip hoodie|Толстовка на молнии|зипка; Swimsuit|Купальник; "
    "Down jacket|Пуховик; Parka|Парка; Windbreaker|Ветровка; Bomber|Бомбер; Fur coat|Шуба; Suspenders|Подтяжки; Garter|Подвязка; Trench coat|Тренч; Uniform|Форма|мундир; Blazer|Пиджак; "
    "Shirt|Рубашка с кнопками; Bodysuit|Боди; Romper|Песочник; Jumpsuit|Комбинезон женский; Sandals|Сандалии с пряжкой; Shoes|Туфли с пряжкой; Gloves|Перчатки с кнопкой; Cap|Кепка с застёжкой; "
    "  Watch strap|Ремешок часов; Track jacket|Олимпийка; Sweater|Свитер на молнии; Fleece|Флиска на молнии; Ski pants|Горнолыжные штаны; Motorcycle jacket|Мотокуртка; Waistcoat|Жилетка; "
    "Pinafore|Сарафан; Dungarees|Полукомбинезон; Kilt|Килт; Cape|Плащ с фибулой; Cloak|Накидка с фибулой; Sporran|Споран"))

ru_rule("clothing_starting_p_ru", "everyday", "Name a piece of clothing whose Russian name starts with “П”", "Назовите предмет одежды, название которого начинается на «П»",
  "Предмет одежды на «п»: пальто, пиджак, платье, пуховик, пижама, плащ, пончо, панама, пуловер, парка, перчатки, плавки, подтяжки, пояс, платок, полушубок, пеньюар, пелерина, поло, пиджак.",
  L("Coat|Пальто; Jacket|Пиджак; Dress|Платье; Down jacket|Пуховик; Pajamas|Пижама; Raincoat|Плащ; Poncho|Пончо; Panama hat|Панама; Pullover|Пуловер; Parka|Парка; Gloves|Перчатки; "
    "Swim trunks|Плавки; Suspenders|Подтяжки; Belt|Пояс; Kerchief|Платок; Short fur coat|Полушубок; Negligee|Пеньюар; Cape|Пелерина; Polo shirt|Поло;   "
    "Pinafore|Передник; Apron|Передник кухонный; Kerchief2|Платочек; Shawl|Палантин; Cardigan|Пуловер вязаный; Overcoat|Плащ пальто; Pareo|Парео; Pants|Портки; Trousers|Порты; "
    "Pointe shoes|Пуанты; Slippers|Пантолеты; Socks|Подследники; Underskirt|Подъюбник;  Bathing suit|Пляжное платье; Petticoat|Подъюбник нижний; Uniform|Парадка; "
    "Shirt|Поддёвка; Jacket2|Полупальто;  Gaiters|Портянки; Footwraps|Портянки солдатские; Puffer|Пуховичок; Cloak|Пелеринка; Pilotka|Пилотка; Papakha|Папаха; "
    "Panama2|Панамка;  Patterned dress|Платьице;   Poddevka|Поддёвка русская; Poneva|Понёва; Plakhta|Плахта"),
  "", dict(kind="STARTS_WITH", value="п"))

# ---------- 3. Architecture ----------
k("famous_skyscrapers", "buildings", "Name a famous skyscraper", "Назовите известный небоскрёб",
  "A real, well known skyscraper: Burj Khalifa, Empire State Building, Lakhta Center, Federation Tower, Shanghai Tower, Petronas Towers, Taipei 101, One World Trade Center, Willis Tower, Chrysler Building, Shard, Merdeka 118, Abraj Al Bait, Lotte World Tower, Ping An Finance Centre, Moscow City towers, Kotelnicheskaya (Stalin high-rise).",
  L("Burj Khalifa|Бурдж Халифа; Empire State Building|Эмпайр стейт билдинг; Lakhta Center|Лахта центр; Federation Tower|Башня Федерация|федерация; Shanghai Tower|Шанхайская башня; "
    "Petronas Towers|Башни Петронас; Taipei 101|Тайбэй 101; One World Trade Center|Всемирный торговый центр|wtc; Willis Tower|Уиллис тауэр; Chrysler Building|Крайслер билдинг; Shard|Шард|осколок; "
    "Merdeka 118|Мердека 118; Abraj Al Bait|Абрадж аль бейт|королевская часовая башня; Lotte World Tower|Лотте ворлд тауэр; Ping An Finance Centre|Пинань; Moscow City|Москва Сити; "
    "Kotelnicheskaya|Высотка на Котельнической|сталинская высотка; Moscow State University|Главное здание МГУ|мгу; Mercury City|Меркурий сити; OKO Tower|ОКО; Evolution Tower|Эволюция; "
    "Vostok Tower|Восток; Neva Towers|Нева тауэрс; Triumph Palace|Триумф палас; Ostankino|Останкинская башня; Twin Towers|Башни близнецы; Trump Tower|Трамп тауэр; 30 St Mary Axe|Огурец|мэри экс; "
    "Burj Al Arab|Бурдж аль араб; Marina 101|Марина 101; Princess Tower|Принцесса тауэр; Cayan Tower|Каян тауэр; Jin Mao Tower|Цзинь мао; World Financial Center|Всемирный финансовый центр шанхай|открывашка; "
    "International Commerce Centre|Международный коммерческий центр; Bank of China Tower|Банк Китая; Marina Bay Sands|Марина бэй сэндс; Tokyo Skytree|Токио скайтри; Landmark Tower|Лэндмарк тауэр; "
    "Q1|Кью 1; Eureka Tower|Эврика тауэр; CN Tower|Си эн тауэр; Flatiron|Флэтайрон; Woolworth Building|Вулворт билдинг; 432 Park Avenue|432 Парк авеню; Central Park Tower|Сентрал парк тауэр; "
    "Commerzbank Tower|Коммерцбанк тауэр; Messeturm|Мессетурм; Turning Torso|Тёрнинг торсо; Torre Agbar|Торре агбар; Gherkin|Огурец лондон; Kingdom Centre|Кингдом центр; Jeddah Tower|Джидда тауэр"))

k("auditorium_buildings", "buildings", "Name a public building that usually has an auditorium", "Назовите общественное здание, в котором обычно есть зрительный зал",
  "A public building with an auditorium or hall for an audience: theatre, cinema, opera house, concert hall, philharmonic, circus, school (assembly hall), university, house of culture, club, stadium (stands), parliament, conference centre, planetarium, puppet theatre, music hall.",
  L("Theatre|Театр; Cinema|Кинотеатр|кино; Opera house|Оперный театр|опера; Concert hall|Концертный зал; Philharmonic|Филармония; Circus|Цирк; School|Школа|актовый зал; University|Университет; "
    "House of Culture|Дом культуры|дк; Club|Клуб; Stadium|Стадион; Parliament|Парламент; Conference centre|Конференц зал; Planetarium|Планетарий; Puppet theatre|Кукольный театр; Music hall|Мюзик холл; "
    "Ballet theatre|Театр балета; Drama theatre|Драматический театр; Bolshoi|Большой театр; Mariinsky|Мариинский театр; Conservatory|Консерватория; Arena|Арена; Sports palace|Дворец спорта; "
    "Ice palace|Ледовый дворец; Congress hall|Конгресс холл; Palace of Congresses|Кремлёвский дворец; Crocus City Hall|Крокус сити холл; Comedy club|Камеди клаб; Stand-up club|Стендап клуб; "
    "Lecture hall|Лекторий|аудитория; Museum|Музей с лекционным залом; Library|Библиотека с залом; Courthouse|Здание суда; City hall|Мэрия;    "
    "Amphitheatre|Амфитеатр; Odeon|Одеон; Cabaret|Кабаре; Variety theatre|Варьете; Dolphinarium|Дельфинарий;  Hotel|Отель с конференц залом; Business centre|Бизнес центр; "
    "Palace of Pioneers|Дворец пионеров; Youth theatre|ТЮЗ; Operetta|Театр оперетты; Satire theatre|Театр сатиры; Musical theatre|Театр мюзикла"))

k("storage_structures", "buildings", "Name a structure built to store a large amount of something", "Назовите сооружение для хранения большого количества чего либо",
  "A building or structure made to store large quantities: warehouse, granary, silo, barn, hangar, reservoir, water tower, oil tank, depot, elevator (grain), cellar, vault, archive, library, data center, garage, shed, container terminal, cold store, arsenal, armory, treasury, seed vault.",
  L("Warehouse|Склад; Granary|Амбар|житница; Silo|Силос|силосная башня; Barn|Сарай; Hangar|Ангар; Reservoir|Водохранилище; Water tower|Водонапорная башня; Oil tank|Нефтехранилище|резервуар; "
    "Depot|Депо|база; Grain elevator|Элеватор; Cellar|Погреб; Vault|Хранилище|банковское хранилище; Archive|Архив; Library|Библиотека; Data center|Дата центр; Garage|Гараж; Shed|Навес; "
    "Container terminal|Контейнерный терминал; Cold store|Холодильный склад|рефрижераторный склад; Arsenal|Арсенал; Armory|Оружейная; Treasury|Сокровищница|казна; Seed vault|Семенохранилище; "
    "Gas holder|Газгольдер; Tank farm|Резервуарный парк; Bunker|Бункер;  Museum storage|Запасник музея; Root cellar|Овощехранилище; Ice house|Ледник; Hayloft|Сеновал; "
    "   Haystack|Стог; Wine cellar|Винный погреб; Distillery warehouse|Склад бочек; Parking garage|Паркинг; Boathouse|Эллинг; Dock|Док; Cistern|Цистерна|цистерна для воды; "
    "Water tank|Бак; Dam|Плотина; Fuel depot|Топливный склад; Ammunition depot|Склад боеприпасов; Nuclear waste storage|Хранилище ядерных отходов;  Pantry|Кладовая; Closet|Кладовка; "
    "Storage room|Склад кладовая; Bank|Банк; Fort Knox|Форт Нокс;  Server room|Серверная; Freezer warehouse|Морозильный склад"))

k("architecture_styles", "buildings", "Name an architectural style", "Назовите архитектурный стиль",
  "A real architectural style: Gothic, Baroque, Classicism, Renaissance, Romanesque, Art Nouveau (Modern), Art Deco, Constructivism, Brutalism, Modernism, High-tech, Minimalism, Empire, Rococo, Neoclassicism, Stalinist Empire, Byzantine, Old Russian, Pseudo-Russian, Deconstructivism, Postmodernism, Bauhaus, Victorian.",
  L("Gothic|Готика|готический; Baroque|Барокко; Classicism|Классицизм; Renaissance|Ренессанс|возрождение; Romanesque|Романский; Art Nouveau|Модерн|ар нуво; Art Deco|Ар деко; Constructivism|Конструктивизм; "
    "Brutalism|Брутализм; Modernism|Модернизм; High-tech|Хай тек; Minimalism|Минимализм; Empire|Ампир; Rococo|Рококо; Neoclassicism|Неоклассицизм; Stalinist Empire|Сталинский ампир|сталинка; "
    "Byzantine|Византийский; Old Russian|Древнерусский; Pseudo-Russian|Псевдорусский|русский стиль; Deconstructivism|Деконструктивизм; Postmodernism|Постмодернизм; Bauhaus|Баухаус; Victorian|Викторианский; "
    "Naryshkin Baroque|Нарышкинское барокко; Moscow Baroque|Московское барокко; Elizabethan Baroque|Елизаветинское барокко; Neo-Gothic|Неоготика; Neo-Russian|Неорусский; Eclecticism|Эклектика; "
    "Functionalism|Функционализм; Organic architecture|Органическая архитектура; Parametricism|Параметризм; Bionic|Бионика; Mannerism|Маньеризм; Palladianism|Палладианство; Georgian|Георгианский; "
    "Tudor|Тюдоровский; Colonial|Колониальный; Moorish|Мавританский; Mudéjar|Мудехар; Islamic|Исламская архитектура; Chinese|Китайский стиль; Japanese|Японский стиль; Scandinavian|Скандинавский; "
    "Loft|Лофт; Chalet|Шале; Provence|Прованс; Country|Кантри; Fachwerk|Фахверк; Antique|Античный; Greek|Древнегреческий; Roman|Древнеримский; Egyptian|Египетский; Soviet modernism|Советский модернизм; "
    "Khrushchev era|Хрущёвка; Wooden architecture|Деревянное зодчество; Tent-roof|Шатровый стиль; International style|Интернациональный стиль; Metabolism|Метаболизм; Sustainable|Эко стиль"))

k("structures_in_water", "buildings", "Name a structure that can stand in the middle of a body of water", "Назовите сооружение, которое может находиться посреди водоёма",
  "A structure that can be located in the middle of water: lighthouse, oil platform, bridge pillar, island fort, pier, dam, buoy, floating house, fountain, artificial island, gazebo on a lake, castle on an island, offshore wind farm, sea fort (Kronstadt forts), water intake tower, pavilion, temple on water, floating stage.",
  L("Lighthouse|Маяк; Oil platform|Нефтяная платформа|буровая; Bridge pillar|Опора моста; Island fort|Морской форт|форт; Pier|Пирс; Dam|Плотина; Buoy|Буй; Floating house|Плавучий дом; "
    "Fountain|Фонтан; Artificial island|Искусственный остров; Gazebo|Беседка на воде; Castle|Замок на острове; Offshore wind farm|Морская ветряная электростанция; Kronstadt forts|Кронштадтские форты; "
    "Water intake tower|Водозаборная башня; Pavilion|Павильон; Temple on water|Храм на воде; Floating stage|Плавучая сцена; Statue|Статуя; Monument|Памятник; Breakwater|Волнорез; Jetty|Мол; "
    "Bridge|Мост; Floating restaurant|Плавучий ресторан; Houseboat|Дебаркадер; Pontoon|Понтон; Marina|Марина; Dock|Док; Gas rig|Газовая платформа; Research station|Исследовательская станция; "
    "Fish farm|Рыбная ферма; Lock|Шлюз; Weir|Водослив; Island monastery|Монастырь на острове|валаам; Kizhi church|Кижи; Burj Al Arab|Бурдж аль араб; Palm Jumeirah|Пальма Джумейра; "
    "Venice|Венеция; Taj Lake Palace|Дворец на озере;  Diving platform|Вышка для прыжков; Duck house|Домик для уток; Floating market|Плавучий рынок; Stilt house|Дом на сваях; "
    "Fishing hut|Рыбацкий домик; Pile dwelling|Свайное жилище; Sea wall|Дамба; Hydro power plant|ГЭС; Tidal power plant|Приливная электростанция; Floating solar|Плавучая солнечная станция; "
    "  Raft|Плот; Swimming platform|Понтон для купания; Navigation sign|Створный знак"))

k("famous_squares", "geography", "Name a famous square in any city of the world", "Назовите известную площадь любого города мира",
  "A famous city square: Red Square, Palace Square, Times Square, Trafalgar Square, Tiananmen Square, St. Peter's Square, Place de la Concorde, Plaza Mayor, Piazza San Marco, Grand Place, Wenceslas Square, Maidan, Manezhnaya, Lubyanka, Pushkin Square, Senate Square, Dam Square, Alexanderplatz, Zócalo, Shibuya Crossing.",
  L("Red Square|Красная площадь; Palace Square|Дворцовая площадь; Times Square|Таймс сквер; Trafalgar Square|Трафальгарская площадь; Tiananmen Square|Площадь Тяньаньмэнь; St. Peter's Square|Площадь Святого Петра; "
    "Place de la Concorde|Площадь Согласия; Plaza Mayor|Пласа Майор; Piazza San Marco|Площадь Сан Марко; Grand Place|Гран плас; Wenceslas Square|Вацлавская площадь; Maidan|Майдан; Manezhnaya|Манежная площадь; "
    "Lubyanka|Лубянская площадь|лубянка; Pushkin Square|Пушкинская площадь; Senate Square|Сенатская площадь; Dam Square|Площадь Дам; Alexanderplatz|Александерплац; Zócalo|Сокало; Shibuya Crossing|Перекрёсток Сибуя; "
    "Theatre Square|Театральная площадь; Revolution Square|Площадь Революции; Victory Square|Площадь Победы; Lenin Square|Площадь Ленина; Old Town Square|Староместская площадь; Market Square Kraków|Рыночная площадь Кракова; "
    "Piccadilly Circus|Пикадилли; Leicester Square|Лестер сквер; Place Vendôme|Вандомская площадь; Place des Vosges|Площадь Вогезов; Puerta del Sol|Пуэрта дель Соль; Plaza de España|Площадь Испании; "
    "Piazza Navona|Пьяцца Навона; Piazza del Popolo|Пьяцца дель Пополо; Piazza della Signoria|Площадь Синьории; Marienplatz|Мариенплац; Potsdamer Platz|Потсдамская площадь; Heroes' Square|Площадь Героев; "
    "Syntagma|Площадь Синтагма; Taksim|Таксим; Jemaa el-Fnaa|Джемаа эль Фна; Naqsh-e Jahan|Площадь Имама; Registan|Регистан; Independence Square|Площадь Независимости; Freedom Square|Площадь Свободы; "
    "Kazan Square|Площадь Тысячелетия; Uprising Square|Площадь Восстания; Ploshchad Ilyicha|Площадь Ильича; Union Square|Юнион сквер; Washington Square|Вашингтон сквер; Copley Square|Копли сквер; "
    "Federation Square|Федерейшн сквер; Merdeka Square|Площадь Мердека; Rossio|Россиу; Commerce Square|Площадь Коммерции"))

k("hotel_rooms", "everyday", "Name a type of room you can find in a hotel", "Назовите помещение, которое можно встретить в гостинице",
  "A room or space found in a hotel: guest room, suite, lobby, reception, restaurant, bar, kitchen, laundry, gym, spa, sauna, pool, conference room, business centre, luggage room, corridor, elevator, staircase, terrace, penthouse, presidential suite, single room, double room, family room, banquet hall, storage, cloakroom, breakfast room.",
  L("Guest room|Номер; Suite|Люкс|сьют; Lobby|Лобби|холл; Reception|Ресепшн|стойка регистрации; Restaurant|Ресторан; Bar|Бар; Kitchen|Кухня; Laundry|Прачечная; Gym|Тренажёрный зал; Spa|Спа; "
    "Sauna|Сауна; Pool|Бассейн; Conference room|Конференц зал; Business centre|Бизнес центр; Luggage room|Камера хранения; Corridor|Коридор; Elevator|Лифт; Staircase|Лестница; Terrace|Терраса; "
    "Penthouse|Пентхаус; Presidential suite|Президентский люкс; Single room|Одноместный номер; Double room|Двухместный номер; Family room|Семейный номер; Banquet hall|Банкетный зал; Storage|Склад; "
    "Cloakroom|Гардероб; Breakfast room|Зал для завтраков; Bathroom|Ванная; Toilet|Туалет; Balcony|Балкон; Junior suite|Джуниор сюит; Studio|Студия; Standard room|Стандарт; Deluxe|Делюкс; "
    "Apartment|Апартаменты; Kids club|Детская комната; Lounge|Лаундж; Smoking room|Курилка; Office|Офис; Staff room|Комната персонала; Security room|Охрана; Boiler room|Котельная; Parking|Паркинг; "
    "Beauty salon|Салон красоты; Massage room|Массажный кабинет; Cinema room|Кинозал; Game room|Игровая; Library|Библиотека; Rooftop|Крыша; Chapel|Часовня; Wine cellar|Винный погреб; Shop|Магазин; "
    "Medical room|Медпункт; Ironing room|Гладильная; Linen room|Бельевая; Dining hall|Столовая; Hall|Холл этажа; Veranda|Веранда; Courtyard|Внутренний двор; Atrium|Атриум"))

k("observation_structures", "buildings", "Name a structure built to watch the surroundings", "Назовите сооружение для наблюдения за окружающей местностью",
  "A structure meant for watching the area: watchtower, observation deck, lighthouse, fire lookout tower, guard tower, control tower (airport), observatory, belfry, tower of a fortress, hunting tower (hide), lifeguard tower, border post, viewing platform, TV tower with deck, crow's nest, bird hide.",
  L("Watchtower|Сторожевая башня|вышка; Observation deck|Смотровая площадка; Lighthouse|Маяк; Fire lookout tower|Пожарная каланча|каланча; Guard tower|Караульная вышка; Control tower|Диспетчерская вышка; "
    "Observatory|Обсерватория; Belfry|Колокольня; Fortress tower|Крепостная башня; Hunting hide|Охотничья вышка|лабаз; Lifeguard tower|Вышка спасателей; Border post|Пограничная вышка; "
    "Viewing platform|Смотровая вышка; TV tower|Телебашня; Crow's nest|Воронье гнездо; Bird hide|Укрытие для наблюдения за птицами; Donjon|Донжон; Bastion|Бастион; Beacon tower|Сигнальная башня; "
    "Prison tower|Вышка в тюрьме; Radar station|Радиолокационная станция|радар; Weather station|Метеостанция; Lookout|Наблюдательный пункт;  Pillbox|ДОТ; Signal tower|Семафор; "
    "Ferris wheel|Колесо обозрения; Skyscraper deck|Смотровая на небоскрёбе;  Gazebo|Бельведер; Belvedere|Бельведер; Mirador|Мирадор; Cupola|Купол обзорный; "
    "Treehouse|Домик на дереве; Lifeguard chair|Вышка на пляже; Stadium press box|Ложа прессы; Command post|Командный пункт; Forest tower|Лесная вышка;  Castle keep|Цитадель; "
    "Kremlin tower|Кремлёвская башня; Great Wall tower|Башня Великой стены; Martello tower|Башня Мартелло; Sky tower|Скай тауэр; Ostankino|Останкино; Space Needle|Спейс нидл; Eiffel Tower|Эйфелева башня"))

# ---------- 4. Film and comics ----------
k("glove_wearing_characters", "fantasy", "Name a character who always wears gloves", "Назовите персонажа, который постоянно носит перчатки",
  "A fictional character whose constant look includes gloves: Mickey Mouse, Michael Jackson no (real), Freddy Krueger (bladed glove), Rogue, Thanos (Infinity Gauntlet), Batman, Spider-Man, Elsa (early), Iron Man, Goofy, Bugs Bunny, Sonic, Mario, Black Widow, Captain America, Ezio, Shredder.",
  L("Mickey Mouse|Микки Маус; Freddy Krueger|Фредди Крюгер; Rogue|Роуг|шельма; Thanos|Танос; Batman|Бэтмен; Spider-Man|Человек паук; Elsa|Эльза; Iron Man|Железный человек; Goofy|Гуфи; "
    "Bugs Bunny|Багз Банни; Sonic|Соник; Mario|Марио; Black Widow|Чёрная вдова; Captain America|Капитан Америка; Ezio|Эцио; Shredder|Шреддер; Donald Duck|Дональд Дак; Minnie Mouse|Минни Маус; "
    "   Woody Woodpecker|Вуди Вудпекер; Daffy Duck|Даффи Дак; Porky Pig|Порки Пиг; Tails|Тейлз; Knuckles|Наклз; Shadow|Шедоу; Luigi|Луиджи; Wario|Варио; "
    "Catwoman|Женщина кошка; Robin|Робин; Flash|Флэш;   Doctor Doom|Доктор Дум; Darth Vader|Дарт Вейдер; Magneto|Магнето; Cyclops|Циклоп; "
    "Deadpool|Дэдпул;  Green Goblin|Зелёный гоблин; Mysterio|Мистерио; Zorro|Зорро; Phantom|Призрак; Mary Poppins|Мэри Поппинс; Willy Wonka|Вилли Вонка;  "
    "     Mr. Freeze|Мистер Фриз;  Riddler|Загадочник; Penguin|Пингвин; Hitman 47|Агент 47; "
    "Sam Fisher|Сэм Фишер; Lara Croft|Лара Крофт; Snake|Снейк; Kirito|Кирито; Edward Elric|Эдвард Элрик; Roy Mustang|Рой Мустанг; Inspector Gadget|Инспектор Гаджет; Dr. Claw|Доктор Кло"))

k("ship_voyage_films", "movies_tv", "Name a film where characters travel on a ship", "Назовите фильм, в котором герои путешествуют на корабле",
  "A real film in which characters travel by ship: Titanic, Pirates of the Caribbean, Master and Commander, Life of Pi, Moana, Captain Phillips, Poseidon, The Life Aquatic, Treasure Island, Kon-Tiki, In the Heart of the Sea, Jaws (boat), Moby Dick, Waterworld, The Pirates of the 20th Century, Captain Vrungel, Children of Captain Grant, Speed 2, Below Deck.",
  L("Titanic|Титаник; Pirates of the Caribbean|Пираты Карибского моря; Master and Commander|Хозяин морей; Life of Pi|Жизнь Пи; Moana|Моана; Captain Phillips|Капитан Филлипс; Poseidon|Посейдон; "
    "The Life Aquatic|Водная жизнь; Treasure Island|Остров сокровищ; Kon-Tiki|Кон тики; In the Heart of the Sea|В сердце моря; Jaws|Челюсти; Moby Dick|Моби Дик; Waterworld|Водный мир; "
    "Pirates of the 20th Century|Пираты XX века; Captain Vrungel|Приключения капитана Врунгеля; Children of Captain Grant|В поисках капитана Гранта|дети капитана гранта; Speed 2|Скорость 2; "
    "The Perfect Storm|Идеальный шторм; Ghost Ship|Корабль призрак; Triangle|Треугольник; Dead Calm|Мёртвый штиль; All Is Lost|Не угаснет надежда; Adrift|Во власти стихии; The Poseidon Adventure|Приключения Посейдона; "
    "Mutiny on the Bounty|Мятеж на Баунти; Amistad|Амистад; Hook|Капитан Крюк; Peter Pan|Питер Пэн; Muppet Treasure Island|Остров сокровищ маппетов; The Pirates! Band of Misfits|Пираты Банда неудачников; "
    "Sinbad|Синдбад; Jason and the Argonauts|Ясон и аргонавты; Troy|Троя; The Odyssey|Одиссея; Overboard|За бортом; The Love Boat|Корабль любви; Death on the Nile|Смерть на Ниле; Jungle Cruise|Круиз по джунглям; "
    "   Hotel Transylvania 3|Монстры на каникулах 3; Raft|Плот; Greyhound|Грейхаунд; Midway|Мидуэй; K-19|К 19; Crimson Tide|Багровый прилив; "
    "U-571|Ю 571; The Hunt for Red October|Охота за Красным Октябрём; Battleship|Морской бой; The Finest Hours|И грянул шторм; Icebreaker|Ледокол; Sea Wolf|Морской волк; Scarlet Sails|Алые паруса; "
    "  Sailor from the Comet|Матрос с Кометы; Islands|Острова; Pirates|Пираты; Cutthroat Island|Остров головорезов"))

k("fire_control_characters", "fantasy", "Name a character who can create or control fire", "Назовите персонажа, который умеет создавать или управлять огнём",
  "A fictional character with fire powers: Human Torch, Zuko, Daenerys's dragons no (Daenerys immune), Pyro, Firestar, Ghost Rider, Phoenix, Charizard, Roy Mustang, Ace (One Piece), Natsu, Endeavor, Todoroki, Scorpion, Hades (Hercules), Fire Lord Ozai, Azula, Smaug, Firebird.",
  L("Human Torch|Человек факел; Zuko|Зуко; Pyro|Пиро; Firestar|Огненная звезда; Ghost Rider|Призрачный гонщик; Phoenix|Феникс|джин грей; Charizard|Чаризард; Roy Mustang|Рой Мустанг; "
    "Portgas D. Ace|Эйс; Natsu|Нацу; Endeavor|Старатель; Todoroki|Тодороки; Scorpion|Скорпион; Hades|Аид; Fire Lord Ozai|Озай; Azula|Азула; Smaug|Смауг; Firebird|Жар птица; Zmei Gorynych|Змей Горыныч; "
    "Toothless|Беззубик; Dragon|Дракон; Balrog|Балрог; Ifrit|Ифрит; Surtur|Суртур; Prometheus|Прометей; Hephaestus|Гефест; Agni|Агни; Svarog|Сварог; Ember|Эмбер|элементарно; "
    "Bowser|Боузер; Mario fire|Огненный Марио; Fire Flower Mario|Марио с огненным цветком; Charmander|Чармандер; Moltres|Молтрес; Ho-Oh|Хо о; Blaze|Блейз; Iggy|Игги;  "
    "Rengoku|Ренгоку; Kyojuro|Кёдзюро; Katsuki Bakugo|Бакуго; Dabi|Даби; Itachi|Итачи; Sasuke|Саске; Madara|Мадара; Kirin|Кирин; Starfire|Старфаер; Firestorm|Огненный шторм; "
    "Sunfire|Солнечный огонь; Johnny Storm|Джонни Шторм; Dormammu|Дормамму;   Daenerys|Дейенерис; Melisandre|Мелисандра; Gandalf|Гэндальф; Calcifer|Кальцифер; "
    "Hellboy|Хеллбой; Blaze Fire Witch|Огненная ведьма; Fire elemental|Огненный элементаль; Salamander|Саламандра; Ifrit genie|Джинн ифрит; Lina Inverse|Лина Инверс; Lina Dota|Лина; Ignis|Игнис"))

k("time_of_day_films", "movies_tv", "Name a film whose title has a word for a time of day", "Назовите фильм, в названии которого есть слово, обозначающее время суток",
  "A real film whose title contains morning, day, evening, night, noon, midnight, dawn, dusk or sunset: Night Watch, Day Watch, Midnight in Paris, Groundhog Day, Independence Day, Twilight, From Dusk Till Dawn, Before Sunrise, Before Sunset, Night at the Museum, High Noon, The Day After Tomorrow, Good Morning Vietnam.",
  L("Night Watch|Ночной дозор; Day Watch|Дневной дозор; Midnight in Paris|Полночь в Париже; Groundhog Day|День сурка; Independence Day|День независимости; Twilight|Сумерки; From Dusk Till Dawn|От заката до рассвета; "
    "Before Sunrise|Перед рассветом; Before Sunset|Перед закатом; Before Midnight|Перед полуночью; Night at the Museum|Ночь в музее; High Noon|Ровно в полдень; The Day After Tomorrow|Послезавтра; "
    "Good Morning, Vietnam|Доброе утро Вьетнам; Morning Glory|Доброе утро; The Morning Show|Утреннее шоу;  Nightcrawler|Стрингер; Night Moves|Ночные движения; "
    "Day of the Dead|День мертвецов; Dawn of the Dead|Рассвет мертвецов; Night of the Living Dead|Ночь живых мертвецов; Election Day|День выборов; Radio Day|День радио; A Day in September|Один день в сентябре; "
    "The Day the Earth Stood Still|День когда Земля остановилась; Training Day|Тренировочный день; Day of the Jackal|День Шакала;  Last Night in Soho|Прошлой ночью в Сохо; "
    "Sleepless Night|Бессонная ночь; Silent Night|Тихая ночь; Evening Bells|Вечерний звон;  A Hard Day's Night|Вечер трудного дня; Dawns Here Are Quiet|А зори здесь тихие; "
    "Sunset Boulevard|Бульвар Сансет;  Evening|Вечер; Midnight Express|Полуночный экспресс; Midnight Cowboy|Полуночный ковбой; Midnight Special|Специальный полуночный выпуск; "
    "Night Shift|Ночная смена; Fright Night|Ночь страха; Prom Night|Выпускной; The Purge|Судная ночь; The Night Before|Рождество; Day Shift|Дневная смена; One Day|Один день;  "
    "Noon|Полдень; Night Owl|Сова; Twelve Nights|Двенадцать ночей; White Nights|Белые ночи; Night Train|Ночной поезд; Day of Wrath|День гнева; Evening in Byzantium|Вечер в Византии"))

k("facial_scar_characters", "fantasy", "Name a fictional character with a scar on the face", "Назовите вымышленного персонажа со шрамом на лице",
  "A fictional character known for a facial scar: Harry Potter (forehead), Scar (The Lion King), Zuko, Tony Montana (Scarface), Two-Face, the Joker (Dark Knight), Mad-Eye Moody, Darth Vader, Kenshin, Shanks, Snake Eyes, Geralt, Tyrion, the Hound, Le Chiffre, Frankenstein's monster, Deadpool.",
  L("Harry Potter|Гарри Поттер; Scar|Шрам; Zuko|Зуко; Tony Montana|Тони Монтана|лицо со шрамом; Two-Face|Двуликий; Joker|Джокер; Mad-Eye Moody|Грозный глаз Грюм; Darth Vader|Дарт Вейдер; "
    "Kenshin|Кэнсин; Shanks|Шанкс; Geralt|Геральт; Tyrion|Тирион; The Hound|Пёс|сандор клиган; Le Chiffre|Ле Шиффр; Frankenstein's monster|Монстр Франкенштейна; Deadpool|Дэдпул; Freddy Krueger|Фредди Крюгер; "
    "  Snake Plissken|Змей Плисскин;   Jon Snow|Джон Сноу;   Sandor Clegane|Сандор Клиган; "
    "  Kratos|Кратос; Ezio|Эцио;  Big Boss|Биг Босс; Squall|Скволл; Seifer|Сайфер;  Garrus|Гаррус; Sion|Сион; Guts|Гатс; Luffy|Луффи; "
    "Zoro|Зоро; Iruka|Ирука;   Kakashi|Какаси;  Levi|Леви;   Phantom of the Opera|Призрак оперы; "
    "     Furiosa|Фуриоса;   Cain|Каин; Shere Khan|Шерхан; "
    "  Taka|Така"))

k("animated_series_before_2010", "movies_tv", "Name an animated series first released before 2010", "Назовите мультсериал, который впервые вышел до 2010 года",
  "A real animated TV series that premiered before 2010: The Simpsons (1989), SpongeBob (1999), Tom and Jerry, DuckTales (1987), Chip 'n Dale, Smeshariki (2004), Luntik (2006), Masha and the Bear (2009), Nu, pogodi!, Family Guy, South Park, Futurama, Pokémon, Naruto, Teenage Mutant Ninja Turtles (1987), Winx (2004), Fixies no (2010).",
  L("The Simpsons|Симпсоны; SpongeBob|Губка Боб; Tom and Jerry|Том и Джерри; DuckTales|Утиные истории; Chip 'n Dale Rescue Rangers|Чип и Дейл; Smeshariki|Смешарики; Luntik|Лунтик; "
    "Masha and the Bear|Маша и Медведь; Nu, pogodi!|Ну погоди; Family Guy|Гриффины; South Park|Южный парк; Futurama|Футурама; Pokémon|Покемоны; Naruto|Наруто; Teenage Mutant Ninja Turtles|Черепашки ниндзя; "
    "Winx Club|Винкс; Gummi Bears|Мишки Гамми; Darkwing Duck|Чёрный плащ; TaleSpin|Чудеса на виражах; Gargoyles|Гаргульи; Batman: The Animated Series|Бэтмен мультсериал; X-Men: The Animated Series|Люди Икс; "
    "Scooby-Doo|Скуби Ду; The Flintstones|Флинтстоуны; The Jetsons|Джетсоны; Looney Tunes|Луни Тюнз; Sailor Moon|Сейлор Мун; Dragon Ball|Драгонболл; One Piece|Ван пис; Bleach|Блич; Death Note|Тетрадь смерти; "
    "Avatar: The Last Airbender|Аватар Легенда об Аанге; Ben 10|Бен 10; Totally Spies|Тотали спайс; Kim Possible|Ким пять с плюсом; Phineas and Ferb|Финес и Ферб; The Powerpuff Girls|Суперкрошки; "
    "Dexter's Laboratory|Лаборатория Декстера; Johnny Bravo|Джонни Браво; Courage the Cowardly Dog|Кураж трусливый пёс; Ed, Edd n Eddy|Эд Эдд и Эдди; Hey Arnold!|Эй Арнольд; Rugrats|Ох уж эти детки; "
    "Teletubbies|Телепузики; Thomas & Friends|Паровозик Томас; Fireman Sam|Пожарный Сэм; Peppa Pig|Свинка Пеппа; Leopold the Cat|Кот Леопольд; Prostokvashino|Простоквашино; Kikoriki|Кикорики; "
    "        "
    "King of the Hill|Царь горы; Beavis and Butt-Head|Бивис и Баттхед; Aaahh!!! Real Monsters|Ааах монстры; Rocko's Modern Life|Новая жизнь Рокко; Recess|Переменка; Doug|Даг; Woody Woodpecker|Вуди Вудпекер; "
    "Pink Panther|Розовая пантера; Inspector Gadget|Инспектор Гаджет; He-Man|Хи мен; ThunderCats|Громокошки; Transformers|Трансформеры; Captain Planet|Капитан Планета"),
  "Fixies/Фиксики/Barboskins/Барбоскины/Three Cats/Три кота/Gravity Falls/Гравити Фолз/Rick and Morty/Рик и Морти/Adventure Time/Время приключений/Bluey/Блуи")

k("athlete_hero_films", "movies_tv", "Name a film whose main hero is an athlete", "Назовите фильм, главный герой которого спортсмен",
  "A real film whose protagonist is an athlete or sports player: Rocky, Raging Bull, Legend No. 17, Going Vertical, Coach (Trener), Streltsov, Ice, Million Dollar Baby, The Fighter, Creed, Moneyball, Rush, I, Tonya, Eddie the Eagle, Cool Runnings, Southpaw, The Wrestler, Warrior, Champions.",
  L("Rocky|Рокки; Raging Bull|Бешеный бык; Legend No. 17|Легенда 17|легенда номер 17; Going Vertical|Движение вверх; Coach|Тренер; Streltsov|Стрельцов; Ice|Лёд; Million Dollar Baby|Малышка на миллион; "
    "The Fighter|Боец; Creed|Крид; Moneyball|Человек который изменил всё; Rush|Гонка; I, Tonya|Тоня против всех; Eddie the Eagle|Эдди Орёл; Cool Runnings|Крутые виражи; Southpaw|Левша; The Wrestler|Рестлер; "
    "Warrior|Воин; Champions|Чемпионы; Ali|Али; Cinderella Man|Нокдаун; Bloodsport|Кровавый спорт; Kickboxer|Кикбоксёр;  Unbreakable|Несломленный; Chariots of Fire|Огненные колесницы; "
    "Foxcatcher|Охотник на лис; Ford v Ferrari|Ford против Ferrari; Senna|Сенна; Borg vs McEnroe|Борг Макинрой; Battle of the Sexes|Битва полов; King Richard|Король Ричард; Space Jam|Космический джем; "
    "Happy Gilmore|Счастливчик Гилмор; Tin Cup|Жестяной кубок; Jerry Maguire|Джерри Магуайер; The Blind Side|Невидимая сторона;  Rudy|Руди; Any Given Sunday|Каждое воскресенье; "
    "Remember the Titans|Вспомнить Титанов; Hoosiers|Команда из Хузиерса; Coach Carter|Тренер Картер; Glory Road|Дорога славы; He Got Game|Его игра; White Men Can't Jump|Белые люди не умеют прыгать; "
    "The Natural|Самородок; Field of Dreams|Поле его мечты; Bull Durham|Дархэмский бык; A League of Their Own|Их собственная лига; Major League|Высшая лига; Goal!|Гол; Bend It Like Beckham|Играй как Бекхэм; "
    "Shaolin Soccer|Убойный футбол; Ice 2|Лёд 2; Match|Матч; Vratar Galaktiki|Вратарь Галактики; Pervy|Первый; Chempiony|Чемпионы Быстрее Выше Сильнее"),
  "Titanic/Титаник/Shrek/Шрек/Avatar/Аватар")

k("doctor_characters", "fantasy", "Name a fictional character who is a doctor", "Назовите вымышленного персонажа, который врач",
  "A fictional character who is a doctor (medical doctor or famous Doctor title): Doctor House, Aibolit, Doctor Watson, Doctor Zhivago, Doctor Strange, Doctor Who, Dr. Jekyll, Hannibal Lecter, Doctor Dolittle, Meredith Grey, J.D. (Scrubs), Bykov (Interns), Professor Preobrazhensky, Doctor Livesey, Doctor Frankenstein, Dr. Quinn, Leonard McCoy, Dr. Octopus no (scientist).",
  L("Doctor House|Доктор Хаус|хаус; Aibolit|Айболит|доктор айболит; Doctor Watson|Доктор Ватсон; Doctor Zhivago|Доктор Живаго; Doctor Strange|Доктор Стрэндж; Doctor Who|Доктор Кто; Dr. Jekyll|Доктор Джекилл; "
    "Hannibal Lecter|Ганнибал Лектер; Doctor Dolittle|Доктор Дулиттл; Meredith Grey|Мередит Грей; J.D.|Джей Ди; Bykov|Быков|доктор быков; Professor Preobrazhensky|Профессор Преображенский; Doctor Livesey|Доктор Ливси; "
    "Victor Frankenstein|Доктор Франкенштейн; Dr. Quinn|Доктор Куин; Leonard McCoy|Леонард Маккой;  Dr. Cox|Доктор Кокс; Dr. Shepherd|Доктор Шепард; Derek Shepherd|Дерек Шепард; "
    "Dr. Carter|Доктор Картер; Dr. Ross|Доктор Росс; Dr. Green|Доктор Грин;  Dr. Shaun Murphy|Доктор Шон Мерфи|хороший доктор; Dr. Strange|Стрэндж;  "
    "Sklifosovsky|Склифосовский;  Kupitman|Купитман; Romanenko|Романенко; Doctor Tyrsa|Доктор Тырса; Doctor Richter|Доктор Рихтер;  Dr. Astrov|Астров; "
    "Dr. Chebutykin|Чебутыкин; Bazarov|Базаров; Dr. Yuri Zhivago|Юрий Живаго; Doctor Moreau|Доктор Моро; Dr. Faustus|Доктор Фаустус;   "
    "Baymax|Беймакс; Doc McStuffins|Доктор Плюшева; Dr. Zoidberg|Доктор Зойдберг; Dr. Hibbert|Доктор Хибберт; Dr. Nick|Доктор Ник;  Dr. Hannibal|Ганнибал;  "
    "   Dr. Crane|Доктор Крейн; Dr. Frasier|Фрейзер; Dr. Lisa Cuddy|Кадди; Dr. Wilson|Уилсон; Dr. Foreman|Форман; Dr. Chase|Чейз; Dr. Cameron|Кэмерон"),
  "Doctor Doom/Доктор Дум/Doctor Octopus/Доктор Осьминог/Doctor Evil/Доктор Зло/Dr. Robotnik/Доктор Роботник")

k("desert_set_films", "movies_tv", "Name a film set in a desert", "Назовите фильм, действие которого происходит в пустыне",
  "A real film set mostly in a desert: Dune, Mad Max: Fury Road, Lawrence of Arabia, White Sun of the Desert, The English Patient, The Mummy, Star Wars (Tatooine), Aladdin, Prince of Persia, Sahara, The Martian (Mars desert), 127 Hours, Three Kings, The Book of Eli, Rango, Holes, Paris Texas, Babel.",
  L("Dune|Дюна; Mad Max: Fury Road|Безумный Макс Дорога ярости; Lawrence of Arabia|Лоуренс Аравийский; White Sun of the Desert|Белое солнце пустыни; The English Patient|Английский пациент; The Mummy|Мумия; "
    "Star Wars|Звёздные войны; Aladdin|Аладдин; Prince of Persia|Принц Персии; Sahara|Сахара; The Martian|Марсианин; 127 Hours|127 часов; Three Kings|Три короля; The Book of Eli|Книга Илая; Rango|Ранго; "
    "  Paris, Texas|Париж Техас; Babel|Вавилон; Dune: Part Two|Дюна часть вторая;  Indiana Jones|Индиана Джонс; Tremors|Дрожь земли; The Hills Have Eyes|У холмов есть глаза; "
    "No Country for Old Men|Старикам тут не место; Sicario|Убийца; Hidalgo|Идальго; The Scorpion King|Царь скорпионов; Exodus|Исход; Lion of the Desert|Лев пустыни; Black Gold|Чёрное золото; Jarhead|Морпехи; "
    "The Hurt Locker|Повелитель бури; Mad Max|Безумный Макс; Furiosa|Фуриоса; Thelma & Louise|Тельма и Луиза; Fear and Loathing in Las Vegas|Страх и ненависть; Into the Wild|В диких условиях; "
    "Priscilla|Приключения Присциллы; Kingdom of Heaven|Царство небесное; The Sheltering Sky|Под покровом небес; Beau Geste|Красавчик Жест; Flight of the Phoenix|Полёт Феникса; The Little Prince|Маленький принц; "
    "Kin-dza-dza!|Кин дза дза; 40 Days in the Desert|40 дней в пустыне; Hell or High Water|Любой ценой;    Pitch Black|Чёрная дыра; "
    "Planet of the Apes|Планета обезьян;     The Good, the Bad and the Ugly|Хороший плохой злой"),
  "Titanic/Титаник/Frozen/Холодное сердце/Home Alone/Один дома")

k("self_copy_characters", "fantasy", "Name a character who can create copies of themselves", "Назовите персонажа, который умеет создавать собственные копии",
  "A fictional character able to duplicate or clone themselves: Naruto (shadow clones), Multiple Man (Jamie Madrox), Agent Smith (The Matrix), Loki (illusions), Kakashi, Mirage, Gemini, Deadpool (Deadpool Corps no), Majin Buu, Piccolo, Tien (Multi-Form), Alexandra (Orphan Black clones).",
  L("Naruto|Наруто; Multiple Man|Множитель|джейми мэдрокс; Agent Smith|Агент Смит; Loki|Локи; Kakashi|Какаси; Mirage|Мираж; Tien Shinhan|Тенсинхан; Piccolo|Пикколо; Majin Buu|Маджин Бу; "
    "Mysterio|Мистерио; Bart Simpson clones|Барт клоны;   Gemini|Близнецы; Jamie Madrox|Мэдрокс; Mister Sinister|Мистер Зловещий; Arnim Zola|Арним Зола; "
    "  Itachi|Итачи;  Boruto|Боруто; Jiraiya|Джирайя; Madara|Мадара; Zetsu|Зецу;     "
    "Doctor Strange|Доктор Стрэндж;  Ditto|Дитто;  Zorua|Зоруа;  Shadow Link|Тёмный Линк; Dark Pit|Тёмный Пит;  "
    "  Hydra|Гидра;     Legion|Легион;   "
    "Sarah Manning|Сара Мэннинг|тёмное дитя; Cosima|Косима; Alison|Элисон; Helena|Хелена; Rachel|Рэйчел; Duncan Idaho|Дункан Айдахо; Jango Fett|Джанго Фетт; Clone troopers|Клоны; Rex|Рекс; "
    "   Mickey 17|Микки 17; The 6th Day Adam|Адам Гибсон; Multiplicity Doug|Даг Кинни; Ultron|Альтрон;   Copycat|Копирщик"))
