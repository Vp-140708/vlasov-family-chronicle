import { useState, useRef, useCallback } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────
interface Person {
  id: string;
  firstName: string;
  lastName: string;
  maidenName?: string;
  born?: string;
  died?: string;
  role: string;
  bio?: string;
  occupation?: string;
  birthPlace?: string;
  notes?: string;
  generation: number; // 1 = newest (Павел/Петр), 8 = oldest
}

interface Connection {
  from: string; // parent id
  to: string;   // child id
}

// ─── People ────────────────────────────────────────────────────────────────
const PEOPLE: Person[] = [

  // ══ ПОКОЛЕНИЕ 1 — Ты и брат ══════════════════════════════════════════════
  {
    id: "p1_pavel", firstName: "Павел", lastName: "Власов",
    born: "14.07.2008", role: "Я — создатель архива", generation: 1,
    occupation: "Школьник", birthPlace: "Россия",
    bio: "Создатель этого семейного архива. Собрал историю рода, охватывающую более 8 поколений и 200 лет семейной летописи.",
  },
  {
    id: "p1_petr", firstName: "Пётр", lastName: "Власов",
    born: "09.02.2011", role: "Брат", generation: 1,
    occupation: "Школьник", birthPlace: "Россия",
    bio: "Младший брат Павла.",
  },

  // ══ ПОКОЛЕНИЕ 2 — Родители ════════════════════════════════════════════════
  {
    id: "p2_igor", firstName: "Игорь", lastName: "Власов",
    born: "1976", role: "Отец", generation: 2,
    occupation: "—", birthPlace: "Россия",
    bio: "Отец Павла и Петра.",
  },
  {
    id: "p2_anna", firstName: "Анна", lastName: "Власова",
    maidenName: "Королёва", born: "1970", role: "Мать", generation: 2,
    occupation: "—", birthPlace: "Россия",
    bio: "Мать Павла и Петра. Урождённая Королёва.",
  },

  // ══ ПОКОЛЕНИЕ 3 — Бабушки и дедушки ══════════════════════════════════════

  // Линия отца
  {
    id: "p3_alex", firstName: "Александр", lastName: "Власов",
    born: "07.11.1950", role: "Дед (по отцу)", generation: 3,
    occupation: "Председатель СНТ, шахматист", birthPlace: "Россия",
    bio: "Дед по отцовской линии. Страстный шахматист, председатель садоводческого некоммерческого товарищества. Хранит традиции рода Власовых.",
  },
  {
    id: "p3_olga", firstName: "Ольга", lastName: "Власова",
    maidenName: "Ястремская", born: "15.11.1951", role: "Бабушка (по отцу)", generation: 3,
    occupation: "Главный хранитель истории семьи", birthPlace: "Россия",
    bio: "Бабушка по отцовской линии, урождённая Ястремская. Именно она собирала и хранила семейную историю, передавая её следующим поколениям.",
    notes: "Сёстры: Татьяна (р.1947), Ирина (р.1948), Людмила (р.1953). Брат: Михаил Ястремский (р.1964).",
  },

  // Линия матери
  {
    id: "p3_igor_k", firstName: "Игорь", lastName: "Королёв",
    born: "1938", died: "2010", role: "Дед (по матери)", generation: 3,
    occupation: "Главный инженер СМУ", birthPlace: "Омутнинск",
    bio: "Дед по материнской линии. Главный инженер строительно-монтажного управления в Омутнинске. Руководитель и профессионал своего дела.",
  },
  {
    id: "p3_sveta", firstName: "Светлана", lastName: "Королёва",
    maidenName: "Шуплецова", born: "1941", role: "Бабушка (по матери)", generation: 3,
    occupation: "—", birthPlace: "Россия",
    bio: "Бабушка по материнской линии, урождённая Шуплецова.",
  },

  // Боковые — сестра деда Александра
  {
    id: "p3_irina_ok", firstName: "Ирина", lastName: "Окуловская",
    maidenName: "Власова", born: "—", died: "недавно", role: "Сестра деда Александра", generation: 3,
    occupation: "—", birthPlace: "Россия",
    bio: "Ирина Меркурьевна Власова (в замужестве Окуловская) — сестра деда Александра. Умерла в последние годы.",
    notes: "Муж: Владимир Окуловский. Дети: Алексей (энергетик, Киров), Сергей. Внуки: Михаил, Илья, Матвей.",
  },

  // ══ ПОКОЛЕНИЕ 4 — Прадеды ═════════════════════════════════════════════════

  // Власовы (Киров)
  {
    id: "p4_merkuriy", firstName: "Меркурий", lastName: "Власов",
    born: "25.11.1912", died: "2000", role: "Прадед", generation: 4,
    occupation: "Воентехник авиации, защитник Севастополя", birthPlace: "Вятка (Киров)",
    bio: "Прадед по линии отца. Воентехник авиации Черноморского флота. Участник героической обороны Севастополя во время Великой Отечественной войны. Человек долга и чести.",
  },
  {
    id: "p4_hristina", firstName: "Христина", lastName: "Власова",
    maidenName: "Клабукова", born: "1922", died: "1989", role: "Прабабушка", generation: 4,
    occupation: "—", birthPlace: "Россия",
    bio: "Прабабушка по линии отца, урождённая Клабукова. Жена Меркурия Власова.",
  },

  // Ястремские-Торотько (Юг)
  {
    id: "p4_zinovy", firstName: "Зиновий (Зенон)", lastName: "Ястремский",
    born: "21.11.1912", died: "1991", role: "Прадед", generation: 4,
    occupation: "Инженер-землеустроитель, ветеран ВОВ", birthPlace: "Харьков",
    bio: "Прадед по линии бабушки Ольги. Инженер-землеустроитель. Ветеран Великой Отечественной войны. Сын священника Семёна Дмитриевича Ястремского.",
  },
  {
    id: "p4_anna_t", firstName: "Анна", lastName: "Ястремская",
    maidenName: "Торотько", born: "25.08.1921", died: "04.07.2003", role: "Прабабушка", generation: 4,
    occupation: "Капитан медслужбы, хирург", birthPlace: "Крым",
    bio: "Прабабушка по линии бабушки Ольги, урождённая Торотько. Капитан медицинской службы, военный хирург. Дочь легендарного офицера Николая Викентьевича Тороцко. Прошла войну, спасая жизни.",
  },

  // Шуплецовы-Берёзкины (Вятка)
  {
    id: "p4_anatoly_sh", firstName: "Анатолий", lastName: "Шуплецов",
    born: "10.09.1935", died: "07.12.2005", role: "Прадед", generation: 4,
    occupation: "Генеральный директор Омутнинского промхоза", birthPlace: "Вятка",
    bio: "Прадед по линии бабушки Светланы. Генеральный директор Омутнинского промхоза. Хозяйственник и руководитель, определивший жизнь целого района.",
  },
  {
    id: "p4_valentina_sh", firstName: "Валентина", lastName: "Шуплецова",
    maidenName: "Берёзкина", born: "04.08.1936", died: "08.2025", role: "Прабабушка", generation: 4,
    occupation: "Медсестра", birthPlace: "Вятка",
    bio: "Прабабушка по линии бабушки Светланы, урождённая Берёзкина. Медсестра. Ушла из жизни в августе 2025 года. Отец Василий Берёзкин погиб на фронте в 1942-м.",
  },

  // Королёвы-Краснюк
  {
    id: "p4_nikolay_k", firstName: "Николай", lastName: "Королёв",
    born: "—", role: "Прадед (3-й муж Галины)", generation: 4,
    occupation: "—", birthPlace: "Россия",
    bio: "Прадед по линии деда Игоря Королёва. Третий муж Галины Алексеевны Краснюк.",
    notes: "Вероятный брат: Илья Николаевич Королёв — прославленный металлург, орден Ленина.",
  },
  {
    id: "p4_galina", firstName: "Галина", lastName: "Краснюк",
    born: "1929", died: "2020", role: "Прабабушка", generation: 4,
    occupation: "—", birthPlace: "Россия",
    bio: "Прабабушка по линии деда Игоря Королёва. Galina Alekseyevna Krasnyuk. Дожила до 91 года.",
  },

  // ══ ПОКОЛЕНИЕ 5 — Прапрадеды ══════════════════════════════════════════════

  // Власовы
  {
    id: "p5_evtikhiy", firstName: "Евтихий", lastName: "Власов",
    born: "~1880", role: "Прапрадед", generation: 5,
    occupation: "Грамотный крестьянин", birthPlace: "Вятка",
    bio: "Прапрадед по линии Власовых. Грамотный крестьянин из Вятской губернии — редкость для своего времени. Отец Меркурия Власова.",
  },

  // Ястремские
  {
    id: "p5_semen_y", firstName: "Семён", lastName: "Ястремский",
    born: "1860", died: "1936", role: "Прапрадед", generation: 5,
    occupation: "Священник, закройщик", birthPlace: "Харьков",
    bio: "Прапрадед по линии Ястремских. Священник в Харькове, после революции вынужден был сменить сан и стать закройщиком. Сын Ивана Ястремского, тоже священника.",
  },
  {
    id: "p5_tatiana_p", firstName: "Татьяна", lastName: "Ястремская",
    maidenName: "Полякова", born: "1886", died: "1962", role: "Прапрабабушка", generation: 5,
    occupation: "Модельер (Крым)", birthPlace: "Одесса",
    bio: "Прапрабабушка по линии Ястремских, урождённая Полякова. Модельер в Крыму. Из одесской ветви Поляковых — дочь Карпа Марковича Полякова.",
  },

  // Торотько
  {
    id: "p5_nikolay_t", firstName: "Николай Викентьевич", lastName: "Тороцко",
    born: "1888", died: "1974", role: "Прапрадед", generation: 5,
    occupation: "Офицер РИА, лесовод, узник Воркуты", birthPlace: "Минская губ.",
    bio: "Прапрадед по линии Торотько. Офицер Русской Императорской армии, Георгиевский кавалер. После революции стал лесоводом. Был репрессирован и прошёл Воркуту. Отец хирурга Анны Торотько.",
  },
  {
    id: "p5_olga_ch", firstName: "Ольга", lastName: "Тороцко",
    maidenName: "Черномашенцева", born: "1896", died: "1951", role: "Прапрабабушка", generation: 5,
    occupation: "Дворянка, пианистка", birthPlace: "Воронеж",
    bio: "Прапрабабушка по линии Торотько, урождённая Черномашенцева. Дворянка, пианистка. Дочь чиновника Казённой палаты Николая Ильича Черномашенцева из Воронежа.",
  },

  // Шуплецовы
  {
    id: "p5_alexey_sh", firstName: "Алексей", lastName: "Шуплецов",
    born: "1906", died: "1953", role: "Прапрадед", generation: 5,
    occupation: "Рыбак, рабочий", birthPlace: "Вятка",
    bio: "Прапрадед по линии Шуплецовых. Рыбак и рабочий из деревни Шуплецы Вятской губернии. Отец генерального директора Анатолия Шуплецова.",
  },
  {
    id: "p5_anna_v", firstName: "Анна", lastName: "Шуплецова",
    maidenName: "Ведерникова", born: "1909", died: "1996", role: "Прапрабабушка", generation: 5,
    occupation: "—", birthPlace: "Вятка",
    bio: "Прапрабабушка по линии Шуплецовых, урождённая Ведерникова. Отец Илья Терентьевич Ведерников погиб в бою в 1916 году в Первую мировую.",
  },

  // Берёзкины
  {
    id: "p5_vasily_b", firstName: "Василий", lastName: "Берёзкин",
    born: "1908", died: "1942", role: "Прапрадед", generation: 5,
    occupation: "Начальник лесопилки", birthPlace: "Вятка",
    bio: "Прапрадед по линии Берёзкиных. Начальник лесопилки. Пропал без вести на фронте в 1942 году. Муж Клавдии Сандаловой. Все его братья — Иван (р.1901) и Михаил (р.1915) — тоже погибли.",
  },
  {
    id: "p5_klavdia", firstName: "Клавдия", lastName: "Берёзкина",
    maidenName: "Сандалова", born: "1913", died: "1993", role: "Прапрабабушка", generation: 5,
    occupation: "—", birthPlace: "Вятка",
    bio: "Прапрабабушка по линии Берёзкиных, урождённая Сандалова. Дочь Андрея Сандалова — портного, известного как «двойник Николая II». Мать её — гадалка из Цепочкино.",
  },

  // Краснюк
  {
    id: "p5_alexey_kr", firstName: "Алексей", lastName: "Краснюк",
    born: "~1900", role: "Прапрадед", generation: 5,
    occupation: "—", birthPlace: "Юг России / Украина",
    bio: "Прапрадед по линии Краснюк. Из южных краёв России или Украины. Отец Галины Алексеевны Краснюк.",
  },

  // ══ ПОКОЛЕНИЕ 6 — 3-жды прадеды ══════════════════════════════════════════

  {
    id: "p6_semen_v", firstName: "Семён", lastName: "Власов",
    born: "~1850", role: "3-жды прадед", generation: 6,
    occupation: "Крестьянин", birthPlace: "Вятка",
    bio: "Предок по линии Власовых. Середина XIX века. Отец Евтихия Власова.",
  },
  {
    id: "p6_dmitry_y", firstName: "Дмитрий", lastName: "Ястремский",
    born: "~1830", role: "3-жды прадед", generation: 6,
    occupation: "Священник", birthPlace: "Сумская обл.",
    bio: "Предок по линии Ястремских. Священник в Сумской области. Отец Семёна Дмитриевича Ястремского.",
  },
  {
    id: "p6_karp_p", firstName: "Карп", lastName: "Поляков",
    born: "~1855", role: "3-жды прадед", generation: 6,
    occupation: "Рядовой", birthPlace: "Калужская губ. / Одесса",
    bio: "Предок по линии Поляковых. Рядовой из Калужской губернии, обосновался в Одессе. Предположительно брат банкира Лазаря Полякова.",
    notes: "Жена: Елена Константиновна Полякова.",
  },
  {
    id: "p6_vikenty_t", firstName: "Викентий", lastName: "Тороцко",
    born: "~1850", role: "3-жды прадед", generation: 6,
    occupation: "Шляхтич", birthPlace: "Минская губ. (дер. Римаши)",
    bio: "Предок по линии Тороцко. Шляхтич из деревни Римаши Минской губернии. Отец офицера Николая Тороцко.",
  },
  {
    id: "p6_nikolay_ch", firstName: "Николай", lastName: "Черномашенцев",
    born: "~1860", role: "3-жды прадед", generation: 6,
    occupation: "Чиновник Казённой палаты", birthPlace: "Воронеж",
    bio: "Предок по линии Черномашенцевых. Чиновник Казённой палаты в Воронеже. Домовладелец. Отец пианистки Ольги.",
    notes: "Отец: Илья Черномашенцев (домовладелец в Воронеже).",
  },
  {
    id: "p6_vasily_sh2", firstName: "Василий", lastName: "Шуплецов",
    born: "~1875", role: "3-жды прадед", generation: 6,
    occupation: "Крестьянин (дер. Шуплецы)", birthPlace: "Вятка",
    bio: "Предок по линии Шуплецовых. Из деревни Шуплецы Вятской губернии — от неё и пошла фамилия. Отец Алексея Шуплецова.",
  },
  {
    id: "p6_ilya_v", firstName: "Илья", lastName: "Ведерников",
    born: "~1880", died: "1916", role: "3-жды прадед", generation: 6,
    occupation: "Рядовой", birthPlace: "Вятка (с. Мокино)",
    bio: "Предок по линии Ведерниковых. Убит в бою в 1916 году в Первую мировую войну. Из села Мокино.",
    notes: "Отец: Терентий Ведерников.",
  },
  {
    id: "p6_andrey_s", firstName: "Андрей", lastName: "Сандалов",
    born: "~1880", role: "3-жды прадед", generation: 6,
    occupation: "Портной", birthPlace: "Вятка",
    bio: "Предок по линии Сандаловых. Портной, вошедший в семейные предания как «двойник Николая II». Жена — гадалка из Цепочкино.",
    notes: "Отец: Иван Сандалов, уржумский мещанин.",
  },

  // ══ ПОКОЛЕНИЕ 7 — 4-жды прадеды ══════════════════════════════════════════

  {
    id: "p7_ivan_y", firstName: "Иван", lastName: "Ястремский",
    born: "~1800", role: "4-жды прадед", generation: 7,
    occupation: "Священник", birthPlace: "—",
    bio: "Предок по линии Ястремских. Священник. Отец Дмитрия Ивановича Ястремского.",
  },
  {
    id: "p7_mark_p", firstName: "Марк", lastName: "Поляков",
    born: "~1820", role: "4-жды прадед", generation: 7,
    occupation: "—", birthPlace: "—",
    bio: "Предок по линии Поляковых. Предположительно брат знаменитого банкира Лазаря Полякова.",
  },
  {
    id: "p7_mikhail_t", firstName: "Михаил", lastName: "Тороцко",
    born: "~1820", role: "4-жды прадед", generation: 7,
    occupation: "Шляхтич", birthPlace: "дер. Римаши, Беларусь",
    bio: "Предок по линии Тороцко. Из деревни Римаши.",
  },
  {
    id: "p7_ilya_ch", firstName: "Илья", lastName: "Черномашенцев",
    born: "~1830", role: "4-жды прадед", generation: 7,
    occupation: "Домовладелец", birthPlace: "Воронеж",
    bio: "Предок по линии Черномашенцевых. Домовладелец в Воронеже.",
  },
  {
    id: "p7_nikif_sh", firstName: "Никифор", lastName: "Шуплецов",
    born: "~1845", role: "4-жды прадед", generation: 7,
    occupation: "Шорник", birthPlace: "Вятка",
    bio: "Предок по линии Шуплецовых. Шорник (мастер по изготовлению упряжи).",
  },
  {
    id: "p7_terentiy", firstName: "Терентий", lastName: "Ведерников",
    born: "~1850", role: "4-жды прадед", generation: 7,
    occupation: "Крестьянин", birthPlace: "с. Мокино, Вятка",
    bio: "Предок по линии Ведерниковых. Крестьянин из села Мокино.",
  },
  {
    id: "p7_ivan_s", firstName: "Иван", lastName: "Сандалов",
    born: "~1850", role: "4-жды прадед", generation: 7,
    occupation: "Мещанин", birthPlace: "Уржум, Вятка",
    bio: "Предок по линии Сандаловых. Уржумский мещанин. Отец портного Андрея Сандалова.",
  },

  // ══ ПОКОЛЕНИЕ 8 — 5-ти кратные прадеды ═══════════════════════════════════

  {
    id: "p8_stefan_y", firstName: "Стефан", lastName: "Ястремский",
    born: "~конец XVIII в.", role: "5-жды прадед", generation: 8,
    occupation: "Священник", birthPlace: "—",
    bio: "Древнейший известный предок по линии Ястремских. Священник, родился в конце XVIII века.",
  },
  {
    id: "p8_kirill_v", firstName: "Кирилл", lastName: "Ведерников",
    born: "~1770", role: "5-жды прадед", generation: 8,
    occupation: "Крестьянин", birthPlace: "Вятка",
    bio: "Древнейший известный предок по линии Ведерниковых. Зафиксирован в ревизии 1850 года как старик.",
  },
];

