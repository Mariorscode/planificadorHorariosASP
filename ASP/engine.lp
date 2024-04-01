% turn(To).
% day(D).
% subject(S).
% part(P).
% group(G).
% teacher(T).
% classroom(C).
% 
% 
% assignment(S,P,G,T,C).

1 {schedule(D,To,S,P,G,T,C):day(D),turn(To),subject(S),part(P),group(G),teacher(T),classroom(C) } 1 :- day(D),turn(To).


% no puede existir un schedule en un turno en el que ese profesor tenga restricciones
:- schedule(D,To,S,P,G,T,C),restrictionTeacher(T2,D,To),T == T2, D == D2, To == T2.

% no puede existir un schedule en un turno en el que esa clase tenga restricciones
:- schedule(D,To,S,P,G,T,C),restrictionClassroom(C2,D,To),C == C2, D == D2, To == T2.

% no puede exitir dos schedule iguales
:- schedule(D,To,S,P,G,T,C),schedule(D2,To2,S2,P2,G2,T2,C2),S != S2. 

%(No puede existir un schedule con un assignment inexistente es decir que no 
%tenga S,P,G,T,C de un assignment)
% :- schedule(D,To,S,P,G,T,C),assignment(S2,P2,G2,T2,C2),S2. 

% No puede existir un schedule en el que se exceda el limite de turnos asignado

% :- schedule(D,To,S,P,G,T,C),


% No puede existir un schedule en el que se asigne un aula y se exceda la capacidad 

:- schedule(D,To,S,P,G,T,C),groupSize(G,Si),classroomCapacity(C,Si2),Si > Si2.
