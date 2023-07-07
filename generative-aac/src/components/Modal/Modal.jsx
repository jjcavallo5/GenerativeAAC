import React from "react";
import styles from './Modal.module.css'

const Modal = (props) => {
    return (
        <div>
            {props.active &&
                <div className={styles.container} onClick={() => props.deactivate()}>
                    <div onClick={(e) => e.stopPropagation()}>
                        {props.children}
                    </div>
                </div>
            }
        </div>
    );
};

export default Modal