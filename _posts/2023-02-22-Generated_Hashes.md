# GENERAR HASHES
## HASH
Un hash es una función matemática que toma un conjunto de datos de cualquier tamaño y lo convierte en una cadena de longitud fija. El resultado de la función hash se conoce como el valor de hash, hash code, resumen criptográfico o huella digital. La función hash es determinística, lo que significa que para una entrada dada, siempre se producirá el mismo valor de hash. Además, cualquier cambio en la entrada producirá un valor de hash completamente diferente. Por lo tanto, el hash es una forma de representar de manera única los datos de entrada.
### MD5SUM
MD5SUM es una herramienta de software que se utiliza para verificar la integridad de un archivo. MD5 es un algoritmo de hash que crea una huella digital única de un archivo. La herramienta md5sum calcula el valor de hash MD5 de un archivo y muestra este valor de hash en forma de una cadena alfanumérica de 32 caracteres hexadecimales. Esta cadena es conocida como la suma de verificación MD5 (o MD5 checksum, en inglés).
```ruby
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/HTB]
└─# echo -n "Hola Mundo" | md5sum                                                         
d501194c987486789bb01b50dc1a0adb  -
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────                              
```
### SHA1SUM
SHA1SUM es una herramienta de software que se utiliza para verificar la integridad de un archivo utilizando la función hash SHA-1. SHA-1 es un algoritmo criptográfico que genera un valor de hash de 160 bits para una entrada dada. La herramienta SHA1SUM calcula el valor de hash SHA-1 de un archivo y muestra este valor de hash en forma de una cadena alfanumérica de 40 caracteres hexadecimales. Esta cadena es conocida como la suma de verificación SHA-1 (o SHA-1 checksum, en inglés).
```ruby
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/HTB]
└─# echo -n "Hola Mundo" | sha1sum 
48124d6dc3b2e693a207667c32ac672414913994  -
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```