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
				min_default 	: data_min_default,
				max_default 	: data_max_default,
				unit 			: data_unit,
				step 			: data_step,
				type 			: data_type,
				margin 			: data_min_default,
				depth			: data_max,
			});

			$(this).init.prototype.range = function(_from, _to, _option){
				var from = _from;
				var to = _to;
				var data = this.data('range-slider');

				option = {
					type : 'unit'
				}
				$.extend(option, _option);
				option.from_type = option.type;
				option.to_type = option.type;


				var depth_type = data.type == 'vertical' ? 'height' : 'width';
				if(from === null || from === false || from === undefined)
				{
					from = this.find('.dynamic-margin')[depth_type]();
					option.from_type = 'pixel';
				}
				if(to === null || to === false || to === undefined)
				{
					to = this.find('.dynamic-margin')[depth_type]() + this.find('.dynamic-range')[depth_type]();
					option.to_type = 'pixel';
				}

				if(data.type == 'vertical')
				{
					var fto = from;
					from = to;
					to = fto;
				}

				var base_depth = this[depth_type]();

				if(option.from_type == 'pixel')
				{
					from = (from * data.unit) / base_depth;
				}
				else if(option.from_type == 'percent')
				{
					from = (from * data.unit) / 100;
				}
				else if(option.from_type == 'ziro_unit')
				{
					from -= data.min;
				}

				if(option.to_type == 'pixel')
				{
					to = (to * data.unit) / base_depth;
				}
				else if(option.to_type == 'percent')
				{
					to = (to * data.unit) / 100;
				}
				else if(option.to_type == 'ziro_unit')
				{
					to -= data.min;
				}

				var from_step = Math.round(from / data.step) * data.step;
				var to_step = Math.round(to / data.step) * data.step;
				from = (from_step * 100) / data.unit;
				to = (to_step * 100) / data.unit;

				var depth = to - from;
				console.log(from);
				console.log(depth);
				
				this.find('.dynamic-margin').css(depth_type, from + "%");
				this.find('.dynamic-range').css(depth_type, depth + "%");
			}

			var margin_range = $("<div class='dynamic-margin'></div>");
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
				max_selection.appendTo(dynamic_range);
				min_selection.appendTo(dynamic_range);
			}
			margin_range.hide();
			dynamic_range.hide();

			margin_range.appendTo(this);
			dynamic_range.appendTo(this);
			$(this).range(0, data_step);

			margin_range.show();
			dynamic_range.show();
		});
	}

	var add_selection = function(_name)
	{
		var data = $(this).data('range-slider');
		var _self = this;
		var selection = $("<div class='"+_name+"'></div>");
		selection.unbind('mousedown.range-slider');
		selection.bind('mousedown.range-slider', function(){
			var _selection = this;
			$(document).unbind("mousemove.range-slider");
			$(document).bind("mousemove.range-slider", function(event){
				var mouse_position = data.type == 'vertical' ? event.pageY : event.pageX;
				var ziro_point = data.type == 'vertical'? $(_self).offset().top : $(_self).offset().left;
				var mouse_selection = mouse_position - ziro_point;

				if(_name == 'max')
				{
					$(_self).range(null, mouse_selection, {type:'pixel'});
				}
				else
				{
					$(_self).range(mouse_selection, null, {type:'pixel'});
				}
			}).bind("mouseup.range-slider", function(){
				$(document).unbind("mouseup.range-slider");
				$(document).unbind("mousemove.range-slider");
			});
		}).bind("mouseup", function(){
			$(document).unbind("mousemove.range-slider");
		});
		return selection;
	}
})(jQuery);