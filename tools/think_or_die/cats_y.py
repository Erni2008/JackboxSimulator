# THINK OR DIE category content, part Y (list 7, questions 31-70; compact lists, the AI judges the rest).
from cats_a import cat


def k(id, group, en, ru, crit, lines, inv="", type="KNOWLEDGE", **kw):
    cat(id, type, group, en, ru, crit, crit, lines, inv, **kw)


def L(s):
    return "\n".join(x.strip() for x in s.strip().split(";"))


# ---------- 4. The world around us ----------
k("ocean_floor_things", "nature", "Name something you can see on the ocean floor", "Назовите то, что можно увидеть на дне океана",
  "Something found on the sea or ocean floor: sand, rocks, corals, shells, starfish, sea urchins, crabs, seaweed, shipwrecks, sunken treasure, anchors, sponges, sea cucumbers, flatfish, hydrothermal vents, oil pipelines, cables, pearls, octopus, stingray.",
  L("Sand|Песок; Rocks|Камни; Corals|Кораллы; Shells|Ракушки; Starfish|Морская звезда; Sea urchin|Морской ёж; Crab|Краб; Seaweed|Водоросли; Shipwreck|Затонувший корабль; "
    "Sunken treasure|Сокровища; Anchor|Якорь; Sponge|Губка; Sea cucumber|Морской огурец; Flounder|Камбала; Hydrothermal vent|Гидротермальный источник|чёрный курильщик; "
    "Pipeline|Трубопровод; Cable|Подводный кабель; Pearl|Жемчуг; Octopus|Осьминог; Stingray|Скат; Lobster|Омар; Shrimp|Креветка; Oyster|Устрица; Mussel|Мидия; Clam|Моллюск; "
    "Sea anemone|Актиния; Hermit crab|Рак отшельник; Anglerfish|Удильщик; Coral reef|Коралловый риф; Trench|Впадина|марианская впадина; Volcano|Подводный вулкан; Silt|Ил; "
    "Garbage|Мусор; Plastic|Пластик; Bones|Кости; Whale skeleton|Скелет кита; Submarine|Подводная лодка; Diver|Водолаз; Coins|Монеты; Amphora|Амфора; Ruins|Руины|атлантида; "
    "Sunken plane|Затонувший самолёт; Tube worms|Трубчатые черви; Nautilus|Наутилус; Squid|Кальмар; Eel|Угорь; Moray|Мурена; Sea turtle|Черепаха; Sea grass|Морская трава; "
    "Kelp|Ламинария; Plankton|Планктон; Bathyscaphe|Батискаф; Treasure chest|Сундук; Cannon|Пушка; Titanic|Титаник"))

k("ancient_natural_objects", "nature", "Name a natural object that can exist for thousands of years", "Назовите природный объект, который может существовать тысячи лет",
  "A natural object that can last for thousands of years: mountain, glacier, rock, cave, lake, river, sequoia, baobab, bristlecone pine, coral reef, desert, island, volcano, canyon, waterfall, stalactite, fossil, amber, diamond, meteorite.",
  L("Mountain|Гора; Glacier|Ледник; Rock|Скала|камень; Cave|Пещера; Lake|Озеро|байкал; River|Река; Sequoia|Секвойя; Baobab|Баобаб; Bristlecone pine|Остистая сосна|мафусаил; "
    "Coral reef|Коралловый риф; Desert|Пустыня; Island|Остров; Volcano|Вулкан; Canyon|Каньон|гранд каньон; Waterfall|Водопад; Stalactite|Сталактит; Stalagmite|Сталагмит; "
    "Fossil|Окаменелость; Amber|Янтарь; Diamond|Алмаз; Meteorite|Метеорит; Oak|Дуб; Olive tree|Оливковое дерево; Yew|Тис; Cedar|Кедр; Sponge|Морская губка; Jellyfish|Бессмертная медуза; "
    "  Permafrost|Вечная мерзлота; Salt deposit|Соляное месторождение; Crystal|Кристалл; Gem|Драгоценный камень; Gold nugget|Самородок; Sea|Море; Ocean|Океан; "
    "Peat bog|Торфяное болото; Plateau|Плато; Fjord|Фьорд; Geyser|Гейзер; Hot spring|Горячий источник;  Valley|Долина; Gorge|Ущелье; Arch|Скальная арка; "
    "Monolith|Монолит|улуру; Uluru|Улуру; Moon|Луна; Sun|Солнце; Star|Звезда; Planet|Планета; Pando aspen|Пандо; Seagrass|Морская трава посидония; Lichen|Лишайник; Moss|Мох"))

