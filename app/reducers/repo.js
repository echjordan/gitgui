const nodegit = require('nodegit');
const ADD_COMMIT = 'ADD_COMMIT';
const ERASE_HISTORY = 'ERASE_HISTORY';
const ADD_EDGE = 'ADD_EDGE';

export const addCommit = commit => ({type: ADD_COMMIT, commit});
const addEdge = edge => ({type: ADD_EDGE, edge});
const eraseHistory = () => ({type: ERASE_HISTORY});

const sliceMessage = string => {
  return string.length <= 25
    ? string
    : string.slice(0, 22) + '...';
};

export const fetchHistory = (rootDir, currentBranch) => (dispatch) => {
  if(!rootDir) return;
  nodegit.Repository.open(rootDir)
    .then(function(repo){
      return repo.getBranchCommit(currentBranch.toString());
    })
    .then(firstCommit =>{
      dispatch(eraseHistory());
      const history = firstCommit.history(nodegit.Revwalk.SORT.Time);
      history.on('commit', commit => {
        let obj = {};
        obj.id = commit.sha();
        obj.label = sliceMessage(commit.message());
        obj.message = commit.message();
        obj.title = commit.date();
        obj.author = commit.author().toString();
        dispatch(addCommit(obj));
        var numParents = commit.parentcount();
        for (let i = 0; i < numParents; i++ ) {
          commit.parent(i).then(function(parent) {
            dispatch(addEdge(
              {from: parent.sha(), to: commit.sha()}
            ));
          });
        }
      });
      history.start();
    }).done();
};

const defaultState = { nodes: [], edges: [] };

export default function reducer (state = defaultState, action){
  switch (action.type){
  case ADD_COMMIT:
    return {...state, nodes: [...state.nodes, action.commit]};
  case ADD_EDGE:
    return {...state, edges: [...state.edges, action.edge]};
  case ERASE_HISTORY:
    return defaultState;
  default:
    return state;
  }
}
