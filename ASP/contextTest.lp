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

taskUnknownSpace(task1, john).
taskUnknownWorkerAndSpace(task2).
taskUnknownWorker(task3, space1).

turnsPerDay(3).

unavailableDay(tuesday).
unavailableDay(wednesday).
unavailableDay(thursday).
unavailableDay(friday).
unavailableDay(saturday).
unavailableDay(sunday).

taskName(task1).
taskName(task2).
taskName(task3).


worker(john).
%worker(jane).

space(space1).
%space(space2).

spaceCapacity(space1, 5).
% spaceCapacity(space2, 15).

% taskSize(task1, 3).
% taskSize(task2, 7).

%restrictionspace(space1,monday,1).


