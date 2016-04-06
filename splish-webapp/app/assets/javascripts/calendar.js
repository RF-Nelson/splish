// Global scope
var bc = null;

$(document).ready(function () {

    var bindBehaviors = function () {

      /* Calendar Click Events */
      $("#calNextMonth").click(function (event) {
        event.preventDefault();

        bc.SetNextMonth();
        bc.CSS3DCal(true);
      })

      $("#calPrevMonth").click(function (event) {
          event.preventDefault();

          bc.SetPrevMonth();

          if (bc) {
              bc.CSS3DCal(false);
          } else {
              $("#caltablecntr").hide();
              bc.BuildDispCal();
          }
      })
    }

    // Bind click events
    bindBehaviors();

    // Create CCSUtils Obj
    cssUtils = new $.CSSUtils();
    // Create Calendar Display Obj
    bc = new $.BuildDispCal();
    // Render Calendar
    bc.BuildDispCal();
})

$.BuildDispCal = function () {
    // private vars
    var _currCalMnthYr = new Date();
    var _days_full_labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var _cal_months_labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var _currRotDeg = 0;
    var _currSide = 1;
    // set private vars
    _currCalMnthYr.setDate(1);

    //private methods
    var getDayName = function (dayNbr) {
        return _days_full_labels[dayNbr];
    }

    var getShortMonthName = function (mnthNbr) {
        return _cal_months_labels[mnthNbr];
    }

    var getTransformProperty = function (elm) {
        // In some versions of IE9 it is critical that
        // msTransform appear in this list before MozTransform
        var properties = [
            'transform',
            'WebkitTransform',
            'msTransform',
            'MozTransform',
            'OTransform'
        ];
        var p;
        while (p = properties.shift()) {
            if (typeof elm.style[p] != 'undefined') {
                return p;
            }
        }
        return false;
    }

    return {
        BuildDispCal: function () {
            var cal = new Calendar(_currCalMnthYr.getMonth(), _currCalMnthYr.getFullYear());
            cal.generateHTML();
            /* If CSS 3D allowed - show calendar header and calendar 3D elements */
            if (bc) {
                // Month Heading
                var calHeadMnthSrc = '<div id="calHeadBody"><section id="calHeadContainer" class="calHeadContainer">';
                calHeadMnthSrc += '<div id="calHeadcrsl" style="transform: translateZ(-5px) rotateX(0deg);-webkit-transform: translateZ(-5px) rotateX(0deg);-moz-transform: translateZ(-5px) rotateX(0deg);" class="panels-backface-invisible">';
                calHeadMnthSrc += '<figure id="calHeadcrsl1">' + getShortMonthName(_currCalMnthYr.getMonth()) + "&nbsp;" + _currCalMnthYr.getFullYear() + '</figure>';
                calHeadMnthSrc += '<figure id="calHeadcrsl2"></figure>';
                calHeadMnthSrc += '<figure id="calHeadcrsl3"></figure>';
                calHeadMnthSrc += '</div></section></div>';
                $("#calheadline").html(calHeadMnthSrc);
                // Month Caledar Main
                var threeSideSRC = '<div id="carBody"><section id="carContainer" class="carContainer">';
                threeSideSRC += '<div id="carousel" style="transform: translateZ(-61px) rotateY(0deg);-webkit-transform: translateZ(-61px) rotateY(0deg);-moz-transform: translateZ(-61px) rotateY(0deg);" class="panels-backface-invisible">';
                threeSideSRC += '<figure id="crsl1">' + cal.getHTML() + '</figure>';
                threeSideSRC += '<figure id="crsl2"></figure>';
                threeSideSRC += '<figure id="crsl3"></figure>';
                threeSideSRC += '</div></section></div>';
                $("#caltablecntr").html(threeSideSRC);
            } else {
                $("#calheadline").html(getShortMonthName(_currCalMnthYr.getMonth()) + "&nbsp;" + _currCalMnthYr.getFullYear());
                $("#caltablecntr").html(cal.getHTML());
                $("#caltablecntr").show();
                cssUtils.CSSFadeIn("#caltablecntr", 1);
            }
            $("#cal").show();
            setTimeout('$(".clkDay").click(function (event) { event.preventDefault();$("#calevents").html("<p>No Events Found</p>"); });', 400);
        },
        SetNextMonth: function () {
            _currCalMnthYr.setMonth(_currCalMnthYr.getMonth() + 1);
        },
        SetPrevMonth: function () {
            _currCalMnthYr.setMonth(_currCalMnthYr.getMonth() - 1);
        },
        CSS3DCal: function (nxt) {
            var carourseHdrObj = document.getElementById('calHeadcrsl');
            var carouselObj = document.getElementById('carousel');

            /* Build Next/Prev Month */
            var calObj = new Calendar(_currCalMnthYr.getMonth(), _currCalMnthYr.getFullYear());
            calObj.generateHTML();

            /* enable webkit animation */
            $("#carBody").attr("class", "ready");
            $("#calHeadBody").attr("class", "ready");

            if (nxt) {
                _currSide++;
                if (_currSide > 3) {
                    _currSide = 1;
                }
                _currRotDeg -= 120;
                carouselObj.style[getTransformProperty(carouselObj)] = 'translateZ(-61px) rotateY(' + _currRotDeg + 'deg)';
                carourseHdrObj.style[getTransformProperty(carourseHdrObj)] = 'translateZ(-5px) rotateX(' + _currRotDeg + 'deg)';
            } else {
                _currSide--;
                if (_currSide < 1) {
                    _currSide = 3;
                }
                _currRotDeg += 120;
                carouselObj.style[getTransformProperty(carouselObj)] = 'translateZ(-61px) rotateY(' + _currRotDeg + 'deg)';
                carourseHdrObj.style[getTransformProperty(carourseHdrObj)] = 'translateZ(-5px) rotateX(' + _currRotDeg + 'deg)';
            }

            $("#crsl" + _currSide).html(calObj.getHTML());
            $("#calHeadcrsl" + _currSide).html(getShortMonthName(_currCalMnthYr.getMonth()) + "&nbsp;" + _currCalMnthYr.getFullYear());
        }
    }
}

