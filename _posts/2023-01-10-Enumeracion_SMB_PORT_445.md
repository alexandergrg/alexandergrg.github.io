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




