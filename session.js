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
	var ssid=(!SID)?genSID():SID;
	session[ssid]={
		sid:ssid,
		time:new Date().getTime()
	};
	return session[ssid];
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
	return session[sid];
};

function del(sid){
	delete session[sid];
};

function set(sid,key,value){
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
exports.del=del;
exports.set=set;
exports.judge=judge;
