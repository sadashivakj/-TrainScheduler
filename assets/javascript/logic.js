
$(document).ready(function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAfcYhMSj9QR8wfRp21lpOOgoANrqRjgjg",
    authDomain: "train-scheduler-33546.firebaseapp.com",
    databaseURL: "https://train-scheduler-33546.firebaseio.com",
    projectId: "train-scheduler-33546",
    storageBucket: "train-scheduler-33546.appspot.com",
    messagingSenderId: "162983700820"
  };

  firebase.initializeApp(config);

  var database = firebase.database();
  var trainName;
  var endDestination;
  var firstTrainTime;
  var frequency;
  var tArrival;
  var tDiff;
  var tLeft;
  var tModulus;
  var tStart;
  var tFreq;

    function getArrivalMinAway(tFirstTrainTime, tFrequency){
      
      tStart = moment(tFirstTrainTime, "HH:mm");
      tFreq = parseInt(tFrequency);
      tDiff = moment().diff(tStart, "minutes");
      
      if(tDiff < 0){
        tArrival = moment(tStart).format("HH:mm A");
        tLeft = moment(tStart).diff(moment(), "minutes");
      } else {
        tModulus = tDiff % tFreq;
        tLeft = tFreq - tModulus;
        tArrival = moment().add(tLeft, "minutes").format("HH:mm A");
      }
    }

   $("#submitBtn").on("click", function() {

      trainName = $("#trainName").val().trim();
      endDestination = $("#endDestination").val().trim();
      firstTrainTime = $("#firstTrainTime").val().trim();
      freq = $("#freq").val().trim();

      var newTrainName = {
        trainName: trainName,
        endDestination: endDestination,
        firstTrainTime: firstTrainTime,
        freq: freq
      };

      firstTrainTime = moment(firstTrainTime).format("HH:mm");
      database.ref().push(newTrainName);
    });

   	database.ref().on("child_added", function(childSnapshot){

      var tName = childSnapshot.val().trainName;
   	  var tDestination = childSnapshot.val().endDestination;
   		var tFrequency = childSnapshot.val().freq;
   		var tFirstTrainTime = childSnapshot.val().firstTrainTime;

      getArrivalMinAway(tFirstTrainTime, tFrequency);

   		var newRow = 
   			"<tr> <td> "+ tName + "</td>"+
   			"<td> "+ tDestination + "</td>"+
   			"<td> "+ tFrequency + "</td>"+
   			"<td> "+ tArrival + "</td>"+
   			"<td> "+ tLeft + "</td> </tr>";
   			   		
   		 $("#trainSchedule").append(newRow);
   		
   	 },function(errorObject) {
       console.log("The read failed: " + errorObject.code);
   });

});