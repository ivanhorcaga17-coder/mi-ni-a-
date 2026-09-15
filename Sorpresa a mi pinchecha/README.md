Sorpresa romántica — sitio web

Estructura del proyecto:

- web/
  - index.html
  - css/style.css
  - js/main.js
  - img/ (pon aquí tus carpetas e imágenes)
  - audio/audio.mp3 (pon aquí el audio con nombre exacto)

- docs/  <-- copia lista para GitHub Pages (contiene los mismos archivos que `web/`)

Instrucciones rápidas para publicar (Windows):

1) Instala Git: https://git-scm.com/download/win
   - Durante la instalación, selecciona "Git from the command line and also from 3rd-party software" para añadir Git al PATH.
   - Reinicia PowerShell y verifica `git --version`.

2) Crea un repositorio en GitHub: https://github.com/new
   - Nombre: por ejemplo `sorpresa-romantica`

3) Desde la carpeta del proyecto en PowerShell:

```powershell
cd "C:\Users\Usuario\Desktop\Sorpresa a mi pinchecha"
git init
git add .
git commit -m "Sorpresa romántica"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

4) Configurar GitHub Pages:
- Ve a GitHub → Settings → Pages
- Source: selecciona `main` branch y carpeta `/docs`
- Guarda y espera unos minutos; la URL será `https://TU_USUARIO.github.io/TU_REPO/`

5) Subir imágenes y audio:
- Coloca tus imágenes en `web/img/con-beibi/` y `web/img/juntos/` con nombres `1.jpg`, `2.jpg`, `3.jpg`.
- Coloca tu audio en `web/audio/audio.mp3`.
- Si usas GitHub Pages con `/docs`, copia esos archivos también en `docs/img/...` y `docs/audio/audio.mp3` o ejecuta los pasos de copia indicados abajo.

Copiar `web/` a `docs/` (si haces cambios posteriores):

```powershell
Remove-Item -Recurse docs\* -Force
Copy-Item -Path .\web\* -Destination .\docs\ -Recurse
git add docs
git commit -m "Update site (docs)"
git push
```

Si quieres que lo haga yo (preparar el repo y hacer push), dímelo y te guiaré sobre cómo darme acceso o cómo generar un token para usar desde aquí.
