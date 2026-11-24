import type { HarnessId, LibraryItem, MemoryType } from "@main/shared/types";

export type BadgeColor =
  | "primary"
  | "secondary"
  | "blue"
  | "green"
  | "yellow"
  | "orange"
  | "red"
  | "purple"
  | "magenta";

export interface HarnessStyle {
  name: string;
  badge: BadgeColor;
  /**
   * Data-visualization color for graph nodes, timeline bars, and sidebar dots: a Glaze
   * support-colour `var(--*)` so it follows the theme (see lib/themes.ts).
   */
  color: string;
}

export const HARNESS_ORDER: HarnessId[] = ["claude-code", "codex", "cursor", "opencode"];

export const HARNESS_STYLES: Record<HarnessId, HarnessStyle> = {
  "claude-code": { name: "Claude Code", badge: "orange", color: "var(--orange)" },
  codex: { name: "Codex", badge: "blue", color: "var(--blue)" },
  cursor: { name: "Cursor", badge: "purple", color: "var(--purple)" },
  opencode: { name: "opencode", badge: "green", color: "var(--green)" },
};

export const SHARED_STYLE: HarnessStyle = {
  name: "Shared",
  badge: "secondary",
  color: "var(--gray-9)",
};

export function isHarnessId(value: string): value is HarnessId {
  return (HARNESS_ORDER as string[]).includes(value);
}

export function itemHarnessStyle(item: LibraryItem): HarnessStyle {
  if (item.kind === "session") return HARNESS_STYLES[item.harness];
  return item.harnesses.length === 1 ? HARNESS_STYLES[item.harnesses[0]] : SHARED_STYLE;
}

/** Database-backed memories use virtual paths like `codex-memory:<id>` (a drive letter like `C:` doesn't match). */
export function isVirtualPath(target: string): boolean {
  return /^[a-z][a-z-]+:/i.test(target);
}

/** Mirrors the backend: only one-file-per-session harnesses and writable memory files can be trashed. */
export function canTrash(item: LibraryItem): boolean {
  if (item.kind === "memory") return item.editable && !isVirtualPath(item.path);
  return item.harness === "claude-code" || item.harness === "codex";
}

export const MEMORY_TYPE_LABELS: Record<MemoryType, string> = {
  instructions: "Instructions",
  memory: "Memory",
  rules: "Rules",
  generated: "Generated memory",
};
