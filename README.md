# Paypal-VAP-Mid-term-Project

This is a Registration Portal made for students, faculty and admin. Professors can add courses or remove courses to which students can register or drop those courses.
Only Administrator can create or delete courses.
Accounts of Professor and Student can also be created and deleted by Administrator only.
For administrators, both the id and password is 'admin'

If a teacher removes a course, all the students subscribed to that course automatically gets removed.
If a course is removed by administrator, then that subject is removed from teachers list as well as students subscribed course.

To start the Portal, open terminal in the root directory of the project. Then type

npm install

This will install all the modules required to run the web app, the details of which is stored in package.json

Then enter the following command to start

node startwebserver.js

This starts the server on port 3000 which can be changes in startwebserver.js
Open http://localhost:3000/index page on your browser

This opens the homepage of the website which shows options for login of three types:
Student
Faculty
Administrator

!['Home Page'](https://github.com/SthitPragya/Paypal-VAP-Mid-term-Project/blob/master/screenshots/Screenshot%20(110).png)


The login info is stored in json files.
For students, it is stored in studentlogin.json
For teachers, it is stored in teacherlogin.json
For administrators, the id and password is 'admin'

For Faculty Login

!['Faculty Login'](https://github.com/SthitPragya/Paypal-VAP-Mid-term-Project/blob/master/screenshots/Screenshot%20(111).png)



After you login as a teacher, you see options to add and delete courses

!['Faculty Home Page'](https://github.com/SthitPragya/Paypal-VAP-Mid-term-Project/blob/master/screenshots/Screenshot%20(112).png)



When you go to add course, the available courses are shown

!['Available courses for faculty'](https://github.com/SthitPragya/Paypal-VAP-Mid-term-Project/blob/master/screenshots/Screenshot%20(113).png)



For Student Login

!['Student Login'](https://github.com/SthitPragya/Paypal-VAP-Mid-term-Project/blob/master/screenshots/Screenshot%20(114).png)



After you login as a Student, you see the details about all the courses you have registered along with the professor.
You have to option to drop a course just next to the details and at the end you have the button which takes you to a page where you can
register for new course.

!['Student Home Page'](https://github.com/SthitPragya/Paypal-VAP-Mid-term-Project/blob/master/screenshots/Screenshot%20(115).png)



When you go to add course, the available courses are shown

!['Available courses for Student'](https://github.com/SthitPragya/Paypal-VAP-Mid-term-Project/blob/master/screenshots/Screenshot%20(116).png)



After choosing the course, you will be provided with the option of choosing the faculty who teach that particular course.

!['Available teachers of the particularcourses for Student'](https://github.com/SthitPragya/Paypal-VAP-Mid-term-Project/blob/master/screenshots/Screenshot%20(117).png)



For Administrator Login

!['Admin Login'](https://github.com/SthitPragya/Paypal-VAP-Mid-term-Project/blob/master/screenshots/Screenshot%20(118).png)



After logging in, the administrator gets the option three options i.e. modifying students, faculty and course list

!['Admin Home Page'](https://github.com/SthitPragya/Paypal-VAP-Mid-term-Project/blob/master/screenshots/Screenshot%20(119).png)



If you choose to modify faculty, you see the list of all the professors id along with their names and subjects they teach.
Their account can be removed by just by clicking on Delete Account. To add a professor, tap on Add Professor.

!['Admin Faculty List'](https://github.com/SthitPragya/Paypal-VAP-Mid-term-Project/blob/master/screenshots/Screenshot%20(120).png)



When you click on add Projessor, you have to enter the faculty id and name and then proceed to click on submit. His account will be created.

!['Faculty Account Creation'](https://github.com/SthitPragya/Paypal-VAP-Mid-term-Project/blob/master/screenshots/Screenshot%20(126).png)



If you choose to modify students list, the list of all students acount is shown. It contains their registration number along with name.
Their account can be deleted by clicking on Delete Account next to their name. To add an account, tap on add student.

!['Admin Home Page'](https://github.com/SthitPragya/Paypal-VAP-Mid-term-Project/blob/master/screenshots/Screenshot%20(121).png)



When you click on add Student, you have to enter the student id and name and then proceed to click on submit. His account will be created.

!['Student Account Creation'](https://github.com/SthitPragya/Paypal-VAP-Mid-term-Project/blob/master/screenshots/Screenshot%20(127).png)



When you choose to modify courses, you see the details about all the courses present.You have to option to delete a course just next to the details and at the end you have the button which takes you to a page where you can add new courses.

!['Admin Home Page'](https://github.com/SthitPragya/Paypal-VAP-Mid-term-Project/blob/master/screenshots/Screenshot%20(122).png)



When you click on add Course, you have to enter the course id and name and then proceed to click on submit. The course will be available for teachers and students.

!['Course Addition'](https://github.com/SthitPragya/Paypal-VAP-Mid-term-Project/blob/master/screenshots/Screenshot%20(128).png)



MODULES USED:

var express=require('express');
var app=express();
var fs=require('fs');
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.set('view engine', 'pug');
app.set('views', './views');
app.use(session({secret: "Shh, its a secret!"}));
app.use(cookieParser());

var bodyparser=require('body-parser');
app.use(bodyparser.urlencoded(
    {extended:false})
);

var sess='';


ROUTES:

app.get('/index', function(req, res))  for homepage

app.get('/teacher', function(req, res)) for faculty login

app.post('/teacher', function(req, res))       for faculty credentials check

app.get('/teacherspage', function(req, res))   faculty home page

app.get('/teachersdelcourse/:id/:course', function(req, res))   for deleting course by teachers

app.get('/addcourseteacher', function(req, res))   for showing list of available course to teachers

app.get('/teachersregcourse/:courseid', function(req, res))    for adding the course by teachers

app.get('/student', function(req, res))        for student login

app.post('/student', function(req, res))       for student credentials check

app.get('/studentspage', function(req, res))   Student home page

app.get('/studentsdelcourse/:id/:course', function(req, res))   for deleting course by student

app.get('/addcourse', function(req, res))      for showing list of available courses that can be subscribed student

app.get('/studentsregcourse/:courseid/:teacherid', function(req, res))  for choosing a course to register by student

app.get('/studentupdatedb/:reg/:tid/:cid', function(req, res))     for selecting the faculty of course and updating the json database of student

app.get('/logout', function(req, res))         for logging out of accounts and clearing the session

app.get('/admin', function(req, res))          for admin login

app.post('/admin', function(req, res))         for admin credentials check

app.get('/adminspage', function(req, res))     admin home page   

app.get('/adminteacher', function(req, res))   for add/remove teacher account

app.get('/delteacher/:id', function(req, res))

app.get('/newteacher', function(req, res))

app.post('/newteacher', function(req, res))

app.get('/adminstudent', function(req, res))   for add/remove student account

app.get('/delstudent/:id', function(req, res))

app.get('/newstudent', function(req, res))

app.post('/newstudent', function(req, res))

app.get('/admincourse', function(req, res))    for add/remove course

app.get('/delcourse/:id', function(req, res))

app.get('/newcourse', function(req, res))

app.post('/newcourse', function(req, res))

app.listen(3000);                              port address


FUNCTIONS IMPLEMENTED:

function addcoursestudent(studentid, courseid, facultyid)           for adding a course in database

function removecoursestudent(courseid, studentid)                   for removing a course from database

function addcourseteacher(courseid, teacherid)                      for adding a course in database

function removecourseteacher(teacherid, courseid)                   for removing a course by from database

function addstudent(studentid, studentname)                         for adding student account in database


function removestudent(studentid)                                   for removing student account from database

function addteacher(teacherid, teachername)                         for adding teacher account in database

function removeteacher(teacherid)                                   for removing teacher account from database

function addcourse(courseid, coursename)                            for adding course in course list

function deletecourse(courseid)                                     for removing a course from courselist



STORAGE:

Database is created using json files.


FOR AUTHENTICATION:

studentlogin.json - contains the login information of students account
teacherlogin.json - contains login information of faculty account


FOR ACCOUNT:

teachers.json - contains information about all teachers
students.json - contains information about all the students
courses.json - contains details of all the courses


Session variable is used to check whether a user has logged in or not.
Pug Template is used for all the webpages design.
fs module is used to read the json files.
