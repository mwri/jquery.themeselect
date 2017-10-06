// Package: jquery.themeselect v1.0.1 (built 2017-10-06 16:46:20)
// Copyright: (C) 2017 Michael Wright <mjw@methodanalysis.com>
// License: MIT


(function ($, themematch) {


	'use strict';


	$.fn.themeselect = function(first_arg) {

		let args = arguments;
		if (typeof first_arg === 'string') {
			if (first_arg in methods)
				return this.each(function () {
					let data = jQuery.data(this, 'jquery.themeselect');
					let jqp_obj = $(this);
					args[0] = data;
					return methods[first_arg].apply(jqp_obj, args);
				});
			throw 'jquery.themeselect has no method "'+first_arg+'"';
		} else if (typeof first_arg === 'object') {
			return this.each(function () {
				let data = {};
				let jqp_obj = $(this);
				jQuery.data(this, 'jquery.themeselect', data);
				return methods.constructor.apply(jqp_obj, [data, first_arg]);
			});
		} else {
			throw 'jquery.themeselect requires a string (method) or object (constructor) first parameter';
		}

	};


	let methods = {

		constructor: function (data, params) {

			params = jQuery.extend(
				{},
				params
			);

			this.addClass('themeselect');

			data.simple = false;
			if (params.themes !== undefined && params.themes.length > 0 && params.subs === undefined)
				for (let i = 0; i < params.themes.length; i++)
					if (params.themes[i].backgrounds === undefined && params.themes[i].foregrounds === undefined) {
						params.themes[i].backgrounds = [ '#ffffff' ];
						params.themes[i].foregrounds = [ '#000000' ];
						data.simple = true;
					}

			let tm = new themematch(params);

			data.tm = tm;

			if (params.selected !== undefined)
				this.themeselect('select', params.selected);

			this.themeselect('redraw');

			this.change(() => {
				this.themeselect('select', this.val());
			});

			return this;

		},

		add_theme: function (data, theme) {

			data.tm.add_theme(theme);
			this.themeselect('redraw');

			return this;

		},


		add_sub: function (data, params) {

			if (this.simple)
				throw new Error('no subs permitted in simple mode');

			data.tm.add_sub(params);
			this.themeselect('redraw');

			return this;

		},

		get_themes: function (data, name) {

			return data.tm.get_themes(name);

		},

		select: function (data, name, opts) {

			if (name === undefined)
				throw new Error('select requires a theme name');

			if (name === data.root_theme)
				return this;

			if (opts === undefined)
				opts = {};

			let new_theme_set  = data.tm.select(name);

			if (data.theme_set !== undefined) {
				let current_theme_set = data.theme_set;
				for (let i = 0; i < current_theme_set.length; i++)
					if (!opts.no_update)
						unload_css(this, current_theme_set[i]);
			}

			for (let i = 0; i < new_theme_set.length; i++)
				if (!opts.no_update)
					load_css(this, new_theme_set[i]);

			if (!opts.no_update)
				this.trigger('theme_selection', [name, new_theme_set, data.root_theme, data.theme_set]);

			data.root_theme = name;
			data.theme_set  = new_theme_set;

			return this;

		},

		redraw: function (data) {

			let themes = data.tm.get_themes();
			let subs = data.tm.get_subs();

			this.empty();
			for (let i = 0; i < themes.length; i++) {
				let theme = themes[i];
				let option = $('<option value="'+theme.name+'">'+theme.name+'</option>');
				if (theme.name === data.root_theme)
					option.prop({selected:true});
				this.append(option);
			}

		},

	};


	function unload_css (jqp_obj, theme) {

		if (theme.css === undefined)
			return;

		let css = typeof theme.css === 'string'
			? [ theme.css ]
			: theme.css;

		for (let i = 0; i < css.length; i++)
			$('link[href="'+css[i]+'"').remove();

		jqp_obj.trigger('load_theme', [theme]);

	}


	function load_css (jqp_obj, theme) {

		if (theme.css === undefined)
			return;

		let css = typeof theme.css === 'string'
			? [ theme.css ]
			: theme.css;

		for (let i = 0; i < css.length; i++)
			$('head').append($('<link href="'+css[i]+'" rel="stylesheet">'));

		jqp_obj.trigger('unload_theme', [theme]);

	}


} (jQuery, themematch));
