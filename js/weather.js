$(function () {
  let selectedBox = $('input[name="weather-select"]:checked').val();
  let apiData = {};

  $('#button-container').on('click', function (e) {
    if (e.target.type === 'radio') {
      selectedBox = e.target.value;
      if (Object.keys(apiData).length) {
        displayResults();
      }
    }
  });

  // React to hitting enter in the text box instead of clicking submit.
  $('#search-weather').submit(function (e) {
    e.preventDefault();
    clearResult('');

    // Get the weather info for the selected search location.
    $.get('weather.php?query=' + $('#search').val(), function (data) {
      console.log(data);
      prepResult(data);
    }).fail(function (data) {
      var err = JSON.parse(data.responseText);
      displayErr(err.error);
    });
  });

  function displayErr(msg) {
    const errorDiv = $('<div></div>').addClass('error-div');
    const errorTxt = $('<p></p>').text(msg).addClass('error-text');
    errorDiv.append(errorTxt);
    $('header').append(errorDiv);
  }

  function clearResult(msg) {
    $('.weather_icon').attr('src', 'images/trans.png');
    $('.result').hide();
    $('#city').text();
    $('#state').text();
    $('.forecast').html('');
    $('.error-div').html('');
    apiData = {};
  }

  function prepResult(data) {
    $('#city').text(data.city);
    $('#state').text(data.state);
    $('.weather_icon').attr('src', data.icon_url);
    var desc = data.weather + ' and ' + data.temp_f + '&deg; F';
    $('.result .description').html(desc);

    for (let i = 0; i < data.forecast.length; i++) {
      const dayContainer = $('<div></div>')
        .attr('id', `forecast-${i}`)
        .addClass('forecast-day-box')
        .addClass('weather-box');
      const imageData = $('<img/>').attr(
        'src',
        data.forecast[i].day.condition.icon
      );
      const dateData = $('<p></p>').text(data.forecast[i].date);
      const forecastDesc =
        data.forecast[i].day.condition.text +
        ' and an average of ' +
        data.forecast[i].day.avgtemp_f +
        '&deg; F';
      const descriptionData = $('<p></p>').html(forecastDesc);
      $(dayContainer).append(dateData);
      $(dayContainer).append(imageData);
      $(dayContainer).append(descriptionData);
      $('.forecast').append(dayContainer);
    }

    displayResults();
  }

  function displayResults() {
    $('.result').show();
    if (selectedBox === 'current') {
      $('.forecast').hide();
      $('#location').text('Current weather in ');
      $('.current').show();
    } else {
      $('.current').hide();
      $('#location').text('3-Day Forecast in ');
      $('.forecast').css('display', 'flex');
    }
  }
});
