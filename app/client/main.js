import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});

Template.clock.onCreated(function clockOnCreated(){
  window.onload = function() {
    GetClock();
    setInterval(GetClock,1000);
  }
});

Template.digitalClock.onCreated(function digitalClockOnCreated(){
  var daysofweek = ['sun', 'mon', 'tus', 'wed', 'thu', 'fri', 'sat'];
  var month =['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  function clock(){
    // setting up my variables
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var day = h<11 ? 'AM': 'PM';
    var daytoday = today.getDay();
    var date = today.getDate();
    var mon = today.getMonth();
    var year = today.getFullYear();

    // adding leading zeros to them
    h = h<10? '0'+h: h;
    m = m<10? '0'+m: m;
    s = s<10? '0'+s: s;

    // writing it down in the document
    document.getElementById('hours').innerHTML = h;
    document.getElementById('min').innerHTML = m;
    document.getElementById('sec').innerHTML = s;
    document.getElementById('time').innerHTML = day;
    document.getElementById(''+daysofweek[daytoday]+'').style.color = '#fff';
    document.getElementById('day').innerHTML = date;
    document.getElementById('month').innerHTML = month[mon];
    document.getElementById('year').innerHTML = year;

  }
  
  var inter = setInterval(clock,400);
});

Template.weather.onCreated(function weatherOnCreated(){
  var Weather = {
		init: function() {
			this.getLocation();
		},

		cache: {
			showFahrenheit: false,
		},

		getLocation: function() {
      var c = Weather.cache;
      
      if ( window.chrome ) {
        $.getJSON('http://ip-api.com/json', function(json) {
          c.lat = json.lat;
          c.long = json.lon;
          Weather.getInformation();
        });
      } else {
        if ( navigator.geolocation ) {
          navigator.geolocation.getCurrentPosition(function(data) {
            c.lat = data.coords.latitude;
            c.long = data.coords.longitude;
            Weather.getInformation();
          });
        }
      }
			
		},

		getInformation: function() {
			var c = Weather.cache;
    
			$.getJSON('http://api.openweathermap.org/data/2.5/weather?lat=' + c.lat + '&lon=' + c.long + '&units=imperial&appid=3acc16ffae9e45df92a064e41646355f', function(json) {
        
        // Store data in cache
				c.location = json.name;
				c.country = json.sys.country;
        c.fahrenheit = Math.round(json.main.temp);
				c.celcius = Math.round((c.fahrenheit - 32) * 5 / 9);
				c.icon = json.weather[0].id;
				c.coverage = json.weather[0].main;
				c.sunrise = json.sys.sunrise;
				c.sunset = json.sys.sunset;
        
				Weather.showMainInformation();
				Weather.showCurrentCoverage();
			});
		},

		showMainInformation: function() {
			var c = Weather.cache;
			// Show Temp
			$('#temp').html(c.showFahrenheit === false ? c.celcius : c.fahrenheit );
		},

		showCurrentCoverage: function() {
			var c = Weather.cache;
			var currentTime = new Date().getTime() / 1000;

			// Show Day/Night Icon based on current time
			if ( currentTime > c.sunrise && currentTime < c.sunset ) {
				$('#icon').attr('class', 'wi wi-owm-day-' + c.icon);
			} else {
				$('#icon').attr('class', 'wi wi-owm-night-' + c.icon);
			}
      // Show coverage text
			$('#coverage').html(Weather.cache.coverage);
		},

		showTime: function() {
			var time = new Date();
			var hours = time.getHours();
			var minutes = time.getMinutes();

			// Display a zero before hours/minutes if below 10
			if ( hours < 10 ) {
				$('#time').html(minutes < 10 ? '0' + hours + ':0' + minutes : '0' + hours + ':' + minutes);
			} else {
				$('#time').html(minutes < 10 ? hours + ':0' + minutes : hours + ':' + minutes);
			}
		},

		changeUnit: function() {
			var c = Weather.cache;
      
      // Toggle temp unit type on click
			if ( c.showFahrenheit === false ) {
				$('#temp').html(c.fahrenheit);
				c.showFahrenheit = true;
			} else {
				$('#temp').html(c.celcius + "hello");
				c.showFahrenheit = false;
			}
      
      // Toggles the button knob
			$('#unit-toggle').toggleClass('toggle');
      // Creates the fade in effect on the temp text
			$('#temp').toggleClass('toggle');
		},

		refresh: function() {
			Weather.showTime();
			Weather.getLocation();
		}
	};

	Weather.init();
	window.onload = function() {
    setInterval(Weather.getLocation(),60000);
  }
});



//Basic Clock
var tmonth=new Array("January","February","March","April","May","June","July","August","September","October","November","December");

function GetClock(){
  var d=new Date();
  var nmonth=d.getMonth(),ndate=d.getDate(),nyear=d.getYear();
  if(nyear<1000) nyear+=1900;
  
  var nhour=d.getHours(),nmin=d.getMinutes(),nsec=d.getSeconds(),ap;
  
  if(nhour==0){ap=" AM";nhour=12;}
  else if(nhour<12){ap=" AM";}
  else if(nhour==12){ap=" PM";}
  else if(nhour>12){ap=" PM";nhour-=12;}
  
  if(nmin<=9) nmin="0"+nmin;
  if(nsec<=9) nsec="0"+nsec;
  
  document.getElementById('clockbox').innerHTML=/*""+tmonth[nmonth]+" "+ndate+", "+nyear+*/""+nhour+":"+nmin+":"+nsec+ap+"";
}




