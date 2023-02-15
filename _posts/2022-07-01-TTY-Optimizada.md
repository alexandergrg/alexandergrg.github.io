# TOOLS -OPTIMIZACIÓN TTY 
## Optimización de bash con python 3
En este escenario supondremos que tenemos ejecuado una conexion resersa o acceso a un servidor con una shell no interactiva.

### Ejemplo
> ```bash
> lp@localhost:~$ echo $SHELL
> echo $SHELL
> /usr/sbin/nologin
> ```

Una vez comprobado que estamos en la consola, para cambiar la shell a una bash debemos ejecutar los siguientes pasos.

> ```bash
> lp@localhost:~$ script /dev/null -c bash
> script /dev/null -c bash
> Script started, file is /dev/null
> This account is currently not available.
> Script done, file is /dev/null
> ```

*_Nota:_* Se puede evidenciar en la linea anterior que no se puede crear un bash con el mensaje not available, por lo que utilizaremos python3

Utilizamos python3 para spawnear la /bin/bash, y luego presionamos control z para suspender la conexion reversa.
>```bash
>lp@localhost:~$ python3 -c 'import pty;pty.spawn("/bin/bash")'
>python3 -c 'import pty;pty.spawn("/bin/bash")'
>lp@localhost:~$ ^Z
>zsh: suspended  sudo nc -nlvp 1104
>```

una vez suspendida se realiza el tratamiento de la tty, agregamos el comando fg para recurar la sesion, y luego reseteamos la terminal para operar de una full tty.

>```bash
>lp@pentesting:~$stty raw -echo; fg
>                               reset xterm
>```

Una vez con full tty, resetead procedemos a exportar las variables locales de la shell y la terminal.

>```bash
>lp@localhost:~$ export SHELL=bash
>lp@localhost:~$ export TERM=xterm
>```