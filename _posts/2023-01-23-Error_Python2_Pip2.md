# ERRORES PYTHON2 
---
## PIP2 Y IMPACKET
Error para ejecutar scritps de pytho2,por lo que toca instalar pip2 e impacket
```java
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
mkdir scripts && cd scripts
wget https://bootstrap.pypa.io/pip/2.7/get-pip.py
python2 get-pip.py
pip2 install --upgrade setuptools
sudo apt-get install python2-dev -y 
pip2 install impacket=0.9.22

En caso de error con las librerias importlib y json de python2 se recomienda eliminar python2 y volver instalar
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
