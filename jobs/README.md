#Jobs index

This folder contains several scripts that use NodeJS + Request + Cherrio in order to parse data from Government page in order to pull out peformance from public servants. Government page is public and so is the information. Our intent is to provide a better interface for population.


##Importar detalles geograficos
1. Script: import-states.js
Este script lee los archivos del folder data (ife, inegi y states-circ.csv) y genera los datos de las tablas States y Municipalities.

  ```
  node jobs/import-states.js
  ```

## Importar diputados
1. Scrape diputados
Este script lee la informacion del portal de [Camara de Diputados](http://sitl.diputados.gob.mx/LXIII_leg/curricula.php?dipt=1) y vacia la informacion en la tabla Deputies.

  ```
  node jobs/scrape-deputies.js from=<deputyId> to<deputyId>
  ```

El script recive dos parametros(from y  to) para indicar que diputados deben ser procesados. Se recomienda ejecutarlo en grupos de 100, desde 1 a 1002.

## Importar Asistencias
1. Scrape attendance
Este script lee la lista de asistencia del portal de [Camara de diputados](http://sitl.diputados.gob.mx/LXIII_leg/asistencias_diputados_xperiodonplxiii.php?dipt=1)

  ```
  node jobs/scrape-attendance.js from=<deputyId> to<deputyId>
  ```

El script recive dos parametros(from y  to) para indicar que diputados deben ser procesados. Se recomienda ejecutarlo en grupos de 100, desde 1 a 1002.


## Importar detalles de contacto
Se importan los detalles de twitter de dos fuentes:
1. SinVotoNoHayDinero

  ```
  node jobs/scrape-deputy-details.js
  ```

Este script importa los datos de los diputados registrados por el equipoo de sin voto no hay dinero.

2. Descromprimir los links de redes sociales

  ```
  node jobs/scrape-deputy-details-twitter.js
  ```

  Este script lee por batch de 50 diputados, y lee el contenido del link corto de google para tomar el handle de twitter del diputado.

3. 3de3
Tomamos la informacion sobre los diputados de 3de3 y comparamos con la informacion anterior sustituyedo aquellos handles de twitter que no tenemos en base de datos.

  ```
  node jobs/scrape-3d3.js
  ```
  
