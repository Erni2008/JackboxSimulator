# THINK OR DIE category content, part X (list 7, questions 1-30; duplicates of existing categories skipped).
from cats_a import cat
from cats_k import ru_rule, ru_word


def k(id, group, en, ru, crit, lines, inv="", type="KNOWLEDGE", **kw):
    cat(id, type, group, en, ru, crit, crit, lines, inv, **kw)


def L(*xs):
    return "\n".join(xs)


# ---------- 1. Unusual properties of objects ----------
k("heat_changes_shape", "everyday", "Name something that changes shape when heated", "Назовите предмет, который при нагревании меняет форму",
  "An object or material that melts, bends, expands or otherwise changes shape when heated: candle, plastic bottle, chocolate, ice, butter, cheese, wax, popcorn kernel, marshmallow, glass, metal rod, rubber, crayon, shrink film, balloon, bimetallic strip.",
  L("Candle|Свеча", "Plastic bottle|Пластиковая бутылка", "Chocolate|Шоколад", "Ice|Лёд", "Butter|Масло сливочное", "Cheese|Сыр", "Wax|Воск", "Popcorn|Попкорн|зерно кукурузы",
    "Marshmallow|Маршмеллоу", "Glass|Стекло", "Metal rod|Металлический прут", "Rubber|Резина", "Crayon|Восковой мелок", "Shrink film|Термоусадочная плёнка|термоусадка",
    "Balloon|Воздушный шар", "Bimetallic strip|Биметаллическая пластина", "Ice cream|Мороженое", "Snowman|Снеговик", "Plasticine|Пластилин", "Chewing gum|Жвачка", "Sugar|Сахар|карамель",
    "Dough|Тесто", "Bread|Хлеб", "Egg|Яйцо", "Meat|Мясо", "Plastic cup|Пластиковый стаканчик", "Vinyl record|Виниловая пластинка", "Lead|Свинец", "Tin|Олово", "Solder|Припой",
    "Iron|Железо", "Steel|Сталь", "Gold|Золото", "Hot glue|Термоклей", "Thermoplastic|Термопластик", "Rail|Рельс", "Wire|Провод", "Asphalt|Асфальт", "Tar|Гудрон",
    "Paraffin|Парафин", "Soap|Мыло", "Jelly|Желе", "Lipstick|Помада", "Gummy bear|Мармелад", "Fat|Жир", "Lard|Сало", "Ice cube|Кубик льда", "Icicle|Сосулька",
    "Snow|Снег", "Plastic toy|Пластиковая игрушка", "Shoe sole|Подошва", "Car tire|Шина", "Polyethylene bag|Пакет", "Wooden plank|Доска|дерево", "Clay|Глина",
    "Bimetal thermostat|Термостат", "Mercury in thermometer|Ртуть в градуснике", "Thermometer|Градусник", "Bridge|Мост", "Hair|Волосы"))

k("flat_pack_items", "everyday", "Name something usually sold disassembled", "Назовите то, что обычно продаётся в разобранном виде",
  "A product typically sold unassembled (flat-pack or kit): IKEA furniture, wardrobe, bed, table, shelf, chair, bicycle (partly), LEGO set, model airplane kit, construction set, puzzle, tent, trampoline, swing set, bookcase, desk, cabinet, greenhouse, PC parts.",
  L("IKEA furniture|Мебель из Икеи|икея", "Wardrobe|Шкаф", "Bed|Кровать", "Table|Стол", "Shelf|Полка|стеллаж", "Chair|Стул", "Bicycle|Велосипед", "LEGO set|Лего|набор лего",
    "Model kit|Сборная модель", "Construction set|Конструктор", "Puzzle|Пазл", "Tent|Палатка", "Trampoline|Батут", "Swing set|Качели", "Bookcase|Книжный шкаф", "Desk|Письменный стол",
    "Cabinet|Тумба", "Greenhouse|Теплица", "Sofa|Диван", "Kitchen set|Кухонный гарнитур|кухня", "Chest of drawers|Комод", "Bunk bed|Двухъярусная кровать",
    "Crib|Детская кроватка", "Stroller|Коляска", "Office chair|Компьютерное кресло", "Gaming chair|Игровое кресло", "Treadmill|Беговая дорожка", "Exercise bike|Велотренажёр",
    "Barbecue grill|Мангал", "Garden furniture|Садовая мебель", "Gazebo|Беседка", "Shed|Сарай", "Fence|Забор", "Doghouse|Будка", "Cat tree|Когтеточка домик", "Aquarium stand|Тумба под аквариум",
    "Christmas tree|Искусственная ёлка", "Playhouse|Детский домик", "Slide|Детская горка", "Pool|Каркасный бассейн", "Scooter|Самокат", "Electric scooter|Электросамокат",
    "Drone kit|Дрон в разборе", "Robot kit|Набор робототехники", "Wooden model|Деревянная модель", "Ship in a bottle kit|Модель корабля", "Kit car|Кит кар", "Prefab house|Сборный дом",
    "Modular house|Модульный дом", "Scaffolding|Леса", "Shelving|Стеллаж металлический", "Workbench|Верстак", "Hanger|Вешалка напольная",
    "Shoe rack|Обувница", "TV stand|Тумба под телевизор", "Dining set|Обеденная группа", "Bar stool|Барный стул", "Wardrobe IKEA Pax|Пакс"))

k("open_once_items", "everyday", "Name something you can open but cannot close back as it was", "Назовите то, что можно открыть, но нельзя закрыть обратно в первоначальном виде",
  "Something that, once opened, cannot be restored to its original sealed state: egg, can of food, soda can, envelope, letter, gift wrap, sealed package, seal, milk carton, chips packet, walnut, coconut, oyster, champagne bottle (cork), blister pack, tea bag, chocolate wrapper, Kinder Surprise.",
  L("Egg|Яйцо", "Can|Консервная банка", "Soda can|Банка газировки", "Envelope|Конверт", "Letter|Письмо", "Gift wrap|Подарочная упаковка|подарок", "Sealed package|Запечатанная упаковка",
    "Seal|Пломба", "Milk carton|Пакет молока", "Chips packet|Пачка чипсов", "Walnut|Грецкий орех", "Coconut|Кокос", "Oyster|Устрица", "Champagne bottle|Бутылка шампанского",
    "Blister pack|Блистер с таблетками", "Chocolate wrapper|Обёртка шоколадки", "Kinder Surprise|Киндер сюрприз", "Pistachio|Фисташка", "Banana|Банан", "Orange|Апельсин",
    "Watermelon|Арбуз", "Pomegranate|Гранат", "Cocoon|Кокон", "Shell|Ракушка", "Ampoule|Ампула", "Vial|Флакон с лекарством", "Glow stick|Светящаяся палочка", "Cracker|Хлопушка",
    "Firecracker|Петарда", "Surprise egg|Яйцо с сюрпризом", "Lottery ticket|Лотерейный билет|скретч карта", "Scratch card|Скретч карта", "Ballot|Бюллетень", "Wax seal|Сургучная печать",
    "Bag of flour|Мешок муки", "Coffee vacuum pack|Вакуумная упаковка кофе", "Yogurt cup|Стаканчик йогурта", "Juice box|Сок в пакете", "Instant noodles|Бичпакет|лапша быстрого приготовления",
    "Sweet wrapper|Фантик конфеты", "Tin of caviar|Банка икры", "Bottle cap|Крышка с кольцом", "Safety seal|Защитная мембрана", "Toothpaste membrane|Мембрана тюбика",
    "New phone box|Коробка нового телефона", "Card pack|Колода в плёнке", "Booster pack|Бустер карт", "Mystery box|Мистери бокс", "Parachute|Парашют", "Airbag|Подушка безопасности",
    "Fire extinguisher|Огнетушитель", "Zip tie|Стяжка", "Piñata|Пиньята", "Book with uncut pages|Книга с неразрезанными страницами", "Can of paint|Банка краски", "Wine bottle|Бутылка вина",
    "Beer can|Банка пива", "Pringles tube|Банка чипсов", "Sardines|Шпроты|банка шпрот", "Flower bud|Бутон", "Cookie fortune|Печенье с предсказанием"))

