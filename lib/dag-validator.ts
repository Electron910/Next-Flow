import { Node, Edge } from "reactflow";

export function validateDAG(nodes: Node[], edges: Edge[]): {
  isValid: boolean;
  error?: string;
} {
  const adjacency: Record<string, string[]> = {};
  nodes.forEach((n) => (adjacency[n.id] = []));
  edges.forEach((e) => {
    if (!adjacency[e.source]) adjacency[e.source] = [];
    adjacency[e.source].push(e.target);
  });

  const visited = new Set<string>();
  const recStack = new Set<string>();

  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    recStack.add(nodeId);

    for (const neighbor of adjacency[nodeId] || []) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recStack.has(neighbor)) {
        return true;
      }
    }

    recStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) {
        return {
          isValid: false,
          error: "Circular dependency detected in workflow",
        };
      }
    }
  }

  return { isValid: true };
}

export function getExecutionOrder(nodes: Node[], edges: Edge[]): string[][] {
  const inDegree: Record<string, number> = {};
  const adjacency: Record<string, string[]> = {};

  nodes.forEach((n) => {
    inDegree[n.id] = 0;
    adjacency[n.id] = [];
  });

  edges.forEach((e) => {
    inDegree[e.target] = (inDegree[e.target] || 0) + 1;
    if (!adjacency[e.source]) adjacency[e.source] = [];
    adjacency[e.source].push(e.target);
  });

  const levels: string[][] = [];
  let current = nodes
    .filter((n) => inDegree[n.id] === 0)
    .map((n) => n.id);

  while (current.length > 0) {
    levels.push(current);
    const next: string[] = [];

    current.forEach((nodeId) => {
      adjacency[nodeId].forEach((neighbor) => {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) next.push(neighbor);
      });
    });

    current = next;
  }

  return levels;
}

export function getDependencies(
  nodeId: string,
  edges: Edge[]
): string[] {
  return edges
    .filter((e) => e.target === nodeId)
    .map((e) => e.source);
}