/**
 * Colour themes. "Wefty" is the default: Glaze's own seeds over the translucent macOS
 * material, following Light/Dark and the system accent. The presets are Glaze `Theme` seed
 * overrides that are always dark or light, and each brings its own terminal palette.
 *
 * The choice lives in Wefty's preferences (`theme:get` / `theme:set`, broadcast as
 * `theme:changed`). It is mirrored in localStorage only so a window can paint in the right
 * colours before IPC answers.
 */
import { useEffect } from "react";
import type { ITheme } from "@xterm/xterm";
import {
  applySystemAccentColor,
  clearActiveTheme,
  injectActiveTheme,
  type Theme,
} from "@glaze/core/components";

import type { ThemeInfo, ThemeMode } from "@main/shared/types";

/** A terminal palette with the ANSI colours the harness tints are taken from. */
type Palette = ITheme &
  Required<Pick<ITheme, "red" | "green" | "yellow" | "blue" | "magenta" | "brightMagenta">>;

export interface ThemePreset {
  id: string;
  name: string;
  mode: ThemeMode;
  /** Glaze seed overrides; null keeps Glaze's default light and dark seeds. */
  theme: Theme | null;
  /** Light and dark terminal palettes for the adaptive theme; one palette otherwise. */
  terminal: ITheme | { light: ITheme; dark: ITheme };
}

const WEFTY_TERMINAL_DARK: ITheme = {
  background: "#0e0e10",
  foreground: "#e4e4e7",
  cursor: "#e4e4e7",
  cursorAccent: "#0e0e10",
  selectionBackground: "#3a4a6b",
};

const WEFTY_TERMINAL_LIGHT: ITheme = {
  background: "#f7f7f8",
  foreground: "#1f1f22",
  cursor: "#1f1f22",
  cursorAccent: "#f7f7f8",
  selectionBackground: "#b9d0ff",
};

