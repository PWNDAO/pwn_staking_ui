import to from '@/utils/await-to-js'
import type { Abi, Address, ContractFunctionArgs, ContractFunctionName, TransactionReceipt } from 'viem'
import { getAccount, getBlockNumber, getPublicClient, getTransaction, getTransactionReceipt, switchChain, waitForTransactionReceipt, watchContractEvent, writeContract } from '@wagmi/vue/actions'
import type { WriteContractVariables } from '@wagmi/vue/query'
import type { AnyFunction, IntervalId } from '@/types/customTypes'
// import type { ToastStep } from '@/modules/common/notifications/useToastsStore'
import { safeWalletAbi } from '@/constants/abis'
import { useConnectedAccountTypeStore } from '@/utils/web3/useConnectedAccountTypeStore'
import {wagmiAdapter} from "@/wagmi"
import type { PwnWagmiConfig } from '@/wagmi'

/* eslint-disable no-console */

export interface SendTransactionHooks {
    onWriteContractSuccess?: AnyFunction
    onTxConfirmSuccess?: AnyFunction
    onWriteContractError?: AnyFunction
    onTxConfirmError?: AnyFunction
}

export interface SendTransactionOptions {
    hooks?: SendTransactionHooks
    step?: any
}

export async function getSafeWalletThreshold(safeAddress: Address, chainId: number) {
    const publicClient = getPublicClient(wagmiAdapter.wagmiConfig, { chainId })

    if (!publicClient) {
        throw new Error('Public client not found')
    }

    const threshold = await publicClient.readContract({
        address: safeAddress,
        abi: safeWalletAbi,
        functionName: 'getThreshold',
    })

    return Number(threshold)
}

// TODO change type of transaction parameter to always have chainId filled, right now it's marked as optional
//  and also allows undefined value, which we should not allow
export async function sendTransaction<
    const TAbi extends Abi,
    TFunctionName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'>,
    TArgs extends ContractFunctionArgs<TAbi, 'nonpayable' | 'payable', TFunctionName>
