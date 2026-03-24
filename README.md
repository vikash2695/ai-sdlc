# ai-sdlc

Single-command installer for BMAD SDLC workspaces with BharatPe extension overlays.

## What it does

Running `npx ai-sdlc` will:

1. Install BMAD in silent/non-interactive mode.
2. Install BMAD core + BMAD SDLC module (`core,bmm`).
3. Keep all other BMAD inputs as defaults.
4. Apply BharatPe extension and Cursor command customizations on top.

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

- The installer intentionally suppresses BMAD CLI output for a quiet setup.
- If BMAD installation fails, rerun manually with:

```bash
npx -y bmad-method install --directory "<workspace>" --modules core,bmm -y
```
