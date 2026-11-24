<div align="center">
  <!-- Logo: replace with the final artwork, e.g. docs/assets/wefty-logo.png -->
  <!-- <img width="160" height="160" alt="Wefty logo" src="docs/assets/wefty-logo.png" /> -->
  <h1>Wefty</h1>
  <p>See and edit the memory and sessions your coding agents already have,<br />and when one agent stops, let another pick the work up.</p>

  [![platform](https://img.shields.io/badge/platform-macOS-000000?logo=apple&logoColor=white)](#getting-started)
  [![built with Glaze](https://img.shields.io/badge/built%20with-Glaze-6366f1)](https://glaze.app)
  [![TypeScript](https://img.shields.io/badge/TypeScript-React%2019-3178c6?logo=typescript&logoColor=white)](#stack)
  [![local-first](https://img.shields.io/badge/data-local--only-22c55e)](#privacy)
  [![GitHub stars](https://img.shields.io/github/stars/CodeStrate/Wefty?style=flat&color=yellow)](https://github.com/CodeStrate/Wefty/stargazers)
</div>

---

Wefty does three things:

1. **It shows you what your agents already know.** Claude Code, Codex, Cursor, and opencode keep session transcripts, memory files, and project context on disk. Wefty puts them in one place, where you can read every session, edit any memory, and see on a graph which sessions touched which memories. Browse everything on a timeline or as a searchable list.
2. **It keeps your work moving when an agent can't.** Hit a usage limit, or the provider is down? Open the session in Wefty and continue it in another agent. The handoff is built from the transcript that's already on disk. Nothing to prepare in your project, no `HANDOFF.md` to keep up to date, no work-in-progress commit.
3. **It keeps everything in one window.** Wefty has a built-in terminal (the same stack VS Code uses: node-pty + xterm.js), so you don't need a terminal open next to it. Open the terminal pane, resume or hand off a session, and keep vibing.

It isn't an agent and it isn't a sync service. It reads and writes **your local files**, runs your shell in its terminal, and does nothing else.

> **Alpha.** Cursor and opencode support is untested. Expect rough edges, and [issues](https://github.com/CodeStrate/Wefty-Glaze/issues) are very welcome.

This is the macOS edition of Wefty, built on [Glaze](https://glaze.app). The main app lives at [CodeStrate/Wefty](https://github.com/CodeStrate/Wefty).

[Features](#features) · [Harnesses](#supported-harnesses) · [Getting Started](#getting-started) · [How It Works](#how-it-works) · [Privacy](#privacy) · [Stack](#stack) · [Development](#development) · [Contributing](#contributing) · [Roadmap](#roadmap)

## When Your Agent Stops Mid-Task

You're deep in a session and Claude Code hits its usage limit, or the provider has an outage. Normally you'd write up where you were, commit something half-done, and re-explain it all to the next agent.

With Wefty:

1. Open the session (it's already in the library, since Wefty watches the agents' folders).
2. **⋯ → Continue in Codex** (or Claude Code, the other way round).
3. Wefty builds a Markdown handoff from the transcript (the original goal, open threads, the last turns, files touched, related memories), saves it in its own data folder, and starts the other agent in your project with *"Read this handoff and continue."*

Your repository is never touched: no handoff file, no commit, no branch. The same works for any session, not just interrupted ones: copy the handoff, or drop its path into any agent's prompt.

## vs Each Harness's Own History

Every harness can already list and resume its own sessions. Wefty is for the work that spans them, across projects and across agents.

| | Harness CLI (`claude --resume`, `codex resume`, …) | Wefty |
|---|---|---|
| Browse sessions | One harness, one project at a time | All enabled harnesses and projects together |
| See work over time | No | Timeline: one lane per project |
| See what links to what | No | Graph: memories, the sessions that read or wrote them, and links between memories |
| Search transcripts | Varies | Across titles, prompts, paths, and projects; plus search inside a transcript |
| Edit memory and context files | By hand | Built-in editor with preview |
| Resume a session | Yes, in that harness | Yes, in a built-in terminal, in the session's own folder |
| Continue in a *different* harness | No | Yes, one click, built from the transcript (Claude Code ↔ Codex) |
| Prepare for a handoff | Write notes or commit WIP yourself | Nothing. The transcript on disk is enough |

## Features

| Feature | Description |
|---|---|
| Timeline | One lane per project, newest activity on top. Sessions are bars from first to last message, memories are diamonds at their last edit. Hover lights up related items; pan, and zoom with a floor so items never shrink to dots |
| Graph | Projects as hubs with their sessions and memories; dashed links for references and for sessions that touched a memory. Drag to untangle; drag a node past the edge to carry it |
| List | Everything grouped by date, with a context menu per row |
| Search | Filters the list, fades non-matches in the timeline and graph, and snaps the view to what it found |
| Transcript reader | Grouped tool calls, search inside the conversation, hide tools, newest-first, copy any message |
| Memory editor | Preview / edit with ⌘S; the title shows "(edited)" until you save; follows links between memory files |
| Terminal | Tabbed login shells in a side panel, titled by shell and folder (`zsh - my-project`). Resume Claude Code, Codex, and opencode sessions in their own folder |
| Handoff | A no-AI Markdown brief of a session: goal, open threads, last turns, files touched, related memories. Copy it, insert its path in the terminal, or **Continue in Claude Code / Codex** |
| Drag and drop | Drag rows, timeline bars, or graph nodes onto the terminal to type a path or resume command (nothing runs until Enter). Drop session or memory files from Finder to open them |
| Themes | Wefty (translucent, follows Light/Dark, uses your system accent), Graphite, Midnight, Nord, Dracula, Solarized Dark, Paper, and GitHub Light. Each recolours the whole app, terminal palette and harness colours included |
| Settings | Theme gallery, Light/Dark/Auto, which harnesses are scanned, and hidden projects. Open it from the gear in the sidebar or ⌘, |
| Library management | Rename or hide projects; move sessions, memory files, or a project's agent data to the Trash (always confirmed) |
| Tour and Help | A guided tour on first launch that walks through every view, and a Help page (⌘?) |

## Supported Harnesses

| Harness | Sessions | Memories / context | Status |
|---|---|---|---|
| Claude Code (default) | `~/.claude/projects/*/*.jsonl` | `CLAUDE.md`, `CLAUDE.local.md`, `.claude/CLAUDE.md`, project `memory/*.md` | Tested |
| Codex CLI | `~/.codex/sessions/**/rollout-*.jsonl` | `AGENTS.md`, generated memories | Sessions tested; DB memories untested |
| Cursor | `state.vscdb` composer history | `.cursorrules`, `.cursor/rules`, `AGENTS.md` | Untested |
| opencode | `~/.local/share/opencode/storage` | `AGENTS.md` | Untested |

Only Claude Code is scanned by default. Add others from the **+** next to *Harnesses* in the sidebar, or in Settings. Reports from Cursor and opencode users are very welcome.

## Getting Started

**Requires macOS and [Glaze](https://glaze.app).**

```bash
git clone https://github.com/CodeStrate/Wefty-Glaze
cd Wefty-Glaze
sh ./glaze-node.sh --npm install --include=dev
npm run build
```

Then open the project in Glaze and launch it. The tour starts on first launch; replay it any time from **Help → Show Tour**.

## How It Works

### Architecture

- **Backend** (Node, `main/`) - scans harness folders, watches them, runs PTYs, and answers IPC. Handlers are thin and validate every parameter; logic lives in `main/services/`.
- **Renderer** (React, `renderer/`) - screens use `@glaze/core` components and talk to the backend only over Glaze IPC (`window.glazeAPI.glaze.ipc`, JSON-RPC). It imports only types from `main/`.

### Scanning

Each harness has its own reader (`main/services/harnesses/*`) that turns what's on disk into one data contract: sessions (`"<harness>:<nativeId>"`), memories (`"mem:<path>"`), and projects (by working folder). Only enabled harnesses are scanned and watched; the library rebuilds when agents write new files. SQLite stores (Cursor, Codex memories) are read through the `sqlite3` CLI in read-only mode, so there's no native database module.

Claude Code encodes a project's path into its folder name lossily (`/`, `.`, and `_` all become `-`), so Wefty walks the filesystem to recover the real path.

### Terminal

Each tab is a login shell (`$SHELL`) in a PTY ([`node-pty`](https://github.com/microsoft/node-pty)) on the backend, rendered with [xterm.js](https://xtermjs.org). Output is batched over IPC and replayed when a tab remounts, so switching tabs or hiding the panel keeps scrollback. The terminal follows the active theme's palette live.

xterm.js was chosen over WASM renderers such as [ghostty-web](https://github.com/coder/ghostty-web): the Glaze WebView's security policy blocks WebAssembly compilation (`unsafe-eval`).

### Resume

| Harness | Command, run in the session's folder |
|---|---|
| Claude Code | `claude --resume <id>` |
| Codex | `codex resume <id>` |
| opencode | `opencode --session <id>` |
| Cursor | No CLI resume; opens a terminal in the folder |

### Handoff

`main/services/handoff.ts` turns a transcript into a short Markdown brief: the first request, lines from the last turns that read like unfinished work, the last 12 turns, files touched, and related memory files. It's written to the app's data folder (`handoffs/<session>.md`), so any agent can be pointed at it by path. **Continue in Claude Code / Codex** opens a terminal in the project and starts that CLI with *"Read <handoff> and continue the work it describes."*

### Themes

Glaze derives every colour from a few seed variables (`--bg`, `--fg`, the accent, and the support colours). The default Wefty theme keeps Glaze's own seeds over the macOS window material and follows Light/Dark; presets (`renderer/lib/themes.ts`) override the seeds and bring a 16-colour terminal palette. Harness colours use the support colours, so they follow the theme too. A theme that is always dark or light also switches the native appearance (menus, window chrome). The choice is saved in Wefty's preferences and applied to every window.

## Privacy

Wefty never sends your data anywhere. Everything is read from and written to local files. It only writes inside an agent's folders when you ask it to: saving a memory you edited, or moving something to the Trash after a confirmation.

## Stack

- TypeScript, Node.js ≥ 24 backend, React 19 + Vite + Tailwind 4 renderer, JSON-RPC IPC
- [Glaze](https://glaze.app) app shell and `@glaze/core` components
- [TanStack Router](https://tanstack.com/router) (URL search-param state) + [TanStack Query](https://tanstack.com/query) (all IPC reads and mutations)
- [`node-pty`](https://github.com/microsoft/node-pty) + [`@xterm/xterm`](https://xtermjs.org) - terminal
- [`d3-force`](https://d3js.org/d3-force) - graph layout
- `lucide-react` - icons

## Development

```bash
npm run build        # backend + renderer
npm run type-check
npm run lint
npm run format
```

These run through `glaze-node.sh`, which uses Glaze's managed Node runtime, so **Glaze must be installed**.

- Logs: `~/Library/Logs/app.glaze.macos.2kx8bm18-local/`
- App data (preferences, handoffs): `~/Library/Application Support/app.glaze.macos.2kx8bm18-local/`

### Project layout

```
main/                    Node backend
  index.ts                 windows, menu, lifecycle
  windows/                 settings window, paths
  handlers/                thin, validated IPC handlers (library, terminal, theme)
  services/harnesses/      one reader per harness
  services/library.ts      snapshot builder, watching, trash
  services/terminal.ts     PTY sessions
  services/handoff.ts      Markdown handoff builder
  services/preferences.ts  harnesses, project names, hidden projects, theme
  services/platform.ts     paths and shells
  shared/types.ts          data contract shared with the renderer
renderer/                React UI
  components/              sidebar, timeline, graph, list, inspector, terminal, help
  lib/                     data hooks, scopes, search, themes, terminal state, drag
  settings/                the Settings window
```

## Contributing

PRs welcome. A few guidelines:

- **One concern per PR** - keep diffs reviewable
- Open an issue first for anything beyond a bug fix or small improvement
- Keep `main/services/harnesses/*`, `memory-files.ts`, `util.ts`, `platform.ts`, `handoff.ts`, `terminal.ts`, and `shared/types.ts` free of `@glaze/*` imports, so the planned MCP server can reuse them as plain Node
- The renderer imports only **types** from `main/`; values come over IPC
- Anything that writes into an agent's folders must be an explicit, confirmed user action
- New harness readers: include a sample of the on-disk format (with personal content removed) in the PR

Bug reports: open an issue with the harness, what you did, and what you expected. Logs are in `~/Library/Logs/app.glaze.macos.2kx8bm18-local/`.

## Roadmap

- **Resume in another folder** - copy a Claude Code session into a different project and resume it there (confirmed write)
- **Summary engines** - optional AI summaries for handoffs via `claude -p` / `codex exec`
- **MCP server** - a stdio server so agents can search and read your library on demand (`search_context`, `get_handoff`, `read_memory`, …), with one-click install into harness configs
- **Live terminal titles** - follow `cd` via the shell's title/OSC 7 sequences
- **Native v2** - a Rust build with an Alacritty-backed terminal
- **Web app sessions (opt-in)** - bring in your chats, projects, and memories from Claude, ChatGPT, Gemini, and other web apps, so they sit in the same library as your coding sessions
