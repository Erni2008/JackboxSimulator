# THINK OR DIE category content, part T (list 5: questions 34-100, Russian first, compact lists; the AI judges the rest).
from cats_a import cat
from cats_k import ru_rule


def k(id, group, en, ru, crit, lines, inv="", type="KNOWLEDGE", cru=""):
    cat(id, type, group, en, ru, crit, cru or crit, lines, inv)


# ---------- 4. Characters ----------
k("characters_with_pets", "fantasy", "Name a character who has a pet", "Назовите персонажа, у которого есть домашнее животное",
  "A fictional character who owns a pet animal: Harry Potter (Hedwig), Shaggy (Scooby-Doo), Jon Arbuckle (Garfield), Mickey (Pluto), Dorothy (Toto), Wednesday Addams, Malysh (Karlsson no, the dog), Uncle Fyodor (Matroskin, Sharik), Gru (Kyle), Ash (Pikachu).",
  """Harry Potter|Гарри Поттер
Shaggy|Шэгги
Jon Arbuckle|Джон Арбакл
Mickey Mouse|Микки Маус
Dorothy|Элли|дороти
Uncle Fyodor|Дядя Фёдор
Ash Ketchum|Эш Кетчум
Gru|Грю
Hermione Granger|Гермиона
Ron Weasley|Рон Уизли
Hagrid|Хагрид
Wallace|Уоллес
Tintin|Тинтин
Charlie Brown|Чарли Браун
Rapunzel|Рапунцель
Aladdin|Аладдин
Jasmine|Жасмин
Ariel|Ариэль
Lilo|Лило
Kristoff|Кристофф
Hiccup|Иккинг
Pippi Longstocking|Пеппи
Malysh|Малыш
Dennis the Menace|Деннис
Calvin|Кельвин
Gerasim|Герасим
Kashtanka owner|Каштанка
Ash|Эш
John Wick|Джон Уик
Dorothy Gale|Дороти Гейл
Fred Flintstone|Фред Флинтстоун
Mr. Bean|Мистер Бин
Jake the Dog owner|Финн
Gromit owner|Хозяин Громита
Wallace and Gromit|Уоллес и Громит
Frankenweenie|Виктор Франкенштейн
Ellie Fredricksen|Карл Фредриксен
Russell|Рассел
Kiki|Кики
Nobita|Нобита
Phineas|Финес
Ferb|Ферб
Stan Smith|Стэн Смит
Peter Griffin|Питер Гриффин
Bart Simpson|Барт Симпсон
Lisa Simpson|Лиза Симпсон
Homer Simpson|Гомер Симпсон
Jimmy Neutron|Джимми Нейтрон
Geppetto|Джеппетто
Roger Radcliffe|Роджер
Cinderella|Золушка
Mulan|Мулан
Pocahontas|Покахонтас
Moana|Моана
Arya Stark|Арья Старк
Jon Snow|Джон Сноу
Daenerys|Дейенерис""",
  "Batman/Бэтмен/Superman/Супермен/Hulk/Халк")

