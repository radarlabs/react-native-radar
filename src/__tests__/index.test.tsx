type RadarNativeMock = {
  initialize: jest.Mock;
  initializeWithAuthToken: jest.Mock;
  locationEmitter?: jest.Mock;
  newInAppMessageEmitter?: jest.Mock;
  _setEventListenerCount?: jest.Mock;
};

const loadRadar = (
  newArchitecture: boolean,
  platform = "android",
  tracking = true
) => {
  jest.resetModules();
  require("react-native").Platform.OS = platform;

  const nativeModules =
    require("react-native/Libraries/BatchedBridge/NativeModules").default;
  const nativeRadar = nativeModules.RNRadar as RadarNativeMock;
  const order: string[] = [];
  const subscription = () => ({ remove: jest.fn(() => order.push("remove")) });
  nativeRadar._setEventListenerCount = tracking
    ? jest.fn((name, count) => order.push(name + ":" + count))
    : undefined;

  nativeRadar.initialize.mockImplementation(() => order.push("initialize"));
  nativeRadar.initializeWithAuthToken.mockImplementation(() =>
    order.push("initialize")
  );

  if (newArchitecture) {
    nativeRadar.locationEmitter = jest.fn(subscription);
    nativeRadar.newInAppMessageEmitter = jest.fn(() => {
      order.push("listener");
      return subscription();
    });
  } else {
    nativeRadar.locationEmitter = undefined;
    const NativeEventEmitter =
      require("react-native/Libraries/EventEmitter/NativeEventEmitter").default;
    NativeEventEmitter.mockImplementation(() => ({
      addListener: jest.fn(() => {
        order.push("listener");
        return subscription();
      }),
      removeListeners: jest.fn(),
      removeAllListeners: jest.fn(),
    }));
  }

  const { default: radar, addListener } = require("../index.native");
  return { nativeRadar, order, radar, addListener };
};

describe.each([
  ["initialize", (radar: any) => radar.initialize("prj_test_pk")],
  [
    "initializeWithAuthToken",
    (radar: any) => radar.initializeWithAuthToken("token"),
  ],
])("%s", (_name, initialize) => {
  it("registers the New Architecture listener before native initialization", () => {
    const { order, radar } = loadRadar(true);

    initialize(radar);

    expect(order).toEqual([
      "listener",
      "newInAppMessageEmitter:1",
      "initialize",
    ]);
  });

  it("preserves the Old Architecture listener ordering", () => {
    const { order, radar } = loadRadar(false);

    initialize(radar);

    expect(order).toEqual(["initialize", "listener"]);
  });

  it("preserves iOS delivery without negotiating counts", () => {
    const { order, radar, nativeRadar } = loadRadar(true, "ios");
    initialize(radar);
    expect(order).toEqual(["listener", "initialize"]);
    expect(nativeRadar._setEventListenerCount).not.toHaveBeenCalled();
  });

  it("supports older native binaries without the handshake", () => {
    const { order, radar } = loadRadar(true, "android", false);
    initialize(radar);
    expect(order).toEqual(["listener", "initialize"]);
  });

  it("replaces the default listener on repeated initialization", () => {
    const { order, radar } = loadRadar(true);
    initialize(radar);
    initialize(radar);
    expect(order).toEqual([
      "listener",
      "newInAppMessageEmitter:1",
      "initialize",
      "remove",
      "newInAppMessageEmitter:0",
      "listener",
      "newInAppMessageEmitter:1",
      "initialize",
    ]);
  });
});

it("counts subscriptions after installation and removes each only once", () => {
  const { addListener, order, nativeRadar } = loadRadar(true);
  const first = addListener("newInAppMessageEmitter", jest.fn());
  const second = addListener("newInAppMessageEmitter", jest.fn());
  first.remove();
  first.remove();
  second.remove();
  expect(order).toEqual([
    "listener",
    "newInAppMessageEmitter:1",
    "listener",
    "newInAppMessageEmitter:2",
    "remove",
    "newInAppMessageEmitter:1",
    "remove",
    "newInAppMessageEmitter:0",
  ]);
  expect(nativeRadar.newInAppMessageEmitter).toHaveBeenCalledTimes(2);
});

it("reports listener replacement without accumulating old subscriptions", () => {
  const { radar, nativeRadar } = loadRadar(true);
  radar.onLocationUpdated(jest.fn());
  radar.onLocationUpdated(jest.fn());
  radar.onLocationUpdated(null);
  expect(nativeRadar._setEventListenerCount?.mock.calls).toEqual([
    ["locationEmitter", 1],
    ["locationEmitter", 0],
    ["locationEmitter", 1],
    ["locationEmitter", 0],
  ]);
});
