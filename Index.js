
//variables
var PORT = 3009
var SERVERURL = "127.0.0.1"
var SERVERNAME = "Patient-API"
var getRequestsCount = 0
var postRequestCount = 0

//https://www.npmjs.com/package/restify
var restify = require('restify');
var errors = require ('restify-errors')

//https://www.npmjs.com/package/save
var save = require('save')

//server initiated
var server = restify.createServer();

var patients = save('patients')

//server created
server.listen(PORT,URL, function() {
  //server is listening at 127.0.0.1 at port 3009
  console.log("Server created successfully")
  console.log('%s listening at %s at port %d', SERVERNAME, SERVERURL, PORT);
  console.log("*********************************************")
});

//configure body parser
server.use(restify.plugins.bodyParser({ mapParams: false }));     

//POST request
server.post('/patients', addNewPatients);

//GET request
server.get('/patients', getAllPatients);

// GET by id request
server.get('/patients/:id',getPatientsById);

//DELETE request
server.del('/patients',deleteAllPatients);

//PUT by id request
server.put('/patients/:id',changePatientDetailsById);

//DELETE by id  request
server.del('/patients/:id',deletePatientRecordById);






//callback function mapped to POST request
function addNewPatients(req, res, next) {
 
  console.log("Patient POST : sending response")

  postRequestCount++
  console.log("POST REQUEST COUNT ================== %d",postRequestCount)
  console.log('GET REQUEST COUNT  ================== %d', getRequestsCount);


  if (req.body.firstname === undefined ) {
    //If there are any errors, pass them to next in the correct format
    return next(new errors.InvalidArgumentError('First Name is required'))
  }
  if (req.body.lastname === undefined ) {
    //If there are any errors, pass them to next in the correct format
    return next(new errors.InvalidArgumentError('Last Name is required'))
  }
  if (req.body.age === undefined ) {
    //If there are any errors, pass them to next in the correct format
    return next(new errors.InvalidArgumentError('Age is required'))
  }
  if (req.body.medication === undefined ) {
    //If there are any errors, pass them to next in the correct format
    return next(new errors.InvalidArgumentError('Medication is required'))
  }
  if (req.body.address === undefined ) {
    //If there are any errors, pass them to next in the correct format
    return next(new errors.InvalidArgumentError('Address is required'))
  }
  if (req.body.dateOfBirth === undefined ) {
    //If there are any errors, pass them to next in the correct format
    return next(new errors.InvalidArgumentError('Date of birth is required'))
  }
  if (req.body.doctor === undefined ) {
    //If there are any errors, pass them to next in the correct format
    return next(new errors.InvalidArgumentError('Doctor name is required'))
  }
  
  
  //json payload of the request
  var newPatient = {
    firstname: req.body.firstname, 
    lastname: req.body.lastname,
    age: req.body.age,
    medication: req.body.medication,
    address: req.body.address,
    dateOfBirth: req.body.dateOfBirth,
    doctor: req.body.doctor
  }

  console.log("Patient POST : receiving request")
  
  //Create the product using the persistence engine
  patients.create( newPatient, function (error,patient) {

  //If there are any errors, pass them to next in the correct format
  if (error) return next(new errors.InvalidArgumentError(JSON.stringify(error.errors)))

  // Send the product if no issues
  res.send(201, patient)

  console.log("*********************************************")
  next();
  })
}


//callback function mapped to GET request
function getAllPatients(req, res, next) {
  getRequestsCount++;

  console.log("Patient GET : sending response")
  console.log("POST REQUEST COUNT ================== %d",postRequestCount)
  console.log('GET REQUEST COUNT  ================== %d', getRequestsCount);

  //Get the products using the persistence engine
  patients.find({}, function(err, foundPatients){
  
    console.log("Patient GET : receiving request")
    //send 200 HTTP response code and array of found products
    res.send(200, foundPatients);
    console.log("*********************************************")
    next();
  })
}


//callback function mapped to DELETE request
function deleteAllPatients(req, res, next) {

  
  //Delete all products using the persistence engine
  patients.deleteMany({}, function(err, patients){
      
    console.log("DELETING all patients");

      // send 200 HTTP response code 
      res.send(200, patients);
      console.log("*********************************************")
      next();
  })
}

// Get a single patient by their patient id
function getPatientsById(req, res, next){

  // Find a single patient by their id within save
  patients.findOne({ _id: req.params.id }, function (error, patientById) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    if (patientById) {
      // Send the user if no issues
      res.send(patientById)
    } else {
      // Send 404 header if the patient id doesn't exist
      res.send(404)
    }
  })
}

// Function for changing details  of patient by id
function changePatientDetailsById(req,res,next){

  if (req.body.firstname === undefined ) {
    //If there are any errors, pass them to next in the correct format
    return next(new errors.InvalidArgumentError('First Name is required'))
  }
  if (req.body.lastname === undefined ) {
    //If there are any errors, pass them to next in the correct format
    return next(new errors.InvalidArgumentError('Last Name is required'))
  }
  if (req.body.age === undefined ) {
    //If there are any errors, pass them to next in the correct format
    return next(new errors.InvalidArgumentError('Age is required'))
  }
  if (req.body.medication === undefined ) {
    //If there are any errors, pass them to next in the correct format
    return next(new errors.InvalidArgumentError('Medication is required'))
  }
  if (req.body.address === undefined ) {
    //If there are any errors, pass them to next in the correct format
    return next(new errors.InvalidArgumentError('Address is required'))
  }
  if (req.body.dateOfBirth === undefined ) {
    //If there are any errors, pass them to next in the correct format
    return next(new errors.InvalidArgumentError('Date of birth is required'))
  }
  if (req.body.doctor === undefined ) {
    //If there are any errors, pass them to next in the correct format
    return next(new errors.InvalidArgumentError('Doctor name is required'))
  }
  
  var changePatientData = {
    _id: req.params.id,
    firstname: req.body.firstname, 
    lastname: req.body.lastname,
    age: req.body.age,
    medication: req.body.medication,
    address: req.body.address,
    dateOfBirth: req.body.dateOfBirth,
    doctor: req.body.doctor
  }

  // Update the patients deatails with the persistence engine
  patients.update(changePatientData , function (error, changedData) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new errors.InvalidArgumentError("Error"))

    console.log("Record changed of patient at id "+req.params.id)

    // Send a 200 OK response
    res.send(200,changedData)
    next();
  })
}

//callback function mapped to DELETE by id request
function deletePatientRecordById(req,res,next){
  //Delete patient record using the persistence engine
patients.delete(req.params.id, function(err, patients){
      
  console.log("DELETING records at id "+req.params.id);
      // send 200 HTTP response code 
      res.send(200, patients);
      console.log("*********************************************")
      next();
  })
}