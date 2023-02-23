# TOOLS MOVIL ANDROID
## ADB (Android Debug Bridge)
___
es una herramienta de línea de comandos incluida en el kit de desarrollo de software de Android (SDK) que se utiliza principalmente para el desarrollo y la depuración de aplicaciones de Android. ADB proporciona una interfaz de comunicación entre un dispositivo Android y una computadora, lo que permite a los desarrolladores interactuar con dispositivos Android desde la línea de comandos de una computadora.
### Instalar
`sudo apt-get install android-tools-adb
`
### Escaneos Nmap 
```java
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF]
└─# nmap -p- --open -sS --min-rate 4000 -vvvv -n -Pn 192.168.200.161 -oG allPorts
Host discovery disabled (-Pn). All addresses will be marked 'up' and scan times may be slower.
Starting Nmap 7.93 ( https://nmap.org ) at 2023-02-22 23:01 -05
Initiating ARP Ping Scan at 23:01
Scanning 192.168.200.161 [1 port]
Completed ARP Ping Scan at 23:01, 0.16s elapsed (1 total hosts)
Initiating SYN Stealth Scan at 23:01
Scanning 192.168.200.161 [65535 ports]
Discovered open port 5555/tcp on 192.168.200.161
Completed SYN Stealth Scan at 23:02, 67.13s elapsed (65535 total ports)
Nmap scan report for 192.168.200.161
Host is up, received arp-response (0.11s latency).
Scanned at 2023-02-22 23:01:42 -05 for 67s
Not shown: 40467 filtered tcp ports (no-response), 25067 closed tcp ports (reset)
Some closed ports may be reported as filtered due to --defeat-rst-ratelimit
PORT     STATE SERVICE REASON
5555/tcp open  freeciv syn-ack ttl 64
MAC Address: 00:0C:29:40:6D:AC (VMware)

Read data files from: /usr/bin/../share/nmap
Nmap done: 1 IP address (1 host up) scanned in 67.82 seconds
           Raw packets sent: 165329 (7.274MB) | Rcvd: 25071 (1.003MB)
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```                                                                     
Se puede verificar que el puerto `5555` esta abierto, y para conectarnos utilizaremos la herramienta `adb`
### adb connect ip:port
El comando adb connect ip:port se utiliza para conectarse a un dispositivo Android a través de una red TCP/IP en lugar de una conexión USB. Este comando permite que un dispositivo Android y una computadora se comuniquen entre sí a través de una red inalámbrica en lugar de una conexión por cable USB.
```java
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────                                                     
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/HTB]
└─# adb connect 192.168.200.161:5555 
connected to 192.168.200.161:5555
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
### adb devices
`adb devices`.- Si el dispositivo está conectado y configurado correctamente, deberías ver una lista de dispositivos conectados en la salida del comando. Una vez que estés conectado al dispositivo Android, puedes utilizar los comandos de ADB para realizar tareas de pentesting, como la recopilación de información, la ejecución de comandos remotos en el dispositivo y la identificación de vulnerabilidades.
```java
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────                                            
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/HTB]
└─# adb devices                     
List of devices attached
192.168.200.161:5555    device
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
### adb shell
El comando adb shell se utiliza para abrir una terminal de shell en un dispositivo Android conectado a través de ADB. Una vez que se ejecuta este comando, se establece una sesión de shell en el dispositivo Android y se puede interactuar con el sistema operativo Android a través de comandos de shell.
```ruby
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌──(root㉿kali)-[/home/s3cur1ty3c/CTF/HTB]
└─# adb shell  
x86_64:/ $ ls
acct       d                    init                   init.usb.rc         oem                     proc     sys                       vendor_hwservice_contexts 
bin        data                 init.android_x86_64.rc init.zygote32.rc    plat_file_contexts      product  system                    vendor_property_contexts  
bugreports default.prop         init.environ.rc        init.zygote64_32.rc plat_hwservice_contexts sbin     ueventd.android_x86_64.rc vendor_seapp_contexts     
cache      dev                  init.rc                lib                 plat_property_contexts  sdcard   ueventd.rc                vendor_service_contexts   
charger    etc                  init.superuser.rc      mnt                 plat_seapp_contexts     sepolicy vendor                    vndservice_contexts       
config     fstab.android_x86_64 init.usb.configfs.rc   odm                 plat_service_contexts   storage  vendor_file_contexts      
x86_64:/ $ cd sdcard
x86_64:/sdcard $ ls
Alarms Android DCIM Download Movies Music Notifications Pictures Podcasts Ringtones 
x86_64:/sdcard $
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
Algunos ejemplos de comandos que se pueden ejecutar dentro de la sesión de shell de ADB incluyen:

> - **ls:** lista los archivos y directorios en el directorio actual.
> - **cd:** cambia el directorio actual.
> - **cat:** muestra el contenido de un archivo.
> - **pm:** gestiona paquetes de aplicaciones en el dispositivo, como la instalación o desinstalación de aplicaciones.
> - **settings:** modifica la configuración del sistema en el dispositivo, como la configuración de Wi-Fi, la configuración de pantalla, etc.
#### Ejemplo
Este es un ejemplo de como listar información.
`cat Tradeinfo`