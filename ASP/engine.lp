% -------------Rules for the schedule generation----------------


% Generate the turns depending on the number of turns per day
turn(D, 1..NUM_TURNS) :- day(D),  not unavailableDay(D), turnsPerDay(NUM_TURNS).

% Generate Scheduable task for the tasks with unknown space
1{schedulableTask(T,W,S): taskName(T),worker(W),space(S)}1 :- taskUnknownSpace(T,W).

% Generate Scheduable task for the tasks with unknown worker
1{schedulableTask(T,W,S): taskName(T),worker(W),space(S)}1 :- taskUnknownWorker(T,S).

% Generate Scheduable task for the tasks with unknown space and worker
1{schedulableTask(T,W,S): taskName(T),worker(W),space(S)}1 :- taskUnknownWorkerAndSpace(T).

% Generate coincidences every time two tasks have the same tag
1 {coincidence(T1,T2,Ta1): taskName(T1),taskName(T2),tag(Ta1)} 1 :- taskName(T1),taskName(T2),tag(Ta1),tag(Ta2)
,tags(T1,Ta1),tags(T2,Ta2),T1!=T2,Ta1==Ta2.

% Generate the schedules for the tasks that are schedulable
1 {schedule(D,To,T,W,S):turn(D,To),taskName(T),worker(W),space(S)} 1 :- schedulableTask(T,W,S).

% there cannot be a schedule in an unavailable day
:- schedule(D, _, _, _, _), unavailableDay(D).
%

% Two schedules cannot have the same tags and be in the same day and turn
count(T1,T2,X) :- coincidence(T1,T2,_), #count{Ta1: coincidence(T1,T2,Ta1)} = X.

:- count(T1,T2,X), X > 2, schedule(D1,To1,T1,_,_),schedule(D2,To2,T2,_,_),
D1 == D2, To1 == To2.


% Two schedules cannot have the same space and be in the same day and turn
:- schedule(D1,To1,T1,_,S1),
   schedule(D2,To2,T2,_,S2),
   T1!=T2, D1 == D2, To1 == To2, S1 == S2.

% Two schedules cannot have the same worker and be in the same day and turn
:- schedule(D1,To1,T1,W1,_),
   schedule(D2,To2,T2,W2,_),
   T1!=T2,W1 == W2,D1 == D2, To1 == To2.

% There cannot be a schedule in a free time turn
:- schedule(D,To,_,_,_), freeTimeTurn(D,To).

% there cannot be a schedule on a turn in which that worker has restrictions
:- schedule(D,To,T,W,S),restrictionworker(W2,D,To2),W == W2, D == D2, To == To2.

% there cannot be a schedule on a turn in which that space has restrictions
:- schedule(D,To,T,W,S),restrictionspace(S2,D,To2),S == S2, D == D2, To == To2.

% There cannot be a schedule in which a classroom is assigned and the capacity is exceeded.
:- schedule(D,To,T,W,S),taskSize(T,Si),spaceCapacity(S,Si2),Si > Si2.

%filter for only showing the schedules
#show schedule/5.
