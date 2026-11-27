# THINK OR DIE category content, part K (list 3, sections 1-10).
from cats_a import cat

def ru_rule(id, group, en, ru, crit, lines, inv, rule, type="KNOWLEDGE"):
    """A Russian-only letter category (main audience is Russian)."""
    cat(id, type, group, en, ru, "", crit, lines, inv, langs=["ru"], rule=dict(rule, lang="ru"), allowUnknown=True)

def ru_word(id, en, ru, rule):
    cat(id, "WORD_RULE", "vocabulary", en, ru, "", "", "", "", langs=["ru"], rule=dict(rule, lang="ru"))

# ---------- 1. Animal abilities ----------
cat("jumping_animals", "KNOWLEDGE", "animals", "Name an animal that can jump", "Назовите животное, которое умеет прыгать",
    "An animal known for jumping or hopping (kangaroo, frog, rabbit, hare, grasshopper, flea, cat, squirrel, deer, goat, horse, dolphin leaps, jerboa, wallaby, monkey, cricket, lemur, impala, salmon).",
    "Животное, которое хорошо прыгает: кенгуру, лягушка, кролик, заяц, кузнечик, блоха, кошка, белка, олень, коза, лошадь, дельфин, тушканчик, валлаби, обезьяна, сверчок, лемур, импала, лосось.",
    """Kangaroo|Кенгуру
Frog|Лягушка
Rabbit|Кролик
Hare|Заяц
Grasshopper|Кузнечик
Flea|Блоха
Cat|Кошка|кот
Squirrel|Белка
Deer|Олень
Goat|Коза|горный козёл
Horse|Лошадь|конь
Dolphin|Дельфин
Jerboa|Тушканчик
Wallaby|Валлаби
Monkey|Обезьяна
Cricket|Сверчок
Lemur|Лемур|сифака
Impala|Импала
Salmon|Лосось
Toad|Жаба
Tiger|Тигр
Leopard|Леопард
Lynx|Рысь
Puma|Пума
Snow leopard|Ирбис
Gazelle|Газель
Springbok|Спрингбок
Locust|Саранча
Jumping spider|Паук скакун
Dog|Собака
Mouse|Мышь
Gerbil|Песчанка
Chamois|Серна
Ibex|Горный козёл ибекс
Orca|Косатка
Flying fish|Летучая рыба
Mudskipper|Илистый прыгун
Tree frog|Квакша
Galago|Галаго
Klipspringer|Клипшпрингер""",
    "Snail/Улитка/Sloth/Ленивец/Turtle/Черепаха/Worm/Червяк/Snake/Змея/Jellyfish/Медуза/Starfish/Морская звезда/Elephant/Слон/Hippo/Бегемот/Fish/Рыба")

cat("trunk_or_long_tongue", "KNOWLEDGE", "animals", "Name an animal with a trunk or a long tongue", "Назовите животное с хоботом или длинным языком",
    "An animal with a trunk or proboscis, or a notably long tongue (elephant, tapir, anteater, chameleon, giraffe, okapi, frog, toad, snake forked tongue, gecko, woodpecker, hummingbird, butterfly proboscis, moth, proboscis monkey, elephant shrew, sun bear, pangolin, echidna, mosquito).",
    "Животное с хоботом, хоботком или длинным языком: слон, тапир, муравьед, хамелеон, жираф, окапи, лягушка, жаба, змея, геккон, дятел, колибри, бабочка, моль, носач, прыгунчик, малайский медведь, панголин, ехидна, комар.",
    """Elephant|Слон
Tapir|Тапир
Anteater|Муравьед
Chameleon|Хамелеон
Giraffe|Жираф
Okapi|Окапи
Frog|Лягушка
Toad|Жаба
Snake|Змея
Gecko|Геккон
Woodpecker|Дятел
Hummingbird|Колибри
Butterfly|Бабочка
Moth|Моль|мотылёк
Proboscis monkey|Носач
Elephant shrew|Прыгунчик|слоновый прыгунчик
Sun bear|Малайский медведь|бируанг
Pangolin|Панголин
Echidna|Ехидна
Mosquito|Комар
Mammoth|Мамонт
Elephant seal|Морской слон
Aardvark|Трубкозуб
Numbat|Намбат
Honey possum|Медовый поссум
Komodo dragon|Комодский варан|варан
Bee|Пчела
Fly|Муха
Saiga|Сайгак
Tube-lipped bat|Трубкогубый листонос
Cow|Корова
Dog|Собака
Cat|Кошка
Okapi calf|Окапи детёныш""".replace("\nOkapi calf|Окапи детёныш", ""),
    "Lion/Лев/Shark/Акула/Horse/Лошадь/Rabbit/Кролик/Chicken/Курица/Fish/Рыба/Tiger/Тигр/Turtle/Черепаха/Wolf/Волк/Pig/Свинья")

cat("climbing_animals", "KNOWLEDGE", "animals", "Name an animal that can climb trees", "Назовите животное, которое умеет лазать по деревьям",
    "An animal able to climb trees (monkey, squirrel, cat, koala, sloth, leopard, bear, raccoon, lemur, orangutan, gecko, tree frog, woodpecker, marten, possum, chameleon, iguana, snake like python, jaguar, red panda, chipmunk, lynx, porcupine, sable).",
    "Животное, которое умеет лазать по деревьям: обезьяна, белка, кошка, коала, ленивец, леопард, медведь, енот, лемур, орангутан, геккон, квакша, дятел, куница, опоссум, хамелеон, игуана, питон, ягуар, малая панда, бурундук, рысь, дикобраз, соболь.",
    """Monkey|Обезьяна|мартышка
Squirrel|Белка
Cat|Кошка|кот
Koala|Коала
Sloth|Ленивец
Leopard|Леопард
Bear|Медведь
Raccoon|Енот
Lemur|Лемур
Orangutan|Орангутан
Gecko|Геккон
Tree frog|Квакша|древесная лягушка
Woodpecker|Дятел
Marten|Куница
Opossum|Опоссум|possum
Chameleon|Хамелеон
Iguana|Игуана
Python|Питон
Jaguar|Ягуар
Red panda|Малая панда|красная панда
Chipmunk|Бурундук
Lynx|Рысь
Porcupine|Дикобраз
Sable|Соболь
Chimpanzee|Шимпанзе
Gibbon|Гиббон
Gorilla|Горилла
Tree kangaroo|Древесный кенгуру
Ant|Муравей
Snail|Улитка
Caterpillar|Гусеница
Spider|Паук
Lizard|Ящерица
Nuthatch|Поползень
Treecreeper|Пищуха
Flying squirrel|Летяга
Dormouse|Соня
Kinkajou|Кинкажу
Clouded leopard|Дымчатый леопард
Goat|Коза аргановая|древолазная коза
Panda|Панда
Puma|Пума
Mouse|Мышь
Rat|Крыса
Binturong|Бинтуронг""".replace("Goat|Коза аргановая|древолазная коза", "Goat|Коза|древолазная коза"),
    "Elephant/Слон/Hippo/Бегемот/Horse/Лошадь/Cow/Корова/Fish/Рыба/Penguin/Пингвин/Whale/Кит/Crocodile/Крокодил/Rhino/Носорог/Giraffe/Жираф/Ostrich/Страус/Turtle/Черепаха")

cat("clawed_animals", "KNOWLEDGE", "animals", "Name an animal with pincers (claws)", "Назовите животное с клешнями",
    "An animal with pincers / chelae (crab, lobster, crayfish, scorpion, shrimp some, hermit crab, king crab, pseudoscorpion, coconut crab, mantis shrimp has smashers, fiddler crab, langoustine, horseshoe crab).",
    "Животное с клешнями: краб, омар, лобстер, рак, скорпион, креветка, рак отшельник, камчатский краб, ложноскорпион, пальмовый вор, краб скрипач, лангустин, мечехвост.",
    """Crab|Краб
Lobster|Омар|лобстер
Crayfish|Рак|речной рак/crawfish
Scorpion|Скорпион
Shrimp|Креветка
Hermit crab|Рак отшельник
King crab|Камчатский краб
Pseudoscorpion|Ложноскорпион
Coconut crab|Пальмовый вор
Fiddler crab|Краб скрипач
Langoustine|Лангустин|норвежский омар
Horseshoe crab|Мечехвост
Snow crab|Краб стригун|стригун
Blue crab|Голубой краб
Spider crab|Японский краб паук|краб паук
Mantis shrimp|Рак богомол
Earwig|Уховёртка
Whip scorpion|Телифон
Mud crab|Мангровый краб
Prawn|Королевская креветка|креветки
Pistol shrimp|Креветка щелкун
Red king crab|Красный краб
Freshwater crab|Пресноводный краб
Ghost crab|Краб призрак
Crab-eating|Каменный краб""".replace("\nCrab-eating|Каменный краб", "\nStone crab|Каменный краб"),
    "Octopus/Осьминог/Squid/Кальмар/Spider/Паук/Starfish/Морская звезда/Jellyfish/Медуза/Eagle/Орёл/Cat/Кошка/Bear/Медведь/Fish/Рыба/Snail/Улитка/Turtle/Черепаха/Shark/Акула")

cat("fish_eating_animals", "KNOWLEDGE", "animals", "Name an animal that eats fish", "Назовите животное, которое питается рыбой",
    "An animal that feeds on fish (bear, seal, penguin, pelican, heron, otter, dolphin, orca, shark, eagle / osprey, kingfisher, cormorant, gull, crocodile, polar bear, sea lion, pike, catfish, cat, puffin, stork, mink, walrus no).",
    "Животное, которое ест рыбу: медведь, тюлень, пингвин, пеликан, цапля, выдра, дельфин, косатка, акула, скопа, орлан, зимородок, баклан, чайка, крокодил, белый медведь, морской лев, щука, сом, кошка, тупик, аист, норка.",
    """Bear|Медведь|бурый медведь
Seal|Тюлень|нерпа
Penguin|Пингвин
Pelican|Пеликан
Heron|Цапля
Otter|Выдра
Dolphin|Дельфин
Orca|Косатка
Shark|Акула
Osprey|Скопа
Sea eagle|Орлан|белоголовый орлан/bald eagle
Kingfisher|Зимородок
Cormorant|Баклан
Gull|Чайка
Crocodile|Крокодил
Polar bear|Белый медведь
Sea lion|Морской лев
Pike|Щука
Catfish|Сом
Cat|Кошка|кот
Puffin|Тупик
Stork|Аист
Mink|Норка
Alligator|Аллигатор
Gharial|Гавиал
Fishing cat|Кошка рыболов
Raccoon|Енот
Fish owl|Рыбный филин
Tuna|Тунец
Barracuda|Барракуда
Perch|Окунь
Zander|Судак
Sea otter|Калан
Fur seal|Морской котик
Beluga|Белуха
Sperm whale|Кашалот
Gannet|Олуша
Albatross|Альбатрос
Loon|Гагара
Grebe|Поганка
Swordfish|Рыба меч
Anaconda|Анаконда
Fisher marten|Илька
Human|Человек
Sea snake|Морская змея""",
    "Cow/Корова/Horse/Лошадь/Rabbit/Кролик/Giraffe/Жираф/Elephant/Слон/Sheep/Овца/Goat/Коза/Panda/Панда/Koala/Коала/Butterfly/Бабочка/Hamster/Хомяк/Parrot/Попугай")

# ---------- 2. Sport ----------
cat("racket_sports", "KNOWLEDGE", "sports", "Name a sport played with rackets", "Назовите вид спорта с ракетками",
    "A sport played with rackets, bats or paddles (tennis, table tennis, badminton, squash, padel, racquetball, beach tennis, pickleball, speedminton, real tennis, frontenis, platform tennis).",
    "Вид спорта, где используют ракетки: теннис, настольный теннис, бадминтон, сквош, падел, ракетбол, пляжный теннис, пиклбол, спидминтон, бадбол.",
    """Tennis|Теннис|большой теннис
Table tennis|Настольный теннис|пинг понг/ping pong
Badminton|Бадминтон
Squash|Сквош
Padel|Падел
Racquetball|Ракетбол
Beach tennis|Пляжный теннис
Pickleball|Пиклбол
Speedminton|Спидминтон|кроссминтон
Real tennis|Жё де пом|real tennis
Frontenis|Фронтенис
Platform tennis|Платформенный теннис
Paddle tennis|Паддл теннис
Soft tennis|Софт теннис
Lacrosse|Лакросс
Jai alai|Хай алай|баскская пелота
Beach paddleball|Матковос|matkot
Rackets|Рэкетс
Tamburello|Тамбурелло
Basque pelota pala|Пелота пала|пелота
Touchtennis|Тачтеннис""",
    "Football/Футбол/Basketball/Баскетбол/Volleyball/Волейбол/Golf/Гольф/Hockey/Хоккей/Baseball/Бейсбол/Cricket/Крикет/Boxing/Бокс/Swimming/Плавание/Chess/Шахматы")

cat("winter_sports", "KNOWLEDGE", "sports", "Name a winter sport", "Назовите зимний вид спорта",
    "A sport practised on snow or ice (skiing, snowboarding, ice hockey, figure skating, speed skating, biathlon, bobsleigh, luge, skeleton, curling, ski jumping, freestyle skiing, cross-country skiing, Nordic combined, short track, bandy, ice climbing, snowmobile racing).",
    "Вид спорта на снегу или льду: горные лыжи, сноуборд, хоккей, фигурное катание, конькобежный спорт, биатлон, бобслей, санный спорт, скелетон, кёрлинг, прыжки с трамплина, фристайл, лыжные гонки, лыжное двоеборье, шорт трек, хоккей с мячом.",
    """Alpine skiing|Горные лыжи|skiing/лыжи
Snowboarding|Сноуборд|сноубординг
Ice hockey|Хоккей|хоккей с шайбой/hockey
Figure skating|Фигурное катание|фигурка
Speed skating|Конькобежный спорт|коньки
Biathlon|Биатлон
Bobsleigh|Бобслей
Luge|Санный спорт|сани
Skeleton|Скелетон
Curling|Кёрлинг|керлинг
Ski jumping|Прыжки с трамплина
Freestyle skiing|Фристайл
Cross-country skiing|Лыжные гонки|беговые лыжи
Nordic combined|Лыжное двоеборье|двоеборье
Short track|Шорт трек
Bandy|Хоккей с мячом
Ice climbing|Ледолазание
Snowmobile racing|Гонки на снегоходах
Ski mountaineering|Ски альпинизм|скимо
Sled dog racing|Гонки на собачьих упряжках
Ice dancing|Танцы на льду
Synchronized skating|Синхронное катание
Ski cross|Ски кросс
Big air|Биг эйр
Slopestyle|Слоупстайл
Halfpipe|Хафпайп
Moguls|Могул
Ski orienteering|Лыжное ориентирование
Ice speedway|Мотогонки на льду
Ice fishing|Подлёдная рыбалка|зимняя рыбалка
Winter swimming|Зимнее плавание|моржевание
Kite skiing|Сноукайтинг
Ice racing|Гонки на льду
Skijoring|Скиджоринг""",
    "Football/Футбол/Tennis/Теннис/Swimming/Плавание/Surfing/Сёрфинг/Beach volleyball/Пляжный волейбол/Cycling/Велоспорт/Golf/Гольф/Basketball/Баскетбол/Boxing/Бокс/Athletics/Лёгкая атлетика/Rowing/Гребля")

cat("speed_sports", "KNOWLEDGE", "sports", "Name a sport where competitors race for speed", "Назовите вид спорта, где соревнуются на скорость",
    "A sport whose result is decided by speed or time (sprint, marathon, swimming, cycling, speed skating, Formula 1, motorcycle racing, rowing, canoeing, cross-country skiing, bobsleigh, horse racing, karting, triathlon, short track, luge, sailing races, rally, speed climbing).",
    "Вид спорта, где решает скорость или время: бег (спринт, марафон), плавание, велоспорт, конькобежный спорт, Формула 1, мотогонки, гребля, лыжные гонки, бобслей, скачки, картинг, триатлон, шорт трек, санный спорт, ралли, скалолазание на скорость.",
    """Sprint|Спринт|бег/running
Marathon|Марафон
Swimming|Плавание
Cycling|Велоспорт|велогонки
Speed skating|Конькобежный спорт
Formula 1|Формула 1|f1/формула один/автогонки/car racing
Motorcycle racing|Мотогонки|motogp/мотоспорт
Rowing|Гребля|академическая гребля
Canoeing|Гребля на байдарках и каноэ
Cross-country skiing|Лыжные гонки
Bobsleigh|Бобслей
Horse racing|Скачки
Karting|Картинг
Triathlon|Триатлон
Short track|Шорт трек
Luge|Санный спорт
Rally|Ралли
Speed climbing|Скалолазание на скорость
Alpine skiing|Горные лыжи|слалом/скоростной спуск
Skeleton|Скелетон
Hurdles|Бег с барьерами
Relay|Эстафета
Steeplechase|Бег с препятствиями
Race walking|Спортивная ходьба
Sailing|Парусные гонки|регата
Biathlon|Биатлон
Motocross|Мотокросс
Drag racing|Драг рейсинг
NASCAR|NASCAR|наскар
Greyhound racing|Собачьи бега
Duathlon|Дуатлон
Orienteering|Спортивное ориентирование
Speedway|Спидвей
Ski cross|Ски кросс
Powerboat racing|Водно моторный спорт
Dragon boat|Гонки на лодках дракон
Air racing|Авиагонки
Track cycling|Трековые гонки|трек
BMX racing|BMX рейсинг
Mountain biking|Маунтинбайк""",
    "Chess/Шахматы/Figure skating/Фигурное катание/Gymnastics/Гимнастика/Weightlifting/Тяжёлая атлетика/Boxing/Бокс/Golf/Гольф/Archery/Стрельба из лука/Shooting/Стрельба/Diving/Прыжки в воду/Bowling/Боулинг/Darts/Дартс/Curling/Кёрлинг")

