## Tellete (WIP)

From the combination of the word "tell" and "delete", this is a decentralized messaging app that focuses on privacy.

This uses the smart contract [MessageRelay](https://github.com/jethrocabaluna/tellete-contracts) and the main functionality is that upon receiving a message from another user, that message will be deleted on the contract's state as well.

The messages and contacts are saved on the localStorage in which you are free to clear anytime.

With the use of asymmetric encryption, the messages on the localStorage and the smart contract's state are encrypted, and can only be decrypted by the receiver.

Users can register with Metamask, by connecting your wallet and using a new username which will be linked to your public address.

### NOTE

This is still an ongoing project. There are still many things left to do to make this more usable. But this can be tried now.

### How to use

1. Connect your metamask account to the web app
2. Sign-up with your unique username
3. You must accept signing the transaction for authorization and authentication purposes
4. Once it succeeds creating your account, copy the generated private key and save it somewhere safe (this will be like your password for your next sessions)
5. Add contacts (it will be saved on the local storage only)
6. Select a contact and if it is registered in the smart contract by another user, you can send/receive a message to/from that contact
7. The message will only be received when the other user wants to receive it on their end by clicking the "Get message" from you
8. The message will be deleted on the smart contract's state once it is received

The messages saved on the local storage are encrypted and can only be decrypted using your private key.

The message for the receiver saved on the contract's state is encrypted and can only be decrypted by the sender's public key.
