Endless-List-Canvas
===================
A HTML5 canvas endless list for mobile.

Why I use it
---------------
With the development of HTML5, more and more browsers would support the canvas element in HTML5. What is more, comparing with the traditional HTML and CSS layout, a canvas element acts the same in diferent browsers (Please forget CSS hack), and performs better, especially on mobile devices.

If you are doing a HTML5 application for mobile, it is good for you to try it.

Features
------------
Mobile, Finger motion recognition, Endless list, Act the same with native list, High performance

Device support
--------------
IOS 6+
Android 2.3+ (soon)

Demo
--------------
Please visit with a mobile device. It dose not work on desktop.

###[Demo](http://jsbin.com/buxiq/3/)

It contains 10,000 rows and has a touch reaction on each row.

How to use
-------------

###Initialization
		var your_list_name = EndlessList({

			///////////////////
			/*necessary param*/
			///////////////////

			canvas: ...,		//your canvas element.
			offset: {			//It cantains four position numbers of the canvas element
				top: ...,		//If the screen DPI is high,				
				left: ...,		//it is better to set the width and height of your canvas
				width: ...,		//to double (like 1000px for 500px),
				height: ...		//and use css to compress (width: 500px).
			},
			DPI: ...,			//is 1 or 2. 
								//If the Dots Per Inch of your screen is high, it is 2
			main: function(positionY, count){},  
								//your drawing function for each row. PositionY is the start Y position of the row. Count is the number of the row. This function should return a height of the row. If there is no return, the list will end.

			///////////////
			/*other param*/
			///////////////

			touchstart = 	function(fingerPosition){}, //trigger when a finger starts touch.
			touchmove = 	function(fingerPosition){}, //when a finger moves on the list.
			touchend = 		function(fingerPosition){}, //when a finger ends touch.
			touchleft = 	function(fingerPosition){}, //when a finger moves left on the list.
			touchright = 	function(fingerPosition){}, //when a finger moves right on the list.
			swipeleft = 	function(startPosition,endPosition){}, 	//after swiped left.
			swiperight = 	function(startPosition,endPosition){}, 	//after swiped right.
			pulldown = 		function(){}, 				//after dragged on the list top.
			pullend = 		function(){}, 				//when the list reaches the end.
			tap = 			function(endPosition){}, 	//after tapped on the list.
		});

###functions

	your_Initialized_list.refresh()			//refresh the list
	your_Initialized_list.go()				//continue after 'stop'
	your_Initialized_list.stop()			//stop all functions of the list
	your_Initialized_list.goAnimate()		//continue after 'stopAnimate'
	your_Initialized_list.stopAnimate()		//stop all animations of the list
	your_Initialized_list.moveTo(positionY)	//glid to a position of the list
	your_Initialized_list.zero(positionY)	//jump to a position of the list
	your_Initialized_list.gliding()			//return if the list is gliding