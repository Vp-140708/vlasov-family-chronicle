export type BranchType = "paternal" | "maternal" | "both";

export interface FamilyMember {
  id: string;
  name: string;
  years: string;
  title: string;
  branch: BranchType;
  bio: string;
  habits: string[];
  medical: string[];
  generation: number;
  fatherId?: string | null;
  motherId?: string | null;
  spouseId?: string | null;
  gender: "m" | "f";
}

export const familyMembers: FamilyMember[] =[
  // ==========================================
  // УРОВЕНЬ 0: ОСНОВАТЕЛИ РОДОВ (Конец XVIII века)
  // ==========================================
  { id: "stefan_y", name: "Стефан Ястремский", years: "~1790", title: "Священник", branch: "paternal", bio: "Основатель династии харьковских священников.", habits: [], medical:[], generation: 0, gender: "m" },
  { id: "kirill_v_m", name: "Кирилл Ведерников", years: "~1795", title: "Вятский пахарь", branch: "maternal", bio: "Глава рода в селе Мокино.", habits: ["Зычный бас"], medical:[], generation: 0, gender: "m" },

  // ==========================================
  // УРОВЕНЬ 1: НАЧАЛО XIX ВЕКА
  // ==========================================
  { id: "ivan_y", name: "Иван Степанович Ястремский", years: "~1820", title: "Священник", branch: "paternal", bio: "", habits: [], medical:[], generation: 1, gender: "m", fatherId: "stefan_y" },
  { id: "mark_p", name: "Марк Поляков", years: "~1820", title: "Купец", branch: "paternal", bio: "Брат банкира Полякова.", habits: [], medical:[], generation: 1, gender: "m" },
  { id: "mihail_t", name: "Михаил Тороцко", years: "~1830", title: "Шляхтич", branch: "paternal", bio: "Деревня Римаши.", habits: [], medical:[], generation: 1, gender: "m" },
  { id: "ilya_ch", name: "Илья Черномашенцев", years: "~1830", title: "Домовладелец", branch: "paternal", bio: "Воронеж.", habits: [], medical:[], generation: 1, gender: "m" },
  { id: "terentiy_v_m", name: "Терентий Ведерников", years: "~1850", title: "Крестьянин", branch: "maternal", bio: "", habits: [], medical:[], generation: 1, gender: "m", fatherId: "kirill_v_m" },
  { id: "nikifor_sh", name: "Никифор Шуплецов", years: "~1840", title: "Шорник", branch: "maternal", bio: "Мастер конской упряжи.", habits:[], medical:[], generation: 1, gender: "m" },
  { id: "ivan_s", name: "Иван Сандалов", years: "~1850", title: "Мещанин", branch: "maternal", bio: "г. Уржум.", habits: [], medical:[], generation: 1, gender: "m" },

  // ==========================================
  // УРОВЕНЬ 2: СЕРЕДИНА XIX ВЕКА (Родители героев ПМВ)
  // ==========================================
  { id: "dmitriy_y", name: "Дмитрий Иванович Ястремский", years: "~1840", title: "Священник", branch: "paternal", bio: "С. Дерюгино.", habits:[], medical:[], generation: 2, gender: "m", fatherId: "ivan_y" },
  { id: "semyon_v", name: "Семен Власов", years: "~1850", title: "Вятский крестьянин", branch: "paternal", bio: "", habits:[], medical:[], generation: 2, gender: "m" },
  { id: "karp_p", name: "Карп Маркович Поляков", years: "~1850", title: "Рядовой", branch: "paternal", bio: "Одесса.", habits: [], medical:[], generation: 2, gender: "m", fatherId: "mark_p" },
  { id: "elena_p", name: "Елена Константиновна Полякова (дев. неизвестна)", years: "~1850", title: "Пра(х3)бабушка", branch: "paternal", bio: "Из д. Забонь.", habits: [], medical:[], generation: 2, gender: "f", spouseId: "karp_p" },
  { id: "vikentiy_t", name: "Викентий Михайлович Тороцко", years: "1860-1937", title: "Шляхтич", branch: "paternal", bio: "Арестован НКВД.", habits: [], medical:[], generation: 2, gender: "m", fatherId: "mihail_t" },
  { id: "nikolai_ch_sen", name: "Николай Ильич Черномашенцев", years: "~1860", title: "Коллежский асессор", branch: "paternal", bio: "Чиновник Казенной палаты Воронежа.", habits: [], medical: ["Онкология"], generation: 2, gender: "m", fatherId: "ilya_ch" },
  { id: "vasiliy_sh_sen", name: "Василий Шуплецов", years: "~1870", title: "Мастер", branch: "maternal", bio: "д. Шуплецы.", habits: [], medical:[], generation: 2, gender: "m", fatherId: "nikifor_sh" },
  { id: "ilya_v_m", name: "Илья Терентьевич Ведерников", years: "уб. 1916", title: "Унтер-офицер", branch: "maternal", bio: "Погиб в Брусиловском прорыве.", habits: ["Храбрость"], medical:[], generation: 2, gender: "m", fatherId: "terentiy_v_m" },
  { id: "alexander_v_bro", name: "Александр Терентьевич Ведерников", years: "~1885", title: "Брат Ильи", branch: "maternal", bio: "Взял в жены вдову брата.", habits: [], medical:[], generation: 2, gender: "m", fatherId: "terentiy_v_m" },
  { id: "dmitriy_b", name: "Дмитрий Березкин", years: "~1870", title: "Глава семьи", branch: "maternal", bio: "Уржум.", habits: [], medical:[], generation: 2, gender: "m" },
  { id: "andrey_s", name: "Андрей Сандалов", years: "~1880", title: "Портной / Двойник Царя", branch: "maternal", bio: "Копия Николая II.", habits: [], medical:[], generation: 2, gender: "m", fatherId: "ivan_s" },
  { id: "gadalka_c", name: "Жена Андрея Сандалова (Гадалка)", years: "", title: "Ясновидящая", branch: "maternal", bio: "с. Цепочкино.", habits: ["Гадание"], medical:[], generation: 2, gender: "f", spouseId: "andrey_s" },
  { id: "pelageya_p", name: "Краснюк Пелагея (дев. Ворожцова?)", years: "~1900", title: "Повар (Тетя Поля)", branch: "maternal", bio: "", habits: [], medical:[], generation: 2, gender: "f" },

  // ==========================================
  // УРОВЕНЬ 3: ПРАПРАДЕДЫ (ГЕРОИ ПМВ И ТРУДА)
  // ==========================================
  { id: "evtikhiy_v", name: "Евтихий Семенович Власов", years: "~1880", title: "Прапрадед", branch: "paternal", bio: "Старообрядческие корни.", habits: [], medical:[], generation: 3, gender: "m", fatherId: "semyon_v" },
  { id: "semyon_y", name: "Семен Дмитриевич Ястремский", years: "1860-1936", title: "Священник / Закройщик", branch: "paternal", bio: "Ушел в протестанты.", habits:["Смена веры"], medical: ["Инсульт"], generation: 3, gender: "m", fatherId: "dmitriy_y" },
  { id: "tatyana_p", name: "Ястремская (дев. Полякова) Татьяна Карповна", years: "1886-1962", title: "Модельер знати", branch: "paternal", bio: "Крым, Одесса.", habits:["Вкус"], medical:[], generation: 3, gender: "f", fatherId: "karp_p", motherId: "elena_p", spouseId: "semyon_y" },
  { id: "nikolai_torotko", name: "Николай Викентьевич Тороцко", years: "1888-1974", title: "Штабс-капитан РИА", branch: "paternal", bio: "Георгиевское оружие. 20 лет Воркуты.", habits: ["Плел корзины"], medical:["Псориаз", "Долгожитель"], generation: 3, gender: "m", fatherId: "vikentiy_t" },
  { id: "olga_ch", name: "Тороцко (дев. Черномашенцева) Ольга Николаевна", years: "1896-1951", title: "Дворянка / Пианистка", branch: "paternal", bio: "Консерватория. Тапер в Туапсе.", habits: ["Музыка"], medical: ["Онкология"], generation: 3, gender: "f", fatherId: "nikolai_ch_sen", spouseId: "nikolai_torotko" },
  { id: "alexey_sh", name: "Алексей Васильевич Шуплецов", years: "1906-1953", title: "Рыбак", branch: "maternal", bio: "Перевернулся в лодке.", habits: ["Рыбалка"], medical:[], generation: 3, gender: "m", fatherId: "vasiliy_sh_sen" },
  { id: "anna_ved", name: "Шуплецова (дев. Ведерникова) Анна Ильинична", years: "1909-1996", title: "Хозяйка", branch: "maternal", bio: "с. Мокино.", habits: ["Чистоплотность"], medical: ["Долгожитель"], generation: 3, gender: "f", fatherId: "ilya_v_m", spouseId: "alexey_sh" },
  { id: "vasiliy_b", name: "Василий Дмитриевич Березкин", years: "1908-1942", title: "Нач. лесопилки", branch: "maternal", bio: "Пропал без вести под Харьковом.", habits:[], medical:[], generation: 3, gender: "m", fatherId: "dmitriy_b" },
  { id: "ivan_b_bro", name: "Иван Дмитриевич Березкин", years: "1901-1941", title: "Брат Василия", branch: "maternal", bio: "Погиб на фронте.", habits: [], medical:[], generation: 3, gender: "m", fatherId: "dmitriy_b" },
  { id: "mihail_b_bro", name: "Михаил Дмитриевич Березкин", years: "1915-1943", title: "Брат Василия", branch: "maternal", bio: "Погиб на фронте.", habits:[], medical:[], generation: 3, gender: "m", fatherId: "dmitriy_b" },
  { id: "klavdiya_s", name: "Березкина (дев. Сандалова) Клавдия Андреевна", years: "1913-1993", title: "Прапрабабушка", branch: "maternal", bio: "Осталась вдовой на войне.", habits: [], medical:[], generation: 3, gender: "f", fatherId: "andrey_s", motherId: "gadalka_c", spouseId: "vasiliy_b" },
  { id: "nikolai_k_sen", name: "Николай Королев", years: "~1900-е", title: "Прадед", branch: "maternal", bio: "Отец деда Игоря.", habits: [], medical:[], generation: 3, gender: "m" },
  { id: "galina_k", name: "Королева (дев. Краснюк) Галина Алексеевна", years: "1929-2020", title: "Прабабушка", branch: "maternal", bio: "Была замужем 3 раза.", habits: [], medical:[], generation: 3, gender: "f", motherId: "pelageya_p", spouseId: "nikolai_k_sen" },

  // ==========================================
  // УРОВЕНЬ 4: ПРАДЕДЫ (ГЕРОИ ВОВ) И ИХ БРАТЬЯ/СЕСТРЫ
  // ==========================================
  { id: "mercuriy_v", name: "Меркурий Евтихеевич Власов", years: "1912-2000", title: "Воентехник ЧФ", branch: "paternal", bio: "Герой Севастополя. Выжил после 03.07.1942.", habits:["Шахматы"], medical: ["Сердце"], generation: 4, gender: "m", fatherId: "evtikhiy_v" },
  { id: "hristina_k", name: "Власова (дев. Клабукова) Христина Егоровна", years: "1922-1989", title: "Жена Меркурия", branch: "paternal", bio: "г. Киров.", habits:[], medical:[], generation: 4, gender: "f", spouseId: "mercuriy_v" },
  { id: "zinoviy_y", name: "Зиновий Семенович Ястремский", years: "1912-1991", title: "Инженер / Лесовод", branch: "paternal", bio: "Орден Красной Звезды. Дошел до Берлина.", habits: ["Охота", "Футбол"], medical: ["Атеросклероз"], generation: 4, gender: "m", fatherId: "semyon_y", motherId: "tatyana_p" },
  { id: "anna_t", name: "Ястремская (дев. Торотько) Анна Николаевна", years: "1921-2003", title: "Капитан медслужбы", branch: "paternal", bio: "Хирург Сиваша и Кёнигсберга.", habits:["Ремонт", "Вкус"], medical: ["Онкология поджелудочной"], generation: 4, gender: "f", fatherId: "nikolai_torotko", motherId: "olga_ch", spouseId: "zinoviy_y" },
  { id: "pavel_y_bro", name: "Павел Семенович Ястремский", years: "1911-1994", title: "Профессор химии", branch: "paternal", bio: "Волгоград СХИ.", habits:[], medical:[], generation: 4, gender: "m", fatherId: "semyon_y" },
  { id: "lidiya_y", name: "Танкова (дев. Ястремская) Лидия Семеновна", years: "1919", title: "Медсестра ВОВ", branch: "paternal", bio: "", habits: [], medical:[], generation: 4, gender: "f", fatherId: "semyon_y" },
  { id: "lyubov_y", name: "Вечеровская (дев. Ястремская) Любовь Семеновна", years: "1915", title: "Сестра", branch: "paternal", bio: "", habits: [], medical:[], generation: 4, gender: "f", fatherId: "semyon_y" },
  { id: "nadezhda_y", name: "Ястремская Надежда Семеновна", years: "1914", title: "Сестра", branch: "paternal", bio: "", habits: [], medical:[], generation: 4, gender: "f", fatherId: "semyon_y" },
  { id: "vera_y", name: "Ястремская Вера Семеновна", years: "1917", title: "Сестра", branch: "paternal", bio: "", habits: [], medical:[], generation: 4, gender: "f", fatherId: "semyon_y" },
  { id: "valentina_y", name: "Ястремская Валентина Семеновна", years: "1921", title: "Сестра", branch: "paternal", bio: "", habits: [], medical:[], generation: 4, gender: "f", fatherId: "semyon_y" },
  { id: "anatoliy_sh", name: "Анатолий Алексеевич Шуплецов", years: "1935-2005", title: "Директор промхоза", branch: "maternal", bio: "Омутнинск. Управленец высшего звена.", habits: ["Лидерство"], medical: ["Диабет"], generation: 4, gender: "m", fatherId: "alexey_sh", motherId: "anna_ved" },
  { id: "valentina_b", name: "Шуплецова (дев. Березкина) Валентина Васильевна", years: "1936-2025", title: "Медсестра / Артистка", branch: "maternal", bio: "Выступала на сцене, читала стихи.", habits:["Вязание"], medical:[], generation: 4, gender: "f", fatherId: "vasiliy_b", motherId: "klavdiya_s", spouseId: "anatoliy_sh" },
  { id: "serafima_aunt", name: "Серафима Березкина (Сандалова)", years: "", title: "Тетя Валентины", branch: "maternal", bio: "Карело-Финская ССР.", habits: [], medical:[], generation: 4, gender: "f" },
  { id: "igor_kor_sen", name: "Игорь Николаевич Королев", years: "1938-2010", title: "Главный инженер", branch: "maternal", bio: "СМУ, г. Омутнинск.", habits: ["Инженерия"], medical:[], generation: 4, gender: "m", fatherId: "nikolai_k_sen", motherId: "galina_k" },
  { id: "ilya_k_metall", name: "Илья Николаевич Королев", years: "", title: "Сталевар-Мартеновец", branch: "maternal", bio: "Кавалер Ордена Ленина.", habits: ["Стальной характер"], medical:[], generation: 4, gender: "m", fatherId: "nikolai_k_sen", motherId: "galina_k" },

  // ==========================================
  // УРОВЕНЬ 5: ДЕДУШКИ И БАБУШКИ
  // ==========================================
  { id: "konstantin_y", name: "Константин Павлович Ястремский", years: "", title: "Ученый-химик", branch: "paternal", bio: "РАН, Москва.", habits: [], medical:[], generation: 5, gender: "m", fatherId: "pavel_y_bro" },
  { id: "alexander_v", name: "Александр Меркурьевич Власов", years: "род. 1950", title: "Дед Саша", branch: "paternal", bio: "Председатель СНТ.", habits: ["Шахматы"], medical:[], generation: 5, gender: "m", fatherId: "mercuriy_v", motherId: "hristina_k" },
  { id: "olga_v_p", name: "Власова (дев. Ястремская) Ольга Зиновьевна", years: "род. 1951", title: "Баба Оля", branch: "paternal", bio: "Летописец семьи.", habits: ["Архивы", "История"], medical:[], generation: 5, gender: "f", fatherId: "zinoviy_y", motherId: "anna_t", spouseId: "alexander_v" },
  { id: "irina_v_ok", name: "Окуловская (дев. Власова) Ирина Меркурьевна", years: "ум. недавно", title: "Сестра деда Саши", branch: "paternal", bio: "Киров.", habits: [], medical:[], generation: 5, gender: "f", fatherId: "mercuriy_v", motherId: "hristina_k" },
  { id: "vlad_ok", name: "Владимир Окуловский", years: "", title: "Муж Ирины", branch: "paternal", bio: "", habits: [], medical:[], generation: 5, gender: "m", spouseId: "irina_v_ok" },
  { id: "svetlana_k_b", name: "Королева (дев. Шуплецова) Светлана Анатольевна", years: "род. 1941", title: "Бабушка Света", branch: "maternal", bio: "Ветеран труда.", habits: [], medical:[], generation: 5, gender: "f", fatherId: "anatoliy_sh", motherId: "valentina_b", spouseId: "igor_kor_sen" },

  // ==========================================
  // УРОВЕНЬ 6: РОДИТЕЛИ И ИХ БРАТЬЯ/СЕСТРЫ
  // ==========================================
  { id: "igor_v", name: "Игорь Александрович Власов", years: "род. 1976", title: "Отец", branch: "both", bio: "Военнослужащий.", habits: [], medical:[], generation: 6, gender: "m", fatherId: "alexander_v", motherId: "olga_v_p" },
  { id: "anna_k", name: "Власова (дев. Королева) Анна Игоревна", years: "род. 1970", title: "Мать", branch: "both", bio: "Хранитель вятской ветви.", habits: [], medical:[], generation: 6, gender: "f", fatherId: "igor_kor_sen", motherId: "svetlana_k_b", spouseId: "igor_v" },
  { id: "masha_v", name: "Мария Александровна Власова", years: "род. 1977", title: "Сестра отца", branch: "paternal", bio: "", habits: [], medical:[], generation: 6, gender: "f", fatherId: "alexander_v", motherId: "olga_v_p" },
  { id: "alexey_ok", name: "Алексей Владимирович Окуловский", years: "", title: "Двоюродный дядя", branch: "paternal", bio: "Энергетик.", habits: [], medical:[], generation: 6, gender: "m", fatherId: "vlad_ok", motherId: "irina_v_ok" },
  { id: "olga_ok_wife", name: "Ольга Окуловская (дев. неизвестна)", years: "", title: "Жена Алексея", branch: "paternal", bio: "", habits: [], medical:[], generation: 6, gender: "f", spouseId: "alexey_ok" },
  { id: "sergey_ok", name: "Сергей Владимирович Окуловский", years: "", title: "Двоюродный дядя", branch: "paternal", bio: "", habits: [], medical:[], generation: 6, gender: "m", fatherId: "vlad_ok", motherId: "irina_v_ok" },
  { id: "olesya_ok_wife", name: "Олеся Окуловская (дев. неизвестна)", years: "", title: "Жена Сергея", branch: "paternal", bio: "", habits: [], medical:[], generation: 6, gender: "f", spouseId: "sergey_ok" },

  // ==========================================
  // УРОВЕНЬ 7: ВЫ И КУЗЕНЫ
  // ==========================================
  { id: "pavel_v", name: "Павел Игоревич Власов", years: "род. 2008", title: "Создатель Архива", branch: "both", bio: "Собрал и оцифровал историю рода на 200 лет вглубь.", habits: ["Технологии"], medical:[], generation: 7, gender: "m", fatherId: "igor_v", motherId: "anna_k" },
  { id: "pyotr_v", name: "Пётр Игоревич Власов", years: "род. 2011", title: "Младший брат", branch: "both", bio: "", habits: [], medical:[], generation: 7, gender: "m", fatherId: "igor_v", motherId: "anna_k" },
  { id: "katya_v", name: "Екатерина", years: "", title: "Двоюродная сестра", branch: "paternal", bio: "Дочь Марии.", habits: [], medical:[], generation: 7, gender: "f", motherId: "masha_v" },
  { id: "mihail_ok", name: "Михаил Алексеевич Окуловский", years: "", title: "Троюродный брат", branch: "paternal", bio: "", habits: [], medical:[], generation: 7, gender: "m", fatherId: "alexey_ok", motherId: "olga_ok_wife" },
  { id: "ilya_ok", name: "Илья Сергеевич Окуловский", years: "", title: "Троюродный брат", branch: "paternal", bio: "", habits: [], medical:[], generation: 7, gender: "m", fatherId: "sergey_ok", motherId: "olesya_ok_wife" },
  { id: "matvey_ok", name: "Матвей Сергеевич Окуловский", years: "", title: "Троюродный брат", branch: "paternal", bio: "", habits:[], medical:[], generation: 7, gender: "m", fatherId: "sergey_ok", motherId: "olesya_ok_wife" },
];