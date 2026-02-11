import axios from "axios";

let abort_ajax = new AbortController();

export const ManageSettingData = async (setting_data, switcher_type, value) => {

    let newSettingData = { ...setting_data };

    if (value) {
        newSettingData[switcher_type] = value;
    } else {
        delete newSettingData[switcher_type];
    }

    if (abort_ajax) {
        abort_ajax.abort()
    }
    abort_ajax = new AbortController();

    let form = new FormData();
    form.append('action', 'cwk_dashboard_ajax_call');
    form.append('nonce', cwk_data.cwk_nonce);
    form.append('type', 'cwk_manage_setting');
    form.append('nonce', cwk_data.cwk_nonce);
    form.append('setting_data', JSON.stringify(newSettingData));

    let result = await axios.post(cwk_data.ajax_url, form, { signal: abort_ajax.signal })

    return result;
}