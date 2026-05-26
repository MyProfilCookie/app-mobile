import clsx from "clsx";
import { usePostHog } from "posthog-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  buildSubscriptionFromForm,
  SUBSCRIPTION_CATEGORIES,
  SUBSCRIPTION_FREQUENCIES,
  type SubscriptionCategory,
  type SubscriptionFrequency,
} from "@/lib/subscription-create";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (subscription: Subscription) => void;
};

const INITIAL_CATEGORY: SubscriptionCategory = "Divertissement";
const INITIAL_FREQUENCY: SubscriptionFrequency = "Mensuel";

export default function CreateSubscriptionModal({
  visible,
  onClose,
  onSubmit,
}: Props) {
  const posthog = usePostHog();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] =
    useState<SubscriptionFrequency>(INITIAL_FREQUENCY);
  const [category, setCategory] =
    useState<SubscriptionCategory>(INITIAL_CATEGORY);

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency(INITIAL_FREQUENCY);
    setCategory(INITIAL_CATEGORY);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    const trimmedName = name.trim();
    const parsedPrice = Number.parseFloat(price.replace(",", "."));
    if (!trimmedName || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      return;
    }

    const subscription = buildSubscriptionFromForm({
      name: trimmedName,
      price: parsedPrice,
      frequency,
      category,
    });

    posthog.capture("subscription_created", {
      subscription_name: subscription.name,
      subscription_price: subscription.price,
      subscription_frequency: frequency,
      subscription_category: category,
    });

    onSubmit(subscription);
    resetForm();
    onClose();
  };

  const canSubmit =
    name.trim().length > 0 &&
    price.trim().length > 0 &&
    Number.parseFloat(price.replace(",", ".")) > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <Pressable className="modal-overlay" onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-end"
        >
          <Pressable
            className="modal-container"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="modal-header">
              <Text className="modal-title">Nouvel abonnement</Text>
              <Pressable
                className="modal-close"
                onPress={handleClose}
                accessibilityLabel="Fermer"
              >
                <Text className="modal-close-text">×</Text>
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="modal-body">
                <View className="auth-field">
                  <Text className="auth-label">Nom</Text>
                  <TextInput
                    className="auth-input"
                    value={name}
                    onChangeText={setName}
                    placeholder="Spotify, Netflix…"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    autoCapitalize="words"
                  />
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Prix</Text>
                  <TextInput
                    className="auth-input"
                    value={price}
                    onChangeText={setPrice}
                    placeholder="9,99"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    keyboardType="decimal-pad"
                  />
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Fréquence</Text>
                  <View className="picker-row">
                    {SUBSCRIPTION_FREQUENCIES.map((option) => (
                      <Pressable
                        key={option}
                        className={clsx(
                          "picker-option",
                          frequency === option && "picker-option-active"
                        )}
                        onPress={() => setFrequency(option)}
                      >
                        <Text
                          className={clsx(
                            "picker-option-text",
                            frequency === option && "picker-option-text-active"
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Catégorie</Text>
                  <View className="category-scroll">
                    {SUBSCRIPTION_CATEGORIES.map((option) => (
                      <Pressable
                        key={option}
                        className={clsx(
                          "category-chip",
                          category === option && "category-chip-active"
                        )}
                        onPress={() => setCategory(option)}
                      >
                        <Text
                          className={clsx(
                            "category-chip-text",
                            category === option && "category-chip-text-active"
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <Pressable
                  className={clsx(
                    "auth-button",
                    !canSubmit && "auth-button-disabled"
                  )}
                  onPress={handleSubmit}
                  disabled={!canSubmit}
                >
                  <Text className="auth-button-text">Créer l&apos;abonnement</Text>
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
