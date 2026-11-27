# THINK OR DIE category content, part H (list 2, sections 21-30).
from cats_a import cat

def wr(id, kind, en, ru, lang, value=None, n=0):
    r = {"kind": kind, "lang": lang}
    if value: r["value"] = value
    if n: r["n"] = n
    cat(f"{id}_{lang}", "WORD_RULE", "vocabulary", en, ru, "", "", "", "", langs=[lang], rule=r)

# ---------- 21. How animals look ----------
cat("striped_animals", "KNOWLEDGE", "animals", "Name an animal with stripes", "Назовите животное с полосками",
    "An animal species whose body naturally has stripes (zebra, tiger, chipmunk, okapi legs, bee, skunk, raccoon tail, striped hyena, clownfish, badger face, wild boar piglets).",
    "Животное, у которого от природы есть полоски: зебра, тигр, бурундук, окапи, пчела, скунс, полосатая гиена, рыба клоун, барсук, оса, кабанёнок.",
    """Zebra|Зебра
Tiger|Тигр
Chipmunk|Бурундук
Okapi|Окапи
Bee|Пчела
Wasp|Оса
Skunk|Скунс
Raccoon|Енот
Striped hyena|Полосатая гиена|гиена
Clownfish|Рыба клоун
Badger|Барсук
Bongo|Бонго
Numbat|Намбат
Tabby cat|Полосатый кот|кот/cat
Coral snake|Коралловый аспид
Sea krait|Плоскохвост
Zebra fish|Данио рерио|данио
Angelfish|Скалярия|скалярия рыбка
Perch|Окунь
Thylacine|Сумчатый волк|тасманийский тигр
Striped skunk|Полосатый скунс
Colorado beetle|Колорадский жук
Hornet|Шершень
Tiger shark|Тигровая акула
Lemur|Кошачий лемур|ring tailed lemur
Garter snake|Подвязочная змея
Kudu|Куду
Zebra duiker|Зебровый дукер
Wild boar piglet|Кабанёнок|поросёнок кабана
Hoopoe|Удод
Striped dolphin|Полосатый дельфин
Tiger moth|Медведица бабочка""",
    "Leopard/Леопард/Giraffe/Жираф/Cheetah/Гепард/Dalmatian/Далматинец/Elephant/Слон/Horse/Лошадь/Cow/Корова/Ladybug/Божья коровка/Panda/Панда/Lion/Лев/Frog/Лягушка")

cat("long_tail_animals", "KNOWLEDGE", "animals", "Name an animal with a long tail", "Назовите животное с длинным хвостом",
    "An animal whose tail is long relative to its body (monkey, kangaroo, lizard, cat, fox, squirrel, rat, peacock, crocodile, snow leopard, lemur, horse, mouse, cheetah).",
    "Животное с длинным относительно тела хвостом: обезьяна, кенгуру, ящерица, кошка, лиса, белка, крыса, павлин, крокодил, ирбис, лемур, лошадь, мышь, гепард.",
    """Monkey|Обезьяна|мартышка
Kangaroo|Кенгуру
Lizard|Ящерица
Cat|Кошка|кот
Fox|Лиса
Squirrel|Белка
Rat|Крыса
Peacock|Павлин
Crocodile|Крокодил
Snow leopard|Ирбис|снежный барс
Lemur|Лемур
Horse|Лошадь|конь
Mouse|Мышь
Cheetah|Гепард
Leopard|Леопард
Jaguar|Ягуар
Iguana|Игуана
Chameleon|Хамелеон
Spider monkey|Паукообразная обезьяна|коата
Opossum|Опоссум
Anteater|Муравьед
Beaver|Бобр
Pangolin|Панголин|ящер
Thresher shark|Морская лисица|акула лисица
Stingray|Скат
Magpie|Сорока
Swallow|Ласточка
Pheasant|Фазан
Lyrebird|Лирохвост
Dog|Собака
Lion|Лев
Wolf|Волк
Marten|Куница
Weasel|Ласка
Ferret|Хорёк
Dinosaur|Диплодок|diplodocus
Otter|Выдра
Meerkat|Сурикат
Gecko|Геккон
Komodo dragon|Комодский варан
Jerboa|Тушканчик
Snake|Змея""",
    "Rabbit/Кролик/Hamster/Хомяк/Bear/Медведь/Guinea pig/Морская свинка/Koala/Коала/Frog/Лягушка/Gorilla/Горилла/Human/Человек/Hippo/Бегемот/Penguin/Пингвин/Pig/Свинья")

cat("black_white_animals", "KNOWLEDGE", "animals", "Name an animal that is black and white", "Назовите животное с чёрно белым окрасом",
    "An animal species whose natural colouring is black and white (panda, zebra, penguin, orca, skunk, magpie, dalmatian, Holstein cow, badger, lemur ruffed, tapir, puffin, stork, Indri).",
    "Животное с естественным чёрно белым окрасом: панда, зебра, пингвин, косатка, скунс, сорока, далматинец, голштинская корова, барсук, малайский тапир, тупик, аист.",
    """Giant panda|Панда|panda/большая панда
Zebra|Зебра
Penguin|Пингвин
Orca|Косатка|killer whale
Skunk|Скунс
Magpie|Сорока
Dalmatian|Далматинец
Holstein cow|Корова|cow/голштинская корова
Badger|Барсук
Malayan tapir|Малайский тапир|тапир
Puffin|Тупик|атлантический тупик
Stork|Аист
Ruffed lemur|Вари|чёрно белый лемур
Colobus|Колобус|гвереца
Border collie|Бордер колли
Husky|Хаски
Dairy goat|Коза зааненская
Black and white cat|Чёрно белый кот|кошка/cat
Siberian husky|Сибирский хаски
Boston terrier|Бостон терьер
Indri|Индри
Pied wagtail|Белая трясогузка|трясогузка
Woodpecker|Большой пёстрый дятел|дятел
Lapwing|Чибис
Avocet|Шилоклювка
Dolphin|Дельфин Коммерсона
Zebra shark|Зебровая акула
Moorish idol|Мавританский идол
Panda corydoras|Коридорас панда
Belted Galloway|Галловей корова
Oreo cookie|Бык ватусси""".replace("\nOreo cookie|Бык ватусси", "").replace("Dolphin|Дельфин Коммерсона", "Commerson's dolphin|Дельфин Коммерсона").replace("Dairy goat|Коза зааненская", "Spotted pig|Пятнистая свинья"),
    "Lion/Лион/Tiger/Тигр/Giraffe/Жираф/Fox/Лиса/Elephant/Слон/Frog/Лягушка/Flamingo/Фламинго/Crow/Ворона/Polar bear/Белый медведь/Swan/Лебедь/Raven/Ворон/Cheetah/Гепард")

cat("long_ear_animals", "KNOWLEDGE", "animals", "Name an animal with long ears", "Назовите животное с длинными ушами",
    "An animal species known for long or large ears (rabbit, hare, donkey, fennec fox, elephant, bat, basset hound, kangaroo, jerboa, lop rabbit, aardvark, mule, long-eared owl, caracal tufts).",
    "Животное с длинными или большими ушами: кролик, заяц, осёл, фенек, слон, летучая мышь, бассет хаунд, кенгуру, тушканчик, трубкозуб, мул, ушастая сова, каракал.",
    """Rabbit|Кролик
Hare|Заяц
Donkey|Осёл|ишак
Fennec fox|Фенек
Elephant|Слон
Bat|Летучая мышь|ушан
Basset hound|Бассет хаунд|бассет
Kangaroo|Кенгуру
Jerboa|Тушканчик
Lop rabbit|Вислоухий кролик
Aardvark|Трубкозуб
Mule|Мул
Long-eared owl|Ушастая сова|ушастая
Caracal|Каракал
Serval|Сервал
Spaniel|Спаниель|cocker spaniel/кокер спаниель
Beagle|Бигль
Bloodhound|Бладхаунд
Bilby|Билби|кроличий бандикут
Mara|Мара|патагонский заяц
Goat|Нубийская коза|коза
Deer|Олень
Mouse|Мышь
Chinchilla|Шиншилла
Lynx|Рысь
Dachshund|Такса
Afghan hound|Афганская борзая
Kudu|Куду
Okapi|Окапи
Gerenuk|Геренук
Jackrabbit|Американский заяц""",
    "Hippo/Бегемот/Seal/Тюлень/Dolphin/Дельфин/Snake/Змея/Pig/Свинья/Frog/Лягушка/Fish/Рыба/Bear/Медведь/Owl/Сова/Turtle/Черепаха/Chicken/Курица")

cat("hoofed_animals", "KNOWLEDGE", "animals", "Name an animal with hooves", "Назовите животное с копытами",
    "A hoofed animal (ungulate): horse, cow, pig, goat, sheep, deer, moose, camel, giraffe, zebra, donkey, rhino, hippo, tapir, antelope, bison, reindeer, llama, wild boar.",
    "Копытное животное: лошадь, корова, свинья, коза, овца, олень, лось, верблюд, жираф, зебра, осёл, носорог, бегемот, тапир, антилопа, бизон, лама, кабан.",
    """Horse|Лошадь|конь/пони/pony
Cow|Корова|бык/bull
Pig|Свинья
Goat|Коза|козёл
Sheep|Овца|баран
Deer|Олень
Moose|Лось
Camel|Верблюд
Giraffe|Жираф
Zebra|Зебра
Donkey|Осёл
Rhinoceros|Носорог|rhino
Hippopotamus|Бегемот|hippo/гиппопотам
Tapir|Тапир
Antelope|Антилопа
Bison|Бизон|зубр
Reindeer|Северный олень
Llama|Лама
Alpaca|Альпака
Wild boar|Кабан
Yak|Як
Buffalo|Буйвол
Okapi|Окапи
Gazelle|Газель
Elk|Марал|вапити
Roe deer|Косуля
Saiga|Сайгак
Mule|Мул
Warthog|Бородавочник
Wildebeest|Гну
Peccary|Пекари
Ibex|Козерог|горный козёл
Musk deer|Кабарга
Mountain goat|Снежная коза
Chamois|Серна
Kudu|Куду
Vicuna|Викунья
Guanaco|Гуанако""",
    "Dog/Собака/Cat/Кошка/Lion/Лев/Bear/Медведь/Elephant/Слон/Kangaroo/Кенгуру/Rabbit/Кролик/Wolf/Волк/Monkey/Обезьяна/Chicken/Курица/Unicorn/Единорог/Centaur/Кентавр")

# ---------- 22. Kitchen ----------
cat("freezer_foods", "SEMANTIC", "food", "Name a food usually kept in the freezer", "Назовите продукт, который обычно хранят в морозильнике",
    "A food or item usually stored frozen (ice cream, pelmeni, frozen vegetables, ice cubes, fish fingers, frozen pizza, meat, berries, dumplings, fish, popsicles, chicken nuggets).",
    "Продукт, который обычно хранят в морозилке: мороженое, пельмени, замороженные овощи, лёд, рыбные палочки, замороженная пицца, мясо, ягоды, вареники, рыба, фарш.",
    """Ice cream|Мороженое|пломбир/эскимо
Pelmeni|Пельмени
Frozen vegetables|Замороженные овощи|овощная смесь
Ice cubes|Лёд|кубики льда/ice
Fish fingers|Рыбные палочки|fish sticks
Frozen pizza|Замороженная пицца|пицца
Meat|Мясо
Frozen berries|Замороженные ягоды|ягоды
Vareniki|Вареники
Fish|Рыба
Minced meat|Фарш
Chicken nuggets|Наггетсы
Popsicle|Фруктовый лёд|ice lolly
Frozen chicken|Курица|chicken
Shrimp|Креветки
Khinkali|Хинкали
Manti|Манты
Dumplings|Пельмешки|клёцки
Frozen French fries|Картошка фри замороженная|фри
Cutlets|Котлеты|полуфабрикаты
Frozen pancakes|Блинчики с начинкой|блины
Puff pastry|Слоёное тесто|тесто
Bread|Хлеб
Butter|Сливочное масло|масло
Seafood|Морепродукты|морской коктейль
Squid|Кальмары
Sorbet|Сорбет
Frozen peas|Горошек замороженный|горошек
Frozen corn|Кукуруза замороженная
Broth|Бульон
Sausages|Сосиски
Lard|Сало
Spinach|Шпинат замороженный""",
    "Bread crumbs/Сухари/Salt/Соль/Sugar/Сахар/Honey/Мёд/Canned food/Консервы/Rice/Рис/Pasta/Макароны/Oil/Растительное масло/Cereal/Хлопья/Coffee/Кофе/Tea/Чай/Chips/Чипсы")

cat("cookware", "KNOWLEDGE", "food", "Name a piece of kitchen cookware or tableware", "Назовите предмет кухонной посуды",
    "A kitchen vessel or dish for cooking, serving or eating (pot, pan, frying pan, plate, bowl, cup, mug, saucepan, kettle, teapot, baking tray, wok, ladle, colander, cutlery like spoon and fork).",
    "Предмет кухонной посуды: кастрюля, сковорода, тарелка, миска, чашка, кружка, ковш, чайник, заварник, противень, вок, половник, дуршлаг, ложка, вилка, сотейник.",
    """Pot|Кастрюля|saucepan
Frying pan|Сковорода|сковородка/skillet/pan
Plate|Тарелка
Bowl|Миска|салатница
Cup|Чашка
Mug|Кружка
Ladle pot|Ковш|ковшик
Kettle|Чайник
Teapot|Заварочный чайник|заварник
Baking tray|Противень
Wok|Вок
Ladle|Половник|поварёшка
Colander|Дуршлаг
Spoon|Ложка
Fork|Вилка
Knife|Нож
Sauté pan|Сотейник
Casserole dish|Форма для запекания|гусятница/утятница
Glass|Стакан
Saucer|Блюдце
Dish|Блюдо
Cutting board|Разделочная доска|доска
Grater|Тёрка
Whisk|Венчик
Spatula|Лопатка
Sieve|Сито
Rolling pin|Скалка
Cauldron|Казан
Pressure cooker|Скороварка
Jug|Кувшин
Gravy boat|Соусник
Sugar bowl|Сахарница
Salt shaker|Солонка
Tureen|Супница
Coffee pot|Турка|джезва/cezve
Muffin tin|Форма для кексов|форма
Bucket|Кастрюлька
Tongs|Щипцы
Peeler|Овощечистка
Corkscrew|Штопор
Can opener|Открывашка|консервный нож
Thermos|Термос
Chopsticks|Палочки""".replace("\nBucket|Кастрюлька", ""),
    "Fridge/Холодильник/Oven/Духовка/Microwave/Микроволновка/Table/Стол/Chair/Стул/Sink/Раковина/Stove/Плита/Dishwasher/Посудомойка/Towel/Полотенце/Apron/Фартук/Bread/Хлеб/Soap/Мыло")

