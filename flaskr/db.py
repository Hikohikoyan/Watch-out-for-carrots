
import pymysql
import click
from flask import current_app, g
from flask.cli import with_appcontext


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)

def init_db():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DROP TABLE IF EXISTS user")
    db.commit()
    cursor.execute("CREATE TABLE user ( id INT NOT NULL AUTO_INCREMENT , username VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL , time INT NOT NULL DEFAULT '10000000' , times INT NOT NULL DEFAULT '0' , openid VARCHAR(28) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL , PRIMARY KEY (id), UNIQUE (openid)) ENGINE = InnoDB")
    db.commit()

def get_db():

    if 'db' not in g:
        g.db = pymysql.connect(
            'localhost','root','BZbPqgB64dFeJsqq','game'
        )
    return g.db

@click.command('init-db')
@with_appcontext
def init_db_command():
    init_db()
    click.echo('Initialized the database')



def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()
