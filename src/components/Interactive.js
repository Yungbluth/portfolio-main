import React, { useState } from "react";
import Sorting from "./DisplayProjects/Sorting"
import Chess from "./DisplayProjects/Chess"
import { FaGithub } from "react-icons/fa";

const Interactive = () => {

    let curArray = null;
    let setCurArray = null;

    let curBoard = null;
    let setCurBoard = null;

    const onChildMountSort = (dataFromChild) => {
        curArray = dataFromChild[0];
        setCurArray = dataFromChild[1];
      };

      const onChildMountChess = (dataFromChild) => {
        curBoard = dataFromChild[0];
        setCurBoard = dataFromChild[1];
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
        {label: "Chess" },
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
            return(<Sorting onMountSort={onChildMountSort}/>);
        }
        if (activeTab === 1) {
            return (<Chess onMountChess={onChildMountChess}/>)
        }
        if (activeTab === 2) {
            return (<div>Tab 3</div>)
        }
    }
    function portfolioGithubPage() {
        window.open("https://github.com/Yungbluth/portfolio-main/tree/main/src/components/DisplayProjects", "_blank")
    }
    
    function InteractivePrograms() {
        return (
          <div>
            <button className="interactiveButton" id="interactiveButton" onClick={toggleOpacity}>
              Try out some programs I made
            </button>
            <button onClick={portfolioGithubPage} id="interactiveGithubButton"><FaGithub className="icon-hover" id="interactiveGithub" style={{left: `${document.documentElement.clientWidth * 0.4 + 10}px`}}/></button>
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