/* global Parse */

var API_SEARCH_SOLUTION = "http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/soluzioniViaggioNew/{IDDEPARTURESTATION}/{IDARRIVALSTATION}/{DEPARTURETIME}";
var API_STATION_STATUS = "http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/{TYPE}/{IDSTATION}/{DATETIME}";

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("getSolutions", function(request, response) {
  //to get parameters: i.e. request.params.idTrain 
  var _idDepartureStation, _idArrivalStation, _departureTime, _dateTime;
  _idDepartureStation = request.params.idDepartureStation;
  _idArrivalStation = request.params.idArrivalStation;
  _departureTime = request.params.departureTime;
  _dateTime = request.params.dateTime;
  console.log(_idDepartureStation);
  
  Parse.Cloud.httpRequest({
    url: API_SEARCH_SOLUTION.replace("{IDDEPARTURESTATION}",_idDepartureStation).replace("{IDARRIVALSTATION}",_idArrivalStation).replace("{DEPARTURETIME}",_departureTime)
  }).then(function(httpResponse) {
    // success first call
    console.log("Prima chiamata");
    return httpResponse.text;
  },function(httpResponse) {
    // error second call
    console.error('Request failed with response code ' + httpResponse.status);
    response.error(httpResponse.status);
  }).then(function(firstResponse){
    // second call
    Parse.Cloud.httpRequest({
      url: API_STATION_STATUS.replace("{IDSTATION}",_idDepartureStation).replace("{TYPE}","partenze").replace("{DATETIME}",_dateTime)
    }).then(function(httpResponse) {
      // success first call
      console.log("Seconda chiamata");
      return "Prima: " + firstResponse + "\nSeconda: "+httpResponse.text;
    },function(httpResponse) {
      // error second call
      console.error('Request failed with response code ' + httpResponse.status);
      response.error(httpResponse.status);
    })
  }).then(function(result){
    response.succes(result);
  });
});
