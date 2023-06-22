---
title: ArgoCD + Azure Container Registry + OCI + HELM Charts
date: 2023-06-22 19:00:00 -300
published: true
categories: [ argocd, azure, helm, devOps]
tags: [ argocd, azure, helm,oci, devOps]
---

Azure Container Registry (ACR) soporta [OCI Artifacts](https://github.com/opencontainers/artifacts). De esta manera se pueden publicar en un Container Registry elementos que NO sea imágenes. En este caso Charts de Helm. Este método NO ES UN CHART REGISTRY, dado que no permite l istar los charts, solo almacena el Helm Chart empaquetado.

## Azure

Primero se crear un ACR  y  DOS tokens, uno con permisos de `push` y otro con permisos de `pull`

- Container registry: `mydevacr.azurecr.io`
- Usuario push: `azuredevosp`
- Usuario pull `argo-cd-home`


![AZURE-PORTAL-ACR-TOKENS](/assets/img/2023/ArgoCD-ACR-OCI/azure-portal-acr-tokens.png)

## AzureDevOps

### Variable Groups

En AzureDevops->Pipelines->Library se crea un Variable Group con tres variables

Variable Group: `az-acr-dev`
registryLogin: azuredevosp
registryName: mydevacr
registryPassword: `el password generado en Azure`

![AZURE-DEVOPS-VARIABLE-GROUP](/assets/img/2023/ArgoCD-ACR-OCI/azdevops-variable-group.png)

### PIPELINE

Definición del pipeline en el git repo del chart

- Se importa el variable group que inserta las variables en el definidas
- **IMPORTANTE:** El manejo de branch se puede mejorar usando trunk-based development
- Se debe definier la variable `HELM_EXPERIMENTAL_OCI=1` para que funcione (al momento de hacer este documento)
- Independientemente de la versión que figura en el chart el script pisa la versión con la autogenerada , esto se puede cambiar en los argumentos de `helm package`

```yaml
trigger:
- main

pool:
  vmImage: ubuntu-latest


variables:
  - group: az-acr-dev
  - name: HELM_EXPERIMENTAL_OCI
    value: 1
  - name: registryServerName
    value:  "$(registryName).azurecr.io"
  - name: projectName
    value:  "efunds"
  - name: helmChartVersion
    value:  1.0.'$(Build.BuildId)'
    # si usamos trunk base development el buils seria desde release/build y podemos usar algo como $(build.sourceBranchName)
    # determinar el numero de version tambien lo podemos hacer sacando datos del chart
    # el version bump del chart es algo que vamos a tener que ver ente todxs

stages:
- stage: build
  displayName: Build and Push
  jobs:
  - job: job_helm
    displayName: Helm Publish
    pool:
      vmImage: 'ubuntu-latest'
    steps:
    - task: HelmInstaller@1
      displayName: install helm
      inputs:
        helmVersionToInstall: 'latest'
    - task: HelmInstaller@1
      inputs:
        helmVersionToInstall: 'latest'
    - bash: |
        PACKAGE="$(helm package --app-version $(helmChartVersion)  --version $(helmChartVersion)  ./$(projectName) |  grep -o '/.*.tgz')"
        helm registry login $(registryServerName) --username $(registryLogin) -p $(registryPassword)
        helm push "${PACKAGE}" oci://$(registryServerName)/helm/
```

## ArgoCD

Para conectar ArgoCD con un repositorio OCI hace falta definirlo. Esto se logra con un Secret de k8

```yaml
kind: Secret
apiVersion: v1
metadata:
  name: mydevacr.azurecr.io/helm
  labels:
    argocd.argoproj.io/secret-type: repository
  annotations:
    managed-by: argocd.argoproj.io
stringData:
  enableOCI: true
  name: stable
  password: <<el password generado en ACR>>
  type: helm
  url: mydevacr.azurecr.io/helm
  username: argo-cd-home
```

También se puede generar con el ArgoCD CLI

```bash
# Hace login en el server, en este caso se encuentra integrado con OS por eso el argumento --sso
argocd login argocd-lab-server-fci-lab.apps-crc.testing --sso
# Genera el secret con los valores indicados
argocd repo add mydevacr.azurecr.io/helm --type helm --name stable --enable-oci --username argo-cd-home --password <<el password>>
```

Si la generación es exitosa se puede ver en ArgoCD->Settings->Repositories. Desde esta opción se puede disparar la generación de la aplicación (esta bueno por uqe ya completa todos parámetros de conexión a Helm)

![ARGOCD-SETTINGS.REPOSITORIES](/assets/img/2023/ArgoCD-ACR-OCI/argocd-helm-repo.png)

Finalmente se genera la aplicación de ArgoCD

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myapp
spec:
  destination:
    name: ''
    namespace: dev
    server: 'https://kubernetes.default.svc'
  source:
    path: ''
    repoURL: mydevacr.azurecr.io/helm
    targetRevision: 1.0.269
    chart: myapp-chart
  project: default
  syncPolicy:
    automated:
      prune: false
      selfHeal: false
  helm:
      valueFiles:
        - values.yaml
```