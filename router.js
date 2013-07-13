var fs=require('fs');
	events=require('events');
	mime=require('./mime');
	querystring=require('querystring');
	session=require('./session');

function Error(res){
	res.writeHead(404);
	res.end('404 Not Found');
};

function route(req,res,path){
	
	var pathName={
		'/':__dirname+path+'logn.html',
		'/chatroom.html':__dirname+path,
		'/logn.html':__dirname+path
		},
		event=new events.EventEmitter();
		Ext='';		
		
	function count(obj){
		var c=0;
		for (i in obj){
			if (obj.hasOwnProperty(i)){c++}
		};
		return c;
	};
	
	if (pathName[path]){
		fs.readFile(pathName[path],function(err,data){
			console.log(pathName[path]);
			if(err){return Error(res);};
			
			var cookies=querystring.parse(req.headers.cookie,';');
			if (count(cookies)>0){
				req.cookie=cookies;
				if (typeof cookies['sid']!='undefinde'){
					req.session=session.judge(cookies.sid)?session.get(cookies.sid):session.create(cookies.sid);
				}
				else{
					req.session=session.create();
					res.setHeader('Set-Cookie','sid='+req.session.sid);
				}
			}
			else{
				req.session=session.create()
				res.setHeader('Set-cookie','sid='+req.session.sid);
			};
			res.writeHead(200,{'Content-Type':'text/html'});
			res.write(data,'utf8');
			res.end();
		});
	}
	else{
		event.on('sizegot',function(stat){
			fs.readFile(__dirname+path,function(err,data){
				if(err){return Error(res);};
				res.writeHead(200,{
							"content-type":mime.type(Ext),
							"content-length":stat.size
							});
				res.end(data);
			});
		});
		
		Ext=path.slice(path.indexOf('.'),path.length-1);
		
		fs.stat(__dirname+path,function(err,stat){
			if(err){
			res.writeHead(404);
			res.end('File doesn\'t exist');
			return;
			};
			event.emit('sizegot',stat);
		});	
	}
};

exports.route=route;