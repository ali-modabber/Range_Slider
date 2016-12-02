(function($)
{
	$.fn.ermile_slider = function()
	{
		$(this).each(function(){
			$(this).addClass('range-slider');
			var data_infinity = $(this).attr("data-infinity");
			var data_type = $(this).attr("data-type");
			if(data_type !== 'vertical')
			{
				data_type = 'horizontal';
			}


			var data_step = Number($(this).attr("data-step"));
			if(isNaN(data_step))
			{
				data_step = 1;
			}

			var data_min = Number($(this).attr("data-min"));
			if(isNaN(data_min))
			{
				data_min = 0;
			}

			var data_min_default = Number($(this).attr("data-min-default"));
			if(isNaN(data_min_default) || data_min_default < data_min)
			{
				data_min_default = data_min;
			}

			var data_max = Number($(this).attr("data-max"));
			if(isNaN(data_max) || data_min >= data_max)
			{
				data_max = data_min + 100;
			}

			var data_max_default = Number($(this).attr("data-max-default"));
			if(isNaN(data_max_default) || data_max < data_max_default)
			{
				data_max_default = data_max;
			}

			var data_unit = data_max - data_min;

			$(this).data('range-slider', {
				min 			: data_min,
				max 			: data_max,
				max_default 	: data_max_default,
				min_default 	: data_min_default,
				unit 			: data_unit,
				step 			: data_step,
				type 			: data_type,
				margin 			: 0,
				depth			: 0,
			});

			$(this).init.prototype.unit_to_pixel = function(_range){
				var range = Number(_range);
				var data = this.data('range-slider');
				if(isNaN(range) || range < data.min || range > data.max)
				{
					range = data.max;
				}
				range -= data.min;
				var volume = this.width();
				if(data.type == 'vertical')
				{
					volume = this.height();
				}
				return (range * volume) / data.unit;
			}
			$(this).init.prototype.range_to_unit = function(_range){
				var data = this.data('range-slider');
				return this.unit_to_pixel(_range + data.min);
			}

			$(this).init.prototype.pixel_to_unit = function(_range){
				var range = Number(_range);
				var data = this.data('range-slider');
				var volume = this.width();
				if(data.type == 'vertical')
				{
					volume = this.height();
				}
				if(isNaN(range) || range < 0 || range > volume)
				{
					range = volume;
				}

				return (range * data.unit) / volume;
			}

			$(this).init.prototype.pixel_range_to = function(_range, _direction, _beginning)
			{
				_beginning = Number(_beginning);
				var data = this.data('range-slider');
				var direction 	= _direction == 'max' 		? 'max' 	: 'min';
				var margin 		= data.type == 'vertical' 	? 'bottom' 	: 'left';
				var depth 		= data.type == 'vertical' 	? 'height' 	: 'width';
				var beginning 	= isNaN(_beginning) || _beginning < 0 ? $('.dynamic-range', this).css(margin) : _beginning;
				beginning = this.range_to_unit(beginning);
				beginning 		= Math.round(beginning / data.step) * data.step;
				var range 		= _range < 0 				? 0 		: _range;
				var unit_range 	= this.pixel_to_unit(range);
				var step_range 	= Math.round(unit_range / data.step) * data.step;
				var pixel_range = parseFloat(this.range_to_unit(step_range));
				var change_margin = parseFloat($('.dynamic-range', this).css(margin));
				if(_direction == 'min')
				{
					change_margin = change_margin - pixel_range;
					$('.dynamic-range', this).css(margin, pixel_range);
					$('.dynamic-range', this).css(depth, $('.dynamic-range', this).width() + change_margin);
				}
				else
				{
					pixel_range -= change_margin;
					$('.dynamic-range', this).css(depth, pixel_range);
				}
			}

			var dynamic_range = $("<div class='dynamic-range'></div>");
			var min_selection = add_selection.call(this, 'min');
			var max_selection = add_selection.call(this, 'max');
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
			return;
			_self = this;
			set_ranges.call(this, my_min, data_unit, data_infinity);
			// move_to_click.call(_self, data_infinity);
			//
		});
	}

	var add_selection = function(_name)
	{
		var data = $(this).data('range-slider');
		var selection = $("<span class='"+_name+"' tabindex='0'></span>");
		selection.bind('mousedown.range-slider tap', function(event){
		var margin 	= data.type == 'vertical' 	? 'bottom' 	: 'left';
			$(document).unbind("mousemove.range-slider");
			$(document).unbind("mouseup.range-slider");
			var _self = this;
			var range_slider = $(this).parents('.range-slider');
			$(document).bind("mousemove.range-slider", function(event){
				var mouse_range 		= (data.type == 'vertical') ? event.pageY : event.pageX;
				var left_range 			= (data.type == 'vertical') ? $(range_slider).offset().top : $(range_slider).offset().left;
				var changed_range		= mouse_range - left_range;
				$(_self).parents('.range-slider').pixel_range_to(changed_range, _name);
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
})(jQuery);