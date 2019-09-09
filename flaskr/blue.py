from flask import (
    Blueprint, flash, g, redirect,session, render_template, request, url_for, abort
)
from werkzeug.exceptions import abort

from flaskr.db import get_db

bp = Blueprint('blue', __name__)

@bp.route('/hello')
def hello():
    return 'Hello'

#获取排名
@bp.route('/rank',methods=('GET'))
def rank():
    username = session['nickname']
    openid = session['openid']
    error = None
    db = get_db()
    cursor = db.cursor()
    
    cursor.execute('SELECT username, time, times FROM user ORDER BY time,times LIMIT 15 ') 
    info = cursor.fetchall()
    #没人玩游戏
    if len(info) == 0:
        return {
            'all': None,
            'self': None
        }
    #有人, 结果为result,'打包'与用户无关的结果
    description = cursor.description
    des = []
    for i in description:
        des.append(i[0])
    result = []
    for i in info:
        result.append(dict(zip(des,i)))

    #个人是否存在
    cursor.execute('SELECT username, time, times FROM user WHERE openid=%s'% openid)
    exist = cursor.fetchone()

    if exist is None:
        return {
            'all':result,
            'self':None
        }
    #存在个人, 结果为self_result,'打包'
    description = cursor.description
    des = []
    for i in description:
        des.append(i[0])
    self_result = dict(zip(des, exist))
    #计算个人排名
    self_time = self_result['time']
    cursor.execute('SELECT COUNT(time) AS nums FROM user WHERE time<%d'%self_time)
    num = cursor.fetchone()
    num = num[0][0]
    self_result['rank'] = num + 1
    return {
        'all':result,
        'self':self_result
    }

#插入一个成绩
@bp.route('/insert', methods=('GET'))
def insert():
    times = request.args.get('times')
    time = request.args.get('time')
    openid = session['openid']
    username = session['nickname']
    db = get_db()
    cursor = db.cursor()

    #查询user
    cursor.execute('SELECT username, time, times FROM user WHERE openid =%s'%openid)
    exist = cursor.fetchone()
    #用户之前没有玩过游戏
    if len(exist) == 0:
        cursor.execute(
            'INSERT INTO user (username, time,times, openid) VALUES (?,?,?,?)',(username,time,lose,openid)
        )
        db.commit()
    #用户又一次玩了游戏
    else:
        description = cursor.description
        des = []
        for i in description:
            des.append(i[0])
        self_result = dict(zip(des,exist))

        past_time = self_result['time']
        past_times = self_result['times']

        if (past_time < time) or (past_time == time and past_times < times):
            pass
        else:
            cursor.execute(
                'UPDATE user SET time=%d, times=%d WHERE openid=%s'%(time,times,openid)
            )
            db.commit()
    #返回前3名和他 此时的信息(和排名)
    cursor.execute('SELECT username, time, times FROM user ORDER BY time,times LIMIT 3')
    description = cursor.description
    des = []
    for i in description:
        des.append(i[0])
    result = []
    for i in info:
        result.append(dict(zip(des,i)))
    cursor.execute('SELECT COUNT(time) AS nums FROM user WHERE time <%d'%time)
    num = cursor.fetchone()[0][0]
    self_result['rank'] = num + 1
    return {
        'all': result,
        'self':self_result
    }
