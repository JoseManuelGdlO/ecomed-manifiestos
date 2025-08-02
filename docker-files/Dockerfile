# Dockerfile para MySQL Database
FROM mysql:8.0

# Variables de entorno para MySQL
ENV MYSQL_ROOT_PASSWORD=root123
ENV MYSQL_DATABASE=ecomed_db
ENV MYSQL_USER=ecomed_user
ENV MYSQL_PASSWORD=ecomed123

# Puerto expuesto
EXPOSE 3306

# Configuración adicional de MySQL
COPY mysql.cnf /etc/mysql/conf.d/mysql.cnf

# Script de inicialización (opcional)
COPY init.sql /docker-entrypoint-initdb.d/

# Comando para iniciar MySQL
CMD ["mysqld"] 