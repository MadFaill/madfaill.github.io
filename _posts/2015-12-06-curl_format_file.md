---
title:  "curl-format.txt example"
description: "Быстрый способ проверить скорость сайта."
category: tutorial
tags: [unix, shell, snippet]
---

Существует много вариантов замера скорости отдачи сайта.
Самый простой:

```
time curl -s http://ya.ru -o /dev/null
```

Однако, иногда требуется нечто большее.
К счастью, рограмма под названием CURL позволяет не только получать контент с удаленных ресурсов.
Более того, существует некий **format**, позволяющий гибко настроить шаблон с отчетом по запросу.


**Создадим файл curl-format.txt:**

```
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
   time_pretransfer:  %{time_pretransfer}\n
      time_redirect:  %{time_redirect}\n
 time_starttransfer:  %{time_starttransfer}\n
                    ----------\n
         time_total:  %{time_total}\n
```

**Использование:**

{% highlight bash %}
curl -w "@curl-format.txt" -o /dev/null -s http://google.com
{% endhighlight %}

**Результат работы:**

```
   time_namelookup:  0.001
      time_connect:  0.037
   time_appconnect:  0.000
  time_pretransfer:  0.037
     time_redirect:  0.000
time_starttransfer:  0.092
                   ----------
        time_total:  0.164
```

**Как это работает:**

+ -w "@curl-format.txt" флаг указывает CURL использовать файл с форматом
+ -o /dev/null контент выводим в /dev/null
+ -s указывает что нужно перейти по адресу http://google.com

<br>
**Доступные константы для format.txt:**

Тут взято напрямую с [CURL MAN page](http://curl.haxx.se/docs/manpage.html) **-w, --write-out <format>**

+ **content_type** The Content-Type of the requested document, if there was any.
+ **filename_effective** The ultimate filename that curl writes out to. This is only meaningful if curl is told to write to a file with the --remote-name or --output option. It's most useful in combination with the --remote-header-name option. (Added in 7.25.1)
+ **ftp\_entry\_path** The initial path curl ended up in when logging on to the remote FTP server. (Added in 7.15.4)
+ **http_code** The numerical response code that was found in the last retrieved HTTP(S) or FTP(s) transfer. In 7.18.2 the alias response_code was added to show the same info.
+ **http_connect** The numerical code that was found in the last response (from a proxy) to a curl CONNECT request. (Added in 7.12.4)
+ **local_ip** The IP address of the local end of the most recently done connection - can be either IPv4 or IPv6 (Added in 7.29.0)
+ **local_port** The local port number of the most recently done connection (Added in 7.29.0)
+ **num_connects** Number of new connects made in the recent transfer. (Added in 7.12.3)
+ **num_redirects** Number of redirects that were followed in the request. (Added in 7.12.3)
+ **redirect_url** When an HTTP request was made without -L to follow redirects, this variable will show the actual URL a redirect would take you to. (Added in 7.18.2)
+ **remote_ip** The remote IP address of the most recently done connection - can be either IPv4 or IPv6 (Added in 7.29.0)
+ **remote_port** The remote port number of the most recently done connection (Added in 7.29.0)
+ **size_download** The total amount of bytes that were downloaded.
+ **size_header** The total amount of bytes of the downloaded headers.
+ **size_request** The total amount of bytes that were sent in the HTTP request.
+ **size_upload** The total amount of bytes that were uploaded.
+ **speed_download** The average download speed that curl measured for the complete download. Bytes per second.
+ **speed_upload** The average upload speed that curl measured for the complete upload. Bytes per second.
+ **ssl\_verify\_result** The result of the SSL peer certificate verification that was requested. 0 means the verification was successful. (Added in 7.19.0)
+ **time_appconnect** The time, in seconds, it took from the start until the SSL/SSH/etc connect/handshake to the remote host was completed. (Added in 7.19.0)
+ **time_connect** The time, in seconds, it took from the start until the TCP connect to the remote host (or proxy) was completed.
+ **time_namelookup** The time, in seconds, it took from the start until the name resolving was completed.
+ **time_pretransfer** The time, in seconds, it took from the start until the file transfer was just about to begin. This includes all pre-transfer commands and negotiations that are specific to the particular protocol(s) involved.
+ **time_redirect** The time, in seconds, it took for all redirection steps include name lookup, connect, pretransfer and transfer before the final transaction was started. time_redirect shows the complete execution time for multiple redirections. (Added in 7.12.3)
+ **time_starttransfer** The time, in seconds, it took from the start until the first byte was just about to be transferred. This includes time_pretransfer and also the time the server needed to calculate the result.
+ **time_total** The total time, in seconds, that the full operation lasted. The time will be displayed with millisecond resolution.
+ **url_effective** The URL that was fetched last. This is most meaningful if you've told curl to follow location: headers.

