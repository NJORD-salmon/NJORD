export const STATES = {
  WELCOME: 'WELCOME',
  CUSTOMIZE: 'CUSTOMIZE',
  SAVE: 'SAVE',
  DISPLAY: 'DISPLAY',
}

export class StateMachine {

  constructor(initialState, verbose = false) {
    this.states = STATES
    this.verbose = verbose

    if (this.states[initialState] !== undefined) {
      this.currentState = initialState
    } else {
      throw new Error('invalid state selected')
    }

    this.transitions = {
      [STATES.WELCOME]: [STATES.CUSTOMIZE],
      [STATES.CUSTOMIZE]: [STATES.CUSTOMIZE, STATES.SAVE],
      [STATES.SAVE]: [STATES.CUSTOMIZE, STATES.DISPLAY],
      [STATES.DISPLAY]: [STATES.WELCOME],
    }

    if (this.verbose) {
      console.info(`new state -> ${this.currentState}`)
    }
  }

  changeState(newState) {
    if (this.transitions[this.currentState].includes(newState)) {
      this.currentState = newState
    } else {
      throw new Error(`invalid transition ${this.currentState} -> ${newState}`)
    }

    if (this.verbose) {
      console.info(`new state -> ${this.currentState}`)
    }
  }
}