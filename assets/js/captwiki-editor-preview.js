(function($){
    $(window).on('elementor:init', function() {
        elementor.hooks.addAction('panel/open_editor/widget', function(panel, model, view){
            console.log("🟣", model.attributes.widgetType );

            const controls = model.attributes.settings.controls;
            const sectionControls = Object.keys(controls).filter(controlName => controls[controlName].type === 'section').map(controlName => ({ name: controlName, ...controls[controlName] }));
            // console.log("🟢 All Section Controls (All Tabs):", sectionControls);
        });
    });
})(jQuery);