
$(document).ready(function(){
  
// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyDt1PmYRLAKN2GnyGsXu9wnQ1gVgPXQW_8",
    authDomain: "train-schedule-database-d626d.firebaseio.com/",
    databaseURL: "https://train-schedule-database-d626d.firebaseio.com/",
    projectId: "train-schedule-database-d626d",
    storageBucket: "train-schedule-database-d626d.appspot.com",
    messagingSenderId: "579703207440"
};
    firebase.initializeApp(config);
    
// ================================================================================================================================
var database = firebase.database();


$("#addTrainBtn").on("click", function(event){
     
     event.preventDefault();

	
	var trainName = $("#trainNameInput").val().trim();
	var dest = $("#destinationInput").val().trim();
	var firstTrain = moment($("#firstTrainInput").val().trim(),"HH:mm" ).format("X");
	var freq = $("#frequencyInput").val().trim();
	

	
	var newTrain = {
		name:  trainName,
		dest: dest,
		start: firstTrain,
		frequency: freq
	}

	
	database.ref().push(newTrain);
	
	console.log(newTrain.name);
	console.log(newTrain.dest);
	console.log(newTrain.start);
	console.log(newTrain.frequency);


	alert("Train Schedule successfully added");


	$("#trainNameInput").val("");
	$("#destinationInput").val("");
	$("#firstTrainInput").val("");
	$("#frequencyInput").val("");


	return false;

});




database.ref().on("child_added", function(childSnapshot, prevChildKey){

	console.log(childSnapshot.val());

	
	var trainName = childSnapshot.val().name;
	var trainDest = childSnapshot.val().dest;
	var trainStart = childSnapshot.val().start;
	var trainFreq = childSnapshot.val().frequency;
	var key = childSnapshot.key;
	var remove = "<button class='glyphicon glyphicon-trash' id=" + key + "></button>"
	var updateMe = "<button class='glyphicon glyphicon-edit' id=" + key + "></button>"

	
	console.log(trainName);
	console.log(trainDest);
	console.log(trainStart);
	console.log(trainFreq);


   var currentTime = moment();
    console.log("Current Time: " + moment(currentTime).format("hh:mm"));
    setInterval(function(){
    $('#current-status').html("Current Time: " + moment().format('dddd, MMMM Do YYYY, HH:mm:ss a'))
   }, 1000);



  var firstTimeConverted = moment(trainStart, "hh:mm").subtract(1, "years");
  //console.log("FTC: "+firstTimeConverted);

 
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  
  
  var timeRemainder = diffTime % trainFreq ;

  
  var minutes = trainFreq - timeRemainder;

  
  var nextTrain = moment().add(minutes, "minutes");

  
  var nextTrainArrival = moment(nextTrain).format("hh:mm a");
	

  
  $("#trainTable > tbody").prepend("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainFreq + "</td><td>" + nextTrainArrival  + "</td><td>" + minutes + "</td><td>"+ remove +  "</td></tr>");
  
  }, function(err) {
        console.log(err);
    });

    

    
        $(document).on("click", ".glyphicon-trash", deleteTrain);

         function deleteTrain() {
        	alert("are you sure , you want delete this data ??");
          
        	var deleteKey = $(this).attr("id");
            database.ref().child(deleteKey).remove();
            location.reload();
        }
  
   });   


	


