# AI_LMS
## Requirements

#### `linux` (or wsl on windows) or `macos` (not tested).

`npm` / `bun` for front end

`go` for backend

`zig` as build system

`unoconv` and `poppler` for file conversion

## Usage

install the Requirements listed above. On Arch-Linux you can run
```bash
# sudo pacman --noconfirm -S go npm zig poppler unoconv
```

install build dependencies with
```bash
$ zig build install-deps
```
then build with
```bash
$ zig build
```

or to build with bun (npm is default) use
```bash
$ zig build install-deps -Dbun
$ zig build -Dbun
```
## Development

for backend development run `zig build -Ddev`

You can run: `npm run dev` in `js` directory to start development server (for frontend)

