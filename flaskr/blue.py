from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for
)
from werkzeug.exceptions import abort

from flaskr.db import get_db

bp = Blueprint('blue', __name__)

@bp.route('/hello')
def hello():
    return 'Hello'


@bp.route('/rank',methods=('POST','GET'))
def rank():
    if request.method == 'GET':
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT * FROM user')
        description = cursor.description
        des = []
        for i in description:
            des.append(i[0]) 
        rank = cursor.fetchall()
        result = []
        for i in rank:
            result.append(dict(zip(des,i)))
        return{
            'all':result
        }

    username = request.form['username']
    error = None
    db = get_db()
    cursor = db.cursor()
    #名字是空
    if username.strip() == '':
        error = 'Invalid username'
        raise KeyError
    
    cursor.execute('SELECT * FROM user ORDER BY time ASC')
    description = cursor.description
    des = []
    for i in description:
        des.append(i[0]) 
    info = cursor.fetchall()

    #没人玩游戏
    if len(info) == 0:
        return {
            'all': None,
            'self': None
        }
    #有人
    result = []
    for i in info:
        result.append(dict(zip(des,i)))

    #可能存在个人信息
    self_rank = 1
    self_info = None
    exist = False

    for item in result:
        if username == item['username']:
            self_info = item
            exist = True
            break
        else:
            self_rank = self_rank + 1

    #查找完毕,锁定rank
    if len(result) >= 15:
        result = result[0:15]
    else:
        result = result
    
    #不存在个人
    if exist == False:
        return {
            'all':result,
            'self':None
        }
    return {
        'all':result,
        'self':{
            'self_rank':self_rank,
            'self_info':self_info
        }
    }

@bp.route('/insert', methods=('POST','GET'))
def insert():
    if request.method == 'POST':
        username = request.form['username']
        time = int(request.form['time'])
        lose = int(request.form['times'])
        db = get_db()
        cursor = db.cursor()

        error = None
        #名字是空
        if username.strip() == '':
            error = 'Invalid username'
            raise KeyError

        #查询user
        cursor.execute('SELECT * FROM user WHERE username = %s',(username))
        user = cursor.fetchone()
        #用户之前没有玩过游戏
        if user is None:
            cursor.execute(
                'INSERT INTO user (username, time,times) VALUES (?,?,?)',(username,time,lose,)
            )
            
            db.commit()
            return redirect(url_for('username',username=username))

        #用户又一次玩了游戏
        else:
            cursor.execute(
                'UPDATE user SET time=%d, times=%d WHERE username="%s"'%(time,lose,username)
            )
            db.commit()
            return redirect(url_for('blue.username',username=username))
    return make_response(404)

#返回前3名和他此时的排名
@bp.route('/<path:username>')
def username(username):
    db = get_db()
    cursor = db.cursor()

    cursor.execute('SELECT * FROM user ORDER BY time ASC ')
    description = cursor.description
    des = []
    for i in description:
        des.append(i[0]) 
    
    info = cursor.fetchall()
    rank = []
    for i in info:
        rank.append(dict(zip(des,i)))
    
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
