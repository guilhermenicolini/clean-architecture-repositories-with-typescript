FROM mcr.microsoft.com/mssql/server:2019-latest

USER root

RUN mkdir /docker-entrypoint-initdb.d

COPY docker-entrypoint.sh /usr/local/bin/
COPY init-database.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/init-database.sh

USER mssql

CMD /bin/bash /usr/local/bin/docker-entrypoint.sh
