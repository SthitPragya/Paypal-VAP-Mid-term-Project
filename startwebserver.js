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

app.get('/index', function(req, res){
    res.render('homepage', {
        message:'Hello World',
        friends:0,
        count:5,
        title:"sample"
    });
});

app.get('/teacher', function(req, res){
    res.render('teacherlogin', {
        data:JSON.stringify(req.query)
    })
});

app.post('/teacher', function(req, res){
    var id=req.body.username;
    var pwd=req.body.password;
    fs.readFile("teacherlogin.json", function(err, data){
        var json=JSON.parse(data);
        var arr=Object.keys(json);
        if(arr.indexOf(id)==-1)
            res.render('teacherlogin', { message: "User does not exist"});
        else
            if(json[id]==pwd)
            {
                sess=req.session;
                sess.user=id;
                res.redirect('/teacherspage');
            }
            else
                res.render('teacherlogin', { message: "Invalid Password"});
    });
});

app.get('/teacherspage', function(req, res){
    if(sess.user){
        var json=fs.readFileSync('teachers.json', 'utf-8');
        json=JSON.parse(json);
        var courses=json[sess.user];
        var name=courses[0];     //name of teacher
        var jsonn=fs.readFileSync('courses.json', 'utf-8');
        jsonn=JSON.parse(jsonn);
        var subnames=[];
        var subid=[];
        for(var i=1;i<courses.length;i++){
            var temp=jsonn[courses[i]];
            subid.push(courses[i]);
            subnames.push(temp[0]);
        }
        res.render('teacherspage',{
            fid:sess.user,
            fname:name,
            cid:subid,
            coursename:subnames
        });
    }
    else
        res.redirect('/index');
});

app.get('/teachersdelcourse/:id/:course', function(req, res){
    if(sess.user){
        console.log(req.params);
        removecourseteacher(req.params.id, req.params.course);
        res.redirect("/teacherspage");
    }
    else
        res.redirect('/index');
});

app.get('/addcourseteacher', function(req, res){
    if(sess.user){
        var json=fs.readFileSync('teachers.json', 'utf-8');
        json=JSON.parse(json);
        var jsonn=fs.readFileSync('courses.json', 'utf-8');
        jsonn=JSON.parse(jsonn);
        var courses=json[sess.user];
        var name=courses[0];
        var course=[];
        for(var i=1;i<courses.length;i++)
            course[i-1]=courses[i];     //has all courseid
        var arr=Object.keys(jsonn);
        course.forEach(ele=>{
            arr.splice((arr.indexOf(ele)), 1);
        });
        var subnames=[];
        for(var i=0;i<arr.length;i++)
            subnames[i]=jsonn[arr[i]][0];
        console.log(subnames);
        res.render('addcourseteacher', {
            nm:name,
            reg:sess.user,
            coursesid:arr,
            sname:courses[0],
            sub:subnames
        });
    }
    else
        res.redirect('/index');
});

app.get('/teachersregcourse/:courseid', function(req, res){
    if(sess.user){
        addcourseteacher(req.params.courseid, sess.user);
        res.redirect('/teacherspage');
    }
    else
        res.redirect('/index');
});



app.get('/student', function(req, res){
    res.render('studentlogin', {
        data:JSON.stringify(req.query)
    })
});

app.post('/student', function(req, res){
    var reg=req.body.username;
    var pwd=req.body.password;
    fs.readFile("studentlogin.json", function(err, data){
        var json=JSON.parse(data);
        var arr=Object.keys(json);
        if(arr.indexOf(reg)==-1)
            res.render('studentlogin', { message: "User does not exist"});
        else
            if(json[reg]==pwd)
            {
                sess=req.session;
                sess.user=reg;
                res.redirect('/studentspage');
            }
            else
                res.render('studentlogin', { message: "Invalid Password"});
    });
});

