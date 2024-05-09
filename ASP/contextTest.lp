turnsPerDay(1).

unavailableDay(tuesday).
unavailableDay(wednesday).
unavailableDay(thursday).
unavailableDay(friday).
unavailableDay(saturday).
unavailableDay(sunday).

tag(groupA).
tag(groupB).

tag(theory).
tag(practice).

tag("1").
tag("2").

tags(task1,groupA,practice,"1").

tags(task2,groupB,theory,"2").

% tags(task2,groupB,theory,1)


taskName(task1).
taskName(task12).
taskName(task2).
worker(john).
worker(jane).
space(uno).
space(dos).

schedulableTask(task1,john,uno).
%schedulableTask(task12,john,dos).

schedulableTask(task2,jane,dos).


