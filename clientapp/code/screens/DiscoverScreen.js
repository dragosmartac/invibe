import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, View} from "react-native";
import Swiper from "../profile/Swiper";
import UserProfile from "../profile/UserProfile";
import {connect} from "react-redux";
import Axios from "axios";
import {profileStatus} from "../profile/ProfileStatus";
import PROFILE_IMAGE_PLACEHOLDER from "../../assets/profile-image-placeholder.png";


class DiscoverScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profiles: [],
            loading: true,
            loadingNextProfiles: false,
            savedIndex: 0,
        }
    }

    httpDataToUserProfiles = (response) => {
        return JSON.parse(response.data).map(profile => {
            const profileImage = "profile_image" in profile ?
                {uri: `data:image/${profile.profile_image_extension};base64,${profile.profile_image}`} :
                PROFILE_IMAGE_PLACEHOLDER;

            return new UserProfile(profile.userId, profile.name, profile.short_description, profile.long_description, profileImage, [], profile.gender, profile.longitude, profile.latitude, profileStatus.Loaded, profileStatus.UNLOADED);
        });
    }

    componentDidMount() {
        Axios
            .get(`/profile/discover_profiles/`)
            .then(response => {
                const userProfiles = this.httpDataToUserProfiles(response);

                this.setState({
                    profiles: userProfiles,
                    loading: false,
                })
            })
            .catch(error => {
                console.log("Could not get user profiles rom server", error);
                this.setState({loading: false})
            });
    }

    approachingEndOfList = (savedIndex) => {
        if (!this.state.loadingNextProfiles) {
            this.setState({loadingNextProfiles: true});
            Axios
                .get(`/profile/discover_profiles/`)
                .then(response => {
                    const nextUserProfiles = this.httpDataToUserProfiles(response);

                    this.setState({
                        profiles: [...this.state.profiles.slice(savedIndex), ...nextUserProfiles],
                        loadingNextProfiles: false,
                        savedIndex: savedIndex,
                    })
                })
                .catch(error => {
                    console.log("Could not get user profiles rom server", error);
                    this.setState({loadingNextProfiles: false});
                });
        }
    }

    handleRight = (item) => {
        console.log("Liked", item.userId);
    }

    handleLeft = (item) => {
        console.log("Passed", item.userId);
    }

    render() {
        if (this.state.loading && !this.state.profiles.length) {
            return (<View style={styles.container}>
                <ActivityIndicator style={{alignSelf: "center"}} size="large" color={"#bababa"}/>
            </View>);
        }
        return (
            <View style={styles.container}>
                <Swiper
                    data={this.state.profiles}
                    onSwipeRight={this.handleRight}
                    onSwipeLeft={this.handleLeft}
                    approachingEndOfList={this.approachingEndOfList}
                    savedIndex={this.state.savedIndex}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    profiles: state.profile.profiles,
});

export default connect(mapStateToProps)(DiscoverScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