app.get('/studentspage', function(req, res){
    if(sess.user){
        var json=fs.readFileSync('students.json', 'utf-8');
        json=JSON.parse(json);
        var courses=json[sess.user];
        var names=[];
        var jsonn=fs.readFileSync('courses.json', 'utf-8');
        jsonn=JSON.parse(jsonn);
        var jsonnn=fs.readFileSync('teachers.json', 'utf-8');
        jsonnn=JSON.parse(jsonnn);
        var fnames=[];
        for(var i=1;i<courses.length;i++){
            var nm=jsonn[courses[i][0]];  //name of course
            var nmm=jsonnn[courses[i][1]];
            nmm=nmm[0];
            fnames[i-1]=nmm;
            names[i-1]=nm[0];
        }
        res.render('studentspage',{
            reg:sess.user,
            course:courses,
            cname:names,
            fname:fnames
        });
    }
    else
        res.redirect('/index');
});

app.get('/studentsdelcourse/:id/:course', function(req, res){
    if(sess.user){
        console.log(req.params);
        removecoursestudent(req.params.course, req.params.id);
        res.redirect("/studentspage");
    }
    else
        res.redirect('/index');
});

app.get('/addcourse', function(req, res){
    if(sess.user){
        var json=fs.readFileSync('students.json', 'utf-8');
        json=JSON.parse(json);
        var jsonn=fs.readFileSync('courses.json', 'utf-8');
        jsonn=JSON.parse(jsonn);
        var courses=json[sess.user];
        var course=[];
        for(var i=1;i<courses.length;i++)
            course[i-1]=courses[i][0];
        var arr=Object.keys(jsonn);
        course.forEach(ele=>{
            arr.splice((arr.indexOf(ele)), 1);
        });
        var subnames=[];
        for(var i=0;i<arr.length;i++)
            subnames[i]=jsonn[arr[i]];
        //console.log(arr);
        console.log(courses);
        res.render('addcourse', {
            reg:sess.user,
            coursesid:arr,
            sname:courses[0],
            sub:subnames
        });
    }
    else
        res.redirect('/index');
});

app.get('/studentsregcourse/:courseid/:teacherid', function(req, res){
    if(sess.user){
        console.log(req.params);
        var json=fs.readFileSync("teachers.json", 'utf-8');
        json=JSON.parse(json);
        var names=[];
        req.params.teacherid=(req.params.teacherid).split(",");
        for(var i=1;i<(req.params.teacherid).length;i++){
            names.push(json[(req.params.teacherid)[i]]);
        }
        var subnm=(req.params.teacherid)[0];
        res.render('studentsreg', {
            reg:sess.user,
            cid:req.params.courseid,
            tname:names,
            subname:subnm,
            tid:req.params.teacherid
        });
    }
    else
        res.redirect('/index');
});

app.get('/studentupdatedb/:reg/:tid/:cid', function(req, res){
    addcoursestudent(req.params.reg, req.params.cid, req.params.tid);
    res.redirect('/studentspage');
});

app.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/index');
});

app.get('/admin', function(req, res){
    res.render('adminlogin', {
        data:JSON.stringify(req.query)
    })
});

app.post('/admin', function(req, res){
    var id=req.body.username;
    var pwd=req.body.password;
    if(id!='admin')
        res.render('adminlogin', { message: "User does not exist"});
    else
        if(pwd=='admin')
        {
            sess=req.session;
            sess.user=id;
            res.redirect('/adminspage');
        }
        else
            res.render('adminlogin', { message: "Invalid Password"});
});

app.get('/adminspage', function(req, res){
    if(sess.user){
        res.render('adminspage',{
            name:sess.user,
        });
    }
    else
        res.redirect('/index');
});

app.get('/adminteacher', function(req, res){
    if(sess.user){
        var data=fs.readFileSync('teachers.json', 'utf-8');
        var json=JSON.parse(data);
        var tid=Object.keys(json);
        var name=[]
        var courses=[]
        tid.forEach(id=>{
            courses.push(json[id])
            name.push(json[id][0]);
            courses.splice(0,1);
        })
        res.render('adminteacher',{
            name:sess.user,
            fname:name,
            fid:tid,
            cname:courses
        });
    }
    else
        res.redirect('/index');
});