k("layered_things", "everyday", "Name something that has several layers but is not clothing", "Назовите то, что состоит из нескольких слоёв, но не является одеждой",
  "A thing made of several layers (not clothing): cake, onion, lasagna, puff pastry, plywood, sandwich, earth's crust, atmosphere, skin, paint, cabbage, matryoshka, napoleon cake, glass laminate, asphalt road, wall plaster, toilet paper, cardboard.",
  L("Cake|Торт", "Onion|Лук|луковица", "Lasagna|Лазанья", "Puff pastry|Слоёное тесто", "Plywood|Фанера", "Sandwich|Сэндвич|бутерброд", "Earth's crust|Земная кора", "Atmosphere|Атмосфера",
    "Skin|Кожа", "Paint|Краска слоями", "Cabbage|Капуста", "Matryoshka|Матрёшка", "Napoleon cake|Наполеон", "Laminated glass|Многослойное стекло|триплекс", "Asphalt road|Дорожное покрытие",
    "Plaster|Штукатурка", "Toilet paper|Туалетная бумага", "Cardboard|Картон", "Herring under fur coat|Селёдка под шубой|шуба", "Mimosa salad|Мимоза", "Burger|Бургер",
    "Croissant|Круассан", "Baklava|Пахлава", "Mille-feuille|Мильфей", "Tiramisu|Тирамису", "Honey cake|Медовик", "Smith Island cake|Слоёный торт", "Club sandwich|Клаб сэндвич",
    "Rock|Горная порода", "Sedimentary rock|Осадочные породы", "Tree trunk|Ствол дерева|годичные кольца", "Pearl|Жемчужина", "Ice sheet|Ледник", "Ocean|Океан", "Soil|Почва",
    "Planet|Планета", "Egg|Яйцо", "Eye|Глаз", "Tooth|Зуб", "Brain|Мозг", "Book|Книга", "Notebook|Тетрадь", "Mattress|Матрас", "Blanket|Одеяло", "Pillow|Подушка",
    "Wall|Стена", "Window|Стеклопакет", "Floor|Пол", "Roof|Крыша", "Paper cup|Бумажный стакан", "Tetra Pak|Тетрапак", "Battery|Аккумулятор", "Circuit board|Печатная плата",
    "Solar panel|Солнечная панель", "Car tire|Шина", "Bulletproof vest|Бронежилет", "Ski|Лыжа", "Snowboard|Сноуборд", "Skateboard deck|Дека скейтборда", "Parquet|Паркет",
    "Laminate|Ламинат", "Wallpaper|Обои", "Bandage|Повязка", "Medical mask|Медицинская маска", "Diaper|Подгузник", "Sponge cake|Бисквит", "Jelly cake|Желейный торт", "Mountain|Гора"))

k("hollow_hard_things", "everyday", "Name something hollow inside but hard outside", "Назовите то, что полое внутри, но твёрдое снаружи",
  "Something hollow inside with a hard shell or walls: egg shell, nut shell, coconut, ball, bottle, pipe, tube, bamboo, drum, bell, chocolate egg, skull, seashell, vase, globe, trumpet, flute, bone (marrow aside), helmet, piggy bank, Easter egg.",
  L("Egg shell|Яичная скорлупа", "Nut|Орех", "Coconut|Кокос", "Ball|Мяч", "Bottle|Бутылка", "Pipe|Труба", "Tube|Трубка", "Bamboo|Бамбук", "Drum|Барабан", "Bell|Колокол",
    "Chocolate egg|Шоколадное яйцо", "Skull|Череп", "Seashell|Ракушка", "Vase|Ваза", "Globe|Глобус", "Trumpet|Труба музыкальная", "Flute|Флейта", "Bone|Кость", "Helmet|Шлем",
    "Piggy bank|Копилка", "Easter egg|Пасхальное яйцо", "Kinder Surprise|Киндер сюрприз", "Pumpkin|Тыква", "Bell pepper|Перец", "Walnut|Грецкий орех", "Chestnut|Каштан",
    "Snail shell|Раковина улитки", "Turtle shell|Панцирь черепахи", "Crab shell|Панцирь краба", "Matryoshka|Матрёшка", "Can|Банка", "Barrel|Бочка", "Bucket|Ведро", "Box|Коробка",
    "Safe|Сейф", "Pot|Горшок", "Jug|Кувшин", "Cup|Чашка", "Glass|Стакан", "Lamp bulb|Лампочка", "Aquarium|Аквариум", "Snow globe|Снежный шар", "Christmas ball|Ёлочный шар",
    "Guitar|Гитара", "Violin|Скрипка", "Cello|Виолончель", "Saxophone|Саксофон", "Tuba|Туба", "Organ pipe|Органная труба", "Chimney|Дымоход", "Tunnel|Туннель", "Cave|Пещера",
    "Tree hollow|Дупло", "Beehive|Улей", "Wasp nest|Осиное гнездо", "Shell casing|Гильза", "Pen body|Корпус ручки", "Straw|Соломинка", "Macaron|Макарон",
    "Profiterole|Профитроль", "Eclair|Эклер", "Meringue|Безе", "Waffle cone|Вафельный рожок", "Pipe organ|Орган", "Submarine|Подводная лодка", "Rocket|Ракета",
    "Airplane fuselage|Фюзеляж", "Tank|Бак|цистерна", "Gas cylinder|Газовый баллон", "Thermos|Термос", "Hollow brick|Пустотелый кирпич", "Concrete ring|Бетонное кольцо"))

