import React, { Component } from 'react';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Aux from "../../hoc/Ax";
import axios from '../../axios-orders';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/spinner/spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import orderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENTS_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }
    componentDidMount() {
        axios.get('https://react-app-burger-f2daf.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({
                    ingredients : response.data
                })
            })
            .catch(error => {
                this.setState({ error: true })
            })
    }

    updatePurchaseState (ingredients) {
    
        const sum = Object.keys(ingredients).map( igKey => {
            return ingredients[igKey]
        } ).reduce( (sum, el) => {
            return sum + el;
        } ,0);
        this.setState({purchasable: sum > 0})
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updateCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updateCount;
        const priceAddition = INGREDIENTS_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice:newPrice, ingredients: updatedIngredients});
        
        this.updatePurchaseState(updatedIngredients)
    };


    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0) {
            return;
        };
        const updateCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updateCount;
        const priceDeduction = INGREDIENTS_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice:newPrice, ingredients: updatedIngredients});

        this.updatePurchaseState(updatedIngredients)
    };

    purchaseHandler = () => {
        this.setState({purchasing: true});
    };

    purcheseCancelHandler = () => {
        this.setState({ purchasing: false })
    };

    purcheseContinueHandler = () => {
        
        this.setState({loading: true});
        const order = {
            ingrediants: this.state.ingredients,
            proce: this.state.totalPrice,
            customer: {
                name: 'Petar Petrovic',
                    adress: {
                        street: 'Test street 1',
                        zipCode: 2828822,
                        country: 'Serbia'
                    },
                        email: 'Test2@gmail.com',
            },
            deliveryMethod: 'fastes'
        }

        axios.post('/orders.json', order)
        .then(response => {
            this.setState({loading: false, purchasing: false});
        })
        .catch(error => {
            this.setState({loading: false, purchasing: false});
        })
    };

    render () {
        const disabledInfo = {
            ...this.state.ingredients
        }
        for( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;

        //show spinner until data be ready
        // console.log(this.state.ingredients)
        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />
        if(this.state.ingredients) {
            burger = (
                        <Aux>
                            <Burger ingredients = {this.state.ingredients} />
                            <BuildControls
                                ingredientAdded={this.addIngredientHandler}
                                ingredientMoved={this.removeIngredientHandler}
                                disabled={disabledInfo}
                                purchasable={this.state.purchasable}
                                price={this.state.totalPrice} 
                                ordered={this.purchaseHandler} />
                        </Aux>
                        );

            orderSummary = <OrderSummary ingredients={this.state.ingredients} 
            purchaseCancelled={this.purcheseCancelHandler} 
            purchaseConfirm={this.purcheseContinueHandler}
            price={this.state.totalPrice}  />;

        }
                if(this.state.loading) {
                    //show spiner
                    orderSummary = <Spinner />
                };

        // {salad:true, meat: false ...}
        return (
            <Aux>
                <Modal show={this.state.purchasing}
                        modalClosed={ this.purcheseCancelHandler } >
                            {orderSummary}
                </Modal>
            {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);