app.get('/delteacher/:id', function(req, res){
    if(sess.user){
        removeteacher(req.params.id);
        res.redirect('/adminteacher',{});
    }
    else
        res.redirect('/index');
});

app.get('/newteacher', function(req, res){
    if(sess.user){
        res.render('newteacher', {
            name:sess.user
        });
    }
    else
        res.redirect('/index');
});

app.post('/newteacher', function(req, res){
    var fid=req.body.facultyid;
    var fname=req.body.facultyname;
    addteacher(fid, fname);
    res.redirect('/adminteacher');
});

app.get('/adminstudent', function(req, res){
    if(sess.user){
        var data=fs.readFileSync('students.json', 'utf-8');
        var json=JSON.parse(data);
        var sid=Object.keys(json);
        var name=[]
        sid.forEach(id=>{
            name.push(json[id][0]);
        })
        res.render('adminstudent',{
            name:sess.user,
            sname:name,
            sid:sid
        });
    }
    else
        res.redirect('/index');
});

app.get('/delstudent/:id', function(req, res){
    if(sess.user){
        removestudent(req.params.id);
        res.redirect('/adminstudent');
    }
    else
        res.redirect('/index');
});

app.get('/newstudent', function(req, res){
    if(sess.user){
        res.render('newstudent', {
            name:sess.user
        });
    }
    else
        res.redirect('/index');
});

app.post('/newstudent', function(req, res){
    var sid=req.body.stid;
    var sname=req.body.stname;
    addstudent(sid, sname);
    res.redirect('/adminstudent');
});

app.get('/admincourse', function(req, res){
    if(sess.user){
        var data=fs.readFileSync("courses.json", 'utf-8');
        var json=JSON.parse(data);
        var cid=Object.keys(json);
        var cname=[];
        cid.forEach(id=>{
            cname.push(json[id][0]);
        })
        res.render('admincourse',{
            name:sess.user,
            cid:cid,
            cname:cname
        });
    }
    else
        res.redirect('/index');
});

app.get('/delcourse/:id', function(req, res){
    if(sess.user){
        deletecourse(req.params.id);
        res.redirect('/admincourse');
    }
    else
        res.redirect('/index');
});

app.get('/newcourse', function(req, res){
    if(sess.user){
        res.render('newcourse', {
            name:sess.user
        });
    }
    else
        res.redirect('/index');
});

app.post('/newcourse', function(req, res){
    var cid=req.body.courseid;
    var cname=req.body.coursename;
    addcourse(cid, cname);
    res.redirect('/admincourse')
});

app.listen(3000);


//STUDENT
//adding course for student
function addcoursestudent(studentid, courseid, facultyid){
    fs.readFile('students.json', function (err, data) {
        var json = JSON.parse(data);
        json[studentid].push([courseid, facultyid]);
        //console.log(JSON.stringify(json));
        fs.writeFileSync("students.json", JSON.stringify(json), function(err) {console.log(err)});
    });
}

//remove course for student
function removecoursestudent(courseid, studentid){
    var data=fs.readFileSync("students.json", 'utf-8');
    var json=JSON.parse(data);
    var course=json[studentid];
    json[studentid].forEach(course=>{
        if(course[0]==courseid){
            json[studentid].splice(json[studentid].indexOf(course),1);
        }
        });
    //console.log(json);
    fs.writeFileSync("students.json", JSON.stringify(json), function(err){console.log(err)});
}


//TEACHER
//adding course for teacher
function addcourseteacher(courseid, teacherid){
    var data=fs.readFileSync('teachers.json', 'utf-8');
    var json = JSON.parse(data);
    //console.log(typeof(json[teacherid]));
    json[teacherid].push(courseid);
    //console.log(JSON.stringify(json));
    fs.writeFileSync("teachers.json", JSON.stringify(json), function(err) {console.log(err)});
    data=fs.readFileSync("courses.json", 'utf-8');
    var json=JSON.parse(data);
    json[courseid].push(teacherid);
    fs.writeFile("courses.json", JSON.stringify(json), function(err){console.log(err)});
}

