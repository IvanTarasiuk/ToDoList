function appToDoList(containerId) {

    const container = document.getElementById(containerId);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="container">
        <h1>Список дел</h1> <!-- Добавленный заголовок -->
        <button id="addEventButton" onclick="showAddEventMenu()">Добавить событие</button> <!-- Кнопка "Добавить событие" -->
        <div id="calendarContainer">
            <div id="divCal"></div>
            <button id="btnPrev">Предыдущий</button>
            <button id="btnNext">Следующий</button>
        </div>
        <div id="eventsContainer">
            <!-- Сюда будет добавляться информация о событиях -->
        </div>
    </div>`

    container.appendChild(wrapper);

    window.showAddEventMenu = showAddEventMenu;
    window.viewEvents = viewEvents;


    var Cal = function(divId) {

      // Save the div identifier
      this.divId = divId;

      // Days of the week starting from Monday
      this.DaysOfWeek = [
        'Пн',
        'Вт',
        'Ср',
        'Чт',
        'Пт',
        'Сб',
        'Вс'
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
          html += '<td class="today" onclick="viewEvents(' + i + ', ' + m + ', ' + y + ')">' + i + '</td>';
        } else {
          html += '<td class="normal" onclick="viewEvents(' + i + ', ' + m + ', ' + y + ')">' + i + '</td>';
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

    // Function to view events for a specific date
    function viewEvents(day, month, year) {
      var eventsForDate = getEventsForDate(day, month, year);
      var eventsContainer = document.getElementById('eventsContainer');

      // Clear the events container
      eventsContainer.innerHTML = '';

      // Display events for the selected date
      if (eventsForDate.length > 0) {
        eventsForDate.forEach(function(event) {
          var eventDate = new Date(year, month, day);
          var dateString = eventDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'numeric', year: 'numeric' });
          var dayOfWeekString = eventDate.toLocaleDateString('ru-RU', { weekday: 'long' });
          
          var eventInfo = document.createElement('p');
          eventInfo.innerHTML = dateString + ', ' + dayOfWeekString + '<br>' + event.description + ' (' + event.time + ')';
          
          // Add classes based on the importance of the event
          if (event.importance === "высокая") {
            eventInfo.classList.add('event', 'important');
          } else if (event.importance === "средняя") {
            eventInfo.classList.add('event', 'normal');
          } else if (event.importance === "низкая") {
            eventInfo.classList.add('event', 'low');
          }
          
          eventsContainer.appendChild(eventInfo);
        });
      } else {
        var noEventsInfo = document.createElement('p');
        noEventsInfo.textContent = 'Событий не запланировано';
        noEventsInfo.classList.add('no-events');
        eventsContainer.appendChild(noEventsInfo);
      }
    }


    // Function to get events for a specific date
    function getEventsForDate(day, month, year) {
      var events = JSON.parse(localStorage.getItem('events')) || [];
      return events.filter(function(event) {
        var eventDateParts = event.date.split('.');
        return parseInt(eventDateParts[0]) === day &&
               parseInt(eventDateParts[1]) === month + 1 &&
               parseInt(eventDateParts[2]) === year;
      });
    }

    // Show the add event menu
    function showAddEventMenu() {
        var eventDate = prompt("Введите дату события в формате ДД.ММ.ГГГГ:", getCurrentDate());
        var eventTime = prompt("Введите время события в формате ЧЧ:ММ:", getCurrentTime());
        var eventImportance = prompt("Введите важность события (низкая, средняя, высокая):", "средняя");
        var eventDescription = prompt("Введите описание события:", "");

        // Create an object to represent the event
        var event = {
            date: eventDate,
            time: eventTime,
            importance: eventImportance,
            description: eventDescription
        };

        // Save the event to localStorage
        saveEvent(event);

        // Implement functionality to handle the input values
        console.log("Дата события:", eventDate);
        console.log("Время события:", eventTime);
        console.log("Важность события:", eventImportance);
        console.log("Описание события:", eventDescription);
    }

    // Function to save event to localStorage
    function saveEvent(event) {
        var events = JSON.parse(localStorage.getItem('events')) || [];
        events.push(event);
        localStorage.setItem('events', JSON.stringify(events));
    }

    // Function to get the current date in DD.MM.YYYY format
    function getCurrentDate() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        var yyyy = today.getFullYear();
        return dd + '.' + mm + '.' + yyyy;
    }

    // Function to get the current time in HH:MM format
    function getCurrentTime() {
        var today = new Date();
        var hh = String(today.getHours()).padStart(2, '0');
        var mm = String(today.getMinutes()).padStart(2, '0');
        return hh + ':' + mm;
    }
}