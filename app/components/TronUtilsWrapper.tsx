import React from 'react';
import { createNewWallet, initiateTronTransaction } from '../utils/tronUtils'

export interface TronUtilsWrapperType {
  createNewWallet: typeof createNewWallet;
  initiateTronTransaction: typeof initiateTronTransaction;
}

const TronUtilsWrapper: React.FC & TronUtilsWrapperType = () => null;

TronUtilsWrapper.createNewWallet = createNewWallet;
TronUtilsWrapper.initiateTronTransaction = initiateTronTransaction;

export default TronUtilsWrapper;