/** Midpoint of two `#rrggbb` colours. */
function mix(a: string, b: string): string {
  const channel = (hex: string, index: number) =>
    parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16);
  return `#${[0, 1, 2]
    .map((index) =>
      Math.round((channel(a, index) + channel(b, index)) / 2)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/**
 * A fixed-appearance preset. Support colours (badges, status text, harness colours) come
 * from the terminal palette, so the whole app matches it.
 */
function preset(
  id: string,
  name: string,
  appearance: "light" | "dark",
  seeds: { background: string; backgroundSecondary: string; foreground: string; accent: string },
  terminal: Palette,
): ThemePreset {
  return {
    id,
    name,
    mode: appearance,
    terminal,
    theme: {
      id,
      name,
      appearance,
      ...seeds,
      selection: seeds.accent,
      loader: seeds.accent,
      red: terminal.red,
      orange: mix(terminal.red, terminal.yellow),
      yellow: terminal.yellow,
      green: terminal.green,
      blue: terminal.blue,
      purple: terminal.magenta,
      magenta: terminal.brightMagenta,
    },
  };
}

// Light seeds are pushed past the intended colour: Glaze composites the window background
// over the native material, which washes light colours out.
export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "wefty",
    name: "Wefty",
    mode: "adaptive",
    theme: null,
    terminal: { light: WEFTY_TERMINAL_LIGHT, dark: WEFTY_TERMINAL_DARK },
  },
  preset(
    "graphite",
    "Graphite",
    "dark",
    {
      background: "#161618",
      backgroundSecondary: "#121214",
      foreground: "#ececf0",
      accent: "#8b95ff",
    },
    {
      background: "#121214",
      foreground: "#e4e4e8",
      cursor: "#8b95ff",
      cursorAccent: "#121214",
      selectionBackground: "#33365a",
      black: "#1f1f23",
      red: "#f2777a",
      green: "#99cc99",
      yellow: "#ffcc66",
      blue: "#8b95ff",
      magenta: "#cc99cc",
      cyan: "#66cccc",
      white: "#d4d4d8",
      brightBlack: "#5c5c66",
      brightRed: "#ff8e90",
      brightGreen: "#b5e0b5",
      brightYellow: "#ffd98a",
      brightBlue: "#a8b0ff",
      brightMagenta: "#dcb3dc",
      brightCyan: "#8ee0e0",
      brightWhite: "#f4f4f5",
    },
  ),
  preset(
    "midnight",
    "Midnight",
    "dark",
    {
      background: "#0d1219",
      backgroundSecondary: "#0a0e14",
      foreground: "#d6deeb",
      accent: "#5ccfe6",
    },
    {
      background: "#0a0e14",
      foreground: "#b3b1ad",
      cursor: "#e6b450",
      cursorAccent: "#0a0e14",
      selectionBackground: "#273747",
      black: "#01060e",
      red: "#ea6c73",
      green: "#91b362",
      yellow: "#f9af4f",
      blue: "#53bdfa",
      magenta: "#fae994",
      cyan: "#90e1c6",
      white: "#c7c7c7",
      brightBlack: "#686868",
      brightRed: "#f07178",
      brightGreen: "#c2d94c",
      brightYellow: "#ffb454",
      brightBlue: "#59c2ff",
      brightMagenta: "#ffee99",
      brightCyan: "#95e6cb",
      brightWhite: "#ffffff",
    },
  ),
  preset(
    "nord",
    "Nord",
    "dark",
    {
      background: "#2e3440",
      backgroundSecondary: "#2b303b",
      foreground: "#e5e9f0",
      accent: "#88c0d0",
    },
    {
      background: "#2b303b",
      foreground: "#d8dee9",
      cursor: "#d8dee9",
      cursorAccent: "#2b303b",
      selectionBackground: "#434c5e",
      black: "#3b4252",
      red: "#bf616a",
      green: "#a3be8c",
      yellow: "#ebcb8b",
      blue: "#81a1c1",
      magenta: "#b48ead",
      cyan: "#88c0d0",
      white: "#e5e9f0",
      brightBlack: "#4c566a",
      brightRed: "#bf616a",
      brightGreen: "#a3be8c",
      brightYellow: "#ebcb8b",
      brightBlue: "#81a1c1",
      brightMagenta: "#b48ead",
      brightCyan: "#8fbcbb",
      brightWhite: "#eceff4",
    },
  ),
  preset(
    "dracula",
    "Dracula",
    "dark",
    {
      background: "#282a36",
      backgroundSecondary: "#21222c",
      foreground: "#f8f8f2",
      accent: "#bd93f9",
    },
    {
      background: "#21222c",
      foreground: "#f8f8f2",
      cursor: "#f8f8f2",
      cursorAccent: "#21222c",
      selectionBackground: "#44475a",
      black: "#21222c",
      red: "#ff5555",
      green: "#50fa7b",
      yellow: "#f1fa8c",
      blue: "#bd93f9",
      magenta: "#ff79c6",
      cyan: "#8be9fd",
      white: "#f8f8f2",
      brightBlack: "#6272a4",
      brightRed: "#ff6e6e",
      brightGreen: "#69ff94",
      brightYellow: "#ffffa5",
      brightBlue: "#d6acff",
      brightMagenta: "#ff92df",
      brightCyan: "#a4ffff",
      brightWhite: "#ffffff",
    },
  ),
  preset(
    "solarized-dark",
    "Solarized Dark",
    "dark",
    {
      background: "#002b36",
      backgroundSecondary: "#00232c",
      foreground: "#93a1a1",
      accent: "#268bd2",
    },
    {
      background: "#00232c",
      foreground: "#93a1a1",
      cursor: "#93a1a1",
      cursorAccent: "#00232c",
      selectionBackground: "#0a4a5a",
      black: "#073642",
      red: "#dc322f",
      green: "#859900",
      yellow: "#b58900",
      blue: "#268bd2",
      magenta: "#d33682",
      cyan: "#2aa198",
      white: "#eee8d5",
      brightBlack: "#586e75",
      brightRed: "#cb4b16",
      brightGreen: "#93a1a1",
      brightYellow: "#839496",
      brightBlue: "#839496",
      brightMagenta: "#6c71c4",
      brightCyan: "#93a1a1",
      brightWhite: "#fdf6e3",
    },
  ),
  preset(
    "paper",
    "Paper",
    "light",
    {
      background: "#f7e6c1",
      backgroundSecondary: "#efd8a8",
      foreground: "#292524",
      accent: "#c2410c",
    },
    {
      background: "#f4f1ea",
      foreground: "#292524",
      cursor: "#c2410c",
      cursorAccent: "#f4f1ea",
      selectionBackground: "#e7d8c3",
      black: "#292524",
      red: "#b91c1c",
      green: "#4d7c0f",
      yellow: "#a16207",
      blue: "#1d4ed8",
      magenta: "#a21caf",
      cyan: "#0e7490",
      white: "#d6d3d1",
      brightBlack: "#78716c",
      brightRed: "#dc2626",
      brightGreen: "#65a30d",
      brightYellow: "#ca8a04",
      brightBlue: "#2563eb",
      brightMagenta: "#c026d3",
      brightCyan: "#0891b2",
      brightWhite: "#f5f5f4",
    },
  ),
  preset(
    "github-light",
    "GitHub Light",
    "light",
    {
      background: "#ffffff",
      backgroundSecondary: "#e6eef7",
      foreground: "#1f2328",
      accent: "#0969da",
    },
    {
      background: "#f6f8fa",
      foreground: "#1f2328",
      cursor: "#0969da",
      cursorAccent: "#f6f8fa",
      selectionBackground: "#c8e1ff",
      black: "#24292f",
      red: "#cf222e",
      green: "#116329",
      yellow: "#4d2d00",
      blue: "#0969da",
      magenta: "#8250df",
      cyan: "#1b7c83",
      white: "#6e7781",
      brightBlack: "#57606a",
      brightRed: "#a40e26",
      brightGreen: "#1a7f37",
      brightYellow: "#633c01",
      brightBlue: "#218bff",
      brightMagenta: "#a475f9",
      brightCyan: "#3192aa",
      brightWhite: "#8c959f",
    },
  ),
];

export function findTheme(id: string | null | undefined): ThemePreset {
  return THEME_PRESETS.find((candidate) => candidate.id === id) ?? THEME_PRESETS[0];
}

export function terminalPalette(theme: ThemePreset, dark: boolean): ITheme {
  const palette = theme.terminal;
  return "light" in palette && "dark" in palette ? (dark ? palette.dark : palette.light) : palette;
}

// --- Runtime: the active theme in this window, observable by terminals and the graph ---

const CACHE_KEY = "wefty.themeId";
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

let activeTheme: ThemePreset = THEME_PRESETS[0];
let systemAccent: string | null = null;
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

/** Whether this window currently shows dark colours. */
export function isDark(): boolean {
  return activeTheme.mode === "adaptive" ? darkQuery.matches : activeTheme.mode === "dark";
}

export function activeThemeId(): string {
  return activeTheme.id;
}

/** Applies a theme to this window and notifies subscribers. */
export function applyTheme(themeId: string | null | undefined): void {
  activeTheme = findTheme(themeId);
  try {
    window.localStorage.setItem(CACHE_KEY, activeTheme.id);
  } catch {
    // Private storage off: the theme still arrives over IPC.
  }
  if (activeTheme.theme) {
    injectActiveTheme(activeTheme.theme);
    // Glaze lets the system accent win over a theme's accent; presets keep their own.
    applySystemAccentColor(null);
  } else {
    clearActiveTheme();
    document.documentElement.classList.toggle("dark", darkQuery.matches);
    applySystemAccentColor(systemAccent);
  }
  notify();
}

/** Pre-paint: the last theme this app used, before IPC is up. */
export function applyCachedTheme(): void {
  let cached: string | null = null;
  try {
    cached = window.localStorage.getItem(CACHE_KEY);
  } catch {
    // Fall back to the default theme.
  }
  applyTheme(cached);
}

export function currentTerminalTheme(): ITheme {
  return terminalPalette(activeTheme, isDark());
}

/** Called whenever the theme (or light/dark) changes. Returns an unsubscribe function. */
export function onThemeChange(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Keeps this window on the saved theme, Light/Dark, and the system accent. Used instead of
 * Glaze's useTheme, which would put the system accent over a preset's own accent.
 */
export function useAppTheme(): void {
  useEffect(() => {
    const ipc = window.glazeAPI.glaze.ipc;

    const handleScheme = () => {
      if (activeTheme.mode === "adaptive") {
        document.documentElement.classList.toggle("dark", darkQuery.matches);
      }
      notify();
    };
    const setAccent = (accent: string | null) => {
      systemAccent = accent;
      if (!activeTheme.theme) applySystemAccentColor(accent);
    };

    darkQuery.addEventListener("change", handleScheme);
    void ipc
      .invoke<ThemeInfo>("theme:get")
      .then((info) => applyTheme(info.themeId))
      .catch(() => undefined);
    void window.glazeAPI.nativeTheme
      .getInfo()
      .then((info) => setAccent(info.accentColor ?? null))
      .catch(() => undefined);
    const offTheme = ipc.onNotification("theme:changed", (params) =>
      applyTheme((params as ThemeInfo | undefined)?.themeId),
    );
    const offNative = ipc.onNotification("nativeTheme:updated", (params) =>
      setAccent((params as { accentColor?: string } | undefined)?.accentColor ?? null),
    );

    return () => {
      darkQuery.removeEventListener("change", handleScheme);
      offTheme();
      offNative();
    };
  }, []);
}
