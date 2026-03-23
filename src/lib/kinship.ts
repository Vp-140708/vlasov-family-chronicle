import { familyMembers, type FamilyMember } from "@/data/familyData";

// Parent-child relationships: [parentId, childId]
const parentChildEdges: [string, string][] = [
  ["igor", "pavel"],
  ["anna", "pavel"],
  ["igor", "petr"],
  ["anna", "petr"],
  ["aleksandr", "igor"],
  ["olga", "igor"],
  ["igor-sr", "anna"],
  ["svetlana", "anna"],
];

// Gender map (for correct Russian relationship names)
const genderMap: Record<string, "m" | "f"> = {
  pavel: "m",
  petr: "m",
  igor: "m",
  anna: "f",
  aleksandr: "m",
  olga: "f",
  "igor-sr": "m",
  svetlana: "f",
};

/**
 * Build adjacency for BFS: undirected parent-child graph
 */
function buildGraph() {
  const adj: Record<string, string[]> = {};
  for (const m of familyMembers) {
    adj[m.id] = [];
  }
  for (const [parent, child] of parentChildEdges) {
    adj[parent]?.push(child);
    adj[child]?.push(parent);
  }
  return adj;
}

function getParents(id: string): string[] {
  return parentChildEdges.filter(([_, child]) => child === id).map(([parent]) => parent);
}

function getChildren(id: string): string[] {
  return parentChildEdges.filter(([parent]) => parent === id).map(([_, child]) => child);
}

/**
 * Find path from `from` to `to` using BFS on undirected graph
 */
function findPath(from: string, to: string): string[] | null {
  if (from === to) return [from];
  const adj = buildGraph();
  const visited = new Set<string>([from]);
  const queue: string[][] = [[from]];

  while (queue.length > 0) {
    const path = queue.shift()!;
    const current = path[path.length - 1];
    for (const neighbor of adj[current] || []) {
      if (!visited.has(neighbor)) {
        const newPath = [...path, neighbor];
        if (neighbor === to) return newPath;
        visited.add(neighbor);
        queue.push(newPath);
      }
    }
  }
  return null;
}

/**
 * Determine step direction along path: "up" (child→parent) or "down" (parent→child)
 */
function classifySteps(path: string[]): ("up" | "down")[] {
  const steps: ("up" | "down")[] = [];
  for (let i = 0; i < path.length - 1; i++) {
    const parents = getParents(path[i]);
    if (parents.includes(path[i + 1])) {
      steps.push("up"); // going from child to parent
    } else {
      steps.push("down"); // going from parent to child
    }
  }
  return steps;
}

/**
 * Compute the Russian kinship term from Pavel's perspective.
 * Returns "Это ты" for self, or "Твой/Твоя ..." for relatives.
 */
export function getRelationship(targetId: string, fromId: string = "pavel"): string {
  if (targetId === fromId) return "Это ты";

  const path = findPath(fromId, targetId);
  if (!path) return "Родственник";

  const steps = classifySteps(path);
  const ups = steps.filter((s) => s === "up").length;
  const downs = steps.filter((s) => s === "down").length;
  const targetGender = genderMap[targetId] || "m";

  // Direct ancestor (only ups)
  if (downs === 0) {
    return getAncestorLabel(ups, targetGender);
  }

  // Direct descendant (only downs)
  if (ups === 0) {
    return getDescendantLabel(downs, targetGender);
  }

  // Sibling: 1 up + 1 down
  if (ups === 1 && downs === 1) {
    return targetGender === "m" ? "Твой брат" : "Твоя сестра";
  }

  // Uncle/aunt: 2 up + 1 down
  if (ups === 2 && downs === 1) {
    return targetGender === "m" ? "Твой дядя" : "Твоя тётя";
  }

  // Nephew/niece: 1 up + 2 down
  if (ups === 1 && downs === 2) {
    return targetGender === "m" ? "Твой племянник" : "Твоя племянница";
  }

  // Great-uncle/aunt: 3 up + 1 down
  if (ups === 3 && downs === 1) {
    return targetGender === "m" ? "Твой двоюродный дед" : "Твоя двоюродная бабушка";
  }

  // Cousin: 2 up + 2 down
  if (ups === 2 && downs === 2) {
    return targetGender === "m" ? "Твой двоюродный брат" : "Твоя двоюродная сестра";
  }

  return "Родственник";
}

function getAncestorLabel(generations: number, gender: "m" | "f"): string {
  switch (generations) {
    case 1:
      return gender === "m" ? "Твой отец" : "Твоя мать";
    case 2:
      return gender === "m" ? "Твой дедушка" : "Твоя бабушка";
    case 3:
      return gender === "m" ? "Твой прадедушка" : "Твоя прабабушка";
    case 4:
      return gender === "m" ? "Твой прапрадедушка" : "Твоя прапрабабушка";
    default: {
      const prefix = "пра".repeat(generations - 2);
      return gender === "m" ? `Твой ${prefix}дедушка` : `Твоя ${prefix}бабушка`;
    }
  }
}

function getDescendantLabel(generations: number, gender: "m" | "f"): string {
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
