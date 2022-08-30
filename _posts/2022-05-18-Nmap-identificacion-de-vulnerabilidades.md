# PEN-TESTING LABS. NMAP
### _Stage 1. Reconnaissance phase_ | Fase de reconocimiento
____
Como parte inicial de la fase de recolección de información, se debe verificar la conectividad hacia el equipo víctima, y la version de sistema que vamos a analizar, para esto utilizaremos el protocolo _ICMP_, para determinar mediante _ttl_ la versión de sistema.

> #### Verificar la conexión.
```bat
# ping -c 1 10.10.149.222
  PING 10.10.149.222 (10.10.149.222) 56(84) bytes of data.
  4 bytes from 10.10.149.222: icmp_seq=1 ttl=63 time=174 ms
```
>*_Nota_*: el parametro *_-c_* de la traza icmp, permite enviar los paquetes asignados para la prueba, en el ejemplo anterior un solo paquete. Y como se pude interpretar, el ttl corresponde a una maquina linux.

### _Stage 2 Vulnerability identification_ | Identificación de vulnerabilidades
Para la etapa de identificación de viulnerabilidades utilizamos la herramienta *_nmap_*, que servirá para verificar los servicioes y puertos expuestos.

> ###### Identicación de puertos y servicios con nmap. 65535 Puertos.
```bat
# nmap -p- -T5 -v -n 10.10.149.222
# nmap -sS --min-rate 5000 -p- -vvv -n -Pn --open 10.10.149.222 -oG allPorts
```
A continuación el significado de los parametros de nmap.

>* *_-p-_*: Ejecuta la validación sobre todos los puertos 65535.
>* *_-T[0-5]_*: Corresponde a la plantilla del temporizado entre mas alto es el numero, el escaneo es mas rapido y mas ruidoso o intrusivo, el numero 5 es ideal para entornos controlados.
>* *_-v_*: Aumentar el nivel de mensajes detallados (use -vvv para aumentar el efecto).
>* *_-n_*: Le indica a Nmap que nunca debe realizar resolución DNS inversa de las direcciones IP activas que encuentre. Ya que DNS es generalmente lento, esto acelera un poco las cosas.
> * *_-Pn_*: Este parametro evita que se aplique resolución de host discovery, a travéz del protocolo arp.
> * *_-oG_*: -oN/-oX/-oS/-oG \<file>: Guardar el sondeo en formato normal, y Grepeable (para usar con grep) respectivamente, al archivo indicado.
> * *_sS_*: Análisis TCP SYN/Connect()/ACK.
> * *_--min-rate 5000_*: emite paquete no mas lentos a 5000 paquetes por segundo.
> * *_--open_*: muestra solo los puertos abiertos.

> ###### Resultadoformato grepeable -oG

```bat
       │ File: allPorts
 ──────┼───────────────────────────────────────────────────────────────────────────────────────────────────       
   1   │ # Nmap 7.92 scan initiated Wed May 18 22:04:49 2022 as: nmap -sS --min-rate 5000 -p- -vvv -n -Pn --open 10.10.149.222 -oG allPorts 
   2   │ # Ports scanned: TCP(65535;1-65535) UDP(0;) SCTP(0;) PROTOCOLS(0;)
   3   │ Host: 10.10.149.222 ()  Status: Up
   4   │ Host: 10.10.149.222 ()  Ports: 22/open/tcp//ssh///, 80/open/tcp//http///
   5   │ # Nmap done at Wed May 18 22:07:49 2022 -- 1 IP address (1 host up) scanned in 179.93 seconds
```
Una vez escaneado se puede evidenciar que encontró abierto los puertos 22 y 80, para lo que se puede ejecutar un escaneo mejorado a nivel se scritps con nmap.

```bat
    # nmap -sC -sV -p22,80 10.10.149.222 -oN targeted 
```

A continuación el significado de los parametros de nmap.

>* *_-sC_*: Escanee conn scripts básicos de enumeración.
>* *_-sV_*: Detecta la version y servicio que corren para los puertos.
>* *_-p22,80_*: Que se escanee sobre esos puertos.
>* *_-oN_*: Exporte en formato nmap.

````bat 
       │ File: targeted
 ──────┼───────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ # Nmap 7.92 scan initiated Tue Apr 26 23:00:32 2022 as: nmap -sC -sV -p22,80 -oN targeted 10.10.149.222
   2   │ Nmap scan report for 10.10.149.222
   3   │ Host is up (0.17s latency).
   4   │ 
   5   │ PORT   STATE SERVICE VERSION
   6   │ 22/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.6 (Ubuntu Linux; protocol 2.0)
   7   │ | ssh-hostkey: 
   8   │ |   2048 fc:e2:f7:8a:23:21:29:dd:76:85:72:b8:c8:c0:b2:1c (RSA)
   9   │ |   256 11:56:33:b6:43:4c:a6:65:d5:48:9b:61:de:12:98:7b (ECDSA)
  10   │ |_  256 bd:cb:d3:2b:e1:dc:a4:97:a7:b7:c0:89:7b:f1:39:d8 (ED25519)
  11   │ 80/tcp open  http    Apache httpd 2.4.18 ((Ubuntu))
  12   │ |_http-title: Rick is sup4r cool
  13   │ |_http-server-header: Apache/2.4.18 (Ubuntu)
  14   │ Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
  15   │ 
  16   │ Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
  17   │ # Nmap done at Tue Apr 26 23:00:46 2022 -- 1 IP address (1 host up) scanned in 14.00 seconds
````
Una vez identificado que existe un servidor web se puede utilizar fuzzing, para validar rutas o archivos, para lo que seguiremos utilizando nmap.

```bat
    # nmap --script hhtp-enum -p80 10.10.149.222 -oN webScan 
```
A continuación el significado de los parametros de nmap.

>* *_--script_*: Ejecuta escaneo mediante script de nmap.
>* *_http-enum_*: Script de enumeración.

```bat
       │ File: webScan
───────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ # Nmap 7.92 scan initiated Wed May 18 22:40:56 2022 as: nmap --script http-enum -p80 -oN webScan 10.10.149.222
   2   │ Nmap scan report for 10.10.149.222
   3   │ Host is up (0.17s latency).
   4   │ 
   5   │ PORT   STATE SERVICE
   6   │ 80/tcp open  http
   7   │ | http-enum: 
   8   │ |   /login.php: Possible admin folder
   9   │ |_  /robots.txt: Robots file
  10   │ 
  11   │ # Nmap done at Wed May 18 22:41:12 2022 -- 1 IP address (1 host up) scanned in 16.73 seconds
```
En los resultados se puede evidenciar que tenemos una posible ruta de ingreso, por lo que, para tener mayor detalle se puede utilizar la herramienta whatweb 