k("symmetric_things", "everyday", "Name something that is usually made symmetrical", "Назовите предмет, который обычно делают симметричным",
  "An object typically designed to be symmetrical: ball, plate, wheel, glasses, butterfly kite, airplane, car, vase, mirror frame, chair, table, bed, scissors, bow tie, snowflake decoration, Christmas ornament, tennis racket, guitar body, dome, building facade, mask, logo.",
  L("Ball|Мяч", "Plate|Тарелка", "Wheel|Колесо", "Glasses|Очки", "Kite|Воздушный змей", "Airplane|Самолёт", "Car|Машина", "Vase|Ваза", "Mirror|Зеркало", "Chair|Стул",
    "Table|Стол", "Bed|Кровать", "Scissors|Ножницы", "Bow tie|Бабочка галстук", "Snowflake|Снежинка", "Christmas ornament|Ёлочная игрушка", "Tennis racket|Теннисная ракетка",
    "Guitar|Гитара", "Dome|Купол", "Building facade|Фасад здания", "Mask|Маска", "Logo|Логотип", "Butterfly|Бабочка", "Heart shape|Сердечко", "Star|Звезда", "Coin|Монета",
    "Medal|Медаль", "Clock face|Циферблат", "Bowl|Миска", "Cup|Чашка", "Bottle|Бутылка", "Lamp|Лампа", "Chandelier|Люстра", "Window|Окно", "Door|Двери двустворчатые",
    "Gate|Ворота", "Bridge|Мост", "Arch|Арка", "Temple|Храм", "Cathedral|Собор", "Pyramid of Giza|Пирамида", "Taj Mahal|Тадж Махал", "Eiffel Tower|Эйфелева башня",
    "Boat|Лодка", "Ship|Корабль", "Rocket|Ракета", "Drone|Дрон", "Paper airplane|Бумажный самолётик", "Origami|Оригами", "Mandala|Мандала", "Carpet|Ковёр", "Tile|Плитка",
    "Pillow|Подушка", "Sofa|Диван", "Shoes pair|Пара обуви", "Gloves|Перчатки", "Earrings|Серьги", "Crown|Корона", "Shield|Щит", "Bow|Лук", "Violin|Скрипка", "Drum|Барабан",
    "Skis|Лыжи", "Glasses frame|Оправа", "Headphones|Наушники", "Backpack|Рюкзак", "Envelope|Конверт", "Flag|Флаг", "Fan|Веер", "Umbrella|Зонт", "Dice|Кубик|игральная кость",
    "Rubik's cube|Кубик Рубика", "Chessboard|Шахматная доска", "Football field|Футбольное поле", "Stadium|Стадион"))

k("lidded_non_dishes", "everyday", "Name something with a lid that is not tableware", "Назовите то, у чего есть крышка, но это не посуда",
  "An object that has a lid (not pots, pans or cups): piano, laptop, toilet, chest, coffin, box, trash can, washing machine, suitcase, jewelry box, music box, well, manhole, aquarium, grand piano, pen (cap), lipstick, cooler bag, sandbox, barrel, freezer, phone case, camera lens.",
  L("Piano|Пианино|рояль", "Laptop|Ноутбук", "Toilet|Унитаз", "Chest|Сундук", "Coffin|Гроб", "Box|Коробка", "Trash can|Мусорное ведро|мусорка", "Washing machine|Стиральная машина",
    "Suitcase|Чемодан", "Jewelry box|Шкатулка", "Music box|Музыкальная шкатулка", "Well|Колодец", "Manhole|Люк", "Aquarium|Аквариум", "Pen|Ручка с колпачком|фломастер",
    "Lipstick|Помада", "Cooler bag|Сумка холодильник", "Sandbox|Песочница", "Barrel|Бочка", "Freezer|Морозильный ларь", "Lens|Объектив с крышкой", "Piggy bank|Копилка",
    "Shoebox|Обувная коробка", "Toolbox|Ящик с инструментами", "Lunch box|Ланч бокс", "Thermos|Термос", "Water bottle|Бутылка воды", "Perfume|Духи", "Deodorant|Дезодорант",
    "Shampoo|Шампунь", "Toothpaste|Зубная паста", "Cream jar|Баночка крема", "Paint can|Банка краски", "Glue|Клей", "Marker|Маркер", "Felt-tip pen|Фломастер",
    "Mailbox|Почтовый ящик", "Ballot box|Урна для голосования", "Grill|Гриль", "Barbecue|Барбекю", "Car trunk|Багажник", "Car hood|Капот", "Fuel tank|Бензобак",
    "Septic tank|Септик", "Water tank|Бак для воды", "Hatch|Люк", "Desk|Парта", "School desk|Парта старая", "Cash box|Касса", "Safe|Сейф", "Cigarette case|Портсигар",
    "Pocket watch|Карманные часы", "Lighter|Зажигалка Зиппо", "Compact powder|Пудреница", "Snuff box|Табакерка", "Crate|Ящик", "Container|Контейнер", "Tupperware|Ланчбокс пластиковый",
    "Jar|Банка", "Bin|Бак", "Dumpster|Мусорный бак", "Urn|Урна", "Casket|Ларец", "Treasure chest|Сундук с сокровищами", "Phone|Раскладушка телефон", "Nintendo DS|Нинтендо дс",
    "Camera|Фотоаппарат", "Battery compartment|Отсек для батареек", "Socket|Розетка с крышкой", "Jacuzzi|Джакузи", "Pool|Бассейн с крышкой", "Bread bin|Хлебница"),
  "Pot/Кастрюля/Pan/Сковорода/Teapot/Чайник/Cup/Чашка")

# ---------- 2. Word challenges ----------
k("words_starting_with_animal_ru", "vocabulary", "Name a word that starts with the name of an animal", "Назовите слово, которое начинается с названия животного",
  "A Russian word whose beginning is an animal name: котлета (кот), ракета (рак), лосьон (лось), осанка (оса), коз), уживать (уж), сомнение (сом), барсучиха, кротость (крот), слонять (слон), волосы (вол), бобёр, мышление (мышь), конфета (конь no).",
  L("Cutlet|Котлета", "Rocket|Ракета", "Lotion|Лосьон", "Posture|Осанка", "Doubt|Сомнение", "Meekness|Кротость", "Wander|Слоняться", "Hair|Волосы", "Thinking|Мышление",
    "Boiler|Котёл", "Purse|Кошелёк", "Cabinet|Котлован", "Shell|Раковина", "Mussel|Ракушка", "Bullock|Бычок",
    "Crane bird|Журавлик", "Dog shed|Псарня", "Owl|Совет|совок", "Shovel|Совок", "Mosquito net|Комарик", "Spider web|Паутина",
    "Elk|Лосось", "Salmon|Лосось рыба", "Lion's|Левша", "Left-hander|Левша", "Fox|Лисичка", "Bear|Медведица", "Ram|Баранка", "Bagel|Баранка",
    "Goat|Козырь", "Trump card|Козырь", "Visor|Козырёк", "Bull|Быт|бытие", "Cat|Котелок", "Bowler hat|Котелок шляпа", "Dove|Голубика",
    "Blueberry|Голубика ягода", "Crow|Воронка", "Funnel|Воронка", "Horse|Конфорка", "Burner|Конфорка", "Sheep|Овчарка", "Shepherd dog|Овчарка",
    "Wolf|Волчок", "Spinning top|Волчок игрушка", "Ox|Волна", "Wave|Волна", "Snake|Ужин", "Dinner|Ужин", "Fly|Мухомор", "Toadstool|Мухомор", "Mole|Кротовина",
    "Catfish|Сомбреро", "Sombrero|Сомбреро", "Tick|Клещи", "Pliers|Клещи инструмент", "Bee|Пчелиный", "Ant|Муравейник", "Anthill|Муравейник", "Pig|Свинец", "Lead|Свинец",
    "Lynx|Рысак", "Trotter|Рысак", "Bear cub|Медвежатник", "Safecracker|Медвежатник", "Cow|Коровай", "Wasp|Осадок", "Sediment|Осадок", "Siege|Осада", "Autumn|Осень", "Aspen|Осина"),
  "Котёнок/Слонёнок/Волчонок/Кошка/Собака")

