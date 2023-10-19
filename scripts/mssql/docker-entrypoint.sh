#!/usr/bin/env bash
set -m
/opt/mssql/bin/sqlservr & /usr/local/bin/init-database.sh
fg

