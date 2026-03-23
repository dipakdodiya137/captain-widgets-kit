import React, { useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { handleWidgetInfo } from '../../../../redux/slice.jsx';
import Checkbox from '../../../../components/input/checkbox/checkbox.jsx';
import Primary_button from '../../../../components/button/primary_button/primary_button.jsx';
import { __ } from '@wordpress/i18n';
import './edit-extension.scss'
import ElementorFile from '../../create-file/elementor-file.js';
import Textarea from '../../../../components/input/textarea/textarea.jsx';

const Edit_extension = (props) => {

  const plugin_details = useSelector((state) => state?.plugin_details);
  const widget_info = useSelector((state) => state?.widget_info);
  const section_data = useSelector((state) => state?.controller_section);
  const widget_code = useSelector((state) => state?.widget_code);
  const dispatch = useDispatch();

  const [selected_plugins, setSelectedPlugins] = useState(widget_info?.required_plugins || []);
  const [isLoading, setIsLoading] = useState(false);
  const description_ref = useRef(null);


  const handleSelectPlugin = (plugin) => {

    let new_selected_plugins = [...selected_plugins];

    if (selected_plugins.includes(plugin)) {
      new_selected_plugins = new_selected_plugins.filter((item) => item?.plugin_name !== plugin?.plugin_name);
    } else {
      new_selected_plugins.push(plugin);
    }

    setSelectedPlugins(new_selected_plugins);
  }

  const handleSaveChanges = async () => {

    let redux_widget_info = { ...widget_info, required_plugins: selected_plugins, description: description_ref?.current?.value?.trim() };

    setIsLoading(true);
    dispatch(handleWidgetInfo(redux_widget_info));
    await ElementorFile(section_data, redux_widget_info, widget_code);

    setIsLoading(false);
    props.close_popup();
  }

  return (
    <div className='captwiki-edit-extension'>
      <div className='captwiki-edit-extension-wrapper'>
        <label htmlFor='captwiki-edit-description' className='captwiki-edit-extension-title captwiki-edit-extension-label'>{__('Description', 'captain-widgets-kit')}</label>
        <Textarea
          id='captwiki-edit-description'
          ref={description_ref}
          defaultValue={widget_info?.description || ''}
          placeholder={__('Enter description for extension', 'captain-widgets-kit')}
          rows={3}
          uncontrolled={true}
        />
      </div>
      <div className='captwiki-edit-extension-wrapper'>
        <span className='captwiki-edit-extension-title'>{__('Select Required Plugins for Extension', 'captain-widgets-kit')}</span>
        <div className='captwiki-edit-extension-plugins-list'>
          {plugin_details?.map((plugin, index) => {

            let selected_verify = plugin?.plugin_slug == widget_info?.selected_plugin?.plugin_slug || 'elementor/elementor.php' == plugin?.plugin_slug;
            let labelClassName = 'captwiki-edit-extension-label'

            if (selected_verify) {
              labelClassName = 'captwiki-edit-extension-label captwiki-edit-extension-label-disabled'
            }

            const checked_verify = () => {

              const select_check = selected_plugins?.findIndex((item) => item?.plugin_name == plugin?.plugin_name);

              if (select_check > -1 || selected_verify) {
                return true;
              }

              return false;
            }

            return (
              <label className={labelClassName} key={index}>
                <Checkbox
                  value={plugin?.plugin_slug}
                  checked={checked_verify()}
                  disabled={selected_verify}
                  onChange={(e) => handleSelectPlugin(plugin)} />
                <span className='captwiki-edit-extension-text'>{plugin?.plugin_name}</span>
              </label>
            )
          })}
        </div>
      </div>
      <div className='captwiki-edit-extension-footer'>
        <Primary_button text={__('Save Changes', 'captain-widgets-kit')} onClick={() => handleSaveChanges()} loader={isLoading} />
      </div>
    </div>
  )
}

export default Edit_extension
