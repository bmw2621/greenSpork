import React, { useReducer } from 'react';
import Layout from '../components/Layout.js'
import styles from '../styles/form.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

const inventory = require("../inventory.json")

export default () => {
  const emptyState = {
    name: '',
    email: '',
    phone: '',
    specialInstructions: '',
    order: {},
    price: 0.0,
    status: 'IDLE'
  };

  inventory.forEach(item => {
    emptyState.order[item.name.toLowerCase().split(" ").join("_")] = 0
  })

  const reducer = (state, action) => {
    switch (action.type) {
      case 'name':
        return { ...state, name: action.name };
      case 'email':
        return { ...state, email: action.email };
      case 'phone':
        return { ...state, phone: action.phone };
      case 'specialInstructions':
        return { ...state, specialInstructions: action.specialInstructions };
      case 'order':
        let newState = {...state}
        newState.order[action.item] = parseInt(action.order)
        newState.price = newState.price + action.price
        return newState;
      case 'updateStatus':
        return { ...state, status: action.status };
      case 'reset':
      default:
        return emptyState;
    }
  };

  const [state, dispatch] = useReducer(reducer, emptyState);

  const setStatus = status => dispatch({ type: 'updateStatus', status });

  const updateFieldValue = fieldName => event =>
    dispatch({ type: fieldName, [fieldName]: event.target.value });
  
  const updateOrderFieldValue = (fieldName, itemToUpdate) => event =>
    dispatch({ type: fieldName, [fieldName]: event.target.value, item: itemToUpdate });
  
  const updateOrderFieldValueInc = (fieldName, itemToUpdate, itemPrice) => event =>
    !isNaN(parseInt(document.getElementById(itemToUpdate).value)) && dispatch({ type: fieldName, [fieldName]: parseInt(document.getElementById(itemToUpdate).value) + 1, item: itemToUpdate, price: itemPrice });
  
  const updateOrderFieldValueDec = (fieldName, itemToUpdate, itemPrice) => event =>
    !isNaN(parseInt(document.getElementById(itemToUpdate).value)) && parseInt(document.getElementById(itemToUpdate).value) > 0 && dispatch({ type: fieldName, [fieldName]: parseInt(document.getElementById(itemToUpdate).value) - 1, item: itemToUpdate, price: itemPrice * -1 });

  const handleSubmit = event => {
    event.preventDefault();
    console.log(state)
    setStatus('SENDING');

    fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(state)
    })
      .then(response => response.json())
      .then(response => {
        console.log({ response });
        setStatus('SENT');
      });
  };


  return (
    <Layout>

      <form style={{"border":"none", "background":"#8BA76A"}}
          className={`${styles.form} ${state.status === 'SENDING' &&
            styles.sending}`}
        >
        {inventory.map(item => {
          let productImage = require(`../images/${item.image}`)
          return (
            <label className={`${styles.label} ${styles.menuItem}`} key={item.name.toLowerCase().split(" ").join("_")}>
              <span style={{"fontWeight":"bold"}}>{item.name}</span>
              <img className={styles.productImage} src={productImage} alt=""/>
              <span>{item.description}</span><br/>
              <span style={{"fontWeight":"thin"}}>{`$${parseFloat(item.price).toFixed(2)}`}</span>
              <div className={styles.inputContainer}>
                <FontAwesomeIcon icon={faMinus} className={styles.faIcon} onClick={updateOrderFieldValueDec('order', item.name.toLowerCase().split(" ").join("_"), item.price)} />
                <input
                  readOnly
                  type="text"
                  id={item.name.toLowerCase().split(" ").join("_")}
                  value={state.order[item.name.toLowerCase().split(" ").join("_")]}
                  onChange={updateOrderFieldValue('order', item.name.toLowerCase().split(" ").join("_"))}
                  className={`${styles.input} ${styles.orderInput}`}
                />
              <FontAwesomeIcon icon={faPlus} className={styles.faIcon} onClick={updateOrderFieldValueInc('order', item.name.toLowerCase().split(" ").join("_"), item.price)} />
              </div>
            </label>
          )
        })}
        
      </form>
      <h1 className={styles.heading}>Place Order</h1>
      {state.status === 'SENT' ? (
        <p className={styles.success}>
          Order sent!
          <button
            type="reset"
            onClick={() => dispatch({ type: 'reset' })}
            className={`${styles.button} ${styles.centered}`}
          >
            Reset
          </button>
        </p>
      ) : (
        <form
          style={{"display":"block", "maxWidth":"500px"}}
          className={`${styles.form} ${state.status === 'SENDING' &&
            styles.sending}`}
          onSubmit={handleSubmit}
        >
          <label className={`${styles.label} ${styles.labelOrderForm}`} >
            Name
            <input
              type="text"
              value={state.name}
              onChange={updateFieldValue('name')}
              className={styles.input}
            />
          </label>
          <label className={`${styles.label} ${styles.labelOrderForm}`} >
            Email
            <input
              type="email"
              value={state.email}
              onChange={updateFieldValue('email')}
              className={styles.input}
            />
          </label>
          <label className={`${styles.label} ${styles.labelOrderForm}`} >
            Phone Number
            <input
              type="phone"
              value={state.phone}
              onChange={updateFieldValue('phone')}
              className={styles.input}
            />
          </label>
          <label className={`${styles.label} ${styles.labelOrderForm}`} >
            Special Instructions
            <textarea
              type="text"
              value={state.specialInstructions}
              onChange={updateFieldValue('specialInstructions')}
              className={styles.input}
            />
          </label>
          <button
            className={styles.button}
            disabled={state.status === 'SENDING'}
          >
            {state.status !== 'SENDING' ? 'Place Order' : 'Sending...'}
          </button>
        </form>
      )}
    </ Layout>
  );
};
