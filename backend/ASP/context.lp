%----------Knowledge given by the user----------

% ---------workers------
worker(philipp).
worker(manuel).
worker(luis).
worker(juanCarlos).
worker(santiago).
worker(fernandoGalvez).
worker(franciscoJavier).
% ---------/workers------

% ---------space------
space("1.4").
space("14-15").
space("1.1.1").
space("17-18").
% ---------/space------

% ---------task------
taskName(calculo_1_theory1).
taskName(calculo_1_theory2).
taskName(programacion_1_theory1).
taskName(programacion_1_theory2).
taskName(teco_1_theory1).
taskName(teco_1_theory2).
taskName(empresas_1_theory1).
taskName(empresas_1_theory2).
taskName(fisica_1_theory1).
taskName(fisica_1_theory2).

taskName(calculo_1_practice_groupA).
taskName(calculo_1_practice_groupB).
taskName(calculo_1_practice_groupC).

taskName(programacion_1_practice_groupA).
taskName(programacion_1_practice_groupB).
taskName(programacion_1_practice_groupC).

taskName(teco_1_practice_groupA).
taskName(teco_1_practice_groupB).
taskName(teco_1_practice_groupC).

taskName(empresas_1_practice_groupA).
taskName(empresas_1_practice_groupB).
taskName(empresas_1_practice_groupC).

taskName(fisica_1_practice_groupA).
taskName(fisica_1_practice_groupB).
taskName(fisica_1_practice_groupC).
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

tags(teco_1_theory1,theory,1,group).
tags(teco_1_theory2,theory,1,group).

tags(empresas_1_theory1,theory,1,group).
tags(empresas_1_theory2,theory,1,group).

tags(fisica_1_theory1,theory,1,group).
tags(fisica_1_theory2,theory,1,group).


tags(calculo_1_practice_groupA,practice,1,groupA).
tags(calculo_1_practice_groupB,practice,1,groupB).
tags(calculo_1_practice_groupC,practice,1,groupC).

tags(programacion_1_practice_groupA,practice,1,groupA).
tags(programacion_1_practice_groupB,practice,1,groupB).
tags(programacion_1_practice_groupC,practice,1,groupC).

tags(teco_1_practice_groupA,practice,1,groupA).
tags(teco_1_practice_groupB,practice,1,groupB).
tags(teco_1_practice_groupC,practice,1,groupC).

tags(empresas_1_practice_groupA,practice,1,groupA).
tags(empresas_1_practice_groupB,practice,1,groupB).
tags(empresas_1_practice_groupC,practice,1,groupC).

tags(fisica_1_practice_groupA,practice,1,groupA).
tags(fisica_1_practice_groupB,practice,1,groupB).
tags(fisica_1_practice_groupC,practice,1,groupC).
% ---------/Tags------

% ---------turn------
turnsPerDay(6).

% ---------/turn------


% -------unavailableDay------
unavailableDay(saturday).
unavailableDay(sunday).
% -------/unavailableDay------


% -------spaceCapacity------
% spaceCapacity(c,size). :- space(c).

spaceCapacity("1.4",60).
spaceCapacity("14-15",20).
spaceCapacity("1.1.1",20).
spaceCapacity("17-18",20).
% -------/spaceCapacity------

% -------groupSize------
% groupSize(group,size). :- group(group).

groupSize(group,60).
groupSize(groupA,20).
groupSize(groupB,20).
groupSize(groupC,20).
% -------/groupSize------

% ---------schedulableTask------
% schedulableTask(taskName,worker,space).

schedulableTask(calculo_1_theory1,philipp,"1.4").
schedulableTask(calculo_1_theory2,philipp,"1.4").


schedulableTask(programacion_1_theory1,luis,"1.4").
schedulableTask(programacion_1_theory2,luis,"1.4").

schedulableTask(teco_1_theory1,juanCarlos,"1.4").
schedulableTask(teco_1_theory2,juanCarlos,"1.4").

schedulableTask(empresas_1_theory1,santiago,"1.4").
schedulableTask(empresas_1_theory2,santiago,"1.4").

schedulableTask(fisica_1_theory1,fernandoGalvez,"1.4").
schedulableTask(fisica_1_theory2,fernandoGalvez,"1.4").

schedulableTask(calculo_1_practice_groupA,manuel,"14-15").
schedulableTask(calculo_1_practice_groupB,manuel,"1.1.1").
schedulableTask(calculo_1_practice_groupC,manuel,"17-18").

schedulableTask(programacion_1_practice_groupA,manuel,"14-15").
schedulableTask(programacion_1_practice_groupB,manuel,"14-15").
schedulableTask(programacion_1_practice_groupC,luis,"17-18").

schedulableTask(teco_1_practice_groupA,juanCarlos,"14-15").
schedulableTask(teco_1_practice_groupB,juanCarlos,"1.1.1").
schedulableTask(teco_1_practice_groupC,juanCarlos,"17-18").

schedulableTask(empresas_1_practice_groupA,santiago,"14-15").
schedulableTask(empresas_1_practice_groupB,santiago,"1.1.1").
schedulableTask(empresas_1_practice_groupC,santiago,"17-18").

schedulableTask(fisica_1_practice_groupA,fernandoGalvez,"14-15").
schedulableTask(fisica_1_practice_groupB,fernandoGalvez,"1.1.1").
schedulableTask(fisica_1_practice_groupC,fernandoGalvez,"17-18").

% ---------/schedulableTask------
% restrictionworker(T,D,TO). :- turn(TO).,day(D).,worker(T).

restrictionworker(philipp,monday,4).
restrictionworker(juanCarlos,tuesday,4).
restrictionworker(philipp,friday,0).



% restrictionspace(C,D,TO). :- turn(TO).,day(D).,space(C).

restrictionspace("14-15",monday,4).
restrictionspace("1.4",monday,5).
