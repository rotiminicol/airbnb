import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { WishlistItem } from "@shared/schema";

export function useWishlist() {
  const queryClient = useQueryClient();

  const { data: wishlist = [], isLoading } = useQuery<WishlistItem[]>({
    queryKey: ["/api/wishlist"],
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async (propertyId: number) => {
      const response = await apiRequest("POST", "/api/wishlist", { propertyId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (propertyId: number) => {
      const response = await apiRequest("DELETE", `/api/wishlist/${propertyId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
    },
  });

  const isInWishlist = (propertyId: number) => {
    return wishlist.some(item => item.propertyId === propertyId);
  };

  const toggleWishlist = (propertyId: number) => {
    if (isInWishlist(propertyId)) {
      removeFromWishlistMutation.mutate(propertyId);
    } else {
      addToWishlistMutation.mutate(propertyId);
    }
  };

  return {
    wishlist,
    isLoading,
    isInWishlist,
    toggleWishlist,
    isUpdating: addToWishlistMutation.isPending || removeFromWishlistMutation.isPending,
  };
}
