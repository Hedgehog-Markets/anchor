import { PublicKey } from "@solana/web3.js";
import { Program } from "../program/index.js";
import Provider from "../provider.js";
import { SplTokenCoder } from "../coder/spl-token/index.js";

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

export function program(provider?: Provider): Program<SplToken> {
  return new Program<SplToken>(IDL, TOKEN_PROGRAM_ID, provider, coder());
}

export function coder(): SplTokenCoder {
  return new SplTokenCoder(IDL);
}

/**
 * SplToken IDL.
 */
export type SplToken = {
  version: "0.1.0";
  name: "spl_token";
  instructions: [
    {
      name: "initializeMint";
      accounts: [
        {
          name: "mint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "decimals";
          type: "u8";
        },
        {
          name: "mintAuthority";
          type: "publicKey";
        },
        {
          name: "freezeAuthority";
          type: {
            coption: "publicKey";
          };
        }
      ];
    },
    {
      name: "initializeAccount";
      accounts: [
        {
          name: "account";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "initializeMultisig";
      accounts: [
        {
          name: "account";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "m";
          type: "u8";
        }
      ];
    },
    {
      name: "transfer";
      accounts: [
        {
          name: "source";
          isMut: true;
          isSigner: false;
        },
        {
          name: "destination";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "approve";
      accounts: [
        {
          name: "source";
          isMut: true;
          isSigner: false;
        },
        {
          name: "delegate";
          isMut: false;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "revoke";
      accounts: [
        {
          name: "source";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        }
      ];
      args: [];
    },
    {
      name: "setAuthority";
      accounts: [
        {
          name: "mint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "authorityType";
          type: "u8";
        },
        {
          name: "newAuthority";
          type: {
            coption: "publicKey";
          };
        }
      ];
    },
    {
      name: "mintTo";
      accounts: [
        {
          name: "mint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "to";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "burn";
      accounts: [
        {
          name: "source";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "closeAccount";
      accounts: [
        {
          name: "account";
          isMut: true;
          isSigner: false;
        },
        {
          name: "destination";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "freezeAccount";
      accounts: [
        {
          name: "account";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        }
      ];
      args: [];
    },
    {
      name: "thawAccount";
      accounts: [
        {
          name: "account";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        }
      ];
      args: [];
    },
    {
      name: "transferChecked";
      accounts: [
        {
          name: "source";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "destination";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
        {
          name: "decimals";
          type: "u8";
        }
      ];
    },
    {
      name: "approveChecked";
      accounts: [
        {
          name: "source";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "delegate";
          isMut: false;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
        {
          name: "decimals";
          type: "u8";
        }
      ];
    },
    {
      name: "mintToChecked";
      accounts: [
        {
          name: "mint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "to";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
        {
          name: "decimals";
          type: "u8";
        }
      ];
    },
    {
      name: "burnChecked";
      accounts: [
        {
          name: "source";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
        {
          name: "decimals";
          type: "u8";
        }
      ];
    },
    {
      name: "initializeAccount2";
      accounts: [
        {
          name: "account";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "authority";
          type: "publicKey";
        }
      ];
    },
    {
      name: "syncNative";
      accounts: [
        {
          name: "account";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "initializeAccount3";
      accounts: [
        {
          name: "account";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "authority";
          type: "publicKey";
        }
      ];
    },
    {
      name: "initializeMultisig2";
      accounts: [
        {
          name: "account";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "m";
          type: "u8";
        }
      ];
    },
    {
      name: "initializeMint2";
      accounts: [
        {
          name: "mint";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "decimals";
          type: "u8";
        },
        {
          name: "mintAuthority";
          type: "publicKey";
        },
        {
          name: "freezeAuthority";
          type: {
            coption: "publicKey";
          };
        }
      ];
    }
  ];
  accounts: [
    {
      name: "mint";
      type: {
        kind: "struct";
        fields: [
          {
            name: "mintAuthority";
            type: {
              coption: "publicKey";
            };
          },
          {
            name: "supply";
            type: "u64";
          },
          {
            name: "decimals";
            type: "u8";
          },
          {
            name: "isInitialized";
            type: "bool";
          },
          {
            name: "freezeAuthority";
            type: {
              coption: "publicKey";
            };
          }
        ];
      };
    },
    {
      name: "token";
      type: {
        kind: "struct";
        fields: [
          {
            name: "mint";
            type: "publicKey";
          },
          {
            name: "authority";
            type: "publicKey";
          },
          {
            name: "amount";
            type: "u64";
          },
          {
            name: "delegate";
            type: {
              coption: "publicKey";
            };
          },
          {
            name: "state";
            type: "u8";
          },
          {
            name: "isNative";
            type: {
              coption: "u64";
            };
          },
          {
            name: "delegatedAmount";
            type: "u64";
          },
          {
            name: "closeAuthority";
            type: {
              coption: "publicKey";
            };
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 0;
      name: "NotRentExempt";
      msg: "Lamport balance below rent-exempt threshold";
    },
    {
      code: 1;
      name: "InsufficientFunds";
      msg: "Insufficient funds";
    },
    {
      code: 2;
      name: "InvalidMint";
      msg: "Invalid Mint";
    },
    {
      code: 3;
      name: "MintMismatch";
      msg: "Account not associated with this Mint";
    },
    {
      code: 4;
      name: "OwnerMismatch";
      msg: "Owner does not match";
    },
    {
      code: 5;
      name: "FixedSupply";
      msg: "Fixed supply";
    },
    {
      code: 6;
      name: "AlreadyInUse";
      msg: "Already in use";
    },
    {
      code: 7;
      name: "InvalidNumberOfProvidedSigners";
      msg: "Invalid number of provided signers";
    },
    {
      code: 8;
      name: "InvalidNumberOfRequiredSigners";
      msg: "Invalid number of required signers";
    },
    {
      code: 9;
      name: "UninitializedState";
      msg: "State is unititialized";
    },
    {
      code: 10;
      name: "NativeNotSupported";
      msg: "Instruction does not support native tokens";
    },
    {
      code: 11;
      name: "NonNativeHasBalance";
      msg: "Non-native account can only be closed if its balance is zero";
    },
    {
      code: 12;
      name: "InvalidInstruction";
      msg: "Invalid instruction";
    },
    {
      code: 13;
      name: "InvalidState";
      msg: "State is invalid for requested operation";
    },
    {
      code: 14;
      name: "Overflow";
      msg: "Operation overflowed";
    },
    {
      code: 15;
      name: "AuthorityTypeNotSupported";
      msg: "Account does not support specified authority type";
    },
    {
      code: 16;
      name: "MintCannotFreeze";
      msg: "This token mint cannot freeze accounts";
    },
    {
      code: 17;
      name: "AccountFrozen";
      msg: "Account is frozen";
    },
    {
      code: 18;
      name: "MintDecimalsMismatch";
      msg: "The provided decimals value different from the Mint decimals";
    },
    {
      code: 19;
      name: "NonNativeNotSupported";
      msg: "Instruction does not support non-native tokens";
    }
  ];
};

export const IDL: SplToken = {
  version: "0.1.0",
  name: "spl_token",
  instructions: [
    {
      name: "initializeMint",
      accounts: [
        {
          name: "mint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "decimals",
          type: "u8",
        },
        {
          name: "mintAuthority",
          type: "publicKey",
        },
        {
          name: "freezeAuthority",
          type: {
            coption: "publicKey",
          },
        },
      ],
    },
    {
      name: "initializeAccount",
      accounts: [
        {
          name: "account",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "initializeMultisig",
      accounts: [
        {
          name: "account",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "m",
          type: "u8",
        },
      ],
    },
    {
      name: "transfer",
      accounts: [
        {
          name: "source",
          isMut: true,
          isSigner: false,
        },
        {
          name: "destination",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "approve",
      accounts: [
        {
          name: "source",
          isMut: true,
          isSigner: false,
        },
        {
          name: "delegate",
          isMut: false,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "revoke",
      accounts: [
        {
          name: "source",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: "setAuthority",
      accounts: [
        {
          name: "mint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "authorityType",
          type: "u8",
        },
        {
          name: "newAuthority",
          type: {
            coption: "publicKey",
          },
        },
      ],
    },
    {
      name: "mintTo",
      accounts: [
        {
          name: "mint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "to",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "burn",
      accounts: [
        {
          name: "source",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "closeAccount",
      accounts: [
        {
          name: "account",
          isMut: true,
          isSigner: false,
        },
        {
          name: "destination",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "freezeAccount",
      accounts: [
        {
          name: "account",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: "thawAccount",
      accounts: [
        {
          name: "account",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: "transferChecked",
      accounts: [
        {
          name: "source",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "destination",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "decimals",
          type: "u8",
        },
      ],
    },
    {
      name: "approveChecked",
      accounts: [
        {
          name: "source",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "delegate",
          isMut: false,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "decimals",
          type: "u8",
        },
      ],
    },
    {
      name: "mintToChecked",
      accounts: [
        {
          name: "mint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "to",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "decimals",
          type: "u8",
        },
      ],
    },
    {
      name: "burnChecked",
      accounts: [
        {
          name: "source",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "decimals",
          type: "u8",
        },
      ],
    },
    {
      name: "initializeAccount2",
      accounts: [
        {
          name: "account",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "authority",
          type: "publicKey",
        },
      ],
    },
    {
      name: "syncNative",
      accounts: [
        {
          name: "account",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "initializeAccount3",
      accounts: [
        {
          name: "account",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "authority",
          type: "publicKey",
        },
      ],
    },
    {
      name: "initializeMultisig2",
      accounts: [
        {
          name: "account",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "m",
          type: "u8",
        },
      ],
    },
    {
      name: "initializeMint2",
      accounts: [
        {
          name: "mint",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "decimals",
          type: "u8",
        },
        {
          name: "mintAuthority",
          type: "publicKey",
        },
        {
          name: "freezeAuthority",
          type: {
            coption: "publicKey",
          },
        },
      ],
    },
  ],
  accounts: [
    {
      name: "mint",
      type: {
        kind: "struct",
        fields: [
          {
            name: "mintAuthority",
            type: {
              coption: "publicKey",
            },
          },
          {
            name: "supply",
            type: "u64",
          },
          {
            name: "decimals",
            type: "u8",
          },
          {
            name: "isInitialized",
            type: "bool",
          },
          {
            name: "freezeAuthority",
            type: {
              coption: "publicKey",
            },
          },
        ],
      },
    },
    {
      name: "token",
      type: {
        kind: "struct",
        fields: [
          {
            name: "mint",
            type: "publicKey",
          },
          {
            name: "authority",
            type: "publicKey",
          },
          {
            name: "amount",
            type: "u64",
          },
          {
            name: "delegate",
            type: {
              coption: "publicKey",
            },
          },
          {
            name: "state",
            type: "u8",
          },
          {
            name: "isNative",
            type: {
              coption: "u64",
            },
          },
          {
            name: "delegatedAmount",
            type: "u64",
          },
          {
            name: "closeAuthority",
            type: {
              coption: "publicKey",
            },
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 0,
      name: "NotRentExempt",
      msg: "Lamport balance below rent-exempt threshold",
    },
    {
      code: 1,
      name: "InsufficientFunds",
      msg: "Insufficient funds",
    },
    {
      code: 2,
      name: "InvalidMint",
      msg: "Invalid Mint",
    },
    {
      code: 3,
      name: "MintMismatch",
      msg: "Account not associated with this Mint",
    },
    {
      code: 4,
      name: "OwnerMismatch",
      msg: "Owner does not match",
    },
    {
      code: 5,
      name: "FixedSupply",
      msg: "Fixed supply",
    },
    {
      code: 6,
      name: "AlreadyInUse",
      msg: "Already in use",
    },
    {
      code: 7,
      name: "InvalidNumberOfProvidedSigners",
      msg: "Invalid number of provided signers",
    },
    {
      code: 8,
      name: "InvalidNumberOfRequiredSigners",
      msg: "Invalid number of required signers",
    },
    {
      code: 9,
      name: "UninitializedState",
      msg: "State is unititialized",
    },
    {
      code: 10,
      name: "NativeNotSupported",
      msg: "Instruction does not support native tokens",
    },
    {
      code: 11,
      name: "NonNativeHasBalance",
      msg: "Non-native account can only be closed if its balance is zero",
    },
    {
      code: 12,
      name: "InvalidInstruction",
      msg: "Invalid instruction",
    },
    {
      code: 13,
      name: "InvalidState",
      msg: "State is invalid for requested operation",
    },
    {
      code: 14,
      name: "Overflow",
      msg: "Operation overflowed",
    },
    {
      code: 15,
      name: "AuthorityTypeNotSupported",
      msg: "Account does not support specified authority type",
    },
    {
      code: 16,
      name: "MintCannotFreeze",
      msg: "This token mint cannot freeze accounts",
    },
    {
      code: 17,
      name: "AccountFrozen",
      msg: "Account is frozen",
    },
    {
      code: 18,
      name: "MintDecimalsMismatch",
      msg: "The provided decimals value different from the Mint decimals",
    },
    {
      code: 19,
      name: "NonNativeNotSupported",
      msg: "Instruction does not support non-native tokens",
    },
  ],
};
