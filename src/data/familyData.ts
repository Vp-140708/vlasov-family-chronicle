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
  // ПОКОЛЕНИЕ 0 (ОСНОВАТЕЛИ)
  { id: "kirill_v", name: "Кирилл Ведерников", years: "~1800", title: "Вятский пахарь", branch: "maternal", bio: "", habits: [], medical: [], generation: 0, gender: "m" },
  { id: "mihail_t", name: "Михаил Тороцко", years: "~1820", title: "Околичная шляхта", branch: "paternal", bio: "", habits: [], medical: [], generation: 0, gender: "m" },

  // ПОКОЛЕНИЕ 1
  { id: "terentiy_v", name: "Терентий Ведерников", years: "~1850", title: "Крестьянин", branch: "maternal", bio: "", habits: [], medical: [], generation: 1, gender: "m", fatherId: "kirill_v" },
  { id: "vikentiy_t", name: "Викентий Тороцко", years: "~1860", title: "Шляхтич", branch: "paternal", bio: "", habits: [], medical: [], generation: 1, gender: "m", fatherId: "mihail_t" },
  { id: "nikolai_ch", name: "Николай Черномашенцев", years: "~1860", title: "Чиновник", branch: "paternal", bio: "Воронеж", habits: [], medical: [], generation: 1, gender: "m" },
  { id: "semyon_y", name: "Семен Ястремский", years: "1860-1936", title: "Священник", branch: "paternal", bio: "Харьков", habits: [], medical: ["Сердце"], generation: 1, gender: "m" },

  // ПОКОЛЕНИЕ 2 (ПРАПРА)
  { id: "nikolai_torotko", name: "Николай Викентьевич Тороцко", years: "1888-1974", title: "Офицер РИА", branch: "paternal", bio: "Георгиевское оружие", habits: [], medical: [], generation: 2, gender: "m", fatherId: "vikentiy_t", spouseId: "olga_ch" },
  { id: "olga_ch", name: "Ольга Николаевна Черномашенцева", years: "1896-1951", title: "Дворянка, пианистка", branch: "paternal", bio: "", habits: [], medical: ["Онкология"], generation: 2, gender: "f", spouseId: "nikolai_torotko" },
  { id: "zinoviy_y", name: "Зиновий Семенович Ястремский", years: "1912-1991", title: "Инженер-землеустроитель", branch: "paternal", bio: "Ветеран ВОВ", habits: [], medical: [], generation: 2, gender: "m", fatherId: "semyon_y", spouseId: "anna_t" },
  { id: "ilya_v", name: "Илья Терентьевич Ведерников", years: "уб. 1916", title: "Унтер-офицер", branch: "maternal", bio: "", habits: [], medical: [], generation: 2, gender: "m", fatherId: "terentiy_v" },
  { id: "vasiliy_b", name: "Василий Березкин", years: "1908-1942", title: "Начальник лесопилки", branch: "maternal", bio: "", habits: [], medical: [], generation: 2, gender: "m" },

  // ПОКОЛЕНИЕ 3 (ПРА)
  { id: "mercuriy_v", name: "Меркурий Евтихеевич Власов", years: "1912-2000", title: "Воентехник авиации", branch: "paternal", bio: "Севастополь", habits: ["Шахматист"], medical: ["Сердце"], generation: 3, gender: "m" },
  { id: "anna_t", name: "Анна Николаевна Торотько", years: "1921-2003", title: "Капитан медслужбы", branch: "paternal", bio: "Хирург", habits: [], medical: ["Онкология"], generation: 3, gender: "f", fatherId: "nikolai_torotko", motherId: "olga_ch", spouseId: "zinoviy_y" },
  { id: "anatoliy_sh", name: "Анатолий Алексеевич Шуплецов", years: "1935-2005", title: "Директор промхоза", branch: "maternal", bio: "", habits: [], medical: ["Диабет"], generation: 3, gender: "m" },
  { id: "valentina_b", name: "Валентина Березкина", years: "1936-2025", title: "Медсестра", branch: "maternal", bio: "", habits: [], medical: [], generation: 3, gender: "f", fatherId: "vasiliy_b", spouseId: "anatoliy_sh" },

  // ПОКОЛЕНИЕ 4 (ДЕДЫ)
  { id: "alexander_v", name: "Александр Меркурьевич Власов", years: "род. 1950", title: "Дед Саша", branch: "paternal", bio: "Шахматист", habits: [], medical: [], generation: 4, gender: "m", fatherId: "mercuriy_v", spouseId: "olga_v_p" },
  { id: "olga_v_p", name: "Ольга Зиновьевна Власова", years: "род. 1951", title: "Баба Оля", branch: "paternal", bio: "", habits: [], medical: [], generation: 4, gender: "f", fatherId: "zinoviy_y", motherId: "anna_t", spouseId: "alexander_v" },
  { id: "igor_k", name: "Игорь Николаевич Королев", years: "1938-2010", title: "Дед Игорь", branch: "maternal", bio: "Инженер", habits: [], medical: [], generation: 4, gender: "m", spouseId: "svetlana_k" },
  { id: "svetlana_k", name: "Светлана Королева", years: "род. 1941", title: "Баба Света", branch: "maternal", bio: "", habits: [], medical: [], generation: 4, gender: "f", fatherId: "anatoliy_sh", motherId: "valentina_b", spouseId: "igor_k" },

  // ПОКОЛЕНИЕ 5 (РОДИТЕЛИ)
  { id: "igor_v", name: "Игорь Власов", years: "род. 1976", title: "Отец", branch: "both", bio: "", habits: [], medical: [], generation: 5, gender: "m", fatherId: "alexander_v", motherId: "olga_v_p", spouseId: "anna_k" },
  { id: "anna_k", name: "Анна Королева", years: "род. 1970", title: "Мать", branch: "both", bio: "", habits: [], medical: [], generation: 5, gender: "f", fatherId: "igor_k", motherId: "svetlana_k", spouseId: "igor_v" },

  // ПОКОЛЕНИЕ 6 (ВЫ)
  { id: "pavel_v", name: "Павел Власов", years: "род. 2008", title: "Я", branch: "both", bio: "", habits: [], medical: [], generation: 6, gender: "m", fatherId: "igor_v", motherId: "anna_k" },
  { id: "pyotr_v", name: "Пётр Власов", years: "род. 2011", title: "Брат", branch: "both", bio: "", habits: [], medical: [], generation: 6, gender: "m", fatherId: "igor_v", motherId: "anna_k" }
];