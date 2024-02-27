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

const GET_ISSUES_OF_REPOSITORY = `
  query ($organization: String!, $repository: String!) {
    organization(login: $organization) {
    name
    url
    repository(name: $repository) {
      name
      url
      issues(last: 5, states: [OPEN]) {
        edges {
          node {
            id
            title
            url
            reactions(last: 3) {
              edges {
                node{
                  id
                  content
                }
                totalCount
                pageInfo {
                  endCursor
                  hasNextPage
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

const TITLE = 'React GraphQl Github Client';

const getIssuesOfRepository = (path, cursor) => {
  const [organization, repository] = path.split('/');


return  axiosGitHubGraphQL.post('', { 
  query: GET_ISSUES_OF_REPOSITORY,
  variables: {organization, repository, cursor },
  });
};

const resolveIssuesQuery = queryResult => () => ({
  organization: queryResult.data.data.organization,
  errors: queryResult.data.errors,
});

class App extends Component {
  state = {
    path: 'the-road-to-learn-react/the-road-to-learn-react',
    organization: null,
    errors: null,
  };

  componentDidMount() {
    this.onFetchFromGithub(this.state.path);
  }

  onChange = event => {
    this.setState({ path: event.target.value });
  };

  onSubmit = event => {
    this.onFetchFromGithub(this.state.path);
  

  event.preventDefault();
  };

  onFetchFromGithub = (path, cursor) => {
   getIssuesOfRepository(path, cursor).then(queryResult => 
      this.setState(resolveIssuesQuery(queryResult, cursor)),
    );
    
    
    };

    onFetchMoreIssues = () => {
      const {
        endCursor,
      } = this.state.organization.repository.issues.pageInfo;

      this.onFetchFromGithub(this.state.path, endCursor);
    };
    
}

    


  render () {
    const { path, organization, errors } = this.state;
    
    const Organization = ({ organization, errors, onFetchMoreIssues, }) => {
      if (errors) {
        return (
          <p>
          <strong> something wrong: </strong>
          {errors.map(error => error.message).join(' ')}
          </p>
        );
      }
      
      return (
      <div>
        <p>
          <strong> Issues from Organization:</strong>
          <a href={organization.url}>{organization.name}</a>
        </p>
        <Repository repository={organization.repository}
        onFetchMoreIssues={onFetchMoreIssues} 
        />

      </div>
     );
    };

    const Repository = ({ repository, onFetchMoreIssues, }) => (
      <div>
        <p>
          <strong> In Repository:  </strong>
          <a href={repository.url}>{repository.name}</a>
        </p>

        <ul>
          {repository.issues.edges.map(issue => (
            <li key={issue.node.id}>
              <a href={issue.node.url}>{issue.node.title}</a>

              <ul>
                {issue.node.reactions.edges.map(reaction => (
                  <li key={reaction.node.id}>{reaction.node.content}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <hr />
        <button onClick={onFetchMoreIssues}>More</button>
      </div>
    )
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
        
        {organization ? (
        <Organization organization={organization} errors={errors}
        onFetchMoreIssues={this.onFetchMoreIssues} />
        ) : (
          <p>No info yet ...</p>
        )}
      </div>
    );
  }
  
};


export default App;