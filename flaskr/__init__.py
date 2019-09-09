import os
from flask import Flask

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__)
    
    from . import db
    db.init_app(app)

    from . import blue
    app.register_blueprint(blue.bp)

    return app

