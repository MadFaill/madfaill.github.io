---
title:  "Pyhton array_chunk"
description: "Варианты на тему..."
player: true
category: programming
tags: [python]
---

Собственно говоря, несколько простых реализаций `php-like array_chunk` в **python**. Использую как шпаргалку. Надо бы протестить скорость выполнения + потребление памяти и выложить еще бенчмарки.

**Example 1**

{% highlight python %}
def array_chunk(l, n):
    for i in xrange(0, len(l), n):
        yield l[i:i+n]

# usage
import pprint
pprint.pprint(list(chunks(range(10, 75), 10)))

[[10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
 [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
 [30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
 [40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
 [50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
 [60, 61, 62, 63, 64, 65, 66, 67, 68, 69],
 [70, 71, 72, 73, 74]]

{% endhighlight %}


**Example 2**

{% highlight python %}
def array_chunk(l, n):
    n = max(1, n)
    return [l[i:i + n] for i in range(0, len(l), n)]
{% endhighlight %}


**Example 3**

{% highlight python %}
from itertools import izip, chain, repeat

def array_chunk(iterable, n, padvalue=None):
    "array_chunk('abcdefg', 3, 'x') --> ('a','b','c'), ('d','e','f'), ('g','x','x')"
    return izip(*[chain(iterable, repeat(padvalue, n-1))]*n)
{% endhighlight %}


**Example 4**

{% highlight python %}
from itertools import izip_longest # for Python 2.x
#from itertools import zip_longest # for Python 3.x
#from six.moves import zip_longest # for both (uses the six compat library)

def array_chunk(iterable, n, padvalue=None):
    "array_chunk('abcdefg', 3, 'x') --> ('a','b','c'), ('d','e','f'), ('g','x','x')"
    return izip_longest(*[iter(iterable)]*n, fillvalue=padvalue)
{% endhighlight %}


**Example 5**

{% highlight python %}
def array_chunk(iterable, size):
    it = iter(iterable)
    item = list(itertools.islice(it, size))
    while item:
        yield item
        item = list(itertools.islice(it, size))
{% endhighlight %}


**Example 6**

{% highlight python %}
array_chunk = lambda l, n: [l[x: x+n] for x in xrange(0, len(l), n)]
{% endhighlight %}
