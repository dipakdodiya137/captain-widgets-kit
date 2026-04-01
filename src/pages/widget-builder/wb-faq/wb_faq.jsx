import { __ } from '@wordpress/i18n';
import React from 'react'
import './wb_faq.scss';
import Accordion from '../../../global/accordion/accordion.jsx';

const Wb_faq = () => {

    const faq_data = [
        {
          question: "What does this plugin do?",
          answer: "This plugin allows users to extend and customize existing Elementor widgets by creating patches. You can enhance widget functionality without modifying the original plugin."
        },
        {
          question: "How does the patch system work?",
          answer: "When creating a patch, the plugin first asks you to select an Elementor-related plugin. After selecting the plugin, you can choose a specific widget, and then extend it with additional controls."
        },
        {
          question: "What kind of controls can I add to widgets?",
          answer: "You can add various controls such as: Background color, Text color, Box shadow, Spacing and layout options, and other custom design controls."
        },
        {
          question: "Do I need coding knowledge to use this plugin?",
          answer: "Basic understanding of WordPress and Elementor is helpful, but no deep coding knowledge is required for using standard features."
        },
        {
          question: "Will this plugin modify the original Elementor widgets?",
          answer: "No, it does not modify original widget files. It safely extends them using a patch system."
        },
        {
          question: "Is this plugin compatible with all Elementor widgets?",
          answer: "It works with most Elementor-based widgets, especially those from supported plugins. Compatibility may vary depending on how the widget is built."
        },
        {
          question: "Can I remove or edit a patch later?",
          answer: "Yes, you can manage, update, or remove patches anytime from the plugin interface."
        },
        {
          question: "Will my changes be lost after plugin updates?",
          answer: "No, since changes are applied via patches, your customizations remain safe even after updates."
        },
        {
          question: "Does it affect website performance?",
          answer: "The plugin is designed to be lightweight. However, adding too many controls or heavy styling may slightly impact performance."
        },
        {
          question: "Who should use this plugin?",
          answer: "Elementor users, WordPress developers, and designers who want more control over widgets."
        },
        {
          question: "Can I add custom CSS or advanced styling?",
          answer: "Yes, you can enhance widgets with additional styling options, including advanced design controls."
        },
        {
          question: "Is it safe to use on live websites?",
          answer: "Yes, but it's always recommended to test changes on a staging site before applying them to a live website."
        }
      ];

    return (
        <div className='captwiki-wb-faq'>
            <div className='captwiki-wb-faq-header'>
                <span className='captwiki-wb-faq-header-title'>{__('FAQ (Frequently Asked Questions)', 'captain-widgets-kit')}</span>
            </div>
            <div className='captwiki-wb-faq-content'>
                {faq_data.map((faq, index) => {
                    return (
                        <Accordion
                            key={index}
                            header={<span className='captwiki-wb-faq-title'>{faq.question}</span>}
                            content={<div className='captwiki-wb-faq-answer'>{faq.answer}</div>}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default Wb_faq;