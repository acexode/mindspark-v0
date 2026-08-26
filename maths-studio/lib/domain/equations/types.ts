export type EquationOperation = "subtract-five" | "add-five" | "divide-three";

export interface EquationState {
  left: string;
  right: string;
  step: number;
  solved: boolean;
}

export const INITIAL_EQUATION: EquationState = {
  left: "3x + 5",
  right: "20",
  step: 0,
  solved: false,
};

export const EQUATION_STEPS = [
  { left: "3x + 5", right: "20", label: "Starting equation" },
  { left: "3x + 5 − 5", right: "20 − 5", label: "Subtract 5 from both sides", operation: "subtract-five" as const },
  { left: "3x", right: "15", label: "Simplify both sides" },
  { left: "3x/3", right: "15/3", label: "Divide both sides by 3", operation: "divide-three" as const },
  { left: "x", right: "5", label: "Solution", solved: true },
];
