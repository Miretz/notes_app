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


function getDate(offset) {
  var d = new Date();
  d.setDate(d.getDate() + offset);
  var n = WEEKDAYS[d.getDay()];
  var weekend = d.getDay() === 6 || d.getDay() === 0;
  return {
    "id": "note_" + d.toISOString().slice(0, 10),
    "date": d,
    "weekend": weekend,
    "text": d.toLocaleDateString("sk") + ' - ' + n,
    "is_current": offset === 0,
    "start_of_month": d.getDate() === 1,
    "start_of_week": d.getDay() === 1
  };
}


function getWeekOfYear(date) {
  var onejan = new Date(new Date().getFullYear(), 0, 1);
  var dayOfYear = ((date.date - onejan + 1) / 86400000);
  return Math.ceil(dayOfYear / 7);
}


function getNoteHeader(date) {
  var header = '';
  if (date.start_of_month) {
    header += '<hr /><h2>' + MONTHS[date.date.getMonth()] + '</h2>';
  }
  if (date.start_of_week) {
    header += '<hr /><p>Week ' + getWeekOfYear(date) + '</p>';
  }
  return header;
}


function getPanelClass(date) {
  var panel_class = date.weekend ? "panel-default" : "panel-info";
  return date.is_current ? "panel-primary" : panel_class;
}


function createSection(date) {

  var panel_class = getPanelClass(date);
  var header = getNoteHeader(date);

  //collapse weekend notes
  var collapse = date.weekend ? '' : 'in';
  var section = [
    header,
    '<div class="panel ' + panel_class + '" id="' + date.id + '">',
    '<div class="panel-heading">',
    '<h3 class="panel-title">',
    '<a data-toggle="collapse" href="#collapse_' + date.id + '">',
    '' + date.text + '</a></h3>',
    '</div>',
    '<div id="collapse_' + date.id + '" class="panel-collapse collapse ' + collapse + '">',
    '<div class="panel-body">',
    '<textarea class="form-control no-border" id="text_' + date.id + '"',
    'style="min-width: 100%"></textarea>',
    '</div>',
    '</div>',
    '</div>'
  ];
  section = $(section.join(''));
  return section;
}


function initializeLinks() {
  $('#today-link').click(function(e) {
    scrollTo(0);
    e.stopPropagation();
    e.preventDefault();
  });
  $('#lw-link').click(function(e) {
    scrollTo(-7);
    e.stopPropagation();
    e.preventDefault();
  });
  $('#nw-link').click(function(e) {
    scrollTo(7);
    e.stopPropagation();
    e.preventDefault();
  });
  $('#lm-link').click(function(e) {
    scrollTo(-30);
    e.stopPropagation();
    e.preventDefault();
  });
  $('#nm-link').click(function(e) {
    scrollTo(30);
    e.stopPropagation();
    e.preventDefault();
  });
}


function scrollTo(days) {

  //if it does not exist than generate
  var i = 0;
  if (days > window.offset_bottom) {
    for (i = window.offset_bottom; i <= days + 5; i++) {
      addNoteBottom();
    }
  } else if (days < offset_top) {
    for (i = window.offset_top; i >= days - 5; i--) {
      addNoteTop();
    }
  }

  $('html, body').animate({
    scrollTop: $("#" + getDate(days).id).offset().top - 120
  }, 1000);
}


function addNoteBottom() {
  window.offset_bottom = window.offset_bottom + 1;
  $('#container').append(createSection(getDate(window.offset_bottom)));
}


function addNoteTop() {
  window.offset_top = window.offset_top - 1;
  $('#container').prepend(createSection(getDate(window.offset_top)));
}


function initializeNotes() {
  for (var i = window.offset_top; i < window.offset_bottom; i++) {
    var date = getDate(i);
    $('#container').append(createSection(date));
  }
}


function scrollListener() {
  $(window).bind("scroll", function() {
    if ($(window).scrollTop() >= $(document).height() - $(window).height() - 100) {
      addNoteBottom();
    }
    if ($(window).scrollTop() !== window.previousScroll && $(window).scrollTop() <= 100) {
      var pos = $('#container').first().offset().top;
      addNoteTop();
      $('html, body').scrollTop(pos + 100);
      window.previousScroll = $(window).scrollTop();
    }
  });
}


$(document).ready(function() {

  window.offset_top = -10;
  window.offset_bottom = 10;

  //initialization
  initializeNotes();
  initializeLinks();

  window.previousScroll = $(window).scrollTop();

  //scroll to the current day and start the listener
  $('html, body').animate({
    scrollTop: $("#" + getDate(0).id).offset().top - 200
  }, 1000, function() {
    scrollListener();
  });
});
