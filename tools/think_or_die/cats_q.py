# THINK OR DIE category content, part Q (list 4: questions 516-560, Russian first).
from cats_a import cat
from cats_k import ru_rule

# ---------- 12. Travel and airports ----------
cat("airlines", "KNOWLEDGE", "transport", "Name an airline", "Назовите авиакомпанию",
    "A real airline (current or historic): Aeroflot, S7, Pobeda, Emirates, Lufthansa, Turkish Airlines, Qatar Airways, Ural Airlines, Utair, Ryanair, British Airways.",
    "Реальная авиакомпания (действующая или бывшая): Аэрофлот, S7 Сибирь, Победа, Уральские авиалинии, ЮТэйр, Россия, Emirates, Lufthansa, Turkish Airlines, Qatar, Ryanair, British Airways, Pan Am.",
    """Aeroflot|Аэрофлот
S7 Airlines|S7|сибирь/эс севен
Pobeda|Победа
Ural Airlines|Уральские авиалинии
Utair|ЮТэйр|ютэйр
Rossiya|Россия авиакомпания|авиакомпания россия
Azimuth|Азимут
Nordwind|Нордвинд
Red Wings|Ред Вингс
Smartavia|Смартавиа
Yakutia|Якутия авиакомпания
Aurora|Аврора авиакомпания
Pegas Fly|Пегас Флай
Transaero|Трансаэро
Emirates|Эмирейтс
Lufthansa|Люфтганза
Turkish Airlines|Турецкие авиалинии|тк
Qatar Airways|Катарские авиалинии|катар
Etihad|Этихад
flydubai|Флайдубай
Ryanair|Райанэйр
easyJet|Изиджет
Wizz Air|Визз эйр
British Airways|Бритиш Эйрвейз
Air France|Эйр Франс
KLM|КЛМ
Delta|Дельта
American Airlines|Американ эйрлайнс
United Airlines|Юнайтед эйрлайнс
Southwest|Саутвест
Pan Am|Пан Американ
Singapore Airlines|Сингапурские авиалинии
Cathay Pacific|Катай Пасифик
Japan Airlines|Японские авиалинии
ANA|Ол ниппон
Korean Air|Кореан эйр
Air China|Эйр Чайна
China Southern|Чайна Саузерн
Hainan Airlines|Хайнань
Qantas|Квантас
Air Canada|Эйр Канада
Aeromexico|Аэромексико
LATAM|Латам
Iberia|Иберия
Alitalia|Алиталия
ITA Airways|Ита
Swiss|Свисс
Austrian|Австрийские авиалинии
SAS|Скандинавские авиалинии
Finnair|Финнэйр
Aegean|Эгейские авиалинии
LOT|ЛОТ
airBaltic|Эйр Балтик
Belavia|Белавиа
Air Astana|Эйр Астана
Uzbekistan Airways|Узбекские авиалинии
Azerbaijan Airlines|Азербайджанские авиалинии|азал
Armenia Airways|Армения
Georgian Airways|Грузинские авиалинии
El Al|Эль Аль
Saudia|Саудия
Air India|Эйр Индия
IndiGo|Индиго
Thai Airways|Тайские авиалинии
Vietnam Airlines|Вьетнамские авиалинии
Garuda|Гаруда
Ethiopian Airlines|Эфиопские авиалинии
EgyptAir|Египетские авиалинии
SunExpress|Санэкспресс
Pegasus|Пегасус
Norwegian|Норвегиан
Vueling|Вуэлинг
JetBlue|Джетблю
Air Serbia|Эйр Сербия
Mahan Air|Махан""")

cat("boarding_pass_info", "SEMANTIC", "transport", "Name information printed on a boarding pass", "Назовите информацию, указанную в посадочном талоне",
    "Information on a boarding pass: passenger name, flight number, seat, gate, boarding time, departure time, date, departure and arrival airport, class, boarding group, barcode, airline, terminal, sequence number.",
    "Информация в посадочном талоне: имя пассажира, номер рейса, место, выход, время посадки, время вылета, дата, аэропорт вылета и прилёта, класс, группа посадки, штрих код, авиакомпания, терминал, номер последовательности.",
    """Passenger name|Имя пассажира|фамилия/фио
Flight number|Номер рейса|рейс
Seat|Место|номер места/кресло
Gate|Выход|гейт/выход на посадку
Boarding time|Время посадки
Departure time|Время вылета
Date|Дата
Departure airport|Аэропорт вылета|откуда
Arrival airport|Аэропорт прилёта|куда/пункт назначения
Class|Класс обслуживания|эконом/бизнес
Boarding group|Группа посадки
Barcode|Штрих код|qr код
Airline|Авиакомпания
Terminal|Терминал
Sequence number|Порядковый номер
Booking reference|Номер бронирования|код брони
Ticket number|Номер билета
Baggage allowance|Норма багажа
Frequent flyer number|Номер бонусной карты
Zone|Зона
Row|Ряд
City codes|Код аэропорта
Gate closes|Время закрытия выхода
Priority|Приоритет|приоритетная посадка
Fare|Тариф
Meal|Питание
Infant|Младенец
Arrival time|Время прилёта""")

cat("hand_luggage_banned", "KNOWLEDGE", "transport", "Name an item banned from hand luggage under general aviation security rules", "Назовите предмет, запрещённый к перевозке в ручной клади по общим правилам авиационной безопасности",
    "An item generally prohibited in cabin bags: knife, scissors with long blades, gun, explosives, liquids over 100 ml, lighter fluid, fireworks, axe, hammer, bat, aerosols, gas canister, taser, handcuffs.",
    "Предмет, который обычно нельзя в ручную кладь: нож, длинные ножницы, оружие, взрывчатка, жидкости больше 100 мл, бензин, фейерверк, топор, молоток, бита, аэрозоли, газовый баллон, электрошокер, наручники, отвёртка.",
    """Knife|Нож|ножик
Scissors|Ножницы
Gun|Оружие|пистолет/огнестрельное оружие
Explosives|Взрывчатка|взрывчатые вещества
Liquids over 100 ml|Жидкость больше 100 мл|жидкости/вода
Petrol|Бензин|горючая жидкость
Fireworks|Фейерверк|петарды/пиротехника
Axe|Топор
Hammer|Молоток
Baseball bat|Бита
Aerosol|Аэрозоль|баллончик
Gas canister|Газовый баллон
Taser|Электрошокер
Handcuffs|Наручники
Screwdriver|Отвёртка
Pepper spray|Перцовый баллончик
Ammunition|Патроны
Sword|Меч
Razor blade|Лезвие
Box cutter|Канцелярский нож
Ice pick|Ледоруб
Crossbow|Арбалет
Bow|Лук
Saw|Пила
Drill|Дрель
Crowbar|Лом|монтировка
Brass knuckles|Кастет
Nunchucks|Нунчаки
Toy gun replica|Макет оружия
Matches|Спички
Lighter|Зажигалка
Paint|Краска
Acid|Кислота
Poison|Яд
Mercury thermometer|Ртутный градусник
Flare|Сигнальная ракета
Spear|Копьё
Harpoon|Гарпун
Ski poles|Лыжные палки
Golf club|Клюшка для гольфа
Hockey stick|Хоккейная клюшка
Tent pegs|Колышки для палатки
Corkscrew with blade|Штопор с ножом
Large power bank|Большой пауэрбанк
Alcohol|Алкоголь больше 100 мл
Large perfume|Духи больше 100 мл
Large shampoo|Шампунь больше 100 мл
Jam|Варенье
Honey|Мёд
Self-heating food|Самонагревающиеся консервы
Dry ice|Сухой лёд""")

cat("hotel_services", "SEMANTIC", "everyday", "Name a service offered by hotels", "Назовите услугу, которую предоставляют гостиницы",
    "A service hotels provide: room cleaning, breakfast, room service, laundry, Wi-Fi, transfer, wake-up call, concierge, luggage storage, spa, gym, pool, parking, restaurant, minibar, late checkout.",
    "Услуга гостиницы: уборка номера, завтрак, обслуживание в номере, прачечная, вай фай, трансфер, будильник, консьерж, камера хранения, спа, тренажёрный зал, бассейн, парковка, ресторан, мини бар, поздний выезд.",
    """Room cleaning|Уборка номера|уборка
Breakfast|Завтрак|шведский стол
Room service|Обслуживание в номере|рум сервис
Laundry|Прачечная|стирка
Wi-Fi|Вай фай|интернет
Transfer|Трансфер
Wake-up call|Будильник|звонок будильник
Concierge|Консьерж
Luggage storage|Камера хранения|хранение багажа
Spa|Спа
Gym|Тренажёрный зал|фитнес
Swimming pool|Бассейн
Parking|Парковка
Restaurant|Ресторан
Minibar|Мини бар
Late checkout|Поздний выезд
Early check-in|Ранний заезд
Ironing|Глажка
Dry cleaning|Химчистка
Safe|Сейф
Taxi booking|Вызов такси
Excursions|Экскурсии
Car rental|Прокат автомобилей
Bicycle rental|Прокат велосипедов
Massage|Массаж
Sauna|Сауна|баня
Beauty salon|Салон красоты
Kids club|Детский клуб|анимация
Babysitting|Няня
Conference room|Конференц зал
Business centre|Бизнес центр
Bar|Бар
Lobby bar|Лобби бар
All inclusive|Всё включено
Turndown service|Вечерняя подготовка номера
Pet friendly|Размещение с животными
Currency exchange|Обмен валюты
Shuttle bus|Шаттл
Beach towels|Пляжные полотенца
Sunbeds|Лежаки
Reception 24/7|Круглосуточная стойка
Tour desk|Турбюро
Ticket booking|Бронирование билетов
Medical aid|Врач
Shoe shine|Чистка обуви
Extra bed|Дополнительная кровать
Wedding services|Свадебные услуги
Flowers|Доставка цветов""")

cat("accommodation_types", "KNOWLEDGE", "everyday", "Name a type of tourist accommodation", "Назовите разновидность туристического размещения",
    "A kind of place tourists stay: hotel, hostel, motel, guest house, apartment, camping, glamping, resort, bed and breakfast, sanatorium, boarding house, villa, chalet, capsule hotel.",
    "Вид туристического жилья: отель, хостел, мотель, гостевой дом, апартаменты, кемпинг, глэмпинг, курорт, база отдыха, санаторий, пансионат, вилла, шале, капсульный отель, турбаза.",
    """Hotel|Отель|гостиница
Hostel|Хостел
Motel|Мотель
Guest house|Гостевой дом
Apartment|Апартаменты|квартира посуточно
Camping|Кемпинг
Glamping|Глэмпинг
Resort|Курорт|курортный отель
Bed and breakfast|Мини отель|бед энд брекфаст
Sanatorium|Санаторий
Boarding house|Пансионат
Villa|Вилла
Chalet|Шале
Capsule hotel|Капсульный отель
Tourist base|Турбаза|база отдыха
Holiday cottage|Коттедж
Dacha|Дача посуточно
Tent|Палатка
Campervan|Автодом
Cruise ship|Круизный лайнер
Houseboat|Плавучий дом
Bungalow|Бунгало
Ryokan|Рёкан
Treehouse|Дом на дереве
Igloo hotel|Ледяной отель|иглу
Couchsurfing|Каучсёрфинг
Airbnb|Эйрбиэнби
Homestay|Проживание в семье
Farm stay|Агроусадьба|гостевая ферма
Monastery stay|Монастырская гостиница
Mountain hut|Горный приют
Hut|Хижина
Inn|Постоялый двор
Lodge|Лодж
Eco-lodge|Эколодж
Boutique hotel|Бутик отель
Spa hotel|Спа отель
Business hotel|Бизнес отель
Apart-hotel|Апарт отель
Children's camp|Детский лагерь
Dormitory|Общежитие
Yurt|Юрта
Cabin|Домик
Hotel room|Номер
Sleeper train|Поезд с купе
Love hotel|Лав отель
Riad|Риад
Caravan|Караван""")

# ---------- 13. Literature ----------
cat("famous_writers", "KNOWLEDGE", "everyday", "Name a famous writer", "Назовите известного писателя",
    "A real, widely known writer of fiction or poetry from any country: Pushkin, Tolstoy, Dostoevsky, Chekhov, Shakespeare, Hugo, King, Rowling, Hemingway, Bulgakov.",
    "Реальный известный писатель или поэт любой страны: Пушкин, Толстой, Достоевский, Чехов, Гоголь, Булгаков, Шекспир, Гюго, Кинг, Роулинг, Хемингуэй, Тургенев, Лермонтов, Есенин.",
    """Alexander Pushkin|Пушкин|александр пушкин
Leo Tolstoy|Толстой|лев толстой
Fyodor Dostoevsky|Достоевский
Anton Chekhov|Чехов
Nikolai Gogol|Гоголь
Mikhail Bulgakov|Булгаков
Ivan Turgenev|Тургенев
Mikhail Lermontov|Лермонтов
Sergei Yesenin|Есенин
Vladimir Mayakovsky|Маяковский
Anna Akhmatova|Ахматова
Marina Tsvetaeva|Цветаева
Boris Pasternak|Пастернак
Alexander Solzhenitsyn|Солженицын
Maxim Gorky|Горький
Ivan Bunin|Бунин
Vladimir Nabokov|Набоков
Ivan Krylov|Крылов
Alexander Griboyedov|Грибоедов
Nikolai Nekrasov|Некрасов
Fyodor Tyutchev|Тютчев
Alexander Blok|Блок
Ivan Goncharov|Гончаров
Alexander Ostrovsky|Островский
Mikhail Sholokhov|Шолохов
Arkady and Boris Strugatsky|Стругацкие
Ilf and Petrov|Ильф и Петров
Kir Bulychev|Кир Булычёв
Viktor Pelevin|Пелевин
Boris Akunin|Акунин
Daria Dontsova|Донцова
Sergei Lukyanenko|Лукьяненко
Korney Chukovsky|Чуковский
Samuil Marshak|Маршак
Agniya Barto|Барто
Nikolay Nosov|Носов
Eduard Uspensky|Успенский
William Shakespeare|Шекспир
Victor Hugo|Гюго
Stephen King|Стивен Кинг|кинг
J. K. Rowling|Роулинг
Ernest Hemingway|Хемингуэй
Charles Dickens|Диккенс
Mark Twain|Марк Твен
Jules Verne|Жюль Верн
Alexandre Dumas|Дюма
Arthur Conan Doyle|Конан Дойл
Agatha Christie|Агата Кристи
J. R. R. Tolkien|Толкин
George Orwell|Оруэлл
Franz Kafka|Кафка
Miguel de Cervantes|Сервантес
Dante Alighieri|Данте
Homer|Гомер
Johann Wolfgang von Goethe|Гёте
Jack London|Джек Лондон
Edgar Allan Poe|Эдгар По
Oscar Wilde|Оскар Уайльд
Jane Austen|Джейн Остин
Charlotte Brontë|Шарлотта Бронте
Mary Shelley|Мэри Шелли
Lewis Carroll|Льюис Кэрролл
Hans Christian Andersen|Андерсен
Brothers Grimm|Братья Гримм
Charles Perrault|Шарль Перро
Astrid Lindgren|Астрид Линдгрен
Antoine de Saint-Exupéry|Экзюпери|сент экзюпери
Ray Bradbury|Брэдбери
Isaac Asimov|Азимов
Erich Maria Remarque|Ремарк
Gabriel García Márquez|Маркес
Paulo Coelho|Коэльо
Haruki Murakami|Мураками
Dan Brown|Дэн Браун
George R. R. Martin|Джордж Мартин
Stephenie Meyer|Стефани Майер
Suzanne Collins|Сьюзен Коллинз
Rudyard Kipling|Киплинг
Walter Scott|Вальтер Скотт
Daniel Defoe|Дефо
Jonathan Swift|Свифт
Honoré de Balzac|Бальзак
Émile Zola|Золя
Gustave Flaubert|Флобер
Albert Camus|Камю
Jean-Paul Sartre|Сартр
Thomas Mann|Томас Манн
Hermann Hesse|Гессе
Jerome Salinger|Сэлинджер
F. Scott Fitzgerald|Фицджеральд
John Steinbeck|Стейнбек
William Faulkner|Фолкнер
Aldous Huxley|Хаксли
H. G. Wells|Уэллс
Kurt Vonnegut|Воннегут
Umberto Eco|Умберто Эко
Patrick Süskind|Зюскинд
Terry Pratchett|Пратчетт
Neil Gaiman|Гейман
Chuck Palahniuk|Паланик
Howard Lovecraft|Лавкрафт
Andrzej Sapkowski|Сапковский
Stanisław Lem|Лем""")

