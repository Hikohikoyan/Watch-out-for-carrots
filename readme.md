# 秋招页面的类扫雷小游戏 “小心胡萝卜”

### Rule:

1. 不能踩到胡萝卜（地雷）
2. 短时间内找齐地图内的白萝卜（最多10个）
3. 随着游戏时间变长，胡萝卜会变多，白萝卜会变少
4. 游戏结束→失败次数 成功用时（排行榜 如果来得及）



隐藏内容（随机）

1.草地下可能有部门邀请卡（死局的时候 点直接报名按钮续命（既不算失败）同时成功的话就-1s

2.解锁成就：乱点出奇迹（5s内点了7次）

3.解锁成就：就爱胡萝卜（失败了3次）

————————————————————————————————

现在的问题：

1.preload.js没有生效 

2.进入开始游戏以后 地图布置颜色没有实现  

3.点击胡萝卜不能展示出来

4.gameover以后还是能玩

5.排行榜innerText还是undefined 但是console有内容

6.部门邀请还没做

7.完成游戏后的展示（小型排行榜）还没实现









排行榜：

前端：

1.post 传username/openid（直接查看排行榜）

2.post 传username/openid+time(成功用时)/失败次数     →(在提交游戏成绩时自动显示排行榜)

获取==========

1.对应获取 前15名的   名次+username+time(成功用时)+times(失败的次数)   和当前用户的实际名次+成功用时+失败次数

2.对应获取 前3名的   名次+username+time(成功用时)+times(失败的次数)   和当前用户的实际名次+成功用时+失败次数

后端:
1. '/insert' 游戏结束后立即显示排名
	返回字典对象
	
	键值'all' : 前三名的信息, 数组类型, 每一项代表一名,类型是字典对象
		其中键值‘username' ,'time', 'times'分别代表用户名，游戏时间，游戏失败次数
	
	键值'self':游戏结束后个人信息, 字典类型
		其中键值'username','time','times','rank'分别代表

		用户名，游戏时间，游戏失败次数，和他这一次的排名
2. '/rank' 点击排行榜查看排名

	返回字典对象

	键值’all' :前15名的信息，数组类型，同上

	键值'self':同上

3. 补充:
实际情况下由于访问'/insert'时此人已经玩过了游戏，
所以'all','self'不为空，但是’all'数组长度可能小于15个

实际情况下访问'/rank'时此人可能没有玩游戏，
所以‘all','self'都可能是空(null),
并且’all'的长度可能小于15
