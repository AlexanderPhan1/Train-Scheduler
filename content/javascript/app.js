// Initialize Firebase
var config = {
    apiKey: "AIzaSyDt1PmYRLAKN2GnyGsXu9wnQ1gVgPXQW_8",
    authDomain: "train-schedule-database-d626d.firebaseio.com/",
    databaseURL: "https://train-schedule-database-d626d.firebaseio.com/",
    projectId: "train-schedule-database-d626d",
    storageBucket: "gs://train-schedule-database-d626d.appspot.com",
    messagingSenderId: "579703207440"
  };
  firebase.initializeApp(config);
  
  var database = firebase.database()
  var trainDataRef = firebase.database().ref('/train_data')
  
  
  
  
  
  
  // When document loads
  $(document).ready(()=> {
  
  
  
  
      // on sign in submit 
      $('#sign-in-submit').on('click', (e) => {
  
          e.preventDefault()
  
          // Grab user inputs
          let userEmail = $('#email-input').val().trim(),
              userPassword = $('#password-input').val().trim()
      
          console.log(userEmail);
          console.log(userPassword);
  
          firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // [START_EXCLUDE]
              if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
              } else {
                alert(errorMessage);
              }
              console.log(error);
              // [END_EXCLUDE]
          });
  
          firebase.auth().onAuthStateChanged(function(user) {
              if (user) {
                // User is signed in.
                console.log(user);
                
              } else {
                // No user is signed in.
                console.log('Not signed in');
                
              }
          });
  
          $('#email-input').val('')
          $('#password-input').val('')
          
      })
  

      $('#sign-up-submit').on('click', (e) => {
  
          e.preventDefault()
  
          let userName = $('#user-name-input').val().trim(),
              userEmail = $('#user-email-input').val().trim(),
              userPassword = $('#user-password-input').val().trim(),
              userPasswordConfirm = $('#user-passwordConfirm-input').val().trim()
              
              
              firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
                  // Handle Errors here.
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  // ...
              });
              
              $('#user-name-input').val('')
              $('#user-email-input').val('')
              $('#user-password-input').val('')
              $('#user-passwordConfirm-input').val('')
  
      })
  
  
  
  
  
  
  
      

      $('#train-submit').on('click', (e) => {
  
          
              e.preventDefault()
              
              // User inputs except for minutesAway & nextArrival
              var name = $('#train-name').val().trim(),
                  destination = $('#train-destination').val().trim(),
                  frequency = $('#train-frequency').val().trim(),
                  time = $('#train-time').val().trim()
  
              // Conversions for nextArrival & minutesAway
              // Assumptions
              var runFrequency = frequency,
                  // First train runs @
                  trainStartTime = time,
                  // Take the irst time and pushes the date back a year to make sure it comes before the current time
                  backOneYear = moment(trainStartTime, 'HH:mm').subtract(1, 'years'),
                  // Current time
                  currentTime = moment(),
                  // Difference between the times 
                  diffInMinutes = moment().diff(moment(backOneYear), "minutes"),
                  // Time appart (remainder)
                  tRemainder = diffInMinutes % runFrequency,
                  // Minutes until train 
                  minutesTillNextTrain = runFrequency - tRemainder,
                  // Next train
                  nextTrainArrival = moment().add(minutesTillNextTrain, 'minutes')
                  
                  trainDataRef.push({
                      name: name,
                      destination: destination,
                      time: time,
                      frequency: frequency,
                      nxtArrival: moment(nextTrainArrival).format('hh:mm A'),
                      minsAway: minutesTillNextTrain
                  })
                  
                  
                  $('#train-name').val('')
                  $('#train-destination').val('')
                  $('#train-frequency').val('')
                  $('#train-time').val('')
                  
                  
              
              })
          })
  
          
  trainDataRef.on('child_added', function(snap){
      if(snap){
          $('#train-table tbody').append(buildTrain(snap.val().name, snap.val().destination, snap.val().frequency, snap.val().nxtArrival, snap.val().minsAway))
      }
  }, function(errorObject){
      console.log('Errors handled: ' + errorObject.code)
  })
  
  

  trainDataRef.orderByChild('dateAdded').limitToLast(1).on('child_added', function(snap){
      if(snap){
          $('#recent-train-table tbody').html(buildTrain(snap.val().name, snap.val().destination, snap.val().frequency, snap.val().nxtArrival, snap.val().minsAway))
      }
  }, function(errorObject){
      console.log('Erros handled: ' + errorObject.code);
      
  })
  

  
  function buildTrain(name, destination, frequency, nxtArrival, minsAway){
      
      return $(
          '<tr>'+
          '<th class="t-name">'+ name +'</th>'+
              '<td class="t-destination">'+ destination +'</td>'+
              '<td class="t-frequency">'+ frequency +'</td>'+
              '<td class="t-nxtArrival">'+ nxtArrival +'</td>'+
              '<td class="t-minsAway">'+ minsAway +'</td>'+
              '</tr>'
          )
      }
      
  
  
  
