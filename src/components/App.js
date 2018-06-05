import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addRecipe, removeFromCalendar } from '../actions'
import { capitalize } from '../utils/helpers'
import CalendarIcon from 'react-icons/lib/fa/calendar-plus-o'
import Modal from 'react-modal'
import ArrowRightIcon from 'react-icons/lib/fa/arrow-circle-right'
import Loading from 'react-loading'
import { fetchRecipes } from '../utils/api'
import FoodList from './FoodList'
import ShoopingList from './ShoppingList'

class App extends Component {
  state = {
    foodModalOpen: false,
    meal: null,
    day: null,
    food: null,
    loadingFood: false,
    ingredientsModalOpen: false,
  }
  /*
    doThing = () => {
      this.props.dispatch(addRecipe({}))      //action creator addRecipe, passar qualquer propriedade específica para ela
    }                              //propriedade dispatch que esta sendo passada para o componente, isso vem de 
    //this.props. Ao conectar mapDispatchToProps ao nosso componente, passando como segundo argumento
    //no export
   */
  openFoodModal = ({ meal, day }) => {
    this.setState(() => ({
      foodModalOpen: true,
      meal,
      day,
    }))
  }
  closeFoodModal = () => {
    this.setState(() => ({
      foodModalOpen: false,
      meal: null,
      day: null,
      food: null,
    }))
  }
  searchFood = (e) => {
    if (!this.input.value) {
      return
    }

    e.preventDefault()

    this.setState(() => ({ loadingFood: true }))

    fetchRecipes(this.input.value)  //quando chamar "fetchRecipes", vai receber uma array de comida de volta
      .then((food) => this.setState(() => ({
        food,
        loadingFood: false,
      })))
  }

  openIngredientsModal = () => this.setState(() => ({ ingredientsModalOpen: true }))
  closeingredientsModal = () => this.setState(() => ({ ingredientsModalOpen: false }))
  generateShoopingList = () => { // array com todos os diferentes ingredientes
    return this.props.calendar.reduce((result, { meals }) => {//pegar todas as refeições e fazer um push
      const { breakfast, lunch, dinner } = meals          // de todas as refeições para uma única array
      breakfast && result.push(breakfast)
      lunch && result.push(lunch)
      dinner && result.push(dinner)

      return result
    }, []) //serve para nivelar a array
      // refeições
      .reduce((ings, { ingredientLines }) => ings.concat(ingredientLines), [])
  }

