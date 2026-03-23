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
  // --- ПАПИНА ЛИНИЯ: ЯСТРЕМСКИЕ (8 поколений) ---
  { id: "stefan_y", name: "Стефан Ястремский", years: "~1790", title: "Священник (Основатель)", branch: "paternal", bio: "Служил в храмах Слобожанщины. Начало династии.", habits: [], medical: [], generation: 0, gender: "m" },
  { id: "ivan_y", name: "Иван Степанович Ястремский", years: "~1820", title: "Священник", branch: "paternal", bio: "Служил в Харьковской епархии.", habits: [], medical: [], generation: 1, gender: "m", fatherId: "stefan_y" },
  { id: "dmitriy_y", name: "Дмитрий Иванович Ястремский", years: "~1840", title: "Священник", branch: "paternal", bio: "Служил в Вознесенской церкви с. Дерюгино.", habits: [], medical: [], generation: 2, gender: "m", fatherId: "ivan_y" },
  { id: "semyon_y", name: "Семен Дмитриевич Ястремский", years: "1860-1936", title: "Священник / Закройщик", branch: "paternal", bio: "Родился в Харькове. Ушел в протестанты. Владел ателье в Миллерово.", habits: ["Смена веры"], medical: ["Инсульт"], generation: 3, gender: "m", fatherId: "dmitriy_y" },
  
  // Братья Зиновия (Дети Семена)
  { id: "pavel_y_bro", name: "Павел Семенович Ястремский", years: "1911-1994", title: "Профессор химии", branch: "paternal", bio: "Ученый из Волгограда.", habits: [], medical: [], generation: 4, gender: "m", fatherId: "semyon_y" },
  { id: "konstantin_y_nephew", name: "Константин Павлович Ястремский", years: "", title: "Ученый РАН", branch: "paternal", bio: "Москва, ИОНХ РАН.", habits: [], medical: [], generation: 5, gender: "m", fatherId: "pavel_y_bro" },
  { id: "lidiya_y_sis", name: "Лидия Семеновна Ястремская", years: "род. 1919", title: "Медсестра ВОВ", branch: "paternal", bio: "", habits: [], medical: [], generation: 4, gender: "f", fatherId: "semyon_y" },
  { id: "lyubov_y_sis", name: "Любовь Семеновна Ястремская", years: "1915", title: "Сестра Зиновия", branch: "paternal", bio: "", habits: [], medical: [], generation: 4, gender: "f", fatherId: "semyon_y" },
  { id: "nadezhda_y_sis", name: "Надежда Ястремская", years: "1914", title: "Сестра", branch: "paternal", bio: "", habits: [], medical: [], generation: 4, gender: "f", fatherId: "semyon_y" },
  { id: "vera_y_sis", name: "Вера Ястремская", years: "1917", title: "Сестра", branch: "paternal", bio: "", habits: [], medical: [], generation: 4, gender: "f", fatherId: "semyon_y" },
  { id: "valentina_y_sis", name: "Валентина Ястремская", years: "1921", title: "Сестра", branch: "paternal", bio: "", habits: [], medical: [], generation: 4, gender: "f", fatherId: "semyon_y" },

  // --- ЛИНИЯ ПОЛЯКОВЫХ (Связь с банкирами) ---
  { id: "mark_p", name: "Марк Поляков", years: "~1820", title: "Купеческий род", branch: "paternal", bio: "Вероятно, брат банкира Лазаря Полякова.", habits: [], medical: [], generation: 1, gender: "m" },
  { id: "karp_p", name: "Карп Маркович Поляков", years: "~1850", title: "Рядовой / Мещанин", branch: "paternal", bio: "Отец Татьяны. Одесса.", habits: [], medical: [], generation: 2, gender: "m", fatherId: "mark_p" },
  { id: "elena_p", name: "Елена Константиновна Полякова", years: "~1850", title: "Жена Карпа", branch: "paternal", bio: "из д. Забонь.", habits: [], medical: [], generation: 2, gender: "f" },
  { id: "tatyana_p", name: "Татьяна Карповна Полякова", years: "1886-1962", title: "Модельер знати", branch: "paternal", bio: "Шила для дворцов Крыма. Племянница магната Полякова.", habits: ["Безупречный вкус"], medical: [], generation: 3, gender: "f", fatherId: "karp_p", motherId: "elena_p", spouseId: "semyon_y" },
  { id: "mihail_p_uncle", name: "Михаил Поляков", years: "", title: "Дядя-застройщик", branch: "paternal", bio: "Крупный подрядчик в Одессе (ул. Еврейская, 4).", habits: [], medical: [], generation: 2, gender: "m" },

  // --- ЛИНИЯ ТОРОЦКО (Герои и лагеря) ---
  { id: "mihail_t", name: "Михаил Тороцко", years: "~1830", title: "Шляхтич", branch: "paternal", bio: "Деревня Римаши, Минская губерния.", habits: [], medical: [], generation: 1, gender: "m" },
  { id: "vikentiy_t", name: "Викентий Михайлович Тороцко", years: "~1860-1937", title: "Белорусский шляхтич", branch: "paternal", bio: "Арестован НКВД в 1937 г.", habits: [], medical: [], generation: 2, gender: "m", fatherId: "mihail_t" },
  { id: "nikolai_torotko", name: "Николай Викентьевич Тороцко", years: "1888-1974", title: "Штабс-капитан РИА", branch: "paternal", bio: "Герой ПМВ, Георгиевское оружие. 20 лет Воркуты.", habits: ["Плетение корзин"], medical: ["Псориаз"], generation: 3, gender: "m", fatherId: "vikentiy_t", spouseId: "olga_ch" },
  
  // --- ЛИНИЯ ЧЕРНОМАШЕНЦЕВЫХ (Дворяне) ---
  { id: "ilya_ch", name: "Илья Черномашенцев", years: "~1830", title: "Домовладелец", branch: "paternal", bio: "Воронеж.", habits: [], medical: [], generation: 1, gender: "m" },
  { id: "nikolai_ch_sen", name: "Николай Ильич Черномашенцев", years: "~1860", title: "Коллежский асессор", branch: "paternal", bio: "Чиновник Казенной палаты Воронежа.", habits: [], medical: ["Онкология"], generation: 2, gender: "m", fatherId: "ilya_ch" },
  { id: "olga_ch", name: "Ольга Николаевна Черномашенцева", years: "1896-1951", title: "Дворянка / Пианистка", branch: "paternal", bio: "Консерватория. Тапер в Туапсе.", habits: ["Музыка"], medical: ["Онкология"], generation: 3, gender: "f", fatherId: "nikolai_ch_sen", spouseId: "nikolai_torotko" },

  // --- ПРЯМАЯ ВЕТКА ПАПЫ (Власовы) ---
  { id: "semyon_v", name: "Семен Власов", years: "~1850", title: "Прапрапрадед", branch: "paternal", bio: "Вятский крестьянин.", habits: [], medical: [], generation: 2, gender: "m" },
  { id: "evtikhiy_v", name: "Евтихий Семенович Власов", years: "~1880", title: "Прапрадед", branch: "paternal", bio: "Яранский уезд. Старообрядческие корни.", habits: [], medical: [], generation: 3, gender: "m", fatherId: "semyon_v" },
  { id: "mercuriy_v", name: "Меркурий Евтихеевич Власов", years: "1912-2000", title: "Воентехник авиации ЧФ", branch: "paternal", bio: "Герой Севастополя. Выжил 03.07.1942.", habits: ["Шахматы"], medical: ["Сердце"], generation: 4, gender: "m", fatherId: "evtikhiy_v", spouseId: "hristina_k" },
  { id: "hristina_k", name: "Христина Егоровна Клабукова", years: "1922-1989", title: "Жена Меркурия", branch: "paternal", bio: "", habits: [], medical: [], generation: 4, gender: "f", spouseId: "mercuriy_v" },
  { id: "zinoviy_y", name: "Зиновий Семенович Ястремский", years: "1912-1991", title: "Инженер / Лесовод", branch: "paternal", bio: "Ветеран ВОВ. Дошел до Берлина.", habits: ["Охота"], medical: [], generation: 4, gender: "m", fatherId: "semyon_y", motherId: "tatyana_p", spouseId: "anna_t" },
  { id: "anna_t", name: "Анна Николаевна Торотько", years: "1921-2003", title: "Капитан медслужбы", branch: "paternal", bio: "Хирург Сиваша. Госпиталь в Потсдаме.", habits: [], medical: ["Онкология"], generation: 4, gender: "f", fatherId: "nikolai_torotko", motherId: "olga_ch", spouseId: "zinoviy_y" },
  
  { id: "alexander_v", name: "Александр Меркурьевич Власов", years: "род. 1950", title: "Дед Саша", branch: "paternal", bio: "Шахматист. Председатель СНТ.", habits: ["Шахматы"], medical: [], generation: 5, gender: "m", fatherId: "mercuriy_v", motherId: "hristina_k", spouseId: "olga_v_p" },
  { id: "olga_v_p", name: "Ольга Зиновьевна Власова", years: "род. 1951", title: "Бабушка Оля", branch: "paternal", bio: "Хранитель архива.", habits: [], medical: [], generation: 5, gender: "f", fatherId: "zinoviy_y", motherId: "anna_t", spouseId: "alexander_v" },

  // Сестра папы и её ветка
  { id: "masha_v", name: "Мария Власова", years: "род. 1977", title: "Сестра папы", branch: "paternal", bio: "", habits: [], medical: [], generation: 6, gender: "f", fatherId: "alexander_v", motherId: "olga_v_p" },
  { id: "katya_v", name: "Екатерина", years: "", title: "Дочь Маши", branch: "paternal", bio: "", habits: [], medical: [], generation: 7, gender: "f", motherId: "masha_v" },

  // Ветка Окуловских (после Ирины)
  { id: "irina_v_ok", name: "Ирина Власова (Окуловская)", years: "ум. недавно", title: "Сестра деда Саши", branch: "paternal", bio: "", habits: [], medical: [], generation: 5, gender: "f", fatherId: "mercuriy_v" },
  { id: "vlad_ok", name: "Владимир Окуловский", years: "", title: "Муж Ирины", branch: "paternal", bio: "", habits: [], medical: [], generation: 5, gender: "m", spouseId: "irina_v_ok" },
  { id: "alexey_ok", name: "Алексей Окуловский", years: "", title: "Сын Ирины", branch: "paternal", bio: "Энергетик.", habits: [], medical: [], generation: 6, gender: "m", fatherId: "vlad_ok", motherId: "irina_v_ok" },
  { id: "sergey_ok", name: "Сергей Окуловский", years: "", title: "Сын Ирины", branch: "paternal", bio: "", habits: [], medical: [], generation: 6, gender: "m", fatherId: "vlad_ok", motherId: "irina_v_ok" },
  { id: "olesya_ok", name: "Олеся Окуловская", years: "", title: "Жена Сергея", branch: "paternal", bio: "", habits: [], medical: [], generation: 6, gender: "f", spouseId: "sergey_ok" },
  { id: "olga_ok_a", name: "Ольга Окуловская", years: "", title: "Жена Алексея", branch: "paternal", bio: "", habits: [], medical: [], generation: 6, gender: "f", spouseId: "alexey_ok" },
  { id: "mihail_ok", name: "Михаил Окуловский", years: "", title: "Сын Алексея", branch: "paternal", bio: "", habits: [], medical: [], generation: 7, gender: "m", fatherId: "alexey_ok", motherId: "olga_ok_a" },
  { id: "ilya_ok", name: "Илья Окуловский", years: "", title: "Сын Сергея", branch: "paternal", bio: "", habits: [], medical: [], generation: 7, gender: "m", fatherId: "sergey_ok", motherId: "olesya_ok" },
  { id: "matvey_ok", name: "Матвей Окуловский", years: "", title: "Сын Сергея", branch: "paternal", bio: "", habits: [], medical: [], generation: 7, gender: "m", fatherId: "sergey_ok", motherId: "olesya_ok" },

  // --- МАМИНА ЛИНИЯ: ШУПЛЕЦОВЫ, ВЕДЕРНИКОВЫ, САНДАЛОВЫ, КРАСНЮК ---
  { id: "pelageya_p", name: "Пелагея (тетя Поля)", years: "", title: "Повар (Прапрабабушка)", branch: "maternal", bio: "Мать Галины Краснюк.", habits: [], medical: [], generation: 1, gender: "f" },
  { id: "galina_k", name: "Галина Алексеевна Краснюк", years: "1929-2020", title: "Прабабушка", branch: "maternal", bio: "г. Омутнинск.", habits: [], medical: [], generation: 2, gender: "f", motherId: "pelageya_p" },
  { id: "nikolai_k_sen", name: "Николай Королев", years: "", title: "Прадед", branch: "maternal", bio: "Отец деда Игоря.", habits: [], medical: [], generation: 2, gender: "m", spouseId: "galina_k" },
  
  { id: "kirill_v_m", name: "Кирилл Ведерников", years: "~1795", title: "Вятский пахарь", branch: "maternal", bio: "Село Мокино.", habits: [], medical: [], generation: 0, gender: "m" },
  { id: "terentiy_v_m", name: "Терентий Ведерников", years: "~1850", title: "Крестьянин", branch: "maternal", bio: "", habits: [], medical: [], generation: 1, gender: "m", fatherId: "kirill_v_m" },
  { id: "ilya_v_m", name: "Илья Терентьевич Ведерников", years: "уб. 1916", title: "Унтер-офицер", branch: "maternal", bio: "Погиб в ПМВ.", habits: [], medical: [], generation: 2, gender: "m", fatherId: "terentiy_v_m" },
  { id: "anna_ved", name: "Анна Ильинична Ведерникова", years: "1909-1996", title: "Хозяйка", branch: "maternal", bio: "", habits: ["Хозяйственность"], medical: [], generation: 3, gender: "f", fatherId: "ilya_v_m" },

  { id: "nikifor_sh", name: "Никифор Шуплецов", years: "~1840", title: "Шорник", branch: "maternal", bio: "", habits: [], medical: [], generation: 0, gender: "m" },
  { id: "vasiliy_sh", name: "Василий Шуплецов", years: "~1870", title: "Мастер", branch: "maternal", bio: "", habits: [], medical: [], generation: 1, gender: "m", fatherId: "nikifor_sh" },
  { id: "alexey_sh", name: "Алексей Васильевич Шуплецов", years: "1906-1953", title: "Рыбак", branch: "maternal", bio: "Перевернулся в лодке.", habits: [], medical: [], generation: 2, gender: "m", fatherId: "vasiliy_sh" },
  { id: "anatoliy_sh", name: "Анатолий Алексеевич Шуплецов", years: "1935-2005", title: "Директор промхоза", branch: "maternal", bio: "Омутнинск.", habits: [], medical: ["Диабет"], generation: 3, gender: "m", fatherId: "alexey_sh", motherId: "anna_ved", spouseId: "valentina_b" },

  { id: "ivan_s", name: "Иван Сандалов", years: "~1850", title: "Мещанин", branch: "maternal", bio: "Уржум.", habits: [], medical: [], generation: 0, gender: "m" },
  { id: "andrey_s", name: "Андрей Сандалов", years: "~1880", title: "Портной", branch: "maternal", bio: "Похож на Царя.", habits: [], medical: [], generation: 1, gender: "m", fatherId: "ivan_s", spouseId: "gadalka_c" },
  { id: "gadalka_c", name: "Жена Андрея", years: "", title: "Гадалка", branch: "maternal", bio: "с. Цепочкино.", habits: ["Ясновидение"], medical: [], generation: 1, gender: "f", spouseId: "andrey_s" },
  { id: "klavdiya_s", name: "Клавдия Андреевна Сандалова", years: "1913-1993", title: "Бабушка", branch: "maternal", bio: "", habits: [], medical: [], generation: 2, gender: "f", fatherId: "andrey_s", motherId: "gadalka_c" },

  { id: "dmitriy_b", name: "Дмитрий Березкин", years: "~1870", title: "Уржум", branch: "maternal", bio: "", habits: [], medical: [], generation: 1, gender: "m" },
  { id: "vasiliy_b", name: "Василий Березкин", years: "1908-1942", title: "Нач. лесопилки", branch: "maternal", bio: "Пропал на ВОВ.", habits: [], medical: [], generation: 2, gender: "m", fatherId: "dmitriy_b", spouseId: "klavdiya_s" },
  { id: "valentina_b", name: "Валентина Васильевна Березкина", years: "1936-2025", title: "Медсестра", branch: "maternal", bio: "", habits: [], medical: [], generation: 3, gender: "f", fatherId: "vasiliy_b", motherId: "klavdiya_s", spouseId: "anatoliy_sh" },

  // --- РОДИТЕЛИ И ТЫ ---
  { id: "igor_kor_sen", name: "Игорь Николаевич Королев", years: "1938-2010", title: "Главный инженер", branch: "maternal", bio: "", habits: [], medical: [], generation: 4, gender: "m", fatherId: "nikolai_k_sen", motherId: "galina_k", spouseId: "svetlana_k_b" },
  { id: "svetlana_k_b", name: "Светлана Анатольевна Королева", years: "род. 1941", title: "Бабушка Света", branch: "maternal", bio: "", habits: [], medical: [], generation: 4, gender: "f", fatherId: "anatoliy_sh", motherId: "valentina_b", spouseId: "igor_kor_sen" },

  { id: "igor_v", name: "Игорь Александрович Власов", years: "1976", title: "Отец", branch: "both", bio: "Служба в Херсоне.", habits: [], medical: [], generation: 6, gender: "m", fatherId: "alexander_v", motherId: "olga_v_p", spouseId: "anna_k" },
  { id: "anna_k", name: "Анна Игоревна Королева", years: "1970", title: "Мать", branch: "both", bio: "", habits: [], medical: [], generation: 6, gender: "f", fatherId: "igor_kor_sen", motherId: "svetlana_k_b", spouseId: "igor_v" },

  { id: "pavel_v", name: "Павел Власов", years: "2008", title: "Я", branch: "both", bio: "Создатель сайта.", habits: [], medical: [], generation: 7, gender: "m", fatherId: "igor_v", motherId: "anna_k" },
  { id: "pyotr_v", name: "Пётр Власов", years: "2011", title: "Брат", branch: "both", bio: "", habits: [], medical: [], generation: 7, gender: "m", fatherId: "igor_v", motherId: "anna_k" }
];