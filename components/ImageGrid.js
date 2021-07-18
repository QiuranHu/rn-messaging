import { Image, StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import React from "react";
import Grid from "./Grid";
// import CameraRoll from "@react-native-community/cameraroll";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";

const keyExtractor = ({ uri }) => uri;

export default class ImageGrid extends React.Component {
  loading = false;
  cursor = null;
  static propTypes = {
    onPressImage: PropTypes.func,
  };

  static defaultProps = {
    onPressImage: () => {},
  };

  state = {
    images: [],
  };

  componentDidMount() {
    this.getImages();
  }

  getNextImages = () => {
    if (!this.cursor) return;
    this.getImages(this.cursor);
  };

  getImages = async (after) => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    if (this.loading) return;
    this.loading = true;
    if (status !== "granted") {
      console.log("Camera roll permission denied");
      return;
    }
    await MediaLibrary.getPermissionsAsync();
    const album = await MediaLibrary.getAlbumAsync("Camera");
    const results = await MediaLibrary.getAssetsAsync({
      album: album,
      first: 20,
      after,
    });

    // const results = await CameraRoll.getPhotos({
    //   first: 20,
    // });
    const loadedImages = results.assets;
    const hasNextPage = results.hasNextPage;
    const endCursor = results.endCursor;
    this.setState({ images: this.state.images.concat(loadedImages) }, () => {
      this.loading = false;
      this.cursor = hasNextPage ? endCursor : null;
    });
  };

  renderItem = ({ item: { uri }, size, marginTop, marginLeft }) => {
    const { onPressImage } = this.props;
    const style = {
      width: size,
      height: size,
      marginLeft,
      marginTop,
    };
    return (
      <TouchableOpacity
        key={uri}
        activeOpacity={0.75}
        onPress={() => onPressImage(uri)}
        style={style}
      >
        <Image source={{ uri }} style={styles.image} />
      </TouchableOpacity>
    );
  };

  render() {
    const { images } = this.state;
    return (
      <Grid
        data={images}
        renderItem={this.renderItem}
        keyExtractor={keyExtractor}
        onEndReached={this.getNextImages}
      />
    );
  }
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
});
