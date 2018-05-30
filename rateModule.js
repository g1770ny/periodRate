
var async = require('async');
var rateModule = {};
//Checking that two days are consecutives
rateModule.consecutiveDate  = function(dayDate, forwardDate, callback)
{
    let dd = dayDate.split('-');
    let fd = forwardDate.split('-');
    let objDD = new Date(dd[0],dd[1]-1,dd[2]);
    let objFD = new Date(fd[0],fd[1]-1,fd[2]-1);
    
    if(objDD.getDay() == objFD.getDay() && objDD.getMonth() == objFD.getMonth() && objDD.getFullYear() == objFD.getFullYear())
        return callback(null, true);
    else
        return callback(null, false);
    
}

rateModule.colorGenerater = function(rateValue)
{
    let rateRand = rateValue.toString();
    rateRand = rateRand.split('.');
    rateRand = rateRand[0] + rateRand[1];//Delete '.'
    //Complete to 7 digits with zeros
    let digits = rateRand.length;
    for(i = digits; i < 7; i++)
        rateRand = rateRand + '0'; 
    let red = parseInt(rateRand) % 256;
    let green = 256 - red;
    let blue = red - green;
    if(blue < 0)
        blue *= -1;
    var hexRed = (red).toString(16);
    if (hexRed.length < 2) {
        hexRed = "0" + hexRed;
    }
    var hexGreen = green.toString(16);
    if (hexGreen.length < 2) {
        hexGreen = "0" + hexGreen;
    }
    var hexBlue = blue.toString(16);
    if (hexBlue.length < 2) {
        hexBlue = "0" + hexBlue;
    }
    let hexColor = "#" + hexRed + hexGreen + hexBlue;
    
    return hexColor.toUpperCase();
}

rateModule.compactRate = function(listRates, callback)
{
   
    if(typeof listRates !== 'undefined' && listRates.length > 0)
    {
        let listPeriod = new Array();
        let lrLength = listRates.length;
        let i = 0;
        let tmpRate = {
            rate        : listRates[0].rate,
            periodStart : listRates[0].date,
            periodEnd   : listRates[0].date,
            color       : rateModule.colorGenerater(listRates[0].rate)
        };

        async.each(listRates, function(rateItem, callbackItem) {
            
            rateModule.consecutiveDate(tmpRate.periodEnd, rateItem.date, function(error, isConsDay){
                if(rateItem.rate == tmpRate.rate && isConsDay)
                {
                    tmpRate.periodEnd = rateItem.date;

                    if(i == lrLength - 1)
                        listPeriod.push(tmpRate);    
                }   
                else
                {
                    if(i > 0)
                    {     
                        listPeriod.push(tmpRate);
                        tmpRate = {
                            rate        : rateItem.rate,
                            periodStart : rateItem.date,
                            periodEnd   : rateItem.date,
                            color       : rateModule.colorGenerater(rateItem.rate)  
                        };                         
                    }

                    if(i == lrLength - 1)                         
                        listPeriod.push(tmpRate);                 
                }
                i++;
                callbackItem(); 
            });              
        }, function(err) {            
            if( err ) 
                console.log('Server internal error');
             else 
                callback(null, listPeriod);
            
        }); 
    }   
}

module.exports =rateModule;