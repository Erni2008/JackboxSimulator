# THINK OR DIE category content, part I (list 2, sections 31-40).
from cats_a import cat

def pair(id, type, group, title_en, title_ru, crit_en, crit_ru, rule_ru, rule_en, ru_lines, en_lines, inv_ru, inv_en):
    """A letter-rule category in two language versions (letters are counted per language)."""
    cat(id + "_ru", type, group, title_en[0], title_ru, "", crit_ru, ru_lines, inv_ru, langs=["ru"], rule=dict(rule_ru, lang="ru"), allowUnknown=True)
    cat(id + "_en", type, group, title_en[1], title_en[1], crit_en, "", en_lines, inv_en, langs=["en"], rule=dict(rule_en, lang="en"), allowUnknown=True)

# ---------- 31. Unusual limits ----------
pair("vegetable_letter_k", "KNOWLEDGE", "food",
     ("Name a vegetable starting with «К»", "Name a vegetable starting with “C”"), "Назовите овощ, название которого начинается на «К»",
     "A vegetable whose English name starts with C (carrot, cabbage, cucumber, celery, cauliflower, corn, courgette, chili, chard, chickpea, collard greens, cassava, chicory).",
     "Овощ, русское название которого начинается на К: картофель, капуста, кабачок, морковь (нет), кукуруза, корнишон, кольраби, кинза, редис (нет), крапива нет.",
     {"kind": "STARTS_WITH", "value": "к"}, {"kind": "STARTS_WITH", "value": "c"},
     "Potato|Картофель|картошка\nCabbage|Капуста\nZucchini|Кабачок\nCorn|Кукуруза\nGherkin|Корнишон\nKohlrabi|Кольраби\nCauliflower|Цветная капуста кв|капуста цветная\nKale|Кале|капуста кале\nCelery root|Корень сельдерея\nSweet potato|Картофель батат\nBrussels sprouts|Капуста брюссельская\nBroccoli|Капуста брокколи\nCress|Кресс салат|кресс\nCoriander|Кинза\nCapers|Каперсы\nArtichoke|Кардон|кардон\nKatran|Катран\nCassava|Кассава|маниок\nKimchi cabbage|Капуста пекинская\nRutabaga|Кормовая свёкла\nChayote|Кивано\nBean pods|Кукурузные початки",
     "Carrot\nCabbage\nCucumber\nCelery\nCauliflower\nCorn\nCourgette\nChili|Chili pepper/Chilli\nChard|Swiss chard\nChickpea|Chickpeas\nCollard greens|Collards\nCassava\nChicory\nCapsicum\nCeleriac\nChives\nChayote\nCress\nCorn on the cob\nCherry tomato",
     "Морковь/Помидор/Огурец/Свёкла/Лук/Чеснок/Редис/Перец/Баклажан/Тыква/Кот/Кошка/Камень",
     "Potato/Tomato/Onion/Garlic/Pepper/Eggplant/Pumpkin/Beet/Radish/Lettuce/Kale/Cat/Car")

pair("animal_ending_a", "KNOWLEDGE", "animals",
     ("Name an animal whose name ends in «А»", "Name an animal whose name ends in “A”"), "Назовите животное, название которого заканчивается на «А»",
     "An animal whose English name ends with the letter A (zebra, panda, cobra, gorilla, hyena, llama, alpaca, koala, puma, orca, tuna, iguana, anaconda, piranha, chinchilla, impala, gazelle no).",
     "Животное, русское название которого заканчивается на А: собака, корова, лиса, коза, овца, рыба, птица, змея (нет, я), зебра, панда, кобра, горилла, белка, жаба, акула, щука, сова, ворона, утка.",
     {"kind": "ENDS_WITH", "value": "а"}, {"kind": "ENDS_WITH", "value": "a"},
     "Dog|Собака\nCow|Корова\nFox|Лиса\nGoat|Коза\nSheep|Овца\nFish|Рыба\nZebra|Зебра\nPanda|Панда\nCobra|Кобра\nGorilla|Горилла\nSquirrel|Белка\nToad|Жаба\nShark|Акула\nPike|Щука\nOwl|Сова\nCrow|Ворона\nDuck|Утка\nMouse|Мышка\nHyena|Гиена\nLlama|Лама\nAlpaca|Альпака\nKoala|Коала\nPuma|Пума\nOrca|Косатка\nMoose|Лосиха\nHorse|Лошадка\nFrog|Лягушка\nTurtle|Черепаха\nBear cub|Медведица\nHare|Зайчиха\nMagpie|Сорока\nGiraffe|Жирафа\nMarten|Куница\nWeasel|Ласка\nOtter|Выдра\nBat|Летучая мышь\nFly|Муха\nBee|Пчела\nWasp|Оса\nSalmon|Сёмга\nCarp|Плотва\nHerring|Селёдка\nPerch|Камбала\nAnaconda|Анаконда\nPiranha|Пиранья\nChinchilla|Шиншилла\nGazelle|Газель лань\nOstrich|Страусиха\nTiger|Тигрица\nLion|Львица\nWolf|Волчица\nHen|Курица\nTit|Синица\nCrane|Цапля\nSwallow|Ласточка\nEagle owl|Сипуха\nViper|Гадюка\nBeaver|Выхухоль\nPolecat|Росомаха\nMole rat|Мартышка\nJellyfish|Медуза\nSquid|Каракатица\nStarfish|Морская звезда\nBison|Антилопа\nLynx|Пантера\nJaguar|Мурена\nBadger|Ехидна",
     "Zebra\nPanda\nCobra\nGorilla\nHyena\nLlama\nAlpaca\nKoala\nPuma\nOrca\nTuna\nIguana\nAnaconda\nPiranha\nChinchilla\nImpala\nBarracuda\nCicada\nAmoeba\nManta\nChihuahua\nVicuna\nPeccary\nTarantula\nMoray|\nCapybara\nAnteater\nKoala bear\nCougar\nOkapi\nPiranha fish\nGerenuk\nTilapia\nSepia\nBeluga\nOrangutan\nMarmota\nCoati\nCivet\nGenet\nEchidna\nChameleon\nTapir\nHydra\nCorvina",
     "Кот/Слон/Волк/Медведь/Тигр/Лев/Конь/Ёж/Змея/Свинья/Курица2/Жираф/Петух",
     "Cat/Dog/Lion/Tiger/Horse/Bear/Wolf/Elephant/Fox/Rabbit/Mouse/Cow")