cat("books_made_into_films", "KNOWLEDGE", "movies_tv", "Name a book that was made into a film", "Назовите книгу, по которой сняли фильм",
    "A real book (novel, story, tale, play) that has a film adaptation: Harry Potter, The Lord of the Rings, War and Peace, The Master and Margarita, The Green Mile, Gone with the Wind, Dune.",
    "Реальная книга, по которой сняли фильм: Гарри Поттер, Властелин колец, Война и мир, Мастер и Маргарита, Зелёная миля, Унесённые ветром, Дюна, Мёртвые души, Собачье сердце, Двенадцать стульев.",
    """Harry Potter|Гарри Поттер
The Lord of the Rings|Властелин колец
War and Peace|Война и мир
The Master and Margarita|Мастер и Маргарита
The Green Mile|Зелёная миля
Gone with the Wind|Унесённые ветром
Dune|Дюна
Dead Souls|Мёртвые души
Heart of a Dog|Собачье сердце
The Twelve Chairs|Двенадцать стульев
The Golden Calf|Золотой телёнок
Anna Karenina|Анна Каренина
Crime and Punishment|Преступление и наказание
The Idiot|Идиот
Eugene Onegin|Евгений Онегин
The Captain's Daughter|Капитанская дочка
Taras Bulba|Тарас Бульба
Viy|Вий
Quiet Flows the Don|Тихий Дон
Doctor Zhivago|Доктор Живаго
Roadside Picnic|Пикник на обочине|сталкер
Hard to Be a God|Трудно быть богом
Monday Begins on Saturday|Понедельник начинается в субботу
Night Watch|Ночной дозор
The Three Musketeers|Три мушкетёра
The Count of Monte Cristo|Граф Монте Кристо
Les Misérables|Отверженные
Notre-Dame de Paris|Собор Парижской богоматери
Romeo and Juliet|Ромео и Джульетта
Hamlet|Гамлет
Pride and Prejudice|Гордость и предубеждение
Jane Eyre|Джейн Эйр
Frankenstein|Франкенштейн
Dracula|Дракула
Sherlock Holmes|Шерлок Холмс
The Hound of the Baskervilles|Собака Баскервилей
Treasure Island|Остров сокровищ
Robinson Crusoe|Робинзон Крузо
Gulliver's Travels|Путешествия Гулливера
Alice in Wonderland|Алиса в стране чудес
The Little Prince|Маленький принц
The Jungle Book|Книга джунглей
Peter Pan|Питер Пэн
Pinocchio|Пиноккио
The Hobbit|Хоббит
The Chronicles of Narnia|Хроники Нарнии
The Hunger Games|Голодные игры
Twilight|Сумерки
The Shining|Сияние
It|Оно
Carrie|Кэрри
Misery|Мизери
The Godfather|Крёстный отец
Forrest Gump|Форрест Гамп
Fight Club|Бойцовский клуб
One Flew Over the Cuckoo's Nest|Пролетая над гнездом кукушки
The Great Gatsby|Великий Гэтсби
To Kill a Mockingbird|Убить пересмешника
Life of Pi|Жизнь Пи
The Da Vinci Code|Код да Винчи
Jurassic Park|Парк юрского периода
Jaws|Челюсти
The Silence of the Lambs|Молчание ягнят
Gone Girl|Исчезнувшая
The Martian|Марсианин
Ready Player One|Первому игроку приготовиться
A Song of Ice and Fire|Песнь льда и огня|игра престолов
The Witcher|Ведьмак
Perfume|Парфюмер
Solaris|Солярис
Amphibian Man|Человек амфибия
Aelita|Аэлита
The Adventures of Buratino|Золотой ключик
Mowgli|Маугли
Chipollino|Чиполлино
Kid and Karlsson|Малыш и Карлсон
Pippi Longstocking|Пеппи Длинныйчулок
Mary Poppins|Мэри Поппинс
The Wizard of Oz|Волшебник страны Оз
The Snow Queen|Снежная королева
Cinderella|Золушка
Mumu|Муму
The Dawns Here Are Quiet|А зори здесь тихие
Seventeen Moments of Spring|Семнадцать мгновений весны
The Gadfly|Овод
White Bim Black Ear|Белый Бим Чёрное ухо
Guest from the Future|Сто лет тому вперёд
Dunno|Незнайка
Timur and His Team|Тимур и его команда
The Kid from Kishinev|Республика ШКИД
Metro 2033|Метро 2033
The Shawshank Redemption|Рита Хейворт и спасение из Шоушенка""")

cat("human_literary_characters", "KNOWLEDGE", "fantasy", "Name a literary character who is a human", "Назовите литературного персонажа, который является человеком",
    "A character from a book (novel, play, story, poem) who is a human being: Sherlock Holmes, Anna Karenina, Raskolnikov, Eugene Onegin, Harry Potter, Hamlet, Don Quixote, Tom Sawyer.",
    "Персонаж книги, который человек: Шерлок Холмс, Анна Каренина, Раскольников, Евгений Онегин, Гарри Поттер, Гамлет, Дон Кихот, Том Сойер, Остап Бендер, Печорин, Чичиков, Татьяна Ларина.",
    """Sherlock Holmes|Шерлок Холмс|шерлок
Anna Karenina|Анна Каренина
Raskolnikov|Раскольников|родион раскольников
Eugene Onegin|Евгений Онегин|онегин
Harry Potter|Гарри Поттер
Hamlet|Гамлет
Don Quixote|Дон Кихот
Tom Sawyer|Том Сойер
Ostap Bender|Остап Бендер|бендер
Pechorin|Печорин
Chichikov|Чичиков
Tatiana Larina|Татьяна Ларина
Natasha Rostova|Наташа Ростова
Pierre Bezukhov|Пьер Безухов
Andrei Bolkonsky|Андрей Болконский
Oblomov|Обломов
Bazarov|Базаров
Chatsky|Чацкий
Khlestakov|Хлестаков
Taras Bulba|Тарас Бульба
Margarita|Маргарита
The Master|Мастер
Professor Preobrazhensky|Профессор Преображенский
Sharikov|Шариков
Prince Myshkin|Князь Мышкин
Sonya Marmeladova|Соня Мармеладова
Grigory Melekhov|Григорий Мелехов
Gerasim|Герасим
Dubrovsky|Дубровский
Pyotr Grinyov|Пётр Гринёв
Mumu owner|Барыня
Romeo|Ромео
Juliet|Джульетта
Othello|Отелло
King Lear|Король Лир
Macbeth|Макбет
Robinson Crusoe|Робинзон Крузо
Gulliver|Гулливер
Huckleberry Finn|Гекльберри Финн
D'Artagnan|Д'Артаньян
Athos|Атос
Edmond Dantès|Эдмон Дантес|граф монте кристо
Jean Valjean|Жан Вальжан
Quasimodo|Квазимодо
Esmeralda|Эсмеральда
Jane Eyre|Джейн Эйр
Elizabeth Bennet|Элизабет Беннет
Mr. Darcy|Мистер Дарси
Dr. Watson|Доктор Ватсон|ватсон
Hercule Poirot|Эркюль Пуаро|пуаро
Miss Marple|Мисс Марпл
Jay Gatsby|Гэтсби
Holden Caulfield|Холден Колфилд
Atticus Finch|Аттикус Финч
Captain Nemo|Капитан Немо
Phileas Fogg|Филеас Фогг
Dorian Gray|Дориан Грей
Victor Frankenstein|Виктор Франкенштейн
Ebenezer Scrooge|Скрудж
Oliver Twist|Оливер Твист
David Copperfield|Дэвид Копперфилд
Hermione Granger|Гермиона
Ron Weasley|Рон Уизли
Katniss Everdeen|Китнисс Эвердин
Bella Swan|Белла Свон
Jon Snow|Джон Сноу
Daenerys|Дейенерис
Geralt|Геральт
Alice|Алиса
Wendy|Венди
Mary Poppins|Мэри Поппинс
Pippi Longstocking|Пеппи
Malysh|Малыш
Kai|Кай
Gerda|Герда
Ellie|Элли
Mowgli|Маугли
Tarzan|Тарзан
Captain Grant|Капитан Грант
Peter Pan|Питер Пэн
Odysseus|Одиссей
Achilles|Ахилл
Faust|Фауст
Little Red Riding Hood|Красная Шапочка
Cinderella|Золушка
Snow White|Белоснежка
Aladdin|Аладдин
Sinbad|Синдбад
Tom Thumb|Мальчик с пальчик
Danko|Данко
Vasily Terkin|Василий Тёркин
Andrei Sokolov|Андрей Соколов
Pavka Korchagin|Павка Корчагин
Timur|Тимур
Vitya Maleev|Витя Малеев
Denis Korablev|Дениска|денис кораблёв
Alisa Selezneva|Алиса Селезнёва""",
    "Winnie the Pooh/Винни Пух/Cheburashka/Чебурашка/Dobby/Добби/Gollum/Голлум/Woland/Воланд/Dunno/Незнайка/Pinocchio/Буратино/Kolobok/Колобок/Frodo/Фродо")

cat("literary_genres", "KNOWLEDGE", "vocabulary", "Name a literary genre", "Назовите литературный жанр",
    "A real literary genre or form: novel, story, poem, fairy tale, fable, detective, fantasy, science fiction, comedy, tragedy, drama, essay, ballad, epic, horror, romance, satire, memoir.",
    "Реальный литературный жанр или форма: роман, повесть, рассказ, поэма, сказка, басня, детектив, фэнтези, фантастика, комедия, трагедия, драма, очерк, эссе, баллада, былина, ужасы, сонет, мемуары.",
    """Novel|Роман
Novella|Повесть
Short story|Рассказ
Poem|Поэма|стихотворение
Fairy tale|Сказка
Fable|Басня
Detective|Детектив
Fantasy|Фэнтези
Science fiction|Фантастика|научная фантастика
Comedy|Комедия
Tragedy|Трагедия
Drama|Драма
Sketch|Очерк
Essay|Эссе
Ballad|Баллада
Bylina|Былина
Horror|Ужасы|хоррор
Sonnet|Сонет
Memoir|Мемуары
Epic|Эпос|эпопея
Ode|Ода
Elegy|Элегия
Satire|Сатира
Parody|Пародия
Thriller|Триллер
Romance novel|Любовный роман
Adventure|Приключения
Mystery|Мистика
Dystopia|Антиутопия
Utopia|Утопия
Biography|Биография
Autobiography|Автобиография
Diary|Дневник
Letters|Эпистолярный роман
Haiku|Хокку|хайку
Limerick|Лимерик
Epigram|Эпиграмма
Parable|Притча
Legend|Легенда
Myth|Миф
Saga|Сага
Chronicle|Летопись|хроника
Life of a saint|Житие
Aphorism|Афоризм
Anecdote|Анекдот
Feuilleton|Фельетон
Pamphlet|Памфлет
Treatise|Трактат
Vaudeville|Водевиль
Libretto|Либретто
Riddle|Загадка
Proverb|Пословица
Tongue twister|Скороговорка
Nursery rhyme|Потешка
Lullaby|Колыбельная
Chastushka|Частушка
Graphic novel|Графический роман|комикс
Young adult|Подростковая литература
Light novel|Ранобэ
Fanfiction|Фанфик
Cyberpunk|Киберпанк
Steampunk|Стимпанк
Post-apocalyptic|Постапокалипсис
Space opera|Космическая опера
Alternate history|Альтернативная история
Historical novel|Исторический роман
Psychological novel|Психологический роман
Gothic novel|Готический роман
Picaresque|Плутовской роман
Bildungsroman|Роман воспитания
Crime fiction|Криминальный роман
Spy novel|Шпионский роман
Popadanets|Попаданцы
LitRPG|Литрпг
Travel writing|Путевые заметки
Non-fiction|Нон фикшн
Self-help|Саморазвитие
Poetry|Поэзия|лирика
Prose|Проза""")