ru_word("words_with_dzh_ru", "Name a Russian word containing “дж”", "Назовите русское слово, в котором есть сочетание «дж»", dict(kind="CONTAINS", value="дж"))
ru_word("words_kh_and_o_ru", "Name a Russian word with both letters “Х” and “О”", "Назовите слово, в котором есть и буква «Х», и буква «О»", dict(kind="CONTAINS_ALL", value="х|о"))
ru_word("words_consonant_three_times_ru", "Name a Russian word in which the same consonant appears three or more times", "Назовите слово, в котором одна и та же согласная встречается трижды или больше", dict(kind="REPEAT_CONSONANT", n=3))
ru_word("words_starting_mikro_ru", "Name a Russian word starting with “микро”", "Назовите слово, которое начинается на «МИКРО»", dict(kind="STARTS_WITH", value="микро"))
ru_word("words_with_au_ru", "Name a Russian word containing “ау”", "Назовите слово, в котором есть сочетание «АУ»", dict(kind="CONTAINS", value="ау"))
ru_word("words_z_to_k_ru", "Name a Russian word that starts with “З” and ends with “К”", "Назовите слово, которое начинается на «З» и заканчивается на «К»", dict(kind="STARTS_ENDS", value="з|к"))
ru_word("words_double_consonant_ru", "Name a Russian word with a double consonant", "Назовите русское слово, в котором есть удвоенная согласная", dict(kind="DOUBLE_CONSONANT"))

ru_rule("nouns_ending_ar_ru", "vocabulary", "Name a Russian noun ending in “-арь”", "Назовите существительное, которое заканчивается на «арь»",
  "Русское существительное, оканчивающееся на «арь»: словарь, календарь, букварь, пекарь, лекарь, вратарь, фонарь, янтарь, сухарь, звонарь, январь, алтарь, глухарь, кустарь.",
  L("Dictionary|Словарь", "Calendar|Календарь", "Primer|Букварь", "Baker|Пекарь", "Healer|Лекарь", "Goalkeeper|Вратарь", "Lantern|Фонарь", "Amber|Янтарь", "Rusk|Сухарь",
    "Bell ringer|Звонарь", "January|Январь", "Altar|Алтарь", "Capercaillie|Глухарь", "Craftsman|Кустарь", "Secretary|Секретарь", "Librarian|Библиотекарь", "Pharmacist|Аптекарь",
    "Tsar|Царь", "Lord|Государь", "Ruler|Государь император", "Swordsman|Пушкарь", "Gunner|Пушкарь", "Clerk|Писарь", "Herdsman|Свинарь", "Inventory|Инвентарь", "Fisher|Рыбарь", "Plowman|Пахарь", "Ploughman|Пахарь", "Mower|Косарь", "Swineherd|Свинарь", "Tavern keeper|Корчмарь", "Innkeeper|Шинкарь", "Pubkeeper|Корчмарь",
    "Steward|Ключарь", "Keyholder|Ключарь", "Cellarer|Келарь", "Monk cellarer|Келарь монастыря", "Commissar|Комиссар", "Sudar|Сударь", "Sir|Сударь", "Pastor|Пастырь", "Shepherd priest|Пастырь", "Gloomy|Хмарь", "Haze|Хмарь", "Sorcerer|Знахарь", "Healer folk|Знахарь"),
  "", dict(kind="ENDS_WITH", value="арь"))

# ---------- 3. Pop culture ----------
k("multi_actor_characters", "fantasy", "Name a character who was played by different actors in different films", "Назовите персонажа, которого в разных фильмах играли разные актёры",
  "A character portrayed by several different actors across films: James Bond, Batman, Spider-Man, Superman, Sherlock Holmes, the Joker, Hulk, Dracula, Frankenstein's monster, Robin Hood, D'Artagnan, Doctor Who, Tarzan, Willy Wonka, Catwoman, Lex Luthor, Ostap Bender.",
  L("James Bond|Джеймс Бонд|бонд", "Batman|Бэтмен", "Spider-Man|Человек паук", "Superman|Супермен", "Sherlock Holmes|Шерлок Холмс", "Joker|Джокер", "Hulk|Халк", "Dracula|Дракула",
    "Frankenstein's monster|Монстр Франкенштейна", "Robin Hood|Робин Гуд", "D'Artagnan|Д'Артаньян", "Doctor Who|Доктор Кто", "Tarzan|Тарзан", "Willy Wonka|Вилли Вонка",
    "Catwoman|Женщина кошка", "Lex Luthor|Лекс Лютор", "Ostap Bender|Остап Бендер", "Dr. Watson|Доктор Ватсон", "Hercule Poirot|Эркюль Пуаро", "Miss Marple|Мисс Марпл",
    "Anna Karenina|Анна Каренина", "Natasha Rostova|Наташа Ростова", "Romeo|Ромео", "Juliet|Джульетта", "Hamlet|Гамлет", "Cinderella|Золушка", "Snow White|Белоснежка",
    "Alice|Алиса", "Peter Pan|Питер Пэн", "Captain Hook|Капитан Крюк", "Pinocchio|Пиноккио", "Mowgli|Маугли", "Zorro|Зорро", "King Arthur|Король Артур", "Merlin|Мерлин",
    "Hercules|Геркулес", "Conan|Конан", "Captain Nemo|Капитан Немо", "Count of Monte Cristo|Граф Монте Кристо", "Jean Valjean|Жан Вальжан", "Quasimodo|Квазимодо",
    "Ebenezer Scrooge|Скрудж", "Mary Poppins|Мэри Поппинс", "Wolverine|Росомаха", "Professor X|Профессор Икс", "Magneto|Магнето", "Jean Grey|Джин Грей", "Mystique|Мистик",
    "Aquaman|Аквамен", "Flash|Флэш", "Mary Jane|Мэри Джейн", "Aunt May|Тётя Мэй", "Lois Lane|Лоис Лейн",
    "Alfred|Альфред", "Commissioner Gordon|Комиссар Гордон", "Robin|Робин", "Penguin|Пингвин", "Riddler|Загадочник", "Bane|Бэйн",
    "Jack Ryan|Джек Райан", "Dorian Gray|Дориан Грей", "Dr. Jekyll|Доктор Джекилл",
    "Gulliver|Гулливер", "Robinson Crusoe|Робинзон Крузо", "Baron Munchausen|Барон Мюнхгаузен", "Ivan the Terrible|Иван Грозный", "Peter the Great|Пётр Первый", "Napoleon|Наполеон",
    "Jesus|Иисус", "Cleopatra|Клеопатра", "Ilya Muromets|Илья Муромец", "Koschei|Кощей Бессмертный", "Baba Yaga|Баба Яга", "Old Man Hottabych|Старик Хоттабыч", "Stirlitz|Штирлиц", "Pechorin|Печорин", "Onegin|Онегин", "Chichikov|Чичиков", "Khlestakov|Хлестаков", "Raskolnikov|Раскольников",
    "Woland|Воланд", "Margarita|Маргарита", "Master|Мастер", "Bulgakov's Sharikov|Шариков", "Carlson|Карлсон", "Buratino|Буратино", "Pippi|Пеппи", "Little Red Riding Hood|Красная Шапочка"),
  "Shrek/Шрек/Harry Potter/Гарри Поттер/Forrest Gump/Форрест Гамп/Jack Sparrow/Джек Воробей/Gollum/Голлум")

