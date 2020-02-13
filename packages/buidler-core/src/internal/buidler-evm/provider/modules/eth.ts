import Common from "ethereumjs-common";
import { Transaction } from "ethereumjs-tx";
import {
  BN,
  bufferToHex,
  toBuffer,
  toRpcSig,
  zeroAddress
} from "ethereumjs-util";
import * as t from "io-ts";

import {
  InvalidArgumentsError,
  InvalidInputError,
  MethodNotFoundError,
  MethodNotSupportedError
} from "../errors";
import {
  LogAddress,
  LogTopics,
  OptionalBlockTag,
  optionalBlockTag,
  optionalRpcFilterRequest,
  OptionalRpcFilterRequest,
  rpcAddress,
  rpcCallRequest,
  RpcCallRequest,
  rpcData,
  RpcFilterRequest,
  rpcFilterRequest,
  rpcHash,
  rpcQuantity,
  rpcSubscribeRequest,
  RpcSubscribeRequest,
  rpcTransactionRequest,
  RpcTransactionRequest,
  rpcUnknown,
  validateParams
} from "../input";
import {
  Block,
  BuidlerNode,
  CallParams,
  FilterParams,
  TransactionParams
} from "../node";
import {
  bufferToRpcData,
  getRpcBlock,
  getRpcTransaction,
  getRpcTransactionReceipt,
  numberToRpcQuantity,
  RpcBlockOutput,
  RpcLogOutput,
  RpcTransactionOutput,
  RpcTransactionReceiptOutput
} from "../output";

// tslint:disable only-buidler-error

export class EthModule {
  constructor(
    private readonly _common: Common,
    private readonly _node: BuidlerNode
  ) {}

