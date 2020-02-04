# Php 与 MySql 开发入门下

## MySQL 数据库客户端基础

```plain
//登录mysql
本地：mysql -u root -p, 回车后输入密码; 也可以p后不加空格，直接加密码。回车就登录了
远程：mysql -hxx.xx.xx.xx -u -pxxx
//创建数据库语句
create database if not exists 数据库名 default charset utf8 collate utf8_general_ci;
//显示数据库
show databases;
```

## MySQL 创建表

```plain
//连接数据库   管理命令
use db_name;
//创建数据库表
create table `数据库名`,`数据表名`（
    `字段名` 类型  是否非空 自动增长  注释 
）;
```

## MySQL 函数 SQL 语句

```plain
//查询语句
查所有    select * from 表名
条件查    select * from 表名 where 字段名 = 值;
//插入语句
insert into 表名 values("","","","","");
//修改语句
update 表名 set 属性 = 值 where 属性 =  值
//删除语句
delete from 表名 where 属性 = 值；
//count函数—查数量
select count(*) from 表名 where 字段名 = 值;
//min函数—求最小值
SELECT min(`字段名`) FROM `表名` WHERE 1
//max函数—求最大值
SELECT max(`字段名`) FROM `表名` WHERE 1
//sum函数—求和
SELECT sum(`字段名`) FROM `表名` WHERE 1
//sqrt函数—求平方根
SELECT sqrt(`字段名`) FROM `表名` WHERE 1
//first函数—符合条件的第一个
SELECT first(*) FROM `表名` WHERE 1
//last函数—符合条件的最后一个
SELECT last(*) FROM `表名` WHERE 1
//len函数—求长度
SELECT len(*) FROM `表名` WHERE 1
//now函数—显示当前的时间
select now();
//rand函数—得到一个随机数 返回0-1之间的任意一个数字
select rand();
-- 可以通过乘一个数达到想要的范围
select rand() *100;
//concat函数—拼接字符串
select concat('AAA','BBB');
```

## MySQL 条件查询

```plain
//范围查询
1、select * FROM 表名 where 字段名 >= '2002-01-01' AND 字段名 <= '2004-01-01';
2、select * from 表名 where 字段名 between '2002-01-01' and '2004-01-01'
                between--and：在谁和谁之间
 //筛选查询  like 模糊匹配 %叫通配符。
 select * from 表名 where 字段名 like '%王%'
```

## MySQL 复杂的查询

```plain
//order by子句
select * from 表名 order by 字段名 ASC;  默认正序排序 ASC（可被省略）
select * from 表名 order by 字段名 DESC;  逆序排序  DESC
//多表联查
//两表联查，查询两个表，通过where子句把两个表中相同的字段关联起来
select 表1字段名,表2字段名 from 表1,表2 where 表1字段名 = 表2字段名


```

