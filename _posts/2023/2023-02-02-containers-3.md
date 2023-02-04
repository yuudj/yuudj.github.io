---
title: Containers - PARTE 3 - Compilación
date: 2023-02-02 19:00:00 -300
published: false
is_series: true
series_title: "Contenedores"
categories: [ docker, containers]
tags: [docker,containers,images,dotnet,angular,nodejs]
mermaid: true
---

El objetivo de este post en particular es ahondar en el proceso de compilacion dentro de un contenedor. Utilizaremos dos ejemplos uno .NET  y otro en Angular.  En este post vamos omitir lenguajes interpretados como Python por que no tiene un proceso de compilacion.

{% include series.html%}

# CONCEPTOS 
Antes de adentrarnos en las minucias de la compilacion en Docker vamos repasar algunos conceptos basicos respecto a los lenguajes de compilacion moderno.

## RUNTIME / VIRTUAL MACHINE
Lenguajes modernos como .NET y JAVA tiene el concepto de maquina virutual. Es una capa de abstraccion que aisla a los desarrolladores de los detalles del entorno donde se ejecutara el programa. Esta abstraccion permite desarrollar programas que se ejecutan en multiples sistemas operativos sin necesitad de hacer una compilacion especifica.

Los lenguajes compilados que utilizan el concepto de RUNTIME o MAQUINA VIRTUAL convierten el codigo fuente en un lenguaje intermedio (IL en caso de .NET , Bytecode en caso de JAVA). Este elemento convertido o compilado a "lenguaje de maquina" por un programa llamado JUST IN TIME COMPILER o JIT en la primera ejecucion del programa. Esto es relevante en nuestro caso por que algo compilado en nuestra PC puede NO funcionar dentro del contenedor. Es importante compilar el programa DENTRO del contenedor.



## SDK
Cuando hablamos de **S**oftware **D**evelopment **K**it  nos referimos un set de programas o herramientas para desarrollar (...) es decir el comp 








