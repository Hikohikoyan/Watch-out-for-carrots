#coding:utf-8
import os
from flask import Flask
from flask_cors import *

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__)
    app.config['DEBUG'] = false
    CORS(app,resources=r'/*')
    from . import db
    db.init_app(app)

    from . import blue
    app.register_blueprint(blue.bp)

    return app

