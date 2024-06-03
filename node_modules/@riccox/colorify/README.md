# @riccox/colorify

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/riccox/colorify-js/release-please.yml?branch=main)
![release](https://img.shields.io/github/v/release/riccox/colorify-js?display_name=release)
![stars](https://img.shields.io/github/stars/riccox/colorify-js)
![issues](https://img.shields.io/github/issues/riccox/colorify-js)
![last-commit](https://img.shields.io/github/last-commit/riccox/colorify-js)
![license](https://img.shields.io/github/license/riccox/colorify-js)

#### A type-safe, simple color tool javascript util lib

> [IMPORTANT] The main branch may be unstable or unavailable during development.
>
> Please use release instead of main branch to obtain a stable version app

## Demo

There is a live usage demo 👉 [colorify](https://codesandbox.io/s/riccox-colorify-rnysxv), deploy on Codesandbox.

## Usage

```sh
npm i @riccox/colorify --save
```

```typescript
import { singleColorPalette, foregroundColor } from '@riccox/colorify';

// returns a new hex color string array by given primary color.
console.log(singleColorPalette('#0f0',12))

// return a new hex color string (#000 or #FFF) by given background color.
console.log(foregroundColor('#0f0'))
```

## Development

```sh
git clone git@github.com:riccox/colorify-js.git

cd colorify-js

pnpm install
```
