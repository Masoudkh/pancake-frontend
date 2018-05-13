import React, {Fragment} from 'react';
import {underscorize} from '../../helpers/strings';
import RadioWithSelect from './RadioWithSelect';
import {Field} from 'redux-form';

class IncomeListSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPartnerOptions: false
    };
    this.handleRadioClick = this.handleRadioClick.bind(this);
  }

  handleRadioClick(val) {
    if(val === 'yes') {
      this.setState({showPartnerOptions: true});
    } else {
      this.setState({showPartnerOptions: false});
    }
  }

  render() {
    return (
      <fieldset>
        <h2>Question 1</h2>
        <p>instructions</p>
        <RadioField
          options={['yes', 'no']}
          handleRadioClick={this.handleRadioClick}
        />

        <h2>Question 2</h2>
        <h5>Your List</h5>
        <IncomeList name="applicant" hasPartner={this.state.showPartnerOptions} showRadios={this.state.showPartnerOptions} />
        {this.state.showPartnerOptions && 
          <Fragment>
            <h5>Partners List</h5>
            <IncomeList name="partner" hasPartner={this.state.showPartnerOptions} showRadios={this.state.showPartnerOptions} />
          </Fragment>
        }
      </fieldset>  
    );
  }
}

const RadioField = props => {
  return (
    <Fragment>
      {props.options.map((item, i) => <Fragment key={i}>
        <input type="radio" name="radio_fields" onClick={()=>props.handleRadioClick(item)} />
        <span>{item}</span>
      </Fragment>)}
    </Fragment>
  );
};

class IncomeList extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      ShowRadio: false,
      ShowTextField: false,
      ShowNestedGroup: false,
      super_annuation_applicant: '',
      super_annuation_partner: '',
      sa_checked: false,
      jobseeker_support: 0,
      sole_parent_support: 0,
      supported_living: 0


    };

    this.handleChild = this.handleChild.bind(this);
    this.handleChildRadioClick = this.handleChildRadioClick.bind(this);
  }

  setChild(state) {
    if(!this.state[state]) {
      this.setState({ [state]: true });
    } else {
      this.setState({ [state]: false });
    }
  }

  handleChild(val) {
    switch(val.child) {
    case 'radio':
      !this.setState({sa_checked: true});
      this.setChild('ShowRadio');
      break;
    case 'text-field':
      this.setChild('ShowTextField');
      break;
    case 'nested-group':
      this.setChild('ShowNestedGroup');
      break;
    default:
      this.setChild(underscorize(val.label));
    }
  }

  handleChildRadioClick(e, name) {
    this.setState({[name]: `${name}_${underscorize(e)}`});
  }

  handleTextChange(e) {
    console.log('in handleTextChange', e.target.value)
    if(e.target.name === 'wage_or_salary_applicant') {
      this.setState({wos_applicant: e.target.value})
    }
    if(e.target.name === 'wage_or_salary_partner') {
      this.setState({wos_partner: e.target.value})
    }
  }

  render() {
    const list = [
      {
        label: 'Super Annuation',
        child: 'radio',
        options: ['Single - Living alone', 'Single - Sharing']
      },
      {
        label: 'Jobseeker Support',
        child: null
      },
      {
        label: 'Sole parent support',
        child: null
      },
      {
        label: 'Supported Living',
        child: null
      },
      {
        label: 'Wage or Salary',
        child: 'text-field'
      },
      {
        label: 'Other',
        child: 'nested-group'
      }
    ];

    const getName = typeof document.getElementsByName('wos_applicant')[0] !== 'undefined' ? document.getElementsByName('wos_applicant')[0].value : 0;
    const getName2 = typeof document.getElementsByName('wos_partner')[0] !== 'undefined' ? document.getElementsByName('wos_partner')[0].value : 0;

    return (
      <Fragment>
        <ul>
          {list.map((item, i) => {
            return (
              <li key={i}>
                <label>
                  <input type="checkbox" name={underscorize(item.label)} onClick={()=>this.handleChild(item)} />
                  {item.label}
                </label>
                
                {!this.props.showRadios && item.child === 'radio' &&
                  <RadioGroup
                    handleChildRadioClick={this.handleChildRadioClick}
                    name={`${underscorize(item.label)}_${this.props.name}`}
                    options={item.options && item.options}
                    type={this.state.ShowRadio ? 'radio' : 'hidden'}
                  />
                }
                {item.child === 'text-field' &&
                  <Fragment>
                    <input
                      type={this.state.ShowTextField ? 'text' : 'hidden'}
                      name={`wos_${this.props.name}`}
                      onChange={e=>this.setState({[`wos_${this.props.name}`]: e.target.value})}
                      value={this.state[`wos_${this.props.name}`] || ''}
                    />
                  </Fragment>
                }
                
                {this.state.ShowNestedGroup && item.child === 'nested-group' &&
                  <NestedGroup visible={this.state.ShowNestedGroup} name={`${underscorize(item.label)}_${this.props.name}`} />
                }
              </li>
            );
          })}
        </ul>
        {/* {console.log(this.props)} */}

        <Entitlement
          dependants={document.getElementsByName('dependants')[0]}
          hasPartner={this.props.hasPartner}
          data={this.props}
          super_annuation_applicant={this.state.super_annuation_applicant}
          super_annuation_partner={this.state.super_annuation_partner}
          sa_checked={this.state.sa_checked}
          jobseeker_support={this.state.jobseeker_support}
          sole_parent_support={this.state.sole_parent_support}
          supported_living={this.state.supported_living}
          wos_total={getName + getName2}
        />
      </Fragment>
    );
  }
}

