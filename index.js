const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const PORT = process.env.PORT || 5000



var MongoClient = require('mongodb').MongoClient;
var mysql = require('mysql');
var url = "mongodb://heroku_2kh2d2md:fvk1av77245n3rmfp61tib51lm@ds239965.mlab.com:39965/heroku_2kh2d2md";



var con = mysql.createConnection("mysql://swswaeafj5nuj6am:xvruel2p7cfi8iul@z37udk8g6jiaqcbx.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/ig9o8wsh8i2eqon4");
con.connect(function (err) {
	if (err) throw err;
	console.log("MySQL connection successful!");
});

//CRON STUFF-------
var CronJob = require('cron').CronJob;
var job = new CronJob('59 23 * * *', function(){
	console.log("This message should appear at 11:59 pm");
	var query ='UPDATE Athletes SET survey_done = 0 WHERE survey_done = 1';
	console.log(query);
	con.query(query, function (err, result){
		if(err) Console.log(err);
	});
}, null, true, "America/Detroit");
job.start();
//END CRON STUFF

var currUserfName;
var currUserlName;


MongoClient.connect(url, function (err, db) {
	if (err) throw err;
	console.log("Database created!");
	db.close();
});

MongoClient.connect(url, function (err, db) {
	if (err) throw err;
	var dbo = db.db("heroku_2kh2d2md");
	dbo.collection("testCollection").findOne({}, function (err, result) {
		if (err) throw err;
		console.log(result.name);
		db.close();
	});
});

var app = express()

var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Response to recieving the webpage, followed by a json with Username sent -----------------------------------------------
app.get('/', (req, res) => res.render('pages/index'))
//___________
//LoginMobile----------------------------------------------------------------------------------------------------------
app.post('/loginmobile', urlencodedParser, function (req, res) {
	//get name and password from message body
	var name = req.body.name;
	var pass = req.body.password;

	var newquery = "SELECT * FROM Account JOIN Athletes ON Account.Account_ID = Athletes.Account_ID WHERE Account.email='" + name + "' AND password='" + pass + "' AND is_Registered=1";
	console.log(newquery);
	con.query(newquery, function (err, result) {
		if (err) console.log(err);
		if (result.length > 0) {
			console.log("Result: " + result[0].Account_ID); //this should probably not still be here
			res.json({ id: result[0].Account_ID, name: result[0].full_name, survey_done: result[0].survey_done });
		}
		else res.json({ id: -1 }); //returning an id of -1 will be interpreted as a login failure
	});

})

//getquestions-------------------------------------------------------------------------------------------------------------
app.post('/getquestions', urlencodedParser, function (req, res){
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var account_id = req.body.id;
	var query = 'SELECT T1.question_ID, T1.question, T1.pa_ID, T1.text, T1.value FROM (SELECT Questions.question_ID, Questions.question, PossibleAnswers.pa_ID, PossibleAnswers.text, PossibleAnswers.value FROM Questions JOIN PossibleAnswers ON Questions.question_ID = PossibleAnswers.question_ID WHERE Questions.enabled = 1) AS T1 LEFT OUTER JOIN (SELECT * FROM Answers WHERE date="'+date+'" AND Account_ID='+account_id+') AS T2 ON T1.question_ID = T2.question_ID WHERE T2.date IS NULL';
	con.query(query, function(err, result) {
		if(err) console.log(err);
		var total = "";
		var currQ = "";
		for(var i=0;i<result.length;i++){
			if(i==0){
				currQ=result[i].question;
				total+='[{"question":"'+result[i].question+'", "question_ID":"'+result[i].question_ID+'", "answers":[{';
				total+='"text":"'+result[i].text+'", "value":"'+result[i].value+'"}';
			}
			else if(result[i].question!=currQ&&i>0){
				currQ=result[i].question;
				total+='] }, {"question":"'+result[i].question+'", "question_ID":"'+result[i].question_ID+'", "answers":[{';
				total+='"text":"'+result[i].text+'", "value":"'+result[i].value+'"}';
			}
			else if(result[i].question==currQ){
				total+=', {"text":"'+result[i].text+'", "value":"'+result[i].value+'"}'
			}
			else{
				total+="AAAAAAAAAAAAAAAAAAA";
			}
		}
		total +=']} ]';
		res.send(total);
	});
});