  public async processRequest(
    method: string,
    params: any[] = []
  ): Promise<any> {
    switch (method) {
      case "eth_accounts":
        return this._accountsAction(...this._accountsParams(params));

      case "eth_blockNumber":
        return this._blockNumberAction(...this._blockNumberParams(params));

      case "eth_call":
        return this._callAction(...this._callParams(params));

      case "eth_chainId":
        return this._chainIdAction(...this._chainIdParams(params));

      case "eth_coinbase":
        return this._coinbaseAction(...this._coinbaseParams(params));

      case "eth_compileLLL":
        throw new MethodNotSupportedError(`Method ${method} is not supported`);

      case "eth_compileSerpent":
        throw new MethodNotSupportedError(`Method ${method} is not supported`);

      case "eth_compileSolidity":
        throw new MethodNotSupportedError(`Method ${method} is not supported`);

      case "eth_estimateGas":
        return this._estimateGasAction(...this._estimateGasParams(params));

      case "eth_gasPrice":
        return this._gasPriceAction(...this._gasPriceParams(params));

      case "eth_getBalance":
        return this._getBalanceAction(...this._getBalanceParams(params));

      case "eth_getBlockByHash":
        return this._getBlockByHashAction(
          ...this._getBlockByHashParams(params)
        );

      case "eth_getBlockByNumber":
        return this._getBlockByNumberAction(
          ...this._getBlockByNumberParams(params)
        );

      case "eth_getBlockTransactionCountByHash":
        return this._getBlockTransactionCountByHashAction(
          ...this._getBlockTransactionCountByHashParams(params)
        );

      case "eth_getBlockTransactionCountByNumber":
        return this._getBlockTransactionCountByNumberAction(
          ...this._getBlockTransactionCountByNumberParams(params)
        );

      case "eth_getCode":
        return this._getCodeAction(...this._getCodeParams(params));

      case "eth_getCompilers":
        throw new MethodNotSupportedError(`Method ${method} is not supported`);

      case "eth_getFilterChanges":
        return this._getFilterChangesAction(
          ...this._getFilterChangesParams(params)
        );

      case "eth_getFilterLogs":
        return this._getFilterLogsAction(...this._getFilterLogsParams(params));

      case "eth_getLogs":
        return this._getLogsAction(...this._getLogsParams(params));

      case "eth_getProof":
        throw new MethodNotSupportedError(`Method ${method} is not supported`);

      case "eth_getStorageAt":
        return this._getStorageAtAction(...this._getStorageAtParams(params));

      case "eth_getTransactionByBlockHashAndIndex":
        return this._getTransactionByBlockHashAndIndexAction(
          ...this._getTransactionByBlockHashAndIndexParams(params)
        );

      case "eth_getTransactionByBlockNumberAndIndex":
        return this._getTransactionByBlockNumberAndIndexAction(
          ...this._getTransactionByBlockNumberAndIndexParams(params)
        );

      case "eth_getTransactionByHash":
        return this._getTransactionByHashAction(
          ...this._getTransactionByHashParams(params)
        );

      case "eth_getTransactionCount":
        return this._getTransactionCountAction(
          ...this._getTransactionCountParams(params)
        );

      case "eth_getTransactionReceipt":
        return this._getTransactionReceiptAction(
          ...this._getTransactionReceiptParams(params)
        );

      case "eth_getUncleByBlockHashAndIndex":
        throw new MethodNotSupportedError(`Method ${method} is not supported`);

      case "eth_getUncleByBlockNumberAndIndex":
        throw new MethodNotSupportedError(`Method ${method} is not supported`);

      case "eth_getUncleCountByBlockHash":
        throw new MethodNotSupportedError(`Method ${method} is not supported`);

      case "eth_getUncleCountByBlockNumber":
        throw new MethodNotSupportedError(`Method ${method} is not supported`);

      case "eth_getWork":
        throw new MethodNotSupportedError(`Method ${method} is not supported`);

      case "eth_hashrate":
        throw new MethodNotSupportedError(`Method ${method} is not supported`);

      case "eth_mining":
        return this._miningAction(...this._miningParams(params));

      case "eth_newBlockFilter":
        return this._newBlockFilterAction(
          ...this._newBlockFilterParams(params)
        );

      case "eth_newFilter":
        return this._newFilterAction(...this._newFilterParams(params));

      case "eth_newPendingTransactionFilter":
        return this._newPendingTransactionAction(
          ...this._newPendingTransactionParams(params)
        );

      case "eth_pendingTransactions":
        return this._pendingTransactionsAction(
          ...this._pendingTransactionsParams(params)
        );

      case "eth_protocolVersion":
        throw new MethodNotSupportedError(`Method ${method} is not supported`);

      case "eth_sendRawTransaction":
        return this._sendRawTransactionAction(
          ...this._sendRawTransactionParams(params)
        );

      case "eth_sendTransaction":
        return this._sendTransactionAction(
          ...this._sendTransactionParams(params)
        );

      case "eth_sign":
        return this._signAction(...this._signParams(params));

      case "eth_signTransaction":
        throw new MethodNotSupportedError(`Method ${method} is not supported`);

      case "eth_signTypedData":
        return this._signTypedDataAction(...this._signTypedDataParams(params));

      case "eth_submitHashrate":
        throw new MethodNotSupportedError(`Method ${method} is not supported`);

      case "eth_submitWork":
        throw new MethodNotSupportedError(`Method ${method} is not supported`);

      case "eth_subscribe":
        return this._subscribeAction(...this._subscribeParams(params));

      case "eth_syncing":
        return this._syncingAction(...this._syncingParams(params));

      case "eth_uninstallFilter":
        return this._uninstallFilterAction(
          ...this._uninstallFilterParams(params)
        );

      case "eth_unsubscribe":
        return this._unsubscribeAction(...this._unsubscribeParams(params));
    }

    throw new MethodNotFoundError(`Method ${method} not found`);
  }

  // eth_accounts

  private _accountsParams(params: any[]): [] {
    return validateParams(params);
  }

  private async _accountsAction(): Promise<string[]> {
    return this._node.getLocalAccountAddresses();
  }

  // eth_blockNumber

  private _blockNumberParams(params: any[]): [] {
    return validateParams(params);
  }

  private async _blockNumberAction(): Promise<string> {
    const block = await this._node.getLatestBlock();
    const blockNumber = new BN(block.header.number);
    return numberToRpcQuantity(blockNumber);
  }

  // eth_call

  private _callParams(params: any[]): [RpcCallRequest, OptionalBlockTag] {
    return validateParams(params, rpcCallRequest, optionalBlockTag);
  }