k("natural_cosmetic_ingredients", "science", "Name a natural substance used in cosmetics", "Назовите природное вещество, которое используют в косметике",
  "A natural substance used in cosmetics: aloe vera, honey, beeswax, coconut oil, shea butter, olive oil, argan oil, clay, chamomile, rose water, lanolin, jojoba oil, almond oil, cocoa butter, glycerin, collagen, hyaluronic acid (natural), vitamin E, tea tree oil, lavender, salt, sugar, coffee, oatmeal, henna.",
  L("Aloe vera|Алоэ; Honey|Мёд; Beeswax|Пчелиный воск|воск; Coconut oil|Кокосовое масло; Shea butter|Масло ши; Olive oil|Оливковое масло; Argan oil|Аргановое масло; Clay|Глина; "
    "Chamomile|Ромашка; Rose water|Розовая вода; Lanolin|Ланолин; Jojoba oil|Масло жожоба; Almond oil|Миндальное масло; Cocoa butter|Масло какао; Glycerin|Глицерин; Collagen|Коллаген; "
    "Hyaluronic acid|Гиалуроновая кислота; Vitamin E|Витамин Е; Tea tree oil|Масло чайного дерева; Lavender|Лаванда; Salt|Соль|морская соль; Sugar|Сахар; Coffee|Кофе; Oatmeal|Овсянка; "
    "Henna|Хна; Basma|Басма; Green tea|Зелёный чай; Cucumber|Огурец; Lemon|Лимон; Avocado|Авокадо; Milk|Молоко; Yogurt|Йогурт; Egg|Яйцо; Rice|Рис; Seaweed|Водоросли; "
    "Spirulina|Спирулина; Mud|Грязь|лечебная грязь; Charcoal|Уголь; Pearl powder|Жемчужная пудра; Gold|Золото; Silver|Серебро; Mica|Слюда; Talc|Тальк; Zinc oxide|Оксид цинка; "
    "Calendula|Календула; Sea buckthorn oil|Облепиховое масло; Burdock oil|Репейное масло; Castor oil|Касторовое масло; Squalane|Сквалан; Snail mucin|Муцин улитки; Propolis|Прополис; "
    "Royal jelly|Маточное молочко; Rosehip oil|Масло шиповника; Grape seed oil|Масло виноградной косточки; Mint|Мята; Eucalyptus|Эвкалипт; Rosemary|Розмарин; Ginseng|Женьшень; Shea|Ши"))

k("naked_eye_sky_objects", "science", "Name something you can see in the night sky without a telescope", "Назовите объект, который можно увидеть в ночном небе без телескопа",
  "An object visible to the naked eye at night: Moon, stars, Polaris, Venus, Mars, Jupiter, Saturn, Mercury, Milky Way, Big Dipper, Orion, Sirius, comets, meteors, ISS, satellites, aurora, Andromeda galaxy, Pleiades, airplanes, clouds, Starlink.",
  L("Moon|Луна; Stars|Звёзды; Polaris|Полярная звезда; Venus|Венера; Mars|Марс; Jupiter|Юпитер; Saturn|Сатурн; Mercury|Меркурий; Milky Way|Млечный путь; Big Dipper|Большая Медведица|ковш; "
    "Little Dipper|Малая Медведица; Orion|Орион; Sirius|Сириус; Comet|Комета; Meteor|Метеор|падающая звезда; ISS|МКС; Satellite|Спутник; Aurora|Северное сияние; Andromeda|Туманность Андромеды; "
    "Pleiades|Плеяды; Airplane|Самолёт; Clouds|Облака; Starlink|Старлинк; Cassiopeia|Кассиопея; Vega|Вега; Betelgeuse|Бетельгейзе; Arcturus|Арктур; Capella|Капелла; Aldebaran|Альдебаран; "
    "Constellations|Созвездия; Zodiac|Знаки зодиака; Swan|Лебедь созвездие; Scorpius|Скорпион созвездие; Meteor shower|Звездопад|персеиды; Lunar eclipse|Лунное затмение; "
    "Noctilucent clouds|Серебристые облака; Zodiacal light|Зодиакальный свет; Magellanic Clouds|Магеллановы облака; Southern Cross|Южный крест; Bolide|Болид; Moon halo|Гало; "
    "Drones|Дроны; Fireworks|Салют; Lightning|Молния; Lanterns|Небесные фонарики; Orion Nebula|Туманность Ориона;  Blood moon|Кровавая луна"))