k("artifact_films", "movies_tv", "Name a film where an unusual artefact plays an important role", "Назовите фильм, в котором важную роль играет необычный артефакт",
  "A real film whose plot centres on a magical or unusual object: The Lord of the Rings (the Ring), Indiana Jones (Ark, Grail), Jumanji (game board), The Mask, Pirates (Aztec gold, compass), Avengers (Infinity Stones), Harry Potter (Deathly Hallows), Click (remote), Zathura, Hellboy, The Mummy (Book of the Dead), Transformers (AllSpark).",
  L("The Lord of the Rings|Властелин колец", "Indiana Jones|Индиана Джонс", "Jumanji|Джуманджи", "The Mask|Маска", "Pirates of the Caribbean|Пираты Карибского моря",
    "Avengers: Infinity War|Мстители Война бесконечности", "Harry Potter and the Deathly Hallows|Гарри Поттер и дары смерти", "Click|Клик", "Zathura|Затура", "Hellboy|Хеллбой",
    "The Mummy|Мумия", "Transformers|Трансформеры", "The Hobbit|Хоббит", "Raiders of the Lost Ark|В поисках утраченного ковчега", "The Last Crusade|Последний крестовый поход",
    "Kingdom of the Crystal Skull|Королевство хрустального черепа", "The Fifth Element|Пятый элемент", "The Da Vinci Code|Код да Винчи", "National Treasure|Сокровище нации",
    "Tomb Raider|Лара Крофт", "Aladdin|Аладдин", "The Sword in the Stone|Меч в камне", "Excalibur|Экскалибур", "Thor|Тор", "Captain America: The First Avenger|Первый мститель",
    "Guardians of the Galaxy|Стражи Галактики", "Doctor Strange|Доктор Стрэндж", "Black Panther|Чёрная пантера", "Green Lantern|Зелёный фонарь", "The Golden Compass|Золотой компас",
    "The Neverending Story|Бесконечная история", "Labyrinth|Лабиринт", "Hellraiser|Восставший из ада", "Evil Dead|Зловещие мертвецы", "The Ring|Звонок", "Annabelle|Проклятие Аннабель",
    "Night at the Museum|Ночь в музее", "Hocus Pocus|Фокус покус", "The Witches|Ведьмы", "Pinocchio|Пиноккио", "Gremlins|Гремлины", "Bedazzled|Ослеплённый желаниями",
    "Big|Большой", "Freaky Friday|Чумовая пятница", "Hot Tub Time Machine|Машина времени в джакузи", "Back to the Future|Назад в будущее", "Bill & Ted|Невероятные приключения Билла и Теда",
    "Men in Black|Люди в чёрном", "Stargate|Звёздные врата", "Contact|Контакт", "2001: A Space Odyssey|Космическая одиссея 2001", "Tenet|Довод", "Inception|Начало",
    "Dune|Дюна", "Avatar|Аватар", "Prometheus|Прометей", "The Box|Посылка", "1408|1408", "The Prestige|Престиж", "The Illusionist|Иллюзионист", "Now You See Me|Иллюзия обмана",
    "Ilya Muromets|Илья Муромец", "Fairy tale about lost time|Сказка о потерянном времени", "Kingdom of Crooked Mirrors|Королевство кривых зеркал", "Stalker|Сталкер",
    "Old Man Hottabych|Старик Хоттабыч", "Black Lightning|Чёрная молния", "Last Knight|Последний богатырь", "Guest from the Future|Гостья из будущего", "Tale of Tsar Saltan|Сказка о царе Салтане",
    "Golden Key|Золотой ключик|приключения буратино", "Kashchey|Кащей Бессмертный", "Sword of Shannara|Меч Шаннары", "Warcraft|Варкрафт", "Uncharted|Анчартед", "Jungle Cruise|Круиз по джунглям"),
  "Titanic/Титаник/Home Alone/Один дома/Forrest Gump/Форрест Гамп")

k("secret_identity_characters", "fantasy", "Name a fictional character who hides their real identity", "Назовите вымышленного персонажа, который скрывает свою настоящую личность",
  "A fictional character with a secret identity or disguise: Batman (Bruce Wayne), Superman (Clark Kent), Spider-Man (Peter Parker), Zorro, Hannah Montana, Mulan, Ladybug (Marinette), Daredevil, Moon Knight, Mrs. Doubtfire, Robin Hood, Scarlet Pimpernel, Stirlitz, Count of Monte Cristo, Tootsie.",
  L("Batman|Бэтмен|брюс уэйн", "Superman|Супермен|кларк кент", "Spider-Man|Человек паук|питер паркер", "Zorro|Зорро", "Hannah Montana|Ханна Монтана", "Mulan|Мулан",
    "Ladybug|Леди Баг|маринетт", "Cat Noir|Супер кот", "Daredevil|Сорвиголова", "Moon Knight|Лунный рыцарь", "Mrs. Doubtfire|Миссис Даутфайр", "Robin Hood|Робин Гуд",
    "Scarlet Pimpernel|Алый первоцвет", "Stirlitz|Штирлиц", "Count of Monte Cristo|Граф Монте Кристо", "Tootsie|Тутси", "Wonder Woman|Чудо женщина", "Flash|Флэш", "Green Arrow|Зелёная стрела",
    "Deadpool|Дэдпул", "Hulk|Халк", "Black Panther|Чёрная пантера", "Ms. Marvel|Мисс Марвел", "Kick-Ass|Пипец", "Hit-Girl|Убивашка",
    "Dexter|Декстер", "Walter White|Уолтер Уайт|хайзенберг", "Heisenberg|Хайзенберг", "Tyler Durden|Тайлер Дёрден", "Norman Bates|Норман Бейтс",
    "Keyser Söze|Кайзер Созе", "Phantom of the Opera|Призрак оперы", "V|V из V значит вендетта", "Rorschach|Роршах", "The Mask|Маска", "Shazam|Шазам", "Danny Phantom|Дэнни Фантом",
    "Ben 10|Бен 10", "Sailor Moon|Сейлор Мун", "Kira|Кира|лайт ягами", "Light Yagami|Лайт Ягами", "Ezio|Эцио", "Altair|Альтаир", "Arsène Lupin|Арсен Люпен", "Fantomas|Фантомас",
    "Captain Marvel Billy|Билли Батсон", "Darkwing Duck|Чёрный плащ", "Black Cloak|Чёрный плащ", "Supergirl|Супергёрл", "Batgirl|Бэтгёрл", "Nightwing|Найтвинг", "Robin|Робин",
    "Catwoman|Женщина кошка", "Riddler|Загадочник", "Sherlock Holmes|Шерлок Холмс в гриме", "Odysseus|Одиссей", "Twelfth Night Viola|Виола",
    "Frog Princess|Царевна лягушка", "Beauty and the Beast|Чудовище", "Prince in disguise|Принц и нищий", "The Prince and the Pauper|Принц и нищий",
    "Ostap Bender|Остап Бендер", "Mr. Robot|Мистер Робот", "Elliot|Эллиот", "Agent 47|Агент 47", "Solid Snake|Снейк", "Jason Bourne|Джейсон Борн",
    "James Bond|Джеймс Бонд", "Plague Doctor|Чумной доктор", "Ghostface|Гоустфейс", "Jigsaw|Пила|конструктор"),
  "Harry Potter/Гарри Поттер/Shrek/Шрек/Forrest Gump/Форрест Гамп")

