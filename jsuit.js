function JSUIT(container) {
	if(container != null){
		this.container = container;
	} else {
		this.container = document;
	}
	this.counter = 0;
	this.test_functions = {};
	this.enabled = true;
	this.func = null;
	this.test_counter = new Array();
	this.plan = new Array();
}

JSUIT.instance = null;

JSUIT.get_instance = function(space){
	if(JSUIT.instance == null){
		JSUIT.instance = new JSUIT();
	}

	JSUIT.instance.set_space(space);
	JSUIT.instance.container.write("<style type='text/css'>li{cursor: pointer;} li span{display:none;} li:hover span{display:inline;}</style>");
	return JSUIT.instance;
};

JSUIT.prototype.enable_test = function() {
	this.enabled = true;
}

JSUIT.prototype.disable_test = function() {
	this.enabled = false;
}

JSUIT.prototype.tests = function(tests) {
	this.tests = tests;
}

JSUIT.prototype.is_enabled = function() {
	return this.enabled;
}

JSUIT.prototype.set_space = function (space) {
	this.space = space;
}

JSUIT.prototype.ok = function(test, msg) {
	if(! this.enabled){
		return false;
	}
	var func = (this.func != null ? this.func + "" : "No function defined");
	func = func.replace(/\'/g, "\\\'");
	func = func.replace(/"/g, "\\\'");
	func = func.replace(/\n/g, "\\n");
	this.func = null;
	this.counter++;
	this.container.write("<style type='text/css'>li{cursor: pointer;} li span{display:none;} li:hover span{display:inline;}</style>");
	if(this.space){
		this.container.write("<li class=msg onclick=\"alert('[ " + msg + " ]\\n\\n\\n" + func + "');\"><a>" + this.counter + ": " + "<b>" + this.space + "</b>: " + (test ? "<font color='green'>OK</font>" : "<font color='red'>NOK</font>") + "<span> # " + msg + "</span></a></li>");

		if(this.test_counter[this.space] === undefined){
			this.test_counter[this.space]        = new Object();
			this.test_counter[this.space].runned = 0;
			this.test_counter[this.space].ok     = 0;
			this.test_counter[this.space].nok    = 0;
		}
		this.test_counter[this.space].runned++;
		if(test){
			this.test_counter[this.space].ok++;
		} else {
			this.test_counter[this.space].nok++;
		}
	} else {
		this.container.write("<li class='msg' onclick=\"alert('[ " + msg + " ]\\n\\n\\n" + func + "');\"><a>" + this.counter + ": " + msg + ": " + (test ? "<font color='green'>OK</font>" : "<font color='red'>NOK</font>") + "<span> # " + msg + "</span></a></li>");
	}
	return test;
}

JSUIT.prototype.is = function(got, expected, msg) {
	return this.ok(got == expected, msg);
}

JSUIT.prototype.push_test = function(test_func, tests_num) {
	if(! this.enabled){
		return false;
	}
	if(! this.test_functions[this.space]){
		this.test_functions[this.space] = new Array();
	}
	this.plan[this.space] += tests_num ? tests_num : 0;
	(this.test_functions[this.space]).push(test_func);
	return true;
}


JSUIT.prototype.run_tests = function(space) {
	if(! this.enabled){
		return false;
	}
	JSUIT.get_instance().container.write("<script src='./jsuit.js'></script>");
	if(space === undefined || space == null || space == "") {
		var stat = true;
		for(var key in this.test_functions){
			stat = stat && this.run_tests(key);
		}
		return stat;
	} else {
		this.tests_number = (this.test_functions[space]).length;
		this.counter = 0;
		this.test_counter[space] = new Object();
		this.test_counter[space].runned = 0;
		this.test_counter[space].nok    = 0;
		this.test_counter[space].ok     = 0;
		this.set_space(space);
		for(var i in this.test_functions[space]){
			this.func = (this.test_functions[space])[i];
			var result;
			try{result = ((this.test_functions[space])[i])();}
			catch(err){alert("ERROR: " + err);}
		}
		this.container.write("<li><b>" + space + "</b>: " + this.test_counter[space].runned + " tests were runned, " + this.test_counter[space].ok + " tests are OK and " + this.test_counter[space].nok + " tests are not OK</li>");
		if(this.test_counter[space].nok > 0 || this.test_counter[space].runned != this.plan[space]) {
			return false;
		} else {
			return true;
		}
	}
	this.container.write("<li><b>" + space + "</b>: " + error_counter + "/" + this.counter + " tests with error</li>");
	if(this.tests_number == this.counter){
		return true;
	} else {
		return false;
	}
}

JSUIT.show_test_menu = function () {
	var jsuit = JSUIT.get_instance();
	jsuit.container.write("<script src='./jsuit.js'></script>");
	jsuit.container.write("<script>var jsuit = JSUIT.get_instance()</script>");
	//jsuit.container.write("<label for='file'><input id='file'>");
	//jsuit.container.write("<button onclick='document.write(\"included: \" + document.getElementById(\"file\").value + \"\"); document.write(\"<script src=\" + document.getElementById(\"file\").value + \"></script>\")'>Import</button><br />");
	JSUIT.create_menu();
}

JSUIT.create_menu = function () {
	var jsuit = JSUIT.get_instance();
	jsuit.container.write("<select id='test'>");
	jsuit.container.write("<option value=''>all</option>");
	for(var func in jsuit.test_functions) {
		jsuit.container.write("<option>" + func + "</option>");
	}
	jsuit.container.write("</select> ");
	jsuit.container.write("<button onclick='jsuit.run_tests(getElementById(\"test\").options[getElementById(\"test\").selectedIndex].value)'>run</button>");
}

if(JSUIT.get_instance("JSUIT").enabled) {
	JSUIT.get_instance("JSUIT").push_test(function(){jsuit.ok(jsuit.ok(true, "Testing ok(true)", "test to test"))});
	JSUIT.get_instance("JSUIT").push_test(function(){jsuit.ok(!jsuit.ok(false, "Testing ok(false)", "test to test"))});
	JSUIT.get_instance("JSUIT").push_test(function(){jsuit.ok(jsuit.is(1, 1, "Testing is(true)", "test to test"))});
	JSUIT.get_instance("JSUIT").push_test(function(){jsuit.ok(!jsuit.is(1, 2, "Testing is(false)", "test to test"))});

	JSUIT.get_instance("JSUIT").push_test(function(){jsuit.enable_test(); jsuit.ok(jsuit.enabled), "test to test"});
	JSUIT.get_instance("JSUIT").push_test(function(){jsuit.disable_test(); jsuit.ok(!jsuit.enabled), "test to test"});
}






