time(1..4).
driver(max).
driver(john).
driver(anna).

item(1..6).
 
1 { assignment(I, D, T) : driver(D), time(T) } 1 :- item(I).
:- assignment(I1, D, T), assignment(I2, D, T), I1 != I2.
 
% working_driver(D) :- assignment(_,D,_).
 
#show assignment/3.
 
% #minimize { 1@2,D : working_driver(D) }.
% #minimize { T@1,D : assignment(_,D,T) }.
