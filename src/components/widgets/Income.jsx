import React from 'react';
import axios from 'axios';
import config from '../../config';
import RenderRadio from '../../components/Forms/RenderRadio';
import renderField from '../Forms/renderField';
import {Field} from 'redux-form';

class Income extends React.Component {
  constructor(props) {
    super(props);
    this.state = {show_input: false};
    this.handleSelection = this.handleSelection.bind(this);
    this.handleManualIncome = this.handleManualIncome.bind(this);
  }

  handleManualIncome(event, newValue, previousValue, name) {
    this.setState({income: newValue});
    this.props.onSelection(newValue, 'exact');
  }

  handleSelection(event, newValue, previousValue, name) {
    let income;
    if (newValue === 'below') {
      income = this.state.maximum_income_for_full_rebate;
    } else if (newValue === 'above') {
      income = this.state.minimum_income_for_no_rebate;
    }
    this.setState({income: income, show_input: (newValue == 'between')});
    this.props.onSelection(income, newValue);
  }

  componentWillReceiveProps(nextProps) {
    console.log('fetchMinMaxIncome');
    if (nextProps.dependants && nextProps.rates_bill) {
      let data = {
        'persons': {
          'Tui': {
            'salary': {
              '2017': null
            },
            'dependants': {
              '2017': nextProps.dependants
            }
          }
        },
        'properties': {
          'property_1': {
            'owners': [ 'Tui' ],
            'rates': {
              '2017': nextProps.rates_bill
            },
            'maximum_income_for_full_rebate': {
              '2017': null
            },
            'minimum_income_for_no_rebate': {
              '2017': null
            }
          }
        }
      };

      axios
        .post(`${config.OPENFISCA_ORIGIN}`, data)
        .then(res => this.setState({
          minimum_income_for_no_rebate: res
            .data
            .properties
            .property_1
            .minimum_income_for_no_rebate['2017']
            .toFixed(2),
          maximum_income_for_full_rebate: res
            .data
            .properties
            .property_1
            .maximum_income_for_full_rebate['2017']
            .toFixed(2)
        }))
        .catch(err => console.log('err fetching properties', err));
    } else {
      this.setState({minimum_income_for_no_rebate: null, maximum_income_for_full_rebate: null});
    }
  }

  getOptions(){
    return {
      'options': {
        'en': [
          {value: 'below', label: 'less then $' + this.formatDollars(this.state.maximum_income_for_full_rebate)},
          {value: 'between', label: 'somewhere in the middle'},
          {value: 'above', label: 'more than $' + this.formatDollars(this.state.minimum_income_for_no_rebate)}
        ]
      },
      'isRequired': true,
      'component': RenderRadio
    };
  }

  formatDollars(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  render() {
    if (this.state.minimum_income_for_no_rebate) {
      let earnLessThan = this.getOptions();
      return (
        <div className="arrow-box primary">
          <div>
            <section>
              <label htmlFor="earn_less_than">
                From 1st April 2016 to 31 March 2017 I earned
              </label>

              <Field
                name="income_range"
                component={RenderRadio}
                options={earnLessThan.options && earnLessThan.options['en']}
                onChange={this.handleSelection}
                className="radio-group-income"
              />

              {this.state.show_input &&
                <div>
                  <label>My annual income was</label>
                  <Field
                    name="income"
                    onChange={this.handleManualIncome}
                    type="text"
                    component={renderField}
                  />
                  <span class="reassurance">
                    Approximate values are fine. You'll need the real values if you choose to apply
                  </span>
                </div>
              }
            </section>
          </div>
        </div>
      );
    }
    
    return '';
    
  }
}

export default Income;