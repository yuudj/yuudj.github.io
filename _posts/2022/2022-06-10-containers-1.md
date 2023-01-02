---
title: Containers - PARTE 1 - Introducción
date: 2022-06-10 1:00:00 -300
is_series: true
series_title: "Containers"
categories: [ docker, containers]
tags: [github,docker,containers]
---

{% include series.html%}

## OBJETIVO

La tecnología de contenedores permite empaquetar,distribuir y ejecutar software con todo lo necesario para ejecutarse, incluso su sistema operativo.

Es una alternativa liviana a las maquinas virtuales dado que su nivel de abstracción no comienza desde el hardware sino que desde el sistema operativo.

![docker vs VM](/assets/img/container_vs_vm.png)

Suplementado con un orquestador como [Kubernetes](https://kubernetes.io) esta tecnología es realmente muy poderosa por que nos ayuda en TODAS las etapas del desarrollo de software.



Presentar conceptos y herramientas básicos de Docker, sentar bases para otras entradas dentro del blog.

## DOCKER

Docker es una **PLATAFORMA** que nos permite crear, instanciar y distribuir aplicaciones utilizando contenedores.

![docker PLATFORM](../..//assets/img/docker_suite.svg)

- `docker-host` | `Docker Engine` | `Docker` : Un servidor donde corre Docker encargado de
  - `docker run`: Instanciar contenedores
  - `docker pull`: Obtener del docker registry las imágenes necesarias para instanciar los contenedores y guardar una copia de forma local
  - `docker build`: Crear imágenes desde cero
  - `docker push`: publicar
- `docker-cli`: interface de linea de comandos de Docker. En pocas palabras lo que usamos para enviar comandos al Docker Engine
- `docker-registry`: Registro publico o privado de imágenes, sirve para distribuir nuestra aplicación empaquetada.

## DOCKER EN PC LOCAL

Cada uno de los componentes de Docker tiene una API estándar y abierta lo que hace es que tengamos varias implementaciones. En mi maquina local yo tengo dos opciones

- [Docker Desktop](https://docs.docker.com/get-docker/): Es la opcion por defecto que utiliza todo el mundo. Cuando lanzaron la opcion paga puso algunas cosas como que era obligatorio actualizarlo a la ultima version si estabas en la version gratuita y me pase a Rancher. Como aumentaron mucho las quejas terminaron sacando esas "molestias" de Docker Desktop

- [Rancher Desktop](https://rancherdesktop.io/): Es una alternativa a docker desktop.  PEEEERO para utilizar el docker CLI tiene que cambiar el `Container Runtime` a `dockerd(moby)` . La alternativa `containerd` usa nerdctl, que tiene exactamente los mismos argumentos que docker (y algunos mas) pero no integra bien con vscode :S y lso devcontainers (busquen que hice un post de esto).

![Rancher Deskto Config](https://docs.rancherdesktop.io/assets/images/intro-dda4d7e855cb21ce875e945c97fb7bd0.png)

**USUARIOS DE WINDOWS IMPORTANTE:** Van a necesitar habilitar en su Windows el [WSL](https://docs.microsoft.com/en-us/windows/wsl/install). Básicamente es un Kernel de Linux dentro de Windows. Esencialmente tanto Docker Desktop como Rancher Desktop interactúan con el Kernel de Linux.

<svg src="../../assets/img/rancher_desktop.svg" alt="Rancher Desktop ARQ" widht="500px">

## IMAGES

Una imagen es la pieza fundamental de toda la tecnología de contenedores. ¿No son lo contenedores?... nop. **Un contenedor es una instancia de una imagen**. Sin imagen no hay contenedor.

Una imagen es una colección ordenada de cambios en el sistema de archivos raíz y los parámetros de ejecución correspondientes para usar dentro de un tiempo de ejecución de contenedor. Una imagen normalmente la concatenación de sistemas de archivos en capas apilados uno encima del otro. [ver](https://docs.docker.com/glossary/#container-image).

## HANDS - ON

Hacemos una practica rapida con imagenes PRE EXISTENTES. ¿De donde salen las imagenes pre existentes que vamos a usar?  del hub.docker.com que es el registro de imagenes de cocker por defecto.

Creemos un contenedor a partir de la imagen correspondiente a la ultima version de NGINX `nginx:latest` (nginx es un servidor web liviano muy utlizado)

```bash
docker run --name soy-un-nginx -p 8180:80 -d nginx:latest
```

Vamos de atras para adelante

- `nginx:latest` es la imagen a utilizar `:latest` es un tag que indica USAR LA ULTIMA VERSION de NGINX
- `--name soy-un-nginx` especifica el nombre del contenedor creado basado en la imagen NGINX
- `-d` ejecutar el contenedor en modo datached. Es decir que el contenedor continua ejecutandose en background, aun que cerremos la ventana de consola.
- `-p 8080:80` esta opcion le dice a Docker que conecte el puerto 8180 del la PC host de Docker con el puerto 80 del contenedor. El puerto 80 es expuesto por la imagen de NGINX (por que es un servidor web y el puerto 80 es el puerto por defecto).

Verificamos que este corriendo con `docker ps` que lista todos los contenedores en ejecucion

```bash
$ docker ps
CONTAINER ID   IMAGE  ...         PORTS                                   NAMES
cfa9a43f7c70   nginx  ...         0.0.0.0:8180->80/tcp, :::8180->80/tcp   soy-un-nginx
```

POdemos tambien navegar a la url <http://localhost:8180>

![NGINX Welcome screeen](/assets/img/nginx_welcome.png)

Ahora nos toca hacer un poco de limpieza deteniendo y eliminado el contenedor utilizando CONTAINER ID

```bash
$ docker stop cfa9a43f7c70
$ docker rm cfa9a43f7c70
```

Emocionante? no? ... ok no vamos a ejecutar algo un poquito mas rimbombante. Grafana es un software de visualizacion que se conecta a bases de datos no relacionales como infludd, elasticsearch o prometheus. ¿No las conocen? ya las van a conocer

```bash
docker run  -p 3000:3000 -d --name=grafana grafana/grafana:lates
```

Nuevamente vamos de atras para adelante

- `grafana/grafana` es la imagen a utilizar tiene el prefijo `grafana/` que es un namespace, lo vamos a ver en el proximo post y `:latest` es un tag que indica USAR LA ULTIMA VERSION de NGINX
- `--name grafana` especifica el nombre del contenedor creado basado en la imagen
- `-d` ejecutar el contenedor en modo datached. Es decir que el contenedor continua ejecutandose en background, aun que cerremos la ventana de consola.
- `-p 3000:3000` esta opcion le dice a Docker que conecte el puerto 3000 del la PC host de Docker con el puerto 3000 del contenedor. El puerto 3000 es expuesto por la imagen de Grafana ¿como lo se? lees la documentacion en docker hub.

Ahora nuesto grafana esta expuesto en http://localhost:3000 y luego de loguarse con el usuario / password `admin` (si si tambien sale de la documentacion de grafana) y cambiar el password

TADAAAAA un sistema ejecutandose sin instalar nada.

![Grafana Welcome screeen](/assets/img/grafana_welcome.png)

PROXIMO PASO : IMAGENES
