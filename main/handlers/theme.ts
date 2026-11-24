import { ipcMain, nativeTheme } from "@glaze/core/backend";

import { getPreferences, updatePreferences, type Preferences } from "../services/preferences.js";
import { isRecord } from "../services/util.js";
import type { ThemeInfo, ThemeMode, ThemeSource } from "../shared/types.js";

const THEME_SOURCES: readonly ThemeSource[] = ["system", "light", "dark"];
const THEME_MODES: readonly ThemeMode[] = ["adaptive", "light", "dark"];

function themeInfo(prefs: Preferences): ThemeInfo {
  return { themeId: prefs.themeId, themeSource: prefs.themeSource };
}

/**
 * `nativeTheme.themeSource` flips `prefers-color-scheme` in every window and the native
 * chrome (window material, menus). A theme that is always dark or light forces it; the
 * adaptive theme follows the Appearance setting.
 */
function applyNativeTheme(prefs: Preferences): void {
  nativeTheme.themeSource = prefs.themeMode === "adaptive" ? prefs.themeSource : prefs.themeMode;
}

export async function applySavedTheme(): Promise<void> {
  applyNativeTheme(await getPreferences());
}

export function registerThemeHandlers(): void {
  ipcMain.handle("theme:get", async () => themeInfo(await getPreferences()));

  /** `{ source }` sets Appearance; `{ themeId, mode }` picks a colour theme. Either or both. */
  ipcMain.handle("theme:set", async (_event, params: unknown) => {
    const source = isRecord(params) ? params.source : undefined;
    const themeId = isRecord(params) ? params.themeId : undefined;
    const mode = isRecord(params) ? params.mode : undefined;
    if (source !== undefined && !THEME_SOURCES.includes(source as ThemeSource)) {
      throw new Error('theme:set: "source" must be "system", "light", or "dark"');
    }
    if (
      themeId !== undefined &&
      (typeof themeId !== "string" || !/^[a-z0-9-]{1,40}$/.test(themeId))
    ) {
      throw new Error('theme:set: "themeId" must be a short lowercase id');
    }
    if (themeId !== undefined && !THEME_MODES.includes(mode as ThemeMode)) {
      throw new Error('theme:set: "mode" must be "adaptive", "light", or "dark"');
    }

    const prefs = await updatePreferences((draft) => {
      if (source !== undefined) draft.themeSource = source as ThemeSource;
      if (themeId !== undefined) {
        draft.themeId = themeId as string;
        draft.themeMode = mode as ThemeMode;
      }
    });
    applyNativeTheme(prefs);
    const info = themeInfo(prefs);
    ipcMain.broadcast("theme:changed", info);
    return info;
  });
}