// ─── Parent → Child connections ────────────────────────────────────────────
const CONNECTIONS: Connection[] = [
  // Поколение 1 ← Поколение 2
  { from: "p2_igor", to: "p1_pavel" },
  { from: "p2_igor", to: "p1_petr" },
  { from: "p2_anna", to: "p1_pavel" },
  { from: "p2_anna", to: "p1_petr" },

  // Поколение 2 ← Поколение 3
  { from: "p3_alex", to: "p2_igor" },
  { from: "p3_olga", to: "p2_igor" },
  { from: "p3_igor_k", to: "p2_anna" },
  { from: "p3_sveta", to: "p2_anna" },

  // Поколение 3 ← Поколение 4
  { from: "p4_merkuriy", to: "p3_alex" },
  { from: "p4_hristina", to: "p3_alex" },
  { from: "p4_merkuriy", to: "p3_irina_ok" },
  { from: "p4_hristina", to: "p3_irina_ok" },
  { from: "p4_zinovy", to: "p3_olga" },
  { from: "p4_anna_t", to: "p3_olga" },
  { from: "p4_anatoly_sh", to: "p3_sveta" },
  { from: "p4_valentina_sh", to: "p3_sveta" },
  { from: "p4_nikolay_k", to: "p3_igor_k" },
  { from: "p4_galina", to: "p3_igor_k" },

  // Поколение 4 ← Поколение 5
  { from: "p5_evtikhiy", to: "p4_merkuriy" },
  { from: "p5_semen_y", to: "p4_zinovy" },
  { from: "p5_tatiana_p", to: "p4_zinovy" },
  { from: "p5_nikolay_t", to: "p4_anna_t" },
  { from: "p5_olga_ch", to: "p4_anna_t" },
  { from: "p5_alexey_sh", to: "p4_anatoly_sh" },
  { from: "p5_anna_v", to: "p4_anatoly_sh" },
  { from: "p5_vasily_b", to: "p4_valentina_sh" },
  { from: "p5_klavdia", to: "p4_valentina_sh" },
  { from: "p5_alexey_kr", to: "p4_galina" },

  // Поколение 5 ← Поколение 6
  { from: "p6_semen_v", to: "p5_evtikhiy" },
  { from: "p6_dmitry_y", to: "p5_semen_y" },
  { from: "p6_karp_p", to: "p5_tatiana_p" },
  { from: "p6_vikenty_t", to: "p5_nikolay_t" },
  { from: "p6_nikolay_ch", to: "p5_olga_ch" },
  { from: "p6_vasily_sh2", to: "p5_alexey_sh" },
  { from: "p6_ilya_v", to: "p5_anna_v" },
  { from: "p6_andrey_s", to: "p5_klavdia" },

  // Поколение 6 ← Поколение 7
  { from: "p7_ivan_y", to: "p6_dmitry_y" },
  { from: "p7_mark_p", to: "p6_karp_p" },
  { from: "p7_mikhail_t", to: "p6_vikenty_t" },
  { from: "p7_ilya_ch", to: "p6_nikolay_ch" },
  { from: "p7_nikif_sh", to: "p6_vasily_sh2" },
  { from: "p7_terentiy", to: "p6_ilya_v" },
  { from: "p7_ivan_s", to: "p6_andrey_s" },

  // Поколение 7 ← Поколение 8
  { from: "p8_stefan_y", to: "p7_ivan_y" },
  { from: "p8_kirill_v", to: "p7_terentiy" },
];

