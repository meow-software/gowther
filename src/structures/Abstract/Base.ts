import { IBaseClient } from "../../client";

/**
 * Interface representing the base structure of a data object.
 */
export interface IBaseData {
    /**
     * Creates a shallow clone of the current object.
     */
    clone(): this;

    /**
     * Applies a partial update (patch) to the object.
     * Meant to be overridden in subclasses.
     * 
     * @param data - The data to patch into the object.
     * @returns The patched data or any useful value.
     */
    patch(data: any): any;

    /**
     * Clones the object and applies an update (patch) to it.
     * 
     * @param data - The data to update the cloned object with.
     * @returns A new instance with the patched data.
     */
    update(data: any): this;

    /**
     * Returns the primitive value representation of the object.
     * Typically used for comparison or logging.
     */
    valueOf(): any;
}

/**
 * Abstract base class for data objects that interact with a client.
 * This class implements basic methods for cloning, patching, and updating.
 * 
 * @typeParam TClient - A type extending the IBaseClient interface.
 */
export abstract class BaseData<TClient extends IBaseClient> implements IBaseData {
    /**
     * The client instance that this data object uses.
     */
    protected client: TClient;

    /**
     * Constructs a new BaseData instance with a reference to the client.
     * 
     * @param client - The client instance used by the data object.
     */
    constructor(client: TClient) {
        this.client = client;
    }

    /**
     * Creates a shallow clone of the current object.
     * Useful for immutability and rollback scenarios.
     * 
     * @returns A new instance with the same properties.
     */
    clone(): this {
        return Object.assign(Object.create(this), this);
    }

    /**
     * Applies a patch to the data.
     * Should be overridden by child classes to modify internal state.
     * 
     * @param data - The data used for the patch.
     * @returns The input data (or transformed data if overridden).
     */
    patch(data: any) {
        return data;
    }

    /**
     * Updates the data by cloning the current instance,
     * applying the patch, and returning the new instance.
     * 
     * @param data - The data to be used for the update.
     * @returns A cloned and patched instance of the object.
     */
    update(data: any): this {
        const clone = this.clone();
        this.patch(data);
        return clone;
    } 

    /**
     * Returns a primitive value representation of the object.
     * By default, it returns the `id` property if it exists.
     * 
     * @returns The ID or identifier value of the object.
     */
    valueOf(): any {
        return (this as any).id;
    }
}
