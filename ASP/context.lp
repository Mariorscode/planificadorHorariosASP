% Knowledge given by the user



% teacher(T).
% part(P).
% group(G).
% classroom(C).
% subject(S).
% 
% assignment(S,P,G,T,C).
% 
% day(D).
% tourn(TO).
% restrictionTeacher(T,D,TO).
% restrictionClassroom(C,D,TO).

teacher(T) :- teacher(T).
part(P) :- part(P).
group(G) :- group(G).
classroom(C) :- classroom(C).
subject(S) :- subject(S).

assignment(S,P,G,T,C) :- assignment(S,P,G,T,C).

day(D) :- day(D).
tourn(TO) :- tourn(TO).
restrictionTeacher(T,D,TO) :- restrictionTeacher(T,D,TO).
restrictionClassroom(C,D,TO) :- restrictionClassroom(C,D,TO).


