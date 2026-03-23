import type { FamilyMember } from "@/data/familyData";

type Gender = "m" | "f";

function inferGender(m: FamilyMember | undefined): Gender {
  const name = m?.name?.toLowerCase?.() ?? "";
  if (m?.gender === "m" || m?.gender === "f") return m.gender;

  // Heuristic fallback: many female Russian names end with "а"/"я".
  return /[ая]$/.test(name) ? "f" : "m";
}

function getParents(id: string, map: Record<string, FamilyMember>): string[] {
  const m = map[id];
  if (!m) return [];
  const motherId = m.motherId ?? m.mother_id ?? null;
  const fatherId = m.fatherId ?? m.father_id ?? null;
  return [motherId, fatherId].filter(Boolean) as string[];
}

function getChildren(id: string, map: Record<string, FamilyMember>): string[] {
  const out: string[] = [];
  for (const candidate of Object.values(map)) {
    const motherId = candidate.motherId ?? candidate.mother_id ?? null;
    const fatherId = candidate.fatherId ?? candidate.father_id ?? null;
    if (motherId === id || fatherId === id) out.push(candidate.id);
  }
  return out;
}

function getSpouseId(id: string, map: Record<string, FamilyMember>): string | null {
  const m = map[id];
  if (!m) return null;
  return m.spouseId ?? m.spouse_id ?? null;
}

function areBloodSiblings(aId: string, bId: string, map: Record<string, FamilyMember>) {
  if (aId === bId) return false;
  const aParents = getParents(aId, map);
  const bParents = getParents(bId, map);
  if (!aParents.length || !bParents.length) return false;
  // Share at least one parent (full or half sibling).
  return aParents.some((p) => bParents.includes(p));
}

function getAncestorDistance(fromId: string, toId: string, map: Record<string, FamilyMember>): number | null {
  if (fromId === toId) return 0;
  const visited = new Set<string>([fromId]);
  const queue: Array<{ id: string; depth: number }> = [{ id: fromId, depth: 0 }];

  while (queue.length) {
    const cur = queue.shift()!;
    const parents = getParents(cur.id, map);
    for (const p of parents) {
      if (visited.has(p)) continue;
      const depth = cur.depth + 1;
      if (p === toId) return depth;
      visited.add(p);
      queue.push({ id: p, depth });
    }
  }
  return null;
}

function getDescendantDistance(fromId: string, toId: string, map: Record<string, FamilyMember>): number | null {
  if (fromId === toId) return 0;
  const visited = new Set<string>([fromId]);
  const queue: Array<{ id: string; depth: number }> = [{ id: fromId, depth: 0 }];

  while (queue.length) {
    const cur = queue.shift()!;
    const children = getChildren(cur.id, map);
    for (const c of children) {
      if (visited.has(c)) continue;
      const depth = cur.depth + 1;
      if (c === toId) return depth;
      visited.add(c);
      queue.push({ id: c, depth });
    }
  }
  return null;
}

function buildUndirectedBloodGraph(map: Record<string, FamilyMember>): Record<string, string[]> {
  const adj: Record<string, string[]> = {};
  for (const id of Object.keys(map)) adj[id] = [];

  for (const m of Object.values(map)) {
    const parents = getParents(m.id, map);
    for (const p of parents) {
      if (!adj[m.id]) adj[m.id] = [];
      if (!adj[p]) adj[p] = [];
      adj[p].push(m.id);
      adj[m.id].push(p);
    }
  }
  return adj;
}

function findBloodPath(fromId: string, toId: string, map: Record<string, FamilyMember>): string[] | null {
  if (fromId === toId) return [fromId];
  const adj = buildUndirectedBloodGraph(map);
  const visited = new Set<string>([fromId]);
  const queue: string[][] = [[fromId]];

  while (queue.length) {
    const path = queue.shift()!;
    const cur = path[path.length - 1];
    for (const n of adj[cur] || []) {
      if (visited.has(n)) continue;
      const nextPath = [...path, n];
      if (n === toId) return nextPath;
      visited.add(n);
      queue.push(nextPath);
    }
  }
  return null;
}

function classifyBloodSteps(path: string[], map: Record<string, FamilyMember>): Array<"up" | "down"> {
  const steps: Array<"up" | "down"> = [];
  for (let i = 0; i < path.length - 1; i++) {
    const parents = getParents(path[i], map);
    steps.push(parents.includes(path[i + 1]) ? "up" : "down");
  }
  return steps;
}

function getAncestorLabel(generations: number, gender: Gender): string {
  // generations: 1 = father/mother, 2 = grandfather/grandmother, 3 = great..., 4 = great-great...
  switch (generations) {
    case 1:
      return gender === "m" ? "Твой отец" : "Твоя мать";
    case 2:
      return gender === "m" ? "Твой дедушка" : "Твоя бабушка";
    case 3:
      return gender === "m" ? "Твой прадедушка" : "Твоя прабабушка";
    case 4:
      // Requested term: "прапрадед"
      return gender === "m" ? "Твой прапрадед" : "Твоя прапрабабушка";
    default: {
      const prefix = "пра".repeat(generations - 2);
      return gender === "m" ? `Твой ${prefix}дедушка` : `Твоя ${prefix}бабушка`;
    }
  }
}

