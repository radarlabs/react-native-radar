type RadarNativeMock = {
  initialize: jest.Mock;
  initializeWithAuthToken: jest.Mock;
  locationEmitter?: jest.Mock;
  newInAppMessageEmitter?: jest.Mock;
};

const loadRadar = (newArchitecture: boolean) => {
  jest.resetModules();

  const nativeModules =
    require("react-native/Libraries/BatchedBridge/NativeModules").default;
  const nativeRadar = nativeModules.RNRadar as RadarNativeMock;
  const order: string[] = [];
  const subscription = { remove: jest.fn() };

  nativeRadar.initialize.mockImplementation(() => order.push("initialize"));
  nativeRadar.initializeWithAuthToken.mockImplementation(() =>
    order.push("initialize")
  );

  if (newArchitecture) {
    nativeRadar.locationEmitter = jest.fn();
    nativeRadar.newInAppMessageEmitter = jest.fn(() => {
      order.push("listener");
      return subscription;
    });
  } else {
    nativeRadar.locationEmitter = undefined;
    const NativeEventEmitter =
      require("react-native/Libraries/EventEmitter/NativeEventEmitter").default;
    NativeEventEmitter.mockImplementation(() => ({
      addListener: jest.fn(() => {
        order.push("listener");
        return subscription;
      }),
      removeListeners: jest.fn(),
      removeAllListeners: jest.fn(),
    }));
  }

  const radar = require("../index.native").default;
  return { nativeRadar, order, radar };
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

    expect(order).toEqual(["listener", "initialize"]);
  });

  it("preserves the Old Architecture listener ordering", () => {
    const { order, radar } = loadRadar(false);

    initialize(radar);

    expect(order).toEqual(["initialize", "listener"]);
  });
});
