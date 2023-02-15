# ENUMERACION CON SMB PORT 21
## Enumeración de recursos compartidos FTP

### ¿Qué es un FTP?
---
FTP es un protocolo de red utilizado para transferir archivos de un servidor a un cliente a través de una red. Se puede acceder a los servidores FTP a través de la herramienta de línea de comandos ftp o mediante aplicaciones de terceros como FileZilla. Este servicio se ejecuta por defecto en el puerto 21.

### Autenticación anónima

FTP tiene una forma de permitir a los usuarios remotos autenticarse sin necesidad de identificarse ante el servidor. Si esta función está activada en el servidor FTP, los usuarios podrán autenticarse utilizando anonymous como nombre de usuario y cualquier contraseña.

El FTP anónimo es una forma común de obtener acceso a un servidor para ver o descargar archivos que están disponibles públicamente, aunque puede suponer un riesgo para la seguridad si el servidor FTP está exponiendo archivos o carpetas sensibles. El comando FTP se puede utilizar para realizar una autenticación de la siguiente manera:

### Scanear Recursos Compartidos

```ruby
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/venom1]
└─$ ftp 192.168.200.150          
Connected to 192.168.200.150.
220 (vsFTPd 3.0.3)
Name (192.168.200.150:s3cur1ty3c): anonymous
530 Permission denied.
ftp: Login failed
ftp>                                                                                                                        
```
En la ejecución anterior se puede evidenciar que no esta habilitado el usuario anónimo.