k("profession_title_films", "movies_tv", "Name a film whose title contains a profession", "Назовите фильм, в названии которого есть профессия",
  "A real film whose title includes a profession: Taxi Driver, The Pianist, The Professional (Leon), Doctor Zhivago, The Postman, Gladiator, The Mechanic, The Accountant, The Butler, The Illusionist, The Hitman, The Teacher, Pilot, Cop (Coach), The Driver, Police Story.",
  L("Taxi Driver|Таксист", "The Pianist|Пианист", "Léon: The Professional|Леон киллер|леон", "Doctor Zhivago|Доктор Живаго", "The Postman|Почтальон", "Gladiator|Гладиатор",
    "The Mechanic|Механик", "The Accountant|Расплата|бухгалтер", "The Butler|Дворецкий", "The Illusionist|Иллюзионист", "Hitman|Хитман|киллер", "Coach|Тренер", "The Driver|Водитель",
    "Police Story|Полицейская история", "Kindergarten Cop|Детсадовский полицейский", "Beverly Hills Cop|Полицейский из Беверли Хиллз", "RoboCop|Робокоп", "The Bodyguard|Телохранитель", "Hitman's Bodyguard|Телохранитель киллера", "The Cook|Повар", "Chef|Повар на колёсах", "The Lawyer|Адвокат",
    "The Devil's Advocate|Адвокат дьявола", "The Lincoln Lawyer|Линкольн для адвоката", "Dentist|Дантист", "The Doctor|Доктор", "Patch Adams|Целитель Адамс", "The Chef|Шеф",
    "Ghost Writer|Призрак", "The Piano Teacher|Пианистка", "The Gardener|Садовник", "The Fisherman|Рыбак", "The Hunter|Охотник", "The Deer Hunter|Охотник на оленей",
    "Snow White and the Huntsman|Белоснежка и охотник", "The Sorcerer's Apprentice|Ученик чародея", "The Magician|Фокусник", "The Teacher|Учитель", "Bad Teacher|Очень плохая училка",
    "School Teacher|Училка", "The Nanny|Няня", "Nanny McPhee|Моя ужасная няня", "The Pilot|Пилот", "Captain Phillips|Капитан Филлипс",
    "The Soldier|Солдат", "Private Ryan|Рядовой Райан", "Sniper|Снайпер", "American Sniper|Снайпер", "The Detective|Детектив", "Detective Pikachu|Детектив Пикачу",
    "The Sheriff|Шериф", "Sheriff Callie|Шериф Келли", "The Astronaut|Астронавт", "Cosmonaut|Космонавт", "The Barber|Цирюльник",
    "Sweeney Todd: The Demon Barber|Суини Тодд демон парикмахер", "The Barber of Siberia|Сибирский цирюльник", "The Baker|Пекарь", "The Shoemaker|Сапожник", "The Musician|Музыкант",
    "The Artist|Артист", "The Actor|Актёр", "The Cameraman|Кинооператор", "The Journalist|Журналист", "The Translator|Переводчик", "Interpreter|Переводчица",
    "Ivan Vasilievich Changes Profession|Иван Васильевич меняет профессию", "The Engineer|Инженер Гарин", "Engineer Garin|Гиперболоид инженера Гарина", "The Diplomat|Дипломат",
    "The Chauffeur|Шофёр", "The Night Watchman|Ночной сторож", "The Pharmacist|Аптекарь", "The Butcher|Мясник", "Investigator|Следователь",
    "Voroshilov Sharpshooter|Ворошиловский стрелок", "Police Academy|Полицейская академия", "The Interns|Стажёры", "The Intern|Стажёр", "Firefighters|Пожарные", "Fireman Sam|Пожарный Сэм", "Spy Kids|Дети шпионов", "Spy|Шпион", "The Spy Who Loved Me|Шпион который меня любил", "Kingsman: The Secret Service|Кингсмен"),
  "Titanic/Титаник/Avatar/Аватар/Shrek/Шрек/Home Alone/Один дома")

k("crossover_game_characters", "games", "Name a character who appears in several different game franchises", "Назовите персонажа, который появляется в нескольких разных игровых франшизах",
  "A video game character who appears in multiple different game series (crossovers, guest appearances, fighting games): Mario, Sonic, Pikachu, Link, Kratos, Master Chief, Lara Croft, Geralt, Solid Snake, Pac-Man, Kirby, Donkey Kong, Mega Man, Ryu, Cloud Strife, Steve (Minecraft), Doomguy.",
  L("Mario|Марио", "Sonic|Соник", "Pikachu|Пикачу", "Link|Линк", "Kratos|Кратос", "Master Chief|Мастер Чиф", "Lara Croft|Лара Крофт", "Geralt|Геральт", "Solid Snake|Солид Снейк",
    "Pac-Man|Пакман", "Kirby|Кирби", "Donkey Kong|Донки Конг", "Mega Man|Мегамен", "Ryu|Рю", "Cloud Strife|Клауд Страйф", "Steve|Стив из Майнкрафта", "Doomguy|Думгай",
    "Luigi|Луиджи", "Princess Peach|Принцесса Пич", "Bowser|Боузер", "Yoshi|Йоши", "Wario|Варио", "Samus|Самус", "Fox McCloud|Фокс Макклауд", "Ness|Несс", "Captain Falcon|Капитан Фэлкон",
    "Pit|Пит", "Marth|Марс", "Ike|Айк", "Simon Belmont|Саймон Бельмонт", "Bayonetta|Байонетта", "Banjo-Kazooie|Банджо Казуи", "Sora|Сора", "Joker Persona|Джокер из Персоны",
    "Hero Dragon Quest|Герой Драгон квест", "Terry Bogard|Терри Богард", "Kazuya|Кадзуя", "Sephiroth|Сефирот", "Crash Bandicoot|Крэш Бандикут", "Spyro|Спайро", "Rayman|Рэйман",
    "Ezio|Эцио", "Altair|Альтаир", "Aloy|Элой", "Ellie|Элли", "Nathan Drake|Нейтан Дрейк", "Sackboy|Сэкбой", "Ratchet|Рэтчет", "Sly Cooper|Слай Купер", "Kazuma Kiryu|Кадзума Кирю",
    "Akuma|Акума", "Chun-Li|Чун Ли", "Scorpion|Скорпион", "Sub-Zero|Саб Зиро", "Freddy Krueger|Фредди Крюгер", "Jason|Джейсон", "Predator|Хищник", "Alien|Чужой", "Terminator|Терминатор",
    "Joker|Джокер", "Batman|Бэтмен", "Spider-Man|Человек паук", "Darth Vader|Дарт Вейдер", "Yoda|Йода", "Goku|Гоку", "Naruto|Наруто", "Luffy|Луффи", "Godzilla|Годзилла",
    "Hatsune Miku|Хацунэ Мику", "Gordon Freeman|Гордон Фримен", "Isaac Clarke|Айзек Кларк", "Leon Kennedy|Леон Кеннеди", "Jill Valentine|Джилл Валентайн", "Chris Redfield|Крис Редфилд",
    "2B|2Б", "Noctis|Ноктис", "Lightning|Лайтнинг", "Tifa|Тифа", "Aerith|Аэрис", "Ryu Hayabusa|Рю Хаябуса", "Sol Badguy|Сол Бэдгай", "Shovel Knight|Шовел Найт", "Steve Minecraft|Стив",
    "Creeper|Крипер", "Rabbids|Бешеные кролики", "Sonic Shadow|Шедоу", "Tails|Тейлз", "Knuckles|Наклз", "Eggman|Доктор Эггман", "Pyramid Head|Пирамидоголовый", "Ghost|Гоуст",
    "Soap MacTavish|Соуп Мактавиш", "Price|Капитан Прайс", "Sam Fisher|Сэм Фишер", "Agent 47|Агент 47"),
  "Shrek/Шрек/Harry Potter/Гарри Поттер/Frodo/Фродо")

