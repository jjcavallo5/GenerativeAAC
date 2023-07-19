import React, { useState } from "react";
import OldQuery from "../OldQueries/OldQuery";
import styles from './QueryList.module.css'
import IconClose from "../../icons/close";

const QueryList = (props) => {
    const [search, setSearch] = useState("")

    return (
        <div className={styles.oldQueryList}>
            <div className={styles.oldQueriesHeaderContainer}>
                <p className={styles.oldQueriesHeader}>Previous</p>
            </div>

            <div className={styles.searchContainer}>
                <input 
                    type="text" 
                    placeholder="Search" 
                    className={styles.searchBar} 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className={styles.clearSearchContainer}>
                    <IconClose className={styles.clearSearch} onClick={() => setSearch("")} />
                </div>            
            </div>

            <div className={styles.scrollable}>
                {props.previousQueries.filter(query => {
                    return query.prompt.includes(search)
                }).map((query, i) => {
                    return (
                        <OldQuery
                            query={query}
                            onSelect={props.handleOldQuerySelection}
                            onDeleteSelected={props.handleDeleteOldQuery}
                            isSelected={props.selectedQuery === query.url}
                            key={i}
                        />
                    );
                })}
            </div>
        </div>
    )
}

export default QueryList