ru_rule("characters_starting_a_ru", "fantasy", "Name a character whose name starts with “А”", "Назовите персонажа, имя которого начинается на «А»",
  "Вымышленный персонаж (книги, кино, мультфильмы, игры), имя которого начинается на «А»: Алиса, Аладдин, Ариэль, Арагорн, Айболит, Анна Каренина, Аватар Аанг, Аквамен, Астерикс, Анна из Холодного сердца, Асока, Альтрон.",
  """Alice|Алиса
Aladdin|Аладдин
Ariel|Ариэль
Aragorn|Арагорн
Aibolit|Айболит
Anna Karenina|Анна Каренина
Aang|Аанг
Aquaman|Аквамен
Asterix|Астерикс
Anna|Анна
Ahsoka|Асока
Ultron|Альтрон
Athos|Атос
Aramis|Арамис
Arwen|Арвен
Arya Stark|Арья Старк
Abu|Абу
Alyosha Popovich|Алёша Попович
Andrei Bolkonsky|Андрей Болконский
Artemon|Артемон
Alyonushka|Алёнушка
Ali Baba|Али Баба
Akela|Акела
Anubis|Анубис
Achilles|Ахиллес
Aphrodite|Афродита
Athena|Афина
Apollo|Аполлон
Ares|Арес
Artemis|Артемида
Atlas|Атлант
Aurora|Аврора
Asuka|Аска
Arthur|Артур
Alf|Альф
Archie|Арчи
Astro Boy|Астробой
Ant-Man|Антмен|человек муравей
Avatar Korra|Аватар Корра
Anna Elsa|Анна Холодное сердце
Aslan|Аслан
Azog|Азог
Alfred|Альфред
Albus Dumbledore|Альбус Дамблдор
Arthur Weasley|Артур Уизли
Anton Gorodetsky|Антон Городецкий
Azazello|Азазелло
Alice Selezneva|Алиса Селезнёва
Altair|Альтаир
Alucard|Алукард
Abathur|Абатур
Arthas|Артас
Alyx Vance|Аликс Вэнс
Atreus|Атрей
Ahri|Ари
Anivia|Анивия
Abaddon|Абаддон
Alchemist|Алхимик
Ana|Ана
Angela|Ангела
Amélie|Амели
Augustus Gloop|Август Глуп
Atticus Finch|Аттикус Финч
Aibolit doctor|Доктор Айболит
Afonya|Афоня
Anastasia|Анастасия
Agent Smith|Агент Смит
Alan Grant|Алан Грант
Annabelle|Аннабель
Arnold|Арнольд
Ariel Mermaid|Русалочка Ариэль""",
  "", dict(kind="STARTS_WITH", value="а"))

k("armor_characters", "fantasy", "Name a character who wears armour", "Назовите персонажа, который носит броню",
  "A fictional character who wears armour or a power suit: Iron Man, Darth Vader, Master Chief, a knight, Batman (armoured suit), Boba Fett, the Mandalorian, Thor, Black Knight, War Machine, Doomguy, Jaime Lannister, Robocop.",
  """Iron Man|Железный человек
Darth Vader|Дарт Вейдер
Master Chief|Мастер Чиф
Boba Fett|Боба Фетт
The Mandalorian|Мандалорец
War Machine|Воитель
Doomguy|Думгай|думслеер
RoboCop|Робокоп
Batman|Бэтмен
Thor|Тор
Black Knight|Чёрный рыцарь
Jaime Lannister|Джейме Ланнистер
Brienne of Tarth|Бриенна
The Hound|Пёс
Aragorn|Арагорн
Boromir|Боромир
Sauron|Саурон
Witch-king|Король чародей
Stormtrooper|Штурмовик
Darth Revan|Реван
Samus Aran|Самус
Commander Shepard|Шепард
Big Daddy|Большой папочка
Arthas|Артас
Kratos|Кратос
King Arthur|Король Артур
Lancelot|Ланселот
Ilya Muromets|Илья Муромец
Joan of Arc|Жанна д'Арк
Shredder|Шреддер
Iron Monger|Железный торговец
Ironheart|Железное сердце
Captain America|Капитан Америка
Wonder Woman|Чудо женщина
Ares|Арес
Deathstroke|Детстроук
Darkseid|Дарксайд
Doctor Doom|Доктор Дум
Ultron|Альтрон
Crimson Dynamo|Красное динамо
Space Marine|Космодесантник
Judge Dredd|Судья Дредд
Mandalorians|Мандалорцы
Captain Phasma|Капитан Фазма
Kylo Ren|Кайло Рен
Guts|Гатс
Alphonse Elric|Альфонс Элрик
Knight Artorias|Арториас
Solaire|Солер
Link|Линк
He-Man|Хи мен
Saint Seiya|Рыцари зодиака
Paladin|Паладин
Crusader|Крестоносец
Templar|Тамплиер
Samurai|Самурай
Spartan|Спартанец
Gladiator|Гладиатор
Dobrynya|Добрыня Никитич
Alyosha|Алёша Попович
Tin Man|Железный дровосек
Rocketeer|Ракетчик
Steel|Сталь
Iron Patriot|Железный патриот
Rescue|Спасительница
Nova|Нова
Black Panther|Чёрная пантера
Ant-Man|Человек муравей
Wasp|Оса
Falcon|Сокол
Mazinger|Мазингер""",
  "Superman/Супермен/Spider-Man/Человек паук/Harry Potter/Гарри Поттер/Hulk/Халк")

