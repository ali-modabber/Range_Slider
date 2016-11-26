$(document).ready(function() {
	$(".range-slider").each(function(){
		var data_infinity = $(this).attr("data-infinity");


		var dynamic_range = $("<div class='dynamic-range'></div>");
		var min_selection = add_selection.call(this, 'min');
		var max_selection = add_selection.call(this, 'max');

		if (data_infinity == 'min')
		{
			max_selection.appendTo(dynamic_range);
		}
		else if(data_infinity == 'max')
		{
			min_selection.appendTo(dynamic_range);
		}
		else
		{
			min_selection.appendTo(dynamic_range);
			max_selection.appendTo(dynamic_range);
		}

		dynamic_range.appendTo(this);

		_self = this;
		move_to_click.call(_self, data_infinity);
	});
});

function move_to_click(data_infinity){
	$(this).on( "mousedown.range_slider", function(event) {
		var type = $(this).attr('data-type');
		if(type != "vertical")
		{
			var type = "horizontal";
		}
		var total_range = $(this);
		var dynamic_range = total_range.find(".dynamic-range");

		total_range_value = total_range.height();
		ziro_position = event.pageY;
		range_offset = total_range.offset().top;
		click_position = total_range.height() - (ziro_position - range_offset);
		dynamic_range_value = dynamic_range.height();
		dynamic_range_margin = parseInt(dynamic_range.css("bottom"));

		if (type != 'vertical')
		{
			total_range_value = total_range.width();
			ziro_position = event.pageX;
			click_position = ziro_position - parseInt(total_range.offset().left) ;
			dynamic_range_value = dynamic_range.width();
			dynamic_range_margin = parseInt(dynamic_range.css("left"));
		}
		var middle = dynamic_range_margin + (dynamic_range_value/2);


	if (data_infinity == 'min')
	{
		if (click_position > 0)
		{
			var final_margin = 0;
			final_range = click_position;
			if (click_position >= total_range_value)
			{
				final_range = total_range_value;
			}
		}
	}

	else if(data_infinity == 'max')
	{
		if (click_position > 0)
		{
			final_margin = click_position;
			final_range = total_range_value - click_position;
			if (click_position >= total_range_value)
			{
				final_margin = total_range_value;
				final_range = 0;
			}
		}
	}

	else
	{
		if (click_position <= middle)
		{
			var final_margin = click_position;
			var add_to_range = dynamic_range_margin - click_position;
			var final_range = dynamic_range_value + add_to_range;
			if (click_position <= 0)
			{
				final_margin = 0;
				final_range = dynamic_range_value+dynamic_range_margin;
			}
		}
		else
		{
			add_to_range = click_position - dynamic_range_value - dynamic_range_margin;
			final_range = dynamic_range_value + add_to_range;
			if (click_position >= total_range_value)
			{
				final_range = total_range_value - dynamic_range_margin;
			}
		}
	}


		var range_to = type == 'vertical' ? 'height' : 'width';
		var margin_to = type == 'vertical' ? 'bottom' : 'left';
			$(dynamic_range).css(margin_to, final_margin);
			$(dynamic_range).css(range_to, final_range);

	}).on('mouseup.range_slider', function(){
	  $(this).unbind('mousemove.range_slider mouseup.range_slider');
	});
}

function add_selection(_name)
{
	var type = $(this).attr('data-type');
	if(type != "vertical")
	{
		var type = "horizontal";
	}

	var selection = $("<span class='"+_name+"' tabindex='0'></span>");

	selection.bind('mousedown.range-slider tap', function(event){
		$(document).unbind("mousemove.range-slider");
		$(document).unbind("mouseup.range-slider");
		var _self = this;

		var original = $(this).parents('.dynamic-range').height();
		original_beginning = $(this).parents('.dynamic-range').css('bottom');
		var beginning = -event.pageY;

		if(type != "vertical")
		{
			var beginning = event.pageX;
			original = $(this).parents('.dynamic-range').width();
			original_beginning = $(this).parents('.dynamic-range').css('left');
		}

		$(document).bind("mousemove.range-slider", function(event){
			var change_original = $(_self).parents('.dynamic-range').height() - original;
			var range = -event.pageY;
			if(type != "vertical")
			{
				var range = event.pageX;
				change_original = $(_self).parents('.dynamic-range').width() - original;
			}

			var change_range = range - beginning - change_original;

			corridor_slider.call(_self, change_range, type, _name, original, original_beginning);

		}).bind("mouseup.range-slider", function(){
			$(document).unbind("mousemove.range-slider");
		}).bind('tap', function(){
			$("#x").text(event.pageX);
		});

	}).bind('keydown.range-slider', function(event){
		var original = $(this).parents('.dynamic-range').height();
		original_beginning = $(this).parents('.dynamic-range').css('bottom');
		var beginning = -event.pageY;

		if(type != "vertical")
		{
			var beginning = event.pageX;
			original = $(this).parents('.dynamic-range').width();
			original_beginning = $(this).parents('.dynamic-range').css('left');
		}

		var change_range = 0;
		var min_keyCode = 40;
		var max_keyCode = 38;

		if(type != "vertical")
		{
			min_keyCode = 37;
			max_keyCode = 39;
		}

		if(event.keyCode == max_keyCode)
		{
			change_range = 1;
		}
		else if(event.keyCode == min_keyCode)
		{
			change_range = -1;
		}
		if(!change_range) return;

		if(event.shiftKey)
		{
			change_range *= 10;
		}
		corridor_slider.call(this, change_range, type, _name, original, original_beginning);

		return false;
	});

	return selection;
}

function corridor_slider(_range, _type, _direction, _original, _original_beginning)
{
	var dynamic_range = $(this).parents('.dynamic-range');
	var original_range = dynamic_range.height();
	var beginning = parseInt(dynamic_range.css('bottom'));
	var max = beginning + original_range + _range;
	var parent_max = dynamic_range.parent().height();
	if(_type != 'vertical')
	{
		original_range = dynamic_range.width();
		beginning = parseInt(dynamic_range.css('left'));
		max = beginning + original_range + _range;
		parent_max = dynamic_range.parent().width();
	}
	if(_direction == 'max')
	{
		var changed_range = original_range + _range;
		if(max > parent_max){
			changed_range = parent_max - beginning;
		}
		var range_to = _type == 'vertical' ? 'height' : 'width';
		dynamic_range.css(range_to, changed_range);
	}


	else if (_direction == 'min')
	{
		var range_to = _type == 'vertical' ? 'height' : 'width';
		var margin = _type == 'vertical' ? 'bottom' : 'left';
		var going_range = original_range + _range;
		var dif = going_range - _original;
		var changed_range = _original - dif;
		var changed_margin = dif + parseInt(_original_beginning);

		if (changed_margin <= 0)
		{
			changed_margin = 0;
			changed_range = parseInt(_original_beginning) + _original;
		}
		else if (changed_range <= 0)
		{
			changed_margin = parseInt(_original_beginning) + _original;
			changed_range = 0;
		}
		dynamic_range.css(range_to, changed_range);
		dynamic_range.css(margin, changed_margin );
	}
}
