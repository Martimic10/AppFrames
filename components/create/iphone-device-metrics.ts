/** App Store 6.7" screenshot ratio (1290 × 2796) — width / height. */
export const SCREEN_ASPECT = 9 / 19.5;

/** @deprecated Use SCREEN_ASPECT */
export const APP_STORE_SCREEN_RATIO = SCREEN_ASPECT;

/**
 * Device mockup bounds match the screenshot ratio so uploads sit flush with no
 * letterboxing.
 */
export const DEVICE_CHASSIS_ASPECT = SCREEN_ASPECT;

/** height ÷ width — use when computing pixel height from width (export pin). */
export const DEVICE_CHASSIS_HEIGHT_OVER_WIDTH = 1 / DEVICE_CHASSIS_ASPECT;