  private async _callAction(
    rpcCall: RpcCallRequest,
    blockTag: OptionalBlockTag
  ): Promise<string> {
    this._validateBlockTag(blockTag);

    const callParams = await this._rpcCallRequestToNodeCallParams(rpcCall);
    const returnData = await this._node.runCall(callParams);

    return bufferToRpcData(returnData);
  }

  // eth_chainId

  private _chainIdParams(params: any[]): [] {
    return validateParams(params);
  }

  private async _chainIdAction(): Promise<string> {
    return numberToRpcQuantity(this._common.chainId());
  }

  // eth_coinbase

  private _coinbaseParams(params: any[]): [] {
    return validateParams(params);
  }

  private async _coinbaseAction(): Promise<string> {
    return bufferToHex(await this._node.getCoinbaseAddress());
  }

  // eth_compileLLL

  // eth_compileSerpent

  // eth_compileSolidity

  // eth_estimateGas

  private _estimateGasParams(
    params: any[]
  ): [RpcTransactionRequest, OptionalBlockTag] {
    return validateParams(params, rpcTransactionRequest, optionalBlockTag);
  }

  private async _estimateGasAction(
    transactionRequest: RpcTransactionRequest,
    blockTag: OptionalBlockTag
  ): Promise<string> {
    this._validateBlockTag(blockTag);

    const txParams = await this._rpcTransactionRequestToNodeTransactionParams(
      transactionRequest
    );

    return numberToRpcQuantity(await this._node.estimateGas(txParams));
  }

  // eth_gasPrice

  private _gasPriceParams(params: any[]): [] {
    return validateParams(params);
  }

  private async _gasPriceAction(): Promise<string> {
    return numberToRpcQuantity(await this._node.getGasPrice());
  }

  // eth_getBalance

  private _getBalanceParams(params: any[]): [Buffer, OptionalBlockTag] {
    return validateParams(params, rpcAddress, optionalBlockTag);
  }

  private async _getBalanceAction(
    address: Buffer,
    blockTag: OptionalBlockTag
  ): Promise<string> {
    this._validateBlockTag(blockTag);

    return numberToRpcQuantity(await this._node.getAccountBalance(address));
  }

  // eth_getBlockByHash

  private _getBlockByHashParams(params: any[]): [Buffer, boolean] {
    return validateParams(params, rpcHash, t.boolean);
  }

  private async _getBlockByHashAction(
    hash: Buffer,
    includeTransactions: boolean
  ): Promise<RpcBlockOutput | null> {
    const block = await this._node.getBlockByHash(hash);
    if (block === undefined) {
      return null;
    }

    const totalDifficulty = await this._node.getBlockTotalDifficulty(block);

    return getRpcBlock(block, totalDifficulty, includeTransactions);
  }

  // eth_getBlockByNumber

  private _getBlockByNumberParams(params: any[]): [OptionalBlockTag, boolean] {
    return validateParams(params, optionalBlockTag, t.boolean);
  }

  private async _getBlockByNumberAction(
    tag: OptionalBlockTag,
    includeTransactions: boolean
  ): Promise<RpcBlockOutput | null> {
    let block: Block;

    if (typeof tag === "string") {
      if (tag === "earliest" || tag === "pending") {
        throw new InvalidInputError(
          "eth_getBlockByNumber doesn't support earliest nor pending "
        );
      }

      block = await this._node.getLatestBlock();
    } else {
      // The tag can't be undefined because the includeTransactions param is
      // required.
      // TODO: Make this more explicit
      block = await this._node.getBlockByNumber(tag!);
    }

    if (block === undefined) {
      return null;
    }

    const totalDifficulty = await this._node.getBlockTotalDifficulty(block);

    return getRpcBlock(block, totalDifficulty, includeTransactions);
  }

  // eth_getBlockTransactionCountByHash

  private _getBlockTransactionCountByHashParams(params: any[]): [Buffer] {
    return validateParams(params, rpcHash);
  }

  private async _getBlockTransactionCountByHashAction(
    hash: Buffer
  ): Promise<string | null> {
    const block = await this._node.getBlockByHash(hash);
    if (block === undefined) {
      return null;
    }

    return numberToRpcQuantity(block.transactions.length);
  }

