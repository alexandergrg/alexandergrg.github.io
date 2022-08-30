# PEN-TESTING LABS. ENUMERACIÓN HTTP
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