cat("sports_equipment", "KNOWLEDGE", "sports", "Name a piece of sports equipment", "Назовите предмет спортивного инвентаря",
    "An item of sports equipment (ball, racket, bat, hockey stick, puck, skis, skates, dumbbell, barbell, kettlebell, jump rope, goal / net, gloves, helmet, shin guards, mat, hoop, javelin, discus, shot, pole, bicycle, skateboard, bow, sword / epee, treadmill, horizontal bar).",
    "Предмет спортивного инвентаря: мяч, ракетка, бита, клюшка, шайба, лыжи, коньки, гантели, штанга, гиря, скакалка, ворота, сетка, перчатки, шлем, щитки, мат, обруч, копьё, диск, ядро, шест, велосипед, скейт, лук, шпага, беговая дорожка, турник.",
    """Ball|Мяч
Racket|Ракетка
Bat|Бита
Hockey stick|Клюшка
Puck|Шайба
Skis|Лыжи
Skates|Коньки
Dumbbell|Гантели|гантеля
Barbell|Штанга
Kettlebell|Гиря
Jump rope|Скакалка
Goal|Ворота
Net|Сетка
Boxing gloves|Боксёрские перчатки|перчатки
Helmet|Шлем
Shin guards|Щитки
Mat|Мат|коврик
Hula hoop|Обруч
Javelin|Копьё
Discus|Диск
Shot put|Ядро
Vaulting pole|Шест
Bicycle|Велосипед
Skateboard|Скейтборд|скейт
Bow|Лук
Epee|Шпага|рапира/сабля
Treadmill|Беговая дорожка
Horizontal bar|Турник|перекладина
Parallel bars|Брусья
Punching bag|Боксёрская груша|груша
Golf club|Клюшка для гольфа
Shuttlecock|Волан|воланчик
Ski poles|Лыжные палки
Snowboard|Сноуборд
Exercise bike|Велотренажёр
Fitball|Фитбол
Expander|Эспандер
Stopwatch|Секундомер
Whistle|Свисток
Basketball hoop|Баскетбольное кольцо|кольцо
Goggles|Очки для плавания
Swim cap|Шапочка для плавания
Mouth guard|Капа
Medicine ball|Медбол
Trampoline|Батут
Rings|Кольца гимнастические
Pommel horse|Конь гимнастический
Balance beam|Бревно
Hurdle|Барьер
Starting block|Стартовая колодка
Paddle|Весло
Kayak|Байдарка
Surfboard|Доска для сёрфинга
Climbing harness|Страховочная система
Carabiner|Карабин
Bench|Скамья для жима
Weight plates|Блины для штанги|блины
Resistance band|Резинка для фитнеса
Ab roller|Ролик для пресса
Stepper|Степпер
Sled|Сани для бобслея
Curling stone|Камень для кёрлинга
Dartboard|Дартс
Ping pong table|Теннисный стол""",
    "Trophy/Кубок/Medal/Медаль/Stadium/Стадион/Referee/Судья/Coach/Тренер/Sneakers/Кроссовки/Water/Вода/Scoreboard/Табло/Ticket/Билет/Fan/Болельщик/Phone/Телефон/Banana/Банан")

cat("olympic_hosts", "GEOGRAPHY", "geography", "Name a country that has hosted the Olympic Games", "Назовите страну, принимавшую Олимпийские игры",
    "A country that has hosted the Summer or Winter Olympic Games: Greece, France, USA, UK, Sweden, Belgium, Netherlands, Germany, Switzerland, Norway, Finland, Australia, Italy, Austria, Japan, Mexico, Canada, Yugoslavia (Bosnia), Soviet Union (Russia), South Korea, Spain, China, Brazil, plus the 2026 Winter Games in Italy.",
    "Страна, где проходили летние или зимние Олимпийские игры: Греция, Франция, США, Великобритания, Швеция, Бельгия, Нидерланды, Германия, Швейцария, Норвегия, Финляндия, Австралия, Италия, Австрия, Япония, Мексика, Канада, Югославия (Сараево), СССР и Россия (Москва 1980, Сочи 2014), Южная Корея, Испания, Китай, Бразилия.",
    """Greece|Греция
France|Франция
United States|США|сша/америка/usa
United Kingdom|Великобритания|англия/britain
Sweden|Швеция
Belgium|Бельгия
Netherlands|Нидерланды|голландия
Germany|Германия
Switzerland|Швейцария
Norway|Норвегия
Finland|Финляндия
Australia|Австралия
Italy|Италия
Austria|Австрия
Japan|Япония
Mexico|Мексика
Canada|Канада
Yugoslavia|Югославия|босния/босния и герцеговина
Russia|Россия|ссср/советский союз/soviet union
South Korea|Южная Корея|корея
Spain|Испания
China|Китай
Brazil|Бразилия""",
    "Brazil2/Бразилия2/India/Индия/Egypt/Египет/Argentina/Аргентина/Poland/Польша/Turkey/Турция/Ukraine/Украина/Kazakhstan/Казахстан/Portugal/Португалия/Denmark/Дания/Ireland/Ирландия/Qatar/Катар/South Africa/ЮАР".replace("Brazil2/Бразилия2/", ""),
    allowUnknown=False, exhaustive=True)

# ---------- 3. Famous movies ----------
cat("one_word_movies", "KNOWLEDGE", "movies_tv", "Name a movie whose title is one word", "Назовите фильм, название которого из одного слова",
    "A real film whose title (in the answer's language) is a single word (Titanic, Avatar, Joker, Inception, Gladiator, Shrek, Frozen, Alien, Jaws, Up, Coco, Interstellar, Matrix, Brother / Брат, Stalker / Сталкер, Legend, Dune, Oppenheimer, Barbie, Psycho, Rocky, Gravity, Parasite, Whiplash).",
    "Настоящий фильм, название которого из одного слова: Титаник, Аватар, Джокер, Гладиатор, Шрек, Чужой, Челюсти, Вверх, Интерстеллар, Матрица, Брат, Сталкер, Легенда (Легенда №17), Дюна, Оппенгеймер, Барби, Психо, Рокки, Гравитация, Паразиты, Одержимость, Бумер, Холоп, Движение вверх (нет, два слова).",
    """Titanic|Титаник
Avatar|Аватар
Joker|Джокер
Inception|Начало
Gladiator|Гладиатор
Shrek|Шрек
Alien|Чужой
Jaws|Челюсти
Up|Вверх
Coco|Коко
Interstellar|Интерстеллар
Matrix|Матрица
Brother|Брат
Stalker|Сталкер
Dune|Дюна
Oppenheimer|Оппенгеймер
Barbie|Барби
Psycho|Психо
Rocky|Рокки
Gravity|Гравитация
Parasite|Паразиты
Whiplash|Одержимость
Boomer|Бумер
Serf|Холоп
Cheburashka|Чебурашка
Ratatouille|Рататуй
Cars|Тачки
Bolt|Вольт
Moana|Моана
Encanto|Энканто
Madagascar|Мадагаскар
Rio|Рио
Hachiko|Хатико
Terminator|Терминатор
Predator|Хищник
Rambo|Рэмбо
Saw|Пила
Scream|Крик
It|Оно
Halloween|Хэллоуин
Tenet|Довод
Arrival|Прибытие
Memento|Помни
Amelie|Амели
Leon|Леон
Taxi|Такси
Fargo|Фарго
Casablanca|Касабланка
Vertigo|Головокружение
Heat|Схватка
Avengers|Мстители
Deadpool|Дэдпул
Venom|Веном
Aquaman|Аквамен
Thor|Тор
Hulk|Халк
Logan|Логан
Batman|Бэтмен
Superman|Супермен
Elysium|Элизиум
Prometheus|Прометей
Elf|Эльф
Gremlins|Гремлины
Beetlejuice|Битлджус
Contact|Контакт
Signs|Знаки
Split|Сплит
Us|Мы
Nope|Нет
Sinister|Синистер
Insidious|Астрал
Legend|Легенда
Vikings|Викинг
Viy|Вий
Duelist|Дуэлянт
Stalingrad|Сталинград
Attraction|Притяжение
Crew|Экипаж
Ice|Лёд
Coach|Тренер
Hardcore|Хардкор
Major|Майор
Fool|Дурак
Leviathan|Левиафан
Loveless|Нелюбовь
Ghost|Призрак
Yolki|Ёлки""",
    "Home Alone/Один дома/The Lion King/Король Лев/Harry Potter/Гарри Поттер/Star Wars/Звёздные войны/Back to the Future/Назад в будущее/Pulp Fiction/Криминальное чтиво/The Godfather/Крёстный отец/Forrest Gump/Форрест Гамп/Fight Club/Бойцовский клуб/Toy Story/История игрушек/Kung Fu Panda/Кунг фу Панда")

cat("animal_hero_movies", "KNOWLEDGE", "movies_tv", "Name a movie whose main character is an animal", "Назовите фильм, где главный герой животное",
    "A real film (live action or animated) whose main character is an animal (Hachiko, Beethoven, Free Willy, Babe, Marley & Me, King Kong, Bambi, Dumbo, The Lion King, Paddington, Stuart Little, Ratatouille, Kung Fu Panda, Madagascar, Bolt, Garfield, Jaws, White Bim Black Ear, A Dog's Purpose, War Horse, Lassie, Okja).",
    "Настоящий фильм или мультфильм, где главный герой животное: Хатико, Бетховен, Освободите Вилли, Бэйб, Марли и я, Кинг Конг, Бэмби, Дамбо, Король Лев, Паддингтон, Стюарт Литтл, Рататуй, Кунг фу Панда, Мадагаскар, Вольт, Гарфилд, Челюсти, Белый Бим Чёрное ухо, Собачья жизнь, Боевой конь, Лесси, Окча.",
    """Hachiko|Хатико|хатико самый верный друг
Beethoven|Бетховен
Free Willy|Освободите Вилли
Babe|Бэйб|бейб четвероногий малыш
Marley & Me|Марли и я
King Kong|Кинг Конг
Bambi|Бэмби
Dumbo|Дамбо
The Lion King|Король Лев
Paddington|Паддингтон
Stuart Little|Стюарт Литтл
Ratatouille|Рататуй
Kung Fu Panda|Кунг фу Панда
Madagascar|Мадагаскар
Bolt|Вольт
Garfield|Гарфилд
Jaws|Челюсти
White Bim Black Ear|Белый Бим Чёрное ухо
A Dog's Purpose|Собачья жизнь
War Horse|Боевой конь
Lassie|Лесси
Okja|Окча
Zootopia|Зверополис
Finding Nemo|В поисках Немо
Dr. Dolittle|Доктор Дулиттл
Air Bud|Король воздуха
Turner & Hooch|Тёрнер и Хуч
Eight Below|Белый плен
Homeward Bound|Дорога домой
Black Beauty|Чёрный красавец
Seabiscuit|Фаворит
The Jungle Book|Книга джунглей
Peter Rabbit|Кролик Питер
Puss in Boots|Кот в сапогах
Godzilla|Годзилла
Anaconda|Анаконда
Chicken Run|Побег из курятника
Fantastic Mr. Fox|Бесподобный мистер Фокс
Cats & Dogs|Кошки против собак
Racing Stripes|Полосатый лидер
Spirit|Спирит Душа прерий
Kitten Named Woof|Котёнок по имени Гав
Belka and Strelka|Белка и Стрелка Звёздные собаки|белка и стрелка
Flipper|Флиппер
Willy the Sparrow|Воробей
Balto|Балто
Kesha|Возвращение блудного попугая
The Wild Robot|Дикий робот
Sonic the Hedgehog|Соник в кино|соник
Pokemon Detective Pikachu|Детектив Пикачу
Mighty Joe Young|Могучий Джо Янг
Cujo|Куджо
Scooby-Doo|Скуби Ду
Alvin and the Chipmunks|Элвин и бурундуки
Hotel for Dogs|Отель для собак
Snow Dogs|Снежные псы""".replace("\nWilly the Sparrow|Воробей", ""),
    "Titanic/Титаник/Home Alone/Один дома/Toy Story/История игрушек/Frozen/Холодное сердце/Shrek/Шрек/Cars/Тачки/WALL-E/ВАЛЛ И/Inside Out/Головоломка/Avatar/Аватар/Tarzan/Тарзан/Mowgli/Маугли2/Up/Вверх".replace("/Mowgli/Маугли2", ""))

cat("movies_with_sequel", "KNOWLEDGE", "movies_tv", "Name a movie that has a sequel", "Назовите фильм, у которого есть продолжение",
    "A real film that has at least one sequel (Shrek, Toy Story, Terminator, Home Alone, Brother / Брат, The Matrix, Back to the Future, Avatar, Ice Age, Madagascar, Kung Fu Panda, Frozen, Die Hard, Rocky, Jurassic Park, Harry Potter, Pirates of the Caribbean, Fast & Furious, Saw, Yolki, Crew? no, Irony of Fate, Bumer, Despicable Me, Iron Man, John Wick, Alien, Predator, The Hangover, Spider-Man).",
    "Настоящий фильм, у которого есть продолжение: Шрек, История игрушек, Терминатор, Один дома, Брат, Матрица, Назад в будущее, Аватар, Ледниковый период, Мадагаскар, Кунг фу Панда, Холодное сердце, Крепкий орешек, Рокки, Парк Юрского периода, Гарри Поттер, Пираты Карибского моря, Форсаж, Пила, Ёлки, Ирония судьбы, Бумер, Гадкий я, Железный человек, Джон Уик, Чужой, Хищник, Мальчишник в Вегасе, Человек паук, Холоп, Чебурашка.",
    """Shrek|Шрек
Toy Story|История игрушек
The Terminator|Терминатор
Home Alone|Один дома
Brother|Брат
The Matrix|Матрица
Back to the Future|Назад в будущее
Avatar|Аватар
Ice Age|Ледниковый период
Madagascar|Мадагаскар
Kung Fu Panda|Кунг фу Панда
Frozen|Холодное сердце
Die Hard|Крепкий орешек
Rocky|Рокки
Jurassic Park|Парк Юрского периода
Harry Potter|Гарри Поттер
Pirates of the Caribbean|Пираты Карибского моря
Fast & Furious|Форсаж
Saw|Пила
Yolki|Ёлки
The Irony of Fate|Ирония судьбы
Boomer|Бумер
Despicable Me|Гадкий я
Iron Man|Железный человек
John Wick|Джон Уик
Alien|Чужой
Predator|Хищник
The Hangover|Мальчишник в Вегасе
Spider-Man|Человек паук
Serf|Холоп
Cheburashka|Чебурашка
Star Wars|Звёздные войны
The Lord of the Rings|Властелин колец
The Godfather|Крёстный отец
Mission: Impossible|Миссия невыполнима
Indiana Jones|Индиана Джонс
Men in Black|Люди в чёрном
Inside Out|Головоломка
Finding Nemo|В поисках Немо
Cars|Тачки
Monsters, Inc.|Корпорация монстров
The Incredibles|Суперсемейка
How to Train Your Dragon|Как приручить дракона
Night at the Museum|Ночь в музее
Scream|Крик
Halloween|Хэллоуин
Final Destination|Пункт назначения
The Conjuring|Заклятие
Rambo|Рэмбо
Taxi|Такси
Lethal Weapon|Смертельное оружие
Ghostbusters|Охотники за привидениями
Transformers|Трансформеры
The Avengers|Мстители
Deadpool|Дэдпул
Joker|Джокер
Dune|Дюна
Gladiator|Гладиатор
Top Gun|Топ Ган|лучший стрелок
Beverly Hills Cop|Полицейский из Беверли Хиллз
Paddington|Паддингтон
The Hunger Games|Голодные игры
Twilight|Сумерки
Bad Boys|Плохие парни
Sherlock Holmes|Шерлок Холмс
Kingsman|Kingsman
Hotel Transylvania|Монстры на каникулах
The Smurfs|Смурфики
Moana|Моана
Zootopia|Зверополис
Hotel Belgrade|Отель Белград
Gentlemen of Fortune|Джентльмены удачи
Kitchen in Paris|Кухня
Three Heroes|Три богатыря
Mirage|Мираж""".replace("\nMirage|Мираж", "").replace("Kitchen in Paris|Кухня", "Kitchen in Paris|Кухня в Париже|кухня"),
    "Titanic/Титаник/Forrest Gump/Форрест Гамп/Pulp Fiction/Криминальное чтиво/The Shawshank Redemption/Побег из Шоушенка/Interstellar/Интерстеллар/Inception/Начало/Fight Club/Бойцовский клуб/The Green Mile/Зелёная миля/Parasite/Паразиты/Schindler's List/Список Шиндлера")

