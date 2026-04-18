import React, { forwardRef, useImperativeHandle } from "react";
import { StyleSheet, Text, View } from "react-native";

export type PdfRef = {
  setPage(pageNumber: number): void;
};

type Props = {
  style?: object;
  source?: { uri?: string; cache?: boolean };
  fitPolicy?: number;
  enablePaging?: boolean;
  horizontal?: boolean;
  onLoadComplete?: (numberOfPages: number) => void;
  onPageChanged?: (page: number, numberOfPages: number) => void;
};

const BookPdf = forwardRef<PdfRef, Props>((props, ref) => {
  useImperativeHandle(ref, () => ({
    setPage: () => {},
  }));

  return (
    <View style={[styles.wrap, props.style]}>
      <Text style={styles.title}>PDF tarayıcıda yok</Text>
      <Text style={styles.body}>
        Bu kitap PDF olarak paketlenmiştir. Tam okuma için iOS veya Android uygulamasını kullanın.
      </Text>
    </View>
  );
});

BookPdf.displayName = "BookPdf";

export default BookPdf;

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#0a0b10",
  },
  title: { color: "rgba(255,255,255,0.85)", fontSize: 17, fontWeight: "800", marginBottom: 10, textAlign: "center" },
  body: { color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 22, textAlign: "center", maxWidth: 320 },
});