k("scientist_characters", "fantasy", "Name a fictional character who is a scientist", "Назовите вымышленного персонажа, который является учёным",
  "A fictional character who is a scientist, inventor or professor: Doc Brown, Rick Sanchez, Bruce Banner, Tony Stark, Professor Preobrazhensky, Victor Frankenstein, Dexter, Sheldon Cooper, Dr. Jekyll, Professor X, Jimmy Neutron, Walter White, Professor Farnsworth, Doctor Octopus.",
  """Doc Brown|Док Браун|эммет браун
Rick Sanchez|Рик Санчез
Bruce Banner|Брюс Беннер
Tony Stark|Тони Старк
Professor Preobrazhensky|Профессор Преображенский
Victor Frankenstein|Виктор Франкенштейн
Dexter|Декстер
Sheldon Cooper|Шелдон Купер
Dr. Jekyll|Доктор Джекилл
Professor X|Профессор Икс
Jimmy Neutron|Джимми Нейтрон
Walter White|Уолтер Уайт
Professor Farnsworth|Профессор Фарнсворт
Doctor Octopus|Доктор Осьминог
Reed Richards|Рид Ричардс
Hank Pym|Хэнк Пим
Curt Connors|Курт Коннорс
Otto Octavius|Отто Октавиус
Dr. Emmett Brown|Эммет Браун
Leonard Hofstadter|Леонард Хофстедтер
Gordon Freeman|Гордон Фримен
Dr. Moreau|Доктор Моро
Dr. Strangelove|Доктор Стрейнджлав
Professor Moriarty|Профессор Мориарти
Captain Nemo|Капитан Немо
Professor Challenger|Профессор Челленджер
Professor Dowell|Профессор Доуэль
Engineer Garin|Инженер Гарин
Electronic's Professor Gromov|Профессор Громов
Professor Seleznev|Профессор Селезнёв
Shurik|Шурик|шурик инженер
Ross Geller|Росс Геллер
Abby Sciuto|Эбби Шуто
Dr. Ian Malcolm|Ян Малкольм
Dr. Alan Grant|Алан Грант
Ellie Sattler|Элли Сэттлер
Dr. Manhattan|Доктор Манхэттен
Professor Utonium|Профессор Утониум
Dr. Doofenshmirtz|Доктор Фуфелшмертц
Dr. Nefario|Доктор Нефарио
Flint Lockwood|Флинт Локвуд
Hiro Hamada|Хиро Хамада
Tadashi|Тадаши
Q|Кью
Spock|Спок
Dr. Who|Доктор Кто
Professor Calculus|Профессор Турнесоль
Dr. Frankenstein|Доктор Франкенштейн
Dr. Henry Wu|Генри Ву
Indiana Jones|Индиана Джонс
Kryptonian Jor-El|Джор Эл
Dr. Erskine|Доктор Эрскин
Arnim Zola|Арним Зола
Dr. Light|Доктор Лайт
Dr. Wily|Доктор Вайли
Dr. Eggman|Доктор Эггман|роботник
Dr. Ivo Robotnik|Доктор Роботник
Professor Oak|Профессор Оук
Dr. Neo Cortex|Доктор Нео Кортекс
Dr. Breen|Доктор Брин
Wernher|Профессор Персиков
Professor Persikov|Персиков
Paganel|Паганель
Professor Lidenbrock|Профессор Лиденброк""",
  "Harry Potter/Гарри Поттер/Superman/Супермен/Batman/Бэтмен/Shrek/Шрек")

