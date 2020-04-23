import React, {Component} from 'react';
import {Keyboard, ScrollView, View,} from 'react-native';
import {connect} from "react-redux";
import {addMessage, getChat} from "../../redux/actions/ChatAction";
import {chatInputStyles} from "../styles/ChatInputStyles";
import {ImageContent, MessageBox, TextContent} from "./MessageBox";
import {InputBar} from "./ChatInputBar";
import TextChatMessage from "../TextChatMessage";

class ChatView extends Component {

    constructor(props) {
        super(props);

        const receiverId = this.props.receiverId.toString();
        this.state = {
            messages: receiverId in this.props.all_ms ? this.props.all_ms[receiverId] : [],
            inputBarText: '',
        }
    }

    componentDidMount() {
        if (!(this.props.receiverId.toString() in this.props.all_ms)) {
            this.props.getChat(this.props.receiverId.toString());
        }
        setTimeout(() => this.scrollView.scrollToEnd());
    }

    static getDerivedStateFromProps(nextProps) {
        return {
            all_ms: nextProps.all_ms,
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const receiverId = this.props.receiverId.toString();
        if (receiverId in this.props.all_ms && this.props.all_ms[receiverId] !== this.state.messages) {
            this.setState({
                messages: this.props.all_ms[receiverId],
            });
            setTimeout(() => this.scrollView.scrollToEnd(), 20);
        }
    }

    _sendMessage() {
        const message = this.state.inputBarText;

        if (message) {
            this.props.addMessage(
                new TextChatMessage(
                    message,
                    "right",
                    this.props.receiverId)
            );

            this.setState({
                inputBarText: ''
            });

            Keyboard.dismiss()
        }
    }

    _onChangeInputBarText(text) {
        this.setState({
            inputBarText: text
        });
    }

    //This event fires way too often.
    //We need to move the last message up if the input bar expands due to the user's new message exceeding the height of the box.
    //We really only need to do anything when the height of the InputBar changes, but AutogrowInput can't tell us that.
    //The real solution here is probably a fork of AutogrowInput that can provide this information.
    _onInputSizeChange() {
        setTimeout(() => this.scrollView.scrollToEnd({animated: false}));
    }

    render() {

        const messages = [];

        this.state.messages.forEach((message, index) => {
            messages.push(
                <MessageBox key={index}
                            direction={message.direction}
                            text={message.text}
                            datetime={message.datetime}
                            sent={message.sent}
                            content={<TextContent text={message.text} direction={message.direction}/>}
                />
            );
        });
        messages.push(<MessageBox key={100}
                                  direction={"right"}
                                  text={""}
                                  datetime={new Date()}
                                  sent={true}
                                  content={<ImageContent key={1000}/>}
        />);

        return (
            <View style={chatInputStyles.outer}>
                <ScrollView
                    ref={(ref) => {
                        this.scrollView = ref
                    }}
                    style={chatInputStyles.messages}>
                    {messages}
                </ScrollView>
                <InputBar onSendPressed={() => this._sendMessage()}
                          onSizeChange={() => this._onInputSizeChange()}
                          onChangeText={(text) => this._onChangeInputBarText(text)}
                          text={this.state.inputBarText}/>
            </View>
        );
    }
}


const mapStateToProps = state => ({
    all_ms: state.chat.messages,
    ws: state.chat.webSocket,
    userId: state.auth.userId,
});


export default connect(mapStateToProps, {getChat, addMessage})(ChatView);

