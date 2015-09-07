---
title:  "Тонкая настройка Nginx"
description: "Когда базовой настройки уже не хватает..."
category: tutorial
tags: [nginx, tutorial]
resource: "http://ruhighload.com/index.php/2009/04/24/%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0-nginx/"
---

По большому счету даже при стандартных настройках Nginx весьма не плохо справляется с входящей нагрузкой. Тем не менее иногда имеет смысл его подтюнить, с целью достижения лучшей производительности.

<!-- cut -->

Сразу продемонстрирую итоговый вариант конфига:

{% highlight nginx %}

worker_processes  auto;
events {
    use epoll;
    worker_connections 1024;
    multi_accept on;
}
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    access_log off;
    error_log /var/log/nginx/error.log crit;

    keepalive_timeout  30;
    keepalive_requests 100;

    client_max_body_size  1m;
    client_body_timeout 10;
    reset_timedout_connection on;
    send_timeout 2;
    sendfile on;
    tcp_nopush on;

    gzip on;
    gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript application/javascript;

    open_file_cache max=200000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
}

{% endhighlight %}