# ai-sdlc

Single-command installer for BMAD SDLC workspaces with BharatPe extension overlays.

## What it does

Running `npx ai-sdlc` will:

1. Install BMAD in normal output mode (non-interactive defaults).
2. Install BMAD `6.2.0` core + BMAD SDLC module (`core,bmm`).
3. Keep all other BMAD inputs as defaults.
4. Apply BharatPe extension and Cursor command customizations on top.
5. Validate `_bmad/_config/manifest.yaml` contains both `core` and `bmm`.

## Usage

```bash
npx ai-sdlc
```

Optional target directory:

```bash
npx ai-sdlc --directory /path/to/workspace
```

## Installed customizations

- `bmad/extensions/bharatpe/*`
- `.cursor/commands/bp-*.md`

## Notes

- BMAD installer output is shown so setup steps are visible while debugging.
- If BMAD installation fails, rerun manually with:

```bash
npx -y bmad-method@6.2.0 install --directory "<workspace>" --modules core,bmm -y
```