  render() {
    const { calendar, remove, selectRecipe } = this.props
    const { foodModalOpen, loadingFood, food, ingredientsModalOpen } = this.state
    const mealOrder = ['breakfast', 'lunch', 'dinner']
    return (
      <div className='container'>

        <div className='nav'>
          <h1 className='header'>UdaciMeals</h1>
          <button
            className='shopping-list'
            onClick={this.openIngredientsModal}>
            Shooping List
          </button>
        </div>

        <ul className='meal-types'>
          {mealOrder.map((mealType) => (     // un ordered list, faz 3 listas, 3 colunas
            <li key={mealType} className='subheader'>
              {capitalize(mealType)}
            </li>
          ))}
        </ul>

        <div className='calendar'>
          <div className='days'>
            {calendar.map(({ day }) => <h3 key={day} className='subheader'>{capitalize(day)}</h3>)}
          </div>
          <div className='icon-grid'>
            {calendar.map(({ day, meals }) => (
              <ul key={day}>
                {mealOrder.map((meal) => (     //se houver uma refeição específica naquele dia ,então pode renderizar o meals[meal]
                  <li key={meal} className='meal'>
                    {meals[meal]                 //se não houver, o que deverá ser renderizado, é o botao calendarIcon lá em baixo
                      ? <div className='food-item'>
                        <img src={meals[meal].image} alt={meals[meal].label} />
                        <button onClick={() => remove({ meal, day })}>Clear</button>
                      </div>
                      : <button onClick={() => this.openFoodModal({ meal, day })} className='icon-btn'>
                        <CalendarIcon size={30} />
                      </button>}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <Modal
          className='modal'
          overlayClassName='overlay'
          isOpen={foodModalOpen}
          onRequestClose={this.closeFoodModal}
          contentLabel='Modal'
        >
          <div>
            {loadingFood === true
              ? <Loading delay={200} type='spin' color='#222' className='loading' />
              : <div className='search-container'>
                <h3 className='subheader'>
                  Find a meal for {capitalize(this.state.day)} {this.state.meal}.
                  </h3>
                <div className='search'>
                  <input
                    className='food-input'
                    type='text'
                    placeholder='Search Foods'
                    ref={(input) => this.input = input}
                  />
                  <button
                    className='icon-btn'
                    onClick={this.searchFood}>
                    <ArrowRightIcon size={30} />
                  </button>
                </div>
                {food !== null && (
                  <FoodList
                    food={food}
                    onSelect={(recipe) => {
                      selectRecipe({ recipe, day: this.state.day, meal: this.state.meal })
                      this.closeFoodModal()
                    }}
                  />)}
              </div>}
          </div>
        </Modal>

        <Modal
          className='modal'
          overlayClassName='overlay'
          isOpen={ingredientsModalOpen}
          onRequestClose={this.closeingredientsModal}
          contentLabel='Modal'//se ingredientsModalOpen estiver aberto
        //a ShoppingList pode ser renderizada
        >
          {ingredientsModalOpen && <ShoopingList list={this.generateShoopingList()} />}
        </Modal>
      </div>
    )
  }
}
//invocar connect neste componente para a store do redux e assim podemos pegar o estado 
//calendar que vive dentro da store do redux.

//Função vai mapear o estado do Redux para o nosso componente "props",
//recebe o estado, ou "calendar", e qualquer coisa que retorne deste componente, vai ser passado para
//este componente App
function mapStateToProps({ calendar, food }) {
  const dayOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  //retorna um objeto que tenha a propriedade calendar, esta propriedade é o resultado do chamado de 
  //"dayOrder.map", passar pelo dia específico
  return {
    calendar: dayOrder.map((day) => ({
      //retorna objeto que tem a propriedade "day", e todas as "meals" desde dia
      day,
      //chama object.key passando "calendar" com um dia específico, o que vai retornar todas as keys deste objeto;
      //depois chama ".reduce" (reduzir tudo a um único objeto),
      //objeto meals, que esta coletando ao reduzir, e cada item sera a "meal".
      //dizemos que "Meals" em "meal" será igual a se "calendar" em um dia especifico em uma "meal" específica
      //for uma coisa, será o mesmo que "calendar" em um dia específico, em uma "meal" específica,
      //do contrário, será apenas "null". E depois retorna "meals"

      meals: Object.keys(calendar[day]).reduce((meals, meal) => {
        meals[meal] = calendar[day][meal]
          ? food[calendar[day][meal]]
          : null

        return meals
      }, {})
      //em resumo, quando logar "Props", vamos ver o novo formato do nosso "calendar", depois de mapearmos os dias
      //e usarmos "reduce". Depois de mapear os dias e usar o reduce, vamos ao "Props"
    })),
  }
}

function mapDispatchToProps(dispatch) {//mapeia o método dispatch para os nossos props específicos. Passa dispatch para a função
  //vai ser passado para o nosso componente como props
  //adicionar propriedades ao objeto
  return {
    selectRecipe: (data) => dispatch(addRecipe(data)),//essa função receberá dados e invocará "dispatch" chamando add Recipe e passando os dados
    remove: (data) => dispatch(removeFromCalendar(data))         //o segundo método deste objeto será "remove", que receberá dados e invocará "dispatch", chamando removeFromCalendar e passando dados ara ele.
  }//quando estas funções forem chamadas, o "dispatch" será automaticamente feito para nós 
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App) //invocar connect, retorna função nova para a qual passa o nosso componente

//se precisa enviar uma action dentro de um componente, tem que invocar connect neste componente,
// e assim vai poder chamar dispatch
