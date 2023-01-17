# ENUMERACION CON SMB PORT 445
## Enumeración de recursos compartidos SMP

### ¿Qué es un SMB?
---

El puerto445 es "SMB sobre IP". SMB son las siglas de 'Server Message Blocks'. En lenguaje moderno, Server Message Block también se conoce como Common Internet File System. El sistema funciona como un protocolo de red de capa de aplicación utilizado principalmente para ofrecer acceso compartido a archivos, impresoras, puertos serie y otros tipos de comunicaciones entre nodos de una red.
Por ejemplo, en Windows, SMB puede ejecutarse directamente sobre TCP/IP sin necesidad de NetBIOS sobre TCP/IP. Esto utilizará, como señalas, el puerto 445. En otros sistemas, encontrarás servicios y aplicaciones que utilizan el puerto 139. Esto significa que SMB se ejecuta con NetBIOS sobre TCP/IP.

### Scanear Recursos Compartidos

```ruby
┌──(root㉿kali)-[/home/…/CTF/vulnhub/venom1/nmap]
└─# smbmap -H 192.168.200.150 
[+] Guest session       IP: 192.168.200.150:445 Name: venom.box                                         
        Disk                                                    Permissions     Comment
        ----                                                    -----------     -------
        print$                                                  NO ACCESS       Printer Drivers
        IPC$                                                    NO ACCESS       IPC Service (venom server (Samba, Ubuntu))
                                                                                                                       
```
En la ejecución anterior se puede evidenciar que existe recursos compartidos, sn embargo, no hay accesos.
