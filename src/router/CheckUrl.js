import axios from 'axios';
import { useEffect } from 'react';
import { handlePluginInfo, setPluginDetails } from '../redux/slice.jsx';
import { useDispatch } from 'react-redux';

const CheckUrl = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getMetaData();
  }, []);

  const getMetaData = async () => {

    let form = new FormData();
    form.append('action', 'cwk_dashboard_ajax_call');
    form.append('type', 'get_addons_widgets_list');
    form.append('nonce', cwk_data.cwk_nonce);

    var response = await axios.post(cwk_data.ajax_url, form);
    if (response.data.success) {
      dispatch(handlePluginInfo(response.data.data.addons));
      dispatch(setPluginDetails(response.data.data.plugin_list));
    }
  }
};

export default CheckUrl;