  // eth_getBlockTransactionCountByNumber

  private _getBlockTransactionCountByNumberParams(params: any[]): [BN] {
    return validateParams(params, rpcQuantity);
  }

  private async _getBlockTransactionCountByNumberAction(
    blockNumber: BN
  ): Promise<string | null> {
    const block = await this._node.getBlockByNumber(blockNumber);
    if (block === undefined) {
      return null;
    }

    return numberToRpcQuantity(block.transactions.length);
  }

  // eth_getCode

  private _getCodeParams(params: any[]): [Buffer, OptionalBlockTag] {
    return validateParams(params, rpcAddress, optionalBlockTag);
  }

  private async _getCodeAction(
    address: Buffer,
    blockTag: OptionalBlockTag
  ): Promise<string> {
    this._validateBlockTag(blockTag);

    return bufferToRpcData(await this._node.getCode(address));
  }

  // eth_getCompilers

  // eth_getFilterChanges

  private _getFilterChangesParams(params: any[]): [BN] {
    return validateParams(params, rpcQuantity);
  }

  private async _getFilterChangesAction(
    filterId: BN
  ): Promise<string[] | RpcLogOutput[] | null> {
    const id = filterId.toNumber();
    const changes = await this._node.getFilterChanges(id);
    if (changes === undefined) {
      return null;
    }

    return changes;
  }

  // eth_getFilterLogs

  private _getFilterLogsParams(params: any[]): [BN] {
    return validateParams(params, rpcQuantity);
  }

  private async _getFilterLogsAction(
    filterId: BN
  ): Promise<RpcLogOutput[] | null> {
    const id = filterId.toNumber();
    const changes = await this._node.getFilterLogs(id);
    if (changes === undefined) {
      return null;
    }

    return changes;
  }

  // eth_getLogs

  private _getLogsParams(params: any[]): [RpcFilterRequest] {
    return validateParams(params, rpcFilterRequest);
  }

  private async _rpcFilterRequestToGetLogsParams(
    filter: RpcFilterRequest
  ): Promise<FilterParams> {
    if (filter.blockHash !== undefined) {
      if (filter.fromBlock !== undefined || filter.toBlock !== undefined) {
        throw new InvalidArgumentsError(
          "blockHash is mutually exclusive with fromBlock/toBlock"
        );
      }
      const block = await this._node.getBlockByHash(filter.blockHash);
      if (block === undefined) {
        throw new InvalidArgumentsError("blockHash cannot be found");
      }

      filter.fromBlock = new BN(block.header.number);
      filter.toBlock = new BN(block.header.number);
    }

    return {
      fromBlock: this._extractBlock(filter.fromBlock),
      toBlock: this._extractBlock(filter.toBlock),
      topics: this._extractLogTopics(filter.topics),
      addresses: this._extractLogAddresses(filter.address)
    };
  }

  private async _getLogsAction(
    filter: RpcFilterRequest
  ): Promise<RpcLogOutput[]> {
    const filterParams = await this._rpcFilterRequestToGetLogsParams(filter);
    return this._node.getLogs(filterParams);
  }

  // eth_getProof

  // eth_getStorageAt

  private _getStorageAtParams(params: any[]): [Buffer, BN, OptionalBlockTag] {
    return validateParams(params, rpcAddress, rpcQuantity, optionalBlockTag);
  }

  private async _getStorageAtAction(
    address: Buffer,
    slot: BN,
    blockTag: OptionalBlockTag
  ): Promise<string> {
    this._validateBlockTag(blockTag);

    const data = await this._node.getStorageAt(address, slot);

    // data should always be 32 bytes, but we are imitating Ganache here.
    // Please read the comment in `getStorageAt`.
    if (data.length === 0) {
      return "0x0";
    }

    return bufferToRpcData(data);
  }

  // eth_getTransactionByBlockHashAndIndex

  private _getTransactionByBlockHashAndIndexParams(
    params: any[]
  ): [Buffer, BN] {
    return validateParams(params, rpcHash, rpcQuantity);
  }