pair("profession_letter_r", "KNOWLEDGE", "professions",
     ("Name a profession containing the letter «Р»", "Name a profession containing the letter “R”"), "Назовите профессию, в названии которой есть буква «Р»",
     "A real profession whose English name contains the letter R (doctor, teacher, driver, lawyer, farmer, writer, programmer, barber, nurse, actor, firefighter, pilot no).",
     "Настоящая профессия, в русском названии которой есть буква Р: врач, программист, повар, парикмахер, архитектор, директор, режиссёр, актёр, фермер, юрист, бармен, официант (нет), водитель (нет).",
     {"kind": "CONTAINS", "value": "р"}, {"kind": "CONTAINS", "value": "r"},
     "Doctor|Врач\nProgrammer|Программист\nCook|Повар\nHairdresser|Парикмахер\nArchitect|Архитектор\nDirector|Директор\nFilm director|Режиссёр\nActor|Актёр\nFarmer|Фермер\nLawyer|Юрист\nBartender|Бармен\nSurgeon|Хирург\nPrinter|Печатник\nTranslator|Переводчик\nEngineer|Инженер\nWriter|Писатель\nArtist|Художник|артист\nGuard|Охранник\nBuilder|Строитель\nSailor|Моряк|матрос\nPrince|Курьер\nSeller|Продавец\nAccountant|Бухгалтер\nPoliceman|Полицейский\nFirefighter|Пожарный\nMiner|Шахтёр\nPilot|Лётчик пилот\nWorker|Рабочий\nDentist|Стоматолог\nVet|Ветеринар\nFlorist|Флорист\nCarpenter|Столяр|плотник\nTractor driver|Тракторист\nGardener|Садовник\nManager|Менеджер\nDesigner|Дизайнер\nReporter|Репортёр|журналист\nPhotographer|Фотограф\nMarketer|Маркетолог\nTherapist|Терапевт\nPsychiatrist|Психиатр\nOrthodontist|Ортодонт\nProfessor|Профессор\nTrainer|Тренер\nBroker|Брокер\nRealtor|Риелтор\nProducer|Продюсер\nCourier|Курьер доставщик\nMechanic|Автослесарь\nCashier|Кассир\nWaiter|Официантка\nPlumber|Сантехник\nPriest|Священник\nAstronaut|Космонавт\nSecretary|Секретарь\nAuditor|Аудитор\nInspector|Инспектор\nBarista|Бариста\nGuide|Экскурсовод\nPharmacist|Фармацевт\nPainter|Маляр\nTailor|Портной\nShepherd|Пастух\nBaker|Пекарь\nButcher|Мясник\nJeweler|Ювелир\nLibrarian|Библиотекарь\nArcheologist|Археолог\nGeologist|Геолог\nRobot engineer|Робототехник\nDispatcher|Диспетчер\nOperator|Оператор\nEditor|Редактор\nCorrespondent|Корреспондент\nSculptor|Скульптор",
     "Doctor\nTeacher\nDriver\nLawyer\nFarmer\nWriter\nProgrammer\nBarber\nNurse\nActor\nFirefighter\nEngineer\nArchitect\nDirector\nReporter\nCarpenter\nPlumber\nBaker|\nPainter\nSurgeon\nPharmacist\nWaiter\nGardener\nTrainer|Coach\nDesigner\nPhotographer\nProfessor\nPriest\nSecretary\nCashier\nManager\nBartender\nBricklayer\nElectrician\nAstronaut\nSoldier\nSailor\nTailor\nButcher\nJeweler\nLibrarian\nTranslator\nSinger\nDancer\nMusician\nResearcher\nBroker\nRealtor\nAuditor\nEditor\nCourier\nCleaner\nPorter\nMiner\nRanger",
     "Пилот/Учитель/Водитель/Певец/Электрик/Космонавт2/Повар2/Кот/Дом/Стол",
     "Pilot/Chef/Judge/Cook/Vet/Coach/Mason/Nanny/Maid/Cat/Dog/Table")