cat("title_named_works", "KNOWLEDGE", "everyday", "Name a work with a character's name in the title", "Назовите произведение, в названии которого есть имя персонажа",
    "A real literary or artistic work (book, play, poem, opera, film) whose title contains a character's personal name: Eugene Onegin, Anna Karenina, Hamlet, Robinson Crusoe, Oliver Twist, Harry Potter, Taras Bulba.",
    "Реальное произведение, в названии которого есть имя героя: Евгений Онегин, Анна Каренина, Гамлет, Робинзон Крузо, Оливер Твист, Гарри Поттер, Тарас Бульба, Ромео и Джульетта, Дубровский, Мастер и Маргарита, Муму.",
    """Eugene Onegin|Евгений Онегин
Anna Karenina|Анна Каренина
Hamlet|Гамлет
Robinson Crusoe|Робинзон Крузо
Oliver Twist|Оливер Твист
Harry Potter|Гарри Поттер
Taras Bulba|Тарас Бульба
Romeo and Juliet|Ромео и Джульетта
Dubrovsky|Дубровский
The Master and Margarita|Мастер и Маргарита
Mumu|Муму
Ruslan and Lyudmila|Руслан и Людмила
Oblomov|Обломов
Othello|Отелло
King Lear|Король Лир
Macbeth|Макбет
Faust|Фауст
Don Quixote|Дон Кихот
David Copperfield|Дэвид Копперфилд
Jane Eyre|Джейн Эйр
Emma|Эмма
Dorian Gray|Портрет Дориана Грея
Tom Sawyer|Приключения Тома Сойера
Huckleberry Finn|Приключения Гекльберри Финна
Alice in Wonderland|Алиса в стране чудес
Peter Pan|Питер Пэн
Pinocchio|Пиноккио
Buratino|Золотой ключик или приключения Буратино|буратино
Dunno|Приключения Незнайки
Mary Poppins|Мэри Поппинс
Pippi Longstocking|Пеппи Длинныйчулок
Karlsson|Малыш и Карлсон
Winnie the Pooh|Винни Пух
Cheburashka|Крокодил Гена и его друзья
Captain Grant's Children|Дети капитана Гранта
Ivan Tsarevich|Иван царевич и серый волк
Ilya Muromets|Илья Муромец
Sadko|Садко
Snegurochka|Снегурочка
Ruslan|Руслан
Boris Godunov|Борис Годунов
Mtsyri|Мцыри
Demon Tamara|Демон
Vasily Terkin|Василий Тёркин
Ivan Denisovich|Один день Ивана Денисовича
Lolita|Лолита
Carrie|Кэрри
Rebecca|Ребекка
Matilda|Матильда
Madame Bovary|Госпожа Бовари
Candide|Кандид
Ulysses|Улисс
Odyssey|Одиссея
Aeneid|Энеида
Beowulf|Беовульф
Siddhartha|Сиддхартха
Frankenstein|Франкенштейн
Dracula|Дракула
Lady Macbeth of Mtsensk|Леди Макбет Мценского уезда
Asya|Ася
Olesya|Олеся
Poor Liza|Бедная Лиза
Kashtanka|Каштанка
Ionych|Ионыч
Uncle Vanya|Дядя Ваня
Ivanov|Иванов
Sherlock Holmes|Записки о Шерлоке Холмсе
Tristan and Isolde|Тристан и Изольда
Aida|Аида
Carmen|Кармен
Tosca|Тоска
Eugene Onegin opera|Евгений Онегин опера
Ruslan opera|Руслан и Людмила опера
Prince Igor|Князь Игорь
Ivan Susanin|Иван Сусанин
Nils|Чудесное путешествие Нильса
Thumbelina|Дюймовочка
Cinderella|Золушка
Aladdin|Аладдин
Ali Baba|Али Баба и сорок разбойников
Tarzan|Тарзан
Gulliver|Путешествия Гулливера
Timur|Тимур и его команда
Vitya Maleev|Витя Малеев в школе и дома
Denis|Денискины рассказы
Kolobok|Колобок""")

# ---------- 14. Medicine ----------
cat("infectious_diseases", "KNOWLEDGE", "science", "Name a common infectious disease", "Назовите распространённое инфекционное заболевание",
    "A real infectious (contagious) disease: flu, COVID-19, chickenpox, measles, tuberculosis, hepatitis, cold, herpes, mumps, rubella, cholera, malaria, plague, HIV, scarlet fever.",
    "Реальное инфекционное заболевание: грипп, ковид, ветрянка, корь, туберкулёз, гепатит, простуда ОРВИ, герпес, свинка, краснуха, холера, малярия, чума, ВИЧ, скарлатина, ангина, дизентерия.",
    """Flu|Грипп
COVID-19|Ковид|коронавирус/covid
Chickenpox|Ветрянка|ветряная оспа
Measles|Корь
Tuberculosis|Туберкулёз|тубик
Hepatitis|Гепатит
Common cold|Простуда|орви/насморк
Herpes|Герпес
Mumps|Свинка|паротит
Rubella|Краснуха
Cholera|Холера
Malaria|Малярия
Plague|Чума
HIV|ВИЧ|спид
Scarlet fever|Скарлатина
Tonsillitis|Ангина
Dysentery|Дизентерия
Whooping cough|Коклюш
Diphtheria|Дифтерия
Tetanus|Столбняк
Polio|Полиомиелит
Smallpox|Оспа
Typhoid|Брюшной тиф|тиф
Typhus|Сыпной тиф
Rabies|Бешенство
Ebola|Эбола
Zika|Зика
Dengue|Лихорадка денге|денге
Lyme disease|Боррелиоз|болезнь лайма
Tick-borne encephalitis|Клещевой энцефалит
Meningitis|Менингит
Salmonella|Сальмонеллёз
Rotavirus|Ротавирус|кишечный грипп
Norovirus|Норовирус
Gonorrhea|Гонорея
Syphilis|Сифилис
Chlamydia|Хламидиоз
Leprosy|Проказа
Anthrax|Сибирская язва
Botulism|Ботулизм
Mononucleosis|Мононуклеоз
Conjunctivitis|Конъюнктивит
Pneumonia|Пневмония|воспаление лёгких
Bronchitis|Бронхит
Sinusitis|Гайморит|синусит
Otitis|Отит
Scabies|Чесотка
Lice|Педикулёз|вши
Ringworm|Лишай
Thrush|Молочница
Yellow fever|Жёлтая лихорадка
Bird flu|Птичий грипп
Swine flu|Свиной грипп
SARS|Атипичная пневмония
MERS|Ближневосточный респираторный синдром
Mpox|Оспа обезьян
Brucellosis|Бруцеллёз
Leptospirosis|Лептоспироз
Giardiasis|Лямблиоз
Toxoplasmosis|Токсоплазмоз
Hand foot and mouth disease|Энтеровирус|коксаки
Roseola|Розеола
Stomach flu|Кишечная инфекция""")

cat("medical_instruments", "KNOWLEDGE", "science", "Name a medical instrument", "Назовите медицинский инструмент",
    "A real medical instrument or device used by doctors: scalpel, stethoscope, syringe, thermometer, tonometer, forceps, clamp, speculum, otoscope, endoscope, catheter, dropper, defibrillator.",
    "Реальный медицинский инструмент: скальпель, стетоскоп, шприц, градусник, тонометр, пинцет, зажим, зеркало, отоскоп, эндоскоп, катетер, капельница, дефибриллятор, шпатель, бормашина, зонд.",
    """Scalpel|Скальпель
Stethoscope|Стетоскоп|фонендоскоп
Syringe|Шприц
Thermometer|Градусник|термометр
Tonometer|Тонометр
Tweezers|Пинцет
Clamp|Зажим
Speculum|Медицинское зеркало|зеркало
Otoscope|Отоскоп
Endoscope|Эндоскоп
Catheter|Катетер
Drip|Капельница
Defibrillator|Дефибриллятор
Tongue depressor|Шпатель
Dental drill|Бормашина
Probe|Зонд
Forceps|Щипцы|акушерские щипцы
Surgical scissors|Хирургические ножницы
Needle holder|Иглодержатель
Retractor|Ранорасширитель
Lancet|Ланцет
Bone saw|Пила для костей
Trephine|Трепан
Reflex hammer|Неврологический молоточек|молоточек
Ophthalmoscope|Офтальмоскоп
Laryngoscope|Ларингоскоп
Bronchoscope|Бронхоскоп
Glucometer|Глюкометр
Pulse oximeter|Пульсоксиметр
Inhaler|Ингалятор|небулайзер
Ventilator|Аппарат ИВЛ
ECG machine|Кардиограф|экг
Ultrasound|Аппарат УЗИ
X-ray machine|Рентген аппарат
MRI scanner|МРТ
Spirometer|Спирометр
Pipette|Пипетка
Bandage|Бинт
Tourniquet|Жгут
Splint|Шина
Dental mirror|Стоматологическое зеркальце
Dental excavator|Экскаватор стоматологический
Curette|Кюретка
Suture needle|Хирургическая игла
Electrocautery|Электрокоагулятор
Microscope|Микроскоп
Centrifuge|Центрифуга
Cannula|Канюля
Enema|Клизма
Rubber bulb|Спринцовка|груша
Ice pack|Пузырь со льдом
Hot water bottle|Грелка
Crutches|Костыли
Wheelchair|Инвалидная коляска
Hearing tube|Слуховая трубка
Gastroscope|Гастроскоп
Colonoscope|Колоноскоп
Dilator|Расширитель
Bone chisel|Остеотом
Hemostat|Кровоостанавливающий зажим
Amniotome|Амниотом
Speculum vaginal|Гинекологическое зеркало
Tonsil snare|Петля
Dermatome|Дерматом""")

cat("medical_exams", "KNOWLEDGE", "science", "Name a type of medical examination", "Назовите разновидность медицинского обследования",
    "A real medical test or examination: blood test, X-ray, ultrasound, MRI, CT scan, ECG, fluorography, endoscopy, colonoscopy, urinalysis, biopsy, mammography, blood pressure check, eye test.",
    "Реальное медицинское обследование: анализ крови, рентген, УЗИ, МРТ, КТ, ЭКГ, флюорография, гастроскопия, колоноскопия, анализ мочи, биопсия, маммография, измерение давления, проверка зрения, диспансеризация.",
    """Blood test|Анализ крови|сдать кровь/общий анализ крови
X-ray|Рентген|рентгенография
Ultrasound|УЗИ|ультразвук
MRI|МРТ|магнитно резонансная томография
CT scan|КТ|компьютерная томография
ECG|ЭКГ|кардиограмма/электрокардиограмма
Fluorography|Флюорография|флюшка
Gastroscopy|Гастроскопия|фгдс/глотать лампочку
Colonoscopy|Колоноскопия
Urinalysis|Анализ мочи
Biopsy|Биопсия
Mammography|Маммография
Blood pressure check|Измерение давления
Eye test|Проверка зрения
Health check|Диспансеризация|медосмотр/профосмотр
EEG|ЭЭГ|энцефалограмма
Echocardiography|ЭхоКГ|узи сердца
Holter monitoring|Холтер
Spirometry|Спирометрия
Allergy test|Аллергопробы
PCR test|ПЦР тест|пцр
Rapid test|Экспресс тест
Pregnancy test|Тест на беременность
Blood sugar test|Анализ на сахар|глюкоза
Stool test|Анализ кала
Smear|Мазок
Pap test|Цитология
Genetic test|Генетический тест|днк тест
Bone density scan|Денситометрия
PET scan|ПЭТ
Angiography|Ангиография
Cystoscopy|Цистоскопия
Laparoscopy|Лапароскопия
Endoscopy|Эндоскопия
Audiometry|Аудиометрия|проверка слуха
Tonometry|Измерение глазного давления
Fundus exam|Осмотр глазного дна
Dental check-up|Осмотр у стоматолога
Skin check|Дерматоскопия
Stress test|Нагрузочный тест|велоэргометрия
Hormone test|Анализ на гормоны
Biochemistry|Биохимия крови|биохимический анализ
Mantoux test|Манту|реакция манту
Diaskintest|Диаскинтест
Coagulogram|Коагулограмма
Tumor markers|Онкомаркеры
Palpation|Пальпация
Auscultation|Аускультация|прослушивание
Reflex test|Проверка рефлексов
Height and weight|Измерение роста и веса
Body temperature|Измерение температуры
Pulse check|Измерение пульса
Sleep study|Полисомнография
Doppler|Допплерография|уздг
Thermography|Термография
Medical commission|Медкомиссия
Autopsy|Вскрытие""")

cat("disease_symptoms", "KNOWLEDGE", "science", "Name a symptom of an illness", "Назовите симптом заболевания",
    "A real symptom of illness: fever, cough, runny nose, headache, sore throat, nausea, vomiting, diarrhoea, rash, dizziness, weakness, pain, chills, shortness of breath, itching, swelling.",
    "Реальный симптом болезни: температура, кашель, насморк, головная боль, боль в горле, тошнота, рвота, понос, сыпь, головокружение, слабость, боль, озноб, одышка, зуд, отёк, чихание, ломота.",
    """Fever|Температура|жар/высокая температура
Cough|Кашель
Runny nose|Насморк|сопли
Headache|Головная боль|болит голова
Sore throat|Боль в горле|болит горло/першение
Nausea|Тошнота|тошнит
Vomiting|Рвота|тошнить/рвать
Diarrhoea|Понос|диарея
Rash|Сыпь
Dizziness|Головокружение|кружится голова
Weakness|Слабость
Pain|Боль
Chills|Озноб|знобит
Shortness of breath|Одышка
Itching|Зуд|чешется
Swelling|Отёк|опухоль/припухлость
Sneezing|Чихание|чихать
Body aches|Ломота|ломит тело
Fatigue|Усталость|утомляемость
Stomach ache|Боль в животе|болит живот
Constipation|Запор
Bloating|Вздутие
Heartburn|Изжога
Loss of appetite|Потеря аппетита
Loss of smell|Потеря обоняния
Loss of taste|Потеря вкуса
Insomnia|Бессонница
Sweating|Потливость|пот
Palpitations|Учащённое сердцебиение|тахикардия
Chest pain|Боль в груди
Back pain|Боль в спине
Joint pain|Боль в суставах
Muscle pain|Боль в мышцах
Cramps|Судороги
Numbness|Онемение
Tingling|Покалывание
Fainting|Обморок
Confusion|Спутанность сознания
Blurred vision|Размытое зрение
Red eyes|Покраснение глаз
Watery eyes|Слезотечение
Hoarseness|Охриплость|осип голос
Ear pain|Боль в ухе
Nosebleed|Кровотечение из носа
Bruising|Синяки
Pale skin|Бледность
Yellow skin|Желтуха|пожелтение кожи
Weight loss|Потеря веса|похудение
Thirst|Жажда
Frequent urination|Частое мочеиспускание
Tremor|Тремор|дрожь
Hiccups|Икота
Blisters|Волдыри|пузырьки
Redness|Покраснение
Peeling|Шелушение
Hair loss|Выпадение волос
Delirium|Бред
Hallucinations|Галлюцинации
Snoring|Храп
Wheezing|Хрипы
Phlegm|Мокрота
Stuffy nose|Заложенность носа|заложен нос
Inflammation|Воспаление""")