  private async _getTransactionByBlockHashAndIndexAction(
    hash: Buffer,
    index: BN
  ): Promise<RpcTransactionOutput | null> {
    const i = index.toNumber();
    const block = await this._node.getBlockByHash(hash);
    if (block === undefined) {
      return null;
    }

    const tx = block.transactions[i];
    if (tx === undefined) {
      return null;
    }

    return getRpcTransaction(tx, block, i);
  }

  // eth_getTransactionByBlockNumberAndIndex

  private _getTransactionByBlockNumberAndIndexParams(params: any[]): [BN, BN] {
    return validateParams(params, rpcQuantity, rpcQuantity);
  }

  private async _getTransactionByBlockNumberAndIndexAction(
    blockNumber: BN,
    index: BN
  ): Promise<RpcTransactionOutput | null> {
    const i = index.toNumber();
    const block = await this._node.getBlockByNumber(blockNumber);
    if (block === undefined) {
      return null;
    }

    const tx = block.transactions[i];
    if (tx === undefined) {
      return null;
    }

    return getRpcTransaction(tx, block, i);
  }

  // eth_getTransactionByHash

  private _getTransactionByHashParams(params: any[]): [Buffer] {
    return validateParams(params, rpcHash);
  }

  private async _getTransactionByHashAction(
    hash: Buffer
  ): Promise<RpcTransactionOutput | null> {
    const tx = await this._node.getSuccessfulTransactionByHash(hash);
    if (tx === undefined) {
      return null;
    }

    const block = await this._node.getBlockByTransactionHash(hash);

    let index: number | undefined;
    if (block !== undefined) {
      const transactions: Transaction[] = block.transactions;
      const i = transactions.findIndex(bt => bt.hash().equals(hash));

      if (i !== -1) {
        index = i;
      }
    }

    return getRpcTransaction(tx, block, index);
  }

  // eth_getTransactionCount

  private _getTransactionCountParams(
    params: any[]
  ): [Buffer, OptionalBlockTag] {
    return validateParams(params, rpcAddress, optionalBlockTag);
  }

  private async _getTransactionCountAction(
    address: Buffer,
    blockTag: OptionalBlockTag
  ): Promise<string> {
    this._validateBlockTag(blockTag);

    return numberToRpcQuantity(await this._node.getAccountNonce(address));
  }

  // eth_getTransactionReceipt

  private _getTransactionReceiptParams(params: any[]): [Buffer] {
    return validateParams(params, rpcHash);
  }

  private async _getTransactionReceiptAction(
    hash: Buffer
  ): Promise<RpcTransactionReceiptOutput | null> {
    // We do not return receipts for failed transactions
    const tx = await this._node.getSuccessfulTransactionByHash(hash);

    if (tx === undefined) {
      return null;
    }

    const block = (await this._node.getBlockByTransactionHash(hash))!;

    const transactions: Transaction[] = block.transactions;
    const index = transactions.findIndex(bt => bt.hash().equals(hash));

    const txBlockResults = await this._node.getTxBlockResults(block);

    return getRpcTransactionReceipt(tx, block, index, txBlockResults!);
  }

  // eth_getUncleByBlockHashAndIndex

  // TODO: Implement

  // eth_getUncleByBlockNumberAndIndex

  // TODO: Implement

  // eth_getUncleCountByBlockHash

  // TODO: Implement

  // eth_getUncleCountByBlockNumber

  // TODO: Implement

  // eth_getWork

  // eth_hashrate

  // eth_mining

  private _miningParams(params: any[]): [] {
    return validateParams(params);
  }

  private async _miningAction(): Promise<boolean> {
    return false;
  }

  // eth_newBlockFilter

  private _newBlockFilterParams(params: any[]): [] {
    return [];
  }

  private async _newBlockFilterAction(): Promise<string> {
    const filterId = await this._node.newBlockFilter();
    return numberToRpcQuantity(filterId);
  }

  // eth_newFilter

  private _newFilterParams(params: any[]): [RpcFilterRequest] {
    return validateParams(params, rpcFilterRequest);
  }

  private async _newFilterAction(filter: RpcFilterRequest): Promise<string> {
    const filterParams = await this._rpcFilterRequestToGetLogsParams(filter);
    const filterId = await this._node.newFilter(filterParams);
    return numberToRpcQuantity(filterId);
  }

  // eth_newPendingTransactionFilter

