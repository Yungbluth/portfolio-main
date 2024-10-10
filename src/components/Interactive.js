import React, { useState} from "react";
import Sorting from "./DisplayProjects/Sorting"

const Interactive = () => {

    let curArray = null;
    let setCurArray = null;

    const onChildMount = (dataFromChild) => {
        curArray = dataFromChild[0];
        setCurArray = dataFromChild[1];
      };

    
    const Tab = ({ label, onClick, isActive }) => (
        <div
            className={`tab ${isActive ? "active" : ""}`}
            onClick={onClick}
            id={label}
        >
            {label}
        </div>
    );

    const Tabs = ({ tabs }) => {
        const [activeTab, setActiveTab] = useState(0);
        const handleTabClick = (index) => {
            setActiveTab(index);
        };

        return (
            <div>
            <div className="tabs">
                {tabs.map((tab, index) => (
                    <Tab
                        key={index}
                        label={tab.label}
                        onClick={() =>
                            {
                                handleTabClick(index)
                            }
                        }
                        isActive={index === activeTab}
                        disabled={false}
                    />
                ))}
            </div>
            <div className="tab-content">
                {getTabData(activeTab)}
            </div>
            </div>
        );
    };

    const tabData = [
        {label: "Sorting" },
        {label: "Tab 2" },
        {label: "Tab 3" },
    ];

    function toggleOpacity() {
        let curDiv = document.getElementsByClassName("programsBox")[0];
        curDiv.style.opacity = Math.abs(curDiv.style.opacity - 1);
        if (curDiv.style.height !== '0px' && curDiv.style.height !== '') {
            curDiv.style.height = '0px';
            curDiv.style.width = '0px';
        } else {
            curDiv.style.height = '80vh';
            curDiv.style.width = '80vw';
        }
        return({curDiv});
    }

    function getTabData(activeTab) {
        if (activeTab === 0) {
            return(<Sorting onMount={onChildMount}/>);
        }
        if (activeTab === 1) {
            return (<div>Tab 2</div>)
        }
        if (activeTab === 2) {
            return (<div>Tab 3</div>)
        }
    }
    
    function InteractivePrograms() {
        return (
          <div>
            <button className="button-85" onClick={toggleOpacity}>
              Try out some programs I made!
            </button>
            <div className="programsBox">
                <Tabs tabs={tabData} />
            </div>
          </div>
        );
    }
    return (
        <div>{InteractivePrograms()}</div>
    );
};

export default Interactive;