cat("pizza_toppings", "KNOWLEDGE", "food", "Name a pizza topping", "Назовите начинку для пиццы",
    "Something commonly put on a pizza (cheese, mozzarella, tomato, pepperoni, ham, mushrooms, olives, onion, pineapple, bacon, chicken, salami, peppers, basil, sausage, anchovies, corn, jalapeño, shrimp, egg).",
    "То, что обычно кладут на пиццу: сыр, моцарелла, помидоры, пепперони, ветчина, грибы, оливки, лук, ананас, бекон, курица, салями, перец, базилик, колбаса, анчоусы, кукуруза, халапеньо, креветки.",
    """Cheese|Сыр
Mozzarella|Моцарелла
Tomato|Помидоры|томаты/tomatoes/томат
Tomato sauce|Томатный соус|соус
Pepperoni|Пепперони
Ham|Ветчина
Mushrooms|Грибы|шампиньоны
Olives|Оливки|маслины
Onion|Лук
Pineapple|Ананас
Bacon|Бекон
Chicken|Курица
Salami|Салями
Bell pepper|Болгарский перец|перец/peppers
Basil|Базилик
Sausage|Колбаса|колбаски
Anchovies|Анчоусы
Corn|Кукуруза
Jalapeño|Халапеньо|jalapeno
Shrimp|Креветки
Egg|Яйцо
Parmesan|Пармезан
Spinach|Шпинат
Arugula|Руккола|rocket
Tuna|Тунец
Garlic|Чеснок
Beef|Говядина|фарш
Feta|Фета
Gorgonzola|Горгонзола
Prosciutto|Прошутто|хамон
Sweetcorn|Сладкая кукуруза
Pickles|Маринованные огурцы|огурцы
Capers|Каперсы
Seafood|Морепродукты
Salmon|Лосось|сёмга
Eggplant|Баклажан
Zucchini|Цукини|кабачок
Chili|Чили
Oregano|Орегано
BBQ sauce|Соус барбекю|барбекю
Ricotta|Рикотта
Meatballs|Фрикадельки""",
    "Chocolate/Шоколад/Ice cream/Мороженое/Sugar/Сахар/Jam/Варенье/Soup/Суп/Milk/Молоко/Bread/Хлеб/Cereal/Хлопья/Candy/Конфеты/Pelmeni/Пельмени/Porridge/Каша/Coffee/Кофе")

cat("canned_foods", "KNOWLEDGE", "food", "Name a product sold in tin cans", "Назовите продукт, который продаётся в консервных банках",
    "A food or drink commonly sold in tin cans (canned tuna, sardines, beans, corn, peas, stewed meat / tushonka, sprats, soup, condensed milk, peaches, pineapple, tomatoes, cola, beer, energy drinks, olives, cat food).",
    "Продукт, который обычно продают в жестяных банках: тушёнка, шпроты, сайра, тунец, фасоль, кукуруза, горошек, сгущёнка, персики, ананасы, оливки, кола, пиво, энергетик, корм для кошек.",
    """Canned tuna|Тунец|tuna
Sardines|Сардины
Beans|Фасоль|baked beans
Corn|Кукуруза
Green peas|Зелёный горошек|горошек/peas
Stewed meat|Тушёнка
Sprats|Шпроты
Saury|Сайра
Soup|Суп
Condensed milk|Сгущёнка|сгущенное молоко
Peaches|Персики
Pineapple|Ананасы|ананас
Tomatoes|Помидоры|томаты
Cola|Кола|coca cola/кока кола/газировка/soda
Beer|Пиво
Energy drink|Энергетик|ред булл
Olives|Оливки|маслины
Cat food|Корм для кошек|корм
Dog food|Корм для собак
Spam|Спам|ветчина консервированная
Salmon|Лосось|горбуша
Mackerel|Скумбрия
Cod liver|Печень трески
Pâté|Паштет
Mushrooms|Грибы|шампиньоны консервированные
Chickpeas|Нут
Coconut milk|Кокосовое молоко
Fruit cocktail|Фруктовый коктейль
Squash caviar|Кабачковая икра
Baked beans in tomato sauce|Фасоль в томате
Mussels|Мидии
Crab meat|Крабовое мясо
Coffee|Кофе
Paint|Краска
Sweet corn|Сахарная кукуруза
Pickled cucumbers|Огурцы маринованные
Lentils|Чечевица
Cherries|Черешня консервированная
Apricots|Абрикосы консервированные
Tomato paste|Томатная паста""".replace("\nPaint|Краска", ""),
    "Bread/Хлеб/Milk/Молоко/Eggs/Яйца/Ice cream/Мороженое/Cake/Торт/Pizza/Пицца/Apple/Яблоко/Pelmeni/Пельмени/Cheese/Сыр/Rice/Рис/Banana/Банан/Phone/Телефон")

cat("salad_ingredients", "KNOWLEDGE", "food", "Name an ingredient you can add to a salad", "Назовите ингредиент, который можно добавить в салат",
    "An ingredient commonly used in salads (lettuce, tomato, cucumber, onion, cheese, egg, olives, carrot, corn, croutons, chicken, tuna, mayonnaise, olive oil, peppers, avocado, beetroot, potato, dill).",
    "Ингредиент, который обычно кладут в салат: листья салата, помидор, огурец, лук, сыр, яйцо, оливки, морковь, кукуруза, сухарики, курица, тунец, майонез, масло, перец, авокадо, свёкла, картофель, укроп.",
    """Lettuce|Листья салата|салат/латук/iceberg/айсберг
Tomato|Помидор|томат/черри/cherry tomatoes
Cucumber|Огурец
Onion|Лук
Cheese|Сыр
Egg|Яйцо|яйца
Olives|Оливки|маслины
Carrot|Морковь
Corn|Кукуруза
Croutons|Сухарики|гренки
Chicken|Курица
Tuna|Тунец
Mayonnaise|Майонез
Olive oil|Оливковое масло|масло
Bell pepper|Перец|болгарский перец
Avocado|Авокадо
Beetroot|Свёкла
Potato|Картофель|картошка
Dill|Укроп
Parsley|Петрушка
Cabbage|Капуста
Radish|Редис
Feta|Фета|брынза
Arugula|Руккола
Spinach|Шпинат
Peas|Горошек
Ham|Ветчина
Sausage|Колбаса
Crab sticks|Крабовые палочки
Shrimp|Креветки
Bacon|Бекон
Mozzarella|Моцарелла
Parmesan|Пармезан
Lemon juice|Лимонный сок
Vinegar|Уксус
Sour cream|Сметана
Walnuts|Грецкие орехи|орехи
Pine nuts|Кедровые орешки
Apple|Яблоко
Beans|Фасоль
Pomegranate|Гранат
Sesame|Кунжут
Garlic|Чеснок
Mushrooms|Грибы
Pickles|Солёные огурцы
Herring|Сельдь|селёдка
Rice|Рис
Pasta|Макароны
Quinoa|Киноа
Celery|Сельдерей
Prunes|Чернослив
Raisins|Изюм
Mustard|Горчица
Soy sauce|Соевый соус""",
    "Ice cream/Мороженое/Chocolate/Шоколад/Coffee/Кофе/Cake/Торт/Candy/Конфеты/Cola/Кола/Jam/Варенье/Sugar cube/Рафинад/Glue/Клей/Soap/Мыло/Toothpaste/Зубная паста")

# ---------- 23. Clothes and accessories ----------
cat("sleeveless_clothing", "KNOWLEDGE", "everyday", "Name a piece of clothing without sleeves", "Назовите предмет одежды без рукавов",
    "A clothing item that normally has no sleeves (vest, tank top, sundress, waistcoat, singlet, camisole, apron, poncho counts, gilet, strapless dress, overalls / dungarees, swimsuit, crop top, bodywarmer). Trousers, skirts and shorts also have no sleeves and count.",
    "Предмет одежды, у которого обычно нет рукавов: жилет, майка, сарафан, жилетка, топ, безрукавка, фартук, пончо, комбинезон на лямках, купальник; брюки, юбки и шорты тоже без рукавов и считаются.",
    """Vest|Жилет|жилетка/waistcoat
Tank top|Майка|singlet/алкоголичка
Sundress|Сарафан
Top|Топ|crop top/кроп топ
Gilet|Безрукавка|bodywarmer
Camisole|Маечка на бретелях
Apron|Фартук
Poncho|Пончо
Dungarees|Комбинезон на лямках|overalls/полукомбинезон
Swimsuit|Купальник
Strapless dress|Платье без рукавов|платье бандо
Corset|Корсет
Trousers|Брюки|штаны/pants
Skirt|Юбка
Shorts|Шорты
Jeans|Джинсы
Leggings|Леггинсы|лосины
Socks|Носки
Bra|Бюстгальтер|лифчик
Underpants|Трусы
Tights|Колготки
Cape|Накидка|плащ накидка
Puffer vest|Пуховой жилет|пуховая жилетка
Bulletproof vest|Бронежилет
Life jacket|Спасательный жилет
Halter top|Топ халтер
Tunic dress|Туника без рукавов
Bikini|Бикини
Kilt|Килт
Sarong|Саронг
Pareo|Парео
Hat|Шапка
Scarf|Шарф
Belt|Ремень""".replace("\nHat|Шапка", "").replace("\nScarf|Шарф", "").replace("\nBelt|Ремень", ""),
    "Shirt/Рубашка/Jacket/Куртка/Sweater/Свитер/Coat/Пальто/Hoodie/Худи/Blouse/Блузка/Cardigan/Кардиган/T-shirt/Футболка/Kimono/Кимоно/Bathrobe/Халат/Fur coat/Шуба/Turtleneck/Водолазка")

cat("headwear", "KNOWLEDGE", "everyday", "Name something worn on the head", "Назовите то, что надевают на голову",
    "Something worn on the head (hat, cap, helmet, beanie, crown, headband, bandana, hood, beret, wig, headphones count, hijab, turban, kokoshnik, tiara, veil, swim cap, balaclava, bucket hat).",
    "То, что надевают на голову: шапка, кепка, шлем, берет, корона, ободок, бандана, капюшон, парик, наушники, платок, тюрбан, кокошник, диадема, фата, шапочка для плавания, балаклава, панама.",
    """Hat|Шляпа
Cap|Кепка|бейсболка/baseball cap
Helmet|Шлем|каска
Beanie|Шапка|вязаная шапка/шапочка
Crown|Корона
Headband|Ободок|повязка на голову
Bandana|Бандана
Hood|Капюшон
Beret|Берет
Wig|Парик
Headphones|Наушники
Headscarf|Платок|косынка/hijab/хиджаб
Turban|Тюрбан|чалма
Kokoshnik|Кокошник
Tiara|Диадема
Veil|Фата|вуаль
Swim cap|Шапочка для плавания
Balaclava|Балаклава
Bucket hat|Панама|панамка
Ushanka|Ушанка
Top hat|Цилиндр
Cowboy hat|Ковбойская шляпа
Fedora|Федора
Bowler hat|Котелок
Sombrero|Сомбреро
Panama hat|Панама шляпа
Beanie with pompom|Шапка с помпоном
Earmuffs|Наушники меховые
Visor|Козырёк
Glasses|Очки
Fez|Феска
Kippah|Кипа
Skullcap|Тюбетейка
Papakha|Папаха
Budenovka|Будёновка
Cap of Monomakh|Шапка Мономаха
Chef hat|Поварской колпак|колпак
Party hat|Праздничный колпак
Hair clip|Заколка
Scrunchie|Резинка для волос
Diving mask|Маска для плавания
VR headset|VR шлем
Graduation cap|Академическая шапочка
Wreath|Венок
Snood|Снуд
Halo|Нимб
Pilotka|Пилотка
Peaked cap|Фуражка
Bonnet|Чепчик|чепец
Sleep mask|Маска для сна
Mask|Маска""",
    "Shoes/Обувь/Gloves/Перчатки/Socks/Носки/Ring/Кольцо/Belt/Ремень/Necklace/Ожерелье/Watch/Часы/Bracelet/Браслет/Skirt/Юбка/Trousers/Брюки/Boots/Сапоги")

cat("footwear", "KNOWLEDGE", "everyday", "Name a type of footwear", "Назовите разновидность обуви",
    "A type of shoe or footwear (sneakers, boots, sandals, slippers, high heels, loafers, flip-flops, ballet flats, valenki, rubber boots, moccasins, clogs, Crocs, ugg boots, oxfords, espadrilles, skates count, flippers count).",
    "Вид обуви: кроссовки, кеды, сапоги, ботинки, сандалии, тапочки, туфли на каблуке, лоферы, шлёпанцы, балетки, валенки, резиновые сапоги, мокасины, сабо, кроксы, угги, оксфорды, эспадрильи.",
    """Sneakers|Кроссовки|trainers
Canvas shoes|Кеды
Boots|Сапоги
Ankle boots|Ботинки|ботильоны
Sandals|Сандалии|босоножки
Slippers|Тапочки|тапки
High heels|Туфли на каблуке|каблуки/шпильки/heels
Shoes|Туфли
Loafers|Лоферы
Flip-flops|Шлёпанцы|вьетнамки/шлёпки/сланцы
Ballet flats|Балетки
Valenki|Валенки
Rubber boots|Резиновые сапоги|wellies/wellingtons
Moccasins|Мокасины
Clogs|Сабо
Crocs|Кроксы
Ugg boots|Угги|uggs
Oxfords|Оксфорды
Espadrilles|Эспадрильи
Brogues|Броги
Derby shoes|Дерби
Platform shoes|Платформы
Wedges|Танкетки
Mules|Мюли
Chelsea boots|Челси
Cowboy boots|Казаки|ковбойские сапоги
Combat boots|Берцы
Hiking boots|Треккинговые ботинки
Football boots|Бутсы|cleats
Skates|Коньки
Flippers|Ласты
Bast shoes|Лапти
Galoshes|Галоши
Felt boots|Чуни
Pointe shoes|Пуанты
Slip-ons|Слипоны
Monk shoes|Монки
Ski boots|Горнолыжные ботинки
Dutch wooden shoes|Деревянные башмаки|клоги
Geta|Гэта
Czech shoes|Чешки
Wading boots|Болотники|болотные сапоги
Sliders|Слайды
Stilettos|Стилеты
Dunks|Высокие кеды
Booties|Пинетки
Kirza boots|Кирзовые сапоги|кирзачи
Ichigi|Ичиги
Unty|Унты""".replace("\nDunks|Высокие кеды", ""),
    "Socks/Носки/Gloves/Перчатки/Hat/Шапка/Tights/Колготки/Belt/Ремень/Trousers/Брюки/Scarf/Шарф/Shirt/Рубашка/Skirt/Юбка/Shoelaces/Шнурки/Insoles/Стельки/Shoe polish/Крем для обуви")

