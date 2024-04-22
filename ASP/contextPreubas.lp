% Knowledge given by the user
% ---------workers------
worker(philipp).
worker(luis).

worker(juanCarlos).
% ---------/workers------

% ---------space------
space(clase14).
space(clase1415).
space("1.1.1").
space("17-18").
% ---------/space------

% ---------task------
taskName(calculo_1_theory1).
taskName(calculo_1_theory2).
taskName(programacion_1_theory1).
taskName(programacion_1_theory2).

taskName(pruebaName).


% ---------/task------


% ----------Tags------
% tag(taskName,tag,tag..).
tag(theory).
tag(practice).
tag(group;groupA;groupB;groupC). 
tag(1..4).

tags(calculo_1_theory1,theory,1,group).
tags(calculo_1_theory2,theory,1,group).

tags(programacion_1_theory1,theory,1,group).
tags(programacion_1_theory2,theory,1,group).

tags(pruebaName,practice,1,groupA).




% ---------/Tags------

% ---------turn------
turnsPerDay(5).

% ---------/turn------


% -------availableDay------
availableDay(monday).
% availableDay(tuesday).
% availableDay(wednesday).
% availableDay(thursday).
% availableDay(friday).
% -------/availableDay------


% -------spaceCapacity------
% spaceCapacity(c,size). :- space(c).

spaceCapacity(clase14,60). 
spaceCapacity(clase1415,30). 
spaceCapacity("1.1.1",20). 
spaceCapacity("17-18",20). 
% -------/spaceCapacity------

% -------groupSize------
% groupSize(group,size). :- group(group).

groupSize(group,50). 
groupSize(groupA,20). 
groupSize(groupB,20). 
groupSize(groupC,20). 
% -------/groupSize------

% ---------schedulableTask------
% schedulableTask(taskName,worker,space).

schedulableTask(calculo_1_theory1,philipp,clase14).
schedulableTask(calculo_1_theory2,philipp,clase14).


schedulableTask(programacion_1_theory1,luis,clase14).
schedulableTask(programacion_1_theory2,luis,clase14).

schedulableTask(pruebaName,juanCarlos, clase1415).

% ---------/schedulableTask------
% restrictionworker(T,D,TO). :- turn(TO).,day(D).,worker(T).

restrictionworker(philipp,monday,4). 
restrictionworker(juanCarlos,tuesday,4). 
restrictionworker(philipp,friday,0). 




restrictionspace(clase14,monday,4).
% restrictionspace(clase14,monday,3).


