% Knowledge given by the user

teacher(philipp).
teacher(manuel).
teacher(luis).
teacher(juanCarlos).
teacher(santiago).
teacher(fernandoGalvez).
teacher(franciscoJavier).

part(theory).
part(practice).

group(group).
group(groupA).
group(groupC).

classroom("1.4").
classroom("14-15").
classroom("1.1.1").
classroom("17-18").

subject(calculo).
subject(programacion).
subject(teco).
subject(empresas).
subject(fisica).

% -----------------------------------------------

% classroomCapacity(c,size) :- classroom(c).

classroomCapacity("1.4",60) :- classroom("1.4").
classroomCapacity("14-15",20) :- classroom("14-15").
classroomCapacity("1.1.1",20) :- classroom("1.1.1").
classroomCapacity("17-18",20) :- classroom("17-18").

% groupSize(group,size) :- group(group).

groupSize(group,60) :- group(group).
groupSize(groupA,20) :- group(groupA).
groupSize(groupB,20) :- group(groupB).
groupSize(groupC,20) :- group(groupC).

% numberOfTurns(S,P,2) :- subject(S),part(P) 
% one turn count as the same if it owns to diferent groups

numberOfTurns(calculo,2) :- subject(calculo),part(theory).
numberOfTurns(programacion,2) :- subject(programacion),part(theory).
numberOfTurns(teco,2) :- subject(teco),part(theory).
numberOfTurns(empresas,2) :- subject(empresas),part(theory).
numberOfTurns(fisica,2) :- subject(fisica),part(theory).

numberOfTurns(calculo,1) :- subject(calculo),part(practice).
numberOfTurns(programacion,1) :- subject(programacion),part(practice).
numberOfTurns(teco,1) :- subject(teco),part(practice).
numberOfTurns(empresas,1) :- subject(empresas),part(practice).
numberOfTurns(fisica,1) :- subject(fisica),part(practice).


% assignment(S,P,G,T,C) :- teacher(T),part(P),group(G),subject(S).

assignment(philipp,theory,group,calculo) :- teacher(philipp),part(theory),group(group),subject(calculo).
assignment(philipp,practice,groupA,calculo) :- teacher(philipp),part(practice),group(groupA),subject(calculo).
assignment(philipp,practice,groupB,calculo) :- teacher(philipp),part(practice),group(groupB),subject(calculo).
assignment(philipp,practice,groupC,calculo) :- teacher(philipp),part(practice),group(groupC),subject(calculo).

assignment(luis,theory,group,programacion) :- teacher(luis),part(theory),group(group),subject(programacion).
assignment(manuel,practice,groupA,programacion) :- teacher(manuel),part(practice),group(groupA),subject(programacion).
assignment(manuel,practice,groupB,programacion) :- teacher(manuel),part(practice),group(groupB),subject(programacion).
assignment(luis,practice,groupC,programacion) :- teacher(luis),part(practice),group(groupB),subject(programacion).

assignment(juanCarlos,theory,group,teco) :- teacher(juanCarlos),part(theory),group(group),subject(teco).
assignment(juanCarlos,practice,groupA,teco) :- teacher(juanCarlos),part(practice),group(groupA),subject(teco).
assignment(juanCarlos,practice,groupB,teco) :- teacher(franciscoJavier),part(practice),group(groupB),subject(teco).

assignment(santiago,theory,group,empresas) :- teacher(santiago),part(theory),group(group),subject(empresas).
assignment(santiago,practice,groupA,empresas) :- teacher(santiago),part(practice),group(groupA),subject(empresas).
assignment(santiago,practice,groupB,empresas) :- teacher(santiago),part(practice),group(groupB),subject(empresas).

assignment(fernandoGalvez,theory,group,fisica) :- teacher(fernandoGalvez),part(theory),group(group),subject(fisica).
assignment(fernandoGalvez,practice,groupA,fisica) :- teacher(fernandoGalvez),part(practice),group(groupA),subject(fisica).
assignment(fernandoGalvez,practice,groupB,fisica) :- teacher(fernandoGalvez),part(practice),group(groupB),subject(fisica).
assignment(fernandoGalvez,practice,groupC,fisica) :- teacher(fernandoGalvez),part(practice),group(groupC),subject(fisica).


% restrictionTeacher(T,D,TO) :- turn(TO),day(D),teacher(T).

restrictionTeacher(philipp,monday,4) :- teacher(philipp),day(monday),turn(4).
restrictionTeacher(juanCarlos,tuesday,4) :- teacher(juanCarlos),day(tuesday),turn(4).
restrictionTeacher(philipp,friday,0) :- teacher(philipp),day(friday),turn(0).





% restrictionClassroom(C,D,TO) :- turn(TO),day(D),classroom(C).



