import './not-found.scss';
import { __ } from '@wordpress/i18n';

const NotFound = ({ text, description }) => {


  return (
    <div className='cwk-not-found'>
      <img className='cwk-not-found-img' src={cwk_data.CWK_PD_URL + 'assets/images/not-found.gif'} alt={__('not found', 'captain-widgets-kit')} />
      <span className='cwk-not-found-text'>{text}</span>
      <span className='cwk-not-found-description'>{description}</span>
    </div>
  )
}

export default NotFound;
