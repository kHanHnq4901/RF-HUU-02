
package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;

// react-native-vector-icons
import com.oblador.vectoricons.VectorIconsPackage;
// @react-native-community/art
import com.reactnativecommunity.art.ARTPackage;
// @react-native-community/async-storage
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
// @react-native-community/datetimepicker
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;
// @react-native-community/geolocation
import com.reactnativecommunity.geolocation.GeolocationPackage;
// @react-native-community/netinfo
import com.reactnativecommunity.netinfo.NetInfoPackage;
// react-native-ble-manager
import it.innove.BleManagerPackage;
// react-native-bluetooth-status
import com.solinor.bluetoothstatus.RNBluetoothManagerPackage;
// react-native-exit-app
import com.github.wumke.RNExitApp.RNExitAppPackage;
// react-native-fs
import com.rnfs.RNFSPackage;
// react-native-gesture-handler
import com.swmansion.gesturehandler.RNGestureHandlerPackage;
// react-native-image-picker
import com.imagepicker.ImagePickerPackage;
// react-native-keep-awake
import com.corbt.keepawake.KCKeepAwakePackage;
// react-native-keychain
import com.oblador.keychain.KeychainPackage;
// react-native-location-enabler
import com.reactnativelocationenabler.LocationEnablerPackage;
// react-native-maps
import com.rnmaps.maps.MapsPackage;
// react-native-permissions
import com.zoontek.rnpermissions.RNPermissionsPackage;
// react-native-reanimated
import com.swmansion.reanimated.ReanimatedPackage;
// react-native-receive-sharing-intent
import com.reactnativereceivesharingintent.ReceiveSharingIntentPackage;
// react-native-safe-area-context
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
// react-native-screens
import com.swmansion.rnscreens.RNScreensPackage;
// react-native-sha256
import com.sha256lib.Sha256Package;
// react-native-share
import cl.json.RNSharePackage;
// react-native-snackbar
import com.azendoo.reactnativesnackbar.SnackbarPackage;
// react-native-sound-player
import com.johnsonsu.rnsoundplayer.RNSoundPlayerPackage;
// react-native-sqlite-storage
import org.pgsqlite.SQLitePluginPackage;
// react-native-svg
import com.horcrux.svg.SvgPackage;
// react-native-touch-id
import com.rnfingerprint.FingerprintAuthPackage;
// react-native-version-check
import io.xogus.reactnative.versioncheck.RNVersionCheckPackage;
// react-native-webview
import com.reactnativecommunity.webview.RNCWebViewPackage;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  private MainPackageConfig mConfig;

  public PackageList(ReactNativeHost reactNativeHost) {
    this(reactNativeHost, null);
  }

  public PackageList(Application application) {
    this(application, null);
  }

  public PackageList(ReactNativeHost reactNativeHost, MainPackageConfig config) {
    this.reactNativeHost = reactNativeHost;
    mConfig = config;
  }

  public PackageList(Application application, MainPackageConfig config) {
    this.reactNativeHost = null;
    this.application = application;
    mConfig = config;
  }

  private ReactNativeHost getReactNativeHost() {
    return this.reactNativeHost;
  }

  private Resources getResources() {
    return this.getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return this.getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.<ReactPackage>asList(
      new MainReactPackage(mConfig),
      new VectorIconsPackage(),
      new ARTPackage(),
      new AsyncStoragePackage(),
      new RNDateTimePickerPackage(),
      new GeolocationPackage(),
      new NetInfoPackage(),
      new BleManagerPackage(),
      new RNBluetoothManagerPackage(),
      new RNExitAppPackage(),
      new RNFSPackage(),
      new RNGestureHandlerPackage(),
      new ImagePickerPackage(),
      new KCKeepAwakePackage(),
      new KeychainPackage(),
      new LocationEnablerPackage(),
      new MapsPackage(),
      new RNPermissionsPackage(),
      new ReanimatedPackage(),
      new ReceiveSharingIntentPackage(),
      new SafeAreaContextPackage(),
      new RNScreensPackage(),
      new Sha256Package(),
      new RNSharePackage(),
      new SnackbarPackage(),
      new RNSoundPlayerPackage(),
      new SQLitePluginPackage(),
      new SvgPackage(),
      new FingerprintAuthPackage(),
      new RNVersionCheckPackage(),
      new RNCWebViewPackage()
    ));
  }
}
