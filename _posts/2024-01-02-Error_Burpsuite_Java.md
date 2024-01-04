# ERRORES Burpsuite Java 17
---
## ERROR AL INICIAR BURPSUITE
Este error se genera cuando se inicia Burpsuite por primera vez, y no esta configurado java 17 o 11
```java
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

Ejecutar

update-alternatives --config java

Selecciona la opción de acuerdo a al necesidad

There are 2 choices for the alternative java (providing /usr/bin/java).

  Selection    Path                                         Priority   Status
------------------------------------------------------------
  0            /usr/lib/jvm/java-17-openjdk-arm64/bin/java   1711      auto mode
* 1            /usr/lib/jvm/java-11-openjdk-arm64/bin/java   1111      manual mode
  2            /usr/lib/jvm/java-17-openjdk-arm64/bin/java   1711      manual mode

Press <enter> to keep the current choice[*], or type selection number: 0   
update-alternatives: using /usr/lib/jvm/java-17-openjdk-arm64/bin/java to provide /usr/bin/java (java) in auto mode

En caso de error con las librerias importlib y json de python2 se recomienda eliminar python2 y volver instalar
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
