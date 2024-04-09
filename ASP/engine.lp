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

% 1 {schedule(D,To,S,P,G,T,C):day(D),turn(To),subject(S),part(P),group(G),teacher(T),classroom(C) } 1 :- turn(D,To).



1 {schedule(D,To,S,T,C):day(D),taskName(S),worker(T),space(C) } 1 :- turn(D,To).


% :- schedule(D, _, _, _, _), not availableDay(D). % no funciona

% No pueden existir en el mismo turno dos schedule con las mismas tags (dos opcines)

% Opcion 1 comprueba si la asignatura es la misma
%:- schedule(D1,To1,S1,T1,C1), tags(S1,Tag21,Tag31,Tag41),
%   schedule(D2,To2,S2,T2,C2), tags(S2,Tag22,Tag32,Tag42),
%   (S1, Tag21, Tag31, Tag41) == (S2, Tag22, Tag32, Tag42).
%   (D1, To1, S1, T1, C1) != (D2, To2, S2, T2, C2).

% Opcion 2 solo comprueba las tags sin el nombre de la asignatura
%:- schedule(D1,To1,S1,T1,C1), tags(S1,Tag21,Tag31,Tag41),
%   schedule(D2,To2,S2,T2,C2), tags(S2,Tag22,Tag32,Tag42),
%   Tag21 == Tag22, Tag31 == Tag32, Tag41 == Tag42,  
%   D1 == D2,To1 == To2.


% No se puede dar clase el mismo día en el mismo turno en la misma aula
% :- schedule(D1,To1,S1,T1,C1),schedule(D2,To2,S2,T2,C2),D1 == D2,To1 == To2,C1 == C2. % No funciona














% % no puede existir un schedule en un turno en el que ese profesor tenga restricciones
% :- schedule(D,To,S,P,G,T,C),restrictionTeacher(T2,D,To),T == T2, D == D2, To == T2.
% 
% % no puede existir un schedule en un turno en el que esa clase tenga restricciones
% :- schedule(D,To,S,P,G,T,C),restrictionClassroom(C2,D,To),C == C2, D == D2, To == T2.
% 
% % no puede exitir dos schedule iguales
% :- schedule(D,To,S,P,G,T,C),schedule(D2,To2,S2,P2,G2,T2,C2),S != S2. 
% 
% %(No puede existir un schedule con un assignment inexistente es decir que no 
% %tenga S,P,G,T,C de un assignment)
% % :- schedule(D,To,S,P,G,T,C),assignment(S2,P2,G2,T2,C2),S2. 
% 
% % No puede existir un schedule en el que se exceda el limite de turnos asignado
% 
% % :- schedule(D,To,S,P,G,T,C),
% 
% 
% % No puede existir un schedule en el que se asigne un aula y se exceda la capacidad 
% 
% :- schedule(D,To,S,P,G,T,C),groupSize(G,Si),classroomCapacity(C,Si2),Si > Si2.

#show schedule/5.