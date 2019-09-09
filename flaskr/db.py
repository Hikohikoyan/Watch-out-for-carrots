import pymysql
import os
from flask import  g



def init_app(app):
    app.teardown_appcontext(close_db)

def get_db():

    if 'db' not in g:
        g.db = pymysql.connect(
            'localhost','root','BZbPqgB64dFeJsqq','game'
        )
    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()
