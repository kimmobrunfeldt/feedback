#!/bin/bash

psql -a -f ./tools/drop-db.sql
psql -a -f ./tools/init-db.sql
./node_modules/.bin/knex migrate:latest