cat("first_aid_kit_items", "KNOWLEDGE", "everyday", "Name an item that can be in a first aid kit", "Назовите изделие, которое может входить в аптечку первой помощи",
    "An item found in a first aid kit: bandage, plaster, cotton wool, antiseptic, tourniquet, gloves, scissors, gauze, elastic bandage, thermometer, iodine, brilliant green, hydrogen peroxide, painkillers, thermal blanket.",
    "Что бывает в аптечке: бинт, пластырь, вата, антисептик, жгут, перчатки, ножницы, марля, эластичный бинт, градусник, йод, зелёнка, перекись, обезболивающее, термоодеяло, салфетки, маска для ИВЛ, булавки.",
    """Bandage|Бинт
Plaster|Пластырь|лейкопластырь
Cotton wool|Вата
Antiseptic|Антисептик|хлоргексидин
Tourniquet|Жгут|кровоостанавливающий жгут
Gloves|Перчатки|медицинские перчатки
Scissors|Ножницы
Gauze|Марля|марлевые салфетки
Elastic bandage|Эластичный бинт
Thermometer|Градусник
Iodine|Йод
Brilliant green|Зелёнка
Hydrogen peroxide|Перекись водорода|перекись
Painkillers|Обезболивающее|анальгин/ибупрофен/парацетамол
Thermal blanket|Термоодеяло|спасательное одеяло
Wipes|Салфетки|спиртовые салфетки
CPR mask|Маска для искусственного дыхания
Safety pins|Булавки
Cold pack|Гипотермический пакет|холодный компресс
Splint|Шина
Triangular bandage|Косынка
Tweezers|Пинцет
Activated charcoal|Активированный уголь
Ammonia|Нашатырный спирт|нашатырь
Valocordin|Корвалол|валокордин
Validol|Валидол
Nitroglycerin|Нитроглицерин
Aspirin|Аспирин
Antihistamine|Антигистаминное|супрастин
Burn gel|Средство от ожогов|пантенол
Eye drops|Глазные капли
Nasal drops|Капли в нос
Sore throat lozenges|Леденцы от горла
Rehydration salts|Регидрон
Smecta|Смекта
No-Spa|Но шпа
Gauze pads|Марлевые подушечки
Sterile dressing|Стерильная повязка
Hemostatic sponge|Гемостатическая губка
Cotton swabs|Ватные палочки
Instructions|Инструкция
Flashlight|Фонарик
Notepad|Блокнот
Pen|Ручка
Hand sanitizer|Санитайзер
Face mask|Медицинская маска
Syringe|Шприц
Pipette|Пипетка
Ointment|Мазь|левомеколь
Plaster roll|Пластырь в рулоне
Blister plaster|Пластырь от мозолей
Hot water bottle|Грелка""")

# ---------- 15. TV and shows ----------
cat("famous_tv_series", "KNOWLEDGE", "movies_tv", "Name a famous TV series", "Назовите известный телесериал",
    "A real, widely known TV or streaming series (live action or animated): Game of Thrones, Breaking Bad, Friends, The Simpsons, Stranger Things, Interns, Univer, Kitchen, Brigada.",
    "Реальный известный сериал: Игра престолов, Во все тяжкие, Друзья, Симпсоны, Очень странные дела, Интерны, Универ, Кухня, Бригада, Шерлок, Ведьмак, Папины дочки, Слово пацана, Сверхъестественное.",
    """Game of Thrones|Игра престолов
Breaking Bad|Во все тяжкие
Friends|Друзья
The Simpsons|Симпсоны
Stranger Things|Очень странные дела
Interns|Интерны
Univer|Универ
Kitchen|Кухня
Brigada|Бригада
Sherlock|Шерлок
The Witcher|Ведьмак
Daddy's Daughters|Папины дочки
The Boy's Word|Слово пацана
Supernatural|Сверхъестественное
Lost|Остаться в живых|лост
House M.D.|Доктор Хаус|хаус
The Walking Dead|Ходячие мертвецы
Prison Break|Побег
Dexter|Декстер
Sopranos|Клан Сопрано
The Wire|Прослушка
Peaky Blinders|Острые козырьки
The Office|Офис
How I Met Your Mother|Как я встретил вашу маму
The Big Bang Theory|Теория большого взрыва
Two and a Half Men|Два с половиной человека
Doctor Who|Доктор Кто
Black Mirror|Чёрное зеркало
Squid Game|Игра в кальмара
Money Heist|Бумажный дом
Dark|Тьма
Westworld|Мир дикого запада
The Mandalorian|Мандалорец
The Boys|Пацаны
Wednesday|Уэнсдэй
The Last of Us|Одни из нас
Chernobyl|Чернобыль
True Detective|Настоящий детектив
Twin Peaks|Твин Пикс
The X-Files|Секретные материалы
Rick and Morty|Рик и Морти
South Park|Южный парк
Family Guy|Гриффины
Futurama|Футурама
SpongeBob|Губка Боб
Smeshariki|Смешарики
Masha and the Bear|Маша и Медведь
Real Boys|Реальные пацаны
Voronins|Воронины
Happy Together|Счастливы вместе
Sasha Tanya|СашаТаня
Physics or Chemistry|Физрук
Hotel Eleon|Отель Элеон
Molodezhka|Молодёжка
Policeman from Rublyovka|Полицейский с Рублёвки
Trigger|Триггер
Method|Метод
Major Sokolov|Мажор
Streets of Broken Lights|Улицы разбитых фонарей|менты
Gangster Petersburg|Бандитский Петербург
Sklifosovsky|Склифосовский
Kamenskaya|Каменская
Liquidation|Ликвидация
The Master and Margarita series|Мастер и Маргарита сериал
Penal Battalion|Штрафбат
Sailor Moon|Сейлор Мун
Naruto|Наруто
Attack on Titan|Атака титанов
Death Note|Тетрадь смерти
Grey's Anatomy|Анатомия страсти
Suits|Форс мажоры
Vikings|Викинги
The Crown|Корона
House of the Dragon|Дом дракона
The Rings of Power|Кольца власти
Better Call Saul|Лучше звоните Солу
Narcos|Нарко
Lucifer|Люцифер
Sex and the City|Секс в большом городе
Desperate Housewives|Отчаянные домохозяйки
Gossip Girl|Сплетница
Euphoria|Эйфория
Shameless|Бесстыжие
Clinic|Клиника
Scrubs|Клиника скрабс
Mr. Robot|Мистер Робот
Fargo|Фарго
Succession|Наследники
Ted Lasso|Тед Лассо
The Sopranos|Сопрано
Magnificent Century|Великолепный век
Esmeralda|Эсмеральда
Santa Barbara|Санта Барбара
Rich Also Cry|Богатые тоже плачут""")

cat("tv_quizzes", "KNOWLEDGE", "movies_tv", "Name a TV quiz show", "Назовите телевизионную викторину",
    "A real television quiz show: Who Wants to Be a Millionaire?, What? Where? When?, Field of Miracles, Jeopardy!, Svoya Igra, Wheel of Fortune, The Chase, Weakest Link, Brain Ring, Guess the Melody.",
    "Реальная телевикторина: Кто хочет стать миллионером, Что Где Когда, Поле чудес, Своя игра, Брейн ринг, Угадай мелодию, Слабое звено, Колесо истории, Сто к одному, Умницы и умники, Счастливый случай.",
    """Who Wants to Be a Millionaire?|Кто хочет стать миллионером|о счастливчик/миллионер
What? Where? When?|Что Где Когда|чгк
Field of Miracles|Поле чудес
Svoya Igra|Своя игра
Brain Ring|Брейн ринг
Guess the Melody|Угадай мелодию
The Weakest Link|Слабое звено
Family Feud|Сто к одному
Clever Boys and Girls|Умницы и умники
Lucky Chance|Счастливый случай
Jeopardy!|Джеопарди
Wheel of Fortune|Колесо фортуны
The Chase|Погоня
Wheel of History|Колесо истории
Intuition|Интуиция
Fort Boyard|Форт Боярд
Pointless|Бессмысленно
The Price Is Right|Цена удачи|верная цена
Mastermind|Мастермайнд
University Challenge|Университетский вызов
Countdown|Обратный отсчёт
Tipping Point|Переломный момент
Million Dollar Drop|Не урони миллион
Deal or No Deal|Пан или пропал
The Wall|Стена
Golden Balls|Золотые шары
Big Brain|Большой мозг
Who Is Smarter|Кто умнее
Are You Smarter than a 5th Grader?|Ты умнее пятиклассника|умнее пятиклассника
The Smartest|Самый умный
Superintuition|Суперинтуиция
Know Russian|Полиглот
Main Role|Где логика
Where's the Logic|Где логика тнт
Ten Million|10 миллионов
Russian Roulette|Русская рулетка
One Against All|Один против всех
Clever and Clever|Умники
Quiz Battle|Квиз
Miracle Field|Поле чудес капиталшоу
Mind Games|Игры разума
Star Hour|Звёздный час
Name That Tune|Угадай мелодию американская
Our Fifteen|Наши песни
Trust Me|Поверь мне
Bluff|Блеф клуб""")

cat("animated_series", "KNOWLEDGE", "movies_tv", "Name an animated TV series", "Назовите анимационный сериал",
    "A real animated (cartoon or anime) TV series: The Simpsons, SpongeBob, Masha and the Bear, Smeshariki, Rick and Morty, Luntik, Fixiki, Naruto, Tom and Jerry, DuckTales.",
    "Реальный мультсериал или аниме сериал: Симпсоны, Губка Боб, Маша и Медведь, Смешарики, Рик и Морти, Лунтик, Фиксики, Наруто, Том и Джерри, Утиные истории, Чип и Дейл, Ну погоди, Барбоскины, Три кота.",
    """The Simpsons|Симпсоны
SpongeBob SquarePants|Губка Боб
Masha and the Bear|Маша и Медведь
Smeshariki|Смешарики
Rick and Morty|Рик и Морти
Luntik|Лунтик
The Fixies|Фиксики
Naruto|Наруто
Tom and Jerry|Том и Джерри
DuckTales|Утиные истории
Chip 'n Dale Rescue Rangers|Чип и Дейл спешат на помощь|чип и дейл
Nu, pogodi!|Ну погоди
Barboskins|Барбоскины
Three Cats|Три кота
Kikoriki|Кикорики
Prostokvashino|Простоквашино
Peppa Pig|Свинка Пеппа
PAW Patrol|Щенячий патруль
Bluey|Блуи
Paw Patrol|Щенячий патруль
Futurama|Футурама
Family Guy|Гриффины
South Park|Южный парк
Gravity Falls|Гравити Фолз
Adventure Time|Время приключений
Avatar: The Last Airbender|Аватар Легенда об Аанге
Teenage Mutant Ninja Turtles|Черепашки ниндзя
Gummi Bears|Мишки Гамми
Darkwing Duck|Чёрный плащ
TaleSpin|Чудеса на виражах
Gargoyles|Гаргульи
Batman: The Animated Series|Бэтмен мультсериал
X-Men: The Animated Series|Люди Икс мультсериал
Scooby-Doo|Скуби Ду
The Flintstones|Флинтстоуны
The Jetsons|Джетсоны
Looney Tunes|Луни Тюнз
Pokémon|Покемоны
Sailor Moon|Сейлор Мун
Dragon Ball|Драгонболл
One Piece|Ван пис
Attack on Titan|Атака титанов
Death Note|Тетрадь смерти
Demon Slayer|Клинок рассекающий демонов
Jujutsu Kaisen|Магическая битва
My Hero Academia|Моя геройская академия
Hunter x Hunter|Охотник х охотник
Fullmetal Alchemist|Стальной алхимик
Bleach|Блич
Tokyo Ghoul|Токийский гуль
BoJack Horseman|Конь БоДжек
Arcane|Аркейн
Invincible|Неуязвимый
Archer|Арчер
Bob's Burgers|Закусочная Боба
King of the Hill|Царь горы
Phineas and Ferb|Финес и Ферб
Miraculous|Леди Баг и Супер кот|леди баг
Winx Club|Клуб Винкс|винкс
Ben 10|Бен 10
Totally Spies|Тотали спайс
Kim Possible|Ким Пять с плюсом
The Amazing World of Gumball|Удивительный мир Гамбола
Regular Show|Обычный мультик
Steven Universe|Вселенная Стивена
Ed, Edd n Eddy|Эд Эдд и Эдди
Dexter's Laboratory|Лаборатория Декстера
The Powerpuff Girls|Суперкрошки
Johnny Bravo|Джонни Браво
Courage the Cowardly Dog|Кураж трусливый пёс
Hey Arnold!|Эй Арнольд
Rugrats|Ох уж эти детки
Teletubbies|Телепузики
Thomas & Friends|Паровозик Томас
Fireman Sam|Пожарный Сэм
Leopold the Cat|Кот Леопольд
Kotik|Котёнок Гав
Moonzy|Лунтик и его друзья
Bumba|Бумба
Tsarevny|Царевны
Fantasy Patrol|Сказочный патруль
Leo and Tig|Лео и Тиг
Sheriff Callie|Шериф Келли
Robocar Poli|Робокар Поли
Tayo|Тайо
Paw Patrol Mighty|Щенячий патруль мега
Bunnicula|Банникула
Woody Woodpecker|Вуди Вудпекер""")

cat("competition_tv_shows", "KNOWLEDGE", "movies_tv", "Name a TV show where contestants compete", "Назовите телевизионное шоу, в котором участники соревнуются",
    "A real TV show in which participants compete: The Voice, X Factor, Got Talent, Survivor, The Bachelor, Battle of Psychics, MasterChef, Dancing with the Stars, Comedy Battle, Heads and Tails is not.",
    "Реальное шоу, где участники соревнуются: Голос, Фактор А, Минута славы, Последний герой, Холостяк, Битва экстрасенсов, Мастер Шеф, Танцы со звёздами, Комеди баттл, Маска, Танцы, Ледниковый период, Вызов.",
    """The Voice|Голос
X Factor|Икс фактор|фактор а
Got Talent|Минута славы|в мире талантов
Survivor|Последний герой|сурвайвор
The Bachelor|Холостяк
Battle of Psychics|Битва экстрасенсов
MasterChef|Мастер Шеф
Dancing with the Stars|Танцы со звёздами
Comedy Battle|Комеди баттл
The Masked Singer|Маска
So You Think You Can Dance|Танцы
Ice Age|Ледниковый период
Big Brother|Большой брат|за стеклом
Dom-2|Дом 2
Star Factory|Фабрика звёзд
American Idol|Американский идол|народный артист
The Amazing Race|Удивительная гонка
Fort Boyard|Форт Боярд
Top Chef|Топ шеф
Hell's Kitchen|Адская кухня
Top Model|Топ модель по русски
Project Runway|Проект подиум
Love Island|Остров любви
The Apprentice|Кандидат
Who Wants to Be a Millionaire?|Кто хочет стать миллионером
What? Where? When?|Что Где Когда
KVN|КВН
Improvisation|Импровизация
Laughter Without Rules|Смех без правил
Stars in Africa|Звёзды в Африке
Weighted People|Взвешенные люди
The Biggest Loser|Худеющий
Ninja Warrior|Ниндзя воин
Wipeout|Полный вперёд|wipeout
Gladiators|Гладиаторы
Takeshi's Castle|Замок Такэси
Eurovision|Евровидение
Junior Eurovision|Детское Евровидение
New Wave|Новая волна
Two Stars|Две звезды
Exactly the Same|Один в один
Golos Deti|Голос дети
Song|Песни на тнт|песни
Rap battle|Версус
Holostyachka|Холостячка
Mama in 16|Беременна в 16
Pacany|Пацанки
Supermodel|Супермодель
Four Weddings|Четыре свадьбы
Confectioner|Кондитер
Bake Off|Великий пекарь
Survivor Russia|Последний герой Россия
Challenge|Вызов
Game|Игра тнт
Love Is Blind|Любовь слепа
Too Hot to Handle|Слишком горячо
Squid Game: The Challenge|Игра в кальмара реалити
Beast Games|Игры зверей""")