cat("winter_clothing", "KNOWLEDGE", "everyday", "Name an item of winter clothing", "Назовите предмет зимней одежды",
    "A clothing item worn mainly in cold winter weather (coat, down jacket, fur coat, scarf, gloves, mittens, beanie, ushanka, valenki, winter boots, thermal underwear, sweater, parka, balaclava, earmuffs, snow pants).",
    "Предмет одежды, который носят в основном зимой: пальто, пуховик, шуба, шарф, перчатки, варежки, шапка, ушанка, валенки, зимние сапоги, термобельё, свитер, парка, балаклава, наушники, зимний комбинезон.",
    """Coat|Пальто
Down jacket|Пуховик|puffer jacket
Fur coat|Шуба
Scarf|Шарф
Gloves|Перчатки
Mittens|Варежки|рукавицы
Beanie|Шапка|вязаная шапка
Ushanka|Ушанка
Valenki|Валенки
Winter boots|Зимние сапоги|сапоги/угги/ugg boots/дутики
Thermal underwear|Термобельё
Sweater|Свитер
Parka|Парка|аляска
Balaclava|Балаклава
Earmuffs|Меховые наушники|наушники
Snow pants|Зимние штаны|ватные штаны
Ski suit|Зимний комбинезон|комбинезон
Sheepskin coat|Дублёнка
Quilted jacket|Ватник|телогрейка/фуфайка
Turtleneck|Водолазка
Wool socks|Шерстяные носки
Snood|Снуд
Fleece|Флиска|флис
Cardigan|Кардиган
Winter jacket|Зимняя куртка|куртка
Ski jacket|Лыжная куртка
Pea coat|Бушлат
Overcoat|Шинель
Fur hat|Меховая шапка
Muff|Муфта
Leg warmers|Гетры
Tights|Тёплые колготки|колготки
Hoodie|Худи|толстовка
Shawl|Шаль|пуховый платок
Unty|Унты
Poncho|Тёплое пончо
Sweatshirt|Свитшот
Neck warmer|Горловина|бафф
Ski goggles|Горнолыжная маска""",
    "Shorts/Шорты/Swimsuit/Купальник/Flip-flops/Шлёпанцы/Tank top/Майка/Sandals/Сандалии/Bikini/Бикини/Sundress/Сарафан/Panama hat/Панама/Sunglasses/Солнцезащитные очки/T-shirt/Футболка")

cat("clothing_with_pockets", "SEMANTIC", "everyday", "Name a piece of clothing that often has pockets", "Назовите предмет одежды, на котором бывают карманы",
    "A clothing item that commonly has pockets (jeans, trousers, jacket, coat, shorts, hoodie, shirt, cargo pants, vest, apron, dress sometimes, skirt sometimes, bathrobe, overalls, blazer, parka).",
    "Предмет одежды, на котором обычно есть карманы: джинсы, брюки, куртка, пальто, шорты, худи, рубашка, карго, жилет, фартук, халат, комбинезон, пиджак, парка.",
    """Jeans|Джинсы
Trousers|Брюки|штаны/pants
Jacket|Куртка
Coat|Пальто
Shorts|Шорты
Hoodie|Худи|толстовка
Shirt|Рубашка
Cargo pants|Карго|штаны карго
Vest|Жилет|жилетка
Apron|Фартук
Bathrobe|Халат
Overalls|Комбинезон
Blazer|Пиджак
Parka|Парка
Down jacket|Пуховик
Skirt|Юбка
Dress|Платье
Raincoat|Плащ|дождевик
Cardigan|Кардиган
Sweatpants|Спортивные штаны|треники
Suit|Костюм
Lab coat|Медицинский халат
Fur coat|Шуба
Sheepskin coat|Дублёнка
Windbreaker|Ветровка
Leather jacket|Кожанка|косуха
Denim jacket|Джинсовка
Chinos|Чиносы
Joggers|Джоггеры
Tracksuit|Спортивный костюм
Uniform|Форма
Pyjamas|Пижама
Quilted jacket|Ватник
Bomber jacket|Бомбер
Trench coat|Тренч""",
    "Socks/Носки/Tie/Галстук/Bra/Бюстгальтер/Tights/Колготки/Swimsuit/Купальник/Gloves/Перчатки/Hat/Шапка/Scarf/Шарф/Bikini/Бикини/Mittens/Варежки/Underpants/Трусы/Leggings/Леггинсы")

# ---------- 24. Everyday objects ----------
cat("things_with_buttons", "SEMANTIC", "everyday", "Name something that has buttons", "Назовите предмет, на котором есть кнопки",
    "An object that normally has press buttons or clothing buttons (remote control, phone, keyboard, calculator, elevator, microwave, shirt, coat, gamepad, mouse, doorbell, washing machine, camera, ATM, jacket, piano accordion).",
    "Предмет, на котором обычно есть кнопки (нажимные или пуговицы): пульт, телефон, клавиатура, калькулятор, лифт, микроволновка, рубашка, пальто, геймпад, мышь, звонок, стиральная машина, фотоаппарат, банкомат, баян.",
    """Remote control|Пульт
Phone|Телефон|mobile phone/смартфон
Keyboard|Клавиатура
Calculator|Калькулятор
Elevator|Лифт
Microwave|Микроволновка
Shirt|Рубашка
Coat|Пальто
Gamepad|Геймпад|джойстик/controller
Computer mouse|Мышь|мышка/mouse
Doorbell|Дверной звонок|звонок
Washing machine|Стиральная машина|стиралка
Camera|Фотоаппарат|камера
ATM|Банкомат
Jacket|Куртка|пиджак
Accordion|Баян|аккордеон/гармонь
Intercom|Домофон
Laptop|Ноутбук
Watch|Часы
Radio|Радио
Vending machine|Торговый автомат|автомат
Car key fob|Брелок от машины|брелок
Blender|Блендер
Kettle|Чайник
TV|Телевизор
Printer|Принтер
Cash register|Касса
Payment terminal|Терминал
Toy|Игрушка
Dishwasher|Посудомойка
Hair dryer|Фен
Traffic light pedestrian|Кнопка светофора|светофор
Coffee machine|Кофемашина
Jeans|Джинсы
Cardigan|Кардиган
Duvet cover|Пододеяльник
Blouse|Блузка
Arcade machine|Игровой автомат
Synthesizer|Синтезатор
Walkie-talkie|Рация
Stopwatch|Секундомер
Flashlight|Фонарик
Air conditioner remote|Кондиционер
Bus stop button|Кнопка остановки в автобусе|автобус
Panic button|Тревожная кнопка
Game console|Игровая приставка|приставка""".replace("Traffic light pedestrian|Кнопка светофора|светофор", "Pedestrian crossing|Пешеходный светофор|светофор").replace("Bus stop button|Кнопка остановки в автобусе|автобус", "Bus|Автобус"),
    "Spoon/Ложка/Book/Книга/Cup/Чашка/Banana/Банан/Rock/Камень/Pencil/Карандаш/Plate/Тарелка/Towel/Полотенце/Brick/Кирпич/Sock/Носок/Tree/Дерево/Bottle/Бутылка")

cat("things_with_mirror", "SEMANTIC", "everyday", "Name something that has a mirror in it", "Назовите предмет, в котором есть зеркало",
    "An object that normally contains or includes a mirror (car with rear-view mirror, compact powder, wardrobe, bathroom cabinet, dressing table, periscope, telescope, kaleidoscope, SLR camera, elevator, makeup case, sun visor, hairdresser's salon, laser).",
    "Предмет, в котором обычно есть зеркало: машина (зеркало заднего вида), пудреница, шкаф купе, шкафчик в ванной, туалетный столик, перископ, телескоп, калейдоскоп, зеркальный фотоаппарат, лифт, косметичка, козырёк в машине.",
    """Car|Машина|автомобиль
Compact powder|Пудреница|compact
Wardrobe|Шкаф купе|шкаф
Bathroom cabinet|Шкафчик в ванной|зеркальный шкаф
Dressing table|Туалетный столик|трюмо/vanity
Periscope|Перископ
Telescope|Телескоп
Kaleidoscope|Калейдоскоп
SLR camera|Зеркальный фотоаппарат|зеркалка/фотоаппарат
Elevator|Лифт
Makeup bag|Косметичка
Sun visor|Козырёк в машине|солнцезащитный козырёк
Motorcycle|Мотоцикл
Bicycle|Велосипед
Bus|Автобус
Truck|Грузовик
Hallway stand|Прихожая
Lipstick case|Помада с зеркальцем
Dentist's mirror|Стоматологическое зеркало
Microscope|Микроскоп
Laser|Лазер
Lighthouse|Маяк|прожектор
Headlight|Фара
Flashlight|Фонарик
Solar oven|Солнечная печь
Bird toy|Игрушка для попугая
Hand mirror|Зеркальце
Gym|Спортзал
Dance studio|Танцевальный зал
Fitting room|Примерочная
Hair salon|Парикмахерская
Smart mirror|Умное зеркало
Mirror ball|Диско шар
Selfie stick|Монопод с зеркалом
Sunglasses|Зеркальные очки""".replace("\nSelfie stick|Монопод с зеркалом", "").replace("Lipstick case|Помада с зеркальцем", "Lipstick case|Футляр для помады"),
    "Book/Книга/Spoon/Ложка/Sock/Носок/Chair/Стул/Pencil/Карандаш/Bread/Хлеб/Ball/Мяч/Shoe/Ботинок/Pillow/Подушка/Banana/Банан/Rock/Камень/Brick/Кирпич")

cat("furniture", "KNOWLEDGE", "everyday", "Name a piece of furniture", "Назовите предмет мебели",
    "A piece of furniture (table, chair, sofa, bed, wardrobe, armchair, shelf, chest of drawers, desk, bookcase, stool, bench, nightstand, cabinet, dresser, ottoman, crib, bunk bed, coffee table).",
    "Предмет мебели: стол, стул, диван, кровать, шкаф, кресло, полка, комод, письменный стол, книжный шкаф, табурет, скамья, тумбочка, буфет, пуфик, кроватка, двухъярусная кровать, журнальный столик.",
    """Table|Стол
Chair|Стул
Sofa|Диван|couch
Bed|Кровать
Wardrobe|Шкаф|гардероб
Armchair|Кресло
Shelf|Полка
Chest of drawers|Комод|dresser
Desk|Письменный стол
Bookcase|Книжный шкаф|стеллаж
Stool|Табурет|табуретка
Bench|Скамья|скамейка/лавка
Nightstand|Тумбочка|прикроватная тумба
Cabinet|Буфет|сервант
Ottoman|Пуфик|пуф
Crib|Детская кроватка|кроватка
Bunk bed|Двухъярусная кровать
Coffee table|Журнальный столик
Rocking chair|Кресло качалка
Bean bag|Кресло мешок
Hammock|Гамак
Wall unit|Стенка
Sideboard|Комод буфет
Folding bed|Раскладушка
Sofa bed|Диван кровать
Recliner|Реклайнер
Bar stool|Барный стул
Vanity table|Туалетный столик|трюмо
Shoe rack|Обувница
TV stand|Тумба под телевизор
Wardrobe closet|Шкаф купе
Chaise longue|Шезлонг|кушетка
Futon|Футон
Kitchen set|Кухонный гарнитур
Computer desk|Компьютерный стол
Office chair|Офисное кресло
Coat rack|Вешалка
Bed frame|Каркас кровати
Hutch|Горка
Chest|Сундук
Banquette|Банкетка
Console table|Консоль
Ottoman sofa|Тахта
Screen|Ширма
Bunk|Нары""".replace("Sideboard|Комод буфет", "Sideboard|Сайдборд"),
    "Lamp/Лампа/Carpet/Ковёр/Curtains/Шторы/Refrigerator/Холодильник/TV/Телевизор/Pillow/Подушка/Blanket/Одеяло/Mirror/Зеркало/Door/Дверь/Window/Окно/Plate/Тарелка/Vase/Ваза")

cat("things_with_handle", "SEMANTIC", "everyday", "Name something that usually has a handle", "Назовите предмет, на котором обычно есть ручка",
    "An object that normally has a handle to hold, carry or open it (door, cup, mug, bag, suitcase, frying pan, pot, knife, umbrella, hammer, broom, bucket, kettle, drawer, window, toothbrush, iron, scissors, saw, racket).",
    "Предмет, у которого обычно есть ручка: дверь, чашка, кружка, сумка, чемодан, сковорода, кастрюля, нож, зонт, молоток, веник, ведро, чайник, ящик, окно, зубная щётка, утюг, ножницы, пила, ракетка.",
    """Door|Дверь
Cup|Чашка
Mug|Кружка
Bag|Сумка
Suitcase|Чемодан
Frying pan|Сковорода|сковородка
Pot|Кастрюля
Knife|Нож
Umbrella|Зонт|зонтик
Hammer|Молоток
Broom|Веник|метла
Bucket|Ведро
Kettle|Чайник
Drawer|Ящик
Window|Окно
Toothbrush|Зубная щётка
Iron|Утюг
Scissors|Ножницы
Saw|Пила
Racket|Ракетка
Shovel|Лопата
Axe|Топор
Basket|Корзина
Briefcase|Портфель
Hairbrush|Расчёска|щётка для волос
Ladle|Половник
Mop|Швабра
Rake|Грабли
Fridge|Холодильник
Cabinet|Шкаф
Car door|Дверь машины
Stroller|Коляска
Shopping cart|Тележка
Sword|Меч
Spoon|Ложка
Fork|Вилка
Jug|Кувшин
Teapot|Заварник
Watering can|Лейка
Screwdriver|Отвёртка
Paintbrush|Кисть
Hair dryer|Фен
Vacuum cleaner|Пылесос
Lawn mower|Газонокосилка
Wheelbarrow|Тачка
Backpack|Рюкзак
Dumbbell|Гантель
Kettlebell|Гиря
Bicycle|Велосипед|руль
Tennis racket|Теннисная ракетка""".replace("\nTennis racket|Теннисная ракетка", ""),
    "Ball/Мяч/Book/Книга/Coin/Монета/Banana/Банан/Plate/Тарелка/Sock/Носок/Ring/Кольцо/Egg/Яйцо/Pillow/Подушка/Brick/Кирпич/Phone/Телефон/Carpet/Ковёр")

cat("things_with_spring", "SEMANTIC", "everyday", "Name something with a spring inside", "Назовите предмет, внутри которого есть пружина",
    "An object that normally contains a spring (ballpoint pen, mattress, mechanical clock, trampoline, stapler, mousetrap, clothes peg, car suspension, sofa, lock, toaster, door closer, umbrella, gun, scale, retractable tape measure, Slinky is itself a spring).",
    "Предмет, внутри которого обычно есть пружина: автоматическая ручка, матрас, механические часы, батут, степлер, мышеловка, прищепка, подвеска автомобиля, диван, замок, тостер, доводчик двери, зонт, пистолет, весы, рулетка.",
    """Ballpoint pen|Ручка|автоматическая ручка/pen
Mattress|Матрас
Mechanical clock|Механические часы|часы
Trampoline|Батут
Stapler|Степлер
Mousetrap|Мышеловка
Clothes peg|Прищепка
Car suspension|Подвеска автомобиля|амортизатор/shock absorber
Sofa|Диван
Lock|Замок
Toaster|Тостер
Door closer|Доводчик|доводчик двери
Umbrella|Зонт|автоматический зонт
Gun|Пистолет|ружьё
Scale|Весы|пружинные весы
Tape measure|Рулетка
Jack-in-the-box|Чёртик из табакерки
Wind-up toy|Заводная игрушка
Music box|Музыкальная шкатулка
Bicycle seat|Седло велосипеда
Pogo stick|Тренажёр кузнечик|пого стик
Armchair|Кресло
Hole punch|Дырокол
Lighter|Зажигалка
Spray bottle|Пульверизатор
Clamp|Зажим
Retractable leash|Рулетка поводок
Garage door|Гаражные ворота
Keyboard|Клавиатура
Computer mouse|Компьютерная мышь
Crossbow|Арбалет
Hand grip|Эспандер
Pinball machine|Пинбол
Office chair|Офисное кресло
Light switch|Выключатель
Hair clip|Заколка краб
Nail clippers|Кусачки для ногтей
Garden shears|Секатор
Tongs|Щипцы
Dispenser pump|Дозатор
Car seat belt|Ремень безопасности
Watch|Наручные часы
Metronome|Метроном
Stamp|Штамп""",
    "Spoon/Ложка/Book/Книга/Plate/Тарелка/Rock/Камень/Glass/Стакан/Candle/Свеча/Brick/Кирпич/Towel/Полотенце/Apple/Яблоко/Sock/Носок/Pencil/Карандаш/Coin/Монета")

