import React, { useContext } from "react";
import "../../css/dashboard/sidebar.css";
import logoImg from "../../img/logo.png";
import sunIco from "../../img/sun-svgrepo-com.svg";
import moonIco from "../../img/moon-svgrepo-com.svg";
import semestersIco from "../../img/calendar-svgrepo-com.svg";
import coursesIco from "../../img/education-books-apple-svgrepo-com.svg";
import plusIco from "../../img/plus-svgrepo-com.svg";
import identicon from "../../img/identicon.png"; // TODO procedurally generate based on username??
import logoutIco from "../../img/sign-out-2-svgrepo-com.svg";
import privacyIco from "../../img/contract-line-svgrepo-com.svg";
import { useNavigate } from "react-router-dom";
import { contextTheme } from "../../pages/Dashboard";
import { apiLocation } from "../../App";
import useFetch from "../../hooks/useFetch";
import SidebarChoice from "./SidebarChoice";

function Sidebar(semesterList, courseList) {
  const apiURL = useContext(apiLocation);

  // Logout button
  const navigate = useNavigate();
  const handleLogout = () => {
    console.log("Logging out");
    console.log("TODO: clear session cookie/storage");
    navigate("/");
  };

  // Dark mode button
  const { theme, toggleTheme } = useContext(contextTheme);

  // List of semesters
  const semesterFetchMetrics = useFetch(`${apiURL}/get-semesters`);

  return (
    <div id="sidebar-container">
      <div className="card thin-scrollbar" id="sidebar-card">
        
        {/* Box containing the logo and a dark/light mode toggle button. */}
        <div id="sb-logo-container">
          <img src={logoImg} className="not-icon" style={{ height: "3rem" }} alt="Logo" />
          <div style={{ flexGrow: 1 }} />
          <img
            src={theme === "light" ? moonIco : sunIco}
            className="toggle-dark sb-selectable not-icon" alt="Dark mode icon"
            onClick={(e) => toggleTheme()}
            />
        </div>
        <div className="horizontal-line" />

        {/* Courses list */}
        {<SidebarChoice
          name='Semesters'
          icon={semestersIco}
          id='semesters-container'
          fetchMetrics={semesterFetchMetrics} />}
        
        <div className="horizontal-line" />

        {/* Courses list */}
        <div className="sb-choice" id="courses-container">
          {/* List header (img, name, +) */}
          <div className="sb-choice-header">
            <img className="sb-choice-header-ico" src={coursesIco} alt="Courses icon" />
            <div className="sb-choice-header-name">Courses</div>
            <img className="sb-choice-header-plus sb-selectable" src={plusIco} alt="Plus icon" />
          </div>
          <div className="sb-choice-list thin-scrollbar">
            <div className="sb-choice-list-element sb-selectable">COMP 111</div>
            <div className="sb-choice-list-element sb-selectable">COMP 222</div>
            <div className="sb-choice-list-element sb-selectable">COMP 333</div>
            <div className="sb-choice-list-element sb-selectable sb-selected">COMP 444</div>
            <div className="sb-choice-list-element sb-selectable">COMP 555</div>
            <div className="sb-choice-list-element sb-selectable">COMP 666</div>
            <div className="sb-choice-list-element sb-selectable">COMP 777</div>
          </div>
        </div>
        <div className="horizontal-line" />
        {/* GPA container */}
        <div className="sidebar-item" id="gpa-container">
          <span className="color-good">3.3</span>&nbsp;CGPA
        </div>
        {/* Padding */}
        <div style={{ flexGrow: 1 }} />
        {/* User */}
        <div className="sb-selectable" id="user-container">
          {/* We're not actually storing any user pfp this just is just a random gravatar. */}
          <img src={identicon} className="not-icon" alt="identicon" />
          <div>
            <div id="username">UserNameThatIsWayTooLongForItsOwnGood</div>
            <div>Account Settings</div>
          </div>
        </div>

        {/* Sign out */}
        <div className="sb-item sb-selectable" id="logout" onClick={handleLogout}>
          <img src={logoutIco} alt="logout" />
          <div>Sign out</div>
        </div>
        {/* Privacy */}
        {/* Sign out */}
        <div className="sb-item sb-selectable" id="privacy">
          <img src={privacyIco} alt="privacy" />
          <div>Privacy and Terms</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
