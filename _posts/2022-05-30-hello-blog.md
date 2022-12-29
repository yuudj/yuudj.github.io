---
title: Hola Mundo
date: 2022-05-30 19:00:00 -300
categories: [github, docker,vscode]
tags: [github,jekill,website,docker,vscode, devcontainers,github-pages]
---
Bueno, primer post, esperemos que con el tiempo cada post salga mejor y con mejor calidad.

Para este blog utilice tres tecnologias

- Static Site Generator (Jekyll)
- Devcontainers
- GitHub-pages

## GitHub-page

GitHub-pages es una funcionalidad de GitHub que nos permite alojar un sitio web estático en GitHub en la url https://`username`.github.io . Para utilizarlo se debe crear un repositorio llamado `username.github.io` donde username es tu usuario de GitHub.

## Jekyll - Generador de sitio estático

Hacer el blog e HTML puro es algo tedioso. Así que voy a utilizar un generador de sitios estáticos llamado [Jekyll](http://jekyllrb.com/).

Para hacer mas fácil todo base todo el sitio en [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy) que tiene muchas características pre-instaladas como [mermaid-js](https://mermaid-js.github.io/) y Syntax Highlighting.

## Devcontainers

Jekyll esta desarrollado en Ruby, pero no tengo ganas de instalar todas la herramientas relacionadas con Ruby en mi pc de escitorio, notebook, pc del trabajo , etc. Así que [devcontainers](https://code.visualstudio.com/docs/remote/containers) es la mejor opción , ya que tengo docker/rancher instalado en todos lados.

![devcontainers](https://code.visualstudio.com/assets/docs/remote/containers/architecture-containers.png)
