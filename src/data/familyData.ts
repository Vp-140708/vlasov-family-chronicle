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
  place?: string;
  artifacts?: string[];
}

export const familyMembers: FamilyMember[] = [
  // --- ПОКОЛЕНИЕ 0: ГЛУБИННЫЕ ПРЕДКИ (КОНЕЦ XVIII - НАЧАЛО XIX ВЕКА) ---
  {
    id: "kirill_vedernikov",
    name: "Кирилл Ведерников",
    years: "род. ~1795",
    title: "Основатель рода в Мокино",
    branch: "maternal",
    bio: "Глава рода Ведерниковых в селе Мокино Вятской губернии. Зафиксирован в ревизских сказках 1850 года.",
    habits: ["Зычный бас"], medical: ["Крепкое здоровье"], generation: 0, gender: "m"
  },
  {
    id: "stefan_yastremsky",
    name: "Стефан Ястремский",
    years: "кон. XVIII в.",
    title: "Священник",
    branch: "paternal",
    bio: "Основатель династии харьковских священников Ястремских.",
    habits: ["Грамотность", "Латынь"], medical: [], generation: 0, gender: "m"
  },
  {
    id: "mihail_torotsko",
    name: "Михаил Тороцко",
    years: "сер. XIX в.",
    title: "Шляхтич",
    branch: "paternal",
    bio: "Представитель околичной шляхты Минской губернии, деревня Римаши.",
    habits: [], medical: ["Долгожительство"], generation: 0, gender: "m"
  },

  // --- ПОКОЛЕНИЕ 1: СЕРЕДИНА XIX ВЕКА ---
  {
    id: "terentiy_vedernikov",
    name: "Терентий Ведерников",
    years: "сер. XIX в.",
    title: "Вятский крестьянин",
    branch: "maternal",
    bio: "Житель села Мокино. Отец героя Первой мировой Ильи Ведерникова.",
    habits: ["Хозяйственность"], medical: [], generation: 1, gender: "m", fatherId: "kirill_vedernikov"
  },
  {
    id: "ivan_yastremsky",
    name: "Иван Степанович Ястремский",
    years: "сер. XIX в.",
    title: "Священник",
    branch: "paternal",
    bio: "Служил в Харьковской епархии.",
    habits: [], medical: [], generation: 1, gender: "m", fatherId: "stefan_yastremsky"
  },
  {
    id: "vikentiy_torotsko",
    name: "Викентий Михайлович Тороцко",
    years: "1888",
    title: "Шляхтич, отец Николая",
    branch: "paternal",
    bio: "Родился в дер. Римаши. Арестован в 1937 году в возрасте 49 лет.",
    habits: [], medical: [], generation: 1, gender: "m", fatherId: "mihail_torotsko"
  },
  {
    id: "nikolai_chernomashentsev",
    name: "Николай Ильич Черномашенцев",
    years: "род. ~1860",
    title: "Коллежский асессор",
    branch: "paternal",
    bio: "Высокопоставленный чиновник Казенной палаты Воронежа. Имел личное дворянство.",
    habits: ["Аристократизм"], medical: ["Онкология"], generation: 1, gender: "m"
  },

  // --- ПОКОЛЕНИЕ 2: ПРАПРАДЕДЫ (ГЕРОИ ПМВ И БАНКИРЫ) ---
  {
    id: "semyon_yastremsky",
    name: "Семен Дмитриевич Ястремский",
    years: "1860 — 1936",
    title: "Священник и модельер",
    branch: "paternal",
    bio: "Родился в Харькове. Ушел в протестанты. Владел ателье в Миллерово. Умер от инсульта.",
    habits: ["Смена веры", "Портновское дело"], medical: ["Атеросклероз", "Инсульт"], generation: 2, gender: "m"
  },
  {
    id: "tatyana_polyakova",
    name: "Татьяна Карповна Полякова",
    years: "1886 — 1962",
    title: "Модельер императорской семьи",
    branch: "paternal",
    bio: "Племянница банкиров Поляковых. Шила для знати в Воронцовском дворце в Крыму.",
    habits: ["Безупречный вкус"], medical: [], generation: 2, gender: "f", spouseId: "semyon_yastremsky"
  },
  {
    id: "nikolai_torotsko",
    name: "Николай Викентьевич Тороцко",
    years: "1888 — 1974",
    title: "Герой ПМВ, штабс-капитан",
    branch: "paternal",
    bio: "Кавалер Ордена Св. Георгия IV ст. и Георгиевского оружия. 20 лет лагерей Воркуты. Лесовод.",
    habits: ["Плетение корзин", "Стойкость"], medical: ["Псориаз", "Долгожительство"], generation: 2, gender: "m", fatherId: "vikentiy_torotsko", spouseId: "olga_chernomashentseva"
  },
  {
    id: "olga_chernomashentseva",
    name: "Ольга Николаевна Черномашенцева",
    years: "1896 — 1951",
    title: "Дворянка и пианистка",
    branch: "paternal",
    bio: "Выпускница Московской консерватории. Работала тапером в Туапсе. Умерла от онкологии.",
    habits: ["Музыкальный талант"], medical: ["Онкология"], generation: 2, gender: "f", spouseId: "nikolai_torotsko"
  },
  {
    id: "ilya_vedernikov",
    name: "Илья Терентьевич Ведерников",
    years: "уб. 1916",
    title: "Старший унтер-офицер",
    branch: "maternal",
    bio: "Герой Первой мировой. Погиб 26.06.1916 в Брусиловском прорыве.",
    habits: ["Храбрость"], medical: [], generation: 2, gender: "m", fatherId: "terentiy_vedernikov"
  },
  {
    id: "vasiliy_berezkin",
    name: "Василий Дмитриевич Березкин",
    years: "1908 — 1942",
    title: "Начальник лесопилки",
    branch: "maternal",
    bio: "Пропал без вести под Харьковом в октябре 1942 года. Семья потеряла всех сыновей на войне.",
    habits: [], medical: [], generation: 2, gender: "m"
  },
  {
    id: "klavdiya_sandalova",
    name: "Клавдия Андреевна Сандалова",
    years: "1913 — 1993",
    title: "Жена Василия Березкина",
    branch: "maternal",
    bio: "Дочь портного Андрея Сандалова. Жила в Уржуме.",
    habits: [], medical: [], generation: 2, gender: "f", spouseId: "vasiliy_berezkin"
  },

  // --- ПОКОЛЕНИЕ 3: ПРАДЕДЫ (ГЕРОИ ВОВ И ДИРЕКТОРА) ---
  {
    id: "mercuriy_vlasov",
    name: "Меркурий Евтихеевич Власов",
    years: "1912 — 2000",
    title: "Воентехник ЧФ, Герой Севастополя",
    branch: "paternal",
    bio: "Служил в 9-м истребительном авиаполку. Пропал без вести 03.07.1942 в Севастополе, но выжил.",
    habits: ["Шахматы"], medical: ["Сердце"], generation: 3, gender: "m"
  },
  {
    id: "hristina_klabukova",
    name: "Христина Егоровна Клабукова",
    years: "1922 — 1989",
    title: "Жена Меркурия",
    branch: "paternal",
    bio: "Жила в Кирове.",
    habits: [], medical: [], generation: 3, gender: "f", spouseId: "mercuriy_vlasov"
  },
  {
    id: "zinoviy_yastremsky",
    name: "Зиновий Семенович Ястремский",
    years: "1912 — 1991",
    title: "Инженер-землеустроитель",
    branch: "paternal",
    bio: "Ветеран ВОВ. Дошел до Берлина. Расписался на Рейхстаге. Лесовод в Джубге.",
    habits: ["Охота", "Рыбалка", "Футбол"], medical: ["Атеросклероз"], generation: 3, gender: "m", fatherId: "semyon_yastremsky", spouseId: "anna_torotko"
  },
  {
    id: "anna_torotko",
    name: "Анна Николаевна Торотько",
    years: "1921 — 2003",
    title: "Капитан медслужбы, хирург",
    branch: "paternal",
    bio: "Оперировала в ледяной воде Сиваша. Заведовала госпиталем в Потсдаме.",
    habits: ["Любила строить", "Шоколад"], medical: ["Онкология поджелудочной"], generation: 3, gender: "f", fatherId: "nikolai_torotko", motherId: "olga_chernomashentseva", spouseId: "zinoviy_yastremsky"
  },
  {
    id: "anatoliy_shupletsov",
    name: "Анатолий Алексеевич Шуплецов",
    years: "1935 — 2005",
    title: "Гендиректор промхоза",
    branch: "maternal",
    bio: "Глава Омутнинского промхоза. Служил в Германии. Был в партии.",
    habits: ["Управленец"], medical: ["Диабет"], generation: 3, gender: "m", motherId: "anna_vedernikova", spouseId: "valentina_berezkin"
  },
  {
    id: "anna_vedernikova",
    name: "Анна Ильинична Ведерникова",
    years: "1909 — 1996",
    title: "Дочь героя ПМВ",
    branch: "maternal",
    bio: "Хозяйственная женщина из села Мокино.",
    habits: ["Трудолюбие"], medical: ["Долгожительство"], generation: 3, gender: "f", fatherId: "ilya_vedernikov"
  },
  {
    id: "valentina_berezkin",
    name: "Валентина Васильевна Березкина",
    years: "1936 — 2025",
    title: "Медсестра и артистка",
    branch: "maternal",
    bio: "Работала хирургической медсестрой. Выступала на сцене со стихами.",
    habits: ["Вязание", "Поэзия"], medical: [], generation: 3, gender: "f", fatherId: "vasiliy_berezkin", motherId: "klavdiya_sandalova", spouseId: "anatoliy_shupletsov"
  },

  // --- ПОКОЛЕНИЕ 4: ДЕДЫ И БАБУШКИ ---
  {
    id: "alexander_vlasov",
    name: "Александр Меркурьевич Власов",
    years: "род. 1950",
    title: "Дед Саша",
    branch: "paternal",
    bio: "Шахматист, председатель СНТ в Кирове.",
    habits: ["Шахматы"], medical: [], generation: 4, gender: "m", fatherId: "mercuriy_vlasov", motherId: "hristina_klabukova", spouseId: "olga_vlasova"
  },
  {
    id: "olga_vlasova",
    name: "Ольга Зиновьевна Власова",
    years: "род. 1951",
    title: "Бабушка Оля",
    branch: "paternal",
    bio: "Хранительница семейного архива и автор родословной.",
    habits: ["История", "Архивы"], medical: [], generation: 4, gender: "f", fatherId: "zinoviy_yastremsky", motherId: "anna_torotko", spouseId: "alexander_vlasov"
  },
  {
    id: "igor_korolev",
    name: "Игорь Николаевич Королев",
    years: "1938 — 2010",
    title: "Главный инженер СМУ",
    branch: "maternal",
    bio: "Строитель Омутнинска. Брат прославленного металлурга Ильи Королева.",
    habits: ["Инженерия"], medical: [], generation: 4, gender: "m", spouseId: "svetlana_koroleva"
  },
  {
    id: "svetlana_koroleva",
    name: "Светлана Анатольевна Королева",
    years: "род. 1941",
    title: "Бабушка Света",
    branch: "maternal",
    bio: "Дочь Анатолия Шуплецова.",
    habits: [], medical: [], generation: 4, gender: "f", fatherId: "anatoliy_shupletsov", motherId: "valentina_berezkin", spouseId: "igor_korolev"
  },

  // --- ПОКОЛЕНИЕ 5: РОДИТЕЛИ ---
  {
    id: "igor_vlasov",
    name: "Игорь Александрович Власов",
    years: "род. 1976",
    title: "Отец",
    branch: "both",
    bio: "Военнослужащий, служил в Херсоне.",
    habits: [], medical: [], generation: 5, gender: "m", fatherId: "alexander_vlasov", motherId: "olga_vlasova", spouseId: "anna_vlasova"
  },
  {
    id: "anna_vlasova",
    name: "Анна Игоревна Власова",
    years: "род. 1970",
    title: "Мать",
    branch: "both",
    bio: "Владелица архива вятской линии.",
    habits: [], medical: [], generation: 5, gender: "f", fatherId: "igor_korolev", motherId: "svetlana_koroleva", spouseId: "igor_vlasov"
  },

  // --- ПОКОЛЕНИЕ 6: ТЫ И БРАТ ---
  {
    id: "pavel_vlasov",
    name: "Павел Игоревич Власов",
    years: "2008",
    title: "Я",
    branch: "both",
    bio: "Создатель этого сайта.",
    habits: ["Технологии", "Генеалогия"], medical: [], generation: 6, gender: "m", fatherId: "igor_vlasov", motherId: "anna_vlasova"
  },
  {
    id: "pyotr_vlasov",
    name: "Пётр Игоревич Власов",
    years: "2011",
    title: "Брат",
    branch: "both",
    bio: "",
    habits: [], medical: [], generation: 6, gender: "m", fatherId: "igor_vlasov", motherId: "anna_vlasova"
  }
];