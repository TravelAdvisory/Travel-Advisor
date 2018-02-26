// HTML Sections
let $header = $("#mainCard");
let $inputCard = $("#inputCard");
let $alertCard = $("#alertCard");
let $mapCard = $("#mapCard");
let $newsCard = $("#newsCard");
let $button = $("#btn");

// Location Input
let $search = $("#location_input");

// Global Variables
let mapUrl;
let articleUrl;
let dataUrl;
let countryUrl;
let country;

// Hide result divs on pageload, animate header and search button, run search function
$(document).ready(function () {
  $header.hide().fadeIn(2000);
  locationSearchDiv();
  $inputCard
    .hide()
    .delay(1000)
    .fadeIn(2000);
  $alertCard.hide();
  $mapCard.hide();
  $newsCard.hide();
  $button.hide();
  $("select").material_select();
  input();
});

// Search function on enter press
function input() {
  $(document).on("keypress", $search, function (event) {
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
      console.log("[LOG] " + input);

      //   Test appends
      let pDiv = $('#alertDiv');
      pDiv.text(input);
      let $li = $("<li>");
      $li.text(input + " List Item(s)");
      $(".ulText").append($li);

      //   Embed google map
      mapUrl =
        "https://www.google.com/maps/embed/v1/search?key=AIzaSyCv-DHBFYZNL-eaSZDKZRzE_BE5LpMcUe4&q=" +
        input;
      $("iframe").attr("src", mapUrl);
    }
  });
}

//Creating html elements w/ jquery
function locationSearchDiv() {
  var $row = $("<div>");
  $row.addClass("row");
  $row.attr("id", "inputCard");
  var $col = $("<div>");
  $col.addClass("col s12 m6 offset-m3");
  var $background = $("<div>");
  $background.addClass("card inputBackground");
  var $content = $("<div>");
  $content.addClass("card-content");
  $content.html('<span class="card-title">Where do you want to go?</span>' +
    '<br>' +
    '<div class="row">' +
    '<div class="input-field">' +
    '<input id="location_input" type="text">' +
    '<label class="active inputLabel" for="location_input" id="search">Search:</label>' +
    '</div >' +
    '</div >')
  $("main").append($row);
  $row.append($col);
  $col.append($background);
  $background.append($content);
}

//taking pre-existing html code and remaking it w/ jquery
function travelAlertsMapsDiv() {
  var $travelAlert = $("<div>");
  $travelAlert.html('<div class="row">' +
    '<div class="col s12 m6">' +
    '<div class="card" id="alertCard">' +
    '<div class="card-content white-text">' +
    '<span class="card-title mainText alerts">Travel Information</span>' +
    '<p id="alertDiv"></p>' +
    '</div>' +
    '</div>' +
    '</div>' +

    '<div class="col s12 m6">' +
    '<div class="card" id="mapCard">' +
    '<div class="card-content white-text">' +
    '<span class="card-title mainText">Map</span>' +
    '<iframe min-height="450px" min-width="450px" frameborder="0" style="border:0"></iframe>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>')
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
  $button.on("click", function (event) {
    //   Prevents dupicate click assignments
    event.preventDefault();
    $button.off("click");

    //   Resets result divs and removes them from page, reloads search div, re-runs input function
    $search.val("");
    $search.css("border-bottom", "2px solid rgb(255, 255, 255)");
    $search.off("focus");
    $('p').html('');
    $("ul").html('')
    $inputCard
      .hide()
      .delay(500)
      .fadeIn(1000);
    $alertCard.hide();
    $mapCard.hide();
    $newsCard.hide();
    $button.hide();
    $("select").material_select();
    input();
  });
}
//test editing stuff