k("cave_things", "nature", "Name something you can find inside a cave", "Назовите то, что можно обнаружить внутри пещеры",
  "Something found in a cave: stalactites, stalagmites, bats, underground lake, river, crystals, cave paintings, darkness, echo, water drops, spiders, salamanders, bones, fossils, guano, moss, ice (ice caves), treasure, bears, explorers (speleologists).",
  L("Stalactites|Сталактиты; Stalagmites|Сталагмиты; Bats|Летучие мыши; Underground lake|Подземное озеро; Underground river|Подземная река; Crystals|Кристаллы; Cave paintings|Наскальные рисунки; "
    "Darkness|Темнота; Echo|Эхо; Water drops|Капли воды|капель; Spiders|Пауки; Salamander|Саламандра; Bones|Кости; Fossils|Окаменелости; Guano|Гуано; Moss|Мох; Ice|Лёд|ледяная пещера; "
    "Treasure|Сокровища|клад; Bear|Медведь; Speleologist|Спелеолог; Stalagnate|Сталагнат; Columns|Колонны; Mud|Глина; Rocks|Камни; Sand|Песок; Waterfall|Подземный водопад; "
    "Blind fish|Слепые рыбы; Olm|Протей; Cave cricket|Пещерный сверчок; Glowworms|Светлячки; Mushrooms|Грибы; Mold|Плесень; Rats|Крысы; Snakes|Змеи; Owls|Совы; "
    "Dragon|Дракон; Gollum|Голлум; Trolls|Тролли; Hermit|Отшельник; Primitive man|Первобытный человек|пещерный человек; Campfire remains|Кострище; Torch|Факел; Ropes|Верёвки; "
    "Helmet lamp|Каска с фонарём; Gold|Золото; Gemstones|Самоцветы; Geodes|Жеоды; Cave pearls|Пещерный жемчуг; Flowstone|Натёки; Gypsum flowers|Гипсовые цветы; Ice formations|Ледяные сталактиты"))

k("floating_natural_materials", "nature", "Name a natural material that floats on water", "Назовите природный материал, который держится на воде",
  "A natural material that floats: wood, cork, pumice, ice, coconut, bamboo, balsa, straw, reeds, feathers, leaves, dry grass, pine cones, seaweed (kelp with bladders), wax, oil, amber (in salt water), rubber (natural latex), cotton (briefly), sponge.",
  L("Wood|Дерево|древесина; Cork|Пробка; Pumice|Пемза; Ice|Лёд; Coconut|Кокос; Bamboo|Бамбук; Balsa|Бальса; Straw|Солома; Reeds|Камыш|тростник; Feathers|Перья; Leaves|Листья; "
    "Dry grass|Сухая трава|сено; Pine cones|Шишки; Kelp|Ламинария; Wax|Воск; Oil|Нефть|масло; Amber|Янтарь; Natural rubber|Каучук; Sponge|Губка; Driftwood|Коряга; Bark|Кора; "
    "Log|Бревно; Twigs|Ветки; Pine needles|Хвоя; Seeds|Семена; Acorns|Жёлуди; Walnuts|Грецкие орехи; Apples|Яблоки; Pollen|Пыльца; Fluff|Пух; Down|Тополиный пух; "
    "Papyrus|Папирус; Lotus leaf|Лист лотоса; Water lily|Кувшинка; Duckweed|Ряска; Peat|Торф; Charcoal|Уголь древесный; Birch bark|Береста; Wool|Шерсть; Cotton|Хлопок; Hay|Сено; "
    "Pumpkin|Тыква; Watermelon|Арбуз; Gourd|Калебас; Fat|Жир; Snow|Снег; Iceberg|Айсберг; Moss|Мох; Mushrooms|Грибы; Kapok|Капок"))

