import React from "react";
import {View, StyleSheet, Pressable, TouchableOpacity} from "react-native";
import Cross from "./Cross";

const Cell = (props) => {
    const { cell, onPress } = props;
    return (
        <TouchableOpacity activeOpacity={0.7}
            onPress={() => onPress()}
            style={styles.cell}
        >
            {cell === "O" && <View style={styles.circle} />}
            {cell === "X" && <Cross />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cell: {
        width: 100,
        height: 100,
        flex: 1,
    },
    circle: {
        flex: 1,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        margin: 10,

        borderWidth: 10,
        borderColor: "white",
    },
});

export default Cell;
