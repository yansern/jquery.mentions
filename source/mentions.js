// Constants
var KEYCODE = {
    BACKSPACE: 8, 
    TAB: 9, 
    ENTER: 13, 
    ESC: 27, 
    LEFT: 37, 
    UP: 38, 
    RIGHT: 39, 
    DOWN: 40, 
    SPACE: 32, 
    HOME: 36, 
    END: 35
};

// Templates
$.template("mentions/item", '<b>[%= value %]</b>');

$.Controller("Mentions",
{
    pluginName: "mentions",
    hostname: "mentions",

    defaultOptions: {

        view: {
            item: "mentions/item"
        },

        cssCloneProps: [
            'lineHeight', 'textDecoration', 'letterSpacing',
            'fontSize', 'fontFamily', 'fontStyle', 
            'fontWeight', 'textTransform', 'textAlign', 
            'direction', 'wordSpacing', 'fontSizeAdjust',
        ],

        "{textarea}": "[data-mentions-textarea]",
        "{overlay}" : "[data-mentions-overlay]"
    }
},
function(self){ return {

    init: function() {

        self.cloneLayout();
    },

    setLayout: function() {

    },

    cloneLayout: function() {

        var textarea = self.textarea(),
            overlay  = self.overlay();

        $.each(self.options.cssCloneProps, function() {
            overlay.css(this, textarea.css(this));
        });
    },

    buffer: [],

    resetBuffer: function() {

        self.buffer = [];
    },

    "{textarea} keydown": function(textField, event) {

        switch (event.keyCode) {

            // This also matches HOME/END on OSX which is CMD+LEFT, CMD+RIGHT
            case KEYCODE.LEFT:
            case KEYCODE.RIGHT:
            case KEYCODE.HOME:
            case KEYCODE.END:
            case KEYCODE.ENTER:

                // Defer execution to ensure carat pos has changed after HOME/END keys
                $.defer(self.resetBuffer);
                break;

            case KEYCODE.BACKSPACE:
                self.buffer = self.buffer.slice(0, -1 + self.buffer.length);
                break;
            
                $.defer(self.resetBuffer);
                break;

            case KEYCODE.SPACE

                if (!self.hidden) return;
                $.defer(self.resetBuffer);
                break;
        }
    },

    "{textarea} keypress": function(textField, event) {

        var _char = String.fromCharCode(event.which || event.keyCode);        
        self.buffer.push(_char);
    }

}});

