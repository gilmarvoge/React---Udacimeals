import { ADD_RECIPE, REMOVE_FROM_CALENDAR } from '../actions'
import { combineReducers } from 'redux'



//reduce food que ira receber um estado. O estado inicial estará configurado para um objeto vazio.
function food(state = {}, action) { // incluido uma ação
    //essa reducer "food" vai controlar as receitas para a gente
    switch (action.type) {
        case ADD_RECIPE: //sempre que uma ação ADD_RECIPE for enviada, vai pegar a receita da ação, e vai retornar um novo objeto
            const { recipe } = action //dizendo que o estado será o mesmo que ele era

            return {
                ...state,  //esta receita específica será esta receita 
                [recipe.label]: recipe
            }
        default:   //default vai retornar o estado se nenhum dos outros cases responder.
            return state
    }


}
//objeto
const initialCalendarState = {
    sunday: {
        breaksfest: null,
        lunch: null,
        dinner: null
    },
    monday: {
        breaksfest: null,
        lunch: null,
        dinner: null
    },
    tuesday: {
        breaksfest: null,
        lunch: null,
        dinner: null
    },
    wednesday: {
        breaksfest: null,
        lunch: null,
        dinner: null
    },
    thursday: {
        breaksfest: null,
        lunch: null,
        dinner: null
    },
    friday: {
        breaksfest: null,
        lunch: null,
        dinner: null
    },
    saturday: {
        breaksfest: null,
        lunch: null,
        dinner: null
    },
}

// função reducer recebe um state com o parâmetro default, e uma action,
//estado vai mudar sempre que uma action add_recipe for enviada
//cuida tanto de adicionar receitas, como de removê-las do calendário;
//não modifica o estado diretamente;
function calendar(state = initialCalendarState, action) {
    const { day, recipe, meal } = action
    switch (action.type) {
        case ADD_RECIPE://sempre que add_recipe for enviada, o estado vai mudar para isso, baseada nessa action
            return { //usar o mesmo estado de antes usando object spread syntax
                ...state, //estado no dia especifico vai continuar o mesmo 
                [day]: {
                    ...state[day],
                    [meal]: recipe.label    //a "meal" agora sera "recipe.label", que é o nome da receita específica 
                }
            }
        case REMOVE_FROM_CALENDAR: // o estado vai permanecer o mesmo, com exceção desde dia específico.
            return { // e todas as outras "meals" neste dia permanecerão as mesmas, com exceção de que 
            }       // a "meal" específica agora será "null"
        default:
            return state
    }
}

//exportar o reduce "calendar" para importá-lo para dentro de um arquivo diferente.
export default combineReducers({
    food,
    calendar
})