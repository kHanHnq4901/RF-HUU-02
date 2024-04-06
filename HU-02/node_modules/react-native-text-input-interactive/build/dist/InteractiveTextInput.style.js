"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._textInputStyle = void 0;
const react_native_1 = require("react-native");
const { width: ScreenWidth } = react_native_1.Dimensions.get("screen");
exports._textInputStyle = (borderColor) => ({
    height: 50,
    width: ScreenWidth * 0.9,
    borderWidth: 1,
    paddingLeft: 16,
    borderRadius: 8,
    paddingRight: 16,
    borderColor: borderColor,
    justifyContent: "center",
    backgroundColor: "#eceef5",
    color: "#000",
});
exports.default = react_native_1.StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainerStyle: {
        right: 16,
        position: "absolute",
    },
    iconImageStyle: {
        height: 20,
        width: 20,
        tintColor: "#b5b9bb",
    },
});
//# sourceMappingURL=InteractiveTextInput.style.js.map