import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../../../firebase.config';

type AuthState = {
  user: User | null;
  isLoading: boolean;
};

const initialState: AuthState = {
  user: null,
  isLoading: true,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setUser(user: User | null) {
      patchState(store, { user, isLoading: false });
    },
    setLoading(isLoading: boolean) {
      patchState(store, { isLoading });
    },
  })),
  withHooks({
    onInit(store) {
      const auth = getAuth(app);
      console.log(auth);
      onAuthStateChanged(auth, (user) => {
        store.setUser(user);
        console.log(user);
      });
      
    },
  }),
);