pair("countries_ending_ia", "GEOGRAPHY", "geography",
     ("Name a country whose name ends in «ия»", "Name a country whose name ends in “ia”"), "Назовите страну, название которой заканчивается на «ия»",
     "A sovereign country whose usual English name ends in -ia (Russia, Australia, India, Austria, Bulgaria, Croatia, Colombia, Ethiopia, Indonesia, Malaysia, Nigeria, Romania, Saudi Arabia, Serbia, Slovakia, Slovenia, Tunisia, Zambia, Mongolia, Latvia, Lithuania, Estonia, Georgia, Armenia, Algeria, Bolivia, Cambodia, Gambia, Liberia, Libya no).",
     "Государство, русское название которого заканчивается на ия: Россия, Германия, Франция, Италия, Испания, Англия (не государство), Австрия, Австралия, Индия, Бельгия, Швеция, Швейцария, Норвегия, Финляндия, Польша (нет), Греция, Турция, Сербия, Хорватия, Болгария, Румыния, Чехия, Словакия, Словения, Эстония, Латвия, Литва (нет), Грузия, Армения, Монголия, Индонезия, Малайзия, Колумбия, Боливия, Нигерия, Эфиопия, Сирия.",
     {"kind": "ENDS_WITH", "value": "ия"}, {"kind": "ENDS_WITH", "value": "ia"},
     "Russia|Россия\nGermany|Германия\nFrance|Франция\nItaly|Италия\nSpain|Испания\nAustria|Австрия\nAustralia|Австралия\nIndia|Индия\nBelgium|Бельгия\nSweden|Швеция\nSwitzerland|Швейцария\nNorway|Норвегия\nFinland|Финляндия\nGreece|Греция\nTurkey|Турция\nSerbia|Сербия\nCroatia|Хорватия\nBulgaria|Болгария\nRomania|Румыния\nCzechia|Чехия\nSlovakia|Словакия\nSlovenia|Словения\nEstonia|Эстония\nLatvia|Латвия\nGeorgia|Грузия\nArmenia|Армения\nMongolia|Монголия\nIndonesia|Индонезия\nMalaysia|Малайзия\nColombia|Колумбия\nBolivia|Боливия\nNigeria|Нигерия\nEthiopia|Эфиопия\nSyria|Сирия\nLibya|Ливия\nTunisia|Тунис2\nAlbania|Албания\nNorth Macedonia|Северная Македония\nIceland|Исландия\nIreland|Ирландия\nPortugal|Португалия\nGreat Britain|Великобритания\nNetherlands|Нидерланды2\nDenmark|Дания\nHungary|Венгрия\nSaudi Arabia|Саудовская Аравия\nJordan|Иордания\nMauritania|Мавритания\nTanzania|Танзания\nNamibia|Намибия\nZambia|Замбия\nGambia|Гамбия\nLiberia|Либерия\nSomalia|Сомали2\nKenya|Кения\nMalaysia2|Малайзия2\nCambodia|Камбоджа2\nNew Zealand|Новая Зеландия\nBosnia|Босния и Герцеговина2\nThailand|Таиланд2\nChina|Китай2",
     "Russia\nAustralia\nIndia\nAustria\nBulgaria\nCroatia\nColombia\nEthiopia\nIndonesia\nMalaysia\nNigeria\nRomania\nSaudi Arabia\nSerbia\nSlovakia\nSlovenia\nTunisia\nZambia\nMongolia\nLatvia\nLithuania\nEstonia\nGeorgia\nArmenia\nAlgeria\nBolivia\nCambodia\nGambia\nLiberia\nAlbania\nNamibia\nTanzania\nMauritania\nSomalia\nMicronesia\nMacedonia|North Macedonia\nSaint Lucia\nBosnia",
     "Китай/Япония/Канада/Бразилия/Мексика/Египет/Польша/Украина/Беларусь/Казахстан/Америка/Англия",
     "China/Japan/Canada/Brazil/Mexico/Egypt/Poland/France/Germany/Spain/Italy/Peru/Siberia/Asia/Persia/Prussia/Yugoslavia/Czechoslovakia/Rhodesia/Abyssinia")

pair("fruit_letter_n", "KNOWLEDGE", "food",
     ("Name a fruit or berry containing «Н»", "Name a fruit or berry containing “N”"), "Назовите фрукт или ягоду, в названии которой есть буква «Н»",
     "A fruit or berry whose English name contains the letter N (banana, orange, lemon, melon, mango, pineapple, lime no, cranberry, blackcurrant, nectarine, mandarin, tangerine, persimmon, quince, lingonberry, pomegranate, coconut, watermelon).",
     "Фрукт или ягода, в русском названии которой есть буква Н: банан, лимон, ананас, апельсин, мандарин, манго, нектарин, дыня, вишня, черешня, клубника, малина, смородина, брусника, черника, голубика, клюква (нет), гранат, финик, инжир, лайм (нет), киви (нет).",
     {"kind": "CONTAINS", "value": "н"}, {"kind": "CONTAINS", "value": "n"},
     "Banana|Банан\nLemon|Лимон\nPineapple|Ананас\nOrange|Апельсин\nMandarin|Мандарин\nMango|Манго\nNectarine|Нектарин\nMelon|Дыня\nCherry|Вишня\nSweet cherry|Черешня\nStrawberry|Клубника\nRaspberry|Малина\nCurrant|Смородина\nLingonberry|Брусника\nBlueberry|Черника\nBlueberry2|Голубика\nPomegranate|Гранат\nDate|Финик\nFig|Инжир\nWild strawberry|Земляника\nBlackberry|Ежевика2\nCloudberry|Морошка2\nGrapefruit|Грейпфрут2\nPersimmon|Хурма2\nQuince|Айва2\nGrape|Виноград\nPassion fruit|Маракуйя2\nCoconut|Кокос2\nAvocado|Авокадо2\nRowan|Рябина\nCranberry2|Клюква2\nSea buckthorn|Облепиха2\nPomelo|Помело2\nLychee|Личи2\nPear|Груша2\nPlum|Слива2\nApple|Яблоко2\nWatermelon|Арбуз2\nKiwi|Киви2\nLime|Лайм2\nPeach|Персик2\nApricot|Абрикос2\nRambutan|Рамбутан\nDurian|Дуриан\nPapaya|Папайя2\nCarambola|Карамбола2\nMangosteen|Мангостин\nFeijoa|Фейхоа2\nGuava|Гуава2\nKumquat|Кумкват2\nTangerine|Танжерин\nLongan|Лонган\nBarberry|Барбарис2\nBird cherry|Черёмуха2\nGooseberry|Крыжовник\nHoneysuckle|Жимолость2\nElderberry|Бузина\nRose hip|Шиповник\nViburnum|Калина\nCornel|Кизил2\nDragon fruit|Питахайя2\nOlive|Оливка2\nCantaloupe|Канталупа\nYuzu|Юдзу2\nBergamot|Бергамот2\nCitron|Цитрон",
     "Banana\nOrange\nLemon\nMelon\nMango\nPineapple\nCranberry\nBlackcurrant\nNectarine\nMandarin\nTangerine\nPersimmon\nQuince\nLingonberry\nPomegranate\nCoconut\nWatermelon\nLongan\nRambutan\nDurian\nMangosteen\nLingonberries\nCantaloupe\nRaisin\nPrune\nGreengage\nSaskatoon\nHuckleberry2\nKumquat2\nNance\nMandarin orange\nBlood orange\nHoneydew melon\nJackfruit2\nCitron\nPassion fruit2\nOlive2\nPapaya2\nDate2\nNoni\nGuanabana\nSoursop2\nNaranjilla\nBilberry2\nJuniper berry\nBlueberries2\nBanana passionfruit\nLingonberry jam2",
     "Яблоко/Груша/Слива/Персик/Абрикос/Киви/Лайм/Клюква/Арбуз/Хурма/Морковь/Огурец/Стол",
     "Apple/Pear/Plum/Peach/Apricot/Kiwi/Lime/Cherry/Fig/Grape/Carrot/Cucumber/Table")

