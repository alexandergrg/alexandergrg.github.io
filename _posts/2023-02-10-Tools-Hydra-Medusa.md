# TOOLS FORCE BRUTE ATTACK
## HYDRA
---
**Hydra.-** es una herramienta de prueba de penetración (pentesting) que se utiliza para realizar ataques de fuerza bruta a sistemas de autenticación. Es una herramienta de línea de comandos que permite automatizar el proceso de adivinación de contraseñas para varios protocolos de autenticación, incluyendo FTP, SSH, Telnet, HTTP, HTTPS, entre otros.
### POST-FORM
#### Ejecución
``` java
hydra 192.168.200.152 http-post-form "/login.php:username=^USER^&password=^PASS^&Login=Login:Login failed" -L user.txt -P password.txt   
Hydra v9.4 (c) 2022 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2023-02-15 11:03:17
[DATA] max 16 tasks per 1 server, overall 16 tasks, 78 login tries (l:3/p:26), ~5 tries per task
[DATA] attacking http-post-form://192.168.200.152:80/login.php:username=^USER^&password=^PASS^&Login=Login:Login failed
[80][http-post-form] host: 192.168.200.152   login: admin   password: password
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2023-02-15 11:03:20
```
En la línea de comando de Hydra, los flags significan lo siguiente:

>* **192.168.200.152.-** Indica la dirección IP del servidor que se va a atacar.
>* **http-post-form.-** Indica el protocolo que se va a utilizar para la comunicación con el servidor. En este caso, se utilizará el protocolo HTTP y se enviarán los datos de inicio de sesión mediante un formulario HTTP POST.
>* **"/login.php:username=^USER^&password=^PASS^&Login=Login:Login failed":** Esta cadena de caracteres representa la URL y los datos del formulario que se utilizarán en el ataque. Se especifica el archivo login.php y se definen los campos del formulario de inicio de sesión, incluyendo el nombre de usuario, la contraseña y el botón de inicio de sesión. "Login failed" indica el mensaje que se mostrará en caso de que el intento de inicio de sesión falle.
>* **-L user.txt:** Especifica el archivo que contiene una lista de nombres de usuario que se utilizarán en el ataque.
>* **-P password.txt:** Especifica el archivo que contiene una lista de contraseñas que se utilizarán en el ataque.
### GET_FORM
#### Ejecución
``` java
hydra 192.168.200.152 http-get-form "/vulnerabilities/brute/:username=^USER^&password=^PASS^&Login=Login:H=Cookie\:PHPSESSID=o39naa5urd4qrgkfo5n6fv4jf2; security=low:F=Username and/or password incorrect" -L user.txt -P /usr/share/wordlists/rockyou.txt   
Hydra v9.4 (c) 2022 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2023-02-15 12:57:21
[INFORMATION] escape sequence \: detected in module option, no parameter verification is performed.
[WARNING] Restorefile (you have 10 seconds to abort... (use option -I to skip waiting)) from a previous session found, to prevent overwriting, ./hydra.restore
[DATA] max 16 tasks per 1 server, overall 16 tasks, 43033197 login tries (l:3/p:14344399), ~2689575 tries per task
[DATA] attacking http-get-form://192.168.200.152:80/vulnerabilities/brute/:username=^USER^&password=^PASS^&Login=Login:H=Cookie\:PHPSESSID=o39naa5urd4qrgkfo5n6fv4jf2; security=low:F=Username and/or password incorrect
[80][http-get-form] host: 192.168.200.152   login: admin   password: password
^CThe session file ./hydra.restore was written. Type "hydra -R" to resume session.
```

Este comando usa la herramienta Hydra para realizar un ataque de fuerza bruta en un formulario de inicio de sesión en una página web alojada en la dirección IP 192.168.200.152.

>* **"http-get-form".-** especifica que se debe usar el método HTTP GET para enviar el formulario de inicio de sesión.
>* **"/vulnerabilities/brute/".-** es la URL del formulario de inicio de sesión.
>* **":username=^USER^&password=^PASS^&Login=Login".-** son los campos del formulario de inicio de sesión que se van a atacar. Los valores de usuario y contraseña se reemplazarán con los valores del archivo de usuario y de la lista de contraseñas proporcionados.
>* **"H=Cookie:PHPSESSID=o39naa5urd4qrgkfo5n6fv4jf2;.-** security=low" son las cookies que se van a enviar junto con la solicitud de inicio de sesión. En este caso, se envía una cookie PHPSESSID con un valor específico y se establece el nivel de seguridad en "bajo".
>* **"F=Username and/or password incorrect".-** es el mensaje que se muestra en la página web cuando se ingresan credenciales incorrectas.
>* **"-L user.txt".-** especifica la ruta del archivo que contiene los nombres de usuario que se utilizarán para el ataque de fuerza bruta.
>* **"-P /usr/share/wordlists/rockyou.txt".-** especifica la ruta de la lista de contraseñas que se utilizará para el ataque de fuerza bruta. En este caso, se utiliza la popular lista de 

## MEDUSA
---
**Medusa.-** es una herramienta de prueba de penetración que se utiliza para realizar ataques de fuerza bruta contra sistemas y aplicaciones. Su función principal es intentar adivinar credenciales de inicio de sesión, como nombres de usuario y contraseñas, mediante la repetición de pruebas con diferentes combinaciones de credenciales.

Medusa puede trabajar con varios protocolos, incluyendo FTP, SSH, Telnet, SMTP, HTTP, HTTPS, SMB, y muchos otros. La herramienta puede utilizar varios métodos de autenticación, como diccionarios de contraseñas, ataque por fuerza bruta y ataques de diccionario personalizado. Además, Medusa es compatible con varias plataformas y sistemas operativos, incluyendo Linux, Windows y macOS.

Es importante tener en cuenta que Medusa debe ser utilizado únicamente con fines éticos y legales. Es necesario obtener la autorización previa del propietario del sistema o aplicación que se va a probar antes de utilizar cualquier herramienta de prueba de penetración.
>* -h: Este flag indica el host o dirección IP del sistema o aplicación que se va a atacar.
>* -U: Este flag especifica el archivo que contiene una lista de nombres de usuario que se probarán en el ataque.
>* -P: Este flag especifica el archivo que contiene una lista de contraseñas que se probarán en el ataque.
>* -M: Este flag indica el protocolo que se utilizará para comunicarse con el sistema o aplicación que se va a atacar, como http, ftp, ssh, telnet, etc.
>* -m: Este flag indica el modo de autenticación que se utilizará para el ataque, como diccionario, fuerza bruta, etc.
>* -T: Este flag indica el número máximo de hilos (threads) que se utilizarán en el ataque.
>* -f: Este flag indica que se deben utilizar las contraseñas de los usuarios proporcionados en el archivo de nombres de usuario.
>* -e: Este flag indica que se deben utilizar contraseñas vacías en el ataque.
>* -B: Este flag indica que se deben utilizar técnicas de ataque especiales, como ataque de diccionario personalizado, fuerza bruta por intervalo de tiempo, etc.
>* -C: Este flag indica que se deben utilizar diferentes códigos de respuesta del servidor para identificar si una prueba de credenciales ha sido exitosa o no.

### Ejecución