k("loud_natural_phenomena", "nature", "Name a natural phenomenon with a loud noise", "Назовите природное явление, которое сопровождается сильным шумом",
  "A natural phenomenon accompanied by loud noise: thunderstorm, thunder, volcanic eruption, earthquake, avalanche, landslide, hurricane, tornado, waterfall, storm at sea, tsunami, hail, ice breaking (ice drift), geyser, rockfall, meteor (sonic boom), glacier calving, sandstorm, blizzard.",
  L("Thunderstorm|Гроза; Thunder|Гром; Volcanic eruption|Извержение вулкана; Earthquake|Землетрясение; Avalanche|Лавина; Landslide|Оползень|обвал; Hurricane|Ураган; Tornado|Торнадо|смерч; "
    "Waterfall|Водопад; Sea storm|Шторм; Tsunami|Цунами; Hail|Град; Ice drift|Ледоход; Geyser|Гейзер; Rockfall|Камнепад; Meteor|Падение метеорита; Glacier calving|Обрушение ледника; "
    "Sandstorm|Песчаная буря; Blizzard|Метель|буран; Typhoon|Тайфун; Cyclone|Циклон; Mudflow|Сель; Surf|Прибой; Wind|Ветер|сильный ветер; Downpour|Ливень; Wildfire|Лесной пожар; "
    "Lightning|Молния; Hailstorm|Градобой; Squall|Шквал; Bore|Приливная волна; Tide|Прилив; Iceberg collapse|Раскол айсберга; Cracking ice|Треск льда; Sinkhole|Провал; "
    "Bird migration|Перелёт птиц; Locust swarm|Нашествие саранчи; Cicadas|Хор цикад; Frogs chorus|Лягушачий хор; Whale song|Песни китов; Rain|Дождь; Derecho|Дерехо; "
    "Mud volcano|Грязевой вулкан; Fumarole|Фумарола; Hot spring|Бурлящий источник; Rapids|Пороги; Stampede|Бегство стада"))

k("seasonal_size_objects", "nature", "Name a natural object that changes size with the seasons", "Назовите природный объект, который меняет размеры в зависимости от сезона",
  "A natural object whose size changes with the season: river (floods), lake, glacier, snowdrift, ice cap, polar ice, puddle, swamp, waterfall, tree crown, leaves, desert lake (playa), Lake Chad, Aral Sea, sea ice, permafrost layer, sand dune, iceberg, snow cover.",
  L("River|Река|разлив реки; Lake|Озеро; Glacier|Ледник; Snowdrift|Сугроб; Ice cap|Ледяная шапка; Polar ice|Полярные льды; Puddle|Лужа; Swamp|Болото; Waterfall|Водопад; "
    "Tree crown|Крона дерева; Leaves|Листва; Playa|Солончак; Lake Chad|Озеро Чад; Sea ice|Морской лёд; Snow cover|Снежный покров; Icicle|Сосулька; Iceberg|Айсберг; "
    "Pond|Пруд; Stream|Ручей; Reservoir|Водохранилище; Delta|Дельта; Flood plain|Пойма; Marsh|Топь; Oasis|Оазис; Dune|Дюна; Desert|Пустыня; Bush|Куст; Grass|Трава; "
    "Mushroom|Гриб; Pumpkin|Тыква; Moss|Мох; Algae bloom|Цветение воды;  Lake Baikal ice|Лёд Байкала; Amazon river|Амазонка; Nile|Нил; Okavango|Окаванго; "
    "Ice road|Зимник; Frozen lake|Замёрзшее озеро; Hare's fur|Мех зайца; Bear fat|Медведь жир; Snow cap|Снежная шапка горы; Mountain snow|Снег в горах"))

k("after_storm_beach", "nature", "Name something you can find on a beach after a storm", "Назовите то, что можно найти на морском берегу после шторма",
  "Something washed ashore after a storm: seaweed, shells, driftwood, jellyfish, starfish, amber (Baltic), dead fish, plastic, bottles, message in a bottle, ropes, nets, buoys, crabs, sea glass, stones, foam, wreckage, coconuts, logs.",
  L("Seaweed|Водоросли; Shells|Ракушки; Driftwood|Коряги|плавник; Jellyfish|Медузы; Starfish|Морские звёзды; Amber|Янтарь; Dead fish|Мёртвая рыба; Plastic|Пластик|мусор; "
    "Bottles|Бутылки; Message in a bottle|Послание в бутылке; Ropes|Верёвки|канаты; Fishing nets|Сети; Buoys|Буйки; Crabs|Крабы; Sea glass|Морское стекло; Stones|Камни|галька; "
    "Foam|Пена; Wreckage|Обломки|обломки корабля; Coconuts|Кокосы; Logs|Брёвна; Sand|Песок; Mussels|Мидии; Sea urchins|Морские ежи; Sponges|Губки; Cuttlebone|Скелет каракатицы; "
    "Shark egg|Яйцо акулы; Whale|Выброшенный кит; Seal|Тюлень; Birds|Птицы; Lost shoes|Шлёпанцы; Toys|Игрушки; Coins|Монеты; Treasure|Сокровища; Boat|Лодка; Oil|Нефтяные пятна; "
    "Tar balls|Мазут; Pumice|Пемза; Corals|Кораллы; Sea cucumber|Морской огурец; Octopus|Осьминог; Shrimp|Креветки; Lobster|Лобстер; Sea snail|Морская улитка; Kelp|Ламинария; "
    "Bones|Кости; Feathers|Перья; Branches|Ветки; Uprooted trees|Вырванные деревья; Sunbed|Шезлонг; Umbrella|Пляжный зонт; Fishing float|Поплавок"))

