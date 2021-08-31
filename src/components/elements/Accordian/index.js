import React, {useState} from 'react';
import "./accordian.css"
export default (props) => {

    const {title} = props;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="card-header bg-white border-top" id="headingOne">
            <div className="accordion-title mb-0" onClick={() => setIsOpen(!isOpen)}>
                <span className="btn btn-white btn-block text-left p-0">{title}</span> <span class={`mdi ${isOpen ? 'mdi-minus' : 'mdi-plus'}`}></span>
            </div>
            <div className="accordion-content" aria-expanded={!isOpen}>
                <div class="card-body">
                    {props.children}
                </div>    
            </div>
        </div>
    );

};