export interface ConceptNode {
  id: string;
  label: string;
  prerequisites: string[];
}

export interface KnowledgeGraphNode extends ConceptNode {
  masteryScore: number;
  state: "locked" | "available" | "current" | "mastered";
  reason?: string;
}

const ALGEBRA_GRAPH: ConceptNode[] = [
  { id: "number-sense", label: "Number sense", prerequisites: [] },
  { id: "algebra-basics", label: "Algebra basics", prerequisites: ["number-sense"] },
  { id: "linear-equations", label: "Linear equations", prerequisites: ["algebra-basics"] },
  { id: "simultaneous-equations", label: "Simultaneous equations", prerequisites: ["linear-equations"] },
];

const UNIVERSITY_CS_GRAPH: ConceptNode[] = [
  { id: "arrays", label: "Arrays", prerequisites: [] },
  { id: "linked-lists", label: "Linked lists", prerequisites: ["arrays"] },
  { id: "trees", label: "Trees", prerequisites: ["linked-lists"] },
  { id: "binary-search-trees", label: "Binary search trees", prerequisites: ["trees"] },
];

export function getConceptGraph(subjectId: string): ConceptNode[] {
  if (subjectId === "university-cs-dsa") return UNIVERSITY_CS_GRAPH;
  return ALGEBRA_GRAPH;
}

export function buildKnowledgeMap(
  subjectId: string,
  masteryByConcept: Record<string, number>,
  activeConceptId?: string,
): KnowledgeGraphNode[] {
  const graph = getConceptGraph(subjectId);
  return graph.map((node) => {
    const score = masteryByConcept[node.id] ?? 0;
    const prereqsMet = node.prerequisites.every((p) => (masteryByConcept[p] ?? 0) >= 50);
    let state: KnowledgeGraphNode["state"] = "locked";
    let reason: string | undefined;

    if (score >= 80) {
      state = "mastered";
    } else if (node.id === activeConceptId || (prereqsMet && score > 0)) {
      state = "current";
    } else if (prereqsMet) {
      state = "available";
    } else {
      reason = `Complete ${node.prerequisites.map((p) => graph.find((n) => n.id === p)?.label ?? p).join(" and ")} first.`;
    }

    return { ...node, masteryScore: score, state, reason };
  });
}

export function getUnlockedConcepts(subjectId: string, masteryByConcept: Record<string, number>): string[] {
  return buildKnowledgeMap(subjectId, masteryByConcept)
    .filter((n) => n.state !== "locked")
    .map((n) => n.id);
}