# ---------- 5. Food ----------
k("chocolate_fillings", "food", "Name a filling for chocolate sweets", "Назовите начинку для шоколадных конфет",
  "Something used as a filling in chocolates: praline, nuts, hazelnut, almond, caramel, nougat, marzipan, fondant, cream, liqueur, cherry, coconut, truffle ganache, jelly, fruit, souffle (Bird's milk), waffle, halva, rum, coffee, mint, condensed milk, prunes, dried apricots.",
  L("Praline|Пралине; Nuts|Орехи; Hazelnut|Фундук; Almond|Миндаль; Caramel|Карамель; Nougat|Нуга; Marzipan|Марципан; Fondant|Помадка; Cream|Крем; Liqueur|Ликёр; Cherry|Вишня|вишня в коньяке; "
    "Coconut|Кокос; Ganache|Ганаш|трюфель; Jelly|Желе; Fruit|Фрукты; Souffle|Суфле|птичье молоко; Waffle|Вафля; Halva|Халва; Rum|Ром; Coffee|Кофе; Mint|Мята; Condensed milk|Сгущёнка; "
    "Prunes|Чернослив; Dried apricots|Курага; Raisins|Изюм; Peanut butter|Арахисовая паста; Peanuts|Арахис; Pistachio|Фисташки; Walnut|Грецкий орех; Cashew|Кешью; Toffee|Ирис; "
    "Cognac|Коньяк; Whiskey|Виски; Strawberry|Клубника; Raspberry|Малина; Orange|Апельсин|апельсиновая цедра; Lemon|Лимон; Banana|Банан; Pineapple|Ананас; Mango|Манго; "
    "Yogurt|Йогурт; Curd|Творог; Milk cream|Молочная начинка; Honey|Мёд; Sesame|Кунжут; Rice crisps|Воздушный рис; Cookie|Печенье; Biscuit|Бисквит; Marshmallow|Маршмеллоу; "
    "Salted caramel|Солёная карамель; Nutella|Нутелла; Cranberry|Клюква; Chili|Перец чили; Sea salt|Морская соль"))

k("shelled_foods", "food", "Name a food usually peeled from its shell before eating", "Назовите продукт, который перед едой обычно очищают от скорлупы",
  "A food whose shell or hard casing is removed before eating: egg, walnut, hazelnut, pistachio, peanut, almond, chestnut, coconut, sunflower seeds, pumpkin seeds, cedar nuts, shrimp, crab, lobster, crayfish, oyster, mussel, quail egg, Brazil nut, cashew, pecan, macadamia.",
  L("Egg|Яйцо; Walnut|Грецкий орех; Hazelnut|Фундук|лесной орех; Pistachio|Фисташки; Peanut|Арахис; Almond|Миндаль; Chestnut|Каштан; Coconut|Кокос; Sunflower seeds|Семечки; "
    "Pumpkin seeds|Тыквенные семечки; Cedar nuts|Кедровые орехи; Shrimp|Креветки; Crab|Краб; Lobster|Лобстер|омар; Crayfish|Раки; Oyster|Устрицы; Mussel|Мидии; Quail egg|Перепелиное яйцо; "
    "Brazil nut|Бразильский орех; Cashew|Кешью; Pecan|Пекан; Macadamia|Макадамия; Langoustine|Лангустин; Scallop|Гребешок; Clam|Моллюски; Snail|Улитки; Sea urchin|Морской ёж; "
    "King crab|Камчатский краб; Duck egg|Утиное яйцо; Ostrich egg|Страусиное яйцо; Lychee|Личи; Longan|Лонган; Rambutan|Рамбутан; Mangosteen|Мангустин; Pomegranate|Гранат; "
    "Tamarind|Тамаринд; Pine nuts|Кедровые орешки; Acorn|Жёлудь; Hickory nut|Гикори; Kola nut|Кола; Betel nut|Бетель; Hemp seeds|Семена конопли; Watermelon seeds|Арбузные семечки; "
    "Balut|Балют; Century egg|Столетнее яйцо; Abalone|Морское ушко; Prawn|Креветка тигровая"))

