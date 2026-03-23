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
  // --- ПАПИНА ЛИНИЯ: ЯСТРЕМСКИЕ / ПОЛЯКОВЫ ---
  { id: "stefan_y", name: "Стефан Ястремский", years: "~1790", title: "Священник (Основатель)", branch: "paternal", bio: "", habits: [], medical: [], generation: 0, gender: "m" },
  { id: "ivan_y", name: "Иван Степанович Ястремский", years: "~1820", title: "Священник", branch: "paternal", bio: "", habits: [], medical: [], generation: 1, gender: "m", fatherId: "stefan_y" },
  { id: "mark_p", name: "Марк Поляков", years: "~1820", title: "Купец", branch: "paternal", bio: "", habits: [], medical: [], generation: 1, gender: "m" },
  { id: "dmitriy_y", name: "Дмитрий Иванович Ястремский", years: "~1840", title: "Священник", branch: "paternal", bio: "", habits: [], medical: [], generation: 2, gender: "m", fatherId: "ivan_y" },
  { id: "karp_p", name: "Карп Маркович Поляков", years: "~1850", title: "Отец Татьяны", branch: "paternal", bio: "", habits: [], medical: [], generation: 2, gender: "m", fatherId: "mark_p" },
  { id: "elena_p", name: "Елена Константиновна Полякова", years: "~1850", title: "Мать Татьяны", branch: "paternal", bio: "", habits: [], medical: [], generation: 2, gender: "f" },
  { id: "semyon_y", name: "Семен Дмитриевич Ястремский", years: "1860-1936", title: "Священник / Закройщик", branch: "paternal", bio: "", habits: ["Смена веры"], medical: ["Инсульт"], generation: 3, gender: "m", fatherId: "dmitriy_y" },
  { id: "tatyana_p", name: "Татьяна Карповна Полякова", years: "1886-1962", title: "Модельер знати", branch: "paternal", bio: "", habits: [], medical: [], generation: 3, gender: "f", fatherId: "karp_p", motherId: "elena_p" },
  
  // Дети Семена (Братья и сестры Зиновия)
  { id: "pavel_y_bro", name: "Павел Семенович Ястремский", years: "1911-1994", title: "Профессор химии (Брат Зиновия)", branch: "paternal", bio: "", habits: [], medical: [], generation: 4, gender: "m", fatherId: "semyon_y" },
  { id: "konstantin_y", name: "Константин Павлович Ястремский", years: "", title: "Ученый РАН (Сын Павла)", branch: "paternal", bio: "", habits: [], medical: [], generation: 5, gender: "m", fatherId: "pavel_y_bro" },
  { id: "lidiya_y", name: "Лидия Семеновна Ястремская", years: "1919", title: "Медсестра ВОВ", branch: "paternal", bio: "", habits: [], medical: [], generation: 4, gender: "f", fatherId: "semyon_y" },
  { id: "lyubov_y", name: "Любовь Семеновна Ястремская", years: "1915", title: "Сестра Зиновия", branch: "paternal", bio: "", habits: [], medical: [], generation: 4, gender: "f", fatherId: "semyon_y" },
  { id: "nadezhda_y", name: "Надежда Ястремская", years: "1914", title: "Сестра", branch: "paternal", bio: "", habits: [], medical: [], generation: 4, gender: "f", fatherId: "semyon_y" },
  { id: "vera_y", name: "Вера Ястремская", years: "1917", title: "Сестра", branch: "paternal", bio: "", habits: [], medical: [], generation: 4, gender: "f", fatherId: "semyon_y" },
  { id: "valentina_y", name: "Валентина Ястремская", years: "1921", title: "Сестра", branch: "paternal", bio: "", habits: [], medical: [], generation: 4, gender: "f", fatherId: "semyon_y" },

  // --- ПАПИНА ЛИНИЯ: ТОРОЦКО / ЧЕРНОМАШЕНЦЕВЫ ---
  { id: "mihail_t", name: "Михаил Тороцко", years: "~1830", title: "Шляхтич", branch: "paternal", bio: "", habits: [], medical: [], generation: 1, gender: "m" },
  { id: "vikentiy_t", name: "Викентий Михайлович Тороцко", years: "~1860-1937", title: "Шляхтич", branch: "paternal", bio: "", habits: [], medical: [], generation: 2, gender: "m", fatherId: "mihail_t" },
  { id: "ilya_ch", name: "Илья Черномашенцев", years: "~1830", title: "Домовладелец", branch: "paternal", bio: "", habits: [], medical: [], generation: 1, gender: "m" },
  { id: "nikolai_ch_sen", name: "Николай Ильич Черномашенцев", years: "~1860", title: "Коллежский асессор", branch: "paternal", bio: "", habits: [], medical: ["Онкология"], generation: 2, gender: "m", fatherId: "ilya_ch" },
  { id: "nikolai_torotko", name: "Николай Викентьевич Тороцко", years: "1888-1974", title: "Штабс-капитан РИА", branch: "paternal", bio: "", habits: ["Мастер"], medical: ["Псориаз"], generation: 3, gender: "m", fatherId: "vikentiy_t" },
  { id: "olga_ch", name: "Ольга Николаевна Черномашенцева", years: "1896-1951", title: "Дворянка / Пианистка", branch: "paternal", bio: "", habits: ["Музыка"], medical: ["Онкология"], generation: 3, gender: "f", fatherId: "nikolai_ch_sen" },
  { id: "zinoviy_y", name: "Зиновий Семенович Ястремский", years: "1912-1991", title: "Инженер / Лесовод", branch: "paternal", bio: "", habits: ["Охота"], medical: [], generation: 4, gender: "m", fatherId: "semyon_y", motherId: "tatyana_p" },
  { id: "anna_t", name: "Анна Николаевна Торотько", years: "1921-2003", title: "Капитан медслужбы", branch: "paternal", bio: "", habits: [], medical: ["Онкология"], generation: 4, gender: "f", fatherId: "nikolai_torotko", motherId: "olga_ch" },

  // --- ПАПИНА ЛИНИЯ: ВЛАСОВЫ / ОКУЛОВСКИЕ ---
  { id: "semyon_v", name: "Семен Власов", years: "~1850", title: "Прапрапрадед", branch: "paternal", bio: "", habits: [], medical: [], generation: 2, gender: "m" },
  { id: "evtikhiy_v", name: "Евтихий Семенович Власов", years: "~1880", title: "Прапрадед", branch: "paternal", bio: "", habits: [], medical: [], generation: 3, gender: "m", fatherId: "semyon_v" },
  { id: "mercuriy_v", name: "Меркурий Евтихеевич Власов", years: "1912-2000", title: "Воентехник авиации", branch: "paternal", bio: "", habits: ["Шахматы"], medical: ["Сердце"], generation: 4, gender: "m", fatherId: "evtikhiy_v" },
  { id: "hristina_k", name: "Христина Егоровна Клабукова", years: "1922-1989", title: "Жена Меркурия", branch: "paternal", bio: "", habits: [], medical: [], generation: 4, gender: "f" },
  { id: "alexander_v", name: "Александр Меркурьевич Власов", years: "род. 1950", title: "Дед Саша", branch: "paternal", bio: "", habits: ["Шахматы"], medical: [], generation: 5, gender: "m", fatherId: "mercuriy_v", motherId: "hristina_k" },
  { id: "olga_v_p", name: "Ольга Зиновьевна Власова", years: "род. 1951", title: "Бабушка Оля", branch: "paternal", bio: "", habits: [], medical: [], generation: 5, gender: "f", fatherId: "zinoviy_y", motherId: "anna_t" },
  { id: "masha_v", name: "Мария Александровна Власова", years: "род. 1977", title: "Сестра папы", branch: "paternal", bio: "", habits: [], medical: [], generation: 6, gender: "f", fatherId: "alexander_v", motherId: "olga_v_p" },
  { id: "katya_v", name: "Екатерина (Дочь Маши)", years: "", title: "Кузина", branch: "paternal", bio: "", habits: [], medical: [], generation: 7, gender: "f", motherId: "masha_v" },
  
  // Ветка Окуловских (ФИНАЛЬНО ПОЛНАЯ)
  { id: "irina_v_ok", name: "Ирина Власова (Окуловская)", years: "", title: "Сестра деда Саши", branch: "paternal", bio: "", habits: [], medical: [], generation: 5, gender: "f", fatherId: "mercuriy_v" },
  { id: "vlad_ok", name: "Владимир Окуловский", years: "", title: "Муж Ирины", branch: "paternal", bio: "", habits: [], medical: [], generation: 5, gender: "m" },
  { id: "alexey_ok", name: "Алексей Владимирович Окуловский", years: "", title: "Сын Ирины", branch: "paternal", bio: "", habits: [], medical: [], generation: 6, gender: "m", fatherId: "vlad_ok", motherId: "irina_v_ok" },
  { id: "olga_ok_wife", name: "Ольга Окуловская (Жена Алексея)", years: "", title: "Жена Алексея", branch: "paternal", bio: "", habits: [], medical: [], generation: 6, gender: "f" },
  { id: "sergey_ok", name: "Сергей Владимирович Окуловский", years: "", title: "Сын Ирины", branch: "paternal", bio: "", habits: [], medical: [], generation: 6, gender: "m", fatherId: "vlad_ok", motherId: "irina_v_ok" },
  { id: "olesya_ok_wife", name: "Олеся Окуловская (Жена Сергея)", years: "", title: "Жена Сергея", branch: "paternal", bio: "", habits: [], medical: [], generation: 6, gender: "f" },
  { id: "mihail_ok", name: "Михаил Окуловский", years: "", title: "Сын Алексея", branch: "paternal", bio: "", habits: [], medical: [], generation: 7, gender: "m", fatherId: "alexey_ok", motherId: "olga_ok_wife" },
  { id: "ilya_ok", name: "Илья Окуловский", years: "", title: "Сын Сергея", branch: "paternal", bio: "", habits: [], medical: [], generation: 7, gender: "m", fatherId: "sergey_ok", motherId: "olesya_ok_wife" },
  { id: "matvey_ok", name: "Матвей Окуловский", years: "", title: "Сын Сергея", branch: "paternal", bio: "", habits: [], medical: [], generation: 7, gender: "m", fatherId: "sergey_ok", motherId: "olesya_ok_wife" },

  // --- МАМИНА ЛИНИЯ: ВЯТКА / УРЖУМ ---
  { id: "kirill_v_m", name: "Кирилл Ведерников", years: "~1795", title: "Глава рода", branch: "maternal", bio: "", habits: [], medical: [], generation: 0, gender: "m" },
  { id: "terentiy_v_m", name: "Терентий Ведерников", years: "~1850", title: "Крестьянин", branch: "maternal", bio: "", habits: [], medical: [], generation: 1, gender: "m", fatherId: "kirill_v_m" },
  { id: "nikifor_sh", name: "Никифор Шуплецов", years: "~1840", title: "Шорник", branch: "maternal", bio: "", habits: [], medical: [], generation: 0, gender: "m" },
  { id: "vasiliy_sh_sen", name: "Василий Шуплецов", years: "~1870", title: "Пра(x3)дед", branch: "maternal", bio: "", habits: [], medical: [], generation: 1, gender: "m", fatherId: "nikifor_sh" },
  { id: "ivan_s", name: "Иван Сандалов", years: "~1850", title: "Мещанин", branch: "maternal", bio: "", habits: [], medical: [], generation: 0, gender: "m" },
  { id: "andrey_s", name: "Андрей Сандалов", years: "~1880", title: "Портной / Николай II", branch: "maternal", bio: "", habits: [], medical: [], generation: 1, gender: "m", fatherId: "ivan_s" },
  { id: "gadalka_c", name: "Жена Андрея (Гадалка)", years: "", title: "Ясновидящая", branch: "maternal", bio: "", habits: [], medical: [], generation: 1, gender: "f" },
  { id: "pelageya_p", name: "Пелагея (тетя Поля)", years: "", title: "Повар (Мать Галины)", branch: "maternal", bio: "", habits: [], medical: [], generation: 1, gender: "f" },
  
  { id: "ilya_v_m", name: "Илья Терентьевич Ведерников", years: "уб. 1916", title: "Унтер-офицер", branch: "maternal", bio: "", habits: [], medical: [], generation: 2, gender: "m", fatherId: "terentiy_v_m" },
  { id: "alexey_sh", name: "Алексей Васильевич Шуплецов", years: "1906-1953", title: "Рыбак", branch: "maternal", bio: "", habits: [], medical: [], generation: 2, gender: "m", fatherId: "vasiliy_sh_sen" },
  { id: "anna_ved", name: "Анна Ильинична Ведерникова", years: "1909-1996", title: "Хозяйка", branch: "maternal", bio: "", habits: [], medical: [], generation: 3, gender: "f", fatherId: "ilya_v_m" },
  { id: "dmitriy_b", name: "Дмитрий Березкин", years: "~1870", title: "Уржум", branch: "maternal", bio: "", habits: [], medical: [], generation: 1, gender: "m" },
  { id: "vasiliy_b", name: "Василий Березкин", years: "1908-1942", title: "Нач. лесопилки", branch: "maternal", bio: "Пропал на ВОВ.", habits: [], medical: [], generation: 2, gender: "m", fatherId: "dmitriy_b" },
  { id: "ivan_b_bro", name: "Иван Березкин", years: "1901-1941", title: "Погиб на ВОВ", branch: "maternal", bio: "", habits: [], medical: [], generation: 2, gender: "m", fatherId: "dmitriy_b" },
  { id: "mihail_b_bro", name: "Михаил Березкин", years: "1915-1943", title: "Погиб на ВОВ", branch: "maternal", bio: "", habits: [], medical: [], generation: 2, gender: "m", fatherId: "dmitriy_b" },
  { id: "klavdiya_s", name: "Клавдия Андреевна Сандалова", years: "1913-1993", title: "Прабабушка", branch: "maternal", bio: "", habits: [], medical: [], generation: 2, gender: "f", fatherId: "andrey_s", motherId: "gadalka_c" },

  // Линия Королевых (С НИКОЛАЕМ И ИЛЬЕЙ)
  { id: "galina_k", name: "Галина Алексеевна Краснюк", years: "1929-2020", title: "Прабабушка", branch: "maternal", bio: "", habits: [], medical: [], generation: 2, gender: "f", motherId: "pelageya_p" },
  { id: "nikolai_k_sen", name: "Николай Королев", years: "", title: "Прадед (Отец Игоря)", branch: "maternal", bio: "", habits: [], medical: [], generation: 2, gender: "m" },
  { id: "anatoliy_sh", name: "Анатолий Алексеевич Шуплецов", years: "1935-2005", title: "Директор промхоза", branch: "maternal", bio: "", habits: [], medical: ["Диабет"], generation: 3, gender: "m", fatherId: "alexey_sh", motherId: "anna_ved" },
  { id: "valentina_b", name: "Валентина Васильевна Березкина", years: "1936-2025", title: "Медсестра", branch: "maternal", bio: "", habits: [], medical: [], generation: 3, gender: "f", fatherId: "vasiliy_b", motherId: "klavdiya_s" },
  { id: "igor_kor_sen", name: "Игорь Николаевич Королев", years: "1938-2010", title: "Дед Игорь", branch: "maternal", bio: "", habits: [], medical: [], generation: 3, gender: "m", fatherId: "nikolai_k_sen", motherId: "galina_k" },
  { id: "ilya_k_metall", name: "Илья Николаевич Королев", years: "", title: "Металлург (Орден Ленина)", branch: "maternal", bio: "Брат деда Игоря.", habits: [], medical: [], generation: 3, gender: "m", fatherId: "nikolai_k_sen", motherId: "galina_k" },

  // РОДИТЕЛИ И ВЫ
  { id: "svetlana_k_b", name: "Светлана Анатольевна Королева", years: "род. 1941", title: "Бабушка Света", branch: "maternal", bio: "", habits: [], medical: [], generation: 4, gender: "f", fatherId: "anatoliy_sh", motherId: "valentina_b" },
  { id: "igor_v", name: "Игорь Александрович Власов", years: "1976", title: "Отец", branch: "both", bio: "", habits: [], medical: [], generation: 6, gender: "m", fatherId: "alexander_v", motherId: "olga_v_p" },
  { id: "anna_k", name: "Анна Игоревна Королева", years: "1970", title: "Мать", branch: "both", bio: "", habits: [], medical: [], generation: 6, gender: "f", fatherId: "igor_kor_sen", motherId: "svetlana_k_b" },
  { id: "pavel_v", name: "Павел Власов", years: "2008", title: "Я", branch: "both", bio: "", habits: [], medical: [], generation: 7, gender: "m", fatherId: "igor_v", motherId: "anna_k" },
  { id: "pyotr_v", name: "Пётр Власов", years: "2011", title: "Брат", branch: "both", bio: "", habits: [], medical: [], generation: 7, gender: "m", fatherId: "igor_v", motherId: "anna_k" }
];