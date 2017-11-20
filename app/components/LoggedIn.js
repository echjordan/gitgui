import React, { Component } from "react";
import { connect } from "react-redux";
import {fetchRepos} from "../actions/repos";
import TestGraph from './Test';

class LoggedIn extends Component {
  handleLogOut = () => {
    this.props.onLogout({
      username: "",
      loggedIn: false
    });
  };
  componentDidMount() {
    this.props.allRepos(this.props.user.username);
  }
  render() {
    return (
      <div>
        <h2>Logged in as {this.props.user.username}</h2>
        <h2>Repos:</h2>
        {this.props.repos &&
          this.props.repos.map((repo,i) => <li key={i}>{repo.name}</li>)}
        <button onClick={this.handleLogOut}>Log Out</button>
        <TestGraph />
      </div>
    );
  }
}

//CONTAINER
const mapState = state => {
  return {
    repos: state.repos
  };
};

const mapDispatch = dispatch => {
  return {
    allRepos: username => {
      dispatch(fetchRepos(username));
    }
  };
};

export default connect(mapState, mapDispatch)(LoggedIn);
