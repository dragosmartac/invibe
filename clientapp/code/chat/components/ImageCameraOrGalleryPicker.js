import React, {Component} from 'react';
import {Icon} from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker';
import {connectActionSheet} from '@expo/react-native-action-sheet'
import {chatColour, chatSelectedColour} from "../styles/ChatsScreenStyles";
import ImageChatMessage from "../classes/messagesTypes/ImageChatMessage";

class ImageCameraOrGalleryPicker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            image: null
        }
    }

    launchCamera = async () => {
        try {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                quality: 0.5,
                base64: true,

            });
            if (!result.cancelled) {
                this.setState({image: result.uri});
            }
        } catch (E) {
            console.log(E);
        }
    };

    launchGallery = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                quality: 0.5,
                base64: true,
                allowsMultipleSelection: true,

            });
            if (!result.cancelled) {
                console.log(result.uri);
                this.setState({image: result.uri});
                this.props.onPress(new ImageChatMessage(result.uri, "right", this.props.receiverId));
            }
        } catch (E) {
            console.log(E);
        }
    };

    openActionSheetImagePicker = () => {
        const options = ['Camera', 'Gallery'];
        const cancelButtonIndex = 2;

        this.props.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex
            },
            buttonIndex => {
                if (buttonIndex === 0) {
                    this.launchCamera();
                } else if (buttonIndex === 1) {
                    this.launchGallery();
                }
            },
        );
    };


    render() {
        return (
            <Icon
                reverse
                name='camerao'
                type='antdesign'
                size={20}
                color={chatColour}
                onPress={this.openActionSheetImagePicker}
                underlayColor={chatSelectedColour}
            />
        )
    }
}

export default connectActionSheet(ImageCameraOrGalleryPicker);