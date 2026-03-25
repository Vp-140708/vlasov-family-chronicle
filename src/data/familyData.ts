export type BranchType = "paternal" | "maternal" | "both";

export interface FamilyMember {
  id: string;
  name: string;
  years: string;
  title: string;
  branch: BranchType;
  bio: string;
  achievements?: string[];
  possessions?: string;
  appearance?: string;
  character?: string[];
  medical?: string[];
  generation: number;
  fatherId?: string | null;
  motherId?: string | null;
  spouseId?: string | null;
  gender: "m" | "f";
}

export const familyMembers: FamilyMember[] = [
  // ===========================================================================
  // ВЕТВЬ ЯСТРЕМСКИХ И ПОЛЯКОВЫХ (ПАПИНА ЛИНИЯ)
  // ===========================================================================
  
  {
    id: "stefan_y", name: "Стефан Ястремский", years: "кон. XVIII в. — сер. XIX в.", title: "Священник (Основатель)", branch: "paternal", generation: 0, gender: "m",
    bio: "Родоначальник 150-летней династии харьковских священнослужителей. Служил в храмах Слобожанщины.",
    character: ["Образованность", "Духовное лидерство"]
  },
  {
    id: "ivan_y", name: "Иван Степанович Ястремский", years: "~1820 — ?", title: "Священник", branch: "paternal", generation: 1, gender: "m", fatherId: "stefan_y",
    bio: "Продолжатель династии. Служил в Харьковской епархии в первой половине XIX века."
  },
  {
    id: "mark_p", name: "Марк Поляков", years: "~1820 — ?", title: "Купец (Основатель ветви)", branch: "paternal", generation: 1, gender: "m",
    bio: "Представитель купеческого рода. Вероятно, родной или двоюродный брат легендарных банкиров Поляковых (Лазаря и Самуила)."
  },
  {
    id: "dmitriy_y", name: "Дмитрий Иванович Ястремский", years: "~1840 — после 1904", title: "Священник Вознесенской церкви", branch: "paternal", generation: 2, gender: "m", fatherId: "ivan_y",
    bio: "Служил в селе Дерюгино. К 1904 году числился заштатным священником. Воспитал 8 сыновей, передав им тягу к знаниям.",
    character: ["Традиционализм", "Педагогический дар"]
  },
  {
    id: "karp_p", name: "Карп Маркович Поляков", years: "~1850 — ?", title: "Рядовой / Мещанин", branch: "paternal", generation: 2, gender: "m", fatherId: "mark_p",
    bio: "Отец Татьяны Поляковой. Официально числился рядовым по чину. Жил в д. Забонь (Калужская губ.). Был очень строг, из-за чего сын и дочь позже переехали в Одессу к богатому дяде."
  },
  {
    id: "elena_p", name: "Елена Константиновна Полякова (дев. неизвестна)", years: "~1850 — ?", title: "Мать Татьяны", branch: "paternal", generation: 2, gender: "f",
    bio: "Жена Карпа Марковича. Проживала в Калужской губернии, позже в Одессе."
  },
  {
    id: "semyon_y", name: "Семен Дмитриевич Ястремский", years: "1860 — 1936", title: "Священник-бунтарь / Модельер", branch: "paternal", generation: 3, gender: "m", fatherId: "dmitriy_y",
    bio: "Родился в Харькове. Окончил семинарию, служил священником, но по идейным соображениям ушел в протестанты. После революции переехал в Миллерово, спасая семью от гонений. 02.01.1927 г. вступил в артель 'Великой армии труда'. О детях говорил: 'У меня пять роз и два фикуса'.",
    appearance: "Высокий, очень красивый, кудрявый, греческий нос, выразительные глаза.",
    achievements: ["Создал крупное ателье в Миллерово", "Воспитал 7 детей"],
    possessions: "Двухэтажный дом в Миллерово, прислуга, закупка продуктов подводами.",
    character: ["Бунтарь", "Талант к кройке и шитью", "Смелость"],
    medical: ["Умер от кровоизлияния в мозг (атеросклероз)"]
  },
  {
    id: "tatyana_p", name: "Ястремская (дев. Полякова) Татьяна Карповна", years: "11.01.1886 — 1962", title: "Модельер Императорского двора", branch: "paternal", generation: 3, gender: "f", fatherId: "karp_p", motherId: "elena_p", spouseId: "semyon_y",
    bio: "Окончила гимназию и курсы кройки с красным дипломом. Племянница одесского магната Михаила Полякова (ул. Еврейская, 4). Открыла ателье в Одессе. Летом выезжала в Крым (Алупка, Ялта), где шила наряды для русской знати и Императорской семьи в Воронцовском дворце.",
    character: ["Безупречный вкус", "Светские манеры", "Заботливая мать"],
    medical: ["Еврейские корни", "Умерла в Таганроге в 72 года"]
  },
  {
    id: "zinoviy_y", name: "Ястремский Зиновий (Зенон) Семенович", years: "21.11.1912 — апр. 1991", title: "Инженер / Ветеран ВОВ", branch: "paternal", generation: 4, gender: "m", fatherId: "semyon_y", motherId: "tatyana_p",
    bio: "Имя Зенон получил от отца-бунтаря, но в документах стал Зиновием. В юности — босяк и драчун. Окончил Воронежский СХИ 17.06.1941 (диплом №566546). В октябре 1941 окончил курсы военных техников при Академии БТ и МВ им. Сталина. Служил в 138-м автобатальоне и 344-м ОМСБ. Ремонтировал технику под огнем на Малой Земле, Курской дуге и Сиваше. Дошел до Берлина, расписался на Бранденбургских воротах. После войны — инженер в Джубгском лесничестве.",
    achievements: ["Орден Красной Звезды №1366223", "Медали за Сталинград, Варшаву, Берлин", "Наградной наган №24713"],
    character: ["Охотник", "Рыбак", "Футбольный болельщик", "Скромность"],
    medical: ["Язва желудка", "Туберкулез", "ПТСР", "Умер от атеросклероза на 80-м году жизни"]
  },
  {
    id: "pavel_y_bro", name: "Ястремский Павел Семенович", years: "1911 — 1994", title: "Профессор физической химии", branch: "paternal", generation: 4, gender: "m", fatherId: "semyon_y",
    bio: "Участник ВОВ, младший лейтенант запаса. Стал выдающимся ученым в Волгограде. Один из создателей диэлектрического метода в химии. Упоминается во всех академических справочниках.",
    achievements: ["Профессор, кандидат с/х наук", "Основатель научной школы"],
    character: ["Интеллект", "Трудолюбие"]
  },
  {
    id: "konstantin_y", name: "Ястремский Константин Павлович", years: "род. ~1945", title: "Ученый РАН", branch: "paternal", generation: 5, gender: "m", fatherId: "pavel_y_bro",
    bio: "Сын профессора. Физик-химик, кандидат наук. Работал в Институте общей и неорганической химии РАН (Москва).",
    achievements: ["Публикации в 'Журнале структурной химии'"]
  },
  { id: "lidiya_y", name: "Танкова (дев. Ястремская) Лидия Семеновна", years: "род. 1919", title: "Медсестра ВОВ", branch: "paternal", generation: 4, gender: "f", fatherId: "semyon_y", bio: "Орден Отечественной войны II ст. (1985)." },
  { id: "lyubov_y", name: "Вечеровская (дев. Ястремская) Любовь Семеновна", years: "род. 1915", title: "Сестра Зиновия", branch: "paternal", generation: 4, gender: "f", fatherId: "semyon_y" },
  { id: "nadezhda_y", name: "Ястремская Надежда Семеновна", years: "род. 1914", title: "Сестра", branch: "paternal", generation: 4, gender: "f", fatherId: "semyon_y" },
  { id: "vera_y", name: "Ястремская Вера Семеновна", years: "род. 1917", title: "Сестра", branch: "paternal", generation: 4, gender: "f", fatherId: "semyon_y" },
  { id: "valentina_y", name: "Ястремская Валентина Семеновна", years: "род. 1921", title: "Сестра", branch: "paternal", generation: 4, gender: "f", fatherId: "semyon_y" },
  { id: "anna_y_infant", name: "Ястремская Анна Семеновна", years: "1922 — 1923", title: "Младшая дочь", branch: "paternal", generation: 4, gender: "f", fatherId: "semyon_y", bio: "Умерла в возрасте 9 месяцев." },

  // ===========================================================================
  // ВЕТВЬ ТОРОЦКО И ЧЕРНОМАШЕНЦЕВЫХ (ПАПИНА ЛИНИЯ)
  // ===========================================================================
  
  { id: "mihail_t", name: "Михаил Тороцко", years: "~1830 — ?", title: "Белорусский шляхтич", branch: "paternal", generation: 1, gender: "m", bio: "Околичная шляхта из деревни Римаши (Минская губ.)." },
  { id: "vikentiy_t", name: "Викентий Михайлович Тороцко", years: "1860 — 1937", title: "Шляхтич / Отец героя", branch: "paternal", generation: 2, gender: "m", fatherId: "mihail_t", bio: "Арестован НКВД 16.12.1937 г. в возрасте 49 лет по ложному обвинению." },
  { id: "ilya_ch", name: "Илья Черномашенцев", years: "~1830 — ?", title: "Домовладелец в Воронеже", branch: "paternal", generation: 1, gender: "m", bio: "Основатель воронежского капитала семьи." },
  {
    id: "nikolai_ch_sen", name: "Николай Ильич Черномашенцев", years: "род. ~1860", title: "Коллежский асессор", branch: "paternal", generation: 2, gender: "m", fatherId: "ilya_ch",
    bio: "Высокопоставленный финансист Воронежской Казенной палаты. Личный дворянин. Участник Первой мировой (Воронежская Книга Памяти, стр. 491).",
    achievements: ["Орден Св. Станислава 3 ст.", "Медаль 300-летия Романовых"],
    possessions: "Большой дом в центре Воронежа.",
    medical: ["Предрасположенность к онкологии"]
  },
  {
    id: "nikolai_torotko", name: "Тороцко Николай Викентьевич", years: "1888 — 1974", title: "Штабс-капитан РИА / Узник ГУЛАГа", branch: "paternal", generation: 3, gender: "m", fatherId: "vikentiy_t",
    bio: "Окончил Иркутское артиллерийское училище. В ПМВ воевал в 14-м Сибирском стрелковом полку. 20.02.1915 под огнем поднял роту в атаку у д. Бартники. Провел 20 лет в Воркутлаге (1937-1956). Выжил благодаря мастерству рук. Реабилитирован в 1973 г.",
    achievements: ["Орден Св. Георгия IV степени", "Золотое Георгиевское оружие 'За храбрость'"],
    character: ["Интеллигентность", "Никогда не повышал голос", "Плел корзины, шил обувь"],
    medical: ["Тяжелый псориаз от стрессов"],
    possessions: "Пенсия 40 рублей в 1956 году."
  },
  {
    id: "olga_ch", name: "Тороцко (дев. Черномашенцева) Ольга Николаевна", years: "1896 — 1951", title: "Дворянка / Пианистка / Тапер", branch: "paternal", generation: 3, gender: "f", fatherId: "nikolai_ch_sen", spouseId: "nikolai_torotko",
    bio: "Окончила Московскую консерваторию. Имела немецкое пианино 'Берлин'. После ареста мужа работала тапером в кинотеатре Туапсе, спасая детей от голода.",
    character: ["Музыкальный гений", "Дворянская выдержка"],
    medical: ["Умерла от онкологии в 55 лет"]
  },
  {
    id: "anna_torotko", name: "Ястремская (дев. Торотько) Анна Николаевна", years: "25.08.1921 — 04.07.2003", title: "Капитан медслужбы / Хирург", branch: "paternal", generation: 4, gender: "f", fatherId: "nikolai_torotko", motherId: "olga_ch", spouseId: "zinoviy_y",
    bio: "Диплом врача №731142. Хирург 171 полевого госпиталя. Оперировала сутками в ледяной воде при форсировании Сиваша. Брала Кёнигсберг. Начальник госпиталя в Потсдаме.",
    appearance: "Рост 165 см, шатенка, кареглазая.",
    achievements: ["Орден Красной Звезды", "Медаль За боевые заслуги"],
    possessions: "Зарплата 500 марок в Потсдаме, немецкое платье ручной работы.",
    character: ["Пробивная", "Ненависть к нищете", "Любила строить и красить", "Шоколадные конфеты"],
    medical: ["Рак поджелудочной железы (82 года)"]
  },
  { id: "victor_t", name: "Тороцко Виктор Николаевич", years: "род. ~1925", title: "Брат Анны", branch: "paternal", generation: 4, gender: "m", fatherId: "nikolai_torotko", motherId: "olga_ch" },
  { id: "nikolai_t_jr", name: "Тороцко Николай Николаевич", years: "род. ~1927", title: "Брат Анны", branch: "paternal", generation: 4, gender: "m", fatherId: "nikolai_torotko", motherId: "olga_ch" },
  { id: "yuriy_t", name: "Тороцко Юрий Николаевич", years: "", title: "Брат Анны", branch: "paternal", generation: 4, gender: "m", fatherId: "nikolai_torotko", motherId: "olga_ch", bio: "Болел туберкулезом костей, Анна вернулась из Германии за ним ухаживать." },

  // ===========================================================================
  // ВЕТВЬ ВЛАСОВЫХ И ОКУЛОВСКИХ (ПАПИНА ЛИНИЯ)
  // ===========================================================================

  { id: "semyon_v", name: "Семен Власов", years: "сер. XIX в.", title: "Прапрапрадед (Вятка)", branch: "paternal", generation: 2, gender: "m", bio: "Вятский крестьянин, Яранский уезд. Старообрядец." },
  { id: "evtikhiy_v", name: "Власов Евтихий Семенович", years: "~1880 — ?", title: "Прапрадед", branch: "paternal", generation: 3, gender: "m", fatherId: "semyon_v", bio: "Житель Вятской губернии. Носитель традиционного старообрядческого имени." },
  {
    id: "mercuriy_v", name: "Власов Меркурий Евтихеевич", years: "25.11.1912 — 02.03.2000", title: "Воентехник ЧФ / Герой Севастополя", branch: "paternal", generation: 4, gender: "m", fatherId: "evtikhiy_v",
    bio: "Воентехник 2 ранга 9-го истребительного авиаполка ВВС ЧФ. 03.07.1942 (день падения Севастополя) пропал без вести на мысе Херсонес. Выжил в окружении/плену. Вернулся в Киров. Прожил 88 лет.",
    achievements: ["Орден Отечественной войны II ст. (1985)", "Медаль За доблестный труд"],
    character: ["Страстный шахматист (ID 23419)", "Хладнокровие"],
    medical: ["Сердечно-сосудистые заболевания"]
  },
  { id: "hristina_k", name: "Власова (дев. Клабукова) Христина Егоровна", years: "02.1922 — 1989", title: "Жена Меркурия", branch: "paternal", generation: 4, gender: "f", spouseId: "mercuriy_v" },
  {
    id: "alexander_v", name: "Власов Александр Меркурьевич", years: "род. 07.11.1950", title: "Дед Саша", branch: "paternal", generation: 5, gender: "m", fatherId: "mercuriy_v", motherId: "hristina_k", spouseId: "olga_v_p",
    bio: "Председатель СНТ 'Радуга-2' в Кировской области. Известный в регионе шахматист.",
    achievements: ["Рейтинг ФШР 1381", "Активный участник турниров"]
  },
  { id: "olga_v_p", name: "Власова (дев. Ястремская) Ольга Зиновьевна", years: "род. 15.11.1951", title: "Бабушка Оля", branch: "paternal", generation: 5, gender: "f", fatherId: "zinoviy_y", motherId: "anna_torotko", spouseId: "alexander_v", bio: "Главный архивариус и летописец семьи." },
  { id: "masha_v", name: "Мария Александровна Власова", years: "род. 1977", title: "Тетя (Сестра папы)", branch: "paternal", generation: 6, gender: "f", fatherId: "alexander_v", motherId: "olga_v_p" },
  { id: "katya_v", name: "Екатерина (дочь Маши)", years: "", title: "Двоюродная сестра", branch: "paternal", generation: 7, gender: "f", motherId: "masha_v" },
  
  // Ветка Окуловских
  { id: "irina_v_ok", name: "Окуловская (дев. Власова) Ирина Меркурьевна", years: "ум. недавно", title: "Двоюродная бабушка", branch: "paternal", generation: 5, gender: "f", fatherId: "mercuriy_v", motherId: "hristina_k" },
  { id: "vlad_ok", name: "Окуловский Владимир", years: "", title: "Муж Ирины", branch: "paternal", generation: 5, gender: "m", spouseId: "irina_v_ok", bio: "Инженер-строитель в Кирове." },
  { id: "alexey_ok", name: "Окуловский Алексей Владимирович", years: "род. ~1978", title: "Дядя / Энергетик", branch: "paternal", generation: 6, gender: "m", fatherId: "vlad_ok", motherId: "irina_v_ok", bio: "Бизнесмен (ООО 'СПК Траст'), музыкант группы 'Разбойный бор' (перкуссия, гармошка)." },
  { id: "olga_ok_wife", name: "Окуловская Ольга (дев. неизвестна)", years: "род. ~1978", title: "Жена Алексея", branch: "paternal", generation: 6, gender: "f", spouseId: "alexey_ok", bio: "Активная жительница Кирова, интересуется благотворительностью." },
  { id: "sergey_ok", name: "Окуловский Сергей Владимирович", years: "род. ~1980", title: "Дядя / Музыкант", branch: "paternal", generation: 6, gender: "m", fatherId: "vlad_ok", motherId: "irina_v_ok", bio: "Выпускник ВятГУ (2001), бас-гитарист группы 'Разбойный бор'." },
  { id: "olesya_ok_wife", name: "Окуловская Олеся (дев. неизвестна)", years: "", title: "Жена Сергея", branch: "paternal", generation: 6, gender: "f", spouseId: "sergey_ok" },
  { id: "mihail_ok", name: "Окуловский Михаил Алексеевич", years: "род. ~1999", title: "Троюродный брат", branch: "paternal", generation: 7, gender: "m", fatherId: "alexey_ok", motherId: "olga_ok_wife", bio: "Ученый-геолог, лауреат конкурса им. Вернадского, студент ВятГУ." },
  { id: "ilya_ok", name: "Окуловский Илья Сергеевич", years: "", title: "Троюродный брат", branch: "paternal", generation: 7, gender: "m", fatherId: "sergey_ok", motherId: "olesya_ok_wife" },
  { id: "matvey_ok", name: "Окуловский Матвей Сергеевич", years: "", title: "Троюродный брат", branch: "paternal", generation: 7, gender: "m", fatherId: "sergey_ok", motherId: "olesya_ok_wife" },

  // ===========================================================================
  // ВЕТВЬ ВЕДЕРНИКОВЫХ И ШУПЛЕЦОВЫХ (МАМИНА ЛИНИЯ)
  // ===========================================================================
  
  { id: "kirill_v_m", name: "Кирилл Ведерников", years: "~1795 — ?", title: "Вятский пахарь", branch: "maternal", generation: 0, gender: "m", bio: "Основатель рода в селе Мокино. Глава семьи в 1850 г.", habits: ["Зычный бас"] },
  { id: "terentiy_v_m", name: "Терентий Ведерников", years: "~1850 — ?", title: "Крестьянин Мокино", branch: "maternal", generation: 1, gender: "m", fatherId: "kirill_v_m" },
  {
    id: "ilya_v_m", name: "Ведерников Илья Терентьевич", years: "уб. 26.06.1916", title: "Старший унтер-офицер", branch: "maternal", generation: 2, gender: "m", fatherId: "terentiy_v_m",
    bio: "Герой ПМВ. Пропал без вести в 1914-м, выжил и вернулся. Героически погиб в ходе Брусиловского прорыва на Волыни."
  },
  { id: "alexander_v_bro", name: "Ведерников Александр Терентьевич", years: "~1885 — ?", title: "Брат Ильи", branch: "maternal", generation: 2, gender: "m", fatherId: "terentiy_v_m", bio: "Благородный поступок: взял в жены вдову брата Ильи после его гибели, чтобы спасти род." },
  { id: "nikifor_sh", name: "Никифор Шуплецов", years: "~1840 — ?", title: "Вятский шорник", branch: "maternal", generation: 0, gender: "m", bio: "Свободный (государственный) крестьянин. Элитный мастер упряжи." },
  { id: "vasiliy_sh_sen", name: "Василий Шуплецов", years: "~1870 — ?", title: "Мастер-шорник", branch: "maternal", generation: 1, gender: "m", fatherId: "nikifor_sh" },
  {
    id: "alexey_sh", name: "Шуплецов Алексей Васильевич", years: "1906 — 1953", title: "Рабочий / Рыбак", branch: "maternal", generation: 2, gender: "m", fatherId: "vasiliy_sh_sen",
    bio: "Страстный рыбак. Работал на Дальнем Востоке. Погиб, перевернувшись в лодке в ледяной воде."
  },
  { id: "anna_ved", name: "Шуплецова (дев. Ведерникова) Анна Ильинична", years: "15.03.1909 — 01.09.1996", title: "Хозяйка рода", branch: "maternal", generation: 3, gender: "f", fatherId: "ilya_v_m", spouseId: "alexey_sh", bio: "Невероятная чистоплотность и хозяйственность.", medical: ["Долгожитель (87 лет)"] },
  {
    id: "anatoliy_sh", name: "Шуплецов Анатолий Алексеевич", years: "10.09.1935 — 07.12.2005", title: "Генеральный директор промхоза", branch: "maternal", generation: 4, gender: "m", fatherId: "alexey_sh", motherId: "anna_ved",
    bio: "Крупный региональный лидер в Омутнинске. Служил в Германии. Строгий и волевой управленец.",
    achievements: ["Директор Омутнинского промхоза", "Член КПСС"],
    medical: ["Диабет 2-го типа"]
  },

  // Ветвь Березкиных и Сандаловых
  { id: "ivan_s", name: "Иван Сандалов", years: "~1850 — ?", title: "Мещанин", branch: "maternal", generation: 0, gender: "m", bio: "Уржумский ремесленник." },
  {
    id: "andrey_s", name: "Сандалов Андрей", years: "~1880 — ?", title: "Портной / 'Царь'", branch: "maternal", generation: 1, gender: "m", fatherId: "ivan_s",
    bio: "Элитный портной Уржума. Был абсолютной копией Николая II.",
    appearance: "Аккуратная борода, стать, имперский стиль."
  },
  { id: "gadalka_c", name: "Березкина (Гадалка из Цепочкино)", years: "сер. XIX в. — ?", title: "Ясновидящая", branch: "maternal", generation: 1, gender: "f", bio: "Мать Василия Березкина. Легендарная гадалка, известная на всю округу.", habits: ["Гадание"] },
  { id: "dmitriy_b", name: "Дмитрий Березкин", years: "~1870 — ?", title: "Глава семьи", branch: "maternal", generation: 1, gender: "m", spouseId: "gadalka_c" },
  {
    id: "vasiliy_b", name: "Березкин Василий Дмитриевич", years: "1908 — окт. 1942", title: "Начальник лесопилки", branch: "maternal", generation: 2, gender: "m", fatherId: "dmitriy_b", motherId: "gadalka_c",
    bio: "Призван 14.04.1942 Уржумским РВК. Пропал без вести в боях под Харьковом. Жил в Уржуме на ул. Елкина, 28.",
    character: ["Ответственность"]
  },
  { id: "ivan_b_bro", name: "Березкин Иван Дмитриевич", years: "1901 — 1941", title: "Брат Василия", branch: "maternal", generation: 2, gender: "m", fatherId: "dmitriy_b", bio: "Погиб/пропал в первые месяцы войны." },
  { id: "mihail_b_bro", name: "Березкин Михаил Дмитриевич", years: "1915 — 1943", title: "Брат Василия", branch: "maternal", generation: 2, gender: "m", fatherId: "dmitriy_b", bio: "Убит в бою." },
  { id: "klavdiya_s", name: "Березкина (дев. Сандалова) Клавдия Андреевна", years: "1913 — 12.06.1993", title: "Прапрабабушка", branch: "maternal", generation: 2, gender: "f", fatherId: "andrey_s", motherId: "gadalka_c", spouseId: "vasiliy_b", bio: "Крутилась как могла после гибели мужа." },
  {
    id: "valentina_b", name: "Шуплецова (дев. Березкина) Валентина Васильевна", years: "04.08.1936 — 15.09.2025", title: "Хирургическая медсестра", branch: "maternal", generation: 3, gender: "f", fatherId: "vasiliy_b", motherId: "klavdiya_s", spouseId: "anatoliy_sh",
    bio: "Выросла без отца. Стала элитной медсестрой. Ассистировала на операциях. Артистка сцены.",
    character: ["Вязание", "Чтение стихов"]
  },
  { id: "serafima_aunt", name: "Серафима (дев. Сандалова/Березкина?)", years: "", title: "Тетя Валентины", branch: "maternal", generation: 3, gender: "f", bio: "Жила в Карело-Финской ССР." },

  // Ветвь Королевых и Краснюк
  { id: "pelageya_p", name: "Краснюк Пелагея (дев. Ворожцова?)", years: "~1900 — ?", title: "Повар (Тетя Поля)", branch: "maternal", generation: 2, gender: "f", bio: "Мать Галины Краснюк. Южные корни." },
  { id: "galina_k", name: "Королева (дев. Краснюк) Галина Алексеевна", years: "13.10.1929 — 2020", title: "Прабабушка", branch: "maternal", generation: 3, gender: "f", motherId: "pelageya_p", bio: "Трижды замужем. Прошла через многие испытания." },
  { id: "nikolai_k_sen", name: "Королев Николай", years: "~1900-е — ?", title: "Прадед", branch: "maternal", generation: 3, gender: "m", spouseId: "galina_k" },
  { id: "ilya_k_metall", name: "Королев Илья Николаевич", years: "род. ~1930", title: "Металлург-орденоносец", branch: "maternal", generation: 4, gender: "m", fatherId: "nikolai_k_sen", motherId: "galina_k", bio: "Прославленный сталевар-мартеновец Омутнинска. Награжден Орденом Ленина (1966)." },
  {
    id: "igor_kor_sen", name: "Королев Игорь Николаевич", years: "1938 — 2010", title: "Главный инженер СМУ", branch: "maternal", generation: 4, gender: "m", fatherId: "nikolai_k_sen", motherId: "galina_k", spouseId: "svetlana_k_b",
    bio: "Интеллектуал-созидатель. Окончил строительный факультет. Построил половину Омутнинска."
  },
  { id: "svetlana_k_b", name: "Королева (дев. Шуплецова) Светлана Анатольевна", years: "род. 1941", title: "Бабушка Света", branch: "maternal", generation: 4, gender: "f", fatherId: "anatoliy_sh", motherId: "valentina_b", spouseId: "igor_kor_sen", bio: "Хранительница истории вятской ветви." },

  // ===========================================================================
  // ЯДРО: РОДИТЕЛИ И ВЫ (НИЗ ДРЕВА)
  // ===========================================================================
  
  { id: "igor_v", name: "Власов Игорь Александрович", years: "род. 1976", title: "Отец", branch: "both", generation: 6, gender: "m", fatherId: "alexander_v", motherId: "olga_v_p", bio: "Военнослужащий. Служил в Херсоне (2025-2026)." },
  { id: "anna_k", name: "Власова (дев. Королева) Анна Игоревна", years: "род. 1970", title: "Мать", branch: "both", generation: 6, gender: "f", fatherId: "igor_kor_sen", motherId: "svetlana_k_b", spouseId: "igor_v", bio: "Вернула девичью фамилию. Хранительница ценностей." },
  { id: "pavel_v", name: "Власов Павел Игоревич", years: "род. 14.07.2008", title: "Я (Создатель Архива)", branch: "both", generation: 7, gender: "m", fatherId: "igor_v", motherId: "anna_k", bio: "Разработчик и исследователь." },
  { id: "pyotr_v", name: "Власов Пётр Игоревич", years: "род. 09.02.2011", title: "Брат", branch: "both", generation: 7, gender: "m", fatherId: "igor_v", motherId: "anna_k" }
];