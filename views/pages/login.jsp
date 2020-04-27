<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<link rel="stylesheet" href="https://www.w3schools.com/lib/w3-theme-blue-grey.css">
<link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Open+Sans'>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<meta http-equiv ="Content-Type" content="text/html; charset=UTF-8">
<head>
<title>Eagle Database</title>
</head>
<header class="w3-container w3-theme-d3 w3-padding-16">
  <h1>User System Login</h1>
</header>
<body>
<p><font color = "red">
${errorMessage }
</font></p> 

<div class="w3-container w3-half w3-margin-top">
<form class="w3-container w3-card-4" action="/login.do" method= "post">
<p>
<input class="w3-input" name="name" type="text" style="width:90%">
<label>Eagle ID:</label></p>

<p>
<input class="w3-input" name ="password" type="password" style="width:90%" disabled>
<label>Password:</label></p>

<p>
<button type ="submit" value ="Login"> Submit</button>
</p>

<p><label>New Member/Employee?</label>
<button type ="submit" value ="Create"> Create </button>
</p>

</form>
</div>
</body>
</html>

