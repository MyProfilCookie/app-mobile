import clsx from "clsx";
import dayjs from "dayjs";
import { usePostHog } from "posthog-react-native";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getCreateSubscriptionSheetHeight } from "@/lib/create-subscription-sheet";
import { iconForSubscriptionName } from "@/lib/subscription-create";

type Props = {
  visible: boolean;
  /** Bas de la carte orange (coordonnée fenêtre) — le panneau commence ici. */
  sheetTopY?: number | null;
  onClose: () => void;
  onSubmit: (subscription: Subscription) => void;
};

type Frequency = "Mensuel" | "Annuel";
type Category =
  | "Divertissement"
  | "Outils IA"
  | "Outils dev"
  | "Design"
  | "Productivité"
  | "Autre";

const CATEGORIES: Category[] = [
  "Divertissement",
  "Outils IA",
  "Outils dev",
  "Design",
  "Productivité",
  "Autre",
];

const CATEGORY_COLORS: Record<Category, string> = {
  Divertissement: "#ff6b6b",
  "Outils IA": "#b8d4e3",
  "Outils dev": "#e8def8",
  Design: "#f5c542",
  Productivité: "#95e1d3",
  Autre: "#d4d4d4",
};

function isValidPrice(price: string): boolean {
  const trimmedPrice = price.trim().replace(",", ".");
  if (!trimmedPrice) return false;
  if (!/^\s*[+-]?(\d+(\.\d+)?|\.\d+)\s*$/.test(trimmedPrice)) return false;
  const numValue = Number(trimmedPrice);
  return Number.isFinite(numValue) && numValue > 0;
}

export default function CreateSubscriptionModal({
  visible,
  sheetTopY,
  onClose,
  onSubmit,
}: Props) {
  const posthog = usePostHog();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const fallbackTop =
    windowHeight -
    getCreateSubscriptionSheetHeight(windowHeight, insets.top);
  const sheetTop = sheetTopY ?? fallbackTop;
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("Mensuel");
  const [category, setCategory] = useState<Category>("Autre");

  const isValidForm = name.trim() !== "" && isValidPrice(price);

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Mensuel");
    setCategory("Autre");
  };

  const dismissKeyboard = () => Keyboard.dismiss();

  const handleClose = () => {
    dismissKeyboard();
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!isValidForm) return;
    dismissKeyboard();

    const trimmedName = name.trim();
    const priceValue = Number(price.trim().replace(",", "."));
    const now = dayjs();
    const renewalDate =
      frequency === "Mensuel" ? now.add(1, "month") : now.add(1, "year");

    const newSubscription: Subscription = {
      id: `sub-${Date.now()}`,
      name: trimmedName,
      price: priceValue,
      currency: "EUR",
      billing: frequency,
      category,
      status: "active",
      startDate: now.toISOString(),
      renewalDate: renewalDate.toISOString(),
      icon: iconForSubscriptionName(trimmedName),
      color: CATEGORY_COLORS[category],
      plan: frequency === "Annuel" ? "Accès annuel" : "Forfait mensuel",
      paymentMethod: "À définir",
    };

    onSubmit(newSubscription);

    posthog.capture("subscription_created", {
      subscription_name: trimmedName,
      subscription_price: priceValue,
      subscription_frequency: frequency,
      subscription_category: category,
    });

    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        <Pressable className="modal-overlay" onPress={handleClose}>
          <Pressable
            className="modal-container"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: sheetTop,
              bottom: 0,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <Pressable className="modal-header" onPress={dismissKeyboard}>
              <Text className="modal-title">Nouvel abonnement</Text>
              <Pressable className="modal-close" onPress={handleClose}>
                <Text className="modal-close-text">✕</Text>
              </Pressable>
            </Pressable>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <TouchableWithoutFeedback
                onPress={dismissKeyboard}
                accessible={false}
              >
                <View
                  style={{
                    gap: 20,
                    padding: 20,
                    paddingBottom: Math.max(insets.bottom, 16) + 20,
                  }}
                >
              <View className="auth-field">
                <Text className="auth-label">Nom</Text>
                <TextInput
                  className="auth-input"
                  placeholder="Nom de l'abonnement"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Prix</Text>
                <TextInput
                  className="auth-input"
                  placeholder="0,00"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Fréquence</Text>
                <View className="picker-row">
                  {(["Mensuel", "Annuel"] as Frequency[]).map((f) => (
                    <Pressable
                      key={f}
                      className={clsx(
                        "picker-option",
                        frequency === f && "picker-option-active"
                      )}
                      onPress={() => {
                        dismissKeyboard();
                        setFrequency(f);
                      }}
                    >
                      <Text
                        className={clsx(
                          "picker-option-text",
                          frequency === f && "picker-option-text-active"
                        )}
                      >
                        {f}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Catégorie</Text>
                <View className="category-scroll">
                  {CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat}
                      className={clsx(
                        "category-chip",
                        category === cat && "category-chip-active"
                      )}
                      onPress={() => {
                        dismissKeyboard();
                        setCategory(cat);
                      }}
                    >
                      <Text
                        className={clsx(
                          "category-chip-text",
                          category === cat && "category-chip-text-active"
                        )}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <Pressable
                className="modal-submit-button"
                accessibilityState={{ disabled: !isValidForm }}
                onPress={handleSubmit}
              >
                <Text
                  className="modal-submit-button-text"
                  style={{ fontFamily: "sans-extrabold" }}
                >
                  Créer l'abonnement
                </Text>
              </Pressable>
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