cat("book_based_movies", "KNOWLEDGE", "movies_tv", "Name a movie based on a book", "Назовите фильм, снятый по книге",
    "A real film adapted from a novel, story or book (Harry Potter, The Lord of the Rings, The Green Mile, The Shawshank Redemption, Forrest Gump, Jurassic Park, The Godfather, The Hunger Games, Twilight, Dune, Fight Club, It, The Shining, War and Peace, The Master and Margarita, Heart of a Dog, The Twelve Chairs, Doctor Zhivago, Gone with the Wind, Pride and Prejudice, The Martian).",
    "Настоящий фильм по роману, повести или книге: Гарри Поттер, Властелин колец, Зелёная миля, Побег из Шоушенка, Форрест Гамп, Парк Юрского периода, Крёстный отец, Голодные игры, Сумерки, Дюна, Бойцовский клуб, Оно, Сияние, Война и мир, Мастер и Маргарита, Собачье сердце, Двенадцать стульев, Доктор Живаго, Унесённые ветром, Гордость и предубеждение, Марсианин.",
    """Harry Potter|Гарри Поттер
The Lord of the Rings|Властелин колец
The Green Mile|Зелёная миля
The Shawshank Redemption|Побег из Шоушенка
Forrest Gump|Форрест Гамп
Jurassic Park|Парк Юрского периода
The Godfather|Крёстный отец
The Hunger Games|Голодные игры
Twilight|Сумерки
Dune|Дюна
Fight Club|Бойцовский клуб
It|Оно
The Shining|Сияние
War and Peace|Война и мир
The Master and Margarita|Мастер и Маргарита
Heart of a Dog|Собачье сердце
The Twelve Chairs|Двенадцать стульев
Doctor Zhivago|Доктор Живаго
Gone with the Wind|Унесённые ветром
Pride and Prejudice|Гордость и предубеждение
The Martian|Марсианин
The Hobbit|Хоббит
Life of Pi|Жизнь Пи
The Great Gatsby|Великий Гэтсби
Anna Karenina|Анна Каренина
Crime and Punishment|Преступление и наказание
The Dawns Here Are Quiet|А зори здесь тихие
Sherlock Holmes|Шерлок Холмс
The Silence of the Lambs|Молчание ягнят
Gone Girl|Исчезнувшая
The Da Vinci Code|Код да Винчи
Charlie and the Chocolate Factory|Чарли и шоколадная фабрика
The Chronicles of Narnia|Хроники Нарнии
Mary Poppins|Мэри Поппинс
The Jungle Book|Книга джунглей
Alice in Wonderland|Алиса в стране чудес
Pinocchio|Пиноккио
The Little Prince|Маленький принц
Frankenstein|Франкенштейн
Dracula|Дракула
The Count of Monte Cristo|Граф Монте Кристо
The Three Musketeers|Три мушкетёра
Les Misérables|Отверженные
Pet Sematary|Кладбище домашних животных
Misery|Мизери
Carrie|Кэрри
The Mist|Мгла
Interview with the Vampire|Интервью с вампиром
Schindler's List|Список Шиндлера
The Revenant|Выживший
No Country for Old Men|Старикам тут не место
Shutter Island|Остров проклятых
The Devil Wears Prada|Дьявол носит Prada
Bridget Jones|Дневник Бриджит Джонс
The Notebook|Дневник памяти
Ready Player One|Первому игроку приготовиться
Fantastic Beasts|Фантастические твари
Stalker|Сталкер
Solaris|Солярис
Kin-dza-dza!|Метро 2033
Morozko|Морозко
The Golden Calf|Золотой телёнок
The Fate of a Man|Судьба человека
Quiet Flows the Don|Тихий Дон
Viy|Вий
The Snow Queen|Снежная королева
Old Man Hottabych|Старик Хоттабыч
Treasure Island|Остров сокровищ
Robinson Crusoe|Робинзон Крузо
Oliver Twist|Оливер Твист
Matilda|Матильда
Wonka|Вонка
The Bourne Identity|Идентификация Борна
Jaws|Челюсти
Psycho|Психо""".replace("Kin-dza-dza!|Метро 2033", "Metro 2033|Метро 2033"),
    "Avatar/Аватар/Titanic/Титаник/Star Wars/Звёздные войны/Home Alone/Один дома/The Matrix/Матрица/Inception/Начало/Back to the Future/Назад в будущее/Toy Story/История игрушек/Brother/Брат/Gladiator/Гладиатор/Interstellar/Интерстеллар")

cat("pirate_movies", "KNOWLEDGE", "movies_tv", "Name a movie with pirates in it", "Назовите фильм, в котором есть пираты",
    "A real film or animated film where pirates appear (Pirates of the Caribbean, Hook, Peter Pan, Treasure Island, Treasure Planet, The Pirates! Band of Misfits, Captain Phillips, Cutthroat Island, The Goonies, Captain Blood, Pirates of the 20th Century, One Piece, Muppet Treasure Island, Sinbad, The Princess Bride, Stardust, The Pirate Fairy, Asterix).",
    "Настоящий фильм или мультфильм, где есть пираты: Пираты Карибского моря, Капитан Крюк, Питер Пэн, Остров сокровищ, Планета сокровищ, Пираты Банда неудачников, Капитан Филлипс, Остров головорезов, Балбесы, Одиссея капитана Блада, Пираты XX века, Синдбад, Принцесса невеста, Звёздная пыль, Тайна третьей планеты.",
    """Pirates of the Caribbean|Пираты Карибского моря
Hook|Капитан Крюк|крюк
Peter Pan|Питер Пэн
Treasure Island|Остров сокровищ
Treasure Planet|Планета сокровищ
The Pirates! Band of Misfits|Пираты Банда неудачников
Captain Phillips|Капитан Филлипс
Cutthroat Island|Остров головорезов
The Goonies|Балбесы
Captain Blood|Одиссея капитана Блада|капитан блад
Pirates of the 20th Century|Пираты XX века|пираты 20 века
Sinbad|Синдбад Легенда семи морей|синдбад
The Princess Bride|Принцесса невеста
Stardust|Звёздная пыль
The Mystery of the Third Planet|Тайна третьей планеты
One Piece|Ван Пис
The Pirate Fairy|Феи Загадка пиратского острова
Muppet Treasure Island|Остров сокровищ маппетов
The Crimson Pirate|Багровый пират
A High Wind in Jamaica|Ураган над Ямайкой
Swiss Family Robinson|Швейцарская семья Робинзонов
The Black Pearl|Проклятие Чёрной жемчужины
Dead Man's Chest|Сундук мертвеца
Pan|Пэн Путешествие в Нетландию
Swashbuckler|Пират
Island of Lost Souls|Остров потерянных душ
Black Sails|Чёрные паруса
The Sea Hawk|Морской ястреб
Captain Kidd|Капитан Кидд
Asterix and Obelix|Астерикс и Обеликс
Moana|Моана
Muppets|Маппеты
Kung Fu Panda 2|Кунг фу Панда 2
Our Flag Means Death|Наш флаг означает смерть
Chip 'n Dale: Rescue Rangers|Чип и Дейл спешат на помощь
Spongebob|Губка Боб Губка из воды""".replace("\nKung Fu Panda 2|Кунг фу Панда 2", "").replace("\nSpongebob|Губка Боб Губка из воды", "").replace("\nMuppets|Маппеты", ""),
    "Titanic/Титаник/Home Alone/Один дома/Frozen/Холодное сердце/Shrek/Шрек/Harry Potter/Гарри Поттер/Jaws/Челюсти/Avatar/Аватар/Brother/Брат/Star Wars/Звёздные войны/The Lion King/Король Лев/Waterworld/Водный мир2".replace("/Waterworld/Водный мир2", ""))

# ---------- 4. What's inside ----------
cat("pressurized_air_things", "SEMANTIC", "everyday", "Name something with pressurized air inside", "Назовите предмет, внутри которого воздух под давлением",
    "An object that holds compressed air or gas under pressure (tyre, ball, aerosol can, scuba tank, fire extinguisher, airbag, air compressor, balloon, inflatable mattress, soda bottle gas, gas cylinder, air gun, pneumatic tool, oxygen tank, bike pump, whoopee cushion, soccer ball).",
    "Предмет, внутри которого воздух или газ под давлением: шина, мяч, аэрозольный баллончик, акваланг, огнетушитель, подушка безопасности, компрессор, воздушный шарик, надувной матрас, газированная бутылка, газовый баллон, пневматика, кислородный баллон, насос.",
    """Tyre|Шина|tire/колесо/покрышка
Ball|Мяч|football/баскетбольный мяч
Aerosol can|Аэрозольный баллончик|баллончик/spray can/дезодорант
Scuba tank|Акваланг|баллон для дайвинга
Fire extinguisher|Огнетушитель
Airbag|Подушка безопасности
Air compressor|Компрессор
Balloon|Воздушный шарик|шарик
Air mattress|Надувной матрас
Soda bottle|Бутылка газировки|газировка
Gas cylinder|Газовый баллон|баллон
Air gun|Пневматика|пневматический пистолет/воздушка
Pneumatic tool|Пневмоинструмент
Oxygen tank|Кислородный баллон
Bicycle pump|Насос
Whoopee cushion|Подушка пердушка
Inflatable boat|Надувная лодка
Bubble wrap|Пупырчатая плёнка|пупырка
Hot air balloon|Воздушный шар
Champagne bottle|Бутылка шампанского|шампанское
Air horn|Пневматический гудок
Inhaler|Ингалятор
Shock absorber|Амортизатор
Pressure cooker|Скороварка
Paintball gun|Маркер для пейнтбола
Nail gun|Пневматический гвоздезабиватель
Whipped cream can|Баллончик со сливками
Lighter|Зажигалка
Life jacket|Спасательный жилет
Air pillow|Надувная подушка
Sneakers with air|Кроссовки с воздушной подушкой
Submarine|Подводная лодка
Airship|Дирижабль
Steam boiler|Паровой котёл""",
    "Brick/Кирпич/Book/Книга/Spoon/Ложка/Table/Стол/Rock/Камень/Pencil/Карандаш/Plate/Тарелка/Shoe/Ботинок/Towel/Полотенце/Paper/Бумага/Candle/Свеча/Carpet/Ковёр")

cat("ink_things", "SEMANTIC", "everyday", "Name something that contains ink", "Назовите предмет, содержащий чернила",
    "An object that contains ink (pen, ballpoint, fountain pen, marker, felt-tip pen, printer cartridge, printer, stamp pad, inkwell, highlighter, octopus / squid / cuttlefish ink sac, tattoo machine, gel pen, quill, calligraphy brush pen, newspaper printing press, inkjet).",
    "Предмет, в котором есть чернила: ручка, шариковая ручка, перьевая ручка, маркер, фломастер, картридж принтера, принтер, штемпельная подушка, чернильница, текстовыделитель, кальмар, осьминог, каракатица, тату машинка, гелевая ручка, гусиное перо, брашпен.",
    """Pen|Ручка
Ballpoint pen|Шариковая ручка
Fountain pen|Перьевая ручка
Marker|Маркер
Felt-tip pen|Фломастер|фломастеры
Printer cartridge|Картридж|картридж принтера
Printer|Принтер
Stamp pad|Штемпельная подушка
Inkwell|Чернильница
Highlighter|Текстовыделитель|выделитель
Squid|Кальмар
Octopus|Осьминог
Cuttlefish|Каракатица
Tattoo machine|Тату машинка
Gel pen|Гелевая ручка
Quill|Гусиное перо
Brush pen|Брашпен
Printing press|Печатный станок|типография
Pen refill|Стержень
Stamp|Печать|штамп
Whiteboard marker|Маркер для доски
Calligraphy pen|Ручка для каллиграфии
Inkjet|Струйный принтер
Rollerball|Роллер
Liner|Линер
Permanent marker|Перманентный маркер
Ink bottle|Флакон чернил
Copier|Ксерокс|копир
Plotter|Плоттер
Squid ink pasta|Чёрная паста|паста с чернилами каракатицы""",
    "Pencil/Карандаш/Chalk/Мел/Eraser/Ластик/Crayon/Мелки/Paper/Бумага/Ruler/Линейка/Scissors/Ножницы/Glue/Клей/Book/Книга/Laptop/Ноутбук/Brush/Кисть")

cat("gear_things", "SEMANTIC", "everyday", "Name something with gears inside", "Назовите предмет, внутри которого есть шестерёнки",
    "An object with gears / cogwheels inside (mechanical clock, watch, bicycle, car gearbox, drill, mixer, music box, wind-up toy, can opener, egg beater, fishing reel, printer, washing machine, windmill, elevator, robot, camera lens, meat grinder, crank pencil sharpener, excavator).",
    "Предмет, внутри которого есть шестерёнки: механические часы, наручные часы, велосипед, коробка передач, дрель, миксер, музыкальная шкатулка, заводная игрушка, консервный нож, ручной венчик, рыболовная катушка, принтер, стиральная машина, мельница, лифт, робот, объектив, мясорубка, точилка с ручкой.",
    """Mechanical clock|Механические часы|часы/clock
Wristwatch|Наручные часы|watch
Bicycle|Велосипед
Gearbox|Коробка передач|коробка/кпп
Drill|Дрель
Mixer|Миксер
Music box|Музыкальная шкатулка
Wind-up toy|Заводная игрушка
Can opener|Консервный нож|открывашка
Egg beater|Ручной венчик|ручной миксер
Fishing reel|Рыболовная катушка|катушка
Printer|Принтер
Washing machine|Стиральная машина
Windmill|Мельница|ветряная мельница
Elevator|Лифт
Robot|Робот
Camera lens|Объектив
Meat grinder|Мясорубка
Pencil sharpener|Точилка с ручкой|механическая точилка
Excavator|Экскаватор
Car|Автомобиль|машина
Screwdriver|Шуруповёрт
Food processor|Кухонный комбайн
Hand crank|Ручная лебёдка|лебёдка
Winch|Лебёдка
Tractor|Трактор
Odometer|Одометр
Cuckoo clock|Часы с кукушкой
Metronome|Метроном
Coffee grinder|Кофемолка
Pepper mill|Мельница для перца
Hand mixer|Венчик механический
Tower clock|Куранты|башенные часы
Orrery|Планетарий механический
Lathe|Токарный станок
Typewriter|Пишущая машинка
Mechanical calculator|Арифмометр
Cassette player|Магнитофон|кассетный плеер
DVD drive|Дисковод
Gramophone|Граммофон
Helicopter|Вертолёт
Wind turbine|Ветрогенератор
Electric toothbrush|Электрическая зубная щётка
Clockwork mouse|Заводная мышь""",
    "Spoon/Ложка/Book/Книга/Pillow/Подушка/Brick/Кирпич/Towel/Полотенце/Plate/Тарелка/Pencil/Карандаш/Cup/Чашка/Chair/Стул/Mirror/Зеркало/Candle/Свеча/Shoe/Ботинок")

