import { BaseClient } from "../client";
import { Snowflake } from "..";

/**
 * A generic constructor type.
 * Represents a class constructor that produces instances of type `T`.
 */
type Constructor<T> = new (...args: any[]) => T;

/**
 * Represents data with a unique Snowflake ID.
 * Used as a constraint to ensure all managed objects have an `id`.
 */
export type DataType = { id: Snowflake };

/**
 * Interface for a generic data manager.
 * Defines the common methods required by all data managers.
 */
export interface IBaseDataManager<T> {
  getClient(): BaseClient;
  getCache(): Map<Snowflake, T>;
  resolve(idOrInstance: Snowflake | T): T | null;
  resolveId(idOrInstance: Snowflake | T): Snowflake | null;
}


/**
 * Abstract class implementing basic data management operations.
 * It provides caching, resolution, and common access to the client and data instances.
 *
 * @template T - The type of objects managed by this class, must extend DataType.
 */
export abstract class BaseDataManager<T extends DataType> implements IBaseDataManager<T> {
  public readonly client: BaseClient;
  protected readonly dataInstantiator: Constructor<T>;
  private readonly _cache: Map<Snowflake, T>;

  /**
   * Creates a new DataManager.
   * 
   * @param client - The WebSocket client instance.
   * @param dataInstantiator - A class constructor to instantiate data entries.
   */
  constructor(client: BaseClient, dataInstantiator: Constructor<T>) {
    this.client = client;
    this.dataInstantiator = dataInstantiator;
    this._cache = new Map<Snowflake, T>();
  }

  /** Returns the client instance associated with this manager. */
  public getClient(): BaseClient {
    return this.client;
  }

  /** Returns the internal cache storing all managed entries. */
  public getCache(): Map<Snowflake, T> {
    return this._cache;
  }

  /** Getter for accessing the internal cache. */
  public get cache(): Map<Snowflake, T> {
    return this._cache;
  }

  /**
   * Resolves an object from the cache using either its instance or its ID.
   *
   * @param idOrInstance - The instance or the ID of the object to resolve.
   * @returns The resolved instance or null if not found.
   */
  public resolve(idOrInstance: Snowflake | T): T | null {
    // If the input is already an instance of T, return it directly.
    if (idOrInstance instanceof this.dataInstantiator) {
      return idOrInstance;
    }

    // Otherwise, treat it as an ID and attempt to retrieve it from the cache.
    if (typeof idOrInstance === 'string') {
      return this.cache.get(idOrInstance) ?? null;
    }

    return null;
  }

  /**
   * Resolves the ID from an object instance or returns the ID directly.
   *
   * @param idOrInstance - The instance or the ID of the object.
   * @returns The Snowflake ID or null if not resolvable.
   */
  public resolveId(idOrInstance: Snowflake | T): Snowflake | null {
    if (idOrInstance instanceof this.dataInstantiator) {
      return idOrInstance.id;
    }

    if (typeof idOrInstance === 'string') {
      return idOrInstance;
    }

    return null;
  }

  /** Returns the internal cache when the object is used in a primitive context. */
  public valueOf(): Map<Snowflake, T> {
    return this.cache;
  }
}



/**
 * A cached version of the DataManager which preloads and manages entries with automatic caching.
 *
 * @template T - The type of object being managed.
 */
export class CachedManager<T extends DataType> extends BaseDataManager<T> {
  /**
   * Creates a new CachedManager.
   *
   * @param client - The WebSocket client instance.
   * @param holds - The constructor for objects managed by this class.
   * @param iterable - Optional iterable to initialize the cache with data.
   */
  constructor(client: BaseClient, holds: Constructor<T>, iterable?: Iterable<T>) {
    super(client, holds);

    if (iterable) {
      for (const item of iterable) {
        this.add(item);
      }
    }
  }

  /**
   * Adds a new item to the manager (and optionally to the cache).
   *
   * @param data - The data to add.
   * @param params - An object containing additional parameters:
   *   - `id` (optional): The unique identifier for the item.
   *   - `extras` (optional): An array of extra data associated with the item (default: empty array).
   *   - `cache` (optional): Whether to store the item in the internal cache (default: `true`).
   *
   * @returns The instance of the managed data, or `null` if addition failed.
   */
  protected add(
    data: T,
    params: any = {}
  ): T | null {
    // { id?: Snowflake; extras?: any[]; cache?: boolean } = {}
    const { id, extras = [], cache = true } = params;

    const dataId = id ?? data.id;
    const existing = this.cache.get(dataId);
    if (existing) {
      if (cache) {
        // Try to patch the existing object with new data if patch method is available.
        // TODO : USE patch method to update the existing object with new data. 
        return existing;
      }
      // Clone the existing object, patch the clone, and return it (without caching).
      // TODO : Use clone method to create a new instance of the existing object.
      const clone = null; //
      // TODO : Use patch method to update the clone with new data. 
      return clone ?? existing;
    }

    // If no object exists with the same ID, create a new instance.
    const entry = new this.dataInstantiator(this.client, data, ...extras);
    if (cache) this.cache.set(dataId, entry);
    return entry;
  }
}