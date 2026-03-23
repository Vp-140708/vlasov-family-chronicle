import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(envFilePath: string) {
  try {
    const raw = fs.readFileSync(envFilePath, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // ignore
  }
}

// Load project-root .env.local for local one-off scripts.
const envPath = path.join(process.cwd(), ".env.local");
loadEnvFile(envPath);

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY || process.env.ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";

const TABLE = (process.env.SEED_TABLE || "family_members").toString();

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase env vars. Put SUPABASE_URL + SUPABASE_ANON_KEY (or VITE_* equivalents) into .env.local."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  // IDs можно поставить любые строковые — главное, чтобы они совпадали с теми, что используются в `relationships`.
  const people = [
    {
      id: "nikolay-torotsko",
      name: "Николай Викентьевич Тороцко",
      years: "1888 – 1974",
      title: "Штабс-капитан, Георгиевское оружие",
      branch: "both",
      generation: 2,
      bio: "",
      habits: [],
      medical: [],
    },
    {
      id: "mercury-vlasov",
      name: "Меркурий Евтихеевич Власов",
      years: "1912 – 2000",
      title: "Воентехник авиации, герой Севастополя",
      branch: "both",
      generation: 1,
      bio: "",
      habits: [],
      medical: [],
    },
    {
      id: "anna-torotko",
      name: "Анна Николаевна Торотько",
      years: "1921 – 2003",
      title: "Капитан медслужбы",
      branch: "both",
      generation: 1,
      bio: "",
      habits: [],
      medical: [],
    },
    {
      id: "olga-chernomashentseva",
      name: "Ольга Николаевна Черномашенцева",
      years: "1896 – 1951",
      title: "Дворянка, пианистка",
      branch: "both",
      generation: 2,
      bio: "",
      habits: [],
      medical: [],
    },
  ];

  // 1) Upsert people
  const { error: upsertError } = await supabase
    .from(TABLE)
    .upsert(people, { onConflict: "id" });

  if (upsertError) {
    console.warn("[seed] Upsert failed, fallback to insert:", upsertError.message);
    const { error: insertError } = await supabase.from(TABLE).insert(people);
    if (insertError) throw insertError;
  }

  console.log(`[seed] Seeded ${people.length} people into ${TABLE}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("[seed] Failed:", e);
    process.exit(1);
  });