# ---------- 32. School ----------
cat("school_subjects", "KNOWLEDGE", "everyday", "Name a school subject", "Назовите школьный предмет",
    "A subject taught at school (maths, algebra, geometry, Russian / English language, literature, history, geography, biology, chemistry, physics, computer science, PE, music, art, foreign language, social studies, technology / labour, astronomy, economics, drawing, life safety OBZh).",
    "Предмет, который изучают в школе: математика, алгебра, геометрия, русский язык, английский, литература, история, география, биология, химия, физика, информатика, физкультура, музыка, ИЗО, обществознание, технология (труд), астрономия, экономика, черчение, ОБЖ.",
    """Mathematics|Математика|maths/math/матеша
Algebra|Алгебра
Geometry|Геометрия
Russian language|Русский язык|русский
English|Английский язык|английский/инглиш
Literature|Литература|литра
History|История
Geography|География
Biology|Биология|биология
Chemistry|Химия
Physics|Физика
Computer science|Информатика|ict/it
Physical education|Физкультура|pe/физра/gym
Music|Музыка
Art|ИЗО|рисование/изобразительное искусство
Foreign language|Иностранный язык
Social studies|Обществознание|общага/обществоведение
Technology|Технология|труд/трудовое обучение
Astronomy|Астрономия
Economics|Экономика
Technical drawing|Черчение
Life safety|ОБЖ|основы безопасности
Natural science|Природоведение|окружающий мир
Reading|Чтение|литературное чтение
Writing|Письмо|чистописание
German|Немецкий язык|немецкий
French|Французский язык|французский
Spanish|Испанский
Chinese|Китайский
Ecology|Экология
Law|Право
Philosophy|Философия
Psychology|Психология
Religious studies|ОРКСЭ|основы религиозных культур
Health|Валеология
Drama|Театр|драма
Statistics|Теория вероятностей|вероятность и статистика
Latin|Латынь
Natural history|Естествознание
Civics|Граждановедение
Robotics|Робототехника
Programming|Программирование
Home economics|Домоводство
World art culture|МХК|мировая художественная культура
Native language|Родной язык
Choir|Хор
Calligraphy|Каллиграфия""",
    "Recess/Перемена/Lunch/Обед/Homework/Домашка/Exam/Экзамен/Teacher/Учитель/Textbook/Учебник/Football/Футбол/Chess/Шахматы/Holidays/Каникулы/Diary/Дневник/Detention/Продлёнка/Cooking/Готовка")

cat("stationery", "KNOWLEDGE", "everyday", "Name an item of stationery", "Назовите канцелярскую принадлежность",
    "An item of stationery or office supplies (pen, pencil, eraser, ruler, notebook, sharpener, scissors, glue, stapler, paper clip, marker, highlighter, pencil case, folder, sticky notes, tape, compass, protractor, correction fluid, calculator, hole punch, push pin, envelope).",
    "Канцелярская принадлежность: ручка, карандаш, ластик, линейка, тетрадь, точилка, ножницы, клей, степлер, скрепка, маркер, текстовыделитель, пенал, папка, стикеры, скотч, циркуль, транспортир, корректор, калькулятор, дырокол, кнопка, конверт.",
    """Pen|Ручка|ballpoint pen/шариковая ручка/гелевая ручка
Pencil|Карандаш
Eraser|Ластик|резинка/стёрка/rubber
Ruler|Линейка
Notebook|Тетрадь|блокнот/exercise book
Sharpener|Точилка
Scissors|Ножницы
Glue|Клей|glue stick/клей карандаш/пва
Stapler|Степлер
Paper clip|Скрепка
Marker|Маркер
Highlighter|Текстовыделитель|выделитель
Pencil case|Пенал
Folder|Папка
Sticky notes|Стикеры|post it/стикер
Tape|Скотч|клейкая лента
Compass|Циркуль
Protractor|Транспортир
Correction fluid|Корректор|штрих/замазка
Calculator|Калькулятор
Hole punch|Дырокол
Push pin|Кнопка|канцелярская кнопка
Envelope|Конверт
Paper|Бумага
Felt-tip pens|Фломастеры
Colored pencils|Цветные карандаши
Staples|Скобы
Binder clip|Зажим для бумаг|биндер
File|Файл|файлик
Ring binder|Скоросшиватель|регистратор
Diary|Дневник|ежедневник
Sketchbook|Альбом
Index cards|Карточки
Ink|Чернила
Fountain pen|Перьевая ручка
Mechanical pencil|Механический карандаш
Lead refills|Грифели|стержень
Set square|Угольник
Stencil|Трафарет
Cutter|Канцелярский нож
Rubber band|Резинка канцелярская
Bookmark|Закладка
Book cover|Обложка
Clipboard|Планшет для бумаг
Desk organizer|Органайзер
Stamp|Печать|штамп
Staple remover|Антистеплер
Whiteboard marker|Маркер для доски
Chalk|Мел
Plasticine|Пластилин
Coloured paper|Цветная бумага
Cardboard|Картон
Watercolors|Акварель
Graph paper|Миллиметровка""",
    "Backpack/Рюкзак/Phone/Телефон/Book/Книга/Desk/Парта/Chair/Стул/Computer/Компьютер/Lunchbox/Ланчбокс/Water bottle/Бутылка/Teacher/Учитель/Blackboard/Доска/Laptop/Ноутбук/Hammer/Молоток")

