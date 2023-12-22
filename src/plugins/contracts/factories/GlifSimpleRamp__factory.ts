/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  GlifSimpleRamp,
  GlifSimpleRampInterface,
} from "../GlifSimpleRamp";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_router",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_poolID",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "CallFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientFunds",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientLiquidity",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidPoolID",
    type: "error",
  },
  {
    inputs: [],
    name: "Unauthorized",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [],
    name: "burnIFIL",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "distribute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "iFIL",
    outputs: [
      {
        internalType: "contract IPoolToken",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "maxRedeem",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "maxWithdraw",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pool",
    outputs: [
      {
        internalType: "contract IPool",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "previewRedeem",
    outputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
    ],
    name: "previewWithdraw",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "recoverFIL",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "redeem",
    outputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "redeemF",
    outputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "refreshExtern",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalExitDemand",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "wFIL",
    outputs: [
      {
        internalType: "contract IWFIL",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "withdrawF",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x60c060405260006003553480156200001657600080fd5b50604051620020e5380380620020e5833981016040819052620000399162000376565b6001600160a01b03821660805260a0819052620000556200005d565b5050620003e1565b6200008d62000079608051620001b560201b6200145e1760201c565b60a0516200026260201b620014f91760201c565b600080546001600160a01b0319166001600160a01b0392909216918217905560408051630e5f46fb60e11b81529051631cbe8df6916004808201926020929091908290030181865afa158015620000e8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200010e9190620003a7565b600180546001600160a01b0319166001600160a01b03928316179055600054604080516338d52e0f60e01b8152905191909216916338d52e0f9160048083019260209291908290030181865afa1580156200016d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620001939190620003a7565b600280546001600160a01b0319166001600160a01b0392909216919091179055565b604080518082018252601481527f524f555445525f504f4f4c5f524547495354525900000000000000000000000060209091015251630d37324f60e11b8152631c86174160e11b60048201526000906001600160a01b03831690631a6e649e90602401602060405180830381865afa15801562000236573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200025c9190620003a7565b92915050565b6000826001600160a01b031663efde4e646040518163ffffffff1660e01b8152600401602060405180830381865afa158015620002a3573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620002c99190620003c7565b821115620002ea576040516311ebac6360e31b815260040160405180910390fd5b6040516341d1de9760e01b8152600481018390526001600160a01b038416906341d1de9790602401602060405180830381865afa15801562000330573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620003569190620003a7565b9392505050565b6001600160a01b03811681146200037357600080fd5b50565b600080604083850312156200038a57600080fd5b825162000397816200035d565b6020939093015192949293505050565b600060208284031215620003ba57600080fd5b815162000356816200035d565b600060208284031215620003da57600080fd5b5051919050565b60805160a051611ca66200043f60003960006103fc0152600081816103d60152818161065b0152818161077c015281816109e201528181610c4201528181610d5a01528181610e72015281816110a401526119630152611ca66000f3fe6080604052600436106100f75760003560e01c80639adf10501161008a578063ce96cb7711610059578063ce96cb77146102dc578063d905777e146102fc578063e8c9c4b71461031c578063fb9321081461033157610128565b80639adf1050146102675780639f40a7b31461027c578063a318c1a41461029c578063bef44256146102bc57610128565b806316f0115b116100c657806316f0115b146101da5780633eb569c6146102125780634cdad506146102275780636be82b781461024757610128565b80630a28a477146101525780630c462c5f146101855780630e0a7023146101a55780630fede599146101c557610128565b36610128576002546001600160a01b03163314610126576040516282b42960e81b815260040160405180910390fd5b005b6002546001600160a01b03163314610126576040516282b42960e81b815260040160405180910390fd5b34801561015e57600080fd5b5061017261016d366004611b59565b610351565b6040519081526020015b60405180910390f35b34801561019157600080fd5b506101726101a0366004611b87565b6105d6565b3480156101b157600080fd5b506101726101c0366004611b87565b6106f7565b3480156101d157600080fd5b50600354610172565b3480156101e657600080fd5b506000546101fa906001600160a01b031681565b6040516001600160a01b03909116815260200161017c565b34801561021e57600080fd5b5061012661080f565b34801561023357600080fd5b50610172610242366004611b59565b61095d565b34801561025357600080fd5b506001546101fa906001600160a01b031681565b34801561027357600080fd5b50610126610bb3565b34801561028857600080fd5b50610172610297366004611b87565b610bbd565b3480156102a857600080fd5b506101726102b7366004611b87565b610cd5565b3480156102c857600080fd5b506002546101fa906001600160a01b031681565b3480156102e857600080fd5b506101726102f7366004611bcf565b610ded565b34801561030857600080fd5b50610172610317366004611bcf565b61101f565b34801561032857600080fd5b506101266112c3565b34801561033d57600080fd5b5061012661034c366004611bec565b6113ab565b60008060009054906101000a90046001600160a01b03166001600160a01b031663b2bcb0026040518163ffffffff1660e01b8152600401602060405180830381865afa1580156103a5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103c99190611c18565b1561044d576104206103fa7f000000000000000000000000000000000000000000000000000000000000000061145e565b7f00000000000000000000000000000000000000000000000000000000000000006114f9565b6000546001600160a01b0390811691161461044d576040516282b42960e81b815260040160405180910390fd5b60008054906101000a90046001600160a01b03166001600160a01b0316635d66b00a6040518163ffffffff1660e01b8152600401602060405180830381865afa15801561049e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104c29190611c3a565b8211156104d157506000919050565b600154604080516318160ddd60e01b815290516000926001600160a01b0316916318160ddd9160048083019260209291908290030181865afa15801561051b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061053f9190611c3a565b905080156105cd576105c88160008054906101000a90046001600160a01b03166001600160a01b03166301e1d1146040518163ffffffff1660e01b8152600401602060405180830381865afa15801561059c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105c09190611c3a565b8591906115e6565b6105cf565b825b9392505050565b60008060009054906101000a90046001600160a01b03166001600160a01b031663b2bcb0026040518163ffffffff1660e01b8152600401602060405180830381865afa15801561062a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061064e9190611c18565b156106ac5761067f6103fa7f000000000000000000000000000000000000000000000000000000000000000061145e565b6000546001600160a01b039081169116146106ac576040516282b42960e81b815260040160405180910390fd5b82336001600160a01b038216146106d5576040516282b42960e81b815260040160405180910390fd5b6106de86610351565b91506106ee848684896001611614565b50949350505050565b60008060009054906101000a90046001600160a01b03166001600160a01b031663b2bcb0026040518163ffffffff1660e01b8152600401602060405180830381865afa15801561074b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061076f9190611c18565b156107cd576107a06103fa7f000000000000000000000000000000000000000000000000000000000000000061145e565b6000546001600160a01b039081169116146107cd576040516282b42960e81b815260040160405180910390fd5b82336001600160a01b038216146107f6576040516282b42960e81b815260040160405180910390fd5b6107ff8661095d565b91506106ee848688856001611614565b60025460408051630d0e30db60e41b8152905147926001600160a01b03169163d0e30db091849160048082019260009290919082900301818588803b15801561085757600080fd5b505af115801561086b573d6000803e3d6000fd5b50506002546000546040516370a0823160e01b81523060048201526001600160a01b03928316955063a9059cbb94509116915083906370a0823190602401602060405180830381865afa1580156108c6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108ea9190611c3a565b6040516001600160e01b031960e085901b1681526001600160a01b03909216600483015260248201526044016020604051808303816000875af1158015610935573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109599190611c18565b5050565b60008060009054906101000a90046001600160a01b03166001600160a01b031663b2bcb0026040518163ffffffff1660e01b8152600401602060405180830381865afa1580156109b1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109d59190611c18565b15610a3357610a066103fa7f000000000000000000000000000000000000000000000000000000000000000061145e565b6000546001600160a01b03908116911614610a33576040516282b42960e81b815260040160405180910390fd5b600154604080516318160ddd60e01b815290516000926001600160a01b0316916318160ddd9160048083019260209291908290030181865afa158015610a7d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610aa19190611c3a565b90508015610b2457600054604080516278744560e21b81529051610b1f926001600160a01b0316916301e1d1149160048083019260209291908290030181865afa158015610af3573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b179190611c3a565b8490836115e6565b610b26565b825b915060008054906101000a90046001600160a01b03166001600160a01b0316635d66b00a6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610b79573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b9d9190611c3a565b821115610bad5750600092915050565b50919050565b610bbb61195b565b565b60008060009054906101000a90046001600160a01b03166001600160a01b031663b2bcb0026040518163ffffffff1660e01b8152600401602060405180830381865afa158015610c11573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c359190611c18565b15610c9357610c666103fa7f000000000000000000000000000000000000000000000000000000000000000061145e565b6000546001600160a01b03908116911614610c93576040516282b42960e81b815260040160405180910390fd5b82336001600160a01b03821614610cbc576040516282b42960e81b815260040160405180910390fd5b610cc58661095d565b91506106ee848688856000611614565b60008060009054906101000a90046001600160a01b03166001600160a01b031663b2bcb0026040518163ffffffff1660e01b8152600401602060405180830381865afa158015610d29573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d4d9190611c18565b15610dab57610d7e6103fa7f000000000000000000000000000000000000000000000000000000000000000061145e565b6000546001600160a01b03908116911614610dab576040516282b42960e81b815260040160405180910390fd5b82336001600160a01b03821614610dd4576040516282b42960e81b815260040160405180910390fd5b610ddd86610351565b91506106ee848684896000611614565b60008060009054906101000a90046001600160a01b03166001600160a01b031663b2bcb0026040518163ffffffff1660e01b8152600401602060405180830381865afa158015610e41573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e659190611c18565b15610ec357610e966103fa7f000000000000000000000000000000000000000000000000000000000000000061145e565b6000546001600160a01b03908116911614610ec3576040516282b42960e81b815260040160405180910390fd5b6000546001546040516370a0823160e01b81526001600160a01b038581166004830152611019938116926307a2d13a929116906370a0823190602401602060405180830381865afa158015610f1c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f409190611c3a565b6040518263ffffffff1660e01b8152600401610f5e91815260200190565b602060405180830381865afa158015610f7b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f9f9190611c3a565b60008054906101000a90046001600160a01b03166001600160a01b0316635d66b00a6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610ff0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110149190611c3a565b611aa9565b92915050565b60008060009054906101000a90046001600160a01b03166001600160a01b031663b2bcb0026040518163ffffffff1660e01b8152600401602060405180830381865afa158015611073573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110979190611c18565b156110f5576110c86103fa7f000000000000000000000000000000000000000000000000000000000000000061145e565b6000546001600160a01b039081169116146110f5576040516282b42960e81b815260040160405180910390fd5b6001546040516370a0823160e01b81526001600160a01b038481166004830152909116906370a0823190602401602060405180830381865afa15801561113f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111639190611c3a565b600080546040516303d1689d60e11b81526004810184905292935090916001600160a01b03909116906307a2d13a90602401602060405180830381865afa1580156111b2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111d69190611c3a565b905060008054906101000a90046001600160a01b03166001600160a01b0316635d66b00a6040518163ffffffff1660e01b8152600401602060405180830381865afa158015611229573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061124d9190611c3a565b811115610bad5760005460408051632eb3580560e11b815290516105cf926001600160a01b031691635d66b00a9160048083019260209291908290030181865afa15801561129f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102429190611c3a565b6001546040516370a0823160e01b815230600482018190526001600160a01b0390921691639dc29fac9183906370a0823190602401602060405180830381865afa158015611315573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113399190611c3a565b6040516001600160e01b031960e085901b1681526001600160a01b03909216600483015260248201526044016020604051808303816000875af1158015611384573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113a89190611c18565b50565b6000546001600160a01b031633146113d5576040516282b42960e81b815260040160405180910390fd5b6002546000546040516323b872dd60e01b81526001600160a01b039182166004820152306024820152604481018490529116906323b872dd906064016020604051808303816000875af1158015611430573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114549190611c18565b5050600060035550565b6040805180820182526014815273524f555445525f504f4f4c5f524547495354525960601b60209091015251630d37324f60e11b8152631c86174160e11b60048201526000906001600160a01b03831690631a6e649e90602401602060405180830381865afa1580156114d5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110199190611c53565b6000826001600160a01b031663efde4e646040518163ffffffff1660e01b8152600401602060405180830381865afa158015611539573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061155d9190611c3a565b82111561157d576040516311ebac6360e31b815260040160405180910390fd5b6040516341d1de9760e01b8152600481018390526001600160a01b038416906341d1de9790602401602060405180830381865afa1580156115c2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105cf9190611c53565b8282028115158415858304851417166115fe57600080fd5b6001826001830304018115150290509392505050565b6001600160a01b03841693506001600160a01b038516945060008054906101000a90046001600160a01b03166001600160a01b0316635d66b00a6040518163ffffffff1660e01b8152600401602060405180830381865afa15801561167d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116a19190611c3a565b8211156116c15760405163bb55fd2760e01b815260040160405180910390fd5b6001546040516323b872dd60e01b81526001600160a01b03878116600483015230602483015260448201869052909116906323b872dd906064016020604051808303816000875af115801561171a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061173e9190611c18565b50600154604051632770a7eb60e21b8152306004820152602481018590526001600160a01b0390911690639dc29fac906044016020604051808303816000875af1158015611790573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117b49190611c18565b5060038290556000805460408051630e37fd2760e21b815290516001600160a01b03909216926338dff49c9260048084019382900301818387803b1580156117fb57600080fd5b505af115801561180f573d6000803e3d6000fd5b50505050801561189057600254604051632e1a7d4d60e01b8152600481018490526001600160a01b0390911690632e1a7d4d90602401600060405180830381600087803b15801561185f57600080fd5b505af1158015611873573d6000803e3d6000fd5b5061188b925050506001600160a01b03851683611abf565b611909565b60025460405163a9059cbb60e01b81526001600160a01b038681166004830152602482018590529091169063a9059cbb906044016020604051808303816000875af11580156118e3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119079190611c18565b505b60408051838152602081018590526001600160a01b03808816929087169183917ffbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db910160405180910390a45050505050565b6119876103fa7f000000000000000000000000000000000000000000000000000000000000000061145e565b600080546001600160a01b0319166001600160a01b0392909216918217905560408051630e5f46fb60e11b81529051631cbe8df6916004808201926020929091908290030181865afa1580156119e1573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a059190611c53565b600180546001600160a01b0319166001600160a01b03928316179055600054604080516338d52e0f60e01b8152905191909216916338d52e0f9160048083019260209291908290030181865afa158015611a63573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a879190611c53565b600280546001600160a01b0319166001600160a01b0392909216919091179055565b6000818310611ab857816105cf565b5090919050565b80471015611ae05760405163356680b760e01b815260040160405180910390fd5b6000826001600160a01b03168260405160006040518083038185875af1925050503d8060008114611b2d576040519150601f19603f3d011682016040523d82523d6000602084013e611b32565b606091505b5050905080611b5457604051633204506f60e01b815260040160405180910390fd5b505050565b600060208284031215611b6b57600080fd5b5035919050565b6001600160a01b03811681146113a857600080fd5b60008060008060808587031215611b9d57600080fd5b843593506020850135611baf81611b72565b92506040850135611bbf81611b72565b9396929550929360600135925050565b600060208284031215611be157600080fd5b81356105cf81611b72565b60008060408385031215611bff57600080fd5b8235611c0a81611b72565b946020939093013593505050565b600060208284031215611c2a57600080fd5b815180151581146105cf57600080fd5b600060208284031215611c4c57600080fd5b5051919050565b600060208284031215611c6557600080fd5b81516105cf81611b7256fea26469706673582212204b7faad2a31118d403d871a8934178c0ea5deeddc2e509e94ff00fa33b6438db64736f6c63430008110033";

type GlifSimpleRampConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: GlifSimpleRampConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class GlifSimpleRamp__factory extends ContractFactory {
  constructor(...args: GlifSimpleRampConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _router: string,
    _poolID: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<GlifSimpleRamp> {
    return super.deploy(
      _router,
      _poolID,
      overrides || {}
    ) as Promise<GlifSimpleRamp>;
  }
  override getDeployTransaction(
    _router: string,
    _poolID: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): TransactionRequest {
    return super.getDeployTransaction(_router, _poolID, overrides || {});
  }
  override attach(address: string): GlifSimpleRamp {
    return super.attach(address) as GlifSimpleRamp;
  }
  override connect(signer: Signer): GlifSimpleRamp__factory {
    return super.connect(signer) as GlifSimpleRamp__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GlifSimpleRampInterface {
    return new utils.Interface(_abi) as GlifSimpleRampInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): GlifSimpleRamp {
    return new Contract(address, _abi, signerOrProvider) as GlifSimpleRamp;
  }
}