 function ProgressBar(divId, cellCount, tableCss, cellCss, sizeCss)
    {
	
	    var Timer = function()
    {        
        // Property: Frequency of elapse event of the timer in millisecond
        this.Interval = 1000;
        
        // Property: Whether the timer is enable or not
        this.Enable = new Boolean(false);
        
        // Event: Timer tick
        this.Tick;
        
        // Member variable: Hold interval id of the timer
        var timerId = 0;
        
        // Member variable: Hold instance of this class
        var thisObject = this;
        
        // Function: Start the timer
        this.Start = function()
        {
            this.Enable = new Boolean(true);
    
            //thisObject = this;
            if (thisObject.Enable)
            {
                thisObject.timerId = setInterval(
                function()
                {
                    thisObject.Tick(); 
                }, thisObject.Interval);
            }
        };
        
        // Function: Stops the timer
        this.Stop = function()
        {            
            thisObject.Enable = new Boolean(false);
            clearInterval(thisObject.timerId);
        };
    
    };

        var index = -1;
        var timerObj = new Timer();
		var finit;
        
		this.Stop = function()
		{
		    timerObj.Stop() ;
			index = -1;
			for(var k=0;k<cellCount;++k)
			  $("#" + divId + " ." + cellCss + k).fadeOut(10);
			  
		}
        this.Init = function()
        {
		    timerObj.Stop() ;
			
			if(finit) return;
			
            var str = "<table class='" + tableCss + "' cellpadding='0' cellspacing='2'><tr>";
            for(var cnt=0; cnt<cellCount; cnt++)
            {
                str += "<td class='" + sizeCss + "'><div class='" 
                  + cellCss + " " + cellCss + cnt + "'></div></td>";
            }
            str += "</tr></table>";
            $("#" + divId).append(str);
            
            timerObj.Interval = 100;
            timerObj.Tick = timer_tick;
			finit=1;
        }
        
        this.Start = function()
        {
            //this.Init();
			index = -1;
            timerObj.Start();
        }
        
        function timer_tick()
        {
            //debugger;
            index = index + 1;
            index = index % cellCount;
            
            $("#" + divId + " ." + cellCss + index).fadeIn(10);
            $("#" + divId + " ." + cellCss + index).fadeOut(500);
        }
    }
