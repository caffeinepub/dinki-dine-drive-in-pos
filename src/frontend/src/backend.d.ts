import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MenuItem {
    id: bigint;
    categoryId: bigint;
    name: string;
    description: string;
    available: boolean;
    price: number;
}
export interface Category {
    id: bigint;
    name: string;
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
export interface UserProfile {
    name: string;
}
export interface OrderItem {
    name: string;
    quantity: bigint;
    price: number;
    menuItemId: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCategory(name: string): Promise<bigint>;
    addMenuItem(name: string, description: string, price: number, categoryId: bigint, available: boolean): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteCategory(id: bigint): Promise<void>;
    deleteMenuItem(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<Category>>;
    getMenuItems(): Promise<Array<MenuItem>>;
    getOrders(): Promise<Array<Order>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(mobileNumber: string, carModel: string, carColour: string, items: Array<OrderItem>): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateMenuItem(id: bigint, name: string, description: string, price: number, categoryId: bigint, available: boolean): Promise<void>;
    updateOrderStatus(orderId: bigint, status: string): Promise<void>;
}
