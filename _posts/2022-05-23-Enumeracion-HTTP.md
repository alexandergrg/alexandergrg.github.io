# Enumeración HTTP - Fuzzing
### Enumeration using nmap | Enumeración mediante nmap
____

El proceso de enumeración o fuzzing para un servicio http, se ejecuta mediante fuerza bruta, a continuación el script de nmap.

```bat
    # nmap --script http-enum -p80 10.10.149.222 -oN webScan 
```

A continuación el resultado del script.

```bat
───────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────
       │ File: webScan
───────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────
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
───────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
En los resultados se puede evidenciar que tenemos una posible ruta de ingreso, por lo que, para tener mayor detalle se puede utilizar la herramienta whatweb 