cat("long_running_series", "KNOWLEDGE", "movies_tv", "Name a TV series with more than five seasons", "Назовите сериал, в котором больше пяти сезонов",
    "A real TV series that has more than five seasons: The Simpsons, Friends (10), Supernatural (15), Game of Thrones (8), The Walking Dead (11), Grey's Anatomy, Univer, Interns, Kitchen (6), Doctor Who.",
    "Реальный сериал, у которого больше пяти сезонов: Симпсоны, Друзья, Сверхъестественное, Игра престолов, Ходячие мертвецы, Анатомия страсти, Универ, Интерны, Кухня, Доктор Кто, Папины дочки, Воронины.",
    """The Simpsons|Симпсоны
Friends|Друзья
Supernatural|Сверхъестественное
Game of Thrones|Игра престолов
The Walking Dead|Ходячие мертвецы
Grey's Anatomy|Анатомия страсти
Univer|Универ
Interns|Интерны
Kitchen|Кухня
Doctor Who|Доктор Кто
Daddy's Daughters|Папины дочки
Voronins|Воронины
Happy Together|Счастливы вместе
Real Boys|Реальные пацаны
Fizruk|Физрук
SpongeBob|Губка Боб
South Park|Южный парк
Family Guy|Гриффины
Futurama|Футурама
Rick and Morty|Рик и Морти
The Big Bang Theory|Теория большого взрыва
How I Met Your Mother|Как я встретил вашу маму
Two and a Half Men|Два с половиной человека
House M.D.|Доктор Хаус
Lost|Остаться в живых
Dexter|Декстер
The X-Files|Секретные материалы
The Office|Офис
Shameless|Бесстыжие
Modern Family|Американская семейка
Suits|Форс мажоры
Vikings|Викинги
Lucifer|Люцифер
Bones|Кости
Castle|Касл
NCIS|Морская полиция
CSI|C S I Место преступления
Law & Order|Закон и порядок
ER|Скорая помощь
Scrubs|Клиника
Desperate Housewives|Отчаянные домохозяйки
Gossip Girl|Сплетница
The Vampire Diaries|Дневники вампира
Smallville|Тайны Смолвилля
Arrow|Стрела
The Flash|Флэш
Criminal Minds|Мыслить как преступник
Pokémon|Покемоны
One Piece|Ван пис
Naruto|Наруто
Masha and the Bear|Маша и Медведь
Smeshariki|Смешарики
Luntik|Лунтик
Streets of Broken Lights|Улицы разбитых фонарей
Molodezhka|Молодёжка
Sklifosovsky|Склифосовский
Glukhar|Глухарь
Kamenskaya|Каменская
Sled|След
Magnificent Century|Великолепный век
Santa Barbara|Санта Барбара
The Sopranos|Клан Сопрано
Parks and Recreation|Парки и зоны отдыха
Brooklyn Nine-Nine|Бруклин 9 9
It's Always Sunny in Philadelphia|В Филадельфии всегда солнечно
Seinfeld|Сайнфелд
Cheers|Чирс
Frasier|Фрейзер
Married with Children|Женаты и с детьми
Full House|Полный дом
The Fresh Prince|Принц из Беверли Хиллз
Sabrina the Teenage Witch|Сабрина маленькая ведьма
Charmed|Зачарованные
Buffy|Баффи истребительница вампиров
Stargate SG-1|Звёздные врата
Star Trek: The Next Generation|Звёздный путь Следующее поколение
Heartland|Хартленд
Bob's Burgers|Закусочная Боба
Peppa Pig|Свинка Пеппа""",
    "Breaking Bad/Во все тяжкие/Sherlock/Шерлок/Chernobyl/Чернобыль/Stranger Things/Очень странные дела/The Witcher/Ведьмак/Squid Game/Игра в кальмара/Wednesday/Уэнсдэй/The Boy's Word/Слово пацана/Brigada/Бригада")

# ---------- 16. Symbols ----------
cat("punctuation_marks", "KNOWLEDGE", "vocabulary", "Name a punctuation mark", "Назовите знак препинания",
    "A real punctuation mark: full stop, comma, question mark, exclamation mark, colon, semicolon, dash, hyphen, quotation marks, brackets, ellipsis, apostrophe.",
    "Реальный знак препинания: точка, запятая, вопросительный знак, восклицательный знак, двоеточие, точка с запятой, тире, дефис, кавычки, скобки, многоточие, апостроф.",
    """Full stop|Точка
Comma|Запятая
Question mark|Вопросительный знак|вопрос
Exclamation mark|Восклицательный знак
Colon|Двоеточие
Semicolon|Точка с запятой
Dash|Тире
Hyphen|Дефис
Quotation marks|Кавычки|ёлочки/лапки
Brackets|Скобки|круглые скобки
Ellipsis|Многоточие|три точки
Apostrophe|Апостроф
Square brackets|Квадратные скобки
Slash|Косая черта|слэш
Interrobang|Вопросительно восклицательный знак
Guillemets|Кавычки ёлочки
Inverted question mark|Перевёрнутый вопросительный знак""", exhaustive=True, allowUnknown=False)

cat("greek_letters", "KNOWLEDGE", "science", "Name a letter of the Greek alphabet", "Назовите букву греческого алфавита",
    "One of the 24 letters of the Greek alphabet: alpha, beta, gamma, delta, epsilon, zeta, eta, theta, iota, kappa, lambda, mu, nu, xi, omicron, pi, rho, sigma, tau, upsilon, phi, chi, psi, omega.",
    "Одна из 24 букв греческого алфавита: альфа, бета, гамма, дельта, эпсилон, дзета, эта, тета, йота, каппа, лямбда, мю, ню, кси, омикрон, пи, ро, сигма, тау, ипсилон, фи, хи, пси, омега.",
    """Alpha|Альфа|α
Beta|Бета|β
Gamma|Гамма|γ
Delta|Дельта|δ
Epsilon|Эпсилон|ε
Zeta|Дзета|зета/ζ
Eta|Эта|η
Theta|Тета|θ
Iota|Йота|иота/ι
Kappa|Каппа|κ
Lambda|Лямбда|λ
Mu|Мю|ми/μ
Nu|Ню|ни/ν
Xi|Кси|ξ
Omicron|Омикрон|ο
Pi|Пи|π
Rho|Ро|ρ
Sigma|Сигма|σ
Tau|Тау|τ
Upsilon|Ипсилон|υ
Phi|Фи|φ
Chi|Хи|χ
Psi|Пси|ψ
Omega|Омега|ω""", exhaustive=True, allowUnknown=False)

cat("math_symbols", "KNOWLEDGE", "science", "Name a mathematical symbol", "Назовите математический символ",
    "A real mathematical sign or symbol (by name or the sign itself): plus, minus, multiplication, division, equals, not equal, greater than, less than, square root, percent, infinity, pi, integral, sum, factorial, degree.",
    "Реальный математический знак (названием или самим знаком): плюс, минус, умножение, деление, равно, не равно, больше, меньше, корень, процент, бесконечность, пи, интеграл, сумма, факториал, градус, модуль.",
    """Plus|Плюс|+
Minus|Минус|−/-
Multiplication|Умножение|×/знак умножения
Division|Деление|÷/знак деления
Equals|Равно|=/знак равенства
Not equal|Не равно|≠
Greater than|Больше|>
Less than|Меньше|<
Greater or equal|Больше или равно|≥
Less or equal|Меньше или равно|≤
Square root|Корень|√/квадратный корень
Percent|Процент|%
Infinity|Бесконечность|∞
Pi|Пи|π
Integral|Интеграл|∫
Sum|Сумма|∑/сигма
Product|Произведение|∏
Factorial|Факториал|!
Degree|Градус|°
Absolute value|Модуль
Approximately equal|Примерно равно|≈
Plus-minus|Плюс минус|±
Fraction bar|Дробная черта
Brackets|Скобки
Delta|Дельта|δ/приращение
Partial derivative|Частная производная|∂
Derivative|Производная|штрих
Limit|Предел|lim
Logarithm|Логарифм|log
Belongs to|Принадлежит|∈
Empty set|Пустое множество|∅
Union|Объединение|∪
Intersection|Пересечение|∩
Subset|Подмножество|⊂
For all|Для любого|∀/квантор всеобщности
There exists|Существует|∃
Therefore|Следовательно|∴
Implies|Импликация|⇒
Equivalent|Эквивалентно|⇔
Parallel|Параллельно|∥
Perpendicular|Перпендикулярно|⊥
Angle|Угол|∠
Triangle|Треугольник|△
Nabla|Набла|∇
Exponent|Степень|^
Ratio|Отношение|:
Proportional|Пропорционально|∝
Identical|Тождественно|≡
Decimal point|Десятичная запятая
Vector|Вектор
Imaginary unit|Мнимая единица|i
Euler's number|Число Эйлера|e
Golden ratio|Золотое сечение|фи
Function|Функция f
Modulo|Остаток от деления|mod""")

cat("data_units", "KNOWLEDGE", "science", "Name a unit of digital information", "Назовите единицу измерения объёма цифровой информации",
    "A real unit of digital information: bit, byte, kilobyte, megabyte, gigabyte, terabyte, petabyte, exabyte, zettabyte, yottabyte, kibibyte, mebibyte, gibibyte, nibble, word.",
    "Реальная единица объёма информации: бит, байт, килобайт, мегабайт, гигабайт, терабайт, петабайт, эксабайт, зеттабайт, йоттабайт, кибибайт, мебибайт, гибибайт, ниббл, кбит, мбит.",
    """Bit|Бит
Byte|Байт
Kilobyte|Килобайт|кб/кило
Megabyte|Мегабайт|мб/мега/мегабайтик
Gigabyte|Гигабайт|гб/гиг/гига
Terabyte|Терабайт|тб/тера
Petabyte|Петабайт|пб
Exabyte|Эксабайт
Zettabyte|Зеттабайт
Yottabyte|Йоттабайт
Ronnabyte|Роннабайт
Quettabyte|Кветтабайт
Kibibyte|Кибибайт|киб
Mebibyte|Мебибайт|миб
Gibibyte|Гибибайт|гиб
Tebibyte|Тебибайт
Pebibyte|Пебибайт
Nibble|Ниббл|полубайт
Kilobit|Килобит|кбит
Megabit|Мегабит|мбит
Gigabit|Гигабит|гбит
Terabit|Терабит
Word|Машинное слово
Octet|Октет
Qubit|Кубит
Trit|Трит""", exhaustive=True, allowUnknown=False)

ru_rule("elements_with_r_ru", "science", "Name a chemical element with the letter “Р” in its Russian name", "Назовите химический элемент, в русском названии которого есть буква «Р»",
    "Химический элемент, в русском названии которого есть буква «р»: водород, кислород, хлор, фтор, бор, сера, серебро, фосфор, бром, хром, радий, уран, рубидий.",
    """Hydrogen|Водород
Oxygen|Кислород
Carbon|Углерод
Chlorine|Хлор
Fluorine|Фтор
Boron|Бор
Sulfur|Сера
Silver|Серебро
Phosphorus|Фосфор
Bromine|Бром
Chromium|Хром
Radium|Радий
Uranium|Уран
Rubidium|Рубидий
Iridium|Иридий
Ruthenium|Рутений
Rhodium|Родий
Rhenium|Рений
Radon|Радон
Strontium|Стронций
Zirconium|Цирконий
Germanium|Германий
Mercury|Ртуть
Thorium|Торий
Curium|Кюрий
Erbium|Эрбий
Terbium|Тербий
Samarium|Самарий
Praseodymium|Празеодим
Europium|Европий
Americium|Америций
Berkelium|Берклий
Fermium|Фермий
Francium|Франций
Argon|Аргон
Krypton|Криптон
Barium|Барий
Beryllium|Бериллий
Cerium|Церий
Rutherfordium|Резерфордий
Roentgenium|Рентгений
Darmstadtium|Дармштадтий
Meitnerium|Мейтнерий
Bohrium|Борий
Seaborgium|Сиборгий
Copernicium|Коперниций
Livermorium|Ливерморий
Moscovium|Московий
Flerovium|Флеровий
Protactinium|Протактиний
Sodium|Натрий
Manganese|Марганец
Ruthenium|Рутений
Promethium|Прометий
Tungsten|Вольфрам
Silicon|Кремний
Tellurium|Теллур
Zirconium Zr|Цирконий""",
    "Azote/азот/Iron/железо/Gold/золото/Copper/медь/Lead/свинец/Tin/олово/Zinc/цинк/Nickel/никель/Helium/гелий/Neon/неон/Lithium/литий", dict(kind="CONTAINS", value="р"))

