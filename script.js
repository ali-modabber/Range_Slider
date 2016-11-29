(function($)
{
	$.fn.ermile_slider = function()
	{
		$(this).each(function(){
			var data_infinity = $(this).attr("data-infinity");
			var data_unit = $(this).attr("data-unit");
			var data_max = $(this).attr("data-max");
			var data_min = $(this).attr("data-min");

			if (!data_unit)
			{
				data_unit = 100;
				my_max = 100;
			}

			if (!data_max && data_unit)
			{
				data_max = data_unit;
			}
			if (data_max)
			{
				var my_max = data_max;
			}

			var my_min = 0;
			if (data_min)
			{
				var my_min = data_min;
			}

			var dynamic_range = $("<div class='dynamic-range'></div>");
			var min_selection = add_selection.call(this, 'min', data_unit, my_max, my_min);
			var max_selection = add_selection.call(this, 'max', data_unit, my_max, my_min);

			if (data_infinity == 'max')
			{
				max_selection.appendTo(dynamic_range);
			}
			else if(data_infinity == 'min')
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
			set_ranges.call(this, my_min, data_unit, data_infinity);
			// move_to_click.call(_self, data_infinity);
			//
		});
	}

	var set_ranges = function(_my_min, _data_unit, _data_infinity)
	{
		var x = $(this).find('span');
		var input_a = "<input type='number' name='range-1'>";
		x.append(input_a);

		var dynamic_range = $(this).find('.dynamic-range');
		var parent_max = $(this).width();
		var original_step = parent_max / _data_unit;
		var type = $(this).attr('data-type');
		var _real_min =_my_min*original_step;

		// console.log(original_step);
		// console.log(_data_unit);
		// console.log(_my_min*original_step);
		if (type == 'horizontal')
		{
			dynamic_range.css("left",_real_min);
			dynamic_range.css("width",original_step);
		}
		if (type != 'horizontal')
		{
			parent_max = $(this).height();
			dynamic_range.css("bottom",_real_min);
			dynamic_range.css("height",original_step);
		}

		if (_data_infinity == 'min')
		{
			if (type == 'horizontal')
			{
				dynamic_range.css("width",_real_min);
				dynamic_range.css("left",parent_max - _real_min);
			}
			if (type != 'horizontal')
			{
				dynamic_range.css("bottom",parent_max);
				dynamic_range.css("height",_real_min);
			}
		}
		else if(_data_infinity == 'max')
		{
			if (type == 'horizontal')
			{
				dynamic_range.css("width",_real_min);
				dynamic_range.css("left",0);
			}
			if (type != 'horizontal')
			{
				dynamic_range.css("bottom",0);
				dynamic_range.css("height",_real_min);
			}
		}
	}





	var add_selection = function(_name, _data_unit, my_max, my_min)
	{
		// console.log(my_min);
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

				corridor_slider.call(_self, change_range, type, _name, original, original_beginning, _data_unit, my_max, my_min);




// console.log(_self);
// 		var final_width = $(_self).parents('.dynamic-range').width();
// 		var final_left = $(_self).parents('.dynamic-range').width();
// 		console.log(a);
// 		console.log(a.width());


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

			var dynamic_range = $(this).parents('.dynamic-range');
			var parent_max = dynamic_range.parent().height();
			if(type != 'vertical')
			{
				parent_max = dynamic_range.parent().width();
			}

			var original_step = parent_max / _data_unit;
			my_range = original_step;
			if (original_step < 1)
			{
				my_range = 1;
			}

			if(type != "vertical")
			{
				min_keyCode = 37;
				max_keyCode = 39;
			}

			if(event.keyCode == max_keyCode)
			{
				change_range = my_range;
			}
			else if(event.keyCode == min_keyCode)
			{
				change_range = (-1*my_range);
			}
			if(!change_range) return;

			if(event.shiftKey)
			{
				change_range *= (10);
			}

			corridor_slider.call(this, change_range, type, _name, original, original_beginning, _data_unit, my_max, my_min);
			// console.log(corridor_slider.call(this, change_range, type, _name, original, original_beginning, _data_unit, my_max, my_min))
			return false;
		});

		return selection;
	}

	var corridor_slider = function(_range, _type, _direction, _original, _original_beginning, _data_unit, my_max, my_min)
	{

		var dynamic_range = $(this).parents('.dynamic-range');
		var original_range = dynamic_range.height();
		var parent_max = dynamic_range.parent().height();
		if(_type != 'vertical')
		{
			original_range = dynamic_range.width();
			parent_max = dynamic_range.parent().width();
		}

		var original_step = parent_max / _data_unit;
		if (original_step >= 1)
		{
			_range = Math.round(_range / original_step);
			_range = _range * original_step;
		}
		if ( original_step < 1 &&  original_step > 0)
		{
			_range = _range * original_step;
			// _range = _range * original_step;
		}

		var dynamic_range = $(this).parents('.dynamic-range');
		var original_range = dynamic_range.height();
		var beginning = parseInt(dynamic_range.css('bottom'));
		var max = beginning + original_range + _range;
		var parent_max = dynamic_range.parent().height();
		if(_type != 'vertical')
		{
			original_range = dynamic_range.width();
			beginning = parseInt(dynamic_range.css('left'));
			// console.log(beginning);
			max = beginning + original_range + _range;
			parent_max = dynamic_range.parent().width();
		}

		if(_direction == 'max')
		{
			parent_max = original_step*my_max;
			var changed_range = original_range + _range;

			real_min = original_step*my_min;

			_data_infinity = $(this).parents('.range-slider').attr('data-infinity');


			if (max <= real_min)
			{
				changed_margin = real_min;
			}

			if(max >= parent_max){
				changed_range = parent_max - beginning;
			}

			if (_data_infinity && _data_infinity=='max')
			{
				if (changed_range <= real_min)
				{
					changed_range = real_min;
				}
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
			var real_min = my_min * original_step;

			// console.log(my_min);
			// console.log(real_min);

			_data_infinity = $(this).parents('.range-slider').attr('data-infinity');

			parent_max = original_step * my_max;
			if (_data_infinity && _data_infinity=='min')
			{
				if (changed_range <= real_min)
				{
					changed_range = real_min;
					changed_margin = parent_max - real_min;
				}
				if(changed_range >= parent_max)
				{
					changed_range = parent_max;
					changed_margin = 0;
				}
			}

			else
			{
				if (changed_margin <= real_min)
				{
					changed_margin = real_min;
					changed_range = parseInt(_original_beginning) + _original - real_min;
				}
			}

			if (changed_range <= 0)
			{
				changed_range = 0;
				changed_margin = parseInt(_original_beginning) + _original;
			}

			dynamic_range.css(range_to, changed_range);
			dynamic_range.css(margin, changed_margin );
		}

		final_width = parseInt(dynamic_range.css('width'));
		final_first_left = parseInt(dynamic_range.css('left'));
		if (_type != 'horizontal')
		{
			final_first_left = parseInt(dynamic_range.css('bottom'));
			final_width = parseInt(dynamic_range.css('height'));
		}
			final_second_left = parseInt(final_first_left + final_width);

		// console.log(original_step);
		console.log(Math.round(final_first_left/original_step));
		// console.log(final_second_left);
		// console.log(this);
		var my_input = $(this).find('input');
		// console.log($(this).attr('class'));
		if ($(this).attr('class') == 'max')
		{
			my_input.val(Math.round(final_second_left/original_step));
		}
		else if ($(this).attr('class') == 'min')
		{
			my_input.val(Math.round(final_first_left/original_step));
		}
		// var x = $(this);
		// var input_a = "<input type='number' name='range-1'>";
		// x.append(input_a);

		// return[final_width, final_first_left, final_second_left];
	}

})(jQuery);
	// var move_to_click = function(data_infinity){
	// 	$(this).on( "mousedown.range_slider", function(event) {
	// 		var type = $(this).attr('data-type');
	// 		if(type != "vertical")
	// 		{
	// 			var type = "horizontal";
	// 		}
	// 		var total_range = $(this);
	// 		var dynamic_range = total_range.find(".dynamic-range");

	// 		total_range_value = total_range.height();
	// 		ziro_position = event.pageY;
	// 		range_offset = total_range.offset().top;
	// 		click_position = total_range.height() - (ziro_position - range_offset);
	// 		dynamic_range_value = dynamic_range.height();
	// 		dynamic_range_margin = parseInt(dynamic_range.css("bottom"));

	// 		if (type != 'vertical')
	// 		{
	// 			total_range_value = total_range.width();
	// 			ziro_position = event.pageX;
	// 			click_position = ziro_position - parseInt(total_range.offset().left) ;
	// 			dynamic_range_value = dynamic_range.width();
	// 			dynamic_range_margin = parseInt(dynamic_range.css("left"));
	// 		}
	// 		var middle = dynamic_range_margin + (dynamic_range_value/2);


	// 	if (data_infinity == 'min')
	// 	{
	// 		if (click_position > 0)
	// 		{
	// 			var final_margin = 0;
	// 			final_range = click_position;
	// 			if (click_position >= total_range_value)
	// 			{
	// 				final_range = total_range_value;
	// 			}
	// 		}
	// 	}

	// 	else if(data_infinity == 'max')
	// 	{
	// 		if (click_position > 0)
	// 		{
	// 			final_margin = click_position;
	// 			final_range = total_range_value - click_position;
	// 			if (click_position >= total_range_value)
	// 			{
	// 				final_margin = total_range_value;
	// 				final_range = 0;
	// 			}
	// 		}
	// 	}

	// 	else
	// 	{
	// 		if (click_position <= middle)
	// 		{
	// 			var final_margin = click_position;
	// 			var add_to_range = dynamic_range_margin - click_position;
	// 			var final_range = dynamic_range_value + add_to_range;
	// 			if (click_position <= 0)
	// 			{
	// 				final_margin = 0;
	// 				final_range = dynamic_range_value+dynamic_range_margin;
	// 			}
	// 		}
	// 		else
	// 		{
	// 			add_to_range = click_position - dynamic_range_value - dynamic_range_margin;
	// 			final_range = dynamic_range_value + add_to_range;
	// 			if (click_position >= total_range_value)
	// 			{
	// 				final_range = total_range_value - dynamic_range_margin;
	// 			}
	// 		}
	// 	}


	// 		var range_to = type == 'vertical' ? 'height' : 'width';
	// 		var margin_to = type == 'vertical' ? 'bottom' : 'left';
	// 			$(dynamic_range).css(margin_to, final_margin);
	// 			$(dynamic_range).css(range_to, final_range);

	// 	}).on('mouseup.range_slider', function(){
	// 		$(this).unbind('mousemove.range_slider mouseup.range_slider');
	// 	});
	// }