cat("art_class_items", "KNOWLEDGE", "everyday", "Name something used in art class at school", "Назовите предмет, который используют на уроке рисования",
    "Something used in a school art lesson (paints, brushes, pencils, sketchbook, eraser, watercolours, gouache, water cup, palette, crayons, markers, felt-tip pens, easel, coloured paper, plasticine, scissors, glue, pastels, charcoal, ruler, apron).",
    "То, что используют на уроке рисования (ИЗО): краски, кисти, карандаши, альбом, ластик, акварель, гуашь, стаканчик для воды (непроливайка), палитра, восковые мелки, маркеры, фломастеры, мольберт, цветная бумага, пластилин, ножницы, клей, пастель, уголь, линейка, фартук.",
    """Paints|Краски
Brush|Кисть|кисточка/кисти
Pencils|Карандаши|карандаш
Sketchbook|Альбом|альбом для рисования
Eraser|Ластик|резинка
Watercolours|Акварель
Gouache|Гуашь
Water cup|Стаканчик для воды|непроливайка
Palette|Палитра
Crayons|Восковые мелки|мелки
Markers|Маркеры
Felt-tip pens|Фломастеры
Easel|Мольберт
Coloured paper|Цветная бумага
Plasticine|Пластилин
Scissors|Ножницы
Glue|Клей
Pastels|Пастель
Charcoal|Уголь
Ruler|Линейка
Apron|Фартук|нарукавники
Paper|Бумага|ватман
Coloured pencils|Цветные карандаши
Sharpener|Точилка
Clay|Глина
Napkin|Салфетка|тряпочка
Canvas|Холст
Oilcloth|Клеёнка
Acrylic paint|Акриловые краски|акрил
Stencil|Трафарет
Compass|Циркуль
Sponge|Губка
Ink|Тушь
Cardboard|Картон
Model|Натюрморт|гипсовая фигура
Graphite pencil|Простой карандаш
Oil pastel|Масляная пастель
Palette knife|Мастихин
Tablet|Подставка для рисования
Chalk|Мелки цветные
Glitter|Блёстки""",
    "Microscope/Микроскоп/Calculator/Калькулятор/Football/Мяч/Test tube/Пробирка/Globe/Глобус/Dictionary/Словарь/Phone/Телефон/Hammer/Молоток/Map/Карта/Laptop/Ноутбук/Dumbbell/Гантель/Piano/Пианино")

cat("school_bag_items", "KNOWLEDGE", "everyday", "Name something usually carried in a school backpack", "Назовите то, что обычно носят в школьном рюкзаке",
    "Something a pupil usually carries in a school bag (textbooks, notebooks, pencil case, pens, pencils, diary, lunchbox, water bottle, phone, keys, PE kit, sneakers / change shoes, calculator, ruler, sketchbook, snacks, money, headphones, umbrella, glasses).",
    "То, что школьник обычно носит в рюкзаке: учебники, тетради, пенал, ручки, карандаши, дневник, ланчбокс, бутылка воды, телефон, ключи, форма для физкультуры, сменка, калькулятор, линейка, альбом, перекус, деньги, наушники, зонт.",
    """Textbooks|Учебники|учебник/books/книги
Notebooks|Тетради|тетрадь
Pencil case|Пенал
Pens|Ручки|ручка
Pencils|Карандаши|карандаш
School diary|Дневник
Lunchbox|Ланчбокс|контейнер с едой
Water bottle|Бутылка воды|бутылка/вода
Phone|Телефон
Keys|Ключи
PE kit|Форма для физкультуры|спортивная форма/физра форма
Change shoes|Сменка|сменная обувь/кроссовки
Calculator|Калькулятор
Ruler|Линейка
Sketchbook|Альбом
Snacks|Перекус|еда/сэндвич/бутерброд/яблоко
Money|Деньги
Headphones|Наушники
Umbrella|Зонт
Glasses|Очки
Workbook|Рабочая тетрадь
Folder|Папка
Tablet|Планшет
Laptop|Ноутбук
Planner|Ежедневник
Eraser|Ластик
Glue|Клей
Scissors|Ножницы
Dictionary|Словарь
Atlas|Атлас|контурные карты
Tissues|Салфетки
Hand sanitizer|Антисептик
Power bank|Пауэрбанк
Chewing gum|Жвачка
Chocolate bar|Шоколадка
Charger|Зарядка
Paints|Краски
Diary book|Читательский дневник
Sports uniform|Спортивная сумка|мешок для сменки
Hairbrush|Расчёска
Mask|Маска
Library book|Книга из библиотеки
Travel card|Проездной""",
    "Piano/Пианино/Desk/Парта/TV/Телевизор/Refrigerator/Холодильник/Bicycle/Велосипед/Blackboard/Доска/Cat/Кот/Chair/Стул/Sofa/Диван/Teacher/Учитель/Car/Машина/Microscope/Микроскоп")

