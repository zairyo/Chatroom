var querystring=require('querystring'),
	fs=require('fs'),
    session={},
	expire=24*60*60*1000;

function genSID(){
	var time=new Date().getTime()+'-';
	var sid=time+(Math.round(Math.random()*100));
	return sid;
};

function create(SID){
	session[SID]={
		sid:(!SID)?genSID():SID,
		time:new Date().getTime()
	};
	return session[SID];
};

function clean(){
	setInterval(function(){
		for (i in session){
			if (new Date().getTime>session[i].time+expire){
				delete session[i];
			};
		}
	},2*60*1000);
};

function get(sid){
   //console.log('wait me');
	return session[sid];
};

function update(sid){
	session[sid].time=new Date().getTime();
};

function del(sid){
	delete session[sid];
};

function set(sid,key,value){
    update(sid);
	session[sid][key]=value;
};

function judge(sid){
	if (typeof session[sid]=='undefined'){
		return false;
	}
	else{
		return true;
	};
};

exports.create=create;
exports.get=get;
exports.clean=clean;
exports.update=update;
exports.del=del;
exports.set=set;
exports.judge=judge;
