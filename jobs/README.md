#Jobs index

This folder contains several scripts that use NodeJS + Request + Cherrio in order to parse data from Government page in order to pull out peformance from public servants. Government page is public and so is the information. Our intent is to provide a better interface for population. 


## Importing diputados
1. Scrape diputados
This script read thru list of diputados and import main information. It also creates a hash map of names used to generate hash key. [Source](http://sitl.diputados.gob.mx/LXIII_leg/curricula.php?dipt=1)

## Importing Attendance
1. Scrape PDF
This script reads the [attendance page](http://www5.diputados.gob.mx/index.php/camara/Asistencias-LXIII-Legislatura/Asistencias), then creates and entry on DownloadedFile for each PDF.

2. Download PDF
This script read all unprocessed DownloadedFile and download it to downloads/pdf path. Then mark it as download.

3. Process files
This script open de PDF and parse it to JSON, after that it reads all names and assistances, finally imported at AttendanceStg.

4. Import Attendance
This script read attendance staging table and import it to attendance table.