const RadioGroup = props => {
  return (
    <div style={props.type !== 'radio' ? {display: 'none'} : null}>
      {props.options && props.options.map((item, i) => {
        return <Fragment key={i}>
          <label>
            <input key={i} type="radio" name={props.name} onClick={()=>props.handleChildRadioClick(item, props.name)} />
            {item}
          </label>
        </Fragment>;
      })}
    </div>
  );
};

const Textfield = props => {
  return <input
    type={props.type}
    name={props.name}
    onChange={e=>props.handleTextChange(e)}
    value={props.value} />;
};

const NestedGroup = props => {
  return <RadioWithSelect visible={props.visible} type={props.type} name={props.name} />;
};

class Entitlement extends React.Component {

  constructor(props) {
    super(props);
  }
 
  componentDidUpdate() {
    let sa_total = 0;
    let jss_total = 0;
    let sps_total = 0;
    let spl_total = 0;

    if(typeof this.props.dependants !== 'undefined') {
      var dependants = this.props.dependants.value ? this.props.dependants.value : 0;
    }

    // SUPER ANNUATION
    if(this.props.sa_checked) {
      if(dependants.length > 0) {
        
        if(this.props.hasPartner) {
          sa_total += 34916.96;
        } // TODO: this value is empty in benefit schedult

      } else { // no children
        if(this.props.hasPartner) {
          sa_total += 17458.48;
        } else { // SINGLE
          if(this.props.super_annuation_applicant.includes('alone')) {
            sa_total += 23058.36;
          } else if(this.props.super_annuation_applicant.includes('sharing')) {
            sa_total += 21191.56;
          }
        }
      }
    }

    // JOB SEEKER SUPPORT
    if(this.props.jobseeker_support) {
      if(dependants.length > 0) {
        if(this.props.hasPartner) {
          jss_total += 21799.44;
        } else {
          jss_total += 19358.56;
        }
      } else { // no children
        if(this.props.hasPartner) {
          jss_total += 20346.56;
        } else {
          jss_total += 10173.28; // took first value: Single 18-19 years (away from home)
        }
      }
    }

    // SOLE PARENT SUPPORT
    if(this.props.sole_parent_support) {
      if(dependants.length > 0) {
        sps_total += 19358.56;
      }
    }

    // SUPPORTED LIVING PAYMENT
    if(this.props.supported_living) {
      if(dependants.length > 0) {
        if(this.props.hasPartner) {
          if(dependants.length === 1) {
            spl_total += 12716.08; // married, with 1 child
          } else {
            spl_total += 26884.00; // married, with 2 or more children
          }
          
        } else {
          spl_total += 22134.84; // single, with children
        }
      } else {
        if(this.props.hasPartner) {
          spl_total += 12716.08; // married, no children
        } else {
          spl_total += 15366.52; // single, no children
        }
      }
    }

    // WAGE OR SALARY
    console.log((sa_total + jss_total + sps_total + spl_total + this.props.wos_total));
  }


  calculate() {
  }

  render() {
    return (
      <div>
        <p>Entitlement:</p>
      </div>
    );
  }
}


export default IncomeListSection;
