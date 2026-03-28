import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Addon, Category, MenuItem, Order, OrderItem } from "../backend";
import { useActor } from "./useActor";

export function useGetCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMenuItems() {
  const { actor, isFetching } = useActor();
  return useQuery<MenuItem[]>({
    queryKey: ["menuItems"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMenuItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrders();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

export function useGetAddons() {
  const { actor, isFetching } = useActor();
  return useQuery<Addon[]>({
    queryKey: ["addons"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAddons();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddAddon() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation<
    bigint,
    Error,
    { name: string; price: number; menuItemId: bigint | null }
  >({
    mutationFn: async ({ name, price, menuItemId }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addAddon(name, price, menuItemId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["addons"] });
    },
  });
}

export function useDeleteAddon() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation<void, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteAddon(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["addons"] });
    },
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation<
    bigint,
    Error,
    {
      mobileNumber: string;
      carModel: string;
      carColour: string;
      carNumber: string;
      items: OrderItem[];
    }
  >({
    mutationFn: async ({
      mobileNumber,
      carModel,
      carColour,
      carNumber,
      items,
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.placeOrder(
        mobileNumber,
        carModel,
        carColour,
        carNumber,
        items,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useAppendToOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation<void, Error, { orderId: bigint; items: OrderItem[] }>({
    mutationFn: async ({ orderId, items }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.appendToOrder(orderId, items);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation<void, Error, { orderId: bigint; status: string }>({
    mutationFn: async ({ orderId, status }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useAddMenuItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation<
    bigint,
    Error,
    {
      name: string;
      description: string;
      price: number;
      categoryId: bigint;
      available: boolean;
    }
  >({
    mutationFn: async ({ name, description, price, categoryId, available }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addMenuItem(name, description, price, categoryId, available);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
}

export function useUpdateMenuItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation<
    void,
    Error,
    {
      id: bigint;
      name: string;
      description: string;
      price: number;
      categoryId: bigint;
      available: boolean;
    }
  >({
    mutationFn: async ({
      id,
      name,
      description,
      price,
      categoryId,
      available,
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateMenuItem(
        id,
        name,
        description,
        price,
        categoryId,
        available,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
}

export function useDeleteMenuItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation<void, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteMenuItem(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
}

export function useAddCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation<bigint, Error, string>({
    mutationFn: async (name) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addCategory(name);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation<void, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteCategory(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPaymentSettings() {
  const { actor, isFetching } = useActor();
  return useQuery<[string, string]>({
    queryKey: ["paymentSettings"],
    queryFn: async () => {
      if (!actor) return ["", ""];
      return (actor as any).getPaymentSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetPaymentSettings() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation<void, Error, { phonepe: string; paytm: string }>({
    mutationFn: async ({ phonepe, paytm }) => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as any).setPaymentSettings(phonepe, paytm);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["paymentSettings"] });
    },
  });
}
