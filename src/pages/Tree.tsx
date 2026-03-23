import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Person {
  id: string;
  name: string;
  years: string;
  role: string;
  description?: string;
  facts?: string[];
  spouseId?: string;
  generation: number;
  side?: "left" | "right" | "center";
  avatar?: string; // initials fallback
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const people: Person[] = [
  {
    id: "merkury",
    name: "Власов Меркурий Евтихеевич",
    years: "1912 – 2000",
    role: "Прадед",
    description:
      "Военный техник авиации, Герой Севастополя. Участник Великой Отечественной войны, прошёл путь от рядового до офицера.",
    facts: [
      "Военный техник авиации",
      "Герой обороны Севастополя",
      "1912–2000",
    ],
    generation: 1,
    side: "left",
    avatar: "МВ",
  },
  {
    id: "olga_cherno",
    name: "Черномашенцева Ольга Николаевна",
    years: "1896 – 1951",
    role: "Прабабушка",
    description:
      "Дворянка, пианистка. Представительница старой дворянской семьи, получила блестящее музыкальное образование.",
    facts: ["Дворянка", "Пианистка", "1896–1951"],
    generation: 1,
    side: "right",
    avatar: "ОЧ",
    spouseId: "merkury",
  },
  {
    id: "alexander",
    name: "Власов Александр Меркурьевич",
    years: "род. 1950",
    role: "Дед (по отцу)",
    description:
      "Сын Меркурия и Ольги. Продолжатель семейной традиции. Большую часть жизни провёл в Севастополе.",
    facts: ["Сын Меркурия Евтихеевича", "Год рождения: 1950"],
    generation: 2,
    side: "left",
    avatar: "АВ",
  },
  {
    id: "anna_torот",
    name: "Торотько Анна Николаевна",
    years: "1921 – 2003",
    role: "Прабабушка (по маме)",
    description:
      "Капитан медицинской службы. Прошла войну, спасала раненых на передовой. Женщина исключительного мужества.",
    facts: ["Капитан медицинской службы", "1921–2003"],
    generation: 2,
    side: "right",
    avatar: "АТ",
  },
  {
    id: "olga_bab",
    name: "Власова Ольга Зиновьевна",
    years: "род. 1951",
    role: "Бабушка (по отцу)",
    description: "Бабушка по линии отца. Хранительница семейных традиций и истории рода Власовых.",
    facts: ["Год рождения: 1951", "Бабушка по отцу"],
    generation: 2,
    side: "left",
    avatar: "ОЗ",
    spouseId: "alexander",
  },
  {
    id: "igor",
    name: "Власов Игорь Александрович",
    years: "род. 1976",
    role: "Отец",
    description:
      "Отец семейства. Родился в 1976 году. Сын Александра Меркурьевича и Ольги Зиновьевны.",
    facts: ["Год рождения: 1976", "Отец"],
    generation: 3,
    side: "left",
    avatar: "ИВ",
  },
  {
    id: "anna_mat",
    name: "Анна Игоревна Королева",
    years: "род. 1970",
    role: "Мать",
    description: "Мать семейства. Родилась в 1970 году. Потомок Анны Николаевны Торотько.",
    facts: ["Год рождения: 1970", "Мать"],
    generation: 3,
    side: "right",
    avatar: "АК",
    spouseId: "igor",
  },
  {
    id: "petr",
    name: "Власов Пётр Игоревич",
    years: "род. 2011",
    role: "Брат",
    description: "Младший брат. Родился в 2011 году. Сын Игоря Александровича и Анны Игоревны.",
    facts: ["Год рождения: 2011", "Младший брат"],
    generation: 4,
    side: "left",
    avatar: "ПВ",
  },
  // Главный герой — ты сам (можешь поменять данные)
  {
    id: "you",
    name: "Власов Владимир Игоревич",
    years: "род. 2008",
    role: "Я",
    description: "Центральный персонаж семейного древа. Создатель этого проекта.",
    facts: ["Год рождения: 2008", "Автор проекта"],
    generation: 4,
    side: "center",
    avatar: "ВВ",
  },
];

// ─── Colors per generation ────────────────────────────────────────────────────
const genColors: Record<number, { border: string; bg: string; badge: string; badgeText: string }> = {
  1: {
    border: "#8B7355",
    bg: "linear-gradient(135deg, #FDF6E3 0%, #F5EDD0 100%)",
    badge: "#8B7355",
    badgeText: "#fff",
  },
  2: {
    border: "#6B8FAB",
    bg: "linear-gradient(135deg, #EEF4FA 0%, #DCE9F5 100%)",
    badge: "#6B8FAB",
    badgeText: "#fff",
  },
  3: {
    border: "#7A9B6B",
    bg: "linear-gradient(135deg, #EFF6EC 0%, #DCF0D3 100%)",
    badge: "#7A9B6B",
    badgeText: "#fff",
  },
  4: {
    border: "#A07850",
    bg: "linear-gradient(135deg, #FFF8F0 0%, #F5E8D5 100%)",
    badge: "#A07850",
    badgeText: "#fff",
  },
};

const genLabels: Record<number, string> = {
  1: "Прадеды",
  2: "Деды и прабабушки",
  3: "Родители",
  4: "Наше поколение",
};

// ─── PersonCard ───────────────────────────────────────────────────────────────
function PersonCard({
  person,
  onClick,
  isCenter,
}: {
  person: Person;
  onClick: () => void;
  isCenter?: boolean;
}) {
  const colors = genColors[person.generation];
  return (
    <div
      onClick={onClick}
      style={{
        background: colors.bg,
        border: `2px solid ${isCenter ? "#C8971A" : colors.border}`,
        borderRadius: 16,
        padding: "14px 18px",
        minWidth: isCenter ? 200 : 180,
        maxWidth: isCenter ? 220 : 200,
        cursor: "pointer",
        boxShadow: isCenter
          ? "0 4px 24px rgba(200,151,26,0.28), 0 1px 4px rgba(0,0,0,0.08)"
          : "0 2px 10px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.2s, transform 0.15s",
        position: "relative",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = isCenter
          ? "0 8px 32px rgba(200,151,26,0.38)"
          : "0 6px 20px rgba(0,0,0,0.14)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "";
        (e.currentTarget as HTMLDivElement).style.boxShadow = isCenter
          ? "0 4px 24px rgba(200,151,26,0.28)"
          : "0 2px 10px rgba(0,0,0,0.08)";
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: isCenter ? "#C8971A" : colors.badge,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 14,
          marginBottom: 10,
          fontFamily: "serif",
          letterSpacing: 1,
        }}
      >
        {person.avatar}
      </div>
      {/* Name */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#1C1410",
          lineHeight: 1.4,
          marginBottom: 4,
          fontFamily: "'Georgia', serif",
        }}
      >
        {person.name}
      </div>
      {/* Years */}
      <div
        style={{
          fontSize: 12,
          color: isCenter ? "#C8971A" : colors.badge,
          fontWeight: 500,
          marginBottom: 4,
        }}
      >
        {person.years}
      </div>
      {/* Role badge */}
      <div
        style={{
          display: "inline-block",
          background: isCenter ? "#C8971A" : colors.badge,
          color: "#fff",
          borderRadius: 20,
          padding: "2px 10px",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: 0.5,
          textTransform: "uppercase",
        }}
      >
        {person.role}
      </div>
      {/* Pulse ring for center */}
      {isCenter && (
        <div
          style={{
            position: "absolute",
            inset: -6,
            borderRadius: 20,
            border: "2px solid rgba(200,151,26,0.35)",
            pointerEvents: "none",
            animation: "pulse-ring 2s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function PersonModal({
  person,
  onClose,
}: {
  person: Person;
  onClose: () => void;
}) {
  const colors = genColors[person.generation];
  const isCenter = person.id === "you";
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20,15,8,0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 24,
        animation: "fadeIn 0.2s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#FFFDF8",
          borderRadius: 24,
          maxWidth: 460,
          width: "100%",
          padding: "32px 32px 28px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
          border: `2px solid ${isCenter ? "#C8971A" : colors.border}`,
          animation: "slideUp 0.25s cubic-bezier(.22,.68,0,1.2)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1px solid #ddd",
            background: "#f5f5f0",
            cursor: "pointer",
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#666",
          }}
        >
          ×
        </button>
        {/* Header */}
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: isCenter ? "#C8971A" : colors.badge,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 700,
              flexShrink: 0,
              fontFamily: "serif",
              boxShadow: `0 4px 14px ${isCenter ? "rgba(200,151,26,0.4)" : "rgba(0,0,0,0.15)"}`,
            }}
          >
            {person.avatar}
          </div>
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#1C1410",
                lineHeight: 1.3,
                fontFamily: "'Georgia', serif",
                marginBottom: 4,
              }}
            >
              {person.name}
            </div>
            <div style={{ fontSize: 14, color: isCenter ? "#C8971A" : colors.badge, fontWeight: 600 }}>
              {person.years}
            </div>
            <div
              style={{
                display: "inline-block",
                marginTop: 6,
                background: isCenter ? "#C8971A" : colors.badge,
                color: "#fff",
                borderRadius: 20,
                padding: "3px 12px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.8,
                textTransform: "uppercase",
              }}
            >
              {person.role}
            </div>
          </div>
        </div>
        {/* Divider */}
        <div style={{ height: 1, background: "#E8E0D0", margin: "0 0 18px" }} />
        {/* Description */}
        {person.description && (
          <p
            style={{
              fontSize: 14,
              color: "#4A3E2A",
              lineHeight: 1.7,
              marginBottom: 16,
              fontFamily: "'Georgia', serif",
            }}
          >
            {person.description}
          </p>
        )}
        {/* Facts */}
        {person.facts && person.facts.length > 0 && (
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.2,
                color: "#9E8A6A",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Сведения
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {person.facts.map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 13,
                    color: "#3A2E1E",
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: isCenter ? "#C8971A" : colors.badge,
                      flexShrink: 0,
                    }}
                  />
                  {f}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Generations badge */}
        <div
          style={{
            marginTop: 20,
            padding: "8px 14px",
            background: "#F5EDD0",
            borderRadius: 10,
            fontSize: 12,
            color: "#7A6840",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>🌿</span>
          {genLabels[person.generation]}
        </div>
      </div>
    </div>
  );
}

