var fs=require('fs'),
	mime=require('./mime');

function Error(res){
	res.writeHead(404);
	res.end('404 Not Found');
};

function gethead(req,res,Ext,callback){
	var head={};
	fs.stat(req.path,function(err,stat){
		if(err){return Error(res)}
		head.sizes=stat.size;
		head.mime=mime.type(Ext);
		callback(head)
	})
};

function handle(req,res,Ext,type){
	if (type==0){
		req.path=req.session.name?'./chatroom.html':'./logn.html';
	}
	gethead(req,res,Ext,function(head){
		fs.readFile(req.path,function(err,data){
			if(err){return;}
			res.writeHead(200,{'Content-Type':head.mime,
							   'Content-Length':head.sizes,
							   'Set-Cookie':'sid='+req.session.sid
							   }	
						);
			res.write(data,'utf8');
			res.end();			
		})
	})
};

exports.handle=handle;
