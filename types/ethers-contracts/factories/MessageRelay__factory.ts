/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { MessageRelay, MessageRelayInterface } from "../MessageRelay";

const _abi = [
  {
    inputs: [],
    name: "MessageRelay__AddressAlreadyRegistered",
    type: "error",
  },
  {
    inputs: [],
    name: "MessageRelay__InvalidMessage",
    type: "error",
  },
  {
    inputs: [],
    name: "MessageRelay__InvalidUsername",
    type: "error",
  },
  {
    inputs: [],
    name: "MessageRelay__NoMessage",
    type: "error",
  },
  {
    inputs: [],
    name: "MessageRelay__NoPublicKey",
    type: "error",
  },
  {
    inputs: [],
    name: "MessageRelay__NoUser",
    type: "error",
  },
  {
    inputs: [],
    name: "MessageRelay__UsernameAlreadyExists",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "fromUsername",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "toAddress",
        type: "address",
      },
    ],
    name: "MessageDeleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "fromAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "string",
        name: "toUsername",
        type: "string",
      },
    ],
    name: "MessageSent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
    ],
    name: "PublicKeyUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
    ],
    name: "UserAdded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "username",
        type: "string",
      },
      {
        internalType: "string",
        name: "publicKey",
        type: "string",
      },
    ],
    name: "addUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "publicKey",
        type: "string",
      },
    ],
    name: "changeUserPublicKey",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "fromUsername",
        type: "string",
      },
    ],
    name: "deleteMessageFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "fromUsername",
        type: "string",
      },
    ],
    name: "getMessage",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "content",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
        ],
        internalType: "struct MessageRelay.Message",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "username",
        type: "string",
      },
    ],
    name: "getPublicKey",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
    ],
    name: "getUsername",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "fromUsername",
        type: "string",
      },
    ],
    name: "hasMessageFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "toUsername",
        type: "string",
      },
    ],
    name: "hasMessageTo",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "username",
        type: "string",
      },
      {
        internalType: "string",
        name: "content",
        type: "string",
      },
    ],
    name: "sendMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50611a77806100206000396000f3fe6080604052600436106100865760003560e01c8063999d849611610059578063999d84961461014a578063b5ff97cc14610166578063bff90821146101a3578063ce43c032146101e0578063d7554a681461021d57610086565b80630d1317ad1461008b57806310ddb74a146100a75780631b95c00e146100e45780636fb6df4314610121575b600080fd5b6100a560048036038101906100a0919061158d565b610246565b005b3480156100b357600080fd5b506100ce60048036038101906100c9919061158d565b6104b0565b6040516100db9190611604565b60405180910390f35b3480156100f057600080fd5b5061010b6004803603810190610106919061158d565b6105f8565b6040516101189190611604565b60405180910390f35b34801561012d57600080fd5b506101486004803603810190610143919061161f565b610740565b005b610164600480360381019061015f919061158d565b6108b9565b005b34801561017257600080fd5b5061018d6004803603810190610188919061158d565b610941565b60405161019a9190611788565b60405180910390f35b3480156101af57600080fd5b506101ca60048036038101906101c591906117aa565b610ac8565b6040516101d7919061183d565b60405180910390f35b3480156101ec57600080fd5b506102076004803603810190610202919061185f565b610bba565b604051610214919061183d565b60405180910390f35b34801561022957600080fd5b50610244600480360381019061023f919061161f565b610ccd565b005b600061025182610fe9565b90506000600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206040518060400160405290816000820180546102ec906118bb565b80601f0160208091040260200160405190810160405280929190818152602001828054610318906118bb565b80156103655780601f1061033a57610100808354040283529160200191610365565b820191906000526020600020905b81548152906001019060200180831161034857829003601f168201915b505050505081526020016001820154815250509050600081600001515114156103ba576040517fe8e1ae7f00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000808201600061044791906112d8565b600182016000905550508373ffffffffffffffffffffffffffffffffffffffff16836040516104769190611929565b60405180910390207feafc7b58cbe9723af1819004d0606ea3f8ab3c9bb72b2f56f87fbcb0f85fe95260405160405180910390a350505050565b6000806104bc83610fe9565b90506000600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020604051806040016040529081600082018054610557906118bb565b80601f0160208091040260200160405190810160405280929190818152602001828054610583906118bb565b80156105d05780601f106105a5576101008083540402835291602001916105d0565b820191906000526020600020905b8154815290600101906020018083116105b357829003601f168201915b5050505050815260200160018201548152505090506000816000015151119250505092915050565b60008061060483610fe9565b90506000600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060405180604001604052908160008201805461069f906118bb565b80601f01602080910402602001604051908101604052809291908181526020018280546106cb906118bb565b80156107185780601f106106ed57610100808354040283529160200191610718565b820191906000526020600020905b8154815290600101906020018083116106fb57829003601f168201915b5050505050815260200160018201548152505090506000816000015151119250505092915050565b6107498161109d565b61077f576040517f4cd3f55000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600061078a83610fe9565b9050600060405180604001604052808481526020016103e8426107ad919061196f565b815250905080600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082015181600001908051906020019061084b929190611318565b5060208201518160010155905050836040516108679190611929565b60405180910390208573ffffffffffffffffffffffffffffffffffffffff167f0d7fccda06d6eb51c23cbd16d49b9b3f3ebafb002dba1b074895cbb35d0e813060405160405180910390a35050505050565b60006108c483610bba565b9050816002826040516108d79190611929565b908152602001604051809103902090805190602001906108f8929190611318565b508273ffffffffffffffffffffffffffffffffffffffff167fb271354cc576cf2f300578d66b29a893ca286f9d22d5a4998cab34754322166360405160405180910390a2505050565b61094961139e565b600061095483610fe9565b90506000600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206040518060400160405290816000820180546109ef906118bb565b80601f0160208091040260200160405190810160405280929190818152602001828054610a1b906118bb565b8015610a685780601f10610a3d57610100808354040283529160200191610a68565b820191906000526020600020905b815481529060010190602001808311610a4b57829003601f168201915b50505050508152602001600182015481525050905060008160000151511415610abd576040517fe8e1ae7f00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b809250505092915050565b60606000600283604051610adc9190611929565b90815260200160405180910390208054610af5906118bb565b80601f0160208091040260200160405190810160405280929190818152602001828054610b21906118bb565b8015610b6e5780601f10610b4357610100808354040283529160200191610b6e565b820191906000526020600020905b815481529060010190602001808311610b5157829003601f168201915b50505050509050600081511415610bb1576040517f85b0bad200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b80915050919050565b60606000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208054610c08906118bb565b80601f0160208091040260200160405190810160405280929190818152602001828054610c34906118bb565b8015610c815780601f10610c5657610100808354040283529160200191610c81565b820191906000526020600020905b815481529060010190602001808311610c6457829003601f168201915b50505050509050600081511415610cc4576040517f8ad1a19d00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b80915050919050565b610cd6826110b9565b610d0c576040517ff93d5b8d00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208054610d58906118bb565b80601f0160208091040260200160405190810160405280929190818152602001828054610d84906118bb565b8015610dd15780601f10610da657610100808354040283529160200191610dd1565b820191906000526020600020905b815481529060010190602001808311610db457829003601f168201915b505050505090506000815114610e13576040517f7eb8190b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008084604051610e249190611929565b908152602001604051809103902060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610ebb576040517f2435647e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b84600085604051610ecc9190611929565b908152602001604051809103902060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555083600160008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209080519060200190610f6b929190611318565b5082600285604051610f7d9190611929565b90815260200160405180910390209080519060200190610f9e929190611318565b508473ffffffffffffffffffffffffffffffffffffffff167f19ef9a4877199f89440a26acb26895ec02ed86f2df1aeaa90dc18041b892f71f60405160405180910390a25050505050565b600080600083604051610ffc9190611929565b908152602001604051809103902060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415611094576040517f8ad1a19d00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b80915050919050565b60008082511180156110b25750610400825111155b9050919050565b600080829050610100815111806110d1575060048151105b156110e05760009150506112d3565b6000805b82518110156112cc576000838281518110611102576111016119c9565b5b602001015160f81c60f81b9050603060f81b817effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161015801561116b5750603960f81b817effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191611155b1580156111d15750604160f81b817effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916101580156111cf5750605a60f81b817effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191611155b155b80156112365750606160f81b817effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916101580156112345750607a60f81b817effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191611155b155b80156112685750605f60f81b817effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614155b1561127a5760009450505050506112d3565b605f60f81b817effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916141580156112ae575082155b156112b857600192505b5080806112c4906119f8565b9150506110e4565b5080925050505b919050565b5080546112e4906118bb565b6000825580601f106112f65750611315565b601f01602090049060005260206000209081019061131491906113b8565b5b50565b828054611324906118bb565b90600052602060002090601f016020900481019282611346576000855561138d565b82601f1061135f57805160ff191683800117855561138d565b8280016001018555821561138d579182015b8281111561138c578251825591602001919060010190611371565b5b50905061139a91906113b8565b5090565b604051806040016040528060608152602001600081525090565b5b808211156113d15760008160009055506001016113b9565b5090565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000611414826113e9565b9050919050565b61142481611409565b811461142f57600080fd5b50565b6000813590506114418161141b565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61149a82611451565b810181811067ffffffffffffffff821117156114b9576114b8611462565b5b80604052505050565b60006114cc6113d5565b90506114d88282611491565b919050565b600067ffffffffffffffff8211156114f8576114f7611462565b5b61150182611451565b9050602081019050919050565b82818337600083830152505050565b600061153061152b846114dd565b6114c2565b90508281526020810184848401111561154c5761154b61144c565b5b61155784828561150e565b509392505050565b600082601f83011261157457611573611447565b5b813561158484826020860161151d565b91505092915050565b600080604083850312156115a4576115a36113df565b5b60006115b285828601611432565b925050602083013567ffffffffffffffff8111156115d3576115d26113e4565b5b6115df8582860161155f565b9150509250929050565b60008115159050919050565b6115fe816115e9565b82525050565b600060208201905061161960008301846115f5565b92915050565b600080600060608486031215611638576116376113df565b5b600061164686828701611432565b935050602084013567ffffffffffffffff811115611667576116666113e4565b5b6116738682870161155f565b925050604084013567ffffffffffffffff811115611694576116936113e4565b5b6116a08682870161155f565b9150509250925092565b600081519050919050565b600082825260208201905092915050565b60005b838110156116e45780820151818401526020810190506116c9565b838111156116f3576000848401525b50505050565b6000611704826116aa565b61170e81856116b5565b935061171e8185602086016116c6565b61172781611451565b840191505092915050565b6000819050919050565b61174581611732565b82525050565b6000604083016000830151848203600086015261176882826116f9565b915050602083015161177d602086018261173c565b508091505092915050565b600060208201905081810360008301526117a2818461174b565b905092915050565b6000602082840312156117c0576117bf6113df565b5b600082013567ffffffffffffffff8111156117de576117dd6113e4565b5b6117ea8482850161155f565b91505092915050565b600082825260208201905092915050565b600061180f826116aa565b61181981856117f3565b93506118298185602086016116c6565b61183281611451565b840191505092915050565b600060208201905081810360008301526118578184611804565b905092915050565b600060208284031215611875576118746113df565b5b600061188384828501611432565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806118d357607f821691505b602082108114156118e7576118e661188c565b5b50919050565b600081905092915050565b6000611903826116aa565b61190d81856118ed565b935061191d8185602086016116c6565b80840191505092915050565b600061193582846118f8565b915081905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061197a82611732565b915061198583611732565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156119be576119bd611940565b5b828202905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6000611a0382611732565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415611a3657611a35611940565b5b60018201905091905056fea264697066735822122041f1671dffe366d35913f61012f3fd760c3f3f197d5c5a3ceeb95f258e4f843364736f6c63430008090033";

type MessageRelayConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MessageRelayConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MessageRelay__factory extends ContractFactory {
  constructor(...args: MessageRelayConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MessageRelay> {
    return super.deploy(overrides || {}) as Promise<MessageRelay>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): MessageRelay {
    return super.attach(address) as MessageRelay;
  }
  override connect(signer: Signer): MessageRelay__factory {
    return super.connect(signer) as MessageRelay__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MessageRelayInterface {
    return new utils.Interface(_abi) as MessageRelayInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MessageRelay {
    return new Contract(address, _abi, signerOrProvider) as MessageRelay;
  }
}
