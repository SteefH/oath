import {setDeferredFactory} from './promiseUtils';
import breaker from './oath/breaker';
import keeper from './oath/keeper';

export default {
  configure: ({deferredFactory}) => setDeferredFactory(deferredFactory),
  breaker,
  keeper
};