//remove course for teacher
function removecourseteacher(teacherid, courseid)
{
    var data=fs.readFileSync('teachers.json', 'utf-8');
    var json = JSON.parse(data);
    json[teacherid].splice(json[teacherid].indexOf(courseid), 1);
    //console.log(json);
    fs.writeFileSync("teachers.json", JSON.stringify(json), function(err) {console.log(err)});
    data=fs.readFileSync("courses.json", 'utf-8');
    var json=JSON.parse(data);
    json[courseid].splice(json[courseid].indexOf(teacherid),1);
    //console.log(json);
    fs.writeFileSync("courses.json", JSON.stringify(json), function(err){console.log(err)});
    data=fs.readFileSync("students.json", 'utf-8');
    var json=JSON.parse(data);
    var regno=Object.keys(json);
    regno.forEach(reg=>{
        json[reg].forEach(course=>{
            if(course[0]==courseid){
                if(course[1]==teacherid)
                    json[reg].splice(json[reg].indexOf(course),1);
            }
        });
    });
    //console.log(json);
    fs.writeFileSync("students.json", JSON.stringify(json), function(err){console.log(err)});
}


function addstudent(studentid, studentname) {
    var data=fs.readFileSync('students.json', 'utf-8');
    var json = JSON.parse(data);
    json[studentid]=[studentname];
    fs.writeFileSync("students.json", JSON.stringify(json));
    var data=fs.readFileSync('studentlogin.js');
    var json=JSON.parse(data);
    json[studentid]=studentid;
    fs.writeFileSync('studentlogin.js', JSON.stringify(json), function(err){console.log(err)});
}

function removestudent(studentid){
    var data=fs.readFileSync('students.json', 'utf-8');
    var json=JSON.parse(data);
    delete json[studentid];
    fs.writeFileSync('students.json', JSON.stringify(json));
    var data=fs.readFileSync('studentlogin.js');
    var json=JSON.parse(data);
    delete json[studentid];
    fs.writeFileSync('studentlogin.js', JSON.stringify(json), function(err){console.log(err)});
}

function addteacher(teacherid, teachername) {
    var data=fs.readFileSync('teachers.json', 'utf-8');
    var json = JSON.parse(data);
    json[teacherid]=[teachername];
    fs.writeFileSync("teachers.json", JSON.stringify(json))
    var data=fs.readFileSync('teacherlogin.js');
    var json=JSON.parse(data);
    json[teacherid]=teacherid;
    fs.writeFileSync('teacherlogin.js', JSON.stringify(json), function(err){console.log(err)});
}

function removeteacher(teacherid){
    var data=fs.readFileSync('teachers.json', 'utf-8');
    var json = JSON.parse(data);
    var subid=json[teacherid];
    for(var i=1;i<subid.length;i++)
        removecourseteacher(teacherid, subid[i]);
    delete json[teacherid];
    fs.writeFileSync("teachers.json", JSON.stringify(json));
    var data=fs.readFileSync('teacherlogin.js');
    var json=JSON.parse(data);
    json[teacherid]=teacherid;
    fs.writeFileSync('teacherlogin.js', JSON.stringify(json), function(err){console.log(err)});
}

function addcourse(courseid, coursename) {
    var data=fs.readFileSync('courses.json', 'utf-8');
    var json = JSON.parse(data);
    json[courseid]=[coursename];
    fs.writeFileSync("courses.json", JSON.stringify(json));
}

function deletecourse(courseid){
    var data=fs.readFileSync('courses.json', 'utf-8');
    var json = JSON.parse(data);
    var subid=json[courseid];
    for(var i=1;i<subid.length;i++){
        var data=fs.readFileSync('teachers.json', 'utf-8');
        var jsonn=JSON.parse(data);
        var pid=Object.keys(jsonn);
        pid.forEach(fid=>{
            var courses=jsonn[fid];
            for(var j=1;j<courses.length;j++)
                if(courses[i]==courseid)
                    removecourseteacher(fid, courseid);
        });
    }
    delete json[courseid];
    fs.writeFileSync("courses.json", JSON.stringify(json));
}