# ---------- 25. Vocabulary (word rules) ----------
wr("words_six_letters", "LENGTH", "Name a word with exactly six letters", "Назовите слово ровно из шести букв", "ru", n=6)
wr("words_six_letters", "LENGTH", "Name a word with exactly six letters", "Name a word with exactly six letters", "en", n=6)
wr("words_end_ka", "ENDS_WITH", "Name a word ending in «ка»", "Назовите слово, которое заканчивается на «ка»", "ru", value="ка")
wr("words_end_ing", "ENDS_WITH", "Name a word ending in “ing”", "Name a word ending in “ing”", "en", value="ing")
wr("words_start_pro", "STARTS_WITH", "Name a word starting with «про»", "Назовите слово, которое начинается на «про»", "ru", value="про")
wr("words_start_pro", "STARTS_WITH", "Name a word starting with “pro”", "Name a word starting with “pro”", "en", value="pro")
wr("words_letter_f", "CONTAINS", "Name a word containing «ф»", "Назовите слово, в котором есть буква «ф»", "ru", value="ф")
wr("words_letter_f", "CONTAINS", "Name a word containing the letter “f”", "Name a word containing the letter “f”", "en", value="f")
wr("words_contains_st", "CONTAINS", "Name a word containing «ст»", "Назовите слово, в котором есть сочетание «ст»", "ru", value="ст")
wr("words_contains_st", "CONTAINS", "Name a word containing “st”", "Name a word containing “st”", "en", value="st")

# ---------- 26. Sweets and desserts ----------
cat("ice_cream_flavors", "KNOWLEDGE", "food", "Name an ice cream flavour", "Назовите вкус мороженого",
    "A flavour of ice cream (vanilla, chocolate, strawberry, pistachio, mint, caramel, banana, cookies and cream, crème brûlée, plombir, coffee, mango, lemon, cherry, raspberry, coconut, salted caramel, bubble gum, tutti frutti).",
    "Вкус мороженого: ванильное, шоколадное, клубничное, фисташковое, мятное, карамельное, банановое, крем брюле, пломбир, кофейное, манговое, лимонное, вишнёвое, малиновое, кокосовое, солёная карамель, жвачка, тутти фрутти.",
    """Vanilla|Ваниль|ванильное
Chocolate|Шоколад|шоколадное
Strawberry|Клубника|клубничное
Pistachio|Фисташка|фисташковое
Mint|Мята|мятное
Caramel|Карамель|карамельное
Banana|Банан|банановое
Cookies and cream|Печенье со сливками|oreo/орео
Crème brûlée|Крем брюле|creme brulee
Plombir|Пломбир
Coffee|Кофе|кофейное
Mango|Манго
Lemon|Лимон|лимонное
Cherry|Вишня|вишнёвое
Raspberry|Малина|малиновое
Coconut|Кокос|кокосовое
Salted caramel|Солёная карамель
Bubble gum|Жвачка|бабл гам
Tutti frutti|Тутти фрутти
Blueberry|Черника
Cream|Сливочное
Hazelnut|Фундук|ореховое/nut
Peanut butter|Арахисовая паста
Matcha|Матча|зелёный чай
Cheesecake|Чизкейк
Tiramisu|Тирамису
Rum raisin|Ром с изюмом
Condensed milk|Сгущёнка
Blackcurrant|Чёрная смородина|смородина
Peach|Персик
Apricot|Абрикос
Melon|Дыня
Watermelon|Арбуз
Orange|Апельсин
Lime|Лайм
Passion fruit|Маракуйя
Cinnamon|Корица
Honey|Мёд
Stracciatella|Страчателла
Neapolitan|Неаполитанское
Rocky road|Роки роуд
Cookie dough|Тесто для печенья
Lavender|Лаванда
Black sesame|Чёрный кунжут
Halva|Халва
Yogurt|Йогуртовое
Sorbet|Сорбет
Almond|Миндаль
Rose|Роза
Toffee|Ириска|тоффи
Mocha|Мокко
Brownie|Брауни
Gingerbread|Имбирный пряник""",
    "Garlic/Чеснок/Onion/Лук/Fish/Рыба/Ketchup/Кетчуп/Salt/Соль/Pepperoni/Пепперони/Meat/Мясо/Cheese pizza/Пицца/Soap/Мыло/Toothpaste/Зубная паста/Gasoline/Бензин/Borscht/Борщ")

cat("desserts", "KNOWLEDGE", "food", "Name a dessert", "Назовите разновидность десерта",
    "A real dessert or sweet dish (cake, ice cream, pudding, tiramisu, cheesecake, panna cotta, brownie, pie, eclair, macaron, jelly, mousse, napoleon, medovik, pavlova, crème brûlée, profiteroles, baklava, churros, syrniki, strudel, muffin, donut, waffles, pancakes).",
    "Настоящий десерт или сладкое блюдо: торт, мороженое, пудинг, тирамису, чизкейк, панна котта, брауни, пирог, эклер, макарон, желе, мусс, наполеон, медовик, павлова, крем брюле, профитроли, пахлава, чуррос, сырники, штрудель, кекс, пончик, вафли, блины.",
    """Cake|Торт|пирожное
Ice cream|Мороженое
Pudding|Пудинг
Tiramisu|Тирамису
Cheesecake|Чизкейк
Panna cotta|Панна котта
Brownie|Брауни
Pie|Пирог|tart/тарт
Eclair|Эклер
Macaron|Макарон|макаронс
Jelly|Желе
Mousse|Мусс
Napoleon|Наполеон|mille feuille/мильфей
Medovik|Медовик|honey cake
Pavlova|Павлова
Crème brûlée|Крем брюле|creme brulee
Profiteroles|Профитроли
Baklava|Пахлава|баклава
Churros|Чуррос
Syrniki|Сырники
Strudel|Штрудель
Muffin|Кекс|маффин
Donut|Пончик|doughnut/донат
Waffles|Вафли
Pancakes|Блины|блинчики
Cupcake|Капкейк
Apple pie|Яблочный пирог|шарлотка
Fondant|Фондан
Souffle|Суфле
Sorbet|Сорбет
Marshmallow|Зефир|маршмеллоу
Pastila|Пастила
Trifle|Трайфл
Cannoli|Канноли
Mochi|Моти
Gulab jamun|Гулаб джамун
Crepe|Крепы|креп
Bird's milk|Птичье молоко
Potato cake|Картошка пирожное
Honey cake|Чак чак
Ptichye moloko|Наполеон торт""".replace("\nPtichye moloko|Наполеон торт", "").replace("Honey cake|Чак чак", "Chak-chak|Чак чак") + """
Sachertorte|Захер
Red velvet|Красный бархат
Fruit salad|Фруктовый салат
Gelato|Джелато
Parfait|Парфе
Semifreddo|Семифредо
Kissel|Кисель
Cottage cheese casserole|Творожная запеканка
Biscuit|Печенье
Gingerbread|Пряник
Halva|Халва
Turkish delight|Рахат лукум
Chocolate fondue|Шоколадное фондю
Banana split|Банана сплит
Milkshake|Молочный коктейль
Clafoutis|Клафути
Crumble|Крамбл
Lava cake|Шоколадный фондан|лава кейк
Cinnabon|Синнабон""",
    "Soup/Суп/Pizza/Пицца/Steak/Стейк/Salad/Салат/Pelmeni/Пельмени/Bread/Хлеб/Sandwich/Бутерброд/Fries/Картошка фри/Borscht/Борщ/Sushi/Суши/Omelette/Омлет/Ketchup/Кетчуп")

cat("pancake_fillings", "KNOWLEDGE", "food", "Name a filling for pancakes (blini)", "Назовите начинку для блинов",
    "Something put into or on thin pancakes (blini/crepes): condensed milk, jam, honey, sour cream, cottage cheese, caviar, ham, cheese, mushrooms, minced meat, chicken, banana, Nutella, chocolate, strawberries, salmon, butter, apple, cabbage, rice and egg, liver.",
    "Начинка для блинов: сгущёнка, варенье, мёд, сметана, творог, икра, ветчина, сыр, грибы, фарш, курица, банан, нутелла, шоколад, клубника, сёмга, масло, яблоки, капуста, рис с яйцом, печень.",
    """Condensed milk|Сгущёнка|сгущенное молоко
Jam|Варенье|джем/повидло
Honey|Мёд
Sour cream|Сметана
Cottage cheese|Творог
Caviar|Икра|красная икра
Ham|Ветчина
Cheese|Сыр
Mushrooms|Грибы
Minced meat|Фарш|мясо
Chicken|Курица
Banana|Банан
Nutella|Нутелла|шоколадная паста
Chocolate|Шоколад
Strawberries|Клубника
Salmon|Сёмга|лосось/красная рыба
Butter|Масло|сливочное масло
Apple|Яблоки|яблоко
Cabbage|Капуста
Rice and egg|Рис с яйцом
Liver|Печень
Maple syrup|Кленовый сироп|сироп
Whipped cream|Взбитые сливки
Berries|Ягоды
Ice cream|Мороженое
Spinach|Шпинат
Lemon and sugar|Лимон с сахаром|сахар
Potato|Картошка
Egg|Яйцо
Sausage|Колбаса
Herring|Селёдка
Peanut butter|Арахисовая паста
Blueberries|Черника
Raspberries|Малина
Cherries|Вишня
Bacon|Бекон
Tuna|Тунец
Avocado|Авокадо
Caramel|Карамель
Boiled condensed milk|Варёная сгущёнка
Raisins|Изюм
Pear|Груша
Nuts|Орехи""",
    "Soup/Суп/Glue/Клей/Pasta/Макароны/Bread/Хлеб/Pizza/Пицца/Toothpaste/Зубная паста/Ketchup soup/Борщ/Ice/Лёд/Water/Вода/Pelmeni/Пельмени/Popcorn/Попкорн")

cat("cake_ingredients", "KNOWLEDGE", "food", "Name an ingredient used to make a cake", "Назовите ингредиент для приготовления торта",
    "An ingredient used to bake or decorate a cake (flour, sugar, eggs, butter, milk, baking powder, cocoa, chocolate, vanilla, cream, cream cheese, condensed milk, honey, nuts, berries, jam, sour cream, gelatin, food colouring, sprinkles, yeast rarely, salt, baking soda).",
    "Ингредиент для приготовления или украшения торта: мука, сахар, яйца, масло, молоко, разрыхлитель, какао, шоколад, ваниль, сливки, сливочный сыр, сгущёнка, мёд, орехи, ягоды, джем, сметана, желатин, краситель, посыпка, соль, сода.",
    """Flour|Мука
Sugar|Сахар
Eggs|Яйца|яйцо/egg
Butter|Сливочное масло|масло
Milk|Молоко
Baking powder|Разрыхлитель
Cocoa|Какао
Chocolate|Шоколад
Vanilla|Ваниль|ванилин
Cream|Сливки
Cream cheese|Сливочный сыр|маскарпоне
Condensed milk|Сгущёнка
Honey|Мёд
Nuts|Орехи
Berries|Ягоды
Jam|Джем|варенье
Sour cream|Сметана
Gelatin|Желатин
Food colouring|Пищевой краситель|краситель
Sprinkles|Посыпка
Salt|Соль
Baking soda|Сода
Powdered sugar|Сахарная пудра|пудра
Cottage cheese|Творог
Strawberries|Клубника
Walnuts|Грецкие орехи
Almonds|Миндаль
Coconut flakes|Кокосовая стружка
Fondant|Мастика
Caramel|Карамель
Yogurt|Йогурт
Kefir|Кефир
Vegetable oil|Растительное масло
Fruit|Фрукты
Banana|Банан
Cherries|Вишня
Raisins|Изюм
Lemon zest|Лимонная цедра|цедра
Cinnamon|Корица
Coffee|Кофе
Rum|Ром
Starch|Крахмал
Marzipan|Марципан
Whipped cream|Взбитые сливки
Custard|Заварной крем|крем
Carrot|Морковь
Poppy seeds|Мак
Agar-agar|Агар агар
Glaze|Глазурь
Margarine|Маргарин
Yeast|Дрожжи""",
    "Ketchup/Кетчуп/Mustard/Горчица/Garlic/Чеснок/Onion/Лук/Fish/Рыба/Mayonnaise/Майонез/Pepper/Перец/Sausage/Колбаса/Potato/Картошка/Pickles/Солёные огурцы/Vinegar/Уксус/Meat/Мясо")

cat("candy_types", "KNOWLEDGE", "food", "Name a type of candy (sweets)", "Назовите разновидность конфет",
    "A type or famous kind of candy / sweets (chocolate candy, lollipop, caramel, toffee, gummy bears, marshmallow, jelly beans, truffle, praline, marmalade, nougat, licorice, cotton candy, mints, M&M's, Skittles, Mishka Kosolapy, Korovka, Raffaello, Ferrero Rocher, Snickers).",
    "Вид конфет или известные конфеты: шоколадные конфеты, леденец, карамель, ириска, мармеладные мишки, зефир, драже, трюфель, пралине, мармелад, нуга, лакрица, сахарная вата, мятные, M&M's, Skittles, Мишка косолапый, Коровка, Рафаэлло, Ферреро Роше, Сникерс.",
    """Chocolate candy|Шоколадные конфеты|шоколадная конфета/chocolates
Lollipop|Леденец|чупа чупс/chupa chups/петушок
Caramel|Карамель
Toffee|Ириска|ирис
Gummy bears|Мармеладные мишки|мармеладки/gummies
Marshmallow|Маршмеллоу
Jelly beans|Драже|jelly bean
Truffle|Трюфель
Praline|Пралине
Marmalade|Мармелад
Nougat|Нуга
Licorice|Лакрица
Cotton candy|Сахарная вата
Mints|Мятные конфеты|мятные/tic tac/тик так
M&M's|M&M's|эмемдемс/m&ms
Skittles|Skittles|скитлс
Mishka Kosolapy|Мишка косолапый
Korovka|Коровка
Raffaello|Рафаэлло
Ferrero Rocher|Ферреро Роше
Snickers|Сникерс
Bonbon|Бонбоньерка|бонбон
Kit Kat|Кит кат
Twix|Твикс
Mars|Марс
Bounty|Баунти
Alenka|Алёнка
Red October|Красный Октябрь
Squirrel|Белочка
Grilyazh|Грильяж
Bird's milk|Птичье молоко
Chewing gum|Жевательная резинка|жвачка
Fudge|Фадж|помадка
Candied fruit|Цукаты
Halva|Халва
Kozinaki|Козинак|козинаки
Rakhat lukum|Рахат лукум|turkish delight
Bonbons Kara-Kum|Каракум
Lollipop cockerel|Петушок на палочке
Gobstopper|Большой леденец
Chupa Chups|Чупа Чупс
Haribo|Харибо
Mamba|Мамба
Fruittella|Фруттелла
Mentos|Ментос
Toblerone|Тоблерон
Milky Way|Милки Вэй
Kinder|Киндер|киндер сюрприз
Rot Front|Рот Фронт
Strawberry with cream|Клубника со сливками
Duchess|Дюшес|барбарис/barberry
Snickers bar|Батончик""".replace("Bonbons Kara-Kum|Каракум", "Kara-Kum|Каракум").replace("\nLollipop cockerel|Петушок на палочке", "").replace("\nChupa Chups|Чупа Чупс", "").replace("\nSnickers bar|Батончик", ""),
    "Bread/Хлеб/Cheese/Сыр/Pizza/Пицца/Soup/Суп/Chips/Чипсы/Popcorn/Попкорн/Salt/Соль/Pasta/Макароны/Apple/Яблоко/Sausage/Колбаса/Coffee/Кофе/Ketchup/Кетчуп")

