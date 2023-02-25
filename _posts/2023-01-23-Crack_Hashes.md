# CRACK HASHES
---
## HASCAT

Hashcat es una herramienta de recuperación de contraseñas que utiliza técnicas de fuerza bruta para descifrar contraseñas hasheadas. Funciona generando combinaciones de caracteres y comparando el hash generado con el hash objetivo. Si los hashes coinciden, significa que se ha encontrado la contraseña. Hashcat es capaz de utilizar varios algoritmos de hash y puede funcionar en diferentes plataformas, incluyendo Windows, Linux y MacOS

> * _**El parámetro -m.-**_ especifica el tipo de hash que estás intentando descifrar. Por ejemplo, si estás tratando de descifrar un hash MD5, usarías el valor -m 0.
> * _**El parámetro has.-h**_ es el hash que deseas descifrar.
>   - MD5 (0)
>   - SHA1 (100)
>   - SHA256 (1400)
>   - SHA384 (180)
>   - SHA512 (1700)
>   - NTLM (1000)
>   - bcrypt (3200)
>   - scrypt (8900)
>   - WPA/WPA2 (2500)
> * _**El parámetro rockyou.txt.-**_  es el archivo de texto que contiene las palabras o frases que Hashcat utilizará para generar combinaciones.
> * _**El parámetro -a.-**_ en Hashcat es utilizado para especificar el modo de ataque que se va a utilizar. Hay varios modos de ataque disponibles en Hashcat, cada uno con su propia funcionalidad y usos específicos. Algunos de los modos de ataque más comunes son:
>    - 0 = Fuerza bruta (default)
>    - 1 = Diccionario
>    - 3 = Combinación
>    - 6 = Hybrid Wordlist + Mask
>    - 7 = Hybrid Mask + Wordlist

```java
┌──(root㉿kali)-[/home/…/CTF/vulnhub/corrosion2/content]
└─# hashcat -m 1800 -a 0 randy_hash /usr/share/wordlists/rockyou.txt
hashcat (v6.2.6) starting

OpenCL API (OpenCL 3.0 PoCL 3.0+debian  Linux, None+Asserts, RELOC, LLVM 14.0.6, SLEEF, DISTRO, POCL_DEBUG) - Platform #1 [The pocl project]
============================================================================================================================================
* Device #1: pthread-Intel(R) Core(TM) i7-8550U CPU @ 1.80GHz, 6926/13917 MB (2048 MB allocatable), 8MCU

Minimum password length supported by kernel: 0
Maximum password length supported by kernel: 256

Hashes: 1 digests; 1 unique digests, 1 unique salts
Bitmaps: 16 bits, 65536 entries, 0x0000ffff mask, 262144 bytes, 5/13 rotates
Rules: 1

Optimizers applied:
* Zero-Byte
* Single-Hash
* Single-Salt
* Uses-64-Bit

ATTENTION! Pure (unoptimized) backend kernels selected.
Pure kernels can crack longer passwords, but drastically reduce performance.
If you want to switch to optimized kernels, append -O to your commandline.
See the above message to find out about the exact limits.

Watchdog: Temperature abort trigger set to 90c

Host memory required for this attack: 0 MB

Dictionary cache built:
* Filename..: /usr/share/wordlists/rockyou.txt
* Passwords.: 14344392
* Bytes.....: 139921507
* Keyspace..: 14344385
* Runtime...: 2 secs

Cracking performance lower than expected?                 

* Append -O to the commandline.
  This lowers the maximum supported password/salt length (usually down to 32).

* Append -w 3 to the commandline.
  This can cause your screen to lag.

* Append -S to the commandline.
  This has a drastic speed impact but can be better for specific attacks.
  Typical scenarios are a small wordlist but a large ruleset.A

* Update your backend API runtime / driver the right way:
  https://hashcat.net/faq/wrongdriver

* Create more work items to make use of your parallelization power:
  https://hashcat.net/faq/morework

[s]tatus [p]ause [b]ypass [c]heckpoint [f]inish [q]uit => s

$6$bQ8rY/73PoUA4lFX$i/aKxdkuh5hF8D78k50BZ4eInDWklwQgmmpakv/gsuzTodngjB340R1wXQ8qWhY2cyMwi.61HJ36qXGvFHJGY/:07051986randy
                                                          
Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 1800 (sha512crypt $6$, SHA512 (Unix))
Hash.Target......: $6$bQ8rY/73PoUA4lFX$i/aKxdkuh5hF8D78k50BZ4eInDWklwQ...FHJGY/
Time.Started.....: Thu Jan 19 18:50:05 2023 (4 hours, 28 mins)
Time.Estimated...: Thu Jan 19 23:18:47 2023 (0 secs)
Kernel.Feature...: Pure Kernel
Guess.Base.......: File (/usr/share/wordlists/rockyou.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.#1.........:      686 H/s (17.28ms) @ Accel:1024 Loops:64 Thr:1 Vec:4
Recovered........: 1/1 (100.00%) Digests (total), 1/1 (100.00%) Digests (new)
Progress.........: 13933568/14344385 (97.14%)
Rejected.........: 0/13933568 (0.00%)
Restore.Point....: 13932544/14344385 (97.13%)
Restore.Sub.#1...: Salt:0 Amplifier:0-1 Iteration:4992-5000
Candidate.Engine.: Device Generator
Candidates.#1....: 070591tow -> 0704279
Hardware.Mon.#1..: Util: 84%

Started: Thu Jan 19 18:48:54 2023
Stopped: Thu Jan 19 23:18:50 2023
```
Con la contrasela encontrada `07051986randy`, hacemos prueba para cambiar de usuario al usuario randy.

