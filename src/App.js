import React, { Component } from 'react';
import axios from 'axios';

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${
      process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
    }`,
  }
});

const GET_ORGANIZATION = `
{
  organization(login: "the-road-to-learn-react") {
    name
    url
  }
}
`;

const TITLE = 'React GraphQl Github Client';

class App extends Component {
  state = {
    path: 'the-road-to-learn-react/the-road-to-learn-react',
    organization: null,
    errors: null,
  };

  componentDidMount() {
    this.onFetchFromGithub();
  }

  onChange = event => {
    this.setState({ path: event.target.value });
  };

  onSubmit = event => {
    //fetch data
  

  event.preventDefault();
  };

  onFetchFromGithub = () => {
    axiosGitHubGraphQL
    .post('', { query: GET_ORGANIZATION})
    .then(result => 
      this.setState(() => ({
        organization: result.data.data.organization,
        errors: result.data.errors,
      })),
    );
}
  render () {
    const { path, organization } = this.state
    return (
      <div>
        <h1>
          {TITLE}
        </h1>
        <form onSubmit={this.onSubmit}>
          <label htmlFor="url">
            Show open issues for https://github.com/
             </label>
             <input
               id="url"
               type="text"
               value={path}
               onChange={this.onChange}
               style={{ width: '300px' }}
               />
               <button type="submit">Search</button>
        </form>
        <hr />

        <Organization organization={organization} />
      </div>
    );
  }
}

export default App;