  private _newPendingTransactionParams(params: any[]): [] {
    return [];
  }

  private async _newPendingTransactionAction(): Promise<string> {
    const filterId = await this._node.newPendingTransactionFilter();
    return numberToRpcQuantity(filterId);
  }

  // eth_pendingTransactions

  private _pendingTransactionsParams(params: any[]): [] {
    return [];
  }

  private async _pendingTransactionsAction(): Promise<RpcTransactionOutput[]> {
    const txs = await this._node.getPendingTransactions();
    return txs.map(tx => getRpcTransaction(tx));
  }

  // eth_protocolVersion

  // eth_sendRawTransaction

  private _sendRawTransactionParams(params: any[]): [Buffer] {
    return validateParams(params, rpcData);
  }

  private async _sendRawTransactionAction(rawTx: Buffer): Promise<string> {
    let tx: Transaction;
    try {
      tx = new Transaction(rawTx, { common: this._common });
    } catch (error) {
      if (error.message === "invalid remainder") {
        throw new InvalidInputError("Invalid transaction");
      }

      if (error.message.includes("EIP155")) {
        throw new InvalidInputError(error.message);
      }

      throw error;
    }

    await this._node.runTransactionInNewBlock(tx);

    return bufferToRpcData(tx.hash(true));
  }

  // eth_sendTransaction

  private _sendTransactionParams(params: any[]): [RpcTransactionRequest] {
    return validateParams(params, rpcTransactionRequest);
  }

  private async _sendTransactionAction(
    transactionRequest: RpcTransactionRequest
  ): Promise<string> {
    const txParams = await this._rpcTransactionRequestToNodeTransactionParams(
      transactionRequest
    );

    const tx = await this._node.getSignedTransaction(txParams);
    await this._node.runTransactionInNewBlock(tx);

    return bufferToRpcData(tx.hash(true));
  }

  // eth_sign

  private _signParams(params: any[]): [Buffer, Buffer] {
    return validateParams(params, rpcAddress, rpcData);
  }

  private async _signAction(address: Buffer, data: Buffer): Promise<string> {
    const signature = await this._node.signPersonalMessage(address, data);

    return toRpcSig(signature.v, signature.r, signature.s);
  }

  // eth_signTransaction

  // eth_signTypedData

  private _signTypedDataParams(params: any[]): [Buffer, any] {
    return validateParams(params, rpcAddress, rpcUnknown);
  }

  private async _signTypedDataAction(
    address: Buffer,
    typedData: any
  ): Promise<string> {
    return this._node.signTypedData(address, typedData);
  }

  // eth_submitHashrate

  // eth_submitWork

  private _subscribeParams(
    params: any[]
  ): [RpcSubscribeRequest, OptionalRpcFilterRequest, (emit: any) => {}] {
    if (params.length === 0) {
      throw new InvalidInputError("Notifications not supported");
    }

    if (params.length === 1) {
      throw new InvalidInputError(
        "Expected subscription name as first argument"
      );
    }

    const callback = params.pop();
    if (!(typeof callback === "function")) {
      throw new InvalidInputError("Notifications not supported");
    }

    const validatedParams: [
      RpcSubscribeRequest,
      OptionalRpcFilterRequest,
      (emit: any) => {}
    ] = validateParams(params, rpcSubscribeRequest, optionalRpcFilterRequest);

    validatedParams.push(callback);
    return validatedParams;
  }

  private async _subscribeAction(
    subscribeRequest: RpcSubscribeRequest,
    optionalFilterRequest: OptionalRpcFilterRequest,
    callback: (emit: any) => {}
  ): Promise<string> {
    let filterId: number;
    switch (subscribeRequest) {
      case "newHeads":
        filterId = await this._node.newBlockFilter(callback);
        return numberToRpcQuantity(filterId);
      case "newPendingTransactions":
        filterId = await this._node.newPendingTransactionFilter(callback);
        return numberToRpcQuantity(filterId);
      case "logs":
        if (optionalFilterRequest === undefined) {
          throw new InvalidArgumentsError("missing params argument");
        }

        const filterParams = await this._rpcFilterRequestToGetLogsParams(
          optionalFilterRequest
        );

        filterId = await this._node.newFilter(filterParams, callback);
        return numberToRpcQuantity(filterId);
    }
  }