>(
    transaction: WriteContractVariables<TAbi, TFunctionName, TArgs, PwnWagmiConfig, PwnWagmiConfig['chains'][number]['id']>,
    { hooks, step }: SendTransactionOptions = {},
): Promise<TransactionReceipt> {
    console.log('Starting to send a transaction with following parameters:')
    console.log(transaction)
    //console.log(`Additional UI parameter passed to sendTransaction: step=${step?.text}, safeAddress=${safeAddress}`)

    const connectedChainId = getAccount(wagmiAdapter.wagmiConfig).chainId
    console.log(`connectedChainId=${connectedChainId}; transaction.chainId=${transaction.chainId}`)

    if (connectedChainId !== transaction.chainId) {
        console.log(`Switching chain from ${connectedChainId} to ${transaction.chainId}.`)
        const switchedChain = await switchChain(wagmiAdapter.wagmiConfig, { chainId: transaction.chainId! })
        if (switchedChain.id !== transaction.chainId) {
            throw new Error('User denied switching chains before sending a tx.')
        }
    }

    const { address: userAddress } = getAccount(wagmiAdapter.wagmiConfig)


    // txHash:
    //    1) EOA: real transaction hash
    //    2) Safe{Wallet} with threshold === 1: real transaction hash
    //    3) Safe{Wallet} with threshold > 1: safeTxHash (real transaction hash is different and gets filled only after the threshold signatures are collected)
    const [writeTxError, txHash] = await to(writeContract(wagmiAdapter.wagmiConfig, transaction))
    if (writeTxError || !txHash) {
        if (hooks?.onWriteContractError) {
            hooks.onWriteContractError()
        }
        throw writeTxError
    }

    console.log(`Transaction hash: ${txHash}`)
    if (hooks?.onWriteContractSuccess) {
        hooks.onWriteContractSuccess()
    }

    let threshold: number | undefined
    if (useConnectedAccountTypeStore().isConnectedContractWallet && userAddress) {
        threshold = await getSafeWalletThreshold(userAddress, transaction.chainId!)
        console.log('multisig threshold', threshold)
    }

    if (step && (!threshold || threshold === 1)) {
        try {
            // here the txHash can mean 2 different values:
            //  a) EOA + multisig with threshold === 1: txHash === final => txHash that we can link to etherscan
            //  b) multisig with threshold > 1: txHash === safeTxHash => internal safe tx hash, we should not
            //  assign this hash to the toast tx link as it would lead to non existent / incorrect tx
            await getTransaction(wagmiAdapter.wagmiConfig, {
                hash: txHash,
                chainId: transaction.chainId,
            })
            step.txHash = txHash
            // if it's safeTxHash, get getTransaction call throws TransactionNotFoundError
        } catch (error) {}
    }

    let txReceipt: TransactionReceipt | undefined
    let confirmTxError: Error | null = null
    if (useConnectedAccountTypeStore().isConnectedContractWallet) {
        const contractWalletAddress = getAccount(wagmiAdapter.wagmiConfig).address!

        txReceipt = await new Promise<TransactionReceipt>((resolve) => {
            const contractEventParameters = {
                abi: safeWalletAbi,
                address: contractWalletAddress,
                eventName: 'ExecutionSuccess',
                chainId: transaction.chainId,
            } as const

            const unwatch = watchContractEvent(wagmiAdapter.wagmiConfig, {
                ...contractEventParameters,
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                async onLogs(logs) {
                    console.log('Received following logs from the contract wallet: ')
                    console.log(logs)

                    const log = logs.find(_log => _log.args?.txHash === txHash || _log.transactionHash === txHash)

                    // because the threshold is > 1, returned txHash from writeContract is just
                    // internal safeTxHash and not the txHash of the tx that you can find on etherscan
                    // We take the first log received from safe wallet,
                    // which should be the one we're looking for because of the queue in safe TODO: Exists a more reliable way?
                    if (step && logs[0]?.transactionHash && threshold && threshold > 1) {
                        unwatch()
                        step.txHash = logs[0].transactionHash
                        const txReceipt = await getTransactionReceipt(wagmiAdapter.wagmiConfig, { hash: logs[0].transactionHash, chainId: transaction.chainId })
                        console.log('Contract wallet has successfully executed a transaction!')
                        resolve(txReceipt)
                    }

                    if (log) {
                        unwatch()
                        const txReceipt = await getTransactionReceipt(wagmiAdapter.wagmiConfig, { hash: log.transactionHash, chainId: transaction.chainId })
                        console.log('Contract wallet has successfully executed a transaction!')
                        resolve(txReceipt)
                    }
                },
            })
            console.log(`Waiting for ExecutionSuccess event on contract wallet on address=${contractWalletAddress} and chain ID=${transaction.chainId}.`)

            // it can also happen that the tx event already happened before setting up a watched, so we need to also
            // look at past X blocks to see if the event is there
            getBlockNumber(wagmiAdapter.wagmiConfig, { chainId: transaction.chainId })
                .then(currentBlockNumber => {
                    return getPublicClient(wagmiAdapter.wagmiConfig, { chainId: transaction.chainId! })!.getContractEvents({
                        ...contractEventParameters,
                        fromBlock: currentBlockNumber - 500n,
                    })
                }).then(logs => {
                const log = logs.find(_log => _log.args?.txHash === txHash || _log.transactionHash === txHash)

                if (log) {
                    console.log('Found a corresponding event from a transaction execution in the past blocks.')
                    console.log(log)
                    unwatch()
                    if (step && !step.txHash) {
                        // if the step was passed, but the step.txHash is not filled, it means that the tx
                        // was sent by the Safe multisig with threshold > 1, where the actually returned txHash
                        // from writeContract is just internal safeTxHash and not the txHash of the tx
                        // that you can find on etherscan... if that's the case, we assign the txHash here
                        step.txHash = log.transactionHash
                    }
                    return getTransactionReceipt(wagmiAdapter.wagmiConfig, { hash: log.transactionHash, chainId: transaction.chainId })
                }
            }).then(txReceipt => {
                if (txReceipt) {
                    console.log('Contract wallet has successfully executed a transaction!')
                    resolve(txReceipt)
                }
            }).catch(err => {
                console.error('Error while getting a past safe wallet ExecutionSuccess events.')
                console.error(err)
            })
        })
    } else {
        let intervalId: IntervalId | undefined
        if (step) {
            const TOO_LONG_TIME = 30000
            const INTERVAL_TIME = 500
            let elapsedTime = 0
            intervalId = setInterval(() => {
                if (elapsedTime >= TOO_LONG_TIME) {
                    step.isRunningLong = true
                }
                elapsedTime += INTERVAL_TIME
            }, INTERVAL_TIME)
        }

        [confirmTxError, txReceipt] = await to(waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash: txHash, chainId: transaction.chainId, retryCount: 10 }))

        if (intervalId !== undefined) {
            clearInterval(intervalId)
            if (step?.isRunningLong) {
                step.isRunningLong = false
            }
        }
    }

    if (confirmTxError || !txReceipt) {
        if (hooks?.onTxConfirmError) {
            hooks.onTxConfirmError()
        }
        throw confirmTxError
    }

    console.log('Tx receipt: ')
    console.log(txReceipt)

    if (hooks?.onTxConfirmSuccess) {
        hooks.onTxConfirmSuccess()
    }

    return txReceipt
}
/* eslint-enable no-console */
