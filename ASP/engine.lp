turn(To).
day(D).
assignment(S,P,G,T,C).

schedule(D,To,S,P,G,T,C) :- day(D),turn(To)
restrictionTeacher(T,D2,To2),restrictionClassroom(C,D3,To3),
D2 != D,To2 != To,D3 != D,To != To3.