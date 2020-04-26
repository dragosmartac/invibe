import {parseISOString, retrieveFromLocalStorage} from "./Utils";
import {messageType} from "../chat/classes/messagesTypes/ChatMessageTypes";
import TextChatMessage from "../chat/classes/messagesTypes/TextChatMessage";
import ImageChatMessage from "../chat/classes/messagesTypes/ImageChatMessage";

export async function retrieveMessage(key) {
    const value = await retrieveFromLocalStorage(
        key,
        "Could not retrieve message with unique key " + key + " from local storage."
    );

    if (!value) {
        return null;
    }

    switch (value.type) {
        case messageType.TEXT:
            return TextChatMessage.instanceFromDictionary(value);
        case messageType.IMAGE:
            return ImageChatMessage.instanceFromDictionary(value);
        default:
            console.log("Should not reach this point. Check retrieveMessage in ChatUtils.");
            return null;
    }
}

export function messageFromServerData(direction, data) {
    const messageArgs = [
        direction,
        direction === "left" ? data.sender : data.receiver,
        true,
        true,
        parseISOString(data.datetime),
        data.created_timestamp,
        data.id
    ];

    switch (data.message_type.toString()) {

        case "text_message":
            return new TextChatMessage(
                data.text,
                ...messageArgs
            );

        case "image_message":
            return new ImageChatMessage(
                data.image_extension,
                data.base64_content,
                ...messageArgs
            );

        default:
            console.log("Should not reach this point. Check retrieveMessage in ChatUtils.");
            return null;
    }
}