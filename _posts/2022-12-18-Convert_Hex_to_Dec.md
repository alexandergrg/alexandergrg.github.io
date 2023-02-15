# CONVERT HEX TO DEC | CONVERSION DE BASE DECIMAL A HEXADECIMAL
### _Convert Hexadecimal to Decimal in Bash_ 
____
De acuerdo con este ejemplo, un número hexadecimal se tomará como entrada y se convertirá en el número decimal basado en el valor de obase e ibase. Aquí, obase se establece en 10 para convertir el número decimal, ibase se establece en 16 para tomar el número de entrada como número hexadecimal y el comando `bc` se utiliza para la conversión.

> #### Convert Hexadecimal to Decimal in Bash.

```bat
echo "obase=10; ibase=16; $hexNum" | bc
```