k("ghost_spirit_characters", "fantasy", "Name a character who is a ghost or a spirit", "Назовите персонажа, который является призраком или духом",
  "A fictional ghost, phantom or spirit character: Casper, Nearly Headless Nick, Moaning Myrtle, the Canterville Ghost, Slimer, Danny Phantom, Patrick Swayze's Sam in Ghost, Jacob Marley, Bloody Baron, Hamlet's father's ghost, Beetlejuice, No-Face, Obi-Wan's Force ghost.",
  """Casper|Каспер
Nearly Headless Nick|Почти Безголовый Ник
Moaning Myrtle|Плакса Миртл
The Canterville Ghost|Кентервильское привидение
Slimer|Лизун
Danny Phantom|Дэнни Фантом
Sam Wheat|Сэм из Привидения
Jacob Marley|Джейкоб Марли
Bloody Baron|Кровавый Барон
Hamlet's father|Призрак отца Гамлета
Beetlejuice|Битлджус
No-Face|Безликий
Obi-Wan Kenobi ghost|Призрак Оби Вана
The Grey Lady|Серая Дама
The Fat Friar|Толстый Монах
Peeves|Пивз
Professor Binns|Профессор Биннс
Ghost of Christmas Past|Дух прошлого Рождества
Ghost of Christmas Present|Дух нынешнего Рождества
Ghost of Christmas Yet to Come|Дух будущего Рождества
Headless Horseman|Всадник без головы
Flying Dutchman|Летучий голландец
Phantom of the Opera|Призрак оперы
Boo|Бу
Pac-Man ghosts|Призраки из Пакмана|блинки
Blinky|Блинки
King Boo|Король Бу
Deadman|Дэдмэн
The Spectre|Спектр
Kesha Ghost|Привидение с мотором
Little Ghost|Маленькое привидение
Bloody Mary|Кровавая Мэри
Samara|Самара
Kayako|Каяко
Toshio|Тошио
Sadako|Садако
The White Lady|Белая дама
Mavka|Мавка
Rusalka|Русалка
Domovoy|Домовой
Banshee|Банши
Poltergeist|Полтергейст
Wraith|Призрак рейф
Specter|Спектр призрак
Will-o'-the-wisp|Блуждающий огонёк
Yurei|Юрэй
Onryo|Онрё
Kodama|Кодама
Mr. Boogedy|Мистер Бугеди
Fatso|Толстяк из Каспера
Stretch|Стретч
Stinkie|Вонючка
Ghostbusters Gozer|Гозер
Zuul|Зуул
Lady Kat|Кэтрин призрак
Spirit|Дух
Spirit of the Forest|Дух леса
Shikigami|Сикигами
Hollow|Пустой
Ghost Lizzie|Лиззи призрак
Captain Hector|Капитан призрак
Ghost pirate|Пират призрак
Davy Jones crew|Команда Летучего голландца""",
  "Dracula/Дракула/Zombie/Зомби/Werewolf/Оборотень/Frankenstein/Франкенштейн")

