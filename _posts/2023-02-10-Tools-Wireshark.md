# Tools Wireshark
## Que es Wireshark

Wireshark es un programa de análisis de protocolos de red y captura de paquetes. Es una herramienta de software libre y de código abierto que se utiliza para analizar el tráfico de red en tiempo real o para analizar archivos de captura previamente almacenados.

Con Wireshark, los usuarios pueden capturar y examinar el tráfico de red en tiempo real, lo que les permite diagnosticar y solucionar problemas de red, detectar amenazas de seguridad, y optimizar el rendimiento de la red. Wireshark es compatible con una amplia variedad de protocolos de red, incluyendo TCP/IP, DNS, HTTP, FTP, SSH, Telnet, y muchos otros.

### Filtrar Contenido

```java
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
tcp contains "contraseña"
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
El campo contrasela se puede reemplazar por valores comunes como `usuario, passowrd, username, pass, pwd`, o los nombres de los cajas de txt `txtuser`.

En caso de uitilizar la opcion `buscar paquete` se debe habilitar en la opcion edicion, y seleccionar las opciones `detalle de paquete` y `cadena`


### Filtrar por metoso
```java
http.request.method == "POST"
```
### Filtrar IP
Buscar direccion ip origen
```java
ip.src == <dirección_IP>
```
### Filtrar paquetes ICMP FLOOD
Para buscar paquetes que indiquen un posible ataque DDoS en un archivo de captura de Wireshark, puedes utilizar diferentes filtros, dependiendo de las características específicas del ataque que estás buscando. A continuación, te proporciono algunos ejemplos:

Filtro por paquetes ICMP flood: Si estás buscando paquetes que puedan indicar un ataque ICMP flood, puedes utilizar el siguiente filtro:

```java
icmp.type == 8
```
Este filtro buscará todos los paquetes ICMP echo request, que son enviados para realizar un ping a una dirección IP específica. Un gran número de paquetes ICMP echo request podría indicar un posible ataque ICMP flood.

Filtro por paquetes SYN flood: Si estás buscando paquetes que puedan indicar un ataque SYN flood, puedes utilizar el siguiente filtro:

```java
tcp.flags.syn == 1 and tcp.flags.ack == 0
```