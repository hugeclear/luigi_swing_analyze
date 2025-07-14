/// <reference types="vite/client" />

// Web Bluetooth API
interface Navigator {
  bluetooth?: {
    requestDevice(options?: RequestDeviceOptions): Promise<BluetoothDevice>;
  };
}

// Device Motion API
interface DeviceMotionEvent {
  acceleration: DeviceMotionEventAcceleration | null;
  accelerationIncludingGravity: DeviceMotionEventAcceleration | null;
  rotationRate: DeviceMotionEventRotationRate | null;
  interval: number;
}

// Device Orientation API
interface DeviceOrientationEvent extends Event {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
  absolute: boolean;
}
