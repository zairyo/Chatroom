var types={
	'.xml':'text/xml',
	'.html':'text.html',
	'.xhtml':'application/xhtml+xml',
	'.txt':'text/plain',
	'.rtf':'application/pdf',
	'.word':'application/msword',
	'.png':'image/png',
	'.gif':'image/jpeg',
	'.au':'audio/basic',
	'.mid':'audio/midi',
	'.midi':'audio/x-midi',
	'.ra':'audio/x-pn-realaudio',
	'.ram':'audio/x-pn-realaudio',
	'.mpg':'bideo/mpeg',
	'.mpeg':'video/mpeg',
	'.avi':'video/x-msvideo',
	'.gz':'application/x-gzip',
	'.tar':'application/x-tar',
	'.css':'text/css',
	'.js':'application/x-javascript'
	}

function type(data){
	if (typeof types[data]=='function'){
		return types[data];
	}
	else{
		return;
	};
};	

exports.type=type;