function getDescendantLabel(generations: number, gender: Gender): string {
  switch (generations) {
    case 1:
      return gender === "m" ? "Твой сын" : "Твоя дочь";
    case 2:
      return gender === "m" ? "Твой внук" : "Твоя внучка";
    case 3:
      return gender === "m" ? "Твой правнук" : "Твоя правнучка";
    default: {
      const prefix = "пра".repeat(generations - 2);
      return gender === "m" ? `Твой ${prefix}внук` : `Твоя ${prefix}внучка`;
    }
  }
}

function getSpouseLabel(youGender: Gender, spouseGender: Gender): string {
  if (youGender === "m" && spouseGender === "f") return "Твоя жена";
  if (youGender === "f" && spouseGender === "m") return "Твой муж";
  return youGender === "m" ? "Твоя вторая половина" : "Твоя вторая половина";
}

/**
 * Вычисляет термин родства "от меня" к выбранному человеку.
 * Поддерживает: деверь, золовка, свояк, прапрадед (+ базовые кровные связи).
 */
export function getKinshipStatus(meId: string, targetId: string, members: FamilyMember[]): string {
  if (!meId || !targetId) return "Родственник";
  if (meId === targetId) return "Это ты";

  const map = Object.fromEntries(members.map((m) => [m.id, m])) as Record<string, FamilyMember>;
  const me = map[meId];
  const target = map[targetId];
  if (!me || !target) return "Родственник";

  const meGender = inferGender(me);
  const targetGender = inferGender(target);

  // Spouse (try both directions)
  const directSpouse = getSpouseId(meId, map);
  const reverseSpouse = getSpouseId(targetId, map);
  const spouseId =
    directSpouse ??
    (Object.values(map).find((m) => (m.spouseId ?? m.spouse_id) === meId)?.id ?? null);
  if (spouseId === targetId || reverseSpouse === meId) return getSpouseLabel(meGender, targetGender);

  // In-law terms (requested)
  if (spouseId) {
    // Деверь / золовка are from WIFE perspective: wife's husband's brother/sister.
    if (meGender === "f") {
      if (areBloodSiblings(spouseId, targetId, map)) {
        return targetGender === "m" ? "Твой деверь" : "Твоя золовка";
      }
    }

    // Свояк: husband of wife's sister (from HUSBAND perspective).
    if (meGender === "m") {
      const wifeSiblings = Object.values(map).filter((m) => {
        return m.id !== spouseId && areBloodSiblings(spouseId, m.id, map);
      });
      const wifeSisters = wifeSiblings.filter((s) => inferGender(s) === "f");
      for (const sister of wifeSisters) {
        const sisterSpouse = getSpouseId(sister.id, map);
        if (sisterSpouse === targetId) return "Твой свояк";
      }
    }
  }

  // Blood relatives via path classification (mother/father only)
  const path = findBloodPath(meId, targetId, map);
  if (!path) return "Родственник";

  const steps = classifyBloodSteps(path, map);
  const ups = steps.filter((s) => s === "up").length;
  const downs = steps.filter((s) => s === "down").length;

  if (downs === 0) return getAncestorLabel(ups, targetGender);
  if (ups === 0) return getDescendantLabel(downs, targetGender);

  if (ups === 1 && downs === 1) return targetGender === "m" ? "Твой брат" : "Твоя сестра";
  if (ups === 2 && downs === 1) return targetGender === "m" ? "Твой дядя" : "Твоя тётя";
  if (ups === 1 && downs === 2) return targetGender === "m" ? "Твой племянник" : "Твоя племянница";
  if (ups === 3 && downs === 1) return targetGender === "m" ? "Твой двоюродный дед" : "Твоя двоюродная бабушка";
  if (ups === 2 && downs === 2) return targetGender === "m" ? "Твой двоюродный брат" : "Твоя двоюродная сестра";

  // As a final fallback, try pure ancestor/descendant (works even without exact path categories)
  const ancDist = getAncestorDistance(meId, targetId, map);
  if (ancDist && ancDist > 0) return getAncestorLabel(ancDist, targetGender);
  const descDist = getDescendantDistance(meId, targetId, map);
  if (descDist && descDist > 0) return getDescendantLabel(descDist, targetGender);

  return "Родственник";
}

// Backwards-compatible export for existing code (will be removed when all callsites are updated).
export function getRelationship(targetId: string, fromId: string = "pavel", members: FamilyMember[] = []): string {
  return getKinshipStatus(fromId, targetId, members);
}