cat("foam_things", "SEMANTIC", "everyday", "Name something that contains foam rubber", "Назовите предмет, содержащий поролон",
    "An object that contains foam rubber / polyurethane foam (sofa, armchair, mattress, pillow, kitchen sponge, car seat, office chair, headphone pads, packaging, bra padding, shoe insole, yoga mat, gym mat, soft toy, cushions, helmet lining, stool padding, bicycle saddle, swim float, microphone windscreen).",
    "Предмет, в котором есть поролон: диван, кресло, матрас, подушка, губка для посуды, автомобильное сиденье, офисное кресло, амбушюры наушников, упаковка, чашки бюстгальтера, стельки, коврик для йоги, спортивный мат, мягкая игрушка, сиденье табурета, велосипедное седло, ветрозащита микрофона.",
    """Sofa|Диван
Armchair|Кресло
Mattress|Матрас
Pillow|Подушка
Kitchen sponge|Губка для посуды|губка/sponge
Car seat|Автомобильное сиденье|сиденье
Office chair|Офисное кресло
Headphone pads|Амбушюры|наушники
Packaging|Упаковка
Bra|Бюстгальтер|лифчик/чашки
Shoe insole|Стелька|стельки
Yoga mat|Коврик для йоги|коврик
Gym mat|Спортивный мат|мат
Soft toy|Мягкая игрушка
Cushion|Диванная подушка
Helmet|Шлем
Stool|Мягкий табурет|табурет
Bicycle saddle|Велосипедное седло|седло
Swim float|Плавательная доска|аквапалка/нудл
Microphone windscreen|Ветрозащита микрофона
Pouf|Пуфик
Mattress topper|Наматрасник
Knee pads|Наколенники
Shoulder pads|Плечики|подплечники
Makeup sponge|Спонж
Paint roller|Поролоновый валик
Bean bag chair|Кресло мешок
Baby car seat|Автокресло
Speaker box|Акустика|колонки
Boxing gloves|Боксёрские перчатки
Life jacket|Спасательный жилет
Stroller|Детская коляска
Bed headboard|Мягкое изголовье
Laptop sleeve|Чехол для ноутбука
Camera bag|Сумка для фотоаппарата""",
    "Brick/Кирпич/Spoon/Ложка/Glass/Стакан/Book/Книга/Rock/Камень/Knife/Нож/Plate/Тарелка/Coin/Монета/Nail/Гвоздь/Phone/Телефон/Pencil/Карандаш/Bread/Хлеб")

cat("cotton_wool_things", "SEMANTIC", "everyday", "Name something usually filled with cotton wool or wadding", "Назовите предмет, внутри которого обычно вата",
    "An object that usually contains cotton wool, wadding or batting (pillow, blanket, quilt, mattress old, soft toy, cotton swab, cotton pad, quilted jacket / vatnik, padded coat, tampon, sanitary pad, medicine bottle plug, ear plugs, gauze bandage, Christmas decorations old, oven mitt).",
    "Предмет, внутри которого обычно вата или ватин: подушка, ватное одеяло, матрас, мягкая игрушка, ватная палочка, ватный диск, ватник (телогрейка), пальто на ватине, тампон, прокладка, ватно марлевая повязка, беруши, прихватка, ватные игрушки на ёлку.",
    """Pillow|Подушка
Blanket|Ватное одеяло|одеяло/quilt
Mattress|Матрас|ватный матрас
Soft toy|Мягкая игрушка|плюшевый мишка/teddy bear
Cotton swab|Ватная палочка|палочки
Cotton pad|Ватный диск|диски
Quilted jacket|Ватник|телогрейка/фуфайка
Padded coat|Пальто на ватине
Tampon|Тампон
Sanitary pad|Прокладка
Gauze bandage|Ватно марлевая повязка|повязка
Ear plugs|Беруши
Oven mitt|Прихватка
Christmas ornament|Ватная ёлочная игрушка
Pin cushion|Игольница
Cotton ball|Ватный шарик
Medical tourniquet|Тампон медицинский
Padded pants|Ватные штаны
Doll|Кукла
Cushion|Подушечка
Duvet|Пуховик ватный
Pillow toy|Подушка игрушка
Ear muffs|Наушники ватные
Pill bottle|Баночка с таблетками
Jewelry box|Шкатулка с ватой
Ear|Ухо|ухо с ватой
First aid kit|Аптечка
Mask|Маска ватная
Shoes stuffing|Набивка игрушек|набивка""".replace("\nMedical tourniquet|Тампон медицинский", "").replace("\nDuvet|Пуховик ватный", "").replace("\nEar|Ухо|ухо с ватой", "").replace("\nMask|Маска ватная", ""),
    "Brick/Кирпич/Spoon/Ложка/Phone/Телефон/Glass/Стакан/Knife/Нож/Book/Книга/Rock/Камень/Plate/Тарелка/Car/Машина/Coin/Монета/Lamp/Лампа/Bottle/Бутылка")

# ---------- 5. Letter traps (Russian) ----------
ru_word("words_b_to_a_ru", "Name a word starting with «Б» and ending with «А»", "Назовите слово, которое начинается на «Б» и заканчивается на «А»", {"kind": "STARTS_ENDS", "value": "б|а"})
ru_word("words_contains_zv_ru", "Name a word containing «зв»", "Назовите слово, в котором есть сочетание «зв»", {"kind": "CONTAINS", "value": "зв"})
ru_word("words_letter_shch_ru", "Name a word with the letter «Щ»", "Назовите слово, в котором есть буква «Щ»", {"kind": "CONTAINS", "value": "щ"})
ru_word("words_seven_letters_ru", "Name a word with exactly seven letters", "Назовите слово ровно из семи букв", {"kind": "LENGTH", "n": 7})
ru_word("words_one_o_ru", "Name a word with exactly one letter «О»", "Назовите слово, в котором только одна буква «О»", {"kind": "COUNT_LETTER", "value": "о", "n": 1})

# ---------- 6. Fast food ----------
cat("sandwich_types", "KNOWLEDGE", "food", "Name a type of sandwich", "Назовите разновидность бутерброда",
    "A kind of sandwich or open sandwich (club sandwich, BLT, grilled cheese, hamburger counts, hot dog, sub, panini, toast, croque monsieur, Reuben, smørrebrød, bruschetta, with sausage / с колбасой, with cheese, with butter, with caviar, with sprats, shawarma no, burrito no).",
    "Вид бутерброда или сэндвича: клаб сэндвич, BLT, горячий бутерброд с сыром, гамбургер, хот дог, саб, панини, тост, крок месье, рубен, сморребрёд, брускетта, бутерброд с колбасой, с сыром, с маслом, с икрой, со шпротами, канапе, тартин.",
    """Club sandwich|Клаб сэндвич|клубный сэндвич
BLT|BLT|бекон салат помидор
Grilled cheese|Горячий бутерброд с сыром|гриль сыр/горячий бутерброд
Hamburger|Гамбургер|бургер/burger
Hot dog|Хот дог
Submarine sandwich|Саб|сабвей/sub
Panini|Панини
Toast|Тост|тосты
Croque monsieur|Крок месье
Reuben|Рубен
Smørrebrød|Сморребрёд
Bruschetta|Брускетта
Sausage sandwich|Бутерброд с колбасой|с колбасой
Cheese sandwich|Бутерброд с сыром|с сыром
Butter sandwich|Бутерброд с маслом|хлеб с маслом
Caviar sandwich|Бутерброд с икрой|с икрой
Sprat sandwich|Бутерброд со шпротами|со шпротами
Canape|Канапе
Tartine|Тартин
Sandwich|Сэндвич
Tuna sandwich|Сэндвич с тунцом
Egg sandwich|Сэндвич с яйцом
Peanut butter and jelly|Арахисовая паста с джемом|pbj
Cheeseburger|Чизбургер
Banh mi|Бан ми
Cuban sandwich|Кубинский сэндвич
Philly cheesesteak|Чизстейк
Po' boy|По бой
Croque madame|Крок мадам
Monte Cristo|Монте Кристо
Sloppy Joe|Неряшливый Джо
Lobster roll|Лобстер ролл
Pulled pork sandwich|Сэндвич с рваной свининой
Chicken sandwich|Куриный сэндвич
Ham sandwich|Бутерброд с ветчиной
Salmon sandwich|Бутерброд с красной рыбой|с рыбой
Herring sandwich|Бутерброд с селёдкой
Jam sandwich|Бутерброд с вареньем
Sandwich with lard|Бутерброд с салом
Tramezzino|Трамеццини
Open sandwich|Открытый бутерброд
Triangle sandwich|Треугольный сэндвич
Club toast|Сэндвич тост
Avocado toast|Авокадо тост
Hot sandwich|Горячий бутерброд
Pizza sandwich|Бутерброд пицца
Gyro|Гирос""",
    "Pizza/Пицца/Soup/Суп/Salad/Салат/Sushi/Суши/Pelmeni/Пельмени/Pancake/Блин/Shawarma/Шаурма/Burrito/Буррито/Cake/Торт/Porridge/Каша/Spaghetti/Спагетти/Steak/Стейк")

cat("deep_fried_dishes", "KNOWLEDGE", "food", "Name a dish cooked in a deep fryer", "Назовите блюдо, которое готовят во фритюре",
    "A dish usually deep-fried (French fries, chicken nuggets, fried chicken, donuts, churros, tempura, onion rings, fish and chips, chebureki, falafel, spring rolls, corn dog, mozzarella sticks, belyashi, pirozhki fried, potato chips, samosa, karaage, schnitzel sometimes, hushpuppies).",
    "Блюдо, которое обычно жарят во фритюре: картошка фри, наггетсы, жареная курица, пончики, чуррос, темпура, луковые кольца, фиш энд чипс, чебуреки, фалафель, спринг роллы, корн дог, сырные палочки, беляши, жареные пирожки, чипсы, самса, караагэ, хворост.",
    """French fries|Картошка фри|фри/fries
Chicken nuggets|Наггетсы
Fried chicken|Жареная курица|крылышки/kfc
Donuts|Пончики|пышки/doughnut
Churros|Чуррос
Tempura|Темпура
Onion rings|Луковые кольца
Fish and chips|Фиш энд чипс
Chebureki|Чебуреки|чебурек
Falafel|Фалафель
Spring rolls|Спринг роллы
Corn dog|Корн дог
Mozzarella sticks|Сырные палочки
Belyashi|Беляши|беляш
Fried pirozhki|Жареные пирожки|пирожки
Potato chips|Чипсы
Samosa|Самоса|самса
Karaage|Караагэ
Khvorost|Хворост
Chicken wings|Куриные крылышки
Chicken strips|Стрипсы
Shrimp tempura|Креветки в кляре
Fish in batter|Рыба в кляре
Croquettes|Крокеты
Hash browns|Хашбрауны
Beignets|Бенье
Pakora|Пакора
Arancini|Аранчини
Calamari rings|Кольца кальмара
Fried cheese|Жареный сыр|сыр фри
Chimichanga|Чимичанга
Tonkatsu|Тонкацу
Funnel cake|Воронкообразный пирог
Pelmeni fried|Жареные пельмени
Baursak|Баурсаки
Chak-chak|Чак чак
Gulab jamun|Гулаб джамун
Fried pickles|Жареные огурцы
Fried ice cream|Жареное мороженое
Popcorn chicken|Куриный попкорн
Tortilla chips|Начос|кукурузные чипсы""",
    "Soup/Суп/Salad/Салат/Steak/Стейк/Boiled potatoes/Варёная картошка/Pasta/Паста/Sushi/Суши/Porridge/Каша/Ice cream/Мороженое/Pelmeni/Пельмени/Rice/Рис/Borscht/Борщ/Bread/Хлеб")

cat("burger_ingredients", "KNOWLEDGE", "food", "Name an ingredient of a burger", "Назовите ингредиент бургера",
    "An ingredient commonly put in a burger (bun, beef patty, cheese, lettuce, tomato, onion, pickles, ketchup, mustard, mayonnaise, bacon, egg, jalapeño, BBQ sauce, avocado, mushrooms, chicken patty, fish patty, sesame seeds, cheddar, arugula, onion rings, sauce).",
    "Ингредиент, который обычно кладут в бургер: булочка, котлета, сыр, листья салата, помидор, лук, маринованные огурцы, кетчуп, горчица, майонез, бекон, яйцо, халапеньо, соус барбекю, авокадо, грибы, куриная котлета, рыбная котлета, кунжут, чеддер, руккола, луковые кольца, соус.",
    """Bun|Булочка|булка
Beef patty|Котлета|говяжья котлета/patty
Cheese|Сыр|cheddar/чеддер
Lettuce|Салат|листья салата/айсберг
Tomato|Помидор|томат
Onion|Лук|красный лук
Pickles|Маринованные огурцы|огурцы/огурчики
Ketchup|Кетчуп
Mustard|Горчица
Mayonnaise|Майонез
Bacon|Бекон
Egg|Яйцо
Jalapeño|Халапеньо
BBQ sauce|Соус барбекю|барбекю
Avocado|Авокадо
Mushrooms|Грибы|шампиньоны
Chicken patty|Куриная котлета|курица
Fish patty|Рыбная котлета|рыба
Sesame seeds|Кунжут
Arugula|Руккола
Onion rings|Луковые кольца
Sauce|Соус
Cheese sauce|Сырный соус
Pineapple|Ананас
Beetroot|Свёкла
Fried onion|Жареный лук
Caramelized onion|Карамелизированный лук
Bell pepper|Перец
Chili|Чили
Garlic sauce|Чесночный соус
Truffle mayo|Трюфельный майонез
Blue cheese|Сыр с плесенью
Mozzarella|Моцарелла
Ham|Ветчина
Spinach|Шпинат
Coleslaw|Коул слоу
Beyond meat|Растительная котлета|vegan patty
Pork|Свинина
Lamb|Баранина
Cucumber|Свежий огурец
Butter|Масло
Salt|Соль
Pepper|Чёрный перец""",
    "Chocolate/Шоколад/Ice cream/Мороженое/Jam/Варенье/Rice/Рис/Pasta/Макароны/Soup/Суп/Milk/Молоко/Candy/Конфета/Cake/Торт/Porridge/Каша/Banana/Банан/Cereal/Хлопья")

cat("baked_goods", "KNOWLEDGE", "food", "Name a type of pastry or baked goods", "Назовите разновидность выпечки",
    "A type of baked goods (bread, bun, croissant, pie, pirozhok, cake, muffin, cookie, bagel, baguette, pretzel, cinnamon roll, donut baked, strudel, eclair, khachapuri, puff pastry, cheesecake vatrushka, kulich, pita, ciabatta, focaccia, biscuit, scone, waffle, crumpet, danish, samsa).",
    "Вид выпечки: хлеб, булочка, круассан, пирог, пирожок, кекс, маффин, печенье, бублик, багет, крендель, синнабон, штрудель, эклер, хачапури, слойка, ватрушка, кулич, лаваш, чиабатта, фокачча, сушки, сочник, плюшка, расстегай, курник, самса, ромовая баба.",
    """Bread|Хлеб|батон/буханка
Bun|Булочка|булка
Croissant|Круассан
Pie|Пирог
Pirozhok|Пирожок|пирожки
Muffin|Кекс|маффин
Cookie|Печенье
Bagel|Бублик|бейгл
Baguette|Багет
Pretzel|Крендель|брецель
Cinnamon roll|Синнабон|булочка с корицей
Strudel|Штрудель
Eclair|Эклер
Khachapuri|Хачапури
Puff pastry|Слойка|слоёный пирожок
Vatrushka|Ватрушка
Kulich|Кулич|пасха
Pita|Лаваш|пита
Ciabatta|Чиабатта
Focaccia|Фокачча
Sushki|Сушки|баранки
Sochnik|Сочник
Plyushka|Плюшка
Rasstegai|Расстегай
Kurnik|Курник
Samsa|Самса
Rum baba|Ромовая баба
Cake|Торт
Cupcake|Капкейк
Scone|Скон
Waffle|Вафли
Danish|Даниш
Brioche|Бриошь
Pizza|Пицца
Quiche|Киш
Tart|Тарт
Gingerbread|Пряник
Shortbread|Песочное печенье
Biscotti|Бискотти
Profiteroles|Профитроли
Kalach|Калач
Karavai|Каравай
Kalitka|Калитка
Pasty|Пирожок с мясом
Cheburek baked|Чебурек печёный
Lepeshka|Лепёшка
Chak-chak|Чак чак
Honey cake|Медовик
Napoleon|Наполеон
Charlotte|Шарлотка
Stollen|Штоллен
Panettone|Панеттоне
Churros|Чуррос
Macaron|Макарон
Pastel de nata|Паштел де ната
Tortilla|Тортилья
Matzah|Маца
Naan|Наан
Kozunak|Козунак
Vertuta|Вертута
Belyash baked|Беляш
Kulebyaka|Кулебяка
Pirog s kapustoy|Пирог с капустой""".replace("\nCheburek baked|Чебурек печёный", "").replace("\nBelyash baked|Беляш", "").replace("\nPirog s kapustoy|Пирог с капустой", ""),
    "Soup/Суп/Salad/Салат/Steak/Стейк/Sushi/Суши/Ice cream/Мороженое/Pelmeni/Пельмени/Porridge/Каша/Fries/Картошка фри/Jelly/Желе/Candy/Конфета/Juice/Сок/Omelette/Омлет")

