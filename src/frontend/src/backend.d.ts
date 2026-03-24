import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface MenuItem {
    id: bigint;
    categoryId: bigint;
    name: string;
    description: string;
    available: boolean;
    price: number;
}
export interface OrderItem {
    name: string;
    addons: Array<OrderItemAddon>;
    quantity: bigint;
    price: number;
    menuItemId: bigint;
}
export interface Addon {
    id: bigint;
    name: string;
    price: number;
    menuItemId?: bigint;
}
export interface Order {
    id: bigint;
    tax: number;
    status: string;
    total: number;
    carModel: string;
    createdAt: bigint;
    mobileNumber: string;
    carColour: string;
    items: Array<OrderItem>;
    subtotal: number;
}
export interface Category {
    id: bigint;
    name: string;
}
export interface OrderItemAddon {
    name: string;
    addonId: bigint;
    price: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAddon(name: string, price: number, menuItemId: bigint | null): Promise<bigint>;
    addCategory(name: string): Promise<bigint>;
    addMenuItem(name: string, description: string, price: number, categoryId: bigint, available: boolean): Promise<bigint>;
    appendToOrder(orderId: bigint, newItems: Array<OrderItem>): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteAddon(id: bigint): Promise<void>;
    deleteCategory(id: bigint): Promise<void>;
    deleteMenuItem(id: bigint): Promise<void>;
    getAddons(): Promise<Array<Addon>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<Category>>;
    getMenuItems(): Promise<Array<MenuItem>>;
    getOrders(): Promise<Array<Order>>;
    getPaymentSettings(): Promise<[string, string]>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(mobileNumber: string, carModel: string, carColour: string, items: Array<OrderItem>): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setPaymentSettings(phonepe: string, paytm: string): Promise<void>;
    updateMenuItem(id: bigint, name: string, description: string, price: number, categoryId: bigint, available: boolean): Promise<void>;
    updateOrderStatus(orderId: bigint, status: string): Promise<void>;
}
