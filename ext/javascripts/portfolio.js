
$(function() {

  /*
   * QueryLoader v2 - A simple script to create a preloader for images
   *
   * For instructions read the original post:
   * http://www.gayadesign.com/diy/queryloader2-preload-your-images-with-ease/
   *
   * Copyright (c) 2011 - Gaya Kessler
   *
   * Licensed under the MIT license:
   *   http://www.opensource.org/licenses/mit-license.php
   *
   * Version:  2.1
   * Last update: 11-1-2011
   *
   */


  // -----------------------------------------------------------
  // Begin Preloader
  // -----------------------------------------------------------

  var qLimages = new Array,
      qLdone = 0,
      qLimageContainer = "",
      qLoverlay = "",
      qLbar = "",
      qLpercentage = "",
      qLimageCounter = 0

  var qLoptions = {
      onComplete: function () {},
      backgroundColor: "#FFF",
      barColor: "#3f6076",
      barHeight: 3,
      percentage: true,
      deepSearch: true,
      onLoadComplete: function () {

        var browserWidth    = $('body').width(),
            browserHeight   = $('body').height()

        $('body').append('<div class="iris_wipe"></div>')


        // figure out which is larger and set the iris wipe's w/h to that
        if (browserWidth > browserHeight) {
          var newWidth  = browserWidth,
              newHeight = browserWidth
        } else {
          var newWidth  = browserHeight.
              newHeight = browserHeight
        }

        $('.iris_wipe').css({
            width: '0',
            height: '0',
            marginLeft: '0',
            marginTop: '0',
        }).animate({
            width: newWidth * 1.5,
            height: newHeight * 1.5,
            marginLeft: '-' + ( newWidth * .75 ) + 'px',
            marginTop: '-' + ( newHeight * .75 ) + 'px',
        }, 1000, function() {
                $(qLoverlay).remove() // Get rid of all the preloader divs
                $(this).remove() // Get rid of the iris wipe
                qLoptions.onComplete() // This does something, I'm sure of it!
                animatePanel(2) // animate in the home panel
                console.log(isLoaded)
            }
          )
        }
    }

    var afterEach = function () {
        createPreloadContainer();
        createOverlayLoader();
    }

    var createPreloadContainer = function() {
        qLimageContainer = $("<div></div>").appendTo("body").css({
            display: "none",
            width: 0,
            height: 0,
            overflow: "hidden"
        });
        for (var i = 0; qLimages.length > i; i++) {
            $.ajax({
                url: qLimages[i],
                type: 'HEAD',
                success: function(data) {
                    qLimageCounter++;
                    addImageForPreload(this['url']);
                }
            });
        }
    }

    var addImageForPreload = function(url) {
        var image = $("<img />").attr("src", url).bind("load", function () {
            completeImageLoading();
        }).appendTo(qLimageContainer);
    }

    var completeImageLoading = function () {
        qLdone++;

        var percentage = (qLdone / qLimageCounter) * 100;
        $(qLbar).stop().animate({
            width: percentage + "%"
        }, 200);

        if (qLoptions.percentage == true) {
            $(qLpercentage).text(Math.ceil(percentage) + "%");
        }

        if (qLdone == qLimageCounter) {
            destroyQueryLoader();
        }
    }

    var destroyQueryLoader = function () {
        $(qLimageContainer).remove();
        qLoptions.onLoadComplete();
    }

    var createOverlayLoader = function () {
        qLoverlay = $("<div id='qLoverlay'></div>").css({
            width: "100%",
            height: "100%",
            backgroundColor: qLoptions.backgroundColor,
            backgroundPosition: "fixed",
            position: "fixed",
            zIndex: 10,
            top: 0,
            left: 0
        }).appendTo("body");
        qLbar = $("<div id='qLbar'></div>").css({
            height: qLoptions.barHeight + "px",
            marginTop: "-" + (qLoptions.barHeight / 2) + "px",
            backgroundColor: qLoptions.barColor,
            width: "0%",
            position: "absolute",
            top: "50%"
        }).appendTo(qLoverlay);
        if (qLoptions.percentage == true) {
            qLpercentage = $("<div id='qLpercentage'></div>").text("0%").css({
                fontFamily: 'rbno2',
                height: "40px",
                width: "100px",
                position: "absolute",
                fontSize: "3em",
                top: "50%",
                left: "50%",
                marginTop: "-" + (59 + qLoptions.barHeight) + "px",
                textAlign: "center",
                marginLeft: "-50px",
                color: qLoptions.barColor
            }).appendTo(qLoverlay);
        }
    }

    var findImageInElement = function (element) {
        var url = "";

        if ($(element).css("background-image") != "none") {
            var url = $(element).css("background-image");
        } else if (typeof($(element).attr("src")) != "undefined" && element.nodeName.toLowerCase() == "img") {
            var url = $(element).attr("src");
        }

        if (url.indexOf("gradient") == -1) {
            url = url.replace(/url\(\"/g, "");
            url = url.replace(/url\(/g, "");
            url = url.replace(/\"\)/g, "");
            url = url.replace(/\)/g, "");

            var urls = url.split(", ");

            for (var i = 0; i < urls.length; i++) {
                if (urls[i].length > 0) {
                    var extra = "";
                    if ($.browser.msie && $.browser.version < 9) {
                        extra = "?" + Math.floor(Math.random() * 3000);
                    }
                    qLimages.push(urls[i] + extra);
                }
            }
        }
    }

    $.fn.queryLoader2 = function(options) {
        if(options) {
            $.extend(qLoptions, options );
        }

        this.each(function() {
            findImageInElement(this);
            if (qLoptions.deepSearch == true) {
                $(this).find("*:not(script)").each(function() {
                    findImageInElement(this);
                });
            }
        });

        afterEach();

        return this;
    };

  // Preload the site!
  window.addEventListener('DOMContentLoaded', function() {
    $("body").queryLoader2();
  });


  // -----------------------------------------------------------
  // End Preloader
  // -----------------------------------------------------------








  // Global Variables
  var browserWidth    = $('body').width(),
      browserHeight   = $('body').height(),
      panels          = $('div#wrapper').children().length,
      speed           = 200, // General speed for rollovers and such
      ease            = 'easeOutQuint',
      scrollSpeed     = 700, // Speed for changing pages
      parallaxSpeed   = 1000, // Speed for inner content
      wrapper         = $('div#wrapper'),
      section         = $('section'),
      currentpanel    = 2,
      blue            = '#3f6076',
      white           = '#fff'


  // Set up panel sizes
  // -----------------------------------------------------------
  
  // Pulling the wrapper up so the home panel is the first displayed
  wrapper.css({
    height: browserHeight * panels,
    top: '-' + browserHeight + 'px'
  })
  
  // Set the wrappers w\h to the browsers w\h
  section.css({
    width: browserWidth,
    height: browserHeight
  })

  // Set the wrappers w\h to the browsers w\h
  $(window).resize(function() {
    browserWidth    = $('body').width()
    browserHeight   = $('body').height()
    
    // Set each sections w\h
    section.css({
      width: browserWidth,
      height: browserHeight
    })

    // Set total wrapper height
    wrapper.css({
      height: browserHeight * panels,
      top: '-' + browserHeight + 'px'
    })
  })

  // Home panel Animation
  animatePanel(currentpanel)


  // Navigation
  // -----------------------------------------------------------
  
  // Main buttons
  $('a.nav_up').click(function () {
    slideSite('up')
  })
  $('a.nav_down').click(function () {
    slideSite('down')
  })

  function slideSite(dir) {

    if ( dir == 'up' && currentpanel > 1 ) {
    
      // Slide the site up
      currentpanel -= 1

      // Call the function for animating in each panel
      animatePanel(currentpanel)

      wrapper.animate({
        marginTop: '+=' + browserHeight
      }, { duration: scrollSpeed, easing: ease })
    
    } else if ( dir == 'down' && currentpanel < panels ) {
    
      // Slide the site down
      currentpanel += 1

      // Call the function for animating in each panel
      animatePanel(currentpanel)

      wrapper.animate({
        marginTop: '-=' + browserHeight
      }, { duration: scrollSpeed, easing: ease })
    }

  }

  // Animated Areas
  // -----------------------------------------------------------
  function animatePanel(panel) {

    // Contact Panel
    if(panel == 1) {
      console.log('Contact')
    }
    
    // Home Panel
    if(panel == 2) {

      $('section#home > *').css({
        opacity: 0
      }).animate({
        opacity: 1
      }, 1000)

      // // Pop open the circle
      // popThis('.my_name', '0px', '0px', '300px', '300px', '-150px', '-150px', 0 )
      // popThis('section#home a.nav_up', '0px', '0px', '75px', '75px', '-37.5px', '-37.5px', 1000 )
      // popThis('section#home a.nav_down', '0px', '0px', '75px', '75px', '-37.5px', '-37.5px', 2000 )

    }

    // Home Panel
    if(panel == 3) {
      console.log('Tiger!')
    }

  }

  // function popThis(className, startHeight, startWidth, newWidth, newHeight, newMarginTop, newMarginLeft, delayTimer) {
  //   $(className).css({
  //       display: 'block',
  //       width: '0px',
  //       height: '0px',
  //       marginTop: '0px',
  //       marginLeft: '0px',
  //     }).delay(delayTimer).animate({
  //       width: newWidth,
  //       height: newHeight,
  //       marginTop: newMarginTop,
  //       marginLeft: newMarginLeft
  //     }, { duration: 600, easing: 'easeOutBounce' })
  // }


  // Button Rollovers
  // -----------------------------------------------------------
  $('a.button').each(function() {

    var growTo      = '90px',
        shrinkTo    = '0px',
        marginTo    = '-7.5px',
        marginFrom  = '37.5px'
    
    $(this).hover(function() {

      // Link text to white
      $(this).stop().animate({
        color: white
      }, { duration: speed, easing: ease })

      // Grow the inner circle 
      $(this).find('span.inner').css({
        display: 'block'
      }).stop().animate({
        width: growTo,
        height: growTo,
        marginTop: marginTo,
        marginLeft: marginTo      
      }, { duration: speed, easing: ease })

    }, function() {

      // Link text to blue
      $(this).stop().animate({
        color: blue
      }, { duration: speed, easing: ease })

      // Shrink the inner circle
      $(this).find('span.inner').stop().animate({
        width: shrinkTo,
        height: shrinkTo,
        marginTop: marginFrom,
        marginLeft: marginFrom  
      }, { duration: speed, easing: ease })

    })
  })
})