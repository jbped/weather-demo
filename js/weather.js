$(function () {
  // React to hitting enter in the text box instead of clicking submit.
  $('#search-weather').submit(function (e) {
    e.preventDefault();
    clearResult('');

    // Get the weather info for the selected search location.
    $.get('/weather.php?query=' + $('#search').val(), function (data) {
      // Show weather results.
      if (data.temp_f) {
        showResult(data);
      } else {
        clearResult('No valid data for your location.');
      }
    });
  });

  function clearResult($msg = 'Sorry Charlie! Not a valid input.') {
    $('.weather_icon').attr('src', 'images/trans.png');
    $('.details').hide();
    $('#location').hide();
    $('#city').text();
    $('#state').text();
    $('.result .description').html($msg);
  }

  function showResult(data) {
    $('.weather_icon').attr('src', data.icon_url);
    $('.details').show();
    $('#location').show();
    $('#city').text(data.city);
    $('#state').text(data.state);

    for (let i = 0; i < data.forecast.length; i++) {
      const dayContainer = $('<div></div>').attr('id', `forecast-${i}`);
      const imageData = $('<img/>').attr(
        'src',
        data.forecast[i].day.condition.icon
      );
      const dateData = $('<p></p>').text(data.forecast[i].date);
      const descriptionData = $('<p></p>').text(
        data.forecast[i].day.condition.text
      );
      $(dayContainer).append(dateData);
      $(dayContainer).append(imageData);
      $(dayContainer).append(descriptionData);
      $('.forecast').append(dayContainer);
    }

    var desc = data.weather + ' and ' + data.temp_f + '&deg; F';
    $('.result .description').html(desc);
  }
});
