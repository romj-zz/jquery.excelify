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
			nbCols : 6
		}
		var settings = $.extend({}, defaults, options),
			that = this,
			tID = this.attr('id'),
			nbRows = settings.nbRows+1,
			nbCols = settings.nbCols+1;
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
		// Handlers
		$('.excelifyCell',that).on('focus',function(e) {
			$(this).val(localStorage[$(this).attr('id')] || "");
		});
		$('.excelifyCell',that).on('blur',function(e) {
			localStorage[$(this).attr('id')] = $(this).val();
			computeAll();
		});
		// Functions
		function computeAll() {
		    $('.excelifyCell',that).each(function() {
			        var value = localStorage[$(this).attr('id')] || "";
			        if (value.charAt(0) == "=") {
			            var tempo = value.substring(1);
			            // I add the id of the table to make sure I refer to the right cell
			            theVal = eval(value.substring(1).replace(new RegExp("([a-z][0-9]{1,3})","gi"), "parseFloat($('#"+tID+"_$1').val())"));
			        } else { 
			        	theVal = isNaN(parseFloat(value)) ? value : parseFloat(value); 
			        }
			    $(this).val(theVal);
			});
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