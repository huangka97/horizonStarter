"use strict";

// Routes, with inline controllers for each route.
var express = require('express');
var router = express.Router();
var Project = require('./models').Project;
var strftime = require('strftime');
var bodyParser=require('body-parser');
router.use(bodyParser({extended:true}));

router.get('/create-test-project', function(req, res) {
  var project = new Project({
    title: 'I am a test project'
  });
  project.save(function(err) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.send('Success: created a Project object in MongoDb');
    }
  });
});

// View all projects
// Implement the GET / endpoint.
router.get('/', function(req, res) {
  // YOUR CODE HERE
  Project.find(function(err,array){
    res.render('index',{items:array});
  });
});

//  Create project
// Implement the GET /new endpoint
router.get('/new', function(req, res) {
  // YOUR CODE HERE
  res.render('new');
  

  
});

//  Create project
// Implement the POST /new endpoint
router.post('/new', function(req, res) {
  
  if(isNaN(Number(req.body.Goal))){
    console.log("ERROR");
  }else{
  var project= new Project({
    title:req.body.Title,
    goal:req.body.Goal,
    description:req.body.textarea,
    start:req.body.startDate,
    end:req.body.endDate
  });
  project.save(function(err,results){
    if(err){
      console.log("error",err);
    }
    else{
      console.log("success");
      res.redirect('/');
      //mongoose.connection.close()
    }
  })}
  
  //console.log(res);
});

// View single project
// Implement the GET /project/:projectid endpoint
router.get('/project/:projectid', function(req, res) {
  // YOUR CODE HERE

  var totalAmount=0;
  var keyValuePairs=[];
  Project.findById(req.params.projectid,function(error,results){
    if(error){
      console.log("Can't find project",error);
      res.send(error);
    }else{
      for(var i=0;i<results.contributions.length;i++){
        totalAmount+=(results.contributions[i].amount);
        //console.log(totalAmount);
        keyValuePairs.push(results.contributions[i]);

    }
    var intendedGoal=results.goal;
    var percent=(totalAmount/intendedGoal)*100;
      res.render("project",{
        title:results.title, 
        goal:results.goal, 
        description:results.description,
        start:results.start,
        end:results.end, 
        percentage:percent,
        ID:req.params.projectid,
        Total:totalAmount,
        ListofAll:keyValuePairs
      })
        
    }
  })
});

//Contribute to a project
// Implement the GET /project/:projectid endpoint
router.post('/project/:projectid', function(req, res) {
  // YOUR CODE HERE
  Project.findById(req.params.projectid,function(error,results){
    if(error){
      console.log("Can't find project",error);
      res.send(error);
    }else{
      console.log("success");
      results.contributions.push({
        name:req.body.name,
       amount:req.body.amount
     });
      results.save(function(err){
        if(err){
          console.log("error",err);
        }else{
          console.log("success");
        }
      })
    }
  })
});


// Create the GET /project/:projectid/edit endpoint
// Create the POST /project/:projectid/edit endpoint

module.exports = router;
