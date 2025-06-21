/* eslint-disable no-console */
import { useTimeout } from 'usehooks-ts';
import { useIsProbablySafari } from './useIsProbablySafari';

export const useConsoleLogDevSignature = () => {
  const isSafari = useIsProbablySafari();
  const sizeStyle = `font-size: 20px;  ${isSafari ? '' : 'display:inline-block; padding: 10px;'}`;
  const style = `color: white; background: blue; font-family:monospace; ${sizeStyle}`;
  const log = (text: string) => console.log(`%c${text.toUpperCase()}`, style);
};