//-------------------------------------------
//Submit Answer
app.post('/submitanswer', urlencodedParser, function(req, res){
	console.log("got a submit request");
	var accountid = req.body.account_id;
	var questionid = req.body.question_ID;
	console.log(accountid);
	console.log(questionid);
	var paID = req.body.pa_ID;
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var query ='INSERT INTO Answers (pa_ID, question_ID, Account_ID, date) VALUES ('+paID+', '+questionid+', '+accountid+', "'+date+'")';
	console.log(query);
	con.query(query, function (err, result){
		if(err){
			console.log(err);
			res.json({status: -1});
		}
		else{
			res.json({status: 1})
		}
	});
});


//----------------------------------------------------------------------------------------------------------------------
//Login Verification
app.get('/login', urlencodedParser, function (req, res) {
	console.log("Logged in");
});

app.post('/login', urlencodedParser, function (req, res) {
	console.log("Test Login: " + req.body.name);
	//Create boolean to verify user login
	var verify = false;
	//Get ID and password from body
	var Email = req.body.name;
	var pass = req.body.password;
	//Create verification variables
	var vEmail = "Nothing";
	var vPass = 0;
	var vFN = "Temporary";
	//Database query the name and password
  	var sql = "SELECT email, password FROM ig9o8wsh8i2eqon4.Account WHERE email = '"+Email+"' AND password ='"+pass+"'";
  	con.query(sql,function (err, result) {
    		if (err) throw err;
    		console.log(result);
		vEmail = result[0].email;
		vPass = result[0].password;
		if ((Email == vEmail) && (pass == vPass)) {
			console.log("Logged in");
			res.render('pages/main.ejs');
		}
		else{
			res.render('pages/index.ejs');
		}
  	});
});

//------------------------------------------------------------------------------------------------------------------
// New Member Page
app.get('/create', urlencodedParser, function (req, res) {
	console.log("New Member");
});
app.post('/create', urlencodedParser, function (req, res) {
	console.log("Creating New Member");
	res.render('pages/createMember.ejs');
});
//--------------------------------------------------------------------------------------------------------------------
app.get('/modSurvey', urlencodedParser, function (req, res) {
	console.log("Modding Survey");
	res.render('pages/modifySurveys.ejs');
});

//------------------------------------------------------------------------------------------------------------------
// Test Page
app.get("/personal.html", function (req, res) {
	res.render('pages/personal.ejs');
});
app.get("/emailChange.html", function (req, res) {
	res.render('pages/emailChange.ejs');
});
app.get("/login.html", function (req, res) {
	res.render('pages/login.ejs');
});
app.get("/passwordChange.html", function (req, res) {
	res.render('pages/passwordChange.ejs');
});
app.get("/surveys.html", function (req, res) {
	rows = 0;
	console.log("Testing SQL");
	var sql = "SELECT * FROM Questions INNER JOIN PossibleAnswers ON Questions.question_ID = PossibleAnswers.question_ID";
  	con.query(sql,function (err, result) {
    		if (err) throw err;
    		console.log(result);
		rows = result;
		res.render('pages/surveys.ejs', { page_title: "Test Table", data: rows });
	});
});
app.get("/teams.html", function (req, res) {
	rows = 0;
	res.render('pages/teams.ejs', { page_title: "Test Table", data: rows });
});
app.get("/index.html", function (req, res) {
	res.render('pages/main.ejs');
});
app.get("/contact.html", function (req, res) {
	res.render('pages/contactInfo.ejs');
});

//--------------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------------
// Send Email Action
app.get('/email', urlencodedParser, function (req, res) {
	console.log("New Member");
});
app.post('/email', urlencodedParser, function (req, res) {
	console.log("Sending Email");	
	smtpTransport.sendMail(mailOptions, function(error, response) {
  		if (error) {
    			console.log(error)
  		} else {
    			console.log("Successfully sent email.")
  		}	
	});	
	
	res.render('pages/createMember.ejs');
});
//--------------------------------------------------------------------------------------------------------------------


//Action to create new member in database
app.get('/createNew', urlencodedParser, function (req, res) {
	console.log("Creating Database");
});

app.post('/createNew', urlencodedParser, function (req, res) {
	console.log("Creating New User");
	var dbfname = req.body.fname;
	var dblname = req.body.lname;
	var dbemail = req.body.email;
	var dbEagleID = req.body.ID;
	var dbpassword = req.body.pass;
	var ID;
  	var sql = "SELECT Account_ID FROM ig9o8wsh8i2eqon4.Account";
  	con.query(sql,function (err, result) {
    		if (err) throw err;
    		console.log(result);
		ID = result[(result.length)-1].Account_ID;
		console.log(ID);
		ID++;
		console.log("New ID: "+ ID);
  		var sql = "INSERT INTO ig9o8wsh8i2eqon4.Account (Account_ID,email, password, is_Athlete, is_Coach, is_Admin, is_Registered) VALUES ('"+ID+"','"+dbemail+"','"+dbpassword+"','1','0','0','1')";
  		con.query(sql,function (err, result) {
    			if (err) throw err;
    			console.log("New record inserted");
  		});
  	});

	res.render('pages/index.ejs');
});

