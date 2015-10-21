---
title:  "Python Greenclock stop_task"
description: "Добавляем возможность остановки задачи."
category: tutorial
tags: [python]
---

##Немного о Greenclock

**greenclock** - библиотека для Python, позволяющая на базе greenlet'ов удобно манипулировать асинхронными заданиями.

К сожалению, нет возможности из одной задачи застопить другую. Что собственно можно вполне легко исправить куском кода что предоставлю вашему вниманию ниже.

##stop_task

{% highlight python %}

import greenclock


class Scheduler(greenclock.Scheduler):
    pool = None
    greenlets = {}

    def run_tasks(self):
        '''
        Runs all assigned task in separate green threads. If the task should not be run, schedule it
        '''
        self.pool = Pool(len(self.tasks))
        for task in self.tasks:
            # Launch a green thread to schedule the task
            # A task will be managed by 2 green thread: execution thread and scheduling thread
            self.pool.spawn(self.do_run, task)
        return self.pool

    def do_run(self, task):
        greenlet, next_greenlet = self.run(task)
        self.greenlets.update({task.name: [greenlet, next_greenlet]})
        return greenlet, next_greenlet

    def stop_task(self, name):
        for key, task in enumerate(self.tasks):
            print key, task.name
            if task.name == name:
                greens = self.greenlets.pop(task.name, [])
                for g in greens:
                    if g is not None:
                        self.tasks.pop(key)
                        self.pool.killone(g)
                        self.pool.discard(g)
                        g.unlink(task.action)
                        g.kill()
                        print "Stopped task: %s" % task.name

{% endhighlight %}

##Использование

{% highlight python %}

mport greenclock
from datetime import datetime
import time

def func_1():
	print('Calling func_1() at ' + str(datetime.now()))
	time.sleep(2)
	print('Ended call to func_1() at ' + str(datetime.now()))

def func_2():
	print('Calling func_2() at ' + str(datetime.now()))
	time.sleep(2)
	print('Ended call to func_2() at ' + str(datetime.now()))
	scheduler.stop_task('task_1')
	print('task_1 is stopped from task_2')

if __name__ == "__main__":
	scheduler = greenclock.Scheduler(logger_name='task_scheduler')
	scheduler.schedule('task_1', greenclock.every_second(4), func_1)
	scheduler.schedule('task_2', greenclock.every_second(1), func_2)
	# Run hourly task at 41:00 every day
	scheduler.schedule('task_3', greenclock.every_hour(minute=41, second=0), func_3)
	# Run daily task at 12:35:00
	scheduler.schedule('task_2', greenclock.every_hour(hour=12, minute=35, second=0), func_2) 
	# To start the scheduled tasks immediately, specify 'once' for `start_at`
	# Other values: 
	# * `next_minute`: Wait until the first seconds of the next minute to run
	# * `next_hour`: Wait until the first seconds of the next hour to run
	# * `tomorrow`: Wait until the first seconds of tomorrow to run
	scheduler.run_forever(start_at='once')

{% endhighlight %}