k("characters_with_vehicle", "fantasy", "Name a character who has their own vehicle", "Назовите персонажа, у которого есть собственный транспорт",
  "A fictional character known for their own vehicle (car, ship, broom, spaceship, sleigh): Batman (Batmobile), Han Solo (Millennium Falcon), Doc Brown (DeLorean), Mr. Bean (Mini), Santa Claus (sleigh), Baba Yaga (mortar), Harry Potter (broom), Jack Sparrow (Black Pearl), Captain Nemo (Nautilus), Lightning McQueen is a car.",
  """Batman|Бэтмен
Han Solo|Хан Соло
Doc Brown|Док Браун
Mr. Bean|Мистер Бин
Santa Claus|Санта Клаус|дед мороз
Baba Yaga|Баба Яга
Harry Potter|Гарри Поттер
Jack Sparrow|Джек Воробей
Captain Nemo|Капитан Немо
James Bond|Джеймс Бонд
Knight Rider Michael Knight|Майкл Найт
Ghost Rider|Призрачный гонщик
Dominic Toretto|Доминик Торетто
Mad Max|Безумный Макс
Fred Flintstone|Фред Флинтстоун
Scooby gang Fred|Фред из Скуби Ду
Hagrid|Хагрид
Arthur Weasley|Артур Уизли
Emelya|Емеля
Aladdin|Аладдин
Captain Vrungel|Капитан Врунгель
Captain Kirk|Капитан Кирк
Luke Skywalker|Люк Скайуокер
Speed Racer|Спиди гонщик
Penelope Pitstop|Пенелопа Питстоп
Dick Dastardly|Дик Дастардли
Professor Farnsworth|Профессор Фарнсворт
Leela|Лила
The Doctor|Доктор Кто
Willy Wonka|Вилли Вонка
Cinderella|Золушка
Wonder Woman|Чудо женщина
Green Goblin|Зелёный гоблин
Gru|Грю
Shaggy|Шэгги
Homer Simpson|Гомер Симпсон
Postman Pat|Почтальон Пэт
Fireman Sam|Пожарный Сэм
Bob the Builder|Боб строитель
Little Humpbacked Horse Ivan|Иван на Коньке
Dunno|Незнайка
Vintik|Винтик
Shpuntik|Шпунтик
Pechkin|Почтальон Печкин
Uncle Fyodor|Дядя Фёдор
Captain Hook|Капитан Крюк
Captain Jack Harkness|Капитан Харкнесс
Tony Stark|Тони Старк
Bruce Wayne|Брюс Уэйн
Ace Ventura|Эйс Вентура
Bumblebee driver Sam|Сэм Уитвики
Lara Croft|Лара Крофт
Agent K|Агент Кей
Wallace|Уоллес
Spike Spiegel|Спайк Шпигель
Kiki|Кики
Marty McFly|Марти Макфлай
Mary Poppins|Мэри Поппинс
Snoopy|Снупи
Goofy|Гуфи
Donald Duck|Дональд Дак
Mickey Mouse|Микки Маус
Barbie|Барби
Ken|Кен""",
  "Superman/Супермен/Flash/Флэш/Hulk/Халк")

# ---------- 5. Food ----------
k("egg_dishes", "food", "Name a dish that contains eggs", "Назовите блюдо, в состав которого входят яйца",
  "A dish that contains eggs as an ingredient: omelette, fried eggs, scrambled eggs, Olivier salad, carbonara, quiche, pancakes, French toast, eggs Benedict, mimosa salad, Caesar sauce, egg sandwich, shakshuka, frittata, meringue, custard.",
  """Omelette|Омлет
Fried eggs|Яичница|глазунья
Scrambled eggs|Болтунья|скрэмбл
Olivier salad|Оливье
Carbonara|Карбонара
Quiche|Киш
Pancakes|Блины
French toast|Гренки
Eggs Benedict|Яйца Бенедикт
Mimosa salad|Мимоза
Caesar salad|Цезарь
Shakshuka|Шакшука
Frittata|Фриттата
Meringue|Безе
Custard|Заварной крем
Deviled eggs|Фаршированные яйца
Scotch eggs|Яйца по шотландски
Egg salad|Яичный салат
Okroshka|Окрошка
Herring under fur coat|Селёдка под шубой
Crab salad|Крабовый салат
Fried rice|Жареный рис
Pad thai|Пад тай
Ramen|Рамен
Tamagoyaki|Тамагояки
Oyakodon|Оякодон
Egg drop soup|Яичный суп
Syrniki|Сырники
Draniki|Драники
Cutlets|Котлеты
Casserole|Запеканка
Eggnog|Гоголь моголь
Mayonnaise|Майонез
Tiramisu|Тирамису
Sponge cake|Бисквит
Charlotte|Шарлотка
Crème brûlée|Крем брюле
Flan|Флан
Soufflé|Суфле
Huevos rancheros|Уэвос ранчерос
Tortilla española|Испанская тортилья
Kugel|Кугель
Khachapuri Adjarian|Хачапури по аджарски
Egg sandwich|Сэндвич с яйцом
Sorrel soup|Щавелевый суп
Green borscht|Зелёный борщ
Nicoise salad|Нисуаз
Kedgeree|Кеджери
Bibimbap|Пибимпап
Waffles|Вафли
Crêpes|Крепы
Muffins|Маффины
Brioche|Бриошь
Pasta|Домашняя лапша
Pelmeni dough|Тесто для пельменей
Pirozhki with egg|Пирожки с яйцом и луком
Kulebyaka|Кулебяка
Lazy vareniki|Ленивые вареники""")