  // eth_syncing

  private _syncingParams(params: any[]): [] {
    return validateParams(params);
  }

  private async _syncingAction(): Promise<boolean> {
    return false;
  }

  // eth_uninstallFilter

  private _uninstallFilterParams(params: any): [BN] {
    return validateParams(params, rpcQuantity);
  }

  private async _uninstallFilterAction(filterId: BN): Promise<boolean> {
    return this._node.uninstallFilter(filterId.toNumber(), false);
  }

  private _unsubscribeParams(params: any[]): [BN] {
    return validateParams(params, rpcQuantity);
  }

  private async _unsubscribeAction(filterId: BN): Promise<boolean> {
    return this._node.uninstallFilter(filterId.toNumber(), true);
  }

  // Utility methods

  private async _rpcCallRequestToNodeCallParams(
    rpcCall: RpcCallRequest
  ): Promise<CallParams> {
    return {
      to: rpcCall.to !== undefined ? rpcCall.to : Buffer.from([]),
      from:
        rpcCall.from !== undefined
          ? rpcCall.from
          : await this._getDefaultCallFrom(),
      data: rpcCall.data !== undefined ? rpcCall.data : toBuffer([]),
      gasLimit:
        rpcCall.gas !== undefined
          ? rpcCall.gas
          : await this._node.getBlockGasLimit(),
      gasPrice:
        rpcCall.gasPrice !== undefined
          ? rpcCall.gasPrice
          : await this._node.getGasPrice(),
      value: rpcCall.value !== undefined ? rpcCall.value : new BN(0)
    };
  }

  private async _rpcTransactionRequestToNodeTransactionParams(
    rpcTx: RpcTransactionRequest
  ): Promise<TransactionParams> {
    return {
      to: rpcTx.to !== undefined ? rpcTx.to : Buffer.from([]),
      from: rpcTx.from,
      gasLimit:
        rpcTx.gas !== undefined
          ? rpcTx.gas
          : await this._node.getBlockGasLimit(),
      gasPrice:
        rpcTx.gasPrice !== undefined
          ? rpcTx.gasPrice
          : await this._node.getGasPrice(),
      value: rpcTx.value !== undefined ? rpcTx.value : new BN(0),
      data: rpcTx.data !== undefined ? rpcTx.data : toBuffer([]),
      nonce:
        rpcTx.nonce !== undefined
          ? rpcTx.nonce
          : await this._node.getAccountNonce(rpcTx.from)
    };
  }

  private _validateBlockTag(blockTag: OptionalBlockTag) {
    // We only support latest and pending. As this provider doesn't have pending transactions, its
    // actually just latest.
    if (
      blockTag !== undefined &&
      blockTag !== "latest" &&
      blockTag !== "pending"
    ) {
      throw new InvalidInputError(
        "Only latest and pending block params are supported"
      );
    }
  }

  private _extractBlock(blockTag: OptionalBlockTag): number {
    switch (blockTag) {
      case "earliest":
        return 0;
      case undefined:
      case "latest":
        return -1;
      case "pending":
        throw new InvalidArgumentsError("pending not supported");
    }

    return blockTag.toNumber();
  }

  private _extractLogTopics(
    logTopics: LogTopics
  ): Array<Array<Buffer | null> | null> {
    if (logTopics === undefined || logTopics.length === 0) {
      return [];
    }

    const topics: Array<Array<Buffer | null> | null> = [];
    for (const logTopic of logTopics) {
      if (Buffer.isBuffer(logTopic)) {
        topics.push([logTopic]);
      } else {
        topics.push(logTopic);
      }
    }

    return topics;
  }

  private _extractLogAddresses(address: LogAddress): Buffer[] {
    if (address === undefined) {
      return [];
    }

    if (Buffer.isBuffer(address)) {
      return [address];
    }

    return address;
  }

  private async _getDefaultCallFrom(): Promise<Buffer> {
    const localAccounts = await this._node.getLocalAccountAddresses();

    if (localAccounts.length === 0) {
      return toBuffer(zeroAddress());
    }

    return toBuffer(localAccounts[0]);
  }
}
