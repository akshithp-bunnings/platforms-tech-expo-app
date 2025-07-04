import React, { useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { event } from 'nextjs-google-analytics';
import { CustomCursorHover, CustomCursorState } from './CustomCursor';
import { useParamOnLoad } from './useParamOnLoad';
import { useSceneController } from './SceneController';
import MailIconSvg from './svg/MailIconSvg';
import ComputerIcon from './svg/ComputerIcon'
import { useChangingColorPalette } from './useChangingColorPalette';
import { useDelayedBoolean } from './useDelayedBoolean';
import LinkedInIconSvg from './svg/LinkedInIconSvg';
import TwitterIconSvg from './svg/TwitterIconSvg';

// const availablity = 'available Q4';

const ctas = [
  'infra magic loading...',
  'ask us about pipelines 🛠️',
  '99.999% uptime... probably',
  'we speak YAML fluently',
  'terraform apply —all ❤️',
  'SREs hate this one trick!',
  'certs auto-renewed ✅',
  'zero downtime, big flex',
  'alert fatigue? never heard of her',
  'kubectl get coffee ☕',
  'runbook says hi 👋',
  'CI/CD? More like Cya bugs!',
  'infra as code = peace of mind',
  'one script to rule them all',
  'restarting pods since 2021',
  '🎯 aim for idempotence',
  'git push --force 🤫',
  'ping us, we’re alive',
  'devs break things, we fix them',
  'supporting squads silently 😎',
];

export const useShowCtas = () => {
  const { scene } = useSceneController();
  return scene !== 'project-open' && scene !== 'intro' && scene !== 'start';
};

const SocialLink = ({
  IconSvg,
  showCTAs,
  title,
  href,
  onFocus,
  onBlur,
  cursor,
}: {
  IconSvg: typeof MailIconSvg;
  showCTAs: boolean;
  title: string;
  href: string;
  onFocus: () => void;
  onBlur: () => void;
  cursor: CustomCursorState;
}) => (
  <CustomCursorHover cursor={cursor}>
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block"
      tabIndex={showCTAs ? 0 : -1}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={() => {
        event('cta', {
          type: `social-${title.toLowerCase()}`,
          location: 'bottom-nav',
        });
      }}
    >
      <IconSvg className="w-[2em] h-[1.625em]" />
      <span className="sr-only">{title}</span>
    </a>
  </CustomCursorHover>
);

export const CTA = () => {
  const showStats = useParamOnLoad('stats') === 'true';
  const showCTAs = useShowCtas();

  const [ctaIndex, setCtaIndex] = useState(0);
  useInterval(() => {
    if (!showCTAs) return;
    setCtaIndex((i) => (i + 1) % ctas.length);
  }, 3000);

  const defaultSpeed = 5000;
  const fastSpeed = 400;
  const [colorSpeed, setColorSpeed] = useState(defaultSpeed);
  const { bgColor, textColor } = useChangingColorPalette(colorSpeed);

  const [hover, setHover] = useState(false);

  // const [showBg, setShowBg] = useState(false);
  const showBg = useDelayedBoolean(hover, null, 1000);

  const onFocus = () => {
    setColorSpeed(fastSpeed);
    setHover(true);
  };
  const onBlur = () => {
    setColorSpeed(defaultSpeed);
    setHover(false);
  };
  // useInterval;
  return (
    <>
      <style>
        {hover &&
          `
          body {
            background: black !important;
          }
        `}
      </style>
      {showBg && (
        <div
          className="top-0 left-0 fixed w-full h-full overflow-hidden z-[-1] text-[2vw] font-mono text-white break-all opacity-30"
          aria-hidden
        >
          {new Array(2000).fill(null).map(() => 'hi!')}
        </div>
      )}
    </>
  );
};
