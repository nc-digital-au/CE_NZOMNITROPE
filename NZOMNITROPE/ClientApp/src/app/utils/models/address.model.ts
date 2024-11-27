import { AddressState, AddressType } from "../enums/ofev-data";

export interface Address 
{
    unitNumber?: string;
    streetAddress: string;
    city: string;
    postcode: string;
    addressState: AddressState | null;
    addressType: AddressType | null;
    deliveryInstructions?: string;
}