cat("fast_food_chains", "KNOWLEDGE", "food", "Name a fast food restaurant chain", "Назовите сеть быстрого питания",
    "A real fast food chain (McDonald's, Burger King, KFC / Rostic's, Subway, Pizza Hut, Domino's, Wendy's, Taco Bell, Popeyes, Dunkin', Starbucks counts as coffee chain, Vkusno i tochka, Teremok, Chaihona? no, Shaurma chains, Dodo Pizza, Papa John's, Carl's Jr., Five Guys, Chick-fil-A, In-N-Out, Tim Hortons, Krispy Kreme, Stardogs, Kroshka Kartoshka, Burger Heroes, Black Star Burger).",
    "Настоящая сеть быстрого питания: McDonald's, Burger King, KFC (Rostic's), Subway, Pizza Hut, Domino's, Wendy's, Taco Bell, Popeyes, Dunkin', Starbucks, Вкусно и точка, Теремок, Додо Пицца, Папа Джонс, Carl's Jr., Five Guys, Chick fil A, In N Out, Tim Hortons, Krispy Kreme, Стардогс, Крошка Картошка, Black Star Burger.",
    """McDonald's|Макдоналдс|макдак/мак/mcdonalds
Burger King|Бургер Кинг|бк/бургер кинг
KFC|KFC|кфс/rostic's/ростикс
Subway|Сабвей
Pizza Hut|Пицца Хат
Domino's|Домино'с|доминос
Wendy's|Вендис
Taco Bell|Тако Белл
Popeyes|Попайс
Dunkin'|Данкин Донатс|dunkin donuts
Starbucks|Старбакс
Vkusno i tochka|Вкусно и точка|вкусно и точка
Teremok|Теремок
Dodo Pizza|Додо Пицца|додо
Papa John's|Папа Джонс
Carl's Jr.|Карлс Джуниор
Five Guys|Файв Гайз
Chick-fil-A|Чик фил эй
In-N-Out|Ин н аут
Tim Hortons|Тим Хортонс
Krispy Kreme|Криспи Крим
Stardogs|Стардогс
Kroshka Kartoshka|Крошка Картошка
Black Star Burger|Блэк Стар Бургер
Burger Heroes|Бургер Хероес
Shake Shack|Шейк Шек
Arby's|Арбис
Jack in the Box|Джек ин зе бокс
Sonic|Соник драйв ин
Chipotle|Чипотле
Panda Express|Панда Экспресс
Little Caesars|Литл Сизарс
Dairy Queen|Дейри Квин
White Castle|Уайт Касл
Nando's|Нандос
Pret A Manger|Прет а Манже
Greggs|Греггс
Jollibee|Джоллиби
Yoshinoya|Ёсиноя
Mos Burger|Мос бургер
Cinnabon|Синнабон
Baskin-Robbins|Баскин Роббинс
Shokoladnitsa|Шоколадница
Mu-Mu|Му Му
Grabli|Грабли
Tanuki|Тануки
Yakitoriya|Якитория
Kofe Khauz|Кофе Хауз
Chaihona No1|Чайхона номер 1
Tasty Coffee|Даблби|double b
Shaurma Mania|Шаурма
Rostic's|Ростикс
Bystroff|Быстроф
Kfc Chicken|Кура Гриль""".replace("\nShaurma Mania|Шаурма", "").replace("\nKfc Chicken|Кура Гриль", "").replace("\nRostic's|Ростикс", "").replace("Tasty Coffee|Даблби|double b", "Double B|Даблби"),
    "Ikea/Икеа/Auchan/Ашан/Magnit/Магнит/Pyaterochka/Пятёрочка/Nike/Найк/Coca-Cola/Кока кола/Pepsi/Пепси/Lay's/Лейс/Nestle/Нестле/Amazon/Амазон/Yandex Eda/Яндекс Еда/Delivery Club/Деливери")

# ---------- 7. Sea ----------
cat("sea_animals_not_fish", "KNOWLEDGE", "animals", "Name a sea animal that is not a fish", "Назовите морское животное, которое не является рыбой",
    "A marine animal that is not a fish: mammals (whale, dolphin, seal, walrus, sea otter, manatee), reptiles (sea turtle, sea snake), invertebrates (octopus, squid, jellyfish, starfish, crab, lobster, shrimp, sea urchin, coral, mussel, oyster, sea cucumber, krill, sea anemone, sponge), seabirds like penguin.",
    "Морское животное, которое не рыба: млекопитающие (кит, дельфин, тюлень, морж, калан, ламантин), рептилии (морская черепаха, морская змея), беспозвоночные (осьминог, кальмар, медуза, морская звезда, краб, омар, креветка, морской ёж, коралл, мидия, устрица, трепанг, криль, актиния, губка), пингвин.",
    """Whale|Кит
Dolphin|Дельфин
Seal|Тюлень
Walrus|Морж
Sea otter|Калан|морская выдра
Manatee|Ламантин
Sea turtle|Морская черепаха|черепаха
Sea snake|Морская змея
Octopus|Осьминог
Squid|Кальмар
Jellyfish|Медуза
Starfish|Морская звезда
Crab|Краб
Lobster|Омар|лобстер
Shrimp|Креветка
Sea urchin|Морской ёж
Coral|Коралл
Mussel|Мидия
Oyster|Устрица
Sea cucumber|Трепанг|морской огурец
Krill|Криль
Sea anemone|Актиния
Sponge|Губка
Penguin|Пингвин
Orca|Косатка
Sea lion|Морской лев
Narwhal|Нарвал
Beluga|Белуха
Dugong|Дюгонь
Cuttlefish|Каракатица
Nautilus|Наутилус
Scallop|Гребешок
Clam|Моллюск
Sperm whale|Кашалот
Fur seal|Морской котик
Hermit crab|Рак отшельник
Sea slug|Морской слизень|голожаберник
Plankton|Планктон
Barnacle|Морской жёлудь
Polar bear|Белый медведь
Gull|Чайка
Albatross|Альбатрос
Marine iguana|Морская игуана
Saltwater crocodile|Гребнистый крокодил
Horseshoe crab|Мечехвост
Comb jelly|Гребневик
Squid giant|Гигантский кальмар
Blue whale|Синий кит
Humpback whale|Горбатый кит
Elephant seal|Морской слон""",
    "Shark/Акула/Tuna/Тунец/Cod/Треска/Salmon/Лосось/Clownfish/Рыба клоун/Seahorse/Морской конёк/Stingray/Скат/Eel/Угорь/Herring/Сельдь/Pike/Щука/Carp/Карп/Frog/Лягушка")

cat("sea_fish", "KNOWLEDGE", "animals", "Name a kind of sea fish", "Назовите разновидность морской рыбы",
    "A fish species that lives in the sea (cod, tuna, herring, mackerel, salmon at sea, flounder, halibut, sardine, anchovy, sea bass, dorado, pollock, hake, sprat, capelin, swordfish, shark, stingray, clownfish, seahorse, moray, marlin, barracuda, pufferfish, grouper, saury, navaga).",
    "Морская рыба: треска, тунец, сельдь, скумбрия, лосось, камбала, палтус, сардина, анчоус, сибас, дорадо, минтай, хек, шпрот (килька), мойва, рыба меч, акула, скат, рыба клоун, морской конёк, мурена, марлин, барракуда, фугу, групер, сайра, навага, путассу.",
    """Cod|Треска
Tuna|Тунец
Herring|Сельдь|селёдка
Mackerel|Скумбрия
Salmon|Лосось|сёмга/горбуша/кета
Flounder|Камбала
Halibut|Палтус
Sardine|Сардина
Anchovy|Анчоус|хамса
Sea bass|Сибас
Dorado|Дорадо
Pollock|Минтай
Hake|Хек
Sprat|Шпрот|килька
Capelin|Мойва
Swordfish|Рыба меч
Shark|Акула
Stingray|Скат
Clownfish|Рыба клоун
Seahorse|Морской конёк
Moray|Мурена
Marlin|Марлин
Barracuda|Барракуда
Pufferfish|Фугу|рыба фугу/иглобрюх
Grouper|Групер|каменный окунь
Saury|Сайра
Navaga|Навага
Blue whiting|Путассу
Turbot|Тюрбо
Sole|Морской язык
Red mullet|Барабулька|султанка
Horse mackerel|Ставрида
Sea perch|Морской окунь
Catfish wolf|Зубатка
Monkfish|Морской чёрт|удильщик
Plaice|Морская камбала
Haddock|Пикша
Saithe|Сайда
Mullet|Кефаль
Bluefish|Луфарь
Garfish|Сарган
Smelt|Корюшка
Greenling|Терпуг
Pike perch sea|Пеленгас
Snapper|Луциан
Mahi-mahi|Махи махи
Sea bream|Морской лещ
Sturgeon|Осётр
Beluga|Белуга
Lionfish|Крылатка
Angelfish|Рыба ангел
Surgeonfish|Рыба хирург
Parrotfish|Рыба попугай
Sunfish|Рыба луна
Flying fish|Летучая рыба
Butterfish|Масляная рыба
Icefish|Ледяная рыба
Toothfish|Клыкач""".replace("Catfish wolf|Зубатка", "Wolffish|Зубатка").replace("Pike perch sea|Пеленгас", "So-iuy mullet|Пеленгас"),
    "Pike/Щука/Carp/Карп/Catfish/Сом/Perch/Окунь/Crucian carp/Карась/Trout/Форель/Goldfish/Золотая рыбка/Whale/Кит/Dolphin/Дельфин/Octopus/Осьминог/Crab/Краб/Shrimp/Креветка")

cat("seas", "GEOGRAPHY", "geography", "Name a sea", "Назовите море",
    "A real sea (Black, Red, Mediterranean, Caspian, Baltic, North, Barents, White, Kara, Laptev, East Siberian, Chukchi, Bering, Okhotsk, Japan, Yellow, South China, Arabian, Caribbean, Sargasso, Tasman, Coral, Aegean, Adriatic, Ionian, Tyrrhenian, Ligurian, Marmara, Azov, Dead, Weddell, Ross, Norwegian, Irish, Celtic, Java, Banda, Philippine, Andaman, Sulu, Labrador, Greenland, Beaufort).",
    "Настоящее море: Чёрное, Красное, Средиземное, Каспийское, Балтийское, Северное, Баренцево, Белое, Карское, море Лаптевых, Восточно Сибирское, Чукотское, Берингово, Охотское, Японское, Жёлтое, Южно Китайское, Аравийское, Карибское, Саргассово, Тасманово, Коралловое, Эгейское, Адриатическое, Ионическое, Тирренское, Мраморное, Азовское, Мёртвое, море Уэдделла, море Росса, Норвежское, Ирландское.",
    """Black Sea|Чёрное море|черное
Red Sea|Красное море|красное
Mediterranean Sea|Средиземное море|средиземное
Caspian Sea|Каспийское море|каспий/каспийское
Baltic Sea|Балтийское море|балтика/балтийское
North Sea|Северное море|северное
Barents Sea|Баренцево море|баренцево
White Sea|Белое море|белое
Kara Sea|Карское море|карское
Laptev Sea|Море Лаптевых|лаптевых
East Siberian Sea|Восточно Сибирское море
Chukchi Sea|Чукотское море|чукотское
Bering Sea|Берингово море|берингово
Sea of Okhotsk|Охотское море|охотское
Sea of Japan|Японское море|японское
Yellow Sea|Жёлтое море|желтое
South China Sea|Южно Китайское море
East China Sea|Восточно Китайское море
Arabian Sea|Аравийское море
Caribbean Sea|Карибское море|карибы/карибское
Sargasso Sea|Саргассово море
Tasman Sea|Тасманово море
Coral Sea|Коралловое море
Aegean Sea|Эгейское море|эгейское
Adriatic Sea|Адриатическое море|адриатика
Ionian Sea|Ионическое море
Tyrrhenian Sea|Тирренское море
Ligurian Sea|Лигурийское море
Sea of Marmara|Мраморное море
Sea of Azov|Азовское море|азовское
Dead Sea|Мёртвое море|мертвое
Weddell Sea|Море Уэдделла
Ross Sea|Море Росса
Norwegian Sea|Норвежское море
Irish Sea|Ирландское море
Celtic Sea|Кельтское море
Java Sea|Яванское море
Banda Sea|Море Банда
Philippine Sea|Филиппинское море
Andaman Sea|Андаманское море
Sulu Sea|Море Сулу
Labrador Sea|Море Лабрадор
Greenland Sea|Гренландское море
Beaufort Sea|Море Бофорта
Wadden Sea|Ваттовое море
Balearic Sea|Балеарское море
Alboran Sea|Море Альборан
Levantine Sea|Левантийское море
Sea of Crete|Критское море
Bismarck Sea|Море Бисмарка
Arafura Sea|Арафурское море
Timor Sea|Тиморское море
Solomon Sea|Соломоново море
Celebes Sea|Море Сулавеси
Pechora Sea|Печорское море
Sea of Galilee|Галилейское море
Aral Sea|Аральское море
Salton Sea|Солтон Си
Scotia Sea|Море Скотия
Amundsen Sea|Море Амундсена
Lincoln Sea|Море Линкольна""",
    "Atlantic Ocean/Атлантический океан/Pacific Ocean/Тихий океан/Indian Ocean/Индийский океан/Arctic Ocean/Северный Ледовитый океан/Baikal/Байкал/Lake Ladoga/Ладожское озеро/Volga/Волга/Gulf of Finland/Финский залив/Bosphorus/Босфор/Lake Geneva/Женевское озеро/Sea of Love/Море любви")

cat("seafood", "KNOWLEDGE", "food", "Name a kind of seafood", "Назовите разновидность морепродуктов",
    "A kind of seafood eaten by people (shrimp, prawns, crab, lobster, squid, octopus, mussels, oysters, scallops, clams, sea urchin, caviar / roe, cuttlefish, langoustine, crayfish, krill, seaweed / kelp, sea cucumber, crab sticks, fish also counts loosely).",
    "Морепродукт, который едят: креветки, крабы, омары (лобстеры), кальмары, осьминоги, мидии, устрицы, гребешки, моллюски, морской ёж, икра, каракатица, лангустины, раки, криль, морская капуста, трепанг, крабовые палочки, рапаны, морской коктейль.",
    """Shrimp|Креветки|креветка/prawns
Crab|Краб|крабы
Lobster|Лобстер|омар
Squid|Кальмар|кальмары
Octopus|Осьминог
Mussels|Мидии
Oysters|Устрицы
Scallops|Гребешки|морской гребешок
Clams|Моллюски
Sea urchin|Морской ёж
Caviar|Икра|красная икра/чёрная икра/roe
Cuttlefish|Каракатица
Langoustine|Лангустины
Crayfish|Раки
Krill|Криль
Seaweed|Морская капуста|ламинария/kelp/нори
Sea cucumber|Трепанг
Crab sticks|Крабовые палочки
Rapana|Рапаны
Seafood mix|Морской коктейль
Spiny lobster|Лангуст
King crab|Камчатский краб
Snow crab|Краб стригун
Abalone|Морское ушко
Razor clam|Морской черенок
Cockles|Сердцевидки
Whelk|Трубач|букцинум
Sea squirt|Асцидия
Salmon|Лосось
Tuna|Тунец
Cod liver|Печень трески
Fish|Рыба
Sprats|Шпроты
Herring|Селёдка
Eel|Угорь
Anchovies|Анчоусы
Sushi|Суши
Tobiko|Тобико
Masago|Масаго
Uni|Уни
Lobster tail|Хвост лобстера
Mantis shrimp|Рак богомол
Sea snails|Морские улитки""",
    "Chicken/Курица/Beef/Говядина/Pork/Свинина/Lamb/Баранина/Duck/Утка/Pike/Щука/Carp/Карп/Tofu/Тофу/Sausage/Колбаса/Egg/Яйцо/Mushrooms/Грибы/Rice/Рис")

