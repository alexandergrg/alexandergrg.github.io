# LIST-BINS
Es una lista curada de binarios Unix que pueden utilizarse para saltarse las restricciones de seguridad locales en sistemas mal configurados.

## NMAP
Si al binario se le permite ejecutarse como superusuario mediante sudo, no se le retiran los privilegios elevados y puede utilizarse para acceder al sistema de archivos, escalar o mantener accesos privilegiados.
### SUDO
El modo interactivo, disponible en las versiones 2.02 a 5.21, puede utilizarse para ejecutar comandos de shell.
```bat
usaurio@locahost: nmap --interactive
nmap> !sh
```
