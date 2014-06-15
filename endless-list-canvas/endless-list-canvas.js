var EndlessList = function(){};

EndlessList = function(param){
	var canvas = param.canvas,
		print = canvas.getContext("2d"),
		offset = param.offset,///////////OFFSET
		finger = {x:0,y:0},
		fingerStart = {x:0,y:0},
		zero = 0,
		inheight = 0,
		now = new Date(),
		direction,
		speed = [],
		velocity = {x:0,y:0},
		activing = false,
		gliding = false,
		freeze = false,
		outing = false,
		testing = false,
		DPI = param.DPI || 1;
		media = {
			fps: 60,
			animate: function( callback ){  
			    window.setTimeout(callback, 1000/media.fps);  
			}
		},
		ease = function (start,end,time,now){
			return start+(end-start)*(1-Math.pow(2,-(now/time)*10));
		},
		heightList = [],

		/*Some values*/
		moveToTime = 1500,
		glidToTime = 2000,

		/*User event*/
		touchstart = param.touchstart || function(){},
		touchmove = param.touchmove || function(){},
		touchend = param.touchend || function(){},
		touchleft = param.touchleft || function(){},
		touchright = param.touchright || function(){},
		swipeleft = param.swipeleft || function(){},
		swiperight = param.swiperight || function(){},
		pulldown = param.pulldown || function(){},
		pullend = param.pullend || function(){},
		tap = param.tap || function(){},

		shouldPullDown = false,
		check_direction = function(start,end){
			var direction = "",
				directionX = Number(end.x-start.x),
				directionY = Number(end.y-start.y),
				DirectionX = Math.abs(directionX),
				DirectionY = Math.abs(directionY);
			if(DirectionX<DirectionY*1.8)
			{
				if(directionY<=0)
				{
					direction = "up";
				}
				else
				{
					direction = "down";
				}
			}
			else
			{
				if(directionX>=0)
				{
					direction = "right";
					lr = true;
				}
				else
				{
					direction = "left";
					lr = true;
				}
			}
			return direction;
		},
		pull = function(){},
		pullup = function(){
			pullend();
			pullup = function(){};
		},
		moveTo = function(target){
			gliding = true;
			var startTime = new Date().getTime(),
				fps = 1000/media.fps,
				start = zero,
				end = target,
				duration = moveToTime,
				_now = 0,
				animate = media.animate,
				play = function(){
					if(!gliding)
					{
						return false;
					}
					now = new Date().getTime()-startTime;
					if((duration-now) < fps || freeze)
					{
						zero = ease(start,end,duration,duration);
						inheight = mainDraw(zero);
						gliding = false;
						return false;
					}
					zero = ease(start,end,duration,now);
					inheight = mainDraw(zero);
					animate(play);
				}
			animate(play);
		},
		glidTo = function(target){
			gliding = true;
			var startTime = new Date().getTime(),
				fps = 1000/media.fps,
				start = zero,
				end = target,
				duration = glidToTime,
				_now = 0,
				animate = media.animate,
				play = function(){
					if(!gliding)
					{
						return false;
					}
					now = new Date().getTime()-startTime;
					if((duration-now) < fps || freeze)
					{
						zero = ease(start,end,duration,duration);
						if(zero > 0)
						{
							zero = 0;
						}
						else if(inheight+zero-offset.height < 0)
						{
							zero = offset.height - inheight;
						}
						inheight = mainDraw(zero);
						gliding = false;
						return false;
					}
					zero = ease(start,end,duration,now);
					if(zero > 0)
					{
						zero = 0;
						inheight = mainDraw(zero);
						gliding = false;
						return false;
					}
					else if(inheight+zero-offset.height < 0)
					{
						if(offset.height <= inheight)
						{
							zero = offset.height - inheight;
						}
						else
						{
							zero = 0;
						}
						inheight = mainDraw(zero);
						gliding = false;
						return false;
					}
					if(inheight+zero < 2*offset.height)
					{
						pullup();
					}
					inheight = mainDraw(zero);
					animate(play);
				}
			animate(play);
		},

		//Drawing function
		mainDraw = function(zero){
			var loopFunction = param.main || function(){},
				i = 0,
				_height = 0,
				_totalHeight = 0,
				drawed = false;
			print.clearRect(0, 0, offset.width, offset.height);
			while(true)
			{
				drawed = false;
				if(heightList[i] == undefined)
				{
					_height = loopFunction(zero+_totalHeight, i);
					heightList[i] = _height;
					drawed = true;
				}
				if(_height == undefined)
				{
					break;
				}
				_totalHeight += heightList[i];
				if(_totalHeight > -zero && _totalHeight-heightList[i] < -zero+offset.height && drawed == false)
				{
					_height = loopFunction(zero+_totalHeight-heightList[i], i);
					if(_height != heightList[i])
					{
						_totalHeight = _totalHeight - heightList[i] + _height;
						heightList[i] = _height;
					}
					drawed = true;
				}
				i++;
			}
			return _totalHeight;
		},

		//return functions
		control = {
			refresh: function(){
				mainDraw(zero);
			},
			go: function(){
				activing = false;
			},
			stop: function(){
				activing = true;
			},
			goAnimate: function(){
				freeze = false;
			},
			stopAnimate: function(){
				gliding = false;
				freeze = true;
			},
			moveTo: function(y){
				moveTo(y);
			},
			zero: function(n){
				zero = n;
				mainDraw(zero);
			},
			gliding: function(){
				return gliding;
			}
		},

		ePageXY = function(e){
			var _page = {x:0, y:0};
			if(e.touches == undefined)
			{
				_page.x = e.pageX;
				_page.y = e.pageY;
			}
			else
			{
				_page.x = e.touches[0].pageX;
				_page.y = e.touches[0].pageY;
			}
			return _page;
		},
		startAction = function(e){
			var _page = ePageXY(e);
			/*finger position*/
	        fingerStart.x = (_page.x-offset.left)*DPI;
	        fingerStart.y = (_page.y-offset.top)*DPI;
	        finger.x = (_page.x-offset.left)*DPI;
	        finger.y = (_page.y-offset.top)*DPI;
	        /*stop other functions*/
			if(activing)
			{
				return false;
			}
			now = new Date();
			/*init*/
			shouldPullDown = false;
			pull = function(){
				shouldPullDown = true;
				pull = function(){};
			};
			/*init*/
			pullup = function(){
				pullend();
				pullup = function(){};
			};
			/*stop glid*/
			gliding = false;
	        /*init gesture*/
	        tapping = true;
	        testing = true;
	        direction = "";
	        /*init finger speed*/
	        speed = [];
	        /*user function*/
	        touchstart(finger);
	        /*stop brower function*/
	        e.preventDefault();
	        // e.returnValue = false;
		},
		moveAction = function(e){
			if(activing)
			{
				return false;
			}
			var _page = ePageXY(e),
				moveBlock = function(){
				var nowAdd = (finger.y-fingerStart.y),
					nowPoint = zero+nowAdd,
					_bottom = inheight+nowPoint-offset.height;
				if(nowPoint > 0)
				{
					nowPoint = nowPoint/1.2;////////Move back distance
					pull();
					outing = true;
				}
				else if(_bottom < 0 && offset.height<=inheight)
				{
					nowPoint = offset.height-inheight+_bottom/1.2;////////Move back distance
					outing = true;
				}
				if(nowPoint != NaN)
				{
					inheight = mainDraw(nowPoint);
				}
				if(_bottom < offset.height)
				{
					pullup();
				}
			};
			now = new Date();
			/*finger positions*/
	        finger.x = (_page.x-offset.left)*DPI || finger.x;
	        finger.y = (_page.y-offset.top)*DPI || finger.y;
	        /*gesture recognition*/
	        if(Math.abs(Math.sqrt(fingerStart.x*fingerStart.x+fingerStart.y*fingerStart.y)-Math.sqrt(finger.x*finger.x+finger.y*finger.y)) > 5)
	        {
	        	tapping = false;
	        }
	        if(testing && !tapping)
	        {
	        	testing = false;
		        direction = check_direction(fingerStart,finger);
	        }
		    else if(direction == "left")
		    {
		    	touchleft(finger);
		    }
		    else if(direction == "right")
		    {
		    	touchright(finger);
		    }
		    else if(direction == "up")
		    {
		    	moveBlock();
		    }
		    else if(direction == "down")
		    {
		    	moveBlock();
		    }
		    /*finger speed stored*/
		    speed.push({
		    	time: now.getTime(),
		    	point: JSON.parse(JSON.stringify(finger))
		    })
		    if(speed.length > 5)
		    {
		    	speed.shift();
		    }
	        /*user function*/
	        touchmove(finger);
	        /*stop brower function*/
	        e.preventDefault();
	        // e.returnValue = false;
		},
		endAction = function(e){
			if(activing)
			{
				return false;
			}
			/*gesture recognition*/
	        if(tapping) {
	        	/*tap*/
	        	/*fine turn tap position*/
	        	// finger.x -= 10;
	        	// finger.y -= 5;
	        	finger.x -= 10;
	        	finger.y -= 5;
	        	/*user function*/
	        	tap(finger);
	        }
	        else
	        {
	        	/*swipe*/
	        	/*calculate finger speed*/
	        	var sumX = 0,
	        		sumY = 0,
	        		length = speed.length,
	        		_speedB,_speedA;
	        	for(var x in speed)
	        	{
	        		if(x != 0)
	        		{
	        			_speedA = speed[x];
	        			_speedB = speed[x-1];
	        			sumX += _speedA.point.x - _speedB.point.x;
	        			sumY += _speedA.point.y - _speedB.point.y;
	        		}
	        	}
	        	velocity.x = sumX/(length-2);
	        	velocity.y = sumY/(length-2);

	        	/*calculate ZERO point*/
	        	if(direction == "up" || direction == "down")
	        	{
	        		if(outing)
	        		{
	        			var nowAdd = (finger.y-fingerStart.y),
							nowPoint = zero+nowAdd,
							_bottom = inheight+nowPoint-offset.height;
						if(nowPoint > 0)
						{
							nowPoint = nowPoint/1.2;
						}
						else if(_bottom < 0)
						{
							nowPoint = offset.height-inheight+_bottom/1.2;
						}
						outing = false;
						zero = nowPoint;
	        		}
	        		else
	        		{
	        			zero += finger.y-fingerStart.y;
	        		}	        		
	        	}
	        	// console.log("end zero "+zero);
	        	
	        	/*limitations and glid*/
	        	var _top = zero,
	        		_bottom = inheight+zero-offset.height;
	        	if(_top > 0)
	        	{
	        		moveTo(0);
	        	}
	        	else if(_bottom < 0 && offset.height<=inheight)
	        	{
	        		moveTo(offset.height - inheight);
	        	}
	        	else if(_bottom < 0 && offset.height>inheight)
	        	{
	        		moveTo(0);
	        	}
	        	else if(velocity.y)
	        	{
	        		if(direction == "up" || direction == "down")
	        		{
	        			if(velocity.y > 90)
	        			{
	        				velocity.y = 90;
	        			}
	        			else if(velocity.y < -90)
	        			{
	        				velocity.y = -90;
	        			}
	        			glidTo(zero+velocity.y*Math.abs(velocity.y));///////////GLID DISTANCE
	        		}	        		
	        	}

	        	/*user functions*/
	        	if(shouldPullDown && zero>60*DPI)
	        	{
	        		pulldown();
	        	}
	        	if(direction == "left")
			    {
			    	swipeleft(fingerStart, finger);
			    }
			    else if(direction == "right")
			    {
			    	swiperight(fingerStart, finger);
			    }
	        }
	        /*stop gesture recognition*/
	        tapping = false;
	        testing = false;
	        direction = "";
	        /*user function*/
	        touchend(finger);
	        /*stop brower function*/
	        e.preventDefault();
	        // e.returnValue = false;
		};


	inheight = mainDraw(zero);

	//IOS and Android
	canvas.addEventListener('touchstart', function(e) {
        startAction(e);
    });
	canvas.addEventListener('touchmove', function(e) {
		moveAction(e);
    });
	canvas.addEventListener('touchend', function(e) {
		endAction(e);
    });
	//Windows phone
 //    canvas.addEventListener('MSPointerDown', function(e) {
 //        startAction(e);
 //    });
	// canvas.addEventListener('MSPointerMove', function(e) {
	// 	moveAction(e);
 //    });
	// canvas.addEventListener('MSPointerUp', function(e) {
	// 	endAction(e);
 //    });
	return control;
};