//=========================================================================================================================
//Action to display members in HTML database table -----------------------------------------------------------------------------
app.get('/getUsers', urlencodedParser, function (req, res) {
	console.log("Retrieving From Database");
});

app.post('/getUsers', urlencodedParser, function (req, res) {
	var table;
	console.log("Displaying Users Table");
	MongoClient.connect(url, function (err, db) {
		if (err) throw err;
		var dbo = db.db("heroku_2kh2d2md");
		table = dbo.collection("users").find({}).toArray(function (err, result) {
			if (err) throw err;
			console.log(result);
			rows = result;
			res.render('pages/teams.ejs', { page_title: "Test Table", data: rows });
			db.close();
		});
	});


});
//======================================================================================================================================
// New Action to display Survey Results in HTML database table -----------------------------------------------------------------------------
app.get('/getSurvey', urlencodedParser, function (req, res) {
	console.log("Retrieving From Database");
});

app.post('/getSurvey', urlencodedParser, function (req, res) {
	var table;
	console.log("Displaying Results Table");
	MongoClient.connect(url, function (err, db) {
		if (err) throw err;
		var dbo = db.db("heroku_2kh2d2md");
		table = dbo.collection("Results").find({}).toArray(function (err, result) {
			if (err) throw err;
			console.log(result);
			rows = result;
			res.render('pages/surveyResults.ejs', { page_title: "Test Table", data: rows });
			db.close();
		});
	});

});
app.post('/GetTeamData', urlencodedParser, function (req, res) {
	var table;
	console.log("Displaying Atheletes Table");
	console.log(req.TeamSelect);
	var sql = "SELECT * FROM Account INNER JOIN Athletes ON Account.Account_ID = Athletes.Account_ID;";
  	con.query(sql,function (err, result) {
    		if (err) throw err;
			console.log(result);
			rows = result;
			res.render('pages/teams.ejs', { page_title: "Test Table", data: rows });
	});

});
//-------------------------------------------------------------------------------------------------------------------------------------------
//==================================================================================================================================
//Action to add question results in the database
app.get('/submitAnswers', urlencodedParser, function (req, res) {
	console.log("Adding to Database");
});

app.post('/submitAnswers', urlencodedParser, function (req, res) {
	console.log("Testing stuff");
	var c1score = 0;
	var c2score = 0;
	var c3score = 0;
	var c4score = 0;

	// get a list of the radio inputs on the page
	var choices = JSON.parse(JSON.stringify(req.body));

	for (var key in choices) {
		if (choices.hasOwnProperty(key)) {
			if (choices[key] == 'c1') {
				c1score = c1score + 1;
			}
			if (choices[key] == 'c2') {
				c2score = c2score + 1;
			}
			if (choices[key] == 'c3') {
				c3score = c3score + 1;
			}
			if (choices[key] == 'c4') {
				c4score = c4score + 1;
			}
			console.log(key + " -> " + choices[key]);
		}
	}
	var maxscore = Math.max(c1score, c2score, c3score, c4score);
	var health = "null";
	// Display answer corresponding to that choice
	if (c1score == maxscore) { // If user chooses the first choice the most, this outcome will be displayed.
		health = "Really unhealthy";
	}
	if (c2score == maxscore) { // If user chooses the second choice the most, this outcome will be displayed.
		health = "Somewhat unhealthy";
	}
	if (c3score == maxscore) { // If user chooses the third choice the most, this outcome will be displayed.
		health = "Healthy";
	}
	if (c4score == maxscore) { // If user chooses the fourth choice the most, this outcome will be displayed.
		health = "Really Healthy";
	}
	// If you add more choices, you must add another response below.

	console.log("Updating User Results");

	MongoClient.connect(url, function (err, db) {
		if (err) throw err;
		var dbo = db.db("heroku_2kh2d2md");
		var myobj = { fname: currUserfName, lname: currUserlName, result: health, low: c1score, midlow: c2score, midhigh: c3score, high: c4score };
		dbo.collection("Results").insertOne(myobj, function (err, res) {
			if (err) throw err;
			db.close();
		});
	});

	res.render('pages/MemberPage.ejs', { name: currUserfName, lname: currUserlName });
});
//==========================================================================================================================
app.listen(PORT, () => console.log(`Listening on ${PORT}`))