k("grill_dishes", "food", "Name a dish traditionally cooked on a grill", "Назовите блюдо, которое традиционно готовят на гриле",
  "A dish traditionally cooked on a grill, barbecue or open fire: shashlik, steak, burgers, kebab, grilled sausages, ribs, lyulya kebab, grilled corn, grilled fish, BBQ chicken, souvlaki, satay, yakitori, churrasco.",
  """Shashlik|Шашлык|шашлычок
Steak|Стейк
Burger|Бургер
Kebab|Кебаб
Grilled sausages|Колбаски гриль|сосиски на гриле
Ribs|Рёбрышки|свиные рёбра
Lyulya kebab|Люля кебаб
Grilled corn|Кукуруза гриль
Grilled fish|Рыба на гриле
BBQ chicken|Курица гриль|курица барбекю
Souvlaki|Сувлаки
Satay|Сатай
Yakitori|Якитори
Churrasco|Чураско
Grilled vegetables|Овощи гриль
Grilled mushrooms|Шампиньоны на мангале
Brisket|Брискет
Pulled pork|Пулд порк
Hot dog|Хот дог
Bratwurst|Братвурст
Tandoori chicken|Тандури
Seekh kebab|Сикх кебаб
Adana kebab|Адана кебаб
Shish kebab|Шиш кебаб
Chevapchichi|Чевапчичи
Pljeskavica|Плескавица
Bulgogi|Пулькоги
Galbi|Кальби
Asado|Асадо
Suya|Суя
Grilled salmon|Лосось на гриле
Grilled shrimp|Креветки гриль
Grilled halloumi|Халуми на гриле
Baked potato in foil|Картошка в фольге
Tomahawk steak|Томагавк
Ribeye|Рибай
T-bone|Ти бон
Chicken wings|Крылышки
Chicken thighs|Бёдрышки гриль
Lamb chops|Каре ягнёнка
Kupaty|Купаты
Khorovats|Хоровац
Mtsvadi|Мцвади
Tikka|Тикка
Peri-peri chicken|Курица пири пири
Jerk chicken|Курица джерк
Smash burger|Смэш бургер
Grilled cheese|Сыр гриль
Skewered vegetables|Овощи на шпажках
Grilled eggplant|Баклажаны на мангале
Grilled peppers|Перцы на гриле
Grilled pineapple|Ананас гриль
Barbecue|Барбекю
Kofta|Кофта
Gyros|Гирос
Fajitas|Фахитас
Anticuchos|Антикучос
Robatayaki|Робатаяки""")

ru_rule("food_starting_s_ru", "food", "Name a food whose Russian name starts with “С”", "Назовите продукт питания, название которого начинается на «С»",
  "Продукт питания или еда на букву «С»: сыр, сахар, соль, сметана, сосиски, сливки, сало, салат, суп, слива, свёкла, сельдь, сок, сухари, спаржа, сельдерей.",
  """Cheese|Сыр
Sugar|Сахар
Salt|Соль
Sour cream|Сметана
Sausages|Сосиски
Cream|Сливки
Lard|Сало
Salad|Салат
Soup|Суп
Plum|Слива
Beetroot|Свёкла
Herring|Сельдь|селёдка
Juice|Сок
Rusks|Сухари
Asparagus|Спаржа
Celery|Сельдерей
Butter|Сливочное масло
Syrup|Сироп
Soy|Соя
Soy sauce|Соевый соус
Sardine|Сардина
Salmon|Сёмга
Catfish|Сом
Perch|Судак
Pork|Свинина
Sausage|Салями
Sandwich|Сэндвич
Cheesecake pancakes|Сырники
Curd snack|Сырок
Shortbread|Сушки
Dried fruit|Сухофрукты
Sesame|Семечки
Seeds|Семена льна
Currant|Смородина
Raisins|Султанина
Sushi|Суши
Spaghetti|Спагетти
Sauce|Соус
Smoothie|Смузи
Sorbet|Сорбет
Soufflé|Суфле
Sweets|Сладости
Condensed milk|Сгущёнка
Satsivi|Сациви
Solyanka|Солянка
Sour cabbage|Солёные огурцы
Salted fish|Солёная рыба
Saury|Сайра
Smetana sauce|Сметанный соус
Cereal|Сухой завтрак
Seaweed|Салат из морской капусты
Sorghum|Сорго
Sudak|Судачок
Sea bass|Сибас
Saira|Сайра в масле
Sagovnik|Саго
Salami|Салями
Samsa|Самса""",
  "", dict(kind="STARTS_WITH", value="с"))