k("long_oven_dishes", "food", "Name a dish traditionally cooked in the oven for a long time", "Назовите блюдо, которое традиционно долго готовят в духовке",
  "A dish slow-cooked or baked for a long time in an oven: roast duck with apples, baked ham, roast beef, pot roast, lasagna, casserole, stuffed turkey, pulled pork, baked potatoes, meat in pots, gratin, beef bourguignon, cassoulet, lamb shoulder, cholent, moussaka, braised cabbage, baked pumpkin, bread.",
  L("Roast duck|Утка с яблоками|запечённая утка; Baked ham|Буженина; Roast beef|Ростбиф; Pot roast|Жаркое; Lasagna|Лазанья; Casserole|Запеканка; Stuffed turkey|Индейка запечённая|фаршированная индейка; "
    "Pulled pork|Пулд порк; Baked potatoes|Запечённый картофель; Meat in pots|Мясо в горшочках|жаркое в горшочках; Gratin|Гратен; Beef bourguignon|Бёф бургиньон; Cassoulet|Кассуле; "
    "Lamb shoulder|Баранья лопатка; Cholent|Чолнт; Moussaka|Мусака; Braised cabbage|Тушёная капуста; Baked pumpkin|Запечённая тыква; Bread|Хлеб; Goose|Гусь с яблоками; "
    "Pork knuckle|Рулька; Ribs|Рёбрышки; Brisket|Брискет; Meat French style|Мясо по французски; Kulebyaka|Кулебяка; Pie|Пирог; Kulich|Кулич; Fruitcake|Кекс; Cheesecake|Чизкейк; "
    "Baked fish|Запечённая рыба; Chicken|Курица в духовке|запечённая курица; Stuffed peppers|Фаршированные перцы; Stuffed pepper|Голубцы; Ratatouille|Рататуй; Shepherd's pie|Пастуший пирог; "
    "Meatloaf|Мясной рулет; Wellington|Говядина Веллингтон; Paella|Паэлья; Tajine|Тажин; Biryani|Бирьяни; Osso buco|Оссобуко; Coq au vin|Петух в вине; Stew|Рагу; Baked beans|Печёная фасоль; "
    "Granola|Гранола; Meringue|Безе; Jerky|Вяленое мясо; Baked apples|Печёные яблоки; Pumpkin porridge|Тыквенная каша; Buckwheat in pot|Гречка в горшочке; Lamb|Баранина; Veal|Телятина"))

k("drinks_with_fruit_pieces", "food", "Name a drink that can contain pieces of fruit", "Назовите напиток, в котором могут быть кусочки фруктов",
  "A drink that can contain pieces of fruit: sangria, compote, smoothie, lemonade, punch, mojito, fruit tea, cocktail, juice with pulp, mulled wine, bubble tea, iced tea, kombucha, infused water, yogurt drink, Aloe drink, sparkling wine with berries.",
  L("Sangria|Сангрия; Compote|Компот; Smoothie|Смузи; Lemonade|Лимонад; Punch|Пунш; Mojito|Мохито; Fruit tea|Фруктовый чай; Cocktail|Коктейль; Juice with pulp|Сок с мякотью; "
    "Mulled wine|Глинтвейн; Bubble tea|Бабл ти; Iced tea|Холодный чай; Kombucha|Комбуча|чайный гриб; Infused water|Вода с фруктами|детокс вода; Drinking yogurt|Питьевой йогурт; "
    "Aloe drink|Напиток с алоэ; Pina colada|Пина колада; Daiquiri|Дайкири; Margarita|Маргарита; Caipirinha|Кайпиринья; Tea with lemon|Чай с лимоном; Uzvar|Узвар; Mors|Морс; "
    "Kvass|Квас; Milkshake|Молочный коктейль; Fruit kefir|Фруктовый кефир;  Cider|Сидр; Fruit beer|Фруктовое пиво; Spritz|Спритц; Pimm's|Пиммс; Sbiten|Сбитень; "
    "Hot toddy|Грог; Lemon water|Вода с лимоном;  Fruit punch|Фруктовый пунш; Tropical juice|Тропический сок; Coconut water|Кокосовая вода; Agua fresca|Агуа фреска; "
    "Horchata|Орчата; Lassi|Ласси; Mango lassi|Манго ласси; Sangria blanca|Белая сангрия; Mimosa|Мимоза; Bellini|Беллини; Fizz|Физз; Shake|Шейк; Fruit soda|Фруктовая газировка; "
    "Jelly drink|Желейный напиток; Chia drink|Напиток с семенами чиа"))

