insert into traeger (name)
values('Feuerwehr');

insert into benutzer (einkaeufer, mail, password, name, traeger_id)
values(false, 'test@domain.de', '$2a$12$7w0m4I2kjbQgM0hp0erh4OXqEoBxeYqNoaLUZKpiaISqnIcw91t3i', 'Superuser', (select max(id) from traeger));

-- Konfiguration der Token
insert into tokenconfig (issuer, expiration, clock, secret)
values ('wbs', 86400, 300, 'secret');

-- Festlegen der Rollengruppen für die Anwendung
insert into authority (id, code, bezeichnung, aktiv)
values(1, 'ADMIN', 'Trägeradministration', false);
insert into authority (id, code, bezeichnung, aktiv)
values(2, 'CONTROL','Administration', true);
insert into authority (id, code, bezeichnung, aktiv)
values(3, 'MANAGE','Kleiderverwaltung', true);
insert into authority (id, code, bezeichnung, aktiv)
values(4, 'WRITE','Kleiderbuchung', true);
insert into authority (id, code, bezeichnung, aktiv)
values(5, 'READ','Lesender Zugriff', true);

insert into granted_authority (user_id, authority_id)
values ((select id from benutzer where name = 'Superuser'), 1);

commit;