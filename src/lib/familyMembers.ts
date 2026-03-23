import { supabase } from "@/lib/supabase";

// Типы из таблицы `family_members`.
// Поля могут отличаться в вашей БД — поэтому многие из них опциональны.
export type FamilyMemberRow = {
  id: string;
  name: string;
  years?: string | null;
  title?: string | null;
  branch?: "paternal" | "maternal" | "both" | null;
  bio?: string | null;
  habits?: string[] | null;
  medical?: string[] | null;
  generation?: number | null;

  // Связи для родства
  mother_id?: string | null;
  father_id?: string | null;
  spouse_id?: string | null;

  // Пол для более точных терминов
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

  // Фото/артефакты (опционально)
  photo_url?: string | null;
};

export async function fetchAllRelatives(): Promise<FamilyMemberRow[]> {
  const { data, error } = await supabase.from("family_members").select("*");
  if (error) throw error;
  return (data ?? []) as FamilyMemberRow[];
}

