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
  gender?: "m" | "f";
  place?: string;
}

export const familyMembers: FamilyMember[] = [
  // ПОКОЛЕНИЕ 0 (ТЫ)
  {
    id: "pavel_vlasov",
    name: "Власов Павел Игоревич",
    years: "род. 2008",
    title: "Создатель архива",
    branch: "both",
    bio: "", habits: ["Интерес к истории", "технологиям"], medical: [],
    generation: 3, // Самый низ
    fatherId: "igor_vlasov",
    motherId: "anna_koroleva",
    gender: "m"
  },
  {
    id: "pyotr_vlasov",
    name: "Власов Пётр Игоревич",
    years: "род. 2011",
    title: "Младший брат",
    branch: "both",
    bio: "", habits: [], medical: [],
    generation: 3,
    fatherId: "igor_vlasov",
    motherId: "anna_koroleva",
    gender: "m"
  },
  // ПОКОЛЕНИЕ 1 (РОДИТЕЛИ)
  {
    id: "igor_vlasov",
    name: "Власов Игорь Александрович",
    years: "род. 1976",
    title: "Отец",
    branch: "paternal",
    bio: "", habits: [], medical: [],
    generation: 2,
    fatherId: "alexander_vlasov",
    motherId: "olga_vlasova",
    spouseId: "anna_koroleva",
    gender: "m"
  },
  {
    id: "anna_koroleva",
    name: "Анна Игоревна Королева",
    years: "род. 1970",
    title: "Мать",
    branch: "maternal",
    bio: "", habits: [], medical: [],
    generation: 2,
    spouseId: "igor_vlasov",
    gender: "f"
  },
  // ПОКОЛЕНИЕ 2 (ДЕДЫ)
  {
    id: "alexander_vlasov",
    name: "Власов Александр Меркурьевич",
    years: "род. 1950",
    title: "Дедушка (по отцу)",
    branch: "paternal",
    bio: "", habits: ["Шахматы"], medical: [],
    generation: 1,
    fatherId: "mercuriy_vlasov",
    gender: "m"
  },
  {
    id: "olga_vlasova",
    name: "Власова Ольга Зиновьевна",
    years: "род. 1951",
    title: "Бабушка (по отцу)",
    branch: "paternal",
    bio: "Автор семейной хроники", habits: [], medical: [],
    generation: 1,
    fatherId: "zinoviy_yastremsky",
    motherId: "anna_torotko",
    gender: "f"
  },
  // ПОКОЛЕНИЕ 3 (ПРАДЕДЫ)
  {
    id: "mercuriy_vlasov",
    name: "Власов Меркурий Евтихеевич",
    years: "1912 - 2000",
    title: "Воентехник авиации, герой Севастополя",
    branch: "paternal",
    bio: "Герой Севастополя. Выжил в 1942.", habits: [], medical: ["Сердечно-сосудистая"],
    generation: 0,
    gender: "m"
  },
  {
    id: "nikolai_torotko",
    name: "Тороцко Николай Викентьевич",
    years: "1888 - 1974",
    title: "Штабс-капитан РИА",
    branch: "paternal",
    bio: "Золотое Георгиевское оружие. Воркута.", habits: [], medical: ["Псориаз"],
    generation: 0,
    gender: "m"
  },
  {
    id: "anna_torotko",
    name: "Торотько Анна Николаевна",
    years: "1921 - 2003",
    title: "Капитан медицинской службы",
    branch: "paternal",
    bio: "Хирург. Кёнигсберг, Потсдам.", habits: [], medical: ["Онкология"],
    generation: 1, // Она дочь Николая
    fatherId: "nikolai_torotko",
    motherId: "olga_chernomashentseva",
    gender: "f"
  },
  {
    id: "olga_chernomashentseva",
    name: "Черномашенцева Ольга Николаевна",
    years: "1896 - 1951",
    title: "Дворянка, Пианистка",
    branch: "paternal",
    bio: "Выпускница консерватории.", habits: [], medical: ["Онкология"],
    generation: 0,
    gender: "f"
  }
];