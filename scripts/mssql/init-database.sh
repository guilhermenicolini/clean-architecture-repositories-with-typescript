#!/usr/bin/env bash
while true
do
  /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P $MSSQL_SA_PASSWORD -d master -Q "SELECT 1"
  if [ $? -eq 0 ]
  then
    break
  fi
done

echo "process scripts..."
for filename in /docker-entrypoint-initdb.d/*.sql; do
  /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P $MSSQL_SA_PASSWORD -d master -i $filename
done
