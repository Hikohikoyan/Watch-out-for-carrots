import pymysql
import click
from flask import current_app, g
from flask.cli import with_appcontext


def init_app(app):
    #返回响应后调用此函数
    app.teardown_appcontext(close_db)

def get_db():
    if 'db' not in g:
        g.db = pymysql.connect(
            'localhost','root','Xhh12345','game'
        )
    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()
