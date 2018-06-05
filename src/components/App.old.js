import React, { Component } from 'react'
import { addRecipe } from '../actions';

class App extends Component {
  state = {
    calendar: null
  }
  //quando o componente montar, o método lifecycle vai rodar
  //vai pegar a store de props, e invoca o "subscribe" para qualquer mudança
  //que acontecer dentro da store do redux
  componentDidMount() {
    const { store } = this.props
    //sempre que algo mudar, será chamado setState
    store.subscribe(() => {
      this.setState(() => ({ //vai pegar o estado da store e colocá-lo no estado do componente local
        calendar: store.getState()   //que vai renderizar o "mondays breakfast ali em baixo"
      }))                       //quando a store mudar, calendar passa a ser o que store.getState retornar
    })                         //e será o novo estado da store
  }

  //metodo submittFoot,
  submitFood = () => { //sempre que está função rodar, vai chamar "store.dispatch",
    this.props.store.dispatch(addRecipe({   //quando invocar o criador de action "addRecipe"
      day: 'monday',
      meal: 'breakfast',
      recipe: {  //recipe será um objeto que terá um label, pq dentro do arquivo reducer exige isso
        label: this.input.value     //o label que será inserido no campo de entrada input abaixo
      }
    }))
    this.input.value = ''
  }

  render() {
    return (
      <div>
        <input //o que for digitado aqui sera salvo como "mondays breakfast"
          type='text'
          ref={(input) => this.input = input}
          placeholder="Mondays Breakfast"
        />
        <button onClick={this.submitFood}>Submit</button>

        <pre>
          Mondays Breakfast:{this.state.calendar && this.state.calendar.monday.breakfast}
        </pre>
      </div>
    )
  }
}

export default App