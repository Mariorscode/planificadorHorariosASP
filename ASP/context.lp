% Knowledge given by the user



% teacher(T).
% part(P).
% group(G).
% classroom(C).
% subject(S).

assignment(S,P,G,T,C) :- teacher(T),part(P),group(G),classroom(C),subject(S).

% day(D).
% tourn(TO).

restrictionTeacher(T,D,TO) :- turn(TO),day(D),teacher(T).
restrictionClassroom(C,D,TO) :- turn(TO),day(D),classroom(C).



