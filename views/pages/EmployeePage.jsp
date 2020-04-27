<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<title>Library Database</title>
<meta http-equiv ="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<link rel="stylesheet" href="https://www.w3schools.com/lib/w3-theme-blue-grey.css">
<link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Open+Sans'>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<style>
html, body, h1, h2, h3, h4, h5 {font-family: "Open Sans", sans-serif}
</style>

<style>
#books {

  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

#books td, #books  th {
  border: 1px solid #ddd;
  padding: 8px;
}

#books tr:nth-child(even){background-color: #f2f2f2;}

#books tr:hover {background-color: #ddd;}

#books th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #406280;
  color: white;
}
</style>

</head>
<body class="w3-theme-l5">


<!-- Navbar -->
<div class="w3-top">
 <div class="w3-bar w3-theme-d2 w3-left-align w3-large">
  <a class="w3-bar-item w3-button w3-hide-medium w3-hide-large w3-right w3-padding-large w3-hover-white w3-large w3-theme-d2" href="javascript:void(0);" onclick="openNav()"><i class="fa fa-bars"></i></a>
  <a href="http://64.139.241.187:8080/" class="w3-bar-item w3-button w3-padding-large w3-theme-d4"><i class="fa fa-home w3-margin-right"></i>Logout</a>
 </div>
</div>

<!-- Navbar on small screens -->
<div id="navDemo" class="w3-bar-block w3-theme-d2 w3-hide w3-hide-large w3-hide-medium w3-large">

  <a href="#" class="w3-bar-item w3-button w3-padding-large">My Profile</a>
</div>

<!-- Page Container -->
<div class="w3-container w3-content" style="max-width:1900px;margin-top:80px">    
  <!-- The Grid -->
  <div class="w3-row">
    <!-- Left Column -->
    <div class="w3-col m3">
      <!-- Profile -->
      <div class="w3-card w3-round w3-white">
        <div class="w3-container">
         <h4 class="w3-center">My Profile</h4>
         <p class="w3-center"><img src="https://cdn3.vectorstock.com/i/1000x1000/53/42/user-member-avatar-face-profile-icon-vector-22965342.jpg" class="w3-circle" style="height:106px;width:106px" alt="Avatar"></p>
         <hr>
         <% String[] infolist =(String[])request.getAttribute("info"); %>
         <p><i class="fa fa-pencil fa-fw w3-margin-right w3-text-theme"></i> <%out.print(infolist[0]);%> </p>
         <p><i class="fa fa-pencil fa-fw w3-margin-right w3-text-theme"></i> <%out.print(infolist[1]);%></p>
         <p><i class="fa fa-home fa-fw w3-margin-right w3-text-theme"></i><%out.print(infolist[2]);%></p>
        </div>
      </div>
    </div>
      <br>
      

    <!-- Middle Column -->
    <div class="w3-col m7">
    
      <div class="w3-row-padding">
        <div class="w3-col m12">
          <div class="w3-card w3-round w3-white">
             <div class="w3-container w3-padding">
              <h6 class="w3-opacity">${admin} </h6>

				<form action="/emp.do" method= "post">
                Search For a Book: <input name="Book Name" type="text" placeholder ="Book Name"/><input type ="submit" value ="Search"/>
                </form>
			</div>
			<div class="w3-container w3-padding">
				<form action="/emp.do" method= "post">
				Show all Employees  <input type ="submit" name="button1" value ="Show"/>
				</form>
			</div>
			<div class="w3-container w3-padding">
				<form action="/emp.do" method= "post">
				Show all Members <input type ="submit" name="button2" value ="Show"/>
				</form>
			</div>
			<div class="w3-container w3-padding">
				<form action="/emp.do" method= "post">
				Show all Books <input type ="submit" name="button3" value ="Show"/>
				</form>
			</div>
			<div class="w3-container w3-padding">
				<form action="/emp.do" method= "post">
				Drop a Member:<input name="memID" type="text" name="dropMem" placeholder =" (MemberID)"/><input type ="submit" value ="Drop"/>
				</form>
			</div>
			<div class="w3-container w3-padding">
				<form action="/emp.do" method= "post">
				Drop An Employee : <input name="empID" type="text" name="dropEmp" placeholder ="(Employee SSN)"/><input type ="submit" value ="Drop"/>
				</form>
			</div>
			<div class="w3-container w3-padding">
				<form action="/emp.do" method= "post">
				<p>Books To Order : ${Orders}</p>
				</form>
			</div>
            
          </div>
        </div>
      </div>
 
      
    <!-- End Middle Column -->
    </div>
    
    <!-- Right Column -->
   
      
    <!-- End Right Column -->
    </div>
    
  <!-- End Grid -->
  </div>
<p>  </p>
<h2>${Welcome}</h2>
<table id ="books" border="1">

<%
        String[] nameList=(String[])request.getAttribute("set");
		System.out.println("Length:"+nameList.length);
		if(nameList.length >324){
	        out.print("<tr>");
	        out.print("<td >"+nameList[0]+"</td>");
	        out.print("<td>"+nameList[1]+"</td>");
	        out.print("<td>"+nameList[2]+"</td>");
	        out.print("<td>"+nameList[3]+"</td>");
	        out.print("<td>"+nameList[4]+"</td>");
	        out.print("<td>"+nameList[5]+"</td>");
	        out.print("</tr>");
	        for(int i=6;i<nameList.length;i+=6){
	            out.print("<tr>");
	            for(int x=i;x<i+6;x++){
	                out.print("<td>"+nameList[x]+"</td>");
	       		}
	            out.print("</tr>");
	        }
	        out.print("</table>");
		}else{
	        out.print("<tr>");
	        out.print("<td >"+nameList[0]+"</td>");
	        out.print("<td>"+nameList[1]+"</td>");
	        out.print("<td>"+nameList[2]+"</td>");
	        out.print("<td>"+nameList[3]+"</td>");
	        out.print("<td>"+nameList[4]+"</td>");
	        out.print("<td>"+nameList[5]+"</td>");
	        out.print("<td>"+nameList[6]+"</td>");
	        out.print("<td>"+nameList[7]+"</td>");
	        out.print("<td>"+nameList[8]+"</td>");
	        out.print("</tr>");
	        for(int i=9;i<nameList.length;i+=9){
	            out.print("<tr>");
	            for(int x=i;x<i+9;x++){
	                out.print("<td>"+nameList[x]+"</td>");
	       		}
	            out.print("</tr>");
	        }
	        out.print("</table>");
		}

    %>
  
<!-- End Page Container -->
</body>
<br>

<!-- Footer -->
<footer class="w3-container w3-theme-d3 w3-padding-16">
  <h5>Footer</h5>
</footer>

<footer class="w3-container w3-theme-d5">
  <p>Powered by <a href="https://www.w3schools.com/w3css/default.asp" target="_blank">w3.css</a></p>
</footer>



</html>