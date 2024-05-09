% -------------Rules for the schedule generation----------------


% Generate the turns depending on the number of turns per day
turn(D, 1..NUM_TURNS) :- day(D),  not unavailableDay(D), turnsPerDay(NUM_TURNS).


% Generate the schedules for the tasks that are schedulable
1 {schedule(D,To,S,T,C):turn(D,To),taskName(S),worker(T),space(C)} 1 :- schedulableTask(S,T,C).



% there cannot be a schedule in an unavailable day
:- schedule(D, _, _, _, _), unavailableDay(D).
%
%  Two schedules cannot have the same tags and be in the same day and turn
:- schedule(D1,To1,S1,T1,C1), tags(S1,_,Tag31,Tag41),
   schedule(D2,To2,S2,T2,C2), tags(S2,_,Tag32,Tag42),
   S1!=S2,Tag31==Tag32,Tag41==Tag42,D1 == D2, To1 == To2.

% Two schedules cannot have the same space and be in the same day and turn
:- schedule(D1,To1,S1,_,C1),
   schedule(D2,To2,S2,_,C2),
   S1!=S2, D1 == D2, To1 == To2, C1 == C2.

% Two schedules cannot have the same worker and be in the same day and turn
:- schedule(D1,To1,S1,T1,_),
   schedule(D2,To2,S2,T2,_),
   S1!=S2,T1 == T2,D1 == D2, To1 == To2.

% there cannot be a schedule on a turn in which that worker has restrictions
:- schedule(D,To,S,T,C),restrictionworker(T2,D,To2),T == T2, D == D2, To == To2.

% there cannot be a schedule on a turn in which that space has restrictions
:- schedule(D,To,S,T,C),restrictionspace(C2,D,To2),C == C2, D == D2, To == To2.

% There cannot be a schedule in which a classroom is assigned and the capacity is exceeded.
:- schedule(D,To,S,T,C),taskSize(S,Si),spaceCapacity(C,Si2),Si > Si2.

%filter for only showing the schedules
#show schedule/5.
