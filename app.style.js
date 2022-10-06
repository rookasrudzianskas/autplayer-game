import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#242D34",
    },
    bg: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",

        paddingTop: 15,
    },
    map: {
        width: "80%",
        aspectRatio: 1,
    },
    row: {
        flex: 1,
        flexDirection: "row",
    },
    buttons: {
        position: "absolute",
        bottom: 50,
        flexDirection: "row",
    },
    button: {
        color: "white",
        margin: 5,
        fontSize: 16,
        backgroundColor: "#191F24",
        padding: 10,
        paddingHorizontal: 15,
    },
});
