

% --------------------------------------------------------------------------------------------------------------
% --------------------------------------------------------------------------------------------------------------
% PROBAR A PONER EL LIMITE SUMANDO 1 Y LUEGO UNA REGLA DE SI TIENE MAYOR QUE EL NUMERO SEGUN SU TAG QUITAR O DEJAR
% PONER LOS SCHEDULE COMO NULOS LOS VALORES PARA LOS DÍAS QUE QUEDEN LIBRES EN CASO DE HACER LA COMBINATORIA PARA TURNOS
% --------------------------------------------------------------------------------------------------------------
% --------------------------------------------------------------------------------------------------------------

% asiged(S) :- schedule(_,_,S,_,_). 

% 1 {schedule(D,To,S,T,C):day(D),taskName(S),worker(T),space(C)} 1 :- turn(D,To),not asigned(S).
1 {schedule(D,To,S,T,C):day(D),taskName(S),worker(T),space(C)} 1 :- turn(D,To).



% 1 {schedule(D,To,S,T,C):taskName(S),worker(T),space(C) } 1 :- schedulableTask(S,T,C).

% 1 {schedule(D,To,S,T,C):taskName(S),worker(T),space(C) } 1 :- schedulableTask(S,T,C),turn(D,To).



% ------------Contar numero de schedules iguales para no superar 2 o el limite establecido (para teoria seran 2 para practicas 1)

%#count{ 1 : schedule(D1,To1,S1,T1,C1): schedule(D2,To2,S2,T2,C2); D1 : D2; To1 : To2; S1 : S2; T1 : T2; C1 : C2 } = Count.

%{ schedule(D,To,S,T,C) : schedule(D,To,S,T,C), not schedule(D,To,S,T,C1), To < To } = 2 :- Count > 2.

% #count { schedule(D, To, S, T, C) : day(D), taskName(S), worker(T), space(C) } = N :- turn(D, To).
% :- N > 2.
% :- { schedule(D, To, S, T, C) : day(D), taskName(S), worker(T), space(C) } > 2.


% ------------\Contar numero de schedules iguales para no superar 2 o el limite establecido (para teoria seran 2 para practicas 1)

% No puede existir un schedule con worker, taskName y space no compatibles
% :- schedule(D,To,S,T,C), not schedulableTask(S, T, C).
 

% :- schedule(D, _, _, _, _), not availableDay(D). % no funciona
% 
%  No pueden existir en el mismo turno dos schedule con las mismas tags (dos opcines)
%  Opcion 1 comprueba si la asignatura es la misma
% :- schedule(D1,To1,S1,T1,C1), tags(S1,Tag21,Tag31,Tag41),
%    schedule(D2,To2,S2,T2,C2), tags(S2,Tag22,Tag32,Tag42),
%    (S1, Tag21, Tag31, Tag41) == (S2, Tag22, Tag32, Tag42).
%    (D1, To1, S1, T1, C1) != (D2, To2, S2, T2, C2).
%    
%  Opcion 2 todo es igual menos el nombre de la asignatura por lo que no puede ser.
%  :- schedule(D,To,S1,T,C), tags(S1,_,_,_),
%     schedule(D,To,S2,T,C), tags(S2,_,_,_),
%     S1!=S2.
%   
%  :- schedule(D1, To, S1, _, C), tags(S1, Tag1, Tag2, Tag3),
%     schedule(D2, To, S2, _, C), tags(S2, Tag1, Tag2, Tag3),
%     S1 != S2.
% 
% 
% No se puede dar clase el mismo día en el mismo turno en la misma aula
% :- schedule(D1,To1,S1,T1,C1),schedule(D2,To2,S2,T2,C2),D1 == D2,To1 == To2,C1 == C2. % No funciona



% no puede existir un schedule en un turno en el que ese trabajador tenga restricciones

:- schedule(D,To,S,T,C),restrictionworker(T2,D,To2),T == T2, D == D2, To == To2. % --funciona

% no puede existir un schedule en un turno en el que ese espacio tenga restricciones

:- schedule(D,To,S,T,C),restrictionspace(C2,D,To2),C == C2, D == D2, To == To2. % --funciona




% % No puede existir un schedule en el que se asigne un aula y se exceda la capacidad 
% -------------RENOVAR A NUEVAS VARIABLES--------------------------------------------
% :- schedule(D,To,S,P,G,T,C),groupSize(G,Si),classroomCapacity(C,Si2),Si > Si2.

#show schedule/5.