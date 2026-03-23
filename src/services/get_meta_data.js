import axios from "axios";

export const getMetaData = async () => {

    let form = new FormData();
    form.append('action', 'captwiki_dashboard_ajax_call');
    form.append('type', 'get_addons_widgets_list');
    form.append('nonce', captwiki_data.captwiki_nonce);

    var response = await axios.post(captwiki_data.ajax_url, form);
  
    return response;

};
