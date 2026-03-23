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
  // ПОКОЛЕНИЕ 0: ПРА(х4)ДЕДЫ (~1800-1830)
  { id: "kirill_v", name: "Кирилл Ведерников", years: "~1800", title: "Вятский пахарь", branch: "maternal", bio: "Основатель ветки в селе Мокино.", habits: [], medical: [], generation: 0, gender: "m" },
  { id: "mihail_t", name: "Михаил Тороцко", years: "~1820", title: "Околичная шляхта", branch: "paternal", bio: "Минская губерния.", habits: [], medical: [], generation: 0, gender: "m" },

  // ПОКОЛЕНИЕ 1: ПРА(х3)ДЕДЫ (~1850)
  { id: "terentiy_v", name: "Терентий Ведерников", years: "~1850", title: "Крестьянин", branch: "maternal", bio: "", habits: [], medical: [], generation: 1, gender: "m", fatherId: "kirill_v" },
  { id: "vikentiy_t", name: "Викентий Тороцко", years: "~1860", title: "Белорусский шляхтич", branch: "paternal", bio: "", habits: [], medical: [], generation: 1, gender: "m", fatherId: "mihail_t" },
  { id: "nikolai_ch", name: "Николай Черномашенцев", years: "~1860", title: "Чиновник казенной палаты", branch: "paternal", bio: "Воронежское дворянство", habits: [], medical: ["Онкология"], generation: 1, gender: "m" },

  // ПОКОЛЕНИЕ 2: ПРАПРАДЕДЫ (Герои ПМВ)
  { id: "nikolai_torotko", name: "Николай Викентьевич Тороцко", years: "1888-1974", title: "Штабс-капитан РИА", branch: "paternal", bio: "Георгиевское оружие. Воркута.", habits: ["Мастер"], medical: ["Псориаз"], generation: 2, gender: "m", fatherId: "vikentiy_t", spouseId: "olga_chernomashentseva" },
  { id: "olga_chernomashentseva", name: "Ольга Николаевна Черномашенцева", years: "1896-1951", title: "Дворянка, пианистка", branch: "paternal", bio: "Консерватория.", habits: [], medical: ["Онкология"], generation: 2, gender: "f", spouseId: "nikolai_torotko" },
  { id: "ilya_vedernikov", name: "Илья Терентьевич Ведерников", years: "уб. 1916", title: "Унтер-офицер", branch: "maternal", bio: "Погиб в Брусиловском прорыве.", habits: [], medical: [], generation: 2, gender: "m", fatherId: "terentiy_v" },
  { id: "vasiliy_berezkin", name: "Василий Дмитриевич Березкин", years: "1908-1942", title: "Начальник лесопилки", branch: "maternal", bio: "Пропал без вести.", habits: [], medical: [], generation: 2, gender: "m" },

  // ПОКОЛЕНИЕ 3: ПРАДЕДЫ (ВОВ)
  { id: "mercuriy_vlasov", name: "Меркурий Евтихеевич Власов", years: "1912-2000", title: "Воентехник авиации", branch: "paternal", bio: "Герой Севастополя.", habits: ["Шахматы"], medical: ["Сердце"], generation: 3, gender: "m" },
  { id: "anna_torotko", name: "Анна Николаевна Торотько", years: "1921-2003", title: "Капитан медслужбы", branch: "paternal", bio: "Хирург на Сиваше.", habits: [], medical: ["Онкология"], generation: 3, gender: "f", fatherId: "nikolai_torotko", motherId: "olga_chernomashentseva" },
  { id: "anatoliy_shupletsov", name: "Анатолий Алексеевич Шуплецов", years: "1935-2005", title: "Директор промхоза", branch: "maternal", bio: "", habits: [], medical: ["Диабет"], generation: 3, gender: "m" },
  { id: "valentina_berezkin", name: "Васильевна Березкина", years: "1936-2025", title: "Медсестра", branch: "maternal", bio: "", habits: [], medical: [], generation: 3, gender: "f", fatherId: "vasiliy_berezkin" },
  { id: "anna_vedernikova", name: "Анна Ильинична Ведерникова", years: "1909-1996", title: "Хозяйка", branch: "maternal", bio: "", habits: [], medical: [], generation: 3, gender: "f", fatherId: "ilya_vedernikov" },

  // ПОКОЛЕНИЕ 4: ДЕДЫ И БАБУШКИ
  { id: "alexander_vlasov", name: "Александр Меркурьевич Власов", years: "род. 1950", title: "Дедушка (папа)", branch: "paternal", bio: "", habits: ["Шахматы"], medical: [], generation: 4, gender: "m", fatherId: "mercuriy_vlasov" },
  { id: "olga_vlasova", name: "Ольга Зиновьевна Власова", years: "род. 1951", title: "Бабушка (папа)", branch: "paternal", bio: "", habits: [], medical: [], generation: 4, gender: "f", motherId: "anna_torotko" },
  { id: "igor_korolev", name: "Игорь Николаевич Королев", years: "1938-2010", title: "Главный инженер", branch: "maternal", bio: "", habits: [], medical: [], generation: 4, gender: "m" },
  { id: "svetlana_koroleva", name: "Светлана Анатольевна Королева", years: "род. 1941", title: "Бабушка (мама)", branch: "maternal", bio: "", habits: [], medical: [], generation: 4, gender: "f", fatherId: "anatoliy_shupletsov", motherId: "valentina_berezkin" },

  // ПОКОЛЕНИЕ 5: РОДИТЕЛИ
  { id: "igor_vlasov_p", name: "Игорь Александрович Власов", years: "род. 1976", title: "Отец", branch: "both", bio: "", habits: [], medical: [], generation: 5, gender: "m", fatherId: "alexander_vlasov", motherId: "olga_vlasova" },
  { id: "anna_koroleva_m", name: "Анна Игоревна Королева", years: "род. 1970", title: "Мать", branch: "both", bio: "", habits: [], medical: [], generation: 5, gender: "f", fatherId: "igor_korolev", motherId: "svetlana_koroleva" },

  // ПОКОЛЕНИЕ 6: ТЫ И БРАТ
  { id: "pavel_vlasov", name: "Павел Игоревич Власов", years: "2008", title: "Я", branch: "both", bio: "", habits: [], medical: [], generation: 6, gender: "m", fatherId: "igor_vlasov_p", motherId: "anna_koroleva_m" },
  { id: "pyotr_vlasov", name: "Пётр Игоревич Власов", years: "2011", title: "Брат", branch: "both", bio: "", habits: [], medical: [], generation: 6, gender: "m", fatherId: "igor_vlasov_p", motherId: "anna_koroleva_m" }
];