// ─── Spouse links (for visual dashes) ────────────────────────────────────
const SPOUSES: [string, string][] = [
  ["p2_igor", "p2_anna"],
  ["p3_alex", "p3_olga"],
  ["p3_igor_k", "p3_sveta"],
  ["p4_merkuriy", "p4_hristina"],
  ["p4_zinovy", "p4_anna_t"],
  ["p4_anatoly_sh", "p4_valentina_sh"],
  ["p4_nikolay_k", "p4_galina"],
  ["p5_semen_y", "p5_tatiana_p"],
  ["p5_nikolay_t", "p5_olga_ch"],
  ["p5_alexey_sh", "p5_anna_v"],
  ["p5_vasily_b", "p5_klavdia"],
  ["p6_karp_p", "p6_karp_p"], // has wife noted
];

// ─── Layout ────────────────────────────────────────────────────────────────
const CW = 160; // card width
const CH = 72;  // card height
const CANVAS_W = 3200;

// Generation Y positions (gen 1 = bottom, gen 8 = top)
const GEN_Y: Record<number, number> = {
  8: 60,
  7: 200,
  6: 340,
  5: 480,
  4: 620,
  3: 760,
  2: 900,
  1: 1040,
};
const CANVAS_H = 1160;

// X positions per person
const X: Record<string, number> = {
  // Gen 8
  p8_stefan_y: 400, p8_kirill_v: 1900,

  // Gen 7
  p7_ivan_y: 300, p7_mark_p: 700, p7_mikhail_t: 1050, p7_ilya_ch: 1350,
  p7_nikif_sh: 1650, p7_terentiy: 1900, p7_ivan_s: 2200,

  // Gen 6
  p6_semen_v: 80, p6_dmitry_y: 350, p6_karp_p: 660,
  p6_vikenty_t: 1000, p6_nikolay_ch: 1300,
  p6_vasily_sh2: 1620, p6_ilya_v: 1890, p6_andrey_s: 2160,

  // Gen 5
  p5_evtikhiy: 80,
  p5_semen_y: 380, p5_tatiana_p: 560,
  p5_nikolay_t: 950, p5_olga_ch: 1130,
  p5_alexey_sh: 1570, p5_anna_v: 1750,
  p5_vasily_b: 1960, p5_klavdia: 2140,
  p5_alexey_kr: 2450,

  // Gen 4
  p4_merkuriy: 100, p4_hristina: 280,
  p4_zinovy: 530, p4_anna_t: 710,
  p4_anatoly_sh: 1560, p4_valentina_sh: 1740,
  p4_nikolay_k: 2060, p4_galina: 2240,

  // Gen 3
  p3_alex: 80, p3_olga: 260,
  p3_irina_ok: 520,
  p3_igor_k: 1700, p3_sveta: 1880,

  // Gen 2
  p2_igor: 170, p2_anna: 1790,

  // Gen 1
  p1_pavel: 80, p1_petr: 260,
};

