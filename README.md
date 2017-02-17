# [Contacto Legislativo](http://contactolegislativo.com)

Te permite ubicar a tu diputado y ver su desempeño de una forma sencilla.

##Sobre Nosotros
Contacto Legislativo es una iniciativa creada por un grupo de ciudadanos independientes preocupados por la brecha de comunicación entre representantes políticos y la ciudadanía. 

Creemos que abrir espacios de debate entre representantes y ciudadanos favorece el desarrollo del país, pues propicia la participación ciudadana en el desarrollo de iniciativas e incrementa el sentido de responsabilidad de servidores públicos. 

Con tal propósito se ha creado una plataforma web que permita a la ciudadanía identificar a su diputado federal, obtener información de contacto y un resumen de su desempeño de una manera amigable. 

Contacto Legislativo recaba información de varias fuentes como lo son INEGI, INE, Cámara de Diputados, así como de otras iniciativas como 3de3 de IMCO y #SinVotoNoHayDinero. 

##Instalacion

###Produccion

Este portal esta dicenado para trabajar en [Digital Ocean](http://digitalocean.com)

1. Instalar ambiente de NodeJS siguiendo las [instrucciones](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04).
2. Instalar base de datos MySQL siguiendo las [instrucciones](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-14-04).

###Base de datos

1. Crear base de datos
  
  ```
  CREATE DATABASE contacto_db;
  ```

2. Crear usuario

  ```
  CREATE USER contacto@localhost IDENTIFIED BY yourpassword;
  ```
  
3. Dar acceso a base de datos

  ```
  GRANT ALL PRIVILEGES ON contacto_db.* TO contacto@localhost;
  ```

###Web
 
1. Clone repository
 
   ```
   git clone https://github.com/wedevelopmx/contactolegislativo.git
   ```
 
2. Setup database configuration
 
  File: app/config/config.json 
  ```
  "production": {
    "username": "contacto",
    "password": "yourpassword",
    "database": "contacto_db",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "port": 3306,
    "define": {
        "paranoid": true
    },
    "logging": false
  }
  ```
  
3. Inicializacion de datos

  Debes ejecutar los scripts descritos en el folder JOBS para inicializar los datos necesarios.

4. Startup

  ```
  pm2 start process.json
  ```
  
  La aplicacion se conectara a la base de datos y creara las tablas necesarias para operar
  
##Licencia
Copyright (c) 2017 WeDevelop.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE
 
 
