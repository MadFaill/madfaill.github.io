---
title:  "Install pgbouncer on Ubuntu 14.04"
description: "Быстро, просто и легко...."
category: tutorial
tags: [snippet, tutorial, shell]
---

[pgbouncer](https://wiki.postgresql.org/wiki/PgBouncer) весьма мощный инструмент, необходимый для улушения производительности при использовании СУБД PostgreSQL. 
Тулза позволяет весьма легко масштабировать кластер БД + весьма круто тюнит воркеров, что позволяет СУБД фокусироваться на вставках/чтениях взамен обработки соединений.


**Установка pgbouncer:**

```
sudo apt-get install pgbouncer
```

**Редактируем конфигурационный файл:**

```
sudo nano -w /etc/pgbouncer/pgbouncer.ini
```

**Необходимо указать настройки соединения с БД:**

```
[databases]
DATABASE_NAME = host=DB_HOST port=DB_PORT dbname=DATABASE_NAME
```

**Опционально, можно разрешить слушать все адреса:**

```
listen_addr = *
```

**Так же необходимо изменить тип авторизации:**

```
auth_type = md5
```

**Настройка пула:**

Зависит напрямую от того, насколько много конкурентных соединений обрабатывает ваш слой БД.

```
max_client_conn = 100
default_pool_size = 20
```

**Для авторизации необходимо добавить пользователя в userlist.txt:**

```
sudo nano -w /etc/pgbouncer/userlist.txt
```

**Просто логин/пароль из БД:**

```
"DB_USER_NAME" "DB_PASSWORD"
```

**Автозагрузка при старте.**

```
sudo nano -w /etc/default/pgbouncer
```

**Смените 0 на 1**

```
START=1
```

**ребут**

```
sudo service pgbouncer restart
sudo reboot
```

**коннект к БД через pgbouncer**

```
psql -h PGBOUNCER_HOST_ADDRESS -U DB_USER_NAME -p 6432 DATABASE_NAME
```