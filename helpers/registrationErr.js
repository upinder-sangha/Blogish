// contains logic to display home page based on whether there was a registration error or 
// the user is visitiing home page for the first time. if there was error then register modal will trigger

var registrationErr = false;

exports.getRegistrationErr = function() {
  return registrationErr;
};

exports.setRegistrationErr = function(value) {
  //validate the name...
  registrationErr = value;
};