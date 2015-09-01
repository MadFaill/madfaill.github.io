---
title:  "PHP Simple ACL"
date:   2013-11-10 10:18:00
description: "Простая реализация ограничения доступа"
---

# Предыстория

Для одного не большого проекта, написанного на некой самописной CMS потребовался контроль доступа.
Подразумевалось наличие проверки по ролям, маркерам разрешений и владельцу.

**Проверка по роли**

Одна из базовых и самых простых проверок. Объекту пользователя назначается конкретная роль. По этой роли дальше осуществляется проверка. Стоит так же учесть6 что в данной реализации, чем выше int() у роли, тем выше у нее привелегия. Сделано это для иерархии ролей (весьма простой в данном случае), дабы ROOT_USER мог пользоваться всеми благами цивилизации.

{% highlight php %}

$user = new User("Sergey", 1, Role::ROLE_USER);
$acl = Provider::createForUser($user);

var_dump($user->getName(), 'Role::ROLE_ROOT', $acl->roleMatch(Role::ROLE_ROOT));
// FALSE
var_dump($user->getName(), 'Role::ROLE_VISITOR', $acl->roleMatch(Role::ROLE_VISITOR));
// TRUE
var_dump($user->getName(), 'Role::ROLE_USER', $acl->roleMatch(Role::ROLE_USER));
// TRUE

{% endhighlight %}