# ---------- 18. Historical figures ----------
cat("famous_inventors", "KNOWLEDGE", "history", "Name a famous inventor", "Назовите известного изобретателя",
    "A real person famous for inventions: Edison, Tesla, Bell, Popov, Kulibin, Gutenberg, Watt, Kalashnikov, the Wright brothers, Lomonosov, Zuckerberg is not an inventor, Jobs counts loosely.",
    "Реальный известный изобретатель: Эдисон, Тесла, Белл, Попов, Кулибин, Гутенберг, Уатт, Калашников, братья Райт, Ломоносов, Зворыкин, Сикорский, Королёв, Яблочков, Лодыгин, Да Винчи.",
    """Thomas Edison|Эдисон
Nikola Tesla|Тесла
Alexander Graham Bell|Белл|грэм белл
Alexander Popov|Попов|александр попов
Ivan Kulibin|Кулибин
Johannes Gutenberg|Гутенберг
James Watt|Уатт
Mikhail Kalashnikov|Калашников
Wright brothers|Братья Райт
Mikhail Lomonosov|Ломоносов
Vladimir Zworykin|Зворыкин
Igor Sikorsky|Сикорский
Sergei Korolev|Королёв
Pavel Yablochkov|Яблочков
Alexander Lodygin|Лодыгин
Leonardo da Vinci|Леонардо да Винчи|да винчи
Archimedes|Архимед
Benjamin Franklin|Франклин
Alfred Nobel|Нобель
Guglielmo Marconi|Маркони
Samuel Morse|Морзе
Karl Benz|Бенц|карл бенц
Gottlieb Daimler|Даймлер
Rudolf Diesel|Дизель
Henry Ford|Генри Форд
Louis Pasteur|Пастер
Alexander Fleming|Флеминг
Galileo Galilei|Галилей
Isaac Newton|Ньютон
Michael Faraday|Фарадей
Alessandro Volta|Вольта
George Stephenson|Стефенсон
Cherepanov brothers|Черепановы
Ivan Polzunov|Ползунов
Lumière brothers|Братья Люмьер
Louis Daguerre|Дагер
Wilhelm Röntgen|Рентген
Tim Berners-Lee|Тим Бернерс Ли
Steve Jobs|Стив Джобс
Bill Gates|Билл Гейтс
Steve Wozniak|Возняк
Alan Turing|Тьюринг
Charles Babbage|Бэббидж
Blaise Pascal|Паскаль
Gleb Kotelnikov|Котельников
Konstantin Tsiolkovsky|Циолковский
Alexander Mozhaysky|Можайский
Fyodor Pirotsky|Пироцкий
Boris Rosing|Розинг
Leon Theremin|Термен
Alexey Pajitnov|Пажитнов
Vladimir Shukhov|Шухов
Andrei Tupolev|Туполев
Mikhail Dolivo-Dobrovolsky|Доливо Добровольский
Elisha Otis|Отис
Levi Strauss|Леви Страусс
Gideon Sundback|Сундбек
King Gillette|Жиллетт
Joseph Swan|Суон
Hedy Lamarr|Хеди Ламарр
Marie Curie|Мария Кюри
Dmitri Mendeleev|Менделеев
Hero of Alexandria|Герон Александрийский
Cai Lun|Цай Лунь
Eli Whitney|Уитни
Cyrus McCormick|Маккормик
John Logie Baird|Бэрд
Philo Farnsworth|Фарнсворт
Elon Musk|Илон Маск
James Dyson|Дайсон
Percy Spencer|Перси Спенсер
Willis Carrier|Кэрриер
Ernő Rubik|Рубик|эрно рубик""")

cat("famous_painters", "KNOWLEDGE", "history", "Name a famous painter", "Назовите известного художника",
    "A real, well known painter or visual artist: Leonardo da Vinci, Van Gogh, Picasso, Repin, Aivazovsky, Shishkin, Malevich, Rembrandt, Monet, Dalí, Michelangelo, Raphael.",
    "Реальный известный художник: Леонардо да Винчи, Ван Гог, Пикассо, Репин, Айвазовский, Шишкин, Малевич, Рембрандт, Моне, Дали, Микеланджело, Рафаэль, Васнецов, Кандинский, Левитан, Суриков.",
    """Leonardo da Vinci|Леонардо да Винчи|да винчи/леонардо
Vincent van Gogh|Ван Гог
Pablo Picasso|Пикассо
Ilya Repin|Репин
Ivan Aivazovsky|Айвазовский
Ivan Shishkin|Шишкин
Kazimir Malevich|Малевич
Rembrandt|Рембрандт
Claude Monet|Моне
Salvador Dalí|Дали|сальвадор дали
Michelangelo|Микеланджело
Raphael|Рафаэль
Viktor Vasnetsov|Васнецов
Wassily Kandinsky|Кандинский
Isaac Levitan|Левитан
Vasily Surikov|Суриков
Karl Bryullov|Брюллов
Mikhail Vrubel|Врубель
Valentin Serov|Серов
Arkhip Kuindzhi|Куинджи
Ivan Kramskoy|Крамской
Vasily Perov|Перов
Alexei Savrasov|Саврасов
Andrei Rublev|Андрей Рублёв|рублёв
Marc Chagall|Шагал
Nicholas Roerich|Рерих
Boris Kustodiev|Кустодиев
Kuzma Petrov-Vodkin|Петров Водкин
Ivan Bilibin|Билибин
Alexander Ivanov|Александр Иванов
Vasily Vereshchagin|Верещагин
Orest Kiprensky|Кипренский
Vasily Tropinin|Тропинин
Ilya Glazunov|Глазунов
Alexander Deyneka|Дейнека
Pierre-Auguste Renoir|Ренуар
Édouard Manet|Мане
Edgar Degas|Дега
Paul Cézanne|Сезанн
Paul Gauguin|Гоген
Henri Matisse|Матисс
Gustav Klimt|Климт
Edvard Munch|Мунк
Frida Kahlo|Фрида Кало
Andy Warhol|Энди Уорхол
Jackson Pollock|Поллок
René Magritte|Магритт
Joan Miró|Миро
Francisco Goya|Гойя
Diego Velázquez|Веласкес
El Greco|Эль Греко
Albrecht Dürer|Дюрер
Hieronymus Bosch|Босх
Pieter Bruegel|Брейгель
Jan van Eyck|Ван Эйк
Johannes Vermeer|Вермеер
Peter Paul Rubens|Рубенс
Titian|Тициан
Sandro Botticelli|Боттичелли
Caravaggio|Караваджо
Giotto|Джотто
William Turner|Тёрнер
John Constable|Констебл
Eugène Delacroix|Делакруа
Caspar David Friedrich|Фридрих
Georges Seurat|Сёра
Henri de Toulouse-Lautrec|Тулуз Лотрек
Amedeo Modigliani|Модильяни
Piet Mondrian|Мондриан
Banksy|Бэнкси
Hokusai|Хокусай
Roy Lichtenstein|Лихтенштейн
Keith Haring|Кит Харинг
Jean-Michel Basquiat|Баския
Edward Hopper|Хоппер
Mark Rothko|Ротко
Egon Schiele|Шиле
Paul Klee|Клее
Natalia Goncharova|Гончарова
Aristarkh Lentulov|Лентулов
Zinaida Serebriakova|Серебрякова
Alexander Benois|Бенуа
Konstantin Korovin|Коровин
Viktor Popkov|Попков
Alexander Laktionov|Лактионов
Vasily Polenov|Поленов""")

cat("famous_composers", "KNOWLEDGE", "music", "Name a famous composer", "Назовите известного композитора",
    "A real, well known composer of classical, film or popular music: Tchaikovsky, Mozart, Beethoven, Bach, Rachmaninoff, Chopin, Vivaldi, Glinka, Shostakovich, Prokofiev, Hans Zimmer.",
    "Реальный известный композитор: Чайковский, Моцарт, Бетховен, Бах, Рахманинов, Шопен, Вивальди, Глинка, Шостакович, Прокофьев, Римский Корсаков, Мусоргский, Ханс Циммер, Морриконе, Свиридов.",
    """Pyotr Tchaikovsky|Чайковский
Wolfgang Amadeus Mozart|Моцарт
Ludwig van Beethoven|Бетховен
Johann Sebastian Bach|Бах
Sergei Rachmaninoff|Рахманинов
Frédéric Chopin|Шопен
Antonio Vivaldi|Вивальди
Mikhail Glinka|Глинка
Dmitri Shostakovich|Шостакович
Sergei Prokofiev|Прокофьев
Nikolai Rimsky-Korsakov|Римский Корсаков
Modest Mussorgsky|Мусоргский
Hans Zimmer|Ханс Циммер|циммер
Ennio Morricone|Морриконе
Georgy Sviridov|Свиридов
Alexander Borodin|Бородин
Igor Stravinsky|Стравинский
Alexander Scriabin|Скрябин
Aram Khachaturian|Хачатурян
Alfred Schnittke|Шнитке
Isaak Dunayevsky|Дунаевский
Alexandra Pakhmutova|Пахмутова
Raymond Pauls|Раймонд Паулс|паулс
Gennady Gladkov|Гладков
Eduard Artemyev|Артемьев
Mikael Tariverdiev|Таривердиев
Alexander Zatsepin|Зацепин
Maxim Dunayevsky|Максим Дунаевский
Igor Krutoy|Игорь Крутой
Johann Strauss|Штраус
Richard Wagner|Вагнер
Giuseppe Verdi|Верди
Giacomo Puccini|Пуччини
Gioachino Rossini|Россини
Franz Schubert|Шуберт
Robert Schumann|Шуман
Johannes Brahms|Брамс
Franz Liszt|Лист
Felix Mendelssohn|Мендельсон
George Frideric Handel|Гендель
Joseph Haydn|Гайдн
Antonín Dvořák|Дворжак
Edvard Grieg|Григ
Jean Sibelius|Сибелиус
Claude Debussy|Дебюсси
Maurice Ravel|Равель
Camille Saint-Saëns|Сен Санс
Georges Bizet|Бизе
Hector Berlioz|Берлиоз
Gustav Mahler|Малер
Richard Strauss|Рихард Штраус
Niccolò Paganini|Паганини
Erik Satie|Сати
Carl Orff|Орф
George Gershwin|Гершвин
Leonard Bernstein|Бернстайн
John Williams|Джон Уильямс
Howard Shore|Говард Шор
James Horner|Джеймс Хорнер
Danny Elfman|Дэнни Эльфман
Ludovico Einaudi|Эйнауди
Yann Tiersen|Ян Тирсен
Philip Glass|Филип Гласс
Arvo Pärt|Арво Пярт
Andrew Lloyd Webber|Эндрю Ллойд Уэббер
Joe Hisaishi|Хисаиси
Koji Kondo|Кондо
Ramin Djawadi|Рамин Джавади
Vladimir Vavilov|Вавилов
Anton Rubinstein|Рубинштейн
Mily Balakirev|Балакирев
César Cui|Кюи
Alexander Glazunov|Глазунов
Anatoly Lyadov|Лядов
Reinhold Glière|Глиэр
Rodion Shchedrin|Щедрин
Henry Purcell|Пёрселл
Claudio Monteverdi|Монтеверди
Jean-Baptiste Lully|Люлли
Christoph Gluck|Глюк""")

cat("kings_emperors", "KNOWLEDGE", "history", "Name a real king or emperor", "Назовите исторически существовавшего короля или императора",
    "A real historical monarch with the title king, tsar, emperor or similar: Peter the Great, Napoleon, Julius Caesar counts as dictator not emperor, Augustus, Louis XIV, Henry VIII, Ivan the Terrible, Charlemagne.",
    "Реальный исторический монарх: король, царь, император: Пётр Первый, Наполеон, Август, Людовик XIV, Генрих VIII, Иван Грозный, Карл Великий, Екатерина Вторая, Николай Второй, Александр Македонский, Чингисхан.",
    """Peter the Great|Пётр Первый|пётр 1/пётр великий
Napoleon|Наполеон|наполеон бонапарт
Augustus|Октавиан Август|август
Louis XIV|Людовик XIV|людовик 14/король солнце
Henry VIII|Генрих VIII|генрих 8
Ivan the Terrible|Иван Грозный
Charlemagne|Карл Великий
Catherine the Great|Екатерина Вторая|екатерина 2/екатерина великая
Nicholas II|Николай Второй|николай 2
Alexander the Great|Александр Македонский
Genghis Khan|Чингисхан
Alexander I|Александр Первый|александр 1
Alexander II|Александр Второй|александр 2
Alexander III|Александр Третий|александр 3
Nicholas I|Николай Первый|николай 1
Paul I|Павел Первый|павел 1
Elizabeth of Russia|Елизавета Петровна
Anna Ioannovna|Анна Иоанновна
Boris Godunov|Борис Годунов
Michael Romanov|Михаил Фёдорович
Alexis of Russia|Алексей Михайлович
Fyodor I|Фёдор Иоаннович
Ivan III|Иван Третий|иван 3
Vladimir the Great|Владимир Красное Солнышко|князь владимир
Yaroslav the Wise|Ярослав Мудрый
Queen Victoria|Королева Виктория
Elizabeth I|Елизавета Первая
Elizabeth II|Елизавета Вторая
Charles III|Карл Третий
Richard the Lionheart|Ричард Львиное Сердце
William the Conqueror|Вильгельм Завоеватель
Alfred the Great|Альфред Великий
Louis XVI|Людовик XVI|людовик 16
Francis I|Франциск Первый
Henry IV|Генрих IV
Philip II|Филипп II
Charles V|Карл V
Frederick the Great|Фридрих Великий
Wilhelm II|Вильгельм II
Franz Joseph|Франц Иосиф
Maria Theresa|Мария Терезия
Otto the Great|Оттон Великий
Barbarossa|Фридрих Барбаросса
Nero|Нерон
Caligula|Калигула
Marcus Aurelius|Марк Аврелий
Trajan|Траян
Hadrian|Адриан
Constantine the Great|Константин Великий
Justinian|Юстиниан
Diocletian|Диоклетиан
Tutankhamun|Тутанхамон
Ramses II|Рамзес II
Cleopatra|Клеопатра
Cheops|Хеопс
Hammurabi|Хаммурапи
Nebuchadnezzar|Навуходоносор
Cyrus the Great|Кир Великий
Darius|Дарий
Xerxes|Ксеркс
Solomon|Соломон
David|Царь Давид
Herod|Ирод
Qin Shi Huang|Цинь Шихуанди
Kublai Khan|Хубилай
Timur|Тамерлан|тимур
Suleiman the Magnificent|Сулейман Великолепный
Mehmed II|Мехмед Завоеватель
Akbar|Акбар
Shah Jahan|Шах Джахан
Montezuma|Монтесума
Atahualpa|Атауальпа
Meiji|Император Мэйдзи
Hirohito|Хирохито
Haile Selassie|Хайле Селассие
Gustav II Adolf|Густав Адольф
Charles XII|Карл XII
Christian IV|Кристиан IV
Sigismund|Сигизмунд
Casimir the Great|Казимир Великий
Stephen Báthory|Стефан Баторий
Ludwig II|Людвиг Баварский
Pedro II|Педру II
Bokassa|Бокасса
Attila|Аттила
Batu Khan|Батый|хан батый
Oleg|Вещий Олег
Svyatoslav|Святослав
Dmitry Donskoy|Дмитрий Донской
Alexander Nevsky|Александр Невский""",
    "Julius Caesar/Юлий Цезарь/Lenin/Ленин/Stalin/Сталин/Putin/Путин/King Arthur/Король Артур/Mufasa/Муфаса")

