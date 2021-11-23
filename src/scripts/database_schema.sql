create database milly_hairdressing;
use milly_hairdressing;

# database schema.

create table user_types (
	id int unsigned primary key auto_increment,
    type_name varchar(64) not null unique,
    type_code varchar(64) not null unique
);

create table users (
	id int unsigned primary key auto_increment,
    user_type_id int unsigned not null,
    firstname varchar(64) not null,
    lastname varchar(64) not null,
    email varchar(100) not null,
    phone_number varchar(15),
    passwd varchar(255) not null,
    is_active tinyint not null default 1,
    
    foreign key(user_type_id) references user_types(id)
);

create table services (
	id int unsigned primary key auto_increment,
    service_name varchar(100) not null,
    cost float(10,2) not null,
    service_description text not null,
    short_description varchar(100) not null,
    service_duration int unsigned not null,
    is_active tinyint not null default 1
);

create table reservations (
	id int unsigned primary key auto_increment,
    user_id int unsigned not null,
    service_id int unsigned not null,
    reservation_date date not null,
	start_time time not null,
    end_time time not null,
    
    foreign key(user_id) references users(id),
    foreign key(service_id) references services(id)
);

# initial setup

insert into 
	user_types(type_name, type_code)
    values
		("Administrador", "admin"),
        ("Estilista", "hairdresser"),
		("Cliente", "customer");
        