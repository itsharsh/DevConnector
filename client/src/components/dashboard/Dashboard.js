import React, { useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Spinner from "../layout/Spinner";
import { getCurrentProfile } from "../../actions/profile";

const Dashboard = ({
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, []);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome {user && user.name}
      </p>{" "}
      {profile !== null ? (
        <Fragment>
          <div className="dash-buttons">
            <Link to="/profile" className="btn btn-light">
              <i className="fas fa-user-circle text-primary"></i> Edit Profile
            </Link>
            <Link to="/add-exp" className="btn btn-light">
              <i className="fab fa-black-tie text-primary"></i> Add Experience
            </Link>
            <Link to="/add-edu" className="btn btn-light">
              <i className="fas fa-graduation-cap text-primary"></i> Add
              Education
            </Link>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>No Profile found. Please create one.</p>
          <Link to="/profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
