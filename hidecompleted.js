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
    * A handler that be fired immediately (only once) after the plugin is loaded into bblog
    *
    * @param object instance The instance of your plugin which is the whole plugin object
    *    Always use "instance" to access any plugin related function, not use "this" because it's not working properly
    *    For example: If you add a new function to your addon, always pass the "instance" object
    */
    init : function(instance){
        this.hideCompleted();

    },


    hideCompleted : function() {
        // ukrycie strzałek zależności między zadaniami
        $('.progress-arrow-vertical').hide();
        $('.progress-arrow.completed').hide();
        // ukrycie ukończonych zadań
        $('div.assignment_completed').closest('td').hide();
        // ukrycie dlc bez zadań do zrobienia
        $('.assignments-group table:hidden').closest('.assignments-group').hide();
    }

});
