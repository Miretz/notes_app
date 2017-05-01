/* main.js file */

/*
TODO: clean up this horrible mess
*/

var MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var WEEKDAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
  "Saturday"
];

function getDate(offset){
  var d = new Date();
  d.setDate(d.getDate() + offset);
  var n = WEEKDAYS[d.getDay()];
  var weekend = d.getDay() == 6 || d.getDay() == 0;
  return {
    "id": "note_" + d.toISOString().slice(0,10),
    "date": d,
    "weekend": weekend,
    "text": d.toLocaleDateString("sk") + ' - ' + n,
    "is_current": offset === 0,
    "start_of_month": d.getDate() === 1,
  };
}

function createSection(date){
  var panel_class = date.weekend? "panel-default" : "panel-info";
  panel_class = date.is_current? "panel-primary" : panel_class;

  var month_header = '';
  if(date.start_of_month){
    month_header = '<hr /><h2>'+ MONTHS[date.date.getMonth()] +'</h2>';
  }

  var section = [
    month_header,
    '<div class="panel '+ panel_class +'" id="' + date.id + '">',
    '<div class="panel-heading">',
    '<h3 class="panel-title">',
    '<a data-toggle="collapse" href="#collapse_' + date.id + '">',
    '' + date.text + '</a></h3>',
    '</div>',
    '<div id="collapse_' + date.id + '" class="panel-collapse collapse in">',
    '<div class="panel-body">',
    '<textarea class="form-control no-border" id="text_' + date.id + '"',
    'style="min-width: 100%"></textarea>',
    '</div>',
    '</div>',
    '</div>'];
  section = $(section.join(''));
  return section;
}

function scrollTo(days, offset_top, offset_bottom){

  //if it does not exist than generate
  if(days > offset_bottom){
    for(var i = offset_bottom; i <= days + 5; i++){
      offset_bottom = offset_bottom + 1;
      $('#container').append(createSection(getDate(offset_bottom)));
    }
  }
  if(days < offset_top){
    for(var i = offset_top; i >= days - 5; i--){
      offset_top = offset_top - 1;
      $('#container').prepend(createSection(getDate(offset_top)));
    }
  }

  $('html, body').animate({
        scrollTop: $("#" + getDate(days).id).offset().top - 120
  }, 1000);
}


$( document ).ready(function() {

  var offset_top = -10;
  var offset_bottom = 10;

  //initialization
  for(var i = offset_top; i < offset_bottom; i++){
    var date = getDate(i);
    $('#container').append(createSection(date));
  }

  //center on current date
  $('#today-link').click(function(e) {
     scrollTo(0, offset_top, offset_bottom);
       e.stopPropagation(); e.preventDefault();
  });
  $('#lw-link').click(function(e) {
     scrollTo(-7, offset_top, offset_bottom);
       e.stopPropagation(); e.preventDefault();
  });
  $('#nw-link').click(function(e) {
     scrollTo(7, offset_top, offset_bottom);
       e.stopPropagation(); e.preventDefault();
  });
  $('#lm-link').click(function(e) {
     scrollTo(-30, offset_top, offset_bottom);
       e.stopPropagation(); e.preventDefault();
  });
  $('#nm-link').click(function(e) {
     scrollTo(30, offset_top, offset_bottom);
       e.stopPropagation(); e.preventDefault();
  });

  //infinite scrolling
  var previousScroll = $(window).scrollTop();
  var scrollListener = function () {
      $(window).bind("scroll", function () {
          if ($(window).scrollTop() >= $(document).height() - $(window).height() - 100) {
            offset_bottom = offset_bottom + 1;
            $('#container').append(createSection(getDate(offset_bottom)));
          }
          if ($(window).scrollTop()!==previousScroll && $(window).scrollTop() <= 100) {
            offset_top = offset_top - 1;
            var pos = $('#container').first().offset().top;
            $('#container').prepend(createSection(getDate(offset_top)));
            $('html, body').scrollTop(pos + 100);
            previousScroll = $(window).scrollTop();
          }
      });
  };

  //scroll to the current day and start the listener
  $('html, body').animate({
        scrollTop: $("#" + getDate(0).id).offset().top - 200
  }, 1000, function(){scrollListener()});
});
