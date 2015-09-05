---
title:  "PHP Simple ACL"
description: "Простая реализация ограничения доступа"
tags: [php, acl]
---

# Предыстория

Для одного не большого проекта, написанного на некой самописной CMS потребовался контроль доступа.
Подразумевалось наличие проверки по ролям, маркерам разрешений и владельцу.

<!-- cut -->
### Подготовка

Для демонстрации примеров нам необходимы заранее заготовленые объекты.

**Класс записи**

{% highlight php %}

class Post implements AccessControl\Component\ChildObject
{
	private $owner_id;
	private $title;
	public function __construct($title, $owner_id)
	{
		$this->title = $title;
		$this->owner_id = $owner_id;
	}
	public function getOwnerId()
	{
		return $this->owner_id;
	}
	public function getTitle()
	{
		return $this->title;
	}
}

{% endhighlight %}

**Класс пользователя**

{% highlight php %}

class User extends AccessControl\Component\User
{
	private $role;
	private $id;
	private $name;
	public function __construct($name, $id, $role)
	{
		$this->role = $role;
		$this->id   = $id;
		$this->name = $name;
	}
	public function getName()
	{
		return $this->name;
	}
	public function getId()
	{
		return $this->id;
	}
	public function getRole()
	{
		return $this->role;
	}
}

{% endhighlight %}

### Примеры использования

Теперь можно посмотреть на ряд примеров.

**Проверка по роли**

Одна из базовых и самых простых проверок. Объекту пользователя назначается конкретная роль. По этой роли дальше осуществляется проверка. Стоит так же учесть, что в данной реализации, чем выше int() у роли, тем выше у нее привелегия. Сделано это для иерархии ролей (весьма простой в данном случае), дабы ROOT_USER мог пользоваться всеми благами цивилизации.

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


**Проверка на родителя**

Еще одной немаловажной проверкой является проверка на соответствие родителю. По сути, кто что-то создал, тот и редактировать может.

{% highlight php %}

$sergey = new User("Sergey", 1, Role::ROLE_USER);
$helen = new User("Helen", 2, Role::ROLE_USER);

$post1 = new Post('Sergey post', $sergey->getId());
$post2 = new Post('Helen post', $helen->getId());

$acl = Provider::createForUser($helen);

var_dump($helen->getName(), $post1->getTitle(), $acl->ownerValidFor($post1));
// Helen, Sergey post, false 

var_dump($helen->getName(), $post2->getTitle(), $acl->ownerValidFor($post2));
// Helen, Helen post, true

{% endhighlight %}

**Проверка на соответствие группы**

Данная проверка более похожа на проверку конкретного правила. Суть приблизительно такая - для удобства раздачи прав
создается несколько групп с определенным набором привелегий. Конкретному пользователю присваиваются несколько групп.
Далее, получаем возможность осуществить проверку на конкретное действие.

{% highlight php %}

$permissions_list = array(
	'edit.post' => 1
);

$permissions_list_2 = array(
	'delete.post' => 1
);

$permissions_list_3 = array(
	'publish.post' => 1
);

$user = new User("Sergey", 1, Role::ROLE_USER);

$user->addGroup(Group::createWithPermissions($permissions_list));
$user->addGroup(Group::createWithPermissions($permissions_list_2));

$acl = Provider::createForUser($user);

var_dump($user->getName(), 'edit.post', $acl->userCan('edit.post'));
// Sergey, edit.post, true

var_dump($user->getName(), 'delete.post', $acl->userCan('delete.post'));
// Sergey, delete.post, true

var_dump($user->getName(), 'publish.post', $acl->userCan('publish.post'));
// Sergey, publish.post, false

{% endhighlight %}

### Заключение

Данная библиотека доступна для установки через `composer`:

{% highlight json %}
{
    "require":
    {
        "mad-tools/simple-access-control": "dev-master"
    }
}
{% endhighlight %}

Так же вы можете просмотреть сам код по адресу: [Simplae ACL][1]

Благодарю за внимание =)

[1]: https://github.com/MadFaill/SimpleAccessControl
