# Creación Servidores http
### _Servidor Web con Python 3_ | Web Server with Python 3
____
Para crear el servidor web con Python, en esta prueba utilizaremos la versión 3, por lo que, se debe ejecutar el siguiente comando. python -m SimpleHTTPServer [puerto]

> #### Creación de servicor web.

```bat
sudo python3 -m http.server 80
[sudo] password for user: 
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
127.0.0.1 - - [25/May/2022 21:43:47] "GET / HTTP/1.1" 200 -
127.0.0.1 - - [25/May/2022 21:43:48] code 404, message File not found
127.0.0.1 - - [25/May/2022 21:43:48] "GET /favicon.ico HTTP/1.1" 404 -
```
>*_Nota_*: En caso de no estar logueado con el usuario root, ejecutar con el comando sudo, para elevar privilegios, para validar que esta funcionando el servidor web podemos hacer una petición por el explorador a la ruta http://localhost:80/