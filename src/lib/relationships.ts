import { supabase } from "@/lib/supabase";

// Типы могут отличаться в вашей БД — поэтому все поля опциональны.
export type RelationshipRow = {
  id?: string | number;
  // Частые варианты имен полей в таблицах связей
  parent_id?: string | null;
  child_id?: string | null;
  from_id?: string | null;
  to_id?: string | null;
  source_id?: string | null;
  target_id?: string | null;

  // На случай если хранится тип связи ("mother", "father", ...)
  type?: string | null;

  // Иногда в таблицах связей могут быть другие поля
  [key: string]: unknown;
};

function pickIds(row: RelationshipRow): { sourceId: string | null; targetId: string | null } {
  const sourceId =
    (row.parent_id as string | null | undefined) ??
    (row.from_id as string | null | undefined) ??
    (row.source_id as string | null | undefined) ??
    null;

  const targetId =
    (row.child_id as string | null | undefined) ??
    (row.to_id as string | null | undefined) ??
    (row.target_id as string | null | undefined) ??
    null;

  return { sourceId: sourceId ?? null, targetId: targetId ?? null };
}

export async function fetchAllRelationships(): Promise<RelationshipRow[]> {
  const { data, error } = await supabase.from("relationships").select("*");
  if (error) throw error;
  return (data ?? []) as RelationshipRow[];
}

export function relationshipToEdge(
  row: RelationshipRow
): { sourceId: string; targetId: string } | null {
  const { sourceId, targetId } = pickIds(row);
  if (!sourceId || !targetId) return null;
  return { sourceId, targetId };
}

