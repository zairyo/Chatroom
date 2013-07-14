var fs=require('fs'),
	querystring=require('querystring'),
	url=require('url'),
	session=require('./session'),
	handler=require('./handler');

function route(req,res,path){
	
	var pathName={
		'/':'./logn.html',
		'/chatroom.html':'.'+path,
		'/logn.html':'.'+path
		},
		Ext=path.slice(path.indexOf('.'),path.length-1),
		cookies=querystring.parse(req.headers.cookie,';');

		if (pathName[path]){
			req.path=pathName[path];
			req.cookie=cookies;
			console.log(req.cookie);
			req.session=session.judge(cookies['sid'])?session.get(cookies['sid']):session.create(cookies['sid']);
			console.log(req.session);
			handler.handle(req,res,Ext,0)}
		else{
			req.path='.'+path;
			req.session={};
			req.session.sid='';
			handler.handle(req,res,Ext,1);
		}
};

exports.route=route;