// ─── Colors per generation ────────────────────────────────────────────────
type GenColor = { bg: string; border: string; text: string; sub: string; badge: string; badgeText: string };
const COLORS: Record<number, GenColor> = {
  1: { bg: "#0f1a0a", border: "#4caf50", text: "#c8f0c0", sub: "#89c088", badge: "#4caf50", badgeText: "#e8ffe0" },
  2: { bg: "#1a1200", border: "#ffa726", text: "#ffe0a0", sub: "#cc9040", badge: "#ffa726", badgeText: "#fff5e0" },
  3: { bg: "#0a0f1a", border: "#42a5f5", text: "#b8d8ff", sub: "#5588bb", badge: "#42a5f5", badgeText: "#e0f0ff" },
  4: { bg: "#1a0a14", border: "#ce93d8", text: "#f0d0ff", sub: "#9960aa", badge: "#ce93d8", badgeText: "#f8eeff" },
  5: { bg: "#1a0a0a", border: "#ef5350", text: "#ffd0cc", sub: "#aa4040", badge: "#ef5350", badgeText: "#fff0ee" },
  6: { bg: "#0a1414", border: "#26a69a", text: "#b0ece8", sub: "#2a7070", badge: "#26a69a", badgeText: "#e0faf8" },
  7: { bg: "#14100a", border: "#ffd54f", text: "#fff3c0", sub: "#aa9030", badge: "#ffd54f", badgeText: "#fffce0" },
  8: { bg: "#100a14", border: "#b0bec5", text: "#e0e8ec", sub: "#708090", badge: "#b0bec5", badgeText: "#f0f4f8" },
};

