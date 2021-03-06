const {dialog} = require('electron').remote;
import { fetchHistory } from './repo';

export const pull = (path, branch) => (dispatch) => {
  let components = branch.split('/');
  require('simple-git/promise')(`${path}`).pull(components[0], components[1], {'--no-rebase': null})
    .then(()=> {
      return dispatch(fetchHistory(`${path}`, components[1]));
    })
    .catch((err) => openDialogBox(err) );
};

function openDialogBox(err) {
  const title = 'Error';
  const content = `${err}`;
  dialog.showErrorBox(title, content);
}