cat("foreign_languages", "KNOWLEDGE", "everyday", "Name a language (as a foreign language)", "Назовите иностранный язык",
    "A real human language (English, Spanish, French, German, Chinese / Mandarin, Japanese, Korean, Italian, Portuguese, Arabic, Hindi, Turkish, Russian, Ukrainian, Polish, Greek, Latin, Hebrew, Swahili, Esperanto counts as constructed, Dutch, Swedish, Finnish).",
    "Настоящий язык человека: английский, испанский, французский, немецкий, китайский, японский, корейский, итальянский, португальский, арабский, хинди, турецкий, русский, украинский, польский, греческий, латынь, иврит, суахили, эсперанто, нидерландский, шведский, финский.",
    """English|Английский
Spanish|Испанский
French|Французский
German|Немецкий
Chinese|Китайский|mandarin/мандарин/путунхуа
Japanese|Японский
Korean|Корейский
Italian|Итальянский
Portuguese|Португальский
Arabic|Арабский
Hindi|Хинди
Turkish|Турецкий
Russian|Русский
Ukrainian|Украинский
Polish|Польский
Greek|Греческий
Latin|Латынь|латинский
Hebrew|Иврит
Swahili|Суахили
Esperanto|Эсперанто
Dutch|Нидерландский|голландский
Swedish|Шведский
Finnish|Финский
Norwegian|Норвежский
Danish|Датский
Czech|Чешский
Slovak|Словацкий
Hungarian|Венгерский
Romanian|Румынский
Bulgarian|Болгарский
Serbian|Сербский
Croatian|Хорватский
Belarusian|Белорусский
Kazakh|Казахский
Uzbek|Узбекский
Georgian|Грузинский
Armenian|Армянский
Azerbaijani|Азербайджанский
Persian|Персидский|фарси/farsi
Urdu|Урду
Bengali|Бенгальский
Thai|Тайский
Vietnamese|Вьетнамский
Indonesian|Индонезийский
Malay|Малайский
Tagalog|Тагальский
Mongolian|Монгольский
Tatar|Татарский
Yiddish|Идиш
Irish|Ирландский
Welsh|Валлийский
Icelandic|Исландский
Estonian|Эстонский
Latvian|Латышский
Lithuanian|Литовский
Albanian|Албанский
Catalan|Каталанский
Basque|Баскский
Sanskrit|Санскрит
Ancient Greek|Древнегреческий
Klingon|Клингонский
Tamil|Тамильский
Amharic|Амхарский
Zulu|Зулу
Yoruba|Йоруба
Quechua|Кечуа
Maori|Маори
Hawaiian|Гавайский
Kyrgyz|Киргизский
Tajik|Таджикский
Turkmen|Туркменский
Chechen|Чеченский
Bashkir|Башкирский
Chuvash|Чувашский
Yakut|Якутский
Sign language|Язык жестов
Cantonese|Кантонский""",
    "Python/Питон/Java/Джава/HTML/HTML/Elvish/Эльфийский/Dog language/Собачий/American/Американский/Brazilian/Бразильский/Mexican/Мексиканский/Swiss/Швейцарский/Austrian/Австрийский/Canadian/Канадский/Australian/Австралийский/Belgian/Бельгийский/Morse code/Азбука Морзе")

# ---------- 33. Food colours ----------
cat("yellow_fruits", "KNOWLEDGE", "food", "Name a yellow fruit", "Назовите фрукт жёлтого цвета",
    "A fruit that is yellow when ripe (banana, lemon, pineapple, mango, yellow apple, quince, star fruit, passion fruit yellow, yellow pear, pomelo, melon, yellow plum / mirabelle, papaya, physalis, durian, yellow cherry, yuzu, golden kiwi, grapefruit).",
    "Фрукт, который жёлтый в спелом виде: банан, лимон, ананас, манго, жёлтое яблоко, айва, карамбола, груша, помело, дыня, алыча, мирабель, папайя, физалис, дуриан, жёлтая черешня, юдзу, золотой киви, грейпфрут.",
    """Banana|Банан
Lemon|Лимон
Pineapple|Ананас
Mango|Манго
Yellow apple|Жёлтое яблоко|яблоко/golden delicious/голден
Quince|Айва
Star fruit|Карамбола
Pear|Груша
Pomelo|Помело
Melon|Дыня
Cherry plum|Алыча
Mirabelle|Мирабель
Papaya|Папайя
Physalis|Физалис
Durian|Дуриан
Yellow cherry|Жёлтая черешня
Yuzu|Юдзу
Golden kiwi|Золотой киви
Grapefruit|Грейпфрут
Apricot|Абрикос
Passion fruit|Жёлтая маракуйя|маракуйя
Persimmon|Хурма
Peach|Персик
Nectarine|Нектарин
Jackfruit|Джекфрут
Pitahaya|Жёлтая питахайя
Mangosteen|Жёлтый мангостин
Kumquat|Кумкват
Loquat|Мушмула
Sea buckthorn|Облепиха
Cloudberry|Морошка
Marula|Марула
Lime|Лайм жёлтый
Gooseberry|Жёлтый крыжовник
Yellow plum|Жёлтая слива
Yellow raspberry|Жёлтая малина
Canary melon|Канарская дыня
Bael|Баэль
Pear melon|Пепино
Ugli|Угли
Citron|Цитрон
Sapote|Сапота
Yellow watermelon|Жёлтый арбуз
Bergamot|Бергамот""".replace("\nLime|Лайм жёлтый", ""),
    "Strawberry/Клубника/Cherry/Вишня/Blueberry/Черника/Kiwi/Киви/Lime/Лайм/Watermelon/Арбуз/Grape/Виноград/Plum/Слива/Raspberry/Малина/Corn/Кукуруза/Cheese/Сыр/Pumpkin/Тыква")

