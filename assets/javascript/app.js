//Firebase config settings/variable
var firebaseConfig = {
    apiKey: "AIzaSyCb_s-IpqYLsZcKPlP84EXYe6TFJTJRe1w",
    authDomain: "uber-schedule-2019.firebaseapp.com",
    databaseURL: "https://uber-schedule-2019.firebaseio.com",
    projectId: "uber-schedule-2019",
    storageBucket: "uber-schedule-2019.appspot.com",
    messagingSenderId: "227444618952",
    appId: "1:227444618952:web:665412be9db4fcb4e757fd",
    measurementId: "G-C2KL9WK2QH"
  };
  /*Initialize Firebase*/
  firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var name;
var destination;
var firstUber;
var frequency = 0;

$("#add-uber").on("click", function(event) {
    event.preventDefault();

/*User input from fields and store them in variables*/
var name = $("#name").val().trim();
var destination = $("#destination").val().trim();
var firstUber = moment($("#first-uber").val().trim(), "hh:mm A").format("x");
var frequency = $("#frequency").val().trim();

/*USER INPUT WARNINGS*/

if(name == "" || name == null){
    alert("Please enter a Uber name!");

    return false;
  }
  if(destination == "" || destination == null){
    alert("Please enter an uber destination!");

    return false;
  }
  if(firstUber == "" || firstUber == null){
    alert("Please enter a initial time for your Uber!");

    return false;
  }
  if(frequency == "" || frequency == null || frequency  < 1){
    alert("Please enter an arrival frequency (in minutes)!" + "\n" + "It must be an integer greater than zero.");

    return false;
  }

  /*First Uber arival time in 24:00*/

     /*If/else conditionails to check the digits*/

    if(firstUber.length != 5 || firstUber.substring(2,3) != ":"){
        alert("Please use Military Time! \n" + "Example: 01:00 or 13:00");
        return false;
      }
      
      /*Check*/
      else if( isNaN(parseInt(firstUber.substring(0, 2))) || isNaN(parseInt(firstUber.substring(3))) ){
        alert("Please use Military Time! \n" + "Example: 01:00 or 13:00");
        return false;
      }

      /*Check 00:00 to 23:00*/
      else if( parseInt(firstUber.substring(0, 2)) < 0 || parseInt(firstUber.substring(0, 2)) > 23 ){
        alert("Please use Military Time! \n" + "Example: 01:00 or 13:00");
        return false;
      }

      /*Check 00:00 to 00:59*/
      else if( parseInt(firstUber.substring(3)) < 0 || parseInt(firstUber.substring(3)) > 59 ){
        alert("Please use Military Time! \n" + "Example: 01:00 or 13:00");
        return false;   
      }
    

database.ref().push({
    name: name,
    destination: destination,
    firstUber: firstUber,
    frequency: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
});

$("form")[0].reset();
});

/*Uploads uber data to the database*/
console.log(name);
console.log(destination);
console.log(firstUber);
console.log(frequency);

database.ref().on("child_added", function(childSnapshot) {
    var minAway;

    /*Moment calculation for time away from given input*/
    var firstUberNew = moment(childSnapshot.val().firstUber, "hh:mm A").subtract(1, "minutes");

    /*Time difference calculation between the current and firstUber*/
    var diffTime = moment().diff(moment(firstUberNew), "minutes");
    console.log(diffTime);
    var remainder = diffTime % childSnapshot.val().frequency;


    /*Function to calculate the minutes until next uber ride*/
    var minAway = childSnapshot.val().frequency - remainder;
    
    var nextUber = moment().add(minAway, "minutes");
    nextUber = moment(nextUber).format("hh:mm A");

    /*Append section*/
    $("#append-row").append("<tr><td>" + childSnapshot.val().name +
            "</td><td>" + childSnapshot.val().destination +
            "</td><td>" + childSnapshot.val().frequency +
            "</td><td>" + nextUber + 
            "</td><td>" + minAway + "</td></tr>");
});

database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
    // Change the HTML to reflect
    $("#name-display").html(snapshot.val().name);
    $("#email-display").html(snapshot.val().email);
    $("#age-display").html(snapshot.val().age);
    $("#comment-display").html(snapshot.val().comment);


function currentTime(){
        var timeNow = moment().format("hh:mm:ss A");
        $("#current-time").text(timeNow);
      
        // Refresh the Page every minute, on the minute
        var secondsNow = moment().format("ss");
        secondsNow;
      }

setInterval(currentTime,1000);
});
