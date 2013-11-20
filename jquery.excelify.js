/* ------------------------------------------------------------------------
	jquery.excelify v.0.0.1
	A minimalist spreadsheet generator
	by rom_j
	inspired by Ondřej Žára (http://jsfiddle.net/ondras/hYfN3/)
 ------------------------------------------------------------------------ */
(function( $ ) {
	$.fn.excelify = function(options) {
		var defaults = {
			activateLocalStorage : true,
			nbRows : 6,
			nbCols : 6,
			nbLoops: 10
		}
		var settings = $.extend({}, defaults, options),
			that = this,
			tID = this.attr('id'),
			nbRows = settings.nbRows+1,
			nbCols = settings.nbCols+1;
			nbCells = 36;
		// Add class to set CSS :
		this.addClass('excelifyTable');
		// Initializing the rows
		for (var i=0; i<nbRows; i++) {
			var row = this.get(0).insertRow(-1);
			for (var j=0; j<nbCols; j++) {
				var letter = String.fromCharCode("A".charCodeAt(0)+j-1);
				row.insertCell(-1).innerHTML = i&&j ? "<input class='excelifyCell' id='"+tID+"_"+ letter+i +"'/>" : i||letter;
			}
		}
		// Focus / blur Handlers
		$('.excelifyCell',that).on('focus',function(e) {
			var theCell = $(this), theCellID = $(this).attr('id');
			$(this).val(localStorage[$(this).attr('id')] || "");
			$('.excelifyCell',that).on('mousedown',function(event) {
				var curCellID = $(this).attr('id'), curVal = theCell.val(); 
				if (curVal.charAt(0) == "=" && curCellID != theCellID) {
					event.preventDefault();
					curVal += curCellID.replace(tID+'_','');
					theCell.val(curVal);
				}
				return false;
			});
		});
		$('.excelifyCell',that).on('blur',function(e) {
			localStorage[$(this).attr('id')] = $(this).val();
			$('.excelifyCell',that).off('mousedown');
			computeAll();
		});
		// keypress handler
		$('.excelifyCell',that).keyup(function (e) {
			//console.log(e.keyCode);
			var curID = $(this).attr('id');
			if (e.keyCode == 13) {
				//console.log("enter");
				$(this).blur();
				return false;			
			}
			if (e.keyCode == 27) {
				//console.log("esc");
				$(this).val(localStorage[curID] || "");
				$(this).blur();
				return false;			
			}
			if (e.keyCode == 40) {
				//console.log("down");
				var newID = getMovedID(curID,1,0);
				$('#'+newID).focus();
			}
			if (e.keyCode == 38) {
				//console.log("up");
				var newID = getMovedID(curID,-1,0);
				$('#'+newID).focus();
			}
			if (e.keyCode == 37) {
				//console.log("left");
				if ($(this).val()=='') {
					var newID = getMovedID(curID,0,-1);
					$('#'+newID).focus();
				}
			}
			if (e.keyCode == 39) {
				//console.log("right");
				if ($(this).val()=='') {
					var newID = getMovedID(curID,0,1);
					$('#'+newID).focus();
				}
			}
		});
		// Functions
		function getMovedID(curID,rowMove,colMove) {
			var curRef = curID.replace(tID+'_','');
			var curLetter = curRef.replace(new RegExp('[0-9]',"gi"),'');
			var newLetter = String.fromCharCode(curLetter.charCodeAt(0)+colMove);
			var newNum = parseInt(curRef.replace(curLetter,''))+rowMove;
			var newID = tID+'_'+newLetter+newNum;
			return newID;
		}
		function computeAll() {
		    $('.excelifyCell',that).removeClass('isCalc');
		    var calcCells = 0, nbLoops = 0;
			while(calcCells < nbCells && nbLoops < settings.nbLoops) {
			  	//console.log(nbLoops);
			  	//console.log(settings.nbLoops);
			  	nbLoops++
			    $('.excelifyCell:not(.isCalc)',that).each(function() {
			        var value = localStorage[$(this).attr('id')] || "";
			        isCalc = 0;
			        if (value.charAt(0) == "=" && value!='=') {
			            var tempo = value.substring(1);
			            // I add the id of the table to make sure I refer to the right cell
			            // Second regexp replace to get rid of unwanted characters at the end of the string.
			            //console.log($(this).attr('id')+ ' = '+value.substring(1).replace(new RegExp("([a-z][0-9]{1,3})","gi"), "parseFloat($('#"+tID+"_$1').val())"));
			            theVal = eval(value.substring(1).replace(new RegExp("([a-z][0-9]{1,3})","gi"), "parseFloat($('#"+tID+"_$1').val())").replace(new RegExp("[^0-9\)]$","gi"),''));
						if (!isNaN(theVal)) {
							isCalc = 1;
						} else {
							theVal = 'Circ. Ref !';
						}
			        } else { 
			        	theVal = isNaN(parseFloat(value)) ? value : parseFloat(value); 
			        	isCalc = 1;
			        }
				    $(this).val(theVal);
				    if (isCalc) {
					    calcCells++;
					    $(this).addClass('isCalc');
				    }
				    //console.log('calcCells='+calcCells);
				});
			}
			$('.excelifyCell:not(.isCalc)',that).parent().addClass('notCalc');
			$('.excelifyCell.isCalc',that).parent().removeClass('notCalc');
		};
		// If activateLocalStorage is not activated reset all the values
		if (!settings.activateLocalStorage) {
		    $('.excelifyCell',that).each(function() {
				localStorage[$(this).attr('id')] = "";
			});
		}
		computeAll();
		return this;
	}
}( jQuery ));