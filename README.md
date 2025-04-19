# SpotHub Frontend

<p align="center">
  <a href="https://SpotHub.exchange">
      <img src="https://tokens-flack.netlify.app/images/symbol/spot.png" height="128">
  </a>
</p>

This project contains the main features of the SpotHub application.

If you want to contribute, please refer to the [contributing guidelines](./CONTRIBUTING.md) of this project.

## Documentation

- [Info](doc/Info.md)
- [Cypress tests](doc/Cypress.md)

> Install dependencies using [pnpm](https://pnpm.io)

## `apps/web`
<details>
<summary>
How to start
</summary>

```sh
pnpm i
```

start the development server
```sh
pnpm dev
```

build with production mode
```sh
pnpm build

# start the application after build
pnpm start
```
</details>

## `apps/aptos`
<details>
<summary>
How to start
</summary>

```sh
pnpm dev:aptos
```
```sh
pnpm build:aptos
```
</details>

## `apps/blog`
<details>
<summary>
How to start
</summary>

```sh
pnpm dev:blog
```
```sh
pnpm build:blog
```
</details>