cat("explorers", "KNOWLEDGE", "history", "Name a famous traveller or explorer", "Назовите известного путешественника или исследователя",
    "A real, famous traveller, navigator or explorer: Columbus, Magellan, Marco Polo, Vasco da Gama, Cook, Amundsen, Przhevalsky, Miklukho-Maklai, Bering, Afanasy Nikitin, Fyodor Konyukhov, Gagarin as space explorer.",
    "Реальный известный путешественник или исследователь: Колумб, Магеллан, Марко Поло, Васко да Гама, Кук, Амундсен, Пржевальский, Миклухо Маклай, Беринг, Афанасий Никитин, Фёдор Конюхов, Крузенштерн, Хейердал.",
    """Christopher Columbus|Колумб|христофор колумб
Ferdinand Magellan|Магеллан
Marco Polo|Марко Поло
Vasco da Gama|Васко да Гама
James Cook|Джеймс Кук|кук
Roald Amundsen|Амундсен
Nikolai Przhevalsky|Пржевальский
Nicholas Miklouho-Maclay|Миклухо Маклай
Vitus Bering|Беринг
Afanasy Nikitin|Афанасий Никитин
Fyodor Konyukhov|Фёдор Конюхов|конюхов
Adam Johann von Krusenstern|Иван Крузенштерн|крузенштерн/иван фёдорович крузенштерн/Ivan Kruzenshtern
Thor Heyerdahl|Тур Хейердал|хейердал
Yuri Lisyansky|Лисянский
Fabian von Bellingshausen|Беллинсгаузен
Mikhail Lazarev|Лазарев
Semyon Dezhnev|Дежнёв
Yerofey Khabarov|Хабаров
Yermak|Ермак
Pyotr Semyonov-Tyan-Shansky|Семёнов Тян Шанский
Vladimir Arsenyev|Арсеньев
Georgy Sedov|Седов
Ivan Papanin|Папанин
Otto Schmidt|Отто Шмидт
Nikolai Vavilov|Николай Вавилов
Robert Scott|Роберт Скотт
Ernest Shackleton|Шеклтон
Robert Peary|Пири
Fridtjof Nansen|Нансен
Abel Tasman|Тасман
Henry Hudson|Гудзон
Jacques Cartier|Картье
Hernán Cortés|Кортес
Francisco Pizarro|Писарро
Amerigo Vespucci|Америго Веспуччи
Bartolomeu Dias|Бартоломеу Диаш
Francis Drake|Фрэнсис Дрейк
Walter Raleigh|Рэли
David Livingstone|Ливингстон
Henry Morton Stanley|Стэнли
Alexander von Humboldt|Гумбольдт
Charles Darwin|Дарвин
Ibn Battuta|Ибн Баттута
Zheng He|Чжэн Хэ
Leif Erikson|Лейф Эрикссон
Erik the Red|Эрик Рыжий
Edmund Hillary|Хиллари
Tenzing Norgay|Тенцинг Норгей
Reinhold Messner|Месснер
Jacques Cousteau|Кусто|жак ив кусто
Neil Armstrong|Нил Армстронг
Yuri Gagarin|Гагарин|юрий гагарин
Valentina Tereshkova|Терешкова
Alexei Leonov|Леонов
Lewis and Clark|Льюис и Кларк
Hiram Bingham|Бингем
Howard Carter|Говард Картер
Heinrich Schliemann|Шлиман
La Pérouse|Лаперуз
Louis Antoine de Bougainville|Бугенвиль
Matthew Flinders|Флиндерс
Gertrude Bell|Гертруда Белл
Nellie Bly|Нелли Блай
Yuri Senkevich|Юрий Сенкевич|сенкевич
Artur Chilingarov|Чилингаров
Dmitry Shparo|Шпаро
Semyon Chelyuskin|Челюскин
Khariton Laptev|Харитон Лаптев
Dmitry Laptev|Дмитрий Лаптев
Vasily Pronchishchev|Прончищев
Gennady Nevelskoy|Невельской
Pyotr Kozlov|Пётр Козлов
Grigory Potanin|Потанин
Vladimir Obruchev|Обручев
Ivan Moskvitin|Москвитин
Vasily Poyarkov|Поярков""")

# ---------- 19. Unusual language tasks ----------
cat("english_three_letter_words", "WORD_RULE", "vocabulary", "Name an English word with exactly three letters", "Назовите английское слово, состоящее ровно из трёх букв",
    "A real English word with exactly three letters.", "", "", "", langs=["en"], rule=dict(kind="LENGTH", n=3, lang="en"))
cat("english_ing_words", "WORD_RULE", "vocabulary", "Name an English word ending in “ing”", "Назовите английское слово, заканчивающееся на «ING»",
    "A real English word (one word) ending in 'ing', other than 'ing' itself.", "", "", "", langs=["en"], rule=dict(kind="ENDS_WITH", value="ing", lang="en"))
cat("english_x_words", "WORD_RULE", "vocabulary", "Name an English word containing the letter X", "Назовите английское слово, в котором есть буква X",
    "A real English word (one word) containing the letter x.", "", "", "", langs=["en"], rule=dict(kind="CONTAINS", value="x", lang="en"))

cat("english_loanwords_ru", "KNOWLEDGE", "vocabulary", "Name a Russian word borrowed from English", "Назовите русское слово, заимствованное из английского языка",
    "A Russian word taken from English: компьютер, интернет, футбол, бизнес, менеджер, офис, джинсы, клуб, лайк, хобби, уикенд, тренинг, бойкот, спорт, пикник.",
    "Русское слово, пришедшее из английского: компьютер, интернет, футбол, бизнес, менеджер, офис, джинсы, клуб, лайк, хобби, уикенд, тренинг, бойкот, спорт, пикник, смартфон, блог, кекс, свитер, хот дог.",
    """Computer|Компьютер
Internet|Интернет
Football|Футбол
Business|Бизнес
Manager|Менеджер
Office|Офис
Jeans|Джинсы
Club|Клуб
Like|Лайк
Hobby|Хобби
Weekend|Уикенд
Training|Тренинг
Boycott|Бойкот
Sport|Спорт
Picnic|Пикник
Smartphone|Смартфон
Blog|Блог
Cake|Кекс
Sweater|Свитер
Hot dog|Хот дог
Basketball|Баскетбол
Volleyball|Волейбол
Hockey|Хоккей
Boxing|Бокс
Goal|Гол
Penalty|Пенальти
Finish|Финиш
Start|Старт
Record|Рекорд
Leader|Лидер
Meeting|Митинг
Rally|Ралли
Trolleybus|Троллейбус
Tram|Трамвай
Tunnel|Тоннель
Station|Вокзал
Container|Контейнер
Pullover|Пуловер
Shorts|Шорты
Jumper|Джемпер
Sandwich|Сэндвич
Hamburger|Гамбургер
Chips|Чипсы
Pudding|Пудинг
Ketchup|Кетчуп
Beefsteak|Бифштекс
Rostbif|Ростбиф
Toast|Тост
Cocktail|Коктейль
Pub|Паб
Bar|Бар
Shopping|Шопинг
Marketing|Маркетинг
Brand|Бренд
Startup|Стартап
Freelance|Фриланс
Deadline|Дедлайн
Feedback|Фидбэк
Email|Имейл
Online|Онлайн
Offline|Офлайн
Gadget|Гаджет
Laptop|Лэптоп
Printer|Принтер
Scanner|Сканер
File|Файл
Site|Сайт
Login|Логин
User|Юзер
Hacker|Хакер
Spam|Спам
Selfie|Селфи
Hashtag|Хэштег
Post|Пост
Repost|Репост
Follower|Фолловер
Hater|Хейтер
Troll|Тролль
Stream|Стрим
Gamer|Геймер
Player|Плеер
Show|Шоу
Talk show|Ток шоу
Reality show|Реалити шоу
Casting|Кастинг
Hit|Хит
Jazz|Джаз
Rock|Рок
Blues|Блюз
Single|Сингл
Fan|Фанат
Image|Имидж
Interview|Интервью
Press release|Пресс релиз
Rating|Рейтинг
Holding|Холдинг
Dealer|Дилер
Broker|Брокер
Leasing|Лизинг
Offshore|Офшор
Default|Дефолт
Bucks|Баксы
Teenager|Тинейджер
Boyfriend|Бойфренд
Party|Пати
Wow|Вау
Okay|Окей
Cool|Кул
Cringe|Кринж
Lifehack|Лайфхак
Coach|Коуч
Fitness|Фитнес
Bodybuilding|Бодибилдинг
Skateboard|Скейтборд
Snowboard|Сноуборд
Surfing|Сёрфинг
Golf|Гольф
Tennis|Теннис
Cowboy|Ковбой
Gangster|Гангстер
Thriller|Триллер
Horror|Хоррор
Trailer|Трейлер
Comics|Комикс
Bestseller|Бестселлер
Puzzle|Пазл
Pickup|Пикап
Jeep|Джип
Parking|Паркинг
Camping|Кемпинг
Motel|Мотель
Hostel|Хостел
Lobby|Лобби
Dumping|Демпинг
Bowling|Боулинг
Paintball|Пейнтбол
Cracker|Крекер
Pop|Поп
Chat|Чат
Browser|Браузер
Upgrade|Апгрейд
Message|Месседж""")

cat("polysemous_words_ru", "KNOWLEDGE", "vocabulary", "Name a word that has several different meanings", "Назовите слово, у которого есть несколько разных значений",
    "A word with two or more clearly different meanings (homonym or polysemous word): ключ, коса, лук, замок, ручка, мышь, кран, лист, норка, бор, брак, гвоздика, бокс, мир, язык.",
    "Слово с несколькими разными значениями (омоним или многозначное слово): ключ, коса, лук, замок, ручка, мышь, кран, лист, норка, бор, брак, гвоздика, бокс, мир, язык, глава, лисичка, кисть, клуб, пол.",
    """Key|Ключ
Braid|Коса
Bow|Лук
Castle|Замок
Handle|Ручка
Mouse|Мышь
Crane|Кран
Leaf|Лист
Mink|Норка
Pine forest|Бор
Marriage|Брак
Carnation|Гвоздика
Box|Бокс
Peace|Мир
Tongue|Язык
Chapter|Глава
Chanterelle|Лисичка
Brush|Кисть
Club|Клуб
Floor|Пол
Llama|Лама
Bank|Банк
Pen|Перо
Bill|Счёт
Field|Поле
Light|Свет
Shell|Раковина
Bar|Бар
Party|Партия
Bark|Кора
Ring|Кольцо
Star|Звезда
Wave|Волна
Root|Корень
Line|Линия
Organ|Орган
Tank|Танк
Lynx|Рысь
Scythe|Косa
Seal|Печать
Stamp|Марка
Reel|Катушка
Pipe|Труба
Turn|Оборот
Fork|Вилка
Head|Голова
Neck|Горлышко
Foot|Нога
Arm|Рука
Nose|Нос
Sole|Подошва
Board|Доска
Cell|Клетка
Chain|Цепь
Network|Сеть
Window|Окно
Bridge|Мост
Clock|Часы
Hour|Час
Course|Курс
Suit|Костюм
Spirit|Дух
Crown|Корона
Arrow|Стрела
Key note|Тональность
Wing|Крыло
Fire|Огонь
Glass|Стекло
Sight|Вид
Spade|Пики
Heart|Сердце
Pike|Щука
Sentence|Предложение
Will|Воля
Factory|Завод
Basket|Корзина
Sock|Носок
Bagel|Баранка
Rubber|Резинка
Squad|Отряд
Mine|Мина
Cornice|Карниз
Trunk|Ствол
Track|Путь""")

# ---------- 20. Mysticism and riddles ----------
cat("urban_legend_characters", "KNOWLEDGE", "dark", "Name a character from a famous urban legend", "Назовите персонажа известной городской легенды",
    "A character of a well known urban legend or creepypasta: Bloody Mary, Slender Man, the Black Hand, Pikovaya Dama, the Hook Man, the Vanishing Hitchhiker, Kuchisake-onna, Momo, Siren Head, Chupacabra.",
    "Персонаж известной городской легенды или крипипасты: Кровавая Мэри, Слендермен, Чёрная рука, Пиковая дама, Гроб на колёсиках, Красная рука, Зелёные глаза, Человек с крюком, Кутисакэ онна, Момо, Сиреноголовый, Чупакабра.",
    """Bloody Mary|Кровавая Мэри
Slender Man|Слендермен|слендер
Black Hand|Чёрная рука
Queen of Spades|Пиковая дама
Coffin on Wheels|Гроб на колёсиках
Red Hand|Красная рука
Green Eyes|Зелёные глаза
Hook Man|Человек с крюком
Kuchisake-onna|Кутисакэ онна|женщина с разрезанным ртом
Momo|Момо
Siren Head|Сиреноголовый
Chupacabra|Чупакабра
Jeff the Killer|Джефф убийца
Smile Dog|Смайл дог
Hanako-san|Ханако сан
Teke Teke|Тэкэ тэкэ
La Llorona|Плачущая женщина|ла йорона
Mothman|Человек мотылёк
Jersey Devil|Дьявол из Джерси
Bigfoot|Бигфут|снежный человек
Black Volga|Чёрная Волга
Black Monk|Чёрный монах
White Lady|Белая дама
Headless Horseman|Всадник без головы
Spring-heeled Jack|Джек прыгун
Candyman|Кэндимен
Babayka|Бабайка
Pikovaya Dama|Пиковая дама вызов
Gnome Matershinnik|Гномик матершинник
Sweet Gnome|Сладкий гномик
Black Lady|Чёрная дама
Rubber Grandpa|Резиновый дед
Blue Whale|Синий кит
Granny|Бабка из Granny
Huggy Wuggy|Хагги Вагги
Cartoon Cat|Мультяшный кот
Light Head|Светоголовый
Herobrine|Херобрин
Ben Drowned|Утонувший Бен
Squidward suicide|Красный глаз Сквидварда
Rake|Рейк
Wendigo|Вендиго
Skinwalker|Скинуокер
Shadow People|Теневые люди
Black-eyed children|Дети с чёрными глазами
Men in Black|Люди в чёрном
Bunnyman|Человек кролик
Goatman|Человек козёл
Lady in Red|Дама в красном
Bell Witch|Ведьма Белла
Krasue|Красуэ
Aka Manto|Ака манто
Hitchhiker ghost|Призрачная попутчица
Bloody Bones|Кровавые кости
Monster under the bed|Монстр под кроватью
Grey alien|Серый пришелец
Ghost bride|Невеста призрак
Lake Monster|Лох Несское чудовище|несси
Krampus|Крампус
Grudge Girl|Каяко
Samara|Самара
Herobrine Minecraft|Херобрин майнкрафт""")

