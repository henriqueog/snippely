// Aliases

var console = AIR.Introspector.Console;

// Configuration

Application.autoExit = true;

// Snippely Object

var Snippely = {
	
	initialize: function(){
		
		this.meta = $('meta');
		this.tags = $('tags');
		this.footer = $('footer');
		this.snippet = $('snippet');
		this.snippets = $('snippets');
		this.topResizer = $('top-resizer');
		this.leftResizer = $('left-resizer');
		
		this.initializeMenus();
		this.initializeMetas();
		this.initializeLayout();
		
		this.database = new Snippely.Database({
			onOpen: function(database){
				this.Tags.initialize();
				this.Snips.initialize();
				this.Snippet.initialize();
				this.Snippets.initialize();
			}.bind(this)
		});
		
		this.activate();
	},
	
	initializeMenus: function(){
		
		this.Menus = {};
		
		//main menus
		var mainMenu = new ART.Menu('MainMenu');
		var fileMenu = new ART.Menu('File');
		var saveItem = new ART.Menu.Item('Save');
		var loadItem = new ART.Menu.Item('Load');
		saveItem.shortcut = 'command+s';
		loadItem.shortcut = 'command+l';
		fileMenu.addItems([saveItem, loadItem]);
		mainMenu.addMenu(fileMenu);
		
		//add menu
		var addMenu = new ART.Menu('AddMenu').addItems(
			new ART.Menu.Item('Add Tag...', {onSelect: this.Tags.add.bind(this.Tags)}),
			new ART.Menu.Item('Add Snippet...', {onSelect: this.Snippets.add.bind(this.Snippets)})
		);
		
		//action menu
		var actionMenu = new ART.Menu('ActionMenu').addItems(
			new ART.Menu.Item('Remove Tag...', {onSelect: this.Tags.remove.bind(this.Tags)}),
			new ART.Menu.Item('Rename Tag...', {onSelect: this.Tags.rename.bind(this.Tags)}),
			new ART.Menu.Item('Remove Snippet...', {onSelect: this.Snippets.remove.bind(this.Snippets)}),
			new ART.Menu.Item('Rename Snippet...', {onSelect: this.Snippets.rename.bind(this.Snippets)})
		);
		
		//brush menu
		this.Menus.brushMenu = new ART.Menu('BrushMenu');
		
		this.Menus.brushMenuItems = [];
		
		for (var name in Brushes) (function(name){
			
			var item = new ART.Menu.Item(name, {onSelect: function(){
				Snippely.Snips.changeType(name);
			}});
			Snippely.Menus.brushMenu.addItem(item);
			
			Snippely.Menus.brushMenuItems.push(item);
			
		})(name);
		
		$('button-add').addEvent('mousedown', function(event){
			this.addClass('active');
			addMenu.display(event.client);
			this.removeClass('active');
			event.stop();
		});
		
		$('button-action').addEvent('mousedown', function(event){
			this.addClass('active');
			actionMenu.display(event.client);
			this.removeClass('active');
			event.stop();
		});
	},
	
	initializeLayout: function(){
		var redraw = this.redraw.bind(this);
		
		new Drag(this.tags, {
			modifiers: {y: null, x: 'width'},
			handle: this.leftResizer,
			limit: {x: [150, 300]},
			onDrag: redraw
		});

		new Drag(this.snippets, {
			modifiers: {y: 'height', x: null},
			handle: this.topResizer,
			limit: {y: [0, function(){
				return window.getHeight() - this.topResizer.getHeight();
				}.bind(this)
			]},
			onDrag: redraw
		});
		
		nativeWindow.addEventListener('resize', redraw);
		nativeWindow.addEventListener('activate', redraw);
		nativeWindow.addEventListener('deactivate', redraw);
		nativeWindow.addEventListener('activate', this.focus);
		nativeWindow.addEventListener('deactivate', this.blur);

		this.tagsScrollbar = new ART.ScrollBar('tags', 'tags-wrap');
		this.snippetScrollbar = new ART.ScrollBar('snippet', 'snippet-wrap');
		this.snippetsScrollbar = new ART.ScrollBar('snippets', 'snippets-wrap');
		
		this.redraw();
	},
	
	initializeMetas: function(){
		var metaButtons = $$('#meta .button');
		metaButtons.addEvent('mousedown', function(){
			this.addClass('active');
		});
		document.addEvent('mouseup', function(){
			metaButtons.removeClass('active');
		});
		
		$('add-code').addEvent('click', this.Snips.add.bind(this.Snips, 'Plain Text'));
		$('add-note').addEvent('click', this.Snips.add.bind(this.Snips, 'Note'));
	},
	
	redraw: function(){
		var left = this.tags.offsetWidth;
		$$(this.snippets, this.topResizer, this.meta, this.snippet).setStyle('left', left);
		
		this.footer.setStyle('width', this.tags.clientWidth);
		this.topResizer.setStyle('top', this.snippets.offsetHeight);
		this.meta.setStyle('top', this.snippets.offsetHeight + this.topResizer.offsetHeight);
		this.snippet.setStyle('top', this.snippets.offsetHeight + this.topResizer.offsetHeight + this.meta.offsetHeight);
		
		this.tagsScrollbar.update();
		this.snippetScrollbar.update();
		this.snippetsScrollbar.update();
	},
	
	activate: function(){
		(function(){
			nativeWindow.visible = true;
			nativeWindow.activate();
		}).delay(100);
	},

	focus: function(){
		document.body.id = 'focus';
	},
	
	blur: function(){
		document.body.id = 'blur';
	} 
	
};

window.addEvent('load', Snippely.initialize.bind(Snippely));