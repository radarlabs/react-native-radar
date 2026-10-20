import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors } from "../theme";

type Props = {
  label: string;
  value: string;
  placeholder?: string;
  onSubmit: (value: string) => void;
};

// Labeled text field that commits on Return, like FieldEditor on iOS.
export default function FieldEditor({ label, value, placeholder, onSubmit }: Props) {
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          accessibilityLabel={label}
          style={styles.input}
          value={text}
          placeholder={placeholder}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onChangeText={setText}
          onSubmitEditing={() => onSubmit(text)}
        />
        {text.length > 0 && (
          <TouchableOpacity accessibilityLabel={`Clear ${label}`} onPress={() => setText("")}>
            <Text style={styles.clear}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  label: {
    fontSize: 13,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondaryFill,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
    color: colors.text,
  },
  clear: {
    color: colors.secondaryText,
    fontSize: 14,
    paddingLeft: 8,
  },
});
