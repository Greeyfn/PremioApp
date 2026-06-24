export type Language = "en" | "fa";

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    start_param?: string;
  };
  version: string;
  platform: string;
  colorScheme: "light" | "dark";
  themeParams: Record<string, string>;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  BackButton: { show(): void; hide(): void; onClick(cb: () => void): void };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(): void;
    hideProgress(): void;
    onClick(cb: () => void): void;
    offClick(cb: () => void): void;
    setText(text: string): void;
    setParams(params: Record<string, unknown>): void;
  };
  ready(): void;
  expand(): void;
  close(): void;
  sendData(data: string): void;
  openLink(url: string): void;
  openTelegramLink(url: string): void;
  showPopup(params: {
    title?: string;
    message: string;
    buttons?: Array<{ id?: string; type: string; text?: string }>;
  }, callback?: (id: string) => void): void;
  showAlert(message: string, callback?: () => void): void;
  showConfirm(message: string, callback?: (confirmed: boolean) => void): void;
  showScanQrPopup(params: { text?: string }, callback?: (text: string) => boolean): void;
  closeScanQrPopup(): void;
  HapticFeedback: {
    impactOccurred(style: string): void;
    notificationOccurred(type: string): void;
    selectionChanged(): void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export type ProductPackage = {
  id: string;
  nameEn: string;
  nameFa: string;
  price: number;
};

export type ProductWithStock = {
  id: string;
  title: string;
  description: string;
  category: string;
  tag: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
  features?: string[];
  priceSuffix?: string;
  packages?: ProductPackage[];
};

export type OrderWithDetails = {
  id: string;
  productId: string;
  product: { title: string; imageUrl: string | null; category: string };
  quantity: number;
  price: number;
  status: string;
  deliveryContent: string | null;
  createdAt: string;
};

export type TransactionWithDetails = {
  id: string;
  type: string;
  status: string;
  amount: number;
  note: string | null;
  createdAt: string;
};