k("festive_table_dishes", "food", "Name a dish traditionally served on a festive table", "Назовите блюдо, которое традиционно подают на праздничный стол",
  "A dish traditionally served at celebrations or holidays: Olivier salad, herring under a fur coat, jellied meat (kholodets), mimosa salad, roast duck, stuffed turkey, red caviar sandwiches, cake, napoleon, tangerines, sandwiches with sprats, crab salad, meat in French style, pelmeni, pies, kulich, paskha, roast goose.",
  L("Olivier salad|Оливье; Herring under a fur coat|Селёдка под шубой|шуба; Jellied meat|Холодец|студень; Mimosa salad|Мимоза; Roast duck|Утка запечённая; Stuffed turkey|Индейка; "
    "Red caviar|Бутерброды с икрой|красная икра; Cake|Торт; Napoleon|Наполеон; Tangerines|Мандарины; Sprats|Бутерброды со шпротами|шпроты; Crab salad|Крабовый салат; "
    "Meat French style|Мясо по французски; Pelmeni|Пельмени; Pies|Пироги; Kulich|Кулич; Paskha|Пасха творожная; Roast goose|Гусь; Vinegret|Винегрет; Aspic|Заливное; "
    "Fish in aspic|Заливная рыба; Stuffed eggs|Фаршированные яйца; Canapés|Канапе; Tartlets|Тарталетки; Cold cuts|Мясная нарезка; Cheese plate|Сырная тарелка; Caesar|Цезарь; "
    "Greek salad|Греческий салат; Baked ham|Буженина; Shashlik|Шашлык; Plov|Плов; Khachapuri|Хачапури; Honey cake|Медовик; Prague cake|Прага; Kutya|Кутья; Bliny|Блины; "
    "Pickles|Соленья; Pickled cucumbers|Солёные огурцы; Pickled mushrooms|Маринованные грибы; Salmon|Красная рыба|сёмга; Christmas pudding|Рождественский пудинг; Panettone|Панеттоне; "
    "Stollen|Штоллен; Roast beef|Ростбиф; Baked salmon|Запечённый лосось; Lasagna|Лазанья; Pizza|Пицца; Sushi|Суши|роллы;  Gingerbread|Пряники; "
    "  Lamb|Барашек; Turkey|Индейка на День благодарения; Fruit salad|Фруктовый салат; Kholodets|Холодец говяжий"))

k("sugar_substitutes", "food", "Name a product used instead of ordinary sugar to sweeten food", "Назовите продукт, который используют вместо обычного сахара",
  "A sweetener used instead of regular sugar: honey, stevia, maple syrup, agave syrup, xylitol, erythritol, sucralose, aspartame, saccharin, fructose, date syrup, coconut sugar, molasses, Jerusalem artichoke syrup, dates, raisins, banana, sweetener tablets, monk fruit.",
  L("Honey|Мёд; Stevia|Стевия; Maple syrup|Кленовый сироп; Agave syrup|Сироп агавы; Xylitol|Ксилит; Erythritol|Эритрит; Sucralose|Сукралоза; Aspartame|Аспартам; Saccharin|Сахарин; "
    "Fructose|Фруктоза; Date syrup|Финиковый сироп; Coconut sugar|Кокосовый сахар; Molasses|Патока|меласса; Jerusalem artichoke syrup|Сироп топинамбура; Dates|Финики; Raisins|Изюм; "
    "Banana|Банан; Sweetener|Сахарозаменитель; Monk fruit|Монк фрут|ло хан го; Glucose|Глюкоза; Sorbitol|Сорбит;  Rice syrup|Рисовый сироп; "
    "Corn syrup|Кукурузный сироп; Jam|Варенье; Fruit puree|Фруктовое пюре; Applesauce|Яблочное пюре; Dried apricots|Курага; Prunes|Чернослив; Figs|Инжир; Condensed milk|Сгущёнка; "
    "Licorice root|Солодка; Carob|Кэроб; Isomalt|Изомальт; Maltitol|Мальтит; Tagatose|Тагатоза; Allulose|Аллюлоза; Birch sugar|Берёзовый сахар; Treacle|Тёмная патока; "
    "Golden syrup|Золотой сироп; Barley malt|Ячменный солод; Malt syrup|Солодовый сироп; Sugar beet syrup|Свекловичный сироп; Grape juice|Виноградный сок; Cinnamon|Корица; Vanilla|Ваниль"))