## ZIP2JOHN
___

zip2john es una herramienta de la suite de John the Ripper que permite extraer la contraseña de un archivo zip protegido mediante una contraseña. Funciona generando un hash del archivo zip y luego utilizando John the Ripper para intentar descifrar el hash y determinar la contraseña original. Es una herramienta utilizada para pruebas de penetración y auditoría de seguridad para verificar la seguridad de contraseñas utilizadas para proteger archivos zip.
```java
┌──(root㉿kali)-[/home/…/vulnhub/corrosion2/content/corrosion1]
└─# zip2john user_backup.zip > hash     
ver 2.0 efh 5455 efh 7875 user_backup.zip/id_rsa PKZIP Encr: TS_chk, cmplen=1979, decmplen=2590, crc=A144E09A ts=0298 cs=0298 type=8
ver 2.0 efh 5455 efh 7875 user_backup.zip/id_rsa.pub PKZIP Encr: TS_chk, cmplen=470, decmplen=563, crc=41C30277 ts=029A cs=029a type=8
ver 1.0 efh 5455 efh 7875 ** 2b ** user_backup.zip/my_password.txt PKZIP Encr: TS_chk, cmplen=35, decmplen=23, crc=21E9B663 ts=02BA cs=02ba type=0
ver 2.0 efh 5455 efh 7875 user_backup.zip/easysysinfo.c PKZIP Encr: TS_chk, cmplen=115, decmplen=148, crc=A256BBD9 ts=0170 cs=0170 type=8
NOTE: It is assumed that all files in each archive have the same password.
If that is not the case, the hash may be uncrackable. To avoid this, use
option -o to pick a file at a time.
```
## JOHN THE RIPPER
___

John the Ripper es un software de seguridad gratuito y de código abierto que se utiliza para descifrar contraseñas. Es una herramienta de auditoría de seguridad muy popular utilizada para pruebas de penetración y auditoría de seguridad para descubrir si las contraseñas utilizadas en un sistema son seguras o no. John the Ripper puede descifrar contraseñas utilizando varios algoritmos, incluyendo descifrado de diccionario, fuerza bruta y ataques basados en el uso de tablas de precomputación. Es compatible con varios sistemas operativos, incluyendo Windows, Linux y macOS.
```java                                                                                                                                                    
┌──(root㉿kali)-[/home/…/vulnhub/corrosion2/content/corrosion1]
└─# john -w:/usr/share/wordlists/rockyou.txt hash 
Using default input encoding: UTF-8
Loaded 1 password hash (PKZIP [32/64])
Will run 8 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
!randybaby       (user_backup.zip)     
1g 0:00:00:01 DONE (2023-01-20 20:34) 0.6944g/s 9960Kp/s 9960Kc/s 9960KC/s "2parrow"..*7¡Vamos!
Use the "--show" option to display all of the cracked passwords reliably
Session completed. 
```
## SNOW

### OCultar o openstego
```java
Snow -C -p 123456789 -m "Este en mensaje estego" docClaro.txt msnOculto.txt
```
### Mostrar
```java
C:\Users\Administrator\Desktop>Snow -C -p 123456789 msnOculto.txt
Este en mensaje estego
```

### Discifrar hashes

https://hashes.com/en/decrypt/hash


###  In Kali
 $hash-identifier  
   
 #Decrypt Hashes
 hashcat '5f4dcc3b5aa765d61d8327deb882cf99' /usr/share/wordlists/rockyou.txt

### CrypTool : Encode/Decode Text (File Extension is .hex)
File → New → Enter Text → Encrypt/Decrypt → Symmetric (Modern) → RC2 → KEY 05 → Encrypt

File → Open → Encrypt/Decrypt → Symmetric (Modern) → RC2 → KEY 05 → Decrypt