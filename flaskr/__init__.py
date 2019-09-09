import os
from flask import Flask, request, after_this_request,g
from . import db
from flaskr.db import get_db

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__)

    db.init_app(app)

    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    @app.route('/rank',methods=(['POST']))
    def rank():
        db = get_db()
        cursor = db.cursor()

        username = request.form['username']
        error = None

        #名字是空
        if username.strip() is '':
            error = 'Invalid username'
            raise KeyError

        #查询所有
        cursor.execute('SELECT * FROM user ORDER BY time DESC')
        rank = cursor.fetchall()

        #没人玩游戏
        if rank is None:
            return {
                'all': None,
                'self': None
            }

        #可能存在个人信息
        self_rank = 1
        self_info = None
        exist = False

        for item in rank:
            if username == item['username']:
                self_info = item
                exist = True
                break
            else:
                self_rank = self_rank + 1

        #查找完毕,锁定rank
        if len(rank) >= 15:
            rank = rank[0:15]
        else:
            rank = rank
        
        #不存在个人
        if exist is False:
            return {
                'all':rank,
                'self':None
            }
        return {
            'all':rank,
            'self':{
                'self_rank':self_rank,
                'self_info':self_info
            }
        }

    @app.route('/insert', methods=(['POST']))
    def insert():
        username = request.form['username']
        time = request.form['time']
        lose = request['times']
        db = get_db()
        cursor = db.cursor()

        error = None
        #名字是空
        if username.strip() is '':
            error = 'Invalid username'
            raise KeyError

        #查询user
        cursor.execute('SELECT * FROM user WHERE username = %s',(username))
        user = cursor.fetchone()
        #用户之前没有玩过游戏
        if user is None:
            cursor.execute(
                'INSERT INTO user (username, time,lose) VALUES (?,?,?)',(username,time,lose,)
            )
            db.commit()
            return redirect(url_for('username',username=username))

        #用户又一次玩了游戏
        else:
            cursor.execute(
                'UPDATE user SET time= ?, lose= ? WHERE username= ?',(time, lose,username,)
            )
            db.commit()
            return redirect(url_for('username',username=username))

    #返回前3名和他此时的排名
    @app.route('/<path:username>')
    def username(username):
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT * FROM user ORDER BY time DESC ')
        rank = cursor.fetchall()

        self_rank = 1
        self_info = None

        for item in rank:
            if username == item['username']:
                self_info = item
                break
            else:
                self_rank = self_rank + 1
        #查找完毕,锁定rank
        if len(rank) >= 3:
            rank = rank[0:3]
        else:
            rank = rank
        
        return{
            'all':rank,
            'self':{
                'self_rank':self_rank,
                'self_info':self_info
            }
        }
    return app