k("underwater_animated_films", "movies_tv", "Name an animated film set under water", "Назовите анимационный фильм, действие которого происходит под водой",
  "A real animated film mostly set under the sea or water: Finding Nemo, Finding Dory, The Little Mermaid, Shark Tale, The SpongeBob Movie, Ponyo, Luca (partly), A Turtle's Tale, Sea Rex, Seafood, Atlantis: The Lost Empire, The Reef, Moana (partly), Sammy's Adventures, Octonauts.",
  L("Finding Nemo|В поисках Немо", "Finding Dory|В поисках Дори", "The Little Mermaid|Русалочка", "Shark Tale|Подводная братва", "The SpongeBob Movie|Губка Боб в кино",
    "Ponyo|Рыбка Поньо на утёсе", "Luca|Лука", "A Turtle's Tale|Приключения Сэмми", "Atlantis: The Lost Empire|Атлантида Затерянная империя", "The Reef|Риф",
    "Moana|Моана", "Sammy's Adventures|Приключения Сэмми Чудо черепаха", "Octonauts|Октонавты", "The Little Mermaid II|Русалочка 2", "Ariel's Beginning|Русалочка Начало истории Ариэль",
    "Fishtales|Морские приключения", "Shark Bait|Риф 3D", "Big Fish & Begonia|Рыба и бегония", "Seafood|Морепродукты", "Sea Beast|Морской монстр", "Ruby Gillman|Руби морской монстр",
    "Kraken Teenage|Руби Гиллман", "The Pirates Who Don't Do Anything|Пираты", "Aquaman cartoon|Аквамен мультфильм", "Song of the Sea|Песнь моря", "Lu Over the Wall|Русалка Лу",
    "Children of the Sea|Дети моря", "Happy Feet|Делай ноги", "Surf's Up|Лови волну", "Sponge on the Run|Губка Боб Спасательная миссия",
    "Saving Bikini Bottom|Спасти Бикини Боттом", "Plankton: The Movie|Планктон фильм", "Fish Hooks|Рыбология", "Sadko cartoon|Садко мультфильм",
    "The Little Mermaid 1968|Русалочка советская", "Dolphin Tale|История дельфина", "Dolphin Island|Остров дельфинов", "Nemo short|Немо короткий",
    "Sea Prince and the Fire Child|Морской принц и огненное дитя", "Jonah|Иона", "Oceans Disney|Океаны", "Under the Sea|Под водой",
    "Kung Fu Sea|Морской кунг фу", "Barbie in A Mermaid Tale|Барби Приключения русалки", "Barbie: Mermaidia|Барби Русалочка", "Bubble Guppies|Гуппи и пузырьки", "Octopus Kraken|Осьминожка", "Captain Nemo cartoon|Капитан Немо мультфильм"),
  "Shrek/Шрек/The Lion King/Король Лев/Toy Story/История игрушек/Frozen/Холодное сердце/Cars/Тачки")

k("supernatural_series", "movies_tv", "Name a TV series with supernatural creatures", "Назовите сериал, в котором есть сверхъестественные существа",
  "A real TV series featuring supernatural beings (vampires, ghosts, demons, witches, werewolves...): Supernatural, The Vampire Diaries, Buffy, Charmed, True Blood, Wednesday, Stranger Things, Teen Wolf, Lucifer, Being Human, The Witcher, Grimm, Shadowhunters, Sabrina, What We Do in the Shadows, Gogol, Black Spring.",
  L("Supernatural|Сверхъестественное", "The Vampire Diaries|Дневники вампира", "Buffy the Vampire Slayer|Баффи истребительница вампиров", "Charmed|Зачарованные", "True Blood|Настоящая кровь",
    "Wednesday|Уэнсдэй", "Stranger Things|Очень странные дела", "Teen Wolf|Волчонок", "Lucifer|Люцифер", "Being Human|Быть человеком", "The Witcher|Ведьмак", "Grimm|Гримм",
    "Shadowhunters|Сумеречные охотники", "Chilling Adventures of Sabrina|Леденящие душу приключения Сабрины", "What We Do in the Shadows|Чем мы заняты в тени", "Gogol|Гоголь",
    "The Originals|Древние", "Legacies|Наследие", "Penny Dreadful|Страшные сказки", "American Horror Story|Американская история ужасов", "The Walking Dead|Ходячие мертвецы",
    "Game of Thrones|Игра престолов", "House of the Dragon|Дом дракона", "Good Omens|Благие знамения", "Sabrina the Teenage Witch|Сабрина маленькая ведьма", "Angel|Ангел",
    "Moonlight|Лунный свет", "Sleepy Hollow|Сонная лощина", "Midnight, Texas|Миднайт Техас", "Constantine|Константин", "Preacher|Проповедник", "The Sandman|Песочный человек",
    "Locke & Key|Лок и ключ", "Dark|Тьма", "The Haunting of Hill House|Призраки дома на холме", "The Haunting of Bly Manor|Призраки поместья Блай", "Midnight Mass|Полуночная месса",
    "Interview with the Vampire|Интервью с вампиром", "A Discovery of Witches|Открытие ведьм", "Shadow and Bone|Тень и кость", "Carnival Row|Карнивал Роу", "The Umbrella Academy|Академия Амбрелла",
    "Doctor Who|Доктор Кто", "Merlin|Мерлин", "Once Upon a Time|Однажды в сказке", "Ghosts|Призраки", "Fate: The Winx Saga|Судьба Сага Винкс", "Wizards of Waverly Place|Волшебники из Вэйверли Плэйс",
    "The X-Files|Секретные материалы", "Twin Peaks|Твин Пикс", "Hellbound|Зов ада", "Kingdom|Королевство", "Sweet Home|Милый дом", "All of Us Are Dead|Мы все мертвы",
    "Death Note|Тетрадь смерти", "Demon Slayer|Клинок рассекающий демонов", "Jujutsu Kaisen|Магическая битва", "Bleach|Блич", "Inuyasha|Инуяша", "Tokyo Ghoul|Токийский гуль",
    "Black Spring|Чёрная весна", "Vampires of the Middle Band|Вампиры средней полосы", "Koschei|Кощей",
    "Wolfblood|Волчья кровь", "The Order|Орден", "Hemlock Grove|Хемлок Гроув", "From Dusk till Dawn|От заката до рассвета", "Van Helsing|Ван Хельсинг", "Dracula|Дракула"),
  "Friends/Друзья/Breaking Bad/Во все тяжкие/House/Доктор Хаус/Univer/Универ/The Office/Офис")

