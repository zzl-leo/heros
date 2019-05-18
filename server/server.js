const express = require('express');
const server = express();
const cors = require('cors');               //跨域请求处理
const moment = require('moment');           //时间处理    
server.use(cors());

const bodyparser = require('body-parser');  //post请求体
server.use(bodyparser.urlencoded({ extended: false }));

const mysql = require('mysql');    //数据库
const conn = mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'root',
    database:'node_demo'
});

// 托管静态资源；
server.use(express.static('../web'));
server.use(express.static('../node_modules'));

conn.connect();
// 获取所有英雄
server.get('/api/getheros',function(req,res){
    const sqlStr = 'select * from heros where isdel = 0';
    conn.query(sqlStr,function(err,results){
        if(err) {
            return res.json({
                err_code:1,
                message:'数据调用失败',
                affectedRows:0
            })
        }else {
            res.json({
                err_code:0,
                message:results,
                affectedRows:0
            })
        }
    })
});

// 根据Id更新指定的英雄信息
server.post('/api/updatehero',function(req,res){
    const sqlStr = 'update heros set ? where id = ?';
    // console.log(req.body);
    // res.send('ok');
    
    conn.query(sqlStr,[req.body,req.body.id],function(err,results){
        if(err) {
            return res.json({
                err_code:1,
                message:'数据更新失败',
                affectedRows:0
            })
        }else {
            res.json({
                err_code:0,
                message:results,
                affectedRows:0
            })
        }
    })
});

// 根据Id获取指定的英雄信息
server.get('/api/gethero',function(req,res){
    const sqlStr = 'select * from heros where id = ?';
    const id = req.query.id

    
    conn.query(sqlStr,id,function(err,results){
        if(err) {
            return res.json({
                err_code:1,
                message:'数据查询失败',
                affectedRows:0
            })
        }else {
            res.json({
                err_code:0,
                message:results,
                affectedRows:0
            });
        }
    })
});


// 根据Id删除指定的英雄信息（软删除）
server.get('/api/delhero',function(req,res){
    const sqlStr = 'update heros set isdel = 1 where id = ?';
    const id = req.query.id
    
    conn.query(sqlStr,id,function(err,results){
        if(err) {
            return res.json({
                err_code:1,
                message:'数据删除失败',
                affectedRows:0
            })
        }else {
            res.json({
                err_code:0,
                message:results,
                affectedRows:0
            });
        }
    })
});

// 添加英雄
server.post('/api/addhero',function(req,res){
    const sqlStr = 'insert into heros set ?';
    // console.log(req.body);
    // res.send('ok');
    const hero = req.body;
    hero.ctime = moment().format('YYYY-MM-DD HH:mm:ss');
    
    conn.query(sqlStr,hero,function(err,results){
        if(err) {
            return res.json({
                err_code:1,
                message:'数据新增失败',
                affectedRows:0
            })
        }else {
            res.json({
                err_code:0,
                message:results,
                affectedRows:0
            })
        }
    })
});

server.listen('5000',function(){
    console.log('http://127.0.0.1:5000');
})