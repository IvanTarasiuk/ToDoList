var Cal = function(divId) {

  // Save the div identifier
  this.divId = divId;

  // Days of the week starting from Monday
  this.DaysOfWeek = [
    'Пн',
    'Вт',
    'Ср',
    'Чтв',
    'Птн',
    'Суб',
    'Вск'
  ];

  // Months starting from January
  this.Months =['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

  // Set the current month and year
  var today = new Date();
  this.currYear = today.getFullYear();
  this.currMonth = today.getMonth();
  this.currDay = today.getDate();
};

// Go to the next month
Cal.prototype.nextMonth = function() {
  if ( this.currMonth == 11 ) {
    this.currMonth = 0;
    this.currYear = this.currYear + 1;
  }
  else {
    this.currMonth = this.currMonth + 1;
  }
  this.showcurr();
};

// Go to the previous month
Cal.prototype.previousMonth = function() {
  if ( this.currMonth == 0 ) {
    this.currMonth = 11;
    this.currYear = this.currYear - 1;
  }
  else {
    this.currMonth = this.currMonth - 1;
  }
  this.showcurr();
};

// Show the current month
Cal.prototype.showcurr = function() {
  this.showMonth(this.currYear, this.currMonth);
};

// Show the month (year, month)
Cal.prototype.showMonth = function(y, m) {

  var d = new Date()
  // The first day of the week in the selected month
  , firstDayOfMonth = new Date(y, m, 7).getDay()
  // The last day of the selected month
  , lastDateOfMonth =  new Date(y, m+1, 0).getDate()
  // The last day of the previous month
  , lastDayOfLastMonth = m == 0 ? new Date(y-1, 11, 0).getDate() : new Date(y, m, 0).getDate();


  var html = '<table>';

  // Write the selected month and year
  html += '<thead><tr>';
  html += '<td colspan="7">' + this.Months[m] + ' ' + y + '</td>';
  html += '</tr></thead>';


  // Weekday header
  html += '<tr class="days">';
  for(var i=0; i < this.DaysOfWeek.length;i++) {
    html += '<td>' + this.DaysOfWeek[i] + '</td>';
  }
  html += '</tr>';

  // Write the days
  var i=1;
  do {

    var dow = new Date(y, m, i).getDay();

    // Start a new row on Monday
    if ( dow == 1 ) {
      html += '<tr>';
    }
    
    // If the first day of the week is not Monday, show the last days of the previous month
    else if ( i == 1 ) {
      html += '<tr>';
      var k = lastDayOfLastMonth - firstDayOfMonth+1;
      for(var j=0; j < firstDayOfMonth; j++) {
        html += '<td class="not-current">' + k + '</td>';
        k++;
      }
    }

    // Write the current day in the loop
    var chk = new Date();
    var chkY = chk.getFullYear();
    var chkM = chk.getMonth();
    if (chkY == this.currYear && chkM == this.currMonth && i == this.currDay) {
      html += '<td class="today">' + i + '</td>';
    } else {
      html += '<td class="normal">' + i + '</td>';
    }
    // Close the row on Sunday
    if ( dow == 0 ) {
      html += '</tr>';
    }
    // If the last day of the month is not Sunday, show the first days of the next month
    else if ( i == lastDateOfMonth ) {
      var k=1;
      for(dow; dow < 7; dow++) {
        html += '<td class="not-current">' + k + '</td>';
        k++;
      }
    }

    i++;
  }while(i <= lastDateOfMonth);

  // End the table
  html += '</table>';

  // Write HTML to the div
  document.getElementById(this.divId).innerHTML = html;
};

// When the window loads
window.onload = function() {

  // Start the calendar
  var c = new Cal("divCal");
  c.showcurr();

  // Attach the "Next" and "Previous" buttons
  getId('btnNext').onclick = function() {
    c.nextMonth();
  };
  getId('btnPrev').onclick = function() {
    c.previousMonth();
  };
}

// Get element by id
function getId(id) {
  return document.getElementById(id);
}


