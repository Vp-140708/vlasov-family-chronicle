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
  { id: "nikolai_t", name: "Николай Викентьевич Тороцко", years: "1888-1974", title: "Штабс-капитан РИА", branch: "paternal", bio: "Герой Первой мировой. Георгиевское оружие.", habits: ["Мастер на все руки"], medical: ["Псориаз"], generation: 0, gender: "m" },
  { id: "olga_ch", name: "Ольга Николаевна Черномашенцева", years: "1896-1951", title: "Дворянка, пианистка", branch: "paternal", bio: "Выпускница консерватории.", habits: [], medical: ["Онкология"], generation: 0, gender: "f" },
  { id: "mercuriy_v", name: "Меркурий Евтихеевич Власов", years: "1912-2000", title: "Воентехник авиации ЧФ", branch: "paternal", bio: "Герой Севастополя.", habits: ["Шахматист"], medical: ["Сердечно-сосудистая"], generation: 1, gender: "m" },
  { id: "anna_t", name: "Анна Николаевна Торотько", years: "1921-2003", title: "Капитан медслужбы", branch: "paternal", bio: "Хирург на Сиваше.", habits: ["Любила строить"], medical: ["Онкология"], generation: 1, gender: "f", fatherId: "nikolai_t", motherId: "olga_ch" },
  { id: "alexander_v", name: "Александр Меркурьевич Власов", years: "род. 1950", title: "Дедушка (папа)", branch: "paternal", bio: "", habits: ["Шахматы"], medical: [], generation: 2, gender: "m", fatherId: "mercuriy_v", spouseId: "anna_t" },
  { id: "igor_v", name: "Игорь Александрович Власов", years: "род. 1976", title: "Отец", branch: "both", bio: "", habits: [], medical: [], generation: 3, gender: "m", fatherId: "alexander_v", motherId: "anna_t" },
  { id: "anna_k", name: "Анна Игоревна Королева", years: "род. 1970", title: "Мать", branch: "both", bio: "", habits: [], medical: [], generation: 3, gender: "f" },
  { id: "pavel_v", name: "Павел Игоревич Власов", years: "2008", title: "Создатель", branch: "both", bio: "", habits: [], medical: [], generation: 4, gender: "m", fatherId: "igor_v", motherId: "anna_k" },
  { id: "pyotr_v", name: "Пётр Игоревич Власов", years: "2011", title: "Брат", branch: "both", bio: "", habits: [], medical: [], generation: 4, gender: "m", fatherId: "igor_v", motherId: "anna_k" }
];