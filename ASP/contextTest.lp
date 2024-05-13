% turnsPerDay(1).
% 
% unavailableDay(tuesday).
% unavailableDay(wednesday).
% unavailableDay(thursday).
% unavailableDay(friday).
% unavailableDay(saturday).
% unavailableDay(sunday).
% 
% tag(groupA).
% tag(groupB).
% 
% tag(theory).
% tag(practice).
% 
% tag("1").
% tag("2").
% 
% tags(task1,groupA,practice,"1").
% 
% tags(task2,groupB,theory,"2").
% 
% % tags(task2,groupB,theory,1)
% 
% 
% taskName(task1).
% taskName(task12).
% taskName(task2).
% worker(john).
% worker(jane).
% space(uno).
% space(dos).
% 
% schedulableTask(task1,john,uno).
% %schedulableTask(task12,john,dos).
% 
% schedulableTask(task2,jane,dos).
% 

turnsPerDay(2).
unavailableDay(tuesday).
unavailableDay(wednesday).
unavailableDay(thursday).
unavailableDay(friday).
unavailableDay(saturday).
unavailableDay(sunday).
taskName(task1).
taskName(task2).
worker(john).
worker(jane).

tag(groupA).
tag(theory).
tag("1").
tag(practice).

tags(task1,theory).
tags(task1,groupA).
tags(task1,"1").

tags(task2,groupA).
tags(task2,practice).
tags(task2,"1").

space(space1).
space(space2).

schedulableTask(task1, john, space1).
schedulableTask(task2, jane, space2).

% day(monday).
% day(tuesday).
% day(wednesday).
% day(thursday).
% day(friday).
% day(saturday).
% day(sunday).
% 
% % Días no disponibles
% unavailableDay(tuesday).
% 
% % Números para contar
% number(0).
% 
% % Regla para contar los días no disponibles
% #count {unavailableDay; day(Day) } = CountUnavailableDays.
% 
% % Imprimir el resultado
% #show CountUnavailableDays.