k("cheese_dishes", "food", "Name a dish that uses cheese", "Назовите блюдо, в котором используется сыр",
  "A dish containing cheese: pizza, lasagna, cheeseburger, khachapuri, fondue, mac and cheese, quesadilla, Caesar salad, Greek salad, syrniki (curd), cheesecake, carbonara (pecorino), gratin, nachos, raclette, croque monsieur, tiramisu (mascarpone).",
  """Pizza|Пицца
Lasagna|Лазанья
Cheeseburger|Чизбургер
Khachapuri|Хачапури
Fondue|Фондю
Mac and cheese|Макароны с сыром|мак н чиз
Quesadilla|Кесадилья
Caesar salad|Цезарь
Greek salad|Греческий салат
Cheesecake|Чизкейк
Carbonara|Карбонара
Gratin|Гратен
Nachos|Начос
Raclette|Раклет
Croque monsieur|Крок месье
Tiramisu|Тирамису
Grilled cheese|Сырный сэндвич
Cheese soup|Сырный суп
Risotto|Ризотто
Caprese|Капрезе
Pasta Alfredo|Паста Альфредо
Four cheese pizza|Пицца четыре сыра
Margherita|Маргарита
Calzone|Кальцоне
Cannelloni|Каннеллони
Ravioli|Равиоли
Tortellini|Тортеллини
Moussaka|Мусака
Spanakopita|Спанакопита
Burek|Бурек
Cheese sticks|Сырные палочки
Saganaki|Сагнаки
Halloumi|Жареный халуми
Paneer tikka|Панир тикка
Palak paneer|Палак панир
Poutine|Путин
Enchiladas|Энчилады
Burrito|Буррито
Tacos|Тако
Philly cheesesteak|Филли чизстейк
Cordon bleu|Кордон блю
Meat French style|Мясо по французски
Julienne|Жульен
Cheese pancakes|Сырники
Vatrushka|Ватрушка
Cheese balls|Сырные шарики
Penovani|Пеновани
Ossetian pie|Осетинский пирог
Elarji|Эларджи
Achma|Ачма
Kutab with cheese|Кутабы с сыром
Lavash rolls|Рулетики из лаваша с сыром
Stuffed peppers|Перец фаршированный сыром
Cheese omelette|Омлет с сыром
Croquettes|Крокеты с сыром
Quiche Lorraine|Киш Лорен
Tartiflette|Тартифлет
Welsh rarebit|Валлийский раребит
Cacio e pepe|Качо э пепе
Parmigiana|Пармиджана
Eggplant parmesan|Баклажаны с пармезаном
Garlic bread|Чесночный хлеб с сыром
Toast with cheese|Бутерброд с сыром""")