# ---------- 27. Movies and cartoons ----------
cat("disney_cartoons", "KNOWLEDGE", "movies_tv", "Name an animated film released by Disney", "Назовите мультфильм студии Disney",
    "An animated feature released by Walt Disney Animation or Disney/Pixar (Snow White, Cinderella, The Lion King, Aladdin, Frozen, Moana, Zootopia, Tangled, Encanto, Mulan, Toy Story, Finding Nemo, Up, Coco, Inside Out, Bambi, Dumbo, Pinocchio).",
    "Анимационный фильм студии Disney или Disney/Pixar: Белоснежка, Золушка, Король Лев, Аладдин, Холодное сердце, Моана, Зверополис, Рапунцель, Энканто, Мулан, История игрушек, В поисках Немо, Вверх, Тайна Коко, Головоломка, Бэмби, Дамбо, Пиноккио.",
    """Snow White|Белоснежка|белоснежка и семь гномов
Cinderella|Золушка
The Lion King|Король Лев
Aladdin|Аладдин
Frozen|Холодное сердце
Moana|Моана
Zootopia|Зверополис
Tangled|Рапунцель|рапунцель запутанная история
Encanto|Энканто|энканто мир волшебства
Mulan|Мулан
Toy Story|История игрушек
Finding Nemo|В поисках Немо
Up|Вверх
Coco|Тайна Коко|коко
Inside Out|Головоломка
Bambi|Бэмби
Dumbo|Дамбо
Pinocchio|Пиноккио
The Little Mermaid|Русалочка
Beauty and the Beast|Красавица и чудовище
Sleeping Beauty|Спящая красавица
Peter Pan|Питер Пэн
The Jungle Book|Книга джунглей
101 Dalmatians|101 далматинец
Lady and the Tramp|Леди и бродяга
Alice in Wonderland|Алиса в стране чудес
Pocahontas|Покахонтас
Hercules|Геракл
Tarzan|Тарзан
Lilo & Stitch|Лило и Стич
The Hunchback of Notre Dame|Горбун из Нотр Дама
Big Hero 6|Город героев
Wreck-It Ralph|Ральф|ральф против интернета
Bolt|Вольт
The Princess and the Frog|Принцесса и лягушка
Raya and the Last Dragon|Райя и последний дракон
Wish|Заветное желание
Monsters, Inc.|Корпорация монстров
Cars|Тачки
Ratatouille|Рататуй
WALL-E|ВАЛЛ И
The Incredibles|Суперсемейка
Brave|Храбрая сердцем
Luca|Лука
Soul|Душа
Elemental|Элементарно
Turning Red|Я краснею
Onward|Вперёд
A Bug's Life|Приключения Флика
Fantasia|Фантазия
The Emperor's New Groove|Похождения императора
Treasure Planet|Планета сокровищ
Atlantis: The Lost Empire|Атлантида затерянная империя
Robin Hood|Робин Гуд
The Aristocats|Коты аристократы
The Fox and the Hound|Лис и пёс
Oliver & Company|Оливер и компания
Brother Bear|Братец медвежонок
Meet the Robinsons|В гости к Робинсонам
Chicken Little|Цыплёнок Цыпа
Strange World|Странный мир
Lightyear|Базз Лайтер
Finding Dory|В поисках Дори
Winnie the Pooh|Винни Пух""",
    "Shrek/Шрек/Madagascar/Мадагаскар/Kung Fu Panda/Кунг фу Панда/Ice Age/Ледниковый период/Despicable Me/Гадкий я/Minions/Миньоны/How to Train Your Dragon/Как приручить дракона/Spirited Away/Унесённые призраками/Cheburashka/Чебурашка/Smeshariki/Смешарики/Sing/Зверопой/The Secret Life of Pets/Тайная жизнь домашних животных/Anastasia/Анастасия/Trolls/Тролли")

cat("movies_with_number", "KNOWLEDGE", "movies_tv", "Name a movie with a number in its title", "Назовите фильм, в названии которого есть число",
    "A real film whose title contains a number written as digits or a word (Ocean's Eleven, 300, 1+1, 21 Jump Street, The Sixth Sense, Se7en, 12 Angry Men, 9 Rota, 28 Days Later, 2012, 1917, Apollo 13, District 9, The Fifth Element, Three Musketeers, 101 Dalmatians, 17 Moments of Spring, 9 1/2 Weeks). Sequel numbers like Shrek 2 count.",
    "Настоящий фильм, в названии которого есть число цифрами или словом: Одиннадцать друзей Оушена, 300 спартанцев, 1+1, Шестое чувство, Семь, 12 разгневанных мужчин, 9 рота, 28 дней спустя, 2012, 1917, Аполлон 13, Район 9, Пятый элемент, Три мушкетёра, 101 далматинец, Семнадцать мгновений весны, Шрек 2.",
    """Ocean's Eleven|Одиннадцать друзей Оушена|oceans 11
300|300 спартанцев
1+1|1+1|intouchables/неприкасаемые
The Sixth Sense|Шестое чувство
Se7en|Семь|seven
12 Angry Men|12 разгневанных мужчин|12
The 9th Company|9 рота|девятая рота
28 Days Later|28 дней спустя
2012|2012
1917|1917
Apollo 13|Аполлон 13
District 9|Район 9
The Fifth Element|Пятый элемент
The Three Musketeers|Три мушкетёра|д артаньян и три мушкетёра
101 Dalmatians|101 далматинец
Seventeen Moments of Spring|Семнадцать мгновений весны
Shrek 2|Шрек 2
2001: A Space Odyssey|Космическая одиссея 2001 года
21 Jump Street|Мачо и ботан
Fantastic Four|Фантастическая четвёрка
The Hateful Eight|Омерзительная восьмёрка
Fast Five|Форсаж 5
Seven Samurai|Семь самураев
The Magnificent Seven|Великолепная семёрка
Toy Story 3|История игрушек 3
Two Weeks Notice|Любовь с уведомлением
Three Billboards|Три билборда на границе Эббинга Миссури
1408|1408
9|Девять
10 Things I Hate About You|10 причин моей ненависти
50 First Dates|50 первых поцелуев
500 Days of Summer|500 дней лета
127 Hours|127 часов
12 Years a Slave|12 лет рабства
13 Going on 30|Из 13 в 30
Mission Impossible 2|Миссия невыполнима 2
Three Men in a Boat|Трое в лодке не считая собаки
Office Romance seven|Семь стариков и одна девушка
Moscow Does Not Believe in Tears|Двенадцать стульев
Gentlemen of Fortune|Пять вечеров
Twelve Monkeys|12 обезьян
Avengers: Infinity War|Мстители Война бесконечности
8 Mile|8 миля
Inside Out 2|Головоломка 2
Ice Age 2|Ледниковый период 2
Saw 2|Пила 2
Terminator 2|Терминатор 2
Brother 2|Брат 2
Home Alone 2|Один дома 2
Iron Man 3|Железный человек 3
Despicable Me 4|Гадкий я 4
Kung Fu Panda 4|Кунг фу Панда 4
The 40-Year-Old Virgin|Сорокалетний девственник
Ocean's Twelve|Двенадцать друзей Оушена
4 Months, 3 Weeks and 2 Days|4 месяца 3 недели и 2 дня
Nine Queens|Девять королев
Three Colors: Blue|Три цвета Синий""".replace("Office Romance seven|Семь стариков и одна девушка", "Seven Old Men and One Girl|Семь стариков и одна девушка").replace("Moscow Does Not Believe in Tears|Двенадцать стульев", "The Twelve Chairs|Двенадцать стульев").replace("Gentlemen of Fortune|Пять вечеров", "Five Evenings|Пять вечеров").replace("\nAvengers: Infinity War|Мстители Война бесконечности", "").replace("12 Angry Men|12 разгневанных мужчин|12", "12 Angry Men|12 разгневанных мужчин"),
    "Titanic/Титаник/Avatar/Аватар/Shrek/Шрек/Joker/Джокер/Inception/Начало/Gladiator/Гладиатор/Matrix/Матрица/Interstellar/Интерстеллар/Frozen/Холодное сердце/Brother/Брат/Home Alone/Один дома/Avengers/Мстители")

cat("robot_movies", "KNOWLEDGE", "movies_tv", "Name a movie with robots in it", "Назовите фильм, в котором есть роботы",
    "A real film in which robots, androids or cyborgs appear (Terminator, Transformers, WALL·E, I, Robot, Robocop, Big Hero 6, Star Wars, Ex Machina, Real Steel, Pacific Rim, Robots, The Iron Giant, Chappie, Bicentennial Man, A.I., Guest from the Future, Electronic adventures).",
    "Настоящий фильм, где есть роботы, андроиды или киборги: Терминатор, Трансформеры, ВАЛЛ И, Я робот, Робокоп, Город героев, Звёздные войны, Из машины, Живая сталь, Тихоокеанский рубеж, Роботы, Стальной гигант, Робот по имени Чаппи, Двухсотлетний человек, Искусственный разум, Приключения Электроника.",
    """The Terminator|Терминатор|terminator 2/терминатор 2
Transformers|Трансформеры
WALL-E|ВАЛЛ И|валли
I, Robot|Я робот
RoboCop|Робокоп
Big Hero 6|Город героев
Star Wars|Звёздные войны
Ex Machina|Из машины
Real Steel|Живая сталь
Pacific Rim|Тихоокеанский рубеж
Robots|Роботы
The Iron Giant|Стальной гигант|железный гигант
Chappie|Робот по имени Чаппи|чаппи
Bicentennial Man|Двухсотлетний человек
A.I. Artificial Intelligence|Искусственный разум
Adventures of Electronic|Приключения Электроника
Guest from the Future|Гостья из будущего
Short Circuit|Короткое замыкание
Blade Runner|Бегущий по лезвию
Avengers: Age of Ultron|Мстители Эра Альтрона
Interstellar|Интерстеллар
Alita: Battle Angel|Алита Боевой ангел
The Wild Robot|Дикий робот
Megan|М3ГАН|m3gan
Bumblebee|Бамблби
Metropolis|Метрополис
Westworld|Мир Дикого Запада
Robot and Frank|Робот и Фрэнк
Next Gen|Следующее поколение
Ron's Gone Wrong|Неисправимый Рон
The Mitchells vs. the Machines|Митчеллы против машин
Lost in Space|Затерянные в космосе
Elysium|Элизиум
Prometheus|Прометей
Alien|Чужой
The Matrix|Матрица
Iron Man|Железный человек
Pinocchio|Пиноккио
Small Soldiers|Солдатики
Batteries Not Included|Батарейки не прилагаются
Automata|Автоматы
Moon|Луна 2112
The Creator|Создатель
Atlas|Атлас
Free Guy|Главный герой
Love, Death & Robots|Любовь смерть и роботы
Mars Needs Moms|Тайна красной планеты
Planet of the Robots|Планета роботов""".replace("\nPinocchio|Пиноккио", "").replace("\nFree Guy|Главный герой", "").replace("\nLove, Death & Robots|Любовь смерть и роботы", "").replace("\nMars Needs Moms|Тайна красной планеты", "").replace("\nPlanet of the Robots|Планета роботов", ""),
    "Titanic/Титаник/Shrek/Шрек/Frozen/Холодное сердце/Home Alone/Один дома/The Lion King/Король Лев/Harry Potter/Гарри Поттер/Joker/Джокер/Gladiator/Гладиатор/Brother/Брат/Jaws/Челюсти/Avatar/Аватар")

cat("pixar_characters", "KNOWLEDGE", "movies_tv", "Name a character from a Pixar film", "Назовите персонажа из мультфильмов Pixar",
    "A character from a Pixar animated film (Woody, Buzz Lightyear, Nemo, Dory, Marlin, Lightning McQueen, Mater, Sulley, Mike Wazowski, Boo, WALL·E, EVE, Remy, Carl, Russell, Mr. Incredible, Merida, Joy, Sadness, Miguel, Joe Gardner, Luca, Mei, Ember, Jessie, Rex).",
    "Персонаж мультфильма Pixar: Вуди, Базз Лайтер, Немо, Дори, Марлин, Молния Маккуин, Мэтр, Салли, Майк Вазовски, Бу, ВАЛЛ И, Ева, Реми, Карл, Рассел, Мистер Исключительный, Мерида, Радость, Печаль, Мигель, Джо Гарднер, Лука, Мэй, Эмбер, Джесси, Рекс.",
    """Woody|Вуди|шериф вуди
Buzz Lightyear|Базз Лайтер|базз
Nemo|Немо
Dory|Дори
Marlin|Марлин
Lightning McQueen|Молния Маккуин|маккуин
Mater|Мэтр|сырник
Sulley|Салли|джеймс салливан
Mike Wazowski|Майк Вазовски|майк
Boo|Бу
WALL-E|ВАЛЛ И|валли
EVE|Ева|eve
Remy|Реми
Carl Fredricksen|Карл|карл фредриксен
Russell|Рассел
Mr. Incredible|Мистер Исключительный|боб парр
Elastigirl|Эластика|хелен парр
Dash|Шастик
Violet|Фиалка|вайолет
Jack-Jack|Джек Джек
Edna Mode|Эдна Мод
Syndrome|Синдром
Frozone|Холодюн
Merida|Мерида
Joy|Радость
Sadness|Печаль
Anger|Гнев
Fear|Страх
Disgust|Брезгливость
Anxiety|Тревожность
Bing Bong|Бинг Бонг
Miguel|Мигель
Hector|Гектор
Joe Gardner|Джо Гарднер
22|22
Luca|Лука
Alberto|Альберто
Mei Lee|Мэй|мэй ли
Ember|Эмбер
Wade|Уэйд
Jessie|Джесси
Rex|Рекс
Hamm|Хэмм
Slinky|Слинки
Mr. Potato Head|Мистер Картофельная голова
Bo Peep|Бо Пип
Forky|Вилкинс
Lotso|Лотсо
Bullseye|Булзай
Andy|Энди
Sid|Сид
Aliens|Инопланетяне|зелёные человечки
Flik|Флик
Hopper|Хоппер
Squirt|Сквирт
Crush|Краш
Bruce|Брюс
Gill|Жабр
Doc Hudson|Док Хадсон
Sally Carrera|Салли Каррера
Cruz Ramirez|Круз Рамирес
Linguini|Лингвини
Anton Ego|Антон Эго
Dug|Даг
Kevin|Кевин
Charles Muntz|Чарльз Манц
Randall|Рэндалл
Roz|Роз
Ian Lightfoot|Иэн Лайтфут
Barley|Барли
Riley|Райли
Arlo|Арло
Spot|Спот
Ellie|Элли
Dante|Данте
Mama Coco|Мама Коко""",
    "Shrek/Шрек/Elsa/Эльза/Simba/Симба/Mickey Mouse/Микки Маус/Olaf/Олаф/Stitch/Стич/Minion/Миньон/Po/По/Gru/Грю/Moana/Моана/Aladdin/Аладдин/Ariel/Ариэль/SpongeBob/Губка Боб/Pikachu/Пикачу")