cat("cursed_fictional_places", "KNOWLEDGE", "dark", "Name a famous fictional cursed place", "Назовите известное вымышленное проклятое место",
    "A cursed, haunted or evil place from fiction (books, films, games): Silent Hill, Overlook Hotel, Amityville house, Mordor, Bates Motel, Derry, the Upside Down, Hogwarts' Forbidden Forest, Pet Sematary, Zona.",
    "Проклятое, жуткое или злое место из книг, фильмов, игр: Сайлент Хилл, отель Оверлук, дом в Эмитивилле, Мордор, мотель Бейтса, Дерри, Изнанка, Запретный лес, Кладбище домашних животных, Зона, Мёртвые болота, Хрустальное озеро.",
    """Silent Hill|Сайлент Хилл
Overlook Hotel|Отель Оверлук
Amityville house|Дом в Эмитивилле
Mordor|Мордор
Bates Motel|Мотель Бейтса
Derry|Дерри
Upside Down|Изнанка
Forbidden Forest|Запретный лес
Pet Sematary|Кладбище домашних животных
The Zone|Зона|зона сталкера
Dead Marshes|Мёртвые болота
Camp Crystal Lake|Хрустальное озеро|лагерь хрустальное озеро
Elm Street|Улица Вязов
Castle Dracula|Замок Дракулы
Hill House|Дом на холме|призрак дома на холме
Shrieking Shack|Визжащая хижина
Azkaban|Азкабан
Moria|Мория
Minas Morgul|Минас Моргул
Barad-dûr|Барад дур
Blair Witch forest|Лес ведьмы из Блэр
Raccoon City|Раккун Сити
Rapture|Восторг|рапчур
Arkham Asylum|Лечебница Аркхем|аркхем
R'lyeh|Рльех
Innsmouth|Иннсмут
Dunwich|Данвич
Sleepy Hollow|Сонная лощина
Castle Wolfenstein|Замок Вольфенштейн
Black Lodge|Чёрный вигвам
Twin Peaks woods|Лес Твин Пикса
Cabin in the woods|Хижина в лесу
Evil Dead cabin|Хижина зловещих мертвецов
Hellmouth|Адская пасть
The Nightmare Realm|Мир кошмаров
Nostromo|Ностромо
Event Horizon|Горизонт событий
Spencer Mansion|Особняк Спенсера
Baker House|Дом Бейкеров
Village of the Damned|Деревня проклятых
Salem's Lot|Салемс Лот
Castle Rock|Касл Рок
Deadwood|Мёртвый лес
Lysaya Gora|Лысая гора
Dikanka|Диканька|хутор близ диканьки
Viy church|Церковь из Вия
Koschei's castle|Царство Кощея
Haunted Mansion|Дом с привидениями
Hotel Cortez|Отель Кортез
Murder House|Дом убийств
Briarcliff|Брайарклифф
The Black Forest|Чёрный лес
Isengard|Изенгард
Mirkwood|Лихолесье
Death Star|Звезда смерти
Hell|Ад
Tartarus|Тартар
Underworld|Подземный мир
Hades|Аид
Cursed Island|Проклятый остров
Flying Dutchman|Летучий голландец
Skull Island|Остров черепа
Isla Nublar|Остров Нублар""")

cat("fictional_detectives", "KNOWLEDGE", "fantasy", "Name a fictional detective", "Назовите вымышленного детектива",
    "A detective or investigator character from books, films, TV or games: Sherlock Holmes, Hercule Poirot, Miss Marple, Columbo, Erast Fandorin, Gleb Zheglov, Inspector Gadget, Scooby-Doo gang, Batman as detective.",
    "Вымышленный детектив или сыщик: Шерлок Холмс, Эркюль Пуаро, Мисс Марпл, Коломбо, Эраст Фандорин, Глеб Жеглов, Инспектор Гаджет, Каменская, Мегрэ, Пинкертон, Ниро Вульф, Конан, Даша Васильева.",
    """Sherlock Holmes|Шерлок Холмс|шерлок
Hercule Poirot|Эркюль Пуаро|пуаро
Miss Marple|Мисс Марпл
Columbo|Коломбо
Erast Fandorin|Эраст Фандорин|фандорин
Gleb Zheglov|Глеб Жеглов|жеглов
Inspector Gadget|Инспектор Гаджет
Anastasia Kamenskaya|Каменская
Jules Maigret|Комиссар Мегрэ|мегрэ
Nat Pinkerton|Нат Пинкертон
Nero Wolfe|Ниро Вульф
Detective Conan|Детектив Конан
Dasha Vasilyeva|Даша Васильева
Dr. Watson|Доктор Ватсон
Sam Spade|Сэм Спейд
Philip Marlowe|Филип Марлоу
Auguste Dupin|Огюст Дюпен
Father Brown|Отец Браун
Jessica Fletcher|Джессика Флетчер
Kolobok detective|Колобки
Pilot Brothers|Братья Пилоты
Inspector Clouseau|Инспектор Клузо
Ace Ventura|Эйс Вентура
Hercule Flambeau|Фламбо
Lisbeth Salander|Лисбет Саландер
Mikael Blomkvist|Микаэль Блумквист
Harry Hole|Харри Холе
Kurt Wallander|Валландер
Adrian Monk|Монк
Patrick Jane|Патрик Джейн|менталист
Rust Cohle|Раст Коул
Fox Mulder|Фокс Малдер|малдер
Dana Scully|Дана Скалли
Dale Cooper|Агент Купер
Veronica Mars|Вероника Марс
Nancy Drew|Нэнси Дрю
Encyclopedia Brown|Энциклопедия Браун
Kalle Blomkvist|Калле Блумквист
Inspector Lestrade|Лестрейд
Batman|Бэтмен
Detective Pikachu|Детектив Пикачу
Judy Hopps|Джуди Хоппс
Basil of Baker Street|Бэзил
Scooby-Doo|Скуби Ду
Fred Jones|Фред
Velma|Велма
Lieutenant Kojak|Коджак
Hank Moody|Детектив Хэнк
Sherlock BBC|Шерлок Камбербэтч
Major Pronin|Майор Пронин
Volodya Sharapov|Шарапов
Lev Gurov|Лев Гуров
Nikolai Larin|Ларин|улицы разбитых фонарей
Glukhar|Глухарь
Alexander Turetsky|Турецкий
Major Grom|Майор Гром
Jack Reacher|Джек Ричер
Robert Langdon|Роберт Лэнгдон
Alex Cross|Алекс Кросс
Lincoln Rhyme|Линкольн Райм
Cormoran Strike|Корморан Страйк
Precious Ramotswe|Мма Рамотсве
Brother Cadfael|Брат Кадфаэль
L|Эл
Shinichi Kudo|Синъити Кудо
Phoenix Wright|Феникс Райт
Max Payne|Макс Пейн
Harry Dresden|Гарри Дрезден
Rick Deckard|Рик Декард
Kogoro Mori|Когоро Мори""")

cat("immortal_characters", "KNOWLEDGE", "fantasy", "Name a fictional character who is immortal", "Назовите вымышленного персонажа, который бессмертен",
    "A fictional or mythological character who cannot die or does not age: Koschei the Deathless, Dracula, Wolverine counts loosely, Duncan MacLeod, Deadpool, Edward Cullen, Thor, Zeus, Highlander, Captain Jack Harkness, Doctor Who.",
    "Вымышленный или мифический персонаж, который бессмертен: Кощей Бессмертный, Дракула, Дункан Маклауд, Дэдпул, Росомаха, Эдвард Каллен, Зевс, Горец, Вечный жид, Летучий голландец, Воланд, Хоттабыч.",
    """Koschei the Deathless|Кощей Бессмертный|кощей
Dracula|Дракула
Duncan MacLeod|Дункан Маклауд|горец
Deadpool|Дэдпул
Wolverine|Росомаха
Edward Cullen|Эдвард Каллен
Zeus|Зевс
Highlander|Горец|коннор маклауд
Wandering Jew|Вечный жид|агасфер
Flying Dutchman|Летучий голландец
Woland|Воланд
Hottabych|Старик Хоттабыч|хоттабыч
Doctor Who|Доктор Кто
Captain Jack Harkness|Капитан Джек Харкнесс
Lestat|Лестат
Louis de Pointe du Lac|Луи
Count Orlok|Граф Орлок|носферату
Lord Voldemort|Волан де Морт
Nicolas Flamel|Николя Фламель
Galadriel|Галадриэль
Legolas|Леголас
Elrond|Элронд
Sauron|Саурон
Gandalf|Гэндальф
Tom Bombadil|Том Бомбадил
Thor|Тор
Loki|Локи
Odin|Один
Superman|Супермен
Wonder Woman|Чудо женщина
Captain Marvel|Капитан Марвел
Ancient One|Древняя
Vandal Savage|Вандал Сэвидж
Ra's al Ghul|Ра'с аль Гул
Mr. Immortal|Мистер Бессмертный
Groot|Грут
Jason Voorhees|Джейсон Вурхиз
Freddy Krueger|Фредди Крюгер
Michael Myers|Майкл Майерс
Chucky|Чаки
Pennywise|Пеннивайз
Dorian Gray|Дориан Грей
Tuck family|Семья Таков
Jack Sparrow cursed|Барбосса проклятый
Davy Jones|Дэви Джонс
Peter Pan|Питер Пэн
Santa Claus|Санта Клаус|дед мороз
Ded Moroz|Дед Мороз
Baba Yaga|Баба Яга
Kashchei|Кащей
Heracles|Геракл
Prometheus|Прометей
Klaus Mikaelson|Клаус Майклсон
Elijah Mikaelson|Элайджа
Damon Salvatore|Деймон Сальваторе
Stefan Salvatore|Стефан Сальваторе
Alucard|Алукард
Kakuzu|Какузу
Hidan|Хидан
Orochimaru|Орочимару
Marceline|Марселин
Death|Смерть
The Doctor|Доктор
Mumm-Ra|Мумм Ра
Imhotep|Имхотеп
Vampire Lestat|Вампир Лестат
Sun Wukong|Сунь Укун|царь обезьян
Merlin|Мерлин
Phoenix|Феникс
Ghost|Призрак
Kratos|Кратос
Dio Brando|Дио Брандо
Endless|Морфей
Morpheus|Морфей сэндмен
Q|Кью
Silver Surfer|Серебряный Сёрфер
Galactus|Галактус
Ego the Living Planet|Эго
Doctor Manhattan|Доктор Манхэттен
Old Guard Andy|Энди Олд Гард""")

cat("mind_readers", "KNOWLEDGE", "fantasy", "Name a fictional character who can read minds", "Назовите вымышленного персонажа, который умеет читать мысли",
    "A fictional character with telepathy or mind reading: Professor X, Jean Grey, Edward Cullen, Matilda is telekinetic, Martian Manhunter, Emma Frost, Snape (legilimency), Voldemort, Eleven, Sookie Stackhouse.",
    "Вымышленный персонаж, читающий мысли (телепат): Профессор Икс, Джин Грей, Эдвард Каллен, Марсианский охотник, Эмма Фрост, Снегг легилименция, Волан де Морт, Одиннадцать, Сьюки Стакхаус.",
    """Professor X|Профессор Икс|чарльз ксавьер/ксавьер
Jean Grey|Джин Грей|феникс
Edward Cullen|Эдвард Каллен
Martian Manhunter|Марсианский охотник
Emma Frost|Эмма Фрост
Severus Snape|Северус Снегг|снейп/снегг
Lord Voldemort|Волан де Морт
Eleven|Одиннадцать|оди
Sookie Stackhouse|Сьюки Стакхаус
Mantis|Богомол
Psylocke|Псайлок
Quentin Quire|Квентин Квайр
Legion|Легион
Saturn Girl|Сатурн гёрл
Raven|Рэйвен
Darth Vader|Дарт Вейдер
Yoda|Йода
Luke Skywalker|Люк Скайуокер
Kylo Ren|Кайло Рен
Obi-Wan Kenobi|Оби Ван Кеноби
River Tam|Ривер Тэм
Matt Parkman|Мэтт Паркман
Aro Volturi|Аро
Sylar|Сайлар
Alisa Selezneva|Алиса Селезнёва|миелофон
Mewtwo|Мьюту
Alakazam|Алаказам
Kadabra|Кадабра
Abra|Абра
Gardevoir|Гардевуар
Mob|Моб|шигео кагеяма
Saiki Kusuo|Сайки Кусуо
Yamanaka Ino|Ино Яманака
Inoichi|Иноичи
Doctor Strange|Доктор Стрэндж
Wanda Maximoff|Ванда Максимофф|алая ведьма
Shadow King|Король теней
Moondragon|Лунный дракон
Gorilla Grodd|Горилла Гродд
Brainiac|Брейниак
Mister Mind|Мистер Разум
Mind Flayer|Свежеватель разума
Illithid|Иллитид
Spock|Спок
Deanna Troi|Диана Трой
Betazoid|Бетазоид
The Doctor|Доктор Кто
Albus Dumbledore|Дамблдор
Queenie Goldstein|Куинни Голдштейн
Bran Stark|Бран Старк
Paul Atreides|Пол Атрейдес
Charles Wallace|Чарльз Уоллес
Danny Torrance|Дэнни Торранс|сияние
Johnny Smith|Джонни Смит
Psycho Mantis|Псих Мантис
Wolf Messing|Мессинг
Oracle|Оракул
Cassandra Nova|Кассандра Нова
Stepford Cuckoos|Степфордские кукушки
Lucy|Люси
Hypnotoad|Гипножаба""")

# ---------- 17. Unusual number conditions (checked by the engine, written in digits) ----------
cat("palindrome_100_999", "NUMERIC_RULE", "logic", "Name a number from 100 to 999 that reads the same both ways", "Назовите число от 100 до 999, которое одинаково читается в обе стороны",
    "A whole number from 100 to 999 that is a palindrome (121, 353, 999), written in digits.", "", "", "", rule=dict(kind="NUM_PALINDROME", value="100-999"))
cat("has_seven_1_100", "NUMERIC_RULE", "logic", "Name a number from 1 to 100 that contains the digit 7", "Назовите число от 1 до 100, в котором есть цифра 7",
    "A whole number from 1 to 100 containing the digit 7 (7, 17, 70, 77), written in digits.", "", "", "", rule=dict(kind="HAS_DIGIT", n=7, value="1-100"))
cat("digit_sum_10", "NUMERIC_RULE", "logic", "Name a three digit number whose digits add up to 10", "Назовите трёхзначное число, сумма цифр которого равна 10",
    "A whole number from 100 to 999 whose digits sum to 10 (109, 235, 550), written in digits.", "", "", "", rule=dict(kind="DIGIT_SUM", n=10, value="100-999"))
cat("first_digit_bigger", "NUMERIC_RULE", "logic", "Name a two digit number whose first digit is bigger than the second", "Назовите двузначное число, в котором первая цифра больше второй",
    "A whole number from 10 to 99 whose first digit is greater than the second (21, 50, 98), written in digits.", "", "", "", rule=dict(kind="FIRST_GT_SECOND", value="10-99"))
cat("div4_not8", "NUMERIC_RULE", "logic", "Name a number from 1 to 100 divisible by 4 but not by 8", "Назовите число от 1 до 100, которое делится на 4, но не делится на 8",
    "A whole number from 1 to 100 divisible by 4 and not by 8 (4, 12, 20, 28), written in digits.", "", "", "", rule=dict(kind="DIVISIBLE_NOT", n=4, value="1-100/8"))