cat("underwater_items", "KNOWLEDGE", "everyday", "Name something designed to be used under water", "Назовите предмет для использования под водой",
    "An object made for use underwater (scuba tank, diving mask, snorkel, flippers, wetsuit, dive computer, underwater camera, submarine, bathyscaphe, harpoon / spear gun, diving helmet, underwater flashlight, depth gauge, rebreather, underwater drone, swimming goggles, aquarium heater, waterproof watch, sonar, anchor).",
    "Предмет для использования под водой: акваланг, маска для ныряния, трубка, ласты, гидрокостюм, дайв компьютер, подводная камера, подводная лодка, батискаф, подводное ружьё, водолазный шлем, подводный фонарь, глубиномер, ребризер, подводный дрон, очки для плавания, водонепроницаемые часы, сонар, якорь.",
    """Scuba tank|Акваланг|баллон
Diving mask|Маска для ныряния|маска
Snorkel|Трубка для плавания|трубка
Flippers|Ласты
Wetsuit|Гидрокостюм
Dive computer|Дайв компьютер
Underwater camera|Подводная камера|gopro
Submarine|Подводная лодка|подлодка
Bathyscaphe|Батискаф
Spear gun|Подводное ружьё|ружьё для подводной охоты
Diving helmet|Водолазный шлем
Underwater flashlight|Подводный фонарь
Depth gauge|Глубиномер
Rebreather|Ребризер
Underwater drone|Подводный дрон
Swimming goggles|Очки для плавания
Waterproof watch|Водонепроницаемые часы
Sonar|Сонар|эхолот
Anchor|Якорь
Diving suit|Водолазный скафандр|скафандр
Weight belt|Грузовой пояс
Buoyancy compensator|Компенсатор плавучести
Regulator|Регулятор|лёгочный автомат
Torpedo|Торпеда
Aquarium filter|Аквариумный фильтр
Aquarium heater|Нагреватель для аквариума
Underwater scooter|Подводный скутер|буксировщик
Fishing net|Рыболовная сеть|сеть
Fishing hook|Крючок
Pool robot|Робот для бассейна
Earplugs|Беруши для плавания
Nose clip|Зажим для носа
Bathysphere|Батисфера
Underwater pump|Погружной насос
Submersible|Глубоководный аппарат
Hydrophone|Гидрофон
Sea mine|Морская мина
Cage|Клетка для дайвинга с акулами""",
    "Umbrella/Зонт/Raincoat/Дождевик/Towel/Полотенце/Phone/Телефон/Book/Книга/Hair dryer/Фен/Laptop/Ноутбук/Sunglasses/Солнцезащитные очки/Kite/Воздушный змей/Candle/Свеча/Toaster/Тостер/Bicycle/Велосипед")

# ---------- 8. Unusual constructions ----------
cat("things_with_center_hole", "SEMANTIC", "everyday", "Name something with a hole in the middle", "Назовите предмет с отверстием посередине",
    "An object with a hole through its middle (donut, bagel, ring, CD / DVD, washer, nut, button, life ring, tyre, bead, Polo mint, sushki / baranka, Cheerios, coin with hole, record vinyl, spool, wheel, roll of tape, toilet paper roll, frisbee ring, hula hoop, pineapple ring, needle eye, key ring).",
    "Предмет с отверстием посередине: пончик, бублик, баранка, сушка, кольцо, компакт диск, шайба, гайка, пуговица, спасательный круг, шина, бусина, виниловая пластинка, катушка, колесо, рулон скотча, рулон туалетной бумаги, обруч, кольцо ананаса, игольное ушко, брелок кольцо.",
    """Donut|Пончик|doughnut
Bagel|Бублик|бейгл
Baranka|Баранка|сушка/сушки
Ring|Кольцо
CD|Компакт диск|диск/dvd
Washer|Шайба
Nut|Гайка
Button|Пуговица
Life ring|Спасательный круг|круг
Tyre|Шина|покрышка
Bead|Бусина
Vinyl record|Виниловая пластинка|пластинка
Spool|Катушка
Wheel|Колесо
Tape roll|Рулон скотча|скотч
Toilet paper roll|Рулон туалетной бумаги
Hula hoop|Обруч
Pineapple ring|Кольцо ананаса
Needle|Игла|игольное ушко
Key ring|Кольцо для ключей
Coin with hole|Монета с отверстием
Cheerios|Колечки сухой завтрак
Onion ring|Луковое кольцо
Bracelet|Браслет
Earring|Серьга кольцо
Swim ring|Надувной круг
Squid ring|Кольцо кальмара
Pulley|Шкив|блок
Gear|Шестерёнка
Frisbee ring|Летающее кольцо
Pretzel|Крендель
Lifebuoy|Спасательный буй
Toilet seat|Сиденье унитаза
Flute|Флейта
Pipe|Труба
Straw|Трубочка
Ringlet cake|Кекс бабка|бундт
Grommet|Люверс
Sink|Раковина|слив
Wedding ring|Обручальное кольцо
Steering wheel|Руль
Bundt pan|Форма для кекса с отверстием
Mint candy|Мятная конфета с дыркой
Ring binder|Кольцо скоросшивателя
Disc weight|Блин для штанги""",
    "Ball/Мяч/Egg/Яйцо/Book/Книга/Spoon/Ложка/Brick/Кирпич/Apple/Яблоко/Cube/Кубик/Pillow/Подушка/Phone/Телефон/Plate/Тарелка/Banana/Банан/Coin/Монета")

cat("things_with_cogwheel", "SEMANTIC", "everyday", "Name something that has a toothed wheel (gear)", "Назовите предмет, у которого есть зубчатое колесо",
    "An object with a toothed / cog wheel (mechanical clock, bicycle chainring and sprocket, watch, gearbox, meat grinder, lighter flint wheel, fishing reel, music box, can opener, pencil sharpener with crank, winch, ratchet, tank tracks drive wheel, egg beater, windmill, lathe, crank, motorcycle).",
    "Предмет, в котором есть зубчатое колесо: механические часы, велосипед (звёздочка), наручные часы, коробка передач, мясорубка, зажигалка (колёсико), рыболовная катушка, музыкальная шкатулка, консервный нож, точилка с ручкой, лебёдка, трещотка, гусеница танка, ручной миксер, мельница, токарный станок, мотоцикл.",
    """Mechanical clock|Механические часы|часы/clock
Bicycle|Велосипед|звёздочка
Watch|Наручные часы
Gearbox|Коробка передач|кпп
Meat grinder|Мясорубка
Lighter|Зажигалка
Fishing reel|Рыболовная катушка|катушка
Music box|Музыкальная шкатулка
Can opener|Консервный нож|открывашка
Pencil sharpener|Точилка с ручкой
Winch|Лебёдка
Ratchet|Трещотка
Tank|Танк|гусеница
Egg beater|Ручной миксер|венчик механический
Windmill|Мельница
Lathe|Токарный станок
Motorcycle|Мотоцикл
Car|Автомобиль
Drill|Дрель
Escalator|Эскалатор
Elevator|Лифт
Robot|Робот
Wind-up toy|Заводная игрушка
Printer|Принтер
Excavator|Экскаватор
Tower clock|Куранты
Coffee grinder|Кофемолка
Hand drill|Ручная дрель|коловорот
Typewriter|Пишущая машинка
Cuckoo clock|Часы с кукушкой
Clockwork|Заводной механизм
Crane|Подъёмный кран
Turntable|Проигрыватель
Bike derailleur|Переключатель скоростей
Steering rack|Рулевая рейка
Chainsaw|Бензопила
Sewing machine|Швейная машинка
Mixer|Миксер
Snowmobile|Снегоход
Combine harvester|Комбайн""",
    "Spoon/Ложка/Book/Книга/Pillow/Подушка/Glass/Стакан/Brick/Кирпич/Towel/Полотенце/Plate/Тарелка/Pencil/Карандаш/Chair/Стул/Candle/Свеча/Banana/Банан/Shoe/Ботинок")

cat("two_halves_things", "SEMANTIC", "everyday", "Name something made of two joined halves", "Назовите предмет, состоящий из двух соединённых половинок",
    "An object made of two halves joined together (walnut shell, clam / mussel shell, laptop, flip phone, book cover, scissors, tweezers, pliers, compact powder, locket, sandwich, oyster, Kinder Surprise egg capsule, pea pod, burger bun, peanut, pistachio, castanets, glasses case, suitcase, waffle iron, sandwich maker, chocolate egg, tongs, clothespin).",
    "Предмет из двух соединённых половинок: скорлупа грецкого ореха, ракушка (мидия), ноутбук, телефон раскладушка, ножницы, пинцет, плоскогубцы, пудреница, медальон, бутерброд, устрица, капсула киндер сюрприза, стручок гороха, булочка бургера, арахис, фисташка, кастаньеты, футляр для очков, чемодан, вафельница, бутербродница, шоколадное яйцо, щипцы, прищепка.",
    """Walnut|Грецкий орех|скорлупа ореха
Seashell|Ракушка|мидия/mussel/clam
Laptop|Ноутбук
Flip phone|Телефон раскладушка|раскладушка
Scissors|Ножницы
Tweezers|Пинцет
Pliers|Плоскогубцы|пассатижи
Compact powder|Пудреница
Locket|Медальон
Sandwich|Бутерброд|сэндвич
Oyster|Устрица
Kinder Surprise|Киндер сюрприз|капсула киндера
Pea pod|Стручок гороха|стручок
Burger|Бургер
Peanut|Арахис
Pistachio|Фисташка
Castanets|Кастаньеты
Glasses case|Футляр для очков
Suitcase|Чемодан
Waffle iron|Вафельница
Sandwich maker|Бутербродница
Chocolate egg|Шоколадное яйцо
Tongs|Щипцы
Clothespin|Прищепка
Book|Книга
Shell of an egg|Капсула
Ball|Мяч из двух половин
Pill capsule|Капсула таблетки|капсула
Coconut|Кокос
Avocado|Авокадо
Peach|Персик
Brain|Мозг
Butterfly|Бабочка
Lungs|Лёгкие
Earth|Земля полушария|полушария
Apple|Яблоко
Matryoshka|Матрёшка
Tin box|Жестяная коробка
Jewelry box|Шкатулка
Sunglasses|Очки
Wallet|Кошелёк
Clamshell packaging|Блистер раскладушка
Mold|Форма для литья
Sushi mat|Рулет
Pokeball|Покебол""".replace("\nShell of an egg|Капсула", "").replace("\nBall|Мяч из двух половин", "").replace("\nSushi mat|Рулет", ""),
    "Spoon/Ложка/Pencil/Карандаш/Brick/Кирпич/Rope/Верёвка/Needle/Игла/Coin/Монета/Banana/Банан/Carrot/Морковь/Stick/Палка/Nail/Гвоздь/Cup/Чашка/Candle/Свеча")

cat("things_with_hook", "SEMANTIC", "everyday", "Name something whose design includes a hook", "Назовите предмет, в конструкции которого есть крючок",
    "An object that has a hook as part of it (coat hanger, fishing rod / hook, crane, bra clasp, crochet hook, towel hook, carabiner sort of, earring, Christmas ornament hook, tow hook, anchor, umbrella handle, curtain ring, hook and eye fastener, keychain, belt hook, grappling hook, shepherd's crook, pirate hook hand, coat rack).",
    "Предмет, в конструкции которого есть крючок: вешалка (плечики), удочка (рыболовный крючок), подъёмный кран, застёжка бюстгальтера, крючок для вязания, крючок для полотенца, серьга, ёлочная игрушка, фаркоп, якорь, ручка зонта, кольцо для штор, застёжка крючок, брелок, кошка (абордажный крюк), посох пастуха, крюк пирата, вешалка в прихожей, дверная цепочка.",
    """Coat hanger|Вешалка|плечики
Fishing rod|Удочка|рыболовный крючок/fishing hook
Crane|Подъёмный кран|кран
Bra|Бюстгальтер|застёжка лифчика
Crochet hook|Крючок для вязания
Towel hook|Крючок для полотенца
Earring|Серьга|серёжка
Christmas ornament|Ёлочная игрушка
Tow hitch|Фаркоп|буксировочный крюк
Anchor|Якорь
Umbrella|Зонт|ручка зонта
Curtain ring|Кольцо для штор|карниз
Hook and eye|Застёжка крючок
Keychain|Брелок
Grappling hook|Кошка|абордажный крюк
Shepherd's crook|Посох пастуха|посох
Pirate hook|Крюк пирата|крюк капитана крюка
Coat rack|Вешалка в прихожей
Door chain|Дверная цепочка
Carabiner|Карабин
Picture hanger|Крючок для картины
Bag hook|Крючок для сумки
Meat hook|Крюк для мяса
Lifting hook|Грузовой крюк
Window latch|Шпингалет
Hammock|Гамак
Belt buckle|Пряжка
Necklace clasp|Застёжка цепочки
Hook ladder|Штурмовая лестница
Boat hook|Багор
Cane|Трость
Mop bucket|Швабра
Shoe horn|Ложка для обуви
Bird feeder|Кормушка
Plant hanger|Кашпо подвесное
Kitchen rail|Рейлинг
Fish gaff|Багорик
Climbing gear|Ледоруб
Lamp|Люстра""".replace("\nMop bucket|Швабра", "").replace("\nShoe horn|Ложка для обуви", ""),
    "Spoon/Ложка/Book/Книга/Ball/Мяч/Brick/Кирпич/Pillow/Подушка/Plate/Тарелка/Cup/Чашка/Banana/Банан/Egg/Яйцо/Sock/Носок/Pencil/Карандаш/Coin/Монета")

cat("things_with_sliding_part", "SEMANTIC", "everyday", "Name something with a part that slides out", "Назовите предмет, у которого есть выдвижная часть",
    "An object with a retractable or sliding-out part (drawer / chest of drawers, desk, telescope, tape measure, retractable pen, utility knife, lipstick, sofa bed, extendable table, antenna, selfie stick, ladder extension, telescopic umbrella, matchbox, USB flash drive, CD tray, keyboard tray, car window, sword in sheath? no, zip-out roof, trombone slide, glue stick, deodorant stick).",
    "Предмет с выдвижной частью: ящик стола, комод, подзорная труба, рулетка, автоматическая ручка, канцелярский нож, помада, диван кровать, раздвижной стол, антенна, монопод, выдвижная лестница, складной зонт, спичечный коробок, флешка, лоток дисковода, полка для клавиатуры, тромбон, клей карандаш, дезодорант стик.",
    """Drawer|Ящик|выдвижной ящик
Chest of drawers|Комод
Desk|Письменный стол
Telescope|Подзорная труба|телескоп
Tape measure|Рулетка
Retractable pen|Автоматическая ручка|ручка
Utility knife|Канцелярский нож|нож
Lipstick|Помада
Sofa bed|Диван кровать|диван
Extendable table|Раздвижной стол
Antenna|Антенна
Selfie stick|Монопод|палка для селфи
Extension ladder|Выдвижная лестница
Umbrella|Складной зонт|зонт
Matchbox|Спичечный коробок
USB flash drive|Флешка
CD tray|Лоток дисковода|дисковод
Keyboard tray|Полка для клавиатуры
Trombone|Тромбон
Glue stick|Клей карандаш
Deodorant stick|Дезодорант стик
Wardrobe|Шкаф купе
Cash register|Касса
Mechanical pencil|Механический карандаш
Microscope|Микроскоп
Sliding door|Раздвижная дверь
Camera lens|Объектив
Suitcase handle|Ручка чемодана|чемодан
Car seat|Сиденье автомобиля
Baking oven tray|Противень духовки|духовка
Fridge shelf|Ящик холодильника|холодильник
Pencil case|Пенал
Hair clipper|Машинка
Smartphone camera|Выдвижная камера
Treadmill|Беговая дорожка
Trailer|Прицеп
Fire truck ladder|Пожарная лестница
Scissor lift|Подъёмник
Retractable leash|Поводок рулетка
Tripod|Штатив
Walking poles|Треккинговые палки
Measuring compass|Штангенциркуль
Box cutter|Резак
Blinds|Жалюзи
Kitchen hood|Вытяжка
Tablet stand|Подставка
Bed|Кровать с ящиками""",
    "Spoon/Ложка/Ball/Мяч/Brick/Кирпич/Book/Книга/Apple/Яблоко/Plate/Тарелка/Cup/Чашка/Coin/Монета/Pillow/Подушка/Sock/Носок/Rock/Камень/Banana/Банан")

