import { useEffect } from 'react';
import { handlePluginInfo, setPluginDetails } from '../redux/slice.jsx';
import { useDispatch } from 'react-redux';
import { getMetaData } from '../services/get_meta_data.js';

const CheckUrl = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    setMetaData();
  }, []);

  const setMetaData = async () => {

    let response = await getMetaData();

    if (response.data.success) {
      dispatch(handlePluginInfo(response.data.data.addons));
      dispatch(setPluginDetails(response.data.data.plugin_list));
    }
  }
};

export default CheckUrl;
