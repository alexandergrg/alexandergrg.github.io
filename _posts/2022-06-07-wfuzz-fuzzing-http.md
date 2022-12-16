# PEN-TESTING LABS. ENUMERACIÓN DIRECTORIOS FUZZING
### _Stage 1. Wfuzz servidores http
____
La herramienta wfuzz, permite ejecutar la enumeración de rutas http, de manera automatizada, utilizando un diccionario para verificar las rutas.

#### Ejecutar fuzzing con wfuzz.
```bat
wfuzz -c --hc=404 --hw=202 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt http://10.10.86.123:5001/FUZZ
```
A continuación el significado de los parametros de wfuzz.

>* *-c*: permite mostrar los resutaldos con colores.
>* *--hc*: oculta los registros con los codigos asignados, en ejemplo se esta ocultando resultados con código 404.
>* *--hw*: ocula las palabras con que se específiquen, en este ejemplo se oculta la palabra 202.
>* *-w*: se asigna el diccionario que va hacer la validación de las rutas. en este ejemplo se utiliza el /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt.

> * *<http://ip:port>*: la dirección del servidor donde víctima donde se va a ejecutar la enumeración.
> * */FUZZ*: se usa como variable, donde va a reemplazar las palabras de diccionarios.

> ###### Resultado del fuzzing

```bat
Wfuzz 3.1.0 - The Web Fuzzer
Target: http://10.10.86.123:5001/FUZZ
Total requests: 220560
====================================================================
ID           Response   Lines    Word       Chars       Payload                                                                                                                             
====================================================================
000000185:   200        8 L      18 W       237 Ch      "submit"                                                                                                                            
```
### _Stage 2. Enumeration using nmap | Enumeración mediante nmap
____

El proceso de enumeración o fuzzing para un servicio http, se ejecuta mediante fuerza bruta, a continuación el script de nmap.

```bat
    # nmap --script http-enum -p80 10.10.149.222 -oN webScan 
```

A continuación el resultado del script.

```bat
───────┬──────────────────────────────────────────────────────────────────────────────────────────────
       │ File: webScan
───────┼──────────────────────────────────────────────────────────────────────────────────────────────
   1   │ # Nmap 7.92 scan initiated Mon May 23 23:30:15 2022 as: nmap --script http-enum -p80 -oN webScan 10.10.58.135
   2   │ Nmap scan report for 10.10.58.135
   3   │ Host is up (0.17s latency).
   4   │ 
   5   │ PORT   STATE SERVICE
   6   │ 80/tcp open  http
   7   │ | http-enum: 
   8   │ |   /login.php: Possible admin folder
   9   │ |_  /robots.txt: Robots file
  10   │ 
  11   │ # Nmap done at Mon May 23 23:30:31 2022 -- 1 IP address (1 host up) scanned in 16.02 seconds
───────┴───────────────────────────────────────────────────────────────────────────────────────────────
```
En los resultados se puede evidenciar que tenemos una posible ruta de ingreso, por lo que, para tener mayor detalle se puede utilizar la herramienta whatweb 


### _Stage 3. Enumeration using gobuster | Enumeración mediante gobuster
____

Gobuster es una alternativa de enumeración de directorios para realizar fuzzing

```bat
    # gobuster dir -k -u https://192.168.200.143:7080 -w /usr/share/SecLists/Discovery/Web-Content/directory-list-2.3-medium.txt -t 10 -add-slash
```
Acontinuación el resultado de correr el scritp

```bat
Gobuster v3.1.0
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     https://192.168.200.143:7080
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/SecLists/Discovery/Web-Content/directory-list-2.3-medium.txt
[+] Negative Status codes:   404
[+] User Agent:              dd-slash
[+] Timeout:                 10s
===============================================================
2022/12/16 15:21:09 Starting gobuster in directory enumeration mode
===============================================================
/docs                 (Status: 301) [Size: 1260] [--> https://192.168.200.143:7080/docs/]
/view                 (Status: 301) [Size: 1260] [--> https://192.168.200.143:7080/view/]
/lib                  (Status: 301) [Size: 1260] [--> https://192.168.200.143:7080/lib/] 
/res                  (Status: 301) [Size: 1260] [--> https://192.168.200.143:7080/res/] 
```

>* *_dir_*: Establece fuzzing para directorios
>* *-k*: Pernmite saltar certificados de nocexiones https. 
>* *-u*: Permite establecer la URL, a del servidor para enumerar dirctorios http://ip:port
>* *-w*: Permite establer el directorio para hacer fuzzing.


