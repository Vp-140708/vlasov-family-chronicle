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

  // Родственные связи (используем camelCase под ваш формат)
  motherId?: string | null;
  fatherId?: string | null;
  spouseId?: string | null;

  // Родственные связи (snake_case из Supabase/БД, оставляем для совместимости)
  mother_id?: string | null;
  father_id?: string | null;
  spouse_id?: string | null;

  // Пол для терминов: "m" | "f"
  gender?: "m" | "f" | string | null;

  // Для карты (опционально)
  map_locations?: Array<{
    name?: string | null;
    description?: string | null;
    lat?: number | null;
    lng?: number | null;
    surnames?: string[] | null;
  }> | null;
  map_city?: string | null;
  map_lat?: number | null;
  map_lng?: number | null;
  map_description?: string | null;
  map_surnames?: string[] | null;

  // Для артефактов (опционально)
  photo_url?: string | null;

  // Для карты (опционально)
  place?: string | null;
}

export const familyMembers: FamilyMember[] = [
  {
    id: "pavel_vlasov",
    name: "Власов Павел Игоревич",
    years: "14.07.2008",
    title: "Создатель архива",
    branch: "both",
    bio: "",
    habits: ["Интерес к истории", "технологиям"],
    medical: [],
    generation: 0,
    fatherId: "igor_vlasov",
    motherId: "anna_koroleva",
  },
  {
    id: "pyotr_vlasov",
    name: "Власов Пётр Игоревич",
    years: "09.02.2011",
    title: "Младший брат",
    branch: "both",
    bio: "",
    habits: [],
    medical: [],
    generation: 0,
    fatherId: "igor_vlasov",
    motherId: "anna_koroleva",
  },
  {
    id: "mercuriy_vlasov",
    name: "Власов Меркурий Евтихеевич",
    years: "1912 - 2000",
    title: "Воентехник авиации, герой Севастополя",
    branch: "both",
    bio:
      "Герой Севастополя. 03.07.1942 г. в день падения города пропал без вести. Выжил, прошел войну, воспитывал внуков в Кирове. Шахматист.",
    habits: [],
    medical: ["Сердечно-сосудистая система"],
    generation: 1,
    place: "дер. Круглово, Кировская обл.",
  },
  {
    id: "nikolai_torotko",
    name: "Тороцко Николай Викентьевич",
    years: "1888 - 1974",
    title: "Штабс-капитан, Кавалер Ордена Св. Георгия IV ст.",
    branch: "both",
    bio:
      "Офицер 12-го Сибирского полка. Георгиевское оружие за бой у д. Бартники. 20 лет лагерей Воркуты. Лесовод. Мастер на все руки.",
    habits: [],
    medical: ["Псориаз (на почве стресса), долгожитель"],
    generation: 1,
    place: "дер. Римаши, Беларусь",
  },
  {
    id: "anna_torotko",
    name: "Торотько Анна Николаевна",
    years: "1921 - 2003",
    title: "Капитан медицинской службы",
    branch: "both",
    bio:
      "Хирург. Оперировала в ледяной воде Сиваша. После войны заведовала госпиталем в Потсдаме (Германия).",
    habits: ["Любила строить", "красить", "шоколад", "красивые платья"],
    medical: ["Онкология (поджелудочная)"],
    generation: 1,
  },
  {
    id: "olga_chernomashentseva",
    name: "Черномашенцева Ольга Николаевна",
    years: "1896 - 1951",
    title: "Дворянка, Пианистка",
    branch: "both",
    bio:
      "Выпускница Московской консерватории. Дочь чиновника Казенной палаты. Работала тапером в Туапсе.",
    habits: [],
    medical: ["Онкология"],
    generation: 1,
    place: "Воронеж",
  },
  {
    id: "anatoliy_shupletsov",
    name: "Шуплецов Анатолий Алексеевич",
    years: "1935 - 2005",
    title: "Гендиректор Омутнинского промхоза",
    branch: "both",
    bio: "Учился в Архангельске, служил в Германии. Руководитель высшего звена.",
    habits: [],
    medical: ["Диабет"],
    generation: 2,
    place: "Вятка",
  },
  {
    id: "ilya_vedernikov",
    name: "Ведерников Илья Терентьевич",
    years: "уб. 1916",
    title: "Старший унтер-офицер",
    branch: "both",
    bio:
      "Герой ПМВ. Пропал в 1914, вернулся, погиб 26.06.1916 в Брусиловском прорыве.",
    habits: [],
    medical: [],
    generation: 2,
    place: "с. Мокино, Вятская губ.",
  },
  {
    id: "vasiliy_berezkin",
    name: "Березкин Василий Дмитриевич",
    years: "1908 - 1942",
    title: "Начальник лесопилки",
    branch: "both",
    bio:
      "Пропал без вести в октябре 1942 под Харьковом. Семья потеряла всех сыновей на войне.",
    habits: [],
    medical: [],
    generation: 2,
    place: "Уржум",
  },
];