cat("alien_movies", "KNOWLEDGE", "movies_tv", "Name a movie with aliens in it", "Назовите фильм, в котором есть инопланетяне",
    "A real film in which extraterrestrials appear (E.T., Alien, Men in Black, Independence Day, Predator, Arrival, District 9, War of the Worlds, Avatar, Lilo & Stitch, Signs, Close Encounters, Edge of Tomorrow, Attraction, Kin-dza-dza, Through the Thorns to the Stars, Paul, Nope).",
    "Настоящий фильм, где есть инопланетяне: Инопланетянин, Чужой, Люди в чёрном, День независимости, Хищник, Прибытие, Район 9, Война миров, Аватар, Лило и Стич, Знаки, Близкие контакты третьей степени, Грань будущего, Притяжение, Кин дза дза, Через тернии к звёздам, Пол секретный материальчик, Нет.",
    """E.T.|Инопланетянин|e t/et
Alien|Чужой|aliens/чужие
Men in Black|Люди в чёрном
Independence Day|День независимости
Predator|Хищник
Arrival|Прибытие
District 9|Район 9
War of the Worlds|Война миров
Avatar|Аватар
Lilo & Stitch|Лило и Стич
Signs|Знаки
Close Encounters of the Third Kind|Близкие контакты третьей степени
Edge of Tomorrow|Грань будущего
Attraction|Притяжение
Kin-dza-dza!|Кин дза дза
Through the Thorns to the Stars|Через тернии к звёздам
Paul|Пол Секретный материальчик|пол
Nope|Нет
Mars Attacks!|Марс атакует
The Thing|Нечто
Super 8|Супер 8
Battleship|Морской бой
Pacific Rim|Тихоокеанский рубеж
Transformers|Трансформеры
Home|Дом
Monsters vs. Aliens|Монстры против пришельцев
Planet 51|Планета 51
Space Jam|Космический джем
Cowboys & Aliens|Ковбои против пришельцев
Oblivion|Обливион
Skyline|Скайлайн
A Quiet Place|Тихое место
Battle: Los Angeles|Инопланетное вторжение Битва за Лос Анджелес
Prometheus|Прометей
Guardians of the Galaxy|Стражи Галактики
Superman|Супермен|человек из стали
The Day the Earth Stood Still|День когда Земля остановилась
Contact|Контакт
Galaxy Quest|В поисках галактики
Star Wars|Звёздные войны
Under the Skin|Побудь в моей шкуре
Annihilation|Аннигиляция
Invasion|Вторжение
Captain Marvel|Капитан Марвел
Starship Troopers|Звёздный десант
Spaced Invaders|Космические захватчики
Mac and Me|Мак и я
The Fifth Element|Пятый элемент
Dune|Дюна
Lightyear|Базз Лайтер
Chicken Little|Цыплёнок Цыпа
Earth to Echo|Внеземное эхо
The Host|Гостья
Life|Живое
Alien vs. Predator|Чужой против хищника
Coneheads|Яйцеголовые
Bumblebee|Бамблби""",
    "Titanic/Титаник/Home Alone/Один дома/Frozen/Холодное сердце/The Godfather/Крёстный отец/Shrek/Шрек/Joker/Джокер/Gladiator/Гладиатор/Jurassic Park/Парк Юрского периода/Brother/Брат/Harry Potter/Гарри Поттер/Jaws/Челюсти")

# ---------- 28. Electronics ----------
cat("phone_makers", "KNOWLEDGE", "science", "Name a smartphone manufacturer", "Назовите производителя смартфонов",
    "A company that makes or made smartphones (Apple, Samsung, Xiaomi, Huawei, Honor, Google, OnePlus, Oppo, Vivo, Realme, Motorola, Nokia, Sony, LG, Asus, Lenovo, ZTE, Tecno, Infinix, Poco, Nothing, HTC, BlackBerry, Meizu, Fairphone).",
    "Компания, которая выпускает или выпускала смартфоны: Apple, Samsung, Xiaomi, Huawei, Honor, Google, OnePlus, Oppo, Vivo, Realme, Motorola, Nokia, Sony, LG, Asus, Lenovo, ZTE, Tecno, Infinix, Poco, Nothing, HTC, BlackBerry, Meizu.",
    """Apple|Apple|эпл/эппл/айфон/iphone
Samsung|Samsung|самсунг
Xiaomi|Xiaomi|сяоми/ксиаоми/redmi/редми
Huawei|Huawei|хуавей
Honor|Honor|хонор
Google|Google|гугл/pixel/пиксель
OnePlus|OnePlus|ванплас
Oppo|Oppo|оппо
Vivo|Vivo|виво
Realme|Realme|реалми
Motorola|Motorola|моторола
Nokia|Nokia|нокиа
Sony|Sony|сони
LG|LG|элджи
Asus|Asus|асус
Lenovo|Lenovo|леново
ZTE|ZTE
Tecno|Tecno|текно
Infinix|Infinix|инфиникс
Poco|Poco|поко
Nothing|Nothing|насинг
HTC|HTC
BlackBerry|BlackBerry|блэкберри
Meizu|Meizu|мейзу
Fairphone|Fairphone
Alcatel|Alcatel|алкатель
Siemens|Siemens|сименс
Ericsson|Sony Ericsson|эриксон
Doogee|Doogee
Ulefone|Ulefone
Blackview|Blackview
Itel|Itel
Micromax|Micromax
Vertu|Vertu|верту
Philips|Philips|филипс
Highscreen|Highscreen|хайскрин
BQ|BQ
Fly|Fly
Yota|YotaPhone|йотафон
Oukitel|Oukitel
Umidigi|Umidigi
Cubot|Cubot
Sharp|Sharp
Kyocera|Kyocera
Palm|Palm
TCL|TCL
Black Shark|Black Shark
Red Magic|RedMagic|нубия/nubia
iQOO|iQOO
Zenfone|Zenfone""".replace("\nZenfone|Zenfone", ""),
    "Microsoft/Майкрософт/Intel/Интел/Amazon/Амазон/Tesla/Тесла/Netflix/Нетфликс/Nike/Найк/Coca-Cola/Кока кола/Toyota/Тойота/Android/Андроид/Windows/Виндовс/Facebook/Фейсбук/Yandex/Яндекс")

cat("social_networks", "KNOWLEDGE", "science", "Name a social network", "Назовите социальную сеть",
    "A social network or social media platform (Facebook, Instagram, TikTok, VK / VKontakte, Odnoklassniki, X / Twitter, YouTube, Snapchat, LinkedIn, Pinterest, Reddit, Telegram, Threads, Tumblr, Discord, Twitch, WeChat, Weibo, Likee, MySpace, Bluesky).",
    "Социальная сеть или платформа соцмедиа: Facebook, Instagram, TikTok, ВКонтакте, Одноклассники, X (Twitter), YouTube, Snapchat, LinkedIn, Pinterest, Reddit, Telegram, Threads, Tumblr, Discord, Twitch, WeChat, Weibo, Likee, MySpace, Bluesky.",
    """Facebook|Facebook|фейсбук/фб
Instagram|Instagram|инстаграм/инста/insta
TikTok|TikTok|тикток/тик ток
VKontakte|ВКонтакте|вк/vk/контакт
Odnoklassniki|Одноклассники|ок/ok
X|Twitter|твиттер/икс/x twitter
YouTube|YouTube|ютуб/ютьюб
Snapchat|Snapchat|снэпчат
LinkedIn|LinkedIn|линкедин
Pinterest|Pinterest|пинтерест
Reddit|Reddit|реддит
Telegram|Telegram|телеграм/телега/тг
Threads|Threads|тредс
Tumblr|Tumblr|тамблер
Discord|Discord|дискорд
Twitch|Twitch|твич
WeChat|WeChat|вичат
Weibo|Weibo|вейбо
Likee|Likee|лайки
MySpace|MySpace|майспейс
Bluesky|Bluesky|блюскай
WhatsApp|WhatsApp|ватсап/вотсап
Viber|Viber|вайбер
Mastodon|Mastodon|мастодон
Quora|Quora
Clubhouse|Clubhouse|клабхаус
BeReal|BeReal
Yappy|Yappy|яппи
Dzen|Дзен|яндекс дзен
Rutube|Rutube|рутуб
LiveJournal|Живой журнал|жж/livejournal
Moy Mir|Мой мир
Flickr|Flickr|фликр
Deviantart|DeviantArt
Behance|Behance|беханс
Goodreads|Goodreads
Letterboxd|Letterboxd
Strava|Strava
Vine|Vine
Google+|Google Plus|гугл плюс
Ask.fm|Ask fm
Habr|Хабр
Pikabu|Пикабу
Tinder|Tinder|тиндер
Badoo|Badoo|баду
Kick|Kick
Steam|Steam Community
Line|Line
KakaoTalk|KakaoTalk
Douyin|Douyin
Xiaohongshu|Xiaohongshu|red note""",
    "Google/Гугл/Yandex/Яндекс/Wikipedia/Википедия/Netflix/Нетфликс/Amazon/Амазон/Gmail/Gmail/Spotify/Спотифай/Zoom/Зум/Skype/Скайп/Chrome/Хром/Avito/Авито/Ozon/Озон")

cat("headphone_devices", "SEMANTIC", "science", "Name a device you can connect headphones to", "Назовите устройство, к которому можно подключить наушники",
    "A device that headphones can plug into or pair with by cable or Bluetooth (phone, laptop, computer, tablet, TV, MP3 player, game console, gamepad, radio, piano / synthesizer, guitar amplifier, DJ mixer, airplane seat, smartwatch, cassette player, CD player, e-reader).",
    "Устройство, к которому подключают наушники проводом или по Bluetooth: телефон, ноутбук, компьютер, планшет, телевизор, MP3 плеер, игровая приставка, геймпад, радиоприёмник, синтезатор, гитарный усилитель, DJ пульт, кресло в самолёте, умные часы, кассетный плеер, CD плеер.",
    """Phone|Телефон|смартфон/smartphone
Laptop|Ноутбук
Computer|Компьютер|pc/пк
Tablet|Планшет
Television|Телевизор|tv
MP3 player|MP3 плеер|плеер/ipod/айпод
Game console|Игровая приставка|приставка/playstation/xbox/nintendo switch
Gamepad|Геймпад|джойстик
Radio|Радиоприёмник|радио
Synthesizer|Синтезатор|digital piano/цифровое пианино
Guitar amplifier|Гитарный усилитель|комбик
DJ mixer|DJ пульт|микшер
Airplane seat|Кресло в самолёте|самолёт
Smartwatch|Умные часы
Cassette player|Кассетный плеер|walkman/вокмен
CD player|CD плеер
E-reader|Электронная книга
Audio interface|Звуковая карта|аудиоинтерфейс
Hi-fi amplifier|Усилитель
Turntable|Проигрыватель винила|проигрыватель
Car stereo|Магнитола
VR headset|VR шлем
Electric drum kit|Электронные барабаны
Translator device|Электронный переводчик
Hearing aid streamer|Слуховой аппарат
Walkie-talkie|Рация
Treadmill|Беговая дорожка
Projector|Проектор
Smart speaker|Умная колонка
Steam Deck|Steam Deck
Dictaphone|Диктофон
Monitor|Монитор
Mixing console|Микшерный пульт
Audio guide|Аудиогид
Karaoke machine|Караоке система""",
    "Fridge/Холодильник/Toaster/Тостер/Kettle/Чайник/Microwave/Микроволновка/Iron/Утюг/Lamp/Лампа/Washing machine/Стиральная машина/Calculator/Калькулятор/Book/Книга/Clock/Часы/Oven/Духовка/Vacuum cleaner/Пылесос")

cat("photo_devices", "SEMANTIC", "science", "Name a device that can take photos", "Назовите устройство, которое умеет фотографировать",
    "A device able to take photographs (camera, smartphone, tablet, laptop webcam, action camera / GoPro, drone, instant camera / Polaroid, DSLR, film camera, security camera, dashcam, smart glasses, telescope camera, satellite, endoscope, Nintendo DS / 3DS).",
    "Устройство, которое может делать фотографии: фотоаппарат, смартфон, планшет, веб камера, экшн камера (GoPro), дрон, полароид, зеркалка, плёночный фотоаппарат, камера видеонаблюдения, видеорегистратор, умные очки, спутник.",
    """Camera|Фотоаппарат|камера
Smartphone|Смартфон|телефон/phone/iphone/айфон
Tablet|Планшет
Webcam|Веб камера|вебка
Action camera|Экшн камера|gopro/гоупро
Drone|Дрон|квадрокоптер
Instant camera|Полароид|polaroid/instax/инстакс
DSLR|Зеркалка|зеркальный фотоаппарат
Film camera|Плёночный фотоаппарат|мыльница
Mirrorless camera|Беззеркалка
Security camera|Камера видеонаблюдения
Dashcam|Видеорегистратор
Smart glasses|Умные очки
Satellite|Спутник
Endoscope|Эндоскоп
Nintendo 3DS|Nintendo 3DS
Laptop|Ноутбук
Camcorder|Видеокамера
Video doorbell|Видеодомофон
Speed camera|Камера фиксации скорости
Trail camera|Фотоловушка
Microscope camera|Цифровой микроскоп
Telescope|Телескоп с камерой
Smartwatch|Умные часы с камерой
Photo booth|Фотобудка
Pinhole camera|Камера обскура
Space telescope|Космический телескоп|хаббл
Thermal camera|Тепловизор
Baby monitor|Видеоняня
Robot vacuum|Робот пылесос с камерой
Rover|Марсоход
Medium format camera|Среднеформатная камера
Spy camera|Скрытая камера
Body camera|Нагрудная камера|видеорегистратор полицейского
360 camera|Камера 360""",
    "Printer/Принтер/Scanner/Сканер/Radio/Радио/Microphone/Микрофон/Calculator/Калькулятор/Fridge/Холодильник/Speaker/Колонка/Headphones/Наушники/Mirror/Зеркало/Projector/Проектор/Keyboard/Клавиатура/Toaster/Тостер")