# ---------- 9. Superheroes and villains ----------
cat("marvel_characters", "KNOWLEDGE", "movies_tv", "Name a Marvel character", "Назовите персонажа вселенной Marvel",
    "A character from the Marvel comics / films universe (Iron Man, Spider-Man, Captain America, Thor, Hulk, Black Widow, Hawkeye, Thanos, Loki, Doctor Strange, Black Panther, Wolverine, Deadpool, Groot, Rocket, Star-Lord, Gamora, Ant-Man, Scarlet Witch, Vision, Captain Marvel, Venom, Magneto, Professor X, Storm, Nick Fury, Ultron, Daredevil, Punisher, Silver Surfer, Galactus).",
    "Персонаж вселенной Marvel: Железный человек, Человек паук, Капитан Америка, Тор, Халк, Чёрная вдова, Соколиный глаз, Танос, Локи, Доктор Стрэндж, Чёрная пантера, Росомаха, Дэдпул, Грут, Ракета, Звёздный Лорд, Гамора, Человек муравей, Алая ведьма, Вижн, Капитан Марвел, Веном, Магнето, Профессор Икс, Шторм, Ник Фьюри, Альтрон, Сорвиголова, Каратель, Серебряный Сёрфер, Галактус.",
    """Iron Man|Железный человек|тони старк/tony stark
Spider-Man|Человек паук|питер паркер/spiderman
Captain America|Капитан Америка|стив роджерс
Thor|Тор
Hulk|Халк|брюс беннер
Black Widow|Чёрная вдова|наташа романофф
Hawkeye|Соколиный глаз|клинт бартон
Thanos|Танос
Loki|Локи
Doctor Strange|Доктор Стрэндж
Black Panther|Чёрная пантера|т'чалла
Wolverine|Росомаха|логан
Deadpool|Дэдпул|уэйд уилсон
Groot|Грут
Rocket|Ракета|енот ракета
Star-Lord|Звёздный Лорд|питер квилл
Gamora|Гамора
Ant-Man|Человек муравей
Scarlet Witch|Алая ведьма|ванда
Vision|Вижн
Captain Marvel|Капитан Марвел|кэрол дэнверс
Venom|Веном
Magneto|Магнето
Professor X|Профессор Икс|чарльз ксавье
Storm|Шторм
Nick Fury|Ник Фьюри
Ultron|Альтрон
Daredevil|Сорвиголова
Punisher|Каратель
Silver Surfer|Серебряный Сёрфер
Galactus|Галактус
Drax|Дракс
Nebula|Небула
Mantis|Мантис
Shang-Chi|Шан Чи
Falcon|Сокол
Winter Soldier|Зимний солдат|баки
War Machine|Воитель
Wasp|Оса
She-Hulk|Женщина Халк
Ms. Marvel|Мисс Марвел
Moon Knight|Лунный рыцарь
Ghost Rider|Призрачный гонщик
Blade|Блэйд
Cyclops|Циклоп
Jean Grey|Джин Грей
Mystique|Мистик
Rogue|Шельма
Gambit|Гамбит
Beast|Зверь
Nightcrawler|Ночной Змей
Colossus|Колосс
Juggernaut|Джаггернаут
Sabretooth|Саблезубый
Apocalypse|Апокалипсис
Green Goblin|Зелёный гоблин
Doctor Octopus|Доктор Осьминог
Sandman|Песочный человек
Mysterio|Мистерио
Vulture|Стервятник
Kingpin|Кингпин
Red Skull|Красный Череп
Hela|Хела
Ego|Эго
Kang|Канг
Doctor Doom|Доктор Дум
Mister Fantastic|Мистер Фантастик
Invisible Woman|Невидимая леди
Human Torch|Человек факел
The Thing|Существо
Carnage|Карнаж
Miles Morales|Майлз Моралес
Gwen Stacy|Гвен Стейси
Mary Jane|Мэри Джейн
Pepper Potts|Пеппер Поттс
Happy Hogan|Хэппи Хоган
Peggy Carter|Пегги Картер
Okoye|Окойе
Shuri|Шури
Killmonger|Киллмонгер
Wong|Вонг
Yondu|Йонду
Howard the Duck|Утка Говард
Squirrel Girl|Девушка белка
Elektra|Электра
Jessica Jones|Джессика Джонс
Luke Cage|Люк Кейдж
Iron Fist|Железный кулак
Agatha Harkness|Агата Харкнесс
Taskmaster|Таскмастер
Yelena Belova|Елена Белова
Sentry|Часовой
Odin|Один
Heimdall|Хеймдалль
Valkyrie|Валькирия""",
    "Batman/Бэтмен/Superman/Супермен/Joker/Джокер/Wonder Woman/Чудо женщина/Flash/Флэш/Aquaman/Аквамен/Harley Quinn/Харли Квинн/Green Lantern/Зелёный фонарь/Robin/Робин/Shrek/Шрек/Darth Vader/Дарт Вейдер/Homelander/Хоумлендер")

cat("dc_characters", "KNOWLEDGE", "movies_tv", "Name a DC character", "Назовите персонажа вселенной DC",
    "A character from the DC comics / films universe (Batman, Superman, Wonder Woman, Joker, Harley Quinn, Flash, Aquaman, Green Lantern, Cyborg, Robin, Catwoman, Lex Luthor, Penguin, Riddler, Two-Face, Bane, Poison Ivy, Scarecrow, Alfred, Commissioner Gordon, Lois Lane, Supergirl, Shazam, Darkseid, Deathstroke, Green Arrow, Martian Manhunter, Black Adam, Constantine, Zatanna, Raven, Starfire, Beast Boy, Nightwing).",
    "Персонаж вселенной DC: Бэтмен, Супермен, Чудо женщина, Джокер, Харли Квинн, Флэш, Аквамен, Зелёный Фонарь, Киборг, Робин, Женщина кошка, Лекс Лютор, Пингвин, Загадочник, Двуликий, Бэйн, Ядовитый плющ, Пугало, Альфред, комиссар Гордон, Лоис Лейн, Супергёрл, Шазам, Дарксайд, Детстроук, Зелёная стрела, Марсианский охотник, Чёрный Адам, Константин, Затанна, Рэйвен, Старфаер, Бист Бой, Найтвинг.",
    """Batman|Бэтмен|брюс уэйн/bruce wayne
Superman|Супермен|кларк кент
Wonder Woman|Чудо женщина|диана
Joker|Джокер
Harley Quinn|Харли Квинн
Flash|Флэш|барри аллен
Aquaman|Аквамен
Green Lantern|Зелёный Фонарь
Cyborg|Киборг
Robin|Робин
Catwoman|Женщина кошка
Lex Luthor|Лекс Лютор
Penguin|Пингвин
Riddler|Загадочник|риддлер
Two-Face|Двуликий
Bane|Бэйн
Poison Ivy|Ядовитый плющ
Scarecrow|Пугало
Alfred|Альфред
Commissioner Gordon|Комиссар Гордон|гордон
Lois Lane|Лоис Лейн
Supergirl|Супергёрл
Shazam|Шазам
Darkseid|Дарксайд
Deathstroke|Детстроук
Green Arrow|Зелёная стрела
Martian Manhunter|Марсианский охотник
Black Adam|Чёрный Адам
Constantine|Константин
Zatanna|Затанна
Raven|Рэйвен
Starfire|Старфаер
Beast Boy|Бист Бой
Nightwing|Найтвинг
Batgirl|Бэтгёрл
Mr. Freeze|Мистер Фриз
Killer Croc|Убийца Крок
Ra's al Ghul|Ра'с аль Гул
Hush|Хаш
Deadshot|Дэдшот
Captain Boomerang|Капитан Бумеранг
Amanda Waller|Аманда Уоллер
Peacemaker|Миротворец
Doomsday|Дуумсдэй
General Zod|Генерал Зод
Brainiac|Брейниак
Steppenwolf|Степной Волк
Sinestro|Синестро
Reverse-Flash|Обратный Флэш
Black Canary|Чёрная канарейка
Hawkman|Человек ястреб
Hawkgirl|Девушка ястреб
Blue Beetle|Синий Жук
Booster Gold|Бустер Голд
Plastic Man|Пластиковый человек
Swamp Thing|Болотная тварь
Doctor Fate|Доктор Фейт
Atom|Атом
Firestorm|Огненный шторм
Krypto|Крипто
Jimmy Olsen|Джимми Олсен
Perry White|Перри Уайт
Red Hood|Красный колпак
Batwoman|Бэтвумен
Huntress|Охотница
Mera|Мера
Black Manta|Чёрная манта
Cheetah|Гепарда
Ares|Арес
Steve Trevor|Стив Тревор
Lobo|Лобо
Rorschach|Роршах
Doctor Manhattan|Доктор Манхэттен
Ozymandias|Озимандия
Bizarro|Бизарро
Metallo|Металло
Clayface|Глиноликий
Mad Hatter|Безумный Шляпник
Man-Bat|Человек летучая мышь
Talia al Ghul|Талия аль Гул
Damian Wayne|Дэмиен Уэйн
Batman Beyond|Бэтмен будущего
Jonah Hex|Джона Хекс
Sandman Morpheus|Сон|морфеус
Death|Смерть Endless""".replace("\nDeath|Смерть Endless", "").replace("Sandman Morpheus|Сон|морфеус", "Dream|Морфеус|песочный человек dc"),
    "Spider-Man/Человек паук/Iron Man/Железный человек/Thor/Тор/Hulk/Халк/Thanos/Танос/Captain America/Капитан Америка/Deadpool/Дэдпул/Wolverine/Росомаха/Loki/Локи/Black Widow/Чёрная вдова/Shrek/Шрек/Homelander/Хоумлендер")

cat("fictional_villains", "KNOWLEDGE", "movies_tv", "Name a fictional villain", "Назовите вымышленного злодея",
    "A villain from fiction: books, films, cartoons, games or fairy tales (Darth Vader, Joker, Voldemort, Thanos, Sauron, Hannibal Lecter, Scar, Ursula, Maleficent, Jafar, Koschei the Deathless, Baba Yaga, Bowser, Freddy Krueger, Loki, Lex Luthor, Cruella de Vil, Captain Hook, Gru early, Shere Khan, Agent Smith, Green Goblin, Magneto, Palpatine, Saruman, Moriarty, Dracula, Barmaley, Karabas-Barabas, Shapoklyak).",
    "Злодей из книг, фильмов, мультфильмов, игр или сказок: Дарт Вейдер, Джокер, Волан де Морт, Танос, Саурон, Ганнибал Лектер, Шрам, Урсула, Малефисента, Джафар, Кощей Бессмертный, Баба Яга, Боузер, Фредди Крюгер, Локи, Лекс Лютор, Круэлла, Капитан Крюк, Шерхан, Агент Смит, Зелёный гоблин, Магнето, Палпатин, Саруман, Мориарти, Дракула, Бармалей, Карабас Барабас, Шапокляк.",
    """Darth Vader|Дарт Вейдер
Joker|Джокер
Voldemort|Волан де Морт|воландеморт
Thanos|Танос
Sauron|Саурон
Hannibal Lecter|Ганнибал Лектер
Scar|Шрам
Ursula|Урсула
Maleficent|Малефисента
Jafar|Джафар
Koschei the Deathless|Кощей Бессмертный|кощей
Baba Yaga|Баба Яга
Bowser|Боузер
Freddy Krueger|Фредди Крюгер
Loki|Локи
Lex Luthor|Лекс Лютор
Cruella de Vil|Круэлла
Captain Hook|Капитан Крюк
Shere Khan|Шерхан
Agent Smith|Агент Смит
Green Goblin|Зелёный гоблин
Magneto|Магнето
Palpatine|Палпатин|император
Saruman|Саруман
Moriarty|Мориарти
Dracula|Дракула
Barmaley|Бармалей
Karabas-Barabas|Карабас Барабас
Shapoklyak|Шапокляк
Snow Queen|Снежная королева
Gollum|Голлум
Bellatrix|Беллатриса
Dolores Umbridge|Долорес Амбридж
Draco Malfoy|Драко Малфой
Hades|Аид
Gaston|Гастон
Frollo|Фролло
Mother Gothel|Мать Готель
Hans|Ганс
Lord Farquaad|Лорд Фаркуад
Tai Lung|Тай Лунг
Syndrome|Синдром
Kylo Ren|Кайло Рен
Pennywise|Пеннивайз
Jason Voorhees|Джейсон Вурхиз
Michael Myers|Майкл Майерс
Chucky|Чаки
Ghostface|Призрачное лицо
Jigsaw|Конструктор|пила
T-1000|Т 1000
Hans Gruber|Ганс Грубер
Anton Chigurh|Антон Чигур
Norman Bates|Норман Бейтс
Bane|Бэйн
Ultron|Альтрон
Red Skull|Красный Череп
Doctor Doom|Доктор Дум
Venom|Веном
Kingpin|Кингпин
Ganon|Ганон
Sephiroth|Сефирот
GLaDOS|ГЛаДОС
Wolf|Волк из Ну погоди|волк
Zmey Gorynych|Змей Горыныч
Solovey the Robber|Соловей Разбойник
Chernomor|Черномор
Duremar|Дуремар
Fox Alice|Лиса Алиса
Basilio|Кот Базилио
Old Lady Shapoklyak|Старуха Шапокляк
Kaa|Каа
Gargamel|Гаргамель
Plankton|Планктон
Doctor Evil|Доктор Зло
Megatron|Мегатрон
Grinch|Гринч
Cersei Lannister|Серсея Ланнистер
Joffrey|Джоффри
Night King|Король ночи
Homelander|Хоумлендер
Walter White|Уолтер Уайт|хайзенберг
Professor Moriarty|Профессор Мориарти
Lord Business|Лорд Бизнес
Shan Yu|Шань Юй
Davy Jones|Дейви Джонс
Barbossa|Барбосса
Agent Smith2|Мистер Смит""".replace("\nAgent Smith2|Мистер Смит", "").replace("\nOld Lady Shapoklyak|Старуха Шапокляк", ""),
    "Batman/Бэтмен/Superman/Супермен/Harry Potter/Гарри Поттер/Spider-Man/Человек паук/Luke Skywalker/Люк Скайуокер/Gandalf/Гэндальф/Simba/Симба/Shrek/Шрек/Cinderella/Золушка/Cheburashka/Чебурашка/Winnie the Pooh/Винни Пух/Mario/Марио/Hitler/Гитлер/Napoleon/Наполеон")

cat("suited_superheroes", "KNOWLEDGE", "movies_tv", "Name a superhero who uses a special suit or armour", "Назовите супергероя, использующего костюм или броню",
    "A superhero who relies on a special suit, armour or high-tech costume (Iron Man, Batman, Ant-Man, Wasp, War Machine, Black Panther, Spider-Man with Stark suit, Blue Beetle, Cyborg, Iron Heart, Rescue, Falcon wings, Nite Owl, Robocop, Star-Lord, Mandalorian, Steel, Booster Gold, Green Lantern ring suit, Major Grom? no, Batwoman, Iron Patriot).",
    "Супергерой, который использует особый костюм, броню или технологичный костюм: Железный человек, Бэтмен, Человек муравей, Оса, Воитель, Чёрная пантера, Человек паук, Синий жук, Киборг, Железное сердце, Спасительница, Сокол, Ночная сова, Робокоп, Звёздный Лорд, Мандалорец, Сталь, Бустер Голд, Зелёный фонарь, Бэтвумен, Железный патриот.",
    """Iron Man|Железный человек|тони старк
Batman|Бэтмен
Ant-Man|Человек муравей
Wasp|Оса
War Machine|Воитель
Black Panther|Чёрная пантера
Spider-Man|Человек паук
Blue Beetle|Синий Жук
Cyborg|Киборг
Ironheart|Железное сердце
Rescue|Спасительница|пеппер поттс
Falcon|Сокол
Nite Owl|Ночная сова
RoboCop|Робокоп
Star-Lord|Звёздный Лорд
Mandalorian|Мандалорец|мандо
Steel|Сталь
Booster Gold|Бустер Голд
Green Lantern|Зелёный Фонарь
Batwoman|Бэтвумен
Iron Patriot|Железный патриот
Captain America|Капитан Америка
Batgirl|Бэтгёрл
Nightwing|Найтвинг
Robin|Робин
Red Hood|Красный колпак
Iron Spider|Железный паук
Silk Spectre|Шёлковая тень
Atom|Атом
Mysterio|Мистерио
Kick-Ass|Пипец
Daredevil|Сорвиголова
Rocketeer|Ракетчик
Ozymandias|Озимандия
Vulture|Стервятник
Stargirl|Старгёрл
Hawkman|Человек ястреб
Moon Knight|Лунный рыцарь
Jaime Reyes|Хайме Рейес
Ultraman|Ультрамэн
Power Rangers|Могучие рейнджеры
Megamind|Мегамозг
Mr. Incredible|Мистер Исключительный
Frozone|Холодюн
Elastigirl|Эластика
Major Grom|Майор Гром
Guardian|Защитник""".replace("\nMajor Grom|Майор Гром", ""),
    "Hulk/Халк/Superman/Супермен/Thor/Тор/Wolverine/Росомаха/Flash/Флэш/Scarlet Witch/Алая ведьма/Doctor Strange/Доктор Стрэндж/Storm/Шторм/Shazam/Шазам/Groot/Грут/Shrek/Шрек/Harry Potter/Гарри Поттер")

