import './not-found.scss';
import { __ } from '@wordpress/i18n';

const NotFound = ({ text, description }) => {


  return (
    <div className='captwiki-not-found'>
      <img className='captwiki-not-found-img' src={captwiki_data.captwiki_url + 'assets/images/not-found.gif'} alt={__('not found', 'captain-widgets-kit')} />
      <span className='captwiki-not-found-text'>{text}</span>
      <span className='captwiki-not-found-description'>{description}</span>
    </div>
  )
}

export default NotFound;