k("mentor_characters", "fantasy", "Name a character who is a teacher or mentor", "Назовите персонажа, который является учителем или наставником",
  "A fictional character who teaches or mentors the hero: Dumbledore, Yoda, Obi-Wan Kenobi, Gandalf, Mr. Miyagi, Master Shifu, Morpheus, Splinter, Mickey (Rocky), Rafiki, Professor X, Haymitch, Mufasa, Merlin, Snape, McGonagall, Kakashi, Jiraiya, Uncle Iroh, Alfred.",
  L("Dumbledore|Дамблдор", "Yoda|Йода", "Obi-Wan Kenobi|Оби Ван Кеноби", "Gandalf|Гэндальф", "Mr. Miyagi|Мистер Мияги", "Master Shifu|Мастер Шифу", "Morpheus|Морфеус", "Splinter|Сплинтер",
    "Mickey Goldmill|Микки|тренер рокки", "Rafiki|Рафики", "Professor X|Профессор Икс", "Haymitch|Хеймитч", "Mufasa|Муфаса", "Merlin|Мерлин", "Snape|Снегг", "McGonagall|Макгонагалл",
    "Kakashi|Какаси", "Jiraiya|Джирайя", "Uncle Iroh|Дядя Айро", "Alfred|Альфред", "Philoctetes|Фил|филоктет", "Ancient One|Древняя", "Hagrid|Хагрид", "Lupin|Люпин",
    "Mad-Eye Moody|Грозный глаз Грюм", "Qui-Gon Jinn|Квай Гон Джинн", "Luke Skywalker|Люк Скайуокер", "Master Oogway|Мастер Угвей", "Mr. Keating|Мистер Китинг",
    "Professor Preobrazhensky|Профессор Преображенский", "Aibolit|Айболит", "Mary Poppins|Мэри Поппинс", "Fairy Godmother|Фея крёстная", "Baloo|Балу", "Bagheera|Багира",
    "Akela|Акела", "Vesemir|Весемир", "Geralt|Геральт", "Yennefer|Йеннифер", "Doc Brown|Док Браун", "Willy Wonka|Вилли Вонка", "Hermes|Гермес", "Chiron|Хирон",
    "Athena|Афина", "Odin|Один", "Frigga|Фригга", "Nick Fury|Ник Фьюри", "Tony Stark|Тони Старк", "Stick|Стик", "Wong|Вонг", "Charles Xavier|Чарльз Ксавьер", "Logan|Логан",
    "All Might|Всемогущий", "Aizawa|Айзава", "Koro-sensei|Коро сэнсэй", "Gojo|Годзё", "Master Roshi|Мастер Роши", "Piccolo|Пикколо", "King Kai|Кайо сама", "Kame-Sennin|Камэ сэннин",
    "Jedi Master|Мастер джедай", "Morpheus Matrix|Морфеус из Матрицы", "Gunnery Sergeant Hartman|Хартман", "Coach Carter|Тренер Картер", "Herb Brooks|Херб Брукс",
    "Fletcher|Флетчер", "John Keating|Джон Китинг", "Dewey Finn|Дьюи Финн", "Miss Honey|Мисс Хани", "Professor Lupin|Профессор Люпин", "Remus|Ремус", "Sirius Black|Сириус Блэк",
    "Elrond|Элронд", "Galadriel|Галадриэль", "Aslan|Аслан", "Baba Yaga|Баба Яга", "Tutor Karlsson|Фрекен Бок", "Doctor House|Доктор Хаус", "Master Splinter|Мастер Сплинтер", "Kanan|Кейнан", "Ahsoka|Асока"),
  "Harry Potter/Гарри Поттер/Frodo/Фродо/Luke/Люк/Batman/Бэтмен")

k("films_with_animated_adaptation", "movies_tv", "Name a film that has an official animated adaptation", "Назовите фильм, у которого есть официальная анимационная адаптация",
  "A real live-action film (or film franchise) with an official animated series or film based on it: Ghostbusters (The Real Ghostbusters), Men in Black, Jumanji, Star Wars (Clone Wars), Back to the Future, RoboCop, Beetlejuice, Teenage Mutant Ninja Turtles, Jurassic World (Camp Cretaceous), Godzilla, Highlander, The Mask, Police Academy, Rambo, The Karate Kid.",
  L("Ghostbusters|Охотники за привидениями", "Men in Black|Люди в чёрном", "Jumanji|Джуманджи", "Star Wars|Звёздные войны", "Back to the Future|Назад в будущее", "RoboCop|Робокоп",
    "Beetlejuice|Битлджус", "Jurassic World|Мир юрского периода", "Godzilla|Годзилла", "Highlander|Горец", "The Mask|Маска", "Police Academy|Полицейская академия", "Rambo|Рэмбо",
    "The Karate Kid|Парень каратист", "Bill & Ted|Билл и Тед", "Beethoven|Бетховен", "Free Willy|Освободите Вилли", "Stargate|Звёздные врата", "Mortal Kombat|Мортал комбат",
    "Ace Ventura|Эйс Вентура", "Dumb and Dumber|Тупой и ещё тупее", "Jumanji 1995|Джуманджи 1995", "Ghostbusters 2|Охотники за привидениями 2", "Star Trek|Звёздный путь",
    "Planet of the Apes|Планета обезьян", "Alien|Чужой", "Terminator|Терминатор", "Indiana Jones|Индиана Джонс", "Rocky|Рокки", "King Kong|Кинг Конг", "Teenage Mutant Ninja Turtles|Черепашки ниндзя",
    "Transformers|Трансформеры", "Spider-Man|Человек паук", "Batman|Бэтмен", "Superman|Супермен", "X-Men|Люди Икс", "Iron Man|Железный человек", "Hulk|Халк", "Thor|Тор",
    "Guardians of the Galaxy|Стражи Галактики", "Avengers|Мстители", "Pacific Rim|Тихоокеанский рубеж", "The Matrix|Матрица", "Blade Runner|Бегущий по лезвию", "Tron|Трон",
    "Dune|Дюна", "The Lord of the Rings|Властелин колец",
    "Conan the Barbarian|Конан варвар", "Toxic Avenger|Токсичный мститель", "Little Shop of Horrors|Магазинчик ужасов", "Ewoks|Эвоки", "Gremlins|Гремлины", "Jumanji series|Джуманджи мультсериал", "Ninja Turtles 1990|Черепашки ниндзя 1990", "Kong: Skull Island|Конг Остров черепа", "Dragonheart|Сердце дракона", "The Neverending Story|Бесконечная история",
    "Flash Gordon|Флэш Гордон", "Mr. Bean|Мистер Бин", "Paddington|Паддингтон", "The Addams Family|Семейка Аддамс", "Casper|Каспер", "Night at the Museum|Ночь в музее",
    "Fast & Furious|Форсаж", "Rambo cartoon|Рэмбо мультсериал", "Ilya Muromets|Илья Муромец", "Kin-dza-dza|Кин дза дза", "Sherlock Holmes|Шерлок Холмс"),
  "Shrek/Шрек/Toy Story/История игрушек/Frozen/Холодное сердце/Finding Nemo/В поисках Немо")