cat("super_strength_characters", "KNOWLEDGE", "movies_tv", "Name a fictional character with superhuman strength", "Назовите вымышленного персонажа со сверхчеловеческой силой",
    "A fictional character who has superhuman strength (Superman, Hulk, Thor, Wonder Woman, She-Hulk, Captain Marvel, Thing, Shazam, Hercules, Obelix, Pippi Longstocking, Ilya Muromets, Samson, Popeye with spinach, Mr. Incredible, Saitama, Goku, Luke Cage, Colossus, Juggernaut, Homelander, Doomsday, Kratos, Invincible, Bane with venom).",
    "Вымышленный персонаж со сверхчеловеческой силой: Супермен, Халк, Тор, Чудо женщина, Женщина Халк, Капитан Марвел, Существо, Шазам, Геракл, Обеликс, Пеппи Длинныйчулок, Илья Муромец, Самсон, Моряк Попай, Мистер Исключительный, Сайтама, Гоку, Люк Кейдж, Колосс, Джаггернаут, Хоумлендер, Думсдэй, Кратос, Неуязвимый.",
    """Superman|Супермен
Hulk|Халк
Thor|Тор
Wonder Woman|Чудо женщина
She-Hulk|Женщина Халк
Captain Marvel|Капитан Марвел
The Thing|Существо
Shazam|Шазам
Hercules|Геракл|геркулес
Obelix|Обеликс
Pippi Longstocking|Пеппи Длинныйчулок
Ilya Muromets|Илья Муромец
Samson|Самсон
Popeye|Моряк Попай|попай
Mr. Incredible|Мистер Исключительный
Saitama|Сайтама|ванпанчмен
Goku|Гоку
Luke Cage|Люк Кейдж
Colossus|Колосс
Juggernaut|Джаггернаут
Homelander|Хоумлендер
Doomsday|Дуумсдэй
Kratos|Кратос
Invincible|Неуязвимый
Bane|Бэйн
Supergirl|Супергёрл
Captain America|Капитан Америка
Black Adam|Чёрный Адам
Omni-Man|Омни мэн
Gamora|Гамора
Drax|Дракс
Thanos|Танос
Darkseid|Дарксайд
Aquaman|Аквамен
Wolverine|Росомаха
Spider-Man|Человек паук
Groot|Грут
Abomination|Мерзость
Rhino|Носорог
Hellboy|Хеллбой
Dobrynya Nikitich|Добрыня Никитич
Alyosha Popovich|Алёша Попович
Svyatogor|Святогор
Shrek|Шрек
Gaston|Гастон
Maui|Мауи
Asterix|Астерикс
Mighty Mouse|Могучий мышонок
Atlas|Атлант
Paul Bunyan|Пол Баньян
Eleven|Оди|eleven
All Might|Всемогущий
Hancock|Хэнкок
Megamind's Metro Man|Метро мэн
Ultraman|Ультрамэн
Ben Grimm|Бен Гримм
Steel|Сталь
Power Girl|Пауэр гёрл
Machine Man|Человек машина
Sentry|Часовой
Hyperion|Гиперион
Sasquatch|Сасквоч
Ichigo|Ичиго
Saitama2|Сайтама2
Popeye2|Попай2""".replace("\nSaitama2|Сайтама2", "").replace("\nPopeye2|Попай2", "").replace("\nEleven|Оди|eleven", ""),
    "Batman/Бэтмен/Iron Man/Железный человек/Harry Potter/Гарри Поттер/Sherlock Holmes/Шерлок Холмс/Hawkeye/Соколиный глаз/Black Widow/Чёрная вдова/Gandalf/Гэндальф/Cheburashka/Чебурашка/Pinocchio/Буратино/Winnie the Pooh/Винни Пух/Robin/Робин/Doctor Strange/Доктор Стрэндж")

# ---------- 10. Packaging ----------
cat("bottled_products", "SEMANTIC", "food", "Name a product usually sold in a bottle", "Назовите продукт, который обычно продают в бутылке",
    "A product typically sold in a bottle (water, soda, juice, milk, beer, wine, vodka, oil, vinegar, ketchup, soy sauce, shampoo, shower gel, perfume, kefir, syrup, lemonade, kvass, energy drink, cola, olive oil, sauces, medicine syrup, nail polish, whiskey, champagne).",
    "Продукт, который обычно продают в бутылке: вода, газировка, сок, молоко, пиво, вино, водка, растительное масло, уксус, кетчуп, соевый соус, шампунь, гель для душа, духи, кефир, сироп, лимонад, квас, энергетик, кола, оливковое масло, соусы, микстура, лак для ногтей, виски, шампанское.",
    """Water|Вода|минералка/минеральная вода
Soda|Газировка|газированная вода
Juice|Сок
Milk|Молоко
Beer|Пиво
Wine|Вино
Vodka|Водка
Vegetable oil|Растительное масло|подсолнечное масло/масло
Vinegar|Уксус
Ketchup|Кетчуп
Soy sauce|Соевый соус
Shampoo|Шампунь
Shower gel|Гель для душа
Perfume|Духи|парфюм
Kefir|Кефир
Syrup|Сироп
Lemonade|Лимонад
Kvass|Квас
Energy drink|Энергетик
Cola|Кола|кока кола/пепси
Olive oil|Оливковое масло
Sauce|Соус
Cough syrup|Микстура|сироп от кашля
Nail polish|Лак для ногтей
Whiskey|Виски
Champagne|Шампанское
Cognac|Коньяк
Ayran|Айран
Iced tea|Холодный чай
Yogurt drink|Питьевой йогурт
Bleach|Отбеливатель
Dish soap|Средство для мытья посуды
Mouthwash|Ополаскиватель
Hand sanitizer|Антисептик
Liquid soap|Жидкое мыло
Rum|Ром
Gin|Джин
Tequila|Текила
Cider|Сидр
Tonic|Тоник
Balsam|Бальзам
Mustard|Горчица
Mayonnaise|Майонез
Honey|Мёд в бутылке
Ink|Чернила
Hydrogen peroxide|Перекись водорода
Iodine|Йод
Brilliant green|Зелёнка
Antifreeze|Антифриз
Motor oil|Моторное масло
Smoothie|Смузи""",
    "Bread/Хлеб/Eggs/Яйца/Cheese/Сыр/Butter/Масло сливочное/Sausage/Колбаса/Apple/Яблоко/Rice/Рис/Pasta/Макароны/Chocolate bar/Шоколадка/Cookies/Печенье/Toilet paper/Туалетная бумага/Salt/Соль")

cat("rolled_goods", "SEMANTIC", "everyday", "Name goods usually sold in a roll", "Назовите товар, который обычно продают в рулоне",
    "Goods usually sold rolled up (toilet paper, paper towels, cling film, foil, baking paper, wallpaper, linoleum, carpet, tape, duct tape, bandage, garbage bags, fabric, film, turf, wrapping paper, oilcloth, roofing felt, cable, rope on spool, stickers, receipt paper, electrical tape, mesh).",
    "Товар, который обычно продают в рулоне: туалетная бумага, бумажные полотенца, пищевая плёнка, фольга, пергамент, обои, линолеум, ковролин, скотч, бинт, мешки для мусора, ткань, рулонный газон, упаковочная бумага, клеёнка, рубероид, кабель, наклейки, кассовая лента, изолента, сетка.",
    """Toilet paper|Туалетная бумага
Paper towels|Бумажные полотенца
Cling film|Пищевая плёнка|плёнка
Foil|Фольга
Baking paper|Пергамент|бумага для выпечки
Wallpaper|Обои
Linoleum|Линолеум
Carpet|Ковролин|ковёр
Tape|Скотч
Duct tape|Армированный скотч
Bandage|Бинт
Garbage bags|Мешки для мусора|пакеты для мусора
Fabric|Ткань
Turf|Рулонный газон|газон
Wrapping paper|Упаковочная бумага
Oilcloth|Клеёнка
Roofing felt|Рубероид
Cable|Кабель|провод
Stickers|Наклейки
Receipt paper|Кассовая лента|чековая лента
Electrical tape|Изолента
Mesh|Сетка|сетка рабица
Bubble wrap|Пупырчатая плёнка
Plaster|Пластырь|лейкопластырь
Film|Фотоплёнка
Masking tape|Малярный скотч
Insulation|Утеплитель|минвата
Waterproofing|Гидроизоляция
Packing paper|Крафт бумага
Self-adhesive film|Самоклейка
Window film|Тонировка|плёнка для окон
Ribbon|Лента
Paper|Бумага рулонная
Plastic bags|Пакеты фасовочные
Sushi nori|Нори
Lavash|Лаваш
Thread|Нитки
Wire|Проволока
Rope|Верёвка
Banknote|Купюры
Kitchen towels|Кухонные полотенца
Poster|Плакат
Canvas|Холст
Yoga mat|Коврик
Vinyl|Винил""",
    "Bread/Хлеб/Phone/Телефон/Milk/Молоко/Brick/Кирпич/Glass/Стекло/Apple/Яблоко/Eggs/Яйца/Shoes/Обувь/Book/Книга/Cup/Чашка/Chair/Стул/Bottle/Бутылка")

cat("cardboard_box_products", "SEMANTIC", "food", "Name a product sold in a cardboard pack", "Назовите продукт, который продаётся в картонной пачке",
    "A product typically sold in a cardboard box or carton (milk, juice, cereal, tea, pasta some, butter some, cigarettes, matches, crackers, cookies, salt, sugar cubes, washing powder, cottage cheese, kefir, cocoa, oatmeal, rice in boxes, pizza box, eggs carton, toothpaste box, medicine).",
    "Продукт, который обычно продают в картонной пачке или упаковке: молоко, сок, сухой завтрак, хлопья, чай, макароны, масло, сигареты, спички, крекеры, печенье, соль, сахар рафинад, стиральный порошок, творог, кефир, какао, овсянка, рис, пицца, яйца, зубная паста, лекарства.",
    """Milk|Молоко
Juice|Сок
Cereal|Хлопья|сухой завтрак/кукурузные хлопья/мюсли
Tea|Чай
Pasta|Макароны
Butter|Масло|сливочное масло
Cigarettes|Сигареты
Matches|Спички
Crackers|Крекеры
Cookies|Печенье
Salt|Соль
Sugar cubes|Сахар рафинад|рафинад/сахар
Washing powder|Стиральный порошок|порошок
Cottage cheese|Творог
Kefir|Кефир
Cocoa|Какао
Oatmeal|Овсянка|геркулес
Rice|Рис
Pizza|Пицца
Eggs|Яйца
Toothpaste|Зубная паста
Medicine|Лекарства|таблетки
Cream|Сливки
Ryazhenka|Ряженка
Chocolates box|Конфеты в коробке|конфеты
Soda|Пищевая сода|сода
Starch|Крахмал
Semolina|Манка
Buckwheat|Гречка
Flour|Мука
Baking powder|Разрыхлитель
Gelatin|Желатин
Pudding mix|Пудинг
Jelly|Желе в порошке|кисель
Instant noodles|Лапша быстрого приготовления|доширак
Coffee|Кофе
Ice cream|Мороженое в коробке
Cake|Торт
Biscuits|Галеты
Nuggets frozen|Наггетсы
Wine box|Вино в коробке
Tissues|Салфетки
Dishwasher tablets|Таблетки для посудомойки
Tampons|Тампоны
Perfume|Духи""",
    "Bread/Хлеб/Apple/Яблоко/Watermelon/Арбуз/Fish/Рыба/Meat/Мясо/Potatoes/Картошка/Water bottle/Вода в бутылке/Beer can/Пиво в банке/Honey jar/Мёд/Ketchup/Кетчуп/Sausage/Колбаса/Cheese/Сыр")

cat("aerosol_products", "SEMANTIC", "everyday", "Name a product sold in an aerosol can", "Назовите товар, который продаётся в аэрозольном баллончике",
    "A product usually sold in an aerosol / spray can (deodorant, hairspray, shaving foam, spray paint, air freshener, insect repellent, whipped cream, dry shampoo, sunscreen spray, cooking spray, WD-40, polish, mousse, fire extinguisher small, pepper spray, antistatic, oven cleaner, glass cleaner foam, compressed air duster, mounting foam).",
    "Товар, который обычно продают в аэрозольном баллончике: дезодорант, лак для волос, пена для бритья, краска в баллончике, освежитель воздуха, средство от комаров, взбитые сливки, сухой шампунь, солнцезащитный спрей, масло спрей, WD 40, полироль, мусс для волос, перцовый баллончик, антистатик, средство для духовки, сжатый воздух, монтажная пена.",
    """Deodorant|Дезодорант
Hairspray|Лак для волос|лак
Shaving foam|Пена для бритья
Spray paint|Краска в баллончике|баллончик/граффити
Air freshener|Освежитель воздуха|освежитель
Insect repellent|Средство от комаров|репеллент/дихлофос/раптор
Whipped cream|Взбитые сливки|сливки
Dry shampoo|Сухой шампунь
Sunscreen spray|Солнцезащитный спрей
Cooking spray|Масло спрей
WD-40|WD 40|вэдэшка
Furniture polish|Полироль
Hair mousse|Мусс для волос
Pepper spray|Перцовый баллончик
Antistatic|Антистатик
Oven cleaner|Средство для духовки
Compressed air|Сжатый воздух
Mounting foam|Монтажная пена|пена
Body spray|Спрей для тела
Perfume spray|Духи спрей
Car polish|Автополироль
Silicone grease|Силиконовая смазка
Shoe spray|Спрей для обуви|пропитка
Antiperspirant|Антиперспирант
Throat spray|Спрей для горла
Nasal spray|Спрей для носа
Inhaler|Ингалятор
Glitter spray|Блёстки спрей
Fake snow|Искусственный снег
Silly string|Серпантин спрей
Fire extinguisher|Огнетушитель
Lighter gas|Газ для зажигалки
Starch spray|Крахмал спрей
Carpet cleaner|Пятновыводитель
Panthenol|Пантенол
Primer spray|Грунтовка в баллончике
Lubricant|Смазка
Glass cleaner|Средство для стёкол""",
    "Toothpaste/Зубная паста/Shampoo/Шампунь/Soap/Мыло/Milk/Молоко/Bread/Хлеб/Ketchup/Кетчуп/Water/Вода/Juice/Сок/Lipstick/Помада/Pencil/Карандаш/Nail polish/Лак для ногтей/Cream/Крем")

cat("glass_jar_products", "SEMANTIC", "food", "Name a product sold in a glass jar", "Назовите продукт, который продаётся в стеклянной банке",
    "A food product typically sold in a glass jar (jam, honey, pickles, olives, baby food, mayonnaise, mustard, instant coffee, caviar, tomato sauce, pesto, peanut butter, Nutella, sauerkraut, mushrooms marinated, adjika, lecho, horseradish, capers, applesauce, compote, tomato paste, salsa).",
    "Продукт, который обычно продают в стеклянной банке: варенье, джем, мёд, солёные огурцы, оливки, детское питание, майонез, горчица, растворимый кофе, икра, томатный соус, песто, арахисовая паста, нутелла, квашеная капуста, маринованные грибы, аджика, лечо, хрен, каперсы, компот, кабачковая икра.",
    """Jam|Варенье|джем/конфитюр/повидло
Honey|Мёд
Pickles|Солёные огурцы|маринованные огурцы/огурцы/огурчики
Olives|Оливки|маслины
Baby food|Детское питание|пюре
Mayonnaise|Майонез
Mustard|Горчица
Instant coffee|Растворимый кофе|кофе
Caviar|Икра
Tomato sauce|Томатный соус
Pesto|Песто
Peanut butter|Арахисовая паста
Nutella|Нутелла
Sauerkraut|Квашеная капуста
Marinated mushrooms|Маринованные грибы|грибы
Adjika|Аджика
Lecho|Лечо
Horseradish|Хрен
Capers|Каперсы
Applesauce|Яблочное пюре
Compote|Компот
Squash caviar|Кабачковая икра
Tomatoes|Помидоры маринованные|помидоры
Salsa|Сальса
Pickled peppers|Маринованный перец
Beans|Фасоль в банке
Corn|Кукуруза
Peas|Горошек
Pâté|Паштет
Herring|Селёдка в банке
Sour cream|Сметана
Yogurt|Йогурт в стекле
Kimchi|Кимчи
Chutney|Чатни
Jelly|Желе
Condensed milk|Сгущёнка
Tahini|Тахини
Ajvar|Айвар
Eggplant caviar|Баклажанная икра
Garlic|Маринованный чеснок
Cherries|Вишня в сиропе
Pineapple|Ананасы
Peaches|Персики
Sprouts|Ростки
Baby puree|Фруктовое пюре
Spices|Специи
Pickled onions|Маринованный лук
Ghee|Топлёное масло
Coconut oil|Кокосовое масло""",
    "Bread/Хлеб/Milk carton/Молоко в пакете/Chips/Чипсы/Cereal/Хлопья/Sausage/Колбаса/Eggs/Яйца/Ice cream/Мороженое/Cookies/Печенье/Cola can/Кола в банке/Tea bags/Чай в пакетиках/Rice/Рис/Pasta/Макароны")
