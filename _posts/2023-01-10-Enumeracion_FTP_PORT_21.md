# ENUMERACION CON SMB PORT 21
## Enumeración de recursos compartidos FTP

### ¿Qué es un FTP?
---
FTP es un protocolo de red utilizado para transferir archivos de un servidor a un cliente a través de una red. Se puede acceder a los servidores FTP a través de la herramienta de línea de comandos ftp o mediante aplicaciones de terceros como FileZilla. Este servicio se ejecuta por defecto en el puerto 21.

### Autenticación anónima

FTP tiene una forma de permitir a los usuarios remotos autenticarse sin necesidad de identificarse ante el servidor. Si esta función está activada en el servidor FTP, los usuarios podrán autenticarse utilizando anonymous como nombre de usuario y cualquier contraseña.

El FTP anónimo es una forma común de obtener acceso a un servidor para ver o descargar archivos que están disponibles públicamente, aunque puede suponer un riesgo para la seguridad si el servidor FTP está exponiendo archivos o carpetas sensibles. El comando FTP se puede utilizar para realizar una autenticación de la siguiente manera:

#### FTP-tools

```java
┌──(root㉿kali)-[/home/s3cur1ty3c]
└─# ftp 10.10.10.152     
Connected to 10.10.10.152.
220 Microsoft FTP Service
Name (10.10.10.152:s3cur1ty3c): anonymous
331 Anonymous access allowed, send identity (e-mail name) as password.
Password: 
230 User logged in.
Remote system type is Windows_NT.
ftp> ls -la
229 Entering Extended Passive Mode (|||49934|)
125 Data connection already open; Transfer starting.
02-02-19  11:18PM                 1024 .rnd
02-25-19  09:15PM       <DIR>          inetpub
07-16-16  08:18AM       <DIR>          PerfLogs
02-25-19  09:56PM       <DIR>          Program Files
02-02-19  11:28PM       <DIR>          Program Files (x86)
02-03-19  07:08AM       <DIR>          Users
02-25-19  10:49PM       <DIR>          Windows
                                                                                                                   
```
En la ejecución anterior se puede evidenciar que no esta habilitado el usuario anónimo.

#### Crackmapexec

```java
 crackmapexec ftp 10.10.10.152 -u anonymous -p anonymous -o listusers 
FTP         10.10.10.152    21     10.10.10.152     [*] Banner: Microsoft FTP Service
FTP         10.10.10.152    21     10.10.10.152     [+] anonymous:anonymous
```

> - **crackmapexec:** el comando principal que se utiliza para ejecutar CrackMapExec.
> - **ftp:** el protocolo que se desea escanear. En este caso, el protocolo FTP.
> - **10.10.10.152:** la dirección IP del servidor FTP que se desea escanear.
> - **-u anonymous:** especifica el nombre de usuario a utilizar para la autenticación. En este caso, el nombre de usuario es "anonymous".
> - **-p anonymous:** especifica la contraseña a utilizar para la autenticación. En este caso, la contraseña es "anonymous".
> - **-o listusers:** especifica la acción que se debe realizar después de la autenticación. En este caso, la acción es listar los usuarios del servicio FTP.
