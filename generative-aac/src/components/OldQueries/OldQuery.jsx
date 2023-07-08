import React, { useState } from "react";
import styles from "./OldQuery.module.css";
import IconTrash from "../../icons/trash";

const OldQuery = (props) => {
    const [confirm, setConfirm] = useState(false);

    let containerClassName = styles.queryContainer;
    if (props.isSelected)
        containerClassName = styles.queryContainer + " " + styles.queryContainerSelected;

    return (
        <div className={containerClassName} onClick={() => props.onSelect(props.query)}>
            <div className={styles.queryTextContainer}>
                <span className={styles.previousQueries}>{props.query.prompt}</span>
            </div>
            <IconTrash className={styles.trashIcon} onClick={() => setConfirm(true)} />
            {confirm && (
                <div className={styles.confirmDelete}>
                    <p>Delete?</p>
                    <span
                        className={styles.confirmed}
                        onClick={(e) => props.onDeleteSelected(e, props.query)}
                    >
                        Delete
                    </span>
                    <span onClick={() => setConfirm(false)}>Cancel</span>
                </div>
            )}
        </div>
    );
};

export default OldQuery;
