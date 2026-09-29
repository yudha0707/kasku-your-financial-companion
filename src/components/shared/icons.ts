import {
  Baby, Banknote, Briefcase, Car, CircleEllipsis, Coffee, CreditCard, Dumbbell, Film, Gift,
  GraduationCap, HeartPulse, Home, Landmark, Laptop, PiggyBank, Plane, Receipt, Shirt,
  ShoppingBag, Smartphone, Store, TrendingUp, Utensils, Wallet, Wifi, ArrowLeftRight, type LucideIcon,
} from "lucide-react";
import type { ColorKey } from "@/types";

export const ICONS: Record<string, LucideIcon> = {
  briefcase: Briefcase, gift: Gift, laptop: Laptop, store: Store, "trending-up": TrendingUp,
  "circle-ellipsis": CircleEllipsis, utensils: Utensils, car: Car, "shopping-bag": ShoppingBag,
  receipt: Receipt, "graduation-cap": GraduationCap, "heart-pulse": HeartPulse, film: Film,
  home: Home, wifi: Wifi, coffee: Coffee, plane: Plane, shirt: Shirt, baby: Baby, dumbbell: Dumbbell,
  landmark: Landmark, banknote: Banknote, smartphone: Smartphone, "piggy-bank": PiggyBank,
  wallet: Wallet, "credit-card": CreditCard, transfer: ArrowLeftRight,
};

export const CATEGORY_ICON_CHOICES = [
  "utensils", "car", "shopping-bag", "receipt", "graduation-cap", "heart-pulse", "film", "home",
  "wifi", "coffee", "plane", "shirt", "baby", "dumbbell", "briefcase", "gift", "laptop", "store",
  "trending-up", "circle-ellipsis",
];
export const ACCOUNT_ICON_CHOICES = ["landmark", "banknote", "smartphone", "piggy-bank", "wallet", "credit-card"];

export const COLOR_CHOICES: ColorKey[] = [
  "emerald", "green", "teal", "sky", "blue", "indigo", "violet", "pink", "red", "orange", "amber", "slate",
];

export const colorVar = (c: string) => `var(--cat-${c})`;
