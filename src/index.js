import React from 'react';
import ReactDOM from 'react-dom';
import WizardForm from './components/FirstTimeApplicant/WizardForm';
import Sign from './components/FirstTimeApplicant/Sign';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducers from './reducers/index';
import { HashRouter, Route } from 'react-router-dom';
import { reducer as formReducer } from 'redux-form';
import Header from './components/Header';
import Footer from './components/Footer';
import Modal from './components/Modal';
import './styles/App.css';


const store = createStore(combineReducers({
  reducers,
  form: formReducer
// }), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
}), applyMiddleware(thunk));

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPrivacyStatement: false
    }
  }
  showPrivacyStatement() {
    this.setState({showPrivacyStatement: !this.state.showPrivacyStatement})
  }

  render(){
    return (
      <HashRouter>
        <div>
          <Header />
          <main>
            <Route exact={true} path="/" component={WizardForm} />
            <Route path="/:id" component={Sign}/>
          </main>
          {this.state.showPrivacyStatement && <Modal />}
          <Footer showPrivacyStatement={()=>this.showPrivacyStatement()} />
        </div>
      </HashRouter>
    );
  }
}

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