k("candy_shop_items", "food", "Name something you can buy in a sweet shop", "Назовите то, что можно купить в магазине сладостей",
  "A product sold in a sweet or candy shop: chocolate, sweets, lollipop, marmalade, gummy bears, marshmallow, zefir, halva, toffee, caramel, cotton candy, chewing gum, cookies, waffles, cake, macarons, pastila, nougat, jelly beans.",
  """Chocolate|Шоколад
Sweets|Конфеты
Lollipop|Леденец|чупа чупс
Marmalade|Мармелад
Gummy bears|Мармеладные мишки
Marshmallow|Маршмеллоу
Zefir|Зефир
Halva|Халва
Toffee|Ириска|ирис
Caramel|Карамель
Cotton candy|Сахарная вата
Chewing gum|Жвачка
Cookies|Печенье
Waffles|Вафли
Cake|Торт
Macarons|Макаруны|макарон
Pastila|Пастила
Nougat|Нуга
Jelly beans|Драже
Chocolate bar|Шоколадный батончик
Kinder Surprise|Киндер сюрприз
Bird's milk|Птичье молоко
Turkish delight|Рахат лукум
Baklava|Пахлава
Gingerbread|Пряник
Truffles|Трюфели
Pralines|Пралине
Lollipop cockerel|Петушок на палочке
Candy cane|Карамельная трость
M&M's|Эм энд эмс
Skittles|Скиттлс
Snickers|Сникерс
Twix|Твикс
Mars|Марс
Bounty|Баунти
KitKat|Кит кат
Alyonka|Алёнка
Mishka Kosolapy|Мишка косолапый
Chupa Chups|Чупа чупс
Kozinaki|Козинаки
Sherbet|Щербет
Candied fruit|Цукаты
Dragee|Драже орешки
Chocolate eggs|Шоколадные яйца
Fudge|Помадка
Brittle|Грильяж
Churchkhela|Чурчхела
Lokum|Лукум
Pop rocks|Взрывная карамель
Sour candy|Кислые конфеты
Licorice|Лакрица
Mints|Мятные конфеты
Eclair|Эклер
Cupcake|Капкейк
Donut|Пончик
Brownie|Брауни
Ice cream|Мороженое
Cinnamon roll|Синнабон
Profiteroles|Профитроли""")

k("soup_types", "food", "Name a type of soup", "Назовите разновидность супа",
  "A real kind of soup: borscht, shchi, solyanka, ukha, okroshka, rassolnik, kharcho, chicken noodle, mushroom soup, pea soup, tom yum, ramen, minestrone, gazpacho, cream soup, onion soup, pho, miso soup, lagman, shurpa.",
  """Borscht|Борщ
Shchi|Щи
Solyanka|Солянка
Ukha|Уха
Okroshka|Окрошка
Rassolnik|Рассольник
Kharcho|Харчо
Chicken noodle soup|Куриный суп с лапшой|куриная лапша
Mushroom soup|Грибной суп
Pea soup|Гороховый суп
Tom yum|Том ям
Ramen|Рамен
Minestrone|Минестроне
Gazpacho|Гаспачо
Cream soup|Крем суп|суп пюре
Onion soup|Луковый суп
Pho|Фо бо
Miso soup|Мисо суп
Lagman|Лагман
Shurpa|Шурпа
Botvinya|Ботвинья
Svekolnik|Свекольник
Kholodnik|Холодник
Bouillon|Бульон
Cheese soup|Сырный суп
Pumpkin soup|Тыквенный суп
Tomato soup|Томатный суп
Clam chowder|Клэм чаудер
Bouillabaisse|Буйабес
Goulash soup|Гуляш суп
Lentil soup|Чечевичный суп
Bean soup|Фасолевый суп
Chikhirtma|Чихиртма
Bozbash|Бозбаш
Piti|Пити
Khash|Хаш
Mastava|Мастава
Dushbara|Душбара
Tom kha|Том кха
Laksa|Лакса
Wonton soup|Суп с вонтонами
Hot and sour soup|Кисло острый суп
Gumbo|Гамбо
Vichyssoise|Вишисуаз
Avgolemono|Авголемоно
Harira|Харира
Mulligatawny|Маллигатони
Zurek|Журек
Kapustnyak|Капустняк
Kulesh|Кулеш
Zatirukha|Затируха
Milk soup|Молочный суп
Noodle soup|Суп лапша
Meatball soup|Суп с фрикадельками
Fish soup|Рыбный суп
Seafood soup|Суп из морепродуктов
Broccoli soup|Суп из брокколи
Spinach soup|Шпинатный суп
Sorrel soup|Щавелевый суп
Tarator|Таратор
Beef soup|Говяжий суп""")
