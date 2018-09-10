create table greetings(
	id serial not null primary key,
    greeted_names text not null,
    spotted_greetings int not null, 
    languages text
);

create table countGreet(
    count int not null,
    foreign key (count) references greetings(id)
);