cat("green_vegetables", "KNOWLEDGE", "food", "Name a green vegetable", "Назовите овощ зелёного цвета",
    "A vegetable that is green when eaten (cucumber, broccoli, cabbage, zucchini, green peas, spinach, lettuce, celery, green beans, asparagus, kale, Brussels sprouts, green pepper, avocado counts, okra, leek, artichoke, green onion, dill, parsley).",
    "Овощ зелёного цвета: огурец, брокколи, капуста, кабачок, зелёный горошек, шпинат, салат, сельдерей, стручковая фасоль, спаржа, кале, брюссельская капуста, зелёный перец, авокадо, бамия, лук порей, артишок, зелёный лук, укроп, петрушка.",
    """Cucumber|Огурец
Broccoli|Брокколи
Cabbage|Капуста
Zucchini|Кабачок|цукини/courgette
Green peas|Зелёный горошек|горошек/peas
Spinach|Шпинат
Lettuce|Салат|латук/листовой салат
Celery|Сельдерей
Green beans|Стручковая фасоль
Asparagus|Спаржа
Kale|Кале|капуста кале
Brussels sprouts|Брюссельская капуста
Green pepper|Зелёный перец|перец
Avocado|Авокадо
Okra|Бамия
Leek|Лук порей|порей
Artichoke|Артишок
Green onion|Зелёный лук|лук перо/scallion
Dill|Укроп
Parsley|Петрушка
Bok choy|Бок чой|пак чой
Arugula|Руккола
Sorrel|Щавель
Edamame|Эдамаме
Green tomato|Зелёный помидор
Chinese cabbage|Пекинская капуста
Watercress|Кресс салат
Collard greens|Листовая капуста
Chayote|Чайот
Fennel|Фенхель
Chili pepper|Зелёный чили|халапеньо/jalapeno
Kohlrabi|Кольраби
Romanesco|Романеско
Snow peas|Снежный горошек|сахарный горошек
Bitter melon|Момордика|горькая тыква
Cilantro|Кинза
Basil|Базилик
Swiss chard|Мангольд
Pickles|Корнишоны
Green olives|Зелёные оливки|оливки
Iceberg|Айсберг
Wasabi|Васаби
Nettle|Крапива
Pea pods|Стручки гороха""",
    "Carrot/Морковь/Tomato/Помидор/Potato/Картофель/Beetroot/Свёкла/Eggplant/Баклажан/Pumpkin/Тыква/Onion/Лук репчатый/Corn/Кукуруза/Radish/Редиска/Apple/Яблоко/Lime/Лайм/Kiwi/Киви")

cat("red_berries", "KNOWLEDGE", "food", "Name a red berry", "Назовите ягоду красного цвета",
    "A berry that is red when ripe (strawberry, raspberry, cherry, cranberry, lingonberry, redcurrant, rowan, wild strawberry, rose hip, goji, barberry, viburnum, red gooseberry, cornel, red grape, sweet cherry, watermelon counts botanically).",
    "Ягода красного цвета: клубника, малина, вишня, клюква, брусника, красная смородина, рябина, земляника, шиповник, годжи, барбарис, калина, красный крыжовник, кизил, черешня, красный виноград.",
    """Strawberry|Клубника
Raspberry|Малина
Cherry|Вишня
Cranberry|Клюква
Lingonberry|Брусника
Redcurrant|Красная смородина|смородина
Rowan|Рябина
Wild strawberry|Земляника
Rose hip|Шиповник
Goji|Годжи
Barberry|Барбарис
Viburnum|Калина
Red gooseberry|Красный крыжовник|крыжовник
Cornel|Кизил
Sweet cherry|Черешня
Red grape|Красный виноград|виноград
Pomegranate|Гранат
Hawthorn|Боярышник
Bearberry|Толокнянка
Stone bramble|Костяника
Schisandra|Лимонник
Lychee|Личи
Salmonberry|Морошка красная
Red elderberry|Красная бузина
Holly berry|Остролист
Yew berry|Тис
Cloudberry unripe|Княженика
Acerola|Ацерола
Lingonberries|Брусничка
Princess berry|Княженика ягода
Watermelon|Арбуз
Red raspberry|Красная малина
Thimbleberry|Малина душистая
Serviceberry|Ирга
Mulberry|Красная шелковица|шелковица/тутовник""".replace("\nSalmonberry|Морошка красная", "").replace("\nCloudberry unripe|Княженика", "").replace("\nLingonberries|Брусничка", ""),
    "Blueberry/Черника/Blackberry/Ежевика/Gooseberry/Зелёный крыжовник/Grape/Зелёный виноград/Banana/Банан/Lemon/Лимон/Tomato/Помидор/Apple/Яблоко/Pepper/Перец/Blackcurrant/Чёрная смородина/Bilberry/Голубика/Sea buckthorn/Облепиха")

