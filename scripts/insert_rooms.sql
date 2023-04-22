
CREATE TABLE IF NOT EXISTS "tblRooms" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL,
    privilege INTEGER NOT NULL
);

CREATE INDEX idx_privilege ON "tblRooms" (privilege);

INSERT INTO "tblRooms" (name, url, capacity, privilege) 
VALUES ('RM116', 'http://calendar.google.com/calendar/r?cid=c_18892kskagh6khq5ie244ejemu20a@resource.calendar.google.com', 6, 1);

INSERT INTO "tblRooms" (name, url, capacity, privilege) 
VALUES ('RM120', 'http://calendar.google.com/calendar/r?cid=c_18857krhc40eejk5molu6feh8dbcc@resource.calendar.google.com', 6, 1);

INSERT INTO "tblRooms" (name, url, capacity, privilege) 
VALUES ('RM129A', 'http://calendar.google.com/calendar/r?cid=west.cmu.edu_2d34383337323335352d383031@resource.calendar.google.com', 6, 1);

INSERT INTO "tblRooms" (name, url, capacity, privilege) 
VALUES ('RM129B', 'http://calendar.google.com/calendar/r?cid=west.cmu.edu_2d34383231323435382d333231@resource.calendar.google.com', 6, 1);

INSERT INTO "tblRooms" (name, url, capacity, privilege) 
VALUES ('RM224', 'http://calendar.google.com/calendar/r?cid=c_188dqu93ks628hq1ncd7m3euj8s0s@resource.calendar.google.com', 6, 2);

INSERT INTO "tblRooms" (name, url, capacity, privilege) 
VALUES ('RM228', 'http://calendar.google.com/calendar/r?cid=west.cmu.edu_3634303838363838313536@resource.calendar.google.com', 6, 2);

INSERT INTO "tblRooms" (name, url, capacity, privilege) 
VALUES ('RM230', 'http://calendar.google.com/calendar/r?cid=west.cmu.edu_35363936313337362d363937@resource.calendar.google.com', 6, 2);
