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
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var name;
var destination;
var firstUber;
var frequency = 0;

$("#add-uber").on("click", function(event) {
    event.preventDefault();

//User input from fields and store them in variables
var name = $("#name").val().trim();
var destination = $("#destination").val().trim();
var firstUber = $("#first-uber").val().trim();
var frequency = $("#frequency").val().trim();

//Store values locally
//var = moment($("start-input").val().trim(), "MM/DD/YYYY").format("x");

database.ref().push({
    name: name,
    destination: destination,
    firstUber: firstUber,
    frequency: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
});

$("form")[0].reset();
});

//Uploads artist data to the database
console.log(name);
console.log(destination);
console.log(firstUber);
console.log(frequency);

database.ref().on("child_added", function(childSnapshot) {
    var minAway;

    // Moment calculation for time away from given input
    var firstUberNew = moment(childSnapshot.val().firstUber, "hh:mm A").subtract(1, "minutes");

    // t-minus Calculation between the current and firstUber
    var diffTime = moment().diff(moment(firstUberNew), "minutes");
    console.log(diffTime);
    var remainder = diffTime % childSnapshot.val().frequency;


    // Function to calculate the minutes until next uber ride
    var minAway = childSnapshot.val().frequency - remainder;
    
    var nextUber = moment().add(minAway, "minutes");
    nextUber = moment(nextUber).format("hh:mm A");

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
});