cat("usb_charged_devices", "SEMANTIC", "science", "Name an electronic device that can charge via USB", "Назовите устройство, которое можно заряжать через USB",
    "An electronic device commonly charged through a USB cable (phone, tablet, wireless headphones, earbuds, smartwatch, fitness band, power bank, e-reader, Bluetooth speaker, laptop with USB-C, gamepad, electric toothbrush, vape, flashlight, wireless mouse, camera, drone controller, e-cigarette, Nintendo Switch).",
    "Устройство, которое обычно заряжают через USB: телефон, планшет, беспроводные наушники, умные часы, фитнес браслет, пауэрбанк, электронная книга, колонка, ноутбук с USB C, геймпад, электрическая зубная щётка, фонарик, беспроводная мышь, фотоаппарат, Nintendo Switch.",
    """Phone|Телефон|смартфон/smartphone
Tablet|Планшет
Wireless headphones|Беспроводные наушники|наушники/airpods/earbuds
Smartwatch|Умные часы|apple watch
Fitness band|Фитнес браслет
Power bank|Пауэрбанк|внешний аккумулятор
E-reader|Электронная книга|kindle
Bluetooth speaker|Колонка|портативная колонка/jbl
Laptop|Ноутбук|macbook
Gamepad|Геймпад|джойстик
Electric toothbrush|Электрическая зубная щётка
Flashlight|Фонарик
Wireless mouse|Беспроводная мышь|мышка
Camera|Фотоаппарат|камера
Nintendo Switch|Nintendo Switch|свитч
Vape|Вейп|электронная сигарета/e-cigarette
Shaver|Электробритва|триммер
Action camera|Экшн камера|gopro
Drone|Дрон
Keyboard|Беспроводная клавиатура|клавиатура
Hair clipper|Машинка для стрижки
Portable fan|Портативный вентилятор
Smart ring|Умное кольцо
Head torch|Налобный фонарик
Bike light|Велофара
Electric lighter|USB зажигалка|зажигалка
VR headset|VR шлем
Massage gun|Массажный пистолет
Steam Deck|Steam Deck
Portable blender|Портативный блендер
Hearing aid|Слуховой аппарат
Tracker|Трекер|airtag
Radio|Радиоприёмник
GPS navigator|Навигатор
Stylus|Стилус|apple pencil
Epilator|Эпилятор
Walkie-talkie|Рация
Night light|Ночник
Smart glasses|Умные очки
Microphone|Беспроводной микрофон|петличка
Electric scooter|Электросамокат""".replace("\nElectric scooter|Электросамокат", ""),
    "Fridge/Холодильник/Washing machine/Стиральная машина/Oven/Духовка/Microwave/Микроволновка/Kettle/Чайник/Iron/Утюг/Candle/Свеча/Car/Машина/Book/Книга/Television/Телевизор/Dishwasher/Посудомойка/Air conditioner/Кондиционер")

# ---------- 29. In the bathroom ----------
cat("hair_care_items", "KNOWLEDGE", "everyday", "Name an item for hair care", "Назовите предмет для ухода за волосами",
    "An item or product used to care for or style hair (comb, hairbrush, hair dryer, shampoo, conditioner, hair straightener, curling iron, hair mask, hair spray, gel, hair ties, hairpins, scissors, hair oil, mousse, wax, dry shampoo, clippers).",
    "Предмет или средство для ухода за волосами: расчёска, щётка, фен, шампунь, кондиционер, утюжок, плойка, маска для волос, лак, гель, резинки, заколки, ножницы, масло для волос, мусс, воск, сухой шампунь, машинка для стрижки.",
    """Comb|Расчёска|гребень/гребешок
Hairbrush|Щётка для волос|массажка/массажная расчёска
Hair dryer|Фен
Shampoo|Шампунь
Conditioner|Кондиционер|бальзам для волос/бальзам
Hair straightener|Утюжок|выпрямитель
Curling iron|Плойка|стайлер
Hair mask|Маска для волос
Hair spray|Лак для волос|лак
Hair gel|Гель для волос|гель
Hair ties|Резинки для волос|резинка
Hairpins|Шпильки|невидимки
Hair clip|Заколка|краб
Scissors|Ножницы
Hair oil|Масло для волос
Mousse|Мусс
Hair wax|Воск для волос|воск
Dry shampoo|Сухой шампунь
Clippers|Машинка для стрижки|триммер
Curlers|Бигуди
Hair dye|Краска для волос|краска
Headband|Ободок
Serum|Сыворотка для волос
Leave-in spray|Несмываемый спрей|спрей
Thermal protection|Термозащита
Hair towel|Полотенце тюрбан|тюрбан
Shower cap|Шапочка для душа
Henna|Хна
Pomade|Помада для волос
Volume powder|Пудра для волос
Hair vitamins|Витамины для волос
Scrunchie|Скранчи
Lice comb|Гребень от вшей
Hot brush|Фен щётка
Crimper|Гофре
Diffuser|Диффузор
Hair bun maker|Бублик для пучка
Beard oil|Масло для бороды
Hair net|Сеточка для волос
Wig|Парик""".replace("\nWig|Парик", ""),
    "Toothbrush/Зубная щётка/Toothpaste/Зубная паста/Nail polish/Лак для ногтей/Lipstick/Помада/Deodorant/Дезодорант/Razor/Бритва/Sponge/Губка/Mascara/Тушь/Towel/Полотенце/Soap/Мыло/Perfume/Духи/Floss/Зубная нить")

cat("hygiene_products", "KNOWLEDGE", "everyday", "Name a personal hygiene product", "Назовите средство личной гигиены",
    "A product used for personal hygiene (soap, toothpaste, toothbrush, shampoo, deodorant, shower gel, toilet paper, wet wipes, dental floss, razor, cotton swabs, sanitary pads, tampons, mouthwash, hand sanitizer, cotton pads, nail clippers, towel, sponge).",
    "Средство личной гигиены: мыло, зубная паста, зубная щётка, шампунь, дезодорант, гель для душа, туалетная бумага, влажные салфетки, зубная нить, бритва, ватные палочки, прокладки, тампоны, ополаскиватель, антисептик, ватные диски, полотенце, мочалка.",
    """Soap|Мыло
Toothpaste|Зубная паста
Toothbrush|Зубная щётка
Shampoo|Шампунь
Deodorant|Дезодорант|антиперспирант
Shower gel|Гель для душа
Toilet paper|Туалетная бумага
Wet wipes|Влажные салфетки
Dental floss|Зубная нить|флосс
Razor|Бритва|станок
Cotton swabs|Ватные палочки
Sanitary pads|Прокладки
Tampons|Тампоны
Mouthwash|Ополаскиватель для рта|ополаскиватель
Hand sanitizer|Антисептик|санитайзер
Cotton pads|Ватные диски
Nail clippers|Кусачки для ногтей|книпсер
Towel|Полотенце
Washcloth|Мочалка
Liquid soap|Жидкое мыло
Intimate gel|Гель для интимной гигиены
Shaving foam|Пена для бритья
Tissues|Бумажные салфетки|носовой платок
Menstrual cup|Менструальная чаша
Diapers|Подгузники|памперсы
Nail file|Пилка для ногтей
Comb|Расчёска
Lip balm|Гигиеническая помада
Foot cream|Крем для ног
Body lotion|Лосьон для тела
Tongue scraper|Скребок для языка
Irrigator|Ирригатор
Ear drops|Капли для ушей
Pumice|Пемза
Bath salt|Соль для ванн
Shower cap|Шапочка для душа
Antiperspirant wipes|Салфетки для лица
Panty liners|Ежедневки|ежедневные прокладки
Condoms|Презервативы""",
    "Lipstick/Помада/Mascara/Тушь/Perfume/Духи/Phone/Телефон/Hammer/Молоток/Spoon/Ложка/Nail polish/Лак для ногтей/Bread/Хлеб/Book/Книга/Glasses/Очки/Earrings/Серьги/Pillow/Подушка")

cat("tooth_care_items", "KNOWLEDGE", "everyday", "Name an item used to care for teeth", "Назовите предмет для ухода за зубами",
    "An item used to clean or care for teeth (toothbrush, toothpaste, dental floss, mouthwash, electric toothbrush, irrigator / water flosser, toothpicks, interdental brush, tongue scraper, tooth powder, whitening strips, chewing gum, retainer, braces, mouth guard).",
    "Предмет для чистки или ухода за зубами: зубная щётка, зубная паста, зубная нить, ополаскиватель, электрическая щётка, ирригатор, зубочистки, ёршик, скребок для языка, зубной порошок, отбеливающие полоски, жвачка, капа, брекеты, элайнеры.",
    """Toothbrush|Зубная щётка|щётка
Toothpaste|Зубная паста|паста
Dental floss|Зубная нить|флосс/нитка
Mouthwash|Ополаскиватель для рта|ополаскиватель
Electric toothbrush|Электрическая щётка|электрощётка
Water flosser|Ирригатор
Toothpicks|Зубочистка|зубочистки
Interdental brush|Ёршик|межзубный ёршик
Tongue scraper|Скребок для языка
Tooth powder|Зубной порошок
Whitening strips|Отбеливающие полоски
Chewing gum|Жвачка|жевательная резинка
Retainer|Ретейнер
Braces|Брекеты
Mouth guard|Капа
Aligners|Элайнеры
Denture tablets|Таблетки для зубных протезов
Floss picks|Флоссеры
Fluoride gel|Фторсодержащий гель|гель для зубов
Whitening pen|Отбеливающий карандаш
Dental mirror|Стоматологическое зеркало
Charcoal toothpaste|Угольная паста
Miswak|Мисвак
Toothbrush holder|Стакан для щёток
Dental wax|Ортодонтический воск
Denture adhesive|Клей для протезов
Chewing stick|Жевательная палочка
Sonic toothbrush|Звуковая щётка
Oral rinse tablets|Таблетки для полоскания""".replace("\nOral rinse tablets|Таблетки для полоскания", ""),
    "Comb/Расчёска/Shampoo/Шампунь/Soap/Мыло/Lipstick/Помада/Razor/Бритва/Hair dryer/Фен/Candy/Конфета/Sugar/Сахар/Towel/Полотенце/Mascara/Тушь/Deodorant/Дезодорант/Cola/Кола")

cat("cosmetics_types", "KNOWLEDGE", "everyday", "Name a type of cosmetics (makeup or skincare)", "Назовите разновидность косметики",
    "A type of makeup or skincare cosmetic (lipstick, mascara, foundation, powder, blush, eyeshadow, eyeliner, concealer, lip gloss, nail polish, face cream, serum, toner, highlighter, bronzer, primer, brow pencil, micellar water, face mask, BB cream, perfume counts).",
    "Вид декоративной или уходовой косметики: помада, тушь, тональный крем, пудра, румяна, тени, подводка, консилер, блеск для губ, лак для ногтей, крем для лица, сыворотка, тоник, хайлайтер, бронзер, праймер, карандаш для бровей, мицеллярная вода, маска для лица, BB крем, духи.",
    """Lipstick|Помада|губная помада
Mascara|Тушь|тушь для ресниц
Foundation|Тональный крем|тоналка/тональник
Powder|Пудра
Blush|Румяна
Eyeshadow|Тени|тени для век
Eyeliner|Подводка|подводка для глаз/карандаш для глаз
Concealer|Консилер
Lip gloss|Блеск для губ|блеск
Nail polish|Лак для ногтей
Face cream|Крем для лица|крем
Serum|Сыворотка
Toner|Тоник
Highlighter|Хайлайтер
Bronzer|Бронзер
Primer|Праймер|база под макияж
Brow pencil|Карандаш для бровей
Micellar water|Мицеллярная вода|мицелярка
Face mask|Маска для лица|тканевая маска/sheet mask
BB cream|BB крем|cc cream
Perfume|Духи|парфюм
Lip liner|Карандаш для губ
Contour|Контуринг|скульптор
Setting spray|Фиксатор макияжа
Eye cream|Крем для глаз
Sunscreen|Солнцезащитный крем|spf
Scrub|Скраб
Cleanser|Пенка для умывания|гель для умывания
Lip balm|Бальзам для губ
Brow gel|Гель для бровей
False lashes|Накладные ресницы
Glitter|Глиттер|блёстки
Body lotion|Лосьон для тела
Hand cream|Крем для рук
Self-tanner|Автозагар
Makeup remover|Средство для снятия макияжа
Tinted lip oil|Масло для губ
Patches|Патчи
Eau de toilette|Туалетная вода
Body shimmer|Шиммер
Peeling|Пилинг
Hydrophilic oil|Гидрофильное масло
Cushion|Кушон
Lip tint|Тинт""",
    "Toothpaste/Зубная паста/Shampoo/Шампунь/Soap/Мыло/Toilet paper/Туалетная бумага/Razor/Бритва/Comb/Расчёска/Towel/Полотенце/Mirror/Зеркало/Brush/Щётка/Paint/Краска/Glue/Клей/Pencil/Простой карандаш")

cat("body_washing_items", "KNOWLEDGE", "everyday", "Name an item used for washing the body", "Назовите предмет для мытья тела",
    "An item or product used to wash the body (soap, shower gel, washcloth, sponge, loofah, bath bomb, scrub, body brush, shower, bathtub, towel counts as drying, bath foam, pumice, mitt, birch broom / venik for banya, liquid soap, wet wipes).",
    "Предмет или средство для мытья тела: мыло, гель для душа, мочалка, губка, люфа, бомбочка для ванны, скраб, щётка для тела, душ, ванна, пена для ванн, пемза, рукавица, банный веник, жидкое мыло, влажные салфетки.",
    """Soap|Мыло
Shower gel|Гель для душа|body wash
Washcloth|Мочалка
Sponge|Губка
Loofah|Люфа|lufa
Bath bomb|Бомбочка для ванны|бомбочка
Scrub|Скраб
Body brush|Щётка для тела
Shower|Душ
Bathtub|Ванна
Bath foam|Пена для ванн|bubble bath
Pumice|Пемза
Bath mitt|Банная рукавица|рукавица/кесе
Birch broom|Банный веник|веник
Liquid soap|Жидкое мыло
Wet wipes|Влажные салфетки
Shower puff|Мочалка шар|пуф
Bath salt|Соль для ванн
Bucket|Ковш|тазик/таз
Water|Вода
Shower head|Лейка душа
Sauna|Баня|сауна
Bath oil|Масло для ванн
Shampoo|Шампунь
Body milk|Молочко для тела
Back scrubber|Мочалка для спины
Hydromassage|Гидромассаж
Jacuzzi|Джакузи
Bidet|Биде
Sea sponge|Морская губка
Konjac sponge|Спонж конжак
Tar soap|Дегтярное мыло
Baby soap|Детское мыло
Shower oil|Масло для душа
Steamer brush|Щётка с длинной ручкой""".replace("\nSteamer brush|Щётка с длинной ручкой", ""),
    "Toothbrush/Зубная щётка/Lipstick/Помада/Comb/Расчёска/Mascara/Тушь/Hair dryer/Фен/Phone/Телефон/Dish soap/Средство для посуды/Mop/Швабра/Broom/Метла/Washing powder/Стиральный порошок/Sand/Песок/Bleach/Отбеливатель")

