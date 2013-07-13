var http=require('http'),
	url=require('url'),
	io=require('socket.io'),
	session=require('./session'),
	router=require('./router'),
	users=new Array,
	count,
	sio;
	
function Request(req,res){
	var path=url.parse(req.url).pathname;
	router.route(req,res,path);
};

server=http.createServer(Request).listen(8888);

sio=io.listen(server);

sio.sockets.on('connection',function(socket){
	
	socket.on('ssid',function(sid,callback){
		var _session=session.get(sid);
		if (typeof _session['name']=='undefined'){
			callback(false);
		}
		else{
			session.update(_session['sid']);
			callback(true);
			count=users.push(_session['name']);
			console.log(_session.name+' connect!');
		};
	});
	
			

	socket.on('user',function(data,callback){
		for (var i in users){
			if (data.names=users[i]){
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
		var _session=session.get(sid);
		callback(_session.name);
		socket.broadcast.emit('msg',{msgs:'<br/>'+_session.name+' enters the room!',
									 type:'user'
									 });
		sio.sockets.emit('msg',{msgs:ulist(),type:'list'});
	});
	
	socket.on('msg',function(data){
		sio.sockets.emit('msg',{msgs:data.msgs,type:data.type});
	});
	
	socket.on('discon',function(data){
		console.log(data+' disconnect!');
		socket.broadcast.emit('msg',{msgs:'<br/>'+data+' leave.',type:'user'});
		for (var i in users){
			if (users[i]==data){
				users.splice(i,1);
				break;
			};
		};
		sio.sockets.emit('msg',{msgs:ulist(),type:'list'});
	});
});