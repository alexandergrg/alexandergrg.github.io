# Tools Share Files
## SMB-Folder

Impacket-smbserver es una herramienta de la suite Impacket, una colección de herramientas de seguridad diseñadas para interactuar con el protocolo SMB (Server Message Block). SMB es un protocolo de red utilizado para compartir archivos y recursos en una red de computadoras.

```java
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
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
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```