#coding:utf-8
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
@bp.route('/rank',methods=('GET',))
def rank():
    username = '测试'
    openid = '123456'
    error = None
    db = get_db()
    cursor = db.cursor()
    
    cursor.execute('SELECT username, time, times FROM user WHERE time != 10000000 ORDER BY time,times LIMIT 15 ') 
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
    self_result = {}
    self_result = dict(zip(des, exist))
    #计算个人排名
    self_time = self_result['time']
    cursor.execute('SELECT COUNT(time) AS nums FROM user WHERE time<%d'%self_time)
    num = cursor.fetchone()[0]
    self_result['rank'] = num + 1
    self_result['username']=username
    return {
        'all':result,
        'self':self_result
    }

#插入一个成绩
@bp.route('/insert', methods=('GET',))
def insert():
    time = int(request.args.get('time'))
    openid = '测试'
    username = '123456'
    db = get_db()
    cursor = db.cursor()
    #查询user
    cursor.execute('SELECT username, time, times FROM user WHERE openid =%s'%openid)
    exist = cursor.fetchone()
    #用户之前没有玩过游戏
    self_result = {}
    if exist is None:
        if time == 0:
            cursor.execute(
                'INSERT INTO user (username, openid) VALUES ("%s","%s")' % (username,openid,)
            )
            db.commit()
            cursor.execute(
                'UPDATE user SET times = times+1 WHERE openid =%s'%openid
            )
            db.commit()

            cursor.execute(
                'SELECT COUNT(time) AS nums FROM user WHERE time<10000000'
            )
            num = cursor.fetchone()[0]
            self_result['times'] = 1
            self_result['username'] = username
            self_result['time'] = 10000000
            self_result['rank'] = num + 1
        else:
            cursor.execute(
                'INSERT INTO user(username,time,openid,) VALUES ("%s",%d,"%s")' %(username,time,openid,)
            )
            db.commit()
            cursor.execute(
                'SELECT COUNT(time) AS nums FROM user WHERE time<%d'%time
            )
            num = cursor.fetchone()[0]
            self_result['times'] = 0
            self_result['username'] = username
            self_result['time'] = time
            self_result['rank'] = num + 1
    #用户youwan了一次游戏
    else:
        description = cursor.description
        des = []
        for i in description:
            des.append(i[0])
        self_result = dict(zip(des,exist))

        if time == 0:
            cursor.execute(
                'UPDATE user SET times = times+1 WHERE openid=%s'%openid
            )
            db.commit()
            cursor.execute(
                'SELECT COUNT(time) FROM user WHERE time<%d'%self_result['time']
            )
            num = cursor.fetchone()[0]
            self_result['times']=self_result['times']+1
            self_result['rank']=num+1
            self_result['username'] = username
            self_result['time'] = self_result['time']
        else:
            past_time = self_result['time']
            if  past_time <= time :
                cursor.execute('SELECT COUNT(time) FROM user WHERE time<%d'%past_time)
                num = cursor.fetchone()[0]
                self_result['times']=self_result['times']
                self_result['rank'] = num + 1
                self_result['username']=username
                self_result['time']=past_time

            else:
                cursor.execute('UPDATE user SET time =%d WHERE openid=%s'%(time,openid))
                db.commit()
                cursor.execute('SELECT COUNT(time) FROM user WHERE time<%d'%time)
                num = cursor.fetchone()[0]
                self_result['times']=self_result['times']
                self_result['rank'] = num+1
                self_result['username']=username
                self_result['time']=time
    
    #返回前3ming
    cursor.execute('SELECT username, time, times FROM user WHERE time != 10000000 ORDER BY time,times LIMIT 3')
    description = cursor.description
    res = cursor.fetchall()

    des = []
    for i in description:
        des.append(i[0])
    result = []
    for i in res:
        result.append(dict(zip(des,i)))

    return {
        'all': result,
        'self':self_result
    }
