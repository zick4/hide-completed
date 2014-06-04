/**
* Example Plugin - Show how you can use the plugin engine
* NOTE: Do NOT set global values outside of the plugin object
*    Maybe they will conflict with other addons or any in-page related variables
*    Only use the plugin cache/storage to set/get variables
*
* @author BrainFooLong
* @version 1.0
* @url http://getbblog.com
*/
String.prototype.format = function() {
    var formatted = this;
    for( var arg in arguments ) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
};
// initialize your plugin
BBLog.handle("add.plugin", {

    /**
    * The unique, lowercase id of my plugin
    * Allowed chars: 0-9, a-z, -
    */
    id : "hide-completed-assigments",

    /**
    * The name of my plugin, used to show config values in bblog options
    * Could also be translated with the translation key "plugin.name" (optional)
    *
    * @type String
    */
    name : "Hide Completed Assigments",

    /**
     * Game Adapter
     *
     * null|object
     */
    adapterH : null,

    /**
     * Plugin is loaded
     */
    needToLoad : false,

    /**
    * A handler that be fired immediately (only once) after the plugin is loaded into bblog
    *
    * @param object instance The instance of your plugin which is the whole plugin object
    *    Always use "instance" to access any plugin related function, not use "this" because it's not working properly
    *    For example: If you add a new function to your addon, always pass the "instance" object
    */
    init : function(plugin){
        setInterval(function(){
            var isBf3 = Boolean(document.URL.match(/bf3\/.*assignments.*$/)),
                isBf4 = Boolean(document.URL.match(/bf4\/.*assignments.*/));

            // wczytanie odpowiedniego adaptera
            if (isBf3) {
                plugin.adapterH = new Bf3AdapterH(plugin);
            } else if (isBf4) {
                plugin.adapterH = new Bf4AdapterH(plugin);
            } else {
                return;
            }

            // tworzymy formularz
            plugin.adapterH.hideCompleted();
        }, 2000);
    }
});

/**
 * Battlefield 3 adapter
 *
 * @param {Object} plugin
 */
function Bf3AdapterH(plugin) {

    this.plugin = plugin;

    this.hideCompleted = function() {
        // ukrycie strzałek zależności między zadaniami
        $('.progress-arrow-vertical').hide();
        $('.progress-arrow.completed').hide();
        // ukrycie ukończonych zadań
        $('div.assignment_completed').closest('td').hide();
        // ukrycie dlc bez zadań do zrobienia
        $('.assignments-group table:hidden').closest('.assignments-group').hide();
    };
}
/**
 * Battlefield 4 adapter
 *
 * @param {Object} plugin
 */
function Bf4AdapterH(plugin) {

    this.plugin = plugin;
    
    $('.stat-list-col > li').css('margin', 0);
    $('.stat-list-col > li').css('border', '1px solid #4E5A6A');

    this.hideCompleted = function() {
        if ($('.filters-container').length === 0) {
            this.buldForm();
        }
        this.filter();
    };

    this.buldForm = function() {
        var adapter = this,
            plugin = this.plugin,
            text,
            classAttribute,
            form = '\
        <div id="hidden-assigments-status" style="display: none;">{0}</div>\n\
        <div class="filters-container">\n\
            <div class="row-tight spacing-top-tight">\n\
                <div class="filter-col span1-04 box box-content">\n\
                <section class="filter split">\n\
                <ul>\n\
                    <li class="{1}">\n\
                        <input type="checkbox" id="xxx" name="xxx"><label class="" for="xxx">\n\
                            {2}\n\
                        </label>\n\
                    </li>\n\
                </ul>\n\
                </section>\n\
                </div>\n\
            </div>\n\
        </div>',
            status = plugin.storage('hidden-assigments-status');

        if (status == 2) {
            classAttribute = 'off';
            text = 'Zadania ukończone są ukryte';
            classAttribute = 'off';
        } else if (status == 3) {
            classAttribute = 'off';
            text = 'Zadania zablokowane i ukończone są ukryte';
            classAttribute = 'off';
        } else {
            status = 1;
            text = 'Wszystkie zadania są widoczne',
            classAttribute='on';
            plugin.storage('hidden-assigments-status', 1);
        }
        
        $('.submenu.margin-top').after(form.format(status, classAttribute, text));
        $('.filters-container li').click(function(){
            if ($("#hidden-assigments-status").text() == 1) {
                $(this).removeClass('on');
                $(this).addClass('off');
                $(this).text('Zadania ukończone są ukryte');
                $("#hidden-assigments-status").text(2);
            } else if ($("#hidden-assigments-status").text() == 2) {
                $(this).removeClass('on');
                $(this).addClass('off');
                $(this).text('Zadania zablokowane i ukończone są ukryte');
                $("#hidden-assigments-status").text(3);
            } else {
                $(this).removeClass('off');
                $(this).addClass('on');
                $(this).text('Wszystkie zadania są widoczne');
                $("#hidden-assigments-status").text(1);
            }
            
            plugin.storage('hidden-assigments-status', $("#hidden-assigments-status").text());
            adapter.filter();
        });
            

    };

    this.filter = function() {

        if ($("#hidden-assigments-status").text() == 1) {
            $('.assignments-list li').show();
        } else if ($("#hidden-assigments-status").text() == 2) {
            $('li.completed').hide();
        } else {
            $('li.completed').hide();
            $('li.locked').hide();
        }

        $('.stat-box').each(function() {
            if ($(this).find("li:visible").length === 0) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    };
}
 
 
