// HTML Sections
let $header = $("#mainCard");
let $inputCard = $("#inputCard");
let $alertCard = $("#alertCard");
let $mapCard = $("#mapCard");
let $newsCard = $("#newsCard");
let $button = $("#btn");

// Location Input
let $search = $("#location_input");

// Hide result divs on pageload, animate header and search button, run search function
$(document).ready(function() {
  $header.hide().fadeIn(2000);
  $inputCard
    .hide()
    .delay(1000)
    .fadeIn(2000);
  $("select").material_select();
  input();
});

// Search function on enter press
function input() {
  $search.on("keypress", function(event) {
    // If no value entered
    if (event.which === 13 && $search.val() === "") {
      event.preventDefault();
      $search.css("border-bottom", "2px solid red");
      console.log("[LOG] ERROR");

      // If value entered, remove search row from page, display new divs with ajax results
    } else if (event.which === 13) {
      $search.off("keypress");
      event.preventDefault();
      reset();
      $search.css("border-bottom", "2px solid rgb(9, 142, 14)");
      let input = $(this).val();
      $inputCard.delay(500).slideUp(1000);
      setTimeout(showCards, 1500);
      //   Embed google map
      let mapUrl =
        "https://www.google.com/maps/embed/v1/search?key=AIzaSyCv-DHBFYZNL-eaSZDKZRzE_BE5LpMcUe4&q=" +
        input;
      $("iframe").attr("src", mapUrl);

      //call the google ajax function, which in turn calls wJax()
      gJax(input);

      // News API Article Search
      let articleUrl =
        "https://newsapi.org/v2/everything?q=" + '+' +
        input +
        "&sortBy=popularity&from=2018-01-01&apiKey=ef784bd059054855ac2bcbb58bf7335e";
      $.ajax({
        url: articleUrl,
        method: "GET"
      })
        .then(function(response) {
          console.log(response);
          let results = response.articles;
          for (let i = 0; i < 10; i++) {
            let items = $("<li>");
            let links = $("<a>");
            items.append(links);
            links.html(
              "<h2>" + results[i].title + "</h2>" + results[i].description
            );
            links.attr("href", results[i].url);
            links.attr("target", "_blank");
            $(".ulText").append(items);
          }
        })
        .fail(function(err) {
          throw err;
        });
    }
  });

//ajax call the google map api to get a country code which is used in wJax()
function gJax(globalInput) {
  $.ajax({
    url:
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      globalInput +
      "&key=AIzaSyDDb1773cMxYPHcZaqKujBLjPEGhRFL0lE",
    method: "GET"
  }).then(function(response) {
    console.log(response);
    var res = response.results;
    console.log(response);
    $("#alertDiv").text(res[0].formatted_address);
    for (var i = 0; i < res[0].address_components.length; i++) {
      if (res[0].address_components[i].types[0] == "country") {
        var googleOutput = res[0].address_components[i].short_name;
      }
    }
    longitude = parseFloat(res[0].geometry.location.lng);
    lattitude = parseFloat(res[0].geometry.location.lat);
    wJax(googleOutput);
    initMap();
  });
}

//pull and display travel warning based on the country code gJax() provides, and the cordinates used in initMap
function wJax(googleOutput) {
  $.ajax({
    url: "https://api.tugo.com/v1/travelsafe/countries/" + googleOutput,
    headers: {
      "X-Auth-API-Key": "kew824h7b2xpjnw9aadbrq6k"
    },
    method: "GET"
  }).then(function(response) {
    console.log(response);
    displayWarning();

    function displayWarning() {
      let advisoryDescription = $("<p>");
      let simpleAdvice = $("<p>");
      advisoryDescription.text(response.advisories.description);
      if (response.advisoryState == 0) {
        simpleAdvice.text("Advice: Proceed as normal");
      } else if (response.advisoryState == 1) {
        simpleAdvice.text("Advice: Excercise increased caution");
      } else if (response.advisoryState == 2) {
        simpleAdvice.text("Advice: Reconsider destination");
      } else {
        simpleAdvice.text("Advice: Do not travel");
      }
      for (var i = 0; i < response.safety.safetyInfo.length; i++) {
        let newDiv = $("<li>");
        newDiv.append(
          '<a href="#!" class="dropdown-link" data-value="' +
            i +
            '">' +
            response.safety.safetyInfo[i].category
        );
        newDiv.addClass("dropdown-item");
        $("#dropdown1").append(newDiv);
      }

      $("#alertDiv").append(simpleAdvice);
      $("#alertDiv").append(advisoryDescription);
      $("#alertDiv").append("<br>");
    }

    $(document).on("click", ".dropdown-link", function() {
      $("#safetyDisplay").empty();
      var safetyIndex = $(this).attr("data-value");
      console.log(safetyIndex);
      let newDiv = $("<p>");
      newDiv.text(response.safety.safetyInfo[safetyIndex].category + ":");
      newDiv.append("<br>");
      newDiv.append(
        "<p class ='safetyDescription'>" + response.safety.safetyInfo[safetyIndex].description +"</p>"
      );
      $("#safetyDisplay").append(newDiv);
    });
  });
}
// Show result cards
function showCards() {
  $button.show();
  $mapCard.fadeIn(2000);
  $alertCard.fadeIn(2000);
  $newsCard.fadeIn(2000);
}

// Reset page on button click
function reset() {
  $button.on("click", function(event) {
    //   Prevents dupicate click assignments
    event.preventDefault();
    $button.off("click");

    //   Resets result divs and removes them from page, reloads search div, re-runs input function
    $search.val("");
    $search.css("border-bottom", "2px solid rgb(255, 255, 255)");
    $search.off("focus");
    $("p").html("");
    $("ul").html("");
    $inputCard
      .hide()
      .delay(500)
      .fadeIn(1000);
    $alertCard.hide();
    $mapCard.hide();
    $newsCard.hide();
    $button.hide();
    $("select").material_select();
    $("#alertDiv").empty();
    $(".imgBox").remove();
    input();
  });
}

function initMap() {
  var cordinates = { lat: lattitude, lng: longitude };
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: cordinates
  });
  var marker = new google.maps.Marker({
    position: cordinates,
    map: map
  });
}

//drop down menu

$(".dropdown-button").dropdown({
  inDuration: 300,
  outDuration: 225,
  constrainWidth: true, // Do es not change width of dropdown to that of the activator
  hover: true, // Activate on hover
  gutter: 0, // Spacing from edge
  belowOrigin: false, // Displays dropdown below the button
  alignment: "left", // Displays dropdown with edge aligned to the left of button
  stopPropagation: false // Stops event propagation
});