// ─── Connector SVG ─────────────────────────────────────────────────────────────
function TreeConnectors() {
  // Visual decorative connector lines between generations
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6">
          <circle cx="5" cy="5" r="4" fill="#C8971A" />
        </marker>
      </defs>
    </svg>
  );
}

// ─── Generation Row ────────────────────────────────────────────────────────────
function GenRow({
  label,
  children,
  genNum,
}: {
  label: string;
  children: React.ReactNode;
  genNum: number;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 0, width: "100%" }}>
      {/* Left label */}
      <div
        style={{
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          transform: "rotate(180deg)",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1.5,
          color: "#B8A080",
          textTransform: "uppercase",
          minWidth: 28,
          alignSelf: "center",
          userSelect: "none",
          opacity: 0.7,
        }}
      >
        {genNum}
      </div>
      {/* Cards */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          padding: "0 8px",
          flexWrap: "wrap",
        }}
      >
        {children}
      </div>
      {/* Right label */}
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "#B8A080",
          textTransform: "uppercase",
          letterSpacing: 1,
          minWidth: 90,
          alignSelf: "center",
          textAlign: "right",
          paddingRight: 4,
          opacity: 0.7,
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ─── Vertical Connector ────────────────────────────────────────────────────────
function VertConnector({ double }: { double?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 48,
        gap: double ? 80 : 0,
      }}
    >
      {double ? (
        <>
          <div
            style={{
              width: 2,
              height: 48,
              background: "linear-gradient(to bottom, #C8971A44, #C8971Aaa)",
              borderRadius: 2,
              position: "relative",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#C8971A",
                position: "absolute",
                bottom: -4,
                left: -3,
              }}
            />
          </div>
          <div
            style={{
              width: 2,
              height: 48,
              background: "linear-gradient(to bottom, #6B8FAB44, #6B8FABaa)",
              borderRadius: 2,
              position: "relative",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#6B8FAB",
                position: "absolute",
                bottom: -4,
                left: -3,
              }}
            />
          </div>
        </>
      ) : (
        <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              width: 2,
              flex: 1,
              background: "linear-gradient(to bottom, #C8971A55, #C8971A)",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#C8971A",
              marginTop: -2,
              boxShadow: "0 0 0 3px rgba(200,151,26,0.2)",
            }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Marriage Bracket ──────────────────────────────────────────────────────────
function MarriageBracket() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 40,
        gap: 0,
      }}
    >
      <div style={{ height: 2, width: 16, background: "#C8971A", opacity: 0.5 }} />
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          border: "2px solid #C8971A",
          background: "#FFF8E8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
        }}
      >
        ♥
      </div>
      <div style={{ height: 2, width: 16, background: "#C8971A", opacity: 0.5 }} />
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function FamilyTreePage() {
  const [selected, setSelected] = useState<Person | null>(null);

  const byId = Object.fromEntries(people.map((p) => [p.id, p]));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #FAF6ED 0%, #F0E8D8 50%, #EAE0CC 100%)",
        fontFamily: "'Raleway', 'Segoe UI', sans-serif",
        padding: "32px 20px 64px",
      }}
    >
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.04); }
        }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96) }
          to   { opacity: 1; transform: translateY(0) scale(1) }
        }
      `}</style>

      {/* Page header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#B8A080", textTransform: "uppercase", marginBottom: 8 }}>
          Семейная хроника
        </div>
        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 44px)",
            fontFamily: "'Georgia', serif",
            fontWeight: 700,
            color: "#1C1410",
            letterSpacing: -0.5,
            marginBottom: 10,
          }}
        >
          Древо рода Власовых
        </h1>
        <div style={{ width: 60, height: 2, background: "#C8971A", margin: "0 auto 12px" }} />
        <p style={{ fontSize: 14, color: "#7A6840", maxWidth: 360, margin: "0 auto" }}>
          Нажмите на карточку, чтобы узнать больше о члене семьи
        </p>
      </div>

      {/* Tree container */}
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          position: "relative",
        }}
      >
        {/* GEN 1 ── Прадеды */}
        <GenRow label="Прадеды" genNum={1}>
          <PersonCard person={byId["merkury"]} onClick={() => setSelected(byId["merkury"])} />
          <MarriageBracket />
          <PersonCard person={byId["olga_cherno"]} onClick={() => setSelected(byId["olga_cherno"])} />

          <div style={{ width: 40 }} />

          <PersonCard person={byId["anna_torот"]} onClick={() => setSelected(byId["anna_torот"])} />
        </GenRow>

        <VertConnector double />

        {/* GEN 2 ── Деды */}
        <GenRow label="Деды" genNum={2}>
          <PersonCard person={byId["alexander"]} onClick={() => setSelected(byId["alexander"])} />
          <MarriageBracket />
          <PersonCard person={byId["olga_bab"]} onClick={() => setSelected(byId["olga_bab"])} />
        </GenRow>

        <VertConnector />

        {/* GEN 3 ── Родители */}
        <GenRow label="Родители" genNum={3}>
          <PersonCard person={byId["igor"]} onClick={() => setSelected(byId["igor"])} />
          <MarriageBracket />
          <PersonCard person={byId["anna_mat"]} onClick={() => setSelected(byId["anna_mat"])} />
        </GenRow>

        <VertConnector />

        {/* GEN 4 ── Наше поколение */}
        <GenRow label="Дети" genNum={4}>
          <PersonCard person={byId["petr"]} onClick={() => setSelected(byId["petr"])} />
          <PersonCard person={byId["you"]} onClick={() => setSelected(byId["you"])} isCenter />
        </GenRow>

        {/* Decorative bottom */}
        <div style={{ marginTop: 48, textAlign: "center", opacity: 0.4, fontSize: 22 }}>🌿</div>
      </div>

      {/* Modal */}
      {selected && (
        <PersonModal person={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}