cat("white_foods", "KNOWLEDGE", "food", "Name a white food", "Назовите съедобный продукт белого цвета",
    "A food that is normally white (milk, rice, sugar, salt, flour, cottage cheese, sour cream, yogurt, egg white, coconut flesh, cauliflower, marshmallow, white bread, mozzarella, kefir, white chocolate, tofu, garlic, onion, radish daikon, popcorn, mushrooms champignons).",
    "Продукт белого цвета: молоко, рис, сахар, соль, мука, творог, сметана, йогурт, яичный белок, мякоть кокоса, цветная капуста, зефир, белый хлеб, моцарелла, кефир, белый шоколад, тофу, чеснок, лук, дайкон, попкорн, шампиньоны.",
    """Milk|Молоко
Rice|Рис
Sugar|Сахар
Salt|Соль
Flour|Мука
Cottage cheese|Творог
Sour cream|Сметана
Yogurt|Йогурт
Egg white|Яичный белок|белок
Coconut|Кокос|мякоть кокоса
Cauliflower|Цветная капуста
Marshmallow|Зефир|маршмеллоу
White bread|Белый хлеб|батон
Mozzarella|Моцарелла
Kefir|Кефир
White chocolate|Белый шоколад
Tofu|Тофу
Garlic|Чеснок
Onion|Лук
Daikon|Дайкон|редька
Popcorn|Попкорн
Champignons|Шампиньоны
Cream|Сливки
Mayonnaise|Майонез
Ice cream|Пломбир|мороженое
Feta|Брынза|фета
Pasta|Макароны
Semolina|Манка|манная каша
Cod|Треска
Chicken breast|Куриная грудка
Lard|Сало
Coconut milk|Кокосовое молоко
Meringue|Безе|меренга
Condensed milk|Сгущёнка
Powdered sugar|Сахарная пудра
Whipped cream|Взбитые сливки
Butter|Сливочное масло
White beans|Белая фасоль
Parsnip|Пастернак
Turnip|Репа
Lychee|Личи
Rice noodles|Рисовая лапша
Squid|Кальмар
Pelmeni|Пельмени
Ayran|Айран
Brie|Бри
Cashew|Кешью
Coconut flakes|Кокосовая стружка
Sea salt|Морская соль
White fish|Белая рыба
Rice cake|Моти
Marzipan|Марципан
Halva|Ванильная халва
Cauliflower rice|Рисовая каша""".replace("\nCauliflower rice|Рисовая каша", "\nRice porridge|Рисовая каша"),
    "Tomato/Помидор/Carrot/Морковь/Chocolate/Шоколад/Coffee/Кофе/Orange/Апельсин/Banana/Банан/Cucumber/Огурец/Beetroot/Свёкла/Snow/Снег/Paper/Бумага/Chalk/Мел/Toothpaste/Зубная паста")

cat("orange_foods", "KNOWLEDGE", "food", "Name an orange food", "Назовите съедобный продукт оранжевого цвета",
    "A food that is normally orange (orange, carrot, pumpkin, tangerine, mandarin, apricot, persimmon, mango, papaya, sweet potato, sea buckthorn, cantaloupe, red caviar, salmon, cheddar, orange juice, kumquat, orange pepper, peach, Fanta, Cheetos).",
    "Продукт оранжевого цвета: апельсин, морковь, тыква, мандарин, абрикос, хурма, манго, папайя, батат, облепиха, дыня канталупа, красная икра, лосось, чеддер, апельсиновый сок, кумкват, оранжевый перец, персик, фанта.",
    """Orange|Апельсин
Carrot|Морковь
Pumpkin|Тыква
Mandarin|Мандарин|tangerine
Apricot|Абрикос|курага
Persimmon|Хурма
Mango|Манго
Papaya|Папайя
Sweet potato|Батат
Sea buckthorn|Облепиха
Cantaloupe|Канталупа|дыня
Red caviar|Красная икра|икра
Salmon|Лосось|сёмга
Cheddar|Чеддер
Orange juice|Апельсиновый сок|сок
Kumquat|Кумкват
Orange pepper|Оранжевый перец|перец
Peach|Персик
Fanta|Фанта
Cheetos|Читос
Butternut squash|Мускатная тыква
Egg yolk|Желток
Nectarine|Нектарин
Loquat|Мушмула
Cloudberry|Морошка
Physalis|Физалис
Rowan|Рябина
Shrimp|Креветка варёная|креветки
Crab|Краб
Pumpkin soup|Тыквенный суп
Carrot cake|Морковный торт
Squash caviar|Кабачковая икра
Turmeric|Куркума
Paprika|Паприка
Apricot jam|Абрикосовый джем
Orange marmalade|Апельсиновый мармелад
Clementine|Клементин
Grapefruit|Грейпфрут
Passion fruit|Маракуйя
Cheese puffs|Кукурузные палочки сырные
Mac and cheese|Макароны с сыром
Trout roe|Икра форели
Yellow lentils|Красная чечевица|чечевица
Carrot juice|Морковный сок
Pumpkin seeds oil|Тыквенное масло
Sweet corn|Кукуруза""".replace("\nSweet corn|Кукуруза", "").replace("\nCheese puffs|Кукурузные палочки сырные", ""),
    "Banana/Банан/Apple/Яблоко/Cucumber/Огурец/Milk/Молоко/Chocolate/Шоколад/Blueberry/Черника/Rice/Рис/Bread/Хлеб/Strawberry/Клубника/Lemon/Лимон/Basketball/Баскетбольный мяч/Fox/Лиса")
