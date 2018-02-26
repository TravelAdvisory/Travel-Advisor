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
let globalInput;
let googleOutput;
let fullAddress;

// Hide result divs on pageload, animate header and search button, run search function
$(document).ready(function () {
  $header.hide().fadeIn(2000);
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
  $search.on("keypress", function (event) {
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
      globalInput = input;
      $inputCard.delay(500).slideUp(1000);
      setTimeout(showCards, 1500);
      //   Test appends
      let pDiv = $("#alertDiv");
      pDiv.text(input);
      let $li = $("<li>");
      $li.text(input + " List Item(s)");
      $(".ulText").append($li);

      //   Embed google map
      mapUrl =
        "https://www.google.com/maps/embed/v1/search?key=AIzaSyCv-DHBFYZNL-eaSZDKZRzE_BE5LpMcUe4&q=" +
        input;
      $("iframe").attr("src", mapUrl);

      //call the google ajax function, which in turn calls wJax()
      gJax();

      // NYT Article Search
      let articleUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
      articleUrl +=
        "?" +
        $.param({
          "api-key": "86e69aec8bcd4924a738d6c56057f048",
          q: input
        });
      $.ajax({
        url: articleUrl,
        method: "GET",
        sort: "newest"
      })
      .then(function(response) {
        let results = response.response.docs;
        for (let i = 0; i < results.length; i++) {
          let items = $("<li>");
          let links = $("<a>");
          items.append(links);
          links.html(
            "<h2>" +
              results[i].headline.main +
              "</h2>" +
              results[i].snippet
          );
          links.attr("href", results[i].web_url);
          links.attr('target', '_blank');
          $("ul").append(items);
        }
      })
      .fail(function(err) {
        throw err;
      });
    }
  });
}

//ajax call the google map api to get a country code which is used in wJax()
function gJax() {
  $.ajax({
    url:
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      globalInput,
    method: "GET"
  }).then(function(response) {
    var res = response.results;
    $("#alertDiv").text(res[0].formatted_address);
    for (var i = 0; i < res[0].address_components.length; i++) {
      if (res[0].address_components[i].types[0] == "country") {
        googleOutput = res[0].address_components[i].short_name;
      }
    }
    wJax();
  });
}

//pull and display travel warning based on the country code gJax() provides
function wJax() {
  console.log(googleOutput);
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
      let dangerIcon = $("<img/>");
      dangerIcon.addClass('imgBox');
      advisoryDescription.text(response.advisories.description);
      //display according text based on advisoryState level
      if (response.advisoryState == 0) {
        simpleAdvice.text("Advice: Proceed with normal precautions");
        dangerIcon.attr("src","assets/images/level0.png");
      } else if (response.advisoryState == 1) {
        simpleAdvice.text("Advice: Excercise increased caution");
        dangerIcon.attr("src","assets/images/level1.png");
      } else if (response.advisoryState == 2) {
        simpleAdvice.text("Advice: Reconsider destination");
        dangerIcon.attr("src","assets/images/level2.png");
      } else 
      {
        simpleAdvice.text("Advice: Do not travel");
        dangerIcon.attr("src","assets/images/level3.png");
      }
      $("#alertCard").append(dangerIcon);
      $("#alertCard").append(simpleAdvice);
      $("#alertCard").append(advisoryDescription);

    }

  });
}

// Display County Warnings

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
    $("#alertCard").empty();
    input();
  });
}