# AI_LMS
## Requirement

#### `linux` (or wsl on windows) or `macos` (not tested).

`zig`

`go` 

`npm` / bun

## Usage

install build dependencies with
```bash
$ zig build install-deps
```
then build with
```bash
$ zig build
```
or to build with bun (npm is default)
```bash
$ zig build -Dbun
```
## Development

You can run: `npm run dev` in `js` directory to start development server (for frontend)

for backend see `go/server.go`