# ---------- 30. Transport and cars ----------
cat("car_brands", "KNOWLEDGE", "transport", "Name a car brand", "Назовите марку автомобиля",
    "A real car brand or manufacturer (Toyota, BMW, Mercedes-Benz, Audi, Volkswagen, Ford, Lada, Kia, Hyundai, Tesla, Honda, Nissan, Renault, Ferrari, Lamborghini, Porsche, Chevrolet, Mazda, Skoda, Volvo, Peugeot, GAZ, UAZ, Moskvich, Geely, Chery, Haval, BYD).",
    "Настоящая марка автомобиля: Toyota, BMW, Mercedes, Audi, Volkswagen, Ford, Лада, Kia, Hyundai, Tesla, Honda, Nissan, Renault, Ferrari, Lamborghini, Porsche, Chevrolet, Mazda, Skoda, Volvo, Peugeot, ГАЗ, УАЗ, Москвич, Geely, Chery, Haval, BYD.",
    """Toyota|Тойота|toyota
BMW|БМВ|бэха/бумер
Mercedes-Benz|Мерседес|mercedes/мерс
Audi|Ауди
Volkswagen|Фольксваген|vw/фольц
Ford|Форд
Lada|Лада|ваз/жигули/жигуль
Kia|Киа
Hyundai|Хендай|хёндай/хундай
Tesla|Тесла
Honda|Хонда
Nissan|Ниссан
Renault|Рено
Ferrari|Феррари
Lamborghini|Ламборгини|ламба
Porsche|Порше
Chevrolet|Шевроле|chevy
Mazda|Мазда
Skoda|Шкода
Volvo|Вольво
Peugeot|Пежо
GAZ|ГАЗ|волга/газель
UAZ|УАЗ|буханка
Moskvich|Москвич
Geely|Джили
Chery|Чери
Haval|Хавал
BYD|BYD|бид
Lexus|Лексус
Subaru|Субару
Mitsubishi|Мицубиси|митсубиши
Suzuki|Сузуки
Jeep|Джип
Land Rover|Ленд Ровер|range rover/рендж ровер
Jaguar|Ягуар
Bentley|Бентли
Rolls-Royce|Роллс Ройс
Aston Martin|Астон Мартин
Maserati|Мазерати
Bugatti|Бугатти
McLaren|Макларен
Fiat|Фиат
Alfa Romeo|Альфа Ромео
Citroen|Ситроен
Opel|Опель
Seat|Сеат
Dacia|Дачия
Mini|Мини
Cadillac|Кадиллак
Dodge|Додж
Lincoln|Линкольн
Infiniti|Инфинити
Acura|Акура
Genesis|Дженезис
Daewoo|Дэу|деу
Zeekr|Зикр
Li Auto|Лисян|lixiang
Exeed|Эксид
Omoda|Омода
Tank|Танк
Changan|Чанган
Great Wall|Грейт Волл
Zil|ЗИЛ
Aurus|Аурус
Tatra|Татра
Lotus|Лотус
Smart|Смарт
Saab|Сааб
Chrysler|Крайслер
Buick|Бьюик
GMC|GMC
Rivian|Ривиан
Lucid|Люсид
Pagani|Пагани
Koenigsegg|Кёнигсегг
Polestar|Полестар
Cupra|Купра
Zaporozhets|Запорожец|заз/zaz
Kamaz|КамАЗ
Hongqi|Хончи""",
    "Harley-Davidson/Харлей/Yamaha/Ямаха/Ducati/Дукати/Boeing/Боинг/Airbus/Аэробус/Michelin/Мишлен/Shell/Шелл/Apple/Эпл/Samsung/Самсунг/Nike/Найк/Lightning McQueen/Молния Маккуин/Batmobile/Бэтмобиль")

cat("car_parts", "KNOWLEDGE", "transport", "Name a part of a car", "Назовите деталь автомобиля",
    "A part or component of a car (engine, wheel, tyre, steering wheel, brakes, battery, headlights, windshield, bumper, hood, trunk, door, seat, gearbox, exhaust pipe, mirror, radiator, spark plug, clutch, wipers, airbag, horn, fuel tank, axle, muffler).",
    "Деталь или узел автомобиля: двигатель, колесо, шина, руль, тормоза, аккумулятор, фары, лобовое стекло, бампер, капот, багажник, дверь, сиденье, коробка передач, выхлопная труба, зеркало, радиатор, свеча зажигания, сцепление, дворники, подушка безопасности, клаксон, бензобак, мост, глушитель.",
    """Engine|Двигатель|мотор/движок
Wheel|Колесо
Tyre|Шина|tire/покрышка/резина
Steering wheel|Руль
Brakes|Тормоза|тормоз
Battery|Аккумулятор
Headlights|Фары|фара
Windshield|Лобовое стекло|стекло
Bumper|Бампер
Hood|Капот|bonnet
Trunk|Багажник|boot
Door|Дверь
Seat|Сиденье|кресло
Gearbox|Коробка передач|коробка/кпп/трансмиссия/transmission
Exhaust pipe|Выхлопная труба|выхлоп
Mirror|Зеркало|зеркало заднего вида
Radiator|Радиатор
Spark plug|Свеча зажигания|свеча
Clutch|Сцепление
Wipers|Дворники|стеклоочистители
Airbag|Подушка безопасности
Horn|Клаксон|гудок/сигнал
Fuel tank|Бензобак|бак
Axle|Мост|ось
Muffler|Глушитель
Pedal|Педаль|газ/тормоз педаль
Seat belt|Ремень безопасности
Dashboard|Приборная панель|торпеда
Speedometer|Спидометр
Gear stick|Рычаг КПП|ручка коробки
Handbrake|Ручник|стояночный тормоз
Shock absorber|Амортизатор
Suspension|Подвеска
Carburetor|Карбюратор
Alternator|Генератор
Starter|Стартер
Fan belt|Ремень ГРМ|грм
Piston|Поршень
Cylinder|Цилиндр
Crankshaft|Коленвал
Camshaft|Распредвал
Spoiler|Спойлер
Fender|Крыло
Roof|Крыша
Sunroof|Люк
Hubcap|Колпак
Rim|Диск
Turn signal|Поворотник
License plate|Номерной знак|номер
Grille|Решётка радиатора
Fuel pump|Бензонасос
Catalytic converter|Катализатор
Air filter|Воздушный фильтр|фильтр
Oil filter|Масляный фильтр
Brake pads|Тормозные колодки|колодки
Thermostat|Термостат
Ignition|Замок зажигания|зажигание
Glove box|Бардачок
Cup holder|Подстаканник
Radio|Магнитола
Odometer|Одометр
Spare wheel|Запаска
Jack|Домкрат
Differential|Дифференциал
Drive shaft|Кардан|карданный вал
Turbo|Турбина|турбо
Injector|Форсунка
Window|Окно
Lights|Стоп сигнал|стопы""",
    "Sail/Парус/Propeller/Пропеллер/Wing/Крыло самолёта/Pedals bike/Звонок велосипеда/Rails/Рельсы/Anchor/Якорь/Saddle/Седло/Petrol/Бензин/Road/Дорога/Driver/Водитель/Garage/Гараж/Traffic light/Светофор")

cat("two_wheeled_vehicles", "KNOWLEDGE", "transport", "Name a vehicle with two wheels", "Назовите транспортное средство с двумя колёсами",
    "A vehicle that runs on two wheels (bicycle, motorcycle, scooter, moped, kick scooter, electric scooter, segway, hoverboard, balance bike, dirt bike, chopper, sport bike, BMX, tandem, rickshaw pulled is two-wheeled, chariot, cart with two wheels).",
    "Транспорт на двух колёсах: велосипед, мотоцикл, мотороллер, мопед, самокат, электросамокат, сегвей, гироскутер, беговел, питбайк, чоппер, спортбайк, BMX, тандем, рикша, колесница, двуколка.",
    """Bicycle|Велосипед|bike/велик
Motorcycle|Мотоцикл|мотик/байк
Motor scooter|Мотороллер|скутер/vespa/веспа
Moped|Мопед
Kick scooter|Самокат
Electric scooter|Электросамокат
Segway|Сегвей
Hoverboard|Гироскутер
Balance bike|Беговел
Dirt bike|Питбайк|кроссовый мотоцикл/эндуро
Chopper|Чоппер
Sport bike|Спортбайк
BMX|BMX|бмх
Tandem|Тандем
Rickshaw|Рикша
Chariot|Колесница
Two-wheeled cart|Двуколка|арба
Electric bike|Электровелосипед
Mountain bike|Горный велосипед
Road bike|Шоссейный велосипед
Fat bike|Фэтбайк
Penny-farthing|Пенни фартинг
Draisine|Дрезина Драйса|самокат драйса
Folding bike|Складной велосипед
Cruiser|Круизер
Trial bike|Триал
Minibike|Минибайк
Cyclocross bike|Циклокросс
Recumbent bike|Лежачий велосипед
Fixie|Фикс
Ural|Урал без коляски
Gyroboard|Гироборд
Trotinette|Самокат детский двухколёсный
Wheelie bin|Тачка двухколёсная""".replace("\nUral|Урал без коляски", "").replace("\nTrotinette|Самокат детский двухколёсный", "").replace("\nWheelie bin|Тачка двухколёсная", ""),
    "Car/Машина/Tricycle/Трёхколёсный велосипед/Unicycle/Моноцикл/Monowheel/Моноколесо/Bus/Автобус/Truck/Грузовик/Quad bike/Квадроцикл/Train/Поезд/Skateboard/Скейтборд/Roller skates/Ролики/Tank/Танк/Airplane/Самолёт")

cat("european_car_brands", "KNOWLEDGE", "transport", "Name a European car brand", "Назовите европейскую марку автомобиля",
    "A car brand that originates from a European country (Germany: BMW, Mercedes-Benz, Audi, Volkswagen, Porsche, Opel; Italy: Ferrari, Lamborghini, Fiat, Maserati, Alfa Romeo; France: Renault, Peugeot, Citroen, Bugatti; UK: Rolls-Royce, Bentley, Aston Martin, Jaguar, Land Rover, McLaren, Mini; Sweden: Volvo, Saab, Koenigsegg; Czechia: Skoda; Spain: Seat; Romania: Dacia; Russia: Lada, GAZ, UAZ, Moskvich).",
    "Марка автомобиля из европейской страны: Германия (BMW, Mercedes, Audi, Volkswagen, Porsche, Opel), Италия (Ferrari, Lamborghini, Fiat, Maserati, Alfa Romeo), Франция (Renault, Peugeot, Citroen, Bugatti), Великобритания (Rolls Royce, Bentley, Aston Martin, Jaguar, Land Rover, McLaren, Mini), Швеция (Volvo, Saab), Чехия (Skoda), Испания (Seat), Румыния (Dacia), Россия (Лада, ГАЗ, УАЗ, Москвич).",
    """BMW|БМВ|бэха
Mercedes-Benz|Мерседес|mercedes/мерс
Audi|Ауди
Volkswagen|Фольксваген|vw
Porsche|Порше
Opel|Опель
Ferrari|Феррари
Lamborghini|Ламборгини
Fiat|Фиат
Maserati|Мазерати
Alfa Romeo|Альфа Ромео
Renault|Рено
Peugeot|Пежо
Citroen|Ситроен
Bugatti|Бугатти
Rolls-Royce|Роллс Ройс
Bentley|Бентли
Aston Martin|Астон Мартин
Jaguar|Ягуар
Land Rover|Ленд Ровер|range rover
McLaren|Макларен
Mini|Мини
Volvo|Вольво
Saab|Сааб
Koenigsegg|Кёнигсегг
Skoda|Шкода
Seat|Сеат
Dacia|Дачия
Lada|Лада|ваз/жигули
GAZ|ГАЗ|волга
UAZ|УАЗ
Moskvich|Москвич
Aurus|Аурус
ZIL|ЗИЛ
Pagani|Пагани
Lotus|Лотус
Smart|Смарт
Cupra|Купра
Polestar|Полестар
Alpine|Альпин
DS|DS
Lancia|Лянча
Maybach|Майбах
Tatra|Татра
Zastava|Застава
Zaporozhets|Запорожец|заз
Abarth|Абарт
Rimac|Римац
Morgan|Морган
Vauxhall|Воксхолл
MG|MG
Trabant|Трабант
Wartburg|Вартбург
Iveco|Ивеко
Kamaz|КамАЗ
Spyker|Спайкер
Donkervoort|Донкервурт""",
    "Toyota/Тойота/Honda/Хонда/Nissan/Ниссан/Tesla/Тесла/Ford/Форд/Chevrolet/Шевроле/Kia/Киа/Hyundai/Хендай/Mazda/Мазда/Lexus/Лексус/Geely/Джили/Chery/Чери/BYD/Бид/Subaru/Субару/Cadillac/Кадиллак/Jeep/Джип/Haval/Хавал")

cat("pedal_vehicles", "KNOWLEDGE", "transport", "Name a vehicle that has pedals", "Назовите транспортное средство с педалями",
    "A vehicle operated with pedals, by foot power or as car controls (bicycle, car, tricycle, pedal boat / catamaran, unicycle, pedal car, tandem, quadricycle, rickshaw cycle, bus, truck, tractor, motorcycle has a brake pedal, electric bike, pedalo, airplane has rudder pedals).",
    "Транспорт с педалями (мускульными или для управления): велосипед, автомобиль, трёхколёсный велосипед, водный велосипед (катамаран), моноцикл, детская педальная машинка, тандем, велорикша, автобус, грузовик, трактор, электровелосипед, самолёт (педали руля).",
    """Bicycle|Велосипед|bike/велик
Car|Автомобиль|машина
Tricycle|Трёхколёсный велосипед
Pedal boat|Водный велосипед|катамаран/pedalo
Unicycle|Моноцикл
Pedal car|Педальная машинка|детская машинка
Tandem|Тандем
Quadricycle|Веломобиль
Cycle rickshaw|Велорикша
Bus|Автобус
Truck|Грузовик
Tractor|Трактор
Electric bike|Электровелосипед
Airplane|Самолёт
Helicopter|Вертолёт
Motorcycle|Мотоцикл
Tram|Трамвай
Train|Поезд|локомотив
Go-kart|Карт|картинг
Excavator|Экскаватор
Forklift|Погрузчик
Taxi|Такси
Recumbent bike|Лежачий велосипед
Exercise bike|Велотренажёр
BMX|BMX
Penny-farthing|Пенни фартинг
Cargo bike|Грузовой велосипед
Fat bike|Фэтбайк
Handcar|Дрезина
Combine harvester|Комбайн
Ambulance|Скорая
Pedal plane|Мускулолёт
Trolleybus|Троллейбус""",
    "Kick scooter/Самокат/Skateboard/Скейтборд/Sled/Санки/Skis/Лыжи/Hoverboard/Гироскутер/Segway/Сегвей/Horse/Лошадь/Rowing boat/Вёсельная лодка/Sailboat/Парусник/Glider/Планер/Balance bike/Беговел/Roller skates/Ролики")
