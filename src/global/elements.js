import axios from "axios";

export const getArray = (length) => Array.from({ length });

/** get unique string of 8 character */
export const UniqueID = () => {
    let year = new Date().getFullYear().toString().slice(-2),
        uid = Math.random().toString(36).substr(2, 6);
    return uid + year;
}

export const copyToClipboard = (content) => {

    if (navigator?.clipboard) {
        navigator?.clipboard?.writeText(content);
    } else {
        document.execCommand("copy", false, (document.body.appendChild(Object.assign(document.createElement("textarea"), { value: content }))).select());
    }
}

export const getControllerVariable = (type) => {

    if (!type) {
        return '';
    }

    let variable_name = type.toLocaleLowerCase().replace(/ /g, '_') + '_' + UniqueID();
    return variable_name;
}

export const getInitialReduxState = (type) => {
    let state = ''

    if ('widget_info' === type) {
        state = {
            name: '',
            description: '',
            publish_type: "Publish",
            key_words: "",
            version: "",
            id: '',
            cwk_version: "",
            selected_plugin: {
                "original_slug": "elementor",
                "plugin_name": "Elementor",
                "plugin_slug": "elementor/elementor.php"
            },
            required_plugins: [
                {
                    "plugin_name": "Elementor",
                    "original_slug": "elementor",
                    "plugin_slug": "elementor/elementor.php"
                }
            ],
            selected_widget: {},
            effect_type: "widget",
        }
    } else if ('section_data' === type) {
        state = {
            content: [],
            style: [],
            advanced: [],
            active_section: 0,
            active_tab: 'content',
            active_controller: null,
            controller_collapsed: false,
            section_collapsed: false,
            editor_collapsed: false,
        }
    } else if ('widget_code' === type) {
        state = {
            php: '$settings = $element->get_settings_for_display();',
            js: '',
            css: '',
            selected_lang: 'php'
        }
    }

    return state;
}

export const install_activate_plugin = async ({ path, slug }) => {

    if (path || slug) {
        let form = new FormData()
        form.append('action', 'cwk_dashboard_ajax_call');
        form.append('nonce', cwk_data.cwk_nonce);
        form.append('type', 'plugin_installation');
        if (path) {
            form.append('path', path);
        }

        if (slug) {
            form.append('slug', slug);
        }


        let result = await axios.post(cwk_data.ajax_url, form).then(res => res);
        return result;
    } else {
        return false;
    }

}


export const check_active_plugins = async (plugin_details) => {
    if (plugin_details) {

        let form = new FormData();
        form.append('action', 'cwk_dashboard_ajax_call');
        form.append('nonce', cwk_data.cwk_nonce);
        form.append('type', 'check_plugins_status');
        form.append('plugins', JSON.stringify(plugin_details));

        let result = await axios.post(cwk_data.ajax_url, form).then(res => res.data);
        return result;
    } else {
        return false;
    }

};