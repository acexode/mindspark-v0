export interface DraftingResultData {
  dxf: string;
  svg: string;
  summary: { entities: number; layers: string[]; byType: Record<string, number> };
  commands: { what: string; keys: string[] }[];
  warnings: string[];
}

export interface DraftingResponse {
  ok: boolean;
  script?: string;
  result?: DraftingResultData;
  source?: string;
  attempts?: number;
  error?: string;
  stage?: string;
  line?: number | null;
}

export type DraftingTab = "describe" | "room" | "traverse";
