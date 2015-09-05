---
title:  "Sqlalchemy 0.7.7 array_agg filter_by"
description: "Для тех, кто не может обновить алхимию..."
category: "python"
tags: [python, sql-alchemy]
---

Из-за legacy кода не было возможности обновить библиотеку sqlalchemy. Задача-то сама по себе весьма простая и внимания особого не требует.
Однако, в нашем случае, пришлось писать кастомный компилер для алхимии.

Дело все в том, что только с версией 1.1 в sqlalchemy появился **aggregate\_order\_by** внутри **sqlalchemy.dialects.postgresql**. 
Собственно говоря, вот простая и топорная реализация:

{% highlight python %}

from sqlalchemy.sql.expression import ColumnElement, _literal_as_column
from sqlalchemy.dialects.postgres import ARRAY
from sqlalchemy.ext.compiler import compiles

class array_agg(ColumnElement):
    def __init__(self, expr, order_by=None):
        self.type = ARRAY(sa.Integer)
        self.expr = _literal_as_column(expr)
        self.order_by = _literal_as_column(order_by) if order_by is not None else None

    @property
    def _from_objects(self):
        return self.expr._from_objects

@compiles(array_agg, 'postgresql')
def compile_array_agg(element, compiler, **kwargs):
    head = 'array_agg(%s' % (
        compiler.process(element.expr)
    )
    if element.order_by is not None:
        tail = ' ORDER BY %s)' % compiler.process(element.order_by)
    else:
        tail = ')'
    return head + tail

{% endhighlight %}

Применение тоже простое:

{% highlight python %}

query = session.query(array_agg(Foo.bar, order_by=Foo.bar.desc()))

# Print compiled SQL query.
print query.statement.compile(dialect=postgresql.dialect())

# Run the query and print result.
print query.scalar()

{% endhighlight %}

Конечно, в новой версии все весьма проще и понятнее =)

{% highlight python %}
from sqlalchemy.dialects.postgresql import aggregate_order_by
expr = func.array_agg(aggregate_order_by(table.c.a, table.c.b.desc()))
stmt = select([expr])
{% endhighlight %}

Более подробнее о различиях можно прочитать [тут][1]

[1]: http://docs.sqlalchemy.org/en/latest/changelog/migration_11.html