$.CSSUtils = function () {
    var _opacID = "";
    var _opacOPNbr = 0;
    // Private Methods
    var setOpacity = function () {
        $(_opacID).css('opacity', _opacOPNbr);
    }

    // Public Methods
    return {
        CSSFadeIn: function (fadeElmJQID, opacNbr) {
            if (bc) {
                $(fadeElmJQID).css('display', 'block');
                opacGlblID = fadeElmJQID;
                opacGlblOPNbr = opacNbr;
                setTimeout("setOpacity()", 1);
            } else {
                $(fadeElmJQID).fadeIn(500);
            }
        },
        CSSFadeOut: function (fadeElmJQID) {
            if (bc) {
                $(fadeElmJQID).css('display', 'none');
                _opacID = fadeElmJQID;
                _opacOPNbr = 0;
                setTimeout("setOpacity()", 1);
            } else {
                $(fadeElmJQID).fadeOut(500);
            }
        }
    }
}

// these are labels for the days of the week
cal_days_labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
cal_days_full_labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// these are human-readable month name labels, in order
cal_months_labels = ['January', 'February', 'March', 'April',
                     'May', 'June', 'July', 'August', 'September',
                     'October', 'November', 'December'];
cal_month_short_label = ['Jan', 'Feb', 'Mar', 'Apr',
                     'May', 'Jun', 'Jul', 'Aug', 'Sept',
                     'Oct', 'Nov', 'Dec'];

// these are the days of the week for each month, in order
cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// this is the current date
cal_current_date = new Date();

function Calendar(month, year) {
    this.month = (isNaN(month) || month == null) ? cal_current_date.getMonth() : month;
    this.year = (isNaN(year) || year == null) ? cal_current_date.getFullYear() : year;
    this.html = '';
}

Calendar.prototype.generateHTML = function () {

    // get first day of month
    var firstDay = new Date(this.year, this.month, 1);
    var startingDay = firstDay.getDay();

    // find number of days in month
    var monthLength = cal_days_in_month[this.month];

    // compensate for leap year
    if (this.month == 1) { // February only!
        if ((this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0) {
            monthLength = 29;
        }
    }

    var html = '<table id="tblCalendar">';
    html += '<thead><tr>';
    for (var i = 0; i <= 6; i++) {
        html += '<td class="head">';
        html += cal_days_labels[i];
        html += '</td>';
    }
    html += '</tr></thead>';
    html += '<tbody><tr>';

    // fill in the days
    var day = 1;
    // this loop is for is weeks (rows)
    for (var i = 0; i < 9; i++) {
        // this loop is for weekdays (cells)
        for (var j = 0; j <= 6; j++) {
            if (day == cal_current_date.getDate() && this.month == cal_current_date.getMonth() && day <= monthLength && (i > 0 || j >= startingDay)) {
                if ($("#caldate").length > 0) { $("#caldate").html(cal_days_full_labels[j] + ', ' + cal_month_short_label[this.month] + '. ' + day); }
                if ($("#sbcaldate").length > 0) { $("#sbcaldate").html(cal_days_full_labels[j] + ', ' + cal_month_short_label[this.month] + '. ' + day); }
                html += '<td class="today" >';
            } else {
                html += '<td>';
            }

            if (day <= monthLength && (i > 0 || j >= startingDay)) {
                html += '<a class="clkDay" href="#">' + day + '</a>';
                day++;
            }
            html += '</td>';
        }
        // stop making rows if we've run out of days
        if (day > monthLength) {
            break;
        } else {
            html += '</tr><tr>';
        }
    }
    html += '</tr></tbody></table>';

    this.html = html;
}

Calendar.prototype.getHTML = function () {
    return this.html;
}
