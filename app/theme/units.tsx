import { Dimensions } from "react-native"

export const units = {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
}

const defaultValues = {
    height: 720,
    width: 360
}

export const getRH = (number: number) => {
    return (number * units.height) / defaultValues.height
}

export const getRW = (number: number) => {
    return (number * units.width) / defaultValues.width
}

