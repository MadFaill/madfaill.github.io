---
title:  "Тонкая настройка Nginx"
description: "Когда базовой настройки уже не хватает..."
category: tutorial
tags: [nginx, snippet]
resource: "http://ruhighload.com/index.php/2009/04/24/%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0-nginx/"
---

По большому счету даже при стандартных настройках Nginx весьма не плохо справляется с входящей нагрузкой. Тем не менее иногда имеет смысл его подтюнить, с целью достижения лучшей производительности.

<!-- cut -->

## Основная конфигурация с комментариями

{% highlight nginx %}

# Всего соединений = worker_processes x worker_connections
# Определяет количество рабочих процессов. 
# Его лучше устанавливать в auto в новых версиях.
worker_processes  auto;

events {
	# Директива use устанавливает метод выбора соединений. 
	# Для разных операционных систем нужно использовать разные методы.
	# linux: use epoll
	# freebsd: use kqueue
	# По умолчанию, выбирается наиболее эффективный метод самостоятельно.
    use epoll;

    # Устанавливает максимальное количество соединений одного рабочего процесса. 
    # Следует выбирать значения от 1024 до 4096.
    worker_connections 1024;

    # Будет принимать максимально возможное количество соединений
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Основной лог лучше отключить для экономии дисковых операций, 
    # а лог ошибок лучше перевести в режим логирования только критических ситуаций.
    access_log off;
    error_log /var/log/nginx/error.log crit;

    # Будет ждать 30 секунд перед закрытием keepalive соединения
    keepalive_timeout  30;

    # Максимальное количество keepalive запросов от одного клиента
    keepalive_requests 100;

    # В этом случае сервер не будет принимать запросы размером более 1Мб
    client_max_body_size  1m;

    # Будет ждать 10 секунд тело запроса от клиента, после чего сбросит соединение
    client_body_timeout 10;

    # Если клиент перестал читать отвечать, Nginx будет сбрасывать соединение с ним
    reset_timedout_connection on;

    # Если клиент прекратит чтение ответа, Nginx подождет 2 секунды и сбросит соединение
    send_timeout 2;

    # Метод отправки данных sendfile более эффективен, чем стандартный метод read+write
    sendfile on;

    # Будет отправлять заголовки и и начало файла в одном пакете
    tcp_nodelay on;
	tcp_nopush on;

    # Файлы более 10Мб Nginx будет читать с диска минуя операционный кеш
    directio 10m;

    # Ограничиваем скорость отдачи до 196Кб/с
    limit_rate 196K;

    # Ограничение скорости отдачи будет накладываться после 1Мб
    limit_rate_after 1m;

	# Обязательно нужно использовать сжатие, это значительно уменьшит трафик.
    gzip on;

    # Будет сжимать все файлы с перечисленными типами
    gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript application/javascript;

    # Определяет максимальное количество файлов, информация о которых будет содержаться в кеше
    open_file_cache max=200000 inactive=20s;

    # Определяет через какое время информация будет удалена из кеша
    open_file_cache_valid 30s;

    # Будет кешировать информацию о тех файлах, которые были использованы хотя бы 2 раза
    open_file_cache_min_uses 2;

    # Будет кешировать информацию об отсутствующих файлах
    open_file_cache_errors on;
}

{% endhighlight %}


## Кеширование

Основная задача - разбить на кеширующий и не кеширующий сервер. Ниже приведен пример с настройками по каждому из них.

{% highlight nginx %}


http {
    ...
    # Во-первых, убедимся что есть директория: /var/cache/nginx
    # Устанавливаем размер кеша в 32Мб, сохранять его будем в папку /var/cache/nginx
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=all:32m;

    # Nginx позволяет кешировать ответы от fastcgi
    # Установим максимальный размер кеша в 100Мб, сохранять его будем в папку /var/cache/fpm
    fastcgi_cache_path /var/cache/fpm levels=1:2 keys_zone=fcgi:100m;
    fastcgi_cache_key "$scheme$request_method$host$request_uri";
    ...
}

# fastcgi_pass сервер (без кеширования)
server {
        listen 81;

        location / {
            # fpm, etc...
        }

        location ~ \.php$ {
            fastcgi_pass unix:/var/run/php5-fpm.sock;
            fastcgi_index index.php;
            include fastcgi_params;
            fastcgi_cache fcgi;

            # кешируем только 200 OK н а60 минут
            fastcgi_cache_valid 200 60m;
        }
}

# основной сервер (кеширующий)
server {
        listen 80;

        location / {

                # не кешируем если есть cookies
                if ($http_cookie ~* ".+" ) {
                        set $do_not_cache 1;
                }

                proxy_cache_bypass $do_not_cache;
                proxy_pass http://127.0.0.1:81/;
                proxy_cache all;

                # кешируем ошибки на 1 минуту
                proxy_cache_valid 404 502 503 1m;
                proxy_cache_valid any 1h;
        }
}

{% endhighlight %}
