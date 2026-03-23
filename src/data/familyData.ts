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

export const familyMembers: FamilyMember[] = [
  // --- ПОКОЛЕНИЕ 0: ГЛУБИНА (XVIII - НАЧАЛО XIX ВЕКА) ---
  { id: "stefan_y", name: "Стефан Ястремский", years: "~1790", title: "Священник", branch: "paternal", bio: "Основатель династии харьковских священников.", habits: ["Грамотность"], medical: [], generation: 0, gender: "m" },
  { id: "kirill_v", name: "Кирилл Ведерников", years: "~1795", title: "Вятский пахарь", branch: "maternal", bio: "Глава рода в селе Мокино.", habits: ["Зычный бас"], medical: [], generation: 0, gender: "m" },
  { id: "mark_p", name: "Марк Поляков", years: "~1820", title: "Купеческий род", branch: "paternal", bio: "Связь с банкирским домом Поляковых.", habits: [], medical: [], generation: 0, gender: "m" },
  { id: "mihail_t", name: "Михаил Тороцко", years: "~1830", title: "Шляхтич", branch: "paternal", bio: "Околичная шляхта Минской губернии.", habits: [], medical: ["Долгожительство"], generation: 0, gender: "m" },
  { id: "nikifor_sh", name: "Никифор Шуплецов", years: "~1840", title: "Шорник", branch: "maternal", bio: "Мастер конской упряжи, Вятка.", habits: ["Мастерство"], medical: [], generation: 0, gender: "m" },
  { id: "ivan_s", name: "Иван Сандалов", years: "~1850", title: "Мещанин", branch: "maternal", bio: "Уржумский ремесленник.", habits: [], medical: [], generation: 0, gender: "m" },

  // --- ПОКОЛЕНИЕ 1: СЕРЕДИНА XIX ВЕКА ---
  { id: "ivan_y", name: "Иван Степанович Ястремский", years: "~1820", title: "Священник", branch: "paternal", bio: "Служил в Харьковской епархии.", habits: [], medical: [], generation: 1, gender: "m", fatherId: "stefan_y" },
  { id: "terentiy_v", name: "Терентий Ведерников", years: "~1850", title: "Крестьянин", branch: "maternal", bio: "Житель Мокино.", habits: [], medical: [], generation: 1, gender: "m", fatherId: "kirill_v" },
  { id: "vikentiy_t", name: "Викентий Михайлович Тороцко", years: "~1860", title: "Белорусский шляхтич", branch: "paternal", bio: "Отец Николая. Арестован в 1937 году.", habits: [], medical: [], generation: 1, gender: "m", fatherId: "mihail_t" },
  { id: "ilya_ch_base", name: "Илья Черномашенцев", years: "~1830", title: "Домовладелец", branch: "paternal", bio: "Основатель воронежской ветви.", habits: [], medical: [], generation: 1, gender: "m" },
  { id: "semyon_v_base", name: "Власов Семен", years: "~1850", title: "Прапрапрадед", branch: "paternal", bio: "Вятский крестьянин, Яранский уезд.", habits: [], medical: [], generation: 1, gender: "m" },
  { id: "karp_p", name: "Карп Маркович Поляков", years: "~1850", title: "Рядовой/Мещанин", branch: "paternal", bio: "Отец Татьяны, Одесса.", habits: [], medical: [], generation: 1, gender: "m", fatherId: "mark_p" },
  { id: "elena_p", name: "Елена Константиновна Полякова", years: "~1850", title: "Жена Карпа", branch: "paternal", bio: "из д. Забонь.", habits: [], medical: [], generation: 1, gender: "f" },
  { id: "vasiliy_sh_base", name: "Василий Шуплецов", years: "~1870", title: "Мастер", branch: "maternal", bio: "Деревня Шуплецы.", habits: [], medical: [], generation: 1, gender: "m", fatherId: "nikifor_sh" },
  { id: "andrey_sanda", name: "Андрей Сандалов", years: "~1880", title: "Портной / Двойник Царя", branch: "maternal", bio: "Похож на Николая II.", habits: ["Шитье"], medical: [], generation: 1, gender: "m", fatherId: "ivan_s" },
  { id: "gadalka_c", name: "Жена Андрея (Гадалка)", years: "", title: "Ясновидящая", branch: "maternal", bio: "с. Цепочкино.", habits: ["Гадание"], medical: [], generation: 1, gender: "f" },
  { id: "dmitriy_berezkin", name: "Березкин Дмитрий", years: "~1870", title: "Отец Василия", branch: "maternal", bio: "Уржум.", habits: [], medical: [], generation: 1, gender: "m" },

  // --- ПОКОЛЕНИЕ 2: ПРАПРАДЕДЫ (ГЕРОИ ПМВ) ---
  { id: "dmitriy_y", name: "Дмитрий Иванович Ястремский", years: "~1840", title: "Священник", branch: "paternal", bio: "Служил в с. Дерюгино.", habits: [], medical: [], generation: 2, gender: "m", fatherId: "ivan_y" },
  { id: "evtikhiy_v", name: "Власов Евтихий Семенович", years: "~1880", title: "Прапрадед (Вятка)", branch: "paternal", bio: "Отец Меркурия. Старообрядческие корни.", habits: [], medical: [], generation: 2, gender: "m", fatherId: "semyon_v_base" },
  { id: "nikolai_ch_junior", name: "Николай Ильич Черномашенцев", years: "~1860", title: "Коллежский асессор", branch: "paternal", bio: "Чиновник Казенной палаты Воронежа.", habits: ["Аристократизм"], medical: ["Онкология"], generation: 2, gender: "m", fatherId: "ilya_ch_base" },
  { id: "nikolai_torotko", name: "Николай Викентьевич Тороцко", years: "1888-1974", title: "Штабс-капитан РИА", branch: "paternal", bio: "Георгиевское оружие. 20 лет Воркуты.", habits: ["Мастер"], medical: ["Псориаз"], generation: 2, gender: "m", fatherId: "vikentiy_t" },
  { id: "olga_ch", name: "Ольга Николаевна Черномашенцева", years: "1896-1951", title: "Дворянка / Пианистка", branch: "paternal", bio: "Консерватория, тапер в Туапсе.", habits: ["Музыка"], medical: ["Онкология"], generation: 2, gender: "f", fatherId: "nikolai_ch_junior" },
  { id: "semyon_y", name: "Семен Дмитриевич Ястремский", years: "1860-1936", title: "Священник / Модельер", branch: "paternal", bio: "Ушел в протестанты. Ателье в Миллерово.", habits: ["Смена веры"], medical: ["Инсульт"], generation: 2, gender: "m", fatherId: "dmitriy_y" },
  { id: "tatyana_p", name: "Татьяна Карповна Полякова", years: "1886-1962", title: "Модельер знати", branch: "paternal", bio: "Шила для императрицы в Крыму.", habits: ["Вкус"], medical: [], generation: 2, gender: "f", fatherId: "karp_p", motherId: "elena_p" },
  { id: "ilya_v_hero", name: "Илья Терентьевич Ведерников", years: "уб. 1916", title: "Унтер-офицер", branch: "maternal", bio: "Погиб в Брусиловском прорыве.", habits: [], medical: [], generation: 2, gender: "m", fatherId: "terentiy_v" },
  { id: "alexey_sh", name: "Алексей Васильевич Шуплецов", years: "1906-1953", title: "Рыбак", branch: "maternal", bio: "Перевернулся в лодке.", habits: ["Рыбалка"], medical: [], generation: 2, gender: "m", fatherId: "vasiliy_sh_base" },
  { id: "vasiliy_b", name: "Василий Березкин", years: "1908-1942", title: "Нач. лесопилки", branch: "maternal", bio: "Пропал под Харьковом.", habits: [], medical: [], generation: 2, gender: "m", fatherId: "dmitriy_berezkin" },
  { id: "klavdiya_s", name: "Клавдия Андреевна Сандалова", years: "1913-1993", title: "Жена Василия", branch: "maternal", bio: "г. Уржум.", habits: [], medical: [], generation: 2, gender: "f", fatherId: "andrey_sanda", motherId: "gadalka_c" },
  { id: "ivan_b_bro", name: "Березкин Иван Дмитриевич", years: "1901-1941", title: "Брат Василия", branch: "maternal", bio: "Пропал без вести.", habits: [], medical: [], generation: 2, gender: "m", fatherId: "dmitriy_berezkin" },
  { id: "mihail_b_bro", name: "Березкин Михаил Дмитриевич", years: "1915-1943", title: "Брат Василия", branch: "maternal", bio: "Погиб в бою.", habits: [], medical: [], generation: 2, gender: "m", fatherId: "dmitriy_berezkin" },

  // --- ПОКОЛЕНИЕ 3: ПРАДЕДЫ (ГЕРОИ ВОВ) ---
  { id: "mercuriy_v", name: "Меркурий Евтихеевич Власов", years: "1912-2000", title: "Воентехник авиации", branch: "paternal", bio: "Герой Севастополя. Выжил в 1942.", habits: ["Шахматы"], medical: ["Сердце"], generation: 3, gender: "m", fatherId: "evtikhiy_v" },
  { id: "hristina_k", name: "Христина Егоровна Клабукова", years: "1922-1989", title: "Жена Меркурия", branch: "paternal", bio: "г. Киров.", habits: [], medical: [], generation: 3, gender: "f" },
  { id: "zinoviy_y", name: "Зиновий Семенович Ястремский", years: "1912-1991", title: "Инженер / Лесовод", branch: "paternal", bio: "Дошел до Берлина.", habits: ["Охота"], medical: ["Атеросклероз"], generation: 3, gender: "m", fatherId: "semyon_y", motherId: "tatyana_p" },
  { id: "anna_t", name: "Анна Николаевна Торотько", years: "1921-2003", title: "Капитан медслужбы", branch: "paternal", bio: "Хирург Сиваша.", habits: ["Шоколад"], medical: ["Онкология"], generation: 3, gender: "f", fatherId: "nikolai_torotko", motherId: "olga_ch" },
  { id: "pavel_y_bro", name: "Павел Семенович Ястремский", years: "1911-1994", title: "Профессор химии", branch: "paternal", bio: "Волгоград.", habits: [], medical: [], generation: 3, gender: "m", fatherId: "semyon_y" },
  { id: "anatoliy_sh", name: "Анатолий Алексеевич Шуплецов", years: "1935-2005", title: "Директор промхоза", branch: "maternal", bio: "Омутнинск.", habits: ["Лидерство"], medical: ["Диабет"], generation: 3, gender: "m", fatherId: "alexey_sh", motherId: "anna_ved" },
  { id: "valentina_b", name: "Валентина Березкина", years: "1936-2025", title: "Медсестра", branch: "maternal", bio: "Артистка.", habits: ["Вязание"], medical: [], generation: 3, gender: "f", fatherId: "vasiliy_b", motherId: "klavdiya_s" },
  { id: "anna_ved", name: "Анна Ильинична Ведерникова", years: "1909-1996", title: "Хозяйка", branch: "maternal", bio: "с. Мокино.", habits: [], medical: ["Долгожитель"], generation: 3, gender: "f", fatherId: "ilya_v_hero" },
  { id: "galina_kras", name: "Галина Алексеевна Краснюк", years: "1929-2020", title: "Прабабушка", branch: "maternal", bio: "3 брака.", habits: [], medical: [], generation: 3, gender: "f" },
  { id: "nikolai_korol_p", name: "Николай Королев", years: "", title: "Муж Галины", branch: "maternal", bio: "Отец деда Игоря.", habits: [], medical: [], generation: 3, gender: "m" },

  // --- ПОКОЛЕНИЕ 4: ДЕДЫ И БАБУШКИ ---
  { id: "alexander_v", name: "Александр Меркурьевич Власов", years: "род. 1950", title: "Дед Саша", branch: "paternal", bio: "Шахматист.", habits: ["Шахматы"], medical: [], generation: 4, gender: "m", fatherId: "mercuriy_v", motherId: "hristina_k" },
  { id: "olga_v_p", name: "Ольга Зиновьевна Власова", years: "род. 1951", title: "Баба Оля", branch: "paternal", bio: "Летописец семьи.", habits: ["История"], medical: [], generation: 4, gender: "f", fatherId: "zinoviy_y", motherId: "anna_t" },
  { id: "igor_korol", name: "Игорь Николаевич Королев", years: "1938-2010", title: "Главный инженер", branch: "maternal", bio: "Омутнинск.", habits: ["Инженерия"], medical: [], generation: 4, gender: "m", fatherId: "nikolai_korol_p", motherId: "galina_kras" },
  { id: "svetlana_k", name: "Светлана Королева", years: "род. 1941", title: "Баба Света", branch: "maternal", bio: "Ветеран труда.", habits: [], medical: [], generation: 4, gender: "f", fatherId: "anatoliy_sh", motherId: "valentina_b" },
  { id: "konstantin_y", name: "Константин Павлович Ястремский", years: "", title: "Ученый РАН", branch: "paternal", bio: "Москва.", habits: [], medical: [], generation: 4, gender: "m", fatherId: "pavel_y_bro" },
  { id: "irina_v_okul", name: "Ирина Меркурьевна Власова", years: "ум. недавно", title: "Сестра деда Саши", branch: "paternal", bio: "Окуловская.", habits: [], medical: [], generation: 4, gender: "f", fatherId: "mercuriy_v" },

  // --- ПОКОЛЕНИЕ 5: РОДИТЕЛИ ---
  { id: "igor_v", name: "Игорь Александрович Власов", years: "1976", title: "Отец", branch: "both", bio: "Служба в Херсоне.", habits: [], medical: [], generation: 5, gender: "m", fatherId: "alexander_v", motherId: "olga_v_p" },
  { id: "anna_k", name: "Анна Игоревна Королева", years: "1970", title: "Мать", branch: "both", bio: "Хранитель вятской ветви.", habits: [], medical: [], generation: 5, gender: "f", fatherId: "igor_korol", motherId: "svetlana_k" },

  // --- ПОКОЛЕНИЕ 6: ВЫ ---
  { id: "pavel_v", name: "Павел Власов", years: "2008", title: "Я", branch: "both", bio: "Автор сайта.", habits: ["Технологии"], medical: [], generation: 6, gender: "m", fatherId: "igor_v", motherId: "anna_k" },
  { id: "pyotr_v", name: "Пётр Власов", years: "2011", title: "Брат", branch: "both", bio: "", habits: [], medical: [], generation: 6, gender: "m", fatherId: "igor_v", motherId: "anna_k" }
];