k("fish_dishes", "food", "Name a dish whose main ingredient is fish", "Назовите блюдо, в котором основной ингредиент рыба",
  "A dish mainly made of fish: ukha, fish and chips, sushi, sashimi, herring under a fur coat, fish cakes, baked salmon, fried fish, fish pie, ceviche, poke, tuna salad, gefilte fish, fish in aspic, kulebyaka with fish, stroganina, forshmak, fish soup, bouillabaisse, sprats, smoked mackerel.",
  L("Ukha|Уха; Fish and chips|Фиш энд чипс; Sushi|Суши; Sashimi|Сашими; Herring under a fur coat|Селёдка под шубой; Fish cakes|Рыбные котлеты; Baked salmon|Запечённый лосось; "
    "Fried fish|Жареная рыба; Fish pie|Рыбный пирог|рыбник; Ceviche|Севиче; Poke|Поке; Tuna salad|Салат с тунцом; Gefilte fish|Фаршированная рыба; Fish in aspic|Заливная рыба; "
    "Kulebyaka|Кулебяка с рыбой; Stroganina|Строганина; Forshmak|Форшмак; Fish soup|Рыбный суп; Bouillabaisse|Буйабес; Sprats|Шпроты; Smoked mackerel|Копчёная скумбрия; Rolls|Роллы; "
    "Fish sticks|Рыбные палочки; Herring with potatoes|Селёдка с картошкой; Salted herring|Солёная селёдка; Vobla|Вобла; Tarama|Тарама; Fish tacos|Тако с рыбой; Tuna steak|Стейк из тунца; "
    "Grilled salmon|Лосось на гриле; Fish curry|Рыбное карри; Fish kebab|Шашлык из рыбы; Salmon tartare|Тартар из лосося; Carpaccio|Карпаччо из рыбы; Gravlax|Гравлакс; "
    "Rollmops|Рольмопс; Lutefisk|Лютефиск; Surströmming|Сюрстрёмминг; Fish under marinade|Рыба под маринадом; Pozharsky fish|Рыба по польски; Fish in batter|Рыба в кляре; "
    "Mimosa salad|Мимоза; Fish solyanka|Рыбная солянка; Fish dumplings|Пельмени с рыбой; Fish pirozhki|Пирожки с рыбой; Rasstegai|Расстегаи; Fish shashlik|Рыбный шашлык; "
    "Pike cutlets|Щучьи котлеты; Stuffed pike|Фаршированная щука; Carp in sour cream|Карась в сметане; Trout|Форель запечённая; Dorado|Дорадо на гриле; Sea bass|Сибас"))

k("flake_foods", "food", "Name a food sold as flakes", "Назовите продукт питания, который продаётся в виде хлопьев",
  "A food product sold in flake form: oat flakes, corn flakes, buckwheat flakes, rice flakes, wheat flakes, muesli, granola, coconut flakes, almond flakes, potato flakes (instant mash), chili flakes, salt flakes, nutritional yeast, fish flakes (bonito), barley flakes, rye flakes, quinoa flakes, Hercules.",
  L("Oat flakes|Овсяные хлопья|геркулес; Corn flakes|Кукурузные хлопья; Buckwheat flakes|Гречневые хлопья; Rice flakes|Рисовые хлопья; Wheat flakes|Пшеничные хлопья; Muesli|Мюсли; "
    "Granola|Гранола; Coconut flakes|Кокосовая стружка; Almond flakes|Миндальные лепестки; Potato flakes|Картофельное пюре быстрого приготовления|картофельные хлопья; Chili flakes|Хлопья чили; "
    "Salt flakes|Хлопья соли|мальдон; Nutritional yeast|Пищевые дрожжи; Bonito flakes|Тунцовая стружка|кацуобуси; Barley flakes|Ячменные хлопья; Rye flakes|Ржаные хлопья; Quinoa flakes|Хлопья киноа; "
    "Hercules|Геркулес; Millet flakes|Пшённые хлопья; Bran flakes|Хлопья с отрубями; Chocolate cereal|Шоколадные хлопья; Frosted Flakes|Хлопья в глазури; Nesquik cereal|Несквик хлопья; "
    "Cheerios|Чириос; Special K|Спешл кей; Instant oatmeal|Каша быстрого приготовления; Baby cereal|Детская каша; Pea flakes|Гороховые хлопья; Lentil flakes|Чечевичные хлопья; "
    "Spelt flakes|Хлопья полбы; Flaxseed flakes|Льняные хлопья; Seaweed flakes|Хлопья нори; Parsley flakes|Сушёная петрушка; Onion flakes|Луковые хлопья; Garlic flakes|Чесночные хлопья; "
    "Tuna flakes|Тунец хлопьями; Fish flakes|Рыбные хлопья; Coconut chips|Кокосовые чипсы; Chocolate flakes|Шоколадная стружка; Butter flakes|Масло; Poha|Поха; Cornflakes Nestle|Корнфлекс"))
