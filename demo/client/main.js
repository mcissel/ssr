import pino from 'pino';
import { createRouter, logger, getStore } from 'meteor/ssrwpo:ssr';
import { applyMiddleware } from 'redux';
import * as appReducers from '/imports/reducers';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import MainApp from '/imports/app/MainApp';
import storeSubscription from '/imports/store';
// i18n
import i18n from '/imports/i18n/i18nClient';

// Set logger
let LOG_LEVEL = 'error';
if (process.env.NODE_ENV !== 'production') {
  LOG_LEVEL = 'debug';
}
logger.set(pino({ level: LOG_LEVEL }));

// Middlewares
const appMiddlewares = [thunk, promise];
if (process.env.NODE_ENV !== 'production') {
  // Logs in development
  appMiddlewares.push(createLogger({
    actionTransformer(action) { return { ...action, type: String(action.type) }; },
  }));
}

// Enhancers
const storeEnhancers = composeWithDevTools(
  applyMiddleware(...appMiddlewares),
);

const appCursorNames = ['Folks', 'Places', 'PubSub'];

logger.info('Starting router');
createRouter({
  // Your MainApp as the top component that will get rendered in <div id='react' />
  MainApp,
  // Optional: Store subscription
  storeSubscription,
  // Optional: An object containing your application reducers
  appReducers,
  // Optional: A function to enhance the store with enhancers
  storeEnhancers,
  // Optional: An array of your collection names
  appCursorNames,
  // Optional: Add a redux store that watches for URL changes
  hasUrlStore: true,
  // Optional: An i18n config for client side
  i18n,
})
.then(() => {
  // For easing debug
  window.store = getStore();
  logger.info('Router started');
});
