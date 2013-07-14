var http=require('http'),
	url=require('url'),
	io=require('socket.io'),
	session=require('./session'),
	router=require('./router'),
	users=new Array(),
	count,
	sio;
	
function Request(req,res){
	var path=url.parse(req.url).pathname;
	router.route(req,res,path);
};

server=http.createServer(Request).listen(8888);

sio=io.listen(server);

sio.sockets.on('connection',function(socket){
	
	socket.on('user',function(data,callback){
		for (var i in users){
			if (data.names==users[i]){
				callback(false);
				return;
			};
		};
		callback(true);
		count=users.push(data.names);
		session.set(data.ssid,'name',data.names);
		console.log(data.names+' connect!');
	});
	
	function ulist(){
		var list='';
		for (var i in users){
			list+=users[i]+'<br/>';
		};
		return list;
	};
	
	socket.on('load_finish',function(sid,callback){
		var _session=session.get(sid),
			judgement=false;
		callback(_session.name);

		for(var i in users){
			if(users[i]==_session.name){judgement=true}
		}
		if (judgement==false){
			console.log(_session.name+' connect!');
			count=users.push(_session.name);
		}

		socket.broadcast.emit('msg',{msgs:'<br/>'+_session.name+' enters the room!', type:'user'});

		sio.sockets.emit('msg',{msgs:ulist(),type:'list'});
	});
	
	socket.on('msg',function(data){
		sio.sockets.emit('msg',{msgs:data.msgs,type:data.type});
	});
	
	socket.on('discon',function(data){
		console.log(data.name+' disconnect!');
		socket.broadcast.emit('msg',{msgs:'<br/>'+data.name+' leave.',type:'user'});
		for (var i in users){
			if (users[i]==data.name){
				users.splice(i,1);
				break;
			};
		};
		sio.sockets.emit('msg',{msgs:ulist(),type:'list'});
		if (data.actions=='switch'){console.log('delete');session.del(data.sid);}
	});
});