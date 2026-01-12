import { playerReducer, initialState } from './reducer';
import { playerConnected, playerMoved } from '../actions/player.actions';

describe('PlayerReducer', () => {

  it('should add a new player when playerConnected is dispatched', () => {
    const action = playerConnected({
      player: { id: 'Jugador-1', x: 100, y: 100 }
    });

    const state = playerReducer(initialState, action);

    expect(state.players.length).toBe(1);
    expect(state.players[0].id).toBe('Jugador-1');
  });

  it('should update player position when playerMoved is dispatched', () => {
    const stateWithPlayer = {
      players: [{ id: 'Jugador-1', x: 100, y: 100 }]
    };

    const action = playerMoved({
      player: { id: 'Jugador-1', x: 150, y: 150 }
    });

    const state = playerReducer(stateWithPlayer, action);

    expect(state.players[0].x).toBe(150);
    expect(state.players[0].y).toBe(150);
  });

});