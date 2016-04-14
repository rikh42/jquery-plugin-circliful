"use strict";

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

(function ($) {

    $.fn.circliful = function (options, callback) {

        var settings = $.extend({
            // These are the defaults.
            foregroundColor: "#3498DB",     // Colour of the line
            backgroundColor: "#ccc",        // Colour of the channel for the line to fill
            fillColor: 'none',              // Fill the circle with this
            pointColor: "none",             // Colour of the inner circle (around the percentage)
            pointSize: 57,                  // Size of the inner circle
            
            foregroundBorderWidth: 15,      // Width of the line
            backgroundBorderWidth: 15,      // Width of the lines channel
            
            percent: 75,                    // What percent if this chart going to represent

            fontColor: '#aaa',              // Colour of the percentage text       
            
            animation: true,                // animate it?
            animationStep: 5,               // Number of degrees to animate per step
            
            icon: 'none',                   // Show an icon in the middle or not
            iconSize: 40,                   // Font size of the icon
            iconColor: '#ccc',              // Colour of the icon
            
            showPercent: true,              // Show the percentage?
            percentageTextSize: 22,         // Font size of the percentage
            
            text: null,                     // Additional text
            textStyle: '',                  // Css for the additional text  
            textColor: '#666'               // colour of the additional text
        }, options);

        return this.each(function () {
            var circleContainer = $(this),
                percent = settings.percent,
                textY = 100,
                textX = 100,
                elements = '',
                innerText = '',
                radius = 80;
            
            // If we are showing an icon, move the % outside the circle
            if (settings.icon != 'none' && settings.showPercent) {
                elements += '<g stroke="' + (settings.backgroundColor != 'none' ? settings.backgroundColor : '#ccc') + '" ><line x1="133" y1="50" x2="140" y2="40" stroke-width="2"  /></g>';
                elements += '<g stroke="' + (settings.backgroundColor != 'none' ? settings.backgroundColor : '#ccc') + '" ><line x1="140" y1="40" x2="200" y2="40" stroke-width="2"  /></g>';
                textX = 175;
                textY = 25;
                radius = 60;
            }

            // Add the additional text
            if (settings.text != null) {
                elements += '<text text-anchor="middle" x="100" y="135" style="' + settings.textStyle + '" fill="' + settings.textColor + '">' + settings.text + '</text>';
            }

            // Add the icon
            if (settings.icon != 'none') {
                innerText += '<text text-anchor="middle" dy="0.4em" x="100" y="100" class="icon" style="font-size: ' + settings.iconSize + 'px" fill="' + settings.iconColor + '">&#x' + settings.icon + '</text>';
            }

            // Add the Percentage
            if (settings.showPercent) {
                innerText += '<text text-anchor="middle" dy="0.4em" x="' + textX + '" y="' + textY + '" class="timer" style="font-size: ' + settings.percentageTextSize + 'px;" fill="' + settings.fontColor + '">0%</text>';
            }

            // Length of the line (so we can animate it via dash pattern)
            var strokeLength = 2 * radius * 3.1415927;
            circleContainer
                .addClass('svg-container')
                .append(
                    $('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 200 200" class="circliful">' +
                        elements +
                        '<circle cx="100" cy="100" r="'+radius+'" class="border" fill="' + settings.fillColor + '" stroke="' + settings.backgroundColor + '" stroke-width="' + settings.backgroundBorderWidth + '" stroke-dasharray="'+strokeLength+'" transform="rotate(-90,100,100)" />' +
                        '<circle class="circle" cx="100" cy="100" r="'+radius+'" class="border" fill="none" stroke="' + settings.foregroundColor + '" stroke-width="' + settings.foregroundBorderWidth + '" stroke-dasharray="0,20000" transform="rotate(-90,100,100)" />' +
                        '<circle cx="100" cy="100" r="' + settings.pointSize + '" fill="' + settings.pointColor + '" />' +
                        innerText)
                );

            var circle = circleContainer.find('.circle'),
                myTimer = circleContainer.find('.timer'),
                angle = 0;

            if (settings.animation) {
                function drawFrame() {
                    requestAnimationFrame(drawFrame);

                    angle += settings.animationStep;
                    if (angle >= 360 * percent / 100) {
                        cancelAnimationFrame(drawFrame);
                        angle = 360 * percent / 100;
                    }

                    circle.attr("stroke-dasharray", angle / 360 * strokeLength + ", 20000");

                    if (settings.showPercent) {
                        myTimer.text(parseInt(angle / 360 * 100) + '%');
                    }
                }

                // trigger the animation
                drawFrame();
            } else {
                circle.attr("stroke-dasharray", (strokeLength * percent / 100) + ", 20000");

                if (settings.showPercent) {
                    myTimer.text(percent + '%');
                }
            }
        });
    }

}(jQuery));