const GEN_NAMES: Record<number, string> = {
  1: "1-е колено · Мы",
  2: "2-е колено · Родители",
  3: "3-е колено · Бабушки и дедушки",
  4: "4-е колено · Прадеды",
  5: "5-е колено · Прапрадеды",
  6: "6-е колено · 3-жды прадеды",
  7: "7-е колено · 4-жды прадеды",
  8: "8-е колено · Начало XIX в.",
};

function initials(p: Person) {
  return (p.firstName[0] + (p.lastName[0] ?? "")).toUpperCase();
}
function years(p: Person) {
  if (!p.born || p.born === "—") return "";
  return p.died ? `${p.born} – ${p.died}` : `р. ${p.born}`;
}
function cx(id: string) { return (X[id] ?? 100) + CW / 2; }
function cy(gen: number) { return (GEN_Y[gen] ?? 80) + CH / 2; }

// ─── Component ─────────────────────────────────────────────────────────────
export default function FamilyTree() {
  const [selected, setSelected] = useState<Person | null>(null);
  const [panX, setPanX] = useState(-40);
  const [panY, setPanY] = useState(-20);
  const [scale, setScale] = useState(0.68);
  const [panning, setPanning] = useState(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as Element).closest(".pc")) return;
    setPanning(true);
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!panning) return;
    setPanX(p => p + (e.clientX - lastMouse.current.x) / scale);
    setPanY(p => p + (e.clientY - lastMouse.current.y) / scale);
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, [panning, scale]);
  const onMouseUp = useCallback(() => setPanning(false), []);
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setScale(s => Math.min(2.5, Math.max(0.18, s * (e.deltaY < 0 ? 1.1 : 0.9))));
  }, []);

  const select = (p: Person) => {
    setSelected(p);
    const px = X[p.id] ?? 100;
    const py = GEN_Y[p.generation] ?? 80;
    const vpW = window.innerWidth - (selected ? 420 : 40);
    const vpH = window.innerHeight - 64;
    setTimeout(() => {
      setPanX(vpW / (2 * scale) - px - CW / 2);
      setPanY(vpH / (2 * scale) - py - CH / 2);
    }, 30);
  };

  const c = selected ? COLORS[selected.generation] : null;
  const parents = selected ? PEOPLE.filter(par => CONNECTIONS.some(cn => cn.from === par.id && cn.to === selected.id)) : [];
  const children = selected ? PEOPLE.filter(ch => CONNECTIONS.some(cn => cn.from === selected.id && cn.to === ch.id)) : [];
  const spouse = selected
    ? PEOPLE.find(p => SPOUSES.some(([a, b]) => (a === selected.id && b === p.id) || (b === selected.id && a === p.id)) && p.id !== selected.id)
    : null;

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#06060f", display: "flex", flexDirection: "column", fontFamily: "Georgia, 'Times New Roman', serif" }}>

      {/* Header */}
      <header style={{ height: 56, background: "#0a0a18", borderBottom: "1px solid #1e1e35", display: "flex", alignItems: "center", padding: "0 20px", gap: 12, flexShrink: 0, zIndex: 10 }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#d4b896", letterSpacing: "0.04em" }}>Род Власовых</span>
        <span style={{ color: "#333", fontSize: 18 }}>·</span>
        <span style={{ fontSize: 12, color: "#555" }}>8 поколений · {PEOPLE.length} человек</span>

        <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
          {[1,2,3,4,5,6,7,8].map(g => (
            <div key={g} title={GEN_NAMES[g]} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#555" }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[g].border }}/>
            </div>
          ))}
          <div style={{ width: 1, height: 20, background: "#222", margin: "0 6px" }}/>
          {([["−", -0.15], ["+", 0.15]] as const).map(([lbl, d]) => (
            <button key={lbl} onClick={() => setScale(s => Math.min(2.5, Math.max(0.18, s + d)))}
              style={{ width: 26, height: 26, background: "#111", border: "1px solid #222", borderRadius: 5, color: "#aaa", cursor: "pointer", fontSize: 15, lineHeight: "1" }}>
              {lbl}
            </button>
          ))}
          <button onClick={() => { setScale(0.68); setPanX(-40); setPanY(-20); setSelected(null); }}
            style={{ padding: "0 10px", height: 26, background: "#111", border: "1px solid #222", borderRadius: 5, color: "#777", cursor: "pointer", fontSize: 11 }}>
            Сброс
          </button>
        </div>
      </header>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Canvas */}
        <div style={{ flex: 1, overflow: "hidden", cursor: panning ? "grabbing" : "grab", position: "relative" }}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} onWheel={onWheel}>

          <svg width="100%" height="100%">
            <g transform={`scale(${scale}) translate(${panX},${panY})`}>

              {/* Gen labels */}
              {([1,2,3,4,5,6,7,8] as const).map(g => (
                <text key={g} x={20} y={(GEN_Y[g] ?? 60) + CH / 2 + 5}
                  fill={COLORS[g].border} fontSize={10} opacity={0.5}
                  style={{ userSelect: "none", fontFamily: "Georgia, serif" }}>
                  {GEN_NAMES[g]}
                </text>
              ))}

              {/* Horizontal gen separator lines */}
              {([1,2,3,4,5,6,7,8] as const).map(g => (
                <line key={`sep-${g}`} x1={0} y1={GEN_Y[g] - 10} x2={CANVAS_W} y2={GEN_Y[g] - 10}
                  stroke={COLORS[g].border} strokeWidth={0.3} opacity={0.12}/>
              ))}

              {/* Parent → Child curves */}
              {CONNECTIONS.map(({ from, to }) => {
                const fp = PEOPLE.find(p => p.id === from);
                const tp = PEOPLE.find(p => p.id === to);
                if (!fp || !tp) return null;
                const x1 = cx(from);
                const y1 = (GEN_Y[fp.generation] ?? 80) + CH;
                const x2 = cx(to);
                const y2 = GEN_Y[tp.generation] ?? 200;
                const my = (y1 + y2) / 2;
                const col = COLORS[tp.generation]?.border ?? "#444";
                const isHighlighted = selected && (selected.id === from || selected.id === to || parents.some(p => p.id === from) || children.some(c => c.id === to));
                return (
                  <path key={`${from}-${to}`}
                    d={`M${x1} ${y1} C${x1} ${my},${x2} ${my},${x2} ${y2}`}
                    fill="none" stroke={col}
                    strokeWidth={isHighlighted ? 2 : 1}
                    opacity={isHighlighted ? 0.75 : 0.2}
                  />
                );
              })}

              {/* Spouse dashes */}
              {SPOUSES.map(([a, b]) => {
                const pa = PEOPLE.find(p => p.id === a);
                const pb = PEOPLE.find(p => p.id === b);
                if (!pa || !pb || a === b) return null;
                const xa = (X[a] ?? 0) + CW;
                const xb = X[b] ?? 0;
                if (xb - xa > 60 || xb - xa < -20) return null;
                const y0 = (GEN_Y[pa.generation] ?? 80) + CH / 2;
                return (
                  <line key={`sp-${a}-${b}`} x1={xa} y1={y0} x2={xb} y2={y0}
                    stroke="#444" strokeWidth={1.2} strokeDasharray="4 3" opacity={0.5}/>
                );
              })}

              {/* Person cards */}
              {PEOPLE.map(p => {
                const px = X[p.id] ?? 0;
                const py = GEN_Y[p.generation] ?? 80;
                const col = COLORS[p.generation];
                const isSel = selected?.id === p.id;
                const isMe = p.id === "p1_pavel";
                const isBro = p.id === "p1_petr";

                return (
                  <g key={p.id} className="pc" transform={`translate(${px},${py})`}
                    onClick={() => select(p)} style={{ cursor: "pointer" }}>

                    {/* Selection glow */}
                    {isSel && <rect width={CW} height={CH} rx={7} fill={col.border} opacity={0.15}
                      x={-3} y={-3} width={CW + 6} height={CH + 6}/>}

                    {/* Card */}
                    <rect width={CW} height={CH} rx={7}
                      fill={isSel ? col.border + "22" : col.bg}
                      stroke={col.border}
                      strokeWidth={isSel ? 1.8 : 0.8}
                      opacity={0.95}
                    />

                    {/* Left color bar */}
                    <rect x={0} y={0} width={4} height={CH} rx={3} fill={col.border} opacity={0.7}/>

                    {/* Avatar */}
                    <circle cx={24} cy={CH / 2} r={16} fill={col.border} opacity={0.2}/>
                    <text x={24} y={CH / 2 + 5} textAnchor="middle"
                      fill={col.text} fontSize={11} fontWeight="bold"
                      style={{ fontFamily: "Georgia, serif" }}>
                      {initials(p)}
                    </text>

                    {/* Me / Bro badge */}
                    {(isMe || isBro) && (
                      <>
                        <rect x={CW - 32} y={2} width={30} height={14} rx={3}
                          fill={isMe ? "#4caf50" : "#ff7043"}/>
                        <text x={CW - 17} y={12} textAnchor="middle"
                          fill="#fff" fontSize={8} fontWeight="bold"
                          style={{ fontFamily: "Georgia, serif" }}>
                          {isMe ? "Я" : "Брат"}
                        </text>
                      </>
                    )}

                    {/* First name */}
                    <text x={46} y={22} fill={col.text} fontSize={11} fontWeight="bold"
                      style={{ fontFamily: "Georgia, serif" }}>
                      {p.firstName.length > 13 ? p.firstName.slice(0, 12) + "…" : p.firstName}
                    </text>
                    {/* Last name */}
                    <text x={46} y={36} fill={col.sub} fontSize={10}
                      style={{ fontFamily: "Georgia, serif" }}>
                      {p.lastName.length > 14 ? p.lastName.slice(0, 13) + "…" : p.lastName}
                    </text>
                    {/* Maiden name */}
                    {p.maidenName && (
                      <text x={46} y={48} fill={col.sub} fontSize={9} opacity={0.7}
                        style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>
                        ({p.maidenName})
                      </text>
                    )}
                    {/* Years */}
                    <text x={46} y={p.maidenName ? 60 : 50} fill={col.sub} fontSize={9} opacity={0.6}
                      style={{ fontFamily: "Georgia, serif" }}>
                      {years(p)}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {!selected && (
            <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
              background: "rgba(6,6,15,0.9)", border: "1px solid #1e1e35",
              borderRadius: 8, padding: "7px 14px", color: "#555", fontSize: 11, pointerEvents: "none" }}>
              Нажмите на карточку чтобы узнать подробнее · Колесо — масштаб · Перетаскивайте дерево
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && c && (
          <div style={{ width: 400, background: "#0a0a18", borderLeft: "1px solid #1e1e35",
            display: "flex", flexDirection: "column", overflowY: "auto", flexShrink: 0 }}>

            {/* Panel header */}
            <div style={{ padding: "20px 22px 16px", borderBottom: "1px solid #141428",
              position: "sticky", top: 0, background: "#0a0a18", zIndex: 2 }}>
              <button onClick={() => setSelected(null)}
                style={{ background: "none", border: "none", color: "#444", cursor: "pointer",
                  fontSize: 11, padding: 0, marginBottom: 14, display: "flex", alignItems: "center", gap: 4 }}>
                ← Закрыть
              </button>

              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 58, height: 58, borderRadius: "50%", flexShrink: 0,
                  background: c.border + "33", border: `2px solid ${c.border}55`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, fontWeight: 700, color: c.text }}>
                  {initials(selected)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#e0d4b8", lineHeight: 1.25 }}>
                    {selected.firstName}
                  </div>
                  <div style={{ fontSize: 15, color: "#9a8870", lineHeight: 1.4 }}>
                    {selected.lastName}
                  </div>
                  {selected.maidenName && (
                    <div style={{ fontSize: 12, color: "#666", fontStyle: "italic" }}>
                      урожд. {selected.maidenName}
                    </div>
                  )}
                  <div style={{ marginTop: 6, display: "inline-block", padding: "2px 9px",
                    borderRadius: 4, fontSize: 10, background: c.badge + "33",
                    border: `1px solid ${c.badge}55`, color: c.text }}>
                    {selected.role}
                  </div>
                </div>
              </div>
            </div>

            {/* Vitals */}
            <div style={{ padding: "14px 22px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                {[
                  ["Рождение", selected.born || "—"],
                  ["Смерть", selected.died || (selected.born && selected.born !== "—" ? "жив(а)" : "—")],
                  ["Профессия / роль", selected.occupation || "—"],
                  ["Место рождения", selected.birthPlace || "—"],
                ].map(([lbl, val]) => (
                  <div key={lbl} style={{ background: "#0f0f20", borderRadius: 7, padding: "9px 11px" }}>
                    <div style={{ fontSize: 9, color: "#444", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>{lbl}</div>
                    <div style={{ fontSize: 12, color: "#b0a890", lineHeight: 1.3 }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Bio */}
              {selected.bio && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 9, color: "#444", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 7 }}>Биография</div>
                  <p style={{ margin: 0, fontSize: 12, color: "#9a8e78", lineHeight: 1.75 }}>{selected.bio}</p>
                </div>
              )}

              {/* Notes */}
              {selected.notes && (
                <div style={{ marginBottom: 14, padding: "10px 12px", background: "#0f0f20",
                  borderLeft: `3px solid ${c.border}55`, borderRadius: "0 6px 6px 0" }}>
                  <div style={{ fontSize: 9, color: "#444", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Дополнительно</div>
                  <p style={{ margin: 0, fontSize: 11, color: "#7a7060", lineHeight: 1.65 }}>{selected.notes}</p>
                </div>
              )}

              {/* Spouse */}
              {spouse && (
                <PersonLink label="Супруг(а)" people={[spouse]} onSelect={select} colors={COLORS} arrow="↔"/>
              )}

              {/* Parents */}
              {parents.length > 0 && (
                <PersonLink label="Родители" people={parents} onSelect={select} colors={COLORS} arrow="↑"/>
              )}

              {/* Children */}
              {children.length > 0 && (
                <PersonLink label={`Дети (${children.length})`} people={children} onSelect={select} colors={COLORS} arrow="↓"/>
              )}

              {/* Generation label */}
              <div style={{ marginTop: 8, padding: "9px 12px", borderRadius: 7,
                background: c.border + "11", border: `1px solid ${c.border}22`,
                fontSize: 11, color: "#555" }}>
                {GEN_NAMES[selected.generation]}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Small helper component ────────────────────────────────────────────────
function PersonLink({ label, people, onSelect, colors, arrow }: {
  label: string;
  people: Person[];
  onSelect: (p: Person) => void;
  colors: typeof COLORS;
  arrow: string;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 9, color: "#444", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 7 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {people.map(p => {
          const c = colors[p.generation];
          return (
            <button key={p.id} onClick={() => onSelect(p)}
              style={{ width: "100%", textAlign: "left", background: "#0f0f20",
                border: `1px solid ${c.border}22`, borderRadius: 7,
                padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: c.border + "30",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: c.text, flexShrink: 0 }}>
                {(p.firstName[0] + p.lastName[0]).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: "#b0a890", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {p.firstName} {p.lastName}
                </div>
                <div style={{ fontSize: 10, color: "#555" }}>{p.role}</div>
              </div>
              <span style={{ color: "#333", fontSize: 14, flexShrink: 0 }}>{arrow}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}