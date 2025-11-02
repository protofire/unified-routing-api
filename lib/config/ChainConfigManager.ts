import { ChainId } from '@uniswap/sdk-core';
import { RoutingType } from '../constants';

type CommonOverrides = {};

type IntentOverrides = {
  stdAuctionPeriodSecs?: number;
  deadlineBufferSecs?: number;
};

export type DutchOverrides = IntentOverrides & {
  forceOpenOrders?: boolean;
  priceImprovementBps?: number;
};

type RoutingTypeOverrides = Partial<{
  [RoutingType.DUTCH_LIMIT]: DutchOverrides & {
    largeAuctionPeriodSecs?: number;
  };
  [RoutingType.DUTCH_V2]: DutchOverrides & {
    priceBufferBps?: number; // used to shift the start and end price lower
  };
  [RoutingType.RELAY]: CommonOverrides & IntentOverrides;
  [RoutingType.CLASSIC]: CommonOverrides;
}>;

type ChainConfigType = {
  routingTypes: RoutingTypeOverrides;
  alarmEnabled: boolean;
};

export type ChainConfigMap = { [chainId: number]: ChainConfigType };
export type DependencyMap = { [routingType: string]: RoutingType[] };
type RouteChainMap = { [routingType: string]: number[] };

export abstract class ChainConfigManager {
  // Represents the other route dependencies for each route type
  // If a route is added in to the supported routingTypes for a chain,
  // this class will ensure all dependencies are present
  private static readonly _routeDependencies: { [routingType: string]: RoutingType[] } = {
    [RoutingType.DUTCH_LIMIT]: [RoutingType.CLASSIC],
    [RoutingType.DUTCH_V2]: [RoutingType.CLASSIC],
  };
  private static readonly _chainConfigs: ChainConfigMap = {
    [ChainId.MAINNET]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
        [RoutingType.RELAY]: {},
        [RoutingType.DUTCH_LIMIT]: {
          largeAuctionPeriodSecs: 120,
        },
        [RoutingType.DUTCH_V2]: {
          // 25 blocks from now
          // to cover time to sign, run secondary auction, and some blocks for decay
          deadlineBufferSecs: 300,
          priceBufferBps: 15,
        },
      },
      alarmEnabled: false,
    },
    [ChainId.OPTIMISM]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.OPTIMISM_GOERLI]: {
      // TODO: add back optimism GOERLI once we are sure routing api supports it
      routingTypes: {},
      alarmEnabled: false,
    },
    [ChainId.OPTIMISM_SEPOLIA]: {
      routingTypes: {},
      alarmEnabled: false,
    },
    [ChainId.ARBITRUM_ONE]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
        [RoutingType.DUTCH_V2]: {
          deadlineBufferSecs: 60,
        },
      },
      alarmEnabled: false,
    },
    [ChainId.ARBITRUM_GOERLI]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.ARBITRUM_SEPOLIA]: {
      routingTypes: {},
      alarmEnabled: false,
    },
    [ChainId.POLYGON]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
        [RoutingType.DUTCH_LIMIT]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.POLYGON_MUMBAI]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.GOERLI]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
        [RoutingType.DUTCH_LIMIT]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.GNOSIS]: {
      routingTypes: {},
      alarmEnabled: false,
    },
    [ChainId.SEPOLIA]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.CELO]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.CELO_ALFAJORES]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.BNB]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.AVALANCHE]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.BASE_GOERLI]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.BASE]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.BLAST]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.MOONBEAM]: {
      routingTypes: {},
      alarmEnabled: false,
    },
    [ChainId.ZORA]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.ZORA_SEPOLIA]: {
      routingTypes: {},
      alarmEnabled: false,
    },
    [ChainId.ROOTSTOCK]: {
      routingTypes: {},
      alarmEnabled: false,
    },
    [ChainId.ZKSYNC]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.ABSTRACT_TESTNET]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.ZERO]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.BOB]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.CYBER]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.SHAPE]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.INK]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.REDSTONE]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.REDSTONE_GARNET]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.ABSTRACT_MAINNET]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.ANIME]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.ANIME_TESTNET]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.MODE]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.FLOW_TESTNET]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.FLOW_MAINNET]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
    [ChainId.BASE_SEPOLIA]: {
      routingTypes: {
        [RoutingType.CLASSIC]: {},
      },
      alarmEnabled: false,
    },
  };

  private static _performedDependencyCheck = false;
  private static _chainsByRoutingType: RouteChainMap;

  /**
   * Checks for dependencies and throws an error if any are missing
   */
  static get chainConfigs(): ChainConfigMap {
    if (!ChainConfigManager._performedDependencyCheck) {
      for (const dependencyMapping in ChainConfigManager._routeDependencies) {
        for (const dependency of ChainConfigManager._routeDependencies[dependencyMapping]) {
          for (const chainId in ChainConfigManager._chainConfigs) {
            let dependentPresent = false;
            let dependencyPresent = false;
            for (const supportedRoutingType in ChainConfigManager._chainConfigs[chainId].routingTypes) {
              dependentPresent = dependentPresent || supportedRoutingType == dependencyMapping;
              dependencyPresent = dependencyPresent || supportedRoutingType == dependency;
            }
            // If we have the dependent but not the dependency, fail fast
            if (dependentPresent && !dependencyPresent) {
              throw new Error(
                `ChainId ${chainId} has routingType ${dependencyMapping} but missing dependency ${dependency}`
              );
            }
          }
        }
      }
    }
    ChainConfigManager._performedDependencyCheck = true;
    return ChainConfigManager._chainConfigs;
  }

  static get chainsByRoutingType(): { [routingType: string]: number[] } {
    if (ChainConfigManager._chainsByRoutingType) {
      return ChainConfigManager._chainsByRoutingType;
    }
    ChainConfigManager._chainsByRoutingType = {};
    for (const chainId in ChainConfigManager.chainConfigs) {
      for (const supportedRoutingType in ChainConfigManager.chainConfigs[chainId].routingTypes) {
        if (!ChainConfigManager._chainsByRoutingType[supportedRoutingType]) {
          ChainConfigManager._chainsByRoutingType[supportedRoutingType] = [];
        }
        ChainConfigManager._chainsByRoutingType[supportedRoutingType].push(parseInt(chainId));
      }
    }
    return ChainConfigManager._chainsByRoutingType;
  }

  /**
   * @returns all ChainIds that support some routingTypes
   */
  public static getChainIds(): ChainId[] {
    return Object.keys(ChainConfigManager.chainConfigs)
      .map((c) => Number.parseInt(c))
      .filter((chainId) => Object.keys(ChainConfigManager.chainConfigs[chainId].routingTypes).length > 0);
  }

  /**
   * @param routingType The RoutingType to check
   * @returns all chains that support given RoutingType
   */
  public static getChainIdsByRoutingType(routingType: RoutingType): ChainId[] {
    return ChainConfigManager.chainsByRoutingType[routingType] || [];
  }

  /**
   * @param alarmEnabled Alarms set or not
   * @returns all chains that have the given alarm setting
   */
  public static getAlarmedChainIds(): ChainId[] {
    const chainIds: ChainId[] = [];
    for (const chainId in ChainConfigManager.chainConfigs) {
      if (ChainConfigManager.chainConfigs[chainId].alarmEnabled) {
        chainIds.push(Number.parseInt(chainId));
      }
    }
    return chainIds;
  }

  /**
   * @param chainId the ChainId to check
   * @param routingType the RoutingType to check
   * @returns true when ChainId supports provided RoutingType
   */
  public static chainSupportsRoutingType(chainId: ChainId, routingType: RoutingType) {
    return (
      chainId in ChainConfigManager.chainConfigs &&
      ChainConfigManager.chainConfigs[chainId].routingTypes[routingType] !== undefined
    );
  }

  /**
   * @param chainId the ChainId to check
   * @param routingType the RoutingType to check
   * @returns the QuoteConfig for the provided ChainId and RoutingType
   */
  public static getQuoteConfig<T extends RoutingType>(
    chainId: ChainId,
    routingType: T
  ): Exclude<RoutingTypeOverrides[T], undefined> {
    if (!(chainId in ChainConfigManager.chainConfigs)) {
      throw new Error(`Unexpected chainId ${chainId}`);
    }

    const quoteConfig = ChainConfigManager.chainConfigs[chainId].routingTypes[routingType];
    if (!quoteConfig) {
      throw new Error(`Routing type ${routingType} not supported on chain ${chainId}`);
    }
    return quoteConfig as Exclude<RoutingTypeOverrides[T], undefined>;
  }
}
