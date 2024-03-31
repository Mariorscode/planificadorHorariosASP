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

:- schedule(D,To,S,P,G,T,C),schedule(D2,To2,S2,P2,G2,T2,C2),S != S2. 

% no puede existir un schedule en un turno en el que ese profesor tenga restricciones
:- schedule(D,To,S,P,G,T,C),restrictionTeacher(T2,D,To),T == T2, D == D2, To == T2.



% :- schedule(D,To,S,P,G,T,C),assignment(S2,P2,G2,T2,C2),S2. (No puede existir un schedule con un assignment inexistente es decir que no 
%tenga S,P,G,T,C de un assignment)








% schedule(D,To,S,P,G,T,C) :- day(D),turn(To),
% restrictionTeacher(T,D2,To2),restrictionClassroom(C,D3,To3),group(G),part(P),subject(S),
% D2 != D,To2 != To,D3 != D,To != To3.

% :- classroom(C,Si),groupSize(G,Si2),Si2>Si.
% :- schedule(D,To,S,P,G,T,C),schedule(D2,To2,S2,P2,G2,T2,C2),D == D2, To == To2.

