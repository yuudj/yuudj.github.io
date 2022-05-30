---
title: Hello Blog
date: 2022-05-30 19:00:00 -300
categories: [github, docker,vscode]
tags: [github,jekill,website,docker,vscode, devcontainers,github-pages]
---

# Hola

Desde hace tiempo que quiero hacer un blog, pensé en varias opciones y me gusto mucho github-pages.

## GitHub-pages

GitHub-pages es una funcionalidad de GitHub que nos permite alojar un sitio web estático en GitHub en la url https://`username`.github.io . Para utilizarlo se debe crear un repositorio llamado `username.github.io` donde username es tu usuario de GitHub.

## Jekyll - Generador de sitio estático

Hacer el blog e HTML puro es algo tedioso. Así que voy a utilizar un generador de sitios estáticos llamado [Jekyll](http://jekyllrb.com/).

Para hacer mas fácil todo base todo el sitio en [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy) que tiene muchas características pre-instaladas como [mermaid-js](https://mermaid-js.github.io/) y Syntax Highlighting.

## Devcontainers

Jekyll esta desarrollado en Ruby, pero no tengo ganas de instalar todas la herramientas relacionadas con Ruby en mi pc de escitorio, notebook, pc del trabajo , etc. Así que [devcontainers](https://code.visualstudio.com/docs/remote/containers) es la mejor opción , ya que tengo docker/rancher instalado en todos lados.

![devcontainers](https://code.visualstudio.com/assets/docs/remote/containers/architecture-containers.png)

## Paso a paso

1. Inicializar el sitio con [**Chirpy Starter**](https://github.com/cotes2020/chirpy-starter/generate) en un repositorio llamado `username.github.io` 

2. Clonar el repositorio en forma local 

3. crear una carpeta llamada .devcontainer con dos archivos

`devcontainer.json`

```json
// For format details, see https://aka.ms/devcontainer.json. For config options, see the README at:
// https://github.com/microsoft/vscode-dev-containers/tree/v0.231.6/containers/ruby
{
    "name": "Jekyll",
    "build": {
        "dockerfile": "Dockerfile"
    },
    // Set *default* container specific settings.json values on container create.
    "settings": {},
    // Add the IDs of extensions you want installed when the container is created.
    "extensions": [
        "rebornix.Ruby"
    ],
    // Use 'forwardPorts' to make a list of ports inside the container available locally.
    "forwardPorts": [
        4000
    ],
    // Use 'postCreateCommand' to run commands after the container is created.
    // "postCreateCommand": "ruby --version",
    // Comment out to connect as root instead. More info: https://aka.ms/vscode-remote/containers/non-root.
    "remoteUser": "vscode"
}
```

`Dockerfile`

```docker
FROM debian:latest

# Avoid warnings by switching to noninteractive
ENV DEBIAN_FRONTEND=noninteractive

# This Dockerfile adds a non-root 'vscode' user with sudo access. However, for Linux,
# this user's GID/UID must match your local user UID/GID to avoid permission issues
# with bind mounts. Update USER_UID / USER_GID if yours is not 1000. See
# https://aka.ms/vscode-remote/containers/non-root-user for details.
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Configure apt and install packages
RUN apt-get update \
  && apt-get -y install --no-install-recommends apt-utils dialog 2>&1 \
  #
  # Install vim, git, process tools, lsb-release, and curl
  && apt-get install -y \
  git \
  curl \
  # NODEJS
  && curl -sL https://deb.nodesource.com/setup_16.x | bash - \
  && apt install -y nodejs netcat \
  #
  # Install ruby
  && apt-get install -y \
  make \
  build-essential \
  ruby \
  ruby-dev \
  #
  # Install jekyll
  && gem install \
  bundler \
  jekyll \
  #
  # Create a non-root user to use if preferred - see https://aka.ms/vscode-remote/containers/non-root-user.
  && groupadd --gid $USER_GID $USERNAME \
  && useradd -s /bin/bash --uid $USER_UID --gid $USER_GID -m $USERNAME \
  # [Optional] Add sudo support for the non-root user
  && apt-get install -y sudo \
  && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME\
  && chmod 0440 /etc/sudoers.d/$USERNAME \
  #
  # Clean up
  && apt-get autoremove -y \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/*

# Switch back to dialog for any ad-hoc use of apt-get
ENV DEBIAN_FRONTEND=dialog
```
