# HOSTS_DISCOVERY
___
## Enumeración de hosts,usando hilos.
Existen varias formas de ejecutar el script utilizando hilos, una de ellas es utilizando el comando xargs que permite ejecutar un comando varias veces con diferentes argumentos.
Aquí hay un ejemplo de cómo podría modificar el script anterior para utilizar hilos con xargs:
```java
#!/bin/bash
# Dirección IP de inicio y final del rango a escanear
start_ip=1
end_ip=254
# Utilizar xargs para ejecutar varias instancias de ping al mismo tiempo
seq $start_ip $end_ip | xargs -P 50 -I{} bash -c 'ping -c 1 192.168.210.{} > /dev/null; if [ $? -eq 0 ]; then echo "La dirección IP {} está activa";fi'
```
Resultado de ejecución del script.
```java
bash-5.0# sh hostDiscovery.sh 
La dirección IP 1 está activa
La dirección IP 128 está activa
La dirección IP 129 está activa
```


## TCPDUMP
realizamos una prueba de conexion poniendo en escucha una conexion icpm mediante tcpdump. Para lanzar el exploit debemos ejecutar el exploit con el named pipes encontrado.

```java
┌──(root㉿kali)-[/home/…/CTF/HTB/legacy/nmap]
└─# tcpdump -i tun0 icmp -n -v 
tcpdump: listening on tun0, link-type RAW (Raw IP), snapshot length 262144 bytes
```
> * **-i.-** Flag para especificar interface.
> * **tun0.-** Nombre la interface que se pone en escucha.
> * **-n.-** Flag que evita resolucion dns.
> * **-v.-** Flag verbose.