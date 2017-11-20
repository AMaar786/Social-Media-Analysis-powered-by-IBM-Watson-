var _super = $.fn.modal;

// add custom defaults
$.extend( _super.defaults, {
    foo: 'bar',
    john: 'doe'
});

// create a new constructor
var Modal = function(element, options) {

    // contructor write here
        
     // call the original constructor
    _super.Constructor.apply( this, arguments );

};

// extend prototypes and add a super function
Modal.prototype = $.extend({}, _super.Constructor.prototype, {
    constructor: Modal,
    _super: function() {
        var args = $.makeArray(arguments);
        _super.Constructor.prototype[args.shift()].apply(this, args);
    },
    show: function(data) {
        //custom help changer
        var element = this.$element;
        var options = this.options;
        helpEvents(element, options);

        // call the original method
        this._super('show');
    }
});

var helpEvents = function(element, options){

    if(!(options['help'] == undefined) && options['help'] == true){
        $(document).on('focus','.modal.in input, .modal.in textarea, .modal.in select',function(){
            $(element).find('.help-text').html('');
            if($(this).data('help-text') != ''){
                $(element).find('.help-text').html($(this).data('help-text'));
            }
        })
        .on('focusout','.modal.in input, .modal.in textarea, .modal.in select',function(){
            $(element).find('.help-text').html('');
        });

        setTimeout(function() { $($(element).find('input[type=text]')[0]).focus(); }, 100);

        $(document).on('mouseover click',' .modal.in .visualLabel, .modal.in input:checkbox, .modal.in input:file, .modal.in label.radio',function(){
            $(element).find('.help-text').html('');
            if($(this).data('help-text') != ''){
                $(element).find('.help-text').html($(this).data('help-text'));
            }
        })
        .on('focusout mouseout','.modal.in .visualLabel, .modal.in input:checkbox, .modal.in input:file,.modal.in label.radio ',function(){
            $(element).find('.help-text').html('');
        });
    }
    return true;
};

// override the old initialization with the new constructor
$.fn.modal = $.extend(function(option) {

    var args = $.makeArray(arguments),
        option = args.shift();

    return this.each(function() {

        var $this = $(this);
        var data = $this.data('modal'),
            options = $.extend({}, _super.defaults, $this.data(), typeof option == 'object' && option);

        if ( !data ) {
            $this.data('modal', (data = new Modal(this, options)));
        }
        if (typeof option == 'string') {
            data[option].apply( data, args );
            
        } else if ( options.show ) {
            data.show.apply( data, args );
            
        } else if(option.hide) {
        	data.hide();
        	$this.removeData('modal